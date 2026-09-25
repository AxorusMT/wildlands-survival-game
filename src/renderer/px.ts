// Pixel-art core. The world is drawn on a low-resolution "art" canvas where one art pixel is two
// world pixels (a 32 px tile is 16 art pixels), then scaled up with nearest-neighbour sampling.
// Sprites are painted into pixel buffers with hard edges, hue-shifted colour ramps, and a
// selective outline (a darker tone of the neighbouring colour rather than flat black).

/** World pixels per art pixel. */
export const PX = 2;
/** Art pixels per tile. */
export const TA = 16;

export type Rgb = [number, number, number];

const hexCache = new Map<string, Rgb>();
export function rgb(hex: string): Rgb {
  let v = hexCache.get(hex);
  if (!v) {
    const n = parseInt(hex.slice(1, 7), 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    if (hexCache.size < 20000) hexCache.set(hex, v);
  }
  return v;
}
export const hex = ([r, g, b]: Rgb) =>
  '#' + ((1 << 24) | (clamp8(r) << 16) | (clamp8(g) << 8) | clamp8(b)).toString(16).slice(1);
const clamp8 = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export function mix(a: string, b: string, t: number) {
  const p = rgb(a),
    q = rgb(b),
    k = clamp(t);
  return hex([lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k)]);
}
export const rgba = (c: string, a: number) => {
  const [r, g, b] = rgb(c);
  return `rgba(${r},${g},${b},${a})`;
};

function toHsl([r, g, b]: Rgb): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min,
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r
      ? ((g - b) / d + (g < b ? 6 : 0)) / 6
      : max === g
        ? ((b - r) / d + 2) / 6
        : ((r - g) / d + 4) / 6;
  return [h, s, l];
}
function fromHsl(h: number, s: number, l: number): Rgb {
  const f = (n: number) => {
    const k = (n + h * 12) % 12,
      a = s * Math.min(l, 1 - l);
    return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [f(0), f(8), f(4)];
}
const shiftCache = new Map<string, string>();
/**
 * Lighter (amt > 0) or darker (amt < 0) with a hue shift: shadows lean toward blue-violet and
 * highlights toward warm yellow, which keeps shading lively instead of greying out.
 */
export function shade(c: string, amt: number) {
  const key = c + amt;
  let out = shiftCache.get(key);
  if (!out) {
    const [h, s, l] = toHsl(rgb(c));
    const target = amt < 0 ? 0.68 : 0.14,
      dh = ((((target - h) % 1) + 1.5) % 1) - 0.5;
    out = hex(
      fromHsl(
        (((h + dh * Math.min(0.35, Math.abs(amt) * 0.6)) % 1) + 1) % 1,
        clamp(s + (amt < 0 ? 0.08 : -0.04) * Math.abs(amt) * 3),
        clamp(l + amt * (amt < 0 ? l : 1 - l)),
      ),
    );
    if (shiftCache.size < 20000) shiftCache.set(key, out);
  }
  return out;
}
/** Five-step colour ramp from darkest to lightest around a base colour. */
export const ramp = (base: string): string[] => [
  shade(base, -0.55),
  shade(base, -0.28),
  base,
  shade(base, 0.25),
  shade(base, 0.5),
];

/** Deterministic hash in [0, 1) for integer coordinates. */
export function hash(x: number, y: number, s = 0) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Smooth value noise in [0, 1] on a lattice of `cell` pixels. */
export function vnoise(x: number, y: number, cell: number, s = 0) {
  const fx = x / cell,
    fy = y / cell,
    ix = Math.floor(fx),
    iy = Math.floor(fy),
    tx = fx - ix,
    ty = fy - iy,
    u = tx * tx * (3 - 2 * tx),
    v = ty * ty * (3 - 2 * ty);
  const a = hash(ix, iy, s),
    b = hash(ix + 1, iy, s),
    c = hash(ix, iy + 1, s),
    d = hash(ix + 1, iy + 1, s);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}
/** 4×4 ordered-dither threshold in [0, 1). */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

export function makeCanvas(w: number, h: number) {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, w);
  cv.height = Math.max(1, h);
  return cv;
}

