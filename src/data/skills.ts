// Renown and the five skill trees. Everything you do earns renown; each level of renown is a
// skill point, and renown never resets. Each tree opens row by row as you spend points in it,
// and ends in keystones that change how you play.

/** Every number a skill can move. Fractions unless noted. */
export interface SkillStats {
  meleeDmg: number;
  heavyDmg: number;
  rangedDmg: number;
  magicDmg: number;
  crit: number;
  critDmg: number;
  meleeSpeed: number;
  rangedSpeed: number;
  castSpeed: number;
  reach: number;
  combo: number;
  bleedDmg: number;
  burnDmg: number;
  infusion: number;
  lifesteal: number;
  magicLifesteal: number;
  bossDmg: number;
  pierce: number;
  extraShot: number;
  homing: number;
  ammoSave: number;
  rangedMark: number;
  rangedBleed: number;
  /** Health (points), defense (points), mana (points). */
  maxHp: number;
  defense: number;
  maxMana: number;
  manaRegen: number;
  manaCost: number;
  harm: number;
  thorns: number;
  killStamina: number;
  speed: number;
  jump: number;
  climb: number;
  staminaRegen: number;
  gather: number;
  calories: number;
  thirst: number;
  /** Degrees of cold and heat shrugged off. */
  coldResist: number;
  heatResist: number;
  packRot: number;
  ice: number;
  disease: number;
  meals: number;
  immunity: number;
  heal: number;
  dressing: number;
  rest: number;
  luck: number;
  coins: number;
  realmLoot: number;
  keySave: number;
  hazard: number;
  tierHarm: number;
  haggle: number;
  chests: number;
  xp: number;
  // Keystones.
  berserker: number;
  juggernaut: number;
  bladestorm: number;
  deadeye: number;
  quiverMaster: number;
  skirmisher: number;
  overchannel: number;
  manaShield: number;
  elementalist: number;
  ironGut: number;
  coldBlooded: number;
  fieldMedic: number;
  riftborn: number;
  treasureSense: number;
  wanderer: number;
}
export type SkillKey = keyof SkillStats;

export interface SkillTree {
  id: string;
  name: string;
  text: string;
  color: string;
}
export const TREES: SkillTree[] = [
  {
    id: 'warfare',
    name: 'Warfare',
    text: 'Blades, axes, hammers, and the nerve to stand close',
    color: '#c0584a',
  },
  { id: 'marksman', name: 'Marksman', text: 'Bows, crossbows, and patience', color: '#6a9a4a' },
  { id: 'arcana', name: 'Arcana', text: 'Staves, tomes, mana, and infusions', color: '#6a6ac8' },
  {
    id: 'survival',
    name: 'Survival',
    text: 'Food, cold, sickness, and the long haul',
    color: '#b8904a',
  },
  {
    id: 'wayfinding',
    name: 'Wayfinding',
    text: 'Realms, keys, loot, and the road',
    color: '#4a9ab0',
  },
];

export interface SkillNode {
  id: string;
  tree: string;
  /** 1 to 5; row 5 holds the keystones. */
  row: number;
  name: string;
  text: string;
  cost: number;
  stats: Partial<SkillStats>;
  keystone?: boolean;
}
/** Points spent in a tree before each row opens. */
export const ROW_POINTS = [0, 0, 3, 6, 10, 14];

type Spec = [id: string, name: string, text: string, stats: Partial<SkillStats>];
const tree = (id: string, rows: Spec[][]): SkillNode[] =>
  rows.flatMap((row, i) =>
    row.map(([nid, name, text, stats]) => ({
      id: nid,
      tree: id,
      row: i + 1,
      name,
      text,
      cost: i === 4 ? 2 : 1,
      stats,
      ...(i === 4 ? { keystone: true } : {}),
    })),
  );

