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
import { ART, blendAt, artAt, daylight, duskiness, overcastOf } from './palette.ts';
import type { Canvas2D, RenderGame } from './types.ts';
import type { Point } from '../core/types.ts';

export function skylineHeight(style: string, wx: number, layer: number) {
  const s = layer * 7.3;
  if (style === 'peaks') {
    const r = 1 - Math.abs(2 * fbm(wx / 210 + s, 11) - 1);
    return Math.pow(r, 1.6) * (170 - layer * 28) + fbm(wx / 60, 3) * 12;
  }
  if (style === 'dunes')
    return (0.5 + 0.5 * Math.sin(wx / 170 + fbm(wx / 380 + s, 4) * 4)) * (48 - layer * 6) + 6;
  if (style === 'mesa') {
    const v = fbm(wx / 240 + s, 7);
    return smooth(0.44, 0.5, v) * (120 - layer * 18) + fbm(wx / 40, 9) * 7 + 8;
  }
  if (style === 'sea') return layer < 2 ? 2 + layer * 3 : fbm(wx / 260 + s, 5) * 60;
  return fbm(wx / 280 + s, 2) * (95 - layer * 12) + 10;
}
export function skylineTree(c: Canvas2D, kind: string, x: number, y: number, size: number) {
  if (kind === 'conifer') {
    polyPath(c, [
      [x - size * 0.32, y + 2],
      [x - size * 0.2, y - size * 0.35],
      [x - size * 0.26, y - size * 0.35],
      [x, y - size],
      [x + size * 0.26, y - size * 0.35],
      [x + size * 0.2, y - size * 0.35],
      [x + size * 0.32, y + 2],
    ]);
    c.fill();
  } else if (kind === 'pine') {
    c.fillRect(x - 1.2, y - size * 0.8, 2.4, size * 0.8 + 2);
    ellipse(c, x + size * 0.1, y - size * 0.82, size * 0.42, size * 0.16, c.fillStyle);
  } else if (kind) {
    c.fillRect(x - 1.5, y - size * 0.5, 3, size * 0.5 + 2);
    ellipse(c, x, y - size * 0.62, size * 0.4, size * 0.38, c.fillStyle);
  }
}
export function drawSky(
  c: Canvas2D,
  g: RenderGame,
  cam: Point,
  w: number,
  h: number,
  fx: number,
  tod: number,
) {
  const [A, B, k] = blendAt(fx),
    day = daylight(tod),
    dusk = duskiness(tod),
    time = g.s.elapsed;
  const gloom = overcastOf(g) * day;
  const top = mix(
    mix(mix('#0f1a26', mix(A.sky[0], B.sky[0], k), day), '#8f7f98', dusk * 0.3),
    '#737d80',
    gloom * 0.55,
  );
  const bottom = mix(
    mix(mix('#2d3d47', mix(A.sky[1], B.sky[1], k), day), '#f2b184', dusk * 0.55),
    '#a4aba6',
    gloom * 0.5,
  );
  const grad = c.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, top);
  grad.addColorStop(0.72, bottom);
  grad.addColorStop(1, bottom);
  c.fillStyle = grad;
  c.fillRect(0, 0, w, h);
  const night = 1 - day;
  if (night > 0.02)
    for (let i = 0; i < 110; i++) {
      const sx = H(i, 1) * w,
        sy = H(i, 9) * h * 0.62,
        tw = 0.55 + 0.45 * Math.sin(time * (1 + H(i, 2) * 2) + i);
      const r = 0.5 + H(i, 4) * 1.3;
      c.fillStyle = rgba('#f4eed8', night * tw * (0.35 + H(i, 5) * 0.65));
      c.fillRect(sx - r / 2, sy - r / 2, r, r);
    }
  const solar = (tod - 360) / 780;
  if (solar > -0.08 && solar < 1.08) {
    const sx = w * (0.1 + solar * 0.8),
      sy = h * (0.62 - Math.sin(clamp(solar) * Math.PI) * 0.46);
    glow(c, sx, sy, 190, dusk > 0.2 ? '#f5b877' : '#fbf0cf', 0.35 + dusk * 0.25);
    ellipse(c, sx, sy, 30, 30, dusk > 0.2 ? mix('#f7e3b0', '#f19a64', dusk) : '#f8ecc8');
  }
  const lunar = ((tod + 1440 - 1110) % 1440) / 690;
  if (lunar > -0.05 && lunar < 1.05 && night > 0.05) {
    const mx = w * (0.12 + lunar * 0.76),
      my = h * (0.5 - Math.sin(clamp(lunar) * Math.PI) * 0.36);
    glow(c, mx, my, 110, '#dfe6e8', 0.16 * night);
    c.save();
    c.globalAlpha = clamp(night * 1.3);
    ellipse(c, mx, my, 22, 22, '#ece6cf');
    c.beginPath();
    c.arc(mx, my, 22, 0, TAU);
    c.clip();
    ellipse(c, mx + 9, my - 5, 21, 21, 'rgba(24,36,48,0.82)');
    ellipse(c, mx - 7, my + 4, 3.5, 3, 'rgba(160,150,125,0.35)');
    ellipse(c, mx - 12, my - 7, 2.5, 2, 'rgba(160,150,125,0.3)');
    c.restore();
  }
  drawClouds(c, g, cam, w, h, day, dusk, 0);
  const surfY = D.surfaceAt(fx) - cam.y;
  const depthOf = [0.04, 0.1, 0.18, 0.28],
    rise = [215, 160, 105, 62],
    haze = [0.58, 0.4, 0.24, 0.1];
  for (let layer = 0; layer < 4; layer++) {
    const d = depthOf[layer],
      base = surfY - rise[layer] + (cam.y - (D.surfaceAt(fx) - h * 0.6)) * d * 0.4;
    if (base > h + 40) continue;
    let col = mix(mix(A.hills[layer], B.hills[layer], k), bottom, haze[layer]);
    col = mix(col, '#172431', night * (0.72 - layer * 0.06));
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(-10, h + 5);
    const trees = [];
    for (let sx = -16; sx <= w + 16; sx += 8) {
      const wx = sx + cam.x * d + layer * 1000;
      const ya = skylineHeight(A.skyline, wx, layer),
        yb = skylineHeight(B.skyline, wx, layer);
      const yy = base - lerp(ya, yb, k);
      c.lineTo(sx, yy);
      if (layer >= 1 && sx % 24 === 0) trees.push([sx, yy]);
    }
    c.lineTo(w + 10, h + 5);
    c.closePath();
    c.fill();
    if (base < h)
      for (const [sx, yy] of trees) {
        const wx = sx + cam.x * d + layer * 1000,
          kind = H(Math.floor(wx / 24), layer, 8) < k ? B.trees : A.trees;
        if (!kind || vnoise(wx / 150, layer + 20) < 0.42) continue;
        const size = (14 + H(Math.floor(wx / 24), layer, 9) * 16) * (0.7 + layer * 0.25);
        skylineTree(c, kind, sx + (H(Math.floor(wx / 24), 3) - 0.5) * 10, yy + 2, size);
      }
    c.fillRect(-10, base + 40, w + 20, h);
  }
}
export function drawClouds(
  c: Canvas2D,
  g: RenderGame,
  cam: Point,
  w: number,
  h: number,
  day: number,
  dusk: number,
  pass: number,
) {
  const weather = g.s.weather,
    overcast = weather === 'rain' || weather === 'storm' ? 1 : weather === 'cloudy' ? 0.6 : 0;
  const count = 4 + Math.round(overcast * 8);
  const light = mix(
    mix('#3d4b56', '#fbf7ec', day),
    '#8d9597',
    overcast * (weather === 'storm' ? 0.7 : 0.45),
  );
  const under = mix(mix('#2a3640', '#d8d7cf', day), '#6b7477', overcast * 0.6);
  const tint = mix(light, '#f3c4a0', dusk * 0.5);
  for (let i = pass; i < count; i += 1) {
    const span = w + 520,
      speed = 3 + H(i, 3) * 5,
      sx =
        ((((H(i, 11) * 3000 - cam.x * (0.03 + H(i, 7) * 0.03) + g.s.elapsed * speed) % span) +
          span) %
          span) -
        260,
      sy = 50 + H(i, 12) * h * 0.26,
      size = 36 + H(i, 13) * 46 + overcast * 22;
    const grad = c.createLinearGradient(0, sy - size * 0.8, 0, sy + size * 0.3);
    grad.addColorStop(0, rgba(tint, 0.92));
    grad.addColorStop(1, rgba(under, 0.9));
    c.save();
    c.beginPath();
    c.rect(sx - size * 2.2, sy - size * 1.2, size * 4.4, size * 1.45);
    c.clip();
    c.fillStyle = grad;
    c.beginPath();
    const puffs = 5;
    for (let p = 0; p < puffs; p++) {
      const px = sx + (p - (puffs - 1) / 2) * size * 0.62,
        r = size * (0.42 + H(i, p, 14) * 0.3) * (1 - Math.abs(p - 2) * 0.14);
      c.moveTo(px + r, sy - r * 0.35);
      c.arc(px, sy - r * 0.35, r, 0, TAU);
    }
    c.fill();
    c.restore();
  }
}
// ─── Terrain: cached chunks ───────────────────────────────────────────────
