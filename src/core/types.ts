// Shared shapes for game data and the saved field record.

export type ItemCategory =
  | 'material'
  | 'ore'
  | 'food'
  | 'water'
  | 'medicine'
  | 'metal'
  | 'tool'
  | 'weapon'
  | 'clothing'
  | 'trophy'
  | 'structure';

export interface Point {
  x: number;
  y: number;
}

// ─── Static data ────────────────────────────────────────────────────────────
export interface Biome {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  shade: string;
  temp: number;
  note: string;
  resources: string[];
}
/** Display name, category, and (for perishables) seconds until spoiled. */
export type ItemSpec = [name: string, category: ItemCategory, freshSeconds?: number];
export interface Recipe {
  id: string;
  cost: Record<string, number>;
  station: string | null;
  tier: number;
}
export interface NodeSpec {
  yield: [number, number];
  tool?: 'axe' | 'pick';
  req?: number;
  hp: number;
  regen: number;
}
/** Tool family and tier granted by carrying a tool. */
export type ToolTier = ['axe' | 'pick', number];
/** Weapon tier, damage, and reach. */
export type WeaponSpec = [tier: number, damage: number, reach: number];
export interface BossSpec {
  name: string;
  kills: number;
  hp: number;
  bite: number;
  rewards: Record<string, number>;
  xp: number;
  color: string;
  glow: string;
}
export interface Disease {
  name: string;
  cause: string;
  treat: string;
  item: string;
}
/** A field task: label, tally key, and required count. */
export type Objective = [label: string, key: string, count: number];

// ─── Saved state ────────────────────────────────────────────────────────────
export interface InventoryEntry {
  id: string;
  qty: number;
  fresh?: number;
}
export interface ResourceNode extends Point {
  id: number;
  kind: string;
  hp: number;
  depletedUntil: number;
  phase: number;
  underground?: boolean;
  /** When the node was last struck, for the hit shake. */
  hitAt?: number;
  /** When a tree was felled; it topples, then stands as a stump until it regrows. */
  felledAt?: number;
  /** Which way a felled tree falls: 1 east, -1 west. */
  fallDir?: number;
}
/** Materials lying in the world, waiting to be picked up. */
export interface Drop extends Point {
  id: number;
  item: string;
  qty: number;
  vx: number;
  vy: number;
  /** Game time the drop appeared; drops cannot be collected for a moment after. */
  born: number;
  resting: boolean;
}
/** A passing event for the renderer and audio: felling, crumbling, chips, pickups. */
export interface WorldEvent extends Point {
  type: 'chip' | 'fell' | 'crumble' | 'dig' | 'pickup' | 'sizzle';
  kind: string;
  dir?: number;
}
export interface Animal extends Point {
  id: number;
  type: string;
  homeX: number;
  homeY: number;
  hp: number;
  maxHp: number;
  angle: number;
  wanderAt: number;
  attackAt: number;
  deadUntil: number;
  warning: number;
  phase: number;
  /** Cave tunnel a flier patrols, or the underground floor a walker keeps to. */
  tunnel?: number;
  underground?: boolean;
  companion?: boolean;
  hitAt?: number;
  howlAt?: number;
  howlCue?: number;
}
export interface Structure extends Point {
  id: number;
  type: string;
  fuel: number;
  water: number;
  store: Record<string, number>;
  crop: string | null;
  plantedAt: number;
  triggeredAt: number;
}
export interface FieldCache extends Point {
  id: number;
  opened: boolean;
  biome: string;
  /** Set for caches found underground, which hold deeper supplies. */
  layer?: string;
}
export interface Player extends Point {
  vx: number;
  vy: number;
  grounded: boolean;
  face: number;
  moving: boolean;
  weapon: string;
  cloak: boolean;
  coat: boolean;
  boots: boolean;
  ward?: boolean;
  attackAt: number;
  invuln: number;
}
export interface Vitals {
  health: number;
  hydration: number;
  calories: number;
  protein: number;
  stamina: number;
  fatigue: number;
  bodyTemp: number;
  wetness: number;
  illness: number;
  infection: number;
  hygiene: number;
  morale: number;
}
export interface Altar {
  level: number;
  xp: number;
  attuned: string | null;
  kills: number;
  activeBoss: number | null;
}
export interface GameState {
  version: number;
  layout?: number;
  seed: number;
  elapsed: number;
  day: number;
  weather: string;
  weatherNext: number;
  player: Player;
  vitals: Vitals;
  disease: string | null;
  inventory: InventoryEntry[];
  nodes: ResourceNode[];
  animals: Animal[];
  structures: Structure[];
  caches: FieldCache[];
  tiles: number[];
  /** Tiles changed from the generated world, by index; saves store only these. */
  tileEdits: Record<number, number>;
  drops: Drop[];
  effects: unknown[];
  tutorial: { step: number; tally: Record<string, number> };
  chapter: number;
  discoveries: string[];
  altar: Altar;
  placing: string | null;
  dead: boolean;
  lastSave: number;
}

// ─── Results and messages ───────────────────────────────────────────────────
export interface GameResult {
  ok: boolean;
  reason?: string;
  action?: string;
  structure?: Structure;
  hit?: boolean;
  caught?: boolean;
  item?: string;
  id?: string;
  qty?: number;
  target?: Animal;
}
export type Interactable =
  | { object: ResourceNode; type: 'node'; d: number }
  | { object: Structure; type: 'structure'; d: number }
  | { object: FieldCache; type: 'cache'; d: number };
export interface GameMessage {
  message: string;
  tone: string;
  at: number;
}
export interface SaveStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
}
