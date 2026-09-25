import type { GameResult } from '../../core/types.ts';
import { ARMOR, ARMOR_SETS } from '../../data/gear.ts';
import { itemName } from '../../data/items.ts';
import { ARMOR_GEMS, ARMOR_INFUSIONS, ARMOR_MAX_LEVEL } from '../../data/resist.ts';
import { anvilFor, infusionById } from '../../data/weapons.ts';

import { System } from './System.ts';

export interface ArmourMods {
  lvl: number;
  gems: string[];
  inf?: string;
}

/** Armour's own upgrade line, like a weapon's: levels at the anvil, gem sockets, and infusions. */
export class ArmourForge extends System {
  private get all() {
    return (this.game.s.armourMods ??= {});
  }
  mods(id: string): ArmourMods {
    return this.all[id] ?? { lvl: 0, gems: [] };
  }
  private record(id: string) {
    return (this.all[id] ??= { lvl: 0, gems: [] });
  }
  /** Sockets a piece has: two in a chestplate, one elsewhere. */
  sockets(id: string) {
    return ARMOR[id]?.slot === 'body' ? 2 : 1;
  }
  private set(id: string) {
    return ARMOR_SETS.find((s) => s.key === ARMOR[id]?.set);
  }
  cost(id: string): Record<string, number> {
    const s = this.set(id),
      lvl = this.mods(id).lvl;
    return { [s?.bar ?? 'iron_ingot']: 2 + lvl, coin: 20 * (lvl + 1) };
  }
  station(id: string) {
    return anvilFor(this.set(id)?.tier ?? 3);
  }
  upgrade(id: string): GameResult {
    if (!ARMOR[id] || !this.game.count(id))
      return { ok: false, reason: 'Carry the armour to work it.' };
    const m = this.record(id);
    if (m.lvl >= ARMOR_MAX_LEVEL)
      return { ok: false, reason: 'It is as strong as it can be made.' };
    if (!this.game.dev.god) {
      if (!this.game.near(this.station(id)))
        return { ok: false, reason: `Work it at a ${itemName(this.station(id)).toLowerCase()}.` };
      const cost = this.cost(id);
      if (!this.game.canAfford(cost)) return { ok: false, reason: 'More materials are needed.' };
      for (const [k, n] of Object.entries(cost)) this.game.remove(k, n);
    }
    m.lvl++;
    this.game.sound('craft_anvil');
    this.game.say(`${itemName(id)} strengthened to +${m.lvl}.`, 'good');
    this.game.progress.record('armour:' + m.lvl);
    return { ok: true };
  }
  socket(id: string, gem: string): GameResult {
    if (!ARMOR[id] || !this.game.count(id))
      return { ok: false, reason: 'Carry the armour to work it.' };
    if (!ARMOR_GEMS[gem]) return { ok: false, reason: 'That will not sit in armour.' };
    const m = this.record(id);
    if (m.gems.length >= this.sockets(id)) return { ok: false, reason: 'Its sockets are full.' };
    if (!this.game.dev.god) {
      if (!this.game.count(gem))
        return { ok: false, reason: `You need a ${itemName(gem).toLowerCase()}.` };
      this.game.remove(gem);
    }
    m.gems.push(gem);
    this.game.sound('crystal');
    this.game.say(
      `${itemName(gem)} set in ${itemName(id).toLowerCase()}: ${ARMOR_GEMS[gem].text.toLowerCase()}.`,
      'good',
    );
    return { ok: true };
  }
  infuse(id: string, infusion: string): GameResult {
    if (!ARMOR[id] || !this.game.count(id))
      return { ok: false, reason: 'Carry the armour to work it.' };
    const inf = infusionById(infusion);
    if (!inf || !ARMOR_INFUSIONS[infusion]) return { ok: false, reason: 'No such infusion.' };
    if (!this.game.dev.god) {
      if (!this.game.count(inf.item))
        return { ok: false, reason: `You need a ${itemName(inf.item).toLowerCase()}.` };
      this.game.remove(inf.item);
    }
    this.record(id).inf = infusion;
    this.game.sound('potion');
    this.game.say(
      `${itemName(id)} infused: ${ARMOR_INFUSIONS[infusion].text.toLowerCase()}.`,
      'good',
    );
    return { ok: true };
  }
  /** Everything worn armour adds: extra defense and the gems' and infusions' gifts. */
  totals() {
    const out = {
      defense: 0,
      damage: 0,
      mana: 0,
      crit: 0,
      speed: 0,
      regen: 0,
      gems: {} as Record<string, number>,
      infusions: new Set<string>(),
    };
    for (const id of this.game.equipment.worn().armor) {
      const m = this.mods(id);
      out.defense += m.lvl;
      for (const g of m.gems) out.gems[g] = (out.gems[g] ?? 0) + 1;
      if (m.inf) out.infusions.add(m.inf);
    }
    const n = (g: string) => out.gems[g] ?? 0;
    out.damage = 0.03 * n('ruby');
    out.mana = 10 * n('sapphire');
    out.crit = 0.02 * n('emerald');
    out.speed = 0.02 * n('topaz') + (out.infusions.has('storm') ? 0.03 : 0);
    out.defense += n('onyx');
    out.regen = 0.15 * n('opal');
    return out;
  }
}
