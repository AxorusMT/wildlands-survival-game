import { clamp, dist } from '../../core/math.ts';
import type { Animal } from '../../core/types.ts';
import { BOSSES } from '../../data/bosses.ts';
import { BITE_DISEASES } from '../../data/diseases.ts';
import { MOBS, VOICES, isAggressive, mobName } from '../../data/mobs.ts';
import { RANGED } from '../../data/gear.ts';
import { LAVA_Y, TILE, caveY, regionBounds, underworldFloor } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { UNDEAD } from '../../data/weapons.ts';

import { System } from './System.ts';

export class Wildlife extends System {
  /** Where a surface or tunnel animal stands (or hovers) at x. */
  restY(a: Animal, x: number) {
    if (a.hoverY !== undefined) return a.hoverY + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
    if (a.walkY !== undefined) return (a.walkY = this.game.floorNear(x, a.walkY - 20));
    if (a.tunnel) return caveY(x, a.tunnel) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
    if (a.type === 'bat') return caveY(x, 1) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
    if (a.underground) return this.game.floorNear(x, underworldFloor(x) - 20);
    return this.game.groundTopAt(x) - 1;
  }
  /** The F key: a swing with the ready weapon, or a shot straight ahead with a bow or staff. */
  attack() {
    if (this.game.s.dead) return { ok: false, reason: 'You must recover first.' };
    const p = this.game.s.player,
      v = this.game.s.vitals;
    if (this.game.s.elapsed < p.attackAt)
      return { ok: false, reason: 'Recovering from the last strike.' };
    if (RANGED[p.weapon]) {
      const face = Math.cos(p.face) >= 0 ? 1 : -1;
      const r = this.game.combat.fire(p.weapon, { x: p.x + face * 400, y: p.y - 30 });
      if (r.ok) {
        p.attackAt =
          this.game.s.elapsed + RANGED[p.weapon].delay * this.game.armoury.stats(p.weapon).pace;
        p.usedAt = this.game.s.elapsed;
      }
      return { ...r, hit: false };
    }
    if (v.stamina < RULES.attackStamina) return { ok: false, reason: 'Too exhausted to strike.' };
    p.attackAt =
      this.game.s.elapsed + RULES.attackCooldownSeconds * this.game.armoury.stats(p.weapon).pace;
    p.usedAt = this.game.s.elapsed;
    v.stamina -= RULES.attackStamina;
    v.hydration = clamp(v.hydration - 0.25, 0, RULES.maxVital);
    this.game.sound('swing');
    const before = this.game.s.animals.map((a) => a.hp);
    const targets = this.game.combat.swing(p.weapon);
    if (!targets.length) {
      this.game.say('The strike cuts through empty air.');
      return { ok: true, hit: false };
    }
    const landed = targets.find(
      (a) => a.hp < before[this.game.s.animals.indexOf(a)] || a.deadUntil,
    );
    return { ok: true, hit: !!landed, target: targets[0] };
  }
  /** A creature's voice: its call, attack cry, or hurt cry, at its position. */
  cry(a: Animal, what: 'call' | 'attack' | 'hurt') {
    if (a.x === undefined) return;
    const spec = MOBS[a.type],
      voice = a.type === 'boss' ? 'wolf' : (VOICES[a.type] ?? spec?.voice ?? a.type);
    if ((a.type === 'boss' || spec?.boss) && what === 'call')
      this.game.sound('boss', a.x, a.y - 30);
    else
      this.game.sound(voice + '_' + what, a.x, a.y - 20, a.type === 'boss' || spec?.boss ? 1.6 : 1);
  }
  kill(animal: Animal) {
    if (animal.x !== undefined) {
      this.game.sound('die', animal.x, animal.y - 20);
      this.cry(animal, 'hurt');
    }
    const spec = MOBS[animal.type];
    // A mirage struck down is only light and heat: no body, no loot, no renown.
    if (spec && spec.damage <= 0 && spec.sight > 0) {
      animal.deadUntil = this.game.s.elapsed + (animal.minion ? 999999 : spec.respawn);
      this.game.event('burst', animal.x, animal.y - 20, '#fff4e0');
      return;
    }
    animal.deadUntil =
      this.game.s.elapsed +
      (animal.type === 'boss' || spec?.boss || animal.minion || animal.echo
        ? 999999
        : (spec?.respawn ?? 120));
    this.game.pocket.echo(animal);
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
      return;
    }
    const at = animal.x === undefined ? this.game.s.player : animal;
    // War cry: each kill steadies your breath.
    const breath = this.game.skills.get('killStamina');
    if (breath) this.game.s.vitals.stamina = clamp(this.game.s.vitals.stamina + breath, 0, 100);
    const more = this.game.pocket.lootScale(at.x);
    if (spec && !animal.minion && animal.type !== 'deer') {
      // Silver marks, more from tougher foes, many from the great ones.
      const coins = Math.max(
        1,
        Math.round(
          (spec.hp / 20) *
            (0.6 + this.game.rng() * 0.8) *
            (spec.boss ? 3 : 1) *
            more *
            (1 +
              this.game.skills.get('coins') +
              (this.game.equipment.fullSet() === 'gilded' ? 0.25 : 0)),
        ),
      );
      this.game.drops.spawn('coin', coins, at.x, at.y - 20);
    }
    if (spec) {
      for (const [id, min, max, chance] of spec.loot)
        if (this.game.rng() < chance * (1 + this.game.skills.get('luck')))
          this.game.drops.spawn(
            id,
            Math.max(1, Math.round((min + Math.floor(this.game.rng() * (max - min + 1))) * more)),
            at.x,
            at.y - 20,
          );
    }
    this.game.progress.record('kill:' + animal.type);
    if (spec?.boss) this.game.bosses.defeated(animal);
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
  step(a: Animal, dt: number) {
    const s = this.game.s;
    if (a.deadUntil) {
      if (s.elapsed >= a.deadUntil && a.type !== 'boss') {
        a.deadUntil = 0;
        a.hp = a.maxHp;
        a.x = a.homeX + (a.body ? 0 : (this.game.rng() - 0.5) * 180);
        a.y = a.body ? a.homeY : this.restY(a, a.x);
        a.vx = 0;
        a.vy = 0;
      }
      return;
    }
    this.afflict(a, dt);
    if (a.deadUntil) return;
    // Creatures far from the player rest; only nearby life is simulated.
    const p = s.player;
    if (Math.abs(a.x - p.x) > 2600 && !MOBS[a.type]?.boss && a.type !== 'boss') return;
    if (MOBS[a.type]?.boss) return this.game.bosses.step(a, dt);
    if (a.body) return this.stepBody(a, dt);
    this.stepLegacy(a, dt);
  }

