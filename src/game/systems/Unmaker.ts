import { clamp, dist } from '../../core/math.ts';
import type { Animal, Point } from '../../core/types.ts';
import {
  DEATH_SCENE,
  ENTRANCE,
  FINALE_BPM,
  FINALE_SECONDS,
  LAST_STAND,
  SHATTER_AT,
  SHATTER_SECONDS,
  SUPERNOVA,
  UNMADE,
  UNMAKER_BPM,
  UNMAKER_PHASES,
  type UnmakerPhase,
} from '../../data/bosses.ts';
import { MOBS } from '../../data/mobs.ts';
import { TILE } from '../../data/world.ts';
import type { Projectile } from './Combat.ts';

import { System } from './System.ts';

/** A move in progress: which, when it began, and whatever it planned at the start. */
interface Action {
  id: string;
  t0: number;
  dur: number;
  /** How many of its staged beats have already happened. */
  n: number;
  angle?: number;
  dir?: number;
  spots?: Point[];
  gap?: number;
  orbs?: Projectile[];
}
/** A hype moment: a title slammed on screen, the world slowed, the screen shaken. */
export interface Hype {
  kind: 'drop' | 'phase' | 'last';
  title: string;
  sub: string;
  /** Real (unslowed) seconds. */
  start: number;
  dur: number;
  scale: number;
  x: number;
  y: number;
}
/** A cutscene: before each phase, before the last stand, and the Unmaker's death. */
export interface Scene {
  kind: 'phase' | 'last' | 'death';
  /** The phase it leads into. */
  n: number;
  id: number;
  start: number;
  dur: number;
  title: string;
  sub: string;
  x: number;
  y: number;
}

const BEAT = 60 / UNMAKER_BPM,
  BAR = BEAT * 4;
/** Cutscene lengths, in real seconds. */
export const PHASE_SCENE = 3,
  LAST_SCENE = 2.6;
/** How often it tries to sidestep a shot, by phase. */
const DODGE = [0.3, 0.42, 0.55, 0.7];
/** The most of its host it keeps at once. */
const HOST_CAP = 10;

/**
 * The Unmaker, the last great foe. Its fight is a small director rather than a script:
 * - it reads how you fight (blade or bow, where you stand, when you heal) and answers it;
 * - it leads its shots, sidesteps yours, and will not let you hide behind rock;
 * - it grows exponentially more dangerous as it weakens, through four phases and a last
 *   stand, each brought in by a short cutscene that the music follows;
 * - its entrance is timed to the build of its theme, and its death to a phonk turn on the
 *   main theme, so the journey ends where it began.
 */
export class Unmaker extends System {
  /** Real seconds, unslowed by hype moments, for everything that keeps time with the music. */
  clock = 0;
  entrance: { id: number; start: number; x: number; y: number } | null = null;
  hype: Hype | null = null;
  cutscene: Scene | null = null;
  /** Until when (on the clock) the finale's music plays. */
  finaleUntil = -1;
  /** When the current theme began (on the clock), and its tempo, for beat-synced effects. */
  beatOrigin = 0;
  bpm = UNMAKER_BPM;
  private actions = new Map<number, Action>();
  /** Where you like to stand: seconds spent in each 64 px column, fading. */
  private haunts = new Map<number, number>();
  /** Recent harm by kind, fading, to learn whether you fight close or at range. */
  private ledger = { melee: 0, ranged: 0 };
  private stillFor = 0;
  private recent: string[] = [];
  private dodgeAt = 0;
  private blockedFor = 0;
  private healthWas = 0;
  private healedAt = -99;

