import { clamp, dist } from '../../core/math.ts';
import type { Structure } from '../../core/types.ts';
import { DIM_WIDTH, ISLANDS, MYC, VOID, islandTop } from '../../data/dimensions.ts';
import { itemName } from '../../data/items.ts';
import { MOBS } from '../../data/mobs.ts';
import { DIMENSIONS, DUNGEONS, dimensionAt, dungeonAt, surfaceAt } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** Sigils needed at the Rift Gate for each dimension. */
export const RIFT_NEEDS: Record<string, number> = { mycelia: 1, skyreach: 2, void: 4 };
export const SIGILS = ['sigil_crypt', 'sigil_frost', 'sigil_sun', 'sigil_cinder'];

/** Dungeons and dimensions: their furnishings, the Rift Gate, traps, chests, and falling stars. */
export class Realms extends System {
  private starAt = 0;

  furnish(type: string, x: number, y: number, extra: Partial<Structure> = {}): Structure {
    const st: Structure = {
      id: uniqueId(),
      type,
      x,
      y,
      fuel: 0,
      water: 0,
      store: {},
      crop: null,
      plantedAt: 0,
      triggeredAt: 0,
      fixed: true,
      ...extra,
    };
    this.game.s.structures.push(st);
    return st;
  }
  private roll(loot: [string, number, number, number][]) {
    const store: Record<string, number> = {};
    for (const [id, min, max, chance] of loot)
      if (this.game.rng() < chance)
        store[id] = (store[id] ?? 0) + min + Math.floor(this.game.rng() * (max - min + 1));
    if (!Object.keys(store).length) store.healing_draught = 1;
    return store;
  }
  /** Lays out every dungeon's and dimension's furnishings and guardians. */
  populate() {
    const g = this.game;
    for (const d of DUNGEONS) {
      for (const c of d.chests)
        this.furnish('dungeon_chest', c.x, c.y, { kind: d.def.id, store: this.roll(d.def.loot) });
      for (const t of d.traps) this.furnish(t.type, t.x, t.y, { kind: String(t.dir) });
      for (const t of d.torches) this.furnish('torch', t.x, t.y, { kind: d.def.flame, fuel: 1 });
      this.furnish('boss_altar', d.altar.x, d.altar.y, { kind: d.def.boss });
      for (const sp of d.spawns)
        g.world.addAnimal(sp.type, sp.x, sp.y, { body: true, vx: 0, vy: 0 });
    }
    const [myc, sky, voidDim] = DIMENSIONS;
    // Arrival portals lead home.
    for (const dim of DIMENSIONS) {
      const x = dim.start + dim.arrive;
      this.furnish('portal', x, g.groundTopAt(x) - 1, { kind: 'home', store: { [dim.id]: 1 } });
    }
    // The Mycelial Deep.
    const lx = (f: number) => myc.start + DIM_WIDTH * f;
    for (let f = 0.08; f < 0.92; f += 0.045) {
      const x = lx(f) + (g.rng() - 0.5) * 140;
      const kind = ['shroom_wood', 'glowcap', 'shroom_wood', 'mushroom', 'glowcap'][
        Math.floor(g.rng() * 5)
      ];
      g.world.placeNode(kind, x, g.floorNear(x, MYC.floor(x - myc.start) - 20));
      const tx = lx(f + 0.02);
      g.world.placeNode(
        g.rng() < 0.6 ? 'myconite_ore' : 'glowcap',
        tx,
        g.floorNear(tx, MYC.tunnel(tx - myc.start)),
      );
    }
    for (let i = 0; i < 26; i++) {
      const x = lx(0.1 + (i / 26) * 0.78),
        tunnel = i % 3 === 0,
        y = tunnel
          ? g.floorNear(x, MYC.tunnel(x - myc.start))
          : g.floorNear(x, MYC.floor(x - myc.start) - 20);
      const type = ['shroomling', 'spore_slime', 'mycelid', 'shroomling'][i % 4];
      g.world.addAnimal(type, x, y, { body: true, vx: 0, vy: 0 });
      if (i % 3 === 1)
        g.world.addAnimal('spore_bat', x + 60, y - 180, { body: true, vx: 0, vy: 0 });
    }
    const h = MYC.hollow;
    this.furnish(
      'boss_altar',
      myc.start + (h.x0 + h.x1) / 2,
      g.floorNear(myc.start + (h.x0 + h.x1) / 2, h.bottom - 80),
      { kind: 'sporemother' },
    );
    for (const f of [0.3, 0.62]) {
      const x = lx(f);
      this.furnish('dungeon_chest', x, g.floorNear(x, MYC.tunnel(x - myc.start)), {
        kind: 'mycelia',
        store: this.roll([
          ['life_fruit', 1, 1, 0.5],
          ['greater_healing', 2, 3, 1],
          ['spores', 4, 8, 1],
          ['shine_potion', 1, 2, 0.6],
        ]),
      });
    }
    // Skyreach.
    ISLANDS.forEach((isl, i) => {
      const x0 = sky.start + isl.cx;
      for (let k = -1; k <= 1; k++) {
        const x = x0 + k * isl.half * 0.55;
        const top = islandTop(isl, x - sky.start) - 1;
        g.world.placeNode(
          k === 0
            ? i % 2
              ? 'starmetal_ore'
              : 'sunbloom'
            : k < 0
              ? 'sky_wood'
              : i % 3
                ? 'starmetal_ore'
                : 'water',
          x,
          g.floorNear(x, top - 10),
        );
      }
      if (i < ISLANDS.length - 1) {
        const x = x0 + isl.half * 0.25;
        g.world.addAnimal(
          ['sky_ram', 'cloud_slime', 'sky_ram'][i % 3],
          x,
          g.floorNear(x, isl.top - 20),
          { body: true, vx: 0, vy: 0 },
        );
        g.world.addAnimal(i % 2 ? 'harpy' : 'wind_wisp', x0, isl.top - 220, {
          body: true,
          vx: 0,
          vy: 0,
        });
      }
      if (i % 5 === 2)
        this.furnish(
          'dungeon_chest',
          x0 - isl.half * 0.3,
          g.floorNear(x0 - isl.half * 0.3, isl.top - 10),
          {
            kind: 'skyreach',
            store: this.roll([
              ['cloud_jar', 1, 1, 0.5],
              ['featherfall_potion', 1, 2, 1],
              ['fallen_star', 2, 4, 1],
              ['life_fruit', 1, 1, 0.3],
            ]),
          },
        );
    });
    for (let i = 0; i < 10; i++) {
      const x = sky.start + 400 + i * 900;
      g.world.addAnimal('cloud_slime', x, g.floorNear(x, 3860), { body: true, vx: 0, vy: 0 });
    }
    const nest = ISLANDS[ISLANDS.length - 1];
    this.furnish(
      'boss_altar',
      sky.start + nest.cx,
      g.floorNear(sky.start + nest.cx, nest.top - 20),
      { kind: 'tempest_roc' },
    );
    // The Hollow Void.
    for (let f = 0.07; f < 0.8; f += 0.04) {
      const x = voidDim.start + DIM_WIDTH * f + (g.rng() - 0.5) * 120;
      const kind = ['voidsteel_ore', 'void_wood', 'void_lily', 'voidsteel_ore', 'crystal'][
        Math.floor(g.rng() * 5)
      ];
      g.world.placeNode(kind, x, g.floorNear(x, VOID.floor(x - voidDim.start) - 20));
    }
    VOID.shards.forEach((sh, i) => {
      const x = voidDim.start + sh.cx;
      g.world.placeNode(i % 2 ? 'voidsteel_ore' : 'void_lily', x, g.floorNear(x, sh.top - 10));
      if (i % 3 === 1)
        this.furnish('dungeon_chest', x + 40, g.floorNear(x + 40, sh.top - 10), {
          kind: 'void',
          store: this.roll([
            ['void_essence', 3, 6, 1],
            ['greater_healing', 2, 3, 1],
            ['wrath_potion', 1, 2, 0.7],
            ['life_fruit', 1, 1, 0.4],
          ]),
        });
    });
    for (let i = 0; i < 22; i++) {
      const x = voidDim.start + DIM_WIDTH * (0.08 + (i / 22) * 0.72),
        y = g.floorNear(x, VOID.floor(x - voidDim.start) - 20);
      const type = ['void_stalker', 'void_wisp', 'watcher', 'void_wisp'][i % 4];
      g.world.addAnimal(type, x, MOBS[type].move === 'walker' ? y : y - 200, {
        body: true,
        vx: 0,
        vy: 0,
      });
    }
    const maw = voidDim.start + (VOID.maw.x0 + VOID.maw.x1) / 2;
    this.furnish('boss_altar', maw, g.floorNear(maw, VOID.floor(maw - voidDim.start) - 20), {
      kind: 'unmaker',
    });
  }

