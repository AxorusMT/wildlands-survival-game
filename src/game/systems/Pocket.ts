import { clamp, dist } from '../../core/math.ts';
import { seededRandom } from '../../core/random.ts';
import type { Animal, GameResult, Structure } from '../../core/types.ts';
import { BUFFS } from '../../data/gear.ts';
import { itemName } from '../../data/items.ts';
import { LORE, MERCHANT_GOODS } from '../../data/lore.ts';
import { MOBS } from '../../data/mobs.ts';
import { COURSE } from '../../data/tutorial.ts';
import {
  MAX_TIER,
  REALMS,
  RW,
  tierName,
  templateOf,
  TIER_SCALE,
  AIR_SECONDS,
  COURSE_BRAMBLES,
  COURSE_HOLLOW,
  TRAINING,
  FEVER_BITES,
  FEVER_CHANCE,
  ashStorm,
  hymnAt,
  magmaLevel,
  seasonAt,
  sporeBloom,
  starPulse,
  modById,
  realmById,
  rollMods,
  setActiveRealm,
  activeRealm,
  tideLevel,
  ventActive,
  weighted,
  type EmberGeometry,
  type Loot,
  type MarchesGeometry,
  type UndertowGeometry,
  type OrchardGeometry,
  type RealmCtx,
  type RealmInstance,
} from '../../data/realms/index.ts';
import { DIM_GAP } from '../../data/dimensions.ts';
import {
  POCKET,
  TILE,
  TILE_COLS,
  TILE_ROWS,
  baseTileAt,
  inPocket,
  surfaceAt,
  syncPocket,
} from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** What the expedition has done in each realm, kept for good. */
export interface RealmRecord {
  visits: number;
  /** Highest tier whose boss has fallen. */
  best: number;
  kills: number;
  relic: boolean;
}

/** Minutes an Unstable realm holds together. */
const UNSTABLE_SECONDS = 600;

/**
 * Generated realms. A Waystone and a realm key open an expedition: the realm is built from its
 * seed into the pocket strip east of the dimensions, furnished, and entered. It stays open until
 * another key is turned. Tier and modifiers scale its monsters, its loot, and its dangers.
 */
export class Pocket extends System {
  private caveInAt = 0;
  private caveIn: { x: number; y: number; at: number; kind?: 'shards' | 'star' } | null = null;
  /** Seconds of breath left in the Undertow. */
  breath = AIR_SECONDS;
  private drowningSaid = 0;
  private goldWas = -1;
  private magmaWas = false;
  private seasonWas = '';
  private bloomWas = false;
  private toxicWas = false;
  private hymnWas = false;
  private sunWas = false;
  private ventAt = 0;
  private stormWas = false;
  private submergedWas = false;
  private leaveAsked = -99;
  /** The latest arrival, for the interface's banner. */
  banner: { name: string; tier: number; mods: string[]; at: number } | null = null;

  inst(): RealmInstance | null {
    return this.game.s.pocket ?? null;
  }
  record(id: string): RealmRecord {
    const all = (this.game.s.realms ??= {});
    return (all[id] ??= { visits: 0, best: 0, kills: 0, relic: false });
  }
  /** Highest tier a realm can be opened at: one above the best cleared. */
  maxTier(id: string) {
    const next = this.record(id).best + 1;
    // The Fractured Realms go on for ever.
    return id === 'fractured' ? next : Math.min(MAX_TIER, next);
  }
  /** Whether the player (or a point) is inside the open realm. */
  here(x = this.game.s.player.x) {
    return !!this.game.s.pocket && inPocket(x);
  }
  has(mod: string) {
    return !!this.game.s.pocket?.mods.includes(mod);
  }

  // ─── Scaling ───────────────────────────────────────────────────────────────
  hpScale() {
    const i = this.inst();
    return i ? TIER_SCALE.hp(i.tier) * (i.mods.includes('fortified') ? 1.4 : 1) : 1;
  }
  /** Multiplier on harm the player takes inside the realm. */
  damageScale() {
    const i = this.inst();
    if (!i || !this.here()) return 1;
    return (
      TIER_SCALE.damage(i.tier) *
      (i.mods.includes('savage') ? 1.3 : 1) *
      Math.max(0.5, 1 - this.game.skills.get('tierHarm'))
    );
  }
  lootScale(x: number) {
    const i = this.inst();
    if (!i || !inPocket(x)) return 1;
    const sk = this.game.skills.stats();
    return (
      TIER_SCALE.loot(i.tier) +
      i.mods.reduce((n, m) => n + (modById(m)?.loot ?? 0), 0) +
      sk.realmLoot +
      (sk.treasureSense ? 0.2 : 0)
    );
  }
  /** Silent realms carry every sound: monsters notice you from further off. */
  sightScale(a: Animal) {
    return this.has('silent') && inPocket(a.x) ? 1.5 : 1;
  }
  speedScale(a: Animal) {
    return this.has('frenzied') && inPocket(a.x) ? 1.3 : 1;
  }
  /** Multiplier on food and water drain. */
  drainScale() {
    return this.has('hungering') && this.here() ? 1.5 : 1;
  }
  gravityScale() {
    // The Sunken Observatory is always light; Low gravity realms too.
    const light = this.has('low_gravity') || this.inst()?.realm === 'observatory';
    return light && this.here() ? 0.55 : 1;
  }
  diseaseScale() {
    return this.has('blighted') && this.here() ? 2 : 1;
  }

