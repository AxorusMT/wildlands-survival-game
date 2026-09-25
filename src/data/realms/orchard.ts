// The Drowned Orchard (Band I): a sunken fruit country under a restless tide. The low ground
// floods and drains every few minutes; crabs and the drowned work the shallows.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

/** Ground kinds out here (see art.ts GROUND for their look). */
export const BRINESOIL = 30;

/** The tide's level at a moment: the realm's middle ground floods at high water. */
export function tideLevel(geo: { tideMid: number }, t: number) {
  const phase = (t / 150) * Math.PI * 2;
  return geo.tideMid + Math.sin(phase) * 70 + Math.sin(phase * 2.7) * 12;
}

export interface OrchardGeometry extends RealmGeometry {
  tideMid: number;
}

function build(seed: number): OrchardGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  let ground = walkable(
    (x) =>
      1500 +
      150 * fbm1(x / 900, s(1)) +
      40 * noise1(x / 210, s(2)) +
      // Sunken basins where the tide pools.
      110 * Math.max(0, noise1(x / 700, s(3)) - 0.3),
  );
  ground = flatten(ground, arrive - 240, arrive + 240, 1440);
  ground = flatten(ground, arena - 420, arena + 420, 1420);
  const floor = walkable(ground);
  // The tide rises to about the middle of the land.
  let sum = 0;
  for (let x = 0; x < RW; x += 64) sum += floor(x);
  const tideMid = sum / Math.ceil(RW / 64) + 30;
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    if (y < g) return 0;
    // Hollow pockets below, some flooded with roots.
    if (y > g + 180 && y < 3400 && fbm2(x / 220, y / 160, s(4)) > 0.7) return 0;
    if (y < g + 90) return BRINESOIL;
    return y > g + 90 + 30 * noise1(x / 120, s(5)) ? 2 : BRINESOIL;
  };
  return {
    tile,
    surface: floor,
    floors: [floor],
    ladders: [],
    arrive,
    arena,
    arenaFloor: floor,
    tideMid,
  };
}

export const ORCHARD: RealmTemplate = {
  id: 'orchard',
  name: 'Drowned Orchard',
  band: 1,
  note: 'A sunken fruit country under a restless tide. The low ground floods and drains; brinewood grows in the shallows.',
  sky: 'open',
  temp: 17,
  ambient: [0.06, 0.08, 0.1],
  daylight: 1,
  wall: BRINESOIL,
  hazard: {
    id: 'tide',
    name: 'Rising tide',
    text: 'The water rises and falls every few minutes. Below it you wade slowly, soak, and chill.',
    ward: 'swim',
  },
  fragment: 'orchard_fragment',
  key: 'orchard_key',
  material: 'brinewood',
  relic: 'tide_conch',
  boss: 'orchard_mother',
  elite: 'orchard_warden',
  music: 'orchard',
  ores: ['iron_ore', 'silver_ore'],
  nodes: [
    ['brinewood', 6],
    ['bog_apple', 4],
    ['reeds', 3],
    ['clay', 2],
    ['herb', 2],
    ['iron_ore', 1],
    ['silver_ore', 1],
    ['water', 1],
    ['opal', 1],
  ],
  nodeCount: 70,
  mobs: [
    { type: 'bog_crab', weight: 4 },
    { type: 'drowned', weight: 3 },
    { type: 'rotfruit_slime', weight: 3 },
    { type: 'orchard_wasp', weight: 2, air: true },
  ],
  mobCount: 34,
  chests: 4,
  chestLoot: [
    ['orchard_fragment', 1, 2, 0.6],
    ['steppe_fragment', 1, 1, 0.3],
    ['tide_pearl', 1, 3, 0.8],
    ['healing_draught', 1, 3, 1],
    ['silver_ingot', 2, 5, 0.5],
    ['life_crystal', 1, 1, 0.15],
  ],
  biome: {
    id: 'orchard',
    name: 'Drowned Orchard',
    x: 5,
    y: 0,
    color: '#4a7a70',
    shade: '#8ac0a8',
    temp: 17,
    note: 'A sunken fruit country under a restless tide.',
    resources: ['brinewood', 'bog_apple', 'reeds', 'clay', 'herb'],
  },
  build,
};
