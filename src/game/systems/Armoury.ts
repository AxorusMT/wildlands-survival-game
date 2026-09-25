import type { GameResult } from '../../core/types.ts';
import { ARMOR_SETS, RANGED } from '../../data/gear.ts';
import { itemName } from '../../data/items.ts';
import { WEAPONS } from '../../data/resources.ts';
import {
  EVOLUTIONS,
  GEMS,
  LEVEL_DAMAGE,
  MAX_LEVEL,
  QUALITIES,
  WEAPON_CLASS,
  anvilFor,
  familyById,
  infusionById,
  reforgeCost,
  rollQuality,
  upgradeCost,
  type FamilyId,
  type WeaponMods,
} from '../../data/weapons.ts';

import { System } from './System.ts';

/** What the armoury remembers of one weapon: its quality, level, infusion, gems, and evolutions. */
export interface ArmouryEntry {
  q: number;
  lvl: number;
  inf?: string;
  gems: string[];
  evo: string[];
}

/** Everything a weapon does once its upgrades are counted. */
export interface WeaponStats {
  id: string;
  family: FamilyId;
  tier: number;
  damage: number;
  reach: number;
  /** Multiplier on the time between blows or shots. */
  pace: number;
  crit: number;
  count: number;
  pierce: number;
  bleed: number;
  poison: number;
  heal: number;
  execute: number;
  berserk: number;
  boss: number;
  homing: number;
  mana: number;
  defense: number;
  stagger: boolean;
  sunder: number;
  mark: number;
  combo: number;
  magic: number;
  armorPierce: number;
  infusion?: string;
}

const DEFAULT: ArmouryEntry = { q: 1, lvl: 0, gems: [], evo: [] };

/**
 * The weapon hierarchy at work. Every weapon has a family and a tier; the armoury keeps one
 * record per weapon kind you own: its quality (rolled when first found), its level (+1 to +10
 * at the anvil, with an evolution chosen at +5 and +10), its infusion, and its socketed gems.
 */
