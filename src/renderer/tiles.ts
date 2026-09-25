// Pixel terrain: autotiled 16×16 ground, back walls behind caves, surface caps, and lava.
import { ART, D, GROUND, groundOf, type GroundStyle, type Pattern } from './art.ts';
import { DOOR_TILE } from '../data/town.ts';
import { TA, bayer, hash, makeCanvas, ramp, rgb, shade, vnoise, type Rgb } from './px.ts';
import type { RenderGame } from './types.ts';

const T = D.TILE;
/** Tiles per cached chunk edge. */
export const CH = 16;
const CPX = CH * TA;
const MAX_CHUNKS = 90;

// ── Base textures ────────────────────────────────────────────────────────────────────────────

/** Textures repeat every PERIOD tiles, so patterns flow across tile edges without seams. */
const PERIOD = 8,
  SPAN = PERIOD * TA;
const wrap = (v: number, n: number) => ((v % n) + n) % n;
/** Value noise that tiles every SPAN pixels (cell must divide SPAN). */
function pnoise(x: number, y: number, cell: number, s = 0) {
  const n = SPAN / cell,
    fx = x / cell,
    fy = y / cell,
    ix = Math.floor(fx),
    iy = Math.floor(fy),
    tx = fx - ix,
    ty = fy - iy,
    u = tx * tx * (3 - 2 * tx),
    v = ty * ty * (3 - 2 * ty);
  const h = (i: number, j: number) => hash(wrap(i, n), wrap(j, n), s);
  return (
    (h(ix, iy) * (1 - u) + h(ix + 1, iy) * u) * (1 - v) +
    (h(ix, iy + 1) * (1 - u) + h(ix + 1, iy + 1) * u) * v
  );
}
/** Tiling Voronoi: distance to the nearest and second-nearest cell point, and the cell's hash. */
function voronoi(x: number, y: number, cell: number, s = 0): [number, number, number] {
  const n = SPAN / cell,
    cx = Math.floor(x / cell),
    cy = Math.floor(y / cell);
  let d1 = 1e9,
    d2 = 1e9,
    id = 0;
  for (let j = -1; j <= 1; j++)
    for (let i = -1; i <= 1; i++) {
      const gx = wrap(cx + i, n),
        gy = wrap(cy + j, n),
        px = (cx + i + 0.15 + hash(gx, gy, s) * 0.7) * cell,
        py = (cy + j + 0.15 + hash(gx, gy, s + 1) * 0.7) * cell,
        d = Math.hypot(x + 0.5 - px, (y + 0.5 - py) * 1.25);
      if (d < d1) {
        d2 = d1;
        d1 = d;
        id = hash(gx, gy, s + 2);
      } else if (d < d2) d2 = d;
    }
  return [d1, d2, id];
}
/** Chunky rock: cells with dark joints, lit upper edges, and varied faces. */
function rocky(x: number, y: number, cell: number, s: number) {
  const [d1, d2, id] = voronoi(x, y, cell, s);
  if (d2 - d1 < 1.1) return 0;
  const [e1, e2] = voronoi(x - 1, y - 1, cell, s);
  if (e2 - e1 < 1.1) return 3;
  const [f1, f2] = voronoi(x + 1, y + 1, cell, s);
  if (f2 - f1 < 1.1) return 1;
  return id < 0.25 ? 1 : id > 0.85 ? 3 : 2;
}

