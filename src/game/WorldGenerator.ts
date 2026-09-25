import { clamp } from '../core/math.ts';
import type { Animal } from '../core/types.ts';
import { BIOMES } from '../data/biomes.ts';
import { NODES } from '../data/resources.ts';
import {
  BIOME_SPANS,
  ENTRANCES,
  LAVA_Y,
  SHAFTS,
  TILE_COLS,
  TILE_ROWS,
  WORLD_W,
  baseTileAt,
  biomeAt,
  caveY,
  underworldFloor,
  type BiomeSpan,
} from '../data/world.ts';
import { uniqueId } from './ids.ts';
import { RULES } from './rules.ts';

import { System } from './systems/System.ts';

/** What grows or lies in each underground layer, by tunnel levels it can sit on. */
const UNDERGROUND: {
  layer: string;
  levels: number[];
  perKm: number;
  kinds: (biomeOres: string[]) => string[];
}[] = [
  {
    layer: 'upper_mines',
    levels: [1, 2, 3],
    perKm: 9,
    kinds: (ores) => [...ores, ...ores, 'stone', 'coal', 'copper_ore', 'clay', 'mushroom'],
  },
  {
    layer: 'lower_mines',
    levels: [4, 5],
    perKm: 7,
    kinds: () => ['iron_ore', 'iron_ore', 'coal', 'coal', 'crystal', 'sulfur', 'mushroom'],
  },
  {
    layer: 'upper_hell',
    levels: [6, 7],
    perKm: 5,
    kinds: () => ['sulfur', 'sulfur', 'obsidian', 'obsidian', 'crystal'],
  },
  {
    layer: 'lower_hell',
    levels: [0],
    perKm: 4,
    kinds: () => ['hellstone', 'hellstone', 'obsidian'],
  },
];
const ORES = ['copper_ore', 'iron_ore', 'coal', 'ice', 'obsidian', 'sulfur', 'crystal'];
/** Creatures of each depth: type, tunnel level (0 is the underworld floor), and count per km. */
const DEEP_LIFE: [string, number[], number][] = [
  ['bat', [1, 2, 3], 0.7],
  ['bat', [4, 5], 0.6],
  ['ember_bat', [6, 7], 0.8],
  ['hellhound', [0], 0.8],
];
export const ANIMAL_HP: Record<string, number> = {
  deer: 42,
  wolf: 66,
  boar: 88,
  bat: 33,
  scorpion: 54,
  ember_bat: 70,
  hellhound: 190,
};

export class WorldGenerator extends System {
  /** Tile grid rebuilt from the world's pure geometry. */
  generateTiles() {
    const tiles = new Array<number>(TILE_COLS * TILE_ROWS);
    for (let i = 0; i < tiles.length; i++)
      tiles[i] = baseTileAt(i % TILE_COLS, Math.floor(i / TILE_COLS));
    return tiles;
  }

  generate() {
    const s = this.game.s;
    this.buckets.clear();
    s.tiles = this.generateTiles();
    s.tileEdits = {};
    s.drops = [];
    for (const span of BIOME_SPANS) {
      const width = span.end - span.start,
        count = Math.round(width / 450);
      // Field caches claim their ground first; resources then keep clear of them.
      for (let i = 0; i < count; i++) {
        const x = clamp(
          span.start + ((i + 0.5) / count) * width + (this.game.rng() - 0.5) * 220,
          70,
          WORLD_W - 70,
        );
        const y = this.game.groundTopAt(x) - 1;
        if (
          Math.abs(x - RULES.spawnX) > 250 &&
          !ENTRANCES.some((e) => Math.abs(e - x) < 85) &&
          this.nodeFits('cache', x, y)
        )
          s.caches.push({ id: uniqueId(), x, y, opened: false, biome: span.id });
      }
      // Deeper caches hold better finds.
      for (const [level, layer] of [
        [4, 'lower_mines'],
        [7, 'upper_hell'],
      ] as const) {
        const x = span.start + width * (0.3 + this.game.rng() * 0.4),
          y = this.game.floorNear(x, caveY(x, level));
        if (this.nodeFits('cache', x, y))
          s.caches.push({ id: uniqueId(), x, y, opened: false, biome: span.id, layer });
      }
    }
    this.generateNodes();
    for (const span of BIOME_SPANS) this.populate(span);
  }

