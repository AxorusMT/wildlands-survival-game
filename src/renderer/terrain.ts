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

export const CH = 16,
  CPX = CH * T,
  PAD = 30,
  MAX_CHUNKS = 36;
interface Chunk {
  back: HTMLCanvasElement | null;
  front: HTMLCanvasElement | null;
  sig: number;
}
export const chunks = new Map<string, Chunk>();
export let chunkScale = 0,
  chunkTiles: number[] | null = null;
export const BASE: Record<number, string> = {
  1: '#76604a',
  2: '#5c6166',
  3: '#c9ad7f',
  4: '#5c6656',
  5: '#b7ccd2',
  6: '#9a5f4a',
  7: '#2f2a35',
  8: '#4b566a',
  9: '#6e4038',
  10: '#5c2230',
};
export function chunkSig(g: RenderGame, cx: number, cy: number) {
  let s = 17;
  for (let ty = cy * CH - 1; ty <= cy * CH + CH; ty++)
    for (let tx = cx * CH - 1; tx <= cx * CH + CH; tx++)
      s = (Math.imul(s, 31) + g.tileAt(tx, ty) + 1) | 0;
  return s;
}
export const isBack = (g: RenderGame, tx: number, ty: number) =>
  !g.tileAt(tx, ty) && (ty + 0.5) * T > D.surfaceAt((tx + 0.5) * T);