/** Ramp index (0 darkest … 4 lightest) or an explicit colour for a pixel of a material. */
function patternPixel(p: Pattern, s: GroundStyle, x: number, y: number): number | string {
  const n = pnoise(x, y, 8, 3),
    h = hash(x, y, 11);
  // Scattered pebbles: a small lit lump with a shadow, at most one per 8×8 cell.
  const pebble = () => {
    const cx = Math.floor(x / 8),
      cy = Math.floor(y / 8),
      k = hash(wrap(cx, SPAN / 8), wrap(cy, SPAN / 8), 41);
    if (k > 0.4) return -1;
    const px = cx * 8 + 1 + (Math.floor(k * 12) % 5),
      py = cy * 8 + 1 + (Math.floor(k * 37) % 5),
      dx = x - px,
      dy = y - py;
    if (dy === 0 && dx >= 0 && dx < 3) return 3;
    if (dy === 1 && dx >= 0 && dx < 3) return dx === 0 ? 3 : 2;
    if (dy === 2 && dx >= 0 && dx < 3) return 1;
    return -1;
  };
  switch (p) {
    case 'soil': {
      const pb = pebble();
      if (pb >= 0) return pb;
      if (h > 0.985) return 0;
      if (h < 0.015) return 3;
      return n > 0.66 ? 1 : 2;
    }
    case 'mud': {
      const pb = pebble();
      if (pb >= 0 && pb !== 3) return pb;
      if (h < 0.02) return 3;
      return n > 0.62 ? 1 : n < 0.25 ? 3 : 2;
    }
    case 'stone':
      if (h < 0.012) return 4;
      return rocky(x, y, 8, 5);
    case 'sand': {
      const ripple = Math.floor(y + pnoise(x, 0, 16, 9) * 4);
      if (ripple % 6 === 0 && h < 0.6) return 2;
      if (h < 0.05) return 4;
      if (h > 0.965) return 1;
      return 3;
    }
    case 'ice': {
      if (wrap(x + y, 16) === 0 || wrap(x + y + 1, 16) === 0) return 4;
      if (h < 0.03) return 4;
      return n > 0.6 ? 2 : 3;
    }
    case 'strata': {
      const band = Math.floor((y + pnoise(x, 0, 16, 4) * 5) / 5) & 3;
      if (h < 0.02) return s.accent ?? 4;
      return [1, 2, 3, 2][band];
    }
    case 'slate': {
      const row = Math.floor(y / 4),
        off = Math.floor(hash(wrap(row, SPAN / 4), 0, 2) * 16),
        seam = y % 4 === 3 || wrap(x + off, 16) === 0;
      if (seam) return 0;
      if (y % 4 === 0) return 3;
      if (h < 0.018) return s.accent ?? 4;
      return n > 0.55 ? 1 : 2;
    }
    case 'ash': {
      if (h < 0.02) return s.accent ?? 4;
      return rocky(x, y, 16, 17);
    }
    case 'hell': {
      const [d1, d2, id] = voronoi(x, y, 16, 21);
      if (d2 - d1 < 1.2) return id < 0.4 ? (s.accent ?? 4) : 0;
      if (d2 - d1 < 2.2 && id < 0.4) return shade(s.accent ?? '#ff6a2a', -0.4);
      return rocky(x, y, 8, 23) === 0 ? 1 : n > 0.6 ? 1 : 2;
    }
    case 'brick':
    case 'bigbrick': {
      const bh = p === 'brick' ? 4 : 8,
        bw = p === 'brick' ? 8 : 16,
        row = Math.floor(y / bh),
        bx = x + (row % 2) * (bw / 2);
      if (y % bh === bh - 1 || bx % bw === bw - 1) return 0;
      if (y % bh === 0 || bx % bw === 0) return 3;
      const brick = hash(wrap(Math.floor(bx / bw), SPAN / bw), wrap(row, SPAN / bh), 5);
      if (p === 'bigbrick' && s.accent && hash(x, y, 8) < 0.05 * brick) return s.accent;
      if (p === 'bigbrick' && brick > 0.8 && h < 0.2) return 1;
      return brick < 0.3 ? 1 : 2;
    }
    case 'planks': {
      const row = Math.floor(y / 4),
        end = wrap(x + Math.floor(hash(wrap(row, SPAN / 4), 0, 6) * 16), 16) === 0;
      if (y % 4 === 3 || end) return 0;
      if (y % 4 === 0) return 3;
      return hash(Math.floor(x / 3), y, 4) < 0.2 ? 1 : 2;
    }
    case 'glass':
      return wrap(x - y, 9) === 0 ? 4 : 3;
    case 'cloud':
      return n > 0.62 ? 3 : n < 0.3 ? 4 : 3;
    case 'crystal': {
      const [d1, d2, id] = voronoi(x, y, 8, 12);
      if (d2 - d1 < 1) return 4;
      return [1, 2, 3][Math.floor(id * 3)];
    }
    case 'fungal': {
      if (h < 0.03) return s.accent ?? 4;
      return rocky(x, y, 16, 29);
    }
    case 'void': {
      // Glassy black-violet slabs, faintly veined, with the odd star caught inside.
      if (h < 0.015) return s.accent ?? 4;
      const swirl = Math.abs(pnoise(x, y, 16, 31) - 0.5);
      if (swirl < 0.035) return 3;
      return rocky(x, y, 16, 33) === 0 ? 0 : n > 0.55 ? 1 : 2;
    }
    case 'obsidian': {
      if (wrap(x * 3 + y * 5, 23) === 0) return s.accent ?? 4;
      return rocky(x, y, 16, 37) === 0 ? 0 : n > 0.5 ? 1 : 2;
    }
  }
  return 2;
}

