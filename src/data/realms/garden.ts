// The Garden of Lost Seasons (Band V): a walled garden where the year turns every few minutes.
// Spring rain, summer blaze, autumn rot, and a winter that bites to the bone, again and again.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const BLOOM_LOAM = 56,
  SEASONSTONE = 57;

export const SEASONS = [
  { id: 'spring', name: 'Spring', temp: 0, rot: 1, color: '#8ad070' },
  { id: 'summer', name: 'Summer', temp: 22, rot: 1.8, color: '#f0c850' },
  { id: 'autumn', name: 'Autumn', temp: -4, rot: 2.4, color: '#d8703a' },
  { id: 'winter', name: 'Winter', temp: -32, rot: 0.2, color: '#bfe0ff' },
] as const;
/** Seconds each season lasts. */
export const SEASON_SECONDS = 150;
export const seasonAt = (t: number, seed = 0) =>
  SEASONS[Math.floor((t + (seed % 101)) / SEASON_SECONDS) % 4];

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable(
    (x) => 1420 + 140 * fbm1(x / 1100, s(1), 3) + 24 * noise1(x / 150, s(2)),
    12,
  );
  ground = flatten(ground, arrive - 240, arrive + 240);
  ground = flatten(ground, arena - 480, arena + 480);
  const floor = walkable(ground);
  const roots = walkable((x) => 1980 + 90 * fbm1(x / 900, s(3)) + 20 * Math.sin(x / 150));
  const ladderXs = [0.17, 0.4, 0.62, 0.84].map((f) => Math.round(RW * f));
  // Old garden walls: low, broken ruins of seasonstone.
  const walls = Array.from(
    { length: 12 },
    (_, i) => 900 + i * ((RW - 1800) / 12) + 100 * noise1(i, s(4)),
  );
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    for (const wx of walls)
      if (
        Math.abs(x - wx) < 40 &&
        y < g &&
        y > g - 70 &&
        Math.abs(wx - arena) > 560 &&
        Math.abs(wx - arrive) > 300
      )
        return SEASONSTONE;
    if (y < g) return 0;
    const r = roots(x);
    if (y > r - 120 && y < r && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < r) return 0;
    if (y < g + 80) return BLOOM_LOAM;
    return fbm2(x / 190, y / 130, s(5)) > 0.5 ? SEASONSTONE : BLOOM_LOAM;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, roots],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: roots(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
  };
}

export const GARDEN: RealmTemplate = {
  id: 'garden',
  name: 'Garden of Lost Seasons',
  band: 5,
  note: 'A walled garden where the year turns every few minutes: rain, blaze, rot, and killing frost, over and over.',
  sky: 'open',
  temp: 14,
  ambient: [0.1, 0.12, 0.08],
  daylight: 1,
  wall: BLOOM_LOAM,
  hazard: {
    id: 'seasons',
    name: 'The turning year',
    text: 'The season changes every two and a half minutes. Summer scorches, autumn rots food fast, and winter freezes. Dress for all four, or for none.',
    ward: 'seasonward',
  },
  fragment: 'garden_fragment',
  key: 'garden_key',
  material: 'seasonbloom',
  relic: 'seasons_seed',
  boss: 'four_faced_warden',
  elite: 'harvest_lord',
  music: 'garden',
  ores: ['seasonbloom', 'emerald', 'gold_ore'],
  nodes: [
    ['wood', 4],
    ['seasonbloom', 5],
    ['berry', 3],
    ['herb', 3],
    ['wheat', 2],
    ['emerald', 1],
    ['honey', 1],
  ],
  nodeCount: 76,
  mobs: [
    { type: 'thorn_stag', weight: 3 },
    { type: 'bramble_golem', weight: 2 },
    { type: 'season_wolf', weight: 4 },
    { type: 'bloom_sprite', weight: 2, air: true },
    { type: 'petal_moth', weight: 3, air: true },
  ],
  mobCount: 42,
  chests: 5,
  chestLoot: [
    ['garden_fragment', 1, 2, 0.6],
    ['undertow_fragment', 1, 1, 0.3],
    ['seasonbloom', 3, 6, 0.8],
    ['hearty_stew', 1, 3, 0.6],
    ['healing_draught', 3, 5, 1],
    ['voidsteel_ingot', 1, 3, 0.4],
    ['life_fruit', 1, 1, 0.25],
  ],
  biome: {
    id: 'garden',
    name: 'Garden of Lost Seasons',
    x: 18,
    y: 0,
    color: '#5a8a4a',
    shade: '#c8e0a0',
    temp: 14,
    note: 'A walled garden where the year turns every few minutes.',
    resources: ['seasonbloom', 'berry', 'herb'],
  },
  build,
};