  // ─── Chests, altars, and the Rift ──────────────────────────────────────────
  openChest(st: Structure) {
    const items = Object.entries(st.store);
    if (!items.length) return { ok: false, reason: 'The chest is empty.' };
    for (const [id, n] of items) this.game.add(id, n);
    st.store = {};
    st.crop = 'open';
    this.game.sound('open', st.x, st.y);
    this.game.event('burst', st.x, st.y - 20, '#ffd86a');
    this.game.say(
      'Found ' + items.map(([id, n]) => n + ' ' + itemName(id)).join(', ') + '.',
      'victory',
    );
    return { ok: true, action: 'chest-loot' };
  }
  /** Sets every carried sigil into the gate. */
  socket() {
    const s = this.game.s;
    let added = 0;
    for (const id of SIGILS)
      if (this.game.count(id) && !s.rift.sigils.includes(id)) {
        this.game.remove(id);
        s.rift.sigils.push(id);
        added++;
      }
    for (const gate of s.structures.filter((st) => st.type === 'rift_gate')) {
      for (const id of s.rift.sigils) gate.store[id] = 1;
      gate.fuel = s.rift.sigils.length ? 1 : 0;
    }
    if (added) {
      this.game.sound('crystal');
      this.game.say('The sigil sinks into the stone. The Rift stirs.', 'victory');
    }
    return added;
  }
  unlocked(dim: string) {
    return this.game.s.rift.sigils.length >= (RIFT_NEEDS[dim] ?? 99);
  }
  travel(dimId: string) {
    const s = this.game.s,
      gate = s.structures.find((st) => st.type === 'rift_gate');
    if (!gate || dist(gate, s.player) > 170)
      return { ok: false, reason: 'Stand at the Rift Gate.' };
    const dim = DIMENSIONS.find((d) => d.id === dimId);
    if (!dim) return { ok: false, reason: 'No such place.' };
    if (!this.unlocked(dimId) && !this.game.dev.god)
      return {
        ok: false,
        reason: 'The Rift needs ' + RIFT_NEEDS[dimId] + ' sigils to reach the ' + dim.name + '.',
      };
    gate.store = { ...gate.store, [dimId]: 1 };
    const portal = s.structures.find((st) => st.type === 'portal' && st.store[dimId]);
    const x = portal ? portal.x + 70 : dim.start + dim.arrive;
    this.teleport(x, this.game.groundTopAt(x) + 1);
    this.game.progress.record('visit:' + dimId);
    this.game.say('You step through the Rift into the ' + dim.name + '.', 'victory');
    return { ok: true };
  }
  goHome() {
    const s = this.game.s,
      gate = s.structures.find((st) => st.type === 'rift_gate');
    const x = gate ? gate.x + 80 : RULES.spawnX;
    this.teleport(x, this.game.groundTopAt(x) + 1);
    this.game.say('The Rift folds you home.', 'good');
    return { ok: true };
  }
  teleport(x: number, y: number) {
    const p = this.game.s.player;
    this.game.event('burst', p.x, p.y - 30, '#b36cff');
    p.x = x;
    p.y = Math.min(y, this.game.floorNear(x, y - 60) + 1);
    p.vx = 0;
    p.vy = 0;
    p.invuln = 1.5;
    this.game.s.drops = this.game.s.drops.filter((d) => Math.abs(d.x - x) < 4000);
    this.game.sound('portal');
    this.game.event('burst', x, p.y - 30, '#b36cff');
  }
  /** Where the player is, in words, for the HUD. */
  placeName() {
    const p = this.game.s.player,
      d = dungeonAt(p.x, p.y - 20),
      dim = dimensionAt(p.x);
    return d ? d.def.name : dim ? dim.name : null;
  }

