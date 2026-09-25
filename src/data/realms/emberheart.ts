// Emberheart (Band V): the forge at the bottom of the world. Three great ledges climb a molten
// cavern, and the magma rises through them in slow, terrible cycles.
import { fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const HEARTSTONE = 54,
  SLAG = 55;

export interface EmberGeometry extends RealmGeometry {
  /** The lowest the magma sinks, and the highest it climbs. */
  low: number;
  high: number;
}

/** Height of the magma at a moment: low for a minute, then it climbs, holds, and sinks. */
export function magmaLevel(geo: EmberGeometry, t: number) {
  const cycle = 120,
    p = t % cycle;
  const k = p < 60 ? 0 : p < 80 ? (p - 60) / 20 : p < 100 ? 1 : 1 - (p - 100) / 20;
  return geo.low + (geo.high - geo.low) * k * k * (3 - 2 * k);
}

function build(seed: number): EmberGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 950;
  const lane = (base: number, k: number) => walkable((x) => base + 80 * noise1(x / 800, s(k)), 10);
  const high = lane(1300, 1),
    mid = lane(1800, 2),
    deep = lane(2350, 3);
  const ladderXs = Array.from({ length: 10 }, (_, i) => Math.round(700 + i * ((RW - 1400) / 10)));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const floors = [high(x), mid(x), deep(x)];
    // One great cavern: open above each ledge up to the next.
    let open = y < floors[2] && y > floors[0] - 360;
    // The ledges themselves: slabs of rock with gaps you can drop through.
    // Solid under the arrival and the arena; elsewhere broken by gaps.
    const whole = Math.abs(x - arena) < 640 || Math.abs(x - arrive) < 320;
    for (const f of [floors[0], floors[1]])
      if (y >= f && y < f + 60 && (whole || noise1(x / 260, s(4)) > -0.35)) open = false;
    for (const lx of ladderXs)
      if (Math.abs(x - lx) < 44 && y > floors[0] - 20 && y < floors[2]) open = true;
    if (open) return 0;
    return fbm2(x / 170, y / 120, s(5)) > 0.6 ? HEARTSTONE : SLAG;
  };
  return {
    tile,
    surface: () => 0,
    floors: [mid, high, deep],
    ladders: ladderXs.map((x) => ({ x, top: high(x) - 4, bottom: deep(x) - 20 })),
    arrive,
    arena,
    arenaFloor: high,
    low: 2400,
    high: 1850,
  };
}

export const EMBERHEART: RealmTemplate = {
  id: 'emberheart',
  name: 'Emberheart',
  band: 5,
  note: 'The forge at the bottom of the world. Three ledges climb a molten cavern, and every two minutes the magma rises through them.',
  sky: 'cavern',
  temp: 46,
  ambient: [0.3, 0.12, 0.05],
  daylight: 0,
  wall: SLAG,
  hazard: {
    id: 'magma',
    name: 'Rising magma',
    text: 'Every two minutes the magma climbs past the lowest ledge, holds, and sinks. Standing in it burns fast. Climb before it comes.',
    ward: 'forgeward',
  },
  fragment: 'emberheart_fragment',
  key: 'emberheart_key',
  material: 'heartstone',
  relic: 'anvil_spark',
  boss: 'anvil_god',
  elite: 'forge_colossus',
  music: 'emberheart',
  ores: ['heartstone', 'hellstone', 'obsidian'],
  nodes: [
    ['heartstone', 6],
    ['hellstone', 3],
    ['obsidian', 3],
    ['sulfur', 2],
    ['coal', 2],
    ['ruby', 1],
  ],
  nodeCount: 66,
  mobs: [
    { type: 'slag_slime', weight: 3 },
    { type: 'anvil_golem', weight: 2 },
    { type: 'hammer_knight', weight: 3 },
    { type: 'cinder_wyrm', weight: 2 },
    { type: 'forge_drake', weight: 3, air: true },
  ],
  mobCount: 42,
  chests: 5,
  chestLoot: [
    ['emberheart_fragment', 1, 2, 0.6],
    ['garden_fragment', 1, 1, 0.3],
    ['heartstone', 3, 6, 0.8],
    ['hellstone_ingot', 3, 6, 0.6],
    ['healing_draught', 3, 5, 1],
    ['fireward_potion', 1, 2, 0.6],
    ['life_fruit', 1, 1, 0.25],
  ],
  biome: {
    id: 'emberheart',
    name: 'Emberheart',
    x: 17,
    y: 0,
    color: '#8a2a1a',
    shade: '#ff8a3a',
    temp: 46,
    note: 'The forge at the bottom of the world.',
    resources: ['heartstone', 'hellstone', 'obsidian'],
  },
  build,
};