  // ─── Opening, entering, and leaving ────────────────────────────────────────
  waystoneNear(): Structure | undefined {
    const p = this.game.s.player;
    return this.game.s.structures.find((st) => st.type === 'waystone' && dist(st, p) < 170);
  }
  /** Turns a realm key in a Waystone: builds a fresh realm of the chosen tier and steps in. */
  open(realmId: string, tier: number): GameResult {
    const tpl = realmById(realmId);
    if (!tpl) return { ok: false, reason: 'No such realm.' };
    const stone = this.waystoneNear(),
      god = this.game.dev.god;
    if (!stone && !god) return { ok: false, reason: 'Stand at a Waystone.' };
    if (tier < 1 || tier > this.maxTier(realmId))
      return { ok: false, reason: `Clear tier ${tierName(Math.max(1, tier - 1))} first.` };
    if (!god && !this.game.count(tpl.key))
      return { ok: false, reason: `You need a ${itemName(tpl.key).toLowerCase()}.` };
    // Keywise and Riftborn wayfinders sometimes turn a key without spending it.
    const keep = this.game.skills.get('keySave') + (this.game.skills.flag('riftborn') ? 0.3 : 0);
    if (!god) {
      if (this.game.rng() < keep)
        this.game.say('The key turns, but stays whole in your hand.', 'good');
      else this.game.remove(tpl.key);
    }
    const seed = Math.floor(this.game.rng() * 2 ** 31);
    const inst: RealmInstance = {
      realm: realmId,
      tier,
      seed,
      mods: rollMods(tier, seededRandom(seed ^ 0x5eed)),
      opened: this.game.s.elapsed,
      home: stone
        ? { x: stone.x + 70, y: stone.y }
        : { x: this.game.s.player.x, y: this.game.s.player.y },
    };
    if (this.game.s.pocket && this.game.s.pocket.realm !== realmId)
      this.game.say('The last realm you opened folds shut behind you.', 'ink');
    this.load(inst, true);
    this.enter();
    return { ok: true };
  }
  /** Steps back into the open realm from a Waystone. */
  resume(): GameResult {
    if (!this.game.s.pocket) return { ok: false, reason: 'No realm is open.' };
    const stone = this.waystoneNear();
    if (!stone && !this.game.dev.god) return { ok: false, reason: 'Stand at a Waystone.' };
    if (stone) this.game.s.pocket.home = { x: stone.x + 70, y: stone.y };
    this.enter();
    return { ok: true };
  }
  private enter() {
    const inst = this.game.s.pocket!,
      tpl = templateOf(inst)!,
      x = POCKET.start + POCKET.arrive + 70;
    this.game.realms.teleport(x, this.game.groundTopAt(x) + 1);
    const rec = this.record(inst.realm);
    rec.visits++;
    this.game.progress.record('realm:' + inst.realm);
    this.banner = { name: tpl.name, tier: inst.tier, mods: inst.mods, at: this.game.s.elapsed };
    this.game.say(`You step into the ${tpl.name} · Tier ${tierName(inst.tier)}.`, 'victory');
    this.caveInAt = this.game.s.elapsed + 20;
    this.breath = AIR_SECONDS;
    this.goldWas = -1;
  }
  /** Leaves the realm for the Waystone you came from (it stays open behind you). */
  leave(): GameResult {
    const inst = this.game.s.pocket,
      home =
        inst?.home ??
        (() => {
          const gate = this.game.s.structures.find((st) => st.type === 'rift_gate');
          return gate ? { x: gate.x + 80, y: gate.y } : { x: RULES.spawnX, y: 0 };
        })();
    this.game.realms.teleport(home.x, this.game.groundTopAt(home.x) + 1);
    this.game.say('The Waystone draws you home.', 'good');
    return { ok: true };
  }

  // ─── The Training Grounds ──────────────────────────────────────────────────
  /** Whether the open realm is the Training Grounds. */
  inCourse() {
    return this.game.s.pocket?.realm === TRAINING.id;
  }
  /** Lays out the Training Grounds and sets a new traveller down at its start. */
  startCourse(): GameResult {
    const s = this.game.s,
      hx = RULES.spawnX;
    this.load(
      {
        realm: TRAINING.id,
        tier: 1,
        seed: 1,
        mods: [],
        opened: s.elapsed,
        home: { x: hx, y: this.game.groundTopAt(hx) },
      },
      true,
    );
    const x = POCKET.start + POCKET.arrive + 180;
    this.game.realms.teleport(x, this.game.groundTopAt(x) + 1);
    s.tutorial.course = 0;
    this.banner = { name: TRAINING.name, tier: 0, mods: [], at: s.elapsed };
    this.game.say(
      'Welcome to the Training Grounds. Walk up to the signpost and press E.',
      'victory',
    );
    return { ok: true };
  }
  /**
   * Leaves the course for the wildlands: finished at the far portal, or skipped (the near
   * portal asks twice, so a stray press does not end the course).
   */
  finishCourse(done = true, ask = !done): GameResult {
    const s = this.game.s;
    if (!this.inCourse()) return { ok: false, reason: 'You are not on the course.' };
    if (ask && s.elapsed - this.leaveAsked > 4) {
      this.leaveAsked = s.elapsed;
      return { ok: false, reason: 'Press E again to skip the rest of the course.' };
    }
    if (done) this.game.progress.record('course:done');
    s.tutorial.course = COURSE.length;
    this.close();
    // With the course behind you, the field tasks catch up with what you have already done.
    this.game.progress.record('course:left');
    this.game.say(
      done
        ? 'Course complete. The wildlands are yours to cross.'
        : 'You leave the Training Grounds for the wildlands.',
      'victory',
    );
    return { ok: true };
  }
  /** The course's own triggers: the hollow below the ledges, and the brambles. */
  private coach() {
    const s = this.game.s,
      p = s.player,
      lx = p.x - POCKET.start,
      t = s.tutorial.tally;
    if (
      !t['course:climb'] &&
      lx > COURSE_HOLLOW.x0 &&
      lx < COURSE_HOLLOW.x1 &&
      p.y > COURSE_HOLLOW.y
    )
      this.game.progress.record('course:climb');
    if (!t['course:bramble'] && lx > COURSE_BRAMBLES[0] && lx < COURSE_BRAMBLES[1]) {
      this.game.progress.record('course:bramble');
      this.game.ailments.contract('bleeding', true);
      this.game.sound('hurt', p.x, p.y);
      this.game.say(
        'The brambles tear at you. Open the chest ahead and bandage the bleeding.',
        'danger',
      );
    }
  }

