// Things that make the world feel touched, in pixels: chips and leaves when you strike, a tree
// crashing down, rock bursting apart, dust, sparks, and the materials lying where they fell.
import type { Drop, Point, WorldEvent } from '../core/types.ts';
import { D, artAt, daylight, groundOf } from './art.ts';
import { glowingItem, iconSprite } from './icons.ts';
import { PX, blit, hash, pixelText, rgba, shade } from './px.ts';
import type { RenderGame } from './types.ts';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  kind: 'chip' | 'leaf' | 'dust' | 'spark' | 'ring' | 'drop' | 'text';
  born: number;
  life: number;
  gravity: number;
  text?: string;
}
const particles: Particle[] = [];
const MAX_PARTICLES = 700;
let rand = 1;
const rnd = () => (rand = (rand * 16807) % 2147483647) / 2147483647;

/** Base colour of each material, for chips and crumbs. */
export const ITEM_COLOR: Record<string, string> = {
  wood: '#8a6440',
  resin: '#d99a3c',
  honey: '#dcaa4e',
  stone: '#8b8f8a',
  flint: '#3d4246',
  clay: '#b06f55',
  salt: '#e8e4da',
  copper_ore: '#c07a4a',
  iron_ore: '#9a7866',
  coal: '#2c2c30',
  ice: '#bfe3ee',
  obsidian: '#2a2433',
  sulfur: '#e0c94a',
  crystal: '#8fe3df',
  hellstone: '#d2402a',
  fiber: '#8fa35a',
  berry: '#b8324a',
  myconite_ore: '#58e0d0',
  starmetal_ore: '#f8e08a',
  voidsteel_ore: '#b36cff',
};
const colorOf = (item: string) => ITEM_COLOR[item] ?? '#a89878';

export function emit(p: Partial<Particle> & Point, now: number, delay = 0) {
  particles.push({
    vx: 0,
    vy: 0,
    size: 2,
    color: '#8a6440',
    kind: 'chip',
    life: 0.9,
    gravity: 700,
    ...p,
    born: now + delay,
  });
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
}
const burst = (
  e: Point,
  now: number,
  n: number,
  make: (i: number) => Partial<Particle>,
  delay = 0,
) => {
  for (let i = 0; i < n; i++) emit({ x: e.x, y: e.y, ...make(i) }, now, delay);
};
/** A number that floats up from a hit. */
export function floatText(
  x: number,
  y: number,
  text: string,
  color: string,
  now = performance.now() / 1000,
) {
  emit({ x, y, kind: 'text', text, color, vy: -50, gravity: 60, life: 0.9 }, now);
}

