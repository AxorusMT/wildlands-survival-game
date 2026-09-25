// World geometry: the side-view elevation profile, the depth layers, caves and shafts, lava,
// biome bands, and base tiles. Everything here is a pure function of position, so the renderer,
// the simulation, and saves all agree on the same world without storing it.
import type { Biome } from '../core/types.ts';
import { fbm1, fbm2, noise1 } from '../core/noise.ts';
import { BIOMES } from './biomes.ts';

export const SIDE_ORDER = [
  'coast',
  'marsh',
  'forest',
  'meadow',
  'taiga',
  'tundra',
  'alpine',
  'desert',
  'badlands',
];
/** Width in pixels of each region, west to east. */
const BIOME_WIDTHS: Record<string, number> = {
  coast: 2800,
  marsh: 3000,
  forest: 3800,
  meadow: 3200,
  taiga: 3400,
  tundra: 3000,
  alpine: 3600,
  desert: 3800,
  badlands: 3400,
};
export interface BiomeSpan {
  id: string;
  start: number;
  end: number;
  center: number;
}
export const BIOME_SPANS: BiomeSpan[] = (() => {
  let at = 0;
  return SIDE_ORDER.map((id) => {
    const start = at;
    at += BIOME_WIDTHS[id];
    return { id, start, end: at, center: (start + at) / 2 };
  });
})();
const MAP_LABEL_Y = 610;
export const BIOME_CENTERS: Record<string, [number, number]> = Object.fromEntries(
  BIOME_SPANS.map((s) => [s.id, [s.center, MAP_LABEL_Y]]),
);
export const TILE = 32,
  WORLD_W = BIOME_SPANS[BIOME_SPANS.length - 1].end,
  WORLD_H = 4480,
  TILE_COLS = Math.ceil(WORLD_W / TILE),
  TILE_ROWS = Math.ceil(WORLD_H / TILE);

/** Solid tile kinds stored in the tile grid; 0 is open air, cave, or lava. */
export const Ground = {
  air: 0,
  soil: 1,
  stone: 2,
  sand: 3,
  mud: 4,
  frost: 5,
  redrock: 6,
  deepstone: 8,
  ash: 9,
  hellrock: 10,
} as const;
/** Pickaxe tier needed to break each ground kind. */
export const MINE_TIER: Record<number, number> = {
  1: 0,
  2: 1,
  3: 0,
  4: 0,
  5: 2,
  6: 4,
  8: 3,
  9: 4,
  10: 5,
};
/** What each ground kind yields, and an occasional bonus find. */
export const TILE_YIELD: Record<number, { item: string; bonus?: [string, number] }> = {
  1: { item: 'dirt' },
  2: { item: 'stone' },
  3: { item: 'dirt' },
  4: { item: 'clay' },
  5: { item: 'ice' },
  6: { item: 'stone', bonus: ['obsidian', 0.22] },
  8: { item: 'stone', bonus: ['coal', 0.12] },
  9: { item: 'stone', bonus: ['sulfur', 0.3] },
  10: { item: 'stone', bonus: ['hellstone', 0.14] },
};

// ─── Depth layers ─────────────────────────────────────────────────────────────
export interface Layer {
  id: string;
  name: string;
  /** Top of the layer in world y (the surface layer starts at the sky). */
  top: number;
  /** Ambient temperature underground, in °C. */
  temp: number;
}
/** How far below the ground the surface layer reaches. */
export const SURFACE_BAND = 140;
export const LAYERS: Layer[] = [
  { id: 'surface', name: 'Surface', top: 0, temp: 0 },
  { id: 'upper_mines', name: 'Upper Mines', top: 0, temp: 11 },
  { id: 'lower_mines', name: 'Lower Mines', top: 1750, temp: 19 },
  { id: 'upper_hell', name: 'Upper Hell', top: 2750, temp: 46 },
  { id: 'lower_hell', name: 'Lower Hell', top: 3600, temp: 68 },
];
export function layerAt(x: number, y: number): Layer {
  if (y < surfaceAt(x) + SURFACE_BAND) return LAYERS[0];
  for (let i = LAYERS.length - 1; i > 1; i--) if (y >= LAYERS[i].top) return LAYERS[i];
  return LAYERS[1];
}