  // ─── Building the realm ────────────────────────────────────────────────────
  /** Fills the pocket strip with a realm (clearing whatever was there), furnished if fresh. */
  load(inst: RealmInstance, fresh: boolean) {
    const s = this.game.s,
      inside = (o: { x: number }) => inPocket(o.x);
    s.nodes = s.nodes.filter((n) => !inside(n));
    s.animals = s.animals.filter((a) => !inside(a));
    s.structures = s.structures.filter((st) => !inside(st));
    s.drops = s.drops.filter((d) => !inside(d));
    s.caches = s.caches.filter((c) => !inside(c));
    for (const edits of [s.tileEdits, s.wallEdits])
      for (const key of Object.keys(edits))
        if (inPocket((+key % TILE_COLS) * TILE + TILE / 2)) delete edits[+key];
    s.pocket = inst;
    setActiveRealm(inst);
    syncPocket();
    this.rebuildTiles();
    if (fresh) this.populate(inst);
  }
  /** Regenerates the pocket strip's tiles from the open realm, then replays its edits. */
  rebuildTiles() {
    const s = this.game.s,
      tx0 = Math.floor((POCKET.start - DIM_GAP / 2) / TILE);
    for (let ty = 0; ty < TILE_ROWS; ty++)
      for (let tx = tx0; tx < TILE_COLS; tx++) s.tiles[ty * TILE_COLS + tx] = baseTileAt(tx, ty);
    for (const [key, kind] of Object.entries(s.tileEdits))
      if (+key % TILE_COLS >= tx0) s.tiles[+key] = kind;
  }
  /** Empties the pocket strip (the realm collapses). */
  close() {
    const s = this.game.s;
    if (!s.pocket) return;
    const home = s.pocket.home;
    if (this.here()) this.game.realms.teleport(home.x, this.game.groundTopAt(home.x) + 1);
    const inside = (o: { x: number }) => inPocket(o.x);
    s.nodes = s.nodes.filter((n) => !inside(n));
    s.animals = s.animals.filter((a) => !inside(a));
    s.structures = s.structures.filter((st) => !inside(st));
    s.drops = s.drops.filter((d) => !inside(d));
    for (const edits of [s.tileEdits, s.wallEdits])
      for (const key of Object.keys(edits))
        if (inPocket((+key % TILE_COLS) * TILE + TILE / 2)) delete edits[+key];
    s.pocket = null;
    setActiveRealm(null);
    syncPocket();
    this.rebuildTiles();
  }
  private populate(inst: RealmInstance) {
    const g = this.game,
      tpl = templateOf(inst)!,
      geo = activeRealm()!.geo,
      rng = seededRandom(inst.seed),
      mods = new Set(inst.mods),
      x0 = POCKET.start;
    const ctx: RealmCtx = {
      rng,
      tier: inst.tier,
      mods,
      x0,
      floorAt: (x, y) => g.floorNear(x, y),
      node: (kind, x, y) => void g.world.placeNode(kind, x, y),
      mob: (type, x, y) => this.spawnMob(type, x, y),
      chest: (x, y, loot) => this.chest(x, y, loot, rng),
      furnish: (type, x, y, kind) => void g.realms.furnish(type, x, y, kind ? { kind } : {}),
    };
    const clear = (lx: number) =>
      Math.abs(lx - geo.arrive) > 260 &&
      Math.abs(lx - geo.arena) > 520 &&
      lx > 160 &&
      lx < RW - 160;
    const spot = (lx: number) => {
      const floors = geo.floors,
        f = floors[Math.floor(rng() * floors.length)];
      return ctx.floorAt(x0 + lx, f(lx) - 30);
    };
    // The Training Grounds are laid by hand: a way home, then its own stations.
    if (tpl.course) {
      const ax = x0 + geo.arrive;
      g.realms.furnish('portal', ax, g.floorNear(ax, geo.floors[0](geo.arrive) - 40), {
        kind: 'home',
      });
      tpl.extra?.(geo, ctx);
      for (const st of g.s.structures) if (st.type === 'icebox' && inPocket(st.x)) st.fuel = 3600;
      return;
    }
    // Resources, thicker with Bountiful, ore doubled by Rich Veins.
    const nodes: [string, number][] = tpl.nodes.map(([k, w]) => [
      k,
      mods.has('rich_veins') && tpl.ores.includes(k) ? w * 3 : w,
    ]);
    const nNodes = Math.round(tpl.nodeCount * (mods.has('bountiful') ? 1.6 : 1));
    for (let i = 0; i < nNodes; i++)
      for (let attempt = 0; attempt < 6; attempt++) {
        const lx = 200 + rng() * (RW - 400);
        if (!clear(lx)) continue;
        if (g.world.placeNode(weighted(rng, nodes), x0 + lx, spot(lx))) break;
      }
    // Monsters, half again as many when Swarming.
    const mobs: [{ type: string; air?: boolean }, number][] = tpl.mobs.map((m) => [m, m.weight]);
    const nMobs = Math.round(tpl.mobCount * (mods.has('swarming') ? 1.5 : 1));
    for (let i = 0; i < nMobs; i++) {
      const lx = 300 + ((i + 0.2 + rng() * 0.6) / nMobs) * (RW - 600);
      if (!clear(lx)) continue;
      const m = weighted(rng, mobs),
        y = spot(lx);
      ctx.mob(m.type, x0 + lx, m.air ? y - 140 - rng() * 80 : y);
      // Swarmers never come alone.
      if (MOBS[m.type]?.behave === 'swarm')
        for (const dx of [-40, 40])
          ctx.mob(m.type, x0 + lx + dx, (m.air ? y - 140 : y) - rng() * 60);
    }
    // Chests, more of them in a Treasure trove.
    const nChests =
      tpl.chests +
      (mods.has('treasure') ? 3 : 0) +
      (this.game.skills.flag('treasureSense') ? 2 : 0);
    for (let i = 0; i < nChests; i++) {
      const lx = ((i + 0.5) / nChests) * (RW - 1400) + 400 + (rng() - 0.5) * 300;
      if (clear(lx)) ctx.chest(x0 + lx, spot(lx), tpl.chestLoot);
    }
    // The way home, and the great foe's altar.
    const ax = x0 + geo.arrive;
    g.realms.furnish('portal', ax, g.floorNear(ax, geo.floors[0](geo.arrive) - 40), {
      kind: 'home',
      store: { [tpl.id]: 1 },
    });
    const bx = x0 + geo.arena;
    g.realms.furnish('boss_altar', bx, g.floorNear(bx, geo.arenaFloor(geo.arena) - 40), {
      kind: tpl.boss,
    });
    // An elite roams the far half; when Hunted, it comes looking for you.
    const ex = x0 + RW * (0.55 + rng() * 0.2);
    this.spawnMob(tpl.elite, ex, g.floorNear(ex, geo.floors[0](ex - x0) - 30), {
      ...(mods.has('hunted') ? { hunter: true } : {}),
    });
    // Shrines grant a blessing once each.
    for (const f of [0.3, 0.68]) {
      const lx = RW * f + (rng() - 0.5) * 400;
      if (clear(lx)) g.realms.furnish('shrine', x0 + lx, spot(lx));
    }
    // Lore tablets left by those who went before.
    for (const f of [0.22, 0.52]) {
      const lx = RW * f + (rng() - 0.5) * 500;
      if (clear(lx))
        g.realms.furnish('lore_tablet', x0 + lx, spot(lx), {
          kind: String(Math.floor(rng() * LORE.length)),
        });
    }
    // A wandering merchant, in about half of all expeditions.
    if (rng() < 0.5) {
      const lx = RW * (0.35 + rng() * 0.3);
      if (clear(lx)) this.merchant(x0 + lx, spot(lx), rng, tpl, inst.tier);
    }
    // A hidden vault sealed in the rock below, marked by a cairn above.
    this.vault(geo, rng, x0);
    tpl.extra?.(geo, ctx);
  }
  /** A wandering merchant's stall: a few goods, and the next band's fragments. */
  private merchant(x: number, y: number, rng: () => number, tpl: { band: number }, tier: number) {
    const stock: { id: string; qty: number }[] = [];
    const goods = [...MERCHANT_GOODS];
    for (let i = 0; i < 4 && goods.length; i++) {
      const [id] = goods.splice(Math.floor(rng() * goods.length), 1)[0];
      stock.push({ id, qty: 1 + Math.floor(rng() * 3) });
    }
    const next = REALMS.filter((r) => r.band === tpl.band + 1);
    if (next.length) stock.push({ id: next[Math.floor(rng() * next.length)].fragment, qty: 2 });
    const st = this.game.realms.furnish('merchant_stall', x, y, { kind: String(tier) });
    st.larder = stock;
  }
  /** What a merchant asks for an item. */
  price(id: string, tier: number) {
    const base = MERCHANT_GOODS.find(([g]) => g === id)?.[1] ?? 150;
    return Math.round(base * (1 + 0.2 * (tier - 1)));
  }
  /** Buys one of an item from a merchant's stall. */
  buy(st: Structure, id: string): GameResult {
    const e = st.larder?.find((x) => x.id === id && x.qty > 0);
    if (!e) return { ok: false, reason: 'Sold out.' };
    const cost = this.price(id, Number(st.kind) || 1);
    if (!this.game.dev.god) {
      if (this.game.count('coin') < cost) return { ok: false, reason: `It costs ${cost} marks.` };
      this.game.remove('coin', cost);
    }
    e.qty--;
    this.game.add(id);
    this.game.sound('coin', st.x, st.y);
    this.game.say(`Bought ${itemName(id).toLowerCase()} for ${cost} marks.`, 'good');
    return { ok: true };
  }
  /** Carves a sealed room into solid rock beneath a floor, with a rich chest, and a cairn above. */
  private vault(geo: { floors: ((x: number) => number)[] }, rng: () => number, x0: number) {
    const s = this.game.s;
    for (let attempt = 0; attempt < 8; attempt++) {
      const lx = 900 + rng() * (RW - 2400),
        floor = geo.floors[0](lx),
        tx0 = Math.floor((x0 + lx) / TILE) - 3,
        ty0 = Math.floor((floor + 170) / TILE);
      // Only in solid rock, with rock all round.
      let solid = true;
      for (let ty = ty0 - 2; ty <= ty0 + 4 && solid; ty++)
        for (let tx = tx0 - 2; tx <= tx0 + 8 && solid; tx++)
          if (!s.tiles[ty * TILE_COLS + tx]) solid = false;
      if (!solid) continue;
      for (let ty = ty0; ty < ty0 + 3; ty++)
        for (let tx = tx0; tx < tx0 + 7; tx++) {
          s.tiles[ty * TILE_COLS + tx] = 0;
          s.tileEdits[ty * TILE_COLS + tx] = 0;
        }
      const cx = (tx0 + 3.5) * TILE,
        cy = (ty0 + 3) * TILE - 1;
      this.chest(
        cx,
        cy,
        [
          ['healing_draught', 2, 4, 1],
          ['life_crystal', 1, 1, 0.5],
          ['gold_ingot', 3, 6, 0.8],
          ['fracture_shard', 1, 2, 0.15],
          ...(templateOf(this.inst()!)?.chestLoot ?? []),
        ],
        rng,
      );
      this.game.realms.furnish('cairn', x0 + lx, this.game.floorNear(x0 + lx, floor - 30));
      return;
    }
  }
  /** A realm shrine: a blessing for a few minutes, once. */
  pray(st: Structure): GameResult {
    if (st.crop === 'spent') return { ok: false, reason: 'The shrine is quiet now.' };
    const boons = ['swiftness', 'ironskin', 'regeneration', 'wrath', 'shine', 'mining'],
      id = boons[Math.floor(this.game.rng() * boons.length)];
    this.game.equipment.addBuff(id, 240);
    st.crop = 'spent';
    this.game.sound('crystal', st.x, st.y);
    this.game.event('burst', st.x, st.y - 30, '#fff0a0');
    this.game.say(`The shrine blesses you: ${BUFFS[id].name} · ${BUFFS[id].text}.`, 'victory');
    return { ok: true };
  }
  spawnMob(type: string, x: number, y: number, extra: Partial<Animal> = {}) {
    const g = this.game;
    g.world.addAnimal(type, x, y, { body: true, vx: 0, vy: 0, ...extra });
    const a = g.s.animals[g.s.animals.length - 1];
    a.maxHp = a.hp = Math.round(a.hp * this.hpScale());
    return a;
  }
  private chest(x: number, y: number, loot: Loot[], rng: () => number) {
    const k = this.lootScale(x),
      store: Record<string, number> = {};
    for (const [id, min, max, chance] of loot)
      if (rng() < Math.min(1, chance * (0.8 + k * 0.2)))
        store[id] = Math.round((min + Math.floor(rng() * (max - min + 1))) * k);
    if (!Object.keys(store).length) store.healing_draught = 1;
    this.game.realms.furnish('dungeon_chest', x, y, {
      kind: this.game.s.pocket?.realm ?? 'realm',
      store,
    });
  }

