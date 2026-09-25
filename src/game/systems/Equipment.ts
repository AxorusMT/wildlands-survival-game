import { clamp } from '../../core/math.ts';
import {
  ACCESSORIES,
  ARMOR,
  ARMOR_SETS,
  BLOCKS,
  BUFFS,
  CRYSTALS,
  POTIONS,
  RANGED,
} from '../../data/gear.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { RELIC_EFFECTS } from '../../data/codex.ts';
import { WALLS } from '../../data/town.ts';
import { TOOL_TIERS, WEAPONS } from '../../data/resources.ts';

import { System } from './System.ts';

export const HOTBAR_SLOTS = 10;
/** Kinds of item that earn a quick slot when first picked up. */
const QUICK = new Set([
  'tool',
  'weapon',
  'structure',
  'block',
  'potion',
  'food',
  'medicine',
  'water',
  'key',
]);

/** The hotbar, worn armour and accessories, timed buffs, mana, and life and mana crystals. */
export class Equipment extends System {
  // ─── Hotbar ────────────────────────────────────────────────────────────────
  /** The item in the active slot, if the pack still holds one. */
  held(): string | null {
    const s = this.game.s,
      id = s.hotbar[s.hotbarIndex];
    return id && this.game.count(id) > 0 ? id : null;
  }
  select(index: number) {
    const s = this.game.s;
    s.hotbarIndex = ((index % HOTBAR_SLOTS) + HOTBAR_SLOTS) % HOTBAR_SLOTS;
    const id = this.held();
    // Holding a weapon readies it; everything else leaves the last weapon ready for F.
    if (id && WEAPONS[id]) s.player.weapon = id;
    if (id && ITEMS[id]?.[1] !== 'structure') s.placing = null;
  }
  /** Puts a newly carried item in the first free quick slot. */
  offer(id: string) {
    const s = this.game.s;
    const kind = ITEMS[id]?.[1] ?? (BLOCKS[id] ? 'block' : '');
    if (!QUICK.has(kind) && !BLOCKS[id]) return;
    if (s.hotbar.includes(id)) return;
    const free = s.hotbar.indexOf(null);
    if (free >= 0) s.hotbar[free] = id;
  }
  /** Clears quick slots whose item has run out. */
  tidy() {
    const s = this.game.s;
    for (let i = 0; i < s.hotbar.length; i++) {
      const id = s.hotbar[i];
      if (id && this.game.count(id) <= 0) s.hotbar[i] = null;
    }
  }
  assign(index: number, id: string | null) {
    const s = this.game.s;
    if (id) {
      const at = s.hotbar.indexOf(id);
      if (at >= 0) s.hotbar[at] = s.hotbar[index];
    }
    s.hotbar[index] = id;
  }

