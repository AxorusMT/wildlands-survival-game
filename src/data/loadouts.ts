// Ready-made kits for the field console's `gear` command: armour, weapons, accessories, health,
// and supplies fit for each stage of the journey, up to the Unmaker.

export interface Loadout {
  /** The highest weapon and armour tier in the kit. */
  tier: number;
  /** Quality (an index into QUALITIES) and anvil level of its weapons. */
  q: number;
  lvl: number;
  /** The weapons' infusion and gems, and the armour's level and infusion. */
  inf?: string;
  gems: string[];
  armourLvl: number;
  armourInf?: string;
  accessories: string[];
  health: number;
  mana: number;
  supplies: [item: string, qty: number][];
  note: string;
}

export const LOADOUTS: Record<string, Loadout> = {
  early: {
    tier: 3,
    q: 1,
    lvl: 2,
    gems: [],
    armourLvl: 0,
    accessories: ['cloud_jar'],
    health: 160,
    mana: 60,
    supplies: [
      ['healing_draught', 8],
      ['bandage', 5],
      ['torch', 20],
    ],
    note: 'Iron-age kit for the first dungeons.',
  },
  mid: {
    tier: 6,
    q: 2,
    lvl: 5,
    inf: 'fire',
    gems: ['ruby'],
    armourLvl: 2,
    accessories: ['cloud_jar', 'magma_stone', 'band_of_vigor'],
    health: 220,
    mana: 100,
    supplies: [
      ['healing_draught', 15],
      ['mana_draught', 5],
      ['bandage', 5],
    ],
    note: 'Band I–II realms and hell.',
  },
  late: {
    tier: 9,
    q: 3,
    lvl: 8,
    inf: 'holy',
    gems: ['ruby', 'emerald'],
    armourLvl: 4,
    accessories: ['demon_wings', 'wind_boots', 'band_of_vigor'],
    health: 300,
    mana: 160,
    supplies: [
      ['greater_healing', 15],
      ['mana_draught', 10],
      ['ironskin_potion', 3],
    ],
    note: 'Band III–IV realms.',
  },
  endgame: {
    tier: 12,
    q: 4,
    lvl: 10,
    // The Unmaker and its shades are weak to holy light and shrug off void.
    inf: 'holy',
    gems: ['ruby', 'emerald', 'onyx'],
    armourLvl: 5,
    armourInf: 'void',
    accessories: ['demon_wings', 'wind_boots', 'band_of_vigor'],
    health: 400,
    mana: 200,
    supplies: [
      ['greater_healing', 30],
      ['mana_draught', 15],
      ['ironskin_potion', 5],
      ['regeneration_potion', 5],
      ['wrath_potion', 5],
      ['swiftness_potion', 5],
      ['void_seal', 1],
    ],
    note: 'Tier XII, Mythic +10, holy-infused: ready for the Unmaker.',
  },
};
/** Other names for the kits. */
export const LOADOUT_ALIASES: Record<string, string> = {
  unmaker: 'endgame',
  final: 'endgame',
  start: 'early',
  hell: 'mid',
};
