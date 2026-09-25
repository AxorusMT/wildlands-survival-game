import { clamp } from '../../core/math.ts';
import type { Ailment } from '../../core/types.ts';
import { DISEASES, STAGE_FORCE, STAGE_NAMES } from '../../data/diseases.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** Seconds of immunity a field vaccine grants, and what against. */
export const VACCINE = { seconds: 1800, against: ['tetanus', 'rabies', 'cholera'] };

/**
 * Diseases and injuries. Each ailment incubates without symptoms, then is mild, severe, and
 * critical, worsening on its own clock unless treated. The worst one showing is the record's
 * `disease`; illness and infection vitals follow the ailments, so old harm rules still apply.
 */
export class Ailments extends System {
  /** Seconds each exposure condition has held (cold, heat, wet cold, scurvy). */
  private exposure: Record<string, number> = {};
  private warned = new Set<string>();

  list(): Ailment[] {
    return (this.game.s.ailments ??= []);
  }
  has(id: string) {
    return this.list().some((a) => a.id === id);
  }
  /** The ailments showing symptoms, worst first. */
  showing() {
    return this.list()
      .filter((a) => a.stage > 0)
      .sort((a, b) => b.stage - a.stage);
  }
  immune(id: string) {
    return (this.game.s.immune?.[id] ?? 0) > this.game.s.elapsed;
  }
  /**
   * Catching something: it incubates first (unless `now`), so the journal cannot yet name it.
   * Returns whether it took hold.
   */
  contract(id: string, now = false, source?: 'food' | 'spoiled' | 'water') {
    const def = DISEASES[id],
      sk = this.game.skills.stats();
    if (!def || this.immune(id) || this.has(id)) return false;
    // Iron gut: food and water never sicken you; an iron stomach shrugs off spoiled food.
    if (source && sk.ironGut >= 1) return false;
    if (source === 'spoiled' && sk.ironGut > 0) return false;
    if (id === 'frostbite' && sk.coldBlooded) return false;
    // Infused armour keeps some harms from taking hold.
    const inf = this.game.armourForge.totals().infusions;
    if (
      (id === 'burn' && inf.has('fire')) ||
      (id === 'poisoning' && inf.has('venom')) ||
      (id === 'void_rot' && inf.has('void'))
    )
      return false;
    // Hale bodies and a wayfarer's kit sometimes shrug a sickness off.
    const resist =
      sk.disease +
      (this.game.equipment.has('wayfarer') ? 0.2 : 0) +
      (this.game.equipment.fullSet() === 'plaguedoctor' ? 0.15 : 0);
    if (!now && def.kind !== 'injury' && this.game.rng() < Math.min(0.7, resist)) return false;
    // An iron gut shrugs off half of what it eats and drinks.
    if (
      !now &&
      def.kind === 'illness' &&
      (this.game.s.buffs.iron_gut ?? 0) > 0 &&
      this.game.rng() < 0.5
    )
      return false;
    const t = this.game.s.elapsed,
      hidden = !now && def.incubate > 0;
    this.list().push({
      id,
      stage: hidden ? 0 : 1,
      next: t + (hidden ? def.incubate : def.worsen),
      since: t,
    });
    if (!hidden) this.diagnose(id);
    this.sync();
    return true;
  }
  private diagnose(id: string) {
    const def = DISEASES[id];
    this.game.progress.record('ail:' + id);
    this.game.s.vitals.morale = clamp(this.game.s.vitals.morale - 8, 0, RULES.maxVital);
    this.game.say(
      `${def.kind === 'injury' ? 'Injury' : 'Diagnosis'}: ${def.name} · ${def.symptoms[0].toLowerCase()}. Treat with ${def.treat.toLowerCase()}.`,
      'danger',
    );
  }
  /** Rids you of an ailment, with whatever immunity it leaves. */
  cure(id: string, quiet = false) {
    const def = DISEASES[id],
      s = this.game.s;
    s.ailments = this.list().filter((a) => a.id !== id);
    if (def?.immunity)
      (s.immune ??= {})[id] = s.elapsed + def.immunity * (1 + this.game.skills.get('immunity'));
    if (!quiet && def) {
      this.game.say(`${def.name} has passed.`, 'good');
      this.game.progress.record('cure:' + id);
    }
    this.sync();
  }
  /** Uses a treatment: each ailment it helps loses stages; those brought to nothing are gone. */
  treat(item: string) {
    let helped = false;
    for (const a of [...this.list()]) {
      const def = DISEASES[a.id],
        power = def.cures[item];
      if (!power) continue;
      if (def.lateCure && a.stage >= def.lateCure) {
        this.game.say(`${def.name} has gone too far for ${item.replace(/_/g, ' ')}.`, 'danger');
        continue;
      }
      helped = true;
      // A field medic's hands lift a stage more, and heal as they treat.
      const medic = this.game.skills.flag('fieldMedic');
      a.stage -= power + (medic ? 1 : 0);
      if (medic) this.game.equipment.heal(20);
      if ((item === 'bandage' || item === 'splint') && this.game.skills.get('dressing'))
        this.game.equipment.heal(this.game.skills.get('dressing'));
      a.mend = 0;
      if (a.stage <= 0) this.cure(a.id);
      else a.next = this.game.s.elapsed + def.worsen;
    }
    this.sync();
    return helped;
  }
  /** Field vaccine: immunity to the worst of the bites and the water. */
  vaccinate() {
    const s = this.game.s;
    for (const id of VACCINE.against)
      (s.immune ??= {})[id] = Math.max(s.immune[id] ?? 0, s.elapsed + VACCINE.seconds);
    this.game.say('Vaccinated against tetanus, rabies, and cholera for a good while.', 'good');
  }

