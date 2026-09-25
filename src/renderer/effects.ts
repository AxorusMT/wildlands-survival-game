// Things that make the world feel touched: chips and leaves when you strike, a tree crashing
// down, rock bursting apart, dust, sparks, and the materials themselves lying where they fell.
import { D, H, INK, TAU, ellipse, fillPoly, glow, line, rgba, shade } from './graphics.ts';
import { artAt } from './palette.ts';
import type { Canvas2D, RenderGame } from './types.ts';
import type { Drop, Point, WorldEvent } from '../core/types.ts';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spin: number;
  angle: number;
  size: number;
  color: string;
  kind: 'chip' | 'leaf' | 'dust' | 'spark' | 'ring' | 'drop';
  born: number;
  life: number;
  gravity: number;
}
const particles: Particle[] = [];
const MAX_PARTICLES = 500;
let rand = 1;
const rnd = () => (rand = (rand * 16807) % 2147483647) / 2147483647;

/** Base colour of each material, for chips, crumbs, and the drop icons. */
export const ITEM_COLOR: Record<string, string> = {
  wood: '#8a6440',
  resin: '#d99a3c',
  honey: '#dcaa4e',
  stone: '#8b8f8a',
  flint: '#3d4246',
  clay: '#b06f55',
  dirt: '#76604a',
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
  reeds: '#a4a86a',
  herb: '#5f9a55',
  willow: '#8a7a5a',
  berry: '#b8324a',
  wheat: '#d9b75a',
  potato: '#b99468',
  mushroom: '#c9a07a',
  cactus_fruit: '#d8577a',
  raw_meat: '#c65a5a',
  hide: '#a47c55',
  bone: '#e6dcc6',
  chitin: '#5a4032',
  venom: '#7bc05a',
  feathers: '#eef0ea',
};
const colorOf = (item: string) => ITEM_COLOR[item] ?? '#a89878';

