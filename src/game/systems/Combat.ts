import { clamp, dist } from '../../core/math.ts';
import type { Animal, Point } from '../../core/types.ts';
import { AMMO, PROJECTILES, RANGED } from '../../data/gear.ts';
import { itemName } from '../../data/items.ts';
import { MOBS, mobName } from '../../data/mobs.ts';
import { WEAPONS } from '../../data/resources.ts';
import { TILE } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

/** A shot in flight, from the player or a monster. Not saved. */
export interface Projectile {
  kind: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  from: 'player' | 'mob';
  born: number;
  pierce: number;
  hit: Set<number>;
  fire?: boolean;
}
/** Height of a creature's middle above its feet, for aiming and hits. */
export const bodyHeight = (a: Animal) => (MOBS[a.type]?.boss ? 60 : 22);
/** How close a hit must land to count, by creature. */
export const bodyRadius = (a: Animal) =>
  a.type === 'boss'
    ? 60
    : MOBS[a.type]?.boss
      ? a.type === 'unmaker' || a.type === 'sporemother'
        ? 90
        : 70
      : 30;

export class Combat extends System {
  projectiles: Projectile[] = [];

  // ─── Taking and dealing damage ─────────────────────────────────────────────
  /** Harms the player through armour; returns the damage actually taken. */
  hurtPlayer(amount: number, source: string, disease?: [string, number]) {
    const s = this.game.s,
      p = s.player;
    if (p.invuln > 0 || s.dead || this.game.dev.god) return 0;
    const cloth = p.cloak ? 0.68 : p.coat ? 0.82 : 1,
      taken = Math.max(1, Math.round(amount * cloth - this.game.equipment.defense() * 0.5));
    s.vitals.health -= taken;
    s.vitals.morale = clamp(s.vitals.morale - 4, 0, RULES.maxVital);
    p.invuln = 0.7;
    p.vy = Math.min(p.vy, -160);
    this.game.sound('hurt');
    this.game.event('damage', p.x, p.y - 50, String(taken), 1);
    if (disease && this.game.rng() < disease[1] + (s.vitals.hygiene < 30 ? 0.1 : 0))
      this.game.contract(disease[0]);
    this.game.say(source + ' · ' + taken + ' damage.', 'danger');
    if (s.vitals.health <= 0) this.game.survival.update(0);
    return taken;
  }
  /** Harms a creature through its defense, knocks it back, and kills it at zero. */
  hurtMob(a: Animal, amount: number, from: Point, magic = false) {
    if (a.deadUntil) return 0;
    if (
      a.type === 'boss' &&
      (WEAPONS[this.game.s.player.weapon]?.[0] ?? 0) < RULES.bossWeaponTier
    ) {
      this.game.say('Ordinary steel glances off the Direwolf. Obsidian is required.', 'danger');
      return 0;
    }
    const spec = MOBS[a.type],
      crit = this.game.rng() < 0.05,
      raw = amount * this.game.equipment.damageBonus(magic) * (crit ? 2 : 1),
      taken = Math.max(1, Math.round(raw - (spec?.defense ?? 0) * 0.5));
    a.hp -= taken;
    a.warning = 0;
    const dir = Math.sign(a.x - from.x) || 1;
    if (!spec?.boss && a.type !== 'boss') {
      a.x += dir * 12;
      if (a.body) a.vy = Math.min(a.vy ?? 0, -140);
    }
    this.game.event('damage', a.x, a.y - bodyHeight(a) * 2, String(taken), crit ? 2 : 0);
    this.game.sound('hit', a.x, a.y - 20);
    if (this.game.equipment.has('fire') && this.game.rng() < 0.3)
      this.game.event('burst', a.x, a.y - 20, '#ff8a3a');
    if (a.hp <= 0) this.game.wildlife.kill(a);
    else this.game.wildlife.cry(a, 'hurt');
    return taken;
  }

