// The Clockwork Barrow (Band III): a tomb that is also a machine. Brass-plated halls step down in
// terraces, gears turn in the walls, and steam vents in the floor scald anyone who walks blind.
import { fbm2, noise1 } from '../../core/noise.ts';
import { EDGE, RW, seedOf } from './shared.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';

export const BRASS_PLATE = 40,
  GEARSTONE = 41;

/** Seconds between a vent's blasts, and how long each lasts. */
export const VENT_CYCLE = 5,
  VENT_BLAST = 1.3;
/** Whether a steam vent at x is blowing at time t (vents are staggered along the hall). */
export const ventActive = (x: number, t: number) =>
  (t + (Math.floor(x / 97) % 7) * 0.71) % VENT_CYCLE < VENT_BLAST;

function build(seed: number): RealmGeometry {
  const s = (k: number) => seedOf(seed, k);
  const arrive = 520,
    arena = RW - 950;
  // Terraced halls: floors that step by whole tiles, never slopes.
  const terrace = (base: number, k: number) => {
    const step = 320;
    return (x: number) => {
      const i = Math.floor(x / step);
      return base + Math.round(noise1(i * 1.37, s(k)) * 3) * 32;
    };
  };
  const upper = terrace(1150, 1),
    main = terrace(1700, 2),
    lower = terrace(2250, 3);
  const HEIGHT = [170, 230, 170];
  const hall = { x0: RW - 1750, x1: RW - 260, top: 1380 };
  const ladderXs = Array.from({ length: 9 }, (_, i) => Math.round(760 + i * ((RW - 1600) / 9)));
  const tile = (x: number, y: number) => {
    if (x < EDGE || x > RW - EDGE) return 27;
    const floors = [upper(x), main(x), lower(x)];
    let open = floors.some((f, i) => y < f && y > f - HEIGHT[i]);
    if (!open && x > hall.x0 && x < hall.x1 && y > hall.top && y < main(x)) open = true;
    if (!open)
      for (const lx of ladderXs)
        if (Math.abs(x - lx) < 44 && y > upper(lx) - 60 && y < lower(lx)) open = true;
    if (!open && x > arrive - 300 && x < arrive + 300 && y > main(x) - 300 && y < main(x))
      open = true;
    if (open) return 0;
    // Brass lines every hall; gearstone fills the rock between.
    const near = floors.some((f, i) => Math.abs(y - f) < 36 || Math.abs(y - (f - HEIGHT[i])) < 36);
    if (near) return BRASS_PLATE;
    return fbm2(x / 200, y / 140, s(4)) > 0.55 ? BRASS_PLATE : GEARSTONE;
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

export const BARROW: RealmTemplate = {
  id: 'barrow',
  name: 'Clockwork Barrow',
  band: 3,
  note: 'A tomb built as a machine. Brass halls step down in terraces; steam vents scald the careless, and the dead still keep time.',
  sky: 'cavern',
  temp: 22,
  ambient: [0.14, 0.1, 0.05],
  daylight: 0,
  wall: GEARSTONE,
  hazard: {
    id: 'traps',
    name: 'Steam vents',
    text: 'Vents in the floor blast scalding steam every few seconds. Watch their rhythm and cross between blasts.',
    ward: 'trapsense',
  },
  fragment: 'barrow_fragment',
  key: 'barrow_key',
  material: 'brass_gear',
  relic: 'saint_cog',
  boss: 'engine_saint',
  elite: 'brass_juggernaut',
  music: 'barrow',
  ores: ['brass_gear', 'gold_ore', 'silver_ore'],
  nodes: [
    ['brass_gear', 6],
    ['coal', 3],
    ['gold_ore', 2],
    ['silver_ore', 2],
    ['stone', 2],
    ['topaz', 1],
    ['crystal', 1],
  ],
  nodeCount: 70,
  mobs: [
    { type: 'cog_spider', weight: 4 },
    { type: 'tin_soldier', weight: 3 },
    { type: 'brass_sentry', weight: 2 },
    { type: 'clockwork_hound', weight: 3 },
    { type: 'gear_wisp', weight: 2, air: true },
  ],
  mobCount: 40,
  chests: 5,
  chestLoot: [
    ['barrow_fragment', 1, 2, 0.6],
    ['saltflats_fragment', 1, 1, 0.3],
    ['brass_ingot', 3, 5, 0.8],
    ['healing_draught', 2, 4, 1],
    ['gold_ingot', 3, 6, 0.5],
    ['topaz', 1, 3, 0.5],
    ['life_fruit', 1, 1, 0.15],
  ],
  biome: {
    id: 'barrow',
    name: 'Clockwork Barrow',
    x: 10,
    y: 0,
    color: '#8a6a3a',
    shade: '#d8b070',
    temp: 22,
    note: 'A tomb built as a machine.',
    resources: ['brass_gear', 'coal', 'gold_ore'],
  },
  build,
  extra(geo, ctx) {
    // Steam vents along every hall, kept clear of the arrival and the arena.
    for (let lx = 900; lx < RW - 400; lx += 260 + Math.floor(ctx.rng() * 200)) {
      if (Math.abs(lx - geo.arena) < 700) continue;
      const f = geo.floors[Math.floor(ctx.rng() * geo.floors.length)];
      const x = ctx.x0 + lx;
      ctx.furnish('steam_vent', x, ctx.floorAt(x, f(lx) - 30));
    }
  },
};
