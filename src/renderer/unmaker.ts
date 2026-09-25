// The Unmaker's fight, in pixels. The sky and weather turn with each phase: a violet void with a
// great eye watching, then void rain, then a burning crimson sky raining ash, then a black storm
// split by lightning. Its body grows more dreadful as it weakens (an aura pulsing on the beat of
// its theme, orbiting shards, more eyes, horns and burning cracks, afterimages at the end), and
// when it dies the sky cracks with light and breaks into dawn.
import type { Animal } from '../core/types.ts';
import { FINALE_SECONDS, SUPERNOVA } from '../data/bosses.ts';
import { emit } from './effects.ts';
import { PX, hash, rgba } from './px.ts';
import type { RenderGame } from './types.ts';

/** Each phase's colours: sky top and bottom, aura, and the body's burning accent. */
const LOOKS = [
  { top: '#14041f', bottom: '#3a0a4a', aura: '#b36cff', hot: '#ff5a8a' },
  { top: '#1e0318', bottom: '#5a0a38', aura: '#ff5a8a', hot: '#ffd0f0' },
  { top: '#220206', bottom: '#7a0c1c', aura: '#ff2a4a', hot: '#ffb070' },
  { top: '#030002', bottom: '#4a000c', aura: '#ff0a2a', hot: '#ffffff' },
];
/** Dawn, after it falls: the title screen's gold, bringing the journey full circle. */
const DAWN = { top: '#f0c070', bottom: '#fff0d0' };

interface FightState {
  phase: number;
  last: boolean;
  k: number;
  /** Beats of the current theme, and how hard this beat hits (1 on the beat, fading). */
  beat: number;
  pulse: number;
  /** Seconds into the death scene, or -1. */
  dying: number;
  /** 0 to 1: how far into dawn the sky has come after the Unmaker's fall. */
  dawn: number;
  clock: number;
  a: Animal | null;
}