/** Turns game events into particles. Call once per frame with the events since the last. */
export function spawnEffects(g: RenderGame, events: WorldEvent[], now = performance.now() / 1000) {
  for (const e of events) {
    const art = artAt(e.x, e.y),
      leaves = art.leaves;
    if (e.type === 'chip') {
      if (e.kind === 'water')
        burst(e, now, 7, () => ({
          kind: 'drop',
          vx: (rnd() - 0.5) * 140,
          vy: -120 - rnd() * 120,
          color: '#9fd0e4',
          life: 0.6,
        }));
      else if (e.kind === 'wood' || e.kind === 'resin' || e.kind === 'honey') {
        burst(e, now, 6, () => ({
          vx: (rnd() - 0.5) * 220,
          vy: -140 - rnd() * 160,
          size: rnd() < 0.5 ? 2 : 1,
          color: rnd() < 0.5 ? '#c9a878' : '#8a6440',
        }));
        burst({ x: e.x, y: e.y - 40 }, now, 3, () => ({
          kind: 'leaf',
          vx: (rnd() - 0.5) * 60,
          vy: -20 - rnd() * 30,
          color: leaves[Math.floor(rnd() * leaves.length)],
          life: 2.2,
          gravity: 60,
        }));
      } else if (D.NODES[e.kind]?.tool === 'pick')
        burst(e, now, 7, () => ({
          vx: (rnd() - 0.5) * 240,
          vy: -120 - rnd() * 170,
          size: rnd() < 0.5 ? 2 : 1,
          color: rnd() < 0.6 ? colorOf(e.kind) : '#9a9d97',
          life: 0.8,
        }));
      else
        burst(e, now, 4, () => ({
          kind: 'leaf',
          vx: (rnd() - 0.5) * 80,
          vy: -60 - rnd() * 60,
          color: rnd() < 0.5 ? colorOf(e.kind) : leaves[0],
          life: 1.4,
          gravity: 120,
        }));
    } else if (e.type === 'fell') {
      const dir = e.dir ?? 1;
      for (let i = 0; i < 26; i++)
        emit(
          {
            x: e.x + dir * (30 + rnd() * 110),
            y: e.y - 10 - rnd() * 40,
            kind: 'leaf',
            vx: (rnd() - 0.5) * 120 + dir * 30,
            vy: -60 - rnd() * 90,
            color: leaves[Math.floor(rnd() * leaves.length)],
            life: 2.4,
            gravity: 70,
          },
          now,
          0.95,
        );
      for (let i = 0; i < 6; i++)
        emit(
          {
            x: e.x + dir * (20 + i * 22),
            y: e.y - 4,
            kind: 'dust',
            vx: dir * 20 + (rnd() - 0.5) * 30,
            vy: -18,
            size: 5 + rnd() * 4,
            color: '#b9a88a',
            life: 1.1,
            gravity: 0,
          },
          now,
          1.0,
        );
    } else if (e.type === 'crumble' || e.type === 'dig') {
      const color = e.type === 'dig' ? groundOf(+e.kind).base : colorOf(e.kind);
      burst(e, now, e.type === 'dig' ? 9 : 16, () => ({
        vx: (rnd() - 0.5) * 300,
        vy: -150 - rnd() * 220,
        size: rnd() < 0.4 ? 2 : 1,
        color: rnd() < 0.7 ? color : shade(color, -0.3),
        life: 1.1,
      }));
      burst(e, now, 3, () => ({
        kind: 'dust',
        vx: (rnd() - 0.5) * 60,
        vy: -30,
        size: 5 + rnd() * 5,
        color: e.type === 'dig' && +e.kind >= 9 ? '#4a2a22' : '#a8a092',
        life: 0.9,
        gravity: 0,
      }));
      if (e.kind === 'hellstone' || e.kind === '9' || e.kind === '10' || e.kind === '18')
        burst(e, now, 8, () => ({
          kind: 'spark',
          vx: (rnd() - 0.5) * 200,
          vy: -120 - rnd() * 160,
          color: '#ffb347',
          life: 0.8,
          gravity: 300,
        }));
    } else if (e.type === 'pickup') {
      const p = g.s.player;
      emit(
        { x: p.x, y: p.y - 26, kind: 'ring', size: 4, color: '#fff1c8', life: 0.3, gravity: 0 },
        now,
      );
    } else if (e.type === 'sizzle')
      burst(e, now, 10, () => ({
        kind: rnd() < 0.5 ? 'spark' : 'dust',
        vx: (rnd() - 0.5) * 80,
        vy: -80 - rnd() * 120,
        size: 5,
        color: rnd() < 0.5 ? '#ffc46a' : '#5a4a44',
        life: 0.9,
        gravity: -40,
      }));
    else if (e.type === 'damage')
      floatText(e.x, e.y, e.kind, e.dir === 1 ? '#ff6a5a' : '#f4ecd8', now);
    else if (e.type === 'burst')
      burst(e, now, 14, () => ({
        kind: 'spark',
        vx: (rnd() - 0.5) * 260,
        vy: (rnd() - 0.5) * 260,
        color: e.kind || '#ffd27a',
        life: 0.5,
        gravity: 0,
      }));
  }
}