  private addAnimal(type: string, x: number, y: number, extra: Partial<Animal> = {}) {
    const hp = ANIMAL_HP[type];
    this.game.s.animals.push({
      id: uniqueId(),
      type,
      x,
      y,
      homeX: x,
      homeY: y,
      hp,
      maxHp: hp,
      angle: this.game.rng() > 0.5 ? 0 : Math.PI,
      wanderAt: 0,
      attackAt: 0,
      deadUntil: 0,
      warning: 0,
      phase: this.game.rng() * Math.PI * 2,
      ...extra,
    });
  }

  private populate(span: BiomeSpan) {
    const width = span.end - span.start,
      scale = width / 1200;
    const surface: Record<string, string[]> = {
      coast: ['deer', 'deer'],
      marsh: ['deer', 'boar'],
      forest: ['deer', 'deer', 'wolf', 'boar'],
      meadow: ['deer', 'deer'],
      taiga: ['deer', 'wolf', 'wolf'],
      tundra: ['wolf', 'wolf'],
      alpine: ['wolf'],
      desert: ['scorpion', 'scorpion'],
      badlands: ['wolf', 'wolf', 'scorpion'],
    };
    const kinds = surface[span.id];
    const total = Math.round(kinds.length * scale * 0.85);
    for (let i = 0; i < total; i++) {
      const type = kinds[i % kinds.length];
      // Retry so herds neither stack on one spot nor land at the foot of a cave shaft.
      for (let attempt = 0; attempt < 12; attempt++) {
        const x = clamp(
          span.start + this.game.rng() * width,
          RULES.animalWorldPadding,
          WORLD_W - RULES.animalWorldPadding,
        );
        if (
          (span.id === 'meadow' && Math.abs(x - RULES.spawnX) < 320) ||
          ENTRANCES.some((e) => Math.abs(e - x) < 70) ||
          this.game.s.animals.some((a) => !a.tunnel && Math.abs(a.x - x) < 90)
        )
          continue;
        this.addAnimal(type, x, this.game.groundTopAt(x) - 1);
        break;
      }
    }
    for (const [type, levels, perKm] of DEEP_LIFE) {
      const n = Math.round((width / 1000) * perKm);
      for (let i = 0; i < n; i++) {
        const x = span.start + ((i + 0.3 + this.game.rng() * 0.4) / n) * width,
          level = levels[i % levels.length];
        if (level === 0) {
          const floor = underworldFloor(x);
          if (floor > LAVA_Y - 20) continue;
          this.addAnimal(type, x, floor - 1, { underground: true });
        } else this.addAnimal(type, x, caveY(x, level), { tunnel: level });
      }
    }
  }