export class Armoury extends System {
  private get all() {
    return (this.game.s.armoury ??= {});
  }
  entry(id: string): ArmouryEntry {
    return this.all[id] ?? DEFAULT;
  }
  known(id: string) {
    return !!this.all[id];
  }
  /** Family and tier of a weapon; older or odd weapons are classed by what they do. */
  classOf(id: string): [FamilyId, number] {
    const c = WEAPON_CLASS[id];
    if (c) return c;
    const tier = WEAPONS[id]?.[0] ?? 1,
      r = RANGED[id];
    return [r ? (r.kind === 'bow' ? 'bow' : 'staff') : 'blade', tier];
  }
  /** First time a weapon comes into the pack: roll its quality. */
  acquire(id: string, luck = 1) {
    if (!WEAPONS[id] || id === 'fists' || this.all[id]) return;
    const q = rollQuality(this.game.rng, luck);
    this.all[id] = { q, lvl: 0, gems: [], evo: [] };
    this.game.progress.record('weapon:' + id);
    this.game.progress.record('family:' + this.classOf(id)[0]);
    if (q >= 2)
      this.game.say(
        `${QUALITIES[q].name} ${itemName(id).toLowerCase()}!`,
        q >= 3 ? 'victory' : 'good',
      );
  }
  /** The weapon's full name: quality, name, and level. */
  title(id: string) {
    const e = this.entry(id);
    return `${e.q !== 1 ? QUALITIES[e.q].name + ' ' : ''}${itemName(id)}${e.lvl ? ' +' + e.lvl : ''}`;
  }
  /** The weapon's mods from evolutions and gems, summed. */
  private mods(id: string) {
    const e = this.entry(id),
      [family] = this.classOf(id),
      evos = EVOLUTIONS[family].flat(),
      out: WeaponMods & { magic?: number; armorPierce?: number } = {};
    const add = (m: WeaponMods & { magic?: number; armorPierce?: number }) => {
      for (const [k, v] of Object.entries(m) as [keyof typeof out, number | boolean][])
        if (typeof v === 'boolean') (out as Record<string, unknown>)[k] = v || !!out[k];
        else (out as Record<string, number>)[k] = ((out[k] as number) ?? 0) + v;
    };
    for (const id2 of e.evo) {
      const evo = evos.find((x) => x.id === id2);
      if (evo) add(evo.mods);
    }
    for (const g of e.gems) if (GEMS[g]) add(GEMS[g].mods);
    return out;
  }
  stats(id: string): WeaponStats {
    const e = this.entry(id),
      [family, tier] = this.classOf(id),
      f = familyById(family)!,
      m = this.mods(id),
      base = WEAPONS[id] ?? WEAPONS.fists,
      sk = this.game.skills.stats(),
      mastery = id === 'fists' ? 0 : this.game.skills.mastery(family),
      set = this.game.equipment.fullSet();
    // Skills and mastery lift each kind of weapon in their own way.
    const melee = !f.ranged,
      heavy = family === 'greatsword' || family === 'battleaxe' || family === 'warhammer',
      shooter = family === 'bow' || family === 'crossbow',
      magic = f.ranged === 'magic';
    const lift =
      1 +
      (melee ? sk.meleeDmg : 0) +
      (heavy ? sk.heavyDmg : 0) +
      (shooter ? sk.rangedDmg + (set === 'gearwright' ? 0.1 : 0) : 0) +
      (magic
        ? sk.magicDmg +
          (sk.elementalist ? 0.15 : 0) +
          (set === 'prismweave' || set === 'astral' ? 0.1 : 0)
        : 0) +
      mastery * 0.01 +
      (mastery >= 20 ? 0.1 : 0);
    const quick = 1 + (melee ? sk.meleeSpeed : shooter ? sk.rangedSpeed : sk.castSpeed);
    const damage =
      base[1] * QUALITIES[e.q].mult * (1 + LEVEL_DAMAGE * e.lvl) * (1 + (m.dmg ?? 0)) * lift;
    return {
      id,
      family,
      tier,
      damage,
      reach: base[2] * (1 + (m.reach ?? 0) + (melee ? sk.reach : 0)),
      pace: Math.max(0.35, (f.pace + (m.pace ?? 0)) / quick) * (mastery >= 15 ? 0.95 : 1),
      crit:
        0.05 +
        (m.crit ?? 0) +
        sk.crit +
        (mastery >= 10 ? 0.05 : 0) +
        (set && ARMOR_SETS.find((x) => x.key === set)?.bonus === 'ranger' ? 0.1 : 0),
      count: m.count ?? 0,
      pierce: (m.pierce ?? 0) + (shooter ? sk.pierce : 0),
      bleed:
        ((family === 'battleaxe' ? 0.15 : 0) + (m.bleed ?? 0) + (shooter ? sk.rangedBleed : 0)) *
        (1 + sk.bleedDmg),
      poison: m.poison ?? 0,
      heal: (m.heal ?? 0) + (melee ? sk.lifesteal : magic ? sk.magicLifesteal : 0),
      execute: m.execute ?? 0,
      berserk: m.berserk ?? 0,
      boss: (m.boss ?? 0) + sk.bossDmg,
      homing: (m.homing ?? 0) + (f.ranged ? sk.homing : 0),
      mana: Math.max(
        0.3,
        (1 + (m.mana ?? 0) + sk.manaCost) *
          (set && ARMOR_SETS.find((x) => x.key === set)?.bonus === 'arcanist' ? 0.8 : 1),
      ),
      defense: m.defense ?? 0,
      stagger: family === 'warhammer' || !!m.stagger,
      sunder: family === 'warhammer' ? 4 + (m.sunder ?? 0) : 0,
      mark: family === 'whip' ? 0.15 + (m.mark ?? 0) : shooter ? sk.rangedMark : 0,
      combo: family === 'blade' ? (m.combo ?? 1.8) + sk.combo + (mastery >= 5 ? 0.1 : 0) : 1,
      magic: m.magic ?? 0,
      armorPierce: Math.min(0.9, m.armorPierce ?? 0),
      infusion: e.inf,
    };
  }
  // ─── The anvil ─────────────────────────────────────────────────────────────
  private atAnvil(id: string) {
    const [, tier] = this.classOf(id),
      station = anvilFor(tier);
    if (this.game.dev.god || this.game.near(station, 140)) return null;
    return `Stand at a ${itemName(station).toLowerCase()} to work a tier ${tier} weapon.`;
  }
  private owned(id: string) {
    if (!WEAPONS[id] || id === 'fists') return 'That is not a weapon.';
    if (!this.game.count(id)) return 'You do not carry that weapon.';
    return null;
  }
  private pay(cost: Record<string, number>) {
    if (this.game.dev.god) return true;
    if (!this.game.canAfford(cost)) return false;
    for (const [k, n] of Object.entries(cost)) this.game.remove(k, n);
    return true;
  }
  private record(id: string) {
    return (this.all[id] ??= { ...DEFAULT, gems: [], evo: [] });
  }
  /** Whether the weapon waits on a choice of evolution before it can climb further. */
  pendingEvolution(id: string): -1 | 0 | 1 {
    const e = this.entry(id);
    if (e.lvl >= 5 && e.evo.length < 1) return 0;
    if (e.lvl >= 10 && e.evo.length < 2) return 1;
    return -1;
  }
  upgrade(id: string): GameResult {
    const why = this.owned(id) ?? this.atAnvil(id);
    if (why) return { ok: false, reason: why };
    const e = this.record(id),
      [, tier] = this.classOf(id);
    if (e.lvl >= MAX_LEVEL) return { ok: false, reason: 'It can be improved no further.' };
    if (this.pendingEvolution(id) >= 0)
      return { ok: false, reason: 'Choose how it evolves first.' };
    const cost = upgradeCost(tier, e.lvl);
    if (!this.pay(cost))
      return {
        ok: false,
        reason:
          'The anvil wants ' +
          Object.entries(cost)
            .map(([k, n]) => `${n} ${itemName(k).toLowerCase()}`)
            .join(' and ') +
          '.',
      };
    e.lvl++;
    this.game.sound('craft_anvil');
    this.game.say(`${this.title(id)}.`, e.lvl === 5 || e.lvl === 10 ? 'victory' : 'good');
    this.game.progress.record('upgrade:' + e.lvl);
    if (e.lvl === 5 || e.lvl === 10)
      this.game.say('It can evolve: choose its path in the Armoury.', 'good');
    return { ok: true };
  }
  evolve(id: string, choice: 0 | 1): GameResult {
    const why = this.owned(id);
    if (why) return { ok: false, reason: why };
    const stage = this.pendingEvolution(id);
    if (stage < 0) return { ok: false, reason: 'Nothing to choose yet.' };
    const [family] = this.classOf(id),
      evo = EVOLUTIONS[family][stage === 1 ? 1 : 0][choice];
    this.record(id).evo.push(evo.id);
    this.game.sound('crystal');
    this.game.say(`${itemName(id)} becomes ${evo.name}: ${evo.text.toLowerCase()}.`, 'victory');
    return { ok: true };
  }
  /** Rerolls quality at the anvil. */
  reforge(id: string): GameResult {
    const why = this.owned(id) ?? this.atAnvil(id);
    if (why) return { ok: false, reason: why };
    const [, tier] = this.classOf(id),
      cost = reforgeCost(tier);
    if (!this.pay(cost)) return { ok: false, reason: 'Reforging needs more materials and marks.' };
    const e = this.record(id);
    e.q = rollQuality(this.game.rng, 1.2);
    e.gems = e.gems.slice(0, QUALITIES[e.q].sockets);
    this.game.sound('craft_anvil');
    this.game.say(`Reforged: ${this.title(id)}.`, e.q >= 3 ? 'victory' : 'good');
    return { ok: true };
  }
  infuse(id: string, infusion: string): GameResult {
    const why = this.owned(id);
    if (why) return { ok: false, reason: why };
    const inf = infusionById(infusion);
    if (!inf) return { ok: false, reason: 'No such infusion.' };
    if (!this.game.dev.god && !this.game.count(inf.item))
      return { ok: false, reason: `You need a ${itemName(inf.item).toLowerCase()}.` };
    if (!this.game.dev.god) this.game.remove(inf.item);
    this.record(id).inf = inf.id;
    this.game.sound('potion');
    this.game.say(
      `${itemName(id)} is infused with ${inf.name.toLowerCase()}: ${inf.text.toLowerCase()}.`,
      'good',
    );
    return { ok: true };
  }
  socket(id: string, gem: string): GameResult {
    const why = this.owned(id);
    if (why) return { ok: false, reason: why };
    if (!GEMS[gem]) return { ok: false, reason: 'That will not fit a socket.' };
    const e = this.record(id);
    if (e.gems.length >= QUALITIES[e.q].sockets)
      return {
        ok: false,
        reason: `A ${QUALITIES[e.q].name.toLowerCase()} weapon has no free socket.`,
      };
    if (!this.game.dev.god && !this.game.count(gem)) return { ok: false, reason: 'You have none.' };
    if (!this.game.dev.god) this.game.remove(gem);
    e.gems.push(gem);
    this.game.sound('crystal');
    this.game.say(
      `${GEMS[gem].name} set into ${itemName(id).toLowerCase()}: ${GEMS[gem].text}.`,
      'good',
    );
    return { ok: true };
  }
}
