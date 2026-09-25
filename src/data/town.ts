// Homes and the people who come to live in them: back walls, doors and furniture, the settlers
// who move into proper houses, what they sell, and what things are worth in trade.

/** Placeable back walls: item id to the ground material they are drawn from. */
export const WALLS: Record<string, number> = {
  dirt_wall: 1,
  stone_wall: 2,
  wood_wall: 11,
  stone_brick_wall: 12,
  clay_brick_wall: 13,
  glass_wall: 14,
  crypt_wall: 15,
  frost_wall: 16,
  tomb_wall: 17,
  citadel_wall: 18,
  fungal_wall: 20,
  skystone_wall: 22,
  voidstone_wall: 23,
  obsidian_wall: 25,
  sandstone_wall: 26,
};
/** The wall item a natural or placed wall of each material gives back when hammered. */
export const WALL_ITEM: Record<number, string> = Object.fromEntries(
  Object.entries(WALLS).map(([id, kind]) => [kind, id]),
);
Object.assign(WALL_ITEM, {
  3: 'sandstone_wall',
  4: 'dirt_wall',
  5: 'stone_wall',
  6: 'stone_wall',
  8: 'stone_wall',
  9: 'stone_wall',
  10: 'stone_wall',
  19: 'dirt_wall',
});

/** The solid tile a closed door fills (two tiles tall); the door structure draws it. */
export const DOOR_TILE = 29;
/** Furniture a house needs, and what counts for each. */
export const HOUSE_NEEDS = {
  seat: ['chair', 'bed', 'bedroll'],
  table: ['table', 'workbench', 'apothecary'],
  light: ['torch', 'lantern', 'crystal_lantern', 'campfire'],
} as const;
/** Rooms smaller than this feel like cupboards; larger ones are halls, not homes (in tiles). */
export const ROOM_SIZE = { min: 10, max: 160 } as const;

