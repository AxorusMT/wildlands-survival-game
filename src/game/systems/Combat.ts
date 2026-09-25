import { clamp, dist } from '../../core/math.ts';
import type { Animal, Point } from '../../core/types.ts';
import { AMMO, ARMOR_SETS, PROJECTILES, RANGED } from '../../data/gear.ts';
import { itemName } from '../../data/items.ts';
import { MOBS, mobName } from '../../data/mobs.ts';
import { WEAPONS } from '../../data/resources.ts';
import { TILE } from '../../data/world.ts';
import { UNDEAD, infusionById } from '../../data/weapons.ts';
import { RULES } from '../rules.ts';
import type { WeaponStats } from './Armoury.ts';

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
  /** The upgraded weapon that fired it, for its afflictions and bonuses. */
  weapon?: WeaponStats;
  /** Turn rate toward the nearest foe, for shots that seek (overrides the projectile's own). */
  homing?: number;
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

/** Monster shots that carry more than a blow. */
const SHOT_DISEASE: Record<string, [string, number]> = {
  glass_shard: ['bleeding', 0.25],
  mire_glob: ['marrow_rot', 0.2],
  prism_bolt: ['glass_cough', 0.04],
};

export class Combat extends System {
  projectiles: Projectile[] = [];
  private combo = 0;
  private lastSwing = -9;