  // ─── Time and presentation ─────────────────────────────────────────────────
  /** Advances the real clock; call with the unslowed tick. */
  tickClock(dt: number) {
    this.clock += dt;
    if (this.hype && this.clock > this.hype.start + this.hype.dur) this.hype = null;
    if (this.entrance && this.clock > this.entrance.start + ENTRANCE + 2) this.entrance = null;
    const c = this.cutscene;
    if (c?.kind === 'death') this.dying(c);
    if (c && this.clock > c.start + c.dur) this.cutscene = null;
  }
  /** The world runs slow during hype moments and cutscenes (the Unmaker itself keeps real time). */
  timeScale() {
    const c = this.cutscene;
    // The world crawls while it dies, and runs on again once it has fallen.
    if (c?.kind === 'death') return this.clock - c.start < UNMADE ? 0.08 : 1;
    if (c) return 0.15;
    return this.hype ? this.hype.scale : 1;
  }
  /** Whether an entrance or a cutscene holds the player still. */
  frozen() {
    const c = this.cutscene;
    // You are held through its death until the screen comes back on.
    if (c?.kind === 'death' && this.clock - c.start > SHATTER_AT + SHATTER_SECONDS) return false;
    return (!!this.entrance && this.clock < this.entrance.start + ENTRANCE) || !!c;
  }
  /** Whether the finale's music should play. */
  finale() {
    return this.clock < this.finaleUntil;
  }
  /** Beats of the current theme since it began. */
  beat() {
    return ((this.clock - this.beatOrigin) * this.bpm) / 60;
  }
  /** The Unmaker in the field, if it has come. */
  foe(): Animal | null {
    return this.game.s.animals.find((a) => a.type === 'unmaker' && !a.deadUntil) ?? null;
  }
  /** The phase (0 to 3) the Unmaker is in, for the music. */
  phase(a = this.foe()) {
    return a?.timers?.phase ?? 0;
  }
  /**
   * How dangerous it has become: 1 at full health, doubling every 38% of its health lost,
   * to about six at the end. Everything it does scales from this.
   */
  intensity(a: Animal) {
    return 2 ** (2.6 * (1 - clamp(a.hp / a.maxHp, 0, 1)));
  }
  /** Where the camera should look, if anywhere in particular. */
  focus(): Point | null {
    const a = this.foe();
    if (this.cutscene) return { x: this.cutscene.x, y: this.cutscene.y - 60 };
    if (this.entrance && this.frozen() && a) {
      const p = this.game.s.player;
      return { x: (p.x + a.x) / 2, y: (p.y + a.y) / 2 - 40 };
    }
    return null;
  }
  /** How hard to shake the screen right now, 0 to 1. */
  shake() {
    if (this.entrance && this.frozen() && !this.cutscene) {
      const into = this.clock - this.entrance.start;
      return clamp((into - BAR * 2) / (BAR * 2), 0, 1) * 0.45;
    }
    const c = this.cutscene;
    if (c) {
      const into = this.clock - c.start;
      if (c.kind === 'death') {
        if (into < 0.3) return 1;
        if (into < SUPERNOVA) return 0.25 + (into / SUPERNOVA) * 0.55;
        return clamp(1 - (into - SUPERNOVA) / 1.5, 0, 1);
      }
      return clamp((into - 0.3) / (c.dur - 0.5), 0, 1) * 0.6 + (into > c.dur - 0.25 ? 0.4 : 0);
    }
    if (!this.hype) return 0;
    const k = 1 - (this.clock - this.hype.start) / this.hype.dur;
    return clamp(k, 0, 1) * (this.hype.kind === 'phase' ? 0.8 : 1);
  }
  /** What the interface should show: the entrance (by beat), a cutscene, or a hype moment. */
  overlay():
    | { mode: 'entrance'; beat: number; into: number }
    | { mode: 'scene'; scene: Scene; t: number }
    | { mode: 'hype'; hype: Hype; t: number }
    | null {
    if (this.cutscene)
      return { mode: 'scene', scene: this.cutscene, t: this.clock - this.cutscene.start };
    if (this.entrance && this.frozen()) {
      const into = this.clock - this.entrance.start;
      return { mode: 'entrance', beat: Math.floor(into / BEAT), into };
    }
    if (this.hype) return { mode: 'hype', hype: this.hype, t: this.clock - this.hype.start };
    return null;
  }
  /** How the Unmaker should look: its phase, how dangerous it is, and how it is convulsing. */
  look(a: Animal) {
    const c = this.cutscene,
      into = c ? this.clock - c.start : 0;
    return {
      phase: this.phase(a),
      intensity: this.intensity(a),
      last: !!a.timers?.lastStand,
      convulse: c ? clamp(into / (c.kind === 'death' ? SUPERNOVA : c.dur), 0, 1) : 0,
      dying: c?.kind === 'death' ? into : -1,
      shielded: (a.intro ?? 0) > 0 || !!c || (a.timers?.shieldUntil ?? 0) > this.game.s.elapsed,
    };
  }

