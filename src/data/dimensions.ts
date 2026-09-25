// The three dimensions beyond the Rift Gate. Each lies in its own strip of the world east of the
// overworld, walled off by bedrock, so the same tiles, saves, physics, and renderer serve them.
// Everything here is a pure function of position, like the rest of the world geometry.
import { fbm1, fbm2, noise1 } from '../core/noise.ts';

export interface Dimension {
  /** A handcrafted dimension, or (for the pocket strip) the generated realm now in it. */
  id: string;
  name: string;
  start: number;
  end: number;
  /** Where travellers arrive, local x from the strip's start. */
  arrive: number;
  /** Air temperature. */
  temp: number;
}
export const DIM_GAP = 640,
  DIM_WIDTH = 9600;
export function makeDimensions(overworldW: number): Dimension[] {
  const at = (i: number) => overworldW + DIM_GAP + i * (DIM_WIDTH + DIM_GAP);
  return [
    {
      id: 'mycelia',
      name: 'Mycelial Deep',
      start: at(0),
      end: at(0) + DIM_WIDTH,
      arrive: 520,
      temp: 19,
    },
    {
      id: 'skyreach',
      name: 'Skyreach',
      start: at(1),
      end: at(1) + DIM_WIDTH,
      arrive: 520,
      temp: 6,
    },
    { id: 'void', name: 'Hollow Void', start: at(2), end: at(2) + DIM_WIDTH, arrive: 520, temp: 3 },
  ];
}

/** Tile kinds used out here (see art.ts GROUND for their look). */
export const DT = {
  mycelium: 19,
  fungal: 20,
  cloud: 21,
  skystone: 22,
  voidstone: 23,
  crystal: 24,
  bedrock: 27,
  glowshroom: 28,
} as const;

// ── Smoothed profiles with a walkable slope limit ──────────────────────────────────────────────
const STEP = 16,
  MAX_RISE = 14;
function profile(fn: (x: number) => number) {
  const n = Math.ceil(DIM_WIDTH / STEP) + 1,
    h = new Float32Array(n);
  for (let i = 0; i < n; i++) h[i] = fn(i * STEP);
  for (let i = 1; i < n; i++) h[i] = Math.min(h[i], h[i - 1] + MAX_RISE);
  for (let i = n - 2; i >= 0; i--) h[i] = Math.min(h[i], h[i + 1] + MAX_RISE);
  return (x: number) => {
    const f = Math.max(0, Math.min(DIM_WIDTH, x)) / STEP,
      i = Math.min(n - 2, Math.floor(f)),
      t = f - i;
    return h[i] * (1 - t) + h[i + 1] * t;
  };
}

// ── The Mycelial Deep: one vast glowing cavern, a tunnel below it, and the Heart Hollow ────────
export const MYC = {
  floor: profile((x) => 1700 + 190 * fbm1(x / 1100, 201) + 36 * noise1(x / 230, 202)),
  ceiling: (x: number) => 560 + 150 * fbm1(x / 760, 203) + 70 * Math.abs(noise1(x / 170, 204)),
  tunnel: (x: number) => 2500 + 90 * fbm1(x / 900, 205) + 20 * Math.sin(x / 160),
  /** The Sporemother's chamber at the far end. */
  hollow: { x0: DIM_WIDTH - 1500, x1: DIM_WIDTH - 260, top: 2150, bottom: 2780 },
  ladders: [0.12, 0.34, 0.58, 0.8].map((f) => Math.round(DIM_WIDTH * f)),
};
function myceliaTile(x: number, y: number): number {
  const floor = MYC.floor(x),
    ceil = MYC.ceiling(x),
    h = MYC.hollow;
  // Stalactites hang from the ceiling here and there.
  const drip = Math.max(0, noise1(x / 60, 207) - 0.45) * 520;
  const open =
    (y > ceil + drip && y < floor) ||
    Math.abs(y - MYC.tunnel(x)) < 70 + 14 * Math.sin(x / 83) ||
    (x > h.x0 &&
      x < h.x1 &&
      y > h.top + 60 * Math.abs(Math.sin((x - h.x0) / 300)) &&
      y < h.bottom) ||
    MYC.ladders.some((lx) => Math.abs(x - lx) < 44 && y > floor - 10 && y < MYC.tunnel(lx) + 40);
  if (open) return 0;
  if (y >= floor && y < floor + 64) return DT.mycelium;
  // Glowing shelf fungus lines the walls in places.
  if (fbm2(x / 150, y / 110, 209) > 0.7) return DT.glowshroom;
  return DT.fungal;
}

// ── Skyreach: floating islands over a sea of cloud ─────────────────────────────────────────────
export interface Island {
  cx: number;
  top: number;
  half: number;
  depth: number;
}
export const SKY_SEA = 3900;
export const ISLANDS: Island[] = (() => {
  const out: Island[] = [];
  let top = 3300;
  for (let i = 0; i < 17; i++) {
    const r = (k: number) => {
      const v = Math.sin((i + 1) * 127.1 + k * 311.7) * 43758.5453;
      return v - Math.floor(v);
    };
    const cx = 560 + i * 540 + (r(1) - 0.5) * 140,
      half = 170 + r(2) * 190;
    // A rising staircase with the odd drop, so every island can be reached from the next.
    top = Math.max(900, Math.min(3350, top - 120 - r(3) * 260 + (i % 4 === 3 ? 520 : 0)));
    out.push({ cx, top, half, depth: 150 + r(4) * 200 });
  }
  // The Roc's nest: the last and highest island.
  out[out.length - 1] = { cx: DIM_WIDTH - 700, top: 820, half: 420, depth: 380 };
  return out;
})();
export const islandTop = (isl: Island, x: number) =>
  isl.top + 10 * noise1(x / 90, 211) + (Math.abs(x - isl.cx) / isl.half) ** 4 * 30;
