// The weapon hierarchy: one table governs every weapon. Eleven material tiers (a twelfth waits
// beyond the Fractured Realms) times ten families, each family with a signature mechanic that
// holds at every tier. Every weapon then has its own upgrade line: a quality rolled when found,
// +1 to +10 at the anvil with a choice of evolution at +5 and +10, an infusion, and gem sockets.

export interface WeaponTier {
  tier: number;
  /** Id prefix and display name of the material. */
  mat: string;
  name: string;
  /** What each weapon of the tier is made from, and where. */
  bar: string;
  station: string | null;
  /** Base damage for a blade of this tier; other families scale from it. */
  base: number;
  color: string;
  glow: string;
}
export const TIERS: WeaponTier[] = [
  {
    tier: 1,
    mat: 'flint',
    name: 'Flint',
    bar: 'flint',
    station: null,
    base: 16,
    color: '#8a9094',
    glow: '#c8d0d4',
  },
  {
    tier: 2,
    mat: 'copper',
    name: 'Copper',
    bar: 'copper_ingot',
    station: 'workbench',
    base: 26,
    color: '#d0844a',
    glow: '#f0b070',
  },
  {
    tier: 3,
    mat: 'iron',
    name: 'Iron',
    bar: 'iron_ingot',
    station: 'workbench',
    base: 38,
    color: '#a8a4a0',
    glow: '#e0dcd8',
  },
  {
    tier: 4,
    mat: 'steel',
    name: 'Steel',
    bar: 'steel_ingot',
    station: 'forge',
    base: 50,
    color: '#dfe3e6',
    glow: '#ffffff',
  },
  {
    tier: 5,
    mat: 'obsidian',
    name: 'Obsidian',
    bar: 'obsidian',
    station: 'forge',
    base: 64,
    color: '#4a3a64',
    glow: '#a07fd0',
  },
  {
    tier: 6,
    mat: 'hellstone',
    name: 'Hellstone',
    bar: 'hellstone_ingot',
    station: 'forge',
    base: 80,
    color: '#e04a2a',
    glow: '#ff8a3a',
  },
  {
    tier: 7,
    mat: 'cinder',
    name: 'Cinder',
    bar: 'cinder_core',
    station: 'forge',
    base: 100,
    color: '#ff8a3a',
    glow: '#ffc070',
  },
  {
    tier: 8,
    mat: 'myconite',
    name: 'Myconite',
    bar: 'myconite_ingot',
    station: 'starforge',
    base: 126,
    color: '#58e0d0',
    glow: '#9ef0e0',
  },
  {
    tier: 9,
    mat: 'starmetal',
    name: 'Starmetal',
    bar: 'starmetal_ingot',
    station: 'starforge',
    base: 154,
    color: '#f8e08a',
    glow: '#fff4c0',
  },
  {
    tier: 10,
    mat: 'voidsteel',
    name: 'Voidsteel',
    bar: 'voidsteel_ingot',
    station: 'starforge',
    base: 192,
    color: '#b36cff',
    glow: '#d8a8ff',
  },
  {
    tier: 11,
    mat: 'rift',
    name: 'Riftforged',
    bar: 'void_essence',
    station: 'starforge',
    base: 240,
    color: '#ff6ad5',
    glow: '#ffb0ec',
  },
];
export const tierOf = (t: number) => TIERS[Math.max(0, Math.min(TIERS.length - 1, t - 1))];

export type FamilyId =
  | 'blade'
  | 'greatsword'
  | 'spear'
  | 'battleaxe'
  | 'warhammer'
  | 'whip'
  | 'bow'
  | 'crossbow'
  | 'staff'
  | 'tome';