  // ─── The entrance ──────────────────────────────────────────────────────────
  /** Called as the Unmaker is summoned: it waits in the tear while its theme builds. */
  begin(a: Animal) {
    a.intro = ENTRANCE;
    a.reveal = 0;
    a.timers = { ...(a.timers ?? {}), phase: 0 };
    a.x = a.homeX;
    a.y = a.homeY;
    this.entrance = { id: a.id, start: this.clock, x: a.homeX, y: a.homeY };
    this.hype = null;
    this.cutscene = null;
    this.finaleUntil = -1;
    this.beatOrigin = this.clock;
    this.bpm = UNMAKER_BPM;
    this.actions.clear();
    this.haunts.clear();
    this.ledger = { melee: 0, ranged: 0 };
    this.recent = [];
    this.healthWas = this.game.s.vitals.health;
  }
  /** Skips the rest of the entrance (once you have seen it through before). */
  skip() {
    const a = this.foe();
    if (!a || !(a.intro ?? 0) || !this.entrance || this.cutscene) return false;
    if (!(this.game.s.bosses.unmaker > 0)) return false;
    this.drop(a);
    return true;
  }
  private rise(a: Animal, dt: number) {
    const p = this.game.s.player,
      into = ENTRANCE - (a.intro ?? 0),
      beat = Math.floor(into / BEAT),
      e = this.entrance ?? { x: a.homeX, y: a.homeY };
    a.intro = Math.max(0, (a.intro ?? 0) - dt);
    // It rises through the tear across the third bar and holds for the gap before the drop.
    a.reveal = clamp((into - BAR * 2) / (BAR * 1.75), 0, 1);
    a.x = e.x;
    a.y = e.y + (1 - a.reveal) * 120;
    a.vx = a.vy = 0;
    p.invuln = Math.max(p.invuln, (a.intro ?? 0) + 1);
    a.timers ??= {};
    if (beat !== a.timers.introBeat) {
      a.timers.introBeat = beat;
      // The tear opens in the second bar and drinks in the light on every beat.
      if (beat >= 4 && beat < 15)
        this.game.event('implode', e.x, e.y - 60, beat >= 8 ? '#ff5a8a' : '#b36cff');
      if (beat >= 8 && beat < 15) this.game.event('rays', e.x, e.y - 60, '#ffd0f0', beat - 7);
      if (beat === 4) this.game.sound('portal', e.x, e.y, 1.2);
      if (beat >= 12 && beat < 15) this.game.sound('boss', e.x, e.y - 40, 0.5 + (beat - 12) * 0.3);
    }
    if (!a.intro) this.drop(a);
  }
  /** The beat drops: a shockwave, a fanfare ring, and the fight is on. */
  private drop(a: Animal) {
    const s = this.game.s;
    a.intro = 0;
    a.reveal = 1;
    a.attackAt = s.elapsed + 1.2;
    s.player.invuln = Math.max(s.player.invuln, 1.5);
    this.shockwave(a, 560);
    this.game.event('supernova', a.x, a.y - 60, '#ff5a8a');
    for (let i = 0; i < 16; i++)
      this.game.combat.spawn(
        'eye_beam',
        { x: a.x, y: a.y - 60 },
        (i / 16) * Math.PI * 2,
        420,
        0,
        'mob',
      );
    this.hype = {
      kind: 'drop',
      title: 'THE UNMAKER',
      sub: 'THE END OF ALL THINGS',
      start: this.clock,
      dur: 1.6,
      scale: 1,
      x: a.x,
      y: a.y,
    };
    if (this.entrance) this.entrance.start = Math.min(this.entrance.start, this.clock - ENTRANCE);
    this.game.sound('boss', a.x, a.y - 40, 1.8);
    this.game.say('THE UNMAKER HAS COME.', 'danger');
    this.muster(a, UNMAKER_PHASES[0], true);
  }

  // ─── The fight ─────────────────────────────────────────────────────────────
  step(a: Animal, dt: number) {
    const s = this.game.s,
      t = s.elapsed;
    a.timers ??= {};
    if ((a.intro ?? 0) > 0) {
      // A fight reloaded mid-entrance simply begins.
      if (!this.entrance || this.entrance.id !== a.id) {
        a.intro = 0;
        a.reveal = 1;
      } else return this.rise(a, dt);
    }
    // In a cutscene the Unmaker keeps real time while the world crawls.
    if (this.cutscene) return this.performScene(a, dt / this.timeScale());
    const k = this.intensity(a);
    this.observe(dt);
    if (this.nextPhase(a)) return;
    const phase = a.timers.phase ?? 0;
    // After a phase it gathers itself for a moment, untouchable, as the new host arrives.
    if ((a.timers.shieldUntil ?? 0) > t) {
      this.drift(a, a.x, s.player.y - 260, 80, dt);
      return;
    }
    this.dodge(a, phase, k);
    this.position(a, phase, k, dt);
    if (this.due(a, 'muster', (14 - phase * 2) / k ** 0.4))
      this.muster(a, UNMAKER_PHASES[phase], false);
    const act = this.actions.get(a.id);
    if (act) this.perform(a, act, phase, k);
    else if (t >= a.attackAt) this.choose(a, phase);
  }
  /**
   * Its hide, while its shades live, lets most harm pass into them. Returns the harm that lands:
   * none during its entrance or a cutscene, or while it gathers itself after a phase.
   */
  absorb(a: Animal, amount: number, from: Point) {
    const t = this.game.s.elapsed;
    if ((a.intro ?? 0) > 0 || this.cutscene || (a.timers?.shieldUntil ?? 0) > t) return 0;
    if (dist(from, a) > 180) this.ledger.ranged += amount;
    else this.ledger.melee += amount;
    const shades = this.game.s.animals.filter(
      (m) => m.type === 'void_shade' && !m.deadUntil,
    ).length;
    return shades >= 2
      ? Math.round(amount * 0.35)
      : shades === 1
        ? Math.round(amount * 0.7)
        : amount;
  }
  /**
   * The killing blow does not kill it outright: it holds on at the edge of death for its
   * death scene, and only then falls. Returns true while it is not yet time to die.
   */
  intercept(a: Animal) {
    if (a.timers?.unmade) return false;
    a.hp = 1;
    if (this.cutscene?.kind !== 'death') this.startScene(a, 'death', this.phase(a));
    return true;
  }