  // ─── The great foe ─────────────────────────────────────────────────────────
  /** Whether this expedition's boss has already fallen. */
  bossDown() {
    return !!this.game.s.pocket?.cleared;
  }
  /** The realm's boss has fallen: the tier is cleared, and the first victory yields its relic. */
  cleared(a: Animal) {
    const inst = this.inst(),
      tpl = inst && templateOf(inst);
    if (!inst || !tpl || tpl.boss !== a.type) return;
    inst.cleared = true;
    const rec = this.record(inst.realm),
      first = inst.tier > rec.best;
    rec.kills++;
    rec.best = Math.max(rec.best, inst.tier);
    if (!rec.relic) {
      rec.relic = true;
      this.game.add(tpl.relic);
      this.game.progress.record('relic:' + tpl.relic);
      this.game.say(`The ${itemName(tpl.relic)} is yours: a relic of the ${tpl.name}.`, 'victory');
    }
    if (first && inst.tier < this.maxTier(inst.realm) + (inst.realm === 'fractured' ? 1 : 0))
      this.game.say(
        `Tier ${tierName(inst.tier + 1)} of the ${tpl.name} can now be opened.`,
        'good',
      );
    this.game.progress.record('clear:' + inst.realm);
    this.game.progress.record('clear:tier' + inst.tier);
  }

