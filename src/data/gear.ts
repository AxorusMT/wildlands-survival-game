// Gear beyond the first tools: armour sets, ranged and magic weapons, ammunition, placeable
// blocks, potions and the buffs they give, and accessories. Item names live in items.ts.
import { GEN_PROJECTILES, GEN_RANGED } from './weapons.ts';

/** An armour slot and the defense a piece grants. */
export type ArmorSlot = 'head' | 'body' | 'legs';
export interface ArmorPiece {
  slot: ArmorSlot;
  defense: number;
  set: string;
}
/** Material sets, weakest to strongest: display name, defense per slot, and the set bonus. */
export const ARMOR_SETS: {
  key: string;
  name: string;
  bar: string;
  defense: [number, number, number];
  station: string;
  tier: number;
  bonus: string;
  bonusText: string;
}[] = [
  {
    key: 'copper',
    name: 'Copper',
    bar: 'copper_ingot',
    defense: [1, 2, 1],
    station: 'workbench',
    tier: 2,
    bonus: 'defense2',
    bonusText: '+2 defense',
  },
  {
    key: 'iron',
    name: 'Iron',
    bar: 'iron_ingot',
    defense: [2, 3, 2],
    station: 'workbench',
    tier: 3,
    bonus: 'defense3',
    bonusText: '+3 defense',
  },
  {
    key: 'silver',
    name: 'Silver',
    bar: 'silver_ingot',
    defense: [2, 4, 2],
    station: 'workbench',
    tier: 3,
    bonus: 'speed10',
    bonusText: '+10% speed',
  },
  {
    key: 'gold',
    name: 'Gold',
    bar: 'gold_ingot',
    defense: [3, 4, 3],
    station: 'workbench',
    tier: 4,
    bonus: 'defense4',
    bonusText: '+4 defense',
  },
  {
    key: 'tidecaller',
    name: 'Tidecaller',
    bar: 'crab_shell',
    defense: [3, 5, 3],
    station: 'workbench',
    tier: 4,
    bonus: 'swim',
    bonusText: 'Wade and swim freely; tides do not chill you',
  },
  {
    key: 'ashwalker',
    name: 'Ashwalker',
    bar: 'ashcloth',
    defense: [3, 4, 3],
    station: 'workbench',
    tier: 4,
    bonus: 'ashward',
    bonusText: 'Ash storms cannot blind or choke you; +10% speed',
  },
  {
    key: 'amberguard',
    name: 'Amberguard',
    bar: 'burrow_amber',
    defense: [4, 6, 4],
    station: 'workbench',
    tier: 5,
    bonus: 'tremor',
    bonusText: 'Sense cave-ins; falling rock does half damage; +2 defense',
  },
  // ── Archetypes, in three bands ──
  {
    key: 'warden',
    name: 'Warden',
    bar: 'iron_ingot',
    defense: [3, 5, 3],
    station: 'workbench',
    tier: 3,
    bonus: 'vanguard',
    bonusText: 'Vanguard: +3 defense; biters take a quarter of their blow back',
  },
  {
    key: 'bulwark',
    name: 'Bulwark',
    bar: 'hellstone_ingot',
    defense: [6, 9, 6],
    station: 'forge',
    tier: 6,
    bonus: 'vanguard',
    bonusText: 'Vanguard: +3 defense; biters take a quarter of their blow back',
  },
  {
    key: 'aegis',
    name: 'Aegis',
    bar: 'starmetal_ingot',
    defense: [11, 15, 11],
    station: 'starforge',
    tier: 9,
    bonus: 'vanguard',
    bonusText: 'Vanguard: +3 defense; biters take a quarter of their blow back',
  },
  {
    key: 'stalker',
    name: 'Stalker',
    bar: 'iron_ingot',
    defense: [2, 3, 2],
    station: 'workbench',
    tier: 3,
    bonus: 'ranger',
    bonusText: 'Ranger: +10% critical chance; a quarter of arrows kept',
  },
  {
    key: 'farstrider',
    name: 'Farstrider',
    bar: 'hellstone_ingot',
    defense: [4, 6, 4],
    station: 'forge',
    tier: 6,
    bonus: 'ranger',
    bonusText: 'Ranger: +10% critical chance; a quarter of arrows kept',
  },
  {
    key: 'windrider',
    name: 'Windrider',
    bar: 'starmetal_ingot',
    defense: [8, 11, 8],
    station: 'starforge',
    tier: 9,
    bonus: 'ranger',
    bonusText: 'Ranger: +10% critical chance; a quarter of arrows kept',
  },
  {
    key: 'acolyte',
    name: 'Acolyte',
    bar: 'iron_ingot',
    defense: [1, 2, 1],
    station: 'workbench',
    tier: 3,
    bonus: 'arcanist',
    bonusText: 'Arcanist: +40 mana; spells cost 20% less',
  },
  {
    key: 'magus',
    name: 'Magus',
    bar: 'hellstone_ingot',
    defense: [3, 4, 3],
    station: 'forge',
    tier: 6,
    bonus: 'arcanist',
    bonusText: 'Arcanist: +40 mana; spells cost 20% less',
  },
  {
    key: 'archon',
    name: 'Archon',
    bar: 'starmetal_ingot',
    defense: [6, 8, 6],
    station: 'starforge',
    tier: 9,
    bonus: 'arcanist',
    bonusText: 'Arcanist: +40 mana; spells cost 20% less',
  },
  {
    key: 'drifter',
    name: 'Drifter',
    bar: 'iron_ingot',
    defense: [2, 3, 2],
    station: 'workbench',
    tier: 3,
    bonus: 'wayfarer',
    bonusText: 'Wayfarer: food keeps longer, cold and heat bite less, sickness shrugged off',
  },
  {
    key: 'nomad',
    name: 'Nomad',
    bar: 'hellstone_ingot',
    defense: [4, 6, 4],
    station: 'forge',
    tier: 6,
    bonus: 'wayfarer',
    bonusText: 'Wayfarer: food keeps longer, cold and heat bite less, sickness shrugged off',
  },
  {
    key: 'voyager',
    name: 'Voyager',
    bar: 'starmetal_ingot',
    defense: [8, 11, 8],
    station: 'starforge',
    tier: 9,
    bonus: 'wayfarer',
    bonusText: 'Wayfarer: food keeps longer, cold and heat bite less, sickness shrugged off',
  },
  {
    key: 'steel',
    name: 'Steel',
    bar: 'steel_ingot',
    defense: [3, 5, 3],
    station: 'forge',
    tier: 4,
    bonus: 'damage10',
    bonusText: '+10% damage',
  },
  {
    key: 'obsidian',
    name: 'Obsidian',
    bar: 'obsidian',
    defense: [4, 6, 4],
    station: 'forge',
    tier: 5,
    bonus: 'heat',
    bonusText: 'Hell heat halved',
  },
  {
    key: 'hellstone',
    name: 'Hellstone',
    bar: 'hellstone_ingot',
    defense: [5, 7, 5],
    station: 'forge',
    tier: 6,
    bonus: 'fire',
    bonusText: 'Lava burns less; strikes ignite',
  },
  {
    key: 'crypt',
    name: 'Cryptwarden',
    bar: 'grave_dust',
    defense: [5, 7, 6],
    station: 'forge',
    tier: 6,
    bonus: 'mana40',
    bonusText: '+40 mana, magic +15%',
  },
  {
    key: 'frost',
    name: 'Rimeguard',
    bar: 'frost_shard',
    defense: [6, 8, 6],
    station: 'forge',
    tier: 6,
    bonus: 'cold',
    bonusText: 'Immune to cold; +10% speed',
  },
  {
    key: 'sun',
    name: 'Sunforged',
    bar: 'sun_gold',
    defense: [6, 9, 7],
    station: 'forge',
    tier: 7,
    bonus: 'regen',
    bonusText: 'Health regenerates in light',
  },
  {
    key: 'cinder',
    name: 'Cinderplate',
    bar: 'cinder_core',
    defense: [7, 10, 8],
    station: 'forge',
    tier: 7,
    bonus: 'lava',
    bonusText: 'Immune to hell heat and lava',
  },
  {
    key: 'myconite',
    name: 'Myconite',
    bar: 'myconite_ingot',
    defense: [8, 11, 9],
    station: 'starforge',
    tier: 8,
    bonus: 'spores',
    bonusText: 'Regenerate; spores harm foes near you',
  },
  {
    key: 'starmetal',
    name: 'Starmetal',
    bar: 'starmetal_ingot',
    defense: [10, 13, 11],
    station: 'starforge',
    tier: 9,
    bonus: 'speed',
    bonusText: '+20% speed, higher jumps',
  },
  {
    key: 'voidsteel',
    name: 'Voidsteel',
    bar: 'voidsteel_ingot',
    defense: [12, 16, 13],
    station: 'starforge',
    tier: 10,
    bonus: 'void',
    bonusText: '+20% damage, +8 defense',
  },
];
/** What each band of archetype armour needs besides its metal. */
const ARCHETYPE_EXTRA: Record<number, Record<string, number>> = {
  3: { hide: 2, fiber: 4 },
  6: { obsidian: 2, silk: 3 },
  9: { sky_silk: 3, crystal: 2 },
};
const SLOTS: [ArmorSlot, string, string, number][] = [
  ['head', 'helmet', 'helmet', 10],
  ['body', 'chestplate', 'chestplate', 16],
  ['legs', 'greaves', 'greaves', 12],
];
export const ARMOR: Record<string, ArmorPiece> = Object.fromEntries(
  ARMOR_SETS.flatMap((s) =>
    SLOTS.map(([slot, suffix], i) => [
      `${s.key}_${suffix}`,
      { slot, defense: s.defense[i], set: s.key },
    ]),
  ),
);
/** Generated armour item names and recipes (ingots per piece by slot). */
export const ARMOR_ITEMS: [id: string, name: string][] = ARMOR_SETS.flatMap((s) =>
  SLOTS.map(
    ([, suffix, label]) => [`${s.key}_${suffix}`, `${s.name} ${label}`] as [string, string],
  ),
);
export const ARMOR_RECIPES: [string, Record<string, number>, string, number][] = ARMOR_SETS.flatMap(
  (s) =>
    SLOTS.map(([, suffix, , bars]) => {
      const n = Math.max(4, Math.round(bars * (s.bar === 'obsidian' ? 1 : 0.6)));
      const extra: Record<string, number> =
        s.key === 'crypt'
          ? { bone: 6, steel_ingot: 3 }
          : s.key === 'frost'
            ? { ice: 8, steel_ingot: 3 }
            : s.key === 'sun'
              ? { sand: 10, steel_ingot: 3 }
              : s.key === 'cinder'
                ? { obsidian: 6, hellstone_ingot: 3 }
                : ARCHETYPE_EXTRA[s.tier] &&
                    ['vanguard', 'ranger', 'arcanist', 'wayfarer'].includes(s.bonus)
                  ? ARCHETYPE_EXTRA[s.tier]
                  : suffix === 'chestplate'
                    ? { hide: 2 }
                    : {};
      return [`${s.key}_${suffix}`, { [s.bar]: n, ...extra }, s.station, s.tier] as [
        string,
        Record<string, number>,
        string,
        number,
      ];
    }),
);