  // ─── Cutscenes ─────────────────────────────────────────────────────────────
  private startScene(a: Animal, kind: Scene['kind'], n: number) {
    const p = this.game.s.player,
      ph = UNMAKER_PHASES[n];
    this.actions.delete(a.id);
    this.hype = null;
    const titles: Record<Scene['kind'], [string, string]> = {
      phase: ['PHASE ' + (ph?.name ?? ''), (ph?.title ?? '').toUpperCase()],
      last: ['UNMAKING', 'IT WILL NOT GO QUIETLY'],
      death: ['UNMADE', 'THE WILDLANDS ENDURE'],
    };
    const [title, sub] = titles[kind];
    // It rises to where you can see it, above you.
    const x = kind === 'death' ? a.x : (a.x + p.x) / 2,
      y = kind === 'death' ? a.y : Math.min(a.y, p.y - 200);
    this.cutscene = {
      kind,
      n,
      id: a.id,
      start: this.clock,
      dur: kind === 'death' ? DEATH_SCENE : kind === 'last' ? LAST_SCENE : PHASE_SCENE,
      title,
      sub,
      x,
      y,
    };
    // The field is cleared: its shots are gone, and you are out of harm's way while it plays.
    this.game.combat.projectiles = this.game.combat.projectiles.filter((b) => b.from !== 'mob');
    p.invuln = Math.max(p.invuln, this.cutscene.dur + 1.5);
    this.game.event('implode', a.x, a.y - 60, kind === 'death' ? '#ffffff' : '#ff5a8a');
    this.game.sound('boss', a.x, a.y - 40, kind === 'death' ? 2 : 1.4);
    if (kind === 'death') {
      // The killing blow: a hit-stop, a flash, and the finale starts.
      this.finaleUntil = this.clock + FINALE_SECONDS;
      this.beatOrigin = this.clock;
      this.bpm = FINALE_BPM;
      this.game.say('The killing blow lands…', 'victory');
    }
  }
  /** Plays the Unmaker's part in a cutscene, in real seconds. */
  private performScene(a: Animal, rdt: number) {
    const c = this.cutscene!,
      into = this.clock - c.start,
      beat = Math.floor(into / (60 / this.bpm));
    a.timers ??= {};
    a.vx = a.vy = 0;
    if (c.kind !== 'death') {
      // It drifts into view and convulses as it gathers its next form.
      a.x += (c.x - a.x) * (1 - Math.exp(-rdt * 3));
      a.y += (c.y - a.y) * (1 - Math.exp(-rdt * 3));
      if (beat !== a.timers.sceneBeat) {
        a.timers.sceneBeat = beat;
        this.game.event('implode', a.x, a.y - 60, beat % 2 ? '#ff5a8a' : '#b36cff');
        if (into > 0.8) this.game.event('rays', a.x, a.y - 60, '#ff5a8a', Math.min(8, beat));
      }
      if (into >= c.dur - 0.2 && !a.timers.sceneDone) {
        a.timers.sceneDone = 1;
        if (c.kind === 'phase') this.enterPhase(a, c.n);
        else this.lastStand(a);
      }
    }
    if (into < 0.1) a.timers.sceneDone = 0;
  }
  /** The death scene runs on the real clock, even after the body is gone. */
  private dying(c: Scene) {
    const into = this.clock - c.start,
      a = this.game.s.animals.find((m) => m.id === c.id),
      beat = Math.floor(into / (60 / this.bpm));
    if (a && into < UNMADE) {
      a.timers ??= {};
      // It shudders and cracks, rays of light breaking out of it on every beat...
      if (beat !== a.timers.deathBeat) {
        a.timers.deathBeat = beat;
        this.game.event(
          'rays',
          a.x,
          a.y - 60,
          beat % 2 ? '#ffffff' : '#ffd0f0',
          Math.min(12, 2 + beat),
        );
        this.game.event('implode', a.x, a.y - 60, '#ffffff');
        this.game.sound('crumble', a.x, a.y - 40, 0.6 + into * 0.15);
        // ...and its host goes out one by one.
        const minion = this.game.s.animals.find((m) => m.minion && !m.deadUntil);
        if (minion) {
          this.game.event('supernova', minion.x, minion.y - 20, '#b36cff');
          minion.deadUntil = this.game.s.elapsed + 999999;
        }
      }
      // It rises as it comes apart.
      if (into > SUPERNOVA - 1.4) a.y -= 0.7;
      if (into >= SUPERNOVA && !a.timers.nova) {
        a.timers.nova = 1;
        a.reveal = 0;
        this.game.event('supernova', a.x, a.y - 60, '#ffffff');
        this.game.event('shockwave', a.x, a.y - 60, '#ffffff');
        this.game.sound('boss', a.x, a.y - 40, 2.2);
      }
    }
    if (a && into >= UNMADE && !a.timers?.unmade) {
      a.timers!.unmade = 1;
      a.hp = 0;
      this.game.wildlife.kill(a);
    }
  }
  /** The Unmaker falls (called by the boss system as it dies). */
  defeated(a: Animal) {
    this.actions.delete(a.id);
    this.entrance = null;
    for (const m of this.game.s.animals)
      if (m.minion && !m.deadUntil) this.game.event('supernova', m.x, m.y - 20, '#ffffff');
  }

