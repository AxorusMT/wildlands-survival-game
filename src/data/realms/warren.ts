// The Hollow Warren (Band I): a realm that is all burrow. Three tunnels wind through amber-veined
// earth, joined by chambers and ladders; the roof groans, and now and then it falls.
import { fbm1, fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const WARREN_EARTH = 33,
  AMBERSTONE = 34;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 950;
  const lane = (base: number, k: number) =>
    walkable((x) => base + 170 * fbm1(x / 1300, s(k)) + 30 * noise1(x / 260, s(k + 1)));
  // Floors of the three tunnels, top to bottom.
  const upper = lane(1150, 1),
    main = lane(1700, 3),
    lower = lane(2300, 5);
  const HALF = [95, 120, 95];
  const hall = { x0: RW - 1700, x1: RW - 260, top: 1450, bottom: main(RW - 950) };
  const chambers = Array.from({ length: 8 }, (_, i) => {
    const x = 900 + i * 1000 + 200 * noise1(i * 3.1, s(7));
    return { x, r: 150 + 60 * Math.abs(noise1(i * 1.7, s(8))) };
  });
  const ladderXs = chambers.map((c) => Math.round(c.x));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const floors = [upper(x), main(x), lower(x)];
    let open = floors.some((f, i) => y < f && y > f - HALF[i] * 2 + 20 * Math.sin(x / 70 + i));
    if (!open)
      for (const c of chambers) {
        const dx = (x - c.x) / (c.r * 1.3),
          dy = (y - (main(c.x) - 90)) / c.r;
        if (dx * dx + dy * dy < 1 && y < main(c.x)) open = true;
      }
    if (!open && x > hall.x0 && x < hall.x1 && y > hall.top && y < main(x))
      open = y > hall.top + 90 * Math.abs(Math.sin((x - hall.x0) / 520));
    if (!open)
      for (const lx of ladderXs)
        if (Math.abs(x - lx) < 44 && y > upper(lx) - 60 && y < lower(lx)) open = true;
    if (open) return 0;
    if (fbm2(x / 160, y / 110, s(9)) > 0.7) return AMBERSTONE;
    return WARREN_EARTH;
  };
  return {
    tile,
    surface: () => 0,
    floors: [main, upper, lower],
    ladders: ladderXs.map((x) => ({ x, top: upper(x) - 4, bottom: lower(x) - 20 })),
    arrive,
    arena,
    arenaFloor: main,
  };
}

export const WARREN: RealmTemplate = {
  id: 'warren',
  name: 'Hollow Warren',
  band: 1,
  note: 'A realm that is all burrow: three tunnels through amber-veined earth. The roof groans, and sometimes it falls.',
  sky: 'cavern',
  temp: 14,
  ambient: [0.1, 0.07, 0.03],
  daylight: 0,
  wall: WARREN_EARTH,
  hazard: {
    id: 'cavein',
    name: 'Cave-ins',
    text: 'The roof collapses without warning: dust trickles, then rock falls. Keep moving.',
    ward: 'tremor',
  },
  fragment: 'warren_fragment',
  key: 'warren_key',
  material: 'burrow_amber',
  relic: 'queens_mandible',
  boss: 'warren_queen',
  elite: 'amber_colossus',
  music: 'warren',
  ores: ['burrow_amber', 'gold_ore', 'ruby'],
  nodes: [
    ['burrow_amber', 5],
    ['mushroom', 3],
    ['gold_ore', 2],
    ['iron_ore', 2],
    ['ruby', 1],
    ['emerald', 1],
    ['clay', 1],
  ],
  nodeCount: 66,
  mobs: [
    { type: 'warren_rat', weight: 5 },
    { type: 'amber_beetle', weight: 3 },
    { type: 'mole_guard', weight: 2 },
    { type: 'burrower', weight: 2, air: true },
  ],
  mobCount: 38,
  chests: 5,
  chestLoot: [
    ['warren_fragment', 1, 2, 0.6],
    ['orchard_fragment', 1, 1, 0.3],
    ['burrow_amber', 3, 6, 0.8],
    ['healing_draught', 1, 3, 1],
    ['gold_ingot', 2, 4, 0.5],
    ['miners_lamp', 1, 1, 0.1],
    ['life_crystal', 1, 1, 0.2],
  ],
  biome: {
    id: 'warren',
    name: 'Hollow Warren',
    x: 7,
    y: 0,
    color: '#6a5030',
    shade: '#c8903a',
    temp: 14,
    note: 'A realm that is all burrow.',
    resources: ['burrow_amber', 'mushroom', 'gold_ore', 'iron_ore'],
  },
  build,
};