/** Ranged and magic weapons: what they fire and what each shot costs. */
export interface RangedSpec {
  kind: 'bow' | 'magic';
  projectile: string;
  /** Seconds between shots. */
  delay: number;
  speed: number;
  /** Mana per cast for magic. */
  mana?: number;
  /** Projectiles per shot and the spread between them (radians). */
  count?: number;
  spread?: number;
}
export const RANGED: Record<string, RangedSpec> = {
  wooden_bow: { kind: 'bow', projectile: 'arrow', delay: 0.62, speed: 620 },
  iron_bow: { kind: 'bow', projectile: 'arrow', delay: 0.5, speed: 720 },
  bone_bow: { kind: 'bow', projectile: 'arrow', delay: 0.42, speed: 800 },
  storm_bow: { kind: 'bow', projectile: 'arrow', delay: 0.36, speed: 900, count: 2, spread: 0.07 },
  ember_wand: { kind: 'magic', projectile: 'ember', delay: 0.38, speed: 560, mana: 5 },
  lich_staff: {
    kind: 'magic',
    projectile: 'bone_shard',
    delay: 0.5,
    speed: 640,
    mana: 9,
    count: 3,
    spread: 0.16,
  },
  glacier_staff: { kind: 'magic', projectile: 'icicle', delay: 0.42, speed: 760, mana: 8 },
  sun_staff: { kind: 'magic', projectile: 'sun_bolt', delay: 0.5, speed: 520, mana: 10 },
  ruby_staff: { kind: 'magic', projectile: 'ruby_bolt', delay: 0.45, speed: 620, mana: 5 },
  brine_wand: {
    kind: 'magic',
    projectile: 'brine_bolt',
    delay: 0.36,
    speed: 560,
    mana: 5,
    count: 2,
    spread: 0.12,
  },
  ember_sling: { kind: 'magic', projectile: 'kiln_ember', delay: 0.5, speed: 520, mana: 6 },
  amber_repeater: { kind: 'bow', projectile: 'arrow', delay: 0.26, speed: 900 },
  sapphire_staff: { kind: 'magic', projectile: 'sapphire_bolt', delay: 0.4, speed: 680, mana: 6 },
  emerald_staff: {
    kind: 'magic',
    projectile: 'emerald_bolt',
    delay: 0.42,
    speed: 650,
    mana: 6,
    count: 2,
    spread: 0.1,
  },
  spore_staff: {
    kind: 'magic',
    projectile: 'spore',
    delay: 0.34,
    speed: 420,
    mana: 9,
    count: 2,
    spread: 0.3,
  },
  void_staff: { kind: 'magic', projectile: 'void_beam', delay: 0.3, speed: 1100, mana: 12 },
  ...GEN_RANGED,
};
/** Arrows: extra damage and a special effect. */
export const AMMO: Record<string, { damage: number; effect?: 'fire' | 'pierce' }> = {
  arrow: { damage: 6 },
  fire_arrow: { damage: 10, effect: 'fire' },
  crystal_arrow: { damage: 16, effect: 'pierce' },
};
/** Projectile look and behaviour, shared by the player's shots and monsters'. */
export interface ProjectileSpec {
  color: string;
  glow?: string;
  gravity?: number;
  life: number;
  pierce?: number;
  homing?: number;
  /** Radius in world pixels for hits. */
  size: number;
  /** Lingering clouds slow down and hang in the air. */
  drag?: number;
  fire?: boolean;
}
export const PROJECTILES: Record<string, ProjectileSpec> = {
  arrow: { color: '#d8c79a', gravity: 380, life: 2.5, size: 8 },
  ember: { color: '#ff8a3a', glow: '#ffb347', life: 1.4, size: 9, fire: true },
  bone_shard: { color: '#e6dcc6', life: 1.3, size: 8 },
  icicle: { color: '#bfe8f8', glow: '#dff6ff', life: 1.4, size: 8, pierce: 2 },
  sun_bolt: { color: '#ffd86a', glow: '#fff0a0', life: 2.2, size: 11, homing: 3.2 },
  spore: { color: '#58e0d0', glow: '#9ef0e0', life: 2.4, size: 12, homing: 2.2, drag: 0.6 },
  void_beam: { color: '#d8a0ff', glow: '#b36cff', life: 0.9, size: 10, pierce: 4 },
  ruby_bolt: { color: '#ff5a6a', glow: '#ff8a9a', life: 1.1, size: 8 },
  sapphire_bolt: { color: '#5a8aff', glow: '#9ac0ff', life: 1.1, size: 8, pierce: 1 },
  emerald_bolt: { color: '#4ae07a', glow: '#9af0b0', life: 1.1, size: 8 },
  brine_bolt: { color: '#5ac8c0', glow: '#9af0e8', life: 1.2, size: 8, pierce: 1 },
  kiln_ember: { color: '#ff8a3a', glow: '#ffc070', life: 1.8, size: 12, gravity: 420, fire: true },
  // Realm monsters.
  brine_spit: { color: '#6ac0b0', glow: '#9af0e8', life: 2, size: 10, gravity: 300 },
  falling_rock: { color: '#8a6a44', life: 3, size: 14, gravity: 900 },
  amber_glob: { color: '#e8a030', glow: '#ffd070', life: 2.4, size: 10, gravity: 260 },
  ash_burst: { color: '#9a8a7a', glow: '#c8a080', life: 1.4, size: 16, drag: 1.2 },
  // Monster attacks.
  dart: { color: '#8a9058', life: 2.2, size: 7 },
  fireball: { color: '#ff6a2a', glow: '#ffb347', life: 2.6, size: 12, fire: true },
  frost_bolt: { color: '#9fd8ec', glow: '#dff6ff', life: 2.4, size: 10 },
  feather: { color: '#e8e0d0', life: 2, size: 8 },
  spore_cloud: { color: '#6ac8a0', glow: '#58e0d0', life: 5, size: 26, drag: 2.2 },
  shockwave: { color: '#dff6ff', glow: '#9fd8ec', life: 1.6, size: 18, pierce: 99 },
  lightning: { color: '#fff8c0', glow: '#fff0a0', life: 0.5, size: 18, pierce: 99 },
  eye_beam: { color: '#ff5a8a', glow: '#ff9ac0', life: 2.4, size: 11 },
  flame_jet: { color: '#ffb347', glow: '#ff6a2a', life: 0.7, size: 16, fire: true, pierce: 99 },
  ...GEN_PROJECTILES,
};

