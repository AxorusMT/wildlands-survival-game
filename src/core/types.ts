// Shared shapes for game data and the saved field record.
import type { RealmInstance } from '../data/realms/index.ts';

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
  | 'structure'
  | 'armor'
  | 'accessory'
  | 'block'
  | 'potion'
  | 'ammo'
  | 'key'
  | 'wall'
  | 'coin';

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
  /** How many one craft makes (1 unless set). */
  yield?: number;
}
export interface NodeSpec {
  yield: [number, number];
  tool?: 'axe' | 'pick';
  req?: number;
  hp: number;
  regen: number;
}
/** Tool family and tier granted by carrying a tool. */
export type ToolTier = ['axe' | 'pick' | 'hammer', number];
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
  /** The treatment to reach for first. */
  item: string;
  kind: 'illness' | 'infection' | 'exposure' | 'injury';
  /** Seconds without symptoms before it shows; then seconds per stage as it worsens untreated. */
  incubate: number;
  worsen: number;
  /** Seconds to pass off by itself while mild, if you are fed, watered, and warm. */
  recover?: number;
  /** What it does per second at full force (scaled by stage). Regen and speed are fractions lost. */
  effect: {
    hp?: number;
    hydration?: number;
    calories?: number;
    protein?: number;
    stamina?: number;
    speed?: number;
    regen?: number;
  };
  /** Treatments and how many stages each lifts. */
  cures: Record<string, number>;
  /** Treatments stop working once it reaches this stage. */
  lateCure?: number;
  /** What it may lead to while critical: ailment and chance per second. */
  chain?: [string, number];
  /** Seconds of immunity once it is gone. */
  immunity?: number;
  symptoms: [string, string, string];
}
/** An ailment you carry: its stage (0 incubating, 1 mild, 2 severe, 3 critical) and its clock. */
export interface Ailment {
  id: string;
  stage: number;
  /** When it next worsens (or shows, while incubating). */
  next: number;
  /** When it began. */
  since: number;
  /** Seconds spent mild in good health, toward passing off. */
  mend?: number;
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
  type: 'chip' | 'fell' | 'crumble' | 'dig' | 'pickup' | 'sizzle' | 'sfx' | 'damage' | 'burst';
  kind: string;
  dir?: number;
  /** Loudness for sound events, around 1. */
  v?: number;
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
  /** Height a summoned walker keeps to, so it stays on the floor where it was called. */
  walkY?: number;
  /** Height a summoned flier hovers around. */
  hoverY?: number;
  /** A deer that has bolted keeps running until it is well clear. */
  fleeing?: boolean;
  /** Creatures of the deep places move with real physics against the tiles. */
  body?: boolean;
  vx?: number;
  vy?: number;
  grounded?: boolean;
  /** Timers for a boss's or monster's special moves, by name. */
  timers?: Record<string, number>;
  /** Summoned by a boss; gone when the fight ends. */
  minion?: boolean;
  /** A settler of the town, by id; settlers cannot be harmed. */
  settler?: string;
  /** Afflictions from weapons: damage over time (until, per second), and timed effects. */
  fx?: {
    bleed?: [number, number];
    burn?: [number, number];
    poison?: [number, number];
    slow?: number;
    stun?: number;
    sunder?: number;
    mark?: [number, number];
  };
  /** Damage over time not yet shown as a number. */
  dotShown?: number;
  /** A Hunted realm's elite, which tracks the player. */
  hunter?: boolean;
  /** Split from a slain monster in an Echoing realm; does not split again or return. */
  echo?: boolean;
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
  /** Food kept cold in a larder (iceboxes, cellars, frost chests), each with its own freshness. */
  larder?: InventoryEntry[];
  crop: string | null;
  plantedAt: number;
  triggeredAt: number;
  /** What a world furnishing belongs to: a boss for an altar, a dimension for a portal, a trap's facing. */
  kind?: string;
  /** Part of a dungeon or dimension, not built by the player. */
  fixed?: boolean;
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
  /** Worn armour, by slot: item ids. */
  armor?: { head?: string; body?: string; legs?: string };
  /** When the held item was last used, for its animation. */
  usedAt?: number;
  /** Aim angle from level toward the cursor, up negative (radians). */
  aim?: number;
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
  /** Fruit, greens, and preserves; run out for long and scurvy sets in. */
  vitamins: number;
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
  /** The worst ailment showing symptoms (kept for the journal and older records). */
  disease: string | null;
  /** Every ailment carried, incubating or showing, and immunities won (until game time). */
  ailments?: Ailment[];
  immune?: Record<string, number>;
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
  /** Ten quick slots of item ids, and which is in hand. */
  hotbar: (string | null)[];
  hotbarIndex: number;
  /** Accessories worn (up to three). */
  accessories: string[];
  maxHealth: number;
  mana: number;
  maxMana: number;
  /** Seconds left on each timed effect. */
  buffs: Record<string, number>;
  /** Bosses of the deep places: times defeated. */
  bosses: Record<string, number>;
  /** Sigils set into the Rift Gate. */
  rift: { sigils: string[] };
  /** Back walls changed from the world's own, by tile index: a ground kind, or -1 for none. */
  wallEdits: Record<number, number>;
  /** Where the player wakes after a fall: their bed. */
  spawn?: { x: number; y: number } | null;
  /** Each settler's home, by settler id: the seat of their room. */
  town: { homes: Record<string, { x: number; y: number }> };
  /** Lasting progress: renown earned, skills learned, and damage dealt with each weapon family. */
  meta?: {
    renown: number;
    skills: string[];
    mastery: Record<string, number>;
    /** Feats earned, and the one whose title is worn. */
    feats?: string[];
    title?: string;
  };
  /** Every weapon kind owned: its quality, level, infusion, gems, and evolutions. */
  armoury?: Record<string, { q: number; lvl: number; inf?: string; gems: string[]; evo: string[] }>;
  /** The generated realm open in the pocket strip, if any. */
  pocket?: RealmInstance | null;
  /** What the expedition has done in each realm. */
  realms?: Record<string, { visits: number; best: number; kills: number; relic: boolean }>;
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
  settler?: string;
}
export type Interactable =
  | { object: ResourceNode; type: 'node'; d: number }
  | { object: Structure; type: 'structure'; d: number }
  | { object: FieldCache; type: 'cache'; d: number }
  | { object: Animal; type: 'settler'; d: number };
export interface GameMessage {
  message: string;
  tone: string;
  at: number;
}
export interface SaveStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
}