export interface WeaponFamily {
  id: FamilyId;
  name: string;
  /** The signature mechanic, in a line. */
  text: string;
  ranged?: 'bow' | 'magic';
  /** Damage against the tier's base, reach (melee), and swing time against the standard. */
  dmg: number;
  reach: number;
  pace: number;
  /** Id suffix, bars per weapon, and extra materials. */
  suffix: string;
  bars: number;
  extra: Record<string, number>;
}
export const FAMILIES: WeaponFamily[] = [
  {
    id: 'blade',
    name: 'Blade',
    text: 'Every third blow in quick succession strikes for ×1.8',
    dmg: 1,
    reach: 64,
    pace: 1,
    suffix: 'sword',
    bars: 5,
    extra: { wood: 2 },
  },
  {
    id: 'greatsword',
    name: 'Greatsword',
    text: 'Slow, heavy cleaves that hit everything in a wide arc',
    dmg: 1.42,
    reach: 78,
    pace: 1.45,
    suffix: 'greatsword',
    bars: 8,
    extra: { wood: 2, hide: 1 },
  },
  {
    id: 'spear',
    name: 'Spear',
    text: 'The longest reach of any melee weapon',
    dmg: 0.92,
    reach: 98,
    pace: 0.95,
    suffix: 'spear',
    bars: 4,
    extra: { wood: 4 },
  },
  {
    id: 'battleaxe',
    name: 'Battleaxe',
    text: 'Blows open wounds that bleed for three seconds',
    dmg: 1.1,
    reach: 62,
    pace: 1.15,
    suffix: 'battleaxe',
    bars: 6,
    extra: { wood: 3 },
  },
  {
    id: 'warhammer',
    name: 'Warhammer',
    text: 'Staggers foes and cracks their armour',
    dmg: 1.24,
    reach: 58,
    pace: 1.35,
    suffix: 'warhammer',
    bars: 8,
    extra: { wood: 3, stone: 4 },
  },
  {
    id: 'whip',
    name: 'Whip',
    text: 'Long, quick lashes that mark foes to take more harm',
    dmg: 0.6,
    reach: 124,
    pace: 0.8,
    suffix: 'whip',
    bars: 3,
    extra: { hide: 3 },
  },
  {
    id: 'bow',
    name: 'Bow',
    text: 'Arrows at range; the arrow adds its own damage',
    ranged: 'bow',
    dmg: 0.55,
    reach: 0,
    pace: 1,
    suffix: 'bow',
    bars: 4,
    extra: { fiber: 4, wood: 3 },
  },
  {
    id: 'crossbow',
    name: 'Crossbow',
    text: 'Slow to load; its bolts hit hard and pass through',
    ranged: 'bow',
    dmg: 0.95,
    reach: 0,
    pace: 1,
    suffix: 'crossbow',
    bars: 6,
    extra: { wood: 4, silk: 2 },
  },
  {
    id: 'staff',
    name: 'Staff',
    text: 'Mana shaped into bolts',
    ranged: 'magic',
    dmg: 0.62,
    reach: 0,
    pace: 1,
    suffix: 'staff',
    bars: 4,
    extra: { crystal: 2 },
  },
  {
    id: 'tome',
    name: 'Tome',
    text: 'A torrent of small seeking sparks for little mana each',
    ranged: 'magic',
    dmg: 0.27,
    reach: 0,
    pace: 1,
    suffix: 'tome',
    bars: 3,
    extra: { linen: 2, crystal: 1 },
  },
];
export const familyById = (id: string) => FAMILIES.find((f) => f.id === id);

