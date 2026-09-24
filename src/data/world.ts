// World geometry: the side-view elevation profile, cave roads, biome bands, and base tiles.
import type { Biome } from '../core/types.ts';
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
export const BIOME_WIDTH = 1200;
export const FIRST_BIOME_CENTER = BIOME_WIDTH / 2;
const MAP_LABEL_Y = 610;
const CAVE_ENTRANCE_OFFSET = 420;
const CAVE_DEPTHS = [0, 210, 465, 760] as const;
export const CAVE_LEVELS = CAVE_DEPTHS.length - 1;
export const BIOME_CENTERS: Record<string, [number, number]> = Object.fromEntries(
  SIDE_ORDER.map((id, i) => [id, [FIRST_BIOME_CENTER + i * BIOME_WIDTH, MAP_LABEL_Y]]),
);
export const TILE = 32,
  WORLD_W = SIDE_ORDER.length * BIOME_WIDTH,
  WORLD_H = 1920,
  TILE_COLS = Math.ceil(WORLD_W / TILE),
  TILE_ROWS = Math.ceil(WORLD_H / TILE);

/** Solid tile kinds stored in the tile grid; 0 is open air or cave. */
export const Ground = {
  air: 0,
  soil: 1,
  stone: 2,
  sand: 3,
  mud: 4,
  frost: 5,
  redrock: 6,
} as const;

const ELEVATION: Record<string, number> = {
  coast: 690,
  marsh: 665,
  forest: 625,
  meadow: 635,
  taiga: 600,
  tundra: 575,
  alpine: 490,
  desert: 635,
  badlands: 585,
};
export function surfaceAt(x: number): number {
  x = Math.max(0, Math.min(WORLD_W, x));
  const i = Math.max(
    0,
    Math.min(SIDE_ORDER.length - 2, Math.floor((x - FIRST_BIOME_CENTER) / BIOME_WIDTH)),
  );
  const x0 = FIRST_BIOME_CENTER + i * BIOME_WIDTH,
    t = Math.max(0, Math.min(1, (x - x0) / BIOME_WIDTH));
  const smooth = t * t * (3 - 2 * t);
  const base = ELEVATION[SIDE_ORDER[i]] * (1 - smooth) + ELEVATION[SIDE_ORDER[i + 1]] * smooth;
  return base + Math.sin(x / 145) * 20 + Math.sin(x / 53) * 8 + Math.sin(x / 370) * 14;
}
export const ENTRANCES = SIDE_ORDER.map(
  (_, i) => FIRST_BIOME_CENTER + CAVE_ENTRANCE_OFFSET + i * BIOME_WIDTH,
);
export function caveY(x: number, level: number): number {
  return surfaceAt(x) + CAVE_DEPTHS[level] + Math.sin(x / (125 + level * 45)) * (22 + level * 11);
}
export function caveAt(x: number, y: number): boolean {
  const surface = surfaceAt(x);
  if (
    ENTRANCES.some((entrance) => Math.abs(x - entrance) < 47) &&
    y >= surface &&
    y < caveY(x, CAVE_LEVELS) + 50
  )
    return true;
  if (y < surface + 70) return false;
  for (let level = 1; level <= CAVE_LEVELS; level++) {
    const width = 42 + level * 8 + Math.sin(x / 79 + level) * 10;
    if (Math.abs(y - caveY(x, level)) < width) return true;
  }
  return false;
}
export function biomeAt(x: number, y: number): Biome {
  const warped = x + 72 * Math.sin(y / 235) + 38 * Math.sin((x + y) / 115);
  const index = Math.max(
    0,
    Math.min(SIDE_ORDER.length - 1, Math.round((warped - FIRST_BIOME_CENTER) / BIOME_WIDTH)),
  );
  return BIOMES.find((b) => b.id === SIDE_ORDER[index])!;
}
export function baseTileAt(tx: number, ty: number): number {
  const x = tx * TILE + TILE / 2,
    y = ty * TILE + TILE / 2,
    surface = surfaceAt(x);
  if (y < surface || caveAt(x, y)) return Ground.air;
  const biome = biomeAt(x, y).id;
  if (y < surface + 76)
    return biome === 'desert'
      ? Ground.sand
      : biome === 'marsh' || biome === 'coast'
        ? Ground.mud
        : biome === 'tundra'
          ? Ground.frost
          : biome === 'badlands'
            ? Ground.redrock
            : Ground.soil;
  if (biome === 'tundra' && y < surface + 270) return Ground.frost;
  if (biome === 'badlands' && y > surface + 350) return Ground.redrock;
  return Ground.stone;
}