  /** Some bites carry worse than a wound: rabies from wolves and rats, spores, void rot. */
  private bite(a: Animal) {
    const carried = BITE_DISEASES[a.type];
    if (carried && this.game.rng() < carried[1] * this.game.pocket.diseaseScale())
      this.game.ailments.contract(carried[0]);
  }
  /** Bleeding, burning, and poison wear a creature down; stuns and slows run out. */
  private afflict(a: Animal, dt: number) {
    const fx = a.fx,
      t = this.game.s.elapsed;
    if (!fx) return;
    let harm = 0;
    for (const k of ['bleed', 'burn', 'poison'] as const) {
      const d = fx[k];
      if (!d) continue;
      if (t >= d[0]) delete fx[k];
      else harm += d[1] * dt;
    }
    if (fx.mark && t >= fx.mark[0]) delete fx.mark;
    if (!harm) return;
    a.hp -= harm;
    a.dotShown = (a.dotShown ?? 0) + harm;
    if (a.dotShown >= 12) {
      this.game.event(
        'damage',
        a.x,
        a.y - 44,
        String(Math.round(a.dotShown)),
        fx.burn ? 3 : fx.poison ? 4 : 5,
      );
      a.dotShown = 0;
    }
    if (a.hp <= 0) this.kill(a);
  }
  /** Surface animals, tunnel bats, hellhounds, and the Direwolf: kept to their floor lines. */
  private stepLegacy(a: Animal, dt: number) {
    const s = this.game.s,
      p = s.player,
      d = dist(a, p),
      boss = a.type === 'boss',
      spec = MOBS[a.type];
    const aggressive = isAggressive(a.type) && !(spec?.night && !this.game.isNight());
    const range = boss ? 350 : (spec?.sight ?? 210);
    let vx = 0;
    // Deer bolt when you come close and keep running until well clear, so they never dither
    // (and flip back and forth) at the edge of their flight distance.
    const wasFleeing = !!a.fleeing;
    a.fleeing =
      a.type === 'deer' &&
      (d < RULES.deerFlightDistance || (wasFleeing && d < RULES.deerSafeDistance));
    if (a.fleeing && !wasFleeing) this.cry(a, 'call');
    // Now and then a creature near the player calls out, so you hear the wilds before you see them.
    if (d < 900 && Math.random() < dt * (aggressive ? 0.05 : 0.025)) this.cry(a, 'call');
    if (a.fleeing) vx = Math.sign(a.x - p.x) || 1;
    else if (aggressive && d < range && !s.dead) {
      vx = Math.sign(p.x - a.x);
      if (Math.abs(a.x - p.x) < (boss ? 75 : 30)) vx = 0;
      if (d < (boss ? 94 : 45) && s.elapsed >= a.attackAt) {
        a.warning = boss ? 1.15 : 0.55;
        this.cry(a, 'attack');
        a.attackAt = s.elapsed + (boss ? 2.3 : 1.7);
        a.hitAt = s.elapsed + (boss ? 0.65 : 0.35);
      }
      if (boss && s.elapsed >= (a.howlAt ?? 0)) {
        a.howlAt = s.elapsed + 8;
        a.howlCue = s.elapsed + 0.8;
        a.warning = 1.2;
        this.game.say('The Direwolf draws breath for a howl!', 'danger');
      }
    } else {
      if (s.elapsed >= a.wanderAt) {
        a.angle =
          a.type === 'deer' && d < RULES.deerSafeDistance
            ? a.x >= p.x
              ? 0
              : Math.PI
            : this.game.rng() > 0.5
              ? 0
              : Math.PI;
        a.wanderAt = s.elapsed + 2 + this.game.rng() * 4;
      }
      vx = Math.cos(a.angle) * 0.4;
    }
    if (a.hitAt && s.elapsed >= a.hitAt) {
      a.hitAt = 0;
      if (dist(a, p) < (boss ? 108 : 55) && !s.dead) {
        const damage = boss ? BOSSES[s.altar.level - 1].bite : (spec?.damage ?? 9);
        s.vitals.morale = clamp(s.vitals.morale - (boss ? 5 : 0), 0, RULES.maxVital);
        this.game.combat.hurtPlayer(
          damage,
          (boss ? 'Direwolf' : mobName(a.type)) + ' attack!',
          boss ? ['wound', 0.4] : spec?.disease,
        );
        this.bite(a);
      }
    }
    if (a.howlCue && s.elapsed >= a.howlCue) {
      a.howlCue = 0;
      if (d < 380) {
        s.vitals.stamina = clamp(s.vitals.stamina - 26, 0, RULES.maxVital);
        s.vitals.morale = clamp(s.vitals.morale - 13, 0, RULES.maxVital);
        this.game.say('The howl drains stamina and resolve.', 'danger');
      }
    }
    a.warning = Math.max(0, a.warning - dt);
    const [walk, run] = spec?.speed ?? [30, 105];
    const speed =
      a.type === 'deer'
        ? a.fleeing
          ? run
          : walk
        : boss
          ? 85
          : a.type === 'scorpion'
            ? walk
            : d < range
              ? run
              : walk;
    if (Math.abs(vx) > 0.5) a.angle = vx > 0 ? 0 : Math.PI;
    const [lo, hi] = regionBounds(a.homeX);
    const nx = clamp(a.x + vx * speed * dt, lo + 20, hi - 20);
    // Hounds of the underworld never wade into the lava; they turn at the shore.
    if (a.underground && underworldFloor(nx) > LAVA_Y - 6) a.angle = a.angle ? 0 : Math.PI;
    else a.x = nx;
    a.y = this.restY(a, a.x);
    this.trapCheck(a);
  }
  private trapCheck(a: Animal) {
    const s = this.game.s;
    for (const st of s.structures)
      if (
        st.type === 'spike_trap' &&
        Math.abs(st.x - a.x) < 23 &&
        Math.abs(st.y - a.y) < 38 &&
        s.elapsed - st.triggeredAt > 2
      ) {
        a.hp -= 22;
        st.triggeredAt = s.elapsed;
        if (a.hp <= 0) this.kill(a);
      }
  }