  // ─── Traps and falling stars ───────────────────────────────────────────────
  update(dt: number) {
    const s = this.game.s,
      p = s.player,
      t = s.elapsed;
    for (const st of s.structures) {
      if (!st.type.startsWith('trap_') || Math.abs(st.x - p.x) > 700) continue;
      if (st.type === 'trap_spikes' && Math.abs(st.x - p.x) < 26 && Math.abs(st.y - p.y) < 20) {
        st.triggeredAt = t;
        this.game.combat.hurtPlayer(24, 'Spikes');
      } else if (
        st.type === 'trap_dart' &&
        t - st.triggeredAt > 2.4 &&
        Math.abs(p.y - 20 - st.y) < 50 &&
        Math.abs(p.x - st.x) < 520
      ) {
        const dir = Math.sign(p.x - st.x) || 1;
        st.triggeredAt = t;
        this.game.combat.spawn(
          'dart',
          { x: st.x + dir * 10, y: st.y },
          dir > 0 ? 0 : Math.PI,
          520,
          22,
          'mob',
        );
        this.game.sound('dart', st.x, st.y, 0.9);
      } else if (st.type === 'trap_flame' && t - st.triggeredAt > 3) {
        st.triggeredAt = t;
        if (Math.abs(p.x - st.x) < 500) {
          this.game.combat.spawn(
            'flame_jet',
            { x: st.x, y: st.y - 8 },
            -Math.PI / 2,
            260,
            36,
            'mob',
          );
          this.game.sound('burn', st.x, st.y, 0.9);
        }
      }
    }
    // Stars fall on clear surface nights; five make a mana crystal.
    if (this.game.isNight() && !dimensionAt(p.x) && p.y < surfaceAt(p.x) + 200 && t > this.starAt) {
      this.starAt = t + 40 + this.game.rng() * 50;
      const x = clamp(p.x + (this.game.rng() - 0.5) * 1800, 60, 29940);
      this.game.drops.spawn('fallen_star', 1, x, surfaceAt(x) - 700);
      this.game.sound('star', x, surfaceAt(x) - 300, 0.8);
      this.game.say('A star falls somewhere nearby.', 'good');
    }
    void dt;
  }
}