const baseCache = new Map<string, Uint8ClampedArray>();
/** Texture ramps are gentler than sprite ramps: large areas of ground should read calm. */
const texRamp = (base: string) =>
  [shade(base, -0.42), shade(base, -0.15), base, shade(base, 0.13), shade(base, 0.3)].map(rgb);
/** The 16×16 texture for a material at a tile position within the repeating block. */
function baseTexture(kind: number, tx: number, ty: number) {
  const px = wrap(tx, PERIOD),
    py = wrap(ty, PERIOD),
    key = kind + ':' + px + ':' + py;
  let tex = baseCache.get(key);
  if (!tex) {
    const s = groundOf(kind),
      r = texRamp(s.base);
    tex = new Uint8ClampedArray(TA * TA * 4);
    for (let y = 0; y < TA; y++)
      for (let x = 0; x < TA; x++) {
        const v = patternPixel(s.pattern, s, x + px * TA, y + py * TA),
          [cr, cg, cb] = typeof v === 'number' ? r[v] : rgb(v),
          i = (y * TA + x) * 4;
        tex[i] = cr;
        tex[i + 1] = cg;
        tex[i + 2] = cb;
        tex[i + 3] = s.pattern === 'glass' ? 140 : 255;
      }
    baseCache.set(key, tex);
  }
  return tex;
}

// ── Chunk painting ───────────────────────────────────────────────────────────────────────────

class Canvas {
  readonly data: Uint8ClampedArray;
  readonly w: number;
  constructor(w: number, h: number) {
    this.w = w;
    this.data = new Uint8ClampedArray(w * h * 4);
  }
  set(x: number, y: number, c: Rgb, a = 255) {
    if (x < 0 || y < 0 || x >= this.w) return;
    const i = (y * this.w + x) * 4;
    if (i >= this.data.length) return;
    this.data[i] = c[0];
    this.data[i + 1] = c[1];
    this.data[i + 2] = c[2];
    this.data[i + 3] = a;
  }
  clear(x: number, y: number) {
    const i = (y * this.w + x) * 4;
    if (i >= 0 && i < this.data.length) this.data[i + 3] = 0;
  }
  darken(x: number, y: number, k: number) {
    const i = (y * this.w + x) * 4;
    if (i < 0 || i >= this.data.length || !this.data[i + 3]) return;
    this.data[i] *= k;
    this.data[i + 1] *= k;
    this.data[i + 2] *= k;
  }
}

/** Open tiles with a wall behind them (placed, or the world's own); closed doors show one too. */
const isBack = (g: RenderGame, tx: number, ty: number) => {
  const tile = g.tileAt(tx, ty);
  return (!tile || tile === DOOR_TILE) && g.wallAt(tx, ty) > 0;
};

function paintWall(c: Canvas, g: RenderGame, tx: number, ty: number, ox: number, oy: number) {
  // A wall is the rock around it, set back: its own texture, darkened and cooled.
  const kind = g.wallAt(tx, ty),
    tex = baseTexture(kind, tx + 3, ty + 5),
    [wr, wg, wb] = rgb(groundOf(kind).wall ?? '#2c3036');
  for (let y = 0; y < TA; y++) {
    const row = y * TA * 4,
      dst = ((oy + y) * c.w + ox) * 4;
    for (let x = 0; x < TA; x++) {
      const i = row + x * 4,
        o = dst + x * 4;
      c.data[o] = tex[i] * 0.2 + wr * 0.3;
      c.data[o + 1] = tex[i + 1] * 0.2 + wg * 0.3;
      c.data[o + 2] = tex[i + 2] * 0.2 + wb * 0.36;
      c.data[o + 3] = 255;
    }
  }
  // Contact shadows where the wall meets solid ground.
  const solid = (dx: number, dy: number) => !!g.tileAt(tx + dx, ty + dy);
  for (let y = 0; y < TA; y++)
    for (let x = 0; x < TA; x++) {
      let d = 9;
      if (solid(0, -1)) d = Math.min(d, y);
      if (solid(0, 1)) d = Math.min(d, TA - 1 - y);
      if (solid(-1, 0)) d = Math.min(d, x);
      if (solid(1, 0)) d = Math.min(d, TA - 1 - x);
      if (d < 4) c.darken(ox + x, oy + y, 0.55 + d * 0.11);
    }
}