/** Draws particles; (ax, ay) is the art-space camera. */
export function drawParticles(
  c: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  now = performance.now() / 1000,
) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i],
      age = now - p.born;
    if (age < 0) continue;
    if (age > p.life) {
      particles.splice(i, 1);
      continue;
    }
    const x = Math.round(
        (p.x + p.vx * age + (p.kind === 'leaf' ? Math.sin(age * 5 + i) * 10 : 0)) / PX - ax,
      ),
      y = Math.round((p.y + p.vy * age + 0.5 * p.gravity * age * age) / PX - ay),
      fade = 1 - age / p.life;
    if (p.kind === 'dust') {
      const r = Math.round(p.size * (1 + age * 1.4));
      c.fillStyle = rgba(p.color, 0.3 * fade);
      c.fillRect(x - r, y - Math.round(r * 0.6), r * 2, Math.round(r * 1.2));
    } else if (p.kind === 'ring') {
      const r = Math.round(p.size + age * 40);
      c.fillStyle = rgba(p.color, 0.8 * fade);
      c.fillRect(x - r, y, 1, 1);
      c.fillRect(x + r, y, 1, 1);
      c.fillRect(x, y - r, 1, 1);
      c.fillRect(x, y + r, 1, 1);
    } else if (p.kind === 'spark') {
      c.fillStyle = age < p.life * 0.4 ? '#fff2c0' : p.color;
      c.globalAlpha = fade;
      c.fillRect(x, y, 1, 1);
      c.globalAlpha = 1;
    } else if (p.kind === 'text') {
      pixelText(c, p.text ?? '', x - (p.text?.length ?? 0) * 2, y, p.color);
    } else {
      c.fillStyle = p.color;
      c.globalAlpha = Math.min(1, fade * 1.6);
      const s =
        p.kind === 'leaf' ? (Math.floor(age * 6 + i) % 2 ? [2, 1] : [1, 2]) : [p.size, p.size];
      c.fillRect(x, y, s[0], s[1]);
      c.globalAlpha = 1;
    }
  }
}

export function drawDrops(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  t: number,
) {
  for (const d of g.s.drops as Drop[]) {
    if (t < d.born) continue;
    const x = d.x / PX - ax,
      y = d.y / PX - ay;
    if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
    const bob = d.resting ? Math.round(Math.sin(t * 2.6 + d.id) * 1) : 0;
    if (glowingItem(d.item) || Math.sin(t * 3 + d.id) > 0.97) {
      c.fillStyle = 'rgba(255,241,200,0.5)';
      c.fillRect(
        Math.round(x) - 5 + Math.floor(hash(d.id, Math.floor(t * 4)) * 10),
        Math.round(y) - 12,
        1,
        1,
      );
    }
    blit(c, iconSprite(d.item), x, y - 6 + bob);
    if (d.qty > 1)
      pixelText(c, String(d.qty), Math.round(x) + 3, Math.round(y) - 4 + bob, '#f4ecd8');
  }
}