  // ─── Hazards ───────────────────────────────────────────────────────────────
  /** Height of the water (the Orchard's tide) or mud (the Marches' mire) in the open realm. */
  waterLevel(): number | null {
    const r = activeRealm();
    if (r?.tpl.hazard.id === 'mire') return (r.geo as MarchesGeometry).mire;
    if (r?.tpl.hazard.id === 'pressure') return (r.geo as UndertowGeometry).sea;
    if (r?.tpl.hazard.id === 'magma')
      return magmaLevel(r.geo as EmberGeometry, this.game.s.elapsed);
    if (!r || r.tpl.hazard.id !== 'tide') return null;
    return tideLevel(r.geo as OrchardGeometry, this.game.s.elapsed);
  }
  /** What fills the low ground: water, mire, or nothing. */
  waterKind(): 'tide' | 'mire' | 'deep' | 'magma' | null {
    const id = activeRealm()?.tpl.hazard.id;
    if (id === 'pressure') return 'deep';
    return id === 'tide' || id === 'mire' || id === 'magma' ? id : null;
  }
  /** Whether the player stands in the Emberheart's magma. */
  inMagma() {
    const p = this.game.s.player;
    return this.waterKind() === 'magma' && this.underwater(p.x, p.y - 8);
  }
  /** Breath left and its most, for the air gauge (null when breath is not an issue). */
  air(): [number, number] | null {
    if (this.waterKind() !== 'deep' || !this.here() || this.game.equipment.has('gills'))
      return null;
    return [this.breath, AIR_SECONDS];
  }
  /** The Garden's season, if the player is in it. */
  season() {
    const r = activeRealm();
    if (!r || r.tpl.hazard.id !== 'seasons') return null;
    return seasonAt(this.game.s.elapsed, r.inst.seed);
  }
  /** How far the Garden's season moves the air from its usual temperature. */
  seasonShift(x = this.game.s.player.x) {
    if (!inPocket(x)) return 0;
    return this.season()?.temp ?? 0;
  }
  /** A Feverlands bite: it may carry any of the realm's sicknesses. */
  feverBite() {
    const r = activeRealm();
    if (!r || r.tpl.hazard.id !== 'fever' || !this.here()) return;
    if (this.game.equipment.has('plagueward')) return;
    if (this.game.rng() < FEVER_CHANCE * this.diseaseScale())
      this.game.ailments.contract(FEVER_BITES[Math.floor(this.game.rng() * FEVER_BITES.length)]);
  }
  /** Whether the fever-dream is scrambling what the record shows. */
  dreaming() {
    return (
      this.game.ailments.showing().some((a) => a.id === 'fever_dream') &&
      !this.game.equipment.has('plagueward')
    );
  }
  /** Strength of a Mycelial spore bloom where the player is. */
  sporeLevel() {
    const r = activeRealm();
    if (!r || r.tpl.hazard.id !== 'spores' || !this.here()) return 0;
    return sporeBloom(this.game.s.elapsed, r.inst.seed);
  }
  /** Whether the player wades in the Marches' mire. */
  inMire() {
    const p = this.game.s.player;
    return this.waterKind() === 'mire' && this.underwater(p.x, p.y - 12);
  }
  /** Strength of the choir's hymn (0 when silent, warded, or warmed by a fire). */
  hymnLevel() {
    const r = activeRealm();
    if (!r || r.tpl.hazard.id !== 'hymn' || !this.here()) return 0;
    return hymnAt(this.game.s.elapsed, r.inst.seed);
  }
  /** Whether a fire or kiln is close enough to keep the hymn's cold off. */
  warmed() {
    const p = this.game.s.player;
    return this.game.s.structures.some(
      (st) =>
        ((st.type === 'campfire' && st.fuel > 0) || st.type === 'kiln' || st.type === 'forge') &&
        dist(st, p) < 170,
    );
  }
  /** How hard the white sun beats down on the player (0 in shade, at night, or below ground). */
  sunLevel() {
    const r = activeRealm(),
      p = this.game.s.player;
    if (!r || r.tpl.hazard.id !== 'sun' || !this.here() || this.game.isNight()) return 0;
    if (p.y > surfaceAt(p.x) + 80) return 0;
    return 1;
  }
  /** Whether the realm keeps food from rotting (the Frozen Choir). */
  preserves() {
    return this.here() && this.inst()?.realm === 'choir';
  }
  /** Multiplier on the player's movement from mire and hymn. */
  moveScale() {
    if (!this.here()) return 1;
    const fx = this.game.equipment.effects();
    let k = 1;
    if (this.inMire() && !fx.has('mirewalk')) k *= 0.55;
    if (this.hymnLevel() > 0.5 && !fx.has('hymnward') && !this.warmed()) k *= 0.6;
    if (this.inMagma() && !fx.has('forgeward')) k *= 0.5;
    return k;
  }
  /** Steam vents blowing near a point. */
  ventNear(x: number, y: number) {
    return this.game.s.structures.find(
      (st) =>
        st.type === 'steam_vent' &&
        Math.abs(st.x - x) < 34 &&
        y <= st.y + 8 &&
        y > st.y - 130 &&
        ventActive(st.x, this.game.s.elapsed),
    );
  }
  /** Whether a point in the realm is under water. */
  underwater(x: number, y: number) {
    const level = this.waterLevel();
    if (level === null || !inPocket(x) || y <= level) return false;
    // The mire lies only in the basins on the surface; the catacombs beneath are dry.
    return this.waterKind() !== 'mire' || y < surfaceAt(x) + 40;
  }
  /** Whether the player wades below the tide and it hinders them. */
  submerged() {
    const p = this.game.s.player;
    const kind = this.waterKind();
    return (
      (kind === 'tide' || kind === 'deep') &&
      this.underwater(p.x, p.y - 24) &&
      !this.game.equipment.has('swim') &&
      !this.game.equipment.has('gills')
    );
  }
  /** Strength of the ash storm where the player stands (0 when clear, sheltered, or warded). */
  ashLevel() {
    const r = activeRealm(),
      p = this.game.s.player;
    if (!r || r.tpl.hazard.id !== 'ash' || !this.here()) return 0;
    if (p.y > surfaceAt(p.x) + 120) return 0;
    return ashStorm(this.game.s.elapsed, r.inst.seed);
  }
  /** A cave-in about to fall (for the renderer's dust). */
  pendingCaveIn() {
    return this.caveIn;
  }