function capOf(g: RenderGame, s: GroundStyle, tx: number, ty: number) {
  if (!s.cap) return null;
  const x = tx * T + T / 2;
  // Caps grow where the ground meets open sky, not on cave ceilings or floors deep below.
  if (ty * T > D.surfaceAt(x) + 40 && s.cap !== 'mycel' && s.cap !== 'cloud') return null;
  if (s.cap === 'region') {
    const art = ART[D.biomeAt(x, ty * T).id] ?? ART.meadow;
    return art.cap === 'none' ? null : art.cap;
  }
  return s.cap;
}
function capColors(g: RenderGame, cap: string, tx: number, ty: number): Rgb[] {
  const art = ART[D.biomeAt(tx * T, ty * T).id] ?? ART.meadow;
  if (cap === 'snow') return ['#8aa6bf', '#dfeaf2', '#f8fbfd', '#ffffff'].map(rgb);
  if (cap === 'dust') return ['#7a4a36', '#a06a4f', '#c08868', '#d8a888'].map(rgb);
  if (cap === 'mycel') return ['#1f5e5a', '#3aa39a', '#58c8b8', '#9ef0e0'].map(rgb);
  if (cap === 'cloud') return ['#b8c4d8', '#e8eef8', '#ffffff', '#ffffff'].map(rgb);
  if (cap === 'moss') return ['#3a2060', '#6a3fa8', '#8a5ad0', '#b88af0'].map(rgb);
  return [shade(art.grass[0], -0.45), art.grass[0], art.grass[1], art.grass[2]].map(rgb);
}

function paintSolid(
  c: Canvas,
  g: RenderGame,
  tx: number,
  ty: number,
  kind: number,
  ox: number,
  oy: number,
) {
  const s = groundOf(kind),
    tex = baseTexture(kind, tx, ty);
  for (let y = 0; y < TA; y++) {
    const src = y * TA * 4,
      dst = ((oy + y) * c.w + ox) * 4;
    c.data.set(tex.subarray(src, src + TA * 4), dst);
  }
  const open = (dx: number, dy: number) => !g.tileAt(tx + dx, ty + dy),
    up = open(0, -1),
    dn = open(0, 1),
    lf = open(-1, 0),
    rt = open(1, 0);
  const r = ramp(s.base).map(rgb),
    edge = rgb(shade(s.base, -0.78));
  // Rims: dark outline on open sides, a lit top, and a shaded underside.
  for (let i = 0; i < TA; i++) {
    if (up) {
      c.set(ox + i, oy, edge);
      c.set(ox + i, oy + 1, r[4]);
    }
    if (dn) {
      c.set(ox + i, oy + TA - 1, edge);
      c.set(ox + i, oy + TA - 2, r[0]);
    }
    if (lf) {
      c.set(ox, oy + i, edge);
      if (i > 1) c.set(ox + 1, oy + i, r[3]);
    }
    if (rt) {
      c.set(ox + TA - 1, oy + i, edge);
      if (i > 1) c.set(ox + TA - 2, oy + i, r[1]);
    }
  }
  // Rounded corners where two open sides meet.
  const corner = (cx: number, cy: number, sx: number, sy: number) => {
    for (const [dx, dy] of [
      [0, 0],
      [1, 0],
      [0, 1],
    ])
      c.clear(ox + cx + dx * sx, oy + cy + dy * sy);
    for (const [dx, dy] of [
      [2, 0],
      [1, 1],
      [0, 2],
    ])
      c.set(ox + cx + dx * sx, oy + cy + dy * sy, edge);
  };
  if (up && lf) corner(0, 0, 1, 1);
  if (up && rt) corner(TA - 1, 0, -1, 1);
  if (dn && lf) corner(0, TA - 1, 1, -1);
  if (dn && rt) corner(TA - 1, TA - 1, -1, -1);
  // Surface caps: grass, snow, dust, spore moss, or cloud fluff.
  const cap = up ? capOf(g, s, tx, ty) : null;
  if (cap) {
    const col = capColors(g, cap, tx, ty);
    for (let x = 0; x < TA; x++) {
      if ((lf && x < 2) || (rt && x > TA - 3)) continue;
      const ax = tx * TA + x,
        depth = 4 + (hash(ax, 0, 7) > 0.5 ? 1 : 0) + (hash(ax, 0, 8) > 0.8 ? 1 : 0);
      c.set(ox + x, oy, col[0]);
      c.set(ox + x, oy + 1, col[3]);
      for (let y = 2; y < depth; y++) c.set(ox + x, oy + y, y === 2 ? col[2] : col[1]);
      if (bayer(ax, depth) < 0.5) c.set(ox + x, oy + depth, col[1]);
    }
    // The cap wraps a little way down open sides.
    for (let y = 0; y < 4; y++) {
      if (lf) c.set(ox, oy + y, col[0]);
      if (rt) c.set(ox + TA - 1, oy + y, col[0]);
    }
  }
}