/** Placeable blocks: item to tile kind. */
export const BLOCKS: Record<string, number> = {
  dirt: 1,
  stone: 2,
  sand: 3,
  ice: 5,
  planks: 11,
  stone_brick: 12,
  clay_brick: 13,
  glass: 14,
  crypt_brick: 15,
  frost_brick: 16,
  tomb_brick: 17,
  citadel_brick: 18,
  mycelium: 19,
  fungal_stone: 20,
  cloud: 21,
  skystone: 22,
  voidstone: 23,
  void_crystal: 24,
  obsidian_brick: 25,
  sandstone_brick: 26,
  glowshroom_block: 28,
  brinesoil: 30,
  ash_soil: 31,
  kilnrock: 32,
  warren_earth: 33,
  amberstone: 34,
};

/** Timed effects from potions and some foods. Values are seconds of duration when drunk. */
export const BUFFS: Record<string, { name: string; text: string; color: string }> = {
  swiftness: { name: 'Swiftness', text: '+25% speed', color: '#8ad0f0' },
  ironskin: { name: 'Ironskin', text: '+8 defense', color: '#c8c0a0' },
  regeneration: { name: 'Regeneration', text: 'Health regenerates', color: '#e87a8a' },
  shine: { name: 'Shine', text: 'You glow in the dark', color: '#fff0a0' },
  mining: { name: 'Delving', text: 'Mine faster, use less stamina', color: '#d8a060' },
  featherfall: { name: 'Featherfall', text: 'Fall slowly; no fall damage', color: '#e8e8f8' },
  fireward: { name: 'Fireward', text: 'Immune to heat and lava', color: '#ff8a3a' },
  wrath: { name: 'Wrath', text: '+15% damage', color: '#d04a4a' },
  potion_sickness: { name: 'Potion sickness', text: 'Healing draughts rest', color: '#8a8070' },
  // The comfort of a good meal.
  well_fed: { name: 'Well fed', text: 'Health and stamina recover faster', color: '#e8b84a' },
  fiery: { name: 'Fiery', text: '+10% damage', color: '#ff8a3a' },
  sweet: { name: 'Sugar rush', text: '+10% speed', color: '#f0a0c0' },
  clear_mind: { name: 'Clear mind', text: 'Mana returns twice as fast', color: '#8ab0f0' },
  warm_belly: { name: 'Warm belly', text: 'The cold bites less', color: '#e87a3a' },
  feasted: { name: 'Feasted', text: 'Recover faster; +10% damage', color: '#f0c860' },
  iron_gut: {
    name: 'Iron gut',
    text: 'Shrug off half of what you catch from food and water',
    color: '#8a9a6a',
  },
};
/** Potions: instant healing or mana, and the buff each gives with its duration. */
export const POTIONS: Record<string, { heal?: number; mana?: number; buff?: [string, number] }> = {
  healing_draught: { heal: 60 },
  greater_healing: { heal: 150 },
  mana_draught: { mana: 80 },
  swiftness_potion: { buff: ['swiftness', 240] },
  ironskin_potion: { buff: ['ironskin', 240] },
  regeneration_potion: { buff: ['regeneration', 240] },
  shine_potion: { buff: ['shine', 300] },
  delving_potion: { buff: ['mining', 240] },
  featherfall_potion: { buff: ['featherfall', 240] },
  fireward_potion: { buff: ['fireward', 240] },
  wrath_potion: { buff: ['wrath', 240] },
};

