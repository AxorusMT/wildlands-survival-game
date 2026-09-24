import * as D from '../data/index.ts';
import type { Canvas2D, Pair } from './types.ts';
export { D };
export const T = D.TILE;
export const TAU = Math.PI * 2;

export const H = (x: number, y: number, s = 0) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 71.7) * 43758.5453;
  return n - Math.floor(n);
};
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const vnoise = (x: number, s = 0) => {
  const i = Math.floor(x),
    f = x - i,
    u = f * f * (3 - 2 * f);
  return H(i, s, 3) * (1 - u) + H(i + 1, s, 3) * u;
};
export const fbm = (x: number, s = 0) =>
  vnoise(x, s) * 0.55 + vnoise(x * 2.13, s + 1) * 0.3 + vnoise(x * 4.37, s + 2) * 0.15;
export const rgbOf = new Map<string, [number, number, number]>();
export function rgb(hex: string): [number, number, number] {
  let v = rgbOf.get(hex);
  if (!v) {
    if (rgbOf.size > 5000) rgbOf.clear();
    const n = parseInt(hex.slice(1, 7), 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    rgbOf.set(hex, v);
  }
  return v;
}
export function mix(a: string, b: string, t: number) {
  const p = rgb(a),
    q = rgb(b),
    k = clamp(t);
  const r = Math.round(lerp(p[0], q[0], k)),
    g = Math.round(lerp(p[1], q[1], k)),
    bl = Math.round(lerp(p[2], q[2], k));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}
export const rgba = (hex: string, a: number) => {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${clamp(a)})`;
};
export const shade = (hex: string, amt: number) =>
  mix(hex, amt > 0 ? '#ffffff' : '#000000', Math.abs(amt));
export const INK = 'rgba(36,29,24,0.78)';
export function polyPath(c: Canvas2D, pts: number[][]) {
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.closePath();
}
export function fillPoly(
  c: Canvas2D,
  pts: number[][],
  fill: string | CanvasGradient | CanvasPattern,
  stroke = '',
  width = 1.5,
) {
  polyPath(c, pts);
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.lineJoin = 'round';
    c.stroke();
  }
}
export function ellipse(
  c: Canvas2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  fill: string | CanvasGradient | CanvasPattern = '',
  stroke = '',
  width = 1.5,
  rot = 0,
) {
  c.beginPath();
  c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
export function line(
  c: Canvas2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  w = 1,
) {
  c.strokeStyle = color;
  c.lineWidth = w;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}
export function curve(
  c: Canvas2D,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  color: string,
  w = 1,
) {
  c.strokeStyle = color;
  c.lineWidth = w;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.quadraticCurveTo(cx, cy, x2, y2);
  c.stroke();
}
// A closed curve through the midpoints of pts: soft organic outlines for foliage and bodies.
export function smoothPath(c: Canvas2D, pts: number[][]) {
  const n = pts.length;
  const mid = (i: number): Pair => [
    (pts[i % n][0] + pts[(i + 1) % n][0]) / 2,
    (pts[i % n][1] + pts[(i + 1) % n][1]) / 2,
  ];
  c.beginPath();
  const m = mid(n - 1);
  c.moveTo(m[0], m[1]);
  for (let i = 0; i < n; i++) {
    const q = mid(i);
    c.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]);
  }
  c.closePath();
}
export function blobPath(
  c: Canvas2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  seed: number,
  j = 0.16,
) {
  const pts: Pair[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU,
      r = 1 + (H(i, seed, 5) - 0.5) * j * 2;
    pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]);
  }
  smoothPath(c, pts);
}
// Shapes sharing one outer ink line: stroke every piece, then fill over the inner seams.
export function inked(c: Canvas2D, shapes: (() => void)[], fill: string | CanvasGradient, lw = 3) {
  c.lineJoin = 'round';
  c.strokeStyle = INK;
  c.lineWidth = lw;
  for (const s of shapes) {
    s();
    c.stroke();
  }
  c.fillStyle = fill;
  for (const s of shapes) {
    s();
    c.fill();
  }
}
export function glow(c: Canvas2D, x: number, y: number, r: number, color: string, a: number) {
  if (a <= 0.003 || r <= 0) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(1, rgba(color, 0));
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}
export function limb(
  c: Canvas2D,
  hx: number,
  hy: number,
  fx: number,
  fy: number,
  bend: number,
  w1: number,
  w2: number,
  color: string,
  outline = true,
) {
  const mx = (hx + fx) / 2 + bend,
    my = (hy + fy) / 2;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  for (const pass of outline ? [0, 1] : [1]) {
    c.strokeStyle = pass ? color : INK;
    const extra = pass ? 0 : 2.4;
    c.lineWidth = w1 + extra;
    c.beginPath();
    c.moveTo(hx, hy);
    c.lineTo(mx, my);
    c.stroke();
    c.lineWidth = w2 + extra;
    c.beginPath();
    c.moveTo(mx, my);
    c.lineTo(fx, fy);
    c.stroke();
  }
}
