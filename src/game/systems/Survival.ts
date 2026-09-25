import { clamp, dist } from '../../core/math.ts';
import { DISEASES } from '../../data/diseases.ts';
import { ITEMS } from '../../data/items.ts';
import { NODES } from '../../data/resources.ts';
import { isAggressive } from '../../data/mobs.ts';
import { dimensionAt, surfaceAt } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Survival extends System {
  wash() {
    const water = this.game.count('wild_water')
      ? 'wild_water'
      : this.game.count('boiled_water')
        ? 'boiled_water'
        : null;
    if (!water) return { ok: false, reason: 'Carry some water to wash.' };
    this.game.remove(water);
    this.game.s.vitals.hygiene = clamp(
      this.game.s.vitals.hygiene + RULES.washHygieneGain,
      0,
      RULES.maxVital,
    );
    this.game.s.vitals.wetness = clamp(this.game.s.vitals.wetness + 7, 0, RULES.maxVital);
    this.game.say('Washed with water. Infection risk eases, but your clothes are damp.', 'good');
    return { ok: true };
  }
  contract(disease: string) {
    this.game.s.disease = disease;
    if (disease === 'wound')
      this.game.s.vitals.infection = Math.max(this.game.s.vitals.infection, 22);
    else this.game.s.vitals.illness = Math.max(this.game.s.vitals.illness, 24);
    this.game.s.vitals.morale = clamp(this.game.s.vitals.morale - 8, 0, RULES.maxVital);
    this.game.say(
      'Diagnosis: ' + DISEASES[disease].name + '. See Field Notes for treatment.',
      'danger',
    );
  }
  advanceDecay(dt: number) {
    const icebox = this.game.near('icebox', 135);
    const cooledFor = icebox ? Math.min(dt, icebox.fuel) : 0;
    for (const e of this.game.s.inventory)
      if (e.fresh !== undefined) e.fresh -= cooledFor * RULES.cooledSpoilageRate + (dt - cooledFor);
    for (const st of this.game.s.structures)
      if (st.fuel > 0 && ['campfire', 'icebox', 'lantern'].includes(st.type))
        st.fuel = Math.max(0, st.fuel - dt);
    for (const n of this.game.s.nodes)
      if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) {
        n.hp = NODES[n.kind].hp;
        delete n.felledAt;
      }
  }
  vitalReasons() {
    const v = this.game.s.vitals,
      causes = [];
    if (v.hydration < 25) causes.push('Thirst is damaging recovery');
    if (v.calories < 25) causes.push('Calories are dangerously low');
    if (v.protein < 20) causes.push('Protein deficiency weakens you');
    if (v.bodyTemp < 35) causes.push('Cold exposure is draining health');
    if (v.bodyTemp > 39) causes.push('Heat exposure is draining health');
    if (v.wetness > 40) causes.push('Wet clothing magnifies cold');
    if (v.fatigue > 75) causes.push('Fatigue slows movement and fighting');
    if (this.game.inLava()) causes.push('Molten rock is burning you; climb out');
    else if (this.heat() > 0)
      causes.push(
        this.game.s.player.ward
          ? 'The Cinder Ward holds back most of the heat'
          : 'Scorching heat; a Cinder Ward is needed below',
      );
    if (v.illness > 30) causes.push('Illness is worsening');
    if (v.infection > 25) causes.push('Infection is worsening; wash and treat it');
    if (v.hygiene < 25) causes.push('Poor hygiene increases infection');
    if (this.game.cooled()) causes.push('Icebox slows spoilage to 18%');
    if (!causes.length) causes.push('Stable · food, water, and warmth allow recovery');
    return causes;
  }
  recover() {
    if (!this.game.s.dead) return;
    this.game.s.dead = false;
    this.game.s.player.x = RULES.spawnX;
    this.game.s.player.y = this.game.groundTopAt(RULES.spawnX) + 1;
    this.game.s.player.vx = 0;
    this.game.s.player.vy = 0;
    this.game.s.player.grounded = true;
    Object.assign(this.game.s.vitals, {
      health: 55,
      hydration: 38,
      calories: 40,
      protein: 35,
      stamina: 65,
      fatigue: 45,
      bodyTemp: 37,
      wetness: 0,
      illness: 0,
      infection: 0,
      hygiene: 55,
      morale: 30,
    });
    this.game.s.disease = null;
    this.game.s.elapsed += 600;
    for (const e of this.game.s.inventory)
      if (ITEMS[e.id]?.[1] === 'material' || ITEMS[e.id]?.[1] === 'ore')
        e.qty = Math.ceil(e.qty * 0.75);
    this.game.say('You woke in the meadow. Some loose supplies were lost.', 'good');
  }
  private burnTimer = 0;
  /** Health lost per second to the heat of the hell layers. */
  heat() {
    const layer = this.game.layer().id,
      ward = this.game.s.player.ward ? 1 : 0,
      fx = this.game.equipment.effects();
    if (fx.has('lava') || fx.has('buff:fireward')) return 0;
    const k = fx.has('heat') ? 0.5 : 1;
    if (layer === 'upper_hell') return RULES.upperHellHeat[ward] * k;
    if (layer === 'lower_hell') return RULES.lowerHellHeat[ward] * k;
    return 0;
  }
  /** Health lost per second standing in lava, after wards and charms. */
  lavaBurn() {
    const fx = this.game.equipment.effects(),
      p = this.game.s.player;
    if (
      !this.game.inLava() ||
      fx.has('buff:fireward') ||
      this.game.equipment.fullSet() === 'cinder'
    )
      return 0;
    return RULES.lavaDamage[p.ward ? 1 : 0] * (fx.has('lava') ? 0.35 : fx.has('fire') ? 0.7 : 1);
  }
  // Exposure, hunger, illness, morale, and health drift for one tick.
  update(dt: number) {
    const v = this.game.s.vitals,
      p = this.game.s.player;
    const cold = this.game.temperature();
    const shelter = this.game.sheltered(),
      fire = !!this.game.nearLitFire();
    const rain =
      (this.game.s.weather === 'rain' || this.game.s.weather === 'storm') && !dimensionAt(p.x);
    const underground = p.y > surfaceAt(p.x) + 80;
    const marshWet = this.game.biome().id === 'marsh' && !shelter && !underground ? 0.065 : 0;
    v.wetness = clamp(
      v.wetness +
        dt * (rain && !shelter && !underground ? 0.28 : fire ? -0.35 : shelter ? -0.17 : -0.07) +
        dt * marshWet,
      0,
      100,
    );
    let target =
      37 +
      (cold - (underground ? 6 : 15)) * 0.19 -
      v.wetness * 0.022 +
      (fire ? 4.5 : 0) +
      (shelter ? 1.8 : 0) +
      (p.cloak && cold < 15 ? 2.7 : 0) +
      (p.coat && cold < 15 ? 1.4 : 0);
    if (this.game.equipment.has('cold')) target = Math.max(target, 36.8);
    target = clamp(target, 30, 41);
    v.bodyTemp += (target - v.bodyTemp) * dt * 0.012;
    v.hydration = clamp(
      v.hydration -
        dt *
          (0.045 +
            (cold > 26 ? 0.045 : 0) +
            (cold > 40 ? (p.ward ? 0.05 : 0.14) : 0) +
            (this.game.s.disease === 'dysentery' ? 0.055 : 0)),
      0,
      100,
    );
    v.calories = clamp(v.calories - dt * (p.moving ? 0.048 : 0.031), 0, RULES.maxVital);
    v.protein = clamp(v.protein - dt * 0.018, 0, RULES.maxVital);
    v.fatigue = clamp(v.fatigue + dt * (p.moving ? 0.029 : 0.014), 0, RULES.maxVital);
    v.hygiene = clamp(
      v.hygiene - dt * (this.game.biome().id === 'marsh' ? 0.025 : 0.011),
      0,
      RULES.maxVital,
    );
    v.stamina = clamp(
      v.stamina + dt * (p.moving ? 0.25 : v.hydration > 10 && v.calories > 10 ? 3.4 : 1.2),
      0,
      100,
    );
    if (this.game.s.disease && ['dysentery', 'fever', 'poisoning'].includes(this.game.s.disease))
      v.illness = clamp(
        v.illness + dt * (this.game.s.disease === 'poisoning' ? 0.07 : 0.025),
        0,
        RULES.maxVital,
      );
    else v.illness = clamp(v.illness - dt * 0.015, 0, RULES.maxVital);
    if (this.game.s.disease === 'wound')
      v.infection = clamp(v.infection + dt * (v.hygiene < 35 ? 0.045 : 0.02), 0, RULES.maxVital);
    else v.infection = clamp(v.infection - dt * 0.013, 0, RULES.maxVital);
    if (v.hygiene < 20 && v.infection > 0)
      v.infection = clamp(v.infection + dt * 0.024, 0, RULES.maxVital);
    const threats = this.game.s.animals.some(
      (a) => !a.deadUntil && isAggressive(a.type) && dist(a, p) < 150,
    );
    v.morale = clamp(
      v.morale +
        dt * (threats || v.illness > 45 ? -0.045 : fire && v.calories > 40 ? 0.025 : 0.004),
      0,
      100,
    );
    const burning = this.lavaBurn();
    const harm =
      burning +
      this.heat() +
      (v.hydration <= 0 ? 0.15 : 0) +
      (v.calories <= 0 ? 0.11 : 0) +
      (v.protein <= 0 ? 0.04 : 0) +
      (v.bodyTemp < 35 || v.bodyTemp > 39 ? 0.09 : 0) +
      (v.illness > 70 ? 0.08 : 0) +
      (v.infection > 65 ? 0.1 : 0);
    const most = this.game.maxHealth();
    if (harm) v.health = clamp(v.health - harm * dt, 0, most);
    else if (
      v.hydration > 50 &&
      v.calories > 50 &&
      v.protein > 25 &&
      v.bodyTemp > 36 &&
      v.bodyTemp < 38 &&
      v.illness < 20 &&
      v.infection < 20 &&
      !threats
    )
      v.health = clamp(v.health + dt * 0.018 * (most / 100), 0, most);
    if (v.health > most) v.health = most;
    if (burning || this.heat() > 0.5) {
      this.burnTimer -= dt;
      if (this.burnTimer <= 0) {
        this.burnTimer = 0.9;
        this.game.sound('burn', p.x, p.y - 20, burning ? 1.2 : 0.6);
      }
    }
    if (v.health <= 0 && !this.game.dev.god) {
      this.game.s.dead = true;
      this.game.sound('death');
      this.game.say(
        burning
          ? 'The lava took you. Your field record survives.'
          : 'You collapsed. Your field record survives.',
        'danger',
      );
    }
  }
}