/** Grass blades, flowers, and snow lumps standing in the open tile above a capped surface. */
function paintTufts(c: Canvas, g: RenderGame, tx: number, ty: number, ox: number, oy: number) {
  const below = g.tileAt(tx, ty + 1);
  if (!below) return;
  const s = GROUND[below];
  if (!s) return;
  const cap = capOf(g, s, tx, ty + 1);
  if (!cap || cap === 'dust') return;
  const col = capColors(g, cap, tx, ty + 1),
    art = ART[D.biomeAt(tx * T, ty * T).id] ?? ART.meadow;
  for (let x = 0; x < TA; x++) {
    const ax = tx * TA + x,
      h = hash(ax, 3, 13);
    if (cap === 'snow' || cap === 'cloud') {
      if (h < 0.3) c.set(ox + x, oy + TA - 1, col[2]);
      continue;
    }
    if (h > 0.55) continue;
    const height = 1 + Math.floor(hash(ax, 5, 17) * (cap === 'mycel' ? 4 : 3));
    for (let y = 0; y < height; y++)
      c.set(ox + x, oy + TA - 1 - y, y === height - 1 ? col[3] : col[2]);
    if (art.flowers.length && hash(ax, 9, 19) < 0.05) {
      const f = rgb(art.flowers[Math.floor(hash(ax, 2, 23) * art.flowers.length)]);
      c.set(ox + x, oy + TA - 1 - height, f);
      c.set(ox + x - 1, oy + TA - 1 - height, f);
      c.set(ox + x + 1, oy + TA - 1 - height, f);
      c.set(ox + x, oy + TA - 2 - height, f);
    }
  }
}

interface Chunk {
  back: HTMLCanvasElement | null;
  front: HTMLCanvasElement | null;
  sig: number;
}
const chunks = new Map<string, Chunk>();
let chunkTiles: number[] | null = null;

function chunkSig(g: RenderGame, cx: number, cy: number) {
  // A realm's chunks also depend on which realm (and seed) fills the pocket strip.
  let s = D.inPocket(cx * CH * T) ? 17 + (D.activeRealm()?.inst.seed ?? 0) : 17;
  for (let ty = cy * CH - 1; ty <= cy * CH + CH; ty++)
    for (let tx = cx * CH - 1; tx <= cx * CH + CH; tx++)
      s = (Math.imul(s, 31) + g.tileAt(tx, ty) * 64 + g.wallEditAt(tx, ty) + 3) | 0;
  return s;
}

function renderChunk(g: RenderGame, cx: number, cy: number): Chunk {
  const back = new Canvas(CPX, CPX),
    front = new Canvas(CPX, CPX);
  let anyBack = false,
    anyFront = false;
  for (let j = 0; j < CH; j++)
    for (let i = 0; i < CH; i++) {
      const tx = cx * CH + i,
        ty = cy * CH + j,
        kind = g.tileAt(tx, ty);
      if (kind === DOOR_TILE) {
        // A closed door is drawn by its structure; the wall shows behind it.
        if (isBack(g, tx, ty)) {
          paintWall(back, g, tx, ty, i * TA, j * TA);
          anyBack = true;
        }
      } else if (kind) {
        paintSolid(front, g, tx, ty, kind, i * TA, j * TA);
        anyFront = true;
      } else {
        if (isBack(g, tx, ty)) {
          paintWall(back, g, tx, ty, i * TA, j * TA);
          anyBack = true;
        }
        const before: boolean = anyFront;
        paintTufts(front, g, tx, ty, i * TA, j * TA);
        anyFront = before || !!g.tileAt(tx, ty + 1);
      }
    }
  const toCanvas = (c: Canvas) => {
    const cv = makeCanvas(CPX, CPX);
    cv.getContext('2d')!.putImageData(
      new ImageData(c.data as Uint8ClampedArray<ArrayBuffer>, CPX, CPX),
      0,
      0,
    );
    return cv;
  };
  return {
    back: anyBack ? toCanvas(back) : null,
    front: anyFront ? toCanvas(front) : null,
    sig: chunkSig(g, cx, cy),
  };
}

