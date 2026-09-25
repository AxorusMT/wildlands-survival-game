// The Codex: what the expedition has learned. Each page fills as you slay, visit, suffer, eat,
// and arm yourself; a finished page grants a lasting bonus, however many worlds you cross.
import type { SkillStats } from './skills.ts';

export interface CodexPage {
  id: string;
  name: string;
  group: 'Creatures' | 'Places' | 'Lore';
  /** Tally key prefix and the entries it needs (kill:wolf, visit:forest, …). */
  prefix: string;
  entries: string[];
  /** For pages filled by count rather than by name: how many different entries. */
  count?: number;
  bonus: Partial<SkillStats>;
  bonusText: string;
}
const creatures = (
  id: string,
  name: string,
  entries: string[],
  bonus: Partial<SkillStats>,
  bonusText: string,
): CodexPage => ({ id, name, group: 'Creatures', prefix: 'kill:', entries, bonus, bonusText });

export const CODEX: CodexPage[] = [
  creatures(
    'wilds',
    'Beasts of the wilds',
    ['deer', 'wolf', 'boar', 'slime', 'scorpion'],
    { maxHp: 10 },
    '+10 health',
  ),
  creatures(
    'deeps',
    'Things of the deep',
    ['bat', 'cave_spider', 'ember_bat', 'hellhound'],
    { meleeDmg: 0.03, rangedDmg: 0.03, magicDmg: 0.03 },
    '+3% damage',
  ),
  creatures(
    'crypt',
    'The Mossy Crypt',
    ['skeleton', 'skeleton_archer', 'bone_bat', 'crypt_ghoul', 'hollow_king'],
    { defense: 1 },
    '+1 defense',
  ),
  creatures(
    'frost_keep',
    'The Frost Keep',
    ['frost_wraith', 'ice_golem', 'snow_slime', 'rime_colossus'],
    { coldResist: 2 },
    'Shrug off 2° of cold',
  ),
  creatures(
    'tomb',
    'The Sunken Tomb',
    ['mummy', 'scarab', 'tomb_serpent', 'pharaoh'],
    { heatResist: 2 },
    'Shrug off 2° of heat',
  ),
  creatures(
    'citadel',
    'The Cinder Citadel',
    ['imp', 'cinder_knight', 'magma_slime', 'archdemon'],
    { defense: 1 },
    '+1 defense',
  ),
  creatures(
    'mycelia',
    'The Mycelial Deep',
    ['shroomling', 'spore_bat', 'spore_slime', 'mycelid', 'sporemother'],
    { disease: 0.05 },
    '5% chance to shrug off a sickness',
  ),
  creatures(
    'skyreach',
    'Skyreach',
    ['harpy', 'cloud_slime', 'wind_wisp', 'sky_ram', 'tempest_roc'],
    { speed: 0.03 },
    '+3% speed',
  ),
  creatures(
    'void',
    'The Hollow Void',
    ['void_wisp', 'void_stalker', 'watcher', 'unmaker'],
    { maxMana: 20 },
    '+20 mana',
  ),
  creatures(
    'orchard',
    'The Drowned Orchard',
    ['bog_crab', 'drowned', 'rotfruit_slime', 'orchard_wasp', 'orchard_warden', 'orchard_mother'],
    { realmLoot: 0.05 },
    'Realm loot +5%',
  ),
  creatures(
    'steppe',
    'The Ashen Steppe',
    ['ash_hound', 'steppe_raider', 'kiln_golem', 'cinder_vulture', 'steppe_warlord', 'kiln_beast'],
    { realmLoot: 0.05 },
    'Realm loot +5%',
  ),
  creatures(
    'warren',
    'The Hollow Warren',
    ['warren_rat', 'amber_beetle', 'mole_guard', 'burrower', 'amber_colossus', 'warren_queen'],
    { realmLoot: 0.05 },
    'Realm loot +5%',
  ),
  {
    id: 'regions',
    name: 'The nine regions',
    group: 'Places',
    prefix: 'visit:',
    entries: [
      'coast',
      'marsh',
      'forest',
      'meadow',
      'taiga',
      'tundra',
      'alpine',
      'desert',
      'badlands',
    ],
    bonus: { speed: 0.03 },
    bonusText: '+3% speed',
  },
  {
    id: 'dungeons',
    name: 'The four dungeons',
    group: 'Places',
    prefix: 'visit:',
    entries: ['crypt', 'frost_keep', 'tomb', 'citadel'],
    bonus: { defense: 2 },
    bonusText: '+2 defense',
  },
  {
    id: 'worlds',
    name: 'Other worlds',
    group: 'Places',
    prefix: 'visit:',
    entries: ['mycelia', 'skyreach', 'void', 'orchard', 'steppe', 'warren'],
    bonus: { xp: 0.1 },
    bonusText: '+10% renown',
  },
  {
    id: 'maladies',
    name: 'Maladies',
    group: 'Lore',
    prefix: 'ail:',
    entries: [],
    count: 8,
    bonus: { disease: 0.1 },
    bonusText: '10% chance to shrug off a sickness',
  },
  {
    id: 'palate',
    name: 'The palate',
    group: 'Lore',
    prefix: 'eat:',
    entries: [],
    count: 15,
    bonus: { calories: -0.1 },
    bonusText: 'Hunger 10% slower',
  },
  {
    id: 'arms',
    name: 'Every family of arms',
    group: 'Lore',
    prefix: 'family:',
    entries: [
      'blade',
      'greatsword',
      'spear',
      'battleaxe',
      'warhammer',
      'whip',
      'bow',
      'crossbow',
      'staff',
      'tome',
    ],
    bonus: { crit: 0.03 },
    bonusText: '+3% critical chance',
  },
  {
    id: 'hoard',
    name: 'The hoard',
    group: 'Lore',
    prefix: 'weapon:',
    entries: [],
    count: 30,
    bonus: { meleeDmg: 0.04, rangedDmg: 0.04, magicDmg: 0.04 },
    bonusText: '+4% damage',
  },
  {
    id: 'relics',
    name: 'Relics',
    group: 'Lore',
    prefix: 'relic:',
    entries: ['tide_conch', 'kiln_heart', 'queens_mandible'],
    bonus: { luck: 0.1 },
    bonusText: 'Loot 10% more likely',
  },
];

/** Relics a shelf at camp can hold, and the lasting effects each gives from there. */
export const RELIC_EFFECTS: Record<string, string[]> = {
  tide_conch: ['swim', 'defense2'],
  kiln_heart: ['ashward', 'fire'],
  queens_mandible: ['tremor', 'damage10'],
  mother_heart: ['regen'],
  kiln_core: ['stamina'],
  queen_jelly: ['stamina'],
  spore_heart: ['regen'],
  roc_plume: ['glide'],
  eclipse_fang: ['damage10'],
  beast_core: ['defense2'],
};
/** What each shelf effect does, in words. */
export const EFFECT_TEXT: Record<string, string> = {
  swim: 'swim freely',
  defense2: '+2 defense',
  ashward: 'ash storms pass you by',
  fire: 'some blows set foes alight',
  tremor: 'sense cave-ins',
  damage10: '+10% damage',
  regen: 'regenerate health',
  stamina: 'stamina returns faster',
  glide: 'glide on the air',
};
export const relicText = (id: string) =>
  (RELIC_EFFECTS[id] ?? []).map((k) => EFFECT_TEXT[k] ?? k).join(', ');
/** Relics a shelf holds: three, one more at renown 20 and another at 40. */
export const shelfSlots = (renown: number) => 3 + (renown >= 20 ? 1 : 0) + (renown >= 40 ? 1 : 0);