function emit(p: Partial<Particle> & Point, now: number, delay = 0) {
  particles.push({
    vx: 0,
    vy: 0,
    spin: 0,
    angle: rnd() * TAU,
    size: 3,
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

/** Turns game events into particles. Call once per frame with the events since the last. */
export function spawnEffects(g: RenderGame, events: WorldEvent[], now = performance.now() / 1000) {
  for (const e of events) {
    const art = artAt(e.x, e.y),
      leaves = art.leaves?.length ? art.leaves : ['#5e7a45', '#7c9656'];
    if (e.type === 'chip') {
      if (e.kind === 'water')
        burst(e, now, 7, () => ({
          kind: 'drop',
          vx: (rnd() - 0.5) * 140,
          vy: -120 - rnd() * 120,
          size: 2 + rnd() * 1.5,
          color: '#9fd0e4',
          life: 0.6,
        }));
      else if (e.kind === 'wood' || e.kind === 'resin' || e.kind === 'honey') {
        burst(e, now, 6, () => ({
          vx: (rnd() - 0.5) * 220,
          vy: -140 - rnd() * 160,
          spin: (rnd() - 0.5) * 20,
          size: 2.5 + rnd() * 2,
          color: rnd() < 0.5 ? '#c9a878' : '#8a6440',
        }));
        burst({ x: e.x, y: e.y - 40 }, now, 3, () => ({
          kind: 'leaf',
          vx: (rnd() - 0.5) * 60,
          vy: -20 - rnd() * 30,
          size: 3 + rnd() * 2,
          color: leaves[Math.floor(rnd() * leaves.length)],
          life: 2.2,
          gravity: 60,
        }));
      } else if (D.NODES[e.kind]?.tool === 'pick')
        burst(e, now, 7, () => ({
          vx: (rnd() - 0.5) * 240,
          vy: -120 - rnd() * 170,
          spin: (rnd() - 0.5) * 16,
          size: 2 + rnd() * 2.5,
          color: rnd() < 0.6 ? colorOf(e.kind) : '#9a9d97',
          life: 0.8,
        }));
      else
        burst(e, now, 4, () => ({
          kind: 'leaf',
          vx: (rnd() - 0.5) * 80,
          vy: -60 - rnd() * 60,
          size: 2.5 + rnd() * 1.5,
          color: rnd() < 0.5 ? colorOf(e.kind) : leaves[0],
          life: 1.4,
          gravity: 120,
        }));
    } else if (e.type === 'fell') {
      // The crown crashes down about a second after the last chop.
      const dir = e.dir ?? 1;
      for (let i = 0; i < 26; i++) {
        const along = 30 + rnd() * 110;
        emit(
          {
            x: e.x + dir * along,
            y: e.y - 10 - rnd() * 40,
            kind: 'leaf',
            vx: (rnd() - 0.5) * 120 + dir * 30,
            vy: -60 - rnd() * 90,
            size: 3 + rnd() * 2.5,
            color: leaves[Math.floor(rnd() * leaves.length)],
            life: 2.4,
            gravity: 70,
          },
          now,
          0.95,
        );
      }
      for (let i = 0; i < 6; i++)
        emit(
          {
            x: e.x + dir * (20 + i * 22),
            y: e.y - 4,
            kind: 'dust',
            vx: dir * 20 + (rnd() - 0.5) * 30,
            vy: -18,
            size: 10 + rnd() * 8,
            color: '#b9a88a',
            life: 1.1,
            gravity: 0,
          },
          now,
          1.0,
        );
    } else if (e.type === 'crumble' || e.type === 'dig') {
      const color = e.type === 'dig' ? (DIG_COLOR[+e.kind] ?? '#6a6660') : colorOf(e.kind);
      burst(e, now, e.type === 'dig' ? 9 : 16, () => ({
        vx: (rnd() - 0.5) * 300,
        vy: -150 - rnd() * 220,
        spin: (rnd() - 0.5) * 14,
        size: 2.5 + rnd() * (e.type === 'dig' ? 3 : 5),
        color: rnd() < 0.7 ? color : shade(color, -0.25),
        life: 1.1,
      }));
      burst(e, now, 3, () => ({
        kind: 'dust',
        vx: (rnd() - 0.5) * 60,
        vy: -30,
        size: 12 + rnd() * 10,
        color: e.type === 'dig' && +e.kind >= 9 ? '#4a2a22' : '#a8a092',
        life: 0.9,
        gravity: 0,
      }));
      if (e.kind === 'hellstone' || e.kind === '9' || e.kind === '10')
        burst(e, now, 8, () => ({
          kind: 'spark',
          vx: (rnd() - 0.5) * 200,
          vy: -120 - rnd() * 160,
          size: 1.6,
          color: '#ffb347',
          life: 0.8,
          gravity: 300,
        }));
    } else if (e.type === 'pickup') {
      const p = g.s.player;
      emit(
        {
          x: p.x,
          y: p.y - 26,
          kind: 'ring',
          size: 8,
          color: colorOf(e.kind),
          life: 0.35,
          gravity: 0,
        },
        now,
      );
    } else if (e.type === 'sizzle')
      burst(e, now, 10, () => ({
        kind: rnd() < 0.5 ? 'spark' : 'dust',
        vx: (rnd() - 0.5) * 80,
        vy: -80 - rnd() * 120,
        size: rnd() < 0.5 ? 1.8 : 9,
        color: rnd() < 0.5 ? '#ffc46a' : '#5a4a44',
        life: 0.9,
        gravity: -40,
      }));
  }
}
const DIG_COLOR: Record<number, string> = {
  1: '#76604a',
  2: '#6d7277',
  3: '#c9ad7f',
  4: '#5c6656',
  5: '#b7ccd2',
  6: '#9a5f4a',
  8: '#434d5f',
  9: '#5e3b35',
  10: '#6a2530',
};

export function drawParticles(c: Canvas2D, cam: Point, now = performance.now() / 1000) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i],
      age = now - p.born;
    if (age < 0) continue;
    if (age > p.life) {
      particles.splice(i, 1);
      continue;
    }
    const x = p.x + p.vx * age - cam.x + (p.kind === 'leaf' ? Math.sin(age * 5 + p.angle) * 10 : 0),
      y = p.y + p.vy * age + 0.5 * p.gravity * age * age - cam.y,
      fade = 1 - age / p.life;
    if (p.kind === 'dust') {
      ellipse(
        c,
        x,
        y,
        p.size * (1 + age * 1.6),
        p.size * 0.6 * (1 + age),
        rgba(p.color, 0.3 * fade),
      );
    } else if (p.kind === 'ring') {
      c.beginPath();
      c.arc(x, y, p.size + age * 70, 0, TAU);
      c.strokeStyle = rgba(p.color, 0.8 * fade);
      c.lineWidth = 2;
      c.stroke();
    } else if (p.kind === 'spark') {
      glow(c, x, y, 7, p.color, 0.6 * fade);
      ellipse(c, x, y, p.size, p.size, rgba('#fff2c0', fade));
    } else if (p.kind === 'drop') {
      ellipse(c, x, y, p.size * 0.8, p.size * 1.2, rgba(p.color, 0.85 * fade));
    } else {
      c.save();
      c.translate(x, y);
      c.rotate(p.angle + p.spin * age);
      c.globalAlpha = Math.min(1, fade * 1.6);
      if (p.kind === 'leaf') ellipse(c, 0, 0, p.size, p.size * 0.5, p.color, INK, 0.6);
      else
        fillPoly(
          c,
          [
            [-p.size, -p.size * 0.6],
            [p.size * 0.8, -p.size * 0.8],
            [p.size, p.size * 0.7],
            [-p.size * 0.6, p.size],
          ],
          p.color,
          INK,
          0.7,
        );
      c.restore();
    }
  }
}