export const SKILLS: SkillNode[] = [
  ...tree('warfare', [
    [
      ['edge', 'Edge', '+6% melee damage', { meleeDmg: 0.06 }],
      ['grit', 'Grit', '+10 health', { maxHp: 10 }],
      ['footwork', 'Footwork', '+4% speed', { speed: 0.04 }],
      ['second_wind', 'Second wind', 'Stamina returns 15% faster', { staminaRegen: 0.15 }],
      ['hardy', 'Hardy', '+1 defense', { defense: 1 }],
      [
        'cleave',
        'Cleave',
        '+8% damage with greatswords, battleaxes, and warhammers',
        { heavyDmg: 0.08 },
      ],
    ],
    [
      ['bloodletter', 'Bloodletter', 'Bleeding hurts 30% more', { bleedDmg: 0.3 }],
      ['duelists_eye', "Duelist's eye", '+4% critical chance', { crit: 0.04 }],
      ['tough', 'Tough', '+20 health', { maxHp: 20 }],
      ['long_arm', 'Long arm', '+10% melee reach', { reach: 0.1 }],
      ['rhythm', 'Rhythm', 'Melee blows 6% faster', { meleeSpeed: 0.06 }],
      ['savagery', 'Savagery', '+8% melee damage', { meleeDmg: 0.08 }],
    ],
    [
      ['iron_skin', 'Iron skin', '+3 defense', { defense: 3 }],
      ['relentless', 'Relentless', 'Blade combos strike ×0.3 harder', { combo: 0.3 }],
      ['war_cry', 'War cry', 'Each kill restores 6 stamina', { killStamina: 6 }],
      ['bulwark', 'Bulwark', 'Take 8% less harm', { harm: -0.08 }],
      ['brutal', 'Brutal', '+25% critical damage', { critDmg: 0.25 }],
      ['titan_grip', 'Titan grip', '+12% damage with heavy weapons', { heavyDmg: 0.12 }],
    ],
    [
      ['vampiric', 'Vampiric', 'Heal 2% of melee damage dealt', { lifesteal: 0.02 }],
      ['unbroken', 'Unbroken', '+40 health', { maxHp: 40 }],
      ['riposte', 'Riposte', 'Foes that strike you take 15% back', { thorns: 0.15 }],
      ['giantslayer', 'Giantslayer', '+15% against great foes', { bossDmg: 0.15 }],
      ['warpath', 'Warpath', '+6% speed', { speed: 0.06 }],
      ['whirl', 'Whirl', 'Melee blows 8% faster', { meleeSpeed: 0.08 }],
    ],
    [
      ['berserker', 'Berserker', 'Up to +40% damage as your health falls', { berserker: 1 }],
      ['juggernaut', 'Juggernaut', '+15 defense, but 10% slower', { juggernaut: 1 }],
      ['bladestorm', 'Bladestorm', 'Blade combos land every second blow', { bladestorm: 1 }],
    ],
  ]),
  ...tree('marksman', [
    [
      ['steady', 'Steady hand', '+6% ranged damage', { rangedDmg: 0.06 }],
      ['quick_draw', 'Quick draw', 'Shoot 6% faster', { rangedSpeed: 0.06 }],
      ['eagle_eye', 'Eagle eye', '+3% critical chance', { crit: 0.03 }],
      ['light_step', 'Light step', '+4% speed', { speed: 0.04 }],
      ['salvage', 'Salvage', '15% chance to keep the arrow', { ammoSave: 0.15 }],
      ['fletching', 'Fletching', 'Seeking shots turn a little', { homing: 0.6 }],
    ],
    [
      ['piercing', 'Piercing', 'Shots pass through one more foe', { pierce: 1 }],
      ['broadheads', 'Broadheads', 'Arrows and bolts cause bleeding', { rangedBleed: 0.1 }],
      ['marksman', 'Marksman', '+6% critical chance', { crit: 0.06 }],
      ['deadly', 'Deadly', '+25% critical damage', { critDmg: 0.25 }],
      ['quiver', 'Quiver', '15% more chance to keep the arrow', { ammoSave: 0.15 }],
      ['focus', 'Focus', '+8% ranged damage', { rangedDmg: 0.08 }],
    ],
    [
      ['volley', 'Volley', '20% chance of an extra shot', { extraShot: 0.2 }],
      ['hunters_mark', "Hunter's mark", 'Shots mark foes to take more harm', { rangedMark: 0.12 }],
      ['windrunner', 'Windrunner', '+6% speed', { speed: 0.06 }],
      ['lethal', 'Lethal', '+8% ranged damage', { rangedDmg: 0.08 }],
      ['sharpshooter', 'Sharpshooter', '+6% critical chance', { crit: 0.06 }],
      ['swift_hands', 'Swift hands', 'Shoot 8% faster', { rangedSpeed: 0.08 }],
    ],
    [
      ['seeking', 'Seeking', 'Shots seek their foes', { homing: 1.5 }],
      ['rain', 'Rain of arrows', '25% more chance of an extra shot', { extraShot: 0.25 }],
      ['camouflage', 'Camouflage', '+3 defense', { defense: 3 }],
      ['predator', 'Predator', '+15% against great foes', { bossDmg: 0.15 }],
      ['hawkeye', 'Hawkeye', '+30% critical damage', { critDmg: 0.3 }],
      ['trueshot', 'Trueshot', '+10% ranged damage', { rangedDmg: 0.1 }],
    ],
    [
      ['deadeye', 'Deadeye', 'A shot at a foe at full health always strikes ×2.5', { deadeye: 1 }],
      [
        'quiver_master',
        'Quiver master',
        'Always one more arrow, and 30% kept',
        { quiverMaster: 1 },
      ],
      ['skirmisher', 'Skirmisher', '+20% ranged damage while moving', { skirmisher: 1 }],
    ],
  ]),
  ...tree('arcana', [
    [
      ['spark', 'Spark', '+6% magic damage', { magicDmg: 0.06 }],
      ['wellspring', 'Wellspring', '+20 mana', { maxMana: 20 }],
      ['flow', 'Flow', 'Mana returns 20% faster', { manaRegen: 0.2 }],
      ['thrift', 'Thrift', 'Spells cost 8% less', { manaCost: -0.08 }],
      ['arcane_ward', 'Arcane ward', '+1 defense', { defense: 1 }],
      ['study', 'Study', '+10% renown', { xp: 0.1 }],
    ],
    [
      ['amplify', 'Amplify', '+8% magic damage', { magicDmg: 0.08 }],
      ['deep_well', 'Deep well', '+30 mana', { maxMana: 30 }],
      ['channel', 'Channel', 'Cast 8% faster', { castSpeed: 0.08 }],
      [
        'elemental_touch',
        'Elemental touch',
        'Infusions burn, poison, and slow 25% harder',
        { infusion: 0.25 },
      ],
      ['seeker_bolts', 'Seeker bolts', 'Spells seek their foes', { homing: 1 }],
      ['insight', 'Insight', '+4% critical chance', { crit: 0.04 }],
    ],
    [
      ['overflow', 'Overflow', 'Mana returns 30% faster', { manaRegen: 0.3 }],
      ['efficiency', 'Efficiency', 'Spells cost 12% less', { manaCost: -0.12 }],
      ['potency', 'Potency', '+10% magic damage', { magicDmg: 0.1 }],
      ['kindling', 'Kindling', 'Burning hurts 40% more', { burnDmg: 0.4 }],
      ['resonance', 'Resonance', '+50 mana', { maxMana: 50 }],
      ['quickening', 'Quickening', 'Cast 8% faster', { castSpeed: 0.08 }],
    ],
    [
      ['archmage', 'Archmage', '+12% magic damage', { magicDmg: 0.12 }],
      ['barrier', 'Barrier', '+4 defense', { defense: 4 }],
      ['meditation', 'Meditation', 'Mana returns 40% faster', { manaRegen: 0.4 }],
      ['split_cast', 'Split cast', '25% chance of an extra bolt', { extraShot: 0.25 }],
      ['lich_touch', 'Lich touch', 'Heal 2% of magic damage dealt', { magicLifesteal: 0.02 }],
      ['arcane_crit', 'Arcane fury', '+30% critical damage', { critDmg: 0.3 }],
    ],
    [
      ['overchannel', 'Overchannel', 'Out of mana, spells cost health instead', { overchannel: 1 }],
      ['mana_shield', 'Mana shield', 'A quarter of all harm drains mana first', { manaShield: 1 }],
      ['elementalist', 'Elementalist', 'Infusions ×1.5 and +15% magic damage', { elementalist: 1 }],
    ],
  ]),
  ...tree('survival', [
    [
      ['forager', 'Forager', '20% chance of an extra find when gathering', { gather: 0.2 }],
      ['hearty', 'Hearty', '+10 health', { maxHp: 10 }],
      ['small_appetite', 'Small appetite', 'Hunger 10% slower', { calories: -0.1 }],
      ['camel', 'Camel', 'Thirst 10% slower', { thirst: -0.1 }],
      ['thick_skin', 'Thick skin', 'Shrug off 2° of cold', { coldResist: 2 }],
      ['sun_hardened', 'Sun-hardened', 'Shrug off 2° of heat', { heatResist: 2 }],
    ],
    [
      ['preserver', 'Preserver', 'Food in your pack keeps 15% longer', { packRot: 0.15 }],
      ['iceman', 'Iceman', 'Ice lasts 50% longer in storage', { ice: 0.5 }],
      ['medic', 'Medic', 'Healing draughts heal 30% more', { heal: 0.3 }],
      ['resistant', 'Resistant', '15% chance to shrug off a sickness', { disease: 0.15 }],
      ['gatherer', 'Gatherer', '20% more chance of an extra find', { gather: 0.2 }],
      ['cook', 'Cook', 'Meal comforts last 50% longer', { meals: 0.5 }],
    ],
    [
      ['iron_stomach', 'Iron stomach', 'Spoiled food no longer sickens you', { ironGut: 0.5 }],
      ['antibodies', 'Antibodies', 'Immunities last twice as long', { immunity: 1 }],
      ['layers', 'Layers', 'Shrug off 3° of cold', { coldResist: 3 }],
      ['desert_born', 'Desert-born', 'Shrug off 3° of heat', { heatResist: 3 }],
      [
        'provisioner',
        'Provisioner',
        'Hunger and thirst 12% slower',
        { calories: -0.12, thirst: -0.12 },
      ],
      ['tough_hide', 'Tough hide', '+2 defense', { defense: 2 }],
    ],
    [
      ['survivalist', 'Survivalist', '+25 health', { maxHp: 25 }],
      ['rot_ward', 'Rot ward', 'Food in your pack keeps 25% longer', { packRot: 0.25 }],
      ['immune_system', 'Hale', '25% chance to shrug off a sickness', { disease: 0.25 }],
      ['field_dressing', 'Field dressing', 'Bandages and splints also heal 15', { dressing: 15 }],
      ['deep_sleep', 'Deep sleep', 'Rest restores twice as much', { rest: 1 }],
      ['hunter_gatherer', 'Hunter-gatherer', '25% more chance of an extra find', { gather: 0.25 }],
    ],
    [
      ['iron_gut', 'Iron gut', 'Food and water never make you ill', { ironGut: 1 }],
      [
        'cold_blooded',
        'Cold-blooded',
        'Shrug off 8° of cold; frostbite never takes',
        { coldBlooded: 1 },
      ],
      [
        'field_medic',
        'Field medic',
        'Treatments lift a stage more, and heal 20',
        { fieldMedic: 1 },
      ],
    ],
  ]),
  ...tree('wayfinding', [
    [
      ['swift', 'Swift', '+5% speed', { speed: 0.05 }],
      ['climber', 'Climber', 'Climb 25% faster', { climb: 0.25 }],
      ['lucky', 'Lucky', 'Loot 8% more likely', { luck: 0.08 }],
      ['coin_sense', 'Coin sense', '15% more silver marks', { coins: 0.15 }],
      ['endurance', 'Endurance', 'Stamina returns 10% faster', { staminaRegen: 0.1 }],
      ['springheel', 'Springheel', 'Jump 8% higher', { jump: 0.08 }],
    ],
    [
      ['rift_sense', 'Rift sense', 'Realm loot +10%', { realmLoot: 0.1 }],
      ['tunnel_rat', 'Tunnel rat', 'Realm hazards 20% gentler', { hazard: 0.2 }],
      ['scavenger', 'Scavenger', 'Loot 10% more likely', { luck: 0.1 }],
      ['pathfinder', 'Pathfinder', '+6% speed', { speed: 0.06 }],
      ['haggler', 'Haggler', 'Settlers sell 15% cheaper', { haggle: 0.15 }],
      ['surefoot', 'Surefoot', 'Jump 8% higher', { jump: 0.08 }],
    ],
    [
      ['treasure_hunter', 'Treasure hunter', 'Realm loot +10%', { realmLoot: 0.1 }],
      ['keywise', 'Keywise', '10% chance a key is not spent', { keySave: 0.1 }],
      ['weathered', 'Weathered', 'Realm hazards 25% gentler', { hazard: 0.25 }],
      ['fortune', 'Fortune', 'Loot 10% more likely', { luck: 0.1 }],
      ['strider', 'Strider', '+6% speed', { speed: 0.06 }],
      ['salvager', 'Salvager', '25% more silver marks', { coins: 0.25 }],
    ],
    [
      ['realm_walker', 'Realm walker', 'Realm loot +15%', { realmLoot: 0.15 }],
      ['tier_climber', 'Tier climber', 'Realm tiers hurt 10% less', { tierHarm: 0.1 }],
      ['keymaster', 'Keymaster', '10% more chance a key is not spent', { keySave: 0.1 }],
      ['gilded', 'Gilded', '40% more silver marks', { coins: 0.4 }],
      ['explorer', 'Explorer', '+8% speed', { speed: 0.08 }],
      ['cartographer', 'Cartographer', '+15% renown', { xp: 0.15 }],
    ],
    [
      ['riftborn', 'Riftborn', '30% chance a key is not spent', { riftborn: 1 }],
      [
        'treasure_sense',
        'Treasure sense',
        'Two more chests in every realm; realm loot +20%',
        { treasureSense: 1 },
      ],
      ['wanderer', 'Wanderer', '+15% speed; stamina returns 30% faster', { wanderer: 1 }],
    ],
  ]),
];
export const skillById = (id: string) => SKILLS.find((n) => n.id === id);

