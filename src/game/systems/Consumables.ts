import { clamp } from '../../core/math.ts';
import { ITEMS, itemName } from '../../data/items.ts';
import { WEAPONS } from '../../data/resources.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Consumables extends System {
  use(id: string) {
    const entry = this.game.s.inventory
      .filter((e) => e.id === id)
      .sort((a, b) => (a.fresh ?? Infinity) - (b.fresh ?? Infinity))[0];
    if (!entry) return { ok: false, reason: 'Not in your pack.' };
    const v = this.game.s.vitals,
      rotten = this.game.itemState(entry) === 'rotten';
    if (WEAPONS[id]) {
      this.game.s.player.weapon = id;
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
      this.game.say(itemName(id) + (this.game.s.player[key] ? ' worn.' : ' stowed.'));
      return { ok: true };
    }
    if (id === 'fishing_rod') return this.game.fish();
    if (ITEMS[id][1] === 'structure') {
      this.game.s.placing = id;
      this.game.say('Choose a nearby place for ' + itemName(id) + '.');
      return { ok: true };
    }
    const food: Record<string, [number, number]> = {
      berry: [8, 0],
      mushroom: [9, 2],
      honey: [13, 0],
      wheat: [4, 2],
      potato: [14, 3],
      raw_meat: [21, 21],
      cooked_meat: [29, 25],
      bread: [27, 6],
      cactus_fruit: [11, 1],
      raw_fish: [16, 18],
      cooked_fish: [25, 22],
      smoked_meat: [38, 32],
      trail_ration: [48, 28],
      potato_stew: [41, 20],
    };
    if (food[id]) {
      v.calories = clamp(v.calories + (rotten ? 3 : food[id][0]), 0, RULES.maxVital);
      v.protein = clamp(v.protein + (rotten ? 0 : food[id][1]), 0, RULES.maxVital);
      v.morale = clamp(v.morale + (rotten ? -7 : 3), 0, RULES.maxVital);
      if (rotten && this.game.rng() < 0.72)
        this.game.contract(this.game.rng() < 0.5 ? 'dysentery' : 'fever');
      if ((id === 'raw_meat' || id === 'raw_fish') && this.game.rng() < 0.48)
        this.game.contract('fever');
    } else if (id === 'wild_water' || id === 'boiled_water') {
      v.hydration = clamp(v.hydration + (rotten ? 15 : 27), 0, RULES.maxVital);
      if ((id === 'wild_water' && this.game.rng() < 0.38) || (rotten && this.game.rng() < 0.6))
        this.game.contract('dysentery');
      if (id === 'boiled_water' && !rotten) this.game.progress.record('drink:boiled_water');
    } else if (
      [
        'herbal_tea',
        'poultice',
        'fever_remedy',
        'antibiotic',
        'antivenom',
        'warming_brew',
      ].includes(id)
    ) {
      if (id === 'herbal_tea') {
        v.hydration = clamp(v.hydration + 22, 0, RULES.maxVital);
        v.illness = clamp(v.illness - (rotten ? 8 : 45), 0, RULES.maxVital);
        if (this.game.s.disease === 'dysentery' && v.illness < 15) this.game.s.disease = null;
      }
      if (id === 'fever_remedy') {
        v.illness = clamp(v.illness - (rotten ? 7 : 48), 0, RULES.maxVital);
        if (this.game.s.disease === 'fever' && v.illness < 15) this.game.s.disease = null;
      }
      if (id === 'poultice') {
        v.infection = clamp(v.infection - (rotten ? 7 : 42), 0, RULES.maxVital);
        if (this.game.s.disease === 'wound' && v.infection < 15) this.game.s.disease = null;
      }
      if (id === 'antibiotic') {
        v.infection = clamp(v.infection - 70, 0, RULES.maxVital);
        v.illness = clamp(v.illness - 55, 0, RULES.maxVital);
        this.game.s.disease = null;
      }
      if (id === 'antivenom') {
        v.illness = clamp(v.illness - 65, 0, RULES.maxVital);
        if (this.game.s.disease === 'poisoning') this.game.s.disease = null;
      }
      if (id === 'warming_brew') {
        v.hydration = clamp(v.hydration + 16, 0, RULES.maxVital);
        v.bodyTemp = clamp(v.bodyTemp + 1.8, 30, 41);
        v.morale = clamp(v.morale + 8, 0, RULES.maxVital);
      }
    } else return { ok: false, reason: 'This item is a crafting material.' };
    this.game.remove(id);
    this.game.say(
      (rotten ? 'Consumed spoiled ' : 'Used ') + itemName(id).toLowerCase() + '.',
      rotten ? 'danger' : 'good',
    );
    return { ok: true };
  }
}