/** Weapons that already existed and hold a place in the hierarchy (family, tier). */
const CANON: Record<string, [FamilyId, number]> = {
  iron_sword: ['blade', 3],
  steel_sword: ['blade', 4],
  obsidian_blade: ['blade', 5],
  hellfire_blade: ['blade', 6],
  myconite_sword: ['blade', 8],
  star_saber: ['blade', 9],
  rift_blade: ['blade', 11],
  void_reaver: ['greatsword', 10],
  flint_spear: ['spear', 1],
  copper_spear: ['spear', 2],
  wooden_bow: ['bow', 1],
  iron_bow: ['bow', 3],
};
/** Signature weapons: outside the grid, each a family member at a tier of its own. */
export const SIGNATURE: Record<string, [FamilyId, number]> = {
  silver_broadsword: ['blade', 3],
  gold_broadsword: ['blade', 4],
  tidecaller_spear: ['spear', 4],
  kiln_greataxe: ['battleaxe', 5],
  eclipse_blade: ['blade', 6],
  frostbrand: ['blade', 6],
  sunspear: ['spear', 7],
  hellrazor: ['blade', 7],
  bone_bow: ['bow', 6],
  storm_bow: ['bow', 9],
  amber_repeater: ['crossbow', 4],
  ruby_staff: ['staff', 3],
  emerald_staff: ['staff', 3],
  sapphire_staff: ['staff', 4],
  brine_wand: ['staff', 4],
  ember_sling: ['staff', 4],
  ember_wand: ['staff', 5],
  lich_staff: ['staff', 6],
  glacier_staff: ['staff', 6],
  sun_staff: ['staff', 7],
  spore_staff: ['staff', 8],
  void_staff: ['staff', 10],
};

export interface GridWeapon {
  id: string;
  name: string;
  family: FamilyId;
  tier: number;
  /** Made by this table (not one of the older weapons). */
  generated: boolean;
}
/** The full grid: one canonical weapon per family and tier. */
export const GRID: GridWeapon[] = TIERS.flatMap((t) =>
  FAMILIES.map((f) => {
    const canon = Object.entries(CANON).find(([, [fam, tier]]) => fam === f.id && tier === t.tier);
    if (canon) return { id: canon[0], name: '', family: f.id, tier: t.tier, generated: false };
    const FIRST: Partial<Record<FamilyId, string>> = {
      blade: 'Flint knife',
      greatsword: 'Flint cleaver',
      warhammer: 'Stone maul',
      whip: 'Hide whip',
      staff: 'Gnarled staff',
      tome: 'Birchbark tome',
      crossbow: 'Sling crossbow',
    };
    const name = (t.tier === 1 && FIRST[f.id]) || `${t.name} ${f.suffix}`;
    return { id: `${t.mat}_${f.suffix}`, name, family: f.id, tier: t.tier, generated: true };
  }),
);
/** Family and tier of any weapon in the hierarchy (grid or signature). */
export const WEAPON_CLASS: Record<string, [FamilyId, number]> = {
  ...Object.fromEntries(GRID.map((w) => [w.id, [w.family, w.tier] as [FamilyId, number]])),
  ...SIGNATURE,
};

/** Generated weapons' stats, specs, items, and recipes, merged into the catalogue elsewhere. */
export const GEN_WEAPONS: Record<string, [tier: number, damage: number, reach: number]> = {};
export const GEN_RANGED: Record<
  string,
  {
    kind: 'bow' | 'magic';
    projectile: string;
    delay: number;
    speed: number;
    mana?: number;
    count?: number;
    spread?: number;
  }
> = {};
export const GEN_PROJECTILES: Record<
  string,
  {
    color: string;
    glow?: string;
    life: number;
    size: number;
    homing?: number;
    pierce?: number;
    gravity?: number;
  }
