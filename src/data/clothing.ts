// Clothing, carried water, and what a diet is made of. Clothing is worn in three layers apart
// from armour: under, mid, and outer. Each keeps out cold or heat or rain, and wears out with
// hard use until it is mended at a workbench.

export type ClothingLayer = 'under' | 'mid' | 'outer';
export interface Garment {
  layer: ClothingLayer;
  /** Degrees of cold and of heat it shrugs off, and the share of rain it keeps out. */
  insul: number;
  heat: number;
  water: number;
  /** Seconds of hard use (cold, heat, or rain) before it is worn through. */
  life: number;
  text: string;
}
export const CLOTHING: Record<string, Garment> = {
  linen_underlayer: {
    layer: 'under',
    insul: 1,
    heat: 2,
    water: 0,
    life: 5400,
    text: 'Light linen: a little warmth, cool in the heat',
  },
  wool_underlayer: {
    layer: 'under',
    insul: 3,
    heat: 0,
    water: 0,
    life: 6000,
    text: 'Warm wool against the skin',
  },
  silk_underlayer: {
    layer: 'under',
    insul: 1,
    heat: 4,
    water: 0.05,
    life: 7200,
    text: 'Spider silk: breathes in the worst heat',
  },
  hide_vest: {
    layer: 'mid',
    insul: 3,
    heat: 0,
    water: 0.1,
    life: 6000,
    text: 'Tanned hide over the chest',
  },
  fur_jerkin: {
    layer: 'mid',
    insul: 6,
    heat: -1,
    water: 0.1,
    life: 6600,
    text: 'Thick fur: warm, and hot in the sun',
  },
  linen_shirt: {
    layer: 'mid',
    insul: 1,
    heat: 3,
    water: 0,
    life: 5400,
    text: 'A loose shirt that keeps the sun off',
  },
  oilskin_coat: {
    layer: 'outer',
    insul: 2,
    heat: 0,
    water: 0.7,
    life: 7200,
    text: 'Waxed cloth: rain runs off it',
  },
  fur_cloak: {
    layer: 'outer',
    insul: 8,
    heat: -2,
    water: 0.2,
    life: 7200,
    text: 'A heavy fur cloak for the deep cold',
  },
  desert_robe: {
    layer: 'outer',
    insul: 0,
    heat: 6,
    water: 0.1,
    life: 7200,
    text: 'Pale layered cloth for the open desert',
  },
  rime_parka: {
    layer: 'outer',
    insul: 12,
    heat: -2,
    water: 0.5,
    life: 9000,
    text: 'Frost-lined and hooded: the coldest places yield to it',
  },
  ember_mantle: {
    layer: 'outer',
    insul: 1,
    heat: 10,
    water: 0.3,
    life: 9000,
    text: 'Woven cinderflax: heat slides off it',
  },
};

/** Waterskins carried in the pack: more from each drink, and water that will not freeze. */
export const WATERSKINS: Record<string, { drink: number; freezeProof: boolean; text: string }> = {
  waterskin: { drink: 0.25, freezeProof: false, text: 'Each drink goes a quarter further' },
  insulated_flask: {
    drink: 0.4,
    freezeProof: true,
    text: 'Drinks go further, and water will not freeze',
  },
  rime_flask: { drink: 0.6, freezeProof: true, text: 'Drinks go much further; nothing freezes' },
};

/** What kind of food each is: a diet across several kinds keeps you strong. */
export type FoodGroup = 'meat' | 'fish' | 'grain' | 'fruit' | 'greens' | 'fungus' | 'sweet';
export const FOOD_GROUPS: Record<string, FoodGroup> = {
  raw_meat: 'meat',
  cooked_meat: 'meat',
  smoked_meat: 'meat',
  salted_meat: 'meat',
  spiced_skewers: 'meat',
  raw_fish: 'fish',
  cooked_fish: 'fish',
  salted_fish: 'fish',
  smoked_fish: 'fish',
  fish_chowder: 'fish',
  bread: 'grain',
  wheat: 'grain',
  trail_ration: 'grain',
  potato: 'greens',
  potato_stew: 'greens',
  hearty_stew: 'greens',
  canned_stew: 'greens',
  herb: 'greens',
  frost_lily: 'greens',
  berry: 'fruit',
  cactus_fruit: 'fruit',
  bog_apple: 'fruit',
  berry_preserves: 'fruit',
  orchard_pie: 'fruit',
  canned_fruit: 'fruit',
  sunbloom: 'fruit',
  mushroom: 'fungus',
  glowcap: 'fungus',
  pickled_mushrooms: 'fungus',
  mushroom_broth: 'fungus',
  honey: 'sweet',
  honey_cakes: 'sweet',
  ember_chili: 'meat',
  explorers_feast: 'meat',
};
/** How many recent meals the diet looks back over. */
export const DIET_MEMORY = 8;