/** Rope ladders hang from beside each island down to the cloud sea. */
export const SKY_LADDERS = ISLANDS.map((isl, i) => ({
  x: isl.cx + (i % 2 ? -1 : 1) * (isl.half + 46),
  top: isl.top - 4,
  bottom: SKY_SEA,
}));
function skyTile(x: number, y: number): number {
  for (const l of SKY_LADDERS)
    if (Math.abs(x - l.x) < 40 && y > l.top - 40 && y < l.bottom) return 0;
  if (y > SKY_SEA + 24 * noise1(x / 200, 213)) return y > SKY_SEA + 300 ? DT.skystone : DT.cloud;
  for (const isl of ISLANDS) {
    const d = (x - isl.cx) / isl.half;
    if (Math.abs(d) >= 1) continue;
    const top = islandTop(isl, x),
      bottom = isl.top + isl.depth * (1 - d * d) ** 0.8;
    if (y >= top && y < bottom)
      return bottom - y < 40 && noise1(x / 40, 215) > 0.2 ? DT.cloud : DT.skystone;
  }
  // Small cloud banks drift between the islands.
  if (noise1(x / 130, 217) + noise1(y / 70, 219) > 1.45 && y > 1200 && y < SKY_SEA - 200)
    return DT.cloud;
  return 0;
}

// ── The Hollow Void: a dark shore of voidstone, crystal spires, and drifting shards ────────────
export const VOID = {
  floor: profile(
    (x) =>
      2700 +
      170 * fbm1(x / 900, 221) +
      30 * noise1(x / 200, 222) +
      (x > DIM_WIDTH - 1800 ? Math.min(360, (x - (DIM_WIDTH - 1800)) * 0.9) : 0),
  ),
  shards: Array.from({ length: 12 }, (_, i) => {
    const r = (k: number) => {
      const v = Math.sin((i + 3) * 91.7 + k * 57.3) * 24634.6345;
      return v - Math.floor(v);
    };
    return {
      cx: 1200 + i * 660 + (r(1) - 0.5) * 200,
      top: 1700 + r(2) * 700,
      half: 110 + r(3) * 120,
      depth: 90 + r(4) * 90,
    };
  }),
  /** The Maw: a crater at the far end where the Unmaker waits. */
  maw: { x0: DIM_WIDTH - 1800, x1: DIM_WIDTH - 200 },
};
export const VOID_LADDERS = VOID.shards.map((s, i) => ({
  x: s.cx + (i % 2 ? -1 : 1) * (s.half + 46),
  top: s.top - 4,
  bottom: 0,
}));
function voidTile(x: number, y: number): number {
  const floor = VOID.floor(x);
  for (const l of VOID_LADDERS) if (Math.abs(x - l.x) < 40 && y > l.top - 40 && y < floor) return 0;
  if (y >= floor) return y < floor + 40 && noise1(x / 50, 225) > 0.55 ? DT.crystal : DT.voidstone;
  // Crystal spires, never more than a jump high.
  if (y > floor - 60 && noise1(x / 34, 227) > 0.78 && !(x > VOID.maw.x0 && x < VOID.maw.x1))
    return DT.crystal;
  for (const s of VOID.shards) {
    const d = (x - s.cx) / s.half;
    if (Math.abs(d) >= 1) continue;
    const top = s.top + 8 * noise1(x / 70, 229),
      bottom = s.top + s.depth * (1 - d * d) ** 0.7;
    if (y >= top && y < bottom) return bottom - y < 30 ? DT.crystal : DT.voidstone;
  }
  return 0;
}

/** Tile kind at a position in a dimension, with x measured from the strip's start. */
export function dimensionTile(dim: string, x: number, y: number): number {
  if (x < 64 || x > DIM_WIDTH - 64) return DT.bedrock;
  if (dim === 'mycelia') return myceliaTile(x, y);
  if (dim === 'skyreach') return skyTile(x, y);
  return voidTile(x, y);
}
/** Where the ground is for placing things: the first solid tile below `y` in a column. */
export function dimensionFloor(dim: string, x: number): number {
  if (dim === 'mycelia') return MYC.floor(x);
  if (dim === 'void') return VOID.floor(x);
  return SKY_SEA;
}
/** Ladders in local coordinates for each dimension (the world adds the strip offset). */
export function dimensionLadders(dim: string): { x: number; top: number; bottom: number }[] {
  if (dim === 'mycelia')
    return MYC.ladders.map((x) => ({ x, top: MYC.floor(x) - 4, bottom: MYC.tunnel(x) + 30 }));
  if (dim === 'skyreach') return SKY_LADDERS;
  // The ladder stops at the top of the first solid tile row, wherever the floor falls in it.
  return VOID_LADDERS.map((l) => {
    const f = Math.min(VOID.floor(l.x - 40), VOID.floor(l.x), VOID.floor(l.x + 40));
    return { ...l, bottom: Math.ceil((f - 16) / 32) * 32 - 6 };
  });
}