// Tile kind with the deep badlands obsidian bed split out as its own look.
export const lookOf = (g: RenderGame, tx: number, ty: number) => {
  const k = g.tileAt(tx, ty);
  return k === 6 && ty * T > D.surfaceAt((tx + 0.5) * T) + 200 ? 7 : k;
};
export function newCanvas(px: number, scale: number) {
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(px * scale);
  cv.height = Math.ceil(px * scale);
  return cv;
}
export function renderBack(g: RenderGame, cx: number, cy: number, scale: number) {
  const x0 = cx * CH,
    y0 = cy * CH;
  let any = false;
  for (let ty = y0; ty < y0 + CH && !any; ty++)
    for (let tx = x0; tx < x0 + CH; tx++)
      if (isBack(g, tx, ty)) {
        any = true;
        break;
      }
  if (!any) return null;
  const cv = newCanvas(CPX, scale),
    k = cv.getContext('2d')!;
  k.setTransform(scale, 0, 0, scale, -x0 * T * scale, -y0 * T * scale);
  for (let ty = y0; ty < y0 + CH; ty++)
    for (let tx = x0; tx < x0 + CH; tx++) {
      if (!isBack(g, tx, ty)) continue;
      const x = tx * T,
        y = ty * T,
        depth = y - D.surfaceAt(x + T / 2),
        biome = D.biomeAt(x, y).id;
      const rock =
        biome === 'badlands'
          ? '#2a222a'
          : biome === 'tundra' || biome === 'alpine'
            ? '#27313a'
            : '#242a30';
      const earth = biome === 'desert' ? '#4a3b2b' : biome === 'badlands' ? '#4a3029' : '#3b3028';
      // Deeper layers: cold blue-black stone, then scorched ash, then the red dark of hell.
      const deep = mix(
        mix(rock, '#1b2130', smooth(D.LAYERS[2].top - 150, D.LAYERS[2].top + 150, y)),
        mix('#1f0f0d', '#140507', smooth(D.LAYERS[4].top - 150, D.LAYERS[4].top + 150, y)),
        smooth(D.LAYERS[3].top - 150, D.LAYERS[3].top + 150, y),
      );
      const col = mix(earth, deep, smooth(30, 170, depth));
      k.fillStyle = col;
      k.fillRect(x, y, T + 0.6, T + 0.6);
      // Faint rock plates give the back wall depth without competing with the solid ground.
      blobPath(k, x + 8 + H(tx, ty, 1) * 16, y + 8 + H(tx, ty, 2) * 16, 9, 6, tx * 7 + ty, 0.3);
      k.fillStyle = shade(col, 0.045);
      k.fill();
      if (H(tx, ty, 3) < 0.4) {
        line(
          k,
          x + H(tx, ty, 4) * T,
          y + H(tx, ty, 5) * T,
          x + H(tx, ty, 6) * T,
          y + H(tx, ty, 7) * T,
          shade(col, -0.2),
          1,
        );
      }
      const sh = (x1: number, y1: number, x2: number, y2: number, rx: number, ry: number) => {
        const gr = k.createLinearGradient(x1, y1, x2, y2);
        gr.addColorStop(0, 'rgba(6,8,10,0.55)');
        gr.addColorStop(1, 'rgba(6,8,10,0)');
        k.fillStyle = gr;
        k.fillRect(rx, ry, Math.abs(x2 - x1) || T, Math.abs(y2 - y1) || T);
      };
      if (g.tileAt(tx, ty - 1)) sh(x, y, x, y + 18, x, y);
      if (g.tileAt(tx - 1, ty)) sh(x, y, x + 12, y, x, y);
      if (g.tileAt(tx + 1, ty)) {
        const gr = k.createLinearGradient(x + T, y, x + T - 12, y);
        gr.addColorStop(0, 'rgba(6,8,10,0.45)');
        gr.addColorStop(1, 'rgba(6,8,10,0)');
        k.fillStyle = gr;
        k.fillRect(x + T - 12, y, 12, T);
      }
    }
  return cv;
}
export function renderFront(g: RenderGame, cx: number, cy: number, scale: number) {
  const x0 = cx * CH,
    y0 = cy * CH;
  let any = false;
  for (let ty = y0; ty < y0 + CH && !any; ty++)
    for (let tx = x0; tx < x0 + CH; tx++)
      if (g.tileAt(tx, ty)) {
        any = true;
        break;
      }
  if (!any) return null;
  const cv = newCanvas(CPX + PAD * 2, scale),
    k = cv.getContext('2d')!;
  k.setTransform(scale, 0, 0, scale, (PAD - x0 * T) * scale, (PAD - y0 * T) * scale);
  const solid = (tx: number, ty: number) => g.tileAt(tx, ty) !== 0;
  const R = 7,
    paths = new Map(),
    all = new Path2D();
  const corners: { x: number; y: number; a: number }[] = [];
  for (let ty = y0; ty < y0 + CH; ty++)
    for (let tx = x0; tx < x0 + CH; tx++) {
      if (!solid(tx, ty)) continue;
      const look = lookOf(g, tx, ty),
        x = tx * T,
        y = ty * T;
      const up = !solid(tx, ty - 1),
        dn = !solid(tx, ty + 1),
        lf = !solid(tx - 1, ty),
        rt = !solid(tx + 1, ty);
      const ox = lf ? 0 : 0.7,
        oy = up ? 0 : 0.7,
        ow = ox + (rt ? 0 : 0.7),
        oh = oy + (dn ? 0 : 0.7);
      const radii = [up && lf ? R : 0, up && rt ? R : 0, dn && rt ? R : 0, dn && lf ? R : 0];
      let p = paths.get(look);
      if (!p) paths.set(look, (p = new Path2D()));
      for (const target of [p, all])
        if (radii.some(Boolean)) target.roundRect(x - ox, y - oy, T + ow, T + oh, radii);
        else target.rect(x - ox, y - oy, T + ow, T + oh);
      if (radii[0]) corners.push({ x: x + R, y: y + R, a: Math.PI });
      if (radii[1]) corners.push({ x: x + T - R, y: y + R, a: -Math.PI / 2 });
      if (radii[2]) corners.push({ x: x + T - R, y: y + T - R, a: 0 });
      if (radii[3]) corners.push({ x: x + R, y: y + T - R, a: Math.PI / 2 });
    }
  // Base colour and texture, one material at a time.
  for (const [look, p] of paths) {
    const base = BASE[look];
    k.fillStyle = base;
    k.fill(p);
    k.save();
    k.clip(p);
    textureMaterial(k, g, look, base, x0, y0);
    k.restore();
  }
  // Depth, rims, and ink edges shared by every material.
  k.save();
  k.clip(all);
  for (let tx = x0; tx < x0 + CH; tx++) {
    const surf = D.surfaceAt((tx + 0.5) * T);
    const gr = k.createLinearGradient(0, surf + 20, 0, surf + 900);
    gr.addColorStop(0, 'rgba(14,18,24,0)');
    gr.addColorStop(1, 'rgba(14,18,24,0.5)');
    k.fillStyle = gr;
    k.fillRect(tx * T - 1, y0 * T - 2, T + 2, CPX + 4);
  }
  for (let ty = y0; ty < y0 + CH; ty++)
    for (let tx = x0; tx < x0 + CH; tx++) {
      if (!solid(tx, ty)) continue;
      const x = tx * T,
        y = ty * T,
        base = BASE[lookOf(g, tx, ty)];
      const up = !solid(tx, ty - 1),
        dn = !solid(tx, ty + 1),
        lf = !solid(tx - 1, ty),
        rt = !solid(tx + 1, ty);
      if (up) {
        k.fillStyle = rgba(shade(base, 0.22), 0.8);
        k.fillRect(x, y + 1.5, T, 3);
      }
      if (dn) {
        const gr = k.createLinearGradient(0, y + T, 0, y + T - 10);
        gr.addColorStop(0, 'rgba(10,10,12,0.45)');
        gr.addColorStop(1, 'rgba(10,10,12,0)');
        k.fillStyle = gr;
        k.fillRect(x, y + T - 10, T, 10);
      }
      for (const [side, sx] of [
        [lf, x],
        [rt, x + T],
      ] as [boolean, number][]) {
        if (!side) continue;
        const gr = k.createLinearGradient(sx, 0, sx === x ? x + 8 : x + T - 8, 0);
        gr.addColorStop(0, 'rgba(10,10,12,0.3)');
        gr.addColorStop(1, 'rgba(10,10,12,0)');
        k.fillStyle = gr;
        k.fillRect(sx === x ? x : x + T - 8, y, 8, T);
      }
      k.fillStyle = INK;
      if (up) k.fillRect(x, y, T, 1.6);
      if (dn) k.fillRect(x, y + T - 1.6, T, 1.6);
      if (lf) k.fillRect(x, y, 1.6, T);
      if (rt) k.fillRect(x + T - 1.6, y, 1.6, T);
    }
  k.strokeStyle = INK;
  k.lineWidth = 3.2;
  for (const cr of corners) {
    k.beginPath();
    k.arc(cr.x, cr.y, R, cr.a, cr.a + Math.PI / 2);
    k.stroke();
  }
  k.restore();
  // Surface caps, cave floor details, and hanging stone.
  for (let ty = y0; ty < y0 + CH; ty++)
    for (let tx = x0; tx < x0 + CH; tx++) {
      if (!solid(tx, ty)) continue;
      const x = tx * T,
        y = ty * T;
      if (!solid(tx, ty - 1)) {
        if (isBack(g, tx, ty - 1)) caveFloor(k, g, tx, ty, x, y);
        else surfaceCap(k, g, tx, ty, x, y, !solid(tx - 1, ty), !solid(tx + 1, ty));
      }
      if (!solid(tx, ty + 1) && isBack(g, tx, ty + 1)) caveCeiling(k, g, tx, ty, x, y);
    }
  return cv;
}
export function textureMaterial(
  k: Canvas2D,
  g: RenderGame,
  look: number,
  base: string,
  x0: number,
  y0: number,
) {
  const left = x0 * T,
    top = y0 * T;
  // Continuous strata lines drawn in world space so they flow across tiles.
  if (look === 2 || look === 6 || look === 5 || look === 7 || look >= 8) {
    const gap = look === 6 ? 11 : look === 5 ? 15 : look === 10 ? 17 : look === 9 ? 13 : 23;
    for (let yy = top - gap; yy < top + CPX + gap; yy += gap) {
      k.beginPath();
      for (let xx = left - 8; xx <= left + CPX + 8; xx += 16) {
        const oy = (fbm(xx / 170 + yy * 0.013, look) - 0.5) * gap * 1.4;
        if (xx === left - 8) k.moveTo(xx, yy + oy);
        else k.lineTo(xx, yy + oy);
      }
      if (look === 6) {
        const band = Math.floor(yy / gap);
        k.lineTo(left + CPX + 8, yy + gap * 2);
        k.lineTo(left - 8, yy + gap * 2);
        k.closePath();
        k.fillStyle = ['#a8694f', '#8a5241', '#b67c5d', '#94583f'][((band % 4) + 4) % 4];
        k.fill();
      } else {
        k.strokeStyle = rgba(shade(base, look === 5 ? 0.25 : -0.16), 0.55);
        k.lineWidth = look === 5 ? 1.4 : 1.1;
        k.stroke();
      }
    }
  }
  for (let ty = y0; ty < y0 + CH; ty++)
    for (let tx = x0; tx < x0 + CH; tx++) {
      const kind = lookOf(g, tx, ty);
      if (kind !== look) continue;
      const x = tx * T,
        y = ty * T,
        r = (i: number) => H(tx, ty, i);
      if (look === 1 || look === 4) {
        for (let i = 0; i < 2; i++) {
          ellipse(
            k,
            x + r(i) * T,
            y + r(i + 3) * T,
            5 + r(i + 5) * 8,
            3 + r(i + 7) * 3,
            shade(base, (r(i + 9) - 0.5) * 0.14),
          );
        }
        if (r(11) < 0.55) {
          const px = x + 4 + r(12) * 24,
            py = y + 6 + r(13) * 22,
            pr = 1.8 + r(14) * 2.4;
          ellipse(k, px, py, pr * 1.3, pr, look === 4 ? '#7d8672' : '#9a8a70');
          ellipse(k, px - 0.5, py - 0.6, pr * 0.7, pr * 0.4, 'rgba(255,255,255,0.18)');
        }
        const depth = y - D.surfaceAt(x + T / 2);
        if (depth < 70 && r(15) < 0.35)
          curve(
            k,
            x + r(16) * T,
            y,
            x + r(17) * T,
            y + 14,
            x + r(18) * T,
            y + 24,
            rgba('#3e2f22', 0.6),
            1.2,
          );
        if (look === 4 && r(19) < 0.3) ellipse(k, x + r(20) * T, y + r(21) * T, 7, 3, '#4c5648');
      } else if (look === 2 || look === 7) {
        const n = 1 + Math.floor(r(1) * 2);
        for (let i = 0; i < n; i++) {
          const bx = x + 6 + r(i + 2) * 20,
            by = y + 6 + r(i + 4) * 20,
            rx = 5 + r(i + 6) * 7,
            ry = 3.5 + r(i + 8) * 4;
          blobPath(k, bx, by, rx, ry, tx * 13 + ty * 7 + i, 0.25);
          k.fillStyle = shade(base, look === 7 ? 0.06 : 0.07);
          k.fill();
          k.strokeStyle = rgba(shade(base, -0.35), 0.45);
          k.lineWidth = 1;
          k.stroke();
          curve(
            k,
            bx - rx * 0.6,
            by - ry * 0.2,
            bx - rx * 0.2,
            by - ry * 0.9,
            bx + rx * 0.4,
            by - ry * 0.7,
            rgba('#ffffff', 0.13),
            1,
          );
        }
        if (r(10) < 0.22) {
          k.strokeStyle = rgba(shade(base, -0.4), 0.6);
          k.lineWidth = 1;
          k.beginPath();
          k.moveTo(x + r(11) * T, y + r(12) * 8);
          k.lineTo(x + r(13) * T, y + 10 + r(14) * 8);
          k.lineTo(x + r(15) * T, y + 20 + r(16) * 10);
          k.stroke();
        }
        if (look === 7 && r(17) < 0.3) {
          fillPoly(
            k,
            [
              [x + 10, y + 16],
              [x + 14, y + 9],
              [x + 18, y + 17],
            ],
            '#6e5a8c',
          );
        }
      } else if (look === 8) {
        // Deepstone: dense blue-grey slabs with glints of mica.
        blobPath(
          k,
          x + 8 + r(1) * 16,
          y + 8 + r(2) * 16,
          8 + r(3) * 5,
          5 + r(4) * 3,
          tx * 17 + ty,
          0.2,
        );
        k.fillStyle = shade(base, 0.06);
        k.fill();
        k.strokeStyle = rgba(shade(base, -0.35), 0.5);
        k.lineWidth = 1;
        k.stroke();
        if (r(5) < 0.45) ellipse(k, x + r(6) * T, y + r(7) * T, 1.3, 1.3, '#b9d2e6');
        if (r(8) < 0.2) ellipse(k, x + r(9) * T, y + r(10) * T, 1.6, 1.1, '#e8f1f8');
      } else if (look === 9) {
        // Ash rock: crumbly, cracked, with embers still glowing in the seams.
        k.strokeStyle = rgba('#2a1512', 0.7);
        k.lineWidth = 1.1;
        k.beginPath();
        k.moveTo(x + r(1) * T, y);
        k.lineTo(x + r(2) * T, y + 14 + r(3) * 6);
        k.lineTo(x + r(4) * T, y + T);
        k.stroke();
        for (let i = 0; i < 3; i++)
          ellipse(k, x + r(i + 5) * T, y + r(i + 8) * T, 2.5, 1.6, shade(base, 0.12));
        if (r(11) < 0.35) {
          ellipse(k, x + r(12) * T, y + r(13) * T, 1.6, 1.6, '#ff8a3a');
          ellipse(k, x + r(12) * T, y + r(13) * T, 3.4, 3.4, rgba('#ff6a1a', 0.25));
        }
      } else if (look === 10) {
        // Hellrock: near-black crimson split by molten veins.
        if (r(1) < 0.5) {
          const vx = x + r(2) * T;
          k.strokeStyle = rgba('#ff5a1f', 0.75);
          k.lineWidth = 1.4;
          k.beginPath();
          k.moveTo(vx, y);
          k.quadraticCurveTo(vx + (r(3) - 0.5) * 20, y + 16, vx + (r(4) - 0.5) * 14, y + T);
          k.stroke();
          k.strokeStyle = rgba('#ffc46a', 0.5);
          k.lineWidth = 0.6;
          k.stroke();
        }
        blobPath(k, x + 16, y + 16, 9 + r(5) * 5, 6 + r(6) * 4, tx * 7 + ty * 3, 0.3);
        k.fillStyle = shade(base, -0.08);
        k.fill();
      } else if (look === 3) {
        for (let i = 0; i < 3; i++) {
          const yy = y + 5 + i * 10 + r(i) * 4;
          curve(
            k,
            x - 2,
            yy,
            x + T / 2,
            yy - 3 + r(i + 4) * 2,
            x + T + 2,
            yy,
            rgba(shade(base, i % 2 ? 0.16 : -0.1), 0.6),
            1.2,
          );
        }
        k.fillStyle = '#a88c60';
        for (let i = 0; i < 4; i++) k.fillRect(x + r(i + 8) * T, y + r(i + 12) * T, 1.3, 1.3);
      } else if (look === 5) {
        if (r(1) < 0.35) {
          k.strokeStyle = rgba('#7fa3b1', 0.55);
          k.lineWidth = 1;
          k.beginPath();
          k.moveTo(x + r(2) * T, y + r(3) * 10);
          k.lineTo(x + r(4) * T, y + 12 + r(5) * 8);
          k.lineTo(x + r(6) * T, y + 22 + r(7) * 8);
          k.stroke();
        }
        ellipse(k, x + r(8) * T, y + r(9) * T, 6, 3, rgba('#ffffff', 0.25));
      } else if (look === 6) {
        if (r(1) < 0.3) ellipse(k, x + r(2) * T, y + r(3) * T, 3, 2, '#c69471');
        if (r(4) < 0.2) line(k, x + r(5) * T, y + r(6) * T, x + r(7) * T, y + 30, '#6f3f32', 1);
      }
    }
}
export function grassBlade(
  k: Canvas2D,
  bx: number,
  by: number,
  h: number,
  lean: number,
  color: string,
) {
  k.fillStyle = color;
  k.beginPath();
  k.moveTo(bx - 1.3, by);
  k.quadraticCurveTo(bx + lean * 0.3, by - h * 0.6, bx + lean, by - h);
  k.quadraticCurveTo(bx + lean * 0.3 + 1, by - h * 0.5, bx + 1.3, by);
  k.closePath();
  k.fill();
}
export function surfaceCap(
  k: Canvas2D,
  g: RenderGame,
  tx: number,
  ty: number,
  x: number,
  y: number,
  lf: boolean,
  rt: boolean,
) {
  const art = artAt(x + T / 2, y),
    r = (i: number) => H(tx, ty, i + 40);
  let cap = art.cap;
  if (cap === 'alpine') cap = vnoise(tx / 3.3, 5) > 0.55 ? 'snow' : 'grass';
  const [dark, mid, light] = cap === 'snow' ? ['#b9c9cf', '#e6eeee', '#fbfdfb'] : art.grass;
  const depth = cap === 'snow' ? 9 : cap === 'grass' ? 7 : 4;
  // Cap band with an irregular lower edge; it wraps over exposed step edges.
  k.beginPath();
  k.moveTo(x - (lf ? 1.5 : 0.5), y - 1);
  k.lineTo(x + T + (rt ? 1.5 : 0.5), y - 1);
  if (rt) k.lineTo(x + T + 1.5, y + depth + 5);
  for (let i = 8; i >= 0; i--) {
    const px = x + (i / 8) * T,
      py = y + depth + H(tx * 8 + i, ty, 44) * 3 - (i === 0 || i === 8 ? 0 : 0);
    k.lineTo(px, py);
  }
  if (lf) k.lineTo(x - 1.5, y + depth + 5);
  k.closePath();
  k.fillStyle =
    cap === 'grass' ? mid : cap === 'snow' ? mid : cap === 'sand' ? '#dcc294' : '#bd8a6b';
  k.fill();
  k.strokeStyle = cap === 'snow' ? 'rgba(90,120,140,0.55)' : INK;
  k.lineWidth = 1.4;
  k.beginPath();
  k.moveTo(x - (lf ? 1.5 : 0), y - 1);
  k.lineTo(x + T + (rt ? 1.5 : 0), y - 1);
  k.stroke();
  k.fillStyle =
    cap === 'grass' ? light : cap === 'snow' ? light : cap === 'sand' ? '#ead6ae' : '#cf9d7c';
  k.fillRect(x, y, T, 2);
  if (cap === 'grass') {
    for (let i = 0; i < 8; i++) {
      const bx = x + 2 + i * 4 + (r(i) - 0.5) * 3,
        h = 3 + r(i + 10) * 8,
        lean = (r(i + 20) - 0.5) * 6;
      grassBlade(k, bx, y + 1, h, lean, [dark, mid, light][Math.floor(r(i + 30) * 3)]);
    }
    if (art.flowers.length && r(50) < 0.3) {
      const fx = x + 6 + r(51) * 20,
        fh = 7 + r(52) * 6;
      line(k, fx, y + 1, fx + 1, y - fh, dark, 1.1);
      const col = art.flowers[Math.floor(r(53) * art.flowers.length)];
      for (let p = 0; p < 5; p++)
        ellipse(k, fx + 1 + Math.cos(p * 1.26) * 2, y - fh + Math.sin(p * 1.26) * 2, 1.7, 1.7, col);
      ellipse(k, fx + 1, y - fh, 1.1, 1.1, '#e9b949');
    }
  } else if (cap === 'snow') {
    for (let i = 0; i < 3; i++)
      ellipse(k, x + 5 + i * 11 + r(i) * 4, y - 0.5, 5 + r(i + 5) * 3, 2.4, light);
    if (r(8) < 0.25) {
      line(k, x + 8 + r(9) * 16, y, x + 6 + r(9) * 16, y - 8, '#8d8a6d', 1);
      line(k, x + 11 + r(9) * 16, y, x + 13 + r(9) * 16, y - 6, '#8d8a6d', 1);
    }
  } else if (cap === 'sand') {
    if (r(1) < 0.18)
      for (let i = 0; i < 5; i++)
        line(k, x + 14, y + 1, x + 9 + i * 2.5, y - 4 - r(i) * 5, '#9c7f52', 1);
    if (r(7) < 0.3) ellipse(k, x + r(8) * T, y - 1, 2.2, 1.5, '#a58b66');
  } else {
    if (r(1) < 0.14) {
      line(k, x + 12, y + 1, x + 16, y - 9, '#5a3f30', 1.3);
      line(k, x + 15, y - 6, x + 20, y - 10, '#5a3f30', 1);
    }
    if (r(7) < 0.35) ellipse(k, x + r(8) * T, y - 0.5, 2.6, 1.8, '#8a5a47');
  }
}
export function caveFloor(
  k: Canvas2D,
  g: RenderGame,
  tx: number,
  ty: number,
  x: number,
  y: number,
) {
  const r = (i: number) => H(tx, ty, i + 60),
    biome = D.biomeAt(x, y).id,
    base = BASE[lookOf(g, tx, ty)];
  k.fillStyle = rgba(shade(base, 0.28), 0.9);
  k.fillRect(x, y, T, 2);
  if (r(1) < 0.35 && ['forest', 'marsh', 'meadow', 'coast', 'taiga'].includes(biome)) {
    for (let i = 0; i < 4; i++)
      ellipse(
        k,
        x + 4 + r(i + 2) * 24,
        y + 0.5,
        3 + r(i + 6) * 3,
        1.8,
        i % 2 ? '#5f7a4e' : '#4b6440',
      );
  }
  if (r(10) < 0.16) {
    const sx = x + 6 + r(11) * 20,
      sh = 6 + r(12) * 10;
    fillPoly(
      k,
      [
        [sx - 4, y + 1],
        [sx - 0.5, y - sh],
        [sx + 4, y + 1],
      ],
      shade(base, 0.05),
      INK,
      1.1,
    );
  } else if (r(13) < 0.3) ellipse(k, x + r(14) * T, y - 1, 2.5, 1.8, shade(base, 0.18), INK, 0.8);
}
export function caveCeiling(
  k: Canvas2D,
  g: RenderGame,
  tx: number,
  ty: number,
  x: number,
  y: number,
) {
  const r = (i: number) => H(tx, ty, i + 80),
    base = BASE[lookOf(g, tx, ty)],
    depth = y - D.surfaceAt(x + T / 2);
  if (depth < 90 && lookOf(g, tx, ty) !== 3) {
    if (r(1) < 0.5)
      for (let i = 0; i < 2; i++) {
        const rx = x + 5 + r(i + 2) * 22;
        curve(k, rx, y + T, rx + 4, y + T + 8, rx - 1, y + T + 14 + r(i + 4) * 8, '#4a3828', 1.4);
      }
    return;
  }
  const n = r(6) < 0.45 ? 1 + Math.floor(r(7) * 2) : 0;
  for (let i = 0; i < n; i++) {
    const sx = x + 5 + r(i + 8) * 22,
      len = 7 + r(i + 10) * 15,
      wd = 3 + r(i + 12) * 3;
    fillPoly(
      k,
      [
        [sx - wd, y + T - 1],
        [sx + 0.5, y + T + len],
        [sx + wd, y + T - 1],
      ],
      shade(base, -0.05),
      INK,
      1.1,
    );
    line(k, sx - wd * 0.5, y + T + 1, sx, y + T + len * 0.7, rgba('#ffffff', 0.15), 1);
  }
}
export function drawTerrain(c: Canvas2D, g: RenderGame, cam: Point, w: number, h: number) {
  const ratio = c.getTransform().a || 1,
    scale = Math.min(ratio, 1.5);
  if (scale !== chunkScale || chunkTiles !== g.s.tiles) {
    chunks.clear();
    chunkScale = scale;
    chunkTiles = g.s.tiles;
  }
  const cx0 = Math.floor((cam.x - PAD) / CPX),
    cx1 = Math.floor((cam.x + w + PAD) / CPX),
    cy0 = Math.max(0, Math.floor((cam.y - PAD) / CPX)),
    cy1 = Math.floor((cam.y + h + PAD) / CPX);
  const visible: [Chunk, number, number][] = [];
  for (let cy = cy0; cy <= cy1; cy++)
    for (let cx = cx0; cx <= cx1; cx++) {
      if (cx < 0 || cx * CH >= D.TILE_COLS || cy * CH >= D.TILE_ROWS) continue;
      const key = cx + ':' + cy,
        sig = chunkSig(g, cx, cy);
      let ch = chunks.get(key);
      if (!ch || ch.sig !== sig) {
        ch = {
          back: renderBack(g, cx, cy, Math.min(scale, 1)),
          front: renderFront(g, cx, cy, scale),
          sig,
        };
      }
      chunks.delete(key);
      chunks.set(key, ch);
      visible.push([ch, cx, cy]);
    }
  while (chunks.size > MAX_CHUNKS) chunks.delete(chunks.keys().next().value!);
  // Snapping to device pixels keeps neighbouring chunks from showing hairline seams.
  const snap = (v: number) => Math.round(v * ratio) / ratio;
  for (const [ch, cx, cy] of visible)
    if (ch.back)
      c.drawImage(ch.back, snap(cx * CPX - cam.x), snap(cy * CPX - cam.y), CPX + 0.5, CPX + 0.5);
  drawLava(c, g, cam, w, h);
  for (const [ch, cx, cy] of visible)
    if (ch.front)
      c.drawImage(
        ch.front,
        snap(cx * CPX - PAD - cam.x),
        snap(cy * CPX - PAD - cam.y),
        CPX + PAD * 2,
        CPX + PAD * 2,
      );
}
/** Molten rock, drawn live so it churns and glows. */
export function drawLava(c: Canvas2D, g: RenderGame, cam: Point, w: number, h: number) {
  if (cam.y + h < 3400) return;
  const now = performance.now() / 1000,
    tx0 = Math.floor(cam.x / T),
    tx1 = Math.ceil((cam.x + w) / T),
    ty0 = Math.max(0, Math.floor(cam.y / T)),
    ty1 = Math.min(D.TILE_ROWS - 1, Math.ceil((cam.y + h) / T));
  const lava = (tx: number, ty: number) =>
    !g.tileAt(tx, ty) && D.lavaAt(tx * T + T / 2, ty * T + T / 2);
  for (let tx = tx0; tx <= tx1; tx++)
    for (let ty = ty0; ty <= ty1; ty++) {
      if (!lava(tx, ty)) continue;
      const x = tx * T - cam.x,
        y = ty * T - cam.y,
        top = !lava(tx, ty - 1);
      const gr = c.createLinearGradient(0, y, 0, y + T);
      gr.addColorStop(0, top ? '#ffb347' : '#f0661e');
      gr.addColorStop(1, '#c2330f');
      c.fillStyle = gr;
      c.fillRect(x, y, T + 0.5, T + 0.5);
      // Slow crust plates drift across the melt.
      const drift = Math.sin(now * 0.6 + tx * 0.9 + ty * 1.7);
      ellipse(c, x + 16 + drift * 6, y + 18, 7, 3, rgba('#7a1d0c', 0.45));
      if (top) {
        c.beginPath();
        c.moveTo(x, y + 4);
        for (let i = 0; i <= 4; i++)
          c.lineTo(x + (i * T) / 4, y + 3 + Math.sin(now * 2.4 + (tx * 4 + i) * 0.8) * 2.5);
        c.lineTo(x + T, y + 8);
        c.lineTo(x, y + 8);
        c.closePath();
        c.fillStyle = '#ffe08a';
        c.fill();
        glow(c, x + 16, y + 2, 34, '#ff7a2a', 0.22);
      }
    }
}
/** Ladders down every shaft, with a rope-lashed frame over each surface mouth. */
export function drawLadders(c: Canvas2D, cam: Point, w: number, h: number) {
  for (const shaft of D.SHAFTS) {
    const sx = shaft.x - cam.x;
    if (sx < -90 || sx > w + 90) continue;
    const surface = shaft.top < D.surfaceAt(shaft.x) + 20,
      y1 = (surface ? D.surfaceAt(shaft.x) - 24 : shaft.top) - cam.y,
      y2 = shaft.bottom + 40 - cam.y;
    if (y2 < -40 || y1 > h + 40) continue;
    const deep = shaft.top > D.LAYERS[3].top,
      wood = deep ? '#4a3a3a' : '#7a5d42',
      rung = deep ? '#6d5250' : '#a58560';
    for (const rx of [-22, 22]) {
      line(c, sx + rx, y1, sx + rx, y2, INK, 7);
      line(c, sx + rx, y1, sx + rx, y2, wood, 4.5);
      line(c, sx + rx - 1, y1, sx + rx - 1, y2, shade(wood, 0.2), 1.3);
    }
    for (
      let y = Math.max(y1 + 14, y1 + 14 + Math.floor((-40 - y1) / 20) * 20);
      y < Math.min(y2, h + 40);
      y += 20
    ) {
      line(c, sx - 22, y + 2, sx + 22, y + 2, 'rgba(0,0,0,0.3)', 3);
      line(c, sx - 22, y, sx + 22, y, INK, 5);
      line(c, sx - 22, y, sx + 22, y, rung, 3);
    }
    if (!surface) continue;
    // A rope-lashed frame marks the shaft mouth from the surface.
    line(c, sx - 30, y1 + 26, sx - 26, y1 - 30, INK, 6);
    line(c, sx + 30, y1 + 26, sx + 26, y1 - 30, INK, 6);
    line(c, sx - 30, y1 + 26, sx - 26, y1 - 30, '#6b4f37', 4);
    line(c, sx + 30, y1 + 26, sx + 26, y1 - 30, '#6b4f37', 4);
    line(c, sx - 34, y1 - 26, sx + 34, y1 - 26, INK, 6);
    line(c, sx - 34, y1 - 26, sx + 34, y1 - 26, '#7a5d42', 4);
    for (const rx of [-26, 26]) {
      line(c, sx + rx - 3, y1 - 29, sx + rx + 3, y1 - 23, '#d2bb88', 1.5);
      line(c, sx + rx - 3, y1 - 24, sx + rx + 3, y1 - 28, '#d2bb88', 1.5);
    }
    line(c, sx + 8, y1 - 26, sx + 8, y1 - 8, '#cdb383', 1.4);
    ellipse(c, sx + 8, y1 - 5, 3, 4, '#cdb383', INK, 1);
  }
}
// ─── Trees ────────────────────────────────────────────────────────────────
