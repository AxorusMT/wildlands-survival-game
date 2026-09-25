// The four dungeons: brick halls built into the world, each with its own facade, traps, loot,
// guardians, and a boss arena. Layouts are generated from a fixed seed, so every world has the
// same dungeons and saves only need to remember what was opened, broken, or slain.
import type { Point } from '../core/types.ts';

export type DungeonId = 'crypt' | 'frost_keep' | 'tomb' | 'citadel';
export interface DungeonDef {
  id: DungeonId;
  name: string;
  /** Host region, for the journal. */
  region: string;
  brick: number;
  /** Left edge in world pixels. */
  x: number;
  cellsX: number;
  cellsY: number;
  facade: 'mausoleum' | 'tower' | 'pyramid' | 'none';
  /** Walkers and fliers that guard the rooms. */
  walkers: string[];
  fliers: string[];
  traps: ('trap_spikes' | 'trap_dart' | 'trap_flame')[];
  boss: string;
  /** Chest loot: item, min, max, chance. */
  loot: [string, number, number, number][];
  /** Torch colour in these halls. */
  flame: 'fire' | 'frost' | 'soul';
  note: string;
}
const L = (item: string, min: number, max = min, chance = 1): [string, number, number, number] => [
  item,
  min,
  max,
  chance,
];
export const DUNGEON_DEFS: DungeonDef[] = [
  {
    id: 'crypt',
    name: 'The Mossy Crypt',
    region: 'forest',
    brick: 15,
    x: 7040,
    cellsX: 4,
    cellsY: 4,
    facade: 'mausoleum',
    walkers: ['skeleton', 'skeleton', 'crypt_ghoul', 'skeleton_archer'],
    fliers: ['bone_bat'],
    traps: ['trap_spikes', 'trap_dart'],
    boss: 'hollow_king',
    loot: [
      L('healing_draught', 1, 3),
      L('grave_dust', 2, 5),
      L('iron_bow', 1, 1, 0.25),
      L('arrow', 10, 25, 0.6),
      L('life_crystal', 1, 1, 0.3),
      L('regeneration_potion', 1, 1, 0.4),
      L('crypt_key', 1, 1, 0.2),
      L('band_of_vigor', 1, 1, 0.12),
    ],
    flame: 'soul',
    note: 'A drowned mausoleum under the forest. The Hollow King keeps court below.',
  },
  {
    id: 'frost_keep',
    name: 'The Frost Keep',
    region: 'tundra',
    brick: 16,
    x: 17280,
    cellsX: 4,
    cellsY: 4,
    facade: 'tower',
    walkers: ['ice_golem', 'snow_slime', 'snow_slime'],
    fliers: ['frost_wraith', 'frost_wraith'],
    traps: ['trap_spikes', 'trap_dart'],
    boss: 'rime_colossus',
    loot: [
      L('frost_shard', 2, 5),
      L('warming_brew', 1, 2),
      L('healing_draught', 1, 3),
      L('ironskin_potion', 1, 1, 0.4),
      L('life_crystal', 1, 1, 0.3),
      L('frost_key', 1, 1, 0.2),
      L('cloud_jar', 1, 1, 0.12),
    ],
    flame: 'frost',
    note: 'A tower of blue ice brick on the tundra, sunk deep into the permafrost.',
  },
  {
    id: 'tomb',
    name: 'The Sunken Tomb',
    region: 'desert',
    brick: 17,
    x: 24000,
    cellsX: 5,
    cellsY: 4,
    facade: 'pyramid',
    walkers: ['mummy', 'scarab', 'scarab', 'tomb_serpent'],
    fliers: [],
    traps: ['trap_dart', 'trap_spikes', 'trap_dart'],
    boss: 'pharaoh',
    loot: [
      L('sun_gold', 2, 5),
      L('healing_draught', 2, 4),
      L('swiftness_potion', 1, 1, 0.4),
      L('fire_arrow', 10, 20, 0.5),
      L('life_crystal', 1, 1, 0.3),
      L('tomb_key', 1, 1, 0.2),
      L('miners_lamp', 1, 1, 0.15),
    ],
    flame: 'fire',
    note: 'A buried pyramid. Its gold is guarded by traps older than the dunes.',
  },
  {
    id: 'citadel',
    name: 'The Cinder Citadel',
    region: 'badlands',
    brick: 18,
    x: 27520,
    cellsX: 4,
    cellsY: 4,
    facade: 'none',
    walkers: ['cinder_knight', 'magma_slime', 'magma_slime'],
    fliers: ['imp', 'imp'],
    traps: ['trap_flame', 'trap_spikes', 'trap_flame'],
    boss: 'archdemon',
    loot: [
      L('cinder_core', 2, 4),
      L('greater_healing', 1, 2),
      L('fireward_potion', 1, 2),
      L('wrath_potion', 1, 1, 0.5),
      L('life_crystal', 1, 1, 0.35),
      L('cinder_key', 1, 1, 0.2),
      L('magma_stone', 1, 1, 0.15),
    ],
    flame: 'fire',
    note: 'A fortress of black brick in the underworld, rising toward the heat of hell.',
  },
];