// ── Renown ──────────────────────────────────────────────────────────────────────────────────
export const MAX_RENOWN = 60;
/** Total renown needed to reach a level (level 1 needs none). */
export const renownFor = (level: number) => Math.round(60 * Math.pow(level - 1, 1.6));
/** The level a total of renown has reached. */
export function renownLevel(xp: number) {
  let l = 1;
  while (l < MAX_RENOWN && xp >= renownFor(l + 1)) l++;
  return l;
}
/** What respeccing costs. */
export const RESPEC_COST: Record<string, number> = { fallen_star: 3, coin: 200 };

// ── Weapon mastery ──────────────────────────────────────────────────────────────────────────
export const MAX_MASTERY = 20;
/** Damage dealt with a family needed for each mastery level. */
export const masteryFor = (level: number) => Math.round(400 * Math.pow(level, 1.7));
export function masteryLevel(xp: number) {
  let l = 0;
  while (l < MAX_MASTERY && xp >= masteryFor(l + 1)) l++;
  return l;
}
/** Mastery titles by level. */
export const MASTERY_TITLES = ['Untried', 'Novice', 'Adept', 'Expert', 'Master', 'Grandmaster'];
export const masteryTitle = (level: number) =>
  MASTERY_TITLES[Math.min(MASTERY_TITLES.length - 1, Math.floor(level / 5) + (level > 0 ? 1 : 0))];

/** What mastery 10 teaches each family: a new way to fight, not just more of the same. */
export const MASTERY_PERKS: Record<string, string> = {
  blade: 'Combo finishers heal 3% of your health',
  greatsword: 'Cleaves stagger foes and throw them back',
  spear: 'Leaping thrust: strikes in the air hit 40% harder and reach further',
  battleaxe: 'Bleeding foes take 15% more from everything',
  warhammer: 'Staggers shake even great foes for a moment',
  whip: 'Marks last twice as long and bite harder',
  bow: 'Every fifth arrow is free and pierces two more foes',
  crossbow: 'Bolts throw foes back',
  staff: 'Every cast looses an extra bolt',
  tome: 'Sparks seek harder, and a tenth of casts cost nothing',
};
/** Mastery at which a family's perk is learned, and at which its weapons shine. */
export const PERK_LEVEL = 10,
  SHINE_LEVEL = 20;
