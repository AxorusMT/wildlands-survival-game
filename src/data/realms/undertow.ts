// The Undertow (Band V): a drowned abyss. The whole realm lies under the sea; you swim, you
// breathe what you carry down with you, and diving bells are the only air.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const ABYSS_SAND = 52,
  PEARL_ROCK = 53;

export interface UndertowGeometry extends RealmGeometry {
  /** The sea's surface: everything below it is water. */
  sea: number;
}

/** Seconds of air a full breath holds, and how fast it returns in a bell. */
export const AIR_SECONDS = 40;

function build(seed: number): UndertowGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable((x) => {
    const trench = Math.max(0, noise1(x / 600, s(1)) - 0.3) * 700;
    return 1600 + trench + 120 * fbm1(x / 900, s(2));
  }, 20);
  ground = flatten(ground, arrive - 240, arrive + 240, 1500);
  ground = flatten(ground, arena - 460, arena + 460, 1700);
  const floor = walkable(ground, 20);
  const caves = walkable((x) => 2450 + 90 * fbm1(x / 1000, s(3)));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    // Reef arches rise from the seabed.
    if (y < g) {
      const reef = fbm2(x / 90, y / 140, s(4));
      return reef > 0.78 && y > g - 260 && Math.abs(x - arrive) > 300 && Math.abs(x - arena) > 520
        ? PEARL_ROCK
        : 0;
    }
    const c = caves(x);
    if (y > c - 140 && y < c && x > 200 && x < RW - 200) return 0;
    if (y < g + 60) return ABYSS_SAND;
    return fbm2(x / 200, y / 140, s(5)) > 0.55 ? PEARL_ROCK : ABYSS_SAND;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, caves],
    ladders: [],
    arrive,
    arena,
    arenaFloor: floor,
    sea: 700,
  };
}

export const UNDERTOW: RealmTemplate = {
  id: 'undertow',
  name: 'The Undertow',
  band: 5,
  note: 'A drowned abyss. All of it lies under the sea: swim, count your breath, and make for the diving bells.',
  sky: 'open',
  temp: 4,
  ambient: [0.04, 0.1, 0.16],
  daylight: 0.3,
  wall: ABYSS_SAND,
  hazard: {
    id: 'pressure',
    name: 'Drowning deep',
    text: 'The realm is underwater. Your breath lasts forty seconds; diving bells refill it. A respirator slows the drain; leviathan scale lets you breathe the sea.',
    ward: 'gills',
  },
  fragment: 'undertow_fragment',
  key: 'undertow_key',
  material: 'abyssal_pearl',
  relic: 'leviathan_scale',
  boss: 'the_leviathan',
  elite: 'abyssal_titan',
  music: 'undertow',
  ores: ['abyssal_pearl', 'salt', 'sapphire'],
  nodes: [
    ['abyssal_pearl', 5],
    ['salt', 3],
    ['reeds', 3],
    ['clay', 2],
    ['sapphire', 1],
    ['opal', 1],
  ],
  nodeCount: 64,
  mobs: [
    { type: 'razor_eel', weight: 3 },
    { type: 'pearl_crab', weight: 3 },
    { type: 'drowned_diver', weight: 2 },
    { type: 'abyss_angler', weight: 3, air: true },
    { type: 'jelly_bell', weight: 3, air: true },
  ],
  mobCount: 40,
  chests: 5,
  chestLoot: [
    ['undertow_fragment', 1, 2, 0.6],
    ['emberheart_fragment', 1, 1, 0.3],
    ['abyssal_pearl', 3, 6, 0.8],
    ['respirator', 1, 1, 0.2],
    ['healing_draught', 3, 5, 1],
    ['voidsteel_ingot', 1, 3, 0.4],
    ['life_fruit', 1, 1, 0.25],
  ],
  biome: {
    id: 'undertow',
    name: 'The Undertow',
    x: 16,
    y: 0,
    color: '#1a4a6a',
    shade: '#5a9ac0',
    temp: 4,
    note: 'A drowned abyss.',
    resources: ['abyssal_pearl', 'salt', 'reeds'],
  },
  build,
  extra(geo, ctx) {
    // Diving bells: the only air in the realm.
    for (let lx = 900; lx < RW - 500; lx += 700 + Math.floor(ctx.rng() * 300)) {
      const x = ctx.x0 + lx;
      ctx.furnish('diving_bell', x, ctx.floorAt(x, geo.floors[0](lx) - 30));
    }
  },
};
