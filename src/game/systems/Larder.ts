import { dist } from '../../core/math.ts';
import type { GameResult, Structure } from '../../core/types.ts';
import { PACK_COOLING, STORAGE, meltRate, rotRate } from '../../data/food.ts';
import { WATERSKINS } from '../../data/clothing.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { surfaceAt } from '../../data/world.ts';

import { System } from './System.ts';

/** Seconds a unit of ice lasts in the pack at temperate air before melting to water. */
const ICE_IN_PACK = 700;

/**
 * Keeping food: rot runs faster in the heat, slower in the cold, and much slower in cold storage.
 * Storages hold food in their own larders and burn ice (or frost shards) to stay cold; ice melts
 * faster the hotter it is, including the ice in your pack.
 */
export class Larder extends System {
  private melt = 0;
  private freeze = 0;
  private warned = new Set<number>();

  spec(st: Structure) {
    return STORAGE[st.type];
  }
  /** Whether a storage is cold right now. */
  cold(st: Structure) {
    const spec = this.spec(st);
    if (!spec) return false;
    if (!spec.fuel) return true;
    if (st.type === 'snow_cellar' && this.game.environment.temperatureAt(st.x, st.y - 20) <= 0)
      return true;
    return st.fuel > 0;
  }
  /** The rot multiplier inside a storage. */
  multiplier(st: Structure) {
    const spec = this.spec(st)!;
    if (!this.cold(st)) return 1;
    // A cool pit dug below the surface keeps better.
    if (st.type === 'cool_pit' && st.y > surfaceAt(st.x) + 60) return 0.45;
    return spec.mult;
  }
  /** Seconds of cold a storage has left (Infinity if it needs none). */
  coldLeft(st: Structure) {
    const spec = this.spec(st);
    if (!spec?.fuel) return Infinity;
    const rate =
      st.type === 'frost_chest'
        ? 1
        : meltRate(this.game.environment.temperatureAt(st.x, st.y - 20));
    return rate ? st.fuel / rate : Infinity;
  }
  /** The best cold storage close enough to cool what you carry. */
  nearest() {
    const p = this.game.s.player;
    return this.game.s.structures
      .filter((st) => STORAGE[st.type] && dist(st, p) <= 135 && this.cold(st))
      .sort((a, b) => this.multiplier(a) - this.multiplier(b))[0];
  }
  /** Multiplier on rot in the pack from worn cooling charms. */
  packCooling() {
    const charm = this.game.equipment
      .worn()
      .accessories.reduce((k, id) => Math.min(k, PACK_COOLING[id] ?? 1), 1);
    // Preservers and a wayfarer's pack keep food longer still.
    return (
      charm *
      Math.max(0.2, 1 - this.game.skills.get('packRot')) *
      (this.game.equipment.has('wayfarer') ? 0.6 : 1)
    );
  }

  // ─── Stowing and taking ────────────────────────────────────────────────────
  stow(st: Structure, id: string, qty = 1): GameResult {
    const spec = this.spec(st);
    if (!spec) return { ok: false, reason: 'That is not cold storage.' };
    if (!ITEMS[id]?.[2])
      return { ok: false, reason: 'Only food, water, and medicine need the cold.' };
    const larder = (st.larder ??= []);
    // Stow the oldest first: that is what needs the cold most.
    const entries = this.game.s.inventory
      .filter((e) => e.id === id)
      .sort((a, b) => (a.fresh ?? 0) - (b.fresh ?? 0))
      .slice(0, qty);
    if (!entries.length) return { ok: false, reason: 'You have none.' };
    if (larder.length + entries.length > spec.capacity)
      return { ok: false, reason: `The ${spec.name.toLowerCase()} is full (${spec.capacity}).` };
    for (const e of entries) larder.push({ ...e });
    this.game.s.inventory = this.game.s.inventory.filter((e) => !entries.includes(e));
    this.game.equipment.tidy();
    this.game.sound('place', st.x, st.y, 0.5);
    return { ok: true };
  }
  take(st: Structure, id: string, qty = 1): GameResult {
    const larder = st.larder ?? [];
    const entries = larder
      .filter((e) => e.id === id)
      .sort((a, b) => (a.fresh ?? 0) - (b.fresh ?? 0))
      .slice(0, qty);
    if (!entries.length) return { ok: false, reason: 'None stored here.' };
    st.larder = larder.filter((e) => !entries.includes(e));
    for (const e of entries) this.game.s.inventory.push({ ...e });
    this.game.equipment.offer(id);
    this.game.sound('pickup', st.x, st.y, 0.5);
    return { ok: true };
  }
  /** Feeds a storage its cold: ice for iceboxes and cellars, frost shards for frost chests. */
  refuel(st: Structure): GameResult {
    const spec = this.spec(st);
    if (!spec?.fuel) return { ok: false, reason: 'It needs nothing to stay cold.' };
    if (!this.game.count(spec.fuel))
      return { ok: false, reason: `It needs ${itemName(spec.fuel).toLowerCase()}.` };
    this.game.remove(spec.fuel);
    st.fuel += (spec.per ?? 900) * (1 + this.game.skills.get('ice'));
    this.warned.delete(st.id);
    this.game.sound('place', st.x, st.y, 0.6);
    this.game.say(`${spec.name} cooled with ${itemName(spec.fuel).toLowerCase()}.`, 'good');
    return { ok: true };
  }