  // ─── Armour and accessories ────────────────────────────────────────────────
  /** Puts on or takes off a piece of armour or an accessory. */
  wear(id: string) {
    const p = this.game.s.player,
      s = this.game.s;
    const piece = ARMOR[id];
    if (piece) {
      p.armor ??= {};
      if (p.armor[piece.slot] === id) {
        delete p.armor[piece.slot];
        this.game.say(itemName(id) + ' taken off.');
      } else {
        p.armor[piece.slot] = id;
        this.game.say(itemName(id) + ' worn.', 'good');
      }
      this.game.sound('wear');
      return { ok: true };
    }
    if (ACCESSORIES[id]) {
      const i = s.accessories.indexOf(id);
      if (i >= 0) {
        s.accessories.splice(i, 1);
        this.game.say(itemName(id) + ' taken off.');
      } else {
        if (s.accessories.length >= 3)
          return { ok: false, reason: 'Three accessories at most. Remove one first.' };
        s.accessories.push(id);
        this.game.say(itemName(id) + ' worn · ' + ACCESSORIES[id].text + '.', 'good');
      }
      this.game.sound('wear');
      return { ok: true };
    }
    return { ok: false, reason: 'That cannot be worn.' };
  }
  /** Worn armour and accessories that are still in the pack. */
  worn() {
    const p = this.game.s.player,
      has = (id?: string) => !!id && this.game.count(id) > 0;
    const armor = Object.values(p.armor ?? {}).filter(has) as string[];
    return { armor, accessories: this.game.s.accessories.filter(has) };
  }
  /** The set whose three pieces are all worn, if any. */
  fullSet(): string | null {
    const { armor } = this.worn();
    if (armor.length < 3) return null;
    const set = ARMOR[armor[0]].set;
    return armor.every((id) => ARMOR[id].set === set) ? set : null;
  }
  /** Everything that bends the rules right now: set bonus, accessories, and buffs. */
  effects(): Set<string> {
    const out = new Set<string>(),
      set = this.fullSet();
    if (set) out.add(ARMOR_SETS.find((x) => x.key === set)!.bonus);
    for (const id of this.worn().accessories) for (const e of ACCESSORIES[id].effects) out.add(e);
    for (const [id, left] of Object.entries(this.game.s.buffs)) if (left > 0) out.add('buff:' + id);
    // Relics set on a shelf at camp lend their gifts wherever you are.
    for (const id of this.game.shelvedRelics()) for (const e of RELIC_EFFECTS[id] ?? []) out.add(e);
    if (this.townCache.at !== Math.floor(this.game.s.elapsed)) {
      this.townCache = { at: Math.floor(this.game.s.elapsed), near: this.game.town.townNear() };
    }
    if (this.townCache.near >= 2) out.add('home');
    return out;
  }
  has(effect: string) {
    return this.effects().has(effect);
  }
  defense() {
    const fx = this.effects();
    let d = this.worn().armor.reduce((n, id) => n + ARMOR[id].defense, 0);
    if (fx.has('defense2')) d += 2;
    if (fx.has('defense3')) d += 3;
    if (fx.has('defense4')) d += 4;
    if (fx.has('void')) d += 8;
    if (fx.has('buff:ironskin')) d += 8;
    const sk = this.game.skills.stats();
    d += sk.defense + (sk.juggernaut ? 15 : 0) + (fx.has('vanguard') ? 3 : 0);
    // Realm sets: bonewalker plate and amberguard add to the ward they carry.
    if (this.fullSet() === 'bonewalker') d += 3;
    if (this.fullSet() === 'amberguard') d += 2;
    if (this.fullSet() === 'leviathan') d += 3;
    if (this.fullSet() === 'forgeborn') d += 4;
    // A Phalanx spear or Juggernaut hammer guards you while it is your ready weapon.
    d += this.game.armoury.stats(this.game.s.player.weapon).defense;
    return d;
  }
  /** Multiplier on damage dealt, from sets, accessories, and buffs. */
  damageBonus(magic = false) {
    const fx = this.effects();
    let k = 1;
    if (fx.has('damage10')) k += 0.1;
    if (fx.has('void')) k += 0.2;
    if (fx.has('buff:wrath')) k += 0.15;
    if (fx.has('buff:fiery') || fx.has('buff:feasted')) k += 0.1;
    if (magic && (fx.has('mana40') || fx.has('magic15'))) k += 0.15;
    return k;
  }
  speedBonus() {
    const fx = this.effects();
    return (
      1 +
      (fx.has('buff:swiftness') ? 0.25 : 0) +
      (fx.has('speed20') ? 0.2 : 0) +
      (fx.has('speed10') ? 0.1 : 0) +
      (fx.has('speed') ? 0.2 : 0) +
      (fx.has('cold') ? 0.1 : 0) +
      (fx.has('buff:sweet') ? 0.1 : 0) +
      (this.fullSet() === 'saltwarden' || this.fullSet() === 'ashwalker' ? 0.1 : 0) +
      this.game.skills.get('speed') -
      (this.game.skills.flag('juggernaut') ? 0.1 : 0) +
      (this.game.skills.flag('wanderer') ? 0.15 : 0)
    );
  }