/** A pixel buffer with hard-edged drawing, then turned into a canvas. */
export class Painter {
  readonly w: number;
  readonly h: number;
  readonly data: Uint8ClampedArray;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.data = new Uint8ClampedArray(w * h * 4);
  }

  set(x: number, y: number, c: string | Rgb, a = 255) {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || !c) return;
    const [r, g, b] = typeof c === 'string' ? rgb(c) : c,
      i = (y * this.w + x) * 4;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    this.data[i + 3] = a;
  }
  alpha(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
    return this.data[(y * this.w + x) * 4 + 3];
  }
  color(x: number, y: number): Rgb {
    const i = (y * this.w + x) * 4;
    return [this.data[i], this.data[i + 1], this.data[i + 2]];
  }
  clear(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.data[(y * this.w + x) * 4 + 3] = 0;
  }
  rect(x: number, y: number, w: number, h: number, c: string) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: string) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0),
      dy = -Math.abs(y1 - y0),
      sx = x0 < x1 ? 1 : -1,
      sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }
  /** Filled ellipse centred on (cx, cy); integer-friendly for crisp pixel discs. */
  ellipse(cx: number, cy: number, rx: number, ry: number, c: string) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x + 0.5 - cx) / (rx + 0.01),
          dy = (y + 0.5 - cy) / (ry + 0.01);
        if (dx * dx + dy * dy <= 1) this.set(x, y, c);
      }
  }
  /** Filled polygon by scanline. */
  poly(points: [number, number][], c: string) {
    const ys = points.map((p) => p[1]),
      y0 = Math.floor(Math.min(...ys)),
      y1 = Math.ceil(Math.max(...ys));
    for (let y = y0; y <= y1; y++) {
      const xs: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const [ax, ay] = points[i],
          [bx, by] = points[(i + 1) % points.length];
        const sy = y + 0.5;
        if ((ay <= sy && by > sy) || (by <= sy && ay > sy))
          xs.push(ax + ((sy - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, c);
    }
  }
  /** Fills opaque pixels inside a rect with `c` where the dither threshold is below `level`. */
  dither(x: number, y: number, w: number, h: number, c: string, level: number) {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++)
        if (this.alpha(x + i, y + j) && bayer(x + i, y + j) < level) this.set(x + i, y + j, c);
  }
  /** Shades opaque pixels by a light direction: top-left lit, bottom-right in shadow. */
  shadeEdges(light = 0.18, dark = -0.25) {
    const out = new Uint8ClampedArray(this.data);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        if (!this.alpha(x, y)) continue;
        const top = !this.alpha(x, y - 1) || !this.alpha(x - 1, y),
          bottom = !this.alpha(x, y + 1) || !this.alpha(x + 1, y);
        if (top === bottom) continue;
        const c = hex(this.color(x, y)),
          [r, g, b] = rgb(shade(c, top ? light : dark)),
          i = (y * this.w + x) * 4;
        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
      }
    this.data.set(out);
  }
  /**
   * Adds a one-pixel outline around opaque pixels. With no colour, each outline pixel takes a
   * deep, cool shade of the neighbouring colour (a "selective" outline).
   */
  outline(color?: string, strength = -0.72) {
    const add: [number, number, string][] = [];
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        if (this.alpha(x, y)) continue;
        let n: [number, number] | null = null;
        for (const [dx, dy] of [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ])
          if (this.alpha(x + dx, y + dy) > 128) {
            n = [x + dx, y + dy];
            break;
          }
        if (n) add.push([x, y, color ?? shade(hex(this.color(n[0], n[1])), strength)]);
      }
    for (const [x, y, c] of add) this.set(x, y, c);
  }
  toCanvas() {
    const cv = makeCanvas(this.w, this.h),
      k = cv.getContext('2d')!;
    k.putImageData(
      new ImageData(this.data as Uint8ClampedArray<ArrayBuffer>, this.w, this.h),
      0,
      0,
    );
    return cv;
  }
}

/** A cached sprite: its canvas and the pixel that sits on the anchor (usually the feet). */
export interface Sprite {
  cv: HTMLCanvasElement;
  ox: number;
  oy: number;
}
const sprites = new Map<string, Sprite>();
export function cached(key: string, build: () => Sprite): Sprite {
  let s = sprites.get(key);
  if (!s) {
    s = build();
    if (sprites.size > 4000) sprites.clear();
    sprites.set(key, s);
  }
  return s;
}
/** Paints with `paint`, outlines, and anchors at (ox, oy). */
export function sprite(
  w: number,
  h: number,
  ox: number,
  oy: number,
  paint: (p: Painter) => void,
  outline = true,
): Sprite {
  const p = new Painter(w + 2, h + 2);
  paint(p);
  if (outline) p.outline();
  return { cv: p.toCanvas(), ox: ox + 1, oy: oy + 1 };
}
/** Draws a sprite with its anchor at art position (x, y), optionally mirrored. */
export function blit(c: CanvasRenderingContext2D, s: Sprite, x: number, y: number, flip = false) {
  x = Math.round(x);
  y = Math.round(y);
  if (!flip) c.drawImage(s.cv, x - s.ox, y - s.oy);
  else {
    c.save();
    c.translate(x, 0);
    c.scale(-1, 1);
    c.drawImage(s.cv, -(s.cv.width - s.ox), y - s.oy);
    c.restore();
  }
}

/** A tiny 3×5 pixel font for numbers on drops and damage. */
const DIGITS: Record<string, string> = {
  '0': '111101101101111',
  '1': '010110010010111',
  '2': '111001111100111',
  '3': '111001111001111',
  '4': '101101111001001',
  '5': '111100111001111',
  '6': '111100111101111',
  '7': '111001010010010',
  '8': '111101111101111',
  '9': '111101111001111',
  x: '000101010101000',
  '+': '000010111010000',
  '-': '000000111000000',
};
export function pixelText(
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  shadow = '#1a1614',
) {
  let cx = Math.round(x);
  for (const ch of text) {
    const bits = DIGITS[ch];
    if (bits) {
      for (let i = 0; i < 15; i++)
        if (bits[i] === '1') {
          c.fillStyle = shadow;
          c.fillRect(cx + (i % 3) + 1, Math.round(y) + Math.floor(i / 3) + 1, 1, 1);
          c.fillStyle = color;
          c.fillRect(cx + (i % 3), Math.round(y) + Math.floor(i / 3), 1, 1);
        }
    }
    cx += 4;
  }
}

/** How the low-resolution view maps onto the screen. */
export interface PixelView {
  /** Device pixels per art pixel (an integer, so pixels stay square and even). */
  scale: number;
  artW: number;
  artH: number;
  /** Visible world size in world pixels. */
  worldW: number;
  worldH: number;
  /** CSS pixels per world pixel, for turning pointer positions into the world. */
  cssPerWorld: number;
}
export function pixelView(cssW: number, cssH: number, ratio: number, zoom = 2): PixelView {
  const scale = Math.max(1, Math.round(zoom * ratio)),
    artW = Math.ceil((cssW * ratio) / scale),
    artH = Math.ceil((cssH * ratio) / scale);
  return {
    scale,
    artW,
    artH,
    worldW: artW * PX,
    worldH: artH * PX,
    cssPerWorld: scale / ratio / PX,
  };
}