// ─── Surface profile ──────────────────────────────────────────────────────────
// Each region has its own character, written as world y (smaller is higher).
const PROFILES: Record<string, (x: number) => number> = {
  // Low dunes that slope down to the sea at the western edge.
  coast: (x) => 688 + 12 * fbm1(x / 260, 1) + Math.max(0, 700 - x) * 0.09,
  // Nearly flat wetland.
  marsh: (x) => 676 + 6 * noise1(x / 330, 2) + 3 * noise1(x / 90, 3),
  // Rolling wooded hills.
  forest: (x) => 612 + 62 * fbm1(x / 560, 4) + 10 * noise1(x / 140, 5),
  // Gentle, open grassland.
  meadow: (x) => 632 + 26 * noise1(x / 480, 6) + 7 * noise1(x / 140, 7),
  // Hilly conifer country.
  taiga: (x) => 580 + 88 * fbm1(x / 640, 8) + 18 * noise1(x / 170, 9),
  // Wide frozen plains broken by the odd pressure ridge.
  tundra: (x) => 566 + 8 * noise1(x / 420, 10) - 44 * Math.max(0, noise1(x / 380, 11) - 0.55) * 2.2,
  // Sharp mountain peaks.
  alpine: (x) => {
    const ridge = 1 - Math.abs(fbm1(x / 820, 12, 2));
    return 560 - 330 * ridge ** 1.6 - 40 * (1 - Math.abs(noise1(x / 260, 13)));
  },
  // Long sand dunes.
  desert: (x) => 642 + 34 * noise1(x / 340, 14) + 12 * Math.abs(noise1(x / 120, 15)),
  // Terraced mesas; the slope limit turns their steps into cliffs with scree.
  badlands: (x) => {
    const t = fbm1(x / 620, 16, 2) * 3.2;
    const step = Math.round(t),
      edge = Math.max(-0.5, Math.min(0.5, (t - step) * 3));
    return 604 - (step + edge) * 62;
  },
};
/** Features where two regions meet: [west id, depth (+ is lower), half-width]. */
const BORDER_FEATURES: [string, number, number][] = [
  ['coast', 18, 260], // a shallow lagoon basin into the marsh
  ['marsh', 62, 170], // a river valley below the forest bluff
  ['forest', -74, 320], // a wooded ridge down to the meadow
  ['meadow', -96, 380], // foothills climbing into the taiga
  ['taiga', 52, 300], // a frozen lake basin
  ['tundra', -40, 280], // the first rise of the mountains
  ['alpine', -70, 360], // the escarpment down into the desert
  ['desert', 150, 150], // a deep canyon cut into the badlands
];
const BLEND = 380;
const SURFACE_STEP = 16;
/** Most the ground may rise per SURFACE_STEP; below one tile per column keeps slopes walkable. */
const MAX_RISE = 15;
function roughSurface(x: number) {
  let i = BIOME_SPANS.findIndex((s) => x < s.end);
  if (i < 0) i = BIOME_SPANS.length - 1;
  const span = BIOME_SPANS[i];
  let y = PROFILES[span.id](x);
  // Blend into the neighbour on whichever border is near.
  const west = i > 0 && x - span.start < BLEND,
    east = i < BIOME_SPANS.length - 1 && span.end - x < BLEND;
  if (west || east) {
    const border = west ? span.start : span.end,
      other = BIOME_SPANS[west ? i - 1 : i + 1],
      t = 0.5 + ((x - border) / BLEND) * 0.5 * (west ? 1 : -1),
      k = t * t * (3 - 2 * t);
    y = PROFILES[other.id](x) * (1 - k) + y * k;
  }
  for (const [id, depth, half] of BORDER_FEATURES) {
    const border = BIOME_SPANS.find((s) => s.id === id)!.end,
      d = (x - border) / half;
    if (Math.abs(d) < 3) y += depth * Math.exp(-d * d * 2);
  }
  return Math.max(170, Math.min(800, y));
}
const SURFACE: Float32Array = (() => {
  const n = Math.ceil(WORLD_W / SURFACE_STEP) + 1,
    h = new Float32Array(n);
  for (let i = 0; i < n; i++) h[i] = roughSurface(i * SURFACE_STEP);
  // Raise the low side of anything steeper than the limit, leaving scree below cliffs.
  for (let i = 1; i < n; i++) h[i] = Math.min(h[i], h[i - 1] + MAX_RISE);
  for (let i = n - 2; i >= 0; i--) h[i] = Math.min(h[i], h[i + 1] + MAX_RISE);
  return h;
})();
export function surfaceAt(x: number): number {
  const f = Math.max(0, Math.min(WORLD_W, x)) / SURFACE_STEP,
    i = Math.min(SURFACE.length - 2, Math.floor(f)),
    t = f - i;
  return SURFACE[i] * (1 - t) + SURFACE[i + 1] * t;
}
/** A heavily smoothed surface that the upper tunnels follow instead of every hill. */
const BASELINE: Float32Array = (() => {
  const r = Math.round(520 / SURFACE_STEP),
    out = new Float32Array(SURFACE.length);
  for (let i = 0; i < SURFACE.length; i++) {
    let sum = 0,
      n = 0;
    for (let j = Math.max(0, i - r); j <= Math.min(SURFACE.length - 1, i + r); j++) {
      sum += SURFACE[j];
      n++;
    }
    out[i] = sum / n;
  }
  return out;
})();
export function baselineAt(x: number): number {
  const i = Math.max(0, Math.min(BASELINE.length - 1, Math.round(x / SURFACE_STEP)));
  return BASELINE[i];
}