/** Whether the Unmaker's fight (or its aftermath) is colouring the world, and how. */
function fight(g: RenderGame): FightState | null {
  const u = g.unmaker,
    a = u.foe(),
    p = g.s.player,
    near = a && Math.abs(a.x - p.x) < 2600,
    scene = u.cutscene,
    dyingFor = scene?.kind === 'death' ? u.clock - scene.start : -1,
    fromFall = dyingFor >= 0 ? dyingFor - SUPERNOVA : u.finale() ? 99 : -1;
  if (!near && fromFall < 0) return null;
  const beat = u.beat(),
    frac = beat - Math.floor(beat),
    downbeat = Math.floor(beat) % 4 === 0;
  const look = a ? u.look(a) : null;
  return {
    phase: look?.phase ?? 3,
    last: !!look?.last,
    k: look?.intensity ?? 6,
    beat,
    pulse: (1 - frac) ** 3 * (downbeat ? 1 : 0.55),
    dying: dyingFor,
    dawn:
      fromFall < 0
        ? 0
        : fromFall === 99
          ? clamp01(1.4 - (u.clock - (u.finaleUntil - FINALE_SECONDS) - SUPERNOVA) / FINALE_SECONDS)
          : clamp01(fromFall / 1.2),
    clock: u.clock,
    a: a ?? null,
  };
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Draws a vertical gradient in pixel bands. */
function bands(
  c: CanvasRenderingContext2D,
  top: string,
  bottom: string,
  alpha: number,
  w: number,
  h: number,
) {
  const n = 10;
  for (let i = 0; i < n; i++) {
    c.fillStyle = rgba(i < n / 2 ? top : bottom, alpha * (0.75 + (i / n) * 0.25));
    c.fillRect(0, Math.floor((i * h) / n), w, Math.ceil(h / n) + 1);
  }
}

// ─── The sky ─────────────────────────────────────────────────────────────────────────────────
export function drawUnmakerSky(c: CanvasRenderingContext2D, g: RenderGame, w: number, h: number) {
  const f = fight(g);
  if (!f) return;
  const L = LOOKS[f.phase];
  if (f.dawn > 0) {
    // The void burns away into dawn, and where the eye watched, the sun comes up.
    if (f.dawn < 1) bands(c, L.top, L.bottom, 0.6 * (1 - f.dawn), w, h);
    bands(c, DAWN.top, DAWN.bottom, 0.8 * f.dawn, w, h);
    const sx = Math.round(w / 2),
      sy = Math.round(h * 0.22 + (1 - Math.min(1, f.dawn * 1.5)) * 30);
    for (const [r, col, al] of [
      [34, '#fff0c0', 0.18],
      [24, '#ffe8a0', 0.3],
      [14, '#fff8e0', 1],
    ] as const) {
      c.fillStyle = rgba(col, al * Math.min(1, f.dawn * 1.5));
      for (let dy = -r; dy <= r; dy++) {
        const half = Math.round(Math.sqrt(r * r - dy * dy));
        c.fillRect(sx - half, sy + dy, half * 2, 1);
      }
    }
    // Long rays of morning light.
    c.fillStyle = rgba('#fff4d0', 0.25 * f.dawn);
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2 + f.clock * 0.05;
      for (let s = 20; s < 160; s += 2)
        c.fillRect(Math.round(sx + Math.cos(ang) * s), Math.round(sy + Math.sin(ang) * s), 1, 1);
    }
    return;
  }
  bands(c, L.top, L.bottom, f.last ? 0.8 : 0.5 + f.phase * 0.08, w, h);
  // The great eye in the sky, watching you; wider and redder as the fight goes on.
  const ex = Math.round(w / 2),
    ey = Math.round(h * 0.22),
    r = 12 + f.phase * 5 + Math.round(f.pulse * 2),
    blink = hash(Math.floor(f.clock / 3.1), 7) > 0.85 && f.clock % 3.1 < 0.18;
  c.fillStyle = rgba(L.aura, 0.25);
  for (let dy = -r - 3; dy <= r + 3; dy++) {
    const half = Math.round(Math.sqrt(Math.max(0, (r + 3) ** 2 - dy * dy)) * 1.8);
    c.fillRect(ex - half, ey + dy, half * 2, 1);
  }
  if (!blink) {
    c.fillStyle = f.phase >= 2 ? '#2a0008' : '#12001e';
    for (let dy = -r; dy <= r; dy++) {
      const half = Math.round(Math.sqrt(r * r - dy * dy) * 1.8);
      c.fillRect(ex - half, ey + dy, half * 2, 1);
    }
    // The iris follows you across the sky.
    const look = Math.max(-1, Math.min(1, (g.s.player.x - (f.a?.x ?? g.s.player.x)) / 600)),
      ix = ex + Math.round(look * r * 0.8),
      ir = Math.round(r * 0.55);
    c.fillStyle = L.hot;
    for (let dy = -ir; dy <= ir; dy++) {
      const half = Math.round(Math.sqrt(ir * ir - dy * dy));
      c.fillRect(ix - half, ey + dy, half * 2, 1);
    }
    c.fillStyle = '#000000';
    c.fillRect(ix - 1, ey - Math.round(ir * 0.8), 3, Math.round(ir * 1.6));
  } else {
    c.fillStyle = '#000000';
    c.fillRect(ex - r * 2, ey, r * 4, 1);
  }
  // Cracks spread across the sky from the eye, burning on the beat.
  if (f.phase >= 2 || f.dying >= 0) {
    const n = f.dying >= 0 ? 14 : 4 + f.phase * 2;
    c.fillStyle = rgba(f.dying >= 0 ? '#ffffff' : L.hot, 0.35 + f.pulse * 0.5);
    for (let i = 0; i < n; i++) {
      let x = ex,
        y = ey;
      const ang = hash(i, 11) * Math.PI * 2,
        len = 60 + hash(i, 12) * (f.dying >= 0 ? 260 : 140);
      for (let s = 0; s < len; s += 2) {
        x += Math.cos(ang) * 2 + (hash(i * 97 + s, 13) - 0.5) * 3;
        y += Math.sin(ang) * 2 + (hash(i * 89 + s, 14) - 0.5) * 3;
        c.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
    }
  }
  // Void stars fall as meteors from the second phase on.
  if (f.phase >= 1) {
    c.fillStyle = rgba(L.hot, 0.7);
    for (let i = 0; i < 6 + f.phase * 4; i++) {
      const span = 2.5 + hash(i, 21) * 2,
        u = ((f.clock + hash(i, 22) * span) % span) / span,
        x = Math.round(hash(i, 23) * w + u * 90),
        y = Math.round(u * h * 0.6);
      for (let s = 0; s < 6; s++) c.fillRect(x - s, y - s, 1, 1);
    }
  }
}

// ─── The weather ─────────────────────────────────────────────────────────────────────────────
export function drawUnmakerWeather(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  w: number,
  h: number,
) {
  const f = fight(g);
  if (!f) return;
  const t = f.clock;
  if (f.dawn > 0) {
    // Motes of warm light drift down through the dawn.
    c.fillStyle = rgba('#fff0c0', 0.7 * f.dawn);
    for (let i = 0; i < 50; i++) {
      const x = Math.round((hash(i, 1) * w + Math.sin(t * 0.8 + i) * 8 + w) % w),
        y = Math.round((hash(i, 2) * h + t * (8 + hash(i, 3) * 10)) % h);
      c.fillRect(x, y, 1, 1);
    }
    return;
  }
  const L = LOOKS[f.phase];
  if (f.phase === 0) {
    // Violet motes rising.
    c.fillStyle = rgba(L.aura, 0.6);
    for (let i = 0; i < 50; i++) {
      const x = Math.round((hash(i, 1) * w + Math.sin(t + i) * 6 + w) % w),
        y = Math.round(h - ((hash(i, 2) * h + t * (10 + hash(i, 3) * 20)) % h));
      c.fillRect(x, y, 1, 1);
    }
  }
  if (f.phase >= 1) {
    // Void rain, then a storm of it.
    const n = f.phase === 1 ? 70 : f.phase === 2 ? 110 : 170,
      speed = 160 + f.phase * 60;
    c.fillStyle = rgba(f.phase >= 3 ? '#ff5a8a' : L.aura, 0.45);
    for (let i = 0; i < n; i++) {
      const x = Math.round(
          (hash(i, 4) * (w + 60) - ((t * speed * 0.35) % (w + 60)) + w + 60) % (w + 60),
        ),
        y = Math.round((hash(i, 5) * h + t * speed) % h);
      c.fillRect(x, y, 1, 3);
      c.fillRect(x - 1, y + 3, 1, 2);
    }
  }
  if (f.phase >= 2) {
    // Burning ash on the updraft.
    c.fillStyle = rgba(L.hot, 0.7);
    for (let i = 0; i < 40; i++) {
      const x = Math.round((hash(i, 6) * w + Math.sin(t * 2 + i) * 10 + w) % w),
        y = Math.round(h - ((hash(i, 7) * h + t * (30 + hash(i, 8) * 40)) % h));
      c.fillRect(x, y, 1, 1);
    }
  }
  if (f.phase >= 3 || f.dying >= 0) {
    // Lightning on the downbeats of every other bar, and a flash.
    const bar = Math.floor(f.beat / 4),
      into = f.beat - bar * 4;
    if (bar % 2 === 0 && into < 0.35) {
      c.fillStyle = rgba('#ffffff', 0.25 * (1 - into / 0.35));
      c.fillRect(0, 0, w, h);
      let x = Math.round(hash(bar, 31) * w);
      c.fillStyle = rgba('#ffe0f0', 0.9);
      for (let y = 0; y < h * 0.7; y += 2) {
        x += Math.round((hash(bar * 131 + y, 32) - 0.5) * 6);
        c.fillRect(x, y, 2, 2);
        if (hash(bar * 71 + y, 33) > 0.96)
          for (let k = 0; k < 14; k++) c.fillRect(x + k, y + k, 1, 1);
      }
    }
  }
  // The last stand glitches the world itself: slices of the screen torn sideways.
  if (f.last || (f.dying >= 0 && f.dying < SUPERNOVA)) {
    for (let i = 0; i < 4; i++) {
      if (hash(Math.floor(t * 24), i) < 0.5) continue;
      const y = Math.floor(hash(Math.floor(t * 24) * 7 + i, 41) * h),
        hh = 2 + Math.floor(hash(i, Math.floor(t * 24)) * 6),
        dx = Math.round((hash(i * 3, Math.floor(t * 24)) - 0.5) * 16);
      c.drawImage(c.canvas, 0, y, w, hh, dx, y, w, hh);
    }
  }
  // The edges of the screen throb with the beat.
  const edge = 0.12 + f.phase * 0.05 + f.pulse * 0.18;
  for (let i = 0; i < 8; i++) {
    c.fillStyle = rgba(f.dying >= 0 ? '#ffffff' : L.aura, edge * (1 - i / 8));
    c.fillRect(0, i, w, 1);
    c.fillRect(0, h - 1 - i, w, 1);
    c.fillRect(i, 0, 1, h);
    c.fillRect(w - 1 - i, 0, 1, h);
  }
}

// ─── The Unmaker itself ──────────────────────────────────────────────────────────────────────
/** Where to draw it this frame: shaking as it convulses, and how much of it has risen. */
export function unmakerPose(g: RenderGame, a: Animal) {
  const look = g.unmaker.look(a),
    c = look.convulse,
    jolt = c > 0 ? c * 5 : look.last ? 1.5 : 0,
    tick = Math.floor(g.unmaker.clock * 30);
  return {
    dx: Math.round((hash(tick, a.id) - 0.5) * jolt),
    dy: Math.round((hash(tick, a.id + 1) - 0.5) * jolt),
    alpha: (a.reveal ?? 1) * (look.dying > SUPERNOVA ? 0 : 1),
    ghosts: look.phase >= 3 || look.last || look.dying >= 0,
  };
}
/** Behind it: the aura, pulsing on the beat of its theme. */
export function drawUnmakerBack(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  a: Animal,
  x: number,
  y: number,
) {
  const f = fight(g);
  if (!f) return;
  const look = g.unmaker.look(a),
    L = LOOKS[look.phase],
    cy = y - 30,
    reveal = a.reveal ?? 1,
    frame = Math.floor(f.clock * 14),
    rings = 2 + (look.phase >= 2 ? 1 : 0);
  for (let ring = 0; ring < rings; ring++) {
    const r = 22 + ring * 8 + Math.round(f.pulse * (4 + look.phase * 2)),
      n = 40 + ring * 16;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + f.clock * (0.6 + ring * 0.3) * (ring % 2 ? -1 : 1),
        flick = hash(i + ring * 97, frame),
        len = 1 + Math.floor(flick * (2 + look.phase));
      c.fillStyle = rgba(ring === 0 ? L.hot : L.aura, (0.35 + flick * 0.4) * reveal);
      const px = Math.round(x + Math.cos(ang) * r),
        py = Math.round(cy + Math.sin(ang) * r * 0.9);
      c.fillRect(px, py - len, 1, len);
    }
  }
  // Flames of the void lick upward off it, more of them as it weakens.
  const now = performance.now() / 1000;
  for (let i = 0; i < Math.min(6, Math.round(f.k)); i++)
    if (Math.random() < 0.5)
      emit(
        {
          x: a.x + (Math.random() - 0.5) * 90,
          y: a.y - 60 + (Math.random() - 0.5) * 70,
          vx: (Math.random() - 0.5) * 20,
          vy: -50 - Math.random() * 60,
          kind: 'spark',
          color: Math.random() < 0.3 ? L.hot : L.aura,
          life: 0.5 + Math.random() * 0.5,
          gravity: -30,
        },
        now,
      );
  // A shield of light while it cannot be touched.
  if (look.shielded && look.dying < 0) {
    c.fillStyle = rgba('#ffffff', 0.5);
    for (let i = 0; i < 36; i++) {
      const ang = (i / 36) * Math.PI * 2 + f.clock,
        r = 40 + Math.round(Math.sin(f.clock * 6 + i) * 1.5);
      if ((i + frame) % 3)
        c.fillRect(Math.round(x + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r), 1, 1);
    }
  }
}
/** In front: shards in orbit, more eyes, horns, burning cracks, and its death throes. */
export function drawUnmakerFront(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  a: Animal,
  x: number,
  y: number,
) {
  const f = fight(g);
  if (!f) return;
  const look = g.unmaker.look(a),
    L = LOOKS[look.phase],
    cy = y - 30,
    reveal = a.reveal ?? 1;
  if (reveal <= 0.05) return;
  c.globalAlpha = reveal;
  // Horns of black glass from the third phase: a crown of spikes.
  if (look.phase >= 2) {
    const n = look.phase >= 3 ? 7 : 5;
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + ((i - (n - 1) / 2) / n) * 1.9,
        len = 10 + (i % 2 ? 4 : 9) + look.phase * 2;
      for (let s = 0; s < len; s++) {
        c.fillStyle = s > len - 3 ? L.hot : '#0a0006';
        c.fillRect(
          Math.round(x + Math.cos(ang) * (16 + s)),
          Math.round(cy + Math.sin(ang) * (16 + s)),
          s < len / 2 ? 2 : 1,
          1,
        );
      }
    }
    // Cracks burning across its body.
    c.fillStyle = rgba(L.hot, 0.6 + f.pulse * 0.4);
    for (let i = 0; i < 3 + look.phase; i++) {
      let px = x + Math.round((hash(i, 51) - 0.5) * 20),
        py = cy + Math.round((hash(i, 52) - 0.5) * 20);
      for (let s = 0; s < 8; s++) {
        px += Math.round((hash(i * 13 + s, 53) - 0.5) * 3);
        py += hash(i * 17 + s, 54) > 0.5 ? 1 : -1;
        c.fillRect(px, py, 1, 1);
      }
    }
  }
  // More eyes open with every phase, blinking out of step.
  for (let i = 0; i < look.phase * 2 + (look.last ? 2 : 0); i++) {
    const ang = (i / (look.phase * 2 + (look.last ? 2 : 0))) * Math.PI * 2 + 0.4,
      ex = Math.round(x + Math.cos(ang) * 19),
      ey = Math.round(cy + Math.sin(ang) * 17);
    if (hash(i, Math.floor(f.clock * 2 + i)) > 0.12) {
      c.fillStyle = L.hot;
      c.fillRect(ex - 1, ey, 3, 1);
      c.fillStyle = '#000000';
      c.fillRect(ex, ey, 1, 1);
    }
  }
  // Shards of the void in orbit, faster and more of them as it weakens.
  const shards = 3 + look.phase * 2 + (look.last ? 4 : 0);
  for (let i = 0; i < shards; i++) {
    const ang = (i / shards) * Math.PI * 2 + f.clock * (0.8 + f.k * 0.25),
      r = 38 + Math.round(Math.sin(f.clock * 2 + i) * 3),
      sx = Math.round(x + Math.cos(ang) * r),
      sy = Math.round(cy + Math.sin(ang) * r * 0.55);
    c.fillStyle = '#12001e';
    c.fillRect(sx - 1, sy - 2, 2, 5);
    c.fillStyle = L.hot;
    c.fillRect(sx, sy - 2, 1, 1);
  }
  // Dying, it cracks open with light.
  if (look.dying >= 0 && look.dying < SUPERNOVA) {
    const k = look.dying / SUPERNOVA;
    c.fillStyle = rgba('#ffffff', 0.2 + k * 0.6);
    for (let i = 0; i < 4 + Math.round(k * 10); i++) {
      const ang = hash(i, 61) * Math.PI * 2,
        len = 8 + Math.round(k * 26 * hash(i, 62));
      for (let s = 0; s < len; s++)
        c.fillRect(Math.round(x + Math.cos(ang) * s), Math.round(cy + Math.sin(ang) * s), 1, 1);
    }
    c.fillStyle = rgba('#ffffff', k * 0.5 * (Math.floor(f.clock * 20) % 2));
    c.fillRect(x - 24, cy - 24, 48, 48);
  }
  c.globalAlpha = 1;
}