  // ─── Time passing ──────────────────────────────────────────────────────────
  /** Ages food in the pack and in every larder, burns storages' ice, and melts ice you carry. */
  advance(dt: number) {
    const s = this.game.s,
      env = this.game.environment,
      air = this.game.temperature(),
      near = this.nearest(),
      // Nothing rots in the Frozen Choir.
      cool = this.game.pocket.preserves()
        ? 0
        : this.packCooling() *
          (this.game.pocket.here() ? (this.game.pocket.season()?.rot ?? 1) : 1);
    // How long the storage beside you stays cold during this step (it may run out part way).
    const coolFor = near ? Math.min(dt, this.coldLeft(near)) : 0,
      mult = near ? this.multiplier(near) : 1;
    for (const e of s.inventory)
      if (e.fresh !== undefined) e.fresh -= (coolFor * mult + (dt - coolFor)) * rotRate(air) * cool;
    for (const st of s.structures) {
      const spec = STORAGE[st.type];
      if (!spec) continue;
      const temp = env.temperatureAt(st.x, st.y - 20),
        k = this.multiplier(st) * rotRate(temp);
      for (const e of st.larder ?? []) if (e.fresh !== undefined) e.fresh -= dt * k;
      if (spec.fuel && st.fuel > 0 && !(st.type === 'snow_cellar' && temp <= 0)) {
        st.fuel = Math.max(0, st.fuel - dt * (st.type === 'frost_chest' ? 1 : meltRate(temp)));
        // A fair warning before food starts to spoil.
        if (st.fuel < 120 && st.larder?.length && !this.warned.has(st.id) && dt < 5) {
          this.warned.add(st.id);
          this.game.say(`Your ${spec.name.toLowerCase()} is running out of cold.`, 'danger');
        }
      }
    }
    // Ice harvesters cut ice wherever it freezes: one block every two minutes, ten at most.
    for (const st of s.structures)
      if (st.type === 'ice_harvester' && env.temperatureAt(st.x, st.y - 20) <= 0) {
        st.fuel += dt;
        while (st.fuel >= 120) {
          st.fuel -= 120;
          st.store.ice = Math.min(10, (st.store.ice ?? 0) + 1);
        }
      }
    // Water in the pack freezes in hard cold, unless it is in an insulated flask.
    const skin = this.game.equipment.waterskin();
    if (air < -4 && !near && !this.game.nearLitFire() && !(skin && WATERSKINS[skin].freezeProof)) {
      const water = ['wild_water', 'boiled_water', 'filtered_water'].find((id) =>
        this.game.count(id),
      );
      if (water) {
        this.freeze += dt;
        if (this.freeze >= 240) {
          this.freeze = 0;
          this.game.remove(water);
          this.game.add('ice');
          if (dt < 5)
            this.game.say(
              'A water in your pack has frozen solid. An insulated flask would stop it.',
              'ink',
            );
        }
      }
    }
    // Ice in the pack melts unless you are somewhere freezing, beside cold storage, or in a cold box.
    if (this.game.count('ice') && !near && air > 0 && !this.game.count('cold_box')) {
      this.melt += dt * meltRate(air) * cool;
      while (this.melt >= ICE_IN_PACK && this.game.count('ice')) {
        this.melt -= ICE_IN_PACK;
        this.game.remove('ice');
        this.game.add('wild_water');
        if (dt < 5) this.game.say('Some of your ice has melted.', 'ink');
      }
    }
  }
}
