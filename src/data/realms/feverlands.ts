// The Feverlands (Band IV): a steaming jungle-swamp where every living thing carries something.
// Bites bring disease, and a fever-dream makes your own record lie to you.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const FEVER_LOAM = 46,
  PLAGUE_ROCK = 47;

/** Diseases a Feverlands bite can carry, and how often one does. */
export const FEVER_BITES = ['fever', 'dysentery', 'poisoning', 'fever_dream', 'marrow_rot'];
export const FEVER_CHANCE = 0.3;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable(
    (x) => 1400 + 160 * fbm1(x / 900, s(1), 3) + 30 * noise1(x / 120, s(2)),
    14,
  );
  ground = flatten(ground, arrive - 240, arrive + 240);
  ground = flatten(ground, arena - 440, arena + 440);
  const floor = walkable(ground);
  // Root tunnels wind under the swamp.
  const roots = walkable((x) => 1950 + 100 * fbm1(x / 800, s(3)) + 30 * Math.sin(x / 130));
  const ladderXs = [0.14, 0.36, 0.58, 0.8].map((f) => Math.round(RW * f));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    if (y < g) return 0;
    const r = roots(x);
    if (y > r - 120 - 24 * Math.sin(x / 60) && y < r && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < r) return 0;
    if (y > g + 70 && fbm2(x / 160, y / 110, s(4)) > 0.66) return PLAGUE_ROCK;
    return y < g + 120 ? FEVER_LOAM : PLAGUE_ROCK;
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

export const FEVERLANDS: RealmTemplate = {
  id: 'feverlands',
  name: 'Feverlands',
  band: 4,
  note: 'A steaming swamp-jungle where every creature carries a sickness. A fever-dream makes your own record lie to you.',
  sky: 'open',
  temp: 31,
  ambient: [0.1, 0.12, 0.06],
  daylight: 0.8,
  wall: FEVER_LOAM,
  hazard: {
    id: 'fever',
    name: 'Plague bites',
    text: 'Every bite here may carry a disease, and the fever-dream scrambles what your record shows. Carry medicine, and trust the symptoms over the numbers.',
    ward: 'plagueward',
  },
  fragment: 'feverlands_fragment',
  key: 'feverlands_key',
  material: 'plague_ivory',
  relic: 'rot_mask',
  boss: 'mother_of_rot',
  elite: 'plague_knight',
  music: 'feverlands',
  ores: ['plague_ivory', 'emerald', 'gold_ore'],
  nodes: [
    ['wood', 4],
    ['plague_ivory', 5],
    ['fever_bloom', 4],
    ['herb', 3],
    ['honey', 2],
    ['emerald', 1],
    ['water', 1],
  ],
  nodeCount: 74,
  mobs: [
    { type: 'plague_rat', weight: 4 },
    { type: 'rot_toad', weight: 3 },
    { type: 'ivory_beetle', weight: 2 },
    { type: 'bog_shaman', weight: 2 },
    { type: 'fever_mosquito', weight: 3, air: true },
  ],
  mobCount: 42,
  chests: 5,
  chestLoot: [
    ['feverlands_fragment', 1, 2, 0.6],
    ['observatory_fragment', 1, 1, 0.3],
    ['plague_ivory', 3, 6, 0.8],
    ['antibiotic', 1, 3, 0.8],
    ['fever_tonic', 1, 2, 0.6],
    ['healing_draught', 2, 4, 1],
    ['life_fruit', 1, 1, 0.2],
  ],
  biome: {
    id: 'feverlands',
    name: 'Feverlands',
    x: 13,
    y: 0,
    color: '#6a7a3a',
    shade: '#b8c870',
    temp: 31,
    note: 'A steaming swamp-jungle where everything carries a sickness.',
    resources: ['plague_ivory', 'fever_bloom', 'herb'],
  },
  build,
};
