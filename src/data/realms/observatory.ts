// The Sunken Observatory (Band IV): the ruins of a star-temple sunk into the night. The air is
// thin and you fall slowly; now and then a star pulse crashes down on anyone beneath the sky.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, flatten, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const STARGLASS = 48,
  OBSERVATORY_STONE = 49;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 1000;
  // Terraced ruins in wide steps, broken by chasms you cross in long, slow leaps.
  let ground = walkable((x) => {
    const step = Math.round(fbm1(x / 700, s(1), 2) * 3) * 90;
    return 1450 - step + 12 * noise1(x / 200, s(2));
  }, 24);
  ground = flatten(ground, arrive - 240, arrive + 240);
  ground = flatten(ground, arena - 460, arena + 460);
  const floor = walkable(ground, 24);
  const chasms = Array.from(
    { length: 8 },
    (_, i) => 1100 + i * ((RW - 2400) / 8) + 160 * noise1(i * 2.1, s(3)),
  );
  const vault = walkable((x) => 2100 + 90 * fbm1(x / 1000, s(4)));
  const ladderXs = [0.2, 0.45, 0.7].map((f) => Math.round(RW * f));
  // Pillars of the old temple.
  const pillars = Array.from({ length: 14 }, (_, i) => 800 + i * ((RW - 1600) / 14));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const g = floor(x);
    const chasm = chasms.some((c) => Math.abs(x - c) < 110) && y > g - 10 && y < vault(x) - 130;
    if (chasm) return 0;
    for (const px of pillars)
      if (
        Math.abs(x - px) < 18 &&
        y < g &&
        y > g - 260 &&
        Math.abs(px - arena) > 520 &&
        Math.abs(px - arrive) > 300
      )
        return y > g - 250 ? OBSERVATORY_STONE : 0;
    if (y < g) return 0;
    const v = vault(x);
    if (y > v - 130 && y < v && x > 200 && x < RW - 200) return 0;
    if (ladderXs.some((lx) => Math.abs(x - lx) < 44) && y < v) return 0;
    if (y > g + 50 && fbm2(x / 170, y / 120, s(5)) > 0.64) return STARGLASS;
    return OBSERVATORY_STONE;
  };
  return {
    tile,
    surface: floor,
    floors: [floor, floor, vault],
    ladders: ladderXs.map((x) => ({ x, top: floor(x) - 4, bottom: vault(x) - 20 })),
    arrive,
    arena,
    arenaFloor: floor,
  };
}

/** Whether a star pulse is gathering (0 to 1) at a moment: every 40 s or so. */
export function starPulse(t: number, seed = 0) {
  const cycle = 40,
    phase = (t + (seed % 37)) % cycle;
  return phase > cycle - 3 ? (phase - (cycle - 3)) / 3 : 0;
}

export const OBSERVATORY: RealmTemplate = {
  id: 'observatory',
  name: 'Sunken Observatory',
  band: 4,
  note: 'A star-temple sunk into endless night. You fall slowly here; star pulses crash down on anyone under the open sky.',
  sky: 'open',
  temp: 4,
  ambient: [0.1, 0.1, 0.2],
  daylight: 0.25,
  wall: OBSERVATORY_STONE,
  hazard: {
    id: 'stars',
    name: 'Star pulses',
    text: 'Gravity is weak here. Every forty seconds a star pulse gathers over you (watch the light) and crashes down. Step aside, or stand under stone.',
    ward: 'starward',
  },
  fragment: 'observatory_fragment',
  key: 'observatory_key',
  material: 'astral_lens',
  relic: 'astrolabe',
  boss: 'the_astronomer',
  elite: 'constellation',
  music: 'observatory',
  ores: ['astral_lens', 'crystal', 'sapphire'],
  nodes: [
    ['astral_lens', 5],
    ['crystal', 4],
    ['stone', 3],
    ['sapphire', 2],
    ['void_lily', 2],
    ['opal', 1],
  ],
  nodeCount: 66,
  mobs: [
    { type: 'comet_hound', weight: 4 },
    { type: 'lens_golem', weight: 2 },
    { type: 'star_wisp', weight: 3, air: true },
    { type: 'orrery_drone', weight: 2, air: true },
    { type: 'moon_moth', weight: 3, air: true },
  ],
  mobCount: 40,
  chests: 5,
  chestLoot: [
    ['observatory_fragment', 1, 2, 0.6],
    ['gutter_fragment', 1, 1, 0.3],
    ['astral_lens', 3, 6, 0.8],
    ['fallen_star', 1, 3, 0.8],
    ['healing_draught', 2, 4, 1],
    ['starmetal_ingot', 2, 4, 0.5],
    ['life_fruit', 1, 1, 0.2],
  ],
  biome: {
    id: 'observatory',
    name: 'Sunken Observatory',
    x: 14,
    y: 0,
    color: '#3a4070',
    shade: '#8a90d0',
    temp: 4,
    note: 'A star-temple sunk into endless night.',
    resources: ['astral_lens', 'crystal', 'void_lily'],
  },
  build,
};