  // ─── Taking and dealing damage ─────────────────────────────────────────────
  /** Harms the player through armour; returns the damage actually taken. */
  hurtPlayer(
    amount: number,
    source: string,
    disease?: [string, number],
    how: 'blow' | 'fire' | 'crush' = 'blow',
  ) {
    const s = this.game.s,
      p = s.player;
    if (amount <= 0 || p.invuln > 0 || s.dead || this.game.dev.god) return 0;
    const sk = this.game.skills.stats(),
      cloth = p.cloak ? 0.68 : p.coat ? 0.82 : 1;
    let scaled = amount * this.game.pocket.damageScale() * Math.max(0.3, 1 + sk.harm);
    // Mana shield: a quarter of the harm is taken from mana while it lasts.
    if (sk.manaShield && s.mana > 0) {
      const soak = Math.min(s.mana, scaled * 0.25);
      s.mana -= soak;
      scaled -= soak;
    }
    const taken = Math.max(1, Math.round(scaled * cloth - this.game.equipment.defense() * 0.5));
    s.vitals.health -= taken;
    s.vitals.morale = clamp(s.vitals.morale - 4, 0, RULES.maxVital);
    p.invuln = 0.7;
    p.vy = Math.min(p.vy, -160);
    this.game.sound('hurt');
    this.game.event('damage', p.x, p.y - 50, String(taken), 1);
    const ail = this.game.ailments,
      blight = this.game.pocket.diseaseScale();
    if (disease && this.game.rng() < (disease[1] + (s.vitals.hygiene < 30 ? 0.1 : 0)) * blight)
      ail.contract(disease[0], disease[0] === 'wound' || disease[0] === 'poisoning');
    // Heavy blows open bleeding wounds or break bones; fire burns.
    if (how === 'fire' ? this.game.rng() < 0.3 : false) ail.contract('burn', true);
    else if (taken >= 22 && this.game.rng() < 0.18) ail.contract('bleeding', true);
    if ((how === 'crush' || taken >= 45) && this.game.rng() < 0.12) ail.contract('fracture', true);
    this.game.say(source + ' · ' + taken + ' damage.', 'danger');
    if (s.vitals.health <= 0) this.game.survival.update(0);
    return taken;
  }
  /** Harms a creature through its defense, knocks it back, and kills it at zero. */
  hurtMob(a: Animal, amount: number, from: Point, magic = false, w?: WeaponStats) {
    if (a.deadUntil || a.settler) return 0;
    if (
      a.type === 'boss' &&
      (WEAPONS[this.game.s.player.weapon]?.[0] ?? 0) < RULES.bossWeaponTier
    ) {
      this.game.say('Ordinary steel glances off the Direwolf. Obsidian is required.', 'danger');
      return 0;
    }
    const spec = MOBS[a.type],
      t = this.game.s.elapsed,
      v = this.game.s.vitals,
      sk = this.game.skills.stats(),
      shooter = w?.family === 'bow' || w?.family === 'crossbow',
      // Deadeye: a shot at a foe still at full health always lands as a critical.
      deadeye = !!(sk.deadeye && shooter && a.hp >= a.maxHp),
      crit = deadeye || this.game.rng() < (w?.crit ?? 0.05);
    // The weapon's bonuses: executions, berserking, great foes, holy light, and marks.
    let k = crit ? (deadeye ? 2.5 : 2 + sk.critDmg) : 1;
    // Keystones: berserk as health falls, and skirmish on the move.
    if (sk.berserker) k *= 1 + 0.4 * (1 - v.health / this.game.maxHealth());
    if (sk.skirmisher && shooter && this.game.s.player.moving) k *= 1.2;
    if (w) {
      if (w.execute && a.hp < a.maxHp * 0.3) k *= 1 + w.execute;
      if (w.berserk && v.health < this.game.maxHealth() / 2) k *= 1 + w.berserk;
      if (w.boss && (spec?.boss || a.type === 'boss')) k *= 1 + w.boss;
      if (w.infusion === 'holy' && UNDEAD.has(a.type)) k *= 1.5;
      if (magic && w.magic) k *= 1 + w.magic;
    }
    if (a.fx?.mark && a.fx.mark[0] > t) k *= 1 + a.fx.mark[1];
    const cracked = (a.fx?.sunder ?? 0) > t ? 0.5 : 1,
      pierce = Math.min(0.9, (w?.armorPierce ?? 0) + (w?.infusion === 'void' ? 0.5 : 0)),
      armour = (spec?.defense ?? 0) * cracked * (1 - pierce),
      raw = amount * this.game.equipment.damageBonus(magic) * k,
      taken = Math.max(1, Math.round(raw - armour * 0.5));
    a.hp -= taken;
    if (w) {
      this.afflict(a, w, taken);
      if (w.id !== 'fists') this.game.skills.train(w.family, taken);
    }
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
  /** What a weapon leaves behind on a blow: wounds, poison, fire, frost, stagger, cracks, marks. */
  private afflict(a: Animal, w: WeaponStats, taken: number) {
    const t = this.game.s.elapsed,
      great = !!MOBS[a.type]?.boss || a.type === 'boss',
      fx = (a.fx ??= {});
    const sk = this.game.skills.stats(),
      elemental = (1 + sk.infusion) * (sk.elementalist ? 1.5 : 1);
    const dot = (key: 'bleed' | 'burn' | 'poison', frac: number, secs: number) => {
      const dps =
        taken * frac * (key === 'bleed' ? 1 : elemental) * (key === 'burn' ? 1 + sk.burnDmg : 1);
      if (!fx[key] || fx[key]![1] < dps || fx[key]![0] < t) fx[key] = [t + secs, dps];
    };
    if (w.bleed) dot('bleed', w.bleed, 3);
    if (w.poison) dot('poison', w.poison, 4);
    if (w.infusion === 'fire') dot('burn', 0.2, 3);
    // A kiln heart (worn or on the shelf) sets some blows alight.
    else if (this.game.equipment.has('fire') && this.game.rng() < 0.3) dot('burn', 0.12, 3);
    if (w.infusion === 'venom') dot('poison', 0.22, 4);
    if (w.infusion === 'frost') fx.slow = t + 3;
    if (w.stagger && !great) fx.stun = t + 0.5;
    if (w.sunder) fx.sunder = t + w.sunder;
    if (w.mark) fx.mark = [t + (w.mark > 0.2 ? 8 : 4), w.mark];
    if (w.heal) this.game.equipment.heal(taken * w.heal);
    // Storm: lightning leaps to the nearest other foe.
    if (w.infusion === 'storm' && this.game.rng() < 0.3) {
      const next = this.game.s.animals
        .filter((b) => b !== a && !b.deadUntil && !b.settler && dist(a, b) < 220)
        .sort((m, n) => dist(a, m) - dist(a, n))[0];
      if (next) {
        this.game.event('burst', next.x, next.y - 20, infusionById('storm')!.color);
        this.hurtMob(next, taken * 0.6, a);
      }
    }
    if (w.infusion) this.game.event('burst', a.x, a.y - 20, infusionById(w.infusion)!.color);
  }

  // ─── The player's weapons ──────────────────────────────────────────────────
  /** A melee swing in the facing direction: hits every creature within the arc. */
  swing(weaponId = this.game.s.player.weapon) {
    this.game.durability.use(weaponId);
    const s = this.game.s,
      p = s.player,
      w = this.game.armoury.stats(WEAPONS[weaponId] ? weaponId : 'fists'),
      face = Math.cos(p.face) >= 0 ? 1 : -1;
    const reach = w.reach * 1.15,
      wide = w.family === 'greatsword' ? 1.5 : 1,
      centre = { x: p.x, y: p.y - 26 };
    const targets = s.animals.filter((a) => {
      if (a.deadUntil || a.settler) return false;
      const cy = a.y - bodyHeight(a),
        dx = a.x - centre.x;
      return (
        Math.abs(dx) < reach + bodyRadius(a) * 0.6 &&
        Math.abs(cy - centre.y) < (70 + bodyRadius(a) * 0.5) * wide &&
        dx * face > -24 * wide
      );
    });
    // Blades build a combo: every third blow in quick succession lands harder.
    this.combo = s.elapsed - this.lastSwing < 1.3 ? this.combo + 1 : 1;
    this.lastSwing = s.elapsed;
    const combo = w.family === 'blade' && this.combo % 3 === 0 ? w.combo : 1,
      damage = w.damage * combo * (s.vitals.stamina < 15 ? 0.72 : 1);
    if (combo > 1 && targets.length) this.game.event('burst', p.x + face * 30, p.y - 30, '#fff0a0');
    for (const a of targets) this.hurtMob(a, damage, p, false, w);
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
    const w = this.game.armoury.stats(weaponId);
    this.game.durability.use(weaponId);
    let damage = w.damage || 10,
      kind = spec.projectile,
      extra: Partial<Projectile> = { weapon: w };
    if (spec.kind === 'bow') {
      const arrow = this.ammo();
      if (!arrow)
        return { ok: false, reason: 'No arrows. Make them at a workbench from wood and flint.' };
      // Salvage, quivers, and a ranger's kit sometimes spare the arrow.
      const sk = this.game.skills.stats(),
        set = this.game.equipment.fullSet(),
        save =
          sk.ammoSave +
          (sk.quiverMaster ? 0.3 : 0) +
          (set && ARMOR_SETS.find((x) => x.key === set)?.bonus === 'ranger' ? 0.25 : 0);
      if (this.game.rng() >= Math.min(0.8, save)) this.game.remove(arrow);
      damage += AMMO[arrow].damage;
      if (AMMO[arrow].effect === 'fire') extra.fire = true;
      if (AMMO[arrow].effect === 'pierce') extra.pierce = 3;
      // Crossbows loose bolts, whatever arrows feed them.
      kind = spec.projectile === 'bolt' ? 'bolt' : arrow === 'arrow' ? 'arrow' : arrow;
      this.game.sound('bow');
    } else {
      const cost = Math.max(1, Math.round((spec.mana ?? 5) * w.mana));
      if (!this.game.equipment.spendMana(cost)) {
        // Overchannel: out of mana, the spell draws on your life instead.
        if (!this.game.skills.flag('overchannel') || s.vitals.health <= cost * 0.6 + 5)
          return { ok: false, reason: 'Not enough mana.' };
        s.vitals.health -= cost * 0.6;
        this.game.event('burst', p.x, p.y - 30, '#c04a6a');
      }
      this.game.sound('cast');
    }
    const origin = { x: p.x + (Math.cos(p.face) >= 0 ? 10 : -10), y: p.y - 30 },
      angle = Math.atan2(target.y - origin.y, target.x - origin.x),
      bonusShots =
        (this.game.rng() < this.game.skills.get('extraShot') ? 1 : 0) +
        (spec.kind === 'bow' && this.game.skills.flag('quiverMaster') ? 1 : 0),
      count = (spec.count ?? 1) + w.count + bonusShots,
      spread = spec.spread ?? (w.count || bonusShots ? 0.1 : 0),
      pierce = (extra.pierce ?? PROJECTILES[kind]?.pierce ?? 0) + w.pierce;
    if (w.homing) extra.homing = w.homing;
    extra.pierce = pierce;
    for (let i = 0; i < count; i++) {
      const a = angle + (i - (count - 1) / 2) * spread;
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
      const homing = b.homing ?? spec.homing;
      if (homing) {
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
          const next = have + clamp(turn, -homing * dt, homing * dt);
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
          if (a.deadUntil || a.settler || b.hit.has(a.id)) continue;
          if (Math.hypot(a.x - b.x, a.y - bodyHeight(a) - b.y) > bodyRadius(a) + spec.size)
            continue;
          b.hit.add(a.id);
          this.hurtMob(
            a,
            b.damage,
            b,
            !!RANGED[p.weapon] && RANGED[p.weapon].kind === 'magic',
            b.weapon,
          );
          if (b.fire) this.game.event('burst', a.x, a.y - 20, '#ff8a3a');
          if (b.pierce-- <= 0) {
            spent = true;
            break;
          }
        }
      } else if (Math.hypot(p.x - b.x, p.y - 26 - b.y) < 20 + spec.size) {
        this.hurtPlayer(
          b.damage,
          this.shotName(b.kind),
          SHOT_DISEASE[b.kind],
          spec.fire
            ? 'fire'
            : b.kind === 'falling_rock' || b.kind === 'shockwave'
              ? 'crush'
              : 'blow',
        );
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
          falling_rock: 'Falling rock',
          brine_spit: 'Brine spit',
          amber_glob: 'Burning amber',
          ash_burst: 'Choking ash',
          kiln_ember: 'A kiln ember',
          glass_shard: 'Falling glass',
          prism_bolt: 'A prism bolt',
          lumen_orb: 'A lumen orb',
          mire_glob: 'Marrow mire',
          steam_puff: 'Scalding steam',
          salt_spray: 'Salt spray',
          heat_bolt: 'A heat bolt',
          hymn_note: 'A hymn note',
          bolt: 'A bolt',
        } as Record<string, string>
      )[kind] ?? 'A blow'
    );
  }
}