/** The tear it enters through: a slit in the world that widens as its theme builds. */
export function drawUnmakerTear(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
) {
  const e = g.unmaker.entrance;
  if (!e) return;
  const into = g.unmaker.clock - e.start,
    open = clamp01((into - 1.7) / 3),
    fade = g.unmaker.frozen() ? 1 : 0.3;
  if (open <= 0) return;
  const x = Math.round(e.x / PX - ax),
    y = Math.round((e.y - 60) / PX - ay),
    hh = Math.round(8 + open * 60),
    ww = Math.round(1 + open * 9);
  for (let dy = -hh; dy <= hh; dy++) {
    const half = Math.round(ww * Math.sqrt(1 - (dy / hh) ** 2));
    c.fillStyle = rgba('#ff5a8a', 0.8 * fade);
    c.fillRect(x - half - 1, y + dy, 1, 1);
    c.fillRect(x + half + 1, y + dy, 1, 1);
    c.fillStyle = rgba('#05000a', 0.95 * fade);
    c.fillRect(x - half, y + dy, half * 2 + 1, 1);
  }
}
/** Threads of void between the Unmaker and the shades that bear its wounds. */
export function drawShadeTethers(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
) {
  const a = g.unmaker.foe();
  if (!a) return;
  const frame = Math.floor(g.unmaker.clock * 12);
  for (const m of g.s.animals) {
    if (m.type !== 'void_shade' || m.deadUntil) continue;
    const x0 = a.x / PX - ax,
      y0 = (a.y - 60) / PX - ay,
      x1 = m.x / PX - ax,
      y1 = (m.y - 20) / PX - ay,
      n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 2));
    c.fillStyle = rgba('#ff5a8a', 0.55);
    for (let i = 0; i < n; i++) {
      if ((i + frame) % 4 === 0) continue;
      const k = i / n;
      c.fillRect(
        Math.round(x0 + (x1 - x0) * k + Math.sin(k * 20 + frame) * 1.5),
        Math.round(y0 + (y1 - y0) * k),
        1,
        1,
      );
    }
  }
}
/** The Aura of the Unmade, worn: a violet flame about you that throbs like a heartbeat. */
export function drawPlayerAura(c: CanvasRenderingContext2D, g: RenderGame, x: number, y: number) {
  if (!g.equipment.has('aura')) return;
  const t = performance.now() / 1000,
    beat = (t * 140) / 60,
    pulse = (1 - (beat - Math.floor(beat))) ** 3,
    cy = y - 13,
    frame = Math.floor(t * 14);
  for (let i = 0; i < 30; i++) {
    const ang = (i / 30) * Math.PI * 2 + t * 0.9,
      r = 14 + Math.round(pulse * 2),
      flick = hash(i, frame);
    c.fillStyle = rgba(i % 3 ? '#b36cff' : '#ff5a8a', 0.3 + flick * 0.4);
    c.fillRect(
      Math.round(x + Math.cos(ang) * r),
      Math.round(cy + Math.sin(ang) * r) - Math.floor(flick * 2),
      1,
      1 + Math.floor(flick * 2),
    );
  }
}