  // ─── Health, mana, buffs ───────────────────────────────────────────────────
  /** Health from crystals and fruit alone; skills add to it. */
  private heart() {
    return this.game.s.maxHealth || CRYSTALS.baseHealth;
  }
  maxHealth() {
    return this.heart() + this.game.skills.get('maxHp');
  }
  maxMana() {
    const fx = this.effects();
    return (
      (this.game.s.maxMana || CRYSTALS.baseMana) +
      (fx.has('mana40') || fx.has('arcanist') ? 40 : 0) +
      this.game.skills.get('maxMana')
    );
  }
  heal(amount: number) {
    const v = this.game.s.vitals;
    v.health = clamp(v.health + amount, 0, this.maxHealth());
  }
  addBuff(id: string, seconds: number) {
    this.game.s.buffs[id] = Math.max(this.game.s.buffs[id] ?? 0, seconds);
  }
  /** Drinks, crystals, and fruit: anything with an instant or timed effect. */
  drink(id: string) {
    const s = this.game.s;
    if (id === 'life_crystal' || id === 'life_fruit') {
      const cap = CRYSTALS.baseHealth + CRYSTALS.lifeMax + (id === 'life_fruit' ? 100 : 0);
      if (this.heart() >= cap) return { ok: false, reason: 'Your heart can hold no more.' };
      if (id === 'life_fruit' && this.heart() < CRYSTALS.baseHealth + CRYSTALS.lifeMax)
        return { ok: false, reason: 'Life crystals must fill your heart first.' };
      s.maxHealth = this.heart() + CRYSTALS.lifePer;
      this.heal(CRYSTALS.lifePer);
      this.game.remove(id);
      this.game.sound('crystal');
      this.game.say('Your heart grows stronger · ' + s.maxHealth + ' health.', 'victory');
      return { ok: true };
    }
    if (id === 'mana_crystal') {
      if ((s.maxMana || CRYSTALS.baseMana) >= CRYSTALS.baseMana + CRYSTALS.manaMax)
        return { ok: false, reason: 'Your mind can hold no more.' };
      s.maxMana = (s.maxMana || CRYSTALS.baseMana) + CRYSTALS.manaPer;
      s.mana = this.maxMana();
      this.game.remove(id);
      this.game.sound('crystal');
      this.game.say('Starlight fills you · ' + s.maxMana + ' mana.', 'victory');
      return { ok: true };
    }
    const potion = POTIONS[id];
    if (!potion) return null;
    if (potion.heal) {
      if ((s.buffs.potion_sickness ?? 0) > 0)
        return { ok: false, reason: 'Your body needs a moment before another draught.' };
      this.heal(potion.heal * (1 + this.game.skills.get('heal')));
      this.addBuff('potion_sickness', 45);
    }
    if (potion.mana) s.mana = clamp(s.mana + potion.mana, 0, this.maxMana());
    if (potion.buff) this.addBuff(potion.buff[0], potion.buff[1]);
    this.game.remove(id);
    this.game.sound('potion');
    this.game.say(
      itemName(id) + (potion.buff ? ' · ' + BUFFS[potion.buff[0]].text : '') + '.',
      'good',
    );
    return { ok: true };
  }
  /** Buffs wear off, mana returns, and regenerating effects heal. */
  update(dt: number) {
    const s = this.game.s,
      fx = this.effects();
    for (const id of Object.keys(s.buffs)) {
      s.buffs[id] -= dt;
      if (s.buffs[id] <= 0) {
        delete s.buffs[id];
        if (id !== 'potion_sickness') this.game.say(BUFFS[id]?.name + ' wore off.');
      }
    }
    const sinceCast = s.elapsed - (this.lastCast ?? -9);
    s.mana = clamp(
      s.mana +
        dt *
          (sinceCast > 1.2 ? 7 : 1.5) *
          (fx.has('buff:clear_mind') ? 2 : 1) *
          (1 + this.game.skills.get('manaRegen')),
      0,
      this.maxMana(),
    );
    let regen = 0;
    if (fx.has('regen') || this.fullSet() === 'druid') regen += 0.6;
    if (fx.has('buff:regeneration')) regen += 1.2;
    if (fx.has('spores')) regen += 0.5;
    if (fx.has('home')) regen += 0.35;
    if (fx.has('buff:well_fed') || fx.has('buff:feasted')) regen += 0.4;
    regen *= this.game.ailments.regenScale();
    if (regen && !s.dead) this.heal(regen * dt);
    if (fx.has('stamina')) s.vitals.stamina = clamp(s.vitals.stamina + dt * 2, 0, 100);
  }
  lastCast?: number;
  private townCache = { at: -1, near: 0 };
  spendMana(n: number) {
    const s = this.game.s;
    if (s.mana < n) return false;
    s.mana -= n;
    this.lastCast = s.elapsed;
    return true;
  }
  /** What using the held item does, for the interface's prompt. */
  useKind(
    id: string | null,
  ):
    | 'block'
    | 'wall'
    | 'hammer'
    | 'structure'
    | 'pick'
    | 'axe'
    | 'melee'
    | 'bow'
    | 'magic'
    | 'consume'
    | 'wear'
    | 'none' {
    if (!id) return 'none';
    if (BLOCKS[id] !== undefined) return 'block';
    if (WALLS[id] !== undefined) return 'wall';
    const cat = ITEMS[id]?.[1];
    if (cat === 'structure') return 'structure';
    if (TOOL_TIERS[id]) return TOOL_TIERS[id][0];
    if (RANGED[id]) return RANGED[id].kind === 'bow' ? 'bow' : 'magic';
    if (WEAPONS[id]) return 'melee';
    if (ARMOR[id] || ACCESSORIES[id]) return 'wear';
    if (cat && ['food', 'water', 'medicine', 'potion'].includes(cat)) return 'consume';
    return 'none';
  }
}
