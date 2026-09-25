// The Glasswood (Band II): a forest grown from crystal. Prism spires stand among the trees, the
// canopy rings in the wind, and now and then it sheds: shards fall like rain on anyone below.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const GLASSLOAM = 36,
  PRISMROCK = 37;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable((x) => 1350 + 180 * fbm1(x / 1400, s(1)) + 40 * noise1(x / 240, s(2)), 12);
  ground = flatten(ground, arrive - 240, arrive + 240);
  ground = flatten(ground, arena - 440, arena + 440);
  const floor = walkable(ground);
  // A refracting hollow runs beneath the wood, lit by its own prisms.
  const hollow = walkable((x) => 1980 + 110 * fbm1(x / 1100, s(3)) + 24 * Math.sin(x / 190));
  // Prism spires: tall, thin shards standing out of the ground.
  const spires = Array.from({ length: 22 }, (_, i) => {
    const x = 700 + i * ((RW - 1400) / 22) + 180 * noise1(i * 2.3, s(4));
    return {
      x,
      w: 30 + 26 * Math.abs(noise1(i * 1.9, s(5))),
      h: 180 + 260 * Math.abs(noise1(i * 1.3, s(6))),
    };
  }).filter((sp) => Math.abs(sp.x - arrive) > 320 && Math.abs(sp.x - arena) > 560);
  const ladderXs = [0.16, 0.4, 0.63, 0.86].map((f) => Math.round(RW * f));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    for (const sp of spires) {
      const dx = Math.abs(x - sp.x),
        top = floor(sp.x) - sp.h;
      // A spire narrows to a point; you can walk around it only by climbing over.
      if (y > top && y < floor(sp.x) + 10 && dx < sp.w * (1 - (floor(sp.x) - y) / (sp.h * 1.15)))
        return PRISMROCK;
    }
    if (y < g) return 0;
    const h = hollow(x);
    if (y > h - 120 - 16 * Math.sin(x / 80) && y < h && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < h) return 0;
    if (y > g + 60 && fbm2(x / 190, y / 130, s(7)) > 0.68) return PRISMROCK;
    return y < g + 90 ? GLASSLOAM : fbm2(x / 400, y / 300, s(8)) > 0.2 ? PRISMROCK : GLASSLOAM;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, hollow],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: hollow(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
  };
}

export const GLASSWOOD: RealmTemplate = {
  id: 'glasswood',
  name: 'Glasswood',
  band: 2,
  note: 'A forest of crystal. Prism spires refract the light; the canopy sheds shards that cut anyone caught beneath.',
  sky: 'open',
  temp: 14,
  ambient: [0.1, 0.1, 0.16],
  daylight: 1,
  wall: GLASSLOAM,
  hazard: {
    id: 'shards',
    name: 'Shardfall',
    text: 'The canopy sheds glass every half minute or so. A glint gives a moment’s warning; shards cut deep and can start bleeding.',
    ward: 'shardward',
  },
  fragment: 'glasswood_fragment',
  key: 'glasswood_key',
  material: 'prism_glass',
  relic: 'lumen_antler',
  boss: 'lumen_stag',
  elite: 'crystal_warden',
  music: 'glasswood',
  ores: ['prism_glass', 'crystal', 'sapphire'],
  nodes: [
    ['wood', 5],
    ['prism_glass', 5],
    ['lumen_moss', 4],
    ['crystal', 3],
    ['sapphire', 1],
    ['herb', 2],
    ['stone', 2],
    ['opal', 1],
  ],
  nodeCount: 76,
  mobs: [
    { type: 'shard_crawler', weight: 4 },
    { type: 'glass_golem', weight: 2 },
    { type: 'glassling', weight: 3 },
    { type: 'prism_moth', weight: 3, air: true },
    { type: 'lumen_wisp', weight: 2, air: true },
  ],
  mobCount: 38,
  chests: 4,
  chestLoot: [
    ['glasswood_fragment', 1, 2, 0.6],
    ['marches_fragment', 1, 1, 0.3],
    ['prism_glass', 3, 6, 0.8],
    ['healing_draught', 2, 3, 1],
    ['hellstone_ingot', 2, 4, 0.4],
    ['sapphire', 1, 3, 0.5],
    ['life_crystal', 1, 1, 0.2],
  ],
  biome: {
    id: 'glasswood',
    name: 'Glasswood',
    x: 8,
    y: 0,
    color: '#8ab8c8',
    shade: '#d0e8f0',
    temp: 14,
    note: 'A forest of crystal that rings in the wind.',
    resources: ['prism_glass', 'lumen_moss', 'crystal', 'wood'],
  },
  build,
};