/** Rain, snow, sand, fireflies, and falling leaves over the surface. (ax, ay) is the art camera. */
export function drawWeather(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  fx: number,
  menu: boolean,
) {
  const t = g.s.elapsed,
    weather = g.s.weather,
    biome = D.biomeAt(fx, 0).id,
    cold = biome === 'tundra' || biome === 'alpine',
    wet = weather === 'rain' || weather === 'storm',
    surfaceY = D.surfaceAt(fx) / PX - ay;
  if (!menu && g.s.player.y > D.surfaceAt(g.s.player.x) + 150) return;
  if (['mycelia', 'void', 'skyreach'].includes(biome)) {
    // Spores drifting up in the Mycelial Deep; motes in the void; wind streaks in the sky.
    const n = biome === 'skyreach' ? 30 : 60;
    for (let i = 0; i < n; i++) {
      const x =
          ((((hash(i, 1) * w + t * (biome === 'skyreach' ? 90 : 6) - ax * 0.2) % w) + w) % w) | 0,
        y =
          ((((hash(i, 2) * h - t * (biome === 'mycelia' ? 8 : biome === 'void' ? 3 : 0)) % h) + h) %
            h) |
          0;
      c.fillStyle =
        biome === 'mycelia'
          ? 'rgba(120,240,220,0.6)'
          : biome === 'void'
            ? 'rgba(220,170,255,0.55)'
            : 'rgba(255,255,255,0.35)';
      c.fillRect(x, y, biome === 'skyreach' ? 6 : 1, 1);
    }
    return;
  }
  const bottom = Math.min(h, surfaceY + 130);
  // Rain and snow fall only through open sky, never into the ground.
  const open = (x: number, y: number) => (y + ay) * PX < D.surfaceAt((x + ax) * PX);
  if (bottom <= 0) return;
  if (wet && !cold) {
    const n = weather === 'storm' ? 180 : 110,
      slant = weather === 'storm' ? 2 : 1;
    c.fillStyle = 'rgba(200,218,232,0.55)';
    for (let i = 0; i < n; i++) {
      const x =
          ((((hash(i, 4) * (w + 40) + t * 30 * slant - ax * 0.2) % (w + 40)) + w + 40) % (w + 40)) -
          20,
        y = (hash(i, 5) * bottom + t * (320 + hash(i, 7) * 100)) % bottom,
        len = 3 + Math.floor(hash(i, 6) * 3);
      if (!open(x, y)) continue;
      for (let k = 0; k < len; k++)
        c.fillRect(Math.round(x - (k * slant) / 2), Math.round(y + k), 1, 1);
    }
    if (weather === 'storm') {
      const beat = Math.floor(t * 1.7),
        ph = t * 1.7 - beat;
      if (hash(beat, 77) > 0.9 && ph < 0.25) {
        c.fillStyle = `rgba(235,240,255,${0.35 * (1 - ph / 0.25)})`;
        c.fillRect(0, 0, w, h);
      }
    }
  }
  if (cold) {
    const n = wet ? 140 : weather === 'cloudy' ? 60 : 30;
    c.fillStyle = 'rgba(248,250,252,0.9)';
    for (let i = 0; i < n; i++) {
      const x =
          ((((hash(i, 1) * w + Math.sin(t * 0.8 + i) * 9 + t * (wet ? 20 : 7) - ax * 0.3) %
            (w + 20)) +
            w +
            20) %
            (w + 20)) -
          10,
        y = (hash(i, 2) * bottom + t * (14 + hash(i, 5) * 15)) % bottom,
        s = hash(i, 3) < 0.3 ? 2 : 1;
      if (!open(x, y)) continue;
      c.fillRect(Math.round(x), Math.round(y), s, s);
    }
  }
  const night = 1 - daylight(g.timeOfDay());
  if (['meadow', 'marsh', 'forest'].includes(biome) && night > 0.3 && !wet)
    for (let i = 0; i < 16; i++) {
      const x = Math.round(
          (((hash(i, 1) * 900 - ax + Math.sin(t * 0.4 + i) * 20) % 900) + 900) % 900,
        ),
        y = Math.round(surfaceY - 10 - hash(i, 2) * 45 + Math.sin(t * 0.9 + i * 2) * 6),
        blink = Math.max(0, Math.sin(t * 2 + i * 1.7));
      if (x > w || blink < 0.2) continue;
      c.fillStyle = `rgba(232,240,138,${0.35 * blink * night})`;
      c.fillRect(x - 1, y - 1, 3, 3);
      c.fillStyle = `rgba(250,255,200,${blink * night})`;
      c.fillRect(x, y, 1, 1);
    }
  if ((biome === 'desert' || biome === 'badlands') && !wet) {
    c.fillStyle = 'rgba(240,220,180,0.5)';
    for (let i = 0; i < 30; i++) {
      const x =
          ((((hash(i, 1) * w + t * (10 + hash(i, 3) * 12)) % (w + 10)) + w + 10) % (w + 10)) - 5,
        y = surfaceY - hash(i, 2) * 100 + Math.sin(t + i) * 3;
      c.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
  if ((biome === 'forest' || biome === 'taiga') && !wet)
    for (let i = 0; i < 7; i++) {
      const life = (t * 0.07 + hash(i, 9)) % 1,
        x = Math.round((((hash(i, 1) * w + life * 80 + Math.sin(life * 12 + i) * 15) % w) + w) % w),
        y = Math.round(surfaceY - 120 + life * 130);
      c.fillStyle = biome === 'taiga' ? '#8a8a4e' : '#b48a3e';
      c.fillRect(x, y, Math.floor(life * 20) % 2 ? 2 : 1, 1);
    }
}
