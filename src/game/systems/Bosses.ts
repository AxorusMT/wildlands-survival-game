import { clamp, dist } from '../../core/math.ts';
import type { Animal, Structure } from '../../core/types.ts';
import { itemName } from '../../data/items.ts';
import { BOSS_SHRINES, MOBS } from '../../data/mobs.ts';
import { TILE } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** How far a boss follows before the fight is abandoned and it returns to its shrine. */
const LEASH = 2200;

/**
 * The seven great foes of the dungeons and dimensions. Each fight is a short script of moves on
 * timers, with a harder second half. The Direwolves of the Effergy are handled by Effergy.ts.
 */
export class Bosses extends System {
  /** The boss currently fighting, if any. */
  active(): Animal | null {
    return this.game.s.animals.find((a) => !a.deadUntil && MOBS[a.type]?.boss) ?? null;
  }
  /** Calls a boss at its altar; the first fight is free, later ones need its key. */
  summon(altar: Pick<Structure, 'x' | 'y' | 'kind'>, free = false) {
    const s = this.game.s,
      boss = altar.kind ?? '';
    const spec = MOBS[boss],
      shrine = BOSS_SHRINES[boss];
    if (!spec || !shrine) return { ok: false, reason: 'The altar is silent.' };
    if (this.active()) return { ok: false, reason: 'A great foe is already abroad.' };
    const beaten = s.bosses[boss] ?? 0;
    // A realm's great foe answers once per expedition, and needs no offering.
    const realm = this.game.pocket.here(altar.x);
    if (realm) {
      if (this.game.pocket.bossDown())
        return { ok: false, reason: 'Its master is gone. Open a new expedition to face it again.' };
      free = true;
    }
    if (
      !free &&
      (beaten > 0 ||
        shrine.item === 'void_seal' ||
        shrine.item === 'spore_lure' ||
        shrine.item === 'storm_totem')
    ) {
      if (!this.game.count(shrine.item))
        return {
          ok: false,
          reason: 'The altar wants a ' + itemName(shrine.item).toLowerCase() + '.',
        };
      this.game.remove(shrine.item);
    }
    // Fliers swoop in from above; the Warren Queen bursts out of the tunnel wall.
    const flying = spec.move !== 'walker' && spec.move !== 'hopper' && boss !== 'warren_queen';
    const x = altar.x + (s.player.x < altar.x ? 260 : -260),
      y = flying ? altar.y - 260 : altar.y;
    const a: Animal = {
      id: uniqueId(),
      type: boss,
      x,
      y,
      homeX: altar.x,
      homeY: altar.y - (flying ? 200 : 0),
      hp: spec.hp,
      maxHp: spec.hp,
      angle: 0,
      wanderAt: 0,
      attackAt: s.elapsed + 2,
      deadUntil: 0,
      warning: 2,
      phase: 0,
      body: true,
      vx: 0,
      vy: 0,
      timers: { start: s.elapsed },
    };
    if (realm) a.maxHp = a.hp = Math.round(spec.hp * this.game.pocket.hpScale());
    s.animals.push(a);
    this.game.event('burst', x, y - 60, '#ffffff');
    this.game.sound('boss', x, y - 40, 1.6);
    this.game.say(spec.name + ' awakens!', 'danger');
    return { ok: true };
  }
  defeated(a: Animal) {
    const s = this.game.s;
    s.bosses[a.type] = (s.bosses[a.type] ?? 0) + 1;
    // The summoned host falls with its master.
    for (const m of s.animals) if (m.minion && !m.deadUntil) m.deadUntil = s.elapsed + 999999;
    s.animals = s.animals.filter((m) => !(m.minion && m.deadUntil) && !(m === a));
    this.game.progress.record('boss:' + a.type);
    this.game.pocket.cleared(a);
    s.vitals.morale = clamp(s.vitals.morale + 30, 0, RULES.maxVital);
    this.game.say(MOBS[a.type].name + ' is defeated!', 'victory');
    this.game.sound('victory', a.x, a.y);
    this.game.event('burst', a.x, a.y - 40, '#fff0a0');
  }
  private minion(type: string, x: number, y: number) {
    const spec = MOBS[type],
      s = this.game.s;
    if (s.animals.filter((m) => m.minion && !m.deadUntil).length >= 6) return;
    s.animals.push({
      id: uniqueId(),
      type,
      x,
      y,
      homeX: x,
      homeY: y,
      hp: spec.hp,
      maxHp: spec.hp,
      angle: 0,
      wanderAt: 0,
      attackAt: s.elapsed + 1,
      deadUntil: 0,
      warning: 0.6,
      phase: this.game.rng() * 6,
      body: true,
      vx: 0,
      vy: -200,
      minion: true,
    });
    this.game.event('burst', x, y - 20, '#b8a0ff');
  }
  /** Fires `n` shots evenly around a circle. */
  private ring(a: Animal, kind: string, n: number, speed: number, damage: number, offset = 0) {
    for (let i = 0; i < n; i++)
      this.game.combat.spawn(
        kind,
        { x: a.x, y: a.y - 60 },
        offset + (i / n) * Math.PI * 2,
        speed,
        damage,
        'mob',
      );
  }
  /** A timer that fires every `every` seconds (quicker in the second half of the fight). */
  private due(a: Animal, name: string, every: number) {
    const t = this.game.s.elapsed,
      rage = a.hp < a.maxHp / 2 ? 0.7 : 1;
    a.timers ??= {};
    if (a.timers[name] === undefined)
      a.timers[name] = t + every * rage * (0.5 + this.game.rng() * 0.5);
    if (t < a.timers[name]) return false;
    a.timers[name] = t + every * rage;
    return true;
  }
  /** Glides a flying boss toward a point. */
  private steer(a: Animal, tx: number, ty: number, speed: number, dt: number, snap = 2.4) {
    const dx = tx - a.x,
      dy = ty - a.y,
      len = Math.hypot(dx, dy) || 1,
      k = 1 - Math.exp(-dt * snap);
    a.vx = (a.vx ?? 0) + ((dx / len) * Math.min(speed, len * 3) - (a.vx ?? 0)) * k;
    a.vy = (a.vy ?? 0) + ((dy / len) * Math.min(speed, len * 3) - (a.vy ?? 0)) * k;
    a.x += a.vx * dt;
    a.y += a.vy * dt;
  }
  step(a: Animal, dt: number) {
    const s = this.game.s,
      p = s.player,
      spec = MOBS[a.type],
      t = s.elapsed,
      rage = a.hp < a.maxHp / 2;
    // Abandoned fights end: the boss returns to its rest, healed.
    if (dist(p, { x: a.homeX, y: a.homeY }) > LEASH || s.dead) {
      a.deadUntil = t + 999999;
      s.animals = s.animals.filter((m) => m !== a && !m.minion);
      this.game.say(spec.name + ' withdraws into the dark.', 'danger');
      return;
    }
    const face = Math.sign(p.x - a.x) || 1;
    a.angle = face > 0 ? 0 : Math.PI;
    a.warning = Math.max(0, a.warning - dt);
    switch (a.type) {
      case 'hollow_king': {
        this.steer(a, p.x + Math.sin(t * 0.8) * 180, p.y - 190, spec.speed[1], dt);
        if (this.due(a, 'shards', 2.2))
          this.game.combat.mobShoot(a, 'bone_shard', 460, 26, rage ? 5 : 3, 0.22);
        if (this.due(a, 'blink', 8)) {
          a.x = p.x + (this.game.rng() < 0.5 ? -1 : 1) * 260;
          a.y = p.y - 200;
          this.game.event('burst', a.x, a.y - 40, '#9ae8c0');
          this.game.sound('portal', a.x, a.y, 0.8);
        }
        if (this.due(a, 'raise', rage ? 9 : 14))
          for (const dx of [-120, 120])
            this.minion('skeleton', a.x + dx, this.game.floorNear(a.x + dx, p.y - 40));
        break;
      }
      case 'rime_colossus': {
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = Math.abs(p.x - a.x) > 80 ? face * (rage ? spec.speed[1] : spec.speed[0] * 1.5) : 0;
        this.game.wildlife.moveBody(a, dt);
        if (this.due(a, 'slam', 5)) {
          a.warning = 0.6;
          for (const dir of [-1, 1])
            this.game.combat.spawn(
              'shockwave',
              { x: a.x, y: a.y - 14 },
              dir > 0 ? 0 : Math.PI,
              330,
              34,
              'mob',
            );
          this.game.sound('slam', a.x, a.y, 1.4);
          this.game.event('dig', a.x, a.y, '16');
        }
        if (this.due(a, 'hail', 7))
          for (let i = 0; i < (rage ? 9 : 6); i++)
            this.game.combat.spawn(
              'frost_bolt',
              { x: p.x + (i - 3) * 70 + (this.game.rng() - 0.5) * 40, y: p.y - 420 },
              Math.PI / 2,
              360,
              28,
              'mob',
            );
        break;
      }
      case 'pharaoh': {
        const orbit = t * 0.6;
        this.steer(
          a,
          p.x + Math.cos(orbit) * 280,
          p.y - 160 + Math.sin(orbit * 2) * 60,
          spec.speed[1],
          dt,
        );
        if (this.due(a, 'bolts', 3)) this.game.combat.mobShoot(a, 'sun_bolt', 300, 30, 3, 0.5);
        if (rage && this.due(a, 'ring', 6)) this.ring(a, 'sun_bolt', 8, 260, 28, t);
        if (this.due(a, 'scarabs', 10))
          for (const dx of [-90, 90])
            this.minion('scarab', p.x + dx * 3, this.game.floorNear(p.x + dx * 3, p.y - 40));
        break;
      }
      case 'archdemon': {
        a.timers ??= {};
        const charging = t < (a.timers.charge ?? 0);
        if (charging) {
          a.x += (a.vx ?? 0) * dt;
          a.y += (a.vy ?? 0) * dt;
        } else this.steer(a, p.x - face * 220, p.y - 220, spec.speed[1], dt);
        if (!charging && this.due(a, 'dash', rage ? 4 : 6)) {
          const ang = Math.atan2(p.y - 30 - a.y, p.x - a.x);
          a.vx = Math.cos(ang) * 620;
          a.vy = Math.sin(ang) * 620;
          a.timers.charge = t + 0.7;
          a.warning = 0.5;
          this.game.sound('boss', a.x, a.y, 1);
        }
        if (this.due(a, 'fire', 2.5))
          this.game.combat.mobShoot(a, 'fireball', 420, 40, rage ? 7 : 5, 0.18);
        if (rage && this.due(a, 'rain', 5))
          for (let i = 0; i < 8; i++)
            this.game.combat.spawn(
              'fireball',
              { x: p.x + (i - 4) * 80, y: p.y - 460 },
              Math.PI / 2 + (this.game.rng() - 0.5) * 0.2,
              380,
              36,
              'mob',
            );
        break;
      }
      case 'sporemother': {
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        const landed = this.game.wildlife.moveBody(a, dt);
        if (landed) {
          a.vx = 0;
          this.game.sound('slam', a.x, a.y, 1.2);
          for (const dir of [-1, 1])
            this.game.combat.spawn(
              'spore_cloud',
              { x: a.x + dir * 60, y: a.y - 30 },
              dir > 0 ? -0.3 : Math.PI + 0.3,
              160,
              30,
              'mob',
            );
        }
        if (a.grounded && this.due(a, 'leap', rage ? 1.8 : 2.6)) {
          a.vx = face * Math.min(520, Math.abs(p.x - a.x) * 1.4 + 120);
          a.vy = -620;
          a.grounded = false;
        }
        if (this.due(a, 'breath', 4))
          this.game.combat.mobShoot(a, 'spore_cloud', 150, 32, rage ? 5 : 3, 0.5);
        if (this.due(a, 'brood', rage ? 8 : 12))
          for (const dx of [-140, 140])
            this.minion('shroomling', a.x + dx, this.game.floorNear(a.x + dx, a.y - 40));
        break;
      }
      case 'tempest_roc': {
        a.timers ??= {};
        const diving = t < (a.timers.dive ?? 0);
        if (diving) {
          a.x += (a.vx ?? 0) * dt;
          a.y += (a.vy ?? 0) * dt;
        } else this.steer(a, p.x + Math.sin(t * 0.9) * 380, p.y - 300, spec.speed[1], dt, 1.6);
        if (!diving && this.due(a, 'swoop', rage ? 3.5 : 5)) {
          const ang = Math.atan2(p.y - 30 - a.y, p.x - a.x);
          a.vx = Math.cos(ang) * 760;
          a.vy = Math.sin(ang) * 760;
          a.timers.dive = t + 0.8;
          a.warning = 0.5;
          this.game.sound('boss', a.x, a.y, 1.2);
        }
        if (this.due(a, 'feathers', 2.4))
          this.game.combat.mobShoot(a, 'feather', 560, 44, rage ? 7 : 5, 0.14);
        if (this.due(a, 'storm', rage ? 3 : 4.5)) {
          // Lightning falls where the player stands a moment later.
          const x = p.x;
          a.timers.strikeX = x;
          a.timers.strikeAt = t + 0.9;
          this.game.event('burst', x, p.y - 360, '#fff8c0');
        }
        if (a.timers.strikeAt && t >= a.timers.strikeAt) {
          a.timers.strikeAt = 0;
          this.game.combat.spawn(
            'lightning',
            { x: a.timers.strikeX, y: p.y - 520 },
            Math.PI / 2,
            1400,
            60,
            'mob',
          );
          this.game.sound('thunder', a.timers.strikeX, p.y - 200, 1.2);
        }
        break;
      }
      // ── Band I realms ──
      case 'orchard_mother': {
        a.timers ??= {};
        const charging = t < (a.timers.charge ?? 0);
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = charging
          ? (a.vx ?? 0)
          : Math.abs(p.x - a.x) > 90
            ? face * (rage ? spec.speed[1] : spec.speed[0] * 1.6)
            : 0;
        this.game.wildlife.moveBody(a, dt);
        if (!charging && this.due(a, 'charge', rage ? 5 : 7)) {
          a.vx = face * 420;
          a.timers.charge = t + 1;
          a.warning = 0.5;
          this.game.sound('boss', a.x, a.y, 1);
        }
        if (this.due(a, 'spit', 2.6))
          this.game.combat.mobShoot(a, 'brine_spit', 380, 30, rage ? 4 : 3, 0.22);
        if (rage && this.due(a, 'wave', 6)) {
          for (const dir of [-1, 1])
            this.game.combat.spawn(
              'shockwave',
              { x: a.x, y: a.y - 14 },
              dir > 0 ? 0 : Math.PI,
              300,
              30,
              'mob',
            );
          this.game.sound('splash', a.x, a.y, 1.4);
        }
        if (this.due(a, 'brood', rage ? 9 : 13))
          for (const dx of [-130, 130])
            this.minion('bog_crab', a.x + dx, this.game.floorNear(a.x + dx, a.y - 40));
        break;
      }
      case 'kiln_beast': {
        a.timers ??= {};
        const charging = t < (a.timers.charge ?? 0);
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = charging ? (a.vx ?? 0) : Math.abs(p.x - a.x) > 160 ? face * spec.speed[0] * 1.4 : 0;
        this.game.wildlife.moveBody(a, dt);
        if (!charging && this.due(a, 'charge', rage ? 4 : 6)) {
          a.vx = face * 520;
          a.timers.charge = t + 0.9;
          a.warning = 0.5;
          this.game.sound('boss', a.x, a.y, 1.2);
        }
        if (this.due(a, 'breath', 3))
          this.game.combat.mobShoot(a, 'kiln_ember', 470, 30, rage ? 6 : 4, 0.16);
        if (rage && this.due(a, 'ash', 6)) this.ring(a, 'ash_burst', 10, 220, 26, t);
        if (this.due(a, 'rain', rage ? 6 : 9))
          for (let i = 0; i < 6; i++)
            this.game.combat.spawn(
              'kiln_ember',
              { x: p.x + (i - 3) * 90, y: p.y - 460 },
              Math.PI / 2,
              200,
              28,
              'mob',
            );
        break;
      }
      case 'warren_queen': {
        a.timers ??= {};
        const hidden = t < (a.timers.hide ?? 0);
        if (hidden) {
          // Burrowing: she sinks into the earth, then bursts out beneath you.
          a.y += 160 * dt;
          if (t + dt >= a.timers.hide) {
            a.x = p.x + (this.game.rng() - 0.5) * 60;
            a.y = p.y + 30;
            a.vy = -300;
            for (const dir of [-1, 1])
              this.game.combat.spawn(
                'shockwave',
                { x: a.x, y: p.y - 14 },
                dir > 0 ? 0 : Math.PI,
                320,
                30,
                'mob',
              );
            for (let i = 0; i < 6; i++)
              this.game.combat.spawn(
                'amber_glob',
                { x: a.x, y: p.y - 30 },
                -Math.PI / 2 + (i - 2.5) * 0.28,
                420,
                24,
                'mob',
              );
            this.game.sound('slam', a.x, a.y, 1.4);
            this.game.event('dig', a.x, p.y, '33');
          }
        } else this.steer(a, p.x - face * 190, p.y - 30, spec.speed[1], dt, 1.8);
        if (!hidden && this.due(a, 'burrow', rage ? 6 : 8)) {
          a.timers.hide = t + 1.6;
          a.warning = 1.6;
          this.game.say('The Queen burrows into the earth!', 'danger');
        }
        if (!hidden && this.due(a, 'glob', 2.4))
          this.game.combat.mobShoot(a, 'amber_glob', 420, 26, rage ? 4 : 3, 0.2);
        if (this.due(a, 'brood', rage ? 8 : 12))
          for (const dx of [-140, 140])
            this.minion('warren_rat', p.x + dx, this.game.floorNear(p.x + dx, p.y - 40));
        break;
      }
      // ── Band II and III realms ──
      case 'lumen_stag': {
        a.timers ??= {};
        const charging = t < (a.timers.charge ?? 0);
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = charging ? (a.vx ?? 0) : Math.abs(p.x - a.x) > 200 ? face * spec.speed[0] * 1.6 : 0;
        this.game.wildlife.moveBody(a, dt);
        if (!charging && this.due(a, 'charge', rage ? 4 : 6)) {
          a.vx = face * 560;
          a.timers.charge = t + 0.8;
          a.warning = 0.5;
          this.game.sound('boss', a.x, a.y, 1.1);
        }
        if (this.due(a, 'prism', 2.4))
          this.game.combat.mobShoot(a, 'prism_bolt', 600, 34, rage ? 7 : 5, 0.16);
        if (this.due(a, 'shardfall', rage ? 5 : 8)) {
          for (let i = 0; i < 8; i++)
            this.game.combat.spawn(
              'glass_shard',
              { x: p.x + (i - 3.5) * 60, y: p.y - 480 },
              Math.PI / 2,
              220,
              30,
              'mob',
            );
          this.game.sound('crystal', p.x, p.y - 200, 1.2);
        }
        if (rage && this.due(a, 'flash', 9)) this.ring(a, 'lumen_orb', 10, 260, 30, t);
        if (rage && this.due(a, 'moths', 12))
          for (const dx of [-160, 160]) this.minion('prism_moth', a.x + dx, a.y - 180);
        break;
      }
      case 'ossuary_hydra': {
        a.timers ??= {};
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = Math.abs(p.x - a.x) > 140 ? face * (rage ? spec.speed[1] : spec.speed[0]) : 0;
        this.game.wildlife.moveBody(a, dt);
        // Three heads, three volleys, each at its own angle.
        if (this.due(a, 'heads', 2.2))
          for (const lift of [-0.35, 0, 0.35])
            this.game.combat.spawn(
              'bone_shard',
              { x: a.x + face * 40, y: a.y - 70 },
              Math.atan2(p.y - 30 - (a.y - 70), p.x - a.x) + lift,
              560,
              32,
              'mob',
            );
        if (this.due(a, 'mire', 3.6))
          this.game.combat.mobShoot(a, 'mire_glob', 420, 30, rage ? 4 : 3, 0.24);
        if (this.due(a, 'brood', rage ? 8 : 12))
          for (const dx of [-150, 150])
            this.minion('bone_hound', a.x + dx, this.game.floorNear(a.x + dx, a.y - 40));
        // Its heads grow back: in the second half it heals, unless its wounds are burning.
        const burning = (a.fx?.burn?.[0] ?? 0) > t;
        if (rage && !burning && a.hp < a.maxHp * 0.5) {
          a.hp = Math.min(a.maxHp * 0.5, a.hp + a.maxHp * 0.004 * dt);
          if (!a.timers.warned) {
            a.timers.warned = 1;
            this.game.say("The Hydra's wounds knit as fast as you cut. Burn them!", 'danger');
          }
        }
        break;
      }
      case 'engine_saint': {
        a.timers ??= {};
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = Math.abs(p.x - a.x) > 220 ? face * spec.speed[0] : 0;
        this.game.wildlife.moveBody(a, dt);
        if (this.due(a, 'bolts', 2))
          this.game.combat.mobShoot(a, 'bolt', 900, 40, rage ? 5 : 3, 0.08);
        if (this.due(a, 'steam', rage ? 4 : 6)) {
          this.ring(a, 'steam_puff', 12, 300, 36, t);
          this.game.sound('sizzle', a.x, a.y, 1.2);
        }
        if (this.due(a, 'cogs', rage ? 8 : 11))
          for (const dx of [-170, 170])
            this.minion('cog_spider', a.x + dx, this.game.floorNear(a.x + dx, a.y - 40));
        if (rage && this.due(a, 'overheat', 5)) {
          for (const dir of [-1, 1])
            this.game.combat.spawn(
              'shockwave',
              { x: a.x, y: a.y - 14 },
              dir > 0 ? 0 : Math.PI,
              340,
              40,
              'mob',
            );
          this.game.sound('slam', a.x, a.y, 1.3);
        }
        break;
      }
      case 'mirage_tyrant': {
        this.steer(
          a,
          p.x + Math.cos(t * 0.7) * 280,
          p.y - 200 + Math.sin(t * 1.1) * 60,
          spec.speed[1] * (rage ? 1.3 : 1),
          dt,
          1.6,
        );
        if (this.due(a, 'heat', 2))
          this.game.combat.mobShoot(a, 'heat_bolt', 460, 38, rage ? 3 : 2, 0.2);
        // It splits into shimmering copies and slips away among them.
        if (this.due(a, 'split', rage ? 8 : 12)) {
          for (const dx of [-240, 0, 240]) this.minion('tyrant_mirage', p.x + dx, p.y - 220);
          a.x = p.x + (this.game.rng() < 0.5 ? -1 : 1) * 300;
          a.y = p.y - 240;
          this.game.event('burst', a.x, a.y - 60, '#fff0c0');
          this.game.say('The Tyrant splits into mirages!', 'danger');
        }
        if (rage && this.due(a, 'spray', 6)) this.ring(a, 'salt_spray', 14, 380, 34, t);
        break;
      }
      case 'the_hymnal': {
        a.timers ??= {};
        a.vy = Math.min((a.vy ?? 0) + RULES.gravity * dt, RULES.terminalVelocity);
        a.vx = Math.abs(p.x - a.x) > 240 ? face * spec.speed[0] : 0;
        this.game.wildlife.moveBody(a, dt);
        // The great bell tolls: a wave along the ground either way.
        if (this.due(a, 'toll', 4)) {
          for (const dir of [-1, 1])
            this.game.combat.spawn(
              'shockwave',
              { x: a.x, y: a.y - 14 },
              dir > 0 ? 0 : Math.PI,
              300,
              42,
              'mob',
            );
          this.game.sound('boss', a.x, a.y, 1.3);
        }
        if (this.due(a, 'notes', 2.6))
          this.game.combat.mobShoot(a, 'hymn_note', 420, 38, rage ? 7 : 5, 0.22);
        if (rage && this.due(a, 'frost', 6)) this.ring(a, 'frost_bolt', 14, 380, 36, t);
        if (this.due(a, 'choir', rage ? 9 : 13))
          for (const dx of [-200, 200]) this.minion('choir_wraith', a.x + dx, a.y - 200);
        // Its song chills whoever stands before it, fire or no fire.
        if (!this.game.equipment.has('hymnward') && dist(a, p) < 500)
          s.vitals.bodyTemp = clamp(s.vitals.bodyTemp - dt * 0.012, 30, 41);
        break;
      }
      case 'unmaker': {
        this.steer(
          a,
          p.x + Math.cos(t * 0.5) * 300,
          p.y - 230 + Math.sin(t * 0.8) * 70,
          spec.speed[1] * (rage ? 1.4 : 1),
          dt,
          1.4,
        );
        if (this.due(a, 'gaze', 1.6))
          this.game.combat.mobShoot(a, 'eye_beam', 620, 58, rage ? 3 : 1, 0.12);
        if (this.due(a, 'ring', rage ? 4 : 6)) this.ring(a, 'eye_beam', rage ? 16 : 12, 340, 52, t);
        if (this.due(a, 'watchers', rage ? 10 : 15))
          for (const dx of [-260, 260]) this.minion('watcher', a.x + dx, a.y - 60);
        if (rage && this.due(a, 'void', 7)) {
          a.x = p.x + (this.game.rng() < 0.5 ? -1 : 1) * 320;
          a.y = p.y - 240;
          this.game.event('burst', a.x, a.y - 60, '#b36cff');
          this.game.sound('portal', a.x, a.y, 1);
        }
        break;
      }
    }
    // Touching a boss hurts.
    const cy = a.y - 60,
      r = a.type === 'unmaker' || a.type === 'sporemother' ? 90 : 64;
    if (Math.hypot(p.x - a.x, p.y - 26 - cy) < r && t >= a.attackAt) {
      a.attackAt = t + spec.cooldown;
      this.game.combat.hurtPlayer(spec.damage, spec.name);
    }
    // Keep bosses from sinking out of reach below the ground.
    if (
      spec.move !== 'walker' &&
      spec.move !== 'hopper' &&
      !(a.timers?.hide && t < a.timers.hide) &&
      this.game.tileAt(Math.floor(a.x / TILE), Math.floor((a.y - 40) / TILE))
    )
      a.y -= 120 * dt;
  }
}
