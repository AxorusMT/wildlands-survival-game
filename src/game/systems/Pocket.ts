import { clamp, dist } from '../../core/math.ts';
import { seededRandom } from '../../core/random.ts';
import type { Animal, GameResult, Structure } from '../../core/types.ts';
import { BUFFS } from '../../data/gear.ts';
import { itemName } from '../../data/items.ts';
import { MOBS } from '../../data/mobs.ts';
import {
  MAX_TIER,
  RW,
  TIER_NAMES,
  TIER_SCALE,
  ashStorm,
  hymnAt,
  modById,
  realmById,
  rollMods,
  setActiveRealm,
  activeRealm,
  tideLevel,
  ventActive,
  weighted,
  type Loot,
  type MarchesGeometry,
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
  private caveIn: { x: number; y: number; at: number; kind?: 'shards' } | null = null;
  private hymnWas = false;
  private sunWas = false;
  private ventAt = 0;
  private stormWas = false;
  private submergedWas = false;
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
    return Math.min(MAX_TIER, this.record(id).best + 1);
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
  speedScale(a: Animal) {
    return this.has('frenzied') && inPocket(a.x) ? 1.3 : 1;
  }
  /** Multiplier on food and water drain. */
  drainScale() {
    return this.has('hungering') && this.here() ? 1.5 : 1;
  }
  gravityScale() {
    return this.has('low_gravity') && this.here() ? 0.55 : 1;
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
      return { ok: false, reason: `Clear tier ${TIER_NAMES[tier - 1] ?? 'I'} first.` };
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
      tpl = realmById(inst.realm)!,
      x = POCKET.start + POCKET.arrive + 70;
    this.game.realms.teleport(x, this.game.groundTopAt(x) + 1);
    const rec = this.record(inst.realm);
    rec.visits++;
    this.game.progress.record('realm:' + inst.realm);
    this.banner = { name: tpl.name, tier: inst.tier, mods: inst.mods, at: this.game.s.elapsed };
    this.game.say(`You step into the ${tpl.name} · Tier ${TIER_NAMES[inst.tier]}.`, 'victory');
    this.caveInAt = this.game.s.elapsed + 20;
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
      tpl = realmById(inst.realm)!,
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
    tpl.extra?.(geo, ctx);
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
      tpl = inst && realmById(inst.realm);
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
    if (first && inst.tier < MAX_TIER)
      this.game.say(
        `Tier ${TIER_NAMES[inst.tier + 1]} of the ${tpl.name} can now be opened.`,
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
    if (!r || r.tpl.hazard.id !== 'tide') return null;
    return tideLevel(r.geo as OrchardGeometry, this.game.s.elapsed);
  }
  /** What fills the low ground: water, mire, or nothing. */
  waterKind(): 'tide' | 'mire' | null {
    const id = activeRealm()?.tpl.hazard.id;
    return id === 'tide' || id === 'mire' ? id : null;
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
    return level !== null && inPocket(x) && y > level;
  }
  /** Whether the player wades below the tide and it hinders them. */
  submerged() {
    const p = this.game.s.player;
    return (
      this.waterKind() === 'tide' &&
      this.underwater(p.x, p.y - 24) &&
      !this.game.equipment.has('swim')
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
    const tpl = realmById(inst.realm)!,
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