/** One material icon, centred on the origin, about 18 px across. */
function drawItemIcon(c: Canvas2D, item: string, seed: number) {
  const col = colorOf(item);
  if (item === 'wood') {
    for (const [dx, dy] of [
      [-4, 2],
      [4, 2],
      [0, -4],
    ]) {
      c.save();
      c.translate(dx, dy);
      c.fillStyle = col;
      c.strokeStyle = INK;
      c.lineWidth = 1.2;
      c.beginPath();
      c.roundRect(-8, -3.2, 16, 6.4, 3);
      c.fill();
      c.stroke();
      ellipse(c, 7, 0, 2.4, 3, '#d8b888', INK, 0.9);
      line(c, -5, -1, 3, -1, shade(col, -0.25), 0.8);
      c.restore();
    }
  } else if (['berry', 'cactus_fruit'].includes(item)) {
    for (const [dx, dy] of [
      [-3, 1],
      [3, 1],
      [0, -3],
      [0, 3],
    ])
      ellipse(c, dx, dy, 3.4, 3.4, col, INK, 0.9);
    ellipse(c, -1, -4, 1, 1, '#ffe6ec');
  } else if (['fiber', 'reeds', 'herb', 'wheat', 'willow', 'feathers'].includes(item)) {
    for (let i = -2; i <= 2; i++) line(c, i * 1.6, 7, i * 3.2, -8, INK, 2.6);
    for (let i = -2; i <= 2; i++) line(c, i * 1.6, 7, i * 3.2, -8, col, 1.6);
    line(c, -5, 1, 5, 1, '#6b4f37', 2);
  } else if (item === 'crystal') {
    fillPoly(
      c,
      [
        [-5, 6],
        [-3, -6],
        [0, -9],
        [3, -6],
        [5, 6],
      ],
      col,
      INK,
      1,
    );
    glow(c, 0, 0, 14, col, 0.35);
  } else if (item === 'bone') {
    line(c, -7, 3, 7, -3, INK, 5);
    line(c, -7, 3, 7, -3, col, 3);
    for (const [x, y] of [
      [-7, 3],
      [7, -3],
    ])
      ellipse(c, x, y, 2.6, 2.6, col, INK, 0.8);
  } else if (['raw_meat', 'hide', 'potato', 'mushroom', 'honey', 'resin', 'venom'].includes(item)) {
    c.beginPath();
    c.ellipse(0, 0, 8, 5.5, -0.3, 0, TAU);
    c.fillStyle = col;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.1;
    c.stroke();
    ellipse(c, -2.5, -2, 2.6, 1.4, rgba('#ffffff', 0.25));
  } else {
    // Rock and ore: a craggy lump, with flecks of the ore colour.
    const pts: [number, number][] = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU,
        r = 7 + H(seed, i) * 3;
      pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.75]);
    }
    const ore = item.endsWith('_ore') || item === 'hellstone';
    fillPoly(c, pts, ore ? '#7c7a74' : col, INK, 1.1);
    if (ore)
      for (let i = 0; i < 4; i++)
        ellipse(c, (H(seed, i + 9) - 0.5) * 9, (H(seed, i + 19) - 0.5) * 6, 1.9, 1.5, col);
    ellipse(c, -2, -3, 2.6, 1.2, rgba('#ffffff', 0.22));
    if (item === 'hellstone') glow(c, 0, 0, 16, '#ff5a1f', 0.45);
    if (item === 'ice') glow(c, 0, 0, 12, '#dff6ff', 0.2);
  }
}

export function drawDrops(c: Canvas2D, g: RenderGame, cam: Point, w: number, h: number, t: number) {
  for (const d of g.s.drops as Drop[]) {
    if (t < d.born) continue;
    const x = d.x - cam.x,
      y = d.y - cam.y;
    if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;
    const bob = d.resting ? Math.sin(t * 2.6 + d.id) * 1.5 : 0;
    c.save();
    c.translate(x, y - 10 + bob);
    if (d.resting) ellipse(c, 0, 10 - bob, 11, 2.6, 'rgba(15,15,12,0.25)');
    c.scale(1.3, 1.3);
    glow(c, 0, 0, 16, '#fff1c8', 0.12 + Math.sin(t * 3 + d.id) * 0.05);
    drawItemIcon(c, d.item, d.id);
    if (d.qty > 1) {
      c.font = 'bold 11px sans-serif';
      c.textAlign = 'left';
      c.lineWidth = 3;
      c.strokeStyle = 'rgba(25,20,15,0.85)';
      c.strokeText('×' + d.qty, 7, 11);
      c.fillStyle = '#f4ecd8';
      c.fillText('×' + d.qty, 7, 11);
    }
    c.restore();
  }
}
