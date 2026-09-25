// The Gutter of Kings (Band IV): the sewers under a dead city of kings, choked with their gold.
// Vaults are everywhere and the loot is rich, but the gold is cursed: take it and it takes you.
import { fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, seedOf, walkable } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const SEWER_BRICK = 50,
  CROWN_ROCK = 51;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 950;
  const lane = (base: number, k: number) => walkable((x) => base + 60 * noise1(x / 900, s(k)), 8);
  const upper = lane(1200, 1),
    main = lane(1720, 2),
    lower = lane(2260, 3);
  const HEIGHT = [150, 200, 160];
  const hall = { x0: RW - 1700, x1: RW - 260, top: 1400 };
  // Vault rooms off the sewer, half-full of gold.
  const vaults = Array.from({ length: 10 }, (_, i) => ({
    x: 900 + i * ((RW - 2600) / 10) + 120 * noise1(i * 1.9, s(4)),
    floor: i % 2 ? upper : lower,
  }));
  const ladderXs = Array.from({ length: 8 }, (_, i) => Math.round(820 + i * ((RW - 1800) / 8)));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const floors = [upper(x), main(x), lower(x)];
    let open = floors.some((f, i) => y < f && y > f - HEIGHT[i] + 12 * Math.sin(x / 50));
    for (const v of vaults)
      if (Math.abs(x - v.x) < 160 && y < v.floor(v.x) && y > v.floor(v.x) - 220) open = true;
    if (!open && x > hall.x0 && x < hall.x1 && y > hall.top && y < main(x)) open = true;
    if (!open)
      for (const lx of ladderXs)
        if (Math.abs(x - lx) < 44 && y > upper(lx) - 60 && y < lower(lx)) open = true;
    if (open) return 0;
    return fbm2(x / 150, y / 110, s(5)) > 0.68 ? CROWN_ROCK : SEWER_BRICK;
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

export const GUTTER: RealmTemplate = {
  id: 'gutter',
  name: 'Gutter of Kings',
  band: 4,
  note: 'The sewers under a dead city of kings. Vaults everywhere, rich loot, and cursed gold that sickens whoever hoards it.',
  sky: 'cavern',
  temp: 16,
  ambient: [0.12, 0.1, 0.05],
  daylight: 0,
  wall: SEWER_BRICK,
  hazard: {
    id: 'curse',
    name: 'Cursed gold',
    text: 'Every coin and gold ingot picked up here risks gold sickness, which weighs you down. Take only what you need, or ward yourself.',
    ward: 'goldward',
  },
  fragment: 'gutter_fragment',
  key: 'gutter_key',
  material: 'crown_gold',
  relic: 'pauper_crown',
  boss: 'pauper_king',
  elite: 'gilded_guard',
  music: 'gutter',
  ores: ['crown_gold', 'gold_ore', 'ruby'],
  nodes: [
    ['crown_gold', 6],
    ['gold_ore', 3],
    ['coal', 2],
    ['stone', 2],
    ['ruby', 1],
    ['emerald', 1],
    ['water', 1],
  ],
  nodeCount: 66,
  mobs: [
    { type: 'gutter_rat', weight: 4 },
    { type: 'crown_thief', weight: 3 },
    { type: 'gilded_slime', weight: 3 },
    { type: 'tax_collector', weight: 2 },
    { type: 'sewer_eel', weight: 2 },
  ],
  mobCount: 42,
  chests: 10,
  chestLoot: [
    ['gutter_fragment', 1, 2, 0.6],
    ['feverlands_fragment', 1, 1, 0.3],
    ['crown_gold', 3, 8, 0.9],
    ['coin', 60, 160, 1],
    ['gold_ingot', 3, 6, 0.6],
    ['ruby', 1, 3, 0.4],
    ['life_fruit', 1, 1, 0.2],
  ],
  biome: {
    id: 'gutter',
    name: 'Gutter of Kings',
    x: 15,
    y: 0,
    color: '#6a5a2a',
    shade: '#d8b848',
    temp: 16,
    note: 'The sewers under a dead city of kings.',
    resources: ['crown_gold', 'gold_ore', 'coal'],
  },
  build,
};
