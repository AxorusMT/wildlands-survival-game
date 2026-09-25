// Food and cold: what each food gives, how temperature speeds rot, the cold-storage ladder, the
// preserves that keep, and the cooked meals whose comfort lasts beyond the meal.

/** Calories, protein, and vitamins per serving. */
export const FOOD: Record<string, [calories: number, protein: number, vitamins: number]> = {
  glowcap: [10, 3, 6],
  berry: [8, 0, 14],
  mushroom: [9, 2, 4],
  honey: [13, 0, 4],
  wheat: [4, 2, 0],
  potato: [14, 3, 5],
  raw_meat: [21, 21, 0],
  cooked_meat: [29, 25, 0],
  bread: [27, 6, 0],
  cactus_fruit: [11, 1, 16],
  raw_fish: [16, 18, 2],
  cooked_fish: [25, 22, 3],
  smoked_meat: [38, 32, 0],
  trail_ration: [48, 28, 6],
  potato_stew: [41, 20, 10],
  bog_apple: [12, 1, 14],
  herb: [2, 0, 8],
  sunbloom: [10, 1, 12],
  frost_lily: [6, 0, 18],
  smoked_fish: [30, 26, 2],
  canned_stew: [40, 18, 10],
  canned_fruit: [24, 0, 18],
  // Preserves.
  salted_meat: [34, 28, 0],
  salted_fish: [28, 24, 1],
  pickled_mushrooms: [14, 3, 12],
  berry_preserves: [26, 0, 20],
  // Meals.
  hearty_stew: [55, 30, 14],
  fish_chowder: [46, 30, 10],
  spiced_skewers: [42, 32, 4],
  honey_cakes: [44, 6, 12],
  mushroom_broth: [30, 6, 16],
  orchard_pie: [50, 4, 22],
  ember_chili: [42, 18, 12],
  explorers_feast: [70, 36, 24],
};
/** Foods that are raw: eaten, they may carry fever or worms. */
export const RAW = new Set(['raw_meat', 'raw_fish']);

/** Meals that leave a comfort behind them: the buff and its seconds. */
export const MEAL_BUFFS: Record<string, [buff: string, seconds: number]> = {
  hearty_stew: ['well_fed', 480],
  fish_chowder: ['well_fed', 420],
  spiced_skewers: ['fiery', 360],
  honey_cakes: ['sweet', 360],
  mushroom_broth: ['clear_mind', 420],
  orchard_pie: ['warm_belly', 480],
  ember_chili: ['warm_belly', 420],
  explorers_feast: ['feasted', 600],
  iron_gut_brew: ['iron_gut', 600],
};

/**
 * How much faster food rots at an air temperature: frozen below freezing, steady in the
 * temperate middle, and quicker and quicker in the heat.
 */
export function rotRate(temp: number) {
  if (temp <= -10) return 0.3;
  if (temp < 8) return 0.3 + ((temp + 10) / 18) * 0.7;
  if (temp <= 20) return 1;
  return Math.min(2.6, 1 + (temp - 20) / 18);
}
/** How fast ice melts at a temperature (a multiplier on its burn time; none below freezing). */
export function meltRate(temp: number) {
  return temp <= 0 ? 0 : temp <= 20 ? 1 : Math.min(3, 1 + (temp - 20) / 12);
}

/** The cold-storage ladder: how much each slows rot, what cools it, and how much it holds. */
export interface Storage {
  name: string;
  tier: number;
  /** Rot multiplier while cold. */
  mult: number;
  /** Stacks it holds. */
  capacity: number;
  /** What keeps it cold, and seconds per unit (at temperate air); none needs no fuel. */
  fuel?: string;
  per?: number;
  text: string;
}
export const STORAGE: Record<string, Storage> = {
  cool_pit: {
    name: 'Cool pit',
    tier: 1,
    mult: 0.6,
    capacity: 8,
    text: 'Dug into the earth: food keeps a little longer, better still underground.',
  },
  icebox: {
    name: 'Icebox',
    tier: 2,
    mult: 0.18,
    capacity: 12,
    fuel: 'ice',
    per: 900,
    text: 'Cold while it has ice; ice melts faster in the heat.',
  },
  snow_cellar: {
    name: 'Snow cellar',
    tier: 3,
    mult: 0.14,
    capacity: 20,
    fuel: 'ice',
    per: 2400,
    text: 'Packed snow keeps ice for a long time, and needs none below freezing.',
  },
  frost_chest: {
    name: 'Frost chest',
    tier: 4,
    mult: 0.06,
    capacity: 16,
    fuel: 'frost_shard',
    per: 3600,
    text: 'Frost shards from the Frost Keep hold it near frozen whatever the weather.',
  },
  rime_vault: {
    name: 'Rime vault',
    tier: 5,
    mult: 0.02,
    capacity: 24,
    text: 'Starmetal and frost: food all but stops ageing, and it needs nothing.',
  },
};

/** Charms that keep the pack itself cool, and ice from melting in it. */
export const PACK_COOLING: Record<string, number> = {
  insulated_satchel: 0.75,
  frost_lined_pack: 0.5,
  rime_lined_pack: 0.3,
};
