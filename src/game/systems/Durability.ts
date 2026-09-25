import type { GameResult } from '../../core/types.ts';
import { CLOTHING } from '../../data/clothing.ts';
import { itemName } from '../../data/items.ts';
import { TOOL_TIERS, WEAPONS } from '../../data/resources.ts';
import { WEAPON_CLASS, anvilFor, tierOf } from '../../data/weapons.ts';

import { System } from './System.ts';

/** Seconds of darkness a lump of resin keeps a miner's lamp burning. */
export const LAMP_SECONDS = 300;

/**
 * Wear and repair. Weapons blunt with use, tools dull, and clothing wears through with hard
 * weather. Worn-out gear does not vanish: a blunted weapon strikes for half, a dull tool will not
 * cut its tier, and threadbare clothes keep nothing out, until they are mended at a station.
 */
export class Durability extends System {
  private warned = new Set<string>();

  private get map() {
    return (this.game.s.wear ??= {});
  }
  /** How worn an item is, 0 (new) to 100 (worn out). */
  wear(id: string) {
    return this.map[id] ?? 0;
  }
  broken(id: string) {
    return this.wear(id) >= 100;
  }
  /** Whether an item wears at all. */
  wears(id: string) {
    return id !== 'fists' && (!!WEAPONS[id] || !!TOOL_TIERS[id] || !!CLOTHING[id]);
  }
  private tier(id: string) {
    return WEAPON_CLASS[id]?.[1] ?? TOOL_TIERS[id]?.[1] ?? WEAPONS[id]?.[0] ?? 1;
  }
  /** Uses before a weapon or tool wears out. */
  uses(id: string) {
    const t = this.tier(id);
    return TOOL_TIERS[id] ? 300 + t * 100 : 500 + t * 120;
  }
  /** Wears an item by a number of uses (or, for clothing, seconds of hard weather). */
  use(id: string, n = 1) {
    if (!this.wears(id) || this.game.dev.god) return;
    const before = this.wear(id),
      per = CLOTHING[id] ? 100 / CLOTHING[id].life : 100 / this.uses(id);
    const after = Math.min(100, before + per * n);
    this.map[id] = after;
    if (before < 80 && after >= 80 && !this.warned.has(id + ':80')) {
      this.warned.add(id + ':80');
      this.game.say(`${itemName(id)} is badly worn. Mend it at a station soon.`, 'danger');
    }
    if (before < 100 && after >= 100) {
      this.game.say(
        `${itemName(id)} is worn out: ${CLOTHING[id] ? 'it keeps nothing out' : TOOL_TIERS[id] ? 'it will not cut its tier' : 'it strikes for half'} until mended.`,
        'danger',
      );
      this.game.sound('crumble');
    }
  }
  /** Where an item is mended, and what it costs. */
  station(id: string) {
    return CLOTHING[id] ? 'workbench' : anvilFor(this.tier(id));
  }
  cost(id: string): Record<string, number> {
    const w = this.wear(id);
    if (!w) return {};
    const scale = Math.ceil(w / 34);
    if (CLOTHING[id]) return { fiber: 2 * scale, hide: scale };
    const bar = tierOf(this.tier(id)).bar;
    return { [bar]: scale, coin: 4 * this.tier(id) * scale };
  }
  repair(id: string): GameResult {
    if (!this.wear(id)) return { ok: false, reason: 'It needs no mending.' };
    const where = this.station(id);
    if (!this.game.near(where) && !this.game.dev.god)
      return { ok: false, reason: `Mend it at a ${itemName(where).toLowerCase()}.` };
    const cost = this.cost(id);
    if (!this.game.dev.god) {
      if (!this.game.canAfford(cost))
        return {
          ok: false,
          reason:
            'Mending needs ' +
            Object.entries(cost)
              .map(([k, n]) => `${n} ${itemName(k).toLowerCase()}`)
              .join(' and ') +
            '.',
        };
      for (const [k, n] of Object.entries(cost)) this.game.remove(k, n);
    }
    this.map[id] = 0;
    this.warned.delete(id + ':80');
    this.game.sound(CLOTHING[id] ? 'craft_wood' : 'craft_anvil');
    this.game.say(`${itemName(id)} mended.`, 'good');
    return { ok: true };
  }
  /** Everything worn and carried that can be mended at the stations nearby. */
  mendable() {
    return [...new Set(this.game.s.inventory.map((e) => e.id))].filter(
      (id) => this.wear(id) > 0 && (this.game.near(this.station(id)) || this.game.dev.god),
    );
  }

  update(dt: number) {
    const s = this.game.s,
      p = s.player;
    // Clothing wears through in hard weather, slowly otherwise.
    const air = this.game.temperature(),
      rain = (s.weather === 'rain' || s.weather === 'storm') && !this.game.sheltered(),
      hard = air < 5 || air > 30 || rain ? 1 : 0.2;
    for (const id of this.game.equipment.clothes()) this.use(id, dt * hard);
    // The miner's lamp burns resin in the dark.
    if (
      this.game.equipment.worn().accessories.includes('miners_lamp') &&
      this.game.survival.dark()
    ) {
      s.lampFuel = (s.lampFuel ?? 0) - dt;
      if (s.lampFuel <= 0) {
        if (this.game.count('resin')) {
          this.game.remove('resin');
          s.lampFuel += LAMP_SECONDS;
        } else if (s.lampFuel > -dt * 1.5) {
          this.game.say("Your miner's lamp gutters out. It burns resin.", 'danger');
        }
      }
    }
    void p;
  }
}