  // ─── Phases ────────────────────────────────────────────────────────────────
  private nextPhase(a: Animal) {
    const frac = a.hp / a.maxHp,
      phase = a.timers!.phase ?? 0;
    const next = UNMAKER_PHASES[phase + 1];
    if (next && frac <= next.at) {
      this.startScene(a, 'phase', phase + 1);
      return true;
    }
    if (frac <= LAST_STAND && !a.timers!.lastStand) {
      this.startScene(a, 'last', phase);
      return true;
    }
    return false;
  }
  private enterPhase(a: Animal, n: number) {
    const ph = UNMAKER_PHASES[n];
    a.timers!.phase = n;
    a.timers!.shieldUntil = this.game.s.elapsed + 1.2;
    this.shockwave(a, 620);
    this.game.event('supernova', a.x, a.y - 60, '#ff5a8a');
    this.hype = {
      kind: 'phase',
      title: 'PHASE ' + ph.name,
      sub: ph.title.toUpperCase(),
      start: this.clock,
      dur: 0.9,
      scale: 0.4,
      x: a.x,
      y: a.y,
    };
    // The next theme starts on the slam, and the aura follows its tempo.
    this.beatOrigin = this.clock;
    this.bpm = ph.bpm;
    this.game.sound('boss', a.x, a.y - 40, 1.6);
    this.game.say(`Phase ${ph.name} · ${ph.title}.`, 'danger');
    this.muster(a, ph, true);
  }
  private lastStand(a: Animal) {
    a.timers!.lastStand = 1;
    a.timers!.shieldUntil = this.game.s.elapsed + 1;
    this.shockwave(a, 620);
    this.game.event('supernova', a.x, a.y - 60, '#ff2a4a');
    this.hype = {
      kind: 'last',
      title: 'UNMAKING',
      sub: 'IT WILL NOT GO QUIETLY',
      start: this.clock,
      dur: 0.9,
      scale: 0.4,
      x: a.x,
      y: a.y,
    };
    this.game.say('The Unmaker makes its last stand!', 'danger');
    for (const ph of UNMAKER_PHASES.slice(1)) this.muster(a, ph, true);
  }
  /** A blast outward: shots near it are swept away and you are thrown clear. */
  private shockwave(a: Animal, r: number) {
    const p = this.game.s.player,
      c = this.game.combat;
    this.game.event('shockwave', a.x, a.y - 60, '#ff5a8a');
    c.projectiles = c.projectiles.filter((b) => b.from !== 'mob' || dist(b, a) > r);
    if (dist(p, a) < r) {
      p.push = (Math.sign(p.x - a.x) || 1) * 620;
      p.vy = -360;
      p.grounded = false;
    }
  }
  /** Brings its host up to strength (all at once on a phase, one at a time otherwise). */
  private muster(a: Animal, ph: UnmakerPhase, all: boolean) {
    const alive = (type: string) =>
      this.game.s.animals.filter((m) => m.type === type && m.minion && !m.deadUntil).length;
    for (const [type, want] of ph.minions) {
      let short = want - alive(type);
      while (short-- > 0) {
        const side = this.game.rng() < 0.5 ? -1 : 1,
          x = a.x + side * (180 + this.game.rng() * 200),
          y = MOBS[type].move === 'walker' ? this.game.floorNear(x, a.y) : a.y - 40;
        this.game.bosses.minion(type, x, y, HOST_CAP);
        this.game.event('implode', x, y - 20, '#b36cff');
        if (!all) return;
      }
    }
  }

  /** Learns your habits: where you stand, whether you keep still, when you heal. */
  private observe(dt: number) {
    const s = this.game.s,
      p = s.player,
      fade = Math.exp(-dt / 20);
    for (const [k, v] of this.haunts) this.haunts.set(k, v * fade);
    const col = Math.floor(p.x / 64);
    this.haunts.set(col, (this.haunts.get(col) ?? 0) + dt);
    this.ledger.melee *= Math.exp(-dt / 25);
    this.ledger.ranged *= Math.exp(-dt / 25);
    this.stillFor = Math.abs(p.vx) < 30 && p.grounded ? this.stillFor + dt : 0;
    if (s.vitals.health > this.healthWas + 4) this.healedAt = s.elapsed;
    this.healthWas = s.vitals.health;
  }
  /** Whether you have been fighting mostly from range lately. */
  private ranged() {
    return this.ledger.ranged > this.ledger.melee * 1.5 && this.ledger.ranged > 200;
  }