export interface Settler {
  id: string;
  name: string;
  title: string;
  /** A tally key (see Progress.record) that brings them, and how many. */
  unlock: [key: string, count: number];
  /** What they sell, and for how many silver marks. */
  stock: [item: string, price: number][];
  /** Things they say. */
  lines: string[];
  /** Coat, trim, and hat colours. */
  colors: [string, string, string];
}
export const SETTLERS: Settler[] = [
  {
    id: 'guide',
    name: 'Ada',
    title: 'the Guide',
    unlock: ['place:campfire', 1],
    stock: [
      ['torch', 2],
      ['arrow', 1],
      ['healing_draught', 30],
      ['fiber', 2],
      ['wood', 2],
    ],
    lines: [
      'A campfire, a roof, walls on every side, a chair, a table, and a light. That is a home, and folk will come to fill it.',
      'Hold a pickaxe and click the ground to dig. Harder stone takes more strikes, and better picks.',
      'Five fallen stars make a mana crystal. They only fall on clear nights, out under the sky.',
      'The Mossy Crypt lies beneath the forest. Its king has kept his throne too long.',
      'Set a sigil in the Rift Gate and it opens. Four sigils, four dungeons.',
    ],
    colors: ['#5d7560', '#c9a24e', '#7d6444'],
  },
  {
    id: 'trader',
    name: 'Bram',
    title: 'the Trader',
    unlock: ['coin', 50],
    stock: [
      ['chest', 60],
      ['bed', 40],
      ['lantern', 45],
      ['platform', 8],
      ['herb', 6],
      ['wheat', 6],
      ['potato', 6],
      ['boiled_water', 5],
      ['bread', 12],
      ['wooden_hammer', 20],
    ],
    lines: [
      'Everything has a price, friend. Even that rock. Especially that rock.',
      'Silver marks drop from anything with a heartbeat. Bring them here.',
      'A chest by the door keeps a pack light for the long walk.',
    ],
    colors: ['#8a4a3a', '#e8c86a', '#3a2a1c'],
  },
  {
    id: 'smith',
    name: 'Corra',
    title: 'the Smith',
    unlock: ['craft:copper_ingot', 1],
    stock: [
      ['copper_ingot', 12],
      ['iron_ingot', 24],
      ['silver_ingot', 40],
      ['coal', 4],
      ['iron_hammer', 60],
      ['arrow', 1],
      ['iron_bow', 90],
    ],
    lines: [
      'Copper, then iron, then steel. The forge does not skip a step, and neither should you.',
      'Silver sits between iron and steel, down in the cold mines. Gold lies deeper still.',
      'Bring me hellstone and I will show you what heat really is.',
    ],
    colors: ['#4a4e4f', '#d0844a', '#2a2420'],
  },
  {
    id: 'herbalist',
    name: 'Dell',
    title: 'the Herbalist',
    unlock: ['place:apothecary', 1],
    stock: [
      ['herb', 5],
      ['honey', 10],
      ['willow', 8],
      ['healing_draught', 25],
      ['regeneration_potion', 60],
      ['swiftness_potion', 60],
      ['antivenom', 40],
    ],
    lines: [
      'Boil your water. I will keep saying it until someone listens.',
      'A healing draught mends quickly, but the body needs a moment before the next.',
      'Glowcaps from the Deep make the finest draughts I know.',
    ],
    colors: ['#6a8a4a', '#e8e0a0', '#4a6a3a'],
  },
  {
    id: 'tinker',
    name: 'Esk',
    title: 'the Tinker',
    unlock: ['visit:crypt', 1],
    stock: [
      ['miners_lamp', 150],
      ['grappling_hook', 180],
      ['rope', 2],
      ['bucket', 20],
      ['cloud_jar', 400],
      ['magma_stone', 350],
    ],
    lines: [
      'A hook, a rope, a little nerve. Walls are only suggestions.',
      'Three charms at once and not a fourth. Too many and they argue.',
      'The Citadel gates face the lava sea. Bring a Fireward if you like your boots.',
    ],
    colors: ['#6a5a8a', '#d8b848', '#3a3040'],
  },
  {
    id: 'mystic',
    name: 'Fenn',
    title: 'the Mystic',
    unlock: ['sigils', 1],
    stock: [
      ['mana_draught', 30],
      ['mana_crystal', 250],
      ['life_crystal', 400],
      ['ember_wand', 220],
      ['crystal_arrow', 3],
      ['shine_potion', 50],
    ],
    lines: [
      'The Rift is not a door. It is a wound that remembers being a door.',
      'The Deep is alive. Every glowing thing down there is one thing, dreaming.',
      'Beyond the islands, beyond the stars, something is watching. It has only one eye.',
    ],
    colors: ['#3a2a5a', '#b36cff', '#1a1026'],
  },
  {
    id: 'skysailor',
    name: 'Gale',
    title: 'the Sky-sailor',
    unlock: ['visit:skyreach', 1],
    stock: [
      ['featherfall_potion', 40],
      ['cloud', 2],
      ['sky_wood', 6],
      ['starmetal_ore', 60],
      ['fallen_star', 40],
      ['wind_boots', 900],
    ],
    lines: [
      'Fall off an island and you land on cloud. Soft, if you are lucky.',
      'The Roc nests on the highest island. It does not like visitors.',
    ],
    colors: ['#8ab8e0', '#f0f0f8', '#5a6a8a'],
  },
  {
    id: 'voidtouched',
    name: 'Hollis',
    title: 'the Void-touched',
    unlock: ['visit:void', 1],
    stock: [
      ['void_essence', 60],
      ['voidsteel_ore', 90],
      ['wrath_potion', 80],
      ['greater_healing', 90],
      ['watcher_lens', 200],
    ],
    lines: [
      'I went through and came back. Mostly.',
      'The Unmaker does not hate you. It does not know you are there. That is worse.',
    ],
    colors: ['#2a1c3a', '#ff5a8a', '#140a22'],
  },
];
export const SETTLER_IDS = SETTLERS.map((s) => s.id);
export const settlerById = (id: string) => SETTLERS.find((s) => s.id === id);

/** Base worth in silver marks of raw materials; crafted things are worth their parts and more. */
export const BASE_VALUE: Record<string, number> = {
  wood: 2,
  stone: 1,
  fiber: 1,
  flint: 2,
  clay: 2,
  dirt: 1,
  sand: 1,
  reeds: 1,
  salt: 3,
  coal: 4,
  copper_ore: 4,
  iron_ore: 7,
  silver_ore: 11,
  gold_ore: 16,
  ice: 3,
  obsidian: 12,
  sulfur: 8,
  crystal: 18,
  hellstone: 22,
  hide: 5,
  bone: 3,
  chitin: 4,
  venom: 8,
  feathers: 3,
  resin: 5,
  honey: 8,
  herb: 4,
  willow: 5,
  berry: 2,
  mushroom: 3,
  wheat: 3,
  potato: 3,
  cactus_fruit: 3,
  raw_meat: 3,
  raw_fish: 4,
  wild_water: 1,
  gel: 3,
  silk: 5,
  grave_dust: 14,
  frost_shard: 16,
  linen: 12,
  sun_gold: 20,
  cinder_core: 28,
  spores: 20,
  glowcap: 18,
  sunbloom: 22,
  void_lily: 30,
  sky_silk: 26,
  void_essence: 40,
  watcher_lens: 60,
  shroom_wood: 8,
  sky_wood: 10,
  void_wood: 14,
  fallen_star: 20,
  myconite_ore: 30,
  starmetal_ore: 45,
  voidsteel_ore: 65,
  ruby: 40,
  sapphire: 40,
  emerald: 40,
  eclipse_fang: 120,
  direwolf_pelt: 80,
  beast_core: 150,
  life_crystal: 200,
  life_fruit: 300,
  coin: 1,
};