  // ─── Their effects ─────────────────────────────────────────────────────────
  /** The strongest pull of one effect across every showing ailment. */
  private worst(key: 'speed' | 'regen') {
    let out = 0;
    for (const a of this.list())
      out = Math.max(out, (DISEASES[a.id]?.effect[key] ?? 0) * STAGE_FORCE[a.stage]);
    return Math.min(0.8, out);
  }
  /** Multiplier on movement speed. */
  speedScale() {
    return 1 - this.worst('speed');
  }
  /** Multiplier on health regeneration. */
  regenScale() {
    return 1 - this.worst('regen');
  }
  /** Keeps `disease` (the worst showing) and the illness and infection gauges in step. */
  sync() {
    const s = this.game.s,
      shown = this.showing();
    s.disease = shown[0]?.id ?? null;
  }

  update(dt: number) {
    const s = this.game.s,
      v = s.vitals,
      t = s.elapsed;
    this.watchExposure(dt);
    let illness = 0,
      infection = 0;
    for (const a of [...this.list()]) {
      const def = DISEASES[a.id];
      if (!def) {
        s.ailments = this.list().filter((x) => x !== a);
        continue;
      }
      if (a.stage === 0) {
        // Halfway through incubation you feel something is wrong, without knowing what.
        const key = a.id + ':' + a.since;
        if (t > a.next - def.incubate / 2 && !this.warned.has(key)) {
          this.warned.add(key);
          this.game.say('You feel a little off.', 'ink');
        }
        if (t >= a.next) {
          a.stage = 1;
          a.next = t + def.worsen;
          this.diagnose(a.id);
        }
        continue;
      }
      // Mild ailments pass off in good health; exposure ones as soon as the cause is gone.
      const well = v.hydration > 35 && v.calories > 30 && v.bodyTemp > 35.5 && v.bodyTemp < 38.8;
      if (this.causeGone(a.id)) a.mend = (a.mend ?? 0) + dt * 4;
      else if (def.recover && a.stage === 1 && well) a.mend = (a.mend ?? 0) + dt;
      if (a.mend && a.mend >= (def.recover ?? 60)) {
        if (a.stage > 1) {
          a.stage--;
          a.mend = 0;
          a.next = t + def.worsen;
        } else {
          this.cure(a.id);
          continue;
        }
      }
      if (t >= a.next && a.stage < 3 && !this.causeGone(a.id)) {
        a.stage++;
        a.next = t + def.worsen;
        this.game.say(
          `${def.name} worsens: ${STAGE_NAMES[a.stage].toLowerCase()}. ${def.symptoms[a.stage - 1]}.`,
          'danger',
        );
      }
      if (a.stage === 3 && def.chain && this.game.rng() < def.chain[1] * dt)
        this.contract(def.chain[0]);
      const f = STAGE_FORCE[a.stage],
        e = def.effect;
      if (e.hp) v.health = clamp(v.health - e.hp * f * dt, 0, this.game.maxHealth());
      if (e.hydration) v.hydration = clamp(v.hydration - e.hydration * f * dt, 0, 100);
      if (e.calories) v.calories = clamp(v.calories - e.calories * f * dt, 0, RULES.maxVital);
      if (e.protein) v.protein = clamp(v.protein - e.protein * f * dt, 0, RULES.maxVital);
      if (e.stamina) v.stamina = clamp(v.stamina - e.stamina * f * dt, 0, 100);
      const gauge = [0, 30, 58, 82][a.stage];
      if (def.kind === 'infection') infection = Math.max(infection, gauge);
      else if (def.kind === 'illness') illness = Math.max(illness, gauge);
    }
    // The old gauges follow the ailments (and still ease slowly when nothing drives them).
    if (illness > v.illness) v.illness = Math.min(illness, v.illness + dt * 2);
    if (infection > v.infection) v.infection = Math.min(infection, v.infection + dt * 2);
    this.sync();
  }
  /** Exposure ailments ease as soon as their cause is gone. */
  private causeGone(id: string) {
    const v = this.game.s.vitals;
    if (id === 'hypothermia') return v.bodyTemp > 36.2;
    if (id === 'heatstroke') return v.bodyTemp < 38.2;
    if (id === 'scurvy') return v.vitamins > 45;
    if (id === 'rickets') return this.game.survival.sunlit();
    return false;
  }
  /** Cold, heat, wet cold, and a diet without greens bring on ailments of their own. */
  private watchExposure(dt: number) {
    const v = this.game.s.vitals,
      hold = (key: string, on: boolean, secs: number, id: string) => {
        this.exposure[key] = on ? (this.exposure[key] ?? 0) + dt : 0;
        if (this.exposure[key] >= secs && !this.has(id)) {
          this.exposure[key] = 0;
          this.contract(id, id !== 'pneumonia');
        }
      };
    hold('cold', v.bodyTemp < 34.6, 60, 'hypothermia');
    hold('freeze', v.bodyTemp < 33.4, 45, 'frostbite');
    hold('heat', v.bodyTemp > 39.2, 60, 'heatstroke');
    hold('wetcold', v.wetness > 60 && v.bodyTemp < 35.8, 120, 'pneumonia');
    hold('greens', v.vitamins < 10, 240, 'scurvy');
    // Twenty minutes without sunlight bends the bones.
    hold('dark', !this.game.survival.sunlit(), 1200, 'rickets');
  }
}
