// The Mycelial Deep in template form (Band III: its myconite is eighth-tier metal). The Deep beyond the Rift Gate is this realm at seed
// 0; a Waystone and a key regrow it from any other seed, with its spores, its creatures, and the
// Sporemother in her Heart Hollow, at whatever tier you dare.
import { DIM_WIDTH, myceliaGeometry } from '../dimensions.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

/** Whether a spore bloom is in the air at a moment (every minute, for twelve seconds). */
export function sporeBloom(t: number, seed = 0) {
  const cycle = 60,
    phase = (t + (seed % 59)) % cycle;
  return phase > cycle - 12 ? Math.min(1, (phase - (cycle - 12)) / 3, (cycle - phase) / 3) : 0;
}

function build(seed: number): RealmGeometry {
  const m = myceliaGeometry(seed || 1),
    arena = Math.round((m.hollow.x0 + m.hollow.x1) / 2);
  return {
    tile: (x, y) => (x < 64 || x > DIM_WIDTH - 64 ? 27 : m.tile(x, y)),
    surface: () => 0,
    floors: [m.floor, m.floor, m.tunnel],
    ladders: m.ladders.map((x) => ({ x, top: m.floor(x) - 4, bottom: m.tunnel(x) + 30 })),
    arrive: 520,
    arena,
    arenaFloor: () => m.hollow.bottom,
  };
}

export const MYCELIAL: RealmTemplate = {
  id: 'mycelial',
  name: 'Mycelial Deep',
  band: 3,
  note: 'The Mycelial Deep, regrown from a new seed for every expedition. Spore blooms fill the air every minute; the Sporemother waits in the Heart Hollow.',
  sky: 'cavern',
  temp: 19,
  ambient: [0.08, 0.16, 0.15],
  daylight: 0,
  wall: 20,
  hazard: {
    id: 'spores',
    name: 'Spore blooms',
    text: 'Every minute the fungus blooms and the air fills with spores that sting and settle in the lungs. A respirator keeps them out.',
    ward: 'breath',
  },
  fragment: 'mycelial_fragment',
  key: 'mycelial_key',
  material: 'myconite_ore',
  relic: 'mycelial_charm',
  boss: 'sporemother',
  elite: 'spore_titan',
  music: 'mycelia',
  ores: ['myconite_ore', 'crystal'],
  nodes: [
    ['glowcap', 5],
    ['mushroom', 3],
    ['myconite_ore', 4],
    ['shroom_wood', 3],
    ['crystal', 2],
    ['emerald', 1],
  ],
  nodeCount: 70,
  mobs: [
    { type: 'shroomling', weight: 4 },
    { type: 'spore_slime', weight: 3 },
    { type: 'mycelid', weight: 2 },
    { type: 'spore_bat', weight: 3, air: true },
  ],
  mobCount: 38,
  chests: 4,
  chestLoot: [
    ['mycelial_fragment', 1, 2, 0.6],
    ['barrow_fragment', 1, 1, 0.3],
    ['myconite_ore', 4, 8, 0.8],
    ['lungwort_tea', 1, 2, 0.6],
    ['healing_draught', 2, 3, 1],
    ['life_crystal', 1, 1, 0.2],
  ],
  biome: {
    id: 'mycelia',
    name: 'Mycelial Deep',
    x: 3,
    y: 0,
    color: '#3a6a64',
    shade: '#58c8b8',
    temp: 19,
    note: 'A cavern world lit by fungus.',
    resources: ['glowcap', 'mushroom', 'myconite_ore', 'shroom_wood'],
  },
  build,
};