> = {
  bolt: { color: '#c8b890', gravity: 160, life: 2, size: 9, pierce: 1 },
};
export const GEN_ITEMS: [id: string, name: string][] = [];
export const GEN_RECIPES: [string, Record<string, number>, string | null, number][] = [];
for (const w of GRID) {
  if (!w.generated) continue;
  const t = tierOf(w.tier),
    f = familyById(w.family)!;
  GEN_WEAPONS[w.id] = [w.tier, Math.round(t.base * f.dmg), f.reach];
  if (f.id === 'bow')
    GEN_RANGED[w.id] = { kind: 'bow', projectile: 'arrow', delay: 0.55, speed: 700 + w.tier * 30 };
  if (f.id === 'crossbow')
    GEN_RANGED[w.id] = { kind: 'bow', projectile: 'bolt', delay: 0.95, speed: 900 + w.tier * 30 };
  if (f.id === 'staff') {
    GEN_RANGED[w.id] = {
      kind: 'magic',
      projectile: `${t.mat}_orb`,
      delay: 0.45,
      speed: 560 + w.tier * 20,
      mana: 4 + Math.ceil(w.tier / 2),
    };
    GEN_PROJECTILES[`${t.mat}_orb`] = { color: t.color, glow: t.glow, life: 1.3, size: 9 };
  }
  if (f.id === 'tome') {
    GEN_RANGED[w.id] = {
      kind: 'magic',
      projectile: `${t.mat}_spark`,
      delay: 0.14,
      speed: 520 + w.tier * 15,
      mana: 1 + Math.floor(w.tier / 4),
    };
    GEN_PROJECTILES[`${t.mat}_spark`] = {
      color: t.glow,
      glow: t.color,
      life: 1.1,
      size: 6,
      homing: 4,
    };
  }
  GEN_ITEMS.push([w.id, w.name]);
  const cost: Record<string, number> = {
    [t.bar]: Math.max(1, Math.round(f.bars * (w.tier === 11 ? 0.6 : 1))),
  };
  // The finest tier is voidsteel refined with essence.
  if (w.tier === 11) cost.voidsteel_ingot = f.bars;
  for (const [k, n] of Object.entries(f.extra)) if (w.tier > 1 || k !== 'silk') cost[k] = n;
  if (w.tier === 1) {
    delete cost.silk;
    delete cost.linen;
    if (f.id === 'tome') cost.fiber = 4;
  }
  GEN_RECIPES.push([w.id, cost, t.station ?? (w.tier === 1 ? null : 'workbench'), w.tier]);
}

// ── Quality ─────────────────────────────────────────────────────────────────────────────────
export interface Quality {
  id: string;
  name: string;
  mult: number;
  sockets: number;
  weight: number;
  color: string;
}
export const QUALITIES: Quality[] = [
  { id: 'crude', name: 'Crude', mult: 0.85, sockets: 0, weight: 15, color: '#8a8070' },
  { id: 'common', name: 'Common', mult: 1, sockets: 1, weight: 50, color: '#6a5a44' },
  { id: 'fine', name: 'Fine', mult: 1.1, sockets: 1, weight: 22, color: '#7ac070' },
  { id: 'masterwork', name: 'Masterwork', mult: 1.22, sockets: 2, weight: 10, color: '#5a9ae8' },
  { id: 'mythic', name: 'Mythic', mult: 1.4, sockets: 3, weight: 3, color: '#e89a3a' },
];
/** Rolls a quality; `luck` above 1 favours the better grades. */
export function rollQuality(rng: () => number, luck = 1) {
  const weights = QUALITIES.map((q, i) => q.weight * (i >= 2 ? luck : 1));
  let r = rng() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < weights.length; i++) if ((r -= weights[i]) <= 0) return i;
  return 1;
}
export const MAX_LEVEL = 10;
/** Damage gained per upgrade level. */
export const LEVEL_DAMAGE = 0.07;
/** The anvil's price for the next level: tier material and silver marks. */
export function upgradeCost(tier: number, level: number): Record<string, number> {
  const t = tierOf(tier);
  return { [t.bar]: 2 + level, coin: 10 * tier * (level + 1) };
}
export function reforgeCost(tier: number): Record<string, number> {
  const t = tierOf(tier);
  return { [t.bar]: 3, coin: 40 * tier };
}
/** The station that works a tier's weapons. */
export const anvilFor = (tier: number) =>
  tier >= 8 ? 'starforge' : tier >= 4 ? 'forge' : 'workbench';

