import {
  D,
  T,
  TAU,
  H,
  clamp,
  lerp,
  smooth,
  vnoise,
  fbm,
  rgb,
  mix,
  rgba,
  shade,
  INK,
  polyPath,
  fillPoly,
  ellipse,
  line,
  curve,
  smoothPath,
  blobPath,
  inked,
  glow,
  limb,
} from './graphics.ts';
import {
  ART,
  BIOME_STEP,
  FIRST_CENTER,
  blendAt,
  artAt,
  daylight,
  duskiness,
  overcastOf,
} from './palette.ts';
import type { Canvas2D, RenderGame } from './types.ts';
import type { Point } from '../core/types.ts';

interface Light extends Point {
  r: number;
  color: string;
  warm: number;
}
export let mask: HTMLCanvasElement | null = null;
export function collectLights(g: RenderGame, menu: boolean, t: number): Light[] {
  const lights: Light[] = [];
  const p = g.s.player;
  if (!menu) lights.push({ x: p.x, y: p.y - 30, r: 260, color: '#e8d4a0', warm: 0.1 });
  for (const s of g.s.structures) {
    const f = Math.sin(t * 11 + s.id) * 6 + Math.sin(t * 17) * 4;
    if (s.type === 'campfire' && s.fuel > 0)
      lights.push({ x: s.x, y: s.y - 22, r: 250 + f, color: '#ffa850', warm: 0.34 });
    else if (s.type === 'lantern' && s.fuel > 0)
      lights.push({ x: s.x + 15, y: s.y - 50, r: 220 + f * 0.5, color: '#ffc46a', warm: 0.28 });
    else if (s.type === 'crystal_lantern')
      lights.push({ x: s.x + 15, y: s.y - 50, r: 280, color: '#8fe3df', warm: 0.26 });
    else if (s.type === 'furnace' || s.type === 'forge')
      lights.push({ x: s.x, y: s.y - 20, r: 150 + f * 0.3, color: '#ff9a4a', warm: 0.22 });
    else if (s.type === 'effergy')
      lights.push({ x: s.x, y: s.y - 80, r: 170, color: '#c9b2e8', warm: 0.2 });
  }
  for (const n of g.s.nodes)
    if (n.hp > 0 && n.kind === 'crystal')
      lights.push({ x: n.x, y: n.y - 16, r: 95, color: '#8fe3df', warm: 0.18 });
  return lights;
}
export function drawLighting(
  c: Canvas2D,
  g: RenderGame,
  cam: Point,
  w: number,
  h: number,
  menu: boolean,
  tod: number,
) {
  const night = Math.min(0.7, (1 - daylight(tod)) * 0.66 + overcastOf(g) * 0.14),
    t = g.s.elapsed;
  // The underground grows dark with depth; screen-space columns follow the terrain.
  let caveVisible = false;
  for (let sx = 0; sx <= w; sx += 64)
    if (D.surfaceAt(sx + cam.x) - cam.y + 90 < h) caveVisible = true;
  if (night < 0.02 && !caveVisible) return;
  const mw = Math.ceil(w / 2),
    mh = Math.ceil(h / 2);
  if (!mask) mask = document.createElement('canvas');
  if (mask.width !== mw || mask.height !== mh) {
    mask.width = mw;
    mask.height = mh;
  }
  const m = mask.getContext('2d')!;
  m.setTransform(0.5, 0, 0, 0.5, 0, 0);
  m.globalCompositeOperation = 'source-over';
  m.clearRect(0, 0, w, h);
  if (night > 0) {
    m.fillStyle = `rgba(8,14,26,${night})`;
    m.fillRect(0, 0, w, h);
  }
  if (caveVisible) {
    m.beginPath();
    m.moveTo(-20, h + 20);
    let avg = 0,
      count = 0;
    for (let sx = -32; sx <= w + 32; sx += 32) {
      const sy = D.surfaceAt(sx + cam.x) - cam.y + 70;
      avg += sy;
      count++;
      m.lineTo(sx, sy);
    }
    m.lineTo(w + 20, h + 20);
    m.closePath();
    avg /= count;
    const gr = m.createLinearGradient(0, avg, 0, avg + 380);
    gr.addColorStop(0, 'rgba(5,7,11,0)');
    gr.addColorStop(1, `rgba(5,7,11,${0.7 - night * 0.25})`);
    m.fillStyle = gr;
    m.fill();
  }
  const lights = collectLights(g, menu, t).filter(
    (l) =>
      l.x - cam.x > -l.r && l.x - cam.x < w + l.r && l.y - cam.y > -l.r && l.y - cam.y < h + l.r,
  );
  m.globalCompositeOperation = 'destination-out';
  for (const l of lights) {
    const sx = l.x - cam.x,
      sy = l.y - cam.y,
      gr = m.createRadialGradient(sx, sy, l.r * 0.15, sx, sy, l.r);
    gr.addColorStop(0, 'rgba(0,0,0,0.95)');
    gr.addColorStop(0.45, 'rgba(0,0,0,0.7)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = gr;
    m.fillRect(sx - l.r, sy - l.r, l.r * 2, l.r * 2);
  }
  c.drawImage(mask, 0, 0, w, h);
  const dark = Math.max(night, caveVisible ? 0.5 : 0);
  c.save();
  c.globalCompositeOperation = 'lighter';
  for (const l of lights)
    glow(c, l.x - cam.x, l.y - cam.y, l.r * 0.7, l.color, l.warm * (0.35 + dark));
  c.restore();
}
export function drawWeather(
  c: Canvas2D,
  g: RenderGame,
  cam: Point,
  w: number,
  h: number,
  menu: boolean,
  fx: number,
  tod: number,
) {
  const t = g.s.elapsed,
    weather = g.s.weather,
    biome = D.biomeAt(fx, 0).id,
    cold = biome === 'tundra' || biome === 'alpine',
    wet = weather === 'rain' || weather === 'storm',
    surfaceY = D.surfaceAt(fx) - cam.y,
    under = !menu && g.s.player.y > D.surfaceAt(g.s.player.x) + 150;
  if (under) return;
  const bottom = Math.min(h, surfaceY + 260);
  if (wet && !cold) {
    const n = weather === 'storm' ? 240 : 150,
      slant = weather === 'storm' ? 9 : 5;
    c.strokeStyle = 'rgba(200,218,222,0.45)';
    c.lineWidth = 1;
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const len = 12 + H(i, 6) * 10,
        x =
          ((((H(i, 4) * w * 1.3 + t * 60 * slant * 0.2 - cam.x * 0.2) % (w + 80)) + w + 80) %
            (w + 80)) -
          40,
        y = (H(i, 5) * bottom + t * (620 + H(i, 7) * 200)) % bottom;
      c.moveTo(x, y);
      c.lineTo(x - slant, y + len);
    }
    c.stroke();
    if (weather === 'storm') {
      const beat = Math.floor(t * 1.7),
        ph = t * 1.7 - beat;
      if (H(beat, 77) > 0.9 && ph < 0.25) {
        c.fillStyle = `rgba(235,240,255,${0.35 * (1 - ph / 0.25)})`;
        c.fillRect(0, 0, w, h);
      }
    }
  }
  if (cold) {
    const n = wet ? 170 : weather === 'cloudy' ? 70 : 34;
    c.fillStyle = 'rgba(248,250,252,0.85)';
    for (let i = 0; i < n; i++) {
      const r = 1 + H(i, 3) * 1.8,
        x =
          ((((H(i, 1) * w + Math.sin(t * 0.8 + i) * 18 + t * (wet ? 40 : 14) - cam.x * 0.3) %
            (w + 40)) +
            w +
            40) %
            (w + 40)) -
          20,
        y = (H(i, 2) * bottom + t * (28 + H(i, 5) * 30)) % bottom;
      c.fillRect(x, y, r, r);
    }
  }
  const night = 1 - daylight(tod);
  if (['meadow', 'marsh', 'forest'].includes(biome) && night > 0.3 && !wet)
    for (let i = 0; i < 16; i++) {
      const x = (((H(i, 1) * 1800 - cam.x + Math.sin(t * 0.4 + i) * 40) % 1800) + 1800) % 1800,
        y = surfaceY - 20 - H(i, 2) * 90 + Math.sin(t * 0.9 + i * 2) * 12,
        blink = Math.max(0, Math.sin(t * 2 + i * 1.7));
      if (x > w) continue;
      glow(c, x, y, 9, '#e8f08a', 0.55 * blink * night);
      ellipse(c, x, y, 1.2, 1.2, `rgba(245,250,190,${blink * night})`);
    }
  if ((biome === 'desert' || biome === 'badlands') && !wet)
    for (let i = 0; i < 30; i++) {
      const x = ((((H(i, 1) * w + t * (20 + H(i, 3) * 25)) % (w + 20)) + w + 20) % (w + 20)) - 10,
        y = surfaceY - H(i, 2) * 200 + Math.sin(t + i) * 6;
      ellipse(c, x, y, 1, 1, 'rgba(240,220,180,0.45)');
    }
  if ((biome === 'forest' || biome === 'taiga') && !wet)
    for (let i = 0; i < 7; i++) {
      const life = (t * 0.07 + H(i, 9)) % 1,
        x = (((H(i, 1) * w + life * 160 + Math.sin(life * 12 + i) * 30) % w) + w) % w,
        y = surfaceY - 240 + life * 260;
      c.save();
      c.translate(x, y);
      c.rotate(Math.sin(life * 14 + i) * 1.2);
      ellipse(c, 0, 0, 3.2, 1.6, biome === 'taiga' ? '#8a8a4e' : '#b48a3e');
      c.restore();
    }
}
// ─── Frame ────────────────────────────────────────────────────────────────