export interface DungeonLayout {
  def: DungeonDef;
  tx0: number;
  ty0: number;
  cols: number;
  rows: number;
  /** Tile kind per cell (0 is air); NATURAL leaves the world's own ground. */
  grid: Uint8Array;
  shafts: { x: number; top: number; bottom: number }[];
  chests: Point[];
  traps: { type: string; x: number; y: number; dir: number }[];
  spawns: { type: string; x: number; y: number; flier: boolean }[];
  torches: Point[];
  altar: Point;
  /** The boss arena in world pixels. */
  arena: { x0: number; y0: number; x1: number; y1: number };
  entrance: Point;
}
export const NATURAL = 255;
const CW = 12,
  CHT = 9;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Lays out one dungeon. `surfaceRow` is the tile row of the ground at the dungeon (or, for the
 * Citadel, of the underworld floor), and `tile` is the world's tile size.
 */
export function buildDungeon(def: DungeonDef, surfaceRow: number, tile: number): DungeonLayout {
  const r = rng([...def.id].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261));
  const ri = (n: number) => Math.floor(r() * n);
  const facadeH = { mausoleum: 9, tower: 16, pyramid: 12, none: 0 }[def.facade];
  const cols = def.cellsX * CW + 2,
    arenaH = CHT + 4,
    under = (def.cellsY - 1) * CHT + arenaH + 2,
    rows = facadeH + under;
  const citadel = def.facade === 'none';
  // Surface dungeons hang down from the ground; the Citadel stands on the underworld floor.
  const tx0 = Math.floor(def.x / tile),
    ty0 = citadel ? surfaceRow + 2 - rows : surfaceRow - facadeH;
  const grid = new Uint8Array(cols * rows).fill(def.brick);
  for (let y = 0; y < facadeH; y++) for (let x = 0; x < cols; x++) grid[y * cols + x] = NATURAL;
  // Local helpers work in "generation rows" (entrance at the top); the Citadel is flipped after.
  const set = (x: number, y: number, v: number) => {
    if (x >= 0 && y >= 0 && x < cols && y < rows) grid[y * cols + x] = v;
  };
  const carve = (x0: number, y0: number, w: number, h: number) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y, 0);
  };
  const top = facadeH + 1;
  interface Room {
    x: number;
    w: number;
    floor: number;
    h: number;
  }
  // Row 0 holds the entrance. Surface dungeons descend to an arena at the bottom; the Citadel
  // rises from its gate to a throne room at the top.
  const rowFloor = (j: number) =>
    citadel ? top + arenaH + (def.cellsY - 2 - j) * CHT + CHT - 2 : top + j * CHT + CHT - 2;
  const rooms: Room[][] = [];
  for (let j = 0; j < def.cellsY - 1; j++) {
    rooms.push([]);
    for (let i = 0; i < def.cellsX; i++) {
      const w = 7 + ri(3),
        h = 5 + ri(2),
        x = 1 + i * CW + 1 + ri(CW - 2 - w),
        floor = rowFloor(j);
      carve(x, floor - h + 1, w, h);
      rooms[j].push({ x, w, floor, h });
    }
  }
  const arena = {
    x: 3,
    w: cols - 6,
    floor: citadel ? top + arenaH - 2 : top + (def.cellsY - 1) * CHT + arenaH - 2,
    h: arenaH - 2,
  };
  carve(arena.x, arena.floor - arena.h + 1, arena.w, arena.h);
  // Stepped pillars at the arena's ends give footing when the boss presses close.
  for (const side of [0, 1]) {
    const px = side ? arena.x + arena.w - 7 : arena.x + 4;
    carve(px, arena.floor - 3, 3, 1);
    set(px, arena.floor - 3, def.brick);
    for (let x = px; x < px + 3; x++) set(x, arena.floor - 4, def.brick);
  }
  const shafts: DungeonLayout['shafts'] = [];
  const shaft = (x: number, fromFloor: number, toFloor: number) => {
    carve(x, fromFloor - 2, 3, toFloor - fromFloor + 2);
    shafts.push({
      x: (tx0 + x + 1.5) * tile,
      top: (ty0 + fromFloor - 1) * tile,
      bottom: (ty0 + toFloor) * tile,
    });
  };
  const corridor = (a: Room, b: Room) => carve(a.x + a.w, a.floor - 2, b.x - (a.x + a.w), 3);
  const link = (p: Room, q: Room) => {
    const [a, b] = p.floor < q.floor ? [p, q] : [q, p];
    const lo = Math.max(a.x, b.x),
      hi = Math.min(a.x + a.w, b.x + b.w) - 3;
    shaft(hi >= lo ? lo + ri(hi - lo + 1) : a.x + 1, a.floor, b.floor);
  };
  // A spanning tree over the rooms, grown from the entrance.
  const start = Math.floor(def.cellsX / 2),
    seen = new Set<string>([`${start},0`]),
    stack: [number, number][] = [[start, 0]];
  while (stack.length) {
    const [i, j] = stack[stack.length - 1];
    const next = (
      [
        [i - 1, j],
        [i + 1, j],
        [i, j + 1],
        [i, j - 1],
      ] as [number, number][]
    ).filter(
      ([a, b]) =>
        a >= 0 && b >= 0 && a < def.cellsX && b < def.cellsY - 1 && !seen.has(`${a},${b}`),
    );
    if (!next.length) {
      stack.pop();
      continue;
    }
    const [a, b] = next[ri(next.length)];
    seen.add(`${a},${b}`);
    if (b === j) corridor(rooms[j][Math.min(i, a)], rooms[j][Math.max(i, a)]);
    else link(rooms[Math.min(j, b)][i], rooms[Math.max(j, b)][i]);
    stack.push([a, b]);
  }
  // A couple of loops so the halls are not one long path.
  for (let k = 0; k < 2; k++) {
    const j = ri(def.cellsY - 1),
      i = ri(def.cellsX - 1);
    corridor(rooms[j][i], rooms[j][i + 1]);
  }
  // The way down to the arena.
  const last = rooms[def.cellsY - 2],
    gate = last[ri(last.length)];
  link(gate, arena);

  // Entrance and facade.
  const entryRoom = rooms[0][start],
    mid = Math.floor(cols / 2);
  let entrance: Point = { x: 0, y: 0 };
  const brickAt = (x: number, y: number) => set(x, y, def.brick);
  if (def.facade === 'mausoleum') {
    const w = 15,
      x0 = mid - 7;
    for (let y = facadeH - 6; y < facadeH; y++) for (let x = x0; x < x0 + w; x++) brickAt(x, y);
    for (let k = 0; k < 4; k++)
      for (let x = x0 + k * 2 - 1; x < x0 + w - k * 2 + 1; x++) brickAt(x, facadeH - 7 - k);
    carve(x0 + 1, facadeH - 5, w - 2, 5);
    carve(x0, facadeH - 3, 1, 3);
    carve(x0 + w - 1, facadeH - 3, 1, 3);
  } else if (def.facade === 'tower') {
    const w = 11,
      x0 = mid - 5;
    for (let y = 1; y < facadeH; y++) for (let x = x0; x < x0 + w; x++) brickAt(x, y);
    for (let x = x0; x < x0 + w; x += 2) brickAt(x, 0);
    carve(x0 + 1, 3, w - 2, facadeH - 3);
    carve(x0, facadeH - 3, 1, 3);
    carve(x0 + w - 1, facadeH - 3, 1, 3);
    // Platforms of brick inside the tower for the view from the top.
    for (let y = facadeH - 5; y > 4; y -= 4)
      for (let x = x0 + 1 + ((y / 4) % 2 ? 0 : 5); x < x0 + 5 + ((y / 4) % 2 ? 0 : 5); x++)
        brickAt(x, y);
  } else if (def.facade === 'pyramid') {
    const w = 29,
      x0 = mid - 14;
    for (let k = 0; k < facadeH; k++)
      for (let x = x0 + k; x < x0 + w - k; x++) brickAt(x, facadeH - 1 - k);
    carve(mid - 4, facadeH - 4, 9, 4);
    // Low passages from each side, just tall enough to walk through.
    carve(x0, facadeH - 2, mid - 4 - x0, 2);
    carve(mid + 5, facadeH - 2, x0 + w - mid - 5, 2);
  }
  if (def.facade !== 'none') {
    // A ladder from the facade floor down into the first room.
    shaft(mid - 1, facadeH, entryRoom.floor);
    carve(
      Math.min(mid - 1, entryRoom.x),
      entryRoom.floor - 2,
      Math.abs(mid - 1 - entryRoom.x) + 3,
      3,
    );
    entrance = { x: (tx0 + mid) * tile, y: (ty0 + facadeH) * tile - 1 };
  } else {
    // The Citadel's gates open east and west onto the underworld from its lowest hall.
    const row = rooms[0];
    carve(0, row[0].floor - 2, row[0].x + 1, 3);
    carve(row[row.length - 1].x + row[row.length - 1].w - 1, row[0].floor - 2, cols, 3);
    for (let i = 0; i < row.length - 1; i++) corridor(row[i], row[i + 1]);
  }

  // Furnishings: torches, traps, chests, guardians, and the boss altar.
  const W = (x: number) => (tx0 + x) * tile,
    Y = (y: number) => (ty0 + y) * tile;
  const chests: Point[] = [],
    traps: DungeonLayout['traps'] = [],
    spawns: DungeonLayout['spawns'] = [],
    torches: Point[] = [];
  rooms.flat().forEach((room, n) => {
    const floorY = Y(room.floor + 1) - 1;
    if (n % 2 === 0) torches.push({ x: W(room.x) + 20, y: Y(room.floor - 2) + 16 });
    if (n % 3 === 1) chests.push({ x: W(room.x + room.w - 2) + 16, y: floorY });
    const walker = def.walkers[n % def.walkers.length];
    spawns.push({
      type: walker,
      x: W(room.x + Math.floor(room.w / 2)) + 16,
      y: floorY,
      flier: false,
    });
    if (def.fliers.length && n % 2)
      spawns.push({
        type: def.fliers[n % def.fliers.length],
        x: W(room.x + 2),
        y: Y(room.floor - room.h + 2),
        flier: true,
      });
    if (n % 3 === 2) {
      const type = def.traps[n % def.traps.length];
      if (type === 'trap_dart')
        traps.push({ type, x: W(room.x) + 6, y: Y(room.floor - 1) + 10, dir: 1 });
      else traps.push({ type, x: W(room.x + 3) + 16, y: floorY, dir: 0 });
    }
  });
  const aFloor = Y(arena.floor + 1) - 1;
  for (const f of [0.15, 0.4, 0.6, 0.85])
    torches.push({ x: W(arena.x + Math.floor(arena.w * f)), y: Y(arena.floor - arena.h + 3) });
  const altar = { x: W(Math.floor(cols / 2)) + 16, y: aFloor };
  return {
    def,
    tx0,
    ty0,
    cols,
    rows,
    grid,
    shafts,
    chests,
    traps,
    spawns,
    torches,
    altar,
    arena: {
      x0: W(arena.x),
      y0: Y(arena.floor - arena.h + 1),
      x1: W(arena.x + arena.w),
      y1: aFloor,
    },
    entrance: citadel ? { x: W(0), y: Y(rooms[0][0].floor + 1) - 1 } : entrance,
  };
}

/** The tile a layout places at a world tile, or NATURAL outside it. */
export function layoutTile(l: DungeonLayout, tx: number, ty: number) {
  const x = tx - l.tx0,
    y = ty - l.ty0;
  if (x < 0 || y < 0 || x >= l.cols || y >= l.rows) return NATURAL;
  return l.grid[y * l.cols + x];
}
