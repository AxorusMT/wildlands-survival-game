// The Salt Flats of Oru (Band III): a dead sea turned to a white plain under a white sun. The heat
// parches and the glare lies: mirages walk the flats, and saltglass ridges hide the mines below.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const SALTCRUST = 42,
  SALTGLASS_ROCK = 43;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable((x) => {
    // Almost flat, broken by sharp saltglass ridges.
    const ridge = Math.max(0, noise1(x / 420, s(1)) - 0.45) * 520;
    return 1450 - ridge + 10 * fbm1(x / 200, s(2));
  }, 18);
  ground = flatten(ground, arrive - 240, arrive + 240, 1450);
  ground = flatten(ground, arena - 460, arena + 460, 1450);
  const floor = walkable(ground);
  // Old salt mines run below, in two galleries.
  const mine = walkable((x) => 1900 + 70 * fbm1(x / 900, s(3)) + 16 * Math.sin(x / 140));
  const deep = walkable((x) => 2350 + 90 * fbm1(x / 1100, s(4)));
  const ladderXs = [0.13, 0.33, 0.55, 0.76, 0.9].map((f) => Math.round(RW * f));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    if (y < g) return 0;
    const m = mine(x),
      d = deep(x);
    if (y > m - 110 && y < m && x > 200 && x < RW - 200) return 0;
    if (y > d - 130 - 20 * Math.sin(x / 90) && y < d && x > 300 && x < RW - 300) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < d) return 0;
    if (y < g + 40) return SALTCRUST;
    return fbm2(x / 150, y / 120, s(5)) > 0.62 || y < g + 160 - (1450 - g) * 0.3
      ? SALTGLASS_ROCK
      : SALTCRUST;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, mine, deep],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: deep(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
  };
}

export const SALTFLATS: RealmTemplate = {
  id: 'saltflats',
  name: 'Salt Flats of Oru',
  band: 3,
  note: 'A dead sea under a white sun. By day the heat parches the open flats and mirages walk among the monsters; the mines below are cooler.',
  sky: 'open',
  temp: 36,
  ambient: [0.12, 0.11, 0.1],
  daylight: 1.15,
  wall: SALTCRUST,
  hazard: {
    id: 'sun',
    name: 'The white sun',
    text: 'In daylight on the open flats you overheat and thirst three times as fast. Mirages walk among the monsters. Shelter in the mines.',
    ward: 'shade',
  },
  fragment: 'saltflats_fragment',
  key: 'saltflats_key',
  material: 'saltglass',
  relic: 'tyrant_eye',
  boss: 'mirage_tyrant',
  elite: 'salt_colossus',
  music: 'saltflats',
  ores: ['saltglass', 'salt', 'gold_ore'],
  nodes: [
    ['saltglass', 5],
    ['salt', 5],
    ['cactus_fruit', 2],
    ['sulfur', 2],
    ['gold_ore', 2],
    ['stone', 2],
    ['topaz', 1],
    ['ruby', 1],
  ],
  nodeCount: 70,
  mobs: [
    { type: 'salt_strider', weight: 3 },
    { type: 'brine_scorpion', weight: 4 },
    { type: 'sand_raptor', weight: 3 },
    { type: 'salt_wraith', weight: 2 },
    { type: 'mirage_djinn', weight: 2, air: true },
    { type: 'mirage', weight: 3 },
  ],
  mobCount: 42,
  chests: 5,
  chestLoot: [
    ['saltflats_fragment', 1, 2, 0.6],
    ['choir_fragment', 1, 1, 0.3],
    ['saltglass', 3, 6, 0.8],
    ['boiled_water', 2, 4, 1],
    ['healing_draught', 2, 4, 1],
    ['ruby', 1, 3, 0.4],
    ['life_fruit', 1, 1, 0.15],
  ],
  biome: {
    id: 'saltflats',
    name: 'Salt Flats of Oru',
    x: 11,
    y: 0,
    color: '#e8e0d0',
    shade: '#fff8e8',
    temp: 36,
    note: 'A dead sea turned to a white plain.',
    resources: ['saltglass', 'salt', 'cactus_fruit'],
  },
  build,
  extra(geo, ctx) {
    // Mirages shimmer across the open flats.
    for (let i = 0; i < 6 + ctx.tier; i++) {
      const lx = 700 + ctx.rng() * (RW - 1400),
        x = ctx.x0 + lx;
      if (Math.abs(lx - geo.arena) > 600)
        ctx.mob('mirage', x, ctx.floorAt(x, geo.floors[0](lx) - 30));
    }
  },
};