  // ─── Moving ────────────────────────────────────────────────────────────────
  /** Sidesteps your shots, and backs off from a blade that has come too close. */
  private dodge(a: Animal, phase: number, k: number) {
    const s = this.game.s,
      t = s.elapsed,
      chance = Math.min(0.9, DODGE[phase] * k ** 0.25);
    if (t < this.dodgeAt) return;
    const threat = this.game.combat.projectiles.find((b) => {
      if (b.from !== 'player') return false;
      const dx = a.x - b.x,
        dy = a.y - 60 - b.y,
        speed = Math.hypot(b.vx, b.vy) || 1,
        closing = (dx * b.vx + dy * b.vy) / speed;
      return closing > 0 && Math.hypot(dx, dy) / speed < 0.45;
    });
    let dx = 0,
      dy = 0;
    if (threat && this.game.rng() < chance) {
      const speed = Math.hypot(threat.vx, threat.vy) || 1,
        side = this.game.rng() < 0.5 ? -1 : 1;
      dx = (-threat.vy / speed) * side * 130;
      dy = (threat.vx / speed) * side * 130;
    } else if (dist(s.player, a) < 120 && !this.ranged() && this.game.rng() < chance * 0.5) {
      dx = Math.sign(a.x - s.player.x || 1) * 240;
      dy = -60;
    } else return;
    this.game.event('burst', a.x, a.y - 60, '#b36cff');
    a.x += dx;
    a.y = Math.min(a.y + dy, this.game.floorNear(a.x, a.y) - 90);
    this.game.event('burst', a.x, a.y - 60, '#ff5a8a');
    this.dodgeAt = t + (1.8 - phase * 0.3) / k ** 0.3;
  }
  /** Keeps its distance for how you fight, circling, and never lets rock stand between you. */
  private position(a: Animal, phase: number, k: number, dt: number) {
    const p = this.game.s.player,
      range = this.ranged() ? 230 : this.ledger.melee > 300 ? 430 : 330;
    a.timers!.orbit = (a.timers!.orbit ?? 0) + dt * (0.5 + phase * 0.15) * k ** 0.2;
    const orb = a.timers!.orbit,
      tx = p.x + Math.cos(orb) * range,
      ty = p.y - 210 + Math.sin(orb * 1.3) * 60;
    const speed = MOBS.unmaker.speed[1] * (1 + phase * 0.15) * k ** 0.2;
    if (this.sees(a)) this.blockedFor = 0;
    else {
      this.blockedFor += dt;
      // Hiding behind rock only works for a moment: it comes through the dark to find you.
      if (this.blockedFor > 1.6 / k ** 0.3) {
        this.blockedFor = 0;
        this.game.event('burst', a.x, a.y - 60, '#b36cff');
        a.x = p.x + (this.game.rng() < 0.5 ? -1 : 1) * 160;
        a.y = p.y - 220;
        this.game.event('implode', a.x, a.y - 60, '#ff5a8a');
        this.game.sound('portal', a.x, a.y, 0.9);
        return;
      }
    }
    this.drift(a, tx, ty, speed, dt);
    a.angle = p.x >= a.x ? 0 : Math.PI;
  }
  private drift(a: Animal, tx: number, ty: number, speed: number, dt: number) {
    const dx = tx - a.x,
      dy = ty - a.y,
      len = Math.hypot(dx, dy) || 1,
      k = 1 - Math.exp(-dt * 2.6);
    a.vx = (a.vx ?? 0) + ((dx / len) * Math.min(speed, len * 3) - (a.vx ?? 0)) * k;
    a.vy = (a.vy ?? 0) + ((dy / len) * Math.min(speed, len * 3) - (a.vy ?? 0)) * k;
    a.x += a.vx * dt;
    a.y += a.vy * dt;
  }
  /** Whether it has a clear line to you. */
  sees(a: Animal) {
    const p = this.game.s.player,
      x0 = a.x,
      y0 = a.y - 60,
      x1 = p.x,
      y1 = p.y - 26;
    for (let i = 1; i < 12; i++) {
      const x = x0 + ((x1 - x0) * i) / 12,
        y = y0 + ((y1 - y0) * i) / 12;
      if (this.game.tileAt(Math.floor(x / TILE), Math.floor(y / TILE))) return false;
    }
    return true;
  }