  update(dt: number) {
    const s = this.game.s,
      inst = s.pocket,
      p = s.player;
    if (!inst) return;
    // An Unstable realm tears itself apart after a while.
    if (inst.mods.includes('unstable')) {
      const left = UNSTABLE_SECONDS - (s.elapsed - inst.opened);
      if (left < 60 && left + dt >= 60 && this.here())
        this.game.say('The realm shudders: one minute until it collapses!', 'danger');
      if (left <= 0) {
        this.game.say('The unstable realm collapses around you.', 'danger');
        this.close();
        return;
      }
    }
    if (!this.here() || s.dead) return;
    if (this.inCourse()) return this.coach();
    const tpl = templateOf(inst)!,
      fx = this.game.equipment.effects(),
      v = s.vitals;
    const hard = 1 - Math.min(0.8, this.game.skills.get('hazard'));
    // The mire: slow, cold, and a festering in the blood.
    if (tpl.hazard.id === 'mire' && this.inMire() && !fx.has('mirewalk')) {
      v.wetness = clamp(v.wetness + dt * 5, 0, 100);
      v.bodyTemp = clamp(v.bodyTemp - dt * 0.008, 30, 41);
      v.hygiene = clamp(v.hygiene - dt * 0.4, 0, 100);
      if (!this.submergedWas) {
        this.game.sound('splash', p.x, p.y, 0.6);
        this.game.say('You sink into the marrow mire. Get out before it festers.', 'danger');
      }
      if (this.game.rng() < dt * 0.012 * hard * this.diseaseScale())
        this.game.ailments.contract('marrow_rot');
    }
    if (tpl.hazard.id === 'mire') this.submergedWas = this.inMire();
    // Shardfall: a glint in the canopy, then glass rains down around you in the open.
    if (tpl.hazard.id === 'shards') {
      if (!this.caveIn && s.elapsed > this.caveInAt && p.y < surfaceAt(p.x) + 60) {
        const x = p.x + (this.game.rng() - 0.5) * 200;
        this.caveIn = { x, y: p.y - 420, at: s.elapsed + 1.3, kind: 'shards' };
        this.game.sound('crystal', x, p.y - 200, 0.8);
      }
      if (this.caveIn && s.elapsed >= this.caveIn.at) {
        const c = this.caveIn,
          ward = fx.has('shardward');
        for (let i = 0; i < 6; i++)
          this.game.combat.spawn(
            'glass_shard',
            { x: c.x + (i - 2.5) * 30 + (this.game.rng() - 0.5) * 16, y: c.y },
            Math.PI / 2,
            180 + this.game.rng() * 120,
            ward ? 0 : 20 * hard,
            'mob',
          );
        this.game.sound('crumble', c.x, c.y + 400, 0.9);
        this.caveIn = null;
        this.caveInAt = s.elapsed + 22 + this.game.rng() * 18;
      }
    }
    // Steam vents scald anyone standing over them as they blow.
    if (tpl.hazard.id === 'traps' && !fx.has('trapsense') && s.elapsed > this.ventAt) {
      const vent = this.ventNear(p.x, p.y);
      if (vent) {
        this.ventAt = s.elapsed + 0.8;
        this.game.combat.hurtPlayer(30 * hard, 'Scalding steam', undefined, 'fire');
      }
    }
    // The white sun: heat and thirst on the open flats by day.
    if (tpl.hazard.id === 'sun') {
      const sun = this.sunLevel() > 0 && !fx.has('shade');
      if (sun && !this.sunWas)
        this.game.say('The white sun beats down. Find shade below, or cover up.', 'danger');
      this.sunWas = sun;
      if (sun) {
        v.hydration = clamp(v.hydration - dt * 0.3 * hard, 0, 100);
        v.bodyTemp = clamp(v.bodyTemp + dt * 0.012 * hard, 30, 41);
      }
    }
    // The hymn: while the choir sings, the cold deepens and holds you back.
    if (tpl.hazard.id === 'hymn') {
      const hymn = this.hymnLevel() > 0.5,
        guarded = fx.has('hymnward') || this.warmed();
      if (hymn && !this.hymnWas)
        this.game.say(
          guarded
            ? 'The choir begins to sing; the warmth holds it off.'
            : 'The choir begins to sing! The cold deepens. Find a fire.',
          guarded ? 'good' : 'danger',
        );
      this.hymnWas = hymn;
      if (hymn && !guarded) v.bodyTemp = clamp(v.bodyTemp - dt * 0.025 * hard, 30, 41);
    }
    // Star pulses: light gathers overhead, then a star crashes down where you stood.
    if (tpl.hazard.id === 'stars') {
      if (!this.caveIn && starPulse(s.elapsed, inst.seed) > 0 && s.elapsed > this.caveInAt) {
        this.caveIn = { x: p.x, y: p.y - 520, at: s.elapsed + 2.6, kind: 'star' };
        this.game.sound('star', p.x, p.y - 200, 1);
        this.game.say('Light gathers overhead: a star pulse is coming!', 'danger');
      }
      if (this.caveIn && s.elapsed >= this.caveIn.at) {
        const c = this.caveIn,
          ward = fx.has('starward');
        for (const dx of [-50, 0, 50])
          this.game.combat.spawn(
            'star_pulse',
            { x: c.x + dx, y: c.y },
            Math.PI / 2,
            700,
            ward ? 0 : 52 * hard,
            'mob',
          );
        this.game.sound('thunder', c.x, c.y + 400, 0.9);
        this.caveIn = null;
        this.caveInAt = s.elapsed + 30;
      }
    }
    // Cursed gold: each handful of gold picked up risks gold sickness.
    if (tpl.hazard.id === 'curse') {
      const gold =
        this.game.count('coin') +
        this.game.count('gold_ingot') * 20 +
        this.game.count('crown_gold') * 5;
      if (this.goldWas >= 0 && gold > this.goldWas && !fx.has('goldward')) {
        if (this.game.rng() < 0.1 * hard * this.diseaseScale())
          this.game.ailments.contract('gold_sickness');
      }
      this.goldWas = gold;
    }
    // The Undertow: every breath counts; diving bells hold air.
    if (tpl.hazard.id === 'pressure') {
      const bell = s.structures.some((st) => st.type === 'diving_bell' && dist(st, p) < 120);
      if (bell) this.breath = Math.min(AIR_SECONDS, this.breath + dt * 12);
      else if (!fx.has('gills') && this.underwater(p.x, p.y - 40))
        this.breath = Math.max(0, this.breath - dt * (fx.has('breath') ? 1 / 3 : 1) * hard);
      if (this.breath <= 0) {
        v.health = clamp(v.health - dt * 10, 0, this.game.maxHealth());
        if (s.elapsed > this.drowningSaid) {
          this.drowningSaid = s.elapsed + 4;
          this.game.say('You are drowning! Find a diving bell!', 'danger');
        }
      } else if (this.breath < 10 && s.elapsed > this.drowningSaid && !bell) {
        this.drowningSaid = s.elapsed + 6;
        this.game.say('Your breath is running out.', 'danger');
      }
    }
    // Emberheart: the magma climbs; standing in it burns fast.
    if (tpl.hazard.id === 'magma') {
      const rising =
        magmaLevel(activeRealm()!.geo as EmberGeometry, s.elapsed) <
        (activeRealm()!.geo as EmberGeometry).low - 20;
      if (rising && !this.magmaWas)
        this.game.say('The magma is rising! Climb to the high ledges.', 'danger');
      this.magmaWas = rising;
      if (this.inMagma() && !fx.has('forgeward')) {
        v.health = clamp(v.health - dt * 16 * hard, 0, this.game.maxHealth());
        if (this.game.rng() < dt * 0.3) this.game.ailments.contract('burn', true);
      }
    }
    // Toxic air: without a respirator, every breath burns.
    if (inst.mods.includes('toxic_air') && !fx.has('breath')) {
      v.stamina = clamp(v.stamina - dt * 1.2 * hard, 0, 100);
      v.health = clamp(v.health - dt * 0.25 * hard, 0, this.game.maxHealth());
      if (!this.toxicWas)
        this.game.say('The air here burns your lungs. A respirator would help.', 'danger');
      this.toxicWas = true;
    }
    // Spore blooms: the air fills; spores sting and settle in unguarded lungs.
    if (tpl.hazard.id === 'spores') {
      const bloom = this.sporeLevel() > 0.5,
        guarded = fx.has('breath') || fx.has('spores');
      if (bloom && !this.bloomWas)
        this.game.say(
          guarded
            ? 'The fungus blooms; your mask keeps the spores out.'
            : 'The fungus blooms! Spores fill the air.',
          guarded ? 'good' : 'danger',
        );
      this.bloomWas = bloom;
      if (bloom && !guarded) {
        v.stamina = clamp(v.stamina - dt * 2.5 * hard, 0, 100);
        if (this.game.rng() < dt * 0.015 * hard * this.diseaseScale())
          this.game.ailments.contract('spore_lung');
      }
    }
    // The Garden: the year turns.
    if (tpl.hazard.id === 'seasons') {
      const season = this.season()!;
      if (season.id !== this.seasonWas && this.seasonWas)
        this.game.say(
          `${season.name} comes to the garden.`,
          season.id === 'winter' || season.id === 'summer' ? 'danger' : 'ink',
        );
      this.seasonWas = season.id;
    }
    // The tide: wading soaks and chills you.
    if (tpl.hazard.id === 'tide') {
      const under = this.underwater(p.x, p.y - 24);
      if (under && !fx.has('swim')) {
        v.wetness = clamp(v.wetness + dt * 6, 0, 100);
        v.bodyTemp = clamp(v.bodyTemp - dt * 0.012, 30, 41);
      }
      if (under && !this.submergedWas) this.game.sound('splash', p.x, p.y, 0.9);
      this.submergedWas = under;
    }
    // Ash storms choke and blind anyone caught in the open.
    if (tpl.hazard.id === 'ash') {
      const ash = this.ashLevel(),
        storm = ash > 0.5;
      if (storm && !this.stormWas)
        this.game.say(
          fx.has('ashward')
            ? 'An ash storm rolls in; your ashcloth keeps it out.'
            : 'An ash storm rolls in! Get below ground or cover up.',
          fx.has('ashward') ? 'good' : 'danger',
        );
      this.stormWas = storm;
      if (storm && !fx.has('ashward')) {
        v.stamina = clamp(v.stamina - dt * 4 * hard, 0, 100);
        v.hydration = clamp(v.hydration - dt * 0.35 * hard, 0, 100);
        v.hygiene = clamp(v.hygiene - dt * 0.2, 0, 100);
      }
    }
    // Cave-ins: dust trickles from the roof, then rock falls.
    if (tpl.hazard.id === 'cavein') {
      const warned = fx.has('tremor');
      if (!this.caveIn && s.elapsed > this.caveInAt) {
        const x = p.x + (this.game.rng() - 0.5) * 360;
        let ty = Math.floor((p.y - 60) / TILE);
        while (ty > 0 && !this.game.tileAt(Math.floor(x / TILE), ty)) ty--;
        this.caveIn = { x, y: (ty + 1) * TILE, at: s.elapsed + (warned ? 2.4 : 1.1) };
        if (warned) this.game.say('The ground trembles: rock is about to fall!', 'danger');
        this.game.sound('crumble', x, (ty + 1) * TILE, 0.7);
      }
      if (this.caveIn && s.elapsed >= this.caveIn.at) {
        const c = this.caveIn;
        for (let i = 0; i < 5; i++)
          this.game.combat.spawn(
            'falling_rock',
            { x: c.x + (i - 2) * 34 + (this.game.rng() - 0.5) * 14, y: c.y + 8 },
            Math.PI / 2,
            60 + this.game.rng() * 80,
            (warned ? 13 : 26) * (1 - Math.min(0.8, this.game.skills.get('hazard'))),
            'mob',
          );
        this.game.sound('slam', c.x, c.y, 1);
        this.caveIn = null;
        this.caveInAt = s.elapsed + 16 + this.game.rng() * 16;
      }
    }
    // A Hunted realm's elite always knows where you are.
    for (const a of s.animals)
      if (a.hunter && !a.deadUntil && dist(a, p) > 500) {
        a.homeX = p.x;
        a.homeY = p.y;
      }
  }

  /** Echoing realms: a slain monster splits into two lesser copies (once). */
  echo(a: Animal) {
    if (!this.has('echoing') || !inPocket(a.x) || a.echo || MOBS[a.type]?.boss || a.minion) return;
    for (const dx of [-24, 24]) {
      const c = this.spawnMob(a.type, a.x + dx, a.y - 10, { echo: true });
      c.maxHp = c.hp = Math.max(10, Math.round(c.maxHp * 0.4));
      c.id = uniqueId();
    }
    this.game.event('burst', a.x, a.y - 20, '#c8b0ff');
  }
}