// ─── Caves ────────────────────────────────────────────────────────────────────
/** Winding tunnels: three in the upper mines, two each in the lower mines and upper hell. */
export const CAVE_LEVELS = 7;
export function caveY(x: number, level: number): number {
  if (level <= 3) {
    const depth = [0, 210, 465, 760][level];
    // Follow the smoothed land, but never rise to within a few tiles of a valley floor.
    const base = Math.max(baselineAt(x), surfaceAt(x) - 40);
    return base + depth + Math.sin(x / (125 + level * 45)) * (22 + level * 11);
  }
  const base = [0, 0, 0, 0, 2020, 2440, 2980, 3360][level];
  return base + 80 * fbm1(x / (900 + level * 40), 40 + level) + 18 * Math.sin(x / 190 + level);
}
function tunnelHalfWidth(x: number, level: number) {
  return 42 + Math.min(level, 5) * 8 + Math.sin(x / 79 + level) * 10;
}
/** The vast open underworld at the bottom of Lower Hell. */
export const underworldCeiling = (x: number) => 3790 + 70 * fbm1(x / 700, 61);
export const underworldFloor = (x: number) =>
  Math.min(4410, 4240 + 150 * fbm1(x / 1100, 67) + 36 * noise1(x / 230, 71));
/** Open underworld below this line is molten. */
export const LAVA_Y = 4262;

export interface Shaft {
  x: number;
  top: number;
  bottom: number;
}
const shaftAt = (x: number, top: number, bottom: number): Shaft => ({ x, top, bottom });
/** Surface cave mouths: two per region. */
export const ENTRANCES = BIOME_SPANS.flatMap((s) => [
  s.start + (s.end - s.start) * 0.28,
  s.start + (s.end - s.start) * 0.74,
]);
/** Where an underworld ladder can land clear of the lava, searching out from x. */
function dryLanding(x: number) {
  for (let d = 0; d < 900; d += 32)
    for (const cx of [x + d, x - d]) if (underworldFloor(cx) < LAVA_Y - 45) return cx;
  return x;
}
/** Climbable shafts with ladders that tie the layers together. */
export const SHAFTS: Shaft[] = [
  ...ENTRANCES.map((x) => shaftAt(x, surfaceAt(x) - 4, caveY(x, 3) + 40)),
  ...BIOME_SPANS.flatMap((s, i) => {
    const at = (f: number) => s.start + (s.end - s.start) * f;
    const list = [
      shaftAt(at(0.5), caveY(at(0.5), 3), caveY(at(0.5), 4) + 40),
      shaftAt(at(0.16), caveY(at(0.16), 4), caveY(at(0.16), 5) + 40),
      i % 2
        ? shaftAt(at(0.84), caveY(at(0.84), 5), caveY(at(0.84), 6) + 40)
        : shaftAt(at(0.62), caveY(at(0.62), 5), caveY(at(0.62), 6) + 40),
      shaftAt(at(0.36), caveY(at(0.36), 6), caveY(at(0.36), 7) + 40),
    ];
    if (i % 3 === 2) {
      const x = dryLanding(at(0.66));
      list.push(shaftAt(x, caveY(x, 7), underworldFloor(x) - 6));
    }
    return list;
  }),
];
const SHAFT_HALF = 47;
export function inShaft(x: number, y: number, slack = 0) {
  return SHAFTS.some(
    (s) => Math.abs(x - s.x) < SHAFT_HALF - 4 + slack && y > s.top - 12 && y < s.bottom + 58,
  );
}
function inUnderworld(x: number, y: number) {
  const ceil = underworldCeiling(x),
    floor = underworldFloor(x);
  if (y < ceil || y > floor) return false;
  // Hanging rock spires break up the ceiling without blocking the way through.
  const spire = noise1(x / 150, 73);
  if (spire > 0.55 && y < ceil + (floor - ceil) * (spire - 0.55) * 1.3) return false;
  return true;
}
function inCavern(x: number, y: number, surface: number) {
  if (y > LAYERS[3].top && y < LAYERS[4].top - 60) return fbm2(x / 300, y / 200, 83) > 0.64;
  if (y > LAYERS[2].top && y < LAYERS[3].top) return fbm2(x / 260, y / 170, 79) > 0.68;
  if (y > surface + 170) return fbm2(x / 200, y / 140, 89) > 0.74;
  return false;
}
export function caveAt(x: number, y: number): boolean {
  const surface = surfaceAt(x);
  if (
    y >= surface - 4 &&
    SHAFTS.some((s) => Math.abs(x - s.x) < SHAFT_HALF && y >= s.top && y < s.bottom + 50)
  )
    return true;
  if (y < surface + 70) return false;
  for (let level = 1; level <= CAVE_LEVELS; level++)
    if (Math.abs(y - caveY(x, level)) < tunnelHalfWidth(x, level)) return true;
  return inUnderworld(x, y) || inCavern(x, y, surface);
}
/** Molten rock: open ground in the underworld below the lava line, and upper-hell cavern pools. */
export function lavaAt(x: number, y: number): boolean {
  if (y > LAVA_Y && y < WORLD_H) return inUnderworld(x, y);
  if (y > 3470 && y < LAYERS[4].top - 60 && inCavern(x, y, 0)) {
    for (const level of [6, 7])
      if (Math.abs(y - caveY(x, level)) < tunnelHalfWidth(x, level)) return false;
    return !inShaft(x, y, 10);
  }
  return false;
}