  // ─── Choosing and making its moves ─────────────────────────────────────────
  /**
   * Weighs every move open to it in this phase against the moment: how far you are, whether
   * you are in the air, standing still, hurt, or healing, and what it has just done.
   */
  private choose(a: Animal, phase: number) {
    const s = this.game.s,
      p = s.player,
      d = dist(p, a),
      air = !p.grounded,
      hurt = s.vitals.health / this.game.equipment.maxHealth() < 0.35,
      healing = s.elapsed - this.healedAt < 3,
      camping = this.stillFor > 1.4,
      ranged = this.ranged();
    const weigh: [string, number][] = [
      ['gaze', hurt || healing ? 1.8 : 1],
      ['ring', d < 280 ? 1.3 : 0.7],
    ];
    if (phase >= 1) weigh.push(['sweep', d > 260 ? 1.2 : 0.6], ['blink', ranged ? 1.5 : 0.8]);
    if (phase >= 2) weigh.push(['pillars', camping ? 2.4 : 1], ['orbs', healing ? 1.6 : 0.9]);
    if (phase >= 3) weigh.push(['well', ranged ? 1.6 : 0.9], ['curtain', air ? 0.6 : 1.2]);
    let best = 'gaze',
      score = -1;
    for (const [id, w] of weigh) {
      const repeat = this.recent.includes(id) ? (this.recent[0] === id ? 0.2 : 0.5) : 1,
        v = w * repeat * (0.6 + this.game.rng() * 0.8);
      if (v > score) [best, score] = [id, v];
    }
    this.recent.unshift(best);
    this.recent.length = Math.min(this.recent.length, 3);
    this.start(a, best, phase);
  }
  private start(a: Animal, id: string, phase: number) {
    const s = this.game.s,
      p = s.player,
      rng = this.game.rng;
    const act: Action = { id, t0: s.elapsed, n: 0, dur: 1 };
    switch (id) {
      case 'gaze':
        act.dur = 0.35 + 0.18 * (3 + phase + 2);
        break;
      case 'ring':
        act.dur = phase >= 2 ? 1.1 : 0.7;
        act.angle = rng() * Math.PI * 2;
        break;
      case 'sweep':
        act.dur = 1.9;
        act.angle = this.aim({ x: a.x, y: a.y - 60 }, 900, 0.6);
        act.dir = rng() < 0.5 ? -1 : 1;
        break;
      case 'blink':
        act.dur = 0.8;
        break;
      case 'pillars': {
        // Where you stand, where you are going, and where you like to be.
        const spots = [p.x, p.x + (p.vx ?? 0) * 0.9, this.haunt()];
        act.spots = [];
        for (const x of spots)
          if (act.spots.every((q) => Math.abs(q.x - x) > 60))
            act.spots.push({ x, y: this.game.floorNear(x, p.y - 40) });
        act.dur = 1.3;
        break;
      }
      case 'orbs':
        act.dur = 2.9;
        act.orbs = [];
        break;
      case 'well':
        act.dur = 3;
        break;
      case 'curtain':
        act.dur = a.timers?.lastStand ? 2.4 : 1.6;
        act.gap = p.x + (rng() < 0.5 ? -1 : 1) * (130 + rng() * 170);
        break;
    }
    a.warning = 0.5;
    this.actions.set(a.id, act);
  }
  /** Runs a move through its staged beats; each stage fires once. */
  private perform(a: Animal, act: Action, phase: number, k: number) {
    const s = this.game.s,
      p = s.player,
      e = s.elapsed - act.t0,
      c = this.game.combat,
      eye = { x: a.x, y: a.y - 60 },
      // Harder as it weakens: more damage, faster shots, more of them.
      hit = k ** 0.4,
      fast = k ** 0.15,
      more = Math.floor(Math.log2(k));
    // A stage is due once its time has come (stages are numbered from 0).
    const stage = (i: number, at: number) => e >= at && act.n <= i && (act.n = i + 1) > 0;
    switch (act.id) {
      case 'gaze':
        // A tell, then a volley: each shot alternately where you are and where you will be.
        if (stage(0, 0)) this.game.event('burst', eye.x, eye.y, '#ff5a8a');
        for (let i = 0; i < 3 + phase + more; i++)
          if (stage(i + 1, 0.35 + i * 0.18))
            c.spawn(
              'eye_beam',
              eye,
              this.aim(eye, 660 * fast, i % 2 ? 0 : 1),
              660 * fast,
              58 * hit,
              'mob',
            );
        break;
      case 'ring': {
        const n = 12 + phase * 2 + more * 2;
        if (stage(0, 0)) this.game.event('implode', eye.x, eye.y, '#ff5a8a');
        if (stage(1, 0.5)) this.ring(eye, n, 300 * fast, 52 * hit, act.angle!);
        // From the third phase a second ring turns the other way through the gaps.
        if (phase >= 2 && stage(2, 0.9))
          this.ring(eye, n, 340 * fast, 52 * hit, act.angle! + Math.PI / n);
        break;
      }
      case 'sweep':
        if (stage(0, 0)) this.game.event('implode', eye.x, eye.y, '#ffd0f0');
        // A sweeping fan of lances through the rock, from one side of you to the other.
        if (e >= 0.6 && e < 1.8) {
          const i = Math.floor((e - 0.6) / 0.06);
          if (stage(i + 1, 0.6 + i * 0.06)) {
            const ang = act.angle! + act.dir! * (-1 + (i / 20) * 2);
            c.spawn('void_lance', eye, ang, 900 * fast, 60 * hit, 'mob');
          }
        }
        break;
      case 'blink':
        // It vanishes and returns behind you, where you are heading, and fires point-blank.
        if (stage(0, 0)) this.game.event('implode', eye.x, eye.y, '#b36cff');
        if (stage(1, 0.25)) {
          const ahead = Math.sign(p.vx || Math.cos(p.face)) || 1;
          a.x = p.x + (p.vx ?? 0) * 0.5 - ahead * 190;
          a.y = Math.min(p.y - 150, this.game.floorNear(a.x, p.y) - 110);
          this.game.event('burst', a.x, a.y - 60, '#ff5a8a');
          this.game.sound('portal', a.x, a.y, 0.9);
        }
        if (stage(2, 0.55)) {
          const at = { x: a.x, y: a.y - 60 },
            ang = this.aim(at, 700, 1);
          for (let i = -2 - more; i <= 2 + more; i++)
            c.spawn('eye_beam', at, ang + i * 0.16, 700 * fast, 64 * hit, 'mob');
        }
        break;
      case 'pillars':
        // The ground is marked, then tears open where it was marked.
        for (let i = 0; i < 6; i++)
          if (stage(i, i * 0.15))
            for (const q of act.spots!) this.game.event('burst', q.x, q.y, '#b36cff');
        if (stage(6, 0.9))
          for (const q of act.spots!) {
            this.game.event('rays', q.x, q.y, '#b36cff', 3);
            for (const dx of [-16, 0, 16])
              c.spawn(
                'rift_spike',
                { x: q.x + dx, y: q.y + 10 },
                -Math.PI / 2,
                900,
                70 * hit,
                'mob',
              );
          }
        break;
      case 'orbs':
        if (stage(0, 0.3))
          for (let i = 0; i < 2 + (phase >= 3 ? 1 : 0) + more; i++) {
            c.spawn(
              'null_orb',
              eye,
              this.aim(eye, 170, 0) + (i - 1) * 0.7,
              170 * fast,
              45 * hit,
              'mob',
            );
            act.orbs!.push(c.projectiles[c.projectiles.length - 1]);
          }
        // Each orb that has not found you bursts into a ring.
        if (stage(1, 2.8))
          for (const o of act.orbs!) {
            const i = c.projectiles.indexOf(o);
            if (i < 0) continue;
            c.projectiles.splice(i, 1);
            this.game.event('supernova', o.x, o.y, '#b36cff');
            this.ring(o, 8 + more * 2, 280 * fast, 44 * hit, 0);
          }
        break;
      case 'well': {
        // It drinks in the world: you are dragged toward it while beams spin out.
        if (stage(0, 0)) this.game.event('implode', eye.x, eye.y, '#b36cff');
        if (e > 0.4) {
          const pull = Math.sign(a.x - p.x) * 190 * fast;
          p.push = (p.push ?? 0) + (pull - (p.push ?? 0)) * 0.2;
          if (Math.floor(e * 10) % 3 === 0) this.game.event('implode', p.x, p.y - 30, '#b36cff');
        }
        for (let i = 0; i < 5; i++)
          if (stage(i + 1, 0.5 + i * 0.5)) this.ring(eye, 6 + more, 260 * fast, 48 * hit, i * 0.4);
        break;
      }
      case 'curtain': {
        // A wall of lances falls from above, with one gap marked in white.
        if (stage(0, 0))
          for (let i = 0; i < 4; i++)
            this.game.event('burst', act.gap!, p.y - 40 - i * 40, '#ffffff');
        const drop = (gap: number) => {
          for (let x = p.x - 560; x <= p.x + 560; x += 56)
            if (Math.abs(x - gap) > 70)
              c.spawn('void_lance', { x, y: p.y - 520 }, Math.PI / 2, 520 * fast, 66 * hit, 'mob');
        };
        if (stage(1, 0.7)) drop(act.gap!);
        if (act.dur > 2 && stage(2, 1.5)) drop(p.x + (p.x > act.gap! ? -1 : 1) * 200);
        break;
      }
    }
    if (e >= act.dur) {
      this.actions.delete(a.id);
      // It rests less and less between moves as it weakens.
      a.attackAt = s.elapsed + ((1.1 - phase * 0.15) * (a.timers?.lastStand ? 0.7 : 1)) / k ** 0.55;
    }
  }
  /** Aims at you, leading by `lead` of your motion: where a shot at `speed` will meet you. */
  aim(from: Point, speed: number, lead = 1) {
    const p = this.game.s.player,
      vx = (p.vx ?? 0) * lead,
      vy = p.grounded ? 0 : (p.vy ?? 0) * lead * 0.5,
      dx = p.x - from.x,
      dy = p.y - 26 - from.y;
    // Solve |d + v t| = speed t for the soonest meeting.
    const qa = vx * vx + vy * vy - speed * speed,
      qb = 2 * (dx * vx + dy * vy),
      qc = dx * dx + dy * dy,
      disc = qb * qb - 4 * qa * qc;
    let t = 0;
    if (Math.abs(qa) < 1e-6) t = qb ? -qc / qb : 0;
    else if (disc >= 0) {
      const r = [(-qb - Math.sqrt(disc)) / (2 * qa), (-qb + Math.sqrt(disc)) / (2 * qa)].filter(
        (x) => x > 0,
      );
      t = r.length ? Math.min(...r) : 0;
    }
    t = clamp(Number.isFinite(t) ? t : 0, 0, 1.4);
    return Math.atan2(dy + vy * t, dx + vx * t);
  }
  /** The column you have spent longest in lately. */
  private haunt() {
    let best = this.game.s.player.x,
      most = 0;
    for (const [col, v] of this.haunts) if (v > most) [best, most] = [col * 64 + 32, v];
    return best;
  }
  private ring(from: Point, n: number, speed: number, damage: number, offset: number) {
    for (let i = 0; i < n; i++)
      this.game.combat.spawn(
        'eye_beam',
        { x: from.x, y: from.y },
        offset + (i / n) * Math.PI * 2,
        speed,
        damage,
        'mob',
      );
  }
  private due(a: Animal, name: string, every: number) {
    const t = this.game.s.elapsed;
    a.timers ??= {};
    if (a.timers[name] === undefined) a.timers[name] = t + every;
    if (t < a.timers[name]) return false;
    a.timers[name] = t + every;
    return true;
  }
}
