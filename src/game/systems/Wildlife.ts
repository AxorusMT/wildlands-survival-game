import { clamp, dist } from '../../core/math.ts';
import type { Animal } from '../../core/types.ts';
import { BOSSES } from '../../data/bosses.ts';
import { itemName } from '../../data/items.ts';
import { WEAPONS } from '../../data/resources.ts';
import { LAVA_Y, WORLD_W, caveY, underworldFloor } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

const aggressiveType = (type: string) =>
  ['wolf', 'boar', 'scorpion', 'bat', 'boss', 'ember_bat', 'hellhound'].includes(type);

const ANIMAL_NAMES: Record<string, string> = {
  deer: 'Deer',
  wolf: 'Wolf',
  boar: 'Boar',
  bat: 'Bat',
  scorpion: 'Scorpion',
  ember_bat: 'Ember bat',
  hellhound: 'Hellhound',
};

export class Wildlife extends System {
  /** Where an animal stands (or hovers) at x: its tunnel, the underworld floor, or the ground. */
  restY(a: Animal, x: number) {
    if (a.hoverY !== undefined) return a.hoverY + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
    if (a.walkY !== undefined) return (a.walkY = this.game.floorNear(x, a.walkY - 20));
    if (a.tunnel) return caveY(x, a.tunnel) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
    if (a.type === 'bat') return caveY(x, 1) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
    if (a.underground) return this.game.floorNear(x, underworldFloor(x) - 20);
    return this.game.groundTopAt(x) - 1;
  }
  attack() {
    if (this.game.s.dead) return { ok: false, reason: 'You must recover first.' };
    const p = this.game.s.player,
      v = this.game.s.vitals,
      weapon = WEAPONS[p.weapon] || WEAPONS.fists;
    if (this.game.s.elapsed < p.attackAt)
      return { ok: false, reason: 'Recovering from the last strike.' };
    if (v.stamina < RULES.attackStamina) return { ok: false, reason: 'Too exhausted to strike.' };
    p.attackAt = this.game.s.elapsed + RULES.attackCooldownSeconds;
    v.stamina -= RULES.attackStamina;
    v.hydration = clamp(v.hydration - 0.25, 0, RULES.maxVital);
    const targets = this.game.s.animals.filter(
      (a) =>
        !a.deadUntil &&
        Math.abs(a.x - p.x) < weapon[2] + (a.type === 'boss' ? 28 : 0) &&
        Math.abs(a.y - p.y) < 68 &&
        (a.x - p.x) * Math.cos(p.face) > -15,
    );
    const target = targets.sort((a, b) => dist(a, p) - dist(b, p))[0];
    this.game.sound('swing');
    if (!target) {
      this.game.say('The strike cuts through empty air.');
      return { ok: true, hit: false };
    }
    if (target.type === 'boss' && weapon[0] < RULES.bossWeaponTier) {
      this.game.say('Ordinary steel glances off the Direwolf. Obsidian is required.', 'danger');
      return { ok: true, hit: false };
    }
    const damage = weapon[1] * (v.stamina < 15 ? 0.72 : 1);
    target.hp -= damage;
    target.warning = 0;
    this.game.say(
      itemName(p.weapon) +
        ' struck ' +
        (target.type === 'boss'
          ? BOSSES[this.game.s.altar.level - 1].name
          : 'a ' + (ANIMAL_NAMES[target.type] || target.type).toLowerCase()) +
        ' for ' +
        Math.round(damage) +
        '.',
      'combat',
    );
    this.game.sound('hit', target.x, target.y - 20);
    if (target.hp > 0) this.cry(target, 'hurt');
    if (target.hp <= 0) this.kill(target);
    return { ok: true, hit: true, target };
  }
  /** A creature's voice: its call, attack cry, or hurt cry, at its position. */
  cry(a: Animal, what: 'call' | 'attack' | 'hurt') {
    if (a.x === undefined) return;
    const voice = a.type === 'boss' ? 'wolf' : a.type;
    if (a.type === 'boss' && what === 'call') this.game.sound('boss', a.x, a.y - 30);
    else this.game.sound(voice + '_' + what, a.x, a.y - 20, a.type === 'boss' ? 1.6 : 1);
  }
  kill(animal: Animal) {
    if (animal.x !== undefined) {
      this.game.sound('die', animal.x, animal.y - 20);
      this.cry(animal, 'hurt');
    }
    animal.deadUntil =
      this.game.s.elapsed + (animal.type === 'boss' ? 999999 : animal.type === 'wolf' ? 150 : 120);
    if (animal.type === 'boss') {
      const cfg = BOSSES[this.game.s.altar.level - 1];
      for (const [id, qty] of Object.entries(cfg.rewards)) this.game.add(id, qty);
      this.game.s.altar.xp += cfg.xp;
      this.game.s.altar.kills = 0;
      this.game.s.altar.activeBoss = null;
      this.game.progress.record('kill:boss');
      this.game.s.vitals.morale = clamp(this.game.s.vitals.morale + 25, 0, RULES.maxVital);
      this.game.say(
        cfg.name + ' defeated. Trophies and ' + cfg.xp + ' Effergy XP claimed!',
        'victory',
      );
    } else {
      const at = animal.x === undefined ? this.game.s.player : animal,
        loot = (id: string, qty: number) => this.game.drops.spawn(id, qty, at.x, at.y - 20);
      if (animal.type === 'ember_bat') {
        loot('sulfur', 2);
        loot('chitin', 2);
      } else if (animal.type === 'hellhound') {
        loot('hide', 3);
        loot('bone', 3);
        loot('hellstone', 1 + Math.floor(this.game.rng() * 2));
      } else if (animal.type === 'bat') {
        loot('chitin', 2);
        loot('feathers', 1);
      } else if (animal.type === 'scorpion') {
        loot('chitin', 3);
        loot('venom', 1);
      } else {
        loot('raw_meat', animal.type === 'boar' ? 5 : 3);
        loot('hide', 2);
        loot('bone', animal.type === 'wolf' ? 2 : 1);
      }
      if (
        animal.type === 'wolf' &&
        this.game.s.altar.attuned === 'wolf' &&
        !this.game.s.altar.activeBoss
      ) {
        this.game.s.altar.kills++;
        const cfg = BOSSES[this.game.s.altar.level - 1];
        this.game.say('Wolf hunt: ' + this.game.s.altar.kills + '/' + cfg.kills + '.', 'combat');
        if (this.game.s.altar.kills >= cfg.kills) this.game.effergy.summonBoss();
      }
    }
  }
  step(a: Animal, dt: number) {
    if (a.deadUntil) {
      if (this.game.s.elapsed >= a.deadUntil && a.type !== 'boss') {
        a.deadUntil = 0;
        a.hp = a.maxHp;
        a.x = a.homeX + (this.game.rng() - 0.5) * 180;
        a.y = this.restY(a, a.x);
      }
      return;
    }
    const p = this.game.s.player,
      d = dist(a, p),
      boss = a.type === 'boss';
    const aggressive = [
      'wolf',
      'boar',
      'scorpion',
      'bat',
      'boss',
      'ember_bat',
      'hellhound',
    ].includes(a.type);
    const range = boss ? 350 : a.type === 'bat' ? 145 : a.type === 'hellhound' ? 300 : 210;
    let vx = 0;
    // Deer bolt when you come close and keep running until well clear, so they never dither
    // (and flip back and forth) at the edge of their flight distance.
    const wasFleeing = !!a.fleeing;
    a.fleeing =
      a.type === 'deer' &&
      (d < RULES.deerFlightDistance || (wasFleeing && d < RULES.deerSafeDistance));
    if (a.fleeing && !wasFleeing) this.cry(a, 'call');
    // Now and then a creature near the player calls out, so you hear the wilds before you see them.
    if (d < 900 && Math.random() < dt * (aggressiveType(a.type) ? 0.05 : 0.025))
      this.cry(a, 'call');
    if (a.fleeing) vx = Math.sign(a.x - p.x) || 1;
    else if (aggressive && d < range && !this.game.s.dead) {
      vx = Math.sign(p.x - a.x);
      if (Math.abs(a.x - p.x) < (boss ? 75 : 30)) vx = 0;
      if (d < (boss ? 94 : 45) && this.game.s.elapsed >= a.attackAt) {
        a.warning = boss ? 1.15 : 0.55;
        this.cry(a, 'attack');
        a.attackAt = this.game.s.elapsed + (boss ? 2.3 : 1.7);
        a.hitAt = this.game.s.elapsed + (boss ? 0.65 : 0.35);
      }
      if (boss && this.game.s.elapsed >= (a.howlAt ?? 0)) {
        a.howlAt = this.game.s.elapsed + 8;
        a.howlCue = this.game.s.elapsed + 0.8;
        a.warning = 1.2;
        this.game.say('The Direwolf draws breath for a howl!', 'danger');
      }
    } else {
      if (this.game.s.elapsed >= a.wanderAt) {
        a.angle =
          a.type === 'deer' && d < RULES.deerSafeDistance
            ? a.x >= p.x
              ? 0
              : Math.PI
            : this.game.rng() > 0.5
              ? 0
              : Math.PI;
        a.wanderAt = this.game.s.elapsed + 2 + this.game.rng() * 4;
      }
      vx = Math.cos(a.angle) * 0.4;
    }
    if (a.hitAt && this.game.s.elapsed >= a.hitAt) {
      a.hitAt = 0;
      if (
        dist(a, p) < (boss ? 108 : 55) &&
        p.invuln <= 0 &&
        !this.game.s.dead &&
        !this.game.dev.god
      ) {
        const damage = boss
          ? BOSSES[this.game.s.altar.level - 1].bite
          : a.type === 'hellhound'
            ? 26
            : a.type === 'ember_bat'
              ? 15
              : a.type === 'boar'
                ? 14
                : a.type === 'scorpion'
                  ? 8
                  : 9;
        this.game.s.vitals.health -= damage * (p.cloak ? 0.68 : p.coat ? 0.82 : 1);
        this.game.s.vitals.morale = clamp(
          this.game.s.vitals.morale - (boss ? 9 : 4),
          0,
          RULES.maxVital,
        );
        p.invuln = 0.75;
        this.game.sound('hurt');
        if (a.type === 'scorpion' && this.game.rng() < 0.42) this.game.contract('poisoning');
        else if (
          this.game.rng() <
          (boss ? 0.4 : 0.16) + (this.game.s.vitals.hygiene < 30 ? 0.13 : 0)
        )
          this.game.contract('wound');
        this.game.say(
          (boss ? 'Direwolf' : ANIMAL_NAMES[a.type] || a.type) +
            ' attack! ' +
            Math.round(damage * (p.cloak ? 0.68 : p.coat ? 0.82 : 1)) +
            ' damage.',
          'danger',
        );
      }
    }
    if (a.howlCue && this.game.s.elapsed >= a.howlCue) {
      a.howlCue = 0;
      if (d < 380) {
        this.game.s.vitals.stamina = clamp(this.game.s.vitals.stamina - 26, 0, RULES.maxVital);
        this.game.s.vitals.morale = clamp(this.game.s.vitals.morale - 13, 0, RULES.maxVital);
        this.game.say('The howl drains stamina and resolve.', 'danger');
      }
    }
    a.warning = Math.max(0, a.warning - dt);
    const speed =
      a.type === 'deer'
        ? a.fleeing
          ? 160
          : 32
        : boss
          ? 85
          : a.type === 'hellhound'
            ? d < range
              ? 150
              : 45
            : a.type === 'ember_bat'
              ? d < range
                ? 135
                : 40
              : a.type === 'scorpion'
                ? 67
                : d < 210
                  ? 105
                  : 30;
    if (Math.abs(vx) > 0.5) a.angle = vx > 0 ? 0 : Math.PI;
    const nx = clamp(a.x + vx * speed * dt, 20, WORLD_W - 20);
    // Hounds of the underworld never wade into the lava; they turn at the shore.
    if (a.underground && underworldFloor(nx) > LAVA_Y - 6) a.angle = a.angle ? 0 : Math.PI;
    else a.x = nx;
    a.y = this.restY(a, a.x);
    for (const st of this.game.s.structures)
      if (
        st.type === 'spike_trap' &&
        Math.abs(st.x - a.x) < 23 &&
        Math.abs(st.y - a.y) < 38 &&
        this.game.s.elapsed - st.triggeredAt > 2
      ) {
        a.hp -= 22;
        st.triggeredAt = this.game.s.elapsed;
        if (a.hp <= 0) this.kill(a);
      }
  }
}
