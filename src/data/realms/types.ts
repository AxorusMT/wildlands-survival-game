// The shapes shared by every generated realm: its template, its geometry once built from a seed,
// and the small toolkit a template uses to furnish itself.
import type { Biome } from '../../core/types.ts';

/** Loot: item, min, max, chance. */
export type Loot = [item: string, min: number, max: number, chance: number];

/** A realm built from its seed. All x are local, measured from the pocket strip's start. */
export interface RealmGeometry {
  /** Tile kind at a local position (0 is open air). */
  tile(x: number, y: number): number;
  /** Open sky above this line; 0 means rock overhead everywhere (a cavern realm). */
  surface(x: number): number;
  /** Floors things can stand on, first the main one. */
  floors: ((x: number) => number)[];
  /** Climbable ladders. */
  ladders: { x: number; top: number; bottom: number }[];
  /** Where travellers arrive, and where the boss's altar stands. */
  arrive: number;
  arena: number;
  /** The floor function the arena stands on. */
  arenaFloor: (x: number) => number;
}

/** Everything a realm needs to furnish itself, in world coordinates. */
export interface RealmCtx {
  rng: () => number;
  tier: number;
  mods: Set<string>;
  /** World x of the strip's local 0. */
  x0: number;
  /** The standing floor at or below y. */
  floorAt(x: number, y: number): number;
  node(kind: string, x: number, y: number): void;
  mob(type: string, x: number, y: number): void;
  chest(x: number, y: number, loot: Loot[]): void;
  furnish(type: string, x: number, y: number, kind?: string): void;
}

export interface RealmHazard {
  id: 'tide' | 'ash' | 'cavein' | 'shards' | 'mire' | 'traps' | 'sun' | 'hymn';
  name: string;
  /** What it does, for the Atlas and the banner. */
  text: string;
  /** The effect that shields you from it. */
  ward: string;
}

export interface RealmTemplate {
  id: string;
  name: string;
  /** Difficulty band, I to V. */
  band: number;
  note: string;
  /** Open sky, or rock overhead. */
  sky: 'open' | 'cavern';
  /** Air temperature. */
  temp: number;
  /** Faint light in the dark, and how much daylight reaches open air (1 is full). */
  ambient: [number, number, number];
  daylight: number;
  /** The wall behind open ground below the surface. */
  wall: number;
  hazard: RealmHazard;
  /** Items: the fragment three of which make a key, the key, its signature material, relic, and trophy. */
  fragment: string;
  key: string;
  material: string;
  relic: string;
  boss: string;
  elite: string;
  music: string;
  /** Ores the Rich Veins modifier doubles. */
  ores: string[];
  nodes: [kind: string, weight: number][];
  nodeCount: number;
  mobs: { type: string; weight: number; air?: boolean }[];
  mobCount: number;
  chests: number;
  chestLoot: Loot[];
  /** Region data for the HUD, temperature, and the journal. */
  biome: Biome;
  build(seed: number): RealmGeometry;
  /** Anything beyond the common scatter: set pieces, vaults, and landmarks. */
  extra?(geo: RealmGeometry, ctx: RealmCtx): void;
}