// ── Evolutions: a choice at +5 and another at +10 ──────────────────────────────────────────────
export interface WeaponMods {
  dmg?: number;
  reach?: number;
  pace?: number;
  crit?: number;
  count?: number;
  pierce?: number;
  bleed?: number;
  poison?: number;
  heal?: number;
  execute?: number;
  berserk?: number;
  boss?: number;
  homing?: number;
  mana?: number;
  defense?: number;
  stagger?: boolean;
  sunder?: number;
  mark?: number;
  combo?: number;
}
export interface Evolution {
  id: string;
  name: string;
  text: string;
  mods: WeaponMods;
}
const E = (id: string, name: string, text: string, mods: WeaponMods): Evolution => ({
  id,
  name,
  text,
  mods,
});
export const EVOLUTIONS: Record<FamilyId, [[Evolution, Evolution], [Evolution, Evolution]]> = {
  blade: [
    [
      E('keen', 'Keen', '+10% critical chance', { crit: 0.1 }),
      E('swift', 'Swift', 'Swings 15% faster', { pace: -0.15 }),
    ],
    [
      E('duelist', 'Duelist', 'The third blow strikes ×2.4', { combo: 2.4 }),
      E('executioner', 'Executioner', '+50% against foes below 30% health', { execute: 0.5 }),
    ],
  ],
  greatsword: [
    [
      E('wide', 'Wide', '+20% reach', { reach: 0.2 }),
      E('heavy', 'Heavy', '+15% damage', { dmg: 0.15 }),
    ],
    [
      E('cleaver', 'Cleaver', 'Cleaves open bleeding wounds', { bleed: 0.25 }),
      E('titan', 'Titan', 'Blows stagger foes', { stagger: true }),
    ],
  ],
  spear: [
    [
      E('long', 'Long', '+20% reach', { reach: 0.2 }),
      E('barbed', 'Barbed', 'Thrusts cause bleeding', { bleed: 0.2 }),
    ],
    [
      E('impaler', 'Impaler', '+30% against great foes', { boss: 0.3 }),
      E('phalanx', 'Phalanx', '+4 defense while held', { defense: 4 }),
    ],
  ],
  battleaxe: [
    [
      E('serrated', 'Serrated', 'Bleeding doubles', { bleed: 0.3 }),
      E('balanced', 'Balanced', 'Swings 15% faster', { pace: -0.15 }),
    ],
    [
      E('reaper', 'Reaper', 'Heal 3% of the damage you deal', { heal: 0.03 }),
      E('berserk', 'Berserk', '+30% while below half health', { berserk: 0.3 }),
    ],
  ],
  warhammer: [
    [
      E('crusher', 'Crusher', 'Armour stays cracked twice as long', { sunder: 8 }),
      E('weighty', 'Weighty', '+15% damage', { dmg: 0.15 }),
    ],
    [
      E('earthshaker', 'Earthshaker', 'Blows strike everything nearby', { reach: 0.35 }),
      E('juggernaut', 'Juggernaut', '+6 defense while held', { defense: 6 }),
    ],
  ],
  whip: [
    [
      E('lash', 'Lash', '+20% reach', { reach: 0.2 }),
      E('venomous', 'Venomous', 'Lashes poison', { poison: 0.25 }),
    ],
    [
      E('ringmaster', 'Ringmaster', 'Marked foes take +30% instead of +15%', { mark: 0.3 }),
      E('flayer', 'Flayer', 'Lashes cause bleeding', { bleed: 0.3 }),
    ],
  ],
  bow: [
    [
      E('eagle', 'Eagle', 'Draw 20% faster', { pace: -0.2 }),
      E('heavy_draw', 'Heavy draw', '+20% damage', { dmg: 0.2 }),
    ],
    [
      E('volley', 'Volley', 'Loose three arrows at once', { count: 2 }),
      E('sniper', 'Sniper', '+60% damage, slower draw', { dmg: 0.6, pace: 0.3 }),
    ],
  ],
  crossbow: [
    [
      E('quickload', 'Quickload', 'Reload 20% faster', { pace: -0.2 }),
      E('broadhead', 'Broadhead', 'Bolts cause bleeding', { bleed: 0.25 }),
    ],
    [
      E('repeater', 'Repeater', 'Two bolts at once', { count: 1 }),
      E('ballista', 'Ballista', 'Bolts pass through four foes', { pierce: 3 }),
    ],
  ],
  staff: [
    [
      E('focused', 'Focused', '20% less mana', { mana: -0.2 }),
      E('charged', 'Charged', '+20% damage', { dmg: 0.2 }),
    ],
    [
      E('split', 'Split', 'Two more bolts in a fan', { count: 2 }),
      E('seeker', 'Seeker', 'Bolts seek their foes', { homing: 3 }),
    ],
  ],
  tome: [
    [
      E('fluent', 'Fluent', '25% less mana', { mana: -0.25 }),
      E('searing', 'Searing', '+20% damage', { dmg: 0.2 }),
    ],
    [
      E('torrent', 'Torrent', 'Two streams at once', { count: 1 }),
      E('leech', 'Leech', 'Heal 2% of the damage you deal', { heal: 0.02 }),
    ],
  ],
};