// ─── Regions and ground ───────────────────────────────────────────────────────
function spanIndex(x: number) {
  for (let i = 0; i < BIOME_SPANS.length; i++) if (x < BIOME_SPANS[i].end) return i;
  return BIOME_SPANS.length - 1;
}
export function biomeAt(x: number, y: number): Biome {
  const warped = x + 72 * Math.sin(y / 235) + 38 * Math.sin((x + y) / 115);
  const id = BIOME_SPANS[spanIndex(Math.max(0, Math.min(WORLD_W - 1, warped)))].id;
  return BIOMES.find((b) => b.id === id)!;
}
/** The two regions to blend at x for skies and hills, and how far to lean into the second. */
export function biomeBlend(x: number, band = 520): [string, string, number] {
  const i = spanIndex(x),
    s = BIOME_SPANS[i];
  if (i > 0 && x - s.start < band) {
    const t = 0.5 + (x - s.start) / band / 2;
    return [BIOME_SPANS[i - 1].id, s.id, t * t * (3 - 2 * t)];
  }
  if (i < BIOME_SPANS.length - 1 && s.end - x < band) {
    const t = 0.5 - (s.end - x) / band / 2;
    return [s.id, BIOME_SPANS[i + 1].id, t * t * (3 - 2 * t)];
  }
  return [s.id, s.id, 0];
}
export function baseTileAt(tx: number, ty: number): number {
  const x = tx * TILE + TILE / 2,
    y = ty * TILE + TILE / 2,
    surface = surfaceAt(x);
  if (y < surface || caveAt(x, y)) return Ground.air;
  const biome = biomeAt(x, y).id,
    depth = y - surface;
  if (depth < 76)
    return biome === 'desert'
      ? Ground.sand
      : biome === 'marsh' || biome === 'coast'
        ? Ground.mud
        : biome === 'tundra'
          ? Ground.frost
          : biome === 'badlands'
            ? Ground.redrock
            : Ground.soil;
  // Layer boundaries wander a little so the strata never read as ruled lines.
  const yy = y + 46 * noise1(x / 310, 97);
  if (yy >= LAYERS[4].top) return Ground.hellrock;
  if (yy >= LAYERS[3].top) return Ground.ash;
  if (yy >= LAYERS[2].top) return Ground.deepstone;
  if (biome === 'tundra' && depth < 270) return Ground.frost;
  if (biome === 'badlands' && depth > 350) return Ground.redrock;
  return Ground.stone;
}
