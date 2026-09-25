// The Ashen Steppe (Band I): burnt grassland under a bruised sky, where kilns of a vanished people
// still smoulder. Ash storms roll in, choking and blinding; kilnstone lies in the tunnels below.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const ASHSOIL = 31,
  KILNROCK = 32;

/** Whether an ash storm is blowing at a moment (storms come every few minutes). */
export function ashStorm(t: number, seed = 0) {
  const cycle = 200,
    phase = (t + (seed % 97)) % cycle;
  return phase > cycle - 60 ? Math.min(1, (phase - (cycle - 60)) / 8, (cycle - phase) / 8) : 0;
}

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable((x) => {
    // Terraced mesas broken by gullies.
    const t = fbm1(x / 800, s(1), 2) * 2.4,
      step = Math.round(t),
      edge = Math.max(-0.5, Math.min(0.5, (t - step) * 3));
    return 1400 - (step + edge) * 55 + 12 * noise1(x / 150, s(2));
  });
  ground = flatten(ground, arrive - 240, arrive + 240);
  ground = flatten(ground, arena - 420, arena + 420);
  const floor = walkable(ground);
  // A kiln road runs under the steppe; ladders drop to it.
  const tunnel = walkable((x) => 1980 + 80 * fbm1(x / 1000, s(3)) + 16 * Math.sin(x / 170));
  const ladderXs = [0.14, 0.38, 0.62, 0.84].map((f) => Math.round(RW * f));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    if (y < g) return 0;
    const tt = tunnel(x);
    if (y > tt - 110 - 10 * Math.sin(x / 90) && y < tt && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < tt) return 0;
    if (y > g + 260 && y < tt - 200 && fbm2(x / 240, y / 150, s(4)) > 0.72) return 0;
    if (y < g + 70) return ASHSOIL;
    return KILNROCK;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, tunnel],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: tunnel(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
  };
}

export const STEPPE: RealmTemplate = {
  id: 'steppe',
  name: 'Ashen Steppe',
  band: 1,
  note: 'Burnt grassland where old kilns smoulder. Ash storms choke and blind; kilnstone lies along the kiln road below.',
  sky: 'open',
  temp: 24,
  ambient: [0.1, 0.07, 0.06],
  daylight: 0.85,
  wall: KILNROCK,
  hazard: {
    id: 'ash',
    name: 'Ash storms',
    text: 'Every few minutes an ash storm blinds you and drains stamina and water. Shelter underground or wear ashcloth.',
    ward: 'ashward',
  },
  fragment: 'steppe_fragment',
  key: 'steppe_key',
  material: 'kilnstone_ore',
  relic: 'kiln_heart',
  boss: 'kiln_beast',
  elite: 'steppe_warlord',
  music: 'steppe',
  ores: ['kilnstone_ore', 'coal', 'sulfur'],
  nodes: [
    ['cinderflax', 6],
    ['kilnstone_ore', 4],
    ['coal', 3],
    ['sulfur', 2],
    ['wood', 2],
    ['stone', 2],
    ['cactus_fruit', 1],
  ],
  nodeCount: 72,
  mobs: [
    { type: 'ash_hound', weight: 4 },
    { type: 'steppe_raider', weight: 3 },
    { type: 'kiln_golem', weight: 2 },
    { type: 'cinder_vulture', weight: 3, air: true },
  ],
  mobCount: 34,
  chests: 4,
  chestLoot: [
    ['steppe_fragment', 1, 2, 0.6],
    ['warren_fragment', 1, 1, 0.3],
    ['kiln_ingot', 2, 4, 0.7],
    ['healing_draught', 1, 3, 1],
    ['gold_ingot', 2, 4, 0.4],
    ['fire_arrow', 10, 25, 0.6],
    ['life_crystal', 1, 1, 0.15],
  ],
  biome: {
    id: 'steppe',
    name: 'Ashen Steppe',
    x: 6,
    y: 0,
    color: '#7a6a5a',
    shade: '#b8a088',
    temp: 24,
    note: 'Burnt grassland where old kilns smoulder.',
    resources: ['cinderflax', 'kilnstone_ore', 'coal', 'sulfur'],
  },
  build,
  extra(geo, ctx) {
    // Old kilns still smoulder along the road: campfires that never go out.
    for (const f of [0.26, 0.5, 0.74]) {
      const x = ctx.x0 + RW * f + 90;
      ctx.furnish('kiln', x, ctx.floorAt(x, geo.floors[2](x - ctx.x0) - 30));
    }
  },
};