type Visible = [Chunk, number, number];
/** Draws cave walls behind the world; returns the visible chunks for the front pass. */
export function drawWalls(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
): Visible[] {
  if (chunkTiles !== g.s.tiles) {
    chunks.clear();
    chunkTiles = g.s.tiles;
  }
  const visible: Visible[] = [];
  const cx0 = Math.floor(ax / CPX),
    cx1 = Math.floor((ax + w) / CPX),
    cy0 = Math.max(0, Math.floor(ay / CPX)),
    cy1 = Math.floor((ay + h) / CPX);
  let built = 0;
  for (let cy = cy0; cy <= cy1; cy++)
    for (let cx = cx0; cx <= cx1; cx++) {
      if (cx < 0 || cx * CH >= D.TILE_COLS || cy * CH >= D.TILE_ROWS) continue;
      const key = cx + ':' + cy;
      let ch = chunks.get(key);
      // Rebuild changed chunks, but spread fresh builds over frames when scrolling fast.
      if (!ch || (ch.sig !== chunkSig(g, cx, cy) && built < 3)) {
        ch = renderChunk(g, cx, cy);
        built++;
      }
      chunks.delete(key);
      chunks.set(key, ch);
      visible.push([ch, cx, cy]);
    }
  while (chunks.size > MAX_CHUNKS) chunks.delete(chunks.keys().next().value!);
  for (const [ch, cx, cy] of visible)
    if (ch.back) c.drawImage(ch.back, cx * CPX - ax, cy * CPX - ay);
  return visible;
}
export function drawGround(
  c: CanvasRenderingContext2D,
  visible: Visible[],
  ax: number,
  ay: number,
) {
  for (const [ch, cx, cy] of visible)
    if (ch.front) c.drawImage(ch.front, cx * CPX - ax, cy * CPX - ay);
}

/** Molten rock, animated each frame. */
export function drawLava(
  c: CanvasRenderingContext2D,
  g: RenderGame,
  ax: number,
  ay: number,
  w: number,
  h: number,
  now: number,
) {
  if ((ay + h) * 2 < 3300) return;
  const tx0 = Math.floor(ax / TA),
    tx1 = Math.ceil((ax + w) / TA),
    ty0 = Math.max(0, Math.floor(ay / TA)),
    ty1 = Math.min(D.TILE_ROWS - 1, Math.ceil((ay + h) / TA));
  const lava = (tx: number, ty: number) =>
    !g.tileAt(tx, ty) && D.lavaAt(tx * T + T / 2, ty * T + T / 2);
  for (let tx = tx0; tx <= tx1; tx++)
    for (let ty = ty0; ty <= ty1; ty++) {
      if (!lava(tx, ty)) continue;
      const x = tx * TA - ax,
        y = ty * TA - ay,
        top = !lava(tx, ty - 1);
      c.fillStyle = top ? '#f07a22' : '#d4521a';
      c.fillRect(x, y, TA, TA);
      c.fillStyle = '#b8380f';
      c.fillRect(x, y + (top ? 10 : 8), TA, TA - (top ? 10 : 8));
      // Bright blobs drift through the melt.
      for (let k = 0; k < 3; k++) {
        const bx = (Math.floor(hash(tx, ty, k) * 16) + Math.floor(now * (3 + k))) % TA,
          by = 4 + Math.floor(hash(ty, tx, k + 3) * 10);
        c.fillStyle = k ? '#ffb347' : '#ffe08a';
        c.fillRect(x + bx, y + by, 2, 1);
      }
      if (top) {
        for (let i = 0; i < TA; i++) {
          const wave = Math.round(Math.sin(now * 2.6 + (tx * TA + i) * 0.45) * 1.2);
          c.fillStyle = '#ffe08a';
          c.fillRect(x + i, y + 1 + wave, 1, 2);
          c.fillStyle = '#ffb347';
          c.fillRect(x + i, y + 3 + wave, 1, 1);
        }
      }
    }
}