/** Accessories: up to three worn at once. */
export const ACCESSORIES: Record<string, { effects: string[]; text: string }> = {
  scarab_charm: { effects: ['defense4'], text: '+4 defense' },
  demon_wings: { effects: ['double_jump', 'glide'], text: 'Double jump; hold jump to glide' },
  wind_boots: { effects: ['speed20', 'jump'], text: '+20% speed, higher jumps' },
  mycelial_charm: { effects: ['regen'], text: 'Regenerate health' },
  cloud_jar: { effects: ['double_jump'], text: 'Double jump' },
  insulated_satchel: {
    effects: ['cool25'],
    text: 'Food in the pack keeps 25% longer; ice melts slower',
  },
  frost_lined_pack: { effects: ['cool50'], text: 'Food in the pack keeps twice as long' },
  rime_lined_pack: { effects: ['cool70'], text: 'Food in the pack keeps over three times as long' },
  tide_conch: { effects: ['swim', 'defense2'], text: 'Swim with the tide; +2 defense' },
  kiln_heart: { effects: ['ashward', 'fire'], text: 'Ash storms pass you by; strikes may ignite' },
  queens_mandible: { effects: ['tremor', 'damage10'], text: 'Sense cave-ins; +10% damage' },
  miners_lamp: { effects: ['light'], text: 'Light around you' },
  magma_stone: { effects: ['lava'], text: 'Resist lava and heat' },
  watcher_eye: { effects: ['damage10', 'light'], text: '+10% damage; see in the dark' },
  band_of_vigor: { effects: ['regen', 'stamina'], text: 'Regenerate health and stamina' },
  hollow_crown: { effects: ['mana40', 'magic15'], text: '+40 mana, magic +15%' },
  wildlands_crown: {
    effects: ['damage10', 'defense4', 'regen', 'light'],
    text: 'The crown of the wildlands',
  },
};

/** Life and mana from crystals: how much each gives and the most they can add. */
export const CRYSTALS = {
  lifePer: 20,
  lifeMax: 200,
  manaPer: 20,
  manaMax: 180,
  baseHealth: 100,
  baseMana: 20,
} as const;