// ── Infusions ───────────────────────────────────────────────────────────────────────────────
export interface Infusion {
  id: string;
  name: string;
  text: string;
  item: string;
  color: string;
  recipe: Record<string, number>;
}
export const INFUSIONS: Infusion[] = [
  {
    id: 'fire',
    name: 'Fire',
    text: 'Sets foes burning',
    item: 'fire_infusion',
    color: '#ff8a3a',
    recipe: { kiln_ingot: 2, sulfur: 4 },
  },
  {
    id: 'frost',
    name: 'Frost',
    text: 'Slows foes by 40%',
    item: 'frost_infusion',
    color: '#9fd8ec',
    recipe: { frost_shard: 3, ice: 6 },
  },
  {
    id: 'venom',
    name: 'Venom',
    text: 'Poisons foes',
    item: 'venom_infusion',
    color: '#7bc05a',
    recipe: { venom: 4, crab_shell: 2 },
  },
  {
    id: 'void',
    name: 'Void',
    text: 'Ignores half of all armour',
    item: 'void_infusion',
    color: '#b36cff',
    recipe: { void_essence: 2, crystal: 2 },
  },
  {
    id: 'holy',
    name: 'Holy',
    text: '+50% against the undead',
    item: 'holy_infusion',
    color: '#fff0a0',
    recipe: { sun_gold: 2, tide_pearl: 2 },
  },
  {
    id: 'storm',
    name: 'Storm',
    text: 'Lightning leaps to a second foe',
    item: 'storm_infusion',
    color: '#bfe4ff',
    recipe: { sky_silk: 2, fallen_star: 2 },
  },
];
export const infusionById = (id: string) => INFUSIONS.find((i) => i.id === id);
/** Creatures that holy weapons punish. */
export const UNDEAD = new Set([
  'skeleton',
  'skeleton_archer',
  'bone_bat',
  'crypt_ghoul',
  'frost_wraith',
  'mummy',
  'hollow_king',
  'pharaoh',
  'drowned',
  'void_wisp',
  'watcher',
  'unmaker',
]);

// ── Gems ────────────────────────────────────────────────────────────────────────────────────
export const GEMS: Record<
  string,
  { name: string; text: string; mods: WeaponMods & { magic?: number; armorPierce?: number } }
> = {
  ruby: { name: 'Ruby', text: '+8% damage', mods: { dmg: 0.08 } },
  sapphire: {
    name: 'Sapphire',
    text: '+12% magic damage, 10% less mana',
    mods: { magic: 0.12, mana: -0.1 },
  },
  emerald: { name: 'Emerald', text: '+5% critical chance', mods: { crit: 0.05 } },
  topaz: { name: 'Topaz', text: 'Swings and shots 8% faster', mods: { pace: -0.08 } },
  onyx: { name: 'Onyx', text: 'Ignores a quarter of armour', mods: { armorPierce: 0.25 } },
  opal: { name: 'Opal', text: 'Heal 2% of the damage you deal', mods: { heal: 0.02 } },
};