  // ─── Creatures with bodies: dungeon and dimension monsters ─────────────────
  solidAt(x: number, y: number) {
    return !!this.game.tileAt(Math.floor(x / TILE), Math.floor(y / TILE));
  }
  /** Moves a body through the tiles, sliding along walls; returns whether it hit ground. */
  moveBody(a: Animal, dt: number, ghost = false) {
    const vx = a.vx ?? 0,
      vy = a.vy ?? 0,
      half = 12;
    const [lo, hi] = regionBounds(a.homeX);
    let nx = clamp(a.x + vx * dt, lo + 30, hi - 30),
      landed = false;
    if (ghost) {
      a.x = nx;
      a.y += vy * dt;
      return false;
    }
    const blocked = (x: number, y: number) =>
      this.solidAt(x - half, y - 4) || this.solidAt(x + half, y - 4) || this.solidAt(x, y - 30);
    if (blocked(nx, a.y)) {
      // Step up one tile if there is room, otherwise stop (and walkers try a jump).
      if (a.grounded && !blocked(nx, a.y - TILE)) a.y -= TILE;
      else {
        nx = a.x;
        a.vx = 0;
        if (a.grounded && a.vy === 0) a.vy = -390;
      }
    }
    a.x = nx;
    const ny = a.y + vy * dt;
    if (vy > 0 && (this.solidAt(a.x - half, ny) || this.solidAt(a.x + half, ny))) {
      a.y = Math.floor(ny / TILE) * TILE - 1;
      a.vy = 0;
      landed = true;
    } else if (vy < 0 && this.solidAt(a.x, ny - 36)) a.vy = 0;
    else a.y = ny;
    a.grounded = landed || this.solidAt(a.x, a.y + 3);
    return landed;
  }
  private stepBody(a: Animal, dt: number) {
    const s = this.game.s,
      p = s.player,
      spec = MOBS[a.type];
    if (!spec) return;
    const t = s.elapsed,
      d = dist(a, p),
      hunting = spec.sight > 0 && d < spec.sight && !s.dead,
      face = Math.sign(p.x - a.x) || 1,
      stunned = (a.fx?.stun ?? 0) > t,
      pace = this.game.pocket.speedScale(a) * ((a.fx?.slow ?? 0) > t ? 0.6 : 1) * (stunned ? 0 : 1),
      [walk, run] = [spec.speed[0] * pace, spec.speed[1] * pace];
    a.timers ??= {};
    if (d < 900 && Math.random() < dt * 0.04) this.cry(a, 'call');
    if (spec.move === 'walker' || spec.move === 'hopper') {
      a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
      if (spec.move === 'walker') {
        if (hunting) a.vx = Math.abs(p.x - a.x) < 20 ? 0 : face * run;
        else {
          if (t >= a.wanderAt) {
            a.angle = this.game.rng() > 0.5 ? 0 : Math.PI;
            a.wanderAt = t + 2 + this.game.rng() * 3;
            // Wanderers stay near home.
            if (Math.abs(a.x - a.homeX) > (a.settler ? 70 : 260))
              a.angle = a.x > a.homeX ? Math.PI : 0;
          }
          a.vx = Math.cos(a.angle) * walk;
        }
        // Chasers jump up ledges toward a player above them.
        if (
          hunting &&
          a.grounded &&
          p.y < a.y - 50 &&
          Math.abs(p.x - a.x) < 160 &&
          t > (a.timers.jump ?? 0)
        ) {
          a.vy = -420;
          a.timers.jump = t + 1.2;
        }
      } else {
        // Slimes gather themselves, then leap.
        if (a.grounded) {
          a.vx = 0;
          if (t > (a.timers.hop ?? 0)) {
            const dir = hunting ? face : Math.cos(a.angle) >= 0 ? 1 : -1;
            a.vx = dir * (hunting ? run : walk) * 1.6;
            a.vy = -(hunting ? 430 : 300) - this.game.rng() * 80;
            a.grounded = false;
            a.timers.hop = t + 0.8 + this.game.rng() * 0.9;
            if (!hunting && this.game.rng() < 0.3) a.angle = a.angle ? 0 : Math.PI;
          }
        }
      }
      this.moveBody(a, dt);
    } else {
      // Fliers dart about; floaters drift and pass through rock like ghosts.
      const ghost = spec.move === 'floater';
      let tx: number, ty: number;
      if (hunting) {
        tx = p.x + Math.sin(t * 1.3 + a.phase) * (spec.ranged ? 220 : 40);
        ty = p.y - (spec.ranged ? 150 : 40) + Math.sin(t * 2 + a.phase) * 30;
      } else {
        tx = a.homeX + Math.sin(t * 0.4 + a.phase) * 160;
        ty = a.homeY + Math.sin(t * 0.7 + a.phase) * 40;
      }
      const dx = tx - a.x,
        dy = ty - a.y,
        len = Math.hypot(dx, dy) || 1,
        speed = hunting ? run : walk,
        k = 1 - Math.exp(-dt * (ghost ? 1.8 : 3.2));
      a.vx = (a.vx ?? 0) + ((dx / len) * speed - (a.vx ?? 0)) * k;
      a.vy = (a.vy ?? 0) + ((dy / len) * speed * 0.8 - (a.vy ?? 0)) * k;
      if (!ghost) {
        const nx = a.x + a.vx * dt,
          ny = a.y + a.vy * dt;
        if (this.solidAt(nx, a.y - 12)) a.vx *= -0.5;
        if (this.solidAt(a.x, ny - 12)) a.vy *= -0.5;
      }
      this.moveBody(a, dt, true);
    }
    if (Math.abs(a.vx ?? 0) > 5) a.angle = (a.vx ?? 0) > 0 ? 0 : Math.PI;
    if (!hunting || stunned) return;
    // Contact: touching a monster hurts.
    const cy = a.y - 22;
    if (
      Math.abs(p.x - a.x) < spec.reach * 0.6 + 10 &&
      Math.abs(p.y - 26 - cy) < spec.reach * 0.6 + 20 &&
      t >= a.attackAt
    ) {
      a.attackAt = t + spec.cooldown * 0.6;
      // A mirage reaches you and is gone: only heat and light.
      if (spec.damage <= 0) {
        a.deadUntil = t + spec.respawn;
        this.game.event('burst', a.x, a.y - 20, '#fff4e0');
        if (a.type === 'mirage') this.game.say('It was only a mirage.', 'ink');
        return;
      }
      this.cry(a, 'attack');
      // Holy-infused armour turns some of the dead's blows aside.
      const holy = UNDEAD.has(a.type) && this.game.armourForge.totals().infusions.has('holy');
      const taken = this.game.combat.hurtPlayer(
        spec.damage * (holy ? 0.9 : 1),
        mobName(a.type) + ' attack!',
        spec.disease,
      );
      // Riposte and a vanguard's plate turn part of the blow back on the biter.
      const thorns =
        this.game.skills.get('thorns') + (this.game.equipment.has('vanguard') ? 0.25 : 0);
      if (taken && thorns) this.game.combat.hurtMob(a, taken * thorns, p);
      if (taken) this.game.pocket.feverBite();
      this.bite(a);
    }
    if (spec.ranged && d < spec.ranged.range && t >= (a.timers.shoot ?? 0)) {
      a.timers.shoot = t + spec.cooldown + this.game.rng() * 0.6;
      a.warning = 0.4;
      this.game.combat.mobShoot(
        a,
        spec.ranged.projectile,
        spec.ranged.speed,
        spec.ranged.damage,
        spec.ranged.count,
        spec.ranged.spread,
      );
      this.game.sound(spec.ranged.projectile === 'arrow' ? 'bow' : 'cast', a.x, a.y - 20, 0.8);
    }
    a.warning = Math.max(0, a.warning - dt);
  }
}
