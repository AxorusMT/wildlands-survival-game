import { clamp } from '../core/math.ts';
import { BIOMES } from '../data/biomes.ts';
import { NODES } from '../data/resources.ts';
import {
  BIOME_CENTERS,
  ENTRANCES,
  TILE_COLS,
  TILE_ROWS,
  WORLD_W,
  baseTileAt,
  biomeAt,
  caveY,
} from '../data/world.ts';
import { uniqueId } from './ids.ts';
import { RULES } from './rules.ts';

import { System } from './systems/System.ts';

export class WorldGenerator extends System {
  generate() {
    this.game.s.tiles = Array.from({ length: TILE_COLS * TILE_ROWS }, (_, index) =>
      baseTileAt(index % TILE_COLS, Math.floor(index / TILE_COLS)),
    );
    for (const b of BIOMES) {
      const cx = BIOME_CENTERS[b.id][0];
      // Field caches claim their ground first; resources then keep clear of them.
      for (let i = 0; i < 3; i++) {
        const x = clamp(cx - 430 + i * 410 + this.game.rng() * 110, 70, WORLD_W - 70);
        if (
          Math.abs(x - RULES.spawnX) > 250 &&
          !ENTRANCES.some((e) => Math.abs(e - x) < 85) &&
          this.nodeFits('cache', x, this.game.groundTopAt(x) - 1)
        )
          this.game.s.caches.push({
            id: uniqueId(),
            x,
            y: this.game.groundTopAt(x) - 1,
            opened: false,
            biome: b.id,
          });
      }
    }
    this.generateNodes();
    for (const b of BIOMES) {
      const cx = BIOME_CENTERS[b.id][0];
      const populations: Record<string, string[]> = {
        coast: ['deer', 'deer'],
        marsh: ['deer', 'boar', 'bat'],
        forest: ['deer', 'deer', 'wolf', 'boar', 'bat'],
        meadow: ['deer', 'deer'],
        taiga: ['deer', 'wolf', 'wolf', 'bat'],
        tundra: ['wolf', 'wolf'],
        alpine: ['wolf', 'bat'],
        desert: ['scorpion', 'scorpion'],
        badlands: ['wolf', 'wolf', 'scorpion', 'bat'],
      };
      for (const type of populations[b.id]) {
        // Retry so herds neither stack on one spot nor land at the foot of a cave shaft.
        let x = -1;
        for (let attempt = 0; attempt < 12 && x < 0; attempt++) {
          const tryX = clamp(
            cx + (this.game.rng() - 0.5) * RULES.animalSpread,
            RULES.animalWorldPadding,
            WORLD_W - RULES.animalWorldPadding,
          );
          if (
            !(b.id === 'meadow' && Math.abs(tryX - RULES.spawnX) < 260) &&
            !ENTRANCES.some((e) => Math.abs(e - tryX) < 70) &&
            !this.game.s.animals.some(
              (a) => (a.type === 'bat') === (type === 'bat') && Math.abs(a.x - tryX) < 80,
            )
          )
            x = tryX;
        }
        if (x < 0) continue;
        const flying = type === 'bat',
          y = flying ? caveY(x, 1) : this.game.groundTopAt(x) - 1;
        const hp: number = (
          { deer: 42, wolf: 66, boar: 88, bat: 33, scorpion: 54 } as Record<string, number>
        )[type];
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
        });
      }
    }
  }

  // Resource layout; also rebuilt once for records saved before resources kept their spacing.
  generateNodes() {
    // A deliberately readable first screen; later regions are wider and less forgiving.
    RULES.starterNodeOffsets.forEach(([kind, offset]) => {
      const x = RULES.spawnX + offset;
      this.game.s.nodes.push({
        id: uniqueId(),
        kind,
        x,
        y: this.game.groundTopAt(x) - 1,
        hp: NODES[kind].hp,
        depletedUntil: 0,
        phase: 0,
      });
    });
    for (const b of BIOMES) {
      const cx = BIOME_CENTERS[b.id][0];
      // Kinds are interleaved so every resource gets a fair share of open ground.
      const kinds = [...new Set(b.resources)],
        queue: string[] = [];
      for (let round = 0; round < 12; round++)
        for (const kind of kinds) {
          const quantity = kind === 'wood' || kind === 'stone' ? 12 : kind === 'water' ? 5 : 8;
          if (round < quantity) queue.push(kind);
        }
      for (const kind of queue)
        for (let attempts = 0; attempts < RULES.worldGenerationAttemptsPerNode; attempts++) {
          const x = clamp(
            cx + (this.game.rng() - 0.5) * RULES.resourceSpread,
            RULES.resourceWorldPadding,
            WORLD_W - RULES.resourceWorldPadding,
          );
          if (ENTRANCES.some((e) => Math.abs(e - x) < RULES.entranceResourceClearance)) continue;
          const ore = [
            'copper_ore',
            'iron_ore',
            'coal',
            'ice',
            'obsidian',
            'sulfur',
            'crystal',
          ].includes(kind);
          const underground = ore && this.game.rng() < (kind === 'obsidian' ? 0.9 : 0.7);
          const level = ['obsidian', 'crystal'].includes(kind)
            ? 3
            : ['iron_ore', 'ice', 'sulfur'].includes(kind)
              ? 2
              : 1;
          const y = underground
            ? this.game.floorNear(x, caveY(x, level))
            : this.game.groundTopAt(x) - 1;
          if (
            biomeAt(x, y).id !== b.id ||
            (b.id === 'meadow' && Math.abs(x - RULES.spawnX) < 110) ||
            !this.nodeFits(kind, x, y)
          )
            continue;
          this.game.s.nodes.push({
            id: uniqueId(),
            kind,
            x,
            y,
            hp: NODES[kind].hp,
            depletedUntil: 0,
            phase: this.game.rng() * Math.PI * 2,
            underground,
          });
          break;
        }
    }
  }
  // Resources keep a readable footprint: trees space from trees, small finds from each other.
  nodeFits(kind: string, x: number, y: number) {
    const tree = (k: string) => k === 'wood' || k === 'resin' || k === 'honey';
    const width = (k: string) =>
      tree(k) ? 92 : k === 'water' ? 74 : k === 'cache' ? 44 : NODES[k]?.tool ? 38 : 30;
    const others: { kind: string; x: number; y: number }[] = [
      ...this.game.s.nodes,
      ...this.game.s.caches.map((c) => ({ kind: 'cache', x: c.x, y: c.y })),
    ];
    return others.every((n) => {
      if (Math.abs(n.y - y) > 60) return true;
      const gap = Math.abs(n.x - x);
      if (tree(kind) !== tree(n.kind))
        return gap > (kind === 'water' || n.kind === 'water' ? 64 : 26);
      return gap > (width(kind) + width(n.kind)) / 2;
    });
  }
}
