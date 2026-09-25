import { clamp } from '../../core/math.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { FOOD, MEAL_BUFFS, RAW } from '../../data/food.ts';
import { ACCESSORIES, ARMOR, BLOCKS, BUFFS } from '../../data/gear.ts';
import { WEAPONS } from '../../data/resources.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Consumables extends System {
  use(id: string) {
    const entry = this.game.s.inventory
      .filter((e) => e.id === id)
      .sort((a, b) => (a.fresh ?? Infinity) - (b.fresh ?? Infinity))[0];
    if (!entry) return { ok: false, reason: 'Not in your pack.' };
    const v = this.game.s.vitals;
    if (WEAPONS[id]) {
      this.game.s.player.weapon = id;
      this.game.sound('equip');
      this.game.say(itemName(id) + ' equipped.');
      return { ok: true };
    }
    const wear = (
      {
        direwolf_cloak: 'cloak',
        hide_coat: 'coat',
        explorer_boots: 'boots',
        cinder_ward: 'ward',
      } as Record<string, 'cloak' | 'coat' | 'boots' | 'ward'>
    )[id];
    if (wear) {
      const key = wear;
      this.game.s.player[key] = !this.game.s.player[key];
      this.game.sound('wear');
      this.game.say(itemName(id) + (this.game.s.player[key] ? ' worn.' : ' stowed.'));
      return { ok: true };
    }
    if (id === 'fishing_rod') return this.game.fish();
    if (ARMOR[id] || ACCESSORIES[id]) return this.game.equipment.wear(id);
    const drunk = this.game.equipment.drink(id);
    if (drunk) return drunk;
    if (BLOCKS[id] !== undefined || id === 'torch') {
      const slot = this.game.s.hotbar.indexOf(id);
      if (slot >= 0) this.game.equipment.select(slot);
      this.game.say(itemName(id) + ' in hand. Click where it should go.');
      return { ok: true };
    }
    if (ITEMS[id][1] === 'structure') {
      this.game.s.placing = id;
      this.game.say('Choose a nearby place for ' + itemName(id) + '.');
      return { ok: true };
    }
    const state = this.game.itemState(entry),
      // Stale food gives less; spoiled food may sicken you; rotten food will.
      worth = state === 'rotten' ? 0.1 : state === 'spoiled' ? 0.4 : state === 'stale' ? 0.65 : 1;
    const ail = this.game.ailments,
      chance = (p: number) => this.game.rng() < p;
    if (FOOD[id]) {
      const [cal, pro, vit] = FOOD[id];
      v.calories = clamp(v.calories + Math.max(3, cal * worth), 0, RULES.maxVital);
      v.protein = clamp(v.protein + pro * worth, 0, RULES.maxVital);
      v.vitamins = clamp(v.vitamins + vit * worth, 0, RULES.maxVital);
      v.morale = clamp(v.morale + (worth < 0.5 ? -7 : MEAL_BUFFS[id] ? 8 : 3), 0, RULES.maxVital);
      if (state === 'rotten' && chance(0.72))
        ail.contract(chance(0.5) ? 'dysentery' : 'fever', false, 'food');
      if (state === 'spoiled' && chance(0.35)) ail.contract('food_poisoning', false, 'spoiled');
      if (RAW.has(id)) {
        if (chance(0.48)) ail.contract('fever', false, 'food');
        if (chance(0.12)) ail.contract('tapeworm', false, 'food');
      }
      this.game.progress.record('eat:' + id);
      const buff = MEAL_BUFFS[id];
      if (buff && worth >= 0.65) {
        this.game.equipment.addBuff(buff[0], buff[1] * (1 + this.game.skills.get('meals')));
        this.game.say(`${BUFFS[buff[0]].name}: ${BUFFS[buff[0]].text.toLowerCase()}.`, 'good');
      }
    } else if (ITEMS[id]?.[1] === 'water') {
      v.hydration = clamp(v.hydration + (state === 'rotten' ? 15 : 27), 0, RULES.maxVital);
      if (id === 'wild_water' && chance(0.38)) ail.contract('dysentery', false, 'water');
      if (id === 'brackish_water') {
        if (chance(0.45)) ail.contract('cholera', false, 'water');
        if (chance(0.3)) ail.contract('dysentery', false, 'water');
      }
      if (state === 'rotten' && chance(0.6)) ail.contract('dysentery', false, 'water');
      if (id === 'boiled_water' && state !== 'rotten')
        this.game.progress.record('drink:boiled_water');
      ail.treat(id);
    } else if (ITEMS[id]?.[1] === 'medicine') {
      const weak = state === 'rotten';
      if (id === 'herbal_tea') v.hydration = clamp(v.hydration + 22, 0, RULES.maxVital);
      if (id === 'rehydration_salts') v.hydration = clamp(v.hydration + 40, 0, RULES.maxVital);
      if (id === 'warming_brew') {
        v.hydration = clamp(v.hydration + 16, 0, RULES.maxVital);
        v.bodyTemp = clamp(v.bodyTemp + 1.8, 30, 41);
        v.morale = clamp(v.morale + 8, 0, RULES.maxVital);
      }
      if (id === 'antibiotic') {
        v.infection = clamp(v.infection - 70, 0, RULES.maxVital);
        v.illness = clamp(v.illness - 55, 0, RULES.maxVital);
      }
      if (id === 'poultice') v.infection = clamp(v.infection - (weak ? 7 : 42), 0, RULES.maxVital);
      if (['herbal_tea', 'fever_remedy', 'antivenom'].includes(id))
        v.illness = clamp(v.illness - (weak ? 8 : 45), 0, RULES.maxVital);
      if (id === 'field_vaccine') ail.vaccinate();
      if (id === 'iron_gut_brew') {
        this.game.equipment.addBuff('iron_gut', MEAL_BUFFS.iron_gut_brew[1]);
        this.game.say(`${BUFFS.iron_gut.name}: ${BUFFS.iron_gut.text.toLowerCase()}.`, 'good');
      }
      // Spoiled medicine has lost its strength.
      const helped = weak ? false : ail.treat(id);
      if (
        !helped &&
        ![
          'herbal_tea',
          'warming_brew',
          'antibiotic',
          'field_vaccine',
          'iron_gut_brew',
          'poultice',
        ].includes(id)
      ) {
        if (weak) return { ok: false, reason: 'It has spoiled and lost its strength.' };
        return { ok: false, reason: 'Nothing it treats ails you.' };
      }
    } else return { ok: false, reason: 'This item is a crafting material.' };
    this.game.remove(id);
    this.game.sound(FOOD[id] ? 'eat' : ITEMS[id]?.[1] === 'water' ? 'drink' : 'medicine');
    this.game.say(
      (state === 'rotten' || state === 'spoiled' ? 'Consumed spoiled ' : 'Used ') +
        itemName(id).toLowerCase() +
        '.',
      state === 'rotten' || state === 'spoiled' ? 'danger' : 'good',
    );
    return { ok: true };
  }
}