  // Resource layout; also rebuilt for records saved before the current world layout.
  generateNodes() {
    const s = this.game.s;
    const push = (kind: string, x: number, y: number, underground = false) =>
      s.nodes.push({
        id: uniqueId(),
        kind,
        x,
        y,
        hp: NODES[kind].hp,
        depletedUntil: 0,
        phase: this.game.rng() * Math.PI * 2,
        ...(underground ? { underground } : {}),
      });
    // A deliberately readable first screen; later regions are wider and less forgiving.
    for (const [kind, offset] of RULES.starterNodeOffsets) {
      const x = RULES.spawnX + offset;
      push(kind, x, this.game.groundTopAt(x) - 1);
    }
    this.buckets.clear();
    for (const n of s.nodes) this.remember(n.kind, n.x, n.y);
    for (const c of s.caches) this.remember('cache', c.x, c.y);
    for (const span of BIOME_SPANS) {
      const b = BIOMES.find((bb) => bb.id === span.id)!,
        width = span.end - span.start,
        scale = width / 1200;
      // Kinds are interleaved so every resource gets a fair share of open ground.
      const kinds = [...new Set(b.resources)],
        queue: string[] = [];
      for (let round = 0; round < 40; round++)
        for (const kind of kinds) {
          const base = kind === 'wood' || kind === 'stone' ? 12 : kind === 'water' ? 5 : 8;
          if (round < Math.round(base * scale * (ORES.includes(kind) ? 0.35 : 0.85)))
            queue.push(kind);
        }
      for (const kind of queue)
        for (let attempt = 0; attempt < RULES.worldGenerationAttemptsPerNode; attempt++) {
          const x = clamp(
            span.start + this.game.rng() * width,
            RULES.resourceWorldPadding,
            WORLD_W - RULES.resourceWorldPadding,
          );
          if (ENTRANCES.some((e) => Math.abs(e - x) < RULES.entranceResourceClearance)) continue;
          const y = this.game.groundTopAt(x) - 1;
          if (
            biomeAt(x, y).id !== span.id ||
            (span.id === 'meadow' && Math.abs(x - RULES.spawnX) < 110) ||
            !this.nodeFits(kind, x, y)
          )
            continue;
          push(kind, x, y);
          this.remember(kind, x, y);
          break;
        }
      // Underground finds sit on tunnel floors, richer and rarer the deeper they lie.
      const biomeOres = kinds.filter((k) => ORES.includes(k));
      for (const deep of UNDERGROUND) {
        const pool = deep.kinds(biomeOres.length ? biomeOres : ['coal']),
          n = Math.round((width / 1000) * deep.perKm);
        for (let i = 0; i < n; i++) {
          const kind = pool[i % pool.length];
          for (let attempt = 0; attempt < 20; attempt++) {
            const x = span.start + this.game.rng() * width,
              level = deep.levels[Math.floor(this.game.rng() * deep.levels.length)];
            if (SHAFTS.some((sh) => Math.abs(sh.x - x) < 70)) continue;
            let y: number;
            if (level === 0) {
              const floor = underworldFloor(x);
              if (floor > LAVA_Y - 20) continue;
              y = this.game.floorNear(x, floor - 20);
            } else y = this.game.floorNear(x, caveY(x, level));
            if (!this.nodeFits(kind, x, y)) continue;
            push(kind, x, y, true);
            this.remember(kind, x, y);
            break;
          }
        }
      }
    }
  }

  // Spatial buckets keep placement checks local now that regions are wide.
  private readonly buckets = new Map<number, { kind: string; x: number; y: number }[]>();
  private remember(kind: string, x: number, y: number) {
    const key = Math.floor(x / 200);
    let list = this.buckets.get(key);
    if (!list) this.buckets.set(key, (list = []));
    list.push({ kind, x, y });
  }
  // Resources keep a readable footprint: trees space from trees, small finds from each other.
  nodeFits(kind: string, x: number, y: number) {
    const tree = (k: string) => k === 'wood' || k === 'resin' || k === 'honey';
    const width = (k: string) =>
      tree(k) ? 92 : k === 'water' ? 74 : k === 'cache' ? 44 : NODES[k]?.tool ? 38 : 30;
    const key = Math.floor(x / 200);
    const others = [key - 1, key, key + 1].flatMap((k) => this.buckets.get(k) ?? []);
    if (!this.buckets.size)
      others.push(
        ...this.game.s.nodes,
        ...this.game.s.caches.map((c) => ({ kind: 'cache', x: c.x, y: c.y })),
      );
    return others.every((n) => {
      if (Math.abs(n.y - y) > 60) return true;
      const gap = Math.abs(n.x - x);
      if (tree(kind) !== tree(n.kind))
        return gap > (kind === 'water' || n.kind === 'water' ? 64 : 26);
      return gap > (width(kind) + width(n.kind)) / 2;
    });
  }
}