  // ─── The player's weapons ──────────────────────────────────────────────────
  /** A melee swing in the facing direction: hits every creature within the arc. */
  swing(weaponId = this.game.s.player.weapon) {
    const s = this.game.s,
      p = s.player,
      weapon = WEAPONS[weaponId] || WEAPONS.fists,
      face = Math.cos(p.face) >= 0 ? 1 : -1;
    const reach = weapon[2] * 1.15,
      centre = { x: p.x, y: p.y - 26 };
    const targets = s.animals.filter((a) => {
      if (a.deadUntil) return false;
      const cy = a.y - bodyHeight(a),
        dx = a.x - centre.x;
      return (
        Math.abs(dx) < reach + bodyRadius(a) * 0.6 &&
        Math.abs(cy - centre.y) < 70 + bodyRadius(a) * 0.5 &&
        dx * face > -24
      );
    });
    const damage = weapon[1] * (s.vitals.stamina < 15 ? 0.72 : 1);
    for (const a of targets) this.hurtMob(a, damage, p);
    if (targets.length === 1) {
      const a = targets[0];
      this.game.say(
        itemName(weaponId) +
          ' struck ' +
          (a.type === 'boss' ? 'the Direwolf' : mobName(a.type).toLowerCase()) +
          '.',
        'combat',
      );
    }
    return targets;
  }
  /** The arrows the player carries, best first. */
  private ammo() {
    return ['crystal_arrow', 'fire_arrow', 'arrow'].find((id) => this.game.count(id) > 0) ?? null;
  }
  /** Fires the held bow or staff toward a point. */
  fire(weaponId: string, target: Point) {
    const s = this.game.s,
      p = s.player,
      spec = RANGED[weaponId];
    if (!spec) return { ok: false, reason: 'That is not a ranged weapon.' };
    let damage = WEAPONS[weaponId]?.[1] ?? 10,
      kind = spec.projectile,
      extra: Partial<Projectile> = {};
    if (spec.kind === 'bow') {
      const arrow = this.ammo();
      if (!arrow)
        return { ok: false, reason: 'No arrows. Make them at a workbench from wood and flint.' };
      this.game.remove(arrow);
      damage += AMMO[arrow].damage;
      if (AMMO[arrow].effect === 'fire') extra = { fire: true };
      if (AMMO[arrow].effect === 'pierce') extra = { pierce: 3 };
      kind = arrow === 'arrow' ? 'arrow' : arrow;
      this.game.sound('bow');
    } else {
      if (!this.game.equipment.spendMana(spec.mana ?? 5))
        return { ok: false, reason: 'Not enough mana.' };
      this.game.sound('cast');
    }
    const origin = { x: p.x + (Math.cos(p.face) >= 0 ? 10 : -10), y: p.y - 30 },
      angle = Math.atan2(target.y - origin.y, target.x - origin.x),
      count = spec.count ?? 1;
    for (let i = 0; i < count; i++) {
      const a = angle + (i - (count - 1) / 2) * (spec.spread ?? 0);
      this.spawn(
        kind === 'fire_arrow' || kind === 'crystal_arrow' ? 'arrow' : kind,
        origin,
        a,
        spec.speed,
        damage,
        'player',
        extra,
      );
    }
    p.face = Math.cos(angle) >= 0 ? 0 : Math.PI;
    return { ok: true };
  }
  spawn(
    kind: string,
    from: Point,
    angle: number,
    speed: number,
    damage: number,
    owner: 'player' | 'mob',
    extra: Partial<Projectile> = {},
  ) {
    const spec = PROJECTILES[kind] ?? PROJECTILES.arrow;
    this.projectiles.push({
      kind,
      x: from.x,
      y: from.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage,
      from: owner,
      born: this.game.s.elapsed,
      pierce: spec.pierce ?? 0,
      hit: new Set(),
      fire: spec.fire,
      ...extra,
    });
    if (this.projectiles.length > 400) this.projectiles.splice(0, this.projectiles.length - 400);
  }
  /** A monster's shot at the player (or a spread of shots). */
  mobShoot(
    a: Animal,
    kind: string,
    speed: number,
    damage: number,
    count = 1,
    spread = 0,
    from?: Point,
  ) {
    const p = this.game.s.player,
      o = from ?? { x: a.x, y: a.y - bodyHeight(a) * 1.5 },
      angle = Math.atan2(p.y - 26 - o.y, p.x - o.x);
    for (let i = 0; i < count; i++)
      this.spawn(kind, o, angle + (i - (count - 1) / 2) * spread, speed, damage, 'mob');
  }
  step(dt: number) {
    const s = this.game.s,
      p = s.player;
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const b = this.projectiles[i],
        spec = PROJECTILES[b.kind] ?? PROJECTILES.arrow,
        age = s.elapsed - b.born;
      if (age > spec.life) {
        this.projectiles.splice(i, 1);
        continue;
      }
      if (spec.homing) {
        // Player shots seek the nearest creature; monster shots seek the player.
        const target =
          b.from === 'player'
            ? s.animals
                .filter((a) => !a.deadUntil && dist(a, b) < 520)
                .sort((m, n) => dist(m, b) - dist(n, b))[0]
            : p;
        if (target) {
          const ty = target === p ? p.y - 26 : (target as Animal).y - bodyHeight(target as Animal),
            want = Math.atan2(ty - b.y, target.x - b.x),
            have = Math.atan2(b.vy, b.vx),
            speed = Math.hypot(b.vx, b.vy);
          let turn = want - have;
          while (turn > Math.PI) turn -= Math.PI * 2;
          while (turn < -Math.PI) turn += Math.PI * 2;
          const next = have + clamp(turn, -spec.homing * dt, spec.homing * dt);
          b.vx = Math.cos(next) * speed;
          b.vy = Math.sin(next) * speed;
        }
      }
      if (spec.drag) {
        const k = Math.exp(-spec.drag * dt);
        b.vx *= k;
        b.vy *= k;
      }
      b.vy += (spec.gravity ?? 0) * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      // Solid ground stops most shots; beams and shockwaves pass over it.
      if (
        (spec.pierce ?? 0) < 90 &&
        this.game.tileAt(Math.floor(b.x / TILE), Math.floor(b.y / TILE))
      ) {
        this.game.event('burst', b.x, b.y, spec.color);
        this.projectiles.splice(i, 1);
        continue;
      }
      let spent = false;
      if (b.from === 'player') {
        for (const a of s.animals) {
          if (a.deadUntil || b.hit.has(a.id)) continue;
          if (Math.hypot(a.x - b.x, a.y - bodyHeight(a) - b.y) > bodyRadius(a) + spec.size)
            continue;
          b.hit.add(a.id);
          this.hurtMob(a, b.damage, b, !!RANGED[p.weapon] && RANGED[p.weapon].kind === 'magic');
          if (b.fire) this.game.event('burst', a.x, a.y - 20, '#ff8a3a');
          if (b.pierce-- <= 0) {
            spent = true;
            break;
          }
        }
      } else if (Math.hypot(p.x - b.x, p.y - 26 - b.y) < 20 + spec.size) {
        this.hurtPlayer(b.damage, this.shotName(b.kind));
        if ((spec.pierce ?? 0) < 90) spent = true;
      }
      if (spent) this.projectiles.splice(i, 1);
    }
  }
  private shotName(kind: string) {
    return (
      (
        {
          arrow: 'An arrow',
          dart: 'A dart',
          fireball: 'A fireball',
          frost_bolt: 'A frost bolt',
          feather: 'Razor feathers',
          spore_cloud: 'Choking spores',
          shockwave: 'The shockwave',
          lightning: 'Lightning',
          eye_beam: 'A burning gaze',
          flame_jet: 'Flames',
          bone_shard: 'Bone shards',
          sun_bolt: 'A sun bolt',
        } as Record<string, string>
      )[kind] ?? 'A blow'
    );
  }
}
