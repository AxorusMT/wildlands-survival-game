"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/data/index.ts
  var data_exports = {};
  __export(data_exports, {
    BIOMES: () => BIOMES,
    BIOME_CENTERS: () => BIOME_CENTERS,
    BIOME_SPANS: () => BIOME_SPANS,
    BOSSES: () => BOSSES,
    CAVE_LEVELS: () => CAVE_LEVELS,
    CHAPTERS: () => CHAPTERS,
    DISEASES: () => DISEASES,
    ENTRANCES: () => ENTRANCES,
    Ground: () => Ground,
    ITEMS: () => ITEMS,
    LAVA_Y: () => LAVA_Y,
    LAYERS: () => LAYERS,
    MINE_TIER: () => MINE_TIER,
    NODES: () => NODES,
    RECIPES: () => RECIPES,
    SHAFTS: () => SHAFTS,
    SIDE_ORDER: () => SIDE_ORDER,
    SURFACE_BAND: () => SURFACE_BAND,
    TILE: () => TILE,
    TILE_COLS: () => TILE_COLS,
    TILE_ROWS: () => TILE_ROWS,
    TILE_YIELD: () => TILE_YIELD,
    TOOL_TIERS: () => TOOL_TIERS,
    TUTORIAL: () => TUTORIAL,
    WEAPONS: () => WEAPONS,
    WORLD_H: () => WORLD_H,
    WORLD_W: () => WORLD_W,
    baseTileAt: () => baseTileAt,
    baselineAt: () => baselineAt,
    biomeAt: () => biomeAt,
    biomeBlend: () => biomeBlend,
    caveAt: () => caveAt,
    caveY: () => caveY,
    inShaft: () => inShaft,
    itemName: () => itemName,
    lavaAt: () => lavaAt,
    layerAt: () => layerAt,
    nodeForm: () => nodeForm,
    surfaceAt: () => surfaceAt,
    underworldCeiling: () => underworldCeiling,
    underworldFloor: () => underworldFloor
  });

  // src/data/biomes.ts
  var BIOMES = [
    {
      id: "tundra",
      name: "Tundra",
      x: 0,
      y: 0,
      color: "#9aa9a1",
      shade: "#d4d6c8",
      temp: -12,
      note: "Ice and iron lie under open frost. Exposure is relentless.",
      resources: ["ice", "stone", "iron_ore", "coal", "fiber"]
    },
    {
      id: "taiga",
      name: "Taiga",
      x: 1,
      y: 0,
      color: "#506d66",
      shade: "#779184",
      temp: -5,
      note: "Cold conifers shelter wolves, iron, coal, and timber.",
      resources: ["wood", "wood", "stone", "iron_ore", "coal", "mushroom"]
    },
    {
      id: "alpine",
      name: "Alpine",
      x: 2,
      y: 0,
      color: "#777f86",
      shade: "#b9b9ad",
      temp: -9,
      note: "Ore-rich high ground and crystal caves. The wind strips warmth quickly.",
      resources: ["stone", "stone", "iron_ore", "coal", "ice", "fiber", "crystal"]
    },
    {
      id: "coast",
      name: "Coast",
      x: 0,
      y: 1,
      color: "#7d9f8f",
      shade: "#c8bf9c",
      temp: 13,
      note: "Salt wind, clay beds, reeds, shellfish, and wild water.",
      resources: ["clay", "fiber", "stone", "wood", "herb", "water", "salt", "reeds"]
    },
    {
      id: "meadow",
      name: "Meadow",
      x: 1,
      y: 1,
      color: "#87966a",
      shade: "#b9ad78",
      temp: 16,
      note: "A gentler beginning: loose stone, fallen wood, flint, and food.",
      resources: ["wood", "stone", "fiber", "flint", "berry", "potato", "wheat", "water"]
    },
    {
      id: "forest",
      name: "Forest",
      x: 2,
      y: 1,
      color: "#456a53",
      shade: "#79906a",
      temp: 11,
      note: "Copper, bark, mushrooms, resin, and honey beneath dense cover.",
      resources: [
        "wood",
        "wood",
        "stone",
        "copper_ore",
        "mushroom",
        "honey",
        "willow",
        "fiber",
        "water",
        "resin"
      ]
    },
    {
      id: "marsh",
      name: "Marsh",
      x: 0,
      y: 2,
      color: "#596f58",
      shade: "#939c70",
      temp: 12,
      note: "Wet footing increases exposure. Clay, reeds, and medicinal herbs grow here.",
      resources: ["clay", "herb", "mushroom", "fiber", "wood", "water", "potato", "reeds"]
    },
    {
      id: "desert",
      name: "Desert",
      x: 1,
      y: 2,
      color: "#bd9a69",
      shade: "#dfc494",
      temp: 34,
      note: "Heat and thirst rule the dunes. Sulfur and cactus fruit hide in dry gullies.",
      resources: ["stone", "sulfur", "flint", "fiber", "clay", "cactus_fruit"]
    },
    {
      id: "badlands",
      name: "Badlands",
      x: 2,
      y: 2,
      color: "#9d604c",
      shade: "#c18b65",
      temp: 29,
      note: "Obsidian, sulfur, and crystal are guarded by wolves and brutal heat.",
      resources: ["obsidian", "sulfur", "stone", "coal", "flint", "crystal"]
    }
  ];

  // src/data/bosses.ts
  var BOSSES = [
    {
      name: "Eclipse Direwolf",
      kills: 6,
      hp: 380,
      bite: 19,
      rewards: { eclipse_fang: 1, direwolf_pelt: 2, beast_core: 1 },
      xp: 50,
      color: "#a8d9e5",
      glow: "#cdeaff"
    },
    {
      name: "Ember Direwolf",
      kills: 9,
      hp: 620,
      bite: 26,
      rewards: { eclipse_fang: 2, direwolf_pelt: 3, beast_core: 2 },
      xp: 90,
      color: "#e89454",
      glow: "#ffbc70"
    },
    {
      name: "Void Direwolf",
      kills: 12,
      hp: 920,
      bite: 34,
      rewards: { eclipse_fang: 3, direwolf_pelt: 5, beast_core: 3 },
      xp: 150,
      color: "#af86d3",
      glow: "#e3baf7"
    }
  ];

  // src/data/diseases.ts
  var DISEASES = {
    dysentery: {
      name: "Dysentery",
      cause: "Untreated water or rotten food",
      treat: "Herbal rehydration tea",
      item: "herbal_tea"
    },
    fever: {
      name: "Fever",
      cause: "Raw meat or rotten food",
      treat: "Willow fever remedy",
      item: "fever_remedy"
    },
    wound: {
      name: "Infected wound",
      cause: "Animal bite and poor hygiene",
      treat: "Antiseptic poultice or cultured antibiotic",
      item: "poultice"
    },
    poisoning: {
      name: "Venom poisoning",
      cause: "Scorpion sting",
      treat: "Antivenom or cultured antibiotic",
      item: "antivenom"
    }
  };

  // src/data/items.ts
  var ITEMS = {
    wood: ["Wood", "material"],
    stone: ["Stone", "material"],
    fiber: ["Fiber", "material"],
    flint: ["Flint", "material"],
    clay: ["Clay", "material"],
    copper_ore: ["Copper ore", "ore"],
    iron_ore: ["Iron ore", "ore"],
    coal: ["Coal", "material"],
    ice: ["Ice", "material"],
    obsidian: ["Obsidian", "ore"],
    sulfur: ["Sulfur", "ore"],
    hide: ["Hide", "material"],
    bone: ["Bone", "material"],
    resin: ["Pine resin", "material"],
    reeds: ["Reeds", "material"],
    salt: ["Sea salt", "material"],
    crystal: ["Cave crystal", "ore"],
    hellstone: ["Hellstone", "ore"],
    chitin: ["Chitin", "material"],
    venom: ["Venom sac", "material"],
    feathers: ["Feathers", "material"],
    dirt: ["Earth", "material"],
    berry: ["Berries", "food", 700],
    mushroom: ["Mushroom", "food", 950],
    honey: ["Honey", "food", 2400],
    wheat: ["Wheat", "food", 1500],
    potato: ["Potato", "food", 1600],
    herb: ["Medicinal herb", "medicine", 1200],
    willow: ["Willow bark", "medicine", 1800],
    raw_meat: ["Raw meat", "food", 500],
    cooked_meat: ["Cooked meat", "food", 1450],
    bread: ["Bread", "food", 1650],
    cactus_fruit: ["Cactus fruit", "food", 850],
    raw_fish: ["Raw fish", "food", 420],
    cooked_fish: ["Cooked fish", "food", 1300],
    smoked_meat: ["Smoked meat", "food", 3200],
    trail_ration: ["Trail ration", "food", 4200],
    potato_stew: ["Potato stew", "food", 1700],
    wild_water: ["Wild water", "water"],
    boiled_water: ["Boiled water", "water", 1350],
    copper_ingot: ["Copper ingot", "metal"],
    iron_ingot: ["Iron ingot", "metal"],
    steel_ingot: ["Steel ingot", "metal"],
    hellstone_ingot: ["Hellstone ingot", "metal"],
    herbal_tea: ["Herbal rehydration tea", "medicine", 1200],
    poultice: ["Antiseptic poultice", "medicine", 1400],
    fever_remedy: ["Willow fever remedy", "medicine", 1500],
    antibiotic: ["Cultured antibiotic", "medicine", 2100],
    antivenom: ["Antivenom", "medicine", 1900],
    warming_brew: ["Warming brew", "medicine", 1700],
    stone_axe: ["Stone axe", "tool"],
    stone_pick: ["Stone pickaxe", "tool"],
    flint_spear: ["Flint spear", "weapon"],
    copper_axe: ["Copper axe", "tool"],
    copper_pick: ["Copper pickaxe", "tool"],
    copper_spear: ["Copper spear", "weapon"],
    iron_axe: ["Iron axe", "tool"],
    iron_pick: ["Iron pickaxe", "tool"],
    iron_sword: ["Iron sword", "weapon"],
    steel_axe: ["Steel axe", "tool"],
    steel_pick: ["Steel pickaxe", "tool"],
    steel_sword: ["Steel sword", "weapon"],
    obsidian_axe: ["Obsidian axe", "tool"],
    obsidian_pick: ["Obsidian pickaxe", "tool"],
    obsidian_blade: ["Obsidian blade", "weapon"],
    eclipse_blade: ["Eclipse Blade", "weapon"],
    hellfire_blade: ["Hellfire Blade", "weapon"],
    direwolf_cloak: ["Direwolf Cloak", "clothing"],
    hide_coat: ["Hide coat", "clothing"],
    explorer_boots: ["Explorer boots", "clothing"],
    cinder_ward: ["Cinder Ward", "clothing"],
    fishing_rod: ["Fishing rod", "tool"],
    eclipse_fang: ["Eclipse Fang", "trophy"],
    direwolf_pelt: ["Direwolf Pelt", "trophy"],
    beast_core: ["Beast Core", "trophy"],
    campfire: ["Campfire", "structure"],
    shelter: ["Lean-to shelter", "structure"],
    workbench: ["Workbench", "structure"],
    furnace: ["Furnace", "structure"],
    forge: ["Forge", "structure"],
    apothecary: ["Apothecary", "structure"],
    icebox: ["Icebox", "structure"],
    bedroll: ["Bedroll", "structure"],
    farm_plot: ["Farm plot", "structure"],
    effergy: ["Effergy of Beasts", "structure"],
    drying_rack: ["Drying rack", "structure"],
    rain_catcher: ["Rain catcher", "structure"],
    lantern: ["Resin lantern", "structure"],
    crystal_lantern: ["Crystal lantern", "structure"],
    platform: ["Wooden platform", "structure"],
    spike_trap: ["Spike trap", "structure"],
    chest: ["Field chest", "structure"]
  };
  var itemName = (id) => ITEMS[id]?.[0] || id;

  // src/data/progression.ts
  var TUTORIAL = [
    ["Gather fallen wood", "wood", 3],
    ["Pick up loose stone", "stone", 3],
    ["Collect meadow fiber", "fiber", 2],
    ["Craft a stone axe in Recipes", "craft:stone_axe", 1],
    ["Find and gather flint", "flint", 2],
    ["Craft a campfire", "craft:campfire", 1],
    ["Place the campfire nearby", "place:campfire", 1],
    ["Collect untreated water", "wild_water", 1],
    ["Boil water at the campfire", "craft:boiled_water", 1],
    ["Drink safe water from Pack", "drink:boiled_water", 1]
  ];
  var CHAPTERS = [
    ["Cross into the forest", "visit:forest", 1],
    ["Gather copper from the forest caves", "copper_ore", 3],
    ["Make a workbench", "craft:workbench", 1],
    ["Build a furnace", "place:furnace", 1],
    ["Smelt a copper ingot", "craft:copper_ingot", 1],
    ["Explore the taiga", "visit:taiga", 1],
    ["Bring home iron ore", "iron_ore", 3],
    ["Forge a steel ingot", "craft:steel_ingot", 1],
    ["Enter the desert", "visit:desert", 1],
    ["Mine black obsidian", "obsidian", 5],
    ["Place the Effergy of Beasts", "place:effergy", 1],
    ["Defeat an Eclipse Direwolf", "kill:boss", 1],
    ["Defeat an Ember Direwolf", "kill:boss", 2],
    ["Defeat the Void Direwolf", "kill:boss", 3]
  ];

  // src/data/recipes.ts
  var RECIPES = [
    ["stone_axe", { wood: 2, stone: 3, fiber: 2 }, null, 1],
    ["stone_pick", { wood: 2, stone: 4, fiber: 2 }, null, 1],
    ["flint_spear", { wood: 3, flint: 2, fiber: 2 }, null, 1],
    ["campfire", { wood: 5, stone: 6 }, null, 1],
    ["shelter", { wood: 10, fiber: 8, hide: 2 }, null, 1],
    ["workbench", { wood: 9, stone: 4, fiber: 4 }, null, 1],
    ["bedroll", { fiber: 8, hide: 2 }, "workbench", 1],
    ["farm_plot", { wood: 4, fiber: 4, clay: 3 }, "workbench", 1],
    ["fishing_rod", { wood: 3, fiber: 5, flint: 1 }, "workbench", 1],
    ["platform", { wood: 4, fiber: 2 }, "workbench", 1],
    ["drying_rack", { wood: 7, fiber: 6 }, "workbench", 1],
    ["rain_catcher", { wood: 7, clay: 4, reeds: 5 }, "workbench", 2],
    ["chest", { wood: 10, fiber: 4, iron_ingot: 1 }, "workbench", 2],
    ["hide_coat", { hide: 5, fiber: 5 }, "workbench", 2],
    ["lantern", { copper_ingot: 2, clay: 2, resin: 4 }, "workbench", 2],
    ["crystal_lantern", { crystal: 4, steel_ingot: 2, obsidian: 2 }, "forge", 4],
    ["furnace", { stone: 14, clay: 10, wood: 5 }, "workbench", 2],
    ["copper_ingot", { copper_ore: 3, coal: 1 }, "furnace", 2],
    ["copper_axe", { copper_ingot: 3, wood: 2, fiber: 2 }, "workbench", 2],
    ["copper_pick", { copper_ingot: 3, wood: 2, fiber: 2 }, "workbench", 2],
    ["copper_spear", { copper_ingot: 3, wood: 3, fiber: 2 }, "workbench", 2],
    ["iron_ingot", { iron_ore: 3, coal: 2 }, "furnace", 3],
    ["iron_axe", { iron_ingot: 4, wood: 2, fiber: 2 }, "workbench", 3],
    ["iron_pick", { iron_ingot: 4, wood: 2, fiber: 2 }, "workbench", 3],
    ["iron_sword", { iron_ingot: 5, wood: 2, hide: 1 }, "workbench", 3],
    ["icebox", { wood: 12, iron_ingot: 4, clay: 6 }, "workbench", 3],
    ["explorer_boots", { hide: 4, iron_ingot: 2, fiber: 3 }, "workbench", 3],
    ["spike_trap", { iron_ingot: 3, wood: 4, fiber: 2 }, "workbench", 3],
    ["apothecary", { wood: 10, clay: 8, iron_ingot: 2, herb: 4 }, "workbench", 3],
    ["forge", { stone: 20, clay: 12, iron_ingot: 8, coal: 8 }, "workbench", 4],
    ["steel_ingot", { iron_ingot: 2, coal: 2 }, "forge", 4],
    ["steel_axe", { steel_ingot: 4, wood: 2, hide: 1 }, "forge", 4],
    ["steel_pick", { steel_ingot: 4, wood: 2, hide: 1 }, "forge", 4],
    ["steel_sword", { steel_ingot: 5, wood: 2, hide: 2 }, "forge", 4],
    ["obsidian_axe", { obsidian: 5, steel_ingot: 3, hide: 1 }, "forge", 5],
    ["obsidian_pick", { obsidian: 5, steel_ingot: 3, hide: 1 }, "forge", 5],
    ["obsidian_blade", { obsidian: 7, steel_ingot: 4, hide: 2 }, "forge", 5],
    ["cinder_ward", { obsidian: 6, sulfur: 6, hide: 8, ice: 8 }, "forge", 5],
    ["hellstone_ingot", { hellstone: 3, coal: 2, sulfur: 1 }, "forge", 6],
    ["hellfire_blade", { hellstone_ingot: 8, obsidian: 6, hide: 2 }, "forge", 6],
    [
      "effergy",
      { obsidian: 24, steel_ingot: 18, sulfur: 12, bone: 16, hide: 12, ice: 6, antibiotic: 2 },
      "forge",
      6
    ],
    ["eclipse_blade", { eclipse_fang: 2, beast_core: 2, obsidian: 10, steel_ingot: 8 }, "forge", 6],
    ["direwolf_cloak", { direwolf_pelt: 4, beast_core: 1, hide: 4, ice: 3 }, "apothecary", 6],
    ["boiled_water", { wild_water: 1, wood: 1 }, "campfire", 1],
    ["cooked_meat", { raw_meat: 1, wood: 1 }, "campfire", 1],
    ["bread", { wheat: 3, wood: 1 }, "campfire", 1],
    ["cooked_fish", { raw_fish: 1, wood: 1 }, "campfire", 1],
    ["potato_stew", { potato: 2, raw_meat: 1, wild_water: 1, wood: 1 }, "campfire", 1],
    ["smoked_meat", { raw_meat: 2, salt: 1, wood: 1 }, "drying_rack", 2],
    ["trail_ration", { smoked_meat: 1, bread: 1, honey: 1 }, "workbench", 2],
    ["warming_brew", { willow: 1, honey: 1, boiled_water: 1, resin: 1 }, "campfire", 2],
    ["antivenom", { herb: 3, venom: 1, honey: 2, boiled_water: 1 }, "apothecary", 3],
    ["herbal_tea", { herb: 2, boiled_water: 1, honey: 1 }, "campfire", 2],
    ["poultice", { herb: 2, honey: 1, clay: 1 }, "apothecary", 3],
    ["fever_remedy", { willow: 2, boiled_water: 1, honey: 1 }, "apothecary", 3],
    ["antibiotic", { mushroom: 5, honey: 3, herb: 4, boiled_water: 2, coal: 2 }, "apothecary", 4]
  ].map(([id, cost, station, tier]) => ({ id, cost, station, tier }));

  // src/data/resources.ts
  var NODES = {
    wood: { yield: [2, 4], tool: "axe", req: 0, hp: 3, regen: 170 },
    stone: { yield: [2, 4], tool: "pick", req: 0, hp: 3, regen: 160 },
    fiber: { yield: [2, 4], hp: 2, regen: 115 },
    flint: { yield: [1, 2], tool: "pick", req: 0, hp: 2, regen: 185 },
    clay: { yield: [2, 3], tool: "pick", req: 0, hp: 3, regen: 180 },
    copper_ore: { yield: [2, 3], tool: "pick", req: 1, hp: 3, regen: 260 },
    iron_ore: { yield: [2, 3], tool: "pick", req: 2, hp: 3, regen: 310 },
    coal: { yield: [2, 3], tool: "pick", req: 1, hp: 3, regen: 250 },
    ice: { yield: [2, 3], tool: "pick", req: 2, hp: 3, regen: 280 },
    obsidian: { yield: [2, 3], tool: "pick", req: 4, hp: 4, regen: 400 },
    sulfur: { yield: [2, 3], tool: "pick", req: 3, hp: 3, regen: 330 },
    berry: { yield: [1, 3], hp: 2, regen: 180 },
    mushroom: { yield: [1, 2], hp: 2, regen: 230 },
    honey: { yield: [1, 2], hp: 1, regen: 380 },
    willow: { yield: [1, 2], hp: 2, regen: 260 },
    herb: { yield: [1, 3], hp: 2, regen: 200 },
    wheat: { yield: [2, 3], hp: 2, regen: 200 },
    potato: { yield: [1, 3], hp: 2, regen: 230 },
    water: { yield: [1, 1], hp: Infinity, regen: 0 },
    resin: { yield: [1, 2], tool: "axe", req: 1, hp: 2, regen: 250 },
    reeds: { yield: [2, 4], hp: 3, regen: 170 },
    salt: { yield: [1, 3], tool: "pick", req: 0, hp: 2, regen: 240 },
    crystal: { yield: [1, 2], tool: "pick", req: 3, hp: 3, regen: 400 },
    hellstone: { yield: [2, 3], tool: "pick", req: 5, hp: 4, regen: 0 },
    cactus_fruit: { yield: [1, 2], hp: 2, regen: 230 }
  };
  function nodeForm(kind) {
    if (kind === "water") return "water";
    if (kind === "wood" || kind === "resin" || kind === "honey") return "tree";
    return NODES[kind]?.tool === "pick" ? "mineral" : "plant";
  }
  var TOOL_TIERS = {
    stone_axe: ["axe", 1],
    stone_pick: ["pick", 1],
    copper_axe: ["axe", 2],
    copper_pick: ["pick", 2],
    iron_axe: ["axe", 3],
    iron_pick: ["pick", 3],
    steel_axe: ["axe", 4],
    steel_pick: ["pick", 4],
    obsidian_axe: ["axe", 5],
    obsidian_pick: ["pick", 5]
  };
  var WEAPONS = {
    fists: [1, 7, 42],
    flint_spear: [1, 17, 68],
    copper_spear: [2, 26, 68],
    iron_sword: [3, 36, 62],
    steel_sword: [4, 47, 65],
    obsidian_blade: [5, 61, 67],
    eclipse_blade: [6, 85, 73],
    hellfire_blade: [6, 76, 70]
  };

  // src/core/noise.ts
  var hash = (i, seed) => {
    const n = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  var hash2 = (i, j, seed) => {
    const n = Math.sin(i * 127.1 + j * 269.5 + seed * 113.3) * 43758.5453;
    return n - Math.floor(n);
  };
  var ease = (t) => t * t * (3 - 2 * t);
  function noise1(x, seed = 0) {
    const i = Math.floor(x), t = ease(x - i);
    return (hash(i, seed) * (1 - t) + hash(i + 1, seed) * t) * 2 - 1;
  }
  function fbm1(x, seed = 0, octaves = 3) {
    let sum = 0, amp = 1, norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += noise1(x * 2 ** o, seed + o * 17) * amp;
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  }
  function noise2(x, y, seed = 0) {
    const i = Math.floor(x), j = Math.floor(y), tx = ease(x - i), ty = ease(y - j);
    const a = hash2(i, j, seed), b = hash2(i + 1, j, seed), c = hash2(i, j + 1, seed), d = hash2(i + 1, j + 1, seed);
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  }
  function fbm2(x, y, seed = 0, octaves = 3) {
    let sum = 0, amp = 1, norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += noise2(x * 2 ** o, y * 2 ** o, seed + o * 29) * amp;
      norm += amp;
      amp *= 0.5;
    }
    return sum / norm;
  }

  // src/data/world.ts
  var SIDE_ORDER = [
    "coast",
    "marsh",
    "forest",
    "meadow",
    "taiga",
    "tundra",
    "alpine",
    "desert",
    "badlands"
  ];
  var BIOME_WIDTHS = {
    coast: 2800,
    marsh: 3e3,
    forest: 3800,
    meadow: 3200,
    taiga: 3400,
    tundra: 3e3,
    alpine: 3600,
    desert: 3800,
    badlands: 3400
  };
  var BIOME_SPANS = (() => {
    let at = 0;
    return SIDE_ORDER.map((id) => {
      const start2 = at;
      at += BIOME_WIDTHS[id];
      return { id, start: start2, end: at, center: (start2 + at) / 2 };
    });
  })();
  var MAP_LABEL_Y = 610;
  var BIOME_CENTERS = Object.fromEntries(
    BIOME_SPANS.map((s) => [s.id, [s.center, MAP_LABEL_Y]])
  );
  var TILE = 32;
  var WORLD_W = BIOME_SPANS[BIOME_SPANS.length - 1].end;
  var WORLD_H = 4480;
  var TILE_COLS = Math.ceil(WORLD_W / TILE);
  var TILE_ROWS = Math.ceil(WORLD_H / TILE);
  var Ground = {
    air: 0,
    soil: 1,
    stone: 2,
    sand: 3,
    mud: 4,
    frost: 5,
    redrock: 6,
    deepstone: 8,
    ash: 9,
    hellrock: 10
  };
  var MINE_TIER = {
    1: 0,
    2: 1,
    3: 0,
    4: 0,
    5: 2,
    6: 4,
    8: 3,
    9: 4,
    10: 5
  };
  var TILE_YIELD = {
    1: { item: "dirt" },
    2: { item: "stone" },
    3: { item: "dirt" },
    4: { item: "clay" },
    5: { item: "ice" },
    6: { item: "stone", bonus: ["obsidian", 0.22] },
    8: { item: "stone", bonus: ["coal", 0.12] },
    9: { item: "stone", bonus: ["sulfur", 0.3] },
    10: { item: "stone", bonus: ["hellstone", 0.14] }
  };
  var SURFACE_BAND = 140;
  var LAYERS = [
    { id: "surface", name: "Surface", top: 0, temp: 0 },
    { id: "upper_mines", name: "Upper Mines", top: 0, temp: 11 },
    { id: "lower_mines", name: "Lower Mines", top: 1750, temp: 19 },
    { id: "upper_hell", name: "Upper Hell", top: 2750, temp: 46 },
    { id: "lower_hell", name: "Lower Hell", top: 3600, temp: 68 }
  ];
  function layerAt(x, y) {
    if (y < surfaceAt(x) + SURFACE_BAND) return LAYERS[0];
    for (let i = LAYERS.length - 1; i > 1; i--) if (y >= LAYERS[i].top) return LAYERS[i];
    return LAYERS[1];
  }
  var PROFILES = {
    // Low dunes that slope down to the sea at the western edge.
    coast: (x) => 688 + 12 * fbm1(x / 260, 1) + Math.max(0, 700 - x) * 0.09,
    // Nearly flat wetland.
    marsh: (x) => 676 + 6 * noise1(x / 330, 2) + 3 * noise1(x / 90, 3),
    // Rolling wooded hills.
    forest: (x) => 612 + 62 * fbm1(x / 560, 4) + 10 * noise1(x / 140, 5),
    // Gentle, open grassland.
    meadow: (x) => 632 + 26 * noise1(x / 480, 6) + 7 * noise1(x / 140, 7),
    // Hilly conifer country.
    taiga: (x) => 580 + 88 * fbm1(x / 640, 8) + 18 * noise1(x / 170, 9),
    // Wide frozen plains broken by the odd pressure ridge.
    tundra: (x) => 566 + 8 * noise1(x / 420, 10) - 44 * Math.max(0, noise1(x / 380, 11) - 0.55) * 2.2,
    // Sharp mountain peaks.
    alpine: (x) => {
      const ridge = 1 - Math.abs(fbm1(x / 820, 12, 2));
      return 560 - 330 * ridge ** 1.6 - 40 * (1 - Math.abs(noise1(x / 260, 13)));
    },
    // Long sand dunes.
    desert: (x) => 642 + 34 * noise1(x / 340, 14) + 12 * Math.abs(noise1(x / 120, 15)),
    // Terraced mesas; the slope limit turns their steps into cliffs with scree.
    badlands: (x) => {
      const t = fbm1(x / 620, 16, 2) * 3.2;
      const step = Math.round(t), edge = Math.max(-0.5, Math.min(0.5, (t - step) * 3));
      return 604 - (step + edge) * 62;
    }
  };
  var BORDER_FEATURES = [
    ["coast", 18, 260],
    // a shallow lagoon basin into the marsh
    ["marsh", 62, 170],
    // a river valley below the forest bluff
    ["forest", -74, 320],
    // a wooded ridge down to the meadow
    ["meadow", -96, 380],
    // foothills climbing into the taiga
    ["taiga", 52, 300],
    // a frozen lake basin
    ["tundra", -40, 280],
    // the first rise of the mountains
    ["alpine", -70, 360],
    // the escarpment down into the desert
    ["desert", 150, 150]
    // a deep canyon cut into the badlands
  ];
  var BLEND = 380;
  var SURFACE_STEP = 16;
  var MAX_RISE = 15;
  function roughSurface(x) {
    let i = BIOME_SPANS.findIndex((s) => x < s.end);
    if (i < 0) i = BIOME_SPANS.length - 1;
    const span = BIOME_SPANS[i];
    let y = PROFILES[span.id](x);
    const west = i > 0 && x - span.start < BLEND, east = i < BIOME_SPANS.length - 1 && span.end - x < BLEND;
    if (west || east) {
      const border = west ? span.start : span.end, other = BIOME_SPANS[west ? i - 1 : i + 1], t = 0.5 + (x - border) / BLEND * 0.5 * (west ? 1 : -1), k = t * t * (3 - 2 * t);
      y = PROFILES[other.id](x) * (1 - k) + y * k;
    }
    for (const [id, depth, half] of BORDER_FEATURES) {
      const border = BIOME_SPANS.find((s) => s.id === id).end, d = (x - border) / half;
      if (Math.abs(d) < 3) y += depth * Math.exp(-d * d * 2);
    }
    return Math.max(170, Math.min(800, y));
  }
  var SURFACE = (() => {
    const n = Math.ceil(WORLD_W / SURFACE_STEP) + 1, h = new Float32Array(n);
    for (let i = 0; i < n; i++) h[i] = roughSurface(i * SURFACE_STEP);
    for (let i = 1; i < n; i++) h[i] = Math.min(h[i], h[i - 1] + MAX_RISE);
    for (let i = n - 2; i >= 0; i--) h[i] = Math.min(h[i], h[i + 1] + MAX_RISE);
    return h;
  })();
  function surfaceAt(x) {
    const f = Math.max(0, Math.min(WORLD_W, x)) / SURFACE_STEP, i = Math.min(SURFACE.length - 2, Math.floor(f)), t = f - i;
    return SURFACE[i] * (1 - t) + SURFACE[i + 1] * t;
  }
  var BASELINE = (() => {
    const r = Math.round(520 / SURFACE_STEP), out = new Float32Array(SURFACE.length);
    for (let i = 0; i < SURFACE.length; i++) {
      let sum = 0, n = 0;
      for (let j = Math.max(0, i - r); j <= Math.min(SURFACE.length - 1, i + r); j++) {
        sum += SURFACE[j];
        n++;
      }
      out[i] = sum / n;
    }
    return out;
  })();
  function baselineAt(x) {
    const i = Math.max(0, Math.min(BASELINE.length - 1, Math.round(x / SURFACE_STEP)));
    return BASELINE[i];
  }
  var CAVE_LEVELS = 7;
  function caveY(x, level) {
    if (level <= 3) {
      const depth = [0, 210, 465, 760][level];
      const base2 = Math.max(baselineAt(x), surfaceAt(x) - 40);
      return base2 + depth + Math.sin(x / (125 + level * 45)) * (22 + level * 11);
    }
    const base = [0, 0, 0, 0, 2020, 2440, 2980, 3360][level];
    return base + 80 * fbm1(x / (900 + level * 40), 40 + level) + 18 * Math.sin(x / 190 + level);
  }
  function tunnelHalfWidth(x, level) {
    return 42 + Math.min(level, 5) * 8 + Math.sin(x / 79 + level) * 10;
  }
  var underworldCeiling = (x) => 3790 + 70 * fbm1(x / 700, 61);
  var underworldFloor = (x) => Math.min(4410, 4240 + 150 * fbm1(x / 1100, 67) + 36 * noise1(x / 230, 71));
  var LAVA_Y = 4262;
  var shaftAt = (x, top, bottom) => ({ x, top, bottom });
  var ENTRANCES = BIOME_SPANS.flatMap((s) => [
    s.start + (s.end - s.start) * 0.28,
    s.start + (s.end - s.start) * 0.74
  ]);
  function dryLanding(x) {
    for (let d = 0; d < 900; d += 32)
      for (const cx of [x + d, x - d]) if (underworldFloor(cx) < LAVA_Y - 45) return cx;
    return x;
  }
  var SHAFTS = [
    ...ENTRANCES.map((x) => shaftAt(x, surfaceAt(x) - 4, caveY(x, 3) + 40)),
    ...BIOME_SPANS.flatMap((s, i) => {
      const at = (f) => s.start + (s.end - s.start) * f;
      const list = [
        shaftAt(at(0.5), caveY(at(0.5), 3), caveY(at(0.5), 4) + 40),
        shaftAt(at(0.16), caveY(at(0.16), 4), caveY(at(0.16), 5) + 40),
        i % 2 ? shaftAt(at(0.84), caveY(at(0.84), 5), caveY(at(0.84), 6) + 40) : shaftAt(at(0.62), caveY(at(0.62), 5), caveY(at(0.62), 6) + 40),
        shaftAt(at(0.36), caveY(at(0.36), 6), caveY(at(0.36), 7) + 40)
      ];
      if (i % 3 === 2) {
        const x = dryLanding(at(0.66));
        list.push(shaftAt(x, caveY(x, 7), underworldFloor(x) - 6));
      }
      return list;
    })
  ];
  var SHAFT_HALF = 47;
  function inShaft(x, y, slack = 0) {
    return SHAFTS.some(
      (s) => Math.abs(x - s.x) < SHAFT_HALF - 4 + slack && y > s.top - 12 && y < s.bottom + 58
    );
  }
  function inUnderworld(x, y) {
    const ceil = underworldCeiling(x), floor = underworldFloor(x);
    if (y < ceil || y > floor) return false;
    const spire = noise1(x / 150, 73);
    if (spire > 0.55 && y < ceil + (floor - ceil) * (spire - 0.55) * 1.3) return false;
    return true;
  }
  function inCavern(x, y, surface) {
    if (y > LAYERS[3].top && y < LAYERS[4].top - 60) return fbm2(x / 300, y / 200, 83) > 0.64;
    if (y > LAYERS[2].top && y < LAYERS[3].top) return fbm2(x / 260, y / 170, 79) > 0.68;
    if (y > surface + 170) return fbm2(x / 200, y / 140, 89) > 0.74;
    return false;
  }
  function caveAt(x, y) {
    const surface = surfaceAt(x);
    if (y >= surface - 4 && SHAFTS.some((s) => Math.abs(x - s.x) < SHAFT_HALF && y >= s.top && y < s.bottom + 50))
      return true;
    if (y < surface + 70) return false;
    for (let level = 1; level <= CAVE_LEVELS; level++)
      if (Math.abs(y - caveY(x, level)) < tunnelHalfWidth(x, level)) return true;
    return inUnderworld(x, y) || inCavern(x, y, surface);
  }
  function lavaAt(x, y) {
    if (y > LAVA_Y && y < WORLD_H) return inUnderworld(x, y);
    if (y > 3470 && y < LAYERS[4].top - 60 && inCavern(x, y, 0)) {
      for (const level of [6, 7])
        if (Math.abs(y - caveY(x, level)) < tunnelHalfWidth(x, level)) return false;
      return !inShaft(x, y, 10);
    }
    return false;
  }
  function spanIndex(x) {
    for (let i = 0; i < BIOME_SPANS.length; i++) if (x < BIOME_SPANS[i].end) return i;
    return BIOME_SPANS.length - 1;
  }
  function biomeAt(x, y) {
    const warped = x + 72 * Math.sin(y / 235) + 38 * Math.sin((x + y) / 115);
    const id = BIOME_SPANS[spanIndex(Math.max(0, Math.min(WORLD_W - 1, warped)))].id;
    return BIOMES.find((b) => b.id === id);
  }
  function biomeBlend(x, band = 520) {
    const i = spanIndex(x), s = BIOME_SPANS[i];
    if (i > 0 && x - s.start < band) {
      const t = 0.5 + (x - s.start) / band / 2;
      return [BIOME_SPANS[i - 1].id, s.id, t * t * (3 - 2 * t)];
    }
    if (i < BIOME_SPANS.length - 1 && s.end - x < band) {
      const t = 0.5 - (s.end - x) / band / 2;
      return [s.id, BIOME_SPANS[i + 1].id, t * t * (3 - 2 * t)];
    }
    return [s.id, s.id, 0];
  }
  function baseTileAt(tx, ty) {
    const x = tx * TILE + TILE / 2, y = ty * TILE + TILE / 2, surface = surfaceAt(x);
    if (y < surface || caveAt(x, y)) return Ground.air;
    const biome = biomeAt(x, y).id, depth = y - surface;
    if (depth < 76)
      return biome === "desert" ? Ground.sand : biome === "marsh" || biome === "coast" ? Ground.mud : biome === "tundra" ? Ground.frost : biome === "badlands" ? Ground.redrock : Ground.soil;
    const yy = y + 46 * noise1(x / 310, 97);
    if (yy >= LAYERS[4].top) return Ground.hellrock;
    if (yy >= LAYERS[3].top) return Ground.ash;
    if (yy >= LAYERS[2].top) return Ground.deepstone;
    if (biome === "tundra" && depth < 270) return Ground.frost;
    if (biome === "badlands" && depth > 350) return Ground.redrock;
    return Ground.stone;
  }

  // src/core/math.ts
  var clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  var dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  // src/core/random.ts
  var RANDOM_GENERATOR = {
    multiplier: 1664525,
    increment: 1013904223,
    modulus: 2 ** 32
  };
  function seededRandom(seed) {
    let s = seed >>> 0;
    return () => (s = RANDOM_GENERATOR.multiplier * s + RANDOM_GENERATOR.increment >>> 0) / RANDOM_GENERATOR.modulus;
  }
  var pick = (r, a) => a[Math.floor(r() * a.length)];

  // src/game/rules.ts
  var RULES = {
    defaultSeed: 73021,
    spawnX: BIOME_CENTERS.meadow[0],
    starterNodeOffsets: [
      ["wood", -75],
      ["stone", 70],
      ["fiber", -145],
      ["flint", 140],
      ["water", 210],
      ["berry", -20]
    ],
    maxVital: 100,
    playerHalfWidth: 13,
    playerHeight: 47,
    playerFootInset: 2,
    jumpVelocity: 340,
    jumpStamina: 4,
    mineReach: 96,
    mineStamina: 8,
    staleAtFraction: 0.22,
    placeReach: 170,
    placeEdgePadding: 35,
    structureSpacing: 54,
    platformSpacing: 24,
    interactReach: 78,
    gatherReach: 84,
    fishReach: 98,
    fishSuccessChance: 0.67,
    cropGrowthSeconds: 240,
    campfireInitialFuel: 420,
    campfireRefuel: 360,
    iceboxRefuel: 900,
    lanternRefuel: 800,
    washHygieneGain: 36,
    minutesAtStart: 8 * 60,
    minutesPerSecond: 1.2,
    minutesPerDay: 24 * 60,
    nightEndsAt: 6 * 60,
    nightStartsAt: 19 * 60,
    standardMoveSpeed: 180,
    tiredMoveSpeed: 95,
    gravity: 850,
    terminalVelocity: 550,
    climbVelocity: 155,
    fallDamageVelocity: 470,
    attackStamina: 11,
    attackCooldownSeconds: 0.52,
    bossWeaponTier: 5,
    weatherBaseSeconds: 120,
    weatherJitterSeconds: 130,
    rainCatchRate: 0.035,
    rainCatchCapacity: 8,
    worldGenerationAttemptsPerNode: 35,
    strideLength: 46,
    deerFlightDistance: 175,
    deerSafeDistance: 320,
    treeFallSeconds: 1.1,
    treeRegrowthFactor: 3,
    resourceWorldPadding: 65,
    animalWorldPadding: 70,
    entranceResourceClearance: 80,
    maxTickSeconds: 0.1,
    maxOfflineSeconds: 24 * 60 * 60,
    cooledSpoilageRate: 0.18,
    /** Health lost per second to hell's heat, without and with a Cinder Ward. */
    upperHellHeat: [0.35, 0],
    lowerHellHeat: [2.2, 0.25],
    lavaDamage: [32, 20],
    saveKey: "wildlands-save-v1"
  };

  // src/game/systems/System.ts
  var System = class {
    game;
    constructor(game2) {
      this.game = game2;
    }
  };

  // src/game/systems/Consumables.ts
  var Consumables = class extends System {
    use(id) {
      const entry = this.game.s.inventory.filter((e) => e.id === id).sort((a, b) => (a.fresh ?? Infinity) - (b.fresh ?? Infinity))[0];
      if (!entry) return { ok: false, reason: "Not in your pack." };
      const v = this.game.s.vitals, rotten = this.game.itemState(entry) === "rotten";
      if (WEAPONS[id]) {
        this.game.s.player.weapon = id;
        this.game.sound("equip");
        this.game.say(itemName(id) + " equipped.");
        return { ok: true };
      }
      const wear = {
        direwolf_cloak: "cloak",
        hide_coat: "coat",
        explorer_boots: "boots",
        cinder_ward: "ward"
      }[id];
      if (wear) {
        const key = wear;
        this.game.s.player[key] = !this.game.s.player[key];
        this.game.sound("wear");
        this.game.say(itemName(id) + (this.game.s.player[key] ? " worn." : " stowed."));
        return { ok: true };
      }
      if (id === "fishing_rod") return this.game.fish();
      if (ITEMS[id][1] === "structure") {
        this.game.s.placing = id;
        this.game.say("Choose a nearby place for " + itemName(id) + ".");
        return { ok: true };
      }
      const food = {
        berry: [8, 0],
        mushroom: [9, 2],
        honey: [13, 0],
        wheat: [4, 2],
        potato: [14, 3],
        raw_meat: [21, 21],
        cooked_meat: [29, 25],
        bread: [27, 6],
        cactus_fruit: [11, 1],
        raw_fish: [16, 18],
        cooked_fish: [25, 22],
        smoked_meat: [38, 32],
        trail_ration: [48, 28],
        potato_stew: [41, 20]
      };
      if (food[id]) {
        v.calories = clamp(v.calories + (rotten ? 3 : food[id][0]), 0, RULES.maxVital);
        v.protein = clamp(v.protein + (rotten ? 0 : food[id][1]), 0, RULES.maxVital);
        v.morale = clamp(v.morale + (rotten ? -7 : 3), 0, RULES.maxVital);
        if (rotten && this.game.rng() < 0.72)
          this.game.contract(this.game.rng() < 0.5 ? "dysentery" : "fever");
        if ((id === "raw_meat" || id === "raw_fish") && this.game.rng() < 0.48)
          this.game.contract("fever");
      } else if (id === "wild_water" || id === "boiled_water") {
        v.hydration = clamp(v.hydration + (rotten ? 15 : 27), 0, RULES.maxVital);
        if (id === "wild_water" && this.game.rng() < 0.38 || rotten && this.game.rng() < 0.6)
          this.game.contract("dysentery");
        if (id === "boiled_water" && !rotten) this.game.progress.record("drink:boiled_water");
      } else if ([
        "herbal_tea",
        "poultice",
        "fever_remedy",
        "antibiotic",
        "antivenom",
        "warming_brew"
      ].includes(id)) {
        if (id === "herbal_tea") {
          v.hydration = clamp(v.hydration + 22, 0, RULES.maxVital);
          v.illness = clamp(v.illness - (rotten ? 8 : 45), 0, RULES.maxVital);
          if (this.game.s.disease === "dysentery" && v.illness < 15) this.game.s.disease = null;
        }
        if (id === "fever_remedy") {
          v.illness = clamp(v.illness - (rotten ? 7 : 48), 0, RULES.maxVital);
          if (this.game.s.disease === "fever" && v.illness < 15) this.game.s.disease = null;
        }
        if (id === "poultice") {
          v.infection = clamp(v.infection - (rotten ? 7 : 42), 0, RULES.maxVital);
          if (this.game.s.disease === "wound" && v.infection < 15) this.game.s.disease = null;
        }
        if (id === "antibiotic") {
          v.infection = clamp(v.infection - 70, 0, RULES.maxVital);
          v.illness = clamp(v.illness - 55, 0, RULES.maxVital);
          this.game.s.disease = null;
        }
        if (id === "antivenom") {
          v.illness = clamp(v.illness - 65, 0, RULES.maxVital);
          if (this.game.s.disease === "poisoning") this.game.s.disease = null;
        }
        if (id === "warming_brew") {
          v.hydration = clamp(v.hydration + 16, 0, RULES.maxVital);
          v.bodyTemp = clamp(v.bodyTemp + 1.8, 30, 41);
          v.morale = clamp(v.morale + 8, 0, RULES.maxVital);
        }
      } else return { ok: false, reason: "This item is a crafting material." };
      this.game.remove(id);
      this.game.sound(
        food[id] ? "eat" : id === "wild_water" || id === "boiled_water" ? "drink" : "medicine"
      );
      this.game.say(
        (rotten ? "Consumed spoiled " : "Used ") + itemName(id).toLowerCase() + ".",
        rotten ? "danger" : "good"
      );
      return { ok: true };
    }
  };

  // src/game/ids.ts
  var nextId = 0;
  var uniqueId = () => ++nextId;
  function reserveIds(highest) {
    nextId = Math.max(nextId, highest);
  }

  // src/game/systems/Crafting.ts
  var Crafting = class extends System {
    /** Why a recipe cannot be made now, or null if it can. Console-unlocked recipes are free. */
    check(id) {
      const r = RECIPES.find((r2) => r2.id === id);
      if (!r) return "No such recipe.";
      if (id === "effergy" && (this.game.s.structures.some((x) => x.type === "effergy") || this.game.count("effergy")))
        return "Only one Effergy may be owned.";
      if (this.free(id)) return null;
      if (r.station && !this.game.near(r.station)) return "Stand near a " + itemName(r.station) + ".";
      if (r.station === "campfire" && !this.game.nearLitFire()) return "The campfire needs fuel.";
      if (!this.game.canAfford(r.cost)) return "More materials are needed.";
      return null;
    }
    free(id) {
      return this.game.dev.unlocked.has(id);
    }
    craft(id) {
      const reason = this.check(id);
      if (reason) return { ok: false, reason };
      const r = RECIPES.find((r2) => r2.id === id);
      if (!this.free(id))
        for (const [item, qty] of Object.entries(r.cost)) this.game.remove(item, qty);
      this.game.add(id);
      this.game.sound(
        r.station === "forge" || r.station === "furnace" ? "craft_anvil" : r.station === "campfire" || r.station === "drying_rack" ? "craft_cook" : r.station === "apothecary" ? "craft_brew" : "craft_wood"
      );
      this.game.progress.record("craft:" + id);
      this.game.say("Made " + itemName(id) + ".", "good");
      if (ITEMS[id][1] === "structure") this.game.s.placing = id;
      if (WEAPONS[id] && WEAPONS[id][0] > WEAPONS[this.game.s.player.weapon][0])
        this.game.s.player.weapon = id;
      return { ok: true };
    }
    place(id, x, y) {
      if (ITEMS[id]?.[1] !== "structure" || !this.game.count(id))
        return { ok: false, reason: "That structure is not in your pack." };
      if (id === "effergy" && this.game.s.structures.some((st2) => st2.type === id))
        return { ok: false, reason: "Only one Effergy may be owned." };
      if (dist({ x, y }, this.game.s.player) > RULES.placeReach)
        return { ok: false, reason: "Place it within reach." };
      if (x < RULES.placeEdgePadding || y < RULES.placeEdgePadding || x > WORLD_W - RULES.placeEdgePadding || y > WORLD_H - RULES.placeEdgePadding)
        return { ok: false, reason: "Too close to the edge." };
      if (id !== "platform") {
        let support = null;
        const tx = Math.floor(x / TILE);
        for (let ty = Math.floor(y / TILE); ty < Math.min(TILE_ROWS, Math.floor((y + 116) / TILE) + 1); ty++) {
          if (this.game.tileAt(tx, ty)) {
            support = ty * TILE;
            break;
          }
        }
        if (support === null) return { ok: false, reason: "Place this on solid ground." };
        y = support - 1;
      }
      if (this.game.s.structures.some(
        (st2) => dist(st2, { x, y }) < (id === "platform" ? RULES.platformSpacing : RULES.structureSpacing)
      ))
        return { ok: false, reason: "Leave room between structures." };
      this.game.remove(id);
      const st = {
        id: uniqueId(),
        type: id,
        x,
        y,
        fuel: id === "campfire" ? RULES.campfireInitialFuel : id === "lantern" ? RULES.lanternRefuel : 0,
        water: 0,
        store: {},
        crop: null,
        plantedAt: 0,
        triggeredAt: 0
      };
      this.game.s.structures.push(st);
      this.game.sound("place", x, y);
      this.game.s.placing = null;
      this.game.progress.record("place:" + id);
      this.game.say(itemName(id) + " placed.", "good");
      return { ok: true, structure: st };
    }
  };

  // src/game/WorldGenerator.ts
  var UNDERGROUND = [
    {
      layer: "upper_mines",
      levels: [1, 2, 3],
      perKm: 9,
      kinds: (ores) => [...ores, ...ores, "stone", "coal", "copper_ore", "clay", "mushroom"]
    },
    {
      layer: "lower_mines",
      levels: [4, 5],
      perKm: 7,
      kinds: () => ["iron_ore", "iron_ore", "coal", "coal", "crystal", "sulfur", "mushroom"]
    },
    {
      layer: "upper_hell",
      levels: [6, 7],
      perKm: 5,
      kinds: () => ["sulfur", "sulfur", "obsidian", "obsidian", "crystal"]
    },
    {
      layer: "lower_hell",
      levels: [0],
      perKm: 4,
      kinds: () => ["hellstone", "hellstone", "obsidian"]
    }
  ];
  var ORES = ["copper_ore", "iron_ore", "coal", "ice", "obsidian", "sulfur", "crystal"];
  var DEEP_LIFE = [
    ["bat", [1, 2, 3], 0.7],
    ["bat", [4, 5], 0.6],
    ["ember_bat", [6, 7], 0.8],
    ["hellhound", [0], 0.8]
  ];
  var ANIMAL_HP = {
    deer: 42,
    wolf: 66,
    boar: 88,
    bat: 33,
    scorpion: 54,
    ember_bat: 70,
    hellhound: 190
  };
  var WorldGenerator = class extends System {
    /** Tile grid rebuilt from the world's pure geometry. */
    generateTiles() {
      const tiles = new Array(TILE_COLS * TILE_ROWS);
      for (let i = 0; i < tiles.length; i++)
        tiles[i] = baseTileAt(i % TILE_COLS, Math.floor(i / TILE_COLS));
      return tiles;
    }
    generate() {
      const s = this.game.s;
      this.buckets.clear();
      s.tiles = this.generateTiles();
      s.tileEdits = {};
      s.drops = [];
      for (const span of BIOME_SPANS) {
        const width = span.end - span.start, count = Math.round(width / 450);
        for (let i = 0; i < count; i++) {
          const x = clamp(
            span.start + (i + 0.5) / count * width + (this.game.rng() - 0.5) * 220,
            70,
            WORLD_W - 70
          );
          const y = this.game.groundTopAt(x) - 1;
          if (Math.abs(x - RULES.spawnX) > 250 && !ENTRANCES.some((e) => Math.abs(e - x) < 85) && this.nodeFits("cache", x, y))
            s.caches.push({ id: uniqueId(), x, y, opened: false, biome: span.id });
        }
        for (const [level, layer] of [
          [4, "lower_mines"],
          [7, "upper_hell"]
        ]) {
          const x = span.start + width * (0.3 + this.game.rng() * 0.4), y = this.game.floorNear(x, caveY(x, level));
          if (this.nodeFits("cache", x, y))
            s.caches.push({ id: uniqueId(), x, y, opened: false, biome: span.id, layer });
        }
      }
      this.generateNodes();
      for (const span of BIOME_SPANS) this.populate(span);
    }
    addAnimal(type, x, y, extra = {}) {
      const hp = ANIMAL_HP[type];
      this.game.s.animals.push({
        id: uniqueId(),
        type,
        x,
        y,
        homeX: x,
        homeY: y,
        hp,
        maxHp: hp,
        angle: this.game.rng() > 0.5 ? 0 : Math.PI,
        wanderAt: 0,
        attackAt: 0,
        deadUntil: 0,
        warning: 0,
        phase: this.game.rng() * Math.PI * 2,
        ...extra
      });
    }
    populate(span) {
      const width = span.end - span.start, scale = width / 1200;
      const surface = {
        coast: ["deer", "deer"],
        marsh: ["deer", "boar"],
        forest: ["deer", "deer", "wolf", "boar"],
        meadow: ["deer", "deer"],
        taiga: ["deer", "wolf", "wolf"],
        tundra: ["wolf", "wolf"],
        alpine: ["wolf"],
        desert: ["scorpion", "scorpion"],
        badlands: ["wolf", "wolf", "scorpion"]
      };
      const kinds = surface[span.id];
      const total = Math.round(kinds.length * scale * 0.85);
      for (let i = 0; i < total; i++) {
        const type = kinds[i % kinds.length];
        for (let attempt = 0; attempt < 12; attempt++) {
          const x = clamp(
            span.start + this.game.rng() * width,
            RULES.animalWorldPadding,
            WORLD_W - RULES.animalWorldPadding
          );
          if (span.id === "meadow" && Math.abs(x - RULES.spawnX) < 320 || ENTRANCES.some((e) => Math.abs(e - x) < 70) || this.game.s.animals.some((a) => !a.tunnel && Math.abs(a.x - x) < 90))
            continue;
          this.addAnimal(type, x, this.game.groundTopAt(x) - 1);
          break;
        }
      }
      for (const [type, levels, perKm] of DEEP_LIFE) {
        const n = Math.round(width / 1e3 * perKm);
        for (let i = 0; i < n; i++) {
          const x = span.start + (i + 0.3 + this.game.rng() * 0.4) / n * width, level = levels[i % levels.length];
          if (level === 0) {
            const floor = underworldFloor(x);
            if (floor > LAVA_Y - 20) continue;
            this.addAnimal(type, x, floor - 1, { underground: true });
          } else this.addAnimal(type, x, caveY(x, level), { tunnel: level });
        }
      }
    }
    // Resource layout; also rebuilt for records saved before the current world layout.
    generateNodes() {
      const s = this.game.s;
      const push = (kind, x, y, underground = false) => s.nodes.push({
        id: uniqueId(),
        kind,
        x,
        y,
        hp: NODES[kind].hp,
        depletedUntil: 0,
        phase: this.game.rng() * Math.PI * 2,
        ...underground ? { underground } : {}
      });
      for (const [kind, offset] of RULES.starterNodeOffsets) {
        const x = RULES.spawnX + offset;
        push(kind, x, this.game.groundTopAt(x) - 1);
      }
      this.buckets.clear();
      for (const n of s.nodes) this.remember(n.kind, n.x, n.y);
      for (const c of s.caches) this.remember("cache", c.x, c.y);
      for (const span of BIOME_SPANS) {
        const b = BIOMES.find((bb) => bb.id === span.id), width = span.end - span.start, scale = width / 1200;
        const kinds = [...new Set(b.resources)], queue = [];
        for (let round = 0; round < 40; round++)
          for (const kind of kinds) {
            const base = kind === "wood" || kind === "stone" ? 12 : kind === "water" ? 5 : 8;
            if (round < Math.round(base * scale * (ORES.includes(kind) ? 0.35 : 0.85)))
              queue.push(kind);
          }
        for (const kind of queue)
          for (let attempt = 0; attempt < RULES.worldGenerationAttemptsPerNode; attempt++) {
            const x = clamp(
              span.start + this.game.rng() * width,
              RULES.resourceWorldPadding,
              WORLD_W - RULES.resourceWorldPadding
            );
            if (ENTRANCES.some((e) => Math.abs(e - x) < RULES.entranceResourceClearance)) continue;
            const y = this.game.groundTopAt(x) - 1;
            if (biomeAt(x, y).id !== span.id || span.id === "meadow" && Math.abs(x - RULES.spawnX) < 110 || !this.nodeFits(kind, x, y))
              continue;
            push(kind, x, y);
            this.remember(kind, x, y);
            break;
          }
        const biomeOres = kinds.filter((k) => ORES.includes(k));
        for (const deep of UNDERGROUND) {
          const pool = deep.kinds(biomeOres.length ? biomeOres : ["coal"]), n = Math.round(width / 1e3 * deep.perKm);
          for (let i = 0; i < n; i++) {
            const kind = pool[i % pool.length];
            for (let attempt = 0; attempt < 20; attempt++) {
              const x = span.start + this.game.rng() * width, level = deep.levels[Math.floor(this.game.rng() * deep.levels.length)];
              if (SHAFTS.some((sh) => Math.abs(sh.x - x) < 70)) continue;
              let y;
              if (level === 0) {
                const floor = underworldFloor(x);
                if (floor > LAVA_Y - 20) continue;
                y = this.game.floorNear(x, floor - 20);
              } else y = this.game.floorNear(x, caveY(x, level));
              if (!this.nodeFits(kind, x, y)) continue;
              push(kind, x, y, true);
              this.remember(kind, x, y);
              break;
            }
          }
        }
      }
    }
    // Spatial buckets keep placement checks local now that regions are wide.
    buckets = /* @__PURE__ */ new Map();
    remember(kind, x, y) {
      const key = Math.floor(x / 200);
      let list = this.buckets.get(key);
      if (!list) this.buckets.set(key, list = []);
      list.push({ kind, x, y });
    }
    // Resources keep a readable footprint: trees space from trees, small finds from each other.
    nodeFits(kind, x, y) {
      const tree = (k) => k === "wood" || k === "resin" || k === "honey";
      const width = (k) => tree(k) ? 92 : k === "water" ? 74 : k === "cache" ? 44 : NODES[k]?.tool ? 38 : 30;
      const key = Math.floor(x / 200);
      const others = [key - 1, key, key + 1].flatMap((k) => this.buckets.get(k) ?? []);
      if (!this.buckets.size)
        others.push(
          ...this.game.s.nodes,
          ...this.game.s.caches.map((c) => ({ kind: "cache", x: c.x, y: c.y }))
        );
      return others.every((n) => {
        if (Math.abs(n.y - y) > 60) return true;
        const gap = Math.abs(n.x - x);
        if (tree(kind) !== tree(n.kind))
          return gap > (kind === "water" || n.kind === "water" ? 64 : 26);
        return gap > (width(kind) + width(n.kind)) / 2;
      });
    }
  };

  // src/game/systems/Dev.ts
  var newDevState = () => ({
    god: false,
    noclip: false,
    speed: 1,
    unlocked: /* @__PURE__ */ new Set()
  });
  var MOBS = [
    "deer",
    "wolf",
    "boar",
    "bat",
    "scorpion",
    "ember_bat",
    "hellhound",
    "direwolf"
  ];
  var FLIERS = ["bat", "ember_bat"];
  var TIMES = {
    dawn: 6 * 60,
    morning: 9 * 60,
    noon: 12 * 60,
    dusk: 19 * 60,
    night: 22 * 60,
    midnight: 0
  };
  var WEATHERS = ["clear", "cloudy", "rain", "storm"];
  function resolve(query, ids, name = (id) => id) {
    const q = query.toLowerCase().replace(/\s+/g, "_");
    const exact = ids.find((id) => id === q || name(id).toLowerCase().replace(/\s+/g, "_") === q);
    if (exact) return { id: exact };
    const matches = ids.filter(
      (id) => id.startsWith(q) || name(id).toLowerCase().replace(/\s+/g, "_").startsWith(q)
    );
    if (matches.length === 1) return { id: matches[0] };
    return { matches };
  }
  var Dev = class extends System {
    commands = {
      help: {
        usage: "help [command]",
        help: "List commands, or explain one.",
        run: ([name]) => {
          if (name && this.commands[name]) {
            const c = this.commands[name];
            return [c.usage, c.help];
          }
          return [
            "Commands (Tab completes, \u2191/\u2193 recalls):",
            ...Object.values(this.commands).map((c) => `  ${c.usage.padEnd(28)} ${c.help}`)
          ];
        }
      },
      give: {
        usage: "give <item> [qty]",
        help: "Put items straight into the pack.",
        run: (args) => {
          const n = /^\d+$/.test(args[args.length - 1] ?? "") ? args.pop() : void 0, query = args.join("_");
          if (!query) return ['! Usage: give <item> [qty]. Try "items" for ids.'];
          const found = resolve(query, Object.keys(ITEMS), itemName);
          if (!found.id) return this.ambiguous("item", query, found.matches);
          const qty = clamp(Math.floor(Number(n ?? 1)) || 1, 1, 9999);
          this.game.add(found.id, qty);
          return [`Gave ${qty} \xD7 ${itemName(found.id)}.`];
        }
      },
      items: {
        usage: "items [filter]",
        help: "List item ids.",
        run: ([f]) => this.list(Object.keys(ITEMS).filter((id) => !f || id.includes(f.toLowerCase())))
      },
      recipes: {
        usage: "recipes [filter]",
        help: "List recipe ids, marking unlocked ones.",
        run: ([f]) => this.list(
          RECIPES.filter((r) => !f || r.id.includes(f.toLowerCase())).map(
            (r) => r.id + (this.game.dev.unlocked.has(r.id) ? "*" : "")
          )
        )
      },
      unlock: {
        usage: "unlock <recipe|all>",
        help: "Make a recipe craftable anywhere, without materials.",
        run: (args) => this.setLock(args.join("_"), true)
      },
      lock: {
        usage: "lock <recipe|all>",
        help: "Return recipes to their normal station and material costs.",
        run: (args) => this.setLock(args.join("_"), false)
      },
      god: {
        usage: "god",
        help: "Toggle godmode: no damage, needs always met.",
        run: () => [`Godmode ${(this.game.dev.god = !this.game.dev.god) ? "on" : "off"}.`]
      },
      noclip: {
        usage: "noclip",
        help: "Toggle flying through rock; WASD moves freely.",
        run: () => {
          const on = this.game.dev.noclip = !this.game.dev.noclip;
          if (!on) this.game.s.player.vy = 0;
          return [`Noclip ${on ? "on" : "off"}.`];
        }
      },
      speed: {
        usage: "speed <multiplier>",
        help: "Scale walking and noclip speed (1 is normal).",
        run: ([n]) => {
          const v = Number(n);
          if (!(v > 0)) return ["! Usage: speed <multiplier>, e.g. speed 3."];
          this.game.dev.speed = clamp(v, 0.1, 20);
          return [`Speed \xD7${this.game.dev.speed}.`];
        }
      },
      summon: {
        usage: "summon <mob> [count]",
        help: "Summon creatures beside you: " + MOBS.join(", ") + ".",
        run: ([query, n]) => {
          if (!query) return ["! Usage: summon <mob> [count]. Mobs: " + MOBS.join(", ")];
          const found = resolve(query === "boss" ? "direwolf" : query, MOBS);
          if (!found.id) return this.ambiguous("mob", query, found.matches);
          const p = this.game.s.player, side = Math.cos(p.face) >= 0 ? 1 : -1;
          if (found.id === "direwolf") {
            if (this.game.s.altar.activeBoss) return ["! A Direwolf hunt is already under way."];
            this.game.effergy.summonBoss({ x: p.x + side * 260, y: p.y });
            return ["The Direwolf answers."];
          }
          const count = clamp(Math.floor(Number(n ?? 1)) || 1, 1, 30);
          for (let i = 0; i < count; i++) {
            const x = clamp(p.x + side * (140 + i * 46), 30, WORLD_W - 30), flier = FLIERS.includes(found.id), hp = ANIMAL_HP[found.id];
            const a = {
              id: uniqueId(),
              type: found.id,
              x,
              y: flier ? p.y - 70 : this.game.floorNear(x, p.y - 20),
              homeX: x,
              homeY: p.y,
              hp,
              maxHp: hp,
              angle: side > 0 ? Math.PI : 0,
              wanderAt: 0,
              attackAt: this.game.s.elapsed + 1,
              deadUntil: 0,
              warning: 0,
              phase: i,
              ...flier ? { hoverY: p.y - 70 } : { walkY: p.y }
            };
            this.game.s.animals.push(a);
          }
          return [`Summoned ${count} \xD7 ${found.id.replace("_", " ")}.`];
        }
      },
      kill: {
        usage: "kill [radius|all]",
        help: "Slay creatures near you (default 600 px).",
        run: ([r]) => {
          const p = this.game.s.player, radius = r === "all" ? Infinity : Number(r ?? 600) || 600;
          let n = 0;
          for (const a of this.game.s.animals)
            if (!a.deadUntil && Math.hypot(a.x - p.x, a.y - p.y) <= radius) {
              a.hp = 0;
              this.game.wildlife.kill(a);
              n++;
            }
          return [`Slew ${n} creature${n === 1 ? "" : "s"}.`];
        }
      },
      heal: {
        usage: "heal",
        help: "Restore every vital and cure illness.",
        run: () => {
          this.restore();
          return ["Fully restored."];
        }
      },
      tp: {
        usage: "tp <x [y] | biome | layer>",
        help: "Teleport to a position, a region, or a depth layer.",
        run: (args) => this.teleport(args)
      },
      time: {
        usage: "time <hh:mm | dawn | noon | dusk | night>",
        help: "Set the time of day.",
        run: ([when]) => {
          const named = when ? TIMES[when.toLowerCase()] : void 0, m = /^(\d{1,2}):(\d{2})$/.exec(when ?? "");
          const minutes = named ?? (m ? +m[1] * 60 + +m[2] : NaN);
          if (!(minutes >= 0 && minutes < RULES.minutesPerDay))
            return ["! Usage: time <hh:mm | " + Object.keys(TIMES).join(" | ") + ">"];
          const s = this.game.s, now = (RULES.minutesAtStart + s.elapsed * RULES.minutesPerSecond) % RULES.minutesPerDay;
          s.elapsed += ((minutes - now) % RULES.minutesPerDay + RULES.minutesPerDay) % RULES.minutesPerDay / RULES.minutesPerSecond;
          return [
            `Time set to ${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}.`
          ];
        }
      },
      weather: {
        usage: "weather <clear|cloudy|rain|storm>",
        help: "Change the weather.",
        run: ([w]) => {
          if (!WEATHERS.includes(w)) return ["! Usage: weather <" + WEATHERS.join("|") + ">"];
          this.game.s.weather = w;
          this.game.s.weatherNext = this.game.s.elapsed + RULES.weatherBaseSeconds;
          return [`Weather: ${w}.`];
        }
      },
      pos: {
        usage: "pos",
        help: "Show where you are.",
        run: () => {
          const p = this.game.s.player;
          return [
            `x ${Math.round(p.x)}, y ${Math.round(p.y)} \xB7 ${this.game.biome().name} \xB7 ${this.game.layer().name}`
          ];
        }
      }
    };
    /** Runs one console line and returns the lines to print. Lines starting with ! are errors. */
    run(line5) {
      const [name, ...args] = line5.trim().split(/\s+/);
      if (!name) return [];
      const cmd = this.commands[name.toLowerCase()];
      if (!cmd) return [`! Unknown command "${name}". Type help.`];
      return cmd.run(args);
    }
    /** Completions for the word being typed: commands first, then that command's arguments. */
    complete(line5) {
      const words = line5.split(/\s+/), last = (words[words.length - 1] ?? "").toLowerCase();
      if (words.length <= 1) return Object.keys(this.commands).filter((c) => c.startsWith(last));
      const cmd = words[0].toLowerCase(), pool = cmd === "give" ? Object.keys(ITEMS) : cmd === "unlock" || cmd === "lock" ? ["all", ...RECIPES.map((r) => r.id)] : cmd === "summon" ? MOBS : cmd === "tp" ? [...BIOME_SPANS.map((b) => b.id), ...LAYERS.map((l) => l.id)] : cmd === "time" ? Object.keys(TIMES) : cmd === "weather" ? WEATHERS : cmd === "help" ? Object.keys(this.commands) : [];
      return words.length === 2 ? pool.filter((id) => id.startsWith(last)) : [];
    }
    /** Godmode keeps every need met; called each tick. */
    sustain() {
      if (!this.game.dev.god) return;
      this.restore();
    }
    restore() {
      Object.assign(this.game.s.vitals, {
        health: 100,
        hydration: 100,
        calories: 100,
        protein: 100,
        stamina: 100,
        fatigue: 0,
        bodyTemp: 37,
        wetness: 0,
        illness: 0,
        infection: 0,
        hygiene: 100,
        morale: 100
      });
      this.game.s.disease = null;
      this.game.s.dead = false;
    }
    setLock(query, on) {
      const unlocked = this.game.dev.unlocked;
      if (!query) return [`! Usage: ${on ? "unlock" : "lock"} <recipe|all>`];
      if (query === "all") {
        for (const r of RECIPES) if (on) unlocked.add(r.id);
        if (!on) unlocked.clear();
        return [on ? `Unlocked all ${RECIPES.length} recipes.` : "All recipes locked again."];
      }
      const found = resolve(
        query,
        RECIPES.map((r) => r.id),
        itemName
      );
      if (!found.id) return this.ambiguous("recipe", query, found.matches);
      if (on) unlocked.add(found.id);
      else unlocked.delete(found.id);
      return [`${itemName(found.id)} ${on ? "unlocked: craft it anywhere, for free" : "locked"}.`];
    }
    teleport(args) {
      const p = this.game.s.player;
      if (!args.length) return ["! Usage: tp <x [y] | biome | layer>"];
      const put = (x, y) => {
        p.x = clamp(x, 20, WORLD_W - 20);
        p.y = clamp(y, 40, WORLD_H - 20);
        p.vx = 0;
        p.vy = 0;
        return [`Teleported to ${Math.round(p.x)}, ${Math.round(p.y)} \xB7 ${this.game.layer().name}.`];
      };
      if (/^-?\d/.test(args[0])) {
        const x = Number(args[0]), y = args[1] !== void 0 ? Number(args[1]) : this.game.groundTopAt(x) + 1;
        return put(x, y);
      }
      const target = args[0].toLowerCase();
      const span = BIOME_SPANS.find((s) => s.id.startsWith(target));
      if (span) return put(span.center, this.game.groundTopAt(span.center) + 1);
      const layer = LAYERS.find((l) => l.id.startsWith(target) || l.id.replace("_", "") === target);
      if (!layer) return [`! "${args[0]}" is not a position, region, or layer.`];
      if (layer.id === "surface") return put(p.x, this.game.groundTopAt(p.x) + 1);
      if (layer.id === "lower_hell") {
        for (let d = 0; d < WORLD_W; d += 64)
          for (const x of [p.x + d, p.x - d])
            if (x > 0 && x < WORLD_W && underworldFloor(x) < LAVA_Y - 40)
              return put(x, this.game.floorNear(x, underworldFloor(x) - 20) + 1);
      }
      const level = { upper_mines: 2, lower_mines: 4, upper_hell: 6 }[layer.id] ?? 2;
      return put(p.x, this.game.floorNear(p.x, caveY(p.x, level)) + 1);
    }
    ambiguous(kind, query, matches) {
      if (matches?.length)
        return [
          `! "${query}" could be: ${matches.slice(0, 12).join(", ")}${matches.length > 12 ? ", \u2026" : ""}`
        ];
      return [`! No ${kind} matches "${query}".`];
    }
    list(ids) {
      if (!ids.length) return ["(none)"];
      const lines = [];
      for (let i = 0; i < ids.length; i += 6) lines.push("  " + ids.slice(i, i + 6).join("  "));
      return lines;
    }
  };

  // src/game/systems/Drops.ts
  var DROP_RULES = {
    gravity: 900,
    magnetRadius: 150,
    collectRadius: 26,
    pickupDelay: 0.3,
    mergeRadius: 26,
    maxDrops: 240
  };
  var Drops = class extends System {
    /** Spawns a stack that pops upward; `delay` holds it back (a felled tree lands first). */
    spawn(item, qty, x, y, delay = 0) {
      if (qty <= 0) return;
      const drops = this.game.s.drops;
      drops.push({
        id: uniqueId(),
        item,
        qty,
        x: clamp(x, 10, WORLD_W - 10),
        y: y - 6,
        vx: (this.game.rng() - 0.5) * 130,
        vy: -170 - this.game.rng() * 90,
        born: this.game.s.elapsed + delay,
        resting: false
      });
      if (drops.length > DROP_RULES.maxDrops) drops.splice(0, drops.length - DROP_RULES.maxDrops);
    }
    solid(x, y) {
      return !!this.game.tileAt(Math.floor(x / TILE), Math.floor(y / TILE));
    }
    step(dt) {
      const s = this.game.s, p = s.player, centre = { x: p.x, y: p.y - 20 };
      for (let i = s.drops.length - 1; i >= 0; i--) {
        const d = s.drops[i];
        if (s.elapsed < d.born) continue;
        const near = dist(d, centre);
        if (!s.dead && s.elapsed - d.born > DROP_RULES.pickupDelay && near < DROP_RULES.magnetRadius) {
          if (near < DROP_RULES.collectRadius) {
            s.drops.splice(i, 1);
            this.game.add(d.item, d.qty);
            this.game.event("pickup", d.x, d.y, d.item);
            this.game.sound("pickup", d.x, d.y, 0.8);
            this.game.say("+" + d.qty + " " + itemName(d.item), "good");
            continue;
          }
          const pull = 420 + (DROP_RULES.magnetRadius - near) * 9;
          d.vx = (centre.x - d.x) / near * pull;
          d.vy = (centre.y - d.y) / near * pull;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.resting = false;
          continue;
        }
        if (d.resting) {
          if (!this.solid(d.x, d.y + 2)) d.resting = false;
          else continue;
        }
        d.vy = Math.min(d.vy + DROP_RULES.gravity * dt, 600);
        const nx = d.x + d.vx * dt;
        if (this.solid(nx, d.y - 4)) d.vx *= -0.35;
        else d.x = clamp(nx, 10, WORLD_W - 10);
        const ny = d.y + d.vy * dt;
        if (d.vy > 0 && this.solid(d.x, ny)) {
          d.y = Math.floor(ny / TILE) * TILE - 1;
          if (d.vy > 160) {
            d.vy *= -0.3;
            d.vx *= 0.6;
          } else {
            d.vy = 0;
            d.vx = 0;
            d.resting = true;
          }
        } else if (d.vy < 0 && this.solid(d.x, ny - 8)) d.vy = 0;
        else d.y = Math.min(ny, WORLD_H - 20);
        if (lavaAt(d.x, d.y)) {
          s.drops.splice(i, 1);
          this.game.event("sizzle", d.x, d.y, d.item);
          this.game.sound("sizzle", d.x, d.y);
          continue;
        }
        if (d.resting) {
          const twin = s.drops.find(
            (o) => o !== d && o.resting && o.item === d.item && dist(o, d) < DROP_RULES.mergeRadius
          );
          if (twin) {
            twin.qty += d.qty;
            s.drops.splice(i, 1);
          }
        }
      }
    }
  };

  // src/game/systems/Effergy.ts
  var Effergy = class extends System {
    /** Calls the Direwolf beside the altar, or at `at` when summoned from the field console. */
    summonBoss(at) {
      const altar = at ?? this.game.s.structures.find((st) => st.type === "effergy");
      if (!altar) return;
      const cfg = BOSSES[this.game.s.altar.level - 1];
      const x = clamp(altar.x + (at ? 0 : 145), 40, WORLD_W - 40), y = at ? this.game.floorNear(x, at.y - 20) : this.game.groundTopAt(x) - 1;
      const boss2 = {
        id: uniqueId(),
        type: "boss",
        x,
        y,
        homeX: altar.x,
        homeY: altar.y,
        hp: cfg.hp,
        maxHp: cfg.hp,
        angle: 0,
        wanderAt: 0,
        attackAt: this.game.s.elapsed + 2,
        howlAt: this.game.s.elapsed + 5,
        deadUntil: 0,
        warning: 2,
        phase: 0,
        ...at ? { walkY: at.y } : {}
      };
      this.game.s.animals.push(boss2);
      this.game.s.altar.activeBoss = boss2.id;
      for (let i = 0; i < 2; i++) {
        const cx = x + (i ? 70 : -70);
        this.game.s.animals.push({
          id: uniqueId(),
          type: "wolf",
          companion: true,
          x: cx,
          y: at ? this.game.floorNear(cx, at.y - 20) : this.game.groundTopAt(cx) - 1,
          ...at ? { walkY: at.y } : {},
          homeX: altar.x,
          homeY: altar.y,
          hp: 66,
          maxHp: 66,
          angle: 0,
          wanderAt: 0,
          attackAt: this.game.s.elapsed + 2,
          deadUntil: 0,
          warning: 1,
          phase: i
        });
      }
      this.game.say("The " + cfg.name + " answers the Effergy. Two wolves follow it.", "danger");
      this.game.sound("boss", x, y - 40, 1.5);
    }
    attune(mob = "wolf") {
      if (mob !== "wolf")
        return { ok: false, reason: "Only wolf attunement is recorded in this folio." };
      if (!this.game.s.structures.some((st) => st.type === "effergy"))
        return { ok: false, reason: "Place the Effergy first." };
      if (!this.game.near("effergy", 135)) return { ok: false, reason: "Stand beside the Effergy." };
      this.game.s.altar.attuned = mob;
      this.game.s.altar.kills = 0;
      this.game.say("The folio is attuned to wolves. Hunt them to call the Direwolf.", "good");
      return { ok: true };
    }
    upgradeAltar() {
      const a = this.game.s.altar, cost = a.level === 1 ? 100 : a.level === 2 ? 250 : Infinity;
      if (!this.game.near("effergy", 135)) return { ok: false, reason: "Stand beside the Effergy." };
      if (a.activeBoss) return { ok: false, reason: "Finish the current hunt first." };
      if (a.xp < cost) return { ok: false, reason: "Requires " + cost + " Effergy XP." };
      a.xp -= cost;
      a.level++;
      a.kills = 0;
      this.game.say(
        "Effergy raised to level " + a.level + ". The next hunt grows darker.",
        "victory"
      );
      return { ok: true };
    }
  };

  // src/game/systems/Environment.ts
  var Environment = class extends System {
    timeOfDay() {
      return (RULES.minutesAtStart + this.game.s.elapsed * RULES.minutesPerSecond) % RULES.minutesPerDay;
    }
    isNight() {
      const t = this.timeOfDay();
      return t < RULES.nightEndsAt || t > RULES.nightStartsAt;
    }
    temperature() {
      const b = this.game.biome(), layer = this.game.layer();
      if (layer.id === "upper_mines") return layer.temp + b.temp * 0.25;
      if (layer.id !== "surface") return layer.temp;
      return b.temp + (this.isNight() ? -8 : 0) + (this.game.s.weather === "rain" ? -4 : this.game.s.weather === "storm" ? -7 : 0);
    }
    // Moves the clock forward and occasionally turns the weather.
    advance(dt) {
      this.game.s.elapsed += dt;
      this.game.s.day = 1 + Math.floor(
        (RULES.minutesAtStart + this.game.s.elapsed * RULES.minutesPerSecond) / RULES.minutesPerDay
      );
      if (this.game.s.elapsed >= this.game.s.weatherNext) {
        this.game.s.weather = pick(this.game.rng, ["clear", "clear", "cloudy", "rain", "storm"]);
        this.game.s.weatherNext = this.game.s.elapsed + RULES.weatherBaseSeconds + this.game.rng() * RULES.weatherJitterSeconds;
        this.game.say("Weather turning " + this.game.s.weather + ".");
      }
    }
    // Rain catchers slowly fill while it rains or storms.
    collectRain(dt) {
      for (const st of this.game.s.structures)
        if (st.type === "rain_catcher" && ["rain", "storm"].includes(this.game.s.weather))
          st.water = clamp(st.water + dt * RULES.rainCatchRate, 0, RULES.rainCatchCapacity);
    }
  };

  // src/game/systems/Interaction.ts
  var Interaction = class extends System {
    nearestInteractable(radius = RULES.interactReach) {
      const p = this.game.s.player;
      const objects = [
        ...this.game.s.nodes.filter((n) => n.hp > 0).map((n) => ({ object: n, type: "node", d: dist(n, p) })),
        ...this.game.s.structures.map((st) => ({
          object: st,
          type: "structure",
          d: dist(st, p)
        })),
        ...this.game.s.caches.filter((c) => !c.opened).map((c) => ({ object: c, type: "cache", d: dist(c, p) }))
      ].filter((x) => x.d < radius).sort((a, b) => a.d - b.d);
      return objects[0] || null;
    }
    interact() {
      const near = this.nearestInteractable();
      if (!near) return { ok: false, reason: "Nothing is within reach." };
      if (near.type === "node") return this.gather(near.object);
      if (near.type === "cache") {
        const c = near.object;
        c.opened = true;
        this.game.sound("open", c.x, c.y);
        const deep = {
          lower_mines: ["iron_ingot", "crystal"],
          upper_hell: ["steel_ingot", "obsidian"]
        };
        const loot = c.layer ? deep[c.layer] : {
          coast: ["salt", "reeds"],
          marsh: ["herb", "clay"],
          forest: ["resin", "copper_ore"],
          meadow: ["bread", "flint"],
          taiga: ["coal", "hide"],
          tundra: ["ice", "iron_ore"],
          alpine: ["crystal", "iron_ore"],
          desert: ["sulfur", "cactus_fruit"],
          badlands: ["obsidian", "coal"]
        }[c.biome];
        this.game.add(loot[0], 2);
        this.game.add(loot[1], 2);
        this.game.say(
          "Opened an abandoned field cache: 2 " + itemName(loot[0]) + ", 2 " + itemName(loot[1]) + ".",
          "good"
        );
        return { ok: true, action: "cache" };
      }
      const st = near.object;
      if (st.type === "bedroll") {
        this.game.s.vitals.fatigue = clamp(this.game.s.vitals.fatigue - 32, 0, RULES.maxVital);
        this.game.s.vitals.stamina = 100;
        this.game.s.elapsed += 90;
        this.game.sound("rest");
        this.game.say("Rested beneath the open sky. Fatigue eases.", "good");
      } else if (st.type === "campfire") {
        if (this.game.count("wood")) {
          this.game.remove("wood");
          st.fuel += RULES.campfireRefuel;
          this.game.sound("place", st.x, st.y, 0.7);
          this.game.say("Fed the campfire with wood.", "good");
        } else return { ok: false, reason: "One wood refuels the campfire." };
      } else if (st.type === "icebox") {
        if (this.game.count("ice")) {
          this.game.remove("ice");
          st.fuel += RULES.iceboxRefuel;
          this.game.say("Icebox cooled with fresh ice.", "good");
        } else return { ok: false, reason: "One ice refuels the icebox." };
      } else if (st.type === "rain_catcher") {
        if (st.water < 1) return { ok: false, reason: "The rain catcher is empty. Wait for rain." };
        const amount = Math.min(3, Math.floor(st.water));
        st.water -= amount;
        this.game.add("wild_water", amount);
        this.game.say("Collected " + amount + " wild water. Boil it before drinking.", "good");
      } else if (st.type === "lantern") {
        if (!this.game.count("resin")) return { ok: false, reason: "One resin refuels the lantern." };
        this.game.remove("resin");
        st.fuel += RULES.lanternRefuel;
        this.game.say("Lantern refueled with resin.", "good");
      } else if (st.type === "chest") {
        this.game.sound("open", st.x, st.y);
        return { ok: true, action: "chest", structure: st };
      } else if (st.type === "farm_plot") {
        if (st.crop && this.game.s.elapsed - st.plantedAt >= RULES.cropGrowthSeconds) {
          this.game.add(st.crop, 5);
          this.game.say("Harvested " + itemName(st.crop) + ".", "good");
          st.crop = null;
        } else if (st.crop) return { ok: false, reason: itemName(st.crop) + " is still growing." };
        else return { ok: true, action: "farm", structure: st };
      } else if (st.type === "effergy") return { ok: true, action: "beasts" };
      else {
        this.game.say("Standing by the " + itemName(st.type) + ". Open Recipes to craft.");
        return { ok: true, action: "recipes" };
      }
      return { ok: true };
    }
    fish() {
      if (!this.game.count("fishing_rod"))
        return { ok: false, reason: "Make a fishing rod at a workbench." };
      const water = this.game.s.nodes.find(
        (n) => n.kind === "water" && dist(n, this.game.s.player) < RULES.fishReach
      );
      if (!water) return { ok: false, reason: "Stand by a pool to fish." };
      if (this.game.s.vitals.stamina < 9) return { ok: false, reason: "Too tired to fish." };
      this.game.s.vitals.stamina -= 9;
      this.game.sound("cast");
      if (this.game.rng() < RULES.fishSuccessChance) {
        this.game.sound("catch", water.x, water.y);
        this.game.add("raw_fish");
        this.game.say("Caught a fish. Cook it before eating.", "good");
        return { ok: true, caught: true };
      }
      this.game.say("The line came back empty.");
      return { ok: true, caught: false };
    }
    storeInChest(chest, id) {
      if (!chest || chest.type !== "chest" || dist(chest, this.game.s.player) > 110)
        return { ok: false, reason: "Stand beside the chest." };
      if (!id || !this.game.count(id)) return { ok: false, reason: "That item is not in the pack." };
      if (ITEMS[id]?.[2]) return { ok: false, reason: "Perishable food needs an icebox." };
      this.game.remove(id);
      chest.store[id] = (chest.store[id] || 0) + 1;
      this.game.say(itemName(id) + " stowed.", "good");
      return { ok: true };
    }
    takeFromChest(chest, id) {
      if (!chest || chest.type !== "chest" || dist(chest, this.game.s.player) > 110)
        return { ok: false, reason: "Stand beside the chest." };
      if (!chest.store[id]) return { ok: false, reason: "None of that item is stored here." };
      chest.store[id]--;
      if (!chest.store[id]) delete chest.store[id];
      this.game.add(id);
      this.game.say(itemName(id) + " taken.", "good");
      return { ok: true };
    }
    plant(st, crop) {
      if (!st || st.type !== "farm_plot" || dist(st, this.game.s.player) > 95)
        return { ok: false, reason: "Stand by a farm plot." };
      if (st.crop) return { ok: false, reason: "That plot is planted." };
      if (!["herb", "wheat", "potato"].includes(crop) || !this.game.count(crop))
        return { ok: false, reason: "A herb, wheat, or potato is needed." };
      this.game.remove(crop);
      st.crop = crop;
      st.plantedAt = this.game.s.elapsed;
      this.game.say(itemName(crop) + " planted. Harvest after four minutes.", "good");
      return { ok: true };
    }
    gather(node) {
      const p = this.game.s.player;
      if (dist(node, p) > RULES.gatherReach || node.hp <= 0)
        return { ok: false, reason: "Move closer to the resource." };
      const spec = NODES[node.kind], v = this.game.s.vitals;
      const tier = spec.tool ? this.game.toolTier(spec.tool) : 0;
      if (tier < (spec.req || 0))
        return {
          ok: false,
          reason: itemName(node.kind) + " requires a tier " + spec.req + (spec.tool === "axe" ? " axe." : " pickaxe.")
        };
      if (v.stamina < 7) return { ok: false, reason: "Too exhausted to gather. Rest or wait." };
      v.stamina -= 7;
      v.hydration = clamp(v.hydration - 0.4, 0, RULES.maxVital);
      v.hygiene = clamp(v.hygiene - 0.3, 0, RULES.maxVital);
      const roll = () => Math.floor(spec.yield[0] + this.game.rng() * (spec.yield[1] - spec.yield[0] + 1)) + (tier >= 3 ? 1 : 0);
      const form = nodeForm(node.kind), s = this.game.s;
      node.hitAt = s.elapsed;
      this.game.sound(
        form === "tree" ? "chop" : form === "mineral" ? "pick" : form === "water" ? "splash" : "pluck",
        node.x,
        node.y - 20
      );
      if (form === "water") {
        const qty2 = roll();
        this.game.add("wild_water", qty2);
        this.game.event("chip", node.x, node.y, "water");
        this.game.say("Gathered " + qty2 + " wild water.", "good");
        return { ok: true, id: "wild_water", qty: qty2 };
      }
      this.game.event("chip", node.x, node.y - (form === "tree" ? 26 : 10), node.kind);
      if (form === "plant") {
        const qty2 = roll();
        node.hp--;
        if (node.hp <= 0) node.depletedUntil = s.elapsed + spec.regen;
        this.game.drops.spawn(node.kind, qty2, node.x, node.y - 14);
        return { ok: true, id: node.kind, qty: qty2 };
      }
      node.hp--;
      if (node.hp > 0) return { ok: true, id: node.kind, qty: 0, hit: true };
      let qty = 0;
      for (let i = 0; i < spec.hp; i++) qty += roll();
      if (form === "tree") {
        const dir = node.x >= p.x ? 1 : -1;
        node.felledAt = s.elapsed;
        node.fallDir = dir;
        node.depletedUntil = s.elapsed + spec.regen * RULES.treeRegrowthFactor;
        this.game.event("fell", node.x, node.y, node.kind, dir);
        this.game.sound("creak", node.x, node.y - 40);
        this.game.drops.spawn(node.kind, qty, node.x + dir * 70, node.y - 24, RULES.treeFallSeconds);
        this.game.say("Timber! The tree comes down.", "good");
      } else {
        const index = s.nodes.indexOf(node);
        if (index >= 0) s.nodes.splice(index, 1);
        this.game.event("crumble", node.x, node.y, node.kind);
        this.game.sound("crumble", node.x, node.y);
        this.game.drops.spawn(node.kind, qty, node.x, node.y - 12);
        this.game.say("The " + itemName(node.kind).toLowerCase() + " breaks apart.", "good");
      }
      return { ok: true, id: node.kind, qty };
    }
  };

  // src/game/systems/Inventory.ts
  var Inventory = class extends System {
    count(id) {
      return this.game.s.inventory.reduce((n, entry) => n + (entry.id === id ? entry.qty : 0), 0);
    }
    itemState(entry) {
      return entry.fresh === void 0 ? "stable" : entry.fresh <= 0 ? "rotten" : entry.fresh < (ITEMS[entry.id]?.[2] || 1) * RULES.staleAtFraction ? "stale" : "fresh";
    }
    add(id, qty = 1, options = {}) {
      const perish = ITEMS[id]?.[2];
      if (perish) {
        for (let i = 0; i < qty; i++)
          this.game.s.inventory.push({ id, qty: 1, fresh: options.fresh ?? perish });
      } else {
        const found = this.game.s.inventory.find((e) => e.id === id && e.fresh === void 0);
        if (found) found.qty += qty;
        else this.game.s.inventory.push({ id, qty });
      }
      this.game.progress.record(id, qty);
    }
    remove(id, qty = 1) {
      if (this.count(id) < qty) return false;
      const entries = this.game.s.inventory.filter((e) => e.id === id).sort((a, b) => (a.fresh ?? Infinity) - (b.fresh ?? Infinity));
      for (const e of entries) {
        const n = Math.min(qty, e.qty);
        e.qty -= n;
        qty -= n;
        if (!qty) break;
      }
      this.game.s.inventory = this.game.s.inventory.filter((e) => e.qty > 0);
      return true;
    }
    canAfford(cost) {
      return Object.entries(cost).every(([id, n]) => this.count(id) >= n);
    }
    toolTier(kind) {
      return Object.entries(TOOL_TIERS).reduce(
        (best, [id, [tool, tier]]) => tool === kind && this.count(id) ? Math.max(best, tier) : best,
        0
      );
    }
  };

  // src/game/systems/Physics.ts
  var STEP_SOUNDS = {
    1: "step_soil",
    2: "step_stone",
    3: "step_sand",
    4: "step_mud",
    5: "step_snow",
    6: "step_stone",
    8: "step_stone",
    9: "step_ash",
    10: "step_stone"
  };
  var Physics = class extends System {
    stride = 0;
    wasInLava = false;
    /** Footstep sound for the ground underfoot; grass tops the soil at the surface. */
    stepSound() {
      const p = this.game.s.player, tx = Math.floor(p.x / TILE), ty = Math.floor((p.y + 4) / TILE), kind = this.game.tileAt(tx, ty);
      if (kind === 1 && !this.game.tileAt(tx, ty - 1) && this.game.layer().id === "surface")
        return "step_grass";
      return STEP_SOUNDS[kind] ?? "step_stone";
    }
    collides(x, y) {
      for (let tx = Math.floor((x - RULES.playerHalfWidth) / TILE); tx <= Math.floor((x + RULES.playerHalfWidth) / TILE); tx++)
        for (let ty = Math.floor((y - RULES.playerHeight) / TILE); ty <= Math.floor((y - RULES.playerFootInset) / TILE); ty++)
          if (this.game.tileAt(tx, ty)) return true;
      return false;
    }
    jump() {
      const p = this.game.s.player;
      if (!p.grounded || this.game.s.vitals.stamina < RULES.jumpStamina) return false;
      p.vy = -RULES.jumpVelocity;
      p.grounded = false;
      this.game.s.vitals.stamina -= RULES.jumpStamina;
      this.game.sound("jump");
      return true;
    }
    move(dx, dy, dt) {
      if (this.game.s.dead) return;
      const p = this.game.s.player, v = this.game.s.vitals;
      if (this.game.dev.noclip) {
        const fly = 520 * this.game.dev.speed;
        p.moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
        if (dx) p.face = dx > 0 ? 0 : Math.PI;
        p.x = clamp(p.x + dx * fly * dt, 15, WORLD_W - 15);
        p.y = clamp(p.y + dy * fly * dt, 40, WORLD_H - 15);
        p.vx = 0;
        p.vy = 0;
        p.grounded = true;
        return;
      }
      p.moving = Math.abs(dx) > 0.1;
      if (p.moving && p.grounded) {
        this.stride += Math.abs(p.vx || 0) * dt;
        if (this.stride > RULES.strideLength) {
          this.stride = 0;
          this.game.sound(this.stepSound(), p.x, p.y, 0.8);
        }
      }
      const tired = v.stamina < 12 || v.fatigue > 80;
      const lava = this.game.inLava();
      if (lava && !this.wasInLava) this.game.sound("sizzle", p.x, p.y, 1.3);
      this.wasInLava = lava;
      const speed = (lava ? 0.45 : 1) * (tired ? RULES.tiredMoveSpeed : RULES.standardMoveSpeed) * (v.illness > 60 ? 0.82 : 1) * (p.boots ? 1.12 : 1) * this.game.dev.speed;
      if (dx) p.face = dx > 0 ? 0 : Math.PI;
      p.vx = dx * speed;
      const shaft = inShaft(p.x, p.y);
      if (lava) p.vy = dy < 0 ? -150 : Math.min(p.vy + 240 * dt, 60);
      else if (dy < 0 && (p.grounded || shaft) && v.stamina > RULES.jumpStamina) {
        if (p.grounded) this.jump();
        else {
          p.vy = -RULES.climbVelocity;
          v.stamina = clamp(v.stamina - dt * 5, 0, RULES.maxVital);
        }
      } else if (shaft && dy > 0) p.vy = Math.min(p.vy + 160 * dt, 170);
      else p.vy = Math.min(p.vy + RULES.gravity * dt, RULES.terminalVelocity);
      const nx = clamp(p.x + p.vx * dt, 15, WORLD_W - 15);
      if (!this.collides(nx, p.y)) p.x = nx;
      else if (p.grounded && !this.collides(nx, p.y - TILE) && this.collides(nx, p.y + 2)) {
        p.x = nx;
        p.y -= TILE;
      }
      const oldY = p.y, steps = Math.max(1, Math.ceil(Math.abs(p.vy * dt) / 7));
      for (let i = 0; i < steps; i++) {
        const ny = p.y + p.vy * dt / steps;
        const platform = this.game.s.structures.find(
          (st) => st.type === "platform" && dy <= 0 && Math.abs(st.x - p.x) < 35 && p.y <= st.y - 1 && ny >= st.y - 1
        );
        if (platform) {
          p.y = platform.y - 1;
          p.vy = 0;
          p.grounded = true;
          break;
        }
        if (!this.collides(p.x, ny)) {
          p.y = ny;
          p.grounded = false;
        } else {
          if (p.vy > 0) {
            if (!p.grounded && p.vy > 200)
              this.game.sound("land", p.x, p.y, Math.min(1.4, p.vy / 450));
            p.grounded = true;
            if (p.vy > RULES.fallDamageVelocity && !this.game.dev.god)
              v.health = clamp(
                v.health - (p.vy - RULES.fallDamageVelocity) * 0.07,
                0,
                RULES.maxVital
              );
          }
          p.vy = 0;
          break;
        }
      }
      if (p.vy >= 0 && !this.collides(p.x, p.y + 3)) p.grounded = false;
      if (p.y > WORLD_H - 15) {
        p.y = WORLD_H - 15;
        p.vy = 0;
        p.grounded = true;
      }
      if (p.moving || Math.abs(p.y - oldY) > 0.5) {
        v.stamina = clamp(v.stamina - dt * (tired ? 0.7 : 2.2), 0, RULES.maxVital);
        v.hydration = clamp(v.hydration - dt * 0.018, 0, RULES.maxVital);
      }
    }
  };

  // src/game/systems/Progress.ts
  var Progress = class extends System {
    record(key, qty = 1) {
      this.game.s.tutorial.tally[key] = (this.game.s.tutorial.tally[key] || 0) + qty;
      this.advanceTutorial();
      this.advanceChapter();
    }
    advanceTutorial() {
      let step = this.game.s.tutorial.step;
      while (step < TUTORIAL.length) {
        const [, key, n] = TUTORIAL[step];
        if ((this.game.s.tutorial.tally[key] || 0) < n) break;
        step++;
        if (step < TUTORIAL.length) this.game.say("Field task complete \xB7 " + TUTORIAL[step][0]);
        else this.game.say("Field apprenticeship complete. The wildlands are yours to cross.");
      }
      this.game.s.tutorial.step = step;
    }
    advanceChapter() {
      let step = this.game.s.chapter || 0;
      while (step < CHAPTERS.length) {
        const [, key, n] = CHAPTERS[step];
        if ((this.game.s.tutorial.tally[key] || 0) < n) break;
        step++;
        if (step < CHAPTERS.length)
          this.game.say("Next expedition: " + CHAPTERS[step][0] + ".", "good");
        else this.game.say("The final folio is complete. The wildlands are yours.", "victory");
      }
      this.game.s.chapter = step;
    }
    // The first visit to each region is recorded as a discovery.
    discover() {
      const region = this.game.biome();
      if (this.game.s.discoveries.includes(region.id)) return;
      this.game.s.discoveries.push(region.id);
      this.record("visit:" + region.id);
      this.game.say("New field entry: " + region.name + ".", "good");
    }
  };

  // src/game/systems/Survival.ts
  var Survival = class extends System {
    wash() {
      const water = this.game.count("wild_water") ? "wild_water" : this.game.count("boiled_water") ? "boiled_water" : null;
      if (!water) return { ok: false, reason: "Carry some water to wash." };
      this.game.remove(water);
      this.game.s.vitals.hygiene = clamp(
        this.game.s.vitals.hygiene + RULES.washHygieneGain,
        0,
        RULES.maxVital
      );
      this.game.s.vitals.wetness = clamp(this.game.s.vitals.wetness + 7, 0, RULES.maxVital);
      this.game.say("Washed with water. Infection risk eases, but your clothes are damp.", "good");
      return { ok: true };
    }
    contract(disease) {
      this.game.s.disease = disease;
      if (disease === "wound")
        this.game.s.vitals.infection = Math.max(this.game.s.vitals.infection, 22);
      else this.game.s.vitals.illness = Math.max(this.game.s.vitals.illness, 24);
      this.game.s.vitals.morale = clamp(this.game.s.vitals.morale - 8, 0, RULES.maxVital);
      this.game.say(
        "Diagnosis: " + DISEASES[disease].name + ". See Field Notes for treatment.",
        "danger"
      );
    }
    advanceDecay(dt) {
      const icebox = this.game.near("icebox", 135);
      const cooledFor = icebox ? Math.min(dt, icebox.fuel) : 0;
      for (const e of this.game.s.inventory)
        if (e.fresh !== void 0) e.fresh -= cooledFor * RULES.cooledSpoilageRate + (dt - cooledFor);
      for (const st of this.game.s.structures)
        if (st.fuel > 0 && ["campfire", "icebox", "lantern"].includes(st.type))
          st.fuel = Math.max(0, st.fuel - dt);
      for (const n of this.game.s.nodes)
        if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) {
          n.hp = NODES[n.kind].hp;
          delete n.felledAt;
        }
    }
    vitalReasons() {
      const v = this.game.s.vitals, causes = [];
      if (v.hydration < 25) causes.push("Thirst is damaging recovery");
      if (v.calories < 25) causes.push("Calories are dangerously low");
      if (v.protein < 20) causes.push("Protein deficiency weakens you");
      if (v.bodyTemp < 35) causes.push("Cold exposure is draining health");
      if (v.bodyTemp > 39) causes.push("Heat exposure is draining health");
      if (v.wetness > 40) causes.push("Wet clothing magnifies cold");
      if (v.fatigue > 75) causes.push("Fatigue slows movement and fighting");
      if (this.game.inLava()) causes.push("Molten rock is burning you; climb out");
      else if (this.heat() > 0)
        causes.push(
          this.game.s.player.ward ? "The Cinder Ward holds back most of the heat" : "Scorching heat; a Cinder Ward is needed below"
        );
      if (v.illness > 30) causes.push("Illness is worsening");
      if (v.infection > 25) causes.push("Infection is worsening; wash and treat it");
      if (v.hygiene < 25) causes.push("Poor hygiene increases infection");
      if (this.game.cooled()) causes.push("Icebox slows spoilage to 18%");
      if (!causes.length) causes.push("Stable \xB7 food, water, and warmth allow recovery");
      return causes;
    }
    recover() {
      if (!this.game.s.dead) return;
      this.game.s.dead = false;
      this.game.s.player.x = RULES.spawnX;
      this.game.s.player.y = this.game.groundTopAt(RULES.spawnX) + 1;
      this.game.s.player.vx = 0;
      this.game.s.player.vy = 0;
      this.game.s.player.grounded = true;
      Object.assign(this.game.s.vitals, {
        health: 55,
        hydration: 38,
        calories: 40,
        protein: 35,
        stamina: 65,
        fatigue: 45,
        bodyTemp: 37,
        wetness: 0,
        illness: 0,
        infection: 0,
        hygiene: 55,
        morale: 30
      });
      this.game.s.disease = null;
      this.game.s.elapsed += 600;
      for (const e of this.game.s.inventory)
        if (ITEMS[e.id]?.[1] === "material" || ITEMS[e.id]?.[1] === "ore")
          e.qty = Math.ceil(e.qty * 0.75);
      this.game.say("You woke in the meadow. Some loose supplies were lost.", "good");
    }
    burnTimer = 0;
    /** Health lost per second to the heat of the hell layers. */
    heat() {
      const layer = this.game.layer().id, ward = this.game.s.player.ward ? 1 : 0;
      if (layer === "upper_hell") return RULES.upperHellHeat[ward];
      if (layer === "lower_hell") return RULES.lowerHellHeat[ward];
      return 0;
    }
    // Exposure, hunger, illness, morale, and health drift for one tick.
    update(dt) {
      const v = this.game.s.vitals, p = this.game.s.player;
      const cold2 = this.game.temperature();
      const shelter = this.game.sheltered(), fire = !!this.game.nearLitFire();
      const rain = this.game.s.weather === "rain" || this.game.s.weather === "storm";
      const underground = p.y > surfaceAt(p.x) + 80;
      const marshWet = this.game.biome().id === "marsh" && !shelter && !underground ? 0.065 : 0;
      v.wetness = clamp(
        v.wetness + dt * (rain && !shelter && !underground ? 0.28 : fire ? -0.35 : shelter ? -0.17 : -0.07) + dt * marshWet,
        0,
        100
      );
      let target = 37 + (cold2 - (underground ? 6 : 15)) * 0.19 - v.wetness * 0.022 + (fire ? 4.5 : 0) + (shelter ? 1.8 : 0) + (p.cloak && cold2 < 15 ? 2.7 : 0) + (p.coat && cold2 < 15 ? 1.4 : 0);
      target = clamp(target, 30, 41);
      v.bodyTemp += (target - v.bodyTemp) * dt * 0.012;
      v.hydration = clamp(
        v.hydration - dt * (0.045 + (cold2 > 26 ? 0.045 : 0) + (cold2 > 40 ? p.ward ? 0.05 : 0.14 : 0) + (this.game.s.disease === "dysentery" ? 0.055 : 0)),
        0,
        100
      );
      v.calories = clamp(v.calories - dt * (p.moving ? 0.048 : 0.031), 0, RULES.maxVital);
      v.protein = clamp(v.protein - dt * 0.018, 0, RULES.maxVital);
      v.fatigue = clamp(v.fatigue + dt * (p.moving ? 0.029 : 0.014), 0, RULES.maxVital);
      v.hygiene = clamp(
        v.hygiene - dt * (this.game.biome().id === "marsh" ? 0.025 : 0.011),
        0,
        RULES.maxVital
      );
      v.stamina = clamp(
        v.stamina + dt * (p.moving ? 0.25 : v.hydration > 10 && v.calories > 10 ? 3.4 : 1.2),
        0,
        100
      );
      if (this.game.s.disease && ["dysentery", "fever", "poisoning"].includes(this.game.s.disease))
        v.illness = clamp(
          v.illness + dt * (this.game.s.disease === "poisoning" ? 0.07 : 0.025),
          0,
          RULES.maxVital
        );
      else v.illness = clamp(v.illness - dt * 0.015, 0, RULES.maxVital);
      if (this.game.s.disease === "wound")
        v.infection = clamp(v.infection + dt * (v.hygiene < 35 ? 0.045 : 0.02), 0, RULES.maxVital);
      else v.infection = clamp(v.infection - dt * 0.013, 0, RULES.maxVital);
      if (v.hygiene < 20 && v.infection > 0)
        v.infection = clamp(v.infection + dt * 0.024, 0, RULES.maxVital);
      const threats = this.game.s.animals.some(
        (a) => !a.deadUntil && ["wolf", "boar", "scorpion", "bat", "boss", "ember_bat", "hellhound"].includes(a.type) && dist(a, p) < 150
      );
      v.morale = clamp(
        v.morale + dt * (threats || v.illness > 45 ? -0.045 : fire && v.calories > 40 ? 0.025 : 4e-3),
        0,
        100
      );
      const burning = this.game.inLava() ? RULES.lavaDamage[p.ward ? 1 : 0] : 0;
      const harm = burning + this.heat() + (v.hydration <= 0 ? 0.15 : 0) + (v.calories <= 0 ? 0.11 : 0) + (v.protein <= 0 ? 0.04 : 0) + (v.bodyTemp < 35 || v.bodyTemp > 39 ? 0.09 : 0) + (v.illness > 70 ? 0.08 : 0) + (v.infection > 65 ? 0.1 : 0);
      if (harm) v.health = clamp(v.health - harm * dt, 0, RULES.maxVital);
      else if (v.hydration > 50 && v.calories > 50 && v.protein > 25 && v.bodyTemp > 36 && v.bodyTemp < 38 && v.illness < 20 && v.infection < 20 && !threats)
        v.health = clamp(v.health + dt * 0.018, 0, RULES.maxVital);
      if (burning || this.heat() > 0.5) {
        this.burnTimer -= dt;
        if (this.burnTimer <= 0) {
          this.burnTimer = 0.9;
          this.game.sound("burn", p.x, p.y - 20, burning ? 1.2 : 0.6);
        }
      }
      if (v.health <= 0 && !this.game.dev.god) {
        this.game.s.dead = true;
        this.game.sound("death");
        this.game.say(
          burning ? "The lava took you. Your field record survives." : "You collapsed. Your field record survives.",
          "danger"
        );
      }
    }
  };

  // src/game/systems/Terrain.ts
  var Terrain = class extends System {
    tileAt(tx, ty) {
      return tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS ? 0 : this.game.s.tiles[ty * TILE_COLS + tx] || 0;
    }
    /** Changes one tile and remembers the change for the field record. */
    setTile(tx, ty, kind) {
      if (tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS) return;
      const index = ty * TILE_COLS + tx;
      this.game.s.tiles[index] = kind;
      this.game.s.tileEdits[index] = kind;
    }
    groundTopAt(x) {
      const tx = clamp(Math.floor(x / TILE), 0, TILE_COLS - 1);
      for (let ty = 0; ty < TILE_ROWS; ty++) if (this.tileAt(tx, ty)) return ty * TILE;
      return WORLD_H - TILE;
    }
    // The first standing surface at or below y, so cave objects rest on the passage floor.
    floorNear(x, y) {
      const tx = clamp(Math.floor(x / TILE), 0, TILE_COLS - 1);
      let ty = clamp(Math.floor(y / TILE), 0, TILE_ROWS - 1);
      while (ty > 0 && this.tileAt(tx, ty) && this.tileAt(tx, ty - 1)) ty--;
      for (let i = 0; i < 8 && ty < TILE_ROWS; i++, ty++)
        if (this.tileAt(tx, ty) && !this.tileAt(tx, ty - 1)) return ty * TILE - 1;
      return y;
    }
    mineTileAt(x, y) {
      const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE), kind = this.tileAt(tx, ty);
      if (!kind) return { ok: false, reason: "There is no solid ground there." };
      if (Math.hypot(x - this.game.s.player.x, y - (this.game.s.player.y - 24)) > RULES.mineReach)
        return { ok: false, reason: "Move closer to mine this tile." };
      const need = MINE_TIER[kind] ?? 1;
      if (this.game.toolTier("pick") < need)
        return { ok: false, reason: "This ground needs a tier " + need + " pickaxe." };
      if (this.game.s.vitals.stamina < RULES.mineStamina)
        return { ok: false, reason: "Too exhausted to mine." };
      this.game.s.vitals.stamina -= RULES.mineStamina;
      this.setTile(tx, ty, 0);
      const cx = tx * TILE + TILE / 2, cy = ty * TILE + TILE / 2, spec = TILE_YIELD[kind] ?? { item: "stone" };
      this.game.event("dig", cx, cy, String(kind));
      this.game.sound(
        kind === 5 ? "dig_ice" : kind >= 9 ? "dig_hell" : kind === 2 || kind === 6 || kind === 8 ? "dig_stone" : "dig_soil",
        cx,
        cy
      );
      this.game.drops.spawn(spec.item, 1, cx, cy);
      if (spec.bonus && this.game.rng() < spec.bonus[1]) {
        this.game.drops.spawn(spec.bonus[0], 1, cx, cy);
        this.game.say("Found " + itemName(spec.bonus[0]).toLowerCase() + " in the rock!", "good");
      }
      return { ok: true, item: spec.item };
    }
  };

  // src/game/systems/Wildlife.ts
  var aggressiveType = (type) => ["wolf", "boar", "scorpion", "bat", "boss", "ember_bat", "hellhound"].includes(type);
  var ANIMAL_NAMES = {
    deer: "Deer",
    wolf: "Wolf",
    boar: "Boar",
    bat: "Bat",
    scorpion: "Scorpion",
    ember_bat: "Ember bat",
    hellhound: "Hellhound"
  };
  var Wildlife = class extends System {
    /** Where an animal stands (or hovers) at x: its tunnel, the underworld floor, or the ground. */
    restY(a, x) {
      if (a.hoverY !== void 0) return a.hoverY + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
      if (a.walkY !== void 0) return a.walkY = this.game.floorNear(x, a.walkY - 20);
      if (a.tunnel) return caveY(x, a.tunnel) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
      if (a.type === "bat") return caveY(x, 1) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13;
      if (a.underground) return this.game.floorNear(x, underworldFloor(x) - 20);
      return this.game.groundTopAt(x) - 1;
    }
    attack() {
      if (this.game.s.dead) return { ok: false, reason: "You must recover first." };
      const p = this.game.s.player, v = this.game.s.vitals, weapon = WEAPONS[p.weapon] || WEAPONS.fists;
      if (this.game.s.elapsed < p.attackAt)
        return { ok: false, reason: "Recovering from the last strike." };
      if (v.stamina < RULES.attackStamina) return { ok: false, reason: "Too exhausted to strike." };
      p.attackAt = this.game.s.elapsed + RULES.attackCooldownSeconds;
      v.stamina -= RULES.attackStamina;
      v.hydration = clamp(v.hydration - 0.25, 0, RULES.maxVital);
      const targets = this.game.s.animals.filter(
        (a) => !a.deadUntil && Math.abs(a.x - p.x) < weapon[2] + (a.type === "boss" ? 28 : 0) && Math.abs(a.y - p.y) < 68 && (a.x - p.x) * Math.cos(p.face) > -15
      );
      const target = targets.sort((a, b) => dist(a, p) - dist(b, p))[0];
      this.game.sound("swing");
      if (!target) {
        this.game.say("The strike cuts through empty air.");
        return { ok: true, hit: false };
      }
      if (target.type === "boss" && weapon[0] < RULES.bossWeaponTier) {
        this.game.say("Ordinary steel glances off the Direwolf. Obsidian is required.", "danger");
        return { ok: true, hit: false };
      }
      const damage = weapon[1] * (v.stamina < 15 ? 0.72 : 1);
      target.hp -= damage;
      target.warning = 0;
      this.game.say(
        itemName(p.weapon) + " struck " + (target.type === "boss" ? BOSSES[this.game.s.altar.level - 1].name : "a " + (ANIMAL_NAMES[target.type] || target.type).toLowerCase()) + " for " + Math.round(damage) + ".",
        "combat"
      );
      this.game.sound("hit", target.x, target.y - 20);
      if (target.hp > 0) this.cry(target, "hurt");
      if (target.hp <= 0) this.kill(target);
      return { ok: true, hit: true, target };
    }
    /** A creature's voice: its call, attack cry, or hurt cry, at its position. */
    cry(a, what) {
      if (a.x === void 0) return;
      const voice = a.type === "boss" ? "wolf" : a.type;
      if (a.type === "boss" && what === "call") this.game.sound("boss", a.x, a.y - 30);
      else this.game.sound(voice + "_" + what, a.x, a.y - 20, a.type === "boss" ? 1.6 : 1);
    }
    kill(animal) {
      if (animal.x !== void 0) {
        this.game.sound("die", animal.x, animal.y - 20);
        this.cry(animal, "hurt");
      }
      animal.deadUntil = this.game.s.elapsed + (animal.type === "boss" ? 999999 : animal.type === "wolf" ? 150 : 120);
      if (animal.type === "boss") {
        const cfg = BOSSES[this.game.s.altar.level - 1];
        for (const [id, qty] of Object.entries(cfg.rewards)) this.game.add(id, qty);
        this.game.s.altar.xp += cfg.xp;
        this.game.s.altar.kills = 0;
        this.game.s.altar.activeBoss = null;
        this.game.progress.record("kill:boss");
        this.game.s.vitals.morale = clamp(this.game.s.vitals.morale + 25, 0, RULES.maxVital);
        this.game.say(
          cfg.name + " defeated. Trophies and " + cfg.xp + " Effergy XP claimed!",
          "victory"
        );
      } else {
        const at = animal.x === void 0 ? this.game.s.player : animal, loot = (id, qty) => this.game.drops.spawn(id, qty, at.x, at.y - 20);
        if (animal.type === "ember_bat") {
          loot("sulfur", 2);
          loot("chitin", 2);
        } else if (animal.type === "hellhound") {
          loot("hide", 3);
          loot("bone", 3);
          loot("hellstone", 1 + Math.floor(this.game.rng() * 2));
        } else if (animal.type === "bat") {
          loot("chitin", 2);
          loot("feathers", 1);
        } else if (animal.type === "scorpion") {
          loot("chitin", 3);
          loot("venom", 1);
        } else {
          loot("raw_meat", animal.type === "boar" ? 5 : 3);
          loot("hide", 2);
          loot("bone", animal.type === "wolf" ? 2 : 1);
        }
        if (animal.type === "wolf" && this.game.s.altar.attuned === "wolf" && !this.game.s.altar.activeBoss) {
          this.game.s.altar.kills++;
          const cfg = BOSSES[this.game.s.altar.level - 1];
          this.game.say("Wolf hunt: " + this.game.s.altar.kills + "/" + cfg.kills + ".", "combat");
          if (this.game.s.altar.kills >= cfg.kills) this.game.effergy.summonBoss();
        }
      }
    }
    step(a, dt) {
      if (a.deadUntil) {
        if (this.game.s.elapsed >= a.deadUntil && a.type !== "boss") {
          a.deadUntil = 0;
          a.hp = a.maxHp;
          a.x = a.homeX + (this.game.rng() - 0.5) * 180;
          a.y = this.restY(a, a.x);
        }
        return;
      }
      const p = this.game.s.player, d = dist(a, p), boss2 = a.type === "boss";
      const aggressive = [
        "wolf",
        "boar",
        "scorpion",
        "bat",
        "boss",
        "ember_bat",
        "hellhound"
      ].includes(a.type);
      const range = boss2 ? 350 : a.type === "bat" ? 145 : a.type === "hellhound" ? 300 : 210;
      let vx = 0;
      const wasFleeing = !!a.fleeing;
      a.fleeing = a.type === "deer" && (d < RULES.deerFlightDistance || wasFleeing && d < RULES.deerSafeDistance);
      if (a.fleeing && !wasFleeing) this.cry(a, "call");
      if (d < 900 && Math.random() < dt * (aggressiveType(a.type) ? 0.05 : 0.025))
        this.cry(a, "call");
      if (a.fleeing) vx = Math.sign(a.x - p.x) || 1;
      else if (aggressive && d < range && !this.game.s.dead) {
        vx = Math.sign(p.x - a.x);
        if (Math.abs(a.x - p.x) < (boss2 ? 75 : 30)) vx = 0;
        if (d < (boss2 ? 94 : 45) && this.game.s.elapsed >= a.attackAt) {
          a.warning = boss2 ? 1.15 : 0.55;
          this.cry(a, "attack");
          a.attackAt = this.game.s.elapsed + (boss2 ? 2.3 : 1.7);
          a.hitAt = this.game.s.elapsed + (boss2 ? 0.65 : 0.35);
        }
        if (boss2 && this.game.s.elapsed >= (a.howlAt ?? 0)) {
          a.howlAt = this.game.s.elapsed + 8;
          a.howlCue = this.game.s.elapsed + 0.8;
          a.warning = 1.2;
          this.game.say("The Direwolf draws breath for a howl!", "danger");
        }
      } else {
        if (this.game.s.elapsed >= a.wanderAt) {
          a.angle = a.type === "deer" && d < RULES.deerSafeDistance ? a.x >= p.x ? 0 : Math.PI : this.game.rng() > 0.5 ? 0 : Math.PI;
          a.wanderAt = this.game.s.elapsed + 2 + this.game.rng() * 4;
        }
        vx = Math.cos(a.angle) * 0.4;
      }
      if (a.hitAt && this.game.s.elapsed >= a.hitAt) {
        a.hitAt = 0;
        if (dist(a, p) < (boss2 ? 108 : 55) && p.invuln <= 0 && !this.game.s.dead && !this.game.dev.god) {
          const damage = boss2 ? BOSSES[this.game.s.altar.level - 1].bite : a.type === "hellhound" ? 26 : a.type === "ember_bat" ? 15 : a.type === "boar" ? 14 : a.type === "scorpion" ? 8 : 9;
          this.game.s.vitals.health -= damage * (p.cloak ? 0.68 : p.coat ? 0.82 : 1);
          this.game.s.vitals.morale = clamp(
            this.game.s.vitals.morale - (boss2 ? 9 : 4),
            0,
            RULES.maxVital
          );
          p.invuln = 0.75;
          this.game.sound("hurt");
          if (a.type === "scorpion" && this.game.rng() < 0.42) this.game.contract("poisoning");
          else if (this.game.rng() < (boss2 ? 0.4 : 0.16) + (this.game.s.vitals.hygiene < 30 ? 0.13 : 0))
            this.game.contract("wound");
          this.game.say(
            (boss2 ? "Direwolf" : ANIMAL_NAMES[a.type] || a.type) + " attack! " + Math.round(damage * (p.cloak ? 0.68 : p.coat ? 0.82 : 1)) + " damage.",
            "danger"
          );
        }
      }
      if (a.howlCue && this.game.s.elapsed >= a.howlCue) {
        a.howlCue = 0;
        if (d < 380) {
          this.game.s.vitals.stamina = clamp(this.game.s.vitals.stamina - 26, 0, RULES.maxVital);
          this.game.s.vitals.morale = clamp(this.game.s.vitals.morale - 13, 0, RULES.maxVital);
          this.game.say("The howl drains stamina and resolve.", "danger");
        }
      }
      a.warning = Math.max(0, a.warning - dt);
      const speed = a.type === "deer" ? a.fleeing ? 160 : 32 : boss2 ? 85 : a.type === "hellhound" ? d < range ? 150 : 45 : a.type === "ember_bat" ? d < range ? 135 : 40 : a.type === "scorpion" ? 67 : d < 210 ? 105 : 30;
      if (Math.abs(vx) > 0.5) a.angle = vx > 0 ? 0 : Math.PI;
      const nx = clamp(a.x + vx * speed * dt, 20, WORLD_W - 20);
      if (a.underground && underworldFloor(nx) > LAVA_Y - 6) a.angle = a.angle ? 0 : Math.PI;
      else a.x = nx;
      a.y = this.restY(a, a.x);
      for (const st of this.game.s.structures)
        if (st.type === "spike_trap" && Math.abs(st.x - a.x) < 23 && Math.abs(st.y - a.y) < 38 && this.game.s.elapsed - st.triggeredAt > 2) {
          a.hp -= 22;
          st.triggeredAt = this.game.s.elapsed;
          if (a.hp <= 0) this.kill(a);
        }
    }
  };

  // src/game/SaveSystem.ts
  var LAYOUT = 3;
  var OLD_REGION_WIDTH = 1200;
  var SaveSystem = class extends System {
    save(storage = globalThis.localStorage, silent = false) {
      this.game.s.lastSave = Date.now();
      const { tiles: _tiles, ...record } = this.game.s;
      storage.setItem(RULES.saveKey, JSON.stringify(record));
      if (!silent) this.game.say("Field record saved.", "good");
      return true;
    }
    load(storage = globalThis.localStorage) {
      const raw = storage.getItem(RULES.saveKey);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (![1, 2, 3].includes(parsed.version)) return false;
      const legacy = parsed.version < 3;
      const oldIds = [
        ...parsed.nodes || [],
        ...parsed.animals || [],
        ...parsed.structures || [],
        ...parsed.caches || []
      ].map((x) => x.id);
      reserveIds(Math.max(...oldIds, 0));
      if (legacy) {
        const scale = parsed.version === 1 ? 5 / 3 : 1;
        const oldGrid = [
          ["tundra", "taiga", "alpine"],
          ["coast", "meadow", "forest"],
          ["marsh", "desert", "badlands"]
        ];
        const remap = (x, y) => {
          const ox = clamp(x * scale, 0, 4799), oy = clamp(y * scale, 0, 3599), col = Math.floor(ox / 1600), row = Math.floor(oy / 1200);
          const span = BIOME_SPANS.find((b) => b.id === oldGrid[row][col]);
          return clamp(
            BIOME_CENTERS[span.id][0] + (ox % 1600 - 800) / 1600 * (span.end - span.start) * 0.8,
            30,
            WORLD_W - 30
          );
        };
        parsed.player.x = remap(parsed.player.x, parsed.player.y);
        parsed.player.y = this.game.groundTopAt(parsed.player.x) + 1;
        Object.assign(parsed.player, { vx: 0, vy: 0, grounded: true, coat: false, boots: false });
        parsed.structures.forEach((st) => {
          st.x = remap(st.x, st.y);
          st.y = this.game.groundTopAt(st.x) - 1;
          st.water = 0;
          st.store = {};
          st.triggeredAt = 0;
        });
        parsed.nodes = [];
        parsed.animals = [];
        parsed.caches = [];
        parsed.tiles = [];
        if (parsed.altar) parsed.altar.activeBoss = null;
        parsed.version = 3;
        parsed.layout = LAYOUT;
        this.game.s = parsed;
        this.game.rng = seededRandom(parsed.seed);
        this.game.messages = [];
        this.game.world.generate();
      } else {
        this.game.s = parsed;
        this.game.rng = seededRandom(parsed.seed + Math.floor(parsed.elapsed));
        this.game.messages = [];
        if ((parsed.layout ?? 1) < LAYOUT) this.migrateLayout();
        else {
          this.game.s.tiles = this.game.world.generateTiles();
          for (const [index, kind] of Object.entries(this.game.s.tileEdits ?? {}))
            if (+index < this.game.s.tiles.length) this.game.s.tiles[+index] = kind;
        }
      }
      this.game.s.tileEdits ??= {};
      this.game.s.drops ??= [];
      this.game.events = [];
      this.game.s.chapter ??= 0;
      this.game.s.discoveries ??= ["meadow"];
      this.game.progress.advanceChapter();
      const away = clamp((Date.now() - parsed.lastSave) / 1e3, 0, RULES.maxOfflineSeconds);
      this.game.survival.advanceDecay(away);
      this.game.s.elapsed += away;
      for (const n of this.game.s.nodes)
        if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) {
          n.hp = NODES[n.kind].hp;
          delete n.felledAt;
        }
      this.game.say("Field record reopened. " + Math.round(away) + " seconds passed.", "good");
      return true;
    }
    /**
     * Records from the narrow three-layer world keep the expedition (pack, vitals, camp, progress)
     * and move the player and camp to the same place in each wider region; the land is regrown.
     */
    migrateLayout() {
      const s = this.game.s, remap = (x) => {
        const i = clamp(Math.floor(x / OLD_REGION_WIDTH), 0, BIOME_SPANS.length - 1), span = BIOME_SPANS[i], f = clamp(x / OLD_REGION_WIDTH - i, 0, 1);
        return clamp(span.start + f * (span.end - span.start), 30, WORLD_W - 30);
      };
      s.nodes = [];
      s.animals = [];
      s.caches = [];
      if (s.altar) s.altar.activeBoss = null;
      this.game.world.generate();
      s.player.x = remap(s.player.x);
      s.player.y = this.game.groundTopAt(s.player.x) + 1;
      Object.assign(s.player, { vx: 0, vy: 0, grounded: true });
      for (const st of s.structures) {
        st.x = remap(st.x);
        st.y = this.game.groundTopAt(st.x) - 1;
      }
      s.layout = LAYOUT;
      this.game.say("The wilds have grown vast and deep since this record was written.", "good");
    }
  };

  // src/game/Game.ts
  var Game = class {
    s;
    rng;
    messages;
    /** Passing events for effects and sound; not saved. */
    events = [];
    /** Field-console switches for this session; not saved. */
    dev = newDevState();
    terrain = new Terrain(this);
    environment = new Environment(this);
    inventory = new Inventory(this);
    progress = new Progress(this);
    crafting = new Crafting(this);
    interaction = new Interaction(this);
    consumables = new Consumables(this);
    survival = new Survival(this);
    physics = new Physics(this);
    wildlife = new Wildlife(this);
    effergy = new Effergy(this);
    drops = new Drops(this);
    devtools = new Dev(this);
    world = new WorldGenerator(this);
    saves = new SaveSystem(this);
    constructor(seed = RULES.defaultSeed) {
      this.newGame(seed);
    }
    /** Starts a fresh expedition from a seed. */
    newGame(seed = RULES.defaultSeed) {
      this.rng = seededRandom(seed);
      this.s = {
        version: 3,
        layout: 3,
        seed,
        elapsed: 0,
        day: 1,
        weather: "clear",
        weatherNext: 170,
        player: {
          x: RULES.spawnX,
          y: 0,
          vx: 0,
          vy: 0,
          grounded: true,
          face: 0,
          moving: false,
          weapon: "fists",
          cloak: false,
          coat: false,
          boots: false,
          attackAt: 0,
          invuln: 0
        },
        vitals: {
          health: 100,
          hydration: 68,
          calories: 70,
          protein: 65,
          stamina: 100,
          fatigue: 12,
          bodyTemp: 37,
          wetness: 0,
          illness: 0,
          infection: 0,
          hygiene: 80,
          morale: 73
        },
        disease: null,
        inventory: [],
        nodes: [],
        animals: [],
        structures: [],
        caches: [],
        tiles: [],
        tileEdits: {},
        drops: [],
        effects: [],
        tutorial: { step: 0, tally: {} },
        chapter: 0,
        discoveries: ["meadow"],
        altar: { level: 1, xp: 0, attuned: null, kills: 0, activeBoss: null },
        placing: null,
        dead: false,
        lastSave: Date.now()
      };
      this.messages = [];
      this.events = [];
      this.world.generate();
      this.s.player.y = this.groundTopAt(RULES.spawnX) + 1;
      this.say("Field record I \xB7 Stranded in the meadow. Find wood, stone, and fiber.");
      return this;
    }
    /** Advances the whole simulation by one frame. */
    tick(dt) {
      if (this.s.dead) return;
      dt = clamp(dt, 0, RULES.maxTickSeconds);
      this.environment.advance(dt);
      this.survival.advanceDecay(dt);
      this.progress.discover();
      this.environment.collectRain(dt);
      this.s.player.invuln = Math.max(0, this.s.player.invuln - dt);
      for (const a of this.s.animals) this.wildlife.step(a, dt);
      this.drops.step(dt);
      this.survival.update(dt);
      this.devtools.sustain();
    }
    event(type, x, y, kind, dir, v) {
      this.events.push({ type, x, y, kind, dir, v });
      if (this.events.length > 64) this.events.shift();
    }
    /** A sound effect at a place in the world (the player's position by default). */
    sound(name, x = this.s.player.x, y = this.s.player.y - 20, v = 1) {
      this.event("sfx", x, y, name, void 0, v);
    }
    /** Hands over and clears the events since the last call. */
    takeEvents() {
      const out = this.events;
      this.events = [];
      return out;
    }
    say(message2, tone2 = "ink") {
      this.messages.unshift({ message: message2, tone: tone2, at: this.s.elapsed });
      this.messages.length = Math.min(this.messages.length, 8);
    }
    // ─── Place and surroundings ───────────────────────────────────────────────
    biome(x = this.s.player.x, y = this.s.player.y) {
      return biomeAt(x, y);
    }
    layer(x = this.s.player.x, y = this.s.player.y) {
      return layerAt(x, y);
    }
    inLava() {
      const p = this.s.player;
      return lavaAt(p.x, p.y - 8);
    }
    near(type, radius = 110) {
      return this.s.structures.find((st) => st.type === type && dist(st, this.s.player) <= radius);
    }
    nearLitFire() {
      const f = this.near("campfire", 155);
      return f && f.fuel > 0 ? f : null;
    }
    sheltered() {
      return !!this.near("shelter", 130);
    }
    cooled() {
      const ice = this.near("icebox", 135);
      return !!(ice && ice.fuel > 0);
    }
    timeOfDay() {
      return this.environment.timeOfDay();
    }
    isNight() {
      return this.environment.isNight();
    }
    temperature() {
      return this.environment.temperature();
    }
    // ─── Terrain and movement ─────────────────────────────────────────────────
    tileAt(tx, ty) {
      return this.terrain.tileAt(tx, ty);
    }
    groundTopAt(x) {
      return this.terrain.groundTopAt(x);
    }
    floorNear(x, y) {
      return this.terrain.floorNear(x, y);
    }
    setTile(tx, ty, kind) {
      this.terrain.setTile(tx, ty, kind);
    }
    mineTileAt(x, y) {
      return this.terrain.mineTileAt(x, y);
    }
    jump() {
      return this.physics.jump();
    }
    move(dx, dy, dt) {
      this.physics.move(dx, dy, dt);
    }
    // ─── Pack ─────────────────────────────────────────────────────────────────
    count(id) {
      return this.inventory.count(id);
    }
    itemState(entry) {
      return this.inventory.itemState(entry);
    }
    add(id, qty = 1, options = {}) {
      this.inventory.add(id, qty, options);
    }
    remove(id, qty = 1) {
      return this.inventory.remove(id, qty);
    }
    canAfford(cost) {
      return this.inventory.canAfford(cost);
    }
    toolTier(kind) {
      return this.inventory.toolTier(kind);
    }
    use(id) {
      return this.consumables.use(id);
    }
    // ─── Making and using things ──────────────────────────────────────────────
    /** Whether a recipe can be made right now (station, fuel, and materials, or a console unlock). */
    canCraft(id) {
      return this.crafting.check(id) === null;
    }
    /** Runs a field-console command and returns the lines to print. */
    command(line5) {
      return this.devtools.run(line5);
    }
    craft(id) {
      return this.crafting.craft(id);
    }
    place(id, x, y) {
      return this.crafting.place(id, x, y);
    }
    nearestInteractable(radius) {
      return this.interaction.nearestInteractable(radius);
    }
    interact() {
      return this.interaction.interact();
    }
    gather(node) {
      return this.interaction.gather(node);
    }
    fish() {
      return this.interaction.fish();
    }
    plant(st, crop) {
      return this.interaction.plant(st, crop);
    }
    storeInChest(chest, id) {
      return this.interaction.storeInChest(chest, id);
    }
    takeFromChest(chest, id) {
      return this.interaction.takeFromChest(chest, id);
    }
    // ─── Body ─────────────────────────────────────────────────────────────────
    wash() {
      return this.survival.wash();
    }
    contract(disease) {
      this.survival.contract(disease);
    }
    vitalReasons() {
      return this.survival.vitalReasons();
    }
    recover() {
      this.survival.recover();
    }
    // ─── Hunting and the Effergy ──────────────────────────────────────────────
    attack() {
      return this.wildlife.attack();
    }
    attune(mob) {
      return this.effergy.attune(mob);
    }
    upgradeAltar() {
      return this.effergy.upgradeAltar();
    }
    // ─── Field record ─────────────────────────────────────────────────────────
    save(storage, silent) {
      return this.saves.save(storage, silent);
    }
    load(storage) {
      return this.saves.load(storage);
    }
  };

  // src/renderer/graphics.ts
  var T = TILE;
  var TAU = Math.PI * 2;
  var H = (x, y, s = 0) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + s * 71.7) * 43758.5453;
    return n - Math.floor(n);
  };
  var clamp2 = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  var lerp = (a, b, t) => a + (b - a) * t;
  var smooth = (a, b, v) => {
    const t = clamp2((v - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  var vnoise = (x, s = 0) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return H(i, s, 3) * (1 - u) + H(i + 1, s, 3) * u;
  };
  var fbm = (x, s = 0) => vnoise(x, s) * 0.55 + vnoise(x * 2.13, s + 1) * 0.3 + vnoise(x * 4.37, s + 2) * 0.15;
  var rgbOf = /* @__PURE__ */ new Map();
  function rgb(hex) {
    let v = rgbOf.get(hex);
    if (!v) {
      if (rgbOf.size > 5e3) rgbOf.clear();
      const n = parseInt(hex.slice(1, 7), 16);
      v = [n >> 16 & 255, n >> 8 & 255, n & 255];
      rgbOf.set(hex, v);
    }
    return v;
  }
  function mix(a, b, t) {
    const p = rgb(a), q = rgb(b), k = clamp2(t);
    const r = Math.round(lerp(p[0], q[0], k)), g = Math.round(lerp(p[1], q[1], k)), bl = Math.round(lerp(p[2], q[2], k));
    return "#" + (1 << 24 | r << 16 | g << 8 | bl).toString(16).slice(1);
  }
  var rgba = (hex, a) => {
    const [r, g, b] = rgb(hex);
    return `rgba(${r},${g},${b},${clamp2(a)})`;
  };
  var shade = (hex, amt) => mix(hex, amt > 0 ? "#ffffff" : "#000000", Math.abs(amt));
  var INK = "rgba(36,29,24,0.78)";
  function polyPath(c, pts) {
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath();
  }
  function fillPoly(c, pts, fill, stroke = "", width = 1.5) {
    polyPath(c, pts);
    c.fillStyle = fill;
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = width;
      c.lineJoin = "round";
      c.stroke();
    }
  }
  function ellipse(c, x, y, rx, ry, fill = "", stroke = "", width = 1.5, rot = 0) {
    c.beginPath();
    c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU);
    if (fill) {
      c.fillStyle = fill;
      c.fill();
    }
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = width;
      c.stroke();
    }
  }
  function line(c, x1, y1, x2, y2, color, w = 1) {
    c.strokeStyle = color;
    c.lineWidth = w;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }
  function curve(c, x1, y1, cx, cy, x2, y2, color, w = 1) {
    c.strokeStyle = color;
    c.lineWidth = w;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(x1, y1);
    c.quadraticCurveTo(cx, cy, x2, y2);
    c.stroke();
  }
  function smoothPath(c, pts) {
    const n = pts.length;
    const mid = (i) => [
      (pts[i % n][0] + pts[(i + 1) % n][0]) / 2,
      (pts[i % n][1] + pts[(i + 1) % n][1]) / 2
    ];
    c.beginPath();
    const m = mid(n - 1);
    c.moveTo(m[0], m[1]);
    for (let i = 0; i < n; i++) {
      const q = mid(i);
      c.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]);
    }
    c.closePath();
  }
  function blobPath(c, x, y, rx, ry, seed, j = 0.16) {
    const pts = [];
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * TAU, r = 1 + (H(i, seed, 5) - 0.5) * j * 2;
      pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]);
    }
    smoothPath(c, pts);
  }
  function inked(c, shapes, fill, lw = 3) {
    c.lineJoin = "round";
    c.strokeStyle = INK;
    c.lineWidth = lw;
    for (const s of shapes) {
      s();
      c.stroke();
    }
    c.fillStyle = fill;
    for (const s of shapes) {
      s();
      c.fill();
    }
  }
  function glow(c, x, y, r, color, a) {
    if (a <= 3e-3 || r <= 0) return;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a));
    g.addColorStop(1, rgba(color, 0));
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function limb(c, hx, hy, fx, fy, bend, w1, w2, color, outline = true) {
    const mx = (hx + fx) / 2 + bend, my = (hy + fy) / 2;
    c.lineCap = "round";
    c.lineJoin = "round";
    for (const pass of outline ? [0, 1] : [1]) {
      c.strokeStyle = pass ? color : INK;
      const extra = pass ? 0 : 2.4;
      c.lineWidth = w1 + extra;
      c.beginPath();
      c.moveTo(hx, hy);
      c.lineTo(mx, my);
      c.stroke();
      c.lineWidth = w2 + extra;
      c.beginPath();
      c.moveTo(mx, my);
      c.lineTo(fx, fy);
      c.stroke();
    }
  }

  // src/renderer/palette.ts
  var ART = {
    coast: {
      sky: ["#9fc2cc", "#f0e7cf"],
      hills: ["#9dbcbf", "#86a9a7", "#6d918a", "#56766c"],
      skyline: "sea",
      trees: "pine",
      leaves: ["#3e5f4d", "#56785b", "#789770"],
      bark: "#6e5540",
      grass: ["#6f8c56", "#8ca868", "#aac27e"],
      cap: "grass",
      flowers: ["#f2efe2", "#e7c56a"]
    },
    marsh: {
      sky: ["#adbca8", "#e7e0c3"],
      hills: ["#a7b39c", "#8d9d82", "#728668", "#5a6e52"],
      skyline: "rolling",
      trees: "willow",
      leaves: ["#4f6a3b", "#6b8549", "#91a862"],
      bark: "#5d4a36",
      grass: ["#5f7a4b", "#7a955a", "#9bb070"],
      cap: "grass",
      flowers: ["#d9d3ea", "#f1e8c8"]
    },
    forest: {
      sky: ["#a9c3b3", "#ece3c6"],
      hills: ["#9fb4a0", "#7d987f", "#5d7a62", "#46624d"],
      skyline: "rolling",
      trees: "broadleaf",
      leaves: ["#365a3c", "#4f7645", "#73965a"],
      bark: "#5a4230",
      grass: ["#557a45", "#6e9454", "#8fb26a"],
      cap: "grass",
      flowers: ["#f0ead6", "#c9a3c9"]
    },
    meadow: {
      sky: ["#b5d0d3", "#f2e6c5"],
      hills: ["#b7c4a3", "#9cb286", "#7e9b6b", "#657f55"],
      skyline: "rolling",
      trees: "broadleaf",
      leaves: ["#4a7043", "#648e4d", "#8cb163"],
      bark: "#6b5039",
      grass: ["#6f9450", "#8cb061", "#abc97b"],
      cap: "grass",
      flowers: ["#f4f0e0", "#f0cf5e", "#c58fc0", "#e0816a"]
    },
    taiga: {
      sky: ["#a9bec4", "#e5e3d4"],
      hills: ["#a3b5b3", "#83999a", "#627c79", "#4a625f"],
      skyline: "rolling",
      trees: "conifer",
      leaves: ["#2c4d43", "#3d6656", "#5a8470"],
      bark: "#57402f",
      grass: ["#566f52", "#6d8864", "#8aa27c"],
      cap: "grass",
      flowers: ["#eae7dc"]
    },
    tundra: {
      sky: ["#bccdd8", "#eeeee6"],
      hills: ["#d0dadd", "#b4c3c9", "#98abb3", "#7f949d"],
      skyline: "peaks",
      trees: "conifer",
      leaves: ["#3a5850", "#4c6e62", "#6b8d7e"],
      bark: "#57402f",
      grass: ["#c9d6d8", "#e4ecec", "#f7faf8"],
      cap: "snow",
      flowers: [],
      snowy: true
    },
    alpine: {
      sky: ["#a2bcd0", "#ebe9e1"],
      hills: ["#c3ced6", "#9eafba", "#7d909c", "#63747f"],
      skyline: "peaks",
      trees: "conifer",
      leaves: ["#32534a", "#456d5d", "#628a74"],
      bark: "#57402f",
      grass: ["#6f8466", "#889c7a", "#a6b690"],
      cap: "alpine",
      flowers: ["#eef0f4", "#9fb3dd"],
      snowy: true
    },
    desert: {
      sky: ["#d6cba8", "#f6e6c3"],
      hills: ["#e6d3a8", "#d8bb8a", "#c4a171", "#ab8559"],
      skyline: "dunes",
      trees: "",
      leaves: ["#6f7a4c", "#8a9459", "#a8ad6d"],
      bark: "#7a6149",
      grass: ["#b89a64", "#cdb07b", "#e0c895"],
      cap: "sand",
      flowers: []
    },
    badlands: {
      sky: ["#d5bca5", "#f2dcc0"],
      hills: ["#d6b39b", "#c09078", "#a4705a", "#855544"],
      skyline: "mesa",
      trees: "",
      leaves: ["#6f6a45", "#86804f", "#a19a63"],
      bark: "#6a4f3c",
      grass: ["#a06a4f", "#b98262", "#cf9f7d"],
      cap: "dust",
      flowers: []
    }
  };
  function blendAt(x) {
    const [a, b, t] = data_exports.biomeBlend(x);
    return [ART[a], ART[b], t];
  }
  var artAt = (x, y) => ART[data_exports.biomeAt(x, y).id];
  function daylight(t) {
    if (t < 330 || t > 1170) return 0;
    if (t < 480) return smooth(330, 480, t);
    if (t > 1020) return 1 - smooth(1020, 1170, t);
    return 1;
  }
  var duskiness = (t) => Math.max(0, 1 - Math.abs(t - 405) / 85) + Math.max(0, 1 - Math.abs(t - 1110) / 85);
  var overcastOf = (g) => g.s.weather === "storm" ? 1 : g.s.weather === "rain" ? 0.75 : g.s.weather === "cloudy" ? 0.35 : 0;

  // src/renderer/sky.ts
  function skylineHeight(style, wx, layer) {
    const s = layer * 7.3;
    if (style === "peaks") {
      const r = 1 - Math.abs(2 * fbm(wx / 210 + s, 11) - 1);
      return Math.pow(r, 1.6) * (170 - layer * 28) + fbm(wx / 60, 3) * 12;
    }
    if (style === "dunes")
      return (0.5 + 0.5 * Math.sin(wx / 170 + fbm(wx / 380 + s, 4) * 4)) * (48 - layer * 6) + 6;
    if (style === "mesa") {
      const v = fbm(wx / 240 + s, 7);
      return smooth(0.44, 0.5, v) * (120 - layer * 18) + fbm(wx / 40, 9) * 7 + 8;
    }
    if (style === "sea") return layer < 2 ? 2 + layer * 3 : fbm(wx / 260 + s, 5) * 60;
    return fbm(wx / 280 + s, 2) * (95 - layer * 12) + 10;
  }
  function skylineTree(c, kind, x, y, size) {
    if (kind === "conifer") {
      polyPath(c, [
        [x - size * 0.32, y + 2],
        [x - size * 0.2, y - size * 0.35],
        [x - size * 0.26, y - size * 0.35],
        [x, y - size],
        [x + size * 0.26, y - size * 0.35],
        [x + size * 0.2, y - size * 0.35],
        [x + size * 0.32, y + 2]
      ]);
      c.fill();
    } else if (kind === "pine") {
      c.fillRect(x - 1.2, y - size * 0.8, 2.4, size * 0.8 + 2);
      ellipse(c, x + size * 0.1, y - size * 0.82, size * 0.42, size * 0.16, c.fillStyle);
    } else if (kind) {
      c.fillRect(x - 1.5, y - size * 0.5, 3, size * 0.5 + 2);
      ellipse(c, x, y - size * 0.62, size * 0.4, size * 0.38, c.fillStyle);
    }
  }
  function drawSky(c, g, cam, w, h, fx, tod) {
    const [A, B, k] = blendAt(fx), day = daylight(tod), dusk = duskiness(tod), time = g.s.elapsed;
    const gloom = overcastOf(g) * day;
    const top = mix(
      mix(mix("#0f1a26", mix(A.sky[0], B.sky[0], k), day), "#8f7f98", dusk * 0.3),
      "#737d80",
      gloom * 0.55
    );
    const bottom = mix(
      mix(mix("#2d3d47", mix(A.sky[1], B.sky[1], k), day), "#f2b184", dusk * 0.55),
      "#a4aba6",
      gloom * 0.5
    );
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, top);
    grad.addColorStop(0.72, bottom);
    grad.addColorStop(1, bottom);
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);
    const night2 = 1 - day;
    if (night2 > 0.02)
      for (let i = 0; i < 110; i++) {
        const sx = H(i, 1) * w, sy = H(i, 9) * h * 0.62, tw = 0.55 + 0.45 * Math.sin(time * (1 + H(i, 2) * 2) + i);
        const r = 0.5 + H(i, 4) * 1.3;
        c.fillStyle = rgba("#f4eed8", night2 * tw * (0.35 + H(i, 5) * 0.65));
        c.fillRect(sx - r / 2, sy - r / 2, r, r);
      }
    const solar = (tod - 360) / 780;
    if (solar > -0.08 && solar < 1.08) {
      const sx = w * (0.1 + solar * 0.8), sy = h * (0.62 - Math.sin(clamp2(solar) * Math.PI) * 0.46);
      glow(c, sx, sy, 190, dusk > 0.2 ? "#f5b877" : "#fbf0cf", 0.35 + dusk * 0.25);
      ellipse(c, sx, sy, 30, 30, dusk > 0.2 ? mix("#f7e3b0", "#f19a64", dusk) : "#f8ecc8");
    }
    const lunar = (tod + 1440 - 1110) % 1440 / 690;
    if (lunar > -0.05 && lunar < 1.05 && night2 > 0.05) {
      const mx = w * (0.12 + lunar * 0.76), my = h * (0.5 - Math.sin(clamp2(lunar) * Math.PI) * 0.36);
      glow(c, mx, my, 110, "#dfe6e8", 0.16 * night2);
      c.save();
      c.globalAlpha = clamp2(night2 * 1.3);
      ellipse(c, mx, my, 22, 22, "#ece6cf");
      c.beginPath();
      c.arc(mx, my, 22, 0, TAU);
      c.clip();
      ellipse(c, mx + 9, my - 5, 21, 21, "rgba(24,36,48,0.82)");
      ellipse(c, mx - 7, my + 4, 3.5, 3, "rgba(160,150,125,0.35)");
      ellipse(c, mx - 12, my - 7, 2.5, 2, "rgba(160,150,125,0.3)");
      c.restore();
    }
    drawClouds(c, g, cam, w, h, day, dusk, 0);
    const surfY = data_exports.surfaceAt(fx) - cam.y;
    const depthOf = [0.04, 0.1, 0.18, 0.28], rise = [215, 160, 105, 62], haze = [0.58, 0.4, 0.24, 0.1];
    for (let layer = 0; layer < 4; layer++) {
      const d = depthOf[layer], base = surfY - rise[layer] + (cam.y - (data_exports.surfaceAt(fx) - h * 0.6)) * d * 0.4;
      if (base > h + 40) continue;
      let col = mix(mix(A.hills[layer], B.hills[layer], k), bottom, haze[layer]);
      col = mix(col, "#172431", night2 * (0.72 - layer * 0.06));
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(-10, h + 5);
      const shift = cam.x * d + layer * 1e3, ridge = (wx) => base - lerp(skylineHeight(A.skyline, wx, layer), skylineHeight(B.skyline, wx, layer), k);
      for (let sx = -16; sx <= w + 16; sx += 8) c.lineTo(sx, ridge(sx + shift));
      c.lineTo(w + 10, h + 5);
      c.closePath();
      c.fill();
      if (layer >= 1 && base < h)
        for (let slot = Math.floor((shift - 16) / 24); slot * 24 - shift <= w + 16; slot++) {
          const wx = slot * 24, kind = H(slot, layer, 8) < k ? B.trees : A.trees;
          if (!kind || vnoise(wx / 150, layer + 20) < 0.42) continue;
          const size = (14 + H(slot, layer, 9) * 16) * (0.7 + layer * 0.25), tx = wx + (H(slot, 3) - 0.5) * 10;
          skylineTree(c, kind, tx - shift, ridge(tx) + 2, size);
        }
      c.fillRect(-10, base + 40, w + 20, h);
    }
  }
  function drawClouds(c, g, cam, w, h, day, dusk, pass) {
    const weather = g.s.weather, overcast = weather === "rain" || weather === "storm" ? 1 : weather === "cloudy" ? 0.6 : 0;
    const count = 4 + Math.round(overcast * 8);
    const light = mix(
      mix("#3d4b56", "#fbf7ec", day),
      "#8d9597",
      overcast * (weather === "storm" ? 0.7 : 0.45)
    );
    const under = mix(mix("#2a3640", "#d8d7cf", day), "#6b7477", overcast * 0.6);
    const tint = mix(light, "#f3c4a0", dusk * 0.5);
    for (let i = pass; i < count; i += 1) {
      const span = w + 520, speed = 3 + H(i, 3) * 5, sx = ((H(i, 11) * 3e3 - cam.x * (0.03 + H(i, 7) * 0.03) + g.s.elapsed * speed) % span + span) % span - 260, sy = 50 + H(i, 12) * h * 0.26, size = 36 + H(i, 13) * 46 + overcast * 22;
      const grad = c.createLinearGradient(0, sy - size * 0.8, 0, sy + size * 0.3);
      grad.addColorStop(0, rgba(tint, 0.92));
      grad.addColorStop(1, rgba(under, 0.9));
      c.save();
      c.beginPath();
      c.rect(sx - size * 2.2, sy - size * 1.2, size * 4.4, size * 1.45);
      c.clip();
      c.fillStyle = grad;
      c.beginPath();
      const puffs = 5;
      for (let p = 0; p < puffs; p++) {
        const px = sx + (p - (puffs - 1) / 2) * size * 0.62, r = size * (0.42 + H(i, p, 14) * 0.3) * (1 - Math.abs(p - 2) * 0.14);
        c.moveTo(px + r, sy - r * 0.35);
        c.arc(px, sy - r * 0.35, r, 0, TAU);
      }
      c.fill();
      c.restore();
    }
  }

  // src/renderer/terrain.ts
  var CH = 16;
  var CPX = CH * T;
  var PAD = 30;
  var MAX_CHUNKS = 36;
  var chunks = /* @__PURE__ */ new Map();
  var chunkScale = 0;
  var chunkTiles = null;
  var BASE = {
    1: "#76604a",
    2: "#5c6166",
    3: "#c9ad7f",
    4: "#5c6656",
    5: "#b7ccd2",
    6: "#9a5f4a",
    7: "#2f2a35",
    8: "#4b566a",
    9: "#6e4038",
    10: "#5c2230"
  };
  function chunkSig(g, cx, cy) {
    let s = 17;
    for (let ty = cy * CH - 1; ty <= cy * CH + CH; ty++)
      for (let tx = cx * CH - 1; tx <= cx * CH + CH; tx++)
        s = Math.imul(s, 31) + g.tileAt(tx, ty) + 1 | 0;
    return s;
  }
  var isBack = (g, tx, ty) => !g.tileAt(tx, ty) && (ty + 0.5) * T > data_exports.surfaceAt((tx + 0.5) * T);
  var lookOf = (g, tx, ty) => {
    const k = g.tileAt(tx, ty);
    return k === 6 && ty * T > data_exports.surfaceAt((tx + 0.5) * T) + 200 ? 7 : k;
  };
  function newCanvas(px, scale) {
    const cv = document.createElement("canvas");
    cv.width = Math.ceil(px * scale);
    cv.height = Math.ceil(px * scale);
    return cv;
  }
  function renderBack(g, cx, cy, scale) {
    const x0 = cx * CH, y0 = cy * CH;
    let any = false;
    for (let ty = y0; ty < y0 + CH && !any; ty++)
      for (let tx = x0; tx < x0 + CH; tx++)
        if (isBack(g, tx, ty)) {
          any = true;
          break;
        }
    if (!any) return null;
    const cv = newCanvas(CPX, scale), k = cv.getContext("2d");
    k.setTransform(scale, 0, 0, scale, -x0 * T * scale, -y0 * T * scale);
    for (let ty = y0; ty < y0 + CH; ty++)
      for (let tx = x0; tx < x0 + CH; tx++) {
        if (!isBack(g, tx, ty)) continue;
        const x = tx * T, y = ty * T, depth = y - data_exports.surfaceAt(x + T / 2), biome = data_exports.biomeAt(x, y).id;
        const rock = biome === "badlands" ? "#2a222a" : biome === "tundra" || biome === "alpine" ? "#27313a" : "#242a30";
        const earth = biome === "desert" ? "#4a3b2b" : biome === "badlands" ? "#4a3029" : "#3b3028";
        const deep = mix(
          mix(rock, "#1b2130", smooth(data_exports.LAYERS[2].top - 150, data_exports.LAYERS[2].top + 150, y)),
          mix("#1f0f0d", "#140507", smooth(data_exports.LAYERS[4].top - 150, data_exports.LAYERS[4].top + 150, y)),
          smooth(data_exports.LAYERS[3].top - 150, data_exports.LAYERS[3].top + 150, y)
        );
        const col = mix(earth, deep, smooth(30, 170, depth));
        k.fillStyle = col;
        k.fillRect(x, y, T + 0.6, T + 0.6);
        blobPath(k, x + 8 + H(tx, ty, 1) * 16, y + 8 + H(tx, ty, 2) * 16, 9, 6, tx * 7 + ty, 0.3);
        k.fillStyle = shade(col, 0.045);
        k.fill();
        if (H(tx, ty, 3) < 0.4) {
          line(
            k,
            x + H(tx, ty, 4) * T,
            y + H(tx, ty, 5) * T,
            x + H(tx, ty, 6) * T,
            y + H(tx, ty, 7) * T,
            shade(col, -0.2),
            1
          );
        }
        const sh = (x1, y1, x2, y2, rx, ry) => {
          const gr = k.createLinearGradient(x1, y1, x2, y2);
          gr.addColorStop(0, "rgba(6,8,10,0.55)");
          gr.addColorStop(1, "rgba(6,8,10,0)");
          k.fillStyle = gr;
          k.fillRect(rx, ry, Math.abs(x2 - x1) || T, Math.abs(y2 - y1) || T);
        };
        if (g.tileAt(tx, ty - 1)) sh(x, y, x, y + 18, x, y);
        if (g.tileAt(tx - 1, ty)) sh(x, y, x + 12, y, x, y);
        if (g.tileAt(tx + 1, ty)) {
          const gr = k.createLinearGradient(x + T, y, x + T - 12, y);
          gr.addColorStop(0, "rgba(6,8,10,0.45)");
          gr.addColorStop(1, "rgba(6,8,10,0)");
          k.fillStyle = gr;
          k.fillRect(x + T - 12, y, 12, T);
        }
      }
    return cv;
  }
  function renderFront(g, cx, cy, scale) {
    const x0 = cx * CH, y0 = cy * CH;
    let any = false;
    for (let ty = y0; ty < y0 + CH && !any; ty++)
      for (let tx = x0; tx < x0 + CH; tx++)
        if (g.tileAt(tx, ty)) {
          any = true;
          break;
        }
    if (!any) return null;
    const cv = newCanvas(CPX + PAD * 2, scale), k = cv.getContext("2d");
    k.setTransform(scale, 0, 0, scale, (PAD - x0 * T) * scale, (PAD - y0 * T) * scale);
    const solid = (tx, ty) => g.tileAt(tx, ty) !== 0;
    const R = 7, paths = /* @__PURE__ */ new Map(), all = new Path2D();
    const corners = [];
    for (let ty = y0; ty < y0 + CH; ty++)
      for (let tx = x0; tx < x0 + CH; tx++) {
        if (!solid(tx, ty)) continue;
        const look = lookOf(g, tx, ty), x = tx * T, y = ty * T;
        const up = !solid(tx, ty - 1), dn = !solid(tx, ty + 1), lf = !solid(tx - 1, ty), rt = !solid(tx + 1, ty);
        const ox = lf ? 0 : 0.7, oy = up ? 0 : 0.7, ow = ox + (rt ? 0 : 0.7), oh = oy + (dn ? 0 : 0.7);
        const radii = [up && lf ? R : 0, up && rt ? R : 0, dn && rt ? R : 0, dn && lf ? R : 0];
        let p = paths.get(look);
        if (!p) paths.set(look, p = new Path2D());
        for (const target of [p, all])
          if (radii.some(Boolean)) target.roundRect(x - ox, y - oy, T + ow, T + oh, radii);
          else target.rect(x - ox, y - oy, T + ow, T + oh);
        if (radii[0]) corners.push({ x: x + R, y: y + R, a: Math.PI });
        if (radii[1]) corners.push({ x: x + T - R, y: y + R, a: -Math.PI / 2 });
        if (radii[2]) corners.push({ x: x + T - R, y: y + T - R, a: 0 });
        if (radii[3]) corners.push({ x: x + R, y: y + T - R, a: Math.PI / 2 });
      }
    for (const [look, p] of paths) {
      const base = BASE[look];
      k.fillStyle = base;
      k.fill(p);
      k.save();
      k.clip(p);
      textureMaterial(k, g, look, base, x0, y0);
      k.restore();
    }
    k.save();
    k.clip(all);
    for (let tx = x0; tx < x0 + CH; tx++) {
      const surf = data_exports.surfaceAt((tx + 0.5) * T);
      const gr = k.createLinearGradient(0, surf + 20, 0, surf + 900);
      gr.addColorStop(0, "rgba(14,18,24,0)");
      gr.addColorStop(1, "rgba(14,18,24,0.5)");
      k.fillStyle = gr;
      k.fillRect(tx * T - 1, y0 * T - 2, T + 2, CPX + 4);
    }
    for (let ty = y0; ty < y0 + CH; ty++)
      for (let tx = x0; tx < x0 + CH; tx++) {
        if (!solid(tx, ty)) continue;
        const x = tx * T, y = ty * T, base = BASE[lookOf(g, tx, ty)];
        const up = !solid(tx, ty - 1), dn = !solid(tx, ty + 1), lf = !solid(tx - 1, ty), rt = !solid(tx + 1, ty);
        if (up) {
          k.fillStyle = rgba(shade(base, 0.22), 0.8);
          k.fillRect(x, y + 1.5, T, 3);
        }
        if (dn) {
          const gr = k.createLinearGradient(0, y + T, 0, y + T - 10);
          gr.addColorStop(0, "rgba(10,10,12,0.45)");
          gr.addColorStop(1, "rgba(10,10,12,0)");
          k.fillStyle = gr;
          k.fillRect(x, y + T - 10, T, 10);
        }
        for (const [side, sx] of [
          [lf, x],
          [rt, x + T]
        ]) {
          if (!side) continue;
          const gr = k.createLinearGradient(sx, 0, sx === x ? x + 8 : x + T - 8, 0);
          gr.addColorStop(0, "rgba(10,10,12,0.3)");
          gr.addColorStop(1, "rgba(10,10,12,0)");
          k.fillStyle = gr;
          k.fillRect(sx === x ? x : x + T - 8, y, 8, T);
        }
        k.fillStyle = INK;
        if (up) k.fillRect(x, y, T, 1.6);
        if (dn) k.fillRect(x, y + T - 1.6, T, 1.6);
        if (lf) k.fillRect(x, y, 1.6, T);
        if (rt) k.fillRect(x + T - 1.6, y, 1.6, T);
      }
    k.strokeStyle = INK;
    k.lineWidth = 3.2;
    for (const cr of corners) {
      k.beginPath();
      k.arc(cr.x, cr.y, R, cr.a, cr.a + Math.PI / 2);
      k.stroke();
    }
    k.restore();
    for (let ty = y0; ty < y0 + CH; ty++)
      for (let tx = x0; tx < x0 + CH; tx++) {
        if (!solid(tx, ty)) continue;
        const x = tx * T, y = ty * T;
        if (!solid(tx, ty - 1)) {
          if (isBack(g, tx, ty - 1)) caveFloor(k, g, tx, ty, x, y);
          else surfaceCap(k, g, tx, ty, x, y, !solid(tx - 1, ty), !solid(tx + 1, ty));
        }
        if (!solid(tx, ty + 1) && isBack(g, tx, ty + 1)) caveCeiling(k, g, tx, ty, x, y);
      }
    return cv;
  }
  function textureMaterial(k, g, look, base, x0, y0) {
    const left = x0 * T, top = y0 * T;
    if (look === 2 || look === 6 || look === 5 || look === 7 || look >= 8) {
      const gap = look === 6 ? 11 : look === 5 ? 15 : look === 10 ? 17 : look === 9 ? 13 : 23;
      for (let yy = top - gap; yy < top + CPX + gap; yy += gap) {
        k.beginPath();
        for (let xx = left - 8; xx <= left + CPX + 8; xx += 16) {
          const oy = (fbm(xx / 170 + yy * 0.013, look) - 0.5) * gap * 1.4;
          if (xx === left - 8) k.moveTo(xx, yy + oy);
          else k.lineTo(xx, yy + oy);
        }
        if (look === 6) {
          const band = Math.floor(yy / gap);
          k.lineTo(left + CPX + 8, yy + gap * 2);
          k.lineTo(left - 8, yy + gap * 2);
          k.closePath();
          k.fillStyle = ["#a8694f", "#8a5241", "#b67c5d", "#94583f"][(band % 4 + 4) % 4];
          k.fill();
        } else {
          k.strokeStyle = rgba(shade(base, look === 5 ? 0.25 : -0.16), 0.55);
          k.lineWidth = look === 5 ? 1.4 : 1.1;
          k.stroke();
        }
      }
    }
    for (let ty = y0; ty < y0 + CH; ty++)
      for (let tx = x0; tx < x0 + CH; tx++) {
        const kind = lookOf(g, tx, ty);
        if (kind !== look) continue;
        const x = tx * T, y = ty * T, r = (i) => H(tx, ty, i);
        if (look === 1 || look === 4) {
          for (let i = 0; i < 2; i++) {
            ellipse(
              k,
              x + r(i) * T,
              y + r(i + 3) * T,
              5 + r(i + 5) * 8,
              3 + r(i + 7) * 3,
              shade(base, (r(i + 9) - 0.5) * 0.14)
            );
          }
          if (r(11) < 0.55) {
            const px = x + 4 + r(12) * 24, py = y + 6 + r(13) * 22, pr = 1.8 + r(14) * 2.4;
            ellipse(k, px, py, pr * 1.3, pr, look === 4 ? "#7d8672" : "#9a8a70");
            ellipse(k, px - 0.5, py - 0.6, pr * 0.7, pr * 0.4, "rgba(255,255,255,0.18)");
          }
          const depth = y - data_exports.surfaceAt(x + T / 2);
          if (depth < 70 && r(15) < 0.35)
            curve(
              k,
              x + r(16) * T,
              y,
              x + r(17) * T,
              y + 14,
              x + r(18) * T,
              y + 24,
              rgba("#3e2f22", 0.6),
              1.2
            );
          if (look === 4 && r(19) < 0.3) ellipse(k, x + r(20) * T, y + r(21) * T, 7, 3, "#4c5648");
        } else if (look === 2 || look === 7) {
          const n = 1 + Math.floor(r(1) * 2);
          for (let i = 0; i < n; i++) {
            const bx = x + 6 + r(i + 2) * 20, by = y + 6 + r(i + 4) * 20, rx = 5 + r(i + 6) * 7, ry = 3.5 + r(i + 8) * 4;
            blobPath(k, bx, by, rx, ry, tx * 13 + ty * 7 + i, 0.25);
            k.fillStyle = shade(base, look === 7 ? 0.06 : 0.07);
            k.fill();
            k.strokeStyle = rgba(shade(base, -0.35), 0.45);
            k.lineWidth = 1;
            k.stroke();
            curve(
              k,
              bx - rx * 0.6,
              by - ry * 0.2,
              bx - rx * 0.2,
              by - ry * 0.9,
              bx + rx * 0.4,
              by - ry * 0.7,
              rgba("#ffffff", 0.13),
              1
            );
          }
          if (r(10) < 0.22) {
            k.strokeStyle = rgba(shade(base, -0.4), 0.6);
            k.lineWidth = 1;
            k.beginPath();
            k.moveTo(x + r(11) * T, y + r(12) * 8);
            k.lineTo(x + r(13) * T, y + 10 + r(14) * 8);
            k.lineTo(x + r(15) * T, y + 20 + r(16) * 10);
            k.stroke();
          }
          if (look === 7 && r(17) < 0.3) {
            fillPoly(
              k,
              [
                [x + 10, y + 16],
                [x + 14, y + 9],
                [x + 18, y + 17]
              ],
              "#6e5a8c"
            );
          }
        } else if (look === 8) {
          blobPath(
            k,
            x + 8 + r(1) * 16,
            y + 8 + r(2) * 16,
            8 + r(3) * 5,
            5 + r(4) * 3,
            tx * 17 + ty,
            0.2
          );
          k.fillStyle = shade(base, 0.06);
          k.fill();
          k.strokeStyle = rgba(shade(base, -0.35), 0.5);
          k.lineWidth = 1;
          k.stroke();
          if (r(5) < 0.45) ellipse(k, x + r(6) * T, y + r(7) * T, 1.3, 1.3, "#b9d2e6");
          if (r(8) < 0.2) ellipse(k, x + r(9) * T, y + r(10) * T, 1.6, 1.1, "#e8f1f8");
        } else if (look === 9) {
          k.strokeStyle = rgba("#2a1512", 0.7);
          k.lineWidth = 1.1;
          k.beginPath();
          k.moveTo(x + r(1) * T, y);
          k.lineTo(x + r(2) * T, y + 14 + r(3) * 6);
          k.lineTo(x + r(4) * T, y + T);
          k.stroke();
          for (let i = 0; i < 3; i++)
            ellipse(k, x + r(i + 5) * T, y + r(i + 8) * T, 2.5, 1.6, shade(base, 0.12));
          if (r(11) < 0.35) {
            ellipse(k, x + r(12) * T, y + r(13) * T, 1.6, 1.6, "#ff8a3a");
            ellipse(k, x + r(12) * T, y + r(13) * T, 3.4, 3.4, rgba("#ff6a1a", 0.25));
          }
        } else if (look === 10) {
          if (r(1) < 0.5) {
            const vx = x + r(2) * T;
            k.strokeStyle = rgba("#ff5a1f", 0.75);
            k.lineWidth = 1.4;
            k.beginPath();
            k.moveTo(vx, y);
            k.quadraticCurveTo(vx + (r(3) - 0.5) * 20, y + 16, vx + (r(4) - 0.5) * 14, y + T);
            k.stroke();
            k.strokeStyle = rgba("#ffc46a", 0.5);
            k.lineWidth = 0.6;
            k.stroke();
          }
          blobPath(k, x + 16, y + 16, 9 + r(5) * 5, 6 + r(6) * 4, tx * 7 + ty * 3, 0.3);
          k.fillStyle = shade(base, -0.08);
          k.fill();
        } else if (look === 3) {
          for (let i = 0; i < 3; i++) {
            const yy = y + 5 + i * 10 + r(i) * 4;
            curve(
              k,
              x - 2,
              yy,
              x + T / 2,
              yy - 3 + r(i + 4) * 2,
              x + T + 2,
              yy,
              rgba(shade(base, i % 2 ? 0.16 : -0.1), 0.6),
              1.2
            );
          }
          k.fillStyle = "#a88c60";
          for (let i = 0; i < 4; i++) k.fillRect(x + r(i + 8) * T, y + r(i + 12) * T, 1.3, 1.3);
        } else if (look === 5) {
          if (r(1) < 0.35) {
            k.strokeStyle = rgba("#7fa3b1", 0.55);
            k.lineWidth = 1;
            k.beginPath();
            k.moveTo(x + r(2) * T, y + r(3) * 10);
            k.lineTo(x + r(4) * T, y + 12 + r(5) * 8);
            k.lineTo(x + r(6) * T, y + 22 + r(7) * 8);
            k.stroke();
          }
          ellipse(k, x + r(8) * T, y + r(9) * T, 6, 3, rgba("#ffffff", 0.25));
        } else if (look === 6) {
          if (r(1) < 0.3) ellipse(k, x + r(2) * T, y + r(3) * T, 3, 2, "#c69471");
          if (r(4) < 0.2) line(k, x + r(5) * T, y + r(6) * T, x + r(7) * T, y + 30, "#6f3f32", 1);
        }
      }
  }
  function grassBlade(k, bx, by, h, lean, color) {
    k.fillStyle = color;
    k.beginPath();
    k.moveTo(bx - 1.3, by);
    k.quadraticCurveTo(bx + lean * 0.3, by - h * 0.6, bx + lean, by - h);
    k.quadraticCurveTo(bx + lean * 0.3 + 1, by - h * 0.5, bx + 1.3, by);
    k.closePath();
    k.fill();
  }
  function surfaceCap(k, g, tx, ty, x, y, lf, rt) {
    const art = artAt(x + T / 2, y), r = (i) => H(tx, ty, i + 40);
    let cap = art.cap;
    if (cap === "alpine") cap = vnoise(tx / 3.3, 5) > 0.55 ? "snow" : "grass";
    const [dark, mid, light] = cap === "snow" ? ["#b9c9cf", "#e6eeee", "#fbfdfb"] : art.grass;
    const depth = cap === "snow" ? 9 : cap === "grass" ? 7 : 4;
    k.beginPath();
    k.moveTo(x - (lf ? 1.5 : 0.5), y - 1);
    k.lineTo(x + T + (rt ? 1.5 : 0.5), y - 1);
    if (rt) k.lineTo(x + T + 1.5, y + depth + 5);
    for (let i = 8; i >= 0; i--) {
      const px = x + i / 8 * T, py = y + depth + H(tx * 8 + i, ty, 44) * 3 - (i === 0 || i === 8 ? 0 : 0);
      k.lineTo(px, py);
    }
    if (lf) k.lineTo(x - 1.5, y + depth + 5);
    k.closePath();
    k.fillStyle = cap === "grass" ? mid : cap === "snow" ? mid : cap === "sand" ? "#dcc294" : "#bd8a6b";
    k.fill();
    k.strokeStyle = cap === "snow" ? "rgba(90,120,140,0.55)" : INK;
    k.lineWidth = 1.4;
    k.beginPath();
    k.moveTo(x - (lf ? 1.5 : 0), y - 1);
    k.lineTo(x + T + (rt ? 1.5 : 0), y - 1);
    k.stroke();
    k.fillStyle = cap === "grass" ? light : cap === "snow" ? light : cap === "sand" ? "#ead6ae" : "#cf9d7c";
    k.fillRect(x, y, T, 2);
    if (cap === "grass") {
      for (let i = 0; i < 8; i++) {
        const bx = x + 2 + i * 4 + (r(i) - 0.5) * 3, h = 3 + r(i + 10) * 8, lean = (r(i + 20) - 0.5) * 6;
        grassBlade(k, bx, y + 1, h, lean, [dark, mid, light][Math.floor(r(i + 30) * 3)]);
      }
      if (art.flowers.length && r(50) < 0.3) {
        const fx = x + 6 + r(51) * 20, fh = 7 + r(52) * 6;
        line(k, fx, y + 1, fx + 1, y - fh, dark, 1.1);
        const col = art.flowers[Math.floor(r(53) * art.flowers.length)];
        for (let p = 0; p < 5; p++)
          ellipse(k, fx + 1 + Math.cos(p * 1.26) * 2, y - fh + Math.sin(p * 1.26) * 2, 1.7, 1.7, col);
        ellipse(k, fx + 1, y - fh, 1.1, 1.1, "#e9b949");
      }
    } else if (cap === "snow") {
      for (let i = 0; i < 3; i++)
        ellipse(k, x + 5 + i * 11 + r(i) * 4, y - 0.5, 5 + r(i + 5) * 3, 2.4, light);
      if (r(8) < 0.25) {
        line(k, x + 8 + r(9) * 16, y, x + 6 + r(9) * 16, y - 8, "#8d8a6d", 1);
        line(k, x + 11 + r(9) * 16, y, x + 13 + r(9) * 16, y - 6, "#8d8a6d", 1);
      }
    } else if (cap === "sand") {
      if (r(1) < 0.18)
        for (let i = 0; i < 5; i++)
          line(k, x + 14, y + 1, x + 9 + i * 2.5, y - 4 - r(i) * 5, "#9c7f52", 1);
      if (r(7) < 0.3) ellipse(k, x + r(8) * T, y - 1, 2.2, 1.5, "#a58b66");
    } else {
      if (r(1) < 0.14) {
        line(k, x + 12, y + 1, x + 16, y - 9, "#5a3f30", 1.3);
        line(k, x + 15, y - 6, x + 20, y - 10, "#5a3f30", 1);
      }
      if (r(7) < 0.35) ellipse(k, x + r(8) * T, y - 0.5, 2.6, 1.8, "#8a5a47");
    }
  }
  function caveFloor(k, g, tx, ty, x, y) {
    const r = (i) => H(tx, ty, i + 60), biome = data_exports.biomeAt(x, y).id, base = BASE[lookOf(g, tx, ty)];
    k.fillStyle = rgba(shade(base, 0.28), 0.9);
    k.fillRect(x, y, T, 2);
    if (r(1) < 0.35 && ["forest", "marsh", "meadow", "coast", "taiga"].includes(biome)) {
      for (let i = 0; i < 4; i++)
        ellipse(
          k,
          x + 4 + r(i + 2) * 24,
          y + 0.5,
          3 + r(i + 6) * 3,
          1.8,
          i % 2 ? "#5f7a4e" : "#4b6440"
        );
    }
    if (r(10) < 0.16) {
      const sx = x + 6 + r(11) * 20, sh = 6 + r(12) * 10;
      fillPoly(
        k,
        [
          [sx - 4, y + 1],
          [sx - 0.5, y - sh],
          [sx + 4, y + 1]
        ],
        shade(base, 0.05),
        INK,
        1.1
      );
    } else if (r(13) < 0.3) ellipse(k, x + r(14) * T, y - 1, 2.5, 1.8, shade(base, 0.18), INK, 0.8);
  }
  function caveCeiling(k, g, tx, ty, x, y) {
    const r = (i) => H(tx, ty, i + 80), base = BASE[lookOf(g, tx, ty)], depth = y - data_exports.surfaceAt(x + T / 2);
    if (depth < 90 && lookOf(g, tx, ty) !== 3) {
      if (r(1) < 0.5)
        for (let i = 0; i < 2; i++) {
          const rx = x + 5 + r(i + 2) * 22;
          curve(k, rx, y + T, rx + 4, y + T + 8, rx - 1, y + T + 14 + r(i + 4) * 8, "#4a3828", 1.4);
        }
      return;
    }
    const n = r(6) < 0.45 ? 1 + Math.floor(r(7) * 2) : 0;
    for (let i = 0; i < n; i++) {
      const sx = x + 5 + r(i + 8) * 22, len = 7 + r(i + 10) * 15, wd = 3 + r(i + 12) * 3;
      fillPoly(
        k,
        [
          [sx - wd, y + T - 1],
          [sx + 0.5, y + T + len],
          [sx + wd, y + T - 1]
        ],
        shade(base, -0.05),
        INK,
        1.1
      );
      line(k, sx - wd * 0.5, y + T + 1, sx, y + T + len * 0.7, rgba("#ffffff", 0.15), 1);
    }
  }
  function drawTerrain(c, g, cam, w, h) {
    const ratio = c.getTransform().a || 1, scale = Math.min(ratio, 1.5);
    if (scale !== chunkScale || chunkTiles !== g.s.tiles) {
      chunks.clear();
      chunkScale = scale;
      chunkTiles = g.s.tiles;
    }
    const cx0 = Math.floor((cam.x - PAD) / CPX), cx1 = Math.floor((cam.x + w + PAD) / CPX), cy0 = Math.max(0, Math.floor((cam.y - PAD) / CPX)), cy1 = Math.floor((cam.y + h + PAD) / CPX);
    const visible = [];
    for (let cy = cy0; cy <= cy1; cy++)
      for (let cx = cx0; cx <= cx1; cx++) {
        if (cx < 0 || cx * CH >= data_exports.TILE_COLS || cy * CH >= data_exports.TILE_ROWS) continue;
        const key = cx + ":" + cy, sig = chunkSig(g, cx, cy);
        let ch = chunks.get(key);
        if (!ch || ch.sig !== sig) {
          ch = {
            back: renderBack(g, cx, cy, Math.min(scale, 1)),
            front: renderFront(g, cx, cy, scale),
            sig
          };
        }
        chunks.delete(key);
        chunks.set(key, ch);
        visible.push([ch, cx, cy]);
      }
    while (chunks.size > MAX_CHUNKS) chunks.delete(chunks.keys().next().value);
    const snap = (v) => Math.round(v * ratio) / ratio;
    for (const [ch, cx, cy] of visible)
      if (ch.back)
        c.drawImage(ch.back, snap(cx * CPX - cam.x), snap(cy * CPX - cam.y), CPX + 0.5, CPX + 0.5);
    drawLava(c, g, cam, w, h);
    for (const [ch, cx, cy] of visible)
      if (ch.front)
        c.drawImage(
          ch.front,
          snap(cx * CPX - PAD - cam.x),
          snap(cy * CPX - PAD - cam.y),
          CPX + PAD * 2,
          CPX + PAD * 2
        );
  }
  function drawLava(c, g, cam, w, h) {
    if (cam.y + h < 3400) return;
    const now = performance.now() / 1e3, tx0 = Math.floor(cam.x / T), tx1 = Math.ceil((cam.x + w) / T), ty0 = Math.max(0, Math.floor(cam.y / T)), ty1 = Math.min(data_exports.TILE_ROWS - 1, Math.ceil((cam.y + h) / T));
    const lava = (tx, ty) => !g.tileAt(tx, ty) && data_exports.lavaAt(tx * T + T / 2, ty * T + T / 2);
    for (let tx = tx0; tx <= tx1; tx++)
      for (let ty = ty0; ty <= ty1; ty++) {
        if (!lava(tx, ty)) continue;
        const x = tx * T - cam.x, y = ty * T - cam.y, top = !lava(tx, ty - 1);
        const gr = c.createLinearGradient(0, y, 0, y + T);
        gr.addColorStop(0, top ? "#ffb347" : "#f0661e");
        gr.addColorStop(1, "#c2330f");
        c.fillStyle = gr;
        c.fillRect(x, y, T + 0.5, T + 0.5);
        const drift = Math.sin(now * 0.6 + tx * 0.9 + ty * 1.7);
        ellipse(c, x + 16 + drift * 6, y + 18, 7, 3, rgba("#7a1d0c", 0.45));
        if (top) {
          c.beginPath();
          c.moveTo(x, y + 4);
          for (let i = 0; i <= 4; i++)
            c.lineTo(x + i * T / 4, y + 3 + Math.sin(now * 2.4 + (tx * 4 + i) * 0.8) * 2.5);
          c.lineTo(x + T, y + 8);
          c.lineTo(x, y + 8);
          c.closePath();
          c.fillStyle = "#ffe08a";
          c.fill();
          glow(c, x + 16, y + 2, 34, "#ff7a2a", 0.22);
        }
      }
  }
  function drawLadders(c, cam, w, h) {
    for (const shaft of data_exports.SHAFTS) {
      const sx = shaft.x - cam.x;
      if (sx < -90 || sx > w + 90) continue;
      const surface = shaft.top < data_exports.surfaceAt(shaft.x) + 20, y1 = (surface ? data_exports.surfaceAt(shaft.x) - 24 : shaft.top) - cam.y, y2 = shaft.bottom + 40 - cam.y;
      if (y2 < -40 || y1 > h + 40) continue;
      const deep = shaft.top > data_exports.LAYERS[3].top, wood = deep ? "#4a3a3a" : "#7a5d42", rung = deep ? "#6d5250" : "#a58560";
      for (const rx of [-22, 22]) {
        line(c, sx + rx, y1, sx + rx, y2, INK, 7);
        line(c, sx + rx, y1, sx + rx, y2, wood, 4.5);
        line(c, sx + rx - 1, y1, sx + rx - 1, y2, shade(wood, 0.2), 1.3);
      }
      for (let y = Math.max(y1 + 14, y1 + 14 + Math.floor((-40 - y1) / 20) * 20); y < Math.min(y2, h + 40); y += 20) {
        line(c, sx - 22, y + 2, sx + 22, y + 2, "rgba(0,0,0,0.3)", 3);
        line(c, sx - 22, y, sx + 22, y, INK, 5);
        line(c, sx - 22, y, sx + 22, y, rung, 3);
      }
      if (!surface) continue;
      line(c, sx - 30, y1 + 26, sx - 26, y1 - 30, INK, 6);
      line(c, sx + 30, y1 + 26, sx + 26, y1 - 30, INK, 6);
      line(c, sx - 30, y1 + 26, sx - 26, y1 - 30, "#6b4f37", 4);
      line(c, sx + 30, y1 + 26, sx + 26, y1 - 30, "#6b4f37", 4);
      line(c, sx - 34, y1 - 26, sx + 34, y1 - 26, INK, 6);
      line(c, sx - 34, y1 - 26, sx + 34, y1 - 26, "#7a5d42", 4);
      for (const rx of [-26, 26]) {
        line(c, sx + rx - 3, y1 - 29, sx + rx + 3, y1 - 23, "#d2bb88", 1.5);
        line(c, sx + rx - 3, y1 - 24, sx + rx + 3, y1 - 28, "#d2bb88", 1.5);
      }
      line(c, sx + 8, y1 - 26, sx + 8, y1 - 8, "#cdb383", 1.4);
      ellipse(c, sx + 8, y1 - 5, 3, 4, "#cdb383", INK, 1);
    }
  }

  // src/renderer/resources.ts
  var treeNode = (k) => k === "wood" || k === "resin" || k === "honey";
  function drawBroadleaf(c, s, seed, art, sway) {
    const th = 74 * s, [dk, md, lt] = art.leaves;
    c.beginPath();
    c.moveTo(-12 * s, 0);
    c.quadraticCurveTo(-5 * s, -5 * s, -5 * s, -28 * s);
    c.lineTo(-3.5 * s, -th);
    c.lineTo(3.5 * s, -th);
    c.lineTo(5 * s, -28 * s);
    c.quadraticCurveTo(5 * s, -5 * s, 12 * s, 0);
    c.closePath();
    c.fillStyle = art.bark;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    fillPoly(
      c,
      [
        [1 * s, -2],
        [4 * s, -th],
        [3.5 * s, -th],
        [5 * s, -28 * s],
        [10 * s, -1]
      ],
      "rgba(0,0,0,0.18)"
    );
    line(c, 0, -44 * s, -20 * s + sway * 0.4, -66 * s, INK, 5.5 * s);
    line(c, 0, -44 * s, -20 * s + sway * 0.4, -66 * s, art.bark, 3.6 * s);
    line(c, 0, -56 * s, 19 * s + sway * 0.5, -78 * s, INK, 5 * s);
    line(c, 0, -56 * s, 19 * s + sway * 0.5, -78 * s, art.bark, 3.2 * s);
    const cy = -th - 16 * s, clumps = [[sway, cy, 25 * s]];
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * TAU + H(i, seed) * 0.6, d = 19 * s * (0.7 + 0.3 * H(i, seed, 1));
      clumps.push([
        Math.cos(a) * d * 1.3 + sway * (0.8 + Math.sin(a) * -0.3),
        cy + Math.sin(a) * d * 0.78,
        (14 + H(i, seed, 2) * 7) * s
      ]);
    }
    inked(
      c,
      clumps.map(
        ([x, y, r], i) => () => blobPath(c, x, y, r, r * 0.9, seed + i, 0.14)
      ),
      dk,
      3.2
    );
    for (const [x, y, r] of clumps) {
      blobPath(c, x - 3 * s, y - 4 * s, r * 0.78, r * 0.7, seed + x, 0.16);
      c.fillStyle = md;
      c.fill();
    }
    clumps.filter(([, y]) => y < cy + 4 * s).forEach(([x, y, r], i) => {
      blobPath(c, x - 7 * s, y - 8 * s, r * 0.42, r * 0.34, seed + i * 3, 0.2);
      c.fillStyle = lt;
      c.fill();
    });
  }
  function drawConifer(c, s, seed, art, sway, snowy) {
    const [dk, md, lt] = art.leaves;
    c.fillStyle = art.bark;
    c.fillRect(-4 * s, -26 * s, 8 * s, 27 * s);
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.strokeRect(-4 * s, -26 * s, 8 * s, 27 * s);
    const tiers = 5, shapes = [];
    for (let i = 0; i < tiers; i++) {
      const bottom = -18 * s - i * 21 * s, width = (36 - i * 6) * s * (0.95 + H(i, seed) * 0.1), top = bottom - 38 * s, sw = sway * ((i + 1) / tiers);
      const pts = [[sw * 1.2, top]];
      for (let j = 0; j <= 5; j++)
        pts.push([-width + j / 5 * width * 2 + sw, bottom + (j % 2 ? -5 * s : 0)]);
      shapes.push(pts);
    }
    inked(
      c,
      shapes.map((pts) => () => polyPath(c, pts)),
      md,
      3.2
    );
    shapes.forEach((pts) => {
      const [tx, ty] = pts[0], last = pts[pts.length - 1];
      fillPoly(
        c,
        [
          [tx, ty],
          [last[0], last[1]],
          [tx + (last[0] - tx) * 0.1, last[1] - 4 * s]
        ],
        dk
      );
      line(c, tx - 1, ty + 6 * s, pts[1][0] * 0.55 + tx * 0.45, lerp(ty, pts[1][1], 0.55), lt, 2 * s);
      if (snowy) {
        c.fillStyle = "#f3f7f6";
        c.beginPath();
        c.moveTo(tx, ty - 1);
        c.lineTo(lerp(tx, pts[1][0], 0.45), lerp(ty, pts[1][1], 0.45));
        c.quadraticCurveTo(
          tx,
          lerp(ty, pts[1][1], 0.3),
          lerp(tx, last[0], 0.35),
          lerp(ty, last[1], 0.35)
        );
        c.closePath();
        c.fill();
        for (let j = 1; j < pts.length - 1; j += 2)
          ellipse(c, pts[j][0], pts[j][1] - 1.5, 4 * s, 2 * s, "#eef4f3");
      }
    });
  }
  function drawWillow(c, s, seed, art, sway, t) {
    const [dk, md, lt] = art.leaves;
    c.beginPath();
    c.moveTo(-13 * s, 0);
    c.quadraticCurveTo(-3 * s, -20 * s, -8 * s, -62 * s);
    c.lineTo(4 * s, -64 * s);
    c.quadraticCurveTo(6 * s, -20 * s, 13 * s, 0);
    c.closePath();
    c.fillStyle = art.bark;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    const cy = -80 * s;
    const clumps = [];
    for (let i = 0; i < 6; i++)
      clumps.push([(i - 2.5) * 13 * s + sway * 0.6, cy + Math.abs(i - 2.5) * 5 * s, 20 * s]);
    inked(
      c,
      clumps.map(
        ([x, y, r], i) => () => blobPath(c, x, y, r, r * 0.75, seed + i, 0.15)
      ),
      dk,
      3
    );
    for (let i = 0; i < 16; i++) {
      const sx = (i / 15 - 0.5) * 84 * s + sway * 0.6, len = (26 + H(i, seed, 3) * 30) * s, st = Math.sin(t * 1.3 + i * 0.7) * 3 + sway;
      curve(
        c,
        sx,
        cy + 6 * s,
        sx + st * 0.5,
        cy + len * 0.5,
        sx + st,
        cy + len,
        i % 3 ? md : lt,
        2.4 * s
      );
    }
    for (const [x, y, r] of clumps) {
      blobPath(c, x - 2 * s, y - 5 * s, r * 0.6, r * 0.42, seed + x, 0.2);
      c.fillStyle = md;
      c.fill();
    }
  }
  function drawPine(c, s, seed, art, sway) {
    const [dk, md, lt] = art.leaves, lean = (H(seed, 2) - 0.3) * 18 * s;
    c.beginPath();
    c.moveTo(-6 * s, 0);
    c.quadraticCurveTo(-3 * s + lean * 0.2, -60 * s, lean - 2 * s, -112 * s);
    c.lineTo(lean + 2 * s, -112 * s);
    c.quadraticCurveTo(3 * s + lean * 0.2, -60 * s, 6 * s, 0);
    c.closePath();
    c.fillStyle = art.bark;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.stroke();
    line(c, lean * 0.6, -80 * s, lean * 0.6 + 22 * s, -96 * s, art.bark, 3 * s);
    const pads = [
      [lean + sway, -118 * s, 34 * s, 11 * s],
      [lean * 0.6 + 24 * s + sway * 0.8, -99 * s, 20 * s, 8 * s],
      [lean - 14 * s + sway, -108 * s, 18 * s, 7 * s]
    ];
    inked(
      c,
      pads.map(
        ([x, y, rx, ry], i) => () => blobPath(c, x, y, rx, ry, seed + i, 0.18)
      ),
      dk,
      3
    );
    for (const [x, y, rx, ry] of pads) {
      blobPath(c, x - 2, y - 2.5, rx * 0.82, ry * 0.6, seed + x, 0.2);
      c.fillStyle = md;
      c.fill();
      ellipse(c, x - rx * 0.3, y - ry * 0.45, rx * 0.35, ry * 0.25, lt);
    }
  }
  var FALL_SECONDS = 1.1;
  var FADE_SECONDS = 0.45;
  var hitShake = (n, t) => {
    const since = t - (n.hitAt ?? -9);
    return since >= 0 && since < 0.3 ? Math.sin(since * 70) * 3.2 * (1 - since / 0.3) : 0;
  };
  function drawTree(c, n, x, y, t) {
    const since = n.felledAt === void 0 ? Infinity : t - n.felledAt;
    if (n.hp > 0 || since >= FALL_SECONDS + FADE_SECONDS) {
      drawStandingTree(c, n, x + hitShake(n, t), y, t, since);
      return;
    }
    drawStandingTree(c, n, x, y, t, Infinity, true);
    const dir = n.fallDir ?? 1, lie = Math.PI / 2 - 0.08, p = Math.min(1, since / FALL_SECONDS), after = Math.max(0, since - FALL_SECONDS), angle = since < FALL_SECONDS ? lie * p ** 2.4 : lie - 0.07 * Math.sin(after * 18) * Math.exp(-after * 7);
    c.save();
    c.translate(x, y - 12);
    c.rotate(dir * angle);
    c.globalAlpha = after > 0 ? Math.max(0, 1 - after / FADE_SECONDS) : 1;
    drawStandingTree(c, { ...n, hp: 1 }, 0, 12, t, Infinity);
    c.restore();
  }
  function drawStandingTree(c, n, x, y, t, since, stumpOnly = false) {
    const art0 = artAt(n.x, n.y), art = art0.trees ? art0 : ART.meadow, s = 0.9 + H(n.id, 3) * 0.24, sway = Math.sin(t * 0.9 + n.phase + n.x * 0.01) * 2.2, seed = n.id * 13;
    c.save();
    c.translate(x, y);
    if (!stumpOnly) ellipse(c, 0, 1, 30 * s, 5, "rgba(20,24,18,0.22)");
    if (n.hp <= 0 || stumpOnly) {
      fillPoly(
        c,
        [
          [-11, 1],
          [-8, -13],
          [8, -12],
          [11, 1]
        ],
        art.bark,
        INK,
        1.5
      );
      ellipse(c, 0, -12.5, 8, 3, "#c9a878", INK, 1.2);
      ellipse(c, 0, -12.5, 4, 1.5, "", "#a8845a", 1);
      const window2 = n.depletedUntil - (n.felledAt ?? n.depletedUntil), growth = window2 > 0 && since < Infinity ? since / window2 : 0;
      if (!stumpOnly && growth > 0.45) {
        const k = 0.2 + (growth - 0.45) * 1.25;
        c.translate(10, 0);
        c.scale(k, k);
        const kind2 = n.kind === "resin" ? "conifer" : art.trees || "broadleaf";
        if (kind2 === "conifer") drawConifer(c, s, seed, art, sway, !!art.snowy);
        else if (kind2 === "willow") drawWillow(c, s, seed, art, sway, t);
        else if (kind2 === "pine") drawPine(c, s, seed, art, sway);
        else drawBroadleaf(c, s, seed, art, sway);
      }
      c.restore();
      return;
    }
    const kind = n.kind === "resin" ? "conifer" : n.kind === "honey" ? "broadleaf" : art.trees;
    if (kind === "conifer") drawConifer(c, s, seed, art, sway, !!art.snowy);
    else if (kind === "willow") drawWillow(c, s, seed, art, sway, t);
    else if (kind === "pine") drawPine(c, s, seed, art, sway);
    else drawBroadleaf(c, s, seed, art, sway);
    if (n.kind === "resin") {
      for (const [dx, dy, r] of [
        [2, -10, 3.2],
        [-2, -19, 2.4]
      ]) {
        blobPath(c, dx * s, dy * s, r, r * 1.5, seed + dy, 0.1);
        c.fillStyle = "#d99a3c";
        c.fill();
        c.strokeStyle = "#8b5a1f";
        c.lineWidth = 1;
        c.stroke();
        ellipse(c, dx * s - 0.8, dy * s - 1.5, 0.9, 1.4, "#f8dc9a");
      }
      glow(c, 0, -14 * s, 18, "#f0b45c", 0.25);
    }
    if (n.kind === "honey") {
      const hx = 17 * s + sway * 0.5, hy = -70 * s;
      line(c, hx, hy - 8, hx, hy, "#4a3a2a", 1.2);
      for (let b = 0; b < 4; b++)
        ellipse(
          c,
          hx,
          hy + 4 + b * 4.5,
          7 - Math.abs(b - 1.3) * 1.6,
          3.2,
          b % 2 ? "#c7902e" : "#dcaa4e",
          INK,
          1
        );
      ellipse(c, hx, hy + 13, 1.8, 1.8, "#3a2a1c");
      for (let b = 0; b < 3; b++) {
        const a = t * 3 + b * 2.1 + n.phase;
        ellipse(c, hx + Math.cos(a) * 12, hy + 8 + Math.sin(a * 1.3) * 7, 1.4, 1.1, "#2c2418");
      }
    }
    c.restore();
  }
  function leaf(c, x, y, len, ang, wd, color) {
    c.save();
    c.translate(x, y);
    c.rotate(ang);
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(len * 0.5, -wd, len, 0);
    c.quadraticCurveTo(len * 0.5, wd, 0, 0);
    c.fillStyle = color;
    c.fill();
    c.restore();
  }
  function drawPlant(c, n, x, y, t) {
    const k = n.kind, art = artAt(n.x, n.y), [gd, gm, gl] = ["#48683f", "#63874f", "#86a863"], sway = Math.sin(t * 1.6 + n.phase + n.x * 0.02) * 0.06, full = data_exports.NODES[k] ? n.hp / data_exports.NODES[k].hp : 1, s = 0.78 + 0.22 * clamp2(full) + H(n.id, 4) * 0.1, seed = n.id * 7;
    c.save();
    c.translate(x, y);
    ellipse(c, 0, 1, 15 * s, 3, "rgba(20,24,18,0.2)");
    if (n.hp <= 0) {
      for (let i = 0; i < 4; i++)
        line(c, -6 + i * 4, 1, -6 + i * 4 + (i - 1.5), -3 - H(i, seed) * 3, "#8a8058", 1.3);
      c.restore();
      return;
    }
    c.transform(1, 0, sway, 1, 0, 0);
    c.scale(s, s);
    void art;
    if (k === "berry") {
      const blobs = [
        [-9, -11, 10],
        [8, -12, 10],
        [0, -19, 11],
        [-2, -8, 10]
      ];
      inked(
        c,
        blobs.map(
          ([bx, by, r], i) => () => blobPath(c, bx, by, r, r * 0.85, seed + i, 0.2)
        ),
        "#3f6139",
        3
      );
      for (const [bx, by, r] of blobs) {
        blobPath(c, bx - 2, by - 3, r * 0.6, r * 0.5, seed + bx, 0.2);
        c.fillStyle = "#5b824a";
        c.fill();
      }
      for (let i = 0; i < 9; i++) {
        const bx = (H(i, seed, 1) - 0.5) * 26, by = -6 - H(i, seed, 2) * 18;
        ellipse(c, bx, by, 2.8, 2.8, "#b8413d", "rgba(60,20,20,0.6)", 0.8);
        ellipse(c, bx - 0.9, by - 0.9, 0.9, 0.9, "#f3c2b5");
      }
    } else if (k === "herb") {
      for (let i = 0; i < 5; i++) {
        const sx = (i - 2) * 4, top = -16 - H(i, seed) * 10, lean = (i - 2) * 2.5;
        curve(c, sx * 0.3, 0, sx, top * 0.5, sx + lean, top, gd, 1.4);
        for (let j = 1; j < 4; j++) {
          const py = top * j / 4, px = sx * 0.3 + (sx + lean - sx * 0.3) * (j / 4);
          leaf(c, px, py, 7, -0.5, 2.6, j % 2 ? gm : gl);
          leaf(c, px, py, 7, Math.PI + 0.5, 2.6, gm);
        }
        for (let f = 0; f < 3; f++)
          ellipse(c, sx + lean + (f - 1) * 1.8, top - 1 - f % 2 * 1.5, 1.5, 1.5, "#efe9f2");
      }
    } else if (k === "fiber") {
      for (let i = 0; i < 11; i++) {
        const bx = (i - 5) * 1.8, h = 20 + H(i, seed) * 16, lean = (i - 5) * 2.2 + (H(i, seed, 2) - 0.5) * 6;
        grassBlade(c, bx, 1, h, lean, [gd, "#7f9b58", "#a3b86f"][i % 3]);
      }
      for (let i = 0; i < 3; i++) {
        const lean = (i - 1) * 8, h = 34 + i * 3;
        curve(c, 0, 0, lean * 0.4, -h * 0.6, lean, -h, "#8c8a55", 1.2);
        ellipse(c, lean, -h - 2, 1.8, 4, "#c3b27a", "", 1, lean * 0.03);
      }
    } else if (k === "wheat") {
      for (let i = 0; i < 7; i++) {
        const lean = (i - 3) * 2.6, h = 30 + H(i, seed) * 10;
        curve(c, (i - 3) * 1.5, 0, lean * 0.4, -h * 0.5, lean, -h, "#b39658", 1.4);
        for (let j = 0; j < 5; j++) {
          ellipse(c, lean - 1.6, -h - j * 2.6, 1.6, 2.4, "#dcb867", "", 1, -0.4);
          ellipse(c, lean + 1.6, -h - j * 2.6 - 1.2, 1.6, 2.4, "#e8c77a", "", 1, 0.4);
        }
        line(c, lean, -h - 12, lean + 1, -h - 20, "#d9c089", 0.7);
      }
      leaf(c, 0, -8, 14, -2.4, 2.2, "#9fa05c");
      leaf(c, 0, -12, 14, -0.8, 2.2, "#8f944f");
    } else if (k === "reeds") {
      for (let i = 0; i < 6; i++) {
        const lean = (i - 2.5) * 3, h = 38 + H(i, seed) * 16;
        grassBlade(c, (i - 2.5) * 2, 1, h * 0.8, lean * 2.2, i % 2 ? "#6d8a4e" : "#8aa35f");
        if (i % 2 === 0) {
          line(c, (i - 2.5) * 2, 0, lean, -h, "#7b8a55", 1.4);
          ellipse(c, lean, -h + 4, 2.6, 7, "#6e4a2e", INK, 1);
          line(c, lean, -h - 3, lean, -h - 9, "#7b8a55", 1);
        }
      }
    } else if (k === "potato") {
      ellipse(c, 6, -1, 6, 3.5, "#b08a5a", INK, 1);
      const blobs = [
        [-8, -8, 8],
        [6, -9, 8],
        [-1, -14, 9]
      ];
      inked(
        c,
        blobs.map(
          ([bx, by, r], i) => () => blobPath(c, bx, by, r, r * 0.75, seed + i, 0.28)
        ),
        "#46663c",
        2.6
      );
      for (let i = 0; i < 7; i++)
        leaf(
          c,
          (H(i, seed) - 0.5) * 16,
          -8 - H(i, seed, 2) * 8,
          8,
          -1.6 + H(i, seed, 3) * 3.2,
          3,
          i % 2 ? gm : gl
        );
      for (let f = 0; f < 3; f++) {
        const fx = -6 + f * 6, fy = -21 + f % 2 * 3;
        for (let p = 0; p < 5; p++)
          ellipse(
            c,
            fx + Math.cos(p * 1.26) * 1.8,
            fy + Math.sin(p * 1.26) * 1.8,
            1.4,
            1.4,
            "#c9b4df"
          );
        ellipse(c, fx, fy, 0.9, 0.9, "#f0d060");
      }
    } else if (k === "willow") {
      c.lineCap = "round";
      for (let i = 0; i < 4; i++) {
        const top = -26 - i * 4, dir = i % 2 ? 1 : -1, ex = dir * (8 + i * 2);
        curve(c, 0, 0, dir * 2, top, ex, top + 2, "#7a6247", 2);
        for (let j = 0; j < 5; j++) {
          const lx = lerp(0, ex, 0.4 + j * 0.13), ly = top + 2 + j * 0.5;
          curve(
            c,
            lx,
            ly,
            lx + dir * 1.5,
            ly + 6,
            lx + dir * 0.5,
            ly + 12 + H(j, seed) * 5,
            j % 2 ? gm : "#9ab36f",
            1.6
          );
        }
      }
    } else if (k === "cactus_fruit") {
      const col = "#5f8a57", dark = "#44683f";
      const shape = () => {
        c.beginPath();
        c.moveTo(-7, 0);
        c.lineTo(-7, -38);
        c.arc(0, -38, 7, Math.PI, 0);
        c.lineTo(7, 0);
        c.closePath();
      };
      const armL = () => {
        c.beginPath();
        c.roundRect(-18, -30, 8, 18, 4);
        c.rect(-12, -17, 8, 6);
      };
      const armR = () => {
        c.beginPath();
        c.roundRect(10, -40, 8, 22, 4);
        c.rect(4, -24, 8, 6);
      };
      inked(c, [shape, armL, armR], col, 2.8);
      for (const xx of [-3.5, 0, 3.5]) line(c, xx, -2, xx, -40 + Math.abs(xx) * 0.6, dark, 1);
      line(c, 14, -38, 14, -21, dark, 1);
      line(c, -14, -28, -14, -13, dark, 1);
      fillPoly(
        c,
        [
          [2.5, -2],
          [6.5, -2],
          [6.5, -38],
          [4, -42]
        ],
        "rgba(0,0,0,0.13)"
      );
      for (let i = 0; i < 12; i++) {
        const sx = (H(i, seed) - 0.5) * 12, sy = -4 - H(i, seed, 2) * 36;
        line(c, sx, sy, sx + (sx > 0 ? 2 : -2), sy - 1, "#e9e2c2", 0.7);
      }
      for (const [fx, fy] of [
        [-3, -46],
        [3, -45.5],
        [14, -45]
      ]) {
        ellipse(c, fx, fy, 3.2, 3.6, "#c9506a", INK, 1);
        ellipse(c, fx - 0.8, fy - 1.2, 1, 1, "#f2a7b5");
      }
    } else if (k === "mushroom") {
      const shrooms = [
        [-7, 0, 0.85],
        [4, 0, 1.1],
        [11, 0, 0.6]
      ];
      for (const [mx, , ms] of shrooms) {
        const sh = 14 * ms, cr = 9 * ms;
        c.fillStyle = "#e6dcc0";
        c.beginPath();
        c.moveTo(mx - 2.6 * ms, 0);
        c.quadraticCurveTo(mx - 1.5 * ms, -sh * 0.6, mx - 2 * ms, -sh);
        c.lineTo(mx + 2 * ms, -sh);
        c.quadraticCurveTo(mx + 1.5 * ms, -sh * 0.6, mx + 2.6 * ms, 0);
        c.closePath();
        c.fill();
        c.strokeStyle = INK;
        c.lineWidth = 1.1;
        c.stroke();
        c.beginPath();
        c.moveTo(mx - cr, -sh + 1);
        c.quadraticCurveTo(mx - cr, -sh - cr * 1.05, mx, -sh - cr * 1.05);
        c.quadraticCurveTo(mx + cr, -sh - cr * 1.05, mx + cr, -sh + 1);
        c.quadraticCurveTo(mx, -sh - 2, mx - cr, -sh + 1);
        c.fillStyle = n.underground ? "#6c8fa8" : "#a9533f";
        c.fill();
        c.stroke();
        for (const [dx, dy] of [
          [-0.45, -0.55],
          [0.2, -0.8],
          [0.5, -0.4]
        ])
          ellipse(c, mx + dx * cr, -sh + dy * cr, 1.3 * ms, 1 * ms, "#f1e3cc");
      }
    }
    c.restore();
  }
  function drawPond(c, n, x, y, t) {
    c.save();
    c.translate(x, y + 1);
    const w = 34;
    c.beginPath();
    c.moveTo(-w - 4, -1);
    c.quadraticCurveTo(-w + 6, 12, 0, 12);
    c.quadraticCurveTo(w - 6, 12, w + 4, -1);
    c.closePath();
    c.fillStyle = "#4a3c2e";
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.stroke();
    const gr = c.createLinearGradient(0, 0, 0, 10);
    gr.addColorStop(0, "#8fbcbf");
    gr.addColorStop(1, "#3f6f78");
    c.beginPath();
    c.moveTo(-w, 0);
    c.quadraticCurveTo(-w + 7, 9.5, 0, 9.5);
    c.quadraticCurveTo(w - 7, 9.5, w, 0);
    c.closePath();
    c.fillStyle = gr;
    c.fill();
    line(c, -w + 1, 0.3, w - 1, 0.3, "rgba(236,244,236,0.8)", 1.4);
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.35 + i / 3 + n.phase) % 1, rx = -w * 0.6 + i * w * 0.55;
      c.strokeStyle = `rgba(230,242,236,${0.5 * (1 - p)})`;
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(rx, 3.5, 3 + p * 9, 0.8 + p * 1.6, 0, 0, TAU);
      c.stroke();
    }
    for (const [sx, r] of [
      [-w - 2, 4],
      [w + 1, 3.2],
      [w - 6, 2.4]
    ])
      ellipse(c, sx, -1, r * 1.3, r, "#8d918a", INK, 1);
    for (let i = 0; i < 4; i++) grassBlade(c, -w + 4 + i * 2.5, 0, 10 + i * 3, -2 + i, "#6f8f52");
    c.restore();
  }
  function rockPath(c, w, h, seed) {
    const pts = [[-w / 2, 0]];
    for (let i = 1; i < 7; i++) {
      const a = Math.PI - i / 7 * Math.PI, j = 0.82 + H(i, seed, 9) * 0.3;
      pts.push([Math.cos(a) * (w / 2) * j, -Math.sin(a) * h * j]);
    }
    pts.push([w / 2, 0]);
    polyPath(c, pts);
    return pts;
  }
  function drawRock(c, x, w, h, seed, base) {
    c.save();
    c.translate(x, 0);
    const pts = rockPath(c, w, h, seed);
    c.fillStyle = base;
    c.fill();
    c.save();
    c.clip();
    ellipse(c, w * 0.32, -h * 0.1, w * 0.45, h * 0.95, shade(base, -0.2));
    fillPoly(
      c,
      [
        [pts[1][0] * 0.9, pts[1][1] * 0.95],
        [pts[2][0], pts[2][1]],
        [pts[3][0], pts[3][1]],
        [pts[3][0] * 0.4, pts[3][1] * 0.55],
        [pts[1][0] * 0.55, pts[1][1] * 0.5]
      ],
      shade(base, 0.2)
    );
    c.fillStyle = "rgba(0,0,0,0.2)";
    c.fillRect(-w, -3, w * 2, 3);
    c.restore();
    polyPath(c, pts);
    c.strokeStyle = INK;
    c.lineWidth = 1.8;
    c.lineJoin = "round";
    c.stroke();
    c.restore();
  }
  function specks(c, seed, n, w, h, colors, size = 2) {
    for (let i = 0; i < n; i++) {
      const sx = (H(i, seed, 1) - 0.5) * w * 0.75, sy = -h * (0.18 + H(i, seed, 2) * 0.6), r = size * (0.7 + H(i, seed, 3) * 0.6);
      fillPoly(
        c,
        [
          [sx - r, sy],
          [sx, sy - r],
          [sx + r, sy],
          [sx, sy + r * 0.8]
        ],
        colors[i % colors.length]
      );
    }
  }
  function crystalPrism(c, x, h, wd, ang, a, b) {
    c.save();
    c.translate(x, 0);
    c.rotate(ang);
    const gr = c.createLinearGradient(-wd, 0, wd, 0);
    gr.addColorStop(0, a);
    gr.addColorStop(1, b);
    fillPoly(
      c,
      [
        [-wd, 2],
        [-wd, -h + wd * 1.4],
        [0, -h],
        [wd, -h + wd * 1.4],
        [wd, 2]
      ],
      gr,
      INK,
      1.3
    );
    line(c, 0, -h + 1, 0, 0, "rgba(255,255,255,0.35)", 1);
    c.restore();
  }
  function drawMineral(c, n, x, y, t) {
    const k = n.kind, seed = n.id * 11, full = data_exports.NODES[k] ? clamp2(n.hp / data_exports.NODES[k].hp) : 1, s = 0.8 + 0.2 * full + H(n.id, 5) * 0.1;
    c.save();
    c.translate(x, y + 1);
    ellipse(c, 0, 0, 20 * s, 3.5, "rgba(15,18,20,0.25)");
    if (n.hp <= 0) {
      ellipse(c, -5, -1.5, 3.5, 2.2, "#77756e", INK, 1);
      ellipse(c, 4, -1.2, 2.6, 1.8, "#77756e", INK, 1);
      c.restore();
      return;
    }
    c.scale(s, s);
    if (k === "stone") {
      drawRock(c, 8, 24, 16, seed + 1, "#858a86");
      drawRock(c, -7, 26, 21, seed, "#9a9d97");
      drawRock(c, 14, 10, 7, seed + 2, "#7c817e");
    } else if (k === "flint") {
      drawRock(c, 0, 32, 21, seed, "#d9d2bf");
      for (const [fx, fy, r] of [
        [-6, -9, 5],
        [6, -12, 4],
        [2, -4, 3]
      ]) {
        blobPath(c, fx, fy, r * 1.2, r, seed + fx, 0.25);
        c.fillStyle = "#34393d";
        c.fill();
        curve(
          c,
          fx - r * 0.7,
          fy - r * 0.2,
          fx - r * 0.2,
          fy - r * 0.9,
          fx + r * 0.6,
          fy - r * 0.4,
          "#a4b3ba",
          1
        );
      }
    } else if (k === "clay") {
      c.beginPath();
      c.moveTo(-18, 0);
      c.quadraticCurveTo(-18, -12, -9, -14);
      c.quadraticCurveTo(-2, -20, 7, -15);
      c.quadraticCurveTo(17, -13, 18, 0);
      c.closePath();
      c.fillStyle = "#b06f55";
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.8;
      c.stroke();
      curve(c, -12, -9, -4, -16, 6, -12, "#d49a7e", 2.2);
      curve(c, -8, -4, 0, -7, 10, -5, "#8e533e", 1.1);
      curve(c, -4, -2, 4, -3, 12, -1.5, "#8e533e", 1);
      ellipse(c, -5, -13, 2.5, 1, "rgba(255,240,225,0.5)");
    } else if (k === "copper_ore") {
      drawRock(c, 0, 34, 22, seed, "#6f6a63");
      specks(c, seed, 7, 34, 22, ["#d98a4a", "#f0b070", "#c26d36"], 2.6);
      specks(c, seed + 5, 3, 34, 22, ["#6fb59a"], 1.8);
    } else if (k === "iron_ore") {
      drawRock(c, 0, 34, 23, seed, "#63605d");
      curve(c, -12, -6, -4, -14, 8, -10, "#a3542f", 2.6);
      curve(c, -4, -18, 4, -9, 12, -6, "#b8663a", 2);
      specks(c, seed, 5, 34, 23, ["#c4773f", "#8f4726"], 2);
    } else if (k === "coal") {
      drawRock(c, 0, 34, 20, seed, "#56565a");
      for (let i = 0; i < 4; i++) {
        const cx = -10 + i * 7, cy = -7 - H(i, seed) * 8, r = 4 + H(i, seed, 2) * 3;
        fillPoly(
          c,
          [
            [cx - r, cy + 2],
            [cx - r * 0.4, cy - r],
            [cx + r * 0.8, cy - r * 0.5],
            [cx + r, cy + 2]
          ],
          "#1e1f24"
        );
        line(c, cx - r * 0.3, cy - r * 0.7, cx + r * 0.6, cy - r * 0.4, "#9aa6b4", 1);
      }
    } else if (k === "ice") {
      for (const [ix, w, h, a] of [
        [-8, 16, 26, -0.15],
        [7, 14, 20, 0.2],
        [0, 12, 14, 0]
      ]) {
        c.save();
        c.translate(ix, 0);
        c.rotate(a);
        fillPoly(
          c,
          [
            [-w / 2, 1],
            [-w / 2, -h * 0.7],
            [-w * 0.1, -h],
            [w / 2, -h * 0.8],
            [w / 2, 1]
          ],
          "rgba(188,226,236,0.92)",
          "#4f7f94",
          1.4
        );
        fillPoly(
          c,
          [
            [-w / 2, -h * 0.7],
            [-w * 0.1, -h],
            [0, -h * 0.55],
            [-w / 2 + 2, -h * 0.35]
          ],
          "rgba(255,255,255,0.65)"
        );
        fillPoly(
          c,
          [
            [w * 0.15, -h * 0.5],
            [w / 2, -h * 0.8],
            [w / 2, 1],
            [w * 0.15, 1]
          ],
          "rgba(80,140,170,0.3)"
        );
        c.restore();
      }
    } else if (k === "obsidian") {
      drawRock(c, 0, 30, 12, seed, "#3b3746");
      for (const [ox, h, a] of [
        [-8, 26, -0.25],
        [3, 34, 0.08],
        [11, 20, 0.35]
      ]) {
        c.save();
        c.translate(ox, -4);
        c.rotate(a);
        fillPoly(
          c,
          [
            [-5, 2],
            [-3, -h * 0.6],
            [0, -h],
            [5, -h * 0.4],
            [5, 2]
          ],
          "#1b1922",
          INK,
          1.4
        );
        line(c, -3, -h * 0.6, 0, -h, "#a07fd0", 1.4);
        line(c, 0, -h, 1, -4, "rgba(180,150,230,0.35)", 1);
        c.restore();
      }
      glow(c, 0, -14, 30, "#9b77cc", 0.14 + Math.sin(t * 2 + n.phase) * 0.04);
    } else if (k === "sulfur") {
      drawRock(c, 0, 32, 18, seed, "#8b8472");
      for (let i = 0; i < 9; i++) {
        const sx = (H(i, seed) - 0.5) * 24, sy = -4 - H(i, seed, 2) * 14, r = 2.5 + H(i, seed, 3) * 2.5;
        fillPoly(
          c,
          [
            [sx - r, sy],
            [sx, sy - r * 1.4],
            [sx + r, sy],
            [sx, sy + r * 0.6]
          ],
          i % 3 ? "#e6cc45" : "#f6e37c",
          "#9a7d1f",
          0.8
        );
      }
    } else if (k === "crystal") {
      const pulse2 = 0.5 + 0.5 * Math.sin(t * 2.2 + n.phase);
      glow(c, 0, -16, 42, "#8fe3df", 0.18 + pulse2 * 0.12);
      drawRock(c, 0, 30, 10, seed, "#4c4b58");
      crystalPrism(c, -9, 22, 4, -0.35, "#d9fbf7", "#5fb7c0");
      crystalPrism(c, 9, 20, 3.6, 0.4, "#c9f3f0", "#4fa3b0");
      crystalPrism(c, 0, 34, 5, 0.05, "#e6fffb", "#62bcc6");
      crystalPrism(c, 4, 14, 3, 0.7, "#d2f7f3", "#56adb8");
      const sp = (t * 0.8 + n.phase) % 1;
      if (sp < 0.3) {
        const a = (1 - sp / 0.3) * 0.9;
        line(c, -3, -30, 3, -30, rgba("#ffffff", a), 1);
        line(c, 0, -33, 0, -27, rgba("#ffffff", a), 1);
      }
    } else if (k === "salt") {
      c.beginPath();
      c.moveTo(-18, 0);
      c.quadraticCurveTo(-10, -14, 0, -15);
      c.quadraticCurveTo(12, -14, 18, 0);
      c.closePath();
      c.fillStyle = "#e9e0cc";
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.6;
      c.stroke();
      for (let i = 0; i < 6; i++) {
        const cx = (H(i, seed) - 0.5) * 22, cy = -4 - H(i, seed, 2) * 9, r = 2.5 + H(i, seed, 3) * 2;
        c.save();
        c.translate(cx, cy);
        c.rotate(H(i, seed, 4) - 0.5);
        c.fillStyle = "#fbf8f0";
        c.fillRect(-r, -r, r * 2, r * 2);
        c.fillStyle = "#cfc3a9";
        c.fillRect(0, -r, r, r * 2);
        c.strokeStyle = "rgba(120,105,80,0.6)";
        c.lineWidth = 0.8;
        c.strokeRect(-r, -r, r * 2, r * 2);
        c.restore();
      }
    } else if (k === "hellstone") {
      glow(c, 0, -10, 34, "#ff5a1f", 0.35 + Math.sin(t * 2.4 + n.phase) * 0.1);
      drawRock(c, -4, 30, 22, seed, "#4a1c22");
      drawRock(c, 11, 16, 13, seed + 3, "#5a2029");
      for (const [x1, y1, x2, y2] of [
        [-14, -6, -2, -15],
        [-6, -2, 6, -12],
        [6, -4, 14, -9]
      ]) {
        line(c, x1, y1, x2, y2, "#ff6a2a", 2.4);
        line(c, x1, y1, x2, y2, "#ffd27a", 0.9);
      }
    } else {
      drawRock(c, 0, 30, 20, seed, "#9a8d78");
    }
    c.restore();
  }
  function drawNode(c, n, x, y, t) {
    const k = n.kind;
    x += hitShake(n, t);
    if (k === "water") drawPond(c, n, x, y, t);
    else if ([
      "berry",
      "herb",
      "fiber",
      "wheat",
      "reeds",
      "potato",
      "cactus_fruit",
      "willow",
      "mushroom"
    ].includes(k))
      drawPlant(c, n, x, y, t);
    else drawMineral(c, n, x, y, t);
  }
  function drawCache(c, cache, x, y, t) {
    c.save();
    c.translate(x, y + 1);
    ellipse(c, 0, 0, 16, 3, "rgba(20,20,15,0.25)");
    const wave = Math.sin(t * 3 + cache.id) * 3;
    line(c, 9, 0, 11, -40, INK, 3.4);
    line(c, 9, 0, 11, -40, "#7a5a3c", 2);
    c.beginPath();
    c.moveTo(11, -40);
    c.quadraticCurveTo(19, -40 + wave * 0.3, 25, -37 + wave);
    c.lineTo(24, -30 + wave);
    c.quadraticCurveTo(18, -31 - wave * 0.3, 11, -30);
    c.closePath();
    c.fillStyle = "#b5523e";
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.2;
    c.stroke();
    c.beginPath();
    c.moveTo(-13, 0);
    c.quadraticCurveTo(-16, -15, -6, -19);
    c.lineTo(-3, -24);
    c.lineTo(3, -24);
    c.lineTo(5, -19);
    c.quadraticCurveTo(15, -15, 12, 0);
    c.closePath();
    c.fillStyle = "#b89f70";
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    fillPoly(
      c,
      [
        [2, -18],
        [12, -12],
        [11, -1],
        [3, -1]
      ],
      "rgba(0,0,0,0.15)"
    );
    c.fillStyle = "#9e865c";
    c.fillRect(-9, -11, 7, 6);
    c.strokeStyle = "#6b5236";
    c.lineWidth = 0.8;
    c.setLineDash([1.5, 1.5]);
    c.strokeRect(-9, -11, 7, 6);
    c.setLineDash([]);
    line(c, -5, -20, 5, -20, "#6b4a2c", 2.2);
    curve(c, 5, -20, 9, -18, 7, -14, "#6b4a2c", 1.4);
    const sp = (t * 0.5 + cache.id * 0.37) % 1;
    if (sp < 0.2) {
      const a = 1 - sp / 0.2;
      line(c, -2, -30, 4, -30, rgba("#fff6d8", a), 1.2);
      line(c, 1, -33, 1, -27, rgba("#fff6d8", a), 1.2);
    }
    c.restore();
  }

  // src/renderer/structures.ts
  function flame(c, w, h, t, ph, color) {
    const wob = Math.sin(t * 9 + ph) * w * 0.35, wob2 = Math.sin(t * 13 + ph * 2) * w * 0.25;
    c.beginPath();
    c.moveTo(-w, 0);
    c.bezierCurveTo(-w * 1.1, -h * 0.45, -w * 0.3 + wob2, -h * 0.6, wob, -h);
    c.bezierCurveTo(w * 0.3 + wob2, -h * 0.55, w * 1.1, -h * 0.4, w, 0);
    c.closePath();
    c.fillStyle = color;
    c.fill();
  }
  function bricks(c, x0, y0, x1, y1, color) {
    c.strokeStyle = color;
    c.lineWidth = 1;
    c.beginPath();
    for (let y = y1, row = 0; y > y0; y -= 7, row++) {
      c.moveTo(x0, y);
      c.lineTo(x1, y);
      for (let x = x0 + (row % 2 ? 6 : 0); x < x1; x += 12) {
        c.moveTo(x, y);
        c.lineTo(x, y - 7);
      }
    }
    c.stroke();
  }
  function smoke(c, x, y, t, seed, amount = 1) {
    for (let i = 0; i < 4; i++) {
      const life = (t * 0.28 + i / 4 + seed * 0.13) % 1;
      ellipse(
        c,
        x + Math.sin(life * 5 + i) * 5 + life * 16,
        y - life * 70,
        4 + life * 13,
        3 + life * 10,
        `rgba(200,200,195,${0.22 * (1 - life) * amount})`
      );
    }
  }
  function drawStructure(c, g, s, x, y, t) {
    const k = s.type;
    c.save();
    c.translate(x, y + 1);
    c.lineJoin = "round";
    if (k !== "platform") ellipse(c, 0, 0, k === "shelter" ? 60 : 30, 4, "rgba(20,20,15,0.22)");
    if (k === "campfire") {
      const lit = s.fuel > 0;
      ellipse(c, 0, -1, 26, 5, lit ? "#3b2c22" : "#403630");
      for (let i = 0; i < 5; i++) ellipse(c, -16 + i * 8, -4, 5, 3.5, "#6f6b62", INK, 1);
      for (const [a, len] of [
        [0.38, 38],
        [-0.38, 38],
        [0, 30]
      ]) {
        c.save();
        c.translate(0, -6);
        c.rotate(a);
        c.fillStyle = lit ? "#6b4a31" : "#3a2e26";
        c.beginPath();
        c.roundRect(-len / 2, -3.5, len, 7, 3);
        c.fill();
        c.strokeStyle = INK;
        c.lineWidth = 1.2;
        c.stroke();
        ellipse(c, len / 2 - 1, 0, 2.5, 3.5, lit ? "#c9a878" : "#5a4f45", INK, 1);
        c.restore();
      }
      if (lit) {
        glow(c, 0, -14, 50, "#ffb45e", 0.32 + Math.sin(t * 11) * 0.04);
        c.save();
        c.translate(0, -8);
        flame(c, 13, 38 + Math.sin(t * 7) * 5, t, 0, "#de6d35");
        c.save();
        c.translate(-7, 1);
        flame(c, 6, 20 + Math.sin(t * 10) * 3, t, 2, "#e98a3e");
        c.restore();
        c.save();
        c.translate(8, 1);
        flame(c, 6, 22 + Math.sin(t * 8) * 3, t, 4, "#e98a3e");
        c.restore();
        flame(c, 9, 26 + Math.sin(t * 9) * 4, t, 1, "#f5ad48");
        flame(c, 5, 14 + Math.sin(t * 12) * 2, t, 3, "#fde6a6");
        c.restore();
        for (let i = 0; i < 7; i++) {
          const life = (t * 0.7 + i * 0.143) % 1;
          ellipse(
            c,
            Math.sin(i * 3 + life * 6) * 9 + life * 6,
            -16 - life * 58,
            1.3,
            1.3,
            `rgba(255,${190 - life * 80},100,${1 - life})`
          );
        }
        smoke(c, 4, -50, t, s.id, 0.8);
      } else {
        ellipse(c, 0, -5, 12, 3, "#8f8a82");
        smoke(c, 0, -12, t * 0.6, s.id, 0.5);
      }
      for (let i = 0; i < 4; i++) ellipse(c, -13 + i * 9, -1.5, 5.5, 4, "#8d8a80", INK, 1.1);
    } else if (k === "shelter") {
      fillPoly(
        c,
        [
          [-34, -66],
          [48, 0],
          [-34, 0]
        ],
        "rgba(28,22,18,0.55)"
      );
      ellipse(c, -2, -1, 28, 3, "#6b5a40");
      line(c, -34, 0, -34, -86, INK, 7);
      line(c, -34, 0, -34, -86, "#5e4631", 5);
      line(c, -34, -84, -40, -94, "#5e4631", 3.5);
      line(c, -34, -84, -28, -95, "#5e4631", 3.5);
      line(c, -55, 0, -34, -84, INK, 6);
      line(c, -55, 0, -34, -84, "#6b513a", 4);
      const roof = [
        [-42, -88],
        [64, 3],
        [46, 3],
        [-32, -68]
      ];
      fillPoly(c, roof, "#a98c58", INK, 2);
      c.save();
      polyPath(c, roof);
      c.clip();
      for (let i = -8; i < 20; i++) {
        const o = i * 6;
        line(c, -42 + o * 0.6, -88 + o, 64 + o * 0.6 - 60, 3 + o - 50, "rgba(110,88,50,0.55)", 1);
      }
      for (let i = 0; i < 14; i++) {
        const u = i / 13;
        line(
          c,
          lerp(-40, 60, u),
          lerp(-86, 1, u),
          lerp(-40, 60, u) - 8,
          lerp(-86, 1, u) + 6,
          "#c2a86f",
          1.2
        );
      }
      fillPoly(
        c,
        [
          [-8, -60],
          [26, -30],
          [16, -21],
          [-16, -48]
        ],
        "#8a6a4c"
      );
      c.setLineDash([2, 2]);
      polyPath(c, [
        [-6, -57],
        [23, -31],
        [16, -24],
        [-13, -48]
      ]);
      c.strokeStyle = "#d6c29a";
      c.lineWidth = 0.9;
      c.stroke();
      c.setLineDash([]);
      c.restore();
      for (let i = 0; i < 12; i++) {
        const u = i / 11, bx = lerp(46, 64, u) + 0, by = lerp(3, 3, u);
        line(c, bx, by, bx + 2, by - 5, "#8f7443", 1.2);
      }
      line(c, -38, -86, -30, -80, "#d2bb88", 1.6);
    } else if (k === "workbench" || k === "apothecary") {
      const top = k === "apothecary" ? "#7a5f45" : "#8a6a48";
      for (const [x1, x2] of [
        [-24, -20],
        [24, 20]
      ]) {
        line(c, x1 * 0.8, 0, x2 * 0.85, -28, INK, 6);
        line(c, x1 * 0.8, 0, x2 * 0.85, -28, "#4f3a28", 4);
      }
      for (const [x1, x2] of [
        [-28, -22],
        [28, 22]
      ]) {
        line(c, x1, 0, x2, -28, INK, 7);
        line(c, x1, 0, x2, -28, "#654a32", 5);
      }
      line(c, -24, -11, 24, -11, INK, 5);
      line(c, -24, -11, 24, -11, "#654a32", 3);
      c.fillStyle = top;
      c.beginPath();
      c.roundRect(-35, -37, 70, 9, 2);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.8;
      c.stroke();
      c.fillStyle = shade(top, 0.18);
      c.fillRect(-34, -36, 68, 2.5);
      line(c, -12, -35, -12, -29, shade(top, -0.25), 1);
      line(c, 12, -35, 12, -29, shade(top, -0.25), 1);
      if (k === "workbench") {
        line(c, -26, -39, -10, -41, "#7a5a3a", 2.5);
        c.fillStyle = "#6f7478";
        c.fillRect(-29, -45, 6, 8);
        c.strokeStyle = INK;
        c.lineWidth = 1;
        c.strokeRect(-29, -45, 6, 8);
        c.fillStyle = "#6d6358";
        c.fillRect(6, -46, 12, 9);
        c.strokeRect(6, -46, 12, 9);
        line(c, 12, -46, 12, -50, "#4a4540", 2);
        line(c, 8, -50, 16, -50, "#4a4540", 1.8);
        fillPoly(
          c,
          [
            [30, -29],
            [42, -29],
            [40, -6],
            [33, -6]
          ],
          "#b8bcbd",
          INK,
          1
        );
        for (let i = 0; i < 6; i++)
          line(c, 40 - i * 0.3, -26 + i * 3.4, 42 - i * 0.3, -25 + i * 3.4, "#7d8385", 1);
        c.fillStyle = "#6b4a2f";
        c.fillRect(31, -35, 10, 6);
        ellipse(c, -2, -39, 3, 1.2, "#d6b98a");
        ellipse(c, 2, -39.5, 2, 1, "#e3c89c");
      } else {
        const hang = Math.sin(t * 1.2 + s.id) * 1.5;
        line(c, -30, -37, -30, -72, "#5e4631", 3);
        line(c, 30, -37, 30, -72, "#5e4631", 3);
        line(c, -32, -70, 32, -70, "#5e4631", 3);
        for (let i = 0; i < 4; i++) {
          const hx = -20 + i * 13;
          line(c, hx, -70, hx + hang * 0.3, -62, "#b8a47a", 1);
          for (let j = 0; j < 5; j++)
            line(
              c,
              hx + hang * 0.3,
              -62,
              hx + hang + (j - 2) * 2,
              -50 + Math.abs(j - 2),
              i % 2 ? "#7d8f58" : "#9a8a5a",
              1.6
            );
        }
        ellipse(c, -19, -41, 8, 5, "#9a9387", INK, 1.2);
        ellipse(c, -19, -44, 7, 1.6, "#5f5a50");
        line(c, -17, -44, -10, -54, "#b7ae9c", 2.4);
        for (const [bx, col, hgt] of [
          [2, "#7fb07a", 16],
          [12, "#b3564a", 12],
          [22, "#d0a24c", 14]
        ]) {
          c.beginPath();
          c.moveTo(bx - 4, -37);
          c.lineTo(bx - 4, -37 - hgt * 0.6);
          c.quadraticCurveTo(bx - 4, -37 - hgt * 0.8, bx - 1.5, -37 - hgt * 0.85);
          c.lineTo(bx - 1.5, -37 - hgt);
          c.lineTo(bx + 1.5, -37 - hgt);
          c.lineTo(bx + 1.5, -37 - hgt * 0.85);
          c.quadraticCurveTo(bx + 4, -37 - hgt * 0.8, bx + 4, -37 - hgt * 0.6);
          c.lineTo(bx + 4, -37);
          c.closePath();
          c.fillStyle = "rgba(220,235,230,0.55)";
          c.fill();
          c.fillStyle = col;
          c.fillRect(bx - 4, -37 - hgt * 0.45, 8, hgt * 0.45);
          c.strokeStyle = INK;
          c.lineWidth = 1;
          c.stroke();
          c.fillStyle = "#9a7a52";
          c.fillRect(bx - 1.8, -39 - hgt, 3.6, 3);
          line(c, bx - 2.5, -37 - hgt * 0.4, bx - 2.5, -39, "rgba(255,255,255,0.5)", 1);
        }
      }
    } else if (k === "furnace") {
      const dome = () => {
        c.beginPath();
        c.moveTo(-28, 0);
        c.lineTo(-28, -30);
        c.quadraticCurveTo(-28, -58, 0, -60);
        c.quadraticCurveTo(28, -58, 28, -30);
        c.lineTo(28, 0);
        c.closePath();
      };
      dome();
      c.fillStyle = "#8a7e70";
      c.fill();
      c.save();
      c.clip();
      bricks(c, -30, -62, 30, 0, "rgba(70,60,52,0.7)");
      const gr = c.createLinearGradient(-28, 0, 28, 0);
      gr.addColorStop(0.5, "rgba(0,0,0,0)");
      gr.addColorStop(1, "rgba(0,0,0,0.3)");
      c.fillStyle = gr;
      c.fillRect(-30, -62, 60, 62);
      c.restore();
      dome();
      c.strokeStyle = INK;
      c.lineWidth = 2;
      c.stroke();
      c.fillStyle = "#76695d";
      c.fillRect(6, -82, 12, 26);
      c.strokeRect(6, -82, 12, 26);
      c.fillStyle = "#5d534a";
      c.fillRect(4, -85, 16, 4);
      c.strokeRect(4, -85, 16, 4);
      smoke(c, 12, -90, t, s.id, 0.7);
      const f = 0.8 + Math.sin(t * 8 + s.id) * 0.12;
      c.beginPath();
      c.moveTo(-11, 0);
      c.lineTo(-11, -13);
      c.arc(0, -13, 11, Math.PI, 0);
      c.lineTo(11, 0);
      c.closePath();
      const mg = c.createRadialGradient(0, -4, 1, 0, -6, 16);
      mg.addColorStop(0, "#fff2b8");
      mg.addColorStop(0.4, "#f39a3c");
      mg.addColorStop(1, "#7a2a16");
      c.globalAlpha = f;
      c.fillStyle = mg;
      c.fill();
      c.globalAlpha = 1;
      c.strokeStyle = INK;
      c.lineWidth = 2;
      c.stroke();
      glow(c, 0, -8, 34, "#ff9a4a", 0.25 * f);
    } else if (k === "forge") {
      c.fillStyle = "#7f6f62";
      c.fillRect(-34, -34, 42, 34);
      c.save();
      c.beginPath();
      c.rect(-34, -34, 42, 34);
      c.clip();
      bricks(c, -34, -34, 8, 0, "rgba(60,50,44,0.7)");
      c.restore();
      c.strokeStyle = INK;
      c.lineWidth = 2;
      c.strokeRect(-34, -34, 42, 34);
      ellipse(c, -13, -35, 17, 4.5, "#3a2a22");
      for (let i = 0; i < 6; i++)
        ellipse(c, -25 + i * 4.6, -36, 2.4, 1.8, i % 2 ? "#f59a3c" : "#2a2320");
      glow(c, -13, -40, 26, "#ff9a4a", 0.35 + Math.sin(t * 9) * 0.06);
      fillPoly(
        c,
        [
          [-37, -64],
          [11, -64],
          [4, -46],
          [-30, -46]
        ],
        "#6d625a",
        INK,
        1.8
      );
      c.fillStyle = "#62574e";
      c.fillRect(-20, -92, 14, 28);
      c.strokeRect(-20, -92, 14, 28);
      smoke(c, -13, -96, t, s.id, 0.8);
      c.fillStyle = "#6b513a";
      c.fillRect(17, -13, 14, 13);
      c.strokeRect(17, -13, 14, 13);
      fillPoly(
        c,
        [
          [9, -13],
          [36, -13],
          [36, -18],
          [44, -22],
          [36, -26],
          [12, -26],
          [6, -21]
        ],
        "#4d5257",
        INK,
        1.6
      );
      line(c, 12, -25.5, 36, -25.5, "#9aa3aa", 1.5);
    } else if (k === "effergy") {
      const spec = data_exports.BOSSES[Math.min(data_exports.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))], pulse2 = 0.5 + 0.5 * Math.sin(t * 2.4);
      glow(c, 0, -60, 80, spec.glow, 0.16 + pulse2 * 0.1);
      fillPoly(
        c,
        [
          [-32, 0],
          [-32, -9],
          [32, -9],
          [32, 0]
        ],
        "#46414d",
        INK,
        1.6
      );
      fillPoly(
        c,
        [
          [-24, -9],
          [-24, -17],
          [24, -17],
          [24, -9]
        ],
        "#3e3a45",
        INK,
        1.6
      );
      const ob = [
        [-14, -17],
        [-10, -88],
        [0, -100],
        [10, -88],
        [14, -17]
      ];
      fillPoly(c, ob, "#34303c", INK, 2);
      fillPoly(
        c,
        [
          [0, -100],
          [10, -88],
          [14, -17],
          [3, -17]
        ],
        "rgba(0,0,0,0.25)"
      );
      c.strokeStyle = rgba(spec.glow, 0.55 + pulse2 * 0.45);
      c.lineWidth = 1.6;
      const glyphs = [
        [
          [-4, 4],
          [0, -5],
          [4, 4],
          [0, 1],
          [-4, 4]
        ],
        [
          [2, -5],
          [-3, -2],
          [-3, 2],
          [2, 5],
          [-1, 0],
          [2, -5]
        ],
        [
          [-4, 0],
          [-2, -4],
          [2, -4],
          [4, 0],
          [0, 4],
          [-4, 0]
        ],
        [
          [-5, 0],
          [0, -3.5],
          [5, 0],
          [0, 3.5],
          [-5, 0]
        ]
      ];
      glyphs.forEach((pts, i) => {
        const ry = -30 - i * 15;
        c.beginPath();
        pts.forEach(([gx, gy], j) => j ? c.lineTo(gx, ry + gy) : c.moveTo(gx, ry + gy));
        c.stroke();
        if (i === 3) ellipse(c, 0, ry, 1.3, 1.3, rgba(spec.glow, 0.9));
      });
      const oy = -118 + Math.sin(t * 1.8) * 4;
      glow(c, 0, oy, 26, spec.glow, 0.5);
      ellipse(c, 0, oy, 7, 7, mix(spec.color, "#ffffff", 0.4), INK, 1.2);
      c.strokeStyle = rgba(spec.glow, 0.7);
      c.lineWidth = 1.2;
      c.beginPath();
      c.ellipse(0, oy, 15, 4, Math.sin(t) * 0.3, 0, TAU);
      c.stroke();
    } else if (k === "bedroll") {
      c.fillStyle = "#7c6a4c";
      c.beginPath();
      c.roundRect(-35, -9, 64, 9, 4);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.5;
      c.stroke();
      c.fillStyle = "#9a4f3c";
      c.beginPath();
      c.roundRect(-12, -13, 38, 9, 4);
      c.fill();
      c.stroke();
      c.fillStyle = "#b86a52";
      c.fillRect(-10, -12, 34, 2);
      for (const sx of [0, 12]) line(c, sx, -12.5, sx, -4.5, "#e3d3a8", 1.2);
      ellipse(c, 29, -7, 7, 7, "#9a4f3c", INK, 1.4);
      c.strokeStyle = "#6d3527";
      c.lineWidth = 1;
      c.beginPath();
      c.arc(29, -7, 4, 0, Math.PI * 1.6);
      c.stroke();
      c.fillStyle = "#d8c9a0";
      c.beginPath();
      c.roundRect(-33, -16, 18, 9, 4);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.3;
      c.stroke();
      line(c, -30, -13, -18, -13, "rgba(120,100,70,0.4)", 1);
    } else if (k === "farm_plot") {
      c.beginPath();
      c.moveTo(-31, -8);
      for (let i = 0; i < 6; i++) c.quadraticCurveTo(-26 + i * 10.3, -18, -21 + i * 10.3, -12);
      c.lineTo(31, -12);
      c.lineTo(31, -8);
      c.closePath();
      c.fillStyle = "#4a3a2a";
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.3;
      c.stroke();
      for (let i = 0; i < 6; i++)
        curve(c, -29 + i * 10.3, -13, -26 + i * 10.3, -16.5, -23 + i * 10.3, -13.5, "#6b5640", 1.2);
      c.fillStyle = "#6b5035";
      c.fillRect(-33, -10, 66, 10);
      c.strokeStyle = INK;
      c.lineWidth = 1.6;
      c.strokeRect(-33, -10, 66, 10);
      c.fillStyle = "#846444";
      c.fillRect(-32, -9, 64, 2);
      line(c, -11, -10, -11, 0, "#4f3a26", 1);
      line(c, 11, -10, 11, 0, "#4f3a26", 1);
      if (s.crop) {
        const grow = clamp2((g.s.elapsed - s.plantedAt) / 240), ripe = grow >= 1;
        for (const px of [-20, 0, 20]) {
          c.save();
          c.translate(px, -11);
          const hgt = 5 + grow * 22;
          if (s.crop === "wheat") {
            const col = mix("#7ea05a", "#dcb867", grow);
            for (let i = -1; i <= 1; i++) {
              curve(c, i, 0, i * 2, -hgt * 0.5, i * 3, -hgt, col, 1.3);
              if (grow > 0.5) ellipse(c, i * 3, -hgt - 3, 1.6, 4, col);
            }
          } else if (s.crop === "potato") {
            for (let i = 0; i < 5; i++)
              leaf(
                c,
                0,
                -1,
                4 + grow * 7,
                -Math.PI + 0.3 + i * 0.63,
                2.4,
                i % 2 ? "#5d8a4c" : "#79a35e"
              );
            if (ripe) ellipse(c, 0, -hgt * 0.4, 1.5, 1.5, "#c9b4df");
          } else {
            curve(c, 0, 0, 1, -hgt * 0.5, 0, -hgt * 0.8, "#4f7a45", 1.3);
            for (let i = 0; i < 3; i++) {
              leaf(c, 0, -hgt * 0.25 * (i + 1), 3 + grow * 4, -0.5, 2, "#79a35e");
              leaf(c, 0, -hgt * 0.25 * (i + 1), 3 + grow * 4, Math.PI + 0.5, 2, "#5d8a4c");
            }
          }
          c.restore();
        }
        if (ripe) {
          const sp = t * 0.7 % 1;
          line(c, -3, -40 + sp * 4, 3, -40 + sp * 4, rgba("#fff3c4", 1 - sp), 1.2);
          line(c, 0, -43 + sp * 4, 0, -37 + sp * 4, rgba("#fff3c4", 1 - sp), 1.2);
        }
      } else for (const px of [-20, 0, 20]) line(c, px, -10, px + 1, -18, "#8a7a55", 1.5);
    } else if (k === "rain_catcher") {
      for (const [a, b] of [
        [-26, -18],
        [26, 18]
      ]) {
        line(c, a, -56, b, 0, INK, 5);
        line(c, a, -56, b, 0, "#6b513a", 3);
      }
      fillPoly(
        c,
        [
          [-30, -58],
          [30, -58],
          [9, -38],
          [-9, -38]
        ],
        "#cbbb9a",
        INK,
        1.6
      );
      line(c, -20, -56, -6, -40, "rgba(120,100,70,0.5)", 1);
      line(c, 20, -56, 6, -40, "rgba(120,100,70,0.5)", 1);
      c.fillStyle = "#7a5a3c";
      c.beginPath();
      c.moveTo(-13, 0);
      c.quadraticCurveTo(-16, -16, -13, -32);
      c.lineTo(13, -32);
      c.quadraticCurveTo(16, -16, 13, 0);
      c.closePath();
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.8;
      c.stroke();
      for (const sx of [-6, 0, 6]) line(c, sx, -31, sx, -1, "rgba(50,35,22,0.5)", 1);
      for (const hy of [-6, -26]) line(c, -14.5, hy, 14.5, hy, "#55585a", 2.2);
      const fillLevel = clamp2(s.water / 8);
      ellipse(
        c,
        0,
        -32,
        13,
        3,
        fillLevel > 0.05 ? mix("#4f7f86", "#8fbcbf", fillLevel) : "#3a2c20",
        INK,
        1.2
      );
      if (["rain", "storm"].includes(g.s.weather)) {
        const d = t * 2.2 % 1;
        ellipse(c, 0, -38 + d * 6, 1.3, 2, "rgba(180,215,225,0.9)");
      }
    } else if (k === "lantern" || k === "crystal_lantern") {
      const crystal2 = k === "crystal_lantern", lit = crystal2 || s.fuel > 0, flick = crystal2 ? 0.5 + 0.5 * Math.sin(t * 2) : 0.8 + Math.sin(t * 13 + s.id) * 0.1;
      line(c, 0, 0, 0, -72, INK, 6);
      line(c, 0, 0, 0, -72, crystal2 ? "#5f6f7a" : "#5a4633", 4);
      line(c, -2, -68, 18, -68, INK, 4.5);
      line(c, -2, -68, 18, -68, crystal2 ? "#6d7f8a" : "#5a4633", 2.6);
      line(c, 15, -68, 15, -61, "#3f3a36", 1.2);
      const glass = lit ? crystal2 ? "#aef0ec" : "#ffd88a" : "#6d6a5e";
      if (lit)
        glow(c, 15, -50, crystal2 ? 46 : 40, crystal2 ? "#9fe8e4" : "#ffc46a", 0.3 * flick + 0.1);
      fillPoly(
        c,
        [
          [9, -61],
          [21, -61],
          [18, -64],
          [12, -64]
        ],
        "#3f3a36",
        INK,
        1
      );
      c.fillStyle = glass;
      c.fillRect(9.5, -61, 11, 15);
      if (crystal2) {
        c.save();
        c.translate(0, -48);
        crystalPrism(c, 15, 11, 2.5, 0, "#e6fffb", "#62bcc6");
        c.restore();
      } else if (lit) {
        c.save();
        c.translate(15, -48);
        flame(c, 2.4, 8 + Math.sin(t * 12) * 1.5, t, s.id, "#f5ad48");
        c.restore();
      }
      c.strokeStyle = INK;
      c.lineWidth = 1.3;
      c.strokeRect(9.5, -61, 11, 15);
      line(c, 15, -61, 15, -46, "rgba(60,50,40,0.6)", 1);
      fillPoly(
        c,
        [
          [8, -46],
          [22, -46],
          [20, -43],
          [10, -43]
        ],
        "#3f3a36",
        INK,
        1
      );
    } else if (k === "platform") {
      line(c, -26, 4, -14, 16, INK, 5);
      line(c, 26, 4, 14, 16, INK, 5);
      line(c, -26, 4, -14, 16, "#5d4d3c", 3);
      line(c, 26, 4, 14, 16, "#5d4d3c", 3);
      c.fillStyle = "#8a6b4a";
      c.beginPath();
      c.roundRect(-34, -4, 68, 8, 2);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.6;
      c.stroke();
      c.fillStyle = "#a9855c";
      c.fillRect(-33, -3, 66, 2);
      for (const px of [-17, 0, 17]) line(c, px, -4, px, 4, "rgba(50,35,22,0.6)", 1);
      for (const px of [-30, -21, -13, -4, 4, 13, 21, 30]) ellipse(c, px, 0.5, 0.8, 0.8, "#3a3230");
    } else if (k === "spike_trap") {
      const hit = g.s.elapsed - s.triggeredAt < 0.6, jolt = hit ? Math.sin(t * 60) * 1.2 : 0;
      c.fillStyle = "#6b5237";
      c.beginPath();
      c.roundRect(-31, -5, 62, 5, 1.5);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.4;
      c.stroke();
      for (let i = 0; i < 6; i++) {
        const sx = -25 + i * 10 + jolt;
        const gr = c.createLinearGradient(sx - 4, 0, sx + 4, 0);
        gr.addColorStop(0, "#d6d8d6");
        gr.addColorStop(1, "#6f7375");
        fillPoly(
          c,
          [
            [sx - 4, -5],
            [sx, -24],
            [sx + 4, -5]
          ],
          gr,
          INK,
          1.1
        );
        if (hit) ellipse(c, sx, -22, 1.4, 2, "#8e3b30");
      }
    } else if (k === "chest" || k === "icebox") {
      const ice = k === "icebox", body = ice ? "#9fb8bd" : "#7a5a3c", lid = ice ? "#c6dadf" : "#8b683f";
      c.fillStyle = body;
      c.fillRect(-24, -24, 48, 24);
      c.strokeStyle = INK;
      c.lineWidth = 1.8;
      c.strokeRect(-24, -24, 48, 24);
      for (const py of [-16, -8]) line(c, -23, py, 23, py, shade(body, -0.22), 1);
      c.fillStyle = lid;
      c.beginPath();
      c.moveTo(-26, -24);
      c.lineTo(-26, -29);
      c.quadraticCurveTo(0, -37, 26, -29);
      c.lineTo(26, -24);
      c.closePath();
      c.fill();
      c.stroke();
      const band = ice ? "#6f8a92" : "#4c4f52";
      for (const bx of [-17, 13]) {
        c.fillStyle = band;
        c.fillRect(bx, -33, 4, 33);
        ellipse(c, bx + 2, -4, 0.8, 0.8, "#aeb4b6");
        ellipse(c, bx + 2, -20, 0.8, 0.8, "#aeb4b6");
      }
      c.fillStyle = ice ? "#dfeef0" : "#c9a24e";
      c.fillRect(-4, -28, 8, 9);
      c.strokeStyle = INK;
      c.lineWidth = 1;
      c.strokeRect(-4, -28, 8, 9);
      ellipse(c, 0, -24.5, 1.2, 1.2, "#2e2a24");
      if (ice) {
        for (let i = 0; i < 3; i++) {
          const a = i / 3 * Math.PI;
          line(
            c,
            -12 + Math.cos(a) * 4,
            -12 + Math.sin(a) * 4,
            -12 - Math.cos(a) * 4,
            -12 - Math.sin(a) * 4,
            "#f4fbfb",
            1.1
          );
        }
        for (let i = 0; i < 3; i++) {
          const life = (t * 0.25 + i / 3) % 1;
          ellipse(
            c,
            -10 + i * 10 + life * 4,
            -2 + life * 2,
            5 + life * 8,
            2 + life * 2,
            `rgba(230,244,246,${0.35 * (1 - life)})`
          );
        }
      }
    } else if (k === "drying_rack") {
      for (const bx of [-26, 26]) {
        line(c, bx - 7, 0, bx + 3, -64, INK, 5);
        line(c, bx + 7, 0, bx - 3, -64, INK, 5);
        line(c, bx - 7, 0, bx + 3, -64, "#634b35", 3.2);
        line(c, bx + 7, 0, bx - 3, -64, "#634b35", 3.2);
      }
      line(c, -32, -58, 32, -58, INK, 5.5);
      line(c, -32, -58, 32, -58, "#6f553c", 3.6);
      for (let i = 0; i < 4; i++) {
        const hx = -15 + i * 10, sw = Math.sin(t * 1.4 + i) * 1.2, len = 20 + H(i, s.id) * 10;
        line(c, hx, -58, hx + sw * 0.3, -54, "#c9b58a", 1);
        c.save();
        c.translate(hx + sw * 0.3, -54);
        c.rotate(sw * 0.03);
        c.beginPath();
        c.moveTo(-3, 0);
        c.lineTo(3, 0);
        c.lineTo(2, len);
        c.lineTo(-2, len - 2);
        c.closePath();
        c.fillStyle = "#9a4f3c";
        c.fill();
        c.strokeStyle = INK;
        c.lineWidth = 1;
        c.stroke();
        line(c, -1, 3, 0, len - 4, "#d9a08a", 1);
        c.restore();
      }
    }
    c.restore();
  }

  // src/renderer/actors.ts
  var motion = /* @__PURE__ */ new Map();
  function track(id, x, y, hp, t) {
    let m = motion.get(id);
    if (!m) {
      if (motion.size > 600) motion.clear();
      m = { x, y, sy: y, t, walk: 0, move: 0, hp, hurt: -9 };
      motion.set(id, m);
    }
    const dx = Math.abs(x - m.x);
    if (dx > 60) m.x = x;
    m.walk += Math.min(dx, 12);
    m.move = lerp(m.move, dx > 0.12 ? 1 : 0, 0.22);
    if (hp < m.hp) m.hurt = t;
    m.hp = hp;
    m.x = x;
    const dt = Math.min(0.1, Math.max(0, t - m.t));
    m.t = t;
    m.sy = Math.abs(y - m.sy) > 80 ? y : m.sy + (y - m.sy) * Math.min(1, dt * 16);
    m.y = y;
    return m;
  }
  function drawDeer(c, m, t, phase) {
    const coat = "#a57a52", dark = "#6e4f36", belly = "#ead8b5", ph = m.walk * 0.14, sw = Math.sin(ph) * m.move, graze = (1 - m.move) * smooth(0.6, 0.9, Math.sin(t * 0.3 + phase));
    const legs = (far) => {
      const col = far ? shade(coat, -0.25) : coat, a = far ? -sw : sw;
      for (const [hx, off, bend] of [
        [-17, -a, -2],
        [15, a, 2]
      ]) {
        const fx = hx + off * 8, lift = Math.max(0, -off) * 3;
        limb(c, hx, -30, fx, -lift, bend, 5, 3, col);
        ellipse(c, fx, -0.5 - lift, 2.4, 1.6, "#3a2d24");
      }
    };
    const pivot = [15, -40], na = graze * 1.75, rx = 12, ry = -24, ex = pivot[0] + rx * Math.cos(na) - ry * Math.sin(na), ey = pivot[1] + rx * Math.sin(na) + ry * Math.cos(na), len = Math.hypot(ex - pivot[0], ey - pivot[1]), nx = -(ey - pivot[1]) / len * 5, ny = (ex - pivot[0]) / len * 5, headRot = graze * 1.25;
    const head = (fn) => () => {
      c.save();
      c.translate(ex, ey);
      c.rotate(headRot);
      fn();
      c.restore();
    };
    legs(true);
    inked(
      c,
      [
        () => smoothPath(c, [
          [-27, -37],
          [-22, -45],
          [-4, -44],
          [12, -47],
          [23, -40],
          [20, -29],
          [2, -26],
          [-17, -28]
        ]),
        () => polyPath(c, [
          [pivot[0] - 8, pivot[1] - 3],
          [ex - nx, ey - ny],
          [ex + nx, ey + ny],
          [pivot[0] + 8, pivot[1] + 8]
        ]),
        head(() => blobPath(c, 0, 0, 8, 6, 3, 0.05)),
        head(
          () => smoothPath(c, [
            [2, -5],
            [13, -1],
            [14, 3],
            [2, 5]
          ])
        )
      ],
      coat,
      3
    );
    c.save();
    smoothPath(c, [
      [-27, -37],
      [-22, -45],
      [-4, -44],
      [12, -47],
      [23, -40],
      [20, -29],
      [2, -26],
      [-17, -28]
    ]);
    c.clip();
    ellipse(c, 0, -25, 21, 5.5, belly);
    ellipse(c, 6, -44, 16, 3, shade(coat, 0.12));
    c.restore();
    fillPoly(
      c,
      [
        [-24, -42],
        [-29, -47],
        [-22, -45]
      ],
      "#f4ecd8",
      INK,
      1
    );
    c.save();
    c.translate(ex, ey);
    c.rotate(headRot);
    ellipse(c, 13, 1.5, 1.8, 1.6, "#2a2320");
    ellipse(c, 3, -1.5, 1.5, 1.5, "#1d1916");
    ellipse(c, 2.6, -2, 0.5, 0.5, "#ffffff");
    leaf(c, -4, -4, 10, -2.7, 3, dark);
    for (const [ox, col] of [
      [2.5, shade("#d9c8a2", -0.2)],
      [0, "#d9c8a2"]
    ]) {
      c.strokeStyle = INK;
      c.lineWidth = 3.4;
      c.lineCap = "round";
      for (const pass of [0, 1]) {
        if (pass) {
          c.strokeStyle = col;
          c.lineWidth = 1.8;
        }
        c.beginPath();
        c.moveTo(-1 + ox, -5);
        c.quadraticCurveTo(-3 + ox, -18, -11 + ox, -26);
        c.moveTo(-3.5 + ox, -15);
        c.lineTo(3 + ox, -22);
        c.moveTo(-7.5 + ox, -22);
        c.lineTo(-4 + ox, -31);
        c.stroke();
      }
    }
    c.restore();
    legs(false);
  }
  function drawWolf(c, m, t, a, coat, eye) {
    const dark = shade(coat, -0.3), belly = shade(coat, 0.35), ph = m.walk * 0.16, sw = Math.sin(ph) * m.move, crouch = a.warning > 0 ? 3 : 0, tailWag = Math.sin(t * 5 + a.phase) * 2 * (1 - m.move);
    const legs = (far) => {
      const col = far ? shade(coat, -0.28) : shade(coat, -0.05);
      const s = far ? -sw : sw;
      const bx = -16 - s * 8, fx = 14 + s * 8, by = -Math.max(0, s) * 3, fy = -Math.max(0, -s) * 3;
      limb(c, -16, -22 + crouch, bx, by - 1, -4, 7.5, 4, col);
      limb(c, 14, -22 + crouch, fx, fy - 1, 1, 6.5, 4, col);
      ellipse(c, bx + 1.5, by - 0.8, 3.4, 2, col, INK, 1);
      ellipse(c, fx + 1.5, fy - 0.8, 3.4, 2, col, INK, 1);
    };
    legs(true);
    c.save();
    c.translate(0, crouch);
    inked(
      c,
      [
        () => blobPath(c, 0, -26, 22, 9, 1, 0.05),
        () => blobPath(c, 12, -27, 12, 11, 2, 0.08),
        () => blobPath(c, -14, -27, 9, 9, 3, 0.05),
        () => smoothPath(c, [
          [-20, -30],
          [-34, -26 + tailWag],
          [-44, -14 + tailWag],
          [-38, -12 + tailWag],
          [-24, -21]
        ]),
        () => blobPath(c, 26, -34, 8.5, 7.5, 4, 0.05),
        () => polyPath(c, [
          [28, -38],
          [43, -33],
          [43, -28],
          [28, -27]
        ]),
        () => polyPath(c, [
          [21, -40],
          [23, -50],
          [28, -40]
        ]),
        () => polyPath(c, [
          [25, -40],
          [28, -49],
          [31, -39]
        ])
      ],
      coat,
      3
    );
    ellipse(c, -40, -13 + tailWag, 4, 2.6, belly);
    c.save();
    c.beginPath();
    c.ellipse(0, -26, 22, 9, 0, 0, TAU);
    c.clip();
    ellipse(c, 2, -18, 20, 4, belly);
    c.restore();
    for (let i = 0; i < 5; i++) leaf(c, 4 + i * 4, -34 + Math.abs(i - 2), 7, -2.2, 2, dark);
    fillPoly(
      c,
      [
        [33, -30],
        [43, -29],
        [43, -28],
        [30, -27]
      ],
      belly
    );
    ellipse(c, 43, -32, 1.8, 1.6, "#1b1716");
    ellipse(c, 30, -36, 1.6, 1.3, eye);
    if (a.warning > 0) {
      fillPoly(
        c,
        [
          [32, -28],
          [43, -28],
          [40, -23],
          [33, -25]
        ],
        "#3a1c1c"
      );
      for (let i = 0; i < 3; i++) line(c, 35 + i * 3, -28, 35.5 + i * 3, -26.5, "#f4efe2", 1);
    }
    c.restore();
    legs(false);
  }
  function drawBoar(c, m, t, a) {
    const coat = "#5e4a3b", dark = "#3b2e25", ph = m.walk * 0.22, sw = Math.sin(ph) * m.move;
    void t;
    const legs = (far) => {
      const col = far ? shade(coat, -0.28) : shade(coat, -0.05), s = far ? -sw : sw;
      limb(c, -15, -14, -15 - s * 6, 0, -1, 6, 4, col);
      limb(c, 13, -14, 13 + s * 6, 0, 1, 6, 4, col);
    };
    legs(true);
    inked(
      c,
      [
        () => smoothPath(c, [
          [-28, -14],
          [-26, -30],
          [-8, -38],
          [12, -40],
          [24, -30],
          [22, -11],
          [0, -8]
        ]),
        () => polyPath(c, [
          [16, -34],
          [34, -24],
          [39, -17],
          [35, -11],
          [18, -13]
        ]),
        () => polyPath(c, [
          [18, -34],
          [15, -43],
          [24, -36]
        ])
      ],
      coat,
      3
    );
    c.strokeStyle = dark;
    c.lineWidth = 1.3;
    c.beginPath();
    for (let i = 0; i < 12; i++) {
      const bx = -20 + i * 3.4, by = -33 - Math.sin(i / 11 * Math.PI) * 6 + (i > 8 ? (i - 8) * 1.5 : 0);
      c.moveTo(bx, by + 3);
      c.lineTo(bx - 1.5, by - 2);
    }
    c.stroke();
    ellipse(c, 38, -14.5, 2.4, 3.6, "#b88a7a", INK, 1);
    ellipse(c, 38.5, -15.5, 0.6, 0.8, "#3a2a24");
    ellipse(c, 38.5, -13.5, 0.6, 0.8, "#3a2a24");
    curve(c, 32, -12, 37, -14, 36, -21, "#efe5cb", 2.4);
    ellipse(c, 26, -27, 1.4, 1.4, a.warning > 0 ? "#e0624a" : "#1b1716");
    curve(c, -27, -20, -32, -22, -30, -26, dark, 1.3);
    legs(false);
  }
  function drawBat(c, t, a) {
    const flap = Math.sin(t * 15 + a.phase);
    c.translate(0, -24);
    for (const dir of [-1, 1]) {
      const tipY = -8 - flap * 13;
      const pts = [
        [dir * 4, -3],
        [dir * 14, -10 - flap * 8],
        [dir * 30, tipY],
        [dir * 26, tipY + 8],
        [dir * 20, 1 - flap * 4],
        [dir * 15, 4 - flap * 2],
        [dir * 9, 2],
        [dir * 4, 4]
      ];
      fillPoly(c, pts, dir > 0 ? "#4b4148" : "#3c3439", INK, 1.4);
      line(c, dir * 4, -3, dir * 30, tipY, "#2e272c", 1);
      line(c, dir * 14, -10 - flap * 8, dir * 20, 1 - flap * 4, "#2e272c", 0.8);
    }
    ellipse(c, 0, 0, 7, 9, "#5a4e52", INK, 1.5);
    ellipse(c, 4, -8, 5.5, 5, "#5a4e52", INK, 1.4);
    fillPoly(
      c,
      [
        [1, -11],
        [1.5, -18],
        [5, -12]
      ],
      "#5a4e52",
      INK,
      1
    );
    fillPoly(
      c,
      [
        [5, -12],
        [8, -18],
        [9, -10]
      ],
      "#5a4e52",
      INK,
      1
    );
    ellipse(c, 6.5, -8.5, 1.3, 1.3, "#f0b27a");
    glow(c, 6.5, -8.5, 5, "#f0b27a", 0.4);
  }
  function drawScorpion(c, m, t, a) {
    const coat = "#8c7355", dark = "#5d4a36", lite = "#b39570", sc = Math.sin(m.walk * 0.5) * m.move, raise = a.warning > 0 ? 6 : Math.sin(t * 2 + a.phase) * 1.5;
    for (const far of [true, false]) {
      for (let i = 0; i < 4; i++) {
        const off = (i % 2 ? 1 : -1) * sc * (far ? -3 : 3);
        limb(
          c,
          -8 + i * 6,
          -8,
          -16 + i * 10 + off,
          0,
          far ? -3 : 3,
          2.4,
          1.8,
          far ? dark : shade(coat, -0.1)
        );
      }
      if (far) {
        limb(c, 16, -10, 30, -17, 0, 3, 2.5, dark);
        blobPath(c, 36, -18, 6, 3.5, 8, 0.1);
        c.fillStyle = dark;
        c.fill();
      }
    }
    const bez = (u, p0, p1, p2, p3) => (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u * u * p2 + u ** 3 * p3;
    const tail = [];
    for (let i = 0; i <= 9; i++) {
      const u = i / 9;
      tail.push([
        bez(u, -15, -36, -38, -12),
        bez(u, -10, -14, -50 - raise, -47 - raise),
        6.2 - u * 2.6
      ]);
    }
    inked(
      c,
      tail.map(
        ([tx, ty, r]) => () => blobPath(c, tx, ty, r, r * 0.9, 5, 0.02)
      ),
      coat,
      2.8
    );
    tail.forEach(([tx, ty, r], i) => {
      if (i % 2) ellipse(c, tx - 0.8, ty - r * 0.35, r * 0.55, r * 0.28, lite);
    });
    const [sx, sy] = tail[tail.length - 1];
    fillPoly(
      c,
      [
        [sx + 2, sy - 3],
        [sx + 10, sy + 1],
        [sx + 7, sy + 10],
        [sx + 4, sy + 3]
      ],
      "#3a2c24",
      INK,
      1
    );
    for (let i = 0; i < 5; i++) ellipse(c, -12 + i * 6, -9, 6.5, 5.5 - i * 0.2, coat, INK, 1.4);
    for (let i = 0; i < 5; i++) ellipse(c, -12 + i * 6, -11, 4, 1.5, lite);
    ellipse(c, 16, -10, 8.5, 5.5, coat, INK, 1.6);
    limb(c, 18, -9, 30, -13, 0, 3.2, 2.6, coat);
    blobPath(c, 36, -14, 7, 4, 9, 0.1);
    c.fillStyle = coat;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.stroke();
    line(c, 38, -14, 44, -12, INK, 1.3);
    ellipse(c, 20, -13, 1.2, 1.2, "#1b1716");
  }
  function drawAnimal(c, g, a, x, y, t) {
    const m = track(a.id, a.x, a.y, a.hp, t), facing = Math.cos(a.angle) >= 0 ? 1 : -1, boss2 = a.type === "boss", hurt = t - m.hurt < 0.16;
    c.save();
    c.translate(x + (hurt ? Math.sin(t * 90) * 2 : 0), y + 1 + (m.sy - a.y));
    if (a.type !== "bat" && a.type !== "ember_bat")
      ellipse(
        c,
        0,
        0,
        boss2 ? 44 : a.type === "hellhound" ? 32 : 24,
        boss2 ? 6 : 4,
        "rgba(15,15,12,0.25)"
      );
    c.scale(facing, 1);
    if (hurt) c.filter = "brightness(1.9) saturate(0.4)";
    if (boss2) {
      const spec = data_exports.BOSSES[Math.min(data_exports.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))] || data_exports.BOSSES[0];
      glow(c, 0, -46, 90, spec.glow, 0.22 + Math.sin(t * 3) * 0.06);
      c.scale(1.75, 1.75);
      drawWolf(c, m, t, a, mix(spec.color, "#262430", 0.55), spec.glow);
      for (let i = 0; i < 5; i++)
        fillPoly(
          c,
          [
            [-12 + i * 6, -33],
            [-9 + i * 6, -42 - i % 2 * 3],
            [-6 + i * 6, -33]
          ],
          mix(spec.glow, "#2a2833", 0.4),
          INK,
          0.8
        );
      glow(c, 30, -36, 6, spec.glow, 0.8);
    } else if (a.type === "deer") drawDeer(c, m, t, a.phase);
    else if (a.type === "wolf")
      drawWolf(c, m, t, a, "#7b8284", a.warning > 0 ? "#e0624a" : "#e8c46a");
    else if (a.type === "boar") drawBoar(c, m, t, a);
    else if (a.type === "bat") drawBat(c, t, a);
    else if (a.type === "ember_bat") {
      glow(c, 0, -24, 34, "#ff7a2a", 0.35 + Math.sin(t * 9 + a.phase) * 0.1);
      c.filter = hurt ? "brightness(1.9)" : "sepia(1) saturate(3.2) hue-rotate(-28deg) brightness(0.85)";
      drawBat(c, t, a);
      c.filter = "none";
      glow(c, 5, -2, 5, "#ffd27a", 0.9);
    } else if (a.type === "hellhound") {
      glow(c, 0, -30, 70, "#ff4a1a", 0.18 + Math.sin(t * 4 + a.phase) * 0.05);
      c.scale(1.3, 1.3);
      drawWolf(c, m, t, a, "#5e2428", a.warning > 0 ? "#fff0a0" : "#ff7a2a");
      for (let i = 0; i < 4; i++) {
        const k = (t * 0.9 + i * 0.25 + a.phase) % 1;
        ellipse(c, -10 + i * 7, -40 - k * 26, 3 + k * 5, 2 + k * 4, rgba("#5a4442", 0.35 * (1 - k)));
      }
    } else if (a.type === "scorpion") drawScorpion(c, m, t, a);
    c.filter = "none";
    c.restore();
    const top = {
      deer: 100,
      wolf: 56,
      boar: 50,
      bat: 50,
      scorpion: 60,
      ember_bat: 50,
      hellhound: 76
    };
    if (!boss2 && a.hp < a.maxHp && a.hp > 0) {
      const by = y - (top[a.type] || 60) - 6;
      c.fillStyle = "rgba(30,25,20,0.65)";
      c.fillRect(x - 17, by, 34, 4);
      c.fillStyle = "#c0584a";
      c.fillRect(x - 16, by + 1, 32 * clamp2(a.hp / a.maxHp), 2);
    }
    if (a.warning > 0) {
      const by = y - (boss2 ? 118 : (top[a.type] || 60) + 16) + Math.sin(t * 12) * 1.5;
      ellipse(c, x, by, 7.5, 7.5, "#f1e3c0", INK, 1.6);
      c.fillStyle = "#b2402e";
      c.fillRect(x - 1.2, by - 4.5, 2.4, 6);
      c.fillRect(x - 1.2, by + 2.5, 2.4, 2.2);
    }
  }
  function drawWeapon(c, weapon, t) {
    if (weapon === "fists") return;
    if (weapon.includes("spear")) {
      line(c, -16, 0, 34, 0, INK, 4.4);
      line(c, -16, 0, 34, 0, "#7a5a3c", 2.6);
      const head = weapon.startsWith("copper") ? "#c07a45" : "#5d6468";
      fillPoly(
        c,
        [
          [33, -3.5],
          [46, 0],
          [33, 3.5],
          [30, 0]
        ],
        head,
        INK,
        1.2
      );
      line(c, 28, -2, 31, 2, "#d8c79a", 1.2);
      return;
    }
    const dark = weapon === "obsidian_blade" || weapon === "eclipse_blade", blade = weapon === "steel_sword" ? "#dfe3e6" : dark ? "#221f2a" : "#c3c7ca", edge = weapon === "eclipse_blade" ? "#9fe8f0" : weapon === "obsidian_blade" ? "#a07fd0" : "#ffffff";
    line(c, -6, 0, 3, 0, INK, 4.5);
    line(c, -6, 0, 3, 0, "#5a3f2a", 2.8);
    line(c, 3, -5, 3, 5, INK, 4);
    line(c, 3, -5, 3, 5, dark ? "#4a4252" : "#9a8a60", 2.4);
    fillPoly(
      c,
      [
        [4, -2.6],
        [30, -1.6],
        [36, 0],
        [30, 1.6],
        [4, 2.6]
      ],
      blade,
      INK,
      1.2
    );
    line(c, 5, -1.2, 32, -0.6, edge, 1);
    if (weapon === "eclipse_blade") glow(c, 22, 0, 18, "#9fe8f0", 0.35 + Math.sin(t * 5) * 0.1);
  }
  function drawPlayer(c, p, x, y, t) {
    const m = track(-1, p.x, p.y, 0, t), facing = Math.cos(p.face) >= 0 ? 1 : -1, shaft = data_exports.inShaft(p.x, p.y) && p.y > data_exports.surfaceAt(p.x) + 8, climbing = shaft && !p.grounded, air = !p.grounded && !climbing, walking = p.grounded ? m.move : 0, ph = m.walk * 0.12, sw = Math.sin(ph) * walking, bob = Math.abs(Math.cos(ph)) * walking * 1.6, breath = Math.sin(t * 2.2) * 0.5 * (1 - walking);
    const coat = p.coat ? "#8a6e4e" : "#5d7560", coatDark = shade(coat, -0.25), pants = "#4a4e4f", boot = p.boots ? "#6b5139" : "#3e342c", skin = "#d0a17c";
    const attackStart = p.attackAt - 0.52, prog = clamp2((t - attackStart) / 0.3), attacking = t >= attackStart && t < attackStart + 0.3, spear = p.weapon.includes("spear");
    c.save();
    if (p.invuln > 0 && Math.sin(t * 40) > 0.3) c.globalAlpha = 0.55;
    c.translate(x, y);
    if (p.grounded) ellipse(c, 0, 1, 16, 3.5, "rgba(15,15,12,0.28)");
    c.scale(facing, 1);
    c.translate(0, -bob + (climbing ? 0 : 0));
    const climbPh = climbing ? Math.sin(p.y * 0.12) : 0;
    const legFoot = (front) => {
      if (air) return front ? [8, -8] : [-5, -1];
      if (climbing) return [front ? 4 : -4, (front ? climbPh : -climbPh) * 4 - 2];
      const s = front ? sw : -sw;
      return [s * 10, -Math.max(0, -s) * 4];
    };
    const drawLeg = (front) => {
      const [fx, fy] = legFoot(front), hx = front ? 3 : -3;
      limb(c, hx, -23, fx, fy - 3, front ? 3 : 2, 6.5, 5.5, front ? pants : shade(pants, -0.2));
      c.fillStyle = front ? boot : shade(boot, -0.15);
      c.beginPath();
      c.roundRect(fx - 4, fy - (p.boots ? 7 : 5), 10, p.boots ? 8 : 6, 2.5);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.3;
      c.stroke();
    };
    const shoulder = [1, -42 + breath];
    const armAngle = (front) => {
      if (climbing) return front ? 2.15 + climbPh * 0.35 : 2.5 - climbPh * 0.35;
      if (air) return front ? 1.9 : -0.6;
      return (front ? -sw : sw) * 0.7 + 0.1;
    };
    const drawArm = (front, a, reach = 0) => {
      const L = 9.5, ex = shoulder[0] + Math.sin(a) * L, ey = shoulder[1] + Math.cos(a) * L, a2 = a + (front ? 0.5 : 0.35), hx = ex + Math.sin(a2) * (L + reach), hy2 = ey + Math.cos(a2) * (L + reach);
      const col = front ? coat : coatDark;
      limb(c, shoulder[0], shoulder[1], hx, hy2, 0, 6, 5, col);
      void ex;
      void ey;
      ellipse(c, hx, hy2, 2.9, 2.9, front ? skin : shade(skin, -0.15), INK, 1.1);
      return [hx, hy2, a2];
    };
    drawArm(false, armAngle(false));
    drawLeg(false);
    c.fillStyle = "#7a6446";
    c.beginPath();
    c.roundRect(-18, -46 + breath, 11, 22, 3);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.stroke();
    c.fillStyle = "#8e7552";
    c.fillRect(-18, -46 + breath, 11, 7);
    ellipse(c, -12.5, -48 + breath, 7.5, 3.6, "#8a8f6a", INK, 1.3);
    line(c, -15, -51 + breath, -15, -44.5 + breath, "#5a4a32", 1);
    line(c, -10, -51 + breath, -10, -44.5 + breath, "#5a4a32", 1);
    if (p.cloak) {
      const flow = walking * (4 + Math.sin(t * 8) * 2) + (air ? 6 : 0);
      fillPoly(
        c,
        [
          [-4, -45 + breath],
          [-18 - flow, -12],
          [-12 - flow * 0.6, -9],
          [-2, -18]
        ],
        "#4b5566",
        INK,
        1.5
      );
    }
    drawLeg(true);
    c.beginPath();
    c.moveTo(-7, -45 + breath);
    c.lineTo(8, -45 + breath);
    c.lineTo(9.5, p.coat ? -18 : -22);
    c.lineTo(-8.5, p.coat ? -18 : -22);
    c.closePath();
    c.fillStyle = coat;
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    fillPoly(
      c,
      [
        [3, -45 + breath],
        [8, -45 + breath],
        [9.5, p.coat ? -18 : -22],
        [4, p.coat ? -18 : -22]
      ],
      "rgba(0,0,0,0.12)"
    );
    c.fillStyle = "#4a3a2a";
    c.fillRect(-8.5, -27, 18, 3.2);
    c.fillStyle = "#c9a24e";
    c.fillRect(3, -27, 3, 3.2);
    if (p.coat) {
      ellipse(c, 0, -45 + breath, 9, 3.5, "#d9ccb0", INK, 1.2);
      line(c, 1, -42, 1, -19, "rgba(60,40,25,0.5)", 1);
    }
    const hy = -54 + breath;
    ellipse(c, -6, hy + 1, 4, 5, "#4a372b");
    ellipse(c, 1, hy, 8.5, 8.8, skin, INK, 1.5);
    ellipse(c, -3.5, hy + 0.5, 2.2, 2.8, shade(skin, -0.12), INK, 0.9);
    ellipse(c, 5, hy - 0.5, 1.2, 1.5, "#2a2320");
    ellipse(c, 5.4, hy - 1, 0.4, 0.4, "#ffffff");
    fillPoly(
      c,
      [
        [8.5, hy - 0.5],
        [11, hy + 2.5],
        [8.5, hy + 3]
      ],
      skin
    );
    ellipse(c, 5.5, hy + 3.5, 1.8, 1, "rgba(200,110,90,0.35)");
    line(c, 5.8, hy + 5.4, 8, hy + 5, "#7a4f3e", 0.9);
    c.fillStyle = "#a8553f";
    c.beginPath();
    c.roundRect(-6, hy + 7, 13, 5, 2);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.2;
    c.stroke();
    const flutter = Math.sin(t * 9) * 2 * (walking + (air ? 1 : 0)) + walking * 3;
    fillPoly(
      c,
      [
        [-5, hy + 8],
        [-12 - flutter, hy + 10 + flutter * 0.2],
        [-11 - flutter, hy + 14],
        [-4, hy + 11]
      ],
      "#984a36",
      INK,
      1
    );
    ellipse(c, 1, hy - 6.5, 14, 2.8, "#6b5539", INK, 1.4);
    c.beginPath();
    c.moveTo(-7, hy - 6.5);
    c.lineTo(-6, hy - 13);
    c.quadraticCurveTo(1, hy - 17, 8, hy - 13);
    c.lineTo(8.5, hy - 6.5);
    c.closePath();
    c.fillStyle = "#7d6444";
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.4;
    c.stroke();
    c.fillStyle = "#4d3b2a";
    c.fillRect(-6.8, hy - 9.5, 15, 2.4);
    if (attacking && !spear) {
      const eased = 1 - Math.pow(1 - prog, 3), a = lerp(2.7, 0.35, eased);
      const [hx2, hy2, a2] = drawArm(true, a);
      const wa = Math.atan2(Math.cos(a2), Math.sin(a2)) - Math.PI / 2 - 0.2;
      c.strokeStyle = `rgba(246,238,214,${0.55 * (1 - prog)})`;
      c.lineWidth = 7;
      c.lineCap = "round";
      c.beginPath();
      c.arc(shoulder[0], shoulder[1], 34, -2.2, lerp(-2.2, 1, eased));
      c.stroke();
      c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - prog)})`;
      c.lineWidth = 1.5;
      c.stroke();
      c.save();
      c.translate(hx2, hy2);
      c.rotate(wa);
      drawWeapon(c, p.weapon, t);
      c.restore();
    } else {
      const thrust = attacking && spear ? Math.sin(prog * Math.PI) * 9 : 0;
      const a = attacking && spear ? 1.35 : armAngle(true);
      const [hx2, hy2, a2] = drawArm(true, a, thrust * 0.4);
      c.save();
      c.translate(hx2 + thrust * 0.6, hy2);
      c.rotate(
        spear ? attacking ? -0.05 : -0.35 : Math.atan2(Math.cos(a2), Math.sin(a2)) - Math.PI / 2 - 0.45
      );
      if (!climbing) drawWeapon(c, p.weapon, t);
      c.restore();
      if (attacking && (spear || p.weapon === "fists")) {
        const a3 = 0.6 * (1 - prog);
        line(c, 16 + thrust, -36, 34 + thrust * 2, -36, `rgba(246,238,214,${a3})`, 3);
        line(c, 18 + thrust, -40, 30 + thrust * 2, -42, `rgba(246,238,214,${a3 * 0.7})`, 2);
      }
    }
    c.restore();
  }

  // src/renderer/atmosphere.ts
  var mask = null;
  function collectLights(g, menu2, t) {
    const lights = [];
    const p = g.s.player;
    if (!menu2) lights.push({ x: p.x, y: p.y - 30, r: 260, color: "#e8d4a0", warm: 0.1 });
    for (const s of g.s.structures) {
      const f = Math.sin(t * 11 + s.id) * 6 + Math.sin(t * 17) * 4;
      if (s.type === "campfire" && s.fuel > 0)
        lights.push({ x: s.x, y: s.y - 22, r: 250 + f, color: "#ffa850", warm: 0.34 });
      else if (s.type === "lantern" && s.fuel > 0)
        lights.push({ x: s.x + 15, y: s.y - 50, r: 220 + f * 0.5, color: "#ffc46a", warm: 0.28 });
      else if (s.type === "crystal_lantern")
        lights.push({ x: s.x + 15, y: s.y - 50, r: 280, color: "#8fe3df", warm: 0.26 });
      else if (s.type === "furnace" || s.type === "forge")
        lights.push({ x: s.x, y: s.y - 20, r: 150 + f * 0.3, color: "#ff9a4a", warm: 0.22 });
      else if (s.type === "effergy")
        lights.push({ x: s.x, y: s.y - 80, r: 170, color: "#c9b2e8", warm: 0.2 });
    }
    for (const n of g.s.nodes)
      if (n.hp > 0 && n.kind === "crystal")
        lights.push({ x: n.x, y: n.y - 16, r: 95, color: "#8fe3df", warm: 0.18 });
      else if (n.hp > 0 && n.kind === "hellstone")
        lights.push({ x: n.x, y: n.y - 12, r: 120, color: "#ff6a2a", warm: 0.3 });
    for (const a of g.s.animals)
      if (!a.deadUntil && (a.type === "hellhound" || a.type === "ember_bat"))
        lights.push({
          x: a.x,
          y: a.y - (a.type === "hellhound" ? 34 : 24),
          r: a.type === "hellhound" ? 150 : 110,
          color: "#ff5a1f",
          warm: 0.32
        });
    return lights;
  }
  function drawLighting(c, g, cam, w, h, menu2, tod) {
    const night2 = Math.min(0.7, (1 - daylight(tod)) * 0.66 + overcastOf(g) * 0.14), t = g.s.elapsed;
    let caveVisible = false;
    for (let sx = 0; sx <= w; sx += 64)
      if (data_exports.surfaceAt(sx + cam.x) - cam.y + 90 < h) caveVisible = true;
    if (night2 < 0.02 && !caveVisible) return;
    const mw = Math.ceil(w / 2), mh = Math.ceil(h / 2);
    if (!mask) mask = document.createElement("canvas");
    if (mask.width !== mw || mask.height !== mh) {
      mask.width = mw;
      mask.height = mh;
    }
    const m = mask.getContext("2d");
    m.setTransform(0.5, 0, 0, 0.5, 0, 0);
    m.globalCompositeOperation = "source-over";
    m.clearRect(0, 0, w, h);
    if (night2 > 0) {
      m.fillStyle = `rgba(8,14,26,${night2})`;
      m.fillRect(0, 0, w, h);
    }
    if (caveVisible) {
      m.beginPath();
      m.moveTo(-20, h + 20);
      let avg = 0, count = 0;
      for (let sx = -32; sx <= w + 32; sx += 32) {
        const sy = data_exports.surfaceAt(sx + cam.x) - cam.y + 70;
        avg += sy;
        count++;
        m.lineTo(sx, sy);
      }
      m.lineTo(w + 20, h + 20);
      m.closePath();
      avg /= count;
      const gr = m.createLinearGradient(0, avg, 0, avg + 380);
      gr.addColorStop(0, "rgba(5,7,11,0)");
      gr.addColorStop(1, `rgba(5,7,11,${0.7 - night2 * 0.25})`);
      m.fillStyle = gr;
      m.fill();
    }
    const lavaLights = [];
    if (cam.y + h > 3400) {
      for (let tx = Math.floor(cam.x / T) - 4; tx <= Math.ceil((cam.x + w) / T) + 4; tx += 3)
        for (let ty = Math.max(0, Math.floor(cam.y / T) - 4); ty <= Math.ceil((cam.y + h) / T) + 4; ty++) {
          const x = tx * T + T / 2, y = ty * T + T / 2;
          if (!g.tileAt(tx, ty) && data_exports.lavaAt(x, y)) {
            const flicker = Math.sin(t * 3 + tx) * 10;
            lavaLights.push({ x, y: y - 20, r: 230 + flicker, color: "#ff7a2a", warm: 0.5 });
            break;
          }
        }
    }
    const lights = [...collectLights(g, menu2, t), ...lavaLights].filter(
      (l) => l.x - cam.x > -l.r && l.x - cam.x < w + l.r && l.y - cam.y > -l.r && l.y - cam.y < h + l.r
    );
    m.globalCompositeOperation = "destination-out";
    for (const l of lights) {
      const sx = l.x - cam.x, sy = l.y - cam.y, gr = m.createRadialGradient(sx, sy, l.r * 0.15, sx, sy, l.r);
      gr.addColorStop(0, "rgba(0,0,0,0.95)");
      gr.addColorStop(0.45, "rgba(0,0,0,0.7)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      m.fillStyle = gr;
      m.fillRect(sx - l.r, sy - l.r, l.r * 2, l.r * 2);
    }
    c.drawImage(mask, 0, 0, w, h);
    const hell = smooth(data_exports.LAYERS[3].top - 350, data_exports.LAYERS[4].top + 300, cam.y + h / 2);
    if (hell > 0) {
      c.fillStyle = rgba("#8a1a0c", 0.05 + hell * 0.08);
      c.fillRect(0, 0, w, h);
    }
    const dark = Math.max(night2, caveVisible ? 0.5 : 0);
    c.save();
    c.globalCompositeOperation = "lighter";
    for (const l of lights)
      glow(c, l.x - cam.x, l.y - cam.y, l.r * 0.7, l.color, l.warm * (0.35 + dark));
    c.restore();
  }
  function drawWeather(c, g, cam, w, h, menu2, fx, tod) {
    const t = g.s.elapsed, weather = g.s.weather, biome = data_exports.biomeAt(fx, 0).id, cold2 = biome === "tundra" || biome === "alpine", wet = weather === "rain" || weather === "storm", surfaceY = data_exports.surfaceAt(fx) - cam.y, under = !menu2 && g.s.player.y > data_exports.surfaceAt(g.s.player.x) + 150;
    if (under) return;
    const bottom = Math.min(h, surfaceY + 260);
    if (wet && !cold2) {
      const n = weather === "storm" ? 240 : 150, slant = weather === "storm" ? 9 : 5;
      c.strokeStyle = "rgba(200,218,222,0.45)";
      c.lineWidth = 1;
      c.beginPath();
      for (let i = 0; i < n; i++) {
        const len = 12 + H(i, 6) * 10, x = ((H(i, 4) * w * 1.3 + t * 60 * slant * 0.2 - cam.x * 0.2) % (w + 80) + w + 80) % (w + 80) - 40, y = (H(i, 5) * bottom + t * (620 + H(i, 7) * 200)) % bottom;
        c.moveTo(x, y);
        c.lineTo(x - slant, y + len);
      }
      c.stroke();
      if (weather === "storm") {
        const beat = Math.floor(t * 1.7), ph = t * 1.7 - beat;
        if (H(beat, 77) > 0.9 && ph < 0.25) {
          c.fillStyle = `rgba(235,240,255,${0.35 * (1 - ph / 0.25)})`;
          c.fillRect(0, 0, w, h);
        }
      }
    }
    if (cold2) {
      const n = wet ? 170 : weather === "cloudy" ? 70 : 34;
      c.fillStyle = "rgba(248,250,252,0.85)";
      for (let i = 0; i < n; i++) {
        const r = 1 + H(i, 3) * 1.8, x = ((H(i, 1) * w + Math.sin(t * 0.8 + i) * 18 + t * (wet ? 40 : 14) - cam.x * 0.3) % (w + 40) + w + 40) % (w + 40) - 20, y = (H(i, 2) * bottom + t * (28 + H(i, 5) * 30)) % bottom;
        c.fillRect(x, y, r, r);
      }
    }
    const night2 = 1 - daylight(tod);
    if (["meadow", "marsh", "forest"].includes(biome) && night2 > 0.3 && !wet)
      for (let i = 0; i < 16; i++) {
        const x = ((H(i, 1) * 1800 - cam.x + Math.sin(t * 0.4 + i) * 40) % 1800 + 1800) % 1800, y = surfaceY - 20 - H(i, 2) * 90 + Math.sin(t * 0.9 + i * 2) * 12, blink = Math.max(0, Math.sin(t * 2 + i * 1.7));
        if (x > w) continue;
        glow(c, x, y, 9, "#e8f08a", 0.55 * blink * night2);
        ellipse(c, x, y, 1.2, 1.2, `rgba(245,250,190,${blink * night2})`);
      }
    if ((biome === "desert" || biome === "badlands") && !wet)
      for (let i = 0; i < 30; i++) {
        const x = ((H(i, 1) * w + t * (20 + H(i, 3) * 25)) % (w + 20) + w + 20) % (w + 20) - 10, y = surfaceY - H(i, 2) * 200 + Math.sin(t + i) * 6;
        ellipse(c, x, y, 1, 1, "rgba(240,220,180,0.45)");
      }
    if ((biome === "forest" || biome === "taiga") && !wet)
      for (let i = 0; i < 7; i++) {
        const life = (t * 0.07 + H(i, 9)) % 1, x = ((H(i, 1) * w + life * 160 + Math.sin(life * 12 + i) * 30) % w + w) % w, y = surfaceY - 240 + life * 260;
        c.save();
        c.translate(x, y);
        c.rotate(Math.sin(life * 14 + i) * 1.2);
        ellipse(c, 0, 0, 3.2, 1.6, biome === "taiga" ? "#8a8a4e" : "#b48a3e");
        c.restore();
      }
  }

  // src/renderer/effects.ts
  var particles = [];
  var MAX_PARTICLES = 500;
  var rand = 1;
  var rnd = () => (rand = rand * 16807 % 2147483647) / 2147483647;
  var ITEM_COLOR = {
    wood: "#8a6440",
    resin: "#d99a3c",
    honey: "#dcaa4e",
    stone: "#8b8f8a",
    flint: "#3d4246",
    clay: "#b06f55",
    dirt: "#76604a",
    salt: "#e8e4da",
    copper_ore: "#c07a4a",
    iron_ore: "#9a7866",
    coal: "#2c2c30",
    ice: "#bfe3ee",
    obsidian: "#2a2433",
    sulfur: "#e0c94a",
    crystal: "#8fe3df",
    hellstone: "#d2402a",
    fiber: "#8fa35a",
    reeds: "#a4a86a",
    herb: "#5f9a55",
    willow: "#8a7a5a",
    berry: "#b8324a",
    wheat: "#d9b75a",
    potato: "#b99468",
    mushroom: "#c9a07a",
    cactus_fruit: "#d8577a",
    raw_meat: "#c65a5a",
    hide: "#a47c55",
    bone: "#e6dcc6",
    chitin: "#5a4032",
    venom: "#7bc05a",
    feathers: "#eef0ea"
  };
  var colorOf = (item) => ITEM_COLOR[item] ?? "#a89878";
  function emit(p, now, delay = 0) {
    particles.push({
      vx: 0,
      vy: 0,
      spin: 0,
      angle: rnd() * TAU,
      size: 3,
      color: "#8a6440",
      kind: "chip",
      life: 0.9,
      gravity: 700,
      ...p,
      born: now + delay
    });
    if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
  }
  var burst = (e, now, n, make, delay = 0) => {
    for (let i = 0; i < n; i++) emit({ x: e.x, y: e.y, ...make(i) }, now, delay);
  };
  function spawnEffects(g, events, now = performance.now() / 1e3) {
    for (const e of events) {
      const art = artAt(e.x, e.y), leaves = art.leaves?.length ? art.leaves : ["#5e7a45", "#7c9656"];
      if (e.type === "chip") {
        if (e.kind === "water")
          burst(e, now, 7, () => ({
            kind: "drop",
            vx: (rnd() - 0.5) * 140,
            vy: -120 - rnd() * 120,
            size: 2 + rnd() * 1.5,
            color: "#9fd0e4",
            life: 0.6
          }));
        else if (e.kind === "wood" || e.kind === "resin" || e.kind === "honey") {
          burst(e, now, 6, () => ({
            vx: (rnd() - 0.5) * 220,
            vy: -140 - rnd() * 160,
            spin: (rnd() - 0.5) * 20,
            size: 2.5 + rnd() * 2,
            color: rnd() < 0.5 ? "#c9a878" : "#8a6440"
          }));
          burst({ x: e.x, y: e.y - 40 }, now, 3, () => ({
            kind: "leaf",
            vx: (rnd() - 0.5) * 60,
            vy: -20 - rnd() * 30,
            size: 3 + rnd() * 2,
            color: leaves[Math.floor(rnd() * leaves.length)],
            life: 2.2,
            gravity: 60
          }));
        } else if (data_exports.NODES[e.kind]?.tool === "pick")
          burst(e, now, 7, () => ({
            vx: (rnd() - 0.5) * 240,
            vy: -120 - rnd() * 170,
            spin: (rnd() - 0.5) * 16,
            size: 2 + rnd() * 2.5,
            color: rnd() < 0.6 ? colorOf(e.kind) : "#9a9d97",
            life: 0.8
          }));
        else
          burst(e, now, 4, () => ({
            kind: "leaf",
            vx: (rnd() - 0.5) * 80,
            vy: -60 - rnd() * 60,
            size: 2.5 + rnd() * 1.5,
            color: rnd() < 0.5 ? colorOf(e.kind) : leaves[0],
            life: 1.4,
            gravity: 120
          }));
      } else if (e.type === "fell") {
        const dir = e.dir ?? 1;
        for (let i = 0; i < 26; i++) {
          const along = 30 + rnd() * 110;
          emit(
            {
              x: e.x + dir * along,
              y: e.y - 10 - rnd() * 40,
              kind: "leaf",
              vx: (rnd() - 0.5) * 120 + dir * 30,
              vy: -60 - rnd() * 90,
              size: 3 + rnd() * 2.5,
              color: leaves[Math.floor(rnd() * leaves.length)],
              life: 2.4,
              gravity: 70
            },
            now,
            0.95
          );
        }
        for (let i = 0; i < 6; i++)
          emit(
            {
              x: e.x + dir * (20 + i * 22),
              y: e.y - 4,
              kind: "dust",
              vx: dir * 20 + (rnd() - 0.5) * 30,
              vy: -18,
              size: 10 + rnd() * 8,
              color: "#b9a88a",
              life: 1.1,
              gravity: 0
            },
            now,
            1
          );
      } else if (e.type === "crumble" || e.type === "dig") {
        const color = e.type === "dig" ? DIG_COLOR[+e.kind] ?? "#6a6660" : colorOf(e.kind);
        burst(e, now, e.type === "dig" ? 9 : 16, () => ({
          vx: (rnd() - 0.5) * 300,
          vy: -150 - rnd() * 220,
          spin: (rnd() - 0.5) * 14,
          size: 2.5 + rnd() * (e.type === "dig" ? 3 : 5),
          color: rnd() < 0.7 ? color : shade(color, -0.25),
          life: 1.1
        }));
        burst(e, now, 3, () => ({
          kind: "dust",
          vx: (rnd() - 0.5) * 60,
          vy: -30,
          size: 12 + rnd() * 10,
          color: e.type === "dig" && +e.kind >= 9 ? "#4a2a22" : "#a8a092",
          life: 0.9,
          gravity: 0
        }));
        if (e.kind === "hellstone" || e.kind === "9" || e.kind === "10")
          burst(e, now, 8, () => ({
            kind: "spark",
            vx: (rnd() - 0.5) * 200,
            vy: -120 - rnd() * 160,
            size: 1.6,
            color: "#ffb347",
            life: 0.8,
            gravity: 300
          }));
      } else if (e.type === "pickup") {
        const p = g.s.player;
        emit(
          {
            x: p.x,
            y: p.y - 26,
            kind: "ring",
            size: 8,
            color: colorOf(e.kind),
            life: 0.35,
            gravity: 0
          },
          now
        );
      } else if (e.type === "sizzle")
        burst(e, now, 10, () => ({
          kind: rnd() < 0.5 ? "spark" : "dust",
          vx: (rnd() - 0.5) * 80,
          vy: -80 - rnd() * 120,
          size: rnd() < 0.5 ? 1.8 : 9,
          color: rnd() < 0.5 ? "#ffc46a" : "#5a4a44",
          life: 0.9,
          gravity: -40
        }));
    }
  }
  var DIG_COLOR = {
    1: "#76604a",
    2: "#6d7277",
    3: "#c9ad7f",
    4: "#5c6656",
    5: "#b7ccd2",
    6: "#9a5f4a",
    8: "#434d5f",
    9: "#5e3b35",
    10: "#6a2530"
  };
  function drawParticles(c, cam, now = performance.now() / 1e3) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i], age = now - p.born;
      if (age < 0) continue;
      if (age > p.life) {
        particles.splice(i, 1);
        continue;
      }
      const x = p.x + p.vx * age - cam.x + (p.kind === "leaf" ? Math.sin(age * 5 + p.angle) * 10 : 0), y = p.y + p.vy * age + 0.5 * p.gravity * age * age - cam.y, fade = 1 - age / p.life;
      if (p.kind === "dust") {
        ellipse(
          c,
          x,
          y,
          p.size * (1 + age * 1.6),
          p.size * 0.6 * (1 + age),
          rgba(p.color, 0.3 * fade)
        );
      } else if (p.kind === "ring") {
        c.beginPath();
        c.arc(x, y, p.size + age * 70, 0, TAU);
        c.strokeStyle = rgba(p.color, 0.8 * fade);
        c.lineWidth = 2;
        c.stroke();
      } else if (p.kind === "spark") {
        glow(c, x, y, 7, p.color, 0.6 * fade);
        ellipse(c, x, y, p.size, p.size, rgba("#fff2c0", fade));
      } else if (p.kind === "drop") {
        ellipse(c, x, y, p.size * 0.8, p.size * 1.2, rgba(p.color, 0.85 * fade));
      } else {
        c.save();
        c.translate(x, y);
        c.rotate(p.angle + p.spin * age);
        c.globalAlpha = Math.min(1, fade * 1.6);
        if (p.kind === "leaf") ellipse(c, 0, 0, p.size, p.size * 0.5, p.color, INK, 0.6);
        else
          fillPoly(
            c,
            [
              [-p.size, -p.size * 0.6],
              [p.size * 0.8, -p.size * 0.8],
              [p.size, p.size * 0.7],
              [-p.size * 0.6, p.size]
            ],
            p.color,
            INK,
            0.7
          );
        c.restore();
      }
    }
  }
  function drawItemIcon(c, item, seed) {
    const col = colorOf(item);
    if (item === "wood") {
      for (const [dx, dy] of [
        [-4, 2],
        [4, 2],
        [0, -4]
      ]) {
        c.save();
        c.translate(dx, dy);
        c.fillStyle = col;
        c.strokeStyle = INK;
        c.lineWidth = 1.2;
        c.beginPath();
        c.roundRect(-8, -3.2, 16, 6.4, 3);
        c.fill();
        c.stroke();
        ellipse(c, 7, 0, 2.4, 3, "#d8b888", INK, 0.9);
        line(c, -5, -1, 3, -1, shade(col, -0.25), 0.8);
        c.restore();
      }
    } else if (["berry", "cactus_fruit"].includes(item)) {
      for (const [dx, dy] of [
        [-3, 1],
        [3, 1],
        [0, -3],
        [0, 3]
      ])
        ellipse(c, dx, dy, 3.4, 3.4, col, INK, 0.9);
      ellipse(c, -1, -4, 1, 1, "#ffe6ec");
    } else if (["fiber", "reeds", "herb", "wheat", "willow", "feathers"].includes(item)) {
      for (let i = -2; i <= 2; i++) line(c, i * 1.6, 7, i * 3.2, -8, INK, 2.6);
      for (let i = -2; i <= 2; i++) line(c, i * 1.6, 7, i * 3.2, -8, col, 1.6);
      line(c, -5, 1, 5, 1, "#6b4f37", 2);
    } else if (item === "crystal") {
      fillPoly(
        c,
        [
          [-5, 6],
          [-3, -6],
          [0, -9],
          [3, -6],
          [5, 6]
        ],
        col,
        INK,
        1
      );
      glow(c, 0, 0, 14, col, 0.35);
    } else if (item === "bone") {
      line(c, -7, 3, 7, -3, INK, 5);
      line(c, -7, 3, 7, -3, col, 3);
      for (const [x, y] of [
        [-7, 3],
        [7, -3]
      ])
        ellipse(c, x, y, 2.6, 2.6, col, INK, 0.8);
    } else if (["raw_meat", "hide", "potato", "mushroom", "honey", "resin", "venom"].includes(item)) {
      c.beginPath();
      c.ellipse(0, 0, 8, 5.5, -0.3, 0, TAU);
      c.fillStyle = col;
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.1;
      c.stroke();
      ellipse(c, -2.5, -2, 2.6, 1.4, rgba("#ffffff", 0.25));
    } else {
      const pts = [];
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * TAU, r = 7 + H(seed, i) * 3;
        pts.push([Math.cos(a) * r, Math.sin(a) * r * 0.75]);
      }
      const ore = item.endsWith("_ore") || item === "hellstone";
      fillPoly(c, pts, ore ? "#7c7a74" : col, INK, 1.1);
      if (ore)
        for (let i = 0; i < 4; i++)
          ellipse(c, (H(seed, i + 9) - 0.5) * 9, (H(seed, i + 19) - 0.5) * 6, 1.9, 1.5, col);
      ellipse(c, -2, -3, 2.6, 1.2, rgba("#ffffff", 0.22));
      if (item === "hellstone") glow(c, 0, 0, 16, "#ff5a1f", 0.45);
      if (item === "ice") glow(c, 0, 0, 12, "#dff6ff", 0.2);
    }
  }
  function drawDrops(c, g, cam, w, h, t) {
    for (const d of g.s.drops) {
      if (t < d.born) continue;
      const x = d.x - cam.x, y = d.y - cam.y;
      if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;
      const bob = d.resting ? Math.sin(t * 2.6 + d.id) * 1.5 : 0;
      c.save();
      c.translate(x, y - 10 + bob);
      if (d.resting) ellipse(c, 0, 10 - bob, 11, 2.6, "rgba(15,15,12,0.25)");
      c.scale(1.3, 1.3);
      glow(c, 0, 0, 16, "#fff1c8", 0.12 + Math.sin(t * 3 + d.id) * 0.05);
      drawItemIcon(c, d.item, d.id);
      if (d.qty > 1) {
        c.font = "bold 11px sans-serif";
        c.textAlign = "left";
        c.lineWidth = 3;
        c.strokeStyle = "rgba(25,20,15,0.85)";
        c.strokeText("\xD7" + d.qty, 7, 11);
        c.fillStyle = "#f4ecd8";
        c.fillText("\xD7" + d.qty, 7, 11);
      }
      c.restore();
    }
  }

  // src/renderer/Renderer.ts
  function draw(c, g, cam, w, h, menu2 = false) {
    const t = g.s.elapsed, tod = g.timeOfDay(), fx = menu2 ? cam.x + w / 2 : g.s.player.x;
    c.clearRect(0, 0, w, h);
    drawSky(c, g, cam, w, h, fx, tod);
    drawTerrain(c, g, cam, w, h);
    drawLadders(c, cam, w, h);
    const visible = (o, pad2 = 140) => o.x > cam.x - pad2 && o.x < cam.x + w + pad2 && o.y > cam.y - 40 && o.y < cam.y + h + 220;
    for (const n of g.s.nodes)
      if (treeNode(n.kind) && visible(n, 160)) drawTree(c, n, n.x - cam.x, n.y - cam.y, t);
    for (const n of g.s.nodes)
      if (!treeNode(n.kind) && visible(n) && (n.hp > 0 || n.kind !== "water"))
        drawNode(c, n, n.x - cam.x, n.y - cam.y, t);
    for (const cache of g.s.caches)
      if (!cache.opened && visible(cache)) drawCache(c, cache, cache.x - cam.x, cache.y - cam.y, t);
    for (const s of g.s.structures)
      if (visible(s)) drawStructure(c, g, s, s.x - cam.x, s.y - cam.y, t);
    for (const a of g.s.animals)
      if (!a.deadUntil && visible(a)) drawAnimal(c, g, a, a.x - cam.x, a.y - cam.y, t);
    drawDrops(c, g, cam, w, h, t);
    if (!menu2) drawPlayer(c, g.s.player, g.s.player.x - cam.x, g.s.player.y - cam.y, t);
    drawParticles(c, cam);
    drawLighting(c, g, cam, w, h, menu2, tod);
    drawWeather(c, g, cam, w, h, menu2, fx, tod);
    const vignette = c.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.75);
    vignette.addColorStop(0, "rgba(40,32,22,0)");
    vignette.addColorStop(1, "rgba(30,22,18,0.32)");
    c.fillStyle = vignette;
    c.fillRect(0, 0, w, h);
  }

  // src/audio/theory.ts
  var LETTERS = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  function noteToMidi(name) {
    const m = /^([a-g])(#{1,2}|b{1,2})?(-?\d)$/.exec(name);
    if (!m) throw new Error(`Bad note "${name}"`);
    const acc = m[2] ? m[2][0] === "#" ? m[2].length : -m[2].length : 0;
    return (Number(m[3]) + 1) * 12 + LETTERS[m[1]] + acc;
  }
  var midiToHz = (midi) => 440 * 2 ** ((midi - 69) / 12);
  var QUALITIES = {
    "": [0, 4, 7],
    m: [0, 3, 7],
    "5": [0, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    "6": [0, 4, 7, 9],
    m6: [0, 3, 7, 9],
    "7": [0, 4, 7, 10],
    m7: [0, 3, 7, 10],
    maj7: [0, 4, 7, 11],
    m7b5: [0, 3, 6, 10],
    dim7: [0, 3, 6, 9],
    add9: [0, 4, 7, 14],
    madd9: [0, 3, 7, 14],
    "9": [0, 4, 7, 10, 14],
    m9: [0, 3, 7, 10, 14],
    maj9: [0, 4, 7, 11, 14],
    "7sus4": [0, 5, 7, 10]
  };
  var pitchClass = (letter, acc = "") => (LETTERS[letter.toLowerCase()] + (acc === "#" ? 1 : acc === "b" ? -1 : 0) + 12) % 12;
  function parseChord(symbol) {
    const m = /^([A-G])(#|b)?([^/]*)(?:\/([A-G])(#|b)?)?$/.exec(symbol);
    if (!m || !(m[3] in QUALITIES)) throw new Error(`Bad chord "${symbol}"`);
    const root = pitchClass(m[1], m[2]);
    return {
      root,
      bass: m[4] ? pitchClass(m[4], m[5]) : root,
      intervals: QUALITIES[m[3]]
    };
  }
  function chordTones(chord, low) {
    let base = low - ((low - chord.root) % 12 + 12) % 12;
    if (base < low) base += 12;
    return chord.intervals.map((i) => base + i);
  }
  function pitchAtOrAbove(pc, low) {
    return low + ((pc - low) % 12 + 12) % 12;
  }
  function voiceChord(chord, center, previous) {
    const pcs = chord.intervals.map((i) => (chord.root + i) % 12);
    const size = Math.min(pcs.length, 4);
    const candidates = [];
    for (let inv = 0; inv < pcs.length; inv++) {
      for (let start2 = center - 14; start2 <= center + 2; start2++) {
        if ((start2 % 12 + 12) % 12 !== pcs[inv]) continue;
        const notes = [start2];
        for (let k = 1; k < size; k++)
          notes.push(pitchAtOrAbove(pcs[(inv + k) % pcs.length], notes[k - 1] + 1));
        candidates.push(notes);
      }
    }
    const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
    const cost = (v) => previous && previous.length === v.length ? v.reduce((sum, n, i) => sum + Math.abs(n - previous[i]), 0) + Math.abs(mean(v) - center) * 0.35 : Math.abs(mean(v) - center);
    return candidates.reduce((best, v) => cost(v) < cost(best) ? v : best);
  }

  // src/audio/instruments.ts
  var PartOut = class {
    k;
    node;
    rate;
    sides;
    osc;
    constructor(k, node, rate) {
      this.k = k;
      this.node = node;
      this.rate = rate;
    }
    spread() {
      if (!this.sides) {
        this.sides = [-0.7, 0.7].map((v) => {
          const p = this.k.ctx.createStereoPanner();
          p.pan.value = v;
          p.connect(this.node);
          return p;
        });
      }
      return this.sides;
    }
    get left() {
      return this.spread()[0];
    }
    get right() {
      return this.spread()[1];
    }
    /** Unit-amplitude sine at the instrument's vibrato rate, running for the part's lifetime. */
    get lfo() {
      if (!this.osc) {
        this.osc = this.k.ctx.createOscillator();
        this.osc.frequency.value = this.rate;
        this.osc.start();
      }
      return this.osc;
    }
    dispose() {
      this.osc?.stop();
    }
  };
  var kits = /* @__PURE__ */ new WeakMap();
  function pulseWave(ctx2, duty) {
    const n = 48, real = new Float32Array(n), imag = new Float32Array(n);
    for (let i = 1; i < n; i++) real[i] = 2 * Math.sin(Math.PI * i * duty) / (Math.PI * i);
    return ctx2.createPeriodicWave(real, imag);
  }
  function organWave(ctx2) {
    const ranks = {
      1: 1,
      2: 0.75,
      3: 0.45,
      4: 0.55,
      5: 0.2,
      6: 0.3,
      8: 0.35
    }, n = 12, real = new Float32Array(n), imag = new Float32Array(n);
    for (const [h, a] of Object.entries(ranks)) imag[+h] = a;
    return ctx2.createPeriodicWave(real, imag);
  }
  function shaper(amount) {
    const curve5 = new Float32Array(1024);
    for (let i = 0; i < curve5.length; i++) {
      const x = i / (curve5.length - 1) * 2 - 1;
      curve5[i] = Math.tanh(amount * x) / Math.tanh(amount);
    }
    return curve5;
  }
  function kit(ctx2) {
    let k = kits.get(ctx2);
    if (!k) {
      const noise3 = ctx2.createBuffer(1, ctx2.sampleRate * 2, ctx2.sampleRate);
      const data = noise3.getChannelData(0);
      let seed = 1;
      for (let i = 0; i < data.length; i++) {
        seed = seed * 16807 % 2147483647;
        data[i] = seed / 2147483647 * 2 - 1;
      }
      k = {
        ctx: ctx2,
        noise: noise3,
        pulse25: pulseWave(ctx2, 0.25),
        pulse12: pulseWave(ctx2, 0.125),
        organ: organWave(ctx2),
        drive: shaper(2.2),
        fuzz: shaper(14)
      };
      kits.set(ctx2, k);
    }
    return k;
  }
  function osc(k, shape, freq, t, end, detune = 0) {
    const o = k.ctx.createOscillator();
    if (typeof shape === "string") o.type = shape;
    else o.setPeriodicWave(shape);
    o.frequency.value = freq;
    o.detune.value = detune;
    o.start(t);
    o.stop(end);
    return o;
  }
  function noise(k, t, end) {
    const n = k.ctx.createBufferSource();
    n.buffer = k.noise;
    n.loop = true;
    n.start(t, t * 7.31 % 1.5);
    n.stop(end);
    return n;
  }
  function filter(k, type, freq, q = 0.7) {
    const f = k.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = Math.min(freq, k.ctx.sampleRate / 2);
    f.Q.value = q;
    return f;
  }
  function gain(k, value) {
    const g = k.ctx.createGain();
    g.gain.value = value;
    return g;
  }
  function adsr(k, t, dur, a, d, s, r, peak) {
    const g = k.ctx.createGain(), p = g.gain, at = Math.max(2e-3, Math.min(a, dur * 0.9));
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(peak, t + at);
    p.setTargetAtTime(peak * s, t + at, d / 3 + 1e-3);
    p.setTargetAtTime(0, t + Math.max(dur, at), r / 3 + 1e-3);
    return { g, end: t + Math.max(dur, at) + r * 2.5 + 0.02 };
  }
  function adsrN(n, k, t, dur, a, d, s, r, peak) {
    const envs = Array.from({ length: n }, () => adsr(k, t, dur, a, d, s, r, peak));
    return { gs: envs.map((e) => e.g), end: envs[0].end };
  }
  function perc(k, t, peak, decay, attack = 2e-3) {
    const g = k.ctx.createGain(), p = g.gain;
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(peak, t + attack);
    p.setTargetAtTime(0, t + attack, decay / 3.5);
    return { g, end: t + attack + decay * 2 + 0.02 };
  }
  function vibrato(out, oscs, f, t, cents, delay = 0.2) {
    const depth = out.k.ctx.createGain(), hzDepth = f * (2 ** (cents / 1200) - 1);
    depth.gain.setValueAtTime(0, t);
    depth.gain.setValueAtTime(0, t + delay);
    depth.gain.linearRampToValueAtTime(hzDepth, t + delay + 0.35);
    out.lfo.connect(depth);
    for (const o of oscs) depth.connect(o.frequency);
    oscs[0].addEventListener("ended", () => depth.disconnect());
  }
  function insertChain(...nodes) {
    for (let i = 1; i < nodes.length; i++) nodes[i - 1].connect(nodes[i]);
    return { input: nodes[0], output: nodes[nodes.length - 1] };
  }
  var hz = midiToHz;
  var pulse = {
    cutoff: 7500,
    vibrato: 5.6,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 6e-3, 0.3, 0.7, 0.12, 0.17 * v);
      const a = osc(k, k.pulse25, f, t, end), b = osc(k, k.pulse25, f, t, end, 7);
      if (dur > 0.25) vibrato(out, [a, b], f, t, 11, 0.18);
      a.connect(g);
      b.connect(g);
      g.connect(out.node);
    }
  };
  var square = {
    cutoff: 3500,
    vibrato: 5.2,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.01, 0.25, 0.75, 0.1, 0.13 * v);
      const o = osc(k, "square", f, t, end);
      if (dur > 0.25) vibrato(out, [o], f, t, 9, 0.2);
      o.connect(g).connect(out.node);
    }
  };
  var supersaw = {
    cutoff: 6500,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const {
        gs: [l, r],
        end
      } = adsrN(2, k, t, dur, 0.01, 0.5, 0.75, 0.25, 0.05 * v);
      [-20, -9, 0, 9, 20].forEach((c, i) => {
        const o = k.ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = f;
        o.detune.value = c;
        o.start(t + i * 7e-4);
        o.stop(end);
        if (i !== 1 && i !== 3) o.connect(l);
        if (i !== 0 && i !== 4) o.connect(r);
      });
      l.connect(out.left);
      r.connect(out.right);
    }
  };
  var pad = {
    cutoff: 2200,
    vibrato: 4.3,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const {
        gs: [l, r, c],
        end
      } = adsrN(3, k, t, dur, 0.5, 1.4, 0.85, 1.1, 0.035 * v);
      const a = osc(k, "sawtooth", f, t, end, -9), b = osc(k, "sawtooth", f, t, end, 9);
      vibrato(out, [a, b], f, t, 6, 0.1);
      a.connect(l).connect(out.left);
      b.connect(r).connect(out.right);
      osc(k, "triangle", f, t, end).connect(c).connect(out.node);
    }
  };
  var strings = {
    cutoff: 4e3,
    vibrato: 5.3,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const {
        gs: [l, r],
        end
      } = adsrN(2, k, t, dur, 0.07, 0.6, 0.85, 0.3, 0.065 * v);
      const a = osc(k, "sawtooth", f, t, end, -6), b = osc(k, "sawtooth", f, t, end, 6), c = osc(k, "triangle", f, t, end);
      if (dur > 0.3) vibrato(out, [a, b, c], f, t, 11, 0.25);
      a.connect(l);
      c.connect(l);
      b.connect(r);
      c.connect(r);
      l.connect(out.left);
      r.connect(out.right);
    }
  };
  var tremolo = {
    cutoff: 3600,
    insert: (k) => {
      const trem = gain(k, 0.6), lfo = k.ctx.createOscillator(), depth = gain(k, 0.4);
      lfo.type = "triangle";
      lfo.frequency.value = 12.5;
      lfo.start();
      lfo.connect(depth).connect(trem.gain);
      return { input: trem, output: trem };
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const {
        gs: [l, r],
        end
      } = adsrN(2, k, t, dur, 0.06, 0.4, 0.9, 0.25, 0.06 * v);
      osc(k, "sawtooth", f, t, end, -7).connect(l).connect(out.left);
      osc(k, "sawtooth", f, t, end, 7).connect(r).connect(out.right);
    }
  };
  var pizz = {
    cutoff: 5e3,
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      const bright = perc(k, t, 0.1 * v, 0.1), body = perc(k, t, 0.2 * v, 0.32);
      osc(k, "sawtooth", f, t, bright.end).connect(bright.g).connect(out.node);
      osc(k, "triangle", f, t, body.end).connect(body.g).connect(out.node);
    }
  };
  var pluck = {
    cutoff: 4500,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m), ring = Math.max(0.35, Math.min(dur * 1.6, 1.5));
      const bright = perc(k, t, 0.07 * v, 0.14), body = perc(k, t, 0.17 * v, ring);
      osc(k, "sawtooth", f, t, bright.end, 4).connect(bright.g).connect(out.node);
      osc(k, "triangle", f, t, body.end).connect(body.g).connect(out.node);
    }
  };
  var harp = {
    cutoff: 5e3,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m), ring = Math.max(0.8, Math.min(dur * 2, 2.2));
      const body = perc(k, t, 0.16 * v, ring), shine = perc(k, t, 0.04 * v, ring * 0.5);
      osc(k, "triangle", f, t, body.end).connect(body.g).connect(out.node);
      osc(k, "sine", f * 2, t, shine.end).connect(shine.g).connect(out.node);
    }
  };
  var oud = {
    cutoff: 6e3,
    insert: (k) => {
      const nasal = filter(k, "peaking", 1800, 1.4);
      nasal.gain.value = 6;
      return { input: nasal, output: nasal };
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m), ring = Math.max(0.3, Math.min(dur * 1.4, 0.9));
      const bright = perc(k, t, 0.09 * v, 0.12), body = perc(k, t, 0.1 * v, ring);
      const a = osc(k, "sawtooth", f, t, bright.end, 3), b = osc(k, "sawtooth", f, t, body.end, -8), c = osc(k, "triangle", f, t, body.end);
      for (const o of [a, b, c]) {
        o.frequency.setValueAtTime(f * 1.012, t);
        o.frequency.exponentialRampToValueAtTime(f, t + 0.04);
      }
      a.connect(bright.g).connect(out.node);
      const lv = gain(k, 0.4);
      b.connect(lv).connect(body.g);
      c.connect(body.g);
      body.g.connect(out.node);
    }
  };
  var flute = {
    vibrato: 5,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.06, 0.25, 0.85, 0.14, 0.13 * v);
      const a = osc(k, "sine", f, t, end), b = osc(k, "triangle", f, t, end), bl = gain(k, 0.22);
      if (dur > 0.25) vibrato(out, [a, b], f, t, 13, 0.18);
      const breath = noise(k, t, end), bp = filter(k, "bandpass", f * 2, 1.6), bg = gain(k, 0.16);
      a.connect(g);
      b.connect(bl).connect(g);
      breath.connect(bp).connect(bg).connect(g);
      g.connect(out.node);
    }
  };
  var ocarina = {
    vibrato: 5.4,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.035, 0.2, 0.9, 0.12, 0.15 * v);
      const a = osc(k, "sine", f, t, end), b = osc(k, "sine", f * 2, t, end), bl = gain(k, 0.07);
      if (dur > 0.25) vibrato(out, [a, b], f, t, 10, 0.2);
      a.connect(g);
      b.connect(bl).connect(g);
      g.connect(out.node);
    }
  };
  var reed = {
    cutoff: 2600,
    vibrato: 4.8,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.025, 0.2, 0.85, 0.09, 0.08 * v);
      const o = osc(k, "square", f, t, end);
      if (dur > 0.3) vibrato(out, [o], f, t, 8, 0.25);
      o.connect(g).connect(out.node);
    }
  };
  var shawm = {
    cutoff: 5500,
    vibrato: 6.2,
    insert: (k) => {
      const nasal = filter(k, "peaking", 1400, 1.5);
      nasal.gain.value = 9;
      return { input: nasal, output: nasal };
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.02, 0.15, 0.9, 0.07, 0.06 * v);
      const o = osc(k, k.pulse12, f, t, end);
      o.frequency.setValueAtTime(f * 0.965, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
      if (dur > 0.2) vibrato(out, [o], f, t, 24, 0.15);
      o.connect(g).connect(out.node);
    }
  };
  var brass = {
    cutoff: 5e3,
    vibrato: 5,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const body = adsr(k, t, dur, 0.05, 0.4, 0.85, 0.18, 0.075 * v), blare = adsr(k, t, dur, 0.08, 0.35, 0.35, 0.12, 0.045 * v), dark = filter(k, "lowpass", Math.min(f * 2.5, 2400), 0.6);
      const oscs = [-7, 0, 7].map((c) => osc(k, "sawtooth", f, t, body.end, c));
      for (const o of oscs) {
        o.frequency.setValueAtTime(f * 0.98, t);
        o.frequency.linearRampToValueAtTime(f, t + 0.06);
        o.connect(dark);
        o.connect(blare.g);
      }
      if (dur > 0.35) vibrato(out, oscs, f, t, 8, 0.3);
      dark.connect(body.g).connect(out.node);
      blare.g.connect(out.node);
    }
  };
  function fmBell(k, out, t, f, v, ratio, index, modDecay, decay, peak) {
    const { g, end } = perc(k, t, peak * v, decay);
    const car = osc(k, "sine", f, t, end), mod = osc(k, "sine", f * ratio, t, t + modDecay * 2.5), mg = k.ctx.createGain();
    mg.gain.setValueAtTime(f * index, t);
    mg.gain.exponentialRampToValueAtTime(f * index * 0.01, t + modDecay * 2.5);
    mod.connect(mg).connect(car.frequency);
    car.connect(g).connect(out);
    return end;
  }
  var bell = {
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      fmBell(k, out.node, t, f, v, 3.5, 2.2, 0.12, 1.5, 0.11);
      const { g, end } = perc(k, t, 0.03 * v, 0.35);
      osc(k, "sine", f * 4, t, end).connect(g).connect(out.node);
    }
  };
  var musicbox = {
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      fmBell(k, out.node, t, f, v, 5, 1.1, 0.06, 1, 0.12);
      const { g, end } = perc(k, t, 0.025 * v, 0.5);
      osc(k, "sine", f * 2, t, end).connect(g).connect(out.node);
    }
  };
  var crystal = {
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      fmBell(k, out.left, t, f, v, 2.41, 1.6, 0.6, 2.6, 0.06);
      fmBell(k, out.right, t, f * 1.004, v, 3.01, 0.6, 0.3, 2.2, 0.05);
    }
  };
  var marimba = {
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      const body = perc(k, t, 0.22 * v, 0.5), tone2 = perc(k, t, 0.06 * v, 0.07);
      osc(k, "sine", f, t, body.end).connect(body.g).connect(out.node);
      osc(k, "sine", f * 3.93, t, tone2.end).connect(tone2.g).connect(out.node);
    }
  };
  var epiano = {
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 3e-3, 1.6, 0.35, 0.3, 0.14 * v);
      const car = osc(k, "sine", f, t, end), mod = osc(k, "sine", f, t, end), mg = k.ctx.createGain();
      mg.gain.setValueAtTime(f * 1.3, t);
      mg.gain.exponentialRampToValueAtTime(f * 0.12, t + 0.8);
      mod.connect(mg).connect(car.frequency);
      car.connect(g).connect(out.node);
      const tine = perc(k, t, 0.025 * v, 0.08);
      osc(k, "sine", f * 7, t, tine.end).connect(tine.g).connect(out.node);
    }
  };
  var organ = {
    cutoff: 7e3,
    vibrato: 6.4,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.035, 0.2, 0.92, 0.18, 0.075 * v);
      const a = osc(k, k.organ, f, t, end), b = osc(k, k.organ, f, t, end, 5);
      vibrato(out, [a, b], f, t, 5, 0.05);
      a.connect(g);
      b.connect(g);
      g.connect(out.node);
      const chiff = perc(k, t, 0.05 * v, 0.06), bp = filter(k, "bandpass", Math.min(f * 4, 9e3), 2);
      noise(k, t, t + 0.12).connect(bp).connect(chiff.g).connect(out.node);
    }
  };
  function formants(k, vowel) {
    const input = gain(k, 1), output = gain(k, 1);
    for (const [freq, q, level] of vowel) {
      const bp = filter(k, "bandpass", freq, q);
      input.connect(bp).connect(gain(k, level)).connect(output);
    }
    return { input, output };
  }
  var chant = {
    vibrato: 4.6,
    insert: (k) => formants(k, [
      [430, 7, 1],
      [820, 8, 0.6],
      [2700, 10, 0.12]
    ]),
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const {
        gs: [l, r],
        end
      } = adsrN(2, k, t, dur, 0.09, 0.4, 0.85, 0.3, 0.2 * v);
      const oscs = [-10, 0, 10].map((c) => osc(k, "sawtooth", f, t, end, c));
      if (dur > 0.4) vibrato(out, oscs, f, t, 9, 0.3);
      oscs[0].connect(l);
      oscs[1].connect(l);
      oscs[1].connect(r);
      oscs[2].connect(r);
      l.connect(out.left);
      r.connect(out.right);
    }
  };
  var toll = {
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      for (const [ratio, level, decay] of [
        [0.5, 0.5, 5],
        [1, 0.8, 4],
        [1.2, 0.45, 2.6],
        [1.5, 0.3, 2.2],
        [2, 0.5, 1.8],
        [2.66, 0.2, 1]
      ]) {
        const e = perc(k, t, 0.06 * v * level, decay, 4e-3);
        osc(k, "sine", f * ratio, t, e.end).connect(e.g).connect(out.node);
      }
      click(k, out.node, t, 2400, 0.08 * v, 0.05, 1.5);
    }
  };
  var choir = {
    vibrato: 5,
    insert: (k) => {
      const input = gain(k, 1), output = gain(k, 1);
      for (const [freq, q, level] of [
        [730, 6, 1],
        [1090, 7, 0.55],
        [2440, 9, 0.25]
      ]) {
        const bp = filter(k, "bandpass", freq, q);
        input.connect(bp).connect(gain(k, level)).connect(output);
      }
      return { input, output };
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const {
        gs: [l, r],
        end
      } = adsrN(2, k, t, dur, 0.35, 0.8, 0.9, 0.8, 0.13 * v);
      const oscs = [-8, 0, 8].map((c) => osc(k, "sawtooth", f, t, end, c));
      vibrato(out, oscs, f, t, 12, 0.25);
      oscs[0].connect(l);
      oscs[1].connect(l);
      oscs[1].connect(r);
      oscs[2].connect(r);
      l.connect(out.left);
      r.connect(out.right);
    }
  };
  var howl = {
    vibrato: 5.5,
    insert: (k) => {
      const bp = filter(k, "bandpass", 950, 1.2);
      return { input: bp, output: bp };
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.3, 0.3, 0.9, 0.5, 0.2 * v);
      const oscs = [osc(k, "sawtooth", f, t, end), osc(k, "triangle", f, t, end)];
      for (const o of oscs) {
        o.frequency.setValueAtTime(f * 0.72, t);
        o.frequency.exponentialRampToValueAtTime(f, t + 0.4);
        o.frequency.setValueAtTime(f, t + dur * 0.7);
        o.frequency.exponentialRampToValueAtTime(f * 0.8, t + dur + 0.3);
        o.connect(g);
      }
      vibrato(out, oscs, f, t, 18, 0.4);
      g.connect(out.node);
    }
  };
  var orchhit = {
    voice: (k, out, t, m, _dur, v) => {
      const f = hz(m);
      const { g, end } = perc(k, t, 0.14 * v, 0.5);
      const lp = filter(k, "lowpass", 7e3, 1);
      lp.frequency.setValueAtTime(7e3, t);
      lp.frequency.exponentialRampToValueAtTime(800, t + 0.35);
      for (const [ratio, det] of [
        [1, -5],
        [1.5, 4],
        [2, 6],
        [3, -3],
        [0.5, 0]
      ])
        osc(k, "sawtooth", f * ratio, t, end, det).connect(lp);
      const n = noise(k, t, t + 0.2), bp = filter(k, "bandpass", 1500, 1), ng = perc(k, t, 0.6, 0.12);
      n.connect(bp).connect(ng.g).connect(lp);
      lp.connect(g).connect(out.node);
    }
  };
  var guitar = {
    cutoff: 3400,
    insert: (k) => {
      const pre = gain(k, 3), ws = k.ctx.createWaveShaper(), mid = filter(k, "peaking", 700, 1), post = gain(k, 0.2);
      ws.curve = k.fuzz;
      mid.gain.value = -5;
      return insertChain(pre, ws, mid, post);
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m), muted = dur < 0.16;
      const { g, end } = adsr(k, t, dur, 3e-3, 0.3, muted ? 0.25 : 0.85, 0.06, 0.3 * v);
      const a = osc(k, "sawtooth", f, t, end, -9), b = osc(k, muted ? "triangle" : "sawtooth", f, t, end, 9);
      a.connect(g);
      b.connect(g);
      g.connect(out.node);
    }
  };
  var bass = {
    cutoff: 1400,
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const body = adsr(k, t, dur, 4e-3, 0.35, 0.65, 0.07, 0.24 * v), pick2 = perc(k, t, 0.1 * v, 0.14);
      osc(k, "triangle", f, t, body.end).connect(body.g).connect(out.node);
      osc(k, "sawtooth", f, t, pick2.end).connect(pick2.g).connect(out.node);
    }
  };
  var synthbass = {
    cutoff: 2600,
    insert: (k) => {
      const ws = k.ctx.createWaveShaper();
      ws.curve = k.drive;
      return insertChain(ws, gain(k, 0.32));
    },
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const body = adsr(k, t, dur, 3e-3, 0.22, 0.8, 0.05, 0.2 * v), growl2 = adsr(k, t, dur, 3e-3, 0.12, 0.3, 0.05, 0.12 * v);
      osc(k, "sine", f, t, body.end).connect(body.g).connect(out.node);
      osc(k, "sawtooth", f, t, growl2.end, -5).connect(growl2.g);
      osc(k, k.pulse25, f, t, growl2.end, 5).connect(growl2.g);
      growl2.g.connect(out.node);
    }
  };
  var sub = {
    voice: (k, out, t, m, dur, v) => {
      const f = hz(m);
      const { g, end } = adsr(k, t, dur, 0.01, 0.2, 1, 0.1, 0.12 * v);
      osc(k, "sine", f, t, end).connect(g);
      const h = gain(k, 0.15);
      osc(k, "triangle", f * 2, t, end).connect(h).connect(g);
      g.connect(out.node);
    }
  };
  function click(k, out, t, freq, peak, decay, q = 1) {
    const n = noise(k, t, t + decay * 2 + 0.03), f = filter(k, "bandpass", freq, q), e = perc(k, t, peak, decay);
    n.connect(f).connect(e.g).connect(out);
  }
  function thump(k, out, t, from, to, sweep, peak, decay) {
    const e = perc(k, t, peak, decay), o = osc(k, "sine", from, t, e.end);
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + sweep);
    o.connect(e.g).connect(out);
  }
  var drum = (voice, extra = {}) => ({ voice, ...extra });
  var kick = drum((k, out, t, _m, _d, v) => {
    thump(k, out.node, t, 140, 48, 0.09, 0.45 * v, 0.35);
    click(k, out.node, t, 3e3, 0.1 * v, 8e-3);
  });
  var bigkick = drum(
    (k, out, t, _m, _d, v) => {
      thump(k, out.node, t, 190, 44, 0.11, 0.95 * v, 0.5);
      click(k, out.node, t, 4e3, 0.3 * v, 0.01, 0.7);
    },
    {
      insert: (k) => {
        const ws = k.ctx.createWaveShaper();
        ws.curve = k.drive;
        return insertChain(ws, gain(k, 0.3));
      }
    }
  );
  var snare = drum((k, out, t, _m, _d, v) => {
    click(k, out.node, t, 3500, 0.75 * v, 0.2, 0.4);
    thump(k, out.node, t, 210, 170, 0.05, 0.6 * v, 0.09);
  });
  var clap = drum((k, out, t, _m, _d, v) => {
    const n = noise(k, t, t + 0.5), bp = filter(k, "bandpass", 1300, 1.1), g = k.ctx.createGain(), p = g.gain, peak = 2.4 * v;
    p.setValueAtTime(0, t);
    for (const off of [0, 0.011, 0.022]) {
      p.setValueAtTime(peak, t + off);
      p.setTargetAtTime(peak * 0.15, t + off + 1e-3, 3e-3);
    }
    p.setValueAtTime(peak, t + 0.033);
    p.setTargetAtTime(0, t + 0.034, 0.055);
    n.connect(bp).connect(g).connect(out.node);
  });
  var hat = drum((k, out, t, _m, _d, v) => click(k, out.node, t, 1e4, 0.35 * v, 0.05, 0.5));
  var ohat = drum((k, out, t, _m, _d, v) => click(k, out.node, t, 9e3, 0.25 * v, 0.3, 0.5));
  var crash = drum((k, out, t, _m, _d, v) => {
    click(k, out.left, t, 7e3, 0.32 * v, 1.7, 0.4);
    click(k, out.right, t, 8200, 0.28 * v, 1.5, 0.4);
  });
  var ride = drum((k, out, t, _m, _d, v) => {
    const e = perc(k, t, 0.05 * v, 0.55), bp = filter(k, "bandpass", 8500, 0.8);
    for (const r of [2, 3, 4.16, 5.43, 6.79, 8.21]) osc(k, "square", 310 * r, t, e.end).connect(bp);
    bp.connect(e.g).connect(out.node);
    click(k, out.node, t, 9e3, 0.05 * v, 0.1, 0.8);
  });
  var tom = drum((k, out, t, m, _d, v) => {
    const f = hz(m);
    thump(k, out.node, t, f, f * 0.62, 0.22, 0.6 * v, 0.32);
    click(k, out.node, t, 1200, 0.1 * v, 0.03, 0.8);
  });
  var taiko = drum((k, out, t, _m, _d, v) => {
    thump(k, out.node, t, 98, 52, 0.2, 0.45 * v, 0.55);
    click(k, out.node, t, 400, 0.2 * v, 0.14, 0.5);
  });
  var timpani = drum((k, out, t, m, _d, v) => {
    const f = hz(m);
    const e = perc(k, t, 0.2 * v, 1.2);
    for (const [r, level] of [
      [1, 1],
      [1.5, 0.3],
      [2, 0.18]
    ]) {
      const o = osc(k, "sine", f * r, t, e.end), lv = gain(k, level);
      o.frequency.setValueAtTime(f * r * 1.03, t);
      o.frequency.exponentialRampToValueAtTime(f * r, t + 0.12);
      o.connect(lv).connect(e.g);
    }
    e.g.connect(out.node);
    click(k, out.node, t, 300, 0.12 * v, 0.08, 0.5);
  });
  var shaker = drum((k, out, t, _m, _d, v) => {
    const n = noise(k, t, t + 0.15), bp = filter(k, "bandpass", 6500, 1.2), e = perc(k, t, 0.16 * v, 0.06, 0.012);
    n.connect(bp).connect(e.g).connect(out.node);
  });
  var tamb = drum((k, out, t, _m, _d, v) => {
    click(k, out.node, t, 9500, 0.2 * v, 0.14, 2.5);
    click(k, out.node, t, 6800, 0.1 * v, 0.1, 3);
  });
  var doum = drum((k, out, t, _m, _d, v) => thump(k, out.node, t, 115, 80, 0.15, 0.7 * v, 0.3));
  var tek = drum((k, out, t, _m, _d, v) => {
    click(k, out.node, t, 3800, 0.4 * v, 0.035, 2);
    thump(k, out.node, t, 900, 700, 0.02, 0.12 * v, 0.03);
  });
  var rim = drum((k, out, t, _m, _d, v) => {
    click(k, out.node, t, 2200, 0.35 * v, 0.03, 4);
    thump(k, out.node, t, 520, 480, 0.02, 0.18 * v, 0.03);
  });
  var zill = drum((k, out, t, _m, _d, v) => {
    for (const [f, level] of [
      [2800, 1],
      [4130, 0.6],
      [5870, 0.3]
    ]) {
      const e = perc(k, t, 0.035 * v * level, 1.1);
      osc(k, "sine", f, t, e.end).connect(e.g).connect(out.node);
    }
  });
  var chirp = drum((k, out, t, m, _d, v) => {
    const f = hz(m), g = k.ctx.createGain(), p = g.gain;
    p.setValueAtTime(0, t);
    for (let i = 0; i < 3; i++) {
      const s = t + i * 0.034;
      p.setValueAtTime(0, s);
      p.linearRampToValueAtTime(0.035 * v, s + 4e-3);
      p.linearRampToValueAtTime(0, s + 0.02);
    }
    osc(k, "sine", f, t, t + 0.12).connect(g).connect(out.node);
  });
  var drip = drum((k, out, t, m, _d, v) => {
    const f = hz(m), e = perc(k, t, 0.14 * v, 0.14), o = osc(k, "sine", f, t, e.end);
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.06);
    o.connect(e.g).connect(out.node);
  });
  var riser = drum((k, out, t, _m, dur, v) => {
    const end = t + dur + 0.05, n = noise(k, t, end), bp = filter(k, "bandpass", 250, 2.5), g = k.ctx.createGain();
    bp.frequency.setValueAtTime(250, t);
    bp.frequency.exponentialRampToValueAtTime(7500, t + dur);
    g.gain.setValueAtTime(1e-3, t);
    g.gain.exponentialRampToValueAtTime(0.35 * v, t + dur);
    g.gain.linearRampToValueAtTime(0, end);
    n.connect(bp).connect(g).connect(out.node);
  });
  var swell = drum((k, out, t, _m, dur, v) => {
    const end = t + dur + 0.04, n = noise(k, t, end), hp = filter(k, "highpass", 3500), g = k.ctx.createGain();
    g.gain.setValueAtTime(1e-3, t);
    g.gain.exponentialRampToValueAtTime(0.28 * v, t + dur);
    g.gain.linearRampToValueAtTime(0, end);
    n.connect(hp).connect(g).connect(out.node);
  });
  var impact = drum((k, out, t, _m, _d, v) => {
    thump(k, out.node, t, 85, 30, 1.2, 0.9 * v, 1.6);
    click(k, out.node, t, 250, 0.9 * v, 0.9, 0.4);
  });
  var thunder = drum((k, out, t, _m, _d, v) => {
    click(k, out.node, t, 1800, 0.3 * v, 0.2, 0.5);
    const n = noise(k, t, t + 5), lp = filter(k, "lowpass", 320, 0.6), g = k.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.9 * v, t + 0.12);
    g.gain.setTargetAtTime(0.35 * v, t + 0.12, 0.4);
    g.gain.setTargetAtTime(0, t + 1.4, 0.9);
    n.connect(lp).connect(g).connect(out.node);
  });
  var wind = drum((k, out, t, m, dur, v) => {
    const end = t + dur + 1.2, n = noise(k, t, end), bp = filter(k, "bandpass", hz(m), 1.8), g = k.ctx.createGain();
    bp.frequency.setValueAtTime(hz(m) * 0.6, t);
    bp.frequency.linearRampToValueAtTime(hz(m) * 1.4, t + dur * 0.55);
    bp.frequency.linearRampToValueAtTime(hz(m) * 0.7, t + dur + 1);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.3 * v, t + dur * 0.5);
    g.gain.linearRampToValueAtTime(0, end);
    n.connect(bp).connect(g).connect(out.node);
  });
  var INSTRUMENTS = {
    pulse,
    square,
    supersaw,
    pad,
    strings,
    tremolo,
    pizz,
    pluck,
    harp,
    oud,
    flute,
    ocarina,
    reed,
    shawm,
    brass,
    bell,
    musicbox,
    crystal,
    marimba,
    epiano,
    choir,
    chant,
    organ,
    toll,
    howl,
    orchhit,
    guitar,
    bass,
    synthbass,
    sub,
    kick,
    bigkick,
    snare,
    clap,
    hat,
    ohat,
    crash,
    ride,
    tom,
    taiko,
    timpani,
    shaker,
    tamb,
    doum,
    tek,
    rim,
    zill,
    chirp,
    drip,
    riser,
    swell,
    impact,
    thunder,
    wind
  };

  // src/audio/engine.ts
  function impulse(ctx2, seconds) {
    const rate = ctx2.sampleRate, len = Math.floor(rate * seconds), ir = ctx2.createBuffer(2, len, rate);
    let seed = 99;
    for (let c = 0; c < 2; c++) {
      const data = ir.getChannelData(c);
      let smooth5 = 0;
      for (let i = 0; i < len; i++) {
        seed = seed * 16807 % 2147483647;
        const x = i / len, white = seed / 2147483647 * 2 - 1, k = 0.85 - 0.75 * x;
        smooth5 = smooth5 + k * (white - smooth5);
        data[i] = smooth5 * Math.exp(-x * 5.5) * (i < rate * 0.012 ? i / (rate * 0.012) : 1);
      }
    }
    return ir;
  }
  function softClip() {
    const curve5 = new Float32Array(2048);
    for (let i = 0; i < curve5.length; i++) {
      const x = i / (curve5.length - 1) * 2 - 1, a = Math.abs(x), y = a < 0.75 ? a : 0.75 + 0.24 * Math.tanh((a - 0.75) / 0.24);
      curve5[i] = Math.sign(x) * y;
    }
    return curve5;
  }
  function createMusicChain(ctx2, destination) {
    const input = ctx2.createGain(), muffle2 = ctx2.createBiquadFilter(), glue = ctx2.createDynamicsCompressor(), makeup = ctx2.createGain(), limiter = ctx2.createDynamicsCompressor(), clipper = ctx2.createWaveShaper();
    muffle2.type = "lowpass";
    muffle2.frequency.value = 2e4;
    muffle2.Q.value = 0.5;
    glue.threshold.value = -16;
    glue.knee.value = 8;
    glue.ratio.value = 2.5;
    glue.attack.value = 0.01;
    glue.release.value = 0.18;
    makeup.gain.value = 1.2;
    limiter.threshold.value = -4;
    limiter.knee.value = 2;
    limiter.ratio.value = 16;
    limiter.attack.value = 2e-3;
    limiter.release.value = 0.12;
    clipper.curve = softClip();
    clipper.oversample = "2x";
    input.connect(muffle2).connect(glue).connect(makeup).connect(limiter).connect(clipper).connect(destination);
    return { input, muffle: muffle2 };
  }
  var Deck = class {
    fader;
    revSend;
    duck;
    parts = /* @__PURE__ */ new Map();
    spb;
    lengthBeats;
    loopBeat;
    loopIndex;
    idx = 0;
    iter = 0;
    kit;
    track;
    start;
    stopAt = Infinity;
    constructor(player2, track2, start2, fadeIn) {
      this.track = track2;
      this.start = start2;
      const ctx2 = player2.ctx;
      this.kit = kit(ctx2);
      this.spb = 60 / track2.bpm;
      this.lengthBeats = track2.bars * track2.beatsPerBar;
      this.loopBeat = track2.loopBar * track2.beatsPerBar;
      this.loopIndex = track2.events.findIndex((e) => e.t >= this.loopBeat - 1e-6);
      this.fader = ctx2.createGain();
      this.revSend = ctx2.createGain();
      for (const p of [this.fader.gain, this.revSend.gain]) {
        if (fadeIn > 0) {
          p.setValueAtTime(0, 0);
          p.setValueAtTime(0, start2);
          p.setTargetAtTime(1, start2, fadeIn / 4);
        } else p.value = 1;
      }
      this.fader.connect(player2.out);
      this.revSend.connect(player2.reverbIn);
      const dry = ctx2.createGain();
      dry.connect(this.fader);
      this.duck = ctx2.createGain();
      this.duck.connect(this.fader);
      const echoIn = ctx2.createGain(), delay = ctx2.createDelay(4), feedback = ctx2.createGain(), tone2 = ctx2.createBiquadFilter(), trim = ctx2.createBiquadFilter();
      delay.delayTime.value = Math.min(3.9, track2.echoBeats * this.spb);
      feedback.gain.value = track2.echoFeedback;
      tone2.type = "lowpass";
      tone2.frequency.value = 3200;
      trim.type = "highpass";
      trim.frequency.value = 280;
      echoIn.connect(delay).connect(tone2).connect(feedback).connect(delay);
      tone2.connect(trim).connect(this.fader);
      trim.connect(this.revSend);
      const automated = new Set(
        track2.events.filter((e) => "param" in e && e.param === "cutoff").map((e) => e.p)
      );
      for (const [name, def] of Object.entries(track2.parts)) {
        const inst = INSTRUMENTS[def.inst], input = ctx2.createGain(), vol = def.vol ?? 1, cutoff = def.cutoff ?? inst.cutoff;
        input.gain.value = vol;
        let node = input, filter2;
        if (inst.insert) {
          const insert = inst.insert(this.kit);
          node.connect(insert.input);
          node = insert.output;
        }
        if (cutoff !== void 0 || automated.has(name)) {
          filter2 = ctx2.createBiquadFilter();
          filter2.type = "lowpass";
          filter2.frequency.value = Math.min(cutoff ?? 2e4, ctx2.sampleRate / 2);
          filter2.Q.value = 0.8;
          node = node.connect(filter2);
        }
        const panner = ctx2.createStereoPanner();
        panner.pan.value = def.pan ?? 0;
        node.connect(panner).connect(def.duck ? this.duck : dry);
        if (def.rev) {
          const send = ctx2.createGain();
          send.gain.value = def.rev;
          panner.connect(send).connect(this.revSend);
        }
        if (def.echo) {
          const send = ctx2.createGain();
          send.gain.value = def.echo;
          panner.connect(send).connect(echoIn);
        }
        this.parts.set(name, {
          input,
          out: new PartOut(this.kit, input, inst.vibrato ?? 5),
          filter: filter2,
          vol
        });
      }
    }
    /** Schedules every event that starts before `until` (seconds). */
    schedule(until, skipBefore = -Infinity) {
      const events = this.track.events, loopLen = this.lengthBeats - this.loopBeat;
      for (; ; ) {
        if (this.idx >= events.length) {
          if (this.loopIndex < 0 || loopLen <= 0) return;
          this.iter++;
          this.idx = this.loopIndex;
        }
        const e = events[this.idx];
        const beat = this.iter === 0 ? e.t : this.lengthBeats + (this.iter - 1) * loopLen + (e.t - this.loopBeat);
        const time = this.start + beat * this.spb;
        if (time > until || time >= this.stopAt) return;
        if ("param" in e) this.automate(e, time);
        else if (time >= skipBefore) this.fire(e, time);
        this.idx++;
      }
    }
    automate(e, time) {
      const bus = this.parts.get(e.p);
      if (e.param === "cutoff" && bus.filter) {
        const f = bus.filter.frequency;
        f.setValueAtTime(e.from, time);
        if (e.d > 0) f.exponentialRampToValueAtTime(e.to, time + e.d * this.spb);
      } else if (e.param === "vol") {
        const g = bus.input.gain;
        g.setValueAtTime(e.from * bus.vol, time);
        if (e.d > 0) g.linearRampToValueAtTime(e.to * bus.vol, time + e.d * this.spb);
      }
    }
    fire(e, time) {
      const def = this.track.parts[e.p], bus = this.parts.get(e.p);
      INSTRUMENTS[def.inst].voice(this.kit, bus.out, time, e.m, e.d * this.spb, e.v);
      const sc = this.track.sidechain;
      if (sc && sc.part === e.p) {
        const g = this.duck.gain;
        g.setTargetAtTime(1 - sc.depth, time, 4e-3);
        g.setTargetAtTime(1, time + 0.03, sc.release / 3);
      }
    }
    /** Fades the deck out from `when` and stops scheduling new notes after the fade. */
    stop(when, fade) {
      for (const p of [this.fader.gain, this.revSend.gain])
        p.setTargetAtTime(0, when, fade / 4 + 1e-3);
      this.stopAt = Math.min(this.stopAt, when + fade);
    }
    dispose() {
      for (const bus of this.parts.values()) bus.out.dispose();
      this.fader.disconnect();
      this.revSend.disconnect();
    }
  };
  var MusicPlayer = class {
    ctx;
    out;
    reverbIn;
    decks = [];
    constructor(ctx2, out) {
      this.ctx = ctx2;
      this.out = out;
      this.reverbIn = ctx2.createGain();
      const hp = ctx2.createBiquadFilter(), conv = ctx2.createConvolver(), ret = ctx2.createGain();
      hp.type = "highpass";
      hp.frequency.value = 200;
      conv.buffer = impulse(ctx2, 2.8);
      ret.gain.value = 0.8;
      this.reverbIn.connect(hp).connect(conv).connect(ret).connect(out);
    }
    play(track2, when, fadeIn = 0) {
      const deck2 = new Deck(this, track2, when, fadeIn);
      this.decks.push(deck2);
      return deck2;
    }
    /** Schedules all decks up to `until`, skipping notes already in the past, and drops finished decks. */
    schedule(until, now = this.ctx.currentTime) {
      for (const deck2 of this.decks) deck2.schedule(until, now - 0.02);
      this.decks = this.decks.filter((deck2) => {
        const done = now > deck2.stopAt + 6;
        if (done) deck2.dispose();
        return !done;
      });
    }
  };

  // src/audio/sfx.ts
  function env(k, t, peak, decay, attack = 3e-3) {
    const g = k.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.setTargetAtTime(0, t + attack, decay / 3.5);
    return { g, end: t + attack + decay * 2 + 0.03 };
  }
  function noiseSrc(k, t, end) {
    const n = k.ctx.createBufferSource();
    n.buffer = k.noise;
    n.loop = true;
    n.start(t, t * 13.7 % 1.5);
    n.stop(end);
    return n;
  }
  function biquad(k, type, freq, q = 0.8) {
    const f = k.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = Math.min(freq, k.ctx.sampleRate / 2 - 100);
    f.Q.value = q;
    return f;
  }
  function hiss(k, out, t, opts) {
    const e = env(k, t, opts.peak, opts.decay, opts.attack ?? 3e-3), f = biquad(k, opts.type ?? "bandpass", opts.freq, opts.q ?? 1);
    if (opts.sweepTo) {
      f.frequency.setValueAtTime(opts.freq, t);
      f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t + (opts.attack ?? 3e-3) + opts.decay);
    }
    noiseSrc(k, t, e.end).connect(f).connect(e.g).connect(out);
  }
  function tone(k, out, t, opts) {
    const e = env(k, t, opts.peak, opts.decay, opts.attack ?? 3e-3), o = k.ctx.createOscillator();
    o.type = opts.type ?? "sine";
    o.frequency.setValueAtTime(opts.from, t);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + (opts.glide ?? opts.decay));
    o.start(t);
    o.stop(e.end);
    o.connect(e.g).connect(out);
    return o;
  }
  function cry(k, out, t, opts) {
    const g = k.ctx.createGain(), o = k.ctx.createOscillator(), f = biquad(k, "bandpass", opts.formant, opts.q ?? 2.5), end = t + opts.dur + 0.1;
    o.type = opts.type ?? "sawtooth";
    o.frequency.setValueAtTime(opts.from, t);
    o.frequency.exponentialRampToValueAtTime(opts.to, t + opts.dur);
    if (opts.wobble) {
      const lfo = k.ctx.createOscillator(), depth = k.ctx.createGain();
      lfo.frequency.value = opts.wobble;
      depth.gain.value = opts.from * 0.04;
      lfo.connect(depth).connect(o.frequency);
      lfo.start(t);
      lfo.stop(end);
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(opts.peak, t + Math.min(0.04, opts.dur * 0.2));
    g.gain.setValueAtTime(opts.peak, t + opts.dur * 0.6);
    g.gain.linearRampToValueAtTime(0, t + opts.dur);
    o.start(t);
    o.stop(end);
    o.connect(f).connect(g).connect(out);
  }
  function growl(k, out, t, from, to, dur, peak, rough = 28) {
    const g = k.ctx.createGain(), flutter = k.ctx.createGain(), lfo = k.ctx.createOscillator(), depth = k.ctx.createGain(), o = k.ctx.createOscillator(), lp = biquad(k, "lowpass", 700, 1.5), ws = k.ctx.createWaveShaper(), end = t + dur + 0.1;
    ws.curve = k.drive;
    o.type = "sawtooth";
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    lfo.frequency.value = rough;
    depth.gain.value = 0.5;
    flutter.gain.value = 0.5;
    lfo.connect(depth).connect(flutter.gain);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.06);
    g.gain.setValueAtTime(peak, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur);
    for (const n of [o, lfo]) {
      n.start(t);
      n.stop(end);
    }
    o.connect(ws).connect(lp).connect(flutter).connect(g).connect(out);
  }
  var clicks = (k, out, t, n, spread, freq, peak) => {
    for (let i = 0; i < n; i++)
      hiss(k, out, t + i / n * spread + i * 37 % 7 * 4e-3, {
        freq: freq * (0.8 + i * 13 % 5 * 0.1),
        q: 4,
        peak,
        decay: 0.025
      });
  };
  var SOUNDS = {
    jump: (k, o, t, v) => {
      hiss(k, o, t, { freq: 600, sweepTo: 2e3, q: 1.2, peak: 0.12 * v, decay: 0.12, attack: 0.03 });
      tone(k, o, t, { from: 240, to: 340, peak: 0.05 * v, decay: 0.08 });
    },
    land: (k, o, t, v) => {
      tone(k, o, t, { from: 120, to: 50, peak: 0.35 * v, decay: 0.14 });
      hiss(k, o, t, { freq: 500, type: "lowpass", peak: 0.25 * v, decay: 0.08 });
    },
    step_soil: (k, o, t, v) => {
      hiss(k, o, t, { freq: 1600, q: 0.9, peak: 0.07 * v, decay: 0.05 });
      tone(k, o, t, { from: 90, to: 60, peak: 0.08 * v, decay: 0.04 });
    },
    step_grass: (k, o, t, v) => {
      hiss(k, o, t, { freq: 3200, q: 0.7, peak: 0.07 * v, decay: 0.06, attack: 0.01 });
      tone(k, o, t, { from: 90, to: 60, peak: 0.05 * v, decay: 0.04 });
    },
    step_stone: (k, o, t, v) => {
      hiss(k, o, t, { freq: 2600, q: 3, peak: 0.08 * v, decay: 0.03 });
      tone(k, o, t, { from: 140, to: 90, peak: 0.06 * v, decay: 0.03 });
    },
    step_sand: (k, o, t, v) => hiss(k, o, t, { freq: 4200, type: "highpass", peak: 0.05 * v, decay: 0.09, attack: 0.02 }),
    step_snow: (k, o, t, v) => {
      for (let i = 0; i < 3; i++)
        hiss(k, o, t + i * 0.018, { freq: 1300 + i * 300, q: 2.5, peak: 0.06 * v, decay: 0.03 });
    },
    step_mud: (k, o, t, v) => hiss(k, o, t, { freq: 350, sweepTo: 1e3, q: 3, peak: 0.1 * v, decay: 0.08 }),
    step_ash: (k, o, t, v) => {
      hiss(k, o, t, { freq: 1900, q: 1.5, peak: 0.06 * v, decay: 0.06 });
      clicks(k, o, t + 0.01, 2, 0.04, 5200, 0.03 * v);
    },
    hurt: (k, o, t, v) => {
      cry(k, o, t, { from: 210, to: 130, formant: 750, q: 3, peak: 0.28 * v, dur: 0.2 });
      tone(k, o, t, { from: 130, to: 60, peak: 0.3 * v, decay: 0.12 });
      hiss(k, o, t, { freq: 1600, q: 1, peak: 0.15 * v, decay: 0.06 });
    },
    burn: (k, o, t, v) => {
      hiss(k, o, t, {
        freq: 3500,
        sweepTo: 1500,
        type: "highpass",
        peak: 0.12 * v,
        decay: 0.3,
        attack: 0.02
      });
      clicks(k, o, t, 4, 0.2, 3e3, 0.05 * v);
    },
    death: (k, o, t, v) => {
      cry(k, o, t, { from: 190, to: 90, formant: 650, peak: 0.25 * v, dur: 0.7, wobble: 7 });
      [220, 175, 147, 110].forEach(
        (f, i) => tone(k, o, t + 0.15 + i * 0.28, {
          from: f,
          type: "triangle",
          peak: 0.12 * v,
          decay: 1.4,
          attack: 0.02
        })
      );
      tone(k, o, t + 0.1, { from: 70, to: 32, peak: 0.4 * v, decay: 1.5 });
    },
    swing: (k, o, t, v) => hiss(k, o, t, { freq: 3500, sweepTo: 700, q: 1.4, peak: 0.13 * v, decay: 0.14, attack: 0.02 }),
    hit: (k, o, t, v) => {
      tone(k, o, t, { from: 160, to: 70, peak: 0.35 * v, decay: 0.12 });
      hiss(k, o, t, { freq: 2200, q: 1.5, peak: 0.2 * v, decay: 0.05 });
    },
    // ── Gathering and building ──
    chop: (k, o, t, v) => {
      tone(k, o, t, { from: 220, to: 140, type: "triangle", peak: 0.3 * v, decay: 0.09 });
      hiss(k, o, t, { freq: 950, q: 5, peak: 0.25 * v, decay: 0.07 });
      tone(k, o, t + 0.035, { from: 420, to: 300, peak: 0.08 * v, decay: 0.05 });
    },
    creak: (k, o, t, v) => {
      cry(k, o, t, {
        from: 70,
        to: 120,
        formant: 480,
        q: 7,
        peak: 0.25 * v,
        dur: 0.85,
        wobble: 13,
        type: "sawtooth"
      });
      clicks(k, o, t + 0.3, 5, 0.5, 1400, 0.05 * v);
    },
    timber: (k, o, t, v) => {
      tone(k, o, t, { from: 95, to: 40, peak: 0.5 * v, decay: 0.5 });
      hiss(k, o, t, { freq: 1100, type: "lowpass", peak: 0.35 * v, decay: 0.5 });
      hiss(k, o, t + 0.05, { freq: 5200, type: "highpass", peak: 0.1 * v, decay: 0.9, attack: 0.05 });
      clicks(k, o, t, 8, 0.35, 1800, 0.08 * v);
    },
    pick: (k, o, t, v) => {
      tone(k, o, t, { from: 2300, peak: 0.1 * v, decay: 0.12 });
      tone(k, o, t, { from: 3350, peak: 0.06 * v, decay: 0.08 });
      hiss(k, o, t, { freq: 3500, q: 2, peak: 0.18 * v, decay: 0.04 });
      tone(k, o, t, { from: 150, to: 90, peak: 0.12 * v, decay: 0.06 });
    },
    crumble: (k, o, t, v) => {
      clicks(k, o, t, 10, 0.35, 2400, 0.09 * v);
      hiss(k, o, t, { freq: 500, type: "lowpass", peak: 0.3 * v, decay: 0.35 });
      tone(k, o, t, { from: 110, to: 55, peak: 0.25 * v, decay: 0.25 });
    },
    dig_soil: (k, o, t, v) => {
      hiss(k, o, t, { freq: 700, type: "lowpass", peak: 0.3 * v, decay: 0.12 });
      clicks(k, o, t + 0.02, 4, 0.12, 1500, 0.05 * v);
    },
    dig_stone: (k, o, t, v) => {
      SOUNDS.pick(k, o, t, v * 0.9);
      clicks(k, o, t + 0.04, 5, 0.18, 2600, 0.05 * v);
    },
    dig_ice: (k, o, t, v) => {
      tone(k, o, t, { from: 3600, peak: 0.08 * v, decay: 0.3 });
      tone(k, o, t, { from: 5100, peak: 0.05 * v, decay: 0.2 });
      clicks(k, o, t, 7, 0.2, 6e3, 0.05 * v);
    },
    dig_hell: (k, o, t, v) => {
      SOUNDS.pick(k, o, t, v * 0.8);
      hiss(k, o, t + 0.02, {
        freq: 4e3,
        type: "highpass",
        peak: 0.08 * v,
        decay: 0.35,
        attack: 0.02
      });
    },
    pluck: (k, o, t, v) => {
      hiss(k, o, t, { freq: 3e3, q: 0.9, peak: 0.1 * v, decay: 0.08, attack: 0.01 });
      hiss(k, o, t + 0.07, { freq: 2400, q: 0.9, peak: 0.08 * v, decay: 0.07, attack: 0.01 });
      hiss(k, o, t + 0.1, { freq: 1800, q: 5, peak: 0.12 * v, decay: 0.02 });
    },
    splash: (k, o, t, v) => {
      hiss(k, o, t, { freq: 800, sweepTo: 2800, q: 1, peak: 0.2 * v, decay: 0.25, attack: 0.01 });
      [620, 880, 540].forEach(
        (f, i) => tone(k, o, t + 0.04 + i * 0.05, { from: f, to: f * 1.5, peak: 0.05 * v, decay: 0.06 })
      );
    },
    pickup: (k, o, t, v) => {
      tone(k, o, t, { from: 740, to: 1100, peak: 0.07 * v, decay: 0.06 });
      tone(k, o, t + 0.05, { from: 1320, peak: 0.05 * v, decay: 0.08 });
    },
    sizzle: (k, o, t, v) => {
      hiss(k, o, t, { freq: 6e3, type: "highpass", peak: 0.12 * v, decay: 0.5, attack: 0.02 });
      clicks(k, o, t, 6, 0.4, 3500, 0.05 * v);
    },
    place: (k, o, t, v) => {
      tone(k, o, t, { from: 130, to: 80, peak: 0.3 * v, decay: 0.1 });
      hiss(k, o, t, { freq: 900, q: 2, peak: 0.12 * v, decay: 0.06 });
      tone(k, o, t + 0.09, { from: 200, to: 150, type: "triangle", peak: 0.1 * v, decay: 0.05 });
    },
    open: (k, o, t, v) => {
      cry(k, o, t, { from: 300, to: 520, formant: 900, q: 6, peak: 0.1 * v, dur: 0.35, wobble: 18 });
      hiss(k, o, t + 0.36, { freq: 2600, q: 4, peak: 0.15 * v, decay: 0.03 });
    },
    craft_wood: (k, o, t, v) => {
      for (let i = 0; i < 3; i++) {
        tone(k, o, t + i * 0.14, {
          from: 260,
          to: 170,
          type: "triangle",
          peak: 0.2 * v,
          decay: 0.07
        });
        hiss(k, o, t + i * 0.14, { freq: 1200, q: 4, peak: 0.12 * v, decay: 0.04 });
      }
    },
    craft_anvil: (k, o, t, v) => {
      for (let i = 0; i < 3; i++)
        for (const [f, a, d] of [
          [1150, 0.09, 0.6],
          [1730, 0.06, 0.45],
          [2590, 0.05, 0.3],
          [3480, 0.03, 0.2]
        ])
          tone(k, o, t + i * 0.2, { from: f * (i === 2 ? 1.06 : 1), peak: a * v, decay: d });
    },
    craft_cook: (k, o, t, v) => {
      hiss(k, o, t, { freq: 5e3, type: "highpass", peak: 0.09 * v, decay: 0.8, attack: 0.05 });
      clicks(k, o, t, 8, 0.7, 4200, 0.04 * v);
    },
    craft_brew: (k, o, t, v) => {
      for (let i = 0; i < 5; i++)
        tone(k, o, t + i * 0.09, {
          from: 380 + i * 60,
          to: 700 + i * 90,
          peak: 0.06 * v,
          decay: 0.06
        });
      tone(k, o, t + 0.5, { from: 2600, peak: 0.05 * v, decay: 0.3 });
    },
    eat: (k, o, t, v) => {
      for (let i = 0; i < 3; i++)
        hiss(k, o, t + i * 0.1, { freq: 1500 + i * 250, q: 1.8, peak: 0.12 * v, decay: 0.05 });
    },
    drink: (k, o, t, v) => {
      for (let i = 0; i < 2; i++) {
        tone(k, o, t + i * 0.2, { from: 330, to: 190, peak: 0.12 * v, decay: 0.12 });
        hiss(k, o, t + i * 0.2, { freq: 700, q: 3, peak: 0.08 * v, decay: 0.08 });
      }
    },
    medicine: (k, o, t, v) => {
      tone(k, o, t, { from: 2900, peak: 0.07 * v, decay: 0.25 });
      tone(k, o, t + 0.05, { from: 3700, peak: 0.05 * v, decay: 0.2 });
      SOUNDS.drink(k, o, t + 0.15, v * 0.8);
    },
    equip: (k, o, t, v) => {
      hiss(k, o, t, { freq: 5500, type: "highpass", peak: 0.12 * v, decay: 0.3, attack: 0.02 });
      tone(k, o, t + 0.02, { from: 1900, to: 2100, peak: 0.06 * v, decay: 0.35 });
      tone(k, o, t + 0.02, { from: 2850, peak: 0.04 * v, decay: 0.3 });
    },
    wear: (k, o, t, v) => {
      hiss(k, o, t, { freq: 1300, q: 0.7, peak: 0.12 * v, decay: 0.25, attack: 0.08 });
      hiss(k, o, t + 0.2, { freq: 1700, q: 0.7, peak: 0.08 * v, decay: 0.15, attack: 0.04 });
    },
    cast: (k, o, t, v) => {
      hiss(k, o, t, { freq: 2600, sweepTo: 900, q: 1.4, peak: 0.12 * v, decay: 0.25, attack: 0.05 });
      tone(k, o, t + 0.45, { from: 500, to: 900, peak: 0.08 * v, decay: 0.08 });
    },
    catch: (k, o, t, v) => {
      SOUNDS.splash(k, o, t, v);
      clicks(k, o, t + 0.1, 6, 0.3, 3e3, 0.04 * v);
    },
    rest: (k, o, t, v) => hiss(k, o, t, { freq: 900, type: "lowpass", peak: 0.12 * v, decay: 1.2, attack: 0.5 }),
    page: (k, o, t, v) => hiss(k, o, t, { freq: 2200, sweepTo: 5200, q: 0.8, peak: 0.08 * v, decay: 0.14, attack: 0.03 }),
    click: (k, o, t, v) => tone(k, o, t, { from: 1600, to: 1200, peak: 0.05 * v, decay: 0.03 }),
    thunder: (k, o, t, v) => {
      hiss(k, o, t, { freq: 1800, q: 0.5, peak: 0.25 * v, decay: 0.2 });
      hiss(k, o, t + 0.05, { freq: 260, type: "lowpass", peak: 0.7 * v, decay: 2.8, attack: 0.15 });
      hiss(k, o, t + 0.6, { freq: 180, type: "lowpass", peak: 0.4 * v, decay: 2, attack: 0.3 });
    },
    boss: (k, o, t, v) => {
      growl(k, o, t, 70, 50, 1.4, 0.5 * v, 22);
      cry(k, o, t + 0.2, { from: 180, to: 330, formant: 900, peak: 0.2 * v, dur: 1.4, wobble: 5 });
    },
    victory: (k, o, t, v) => {
      [523, 659, 784, 1047].forEach((f, i) => {
        tone(k, o, t + i * 0.12, {
          from: f,
          type: "triangle",
          peak: 0.12 * v,
          decay: 0.7,
          attack: 0.01
        });
        tone(k, o, t + i * 0.12, { from: f * 2, peak: 0.03 * v, decay: 0.4 });
      });
    },
    // ── Creatures ──
    deer_call: (k, o, t, v) => cry(k, o, t, {
      from: 720,
      to: 520,
      formant: 1250,
      q: 3,
      peak: 0.16 * v,
      dur: 0.35,
      wobble: 11
    }),
    deer_hurt: (k, o, t, v) => cry(k, o, t, { from: 900, to: 560, formant: 1400, q: 3, peak: 0.2 * v, dur: 0.3, wobble: 16 }),
    wolf_call: (k, o, t, v) => {
      cry(k, o, t, {
        from: 330,
        to: 520,
        formant: 900,
        q: 2,
        peak: 0.12 * v,
        dur: 0.6,
        wobble: 5,
        type: "triangle"
      });
      cry(k, o, t + 0.6, {
        from: 520,
        to: 400,
        formant: 900,
        q: 2,
        peak: 0.1 * v,
        dur: 0.9,
        wobble: 5,
        type: "triangle"
      });
    },
    wolf_attack: (k, o, t, v) => {
      growl(k, o, t, 110, 90, 0.35, 0.3 * v, 30);
      cry(k, o, t + 0.3, { from: 380, to: 220, formant: 900, peak: 0.2 * v, dur: 0.12 });
    },
    wolf_hurt: (k, o, t, v) => cry(k, o, t, { from: 900, to: 700, formant: 1300, peak: 0.18 * v, dur: 0.22, wobble: 20 }),
    boar_call: (k, o, t, v) => growl(k, o, t, 95, 75, 0.28, 0.25 * v, 34),
    boar_attack: (k, o, t, v) => {
      growl(k, o, t, 120, 90, 0.3, 0.3 * v, 38);
      hiss(k, o, t + 0.2, { freq: 600, type: "lowpass", peak: 0.2 * v, decay: 0.1 });
    },
    boar_hurt: (k, o, t, v) => cry(k, o, t, { from: 800, to: 1500, formant: 1500, peak: 0.2 * v, dur: 0.3, wobble: 25 }),
    bat_call: (k, o, t, v) => {
      for (let i = 0; i < 3; i++)
        tone(k, o, t + i * 0.06, { from: 5400, to: 3900, peak: 0.05 * v, decay: 0.04 });
      for (let i = 0; i < 4; i++)
        hiss(k, o, t + i * 0.08, { freq: 900, type: "lowpass", peak: 0.06 * v, decay: 0.04 });
    },
    bat_attack: (k, o, t, v) => tone(k, o, t, { from: 4600, to: 2800, type: "triangle", peak: 0.08 * v, decay: 0.12 }),
    bat_hurt: (k, o, t, v) => tone(k, o, t, { from: 6e3, to: 3e3, type: "triangle", peak: 0.08 * v, decay: 0.15 }),
    scorpion_call: (k, o, t, v) => clicks(k, o, t, 6, 0.3, 4200, 0.06 * v),
    scorpion_attack: (k, o, t, v) => {
      hiss(k, o, t, { freq: 5e3, type: "highpass", peak: 0.12 * v, decay: 0.35, attack: 0.03 });
      clicks(k, o, t, 4, 0.15, 3600, 0.07 * v);
    },
    scorpion_hurt: (k, o, t, v) => clicks(k, o, t, 5, 0.1, 2800, 0.09 * v),
    ember_bat_call: (k, o, t, v) => {
      SOUNDS.bat_call(k, o, t, v * 0.8);
      clicks(k, o, t + 0.05, 5, 0.3, 3200, 0.05 * v);
    },
    ember_bat_attack: (k, o, t, v) => {
      tone(k, o, t, { from: 3400, to: 1700, type: "sawtooth", peak: 0.06 * v, decay: 0.2 });
      hiss(k, o, t, { freq: 4500, type: "highpass", peak: 0.08 * v, decay: 0.3 });
    },
    ember_bat_hurt: (k, o, t, v) => tone(k, o, t, { from: 4200, to: 1900, type: "sawtooth", peak: 0.07 * v, decay: 0.2 }),
    hellhound_call: (k, o, t, v) => {
      growl(k, o, t, 62, 48, 1.1, 0.4 * v, 20);
      hiss(k, o, t + 0.1, { freq: 1600, q: 0.6, peak: 0.06 * v, decay: 0.9, attack: 0.2 });
    },
    hellhound_attack: (k, o, t, v) => {
      growl(k, o, t, 90, 60, 0.45, 0.45 * v, 26);
      cry(k, o, t + 0.35, { from: 300, to: 160, formant: 700, peak: 0.25 * v, dur: 0.18 });
    },
    hellhound_hurt: (k, o, t, v) => growl(k, o, t, 150, 100, 0.3, 0.3 * v, 40),
    die: (k, o, t, v) => {
      tone(k, o, t, { from: 180, to: 60, peak: 0.25 * v, decay: 0.4 });
      hiss(k, o, t, { freq: 600, type: "lowpass", peak: 0.15 * v, decay: 0.3 });
    }
  };
  var SFX_NAMES = Object.keys(SOUNDS);
  var TRIM = {
    step_soil: 0.6,
    step_snow: 3,
    step_mud: 4.5,
    step_ash: 2.6,
    land: 0.7,
    eat: 3,
    open: 2.4,
    pluck: 1.4,
    craft_brew: 1.5,
    scorpion_call: 3,
    wolf_call: 1.8,
    wolf_attack: 0.7,
    boar_call: 0.5,
    boar_attack: 0.7,
    hellhound_call: 0.6,
    hellhound_attack: 0.65,
    hellhound_hurt: 0.7
  };
  function playSfx(ctx2, out, name, v = 1, t = ctx2.currentTime) {
    const sound2 = SOUNDS[name];
    if (sound2) sound2(kit(ctx2), out, t, v * (TRIM[name] ?? 1));
    return !!sound2;
  }
  var SILENCE = {
    rain: 0,
    wind: 0,
    fire: 0,
    lava: 0,
    cave: 0,
    hell: 0,
    birds: 0,
    surf: 0,
    night: 0
  };
  var Ambience = class {
    ctx;
    out;
    beds = {};
    levels = { ...SILENCE };
    nextShot = {};
    constructor(ctx2, out) {
      this.ctx = ctx2;
      this.out = out;
      const k = kit(ctx2);
      const bed = (name, build) => {
        const g = ctx2.createGain();
        g.gain.value = 0;
        const n = ctx2.createBufferSource();
        n.buffer = k.noise;
        n.loop = true;
        n.playbackRate.value = 0.97 + Object.keys(this.beds).length * 0.013;
        n.start();
        build(n).connect(g).connect(out);
        this.beds[name] = g;
      };
      bed("rain", (n) => {
        const hp = biquad(k, "bandpass", 3800, 0.4), body = biquad(k, "lowpass", 900, 0.5), mix5 = ctx2.createGain();
        n.connect(hp).connect(mix5);
        const g2 = ctx2.createGain();
        g2.gain.value = 0.6;
        n.connect(body).connect(g2).connect(mix5);
        return mix5;
      });
      bed("wind", (n) => {
        const bp = biquad(k, "bandpass", 600, 1.6), lfo = ctx2.createOscillator(), depth = ctx2.createGain();
        lfo.frequency.value = 0.13;
        depth.gain.value = 320;
        lfo.connect(depth).connect(bp.frequency);
        lfo.start();
        return n.connect(bp);
      });
      const rumble = (name, cutoff) => bed(name, (n) => {
        const lp = biquad(k, "lowpass", cutoff, 0.7), g = ctx2.createGain(), lfo = ctx2.createOscillator(), depth = ctx2.createGain();
        lfo.frequency.value = 0.21;
        depth.gain.value = 0.35;
        g.gain.value = 0.65;
        lfo.connect(depth).connect(g.gain);
        lfo.start();
        return n.connect(lp).connect(g);
      });
      rumble("lava", 220);
      rumble("hell", 120);
      bed("cave", (n) => n.connect(biquad(k, "lowpass", 350, 0.5)));
      bed("surf", (n) => {
        const lp = biquad(k, "lowpass", 1100, 0.5), g = ctx2.createGain(), lfo = ctx2.createOscillator(), depth = ctx2.createGain();
        lfo.frequency.value = 0.11;
        depth.gain.value = 0.5;
        g.gain.value = 0.5;
        lfo.connect(depth).connect(g.gain);
        lfo.start();
        return n.connect(lp).connect(g);
      });
    }
    /** Eases every bed toward new levels (0–1) and schedules one-shots that are due. */
    update(levels, now = this.ctx.currentTime) {
      this.levels = levels;
      const scale = {
        rain: 0.1,
        wind: 0.12,
        lava: 0.35,
        hell: 0.4,
        cave: 0.12,
        surf: 0.12
      };
      for (const [name, g] of Object.entries(this.beds))
        g.gain.setTargetAtTime(
          levels[name] * (scale[name] ?? 0.1),
          now,
          0.6
        );
      const shots = [
        ["birds", 2.2, (t) => this.bird(t)],
        ["night", 1.6, (t) => this.cricket(t)],
        [
          "fire",
          0.18,
          (t) => clicks(
            kit(this.ctx),
            this.out,
            t,
            2,
            0.05,
            2600 + Math.random() * 2e3,
            0.04 * levels.fire
          )
        ],
        ["cave", 2.4, (t) => this.drip(t)],
        ["lava", 1.1, (t) => this.bubble(t)]
      ];
      for (const [name, every, play] of shots) {
        const level = levels[name];
        if (level < 0.05) continue;
        const due = this.nextShot[name] ?? now;
        if (now >= due) {
          play(now + Math.random() * 0.1);
          this.nextShot[name] = now + every * (0.4 + Math.random() * 1.2) / Math.max(0.3, level);
        }
      }
    }
    bird(t) {
      const k = kit(this.ctx), base = 2200 + Math.random() * 1800, notes = 2 + Math.floor(Math.random() * 4), v = this.levels.birds;
      for (let i = 0; i < notes; i++) {
        const f = base * (1 + (Math.random() - 0.5) * 0.35);
        tone(k, this.out, t + i * 0.11, {
          from: f,
          to: f * (Math.random() < 0.5 ? 1.3 : 0.8),
          peak: 0.025 * v,
          decay: 0.07,
          attack: 0.01
        });
      }
    }
    cricket(t) {
      const k = kit(this.ctx), f = 4300 + Math.random() * 500;
      for (let i = 0; i < 3; i++)
        tone(k, this.out, t + i * 0.035, { from: f, peak: 0.012 * this.levels.night, decay: 0.015 });
    }
    drip(t) {
      const f = 900 + Math.random() * 900;
      tone(kit(this.ctx), this.out, t, {
        from: f,
        to: f * 1.9,
        peak: 0.04 * this.levels.cave,
        decay: 0.08,
        glide: 0.05
      });
    }
    bubble(t) {
      const f = 90 + Math.random() * 80;
      tone(kit(this.ctx), this.out, t, {
        from: f,
        to: f * 2.2,
        peak: 0.12 * this.levels.lava,
        decay: 0.12,
        glide: 0.1
      });
    }
  };

  // src/audio/score.ts
  var Score = class {
    events = [];
    spb;
    bpb;
    meta;
    seed = 7;
    constructor(meta) {
      this.meta = meta;
      this.spb = meta.stepsPerBeat ?? 4;
      this.bpb = meta.beatsPerBar ?? 4;
    }
    get stepsPerBar() {
      return this.spb * this.bpb;
    }
    beat(bar) {
      return bar * this.bpb;
    }
    rand() {
      this.seed = this.seed * 16807 % 2147483647;
      return this.seed / 2147483647;
    }
    part(name) {
      const def = this.meta.parts[name];
      if (!def) throw new Error(`${this.meta.id}: unknown part "${name}"`);
      return def;
    }
    note(part, beat, midi, beats, vel = 1) {
      const def = this.part(part);
      this.events.push({
        t: beat,
        d: beats,
        p: part,
        m: midi + (def.transpose ?? 0),
        v: vel * (0.94 + this.rand() * 0.12)
      });
    }
    /** One note by name at a (possibly fractional) bar, lasting `beats`. */
    at(part, bar, name, beats = 1, vel = 1) {
      this.note(part, this.beat(bar), noteToMidi(name), beats, vel);
    }
    /** Plays a melody string starting at `bar`. Returns the bar after the last note. */
    play(part, bar, melody, opts = {}) {
      let step = 0, len = 4;
      const start2 = this.beat(bar);
      for (const raw of melody.trim().split(/\s+/)) {
        if (raw === "|") {
          if (step % this.stepsPerBar)
            throw new Error(`${this.meta.id}/${part} bar ${bar}: bar line at step ${step}`);
          continue;
        }
        let token = raw, vel = 1;
        if (token[0] === ">") [vel, token] = [1.2, token.slice(1)];
        else if (token[0] === "_") [vel, token] = [0.65, token.slice(1)];
        const [pitch, dur] = token.split(":");
        if (dur) len = Number(dur);
        if (!(len > 0)) throw new Error(`${this.meta.id}/${part}: bad length in "${raw}"`);
        if (pitch !== "r")
          for (const name of pitch.split("+"))
            this.note(
              part,
              start2 + step / this.spb,
              noteToMidi(name) + (opts.transpose ?? 0),
              len / this.spb * (opts.gate ?? 0.95),
              vel * (opts.vel ?? 1)
            );
        step += len;
      }
      if (step % this.stepsPerBar)
        throw new Error(`${this.meta.id}/${part} bar ${bar}: melody ends at step ${step}`);
      return bar + step / this.stepsPerBar;
    }
    /** Drum grid; `|` separators are optional and ignored. The grid repeats `times` times. */
    grid(part, bar, pattern, times = 1, opts = {}) {
      const cells = pattern.replace(/[|\s]/g, "");
      if (cells.length % this.stepsPerBar)
        throw new Error(`${this.meta.id}/${part} bar ${bar}: grid of ${cells.length} steps`);
      const bars = cells.length / this.stepsPerBar;
      for (let n = 0; n < times; n++)
        [...cells].forEach((c, i) => {
          const vel = c === "X" ? 1.2 : c === "x" ? 1 : c === "o" ? 0.5 : 0;
          if (vel)
            this.note(
              part,
              this.beat(bar + n * bars) + i / this.spb,
              opts.midi ?? 60,
              1 / this.spb,
              vel * (opts.vel ?? 1)
            );
        });
      return bar + bars * times;
    }
    /**
     * Parses a progression like `Dm Bb F:2 C:.5 A:.5`, where `:n` is a length in bars
     * (default one). Returns [chord, startBar, bars] triples.
     */
    progression(bar, symbols) {
      const out = [];
      let at = bar;
      for (const token of symbols.trim().split(/\s+/)) {
        if (token === "|") continue;
        const [sym, len] = token.split(":");
        const bars = len ? Number(len) : 1;
        out.push([parseChord(sym), at, bars]);
        at += bars;
      }
      return out;
    }
    /** Sustained, voice-led chords around `center` (MIDI). */
    pad(part, bar, symbols, center = 62, opts = {}) {
      let prev;
      const prog = this.progression(bar, symbols);
      for (const [chord, at, bars] of prog) {
        prev = voiceChord(chord, center, prev);
        for (const m of prev)
          this.note(
            part,
            this.beat(at),
            m + (opts.transpose ?? 0),
            bars * this.bpb * (opts.gate ?? 1),
            opts.vel ?? 1
          );
      }
      return this.endOf(prog);
    }
    /**
     * Rhythmic chord hits: each `x` in the one-bar `rhythm` starts a voiced chord that lasts
     * through following `-` cells.
     */
    hits(part, bar, symbols, rhythm, center = 62, opts = {}) {
      const cells = rhythm.replace(/[|\s]/g, "");
      if (cells.length !== this.stepsPerBar)
        throw new Error(`${this.meta.id}/${part}: rhythm needs ${this.stepsPerBar} steps`);
      let prev;
      const prog = this.progression(bar, symbols);
      for (const [chord, at, bars] of prog) {
        const low = pitchAtOrAbove(chord.root, center - 7);
        prev = chord.intervals.length === 2 ? [low, low + 7, low + 12] : voiceChord(chord, center, prev);
        const total = Math.round(bars * this.stepsPerBar);
        for (let s = 0; s < total; s++) {
          const c = cells[s % cells.length];
          if (c !== "x" && c !== "X" && c !== "o") continue;
          let len = 1;
          while (s + len < total && cells[(s + len) % cells.length] === "-") len++;
          const vel = c === "X" ? 1.2 : c === "o" ? 0.6 : 1;
          for (const m of prev)
            this.note(
              part,
              this.beat(at) + s / this.spb,
              m + (opts.transpose ?? 0),
              len / this.spb * (opts.gate ?? 0.9),
              vel * (opts.vel ?? 1)
            );
        }
      }
      return this.endOf(prog);
    }
    /**
     * Arpeggio over a progression. `pattern` indexes chord tones stacked upward from `low`
     * (0 is the lowest tone, and indexes past the chord climb octaves); `r` rests. Each index
     * lasts `rate` steps and the pattern cycles through every chord.
     */
    arp(part, bar, symbols, pattern, low = 60, rate = 2, opts = {}) {
      const idx = pattern.trim().split(/\s+/);
      const prog = this.progression(bar, symbols);
      for (const [chord, at, bars] of prog) {
        const tones = chordTones(chord, low);
        const steps = Math.round(bars * this.stepsPerBar);
        for (let s = 0, k = 0; s < steps; s += rate, k++) {
          const token = idx[k % idx.length];
          if (token === "r") continue;
          const i = Number(token);
          const m = tones[i % tones.length] + 12 * Math.floor(i / tones.length);
          this.note(
            part,
            this.beat(at) + s / this.spb,
            m + (opts.transpose ?? 0),
            Math.min(rate, steps - s) / this.spb * (opts.gate ?? 0.9),
            opts.vel ?? 1
          );
        }
      }
      return this.endOf(prog);
    }
    /**
     * Bass line over a progression. Tokens are `R` root (or slash bass), `5` fifth, `8` octave,
     * `3` the chord's third, `7` its seventh (or flat seventh), `-5` the fifth below, or `r` rest,
     * each with `:n` steps. The pattern cycles through every chord.
     */
    bass(part, bar, symbols, pattern, low = 36, opts = {}) {
      const tokens = pattern.trim().split(/\s+/).map((t) => {
        const [deg, len] = t.split(":");
        return [deg, Number(len || 4)];
      });
      const prog = this.progression(bar, symbols);
      for (const [chord, at, bars] of prog) {
        const root = pitchAtOrAbove(chord.bass, low);
        const third = chord.intervals.find((i) => i === 3 || i === 4) ?? 4;
        const seventh = chord.intervals.find((i) => i === 10 || i === 11) ?? 10;
        const steps = Math.round(bars * this.stepsPerBar);
        for (let s = 0, k = 0; s < steps; k++) {
          const [deg, len] = tokens[k % tokens.length];
          const offsets = {
            R: 0,
            "5": 7,
            "8": 12,
            "3": third,
            "7": seventh,
            "-5": -5
          };
          if (deg !== "r") {
            if (!(deg in offsets)) throw new Error(`${this.meta.id}/${part}: bad bass degree ${deg}`);
            this.note(
              part,
              this.beat(at) + s / this.spb,
              root + offsets[deg] + (opts.transpose ?? 0),
              Math.min(len, steps - s) / this.spb * (opts.gate ?? 0.9),
              opts.vel ?? 1
            );
          }
          s += len;
        }
      }
      return this.endOf(prog);
    }
    /** Ramps a part's low-pass cutoff (Hz) or level over `bars`. */
    automate(part, param, bar, bars, from, to) {
      this.part(part);
      this.events.push({ t: this.beat(bar), d: bars * this.bpb, p: part, param, from, to });
    }
    endOf(prog) {
      const [, at, bars] = prog[prog.length - 1];
      return at + bars;
    }
    build() {
      const m = this.meta;
      const loopBar = m.loopBar ?? 0;
      const autos = this.events.filter((e) => "param" in e);
      const resets = [];
      for (const e of autos)
        if (!resets.some((r) => r.p === e.p && r.param === e.param)) {
          const def = m.parts[e.p];
          const value = e.param === "vol" ? 1 : def.cutoff ?? 2e4;
          for (const bar of /* @__PURE__ */ new Set([0, loopBar]))
            resets.push({ t: bar * this.bpb, d: 0, p: e.p, param: e.param, from: value, to: value });
        }
      const notes = this.events.filter((e) => !("param" in e));
      if (m.swing) {
        const { unit, amount } = m.swing;
        for (const n of notes) {
          const pos = n.t / unit;
          if (Math.abs(pos - Math.round(pos)) < 1e-6 && Math.round(pos) % 2 === 1)
            n.t += unit * amount;
        }
      }
      for (const n of notes)
        if (n.t >= m.bars * this.bpb - 1e-6)
          throw new Error(`${m.id}: note in part ${n.p} at beat ${n.t} is past the last bar`);
      const events = [...resets, ...autos, ...notes].sort((a, b) => a.t - b.t);
      return {
        id: m.id,
        title: m.title,
        mood: m.mood,
        bpm: m.bpm,
        beatsPerBar: this.bpb,
        bars: m.bars,
        loopBar,
        parts: m.parts,
        events,
        sidechain: m.sidechain,
        echoBeats: m.echoBeats ?? 0.75,
        echoFeedback: m.echoFeedback ?? 0.32
      };
    }
  };
  function compose(meta, write) {
    const s = new Score(meta);
    write(s);
    return s.build();
  }

  // src/audio/tracks/boss.ts
  var boss = compose(
    {
      id: "boss",
      title: "Direwolf",
      mood: "Boss battle",
      bpm: 160,
      bars: 40,
      loopBar: 4,
      sidechain: { part: "kick", depth: 0.35, release: 0.14 },
      parts: {
        kick: { inst: "bigkick", vol: 0.8 },
        snare: { inst: "snare", vol: 0.75, rev: 0.25 },
        hat: { inst: "hat", vol: 0.45, pan: 0.3 },
        ride: { inst: "ride", vol: 0.6, pan: -0.25 },
        crash: { inst: "crash", vol: 0.65, rev: 0.25 },
        tom: { inst: "tom", vol: 0.7, rev: 0.25 },
        taiko: { inst: "taiko", vol: 0.8, rev: 0.4 },
        timp: { inst: "timpani", vol: 0.9, rev: 0.4 },
        riser: { inst: "riser", vol: 0.4, rev: 0.3 },
        impact: { inst: "impact", vol: 0.8, rev: 0.4 },
        howl: { inst: "howl", vol: 0.6, rev: 0.8, echo: 0.3, pan: 0.3 },
        bass: { inst: "synthbass", vol: 0.9, duck: true },
        guitar: { inst: "guitar", vol: 0.9, pan: -0.35 },
        guitar2: { inst: "guitar", vol: 0.55, pan: 0.35, transpose: 12 },
        pad: { inst: "pad", vol: 0.6, duck: true, rev: 0.4 },
        choir: { inst: "choir", vol: 0.85, rev: 0.6 },
        brass: { inst: "brass", vol: 1, rev: 0.35 },
        lead: { inst: "pulse", vol: 0.8, rev: 0.25, echo: 0.2 },
        lead2: { inst: "supersaw", vol: 0.7, rev: 0.25, echo: 0.1 },
        hit: { inst: "orchhit", vol: 0.9, rev: 0.4 }
      }
    },
    (s) => {
      const riff = "C#5 C#5 A5 B5 C#5 C#5 A5 G#5", harm = "C#m C#m A B C#m C#m A G#", breakdown = "A B C#m C#m A B G# G#", breakPower = "A5 B5 C#5 C#5 A5 B5 G#5 G#5", turn = "C#m A B G#", turnPower = "C#5 A5 B5 G#5";
      const chug = "x-.xx-.xx-.xx.xx";
      const rock = (bar, bars, kick2) => {
        s.grid("kick", bar, kick2, bars);
        s.grid("snare", bar, "....x.......x...", bars);
      };
      const lead = "c#5:2 e5:2 g#5:4 f#5:2 e5:2 d#5:2 e5:2 | c#5:8 g#4:8 | a4:2 c#5:2 e5:4 f#5:2 e5:2 c#5:4 | d#5:6 f#5:2 b5:8 | c#6:2 b5:2 g#5:4 a5:2 g#5:2 f#5:2 e5:2 | g#5:8 e5:4 c#5:4 | e5:4 f#5:4 a5:4 c#6:4 | b#5:4 d#6:4 g#6:8";
      s.play("howl", 0, "g#4:24 r:8 | r:32");
      s.grid("timp", 0, "o.o.o.o.o.o.o.o.|oooooooooooooooo|xxxxxxxxxxxxxxxx|XXXXXXXX........", 1, {
        midi: 37
      });
      s.play("hit", 2, "r:16 | >c#4:3 c#4:3 c#4:2 >g#3:8");
      s.pad("choir", 0, "C#m:2 A G#", 60, { vel: 0.8 });
      s.note("riser", 4, 60, 12);
      s.note("impact", 16, 60, 1);
      s.grid("crash", 4, "x...............");
      s.grid("crash", 8, "x...............");
      s.hits("guitar", 4, riff, chug, 49);
      s.hits("guitar2", 4, riff, chug, 49);
      s.bass("bass", 4, harm, "R:2", 32);
      rock(4, 7, "x.x.x.xxx.x.x.xx");
      rock(11, 1, "x.x.x.xxxxxxxxxx");
      s.grid("hat", 4, "x.x.x.x.x.x.x.x.", 8);
      s.play("hit", 4, ">c#4:16 | r:16 | r:16 | r:16 | c#4:16 | r:16 | r:16 | r:8 >g#3:8");
      s.play("brass", 4, "r:16 | r:8 g#4:8 | a4:16 | b4:16 | r:16 | r:8 g#4:8 | c#5:16 | b#4:16", {
        vel: 0.8
      });
      s.grid("crash", 12, "x...............");
      s.play("lead", 12, lead);
      s.play("lead2", 12, lead, { transpose: -12, vel: 0.8 });
      s.hits("guitar", 12, riff, "x-.x..x-.x..x-x-", 49);
      s.hits("guitar2", 12, riff, "x-.x..x-.x..x-x-", 49);
      s.pad("pad", 12, harm, 60, { vel: 0.8 });
      s.bass("bass", 12, harm, "R:2", 32);
      rock(12, 8, "x..x..x.x..x..x.");
      s.grid("ride", 12, "x.x.x.x.x.x.x.x.", 8);
      s.note("impact", 80, 60, 1);
      s.grid("crash", 20, "x...............");
      s.hits("guitar", 20, breakPower, "x-------x--.x...", 49);
      s.hits("guitar2", 20, breakPower, "x-------x--.x...", 49);
      s.play("brass", 20, "e5:16 | f#5:16 | g#5:16 | g#5:8 b5:8 | c#6:16 | d#6:16 | b#5:16 | g#5:16");
      s.play(
        "lead2",
        20,
        "e5:16 | f#5:16 | g#5:16 | g#5:8 b5:8 | c#6:16 | d#6:16 | b#5:16 | g#5:16",
        {
          transpose: -12,
          vel: 0.5
        }
      );
      s.pad("choir", 20, breakdown, 62);
      s.bass("bass", 20, breakdown, "R:8 R:6 R:2", 32);
      s.grid("kick", 20, "x.........x.....", 8);
      s.grid("snare", 20, "........x.......", 7);
      s.grid("snare", 27, "........x.x.xxxx");
      s.grid("taiko", 20, "....x......x..x.", 8);
      s.bass("timp", 20, breakdown, "R:8 R:8", 37);
      s.grid("hat", 20, "x.x.x.x.x.x.x.x.", 8, { vel: 0.6 });
      s.grid("crash", 28, "x...............");
      s.grid("crash", 32, "x...............");
      s.play("lead", 28, lead, { transpose: 12 });
      s.play("lead2", 28, lead);
      s.play("brass", 28, lead, { vel: 0.8 });
      s.hits("guitar", 28, riff, chug, 49);
      s.hits("guitar2", 28, riff, chug, 49);
      s.pad("choir", 28, harm, 64, { vel: 0.8 });
      s.pad("pad", 28, harm, 60, { vel: 0.8 });
      s.bass("bass", 28, harm, "R:1 R:1 8:1 R:1", 32);
      rock(28, 8, "x.x.x.xxx.x.x.xx");
      s.grid("ride", 28, "x.x.x.x.x.x.x.x.", 8);
      s.play("hit", 28, ">c#4:16 | r:16 | r:16 | r:16 | c#4:16 | r:16 | r:16 | r:16");
      s.hits("guitar", 36, turnPower, "x.xx.xx.x.xx.x.x", 49);
      s.hits("guitar2", 36, turnPower, "x.xx.xx.x.xx.x.x", 49);
      s.bass("bass", 36, turn, "R:2", 32);
      s.play(
        "hit",
        36,
        ">c#4:3 c#4:3 c#4:10 | a3:3 a3:3 a3:10 | b3:3 b3:3 b3:10 | >g#3:3 g#3:3 g#3:2 g#3:8"
      );
      rock(36, 3, "x.x.x.xxx.x.x.xx");
      s.grid("kick", 39, "x.x.x.x.x.x.x.x.");
      s.grid("tom", 39, "x.x.x.x.xxxxxxxx", 1, { midi: 48 });
      s.grid("hat", 36, "x.x.x.x.x.x.x.x.", 4);
      s.note("riser", 148, 60, 8);
    }
  );

  // src/audio/tracks/brimstone.ts
  var brimstone = compose(
    {
      id: "brimstone",
      title: "Brimstone Forges",
      mood: "Upper hell",
      bpm: 112,
      bars: 28,
      sidechain: { part: "kick", depth: 0.4, release: 0.2 },
      parts: {
        kick: { inst: "bigkick", vol: 0.8 },
        snare: { inst: "snare", vol: 0.6, rev: 0.3 },
        taiko: { inst: "taiko", vol: 0.85, rev: 0.4 },
        tom: { inst: "tom", vol: 0.6, rev: 0.3 },
        anvil: { inst: "ride", vol: 2, rev: 0.35, pan: 0.3 },
        crash: { inst: "crash", vol: 0.55, rev: 0.3 },
        riser: { inst: "riser", vol: 0.4, rev: 0.3 },
        impact: { inst: "impact", vol: 0.7, rev: 0.5 },
        bass: { inst: "synthbass", vol: 0.75, duck: true },
        pad: { inst: "pad", vol: 0.6, duck: true, rev: 0.45, cutoff: 1600 },
        trem: { inst: "tremolo", vol: 1.1, rev: 0.45 },
        brass: { inst: "brass", vol: 1, rev: 0.4 },
        lead: { inst: "pulse", vol: 0.75, rev: 0.3, echo: 0.3 },
        choir: { inst: "choir", vol: 0.8, rev: 0.6 },
        hit: { inst: "orchhit", vol: 0.7, rev: 0.45 }
      }
    },
    (s) => {
      const prog = "Fm Gb Fm Eb Fm Gb Db C";
      const ostinato = "R:2 R:1 R:1 8:2 R:2 5:2 R:2 8:2 7:2";
      const theme = "f4:6 gb4:2 ab4:4 c5:4 | db5:6 c5:2 bb4:8 | ab4:6 bb4:2 c5:4 f5:4 | eb5:8 db5:4 c5:4 | f5:6 gb5:2 ab5:4 f5:4 | gb5:6 f5:2 db5:8 | db5:4 eb5:4 f5:4 ab5:4 | g5:8 e5:4 c5:4";
      const forge = (bar, bars, full) => {
        s.grid("kick", bar, full ? "x..x..x.x..x..x." : "x.......x.......", bars);
        s.grid("snare", bar, "....x.......x...", bars);
        s.grid("taiko", bar, full ? "x.....x...x....." : "x...........x...", bars);
        s.grid("anvil", bar, "..x...x...x...xx", bars, { vel: 0.8 });
      };
      s.bass("bass", 0, prog, ostinato, 29);
      s.pad("trem", 0, prog, 53, { vel: 0.8 });
      s.grid("taiko", 0, "x.......x.......", 8);
      s.grid("anvil", 0, "........x.......", 8, { vel: 0.7 });
      s.grid("tom", 7, "x.x.x.x.xxxxxxxx", 1, { midi: 45 });
      s.play("hit", 0, ">f3:16 | r:16 | r:16 | r:16 | f3:16 | r:16 | r:16 | >c4:4 c4:4 c4:8");
      s.note("impact", 32, 60, 1);
      s.grid("crash", 8, "x...............");
      s.play("brass", 8, theme);
      s.bass("bass", 8, prog, ostinato, 29);
      s.pad("pad", 8, prog, 60);
      forge(8, 8, false);
      s.grid("crash", 16, "x...............");
      s.grid("crash", 20, "x...............");
      s.play("lead", 16, theme, { transpose: 12 });
      s.play("brass", 16, theme, { vel: 0.8 });
      s.pad("choir", 16, prog, 64);
      s.pad("pad", 16, prog, 57);
      s.bass("bass", 16, prog, "R:1 R:1 8:1 R:1", 29);
      forge(16, 8, true);
      s.play("hit", 16, ">f3:16 | r:16 | r:16 | r:16 | f3:16 | r:16 | db4:16 | >c4:3 c4:3 c4:10");
      s.pad("choir", 24, "Fm:2 Gb C", 58, { vel: 0.8 });
      s.bass("bass", 24, "Fm:2 Gb C", "R:4 r:4 R:2 R:2 r:4", 29);
      s.grid("taiko", 24, "x..x..x.x..x..x.", 3);
      s.grid("tom", 26, "....x.x.x.xxxxxx", 1, { midi: 50 });
      s.grid("tom", 27, "xxxxxxxxxxxxxxxx", 1, { midi: 43 });
      s.grid("snare", 27, "........xxxxxxxx");
      s.automate("snare", "vol", 27, 1, 0.4, 1.2);
      s.note("riser", 104, 60, 8);
    }
  );

  // src/audio/tracks/cave.ts
  var cave = compose(
    {
      id: "cave",
      title: "Lantern Glow",
      mood: "Caves",
      bpm: 96,
      bars: 24,
      parts: {
        kick: { inst: "kick", vol: 0.85 },
        rim: { inst: "rim", vol: 0.5, rev: 0.35 },
        hat: { inst: "hat", vol: 0.4, pan: 0.3, echo: 0.2 },
        bass: { inst: "bass", vol: 1, echo: 0.1 },
        pad: { inst: "pad", vol: 0.55, rev: 0.6, cutoff: 1500 },
        lead: { inst: "square", vol: 0.8, rev: 0.4, echo: 0.3 },
        glock: { inst: "bell", vol: 0.45, rev: 0.45, echo: 0.3, pan: 0.2 },
        pizz: { inst: "pizz", vol: 0.6, rev: 0.3, echo: 0.25, pan: -0.3 },
        drip: { inst: "drip", vol: 0.5, rev: 0.7, echo: 0.4 }
      },
      echoBeats: 0.75,
      echoFeedback: 0.4
    },
    (s) => {
      const progA = "F#m F#m D E F#m F#m Bm C#", progB = "D E C#m F#m D E C# C#";
      const groove = "R:2 r:1 R:1 8:2 R:2 5:2 8:2 5:2 R:2";
      const themeA = "c#5:3 f#5:3 a5:2 g#5:4 f#5:4 | e5:3 f#5:3 e5:2 c#5:8 | d5:3 f#5:3 a5:2 b5:4 a5:4 | g#5:6 e5:2 b4:8 | c#6:3 b5:3 a5:2 g#5:4 f#5:4 | a5:3 g#5:3 f#5:2 c#5:8 | d5:4 f#5:4 b5:4 a5:4 | g#5:8 e#5:4 c#5:4";
      s.play("lead", 0, themeA);
      s.play("glock", 0, themeA, { transpose: 12, vel: 0.45 });
      s.bass("bass", 0, progA, groove, 30);
      s.pad("pad", 0, progA, 61, { vel: 0.8 });
      s.grid("kick", 0, "x......x..x.....", 8);
      s.grid("rim", 0, "....x.......x...", 8);
      s.grid("hat", 0, "x.x.x.x.x.x.x.x.", 8, { vel: 0.8 });
      s.play(
        "lead",
        8,
        "f#5:6 e5:2 d5:4 a4:4 | g#5:6 f#5:2 e5:4 b4:4 | e5:4 g#5:4 c#6:4 b5:4 | a5:8 f#5:8 | a5:6 b5:2 a5:4 d6:4 | e6:6 d6:2 b5:8 | c#6:4 b5:2 g#5:2 e#5:8 | g#5:8 r:8"
      );
      s.arp("pizz", 8, progB, "0 1 2 3 2 1 2 1", 61, 2);
      s.bass("bass", 8, progB, groove, 30);
      s.pad("pad", 8, progB, 61);
      s.grid("kick", 8, "x......x..x.....", 7);
      s.grid("kick", 15, "x......x..x.x.x.");
      s.grid("rim", 8, "....x.......x...", 8);
      s.grid("hat", 8, "x.xxx.xxx.xxx.xx", 8, { vel: 0.8 });
      s.play("glock", 16, themeA);
      s.bass("bass", 16, progA, "R:6 r:2 5:4 8:4", 30, { vel: 0.8 });
      s.pad("pad", 16, progA, 61, { vel: 0.9 });
      s.grid("rim", 16, "............x...", 8);
      s.grid("kick", 20, "x.........x.....", 4);
      const drips = [
        [16, "c#7"],
        [16.75, "a6"],
        [17.6, "f#6"],
        [18.4, "e7"],
        [19.1, "b6"],
        [19.8, "c#7"],
        [20.5, "g#6"],
        [21.3, "f#7"],
        [22.2, "a6"],
        [23.1, "c#7"]
      ];
      for (const [bar, note] of drips) s.at("drip", bar, note);
    }
  );

  // src/audio/tracks/coast.ts
  var coast = compose(
    {
      id: "coast",
      title: "Salt Wind Waltz",
      mood: "Coast \xB7 day",
      bpm: 108,
      beatsPerBar: 3,
      bars: 36,
      parts: {
        kick: { inst: "kick", vol: 0.7 },
        shaker: { inst: "shaker", vol: 0.5, pan: 0.3 },
        tamb: { inst: "tamb", vol: 0.35, pan: -0.3 },
        surf: { inst: "wind", vol: 0.5, rev: 0.4 },
        bass: { inst: "bass", vol: 0.8 },
        harp: { inst: "harp", vol: 0.75, rev: 0.4, pan: -0.2 },
        guitar: { inst: "pluck", vol: 0.55, pan: 0.25, rev: 0.2 },
        pad: { inst: "pad", vol: 0.55, rev: 0.45 },
        ocarina: { inst: "ocarina", vol: 0.95, rev: 0.4, echo: 0.15 },
        marimba: { inst: "marimba", vol: 0.8, rev: 0.3, echo: 0.1 },
        glock: { inst: "bell", vol: 0.35, rev: 0.4, pan: 0.2 },
        strings: { inst: "strings", vol: 0.85, rev: 0.45 }
      }
    },
    (s) => {
      const progA = "F C/E Dm Bb F C Bb C", progB = "Dm Am Bb F Gm Am Bb C", tag = "Bb C Dm C";
      const themeA = "c5:4 f5:4 a5:4 | g5:6 e5:2 c5:4 | d5:4 f5:4 a5:4 | bb5:6 a5:2 f5:4 | c6:6 a5:2 f5:4 | e5:4 g5:4 c6:4 | d6:6 c6:2 bb5:4 | c6:4 g5:8";
      const themeB = "a5:8 f5:4 | e5:8 c5:4 | f5:4 bb5:4 d6:4 | c6:8 a5:4 | bb5:6 a5:2 g5:4 | a5:6 g5:2 e5:4 | d5:4 f5:4 bb5:4 | g5:4 a5:4 bb5:4";
      const waltz = (bar, prog) => {
        s.arp("harp", bar, prog, "0 1 2 3 2 1", 53, 2);
        s.bass("bass", bar, prog, "R:4 r:8", 41);
        s.hits("guitar", bar, prog, "....x...x...", 62, { vel: 0.7 });
        s.pad("pad", bar, prog, 62, { vel: 0.7 });
      };
      s.play("ocarina", 0, themeA);
      waltz(0, progA);
      s.play("strings", 8, themeB, { transpose: -12, vel: 0.8 });
      s.play("ocarina", 8, themeB);
      waltz(8, progB);
      s.play("marimba", 16, themeA);
      s.play("glock", 16, themeA, { transpose: 12, vel: 0.5 });
      waltz(16, progA);
      s.play("ocarina", 24, themeB);
      s.play("strings", 24, themeB, { transpose: -12 });
      s.play("marimba", 24, themeB, { vel: 0.5 });
      waltz(24, progB);
      s.play("ocarina", 32, "d5:4 f5:4 bb5:4 | c6:8 bb5:4 | a5:8 f5:4 | e5:6 g5:6");
      s.play("strings", 32, "f4:12 | g4:12 | a4:12 | g4:12", { vel: 0.6 });
      waltz(32, tag);
      s.grid("kick", 0, "x...........", 36);
      s.grid("shaker", 0, "x.o.x.o.x.o.", 36);
      s.grid("tamb", 8, "....x...x...", 8);
      s.grid("tamb", 24, "....x...x...", 12);
      for (let bar = 0; bar < 36; bar += 4) s.note("surf", bar * 3, 55, 5, 0.8);
    }
  );

  // src/audio/tracks/cold.ts
  var cold = compose(
    {
      id: "cold",
      title: "Hoarfrost",
      mood: "Tundra \xB7 taiga \xB7 alpine",
      bpm: 84,
      bars: 22,
      loopBar: 2,
      parts: {
        kick: { inst: "kick", vol: 0.6 },
        rim: { inst: "rim", vol: 0.35, rev: 0.4 },
        sleigh: { inst: "tamb", vol: 0.4, pan: 0.3, rev: 0.2 },
        timp: { inst: "timpani", vol: 0.6, rev: 0.5 },
        wind: { inst: "wind", vol: 0.55, rev: 0.3 },
        sub: { inst: "sub", vol: 0.8 },
        harp: { inst: "harp", vol: 0.7, rev: 0.5, pan: -0.2 },
        pad: { inst: "pad", vol: 0.75, rev: 0.55 },
        box: { inst: "musicbox", vol: 0.9, rev: 0.45, echo: 0.25 },
        glock: { inst: "bell", vol: 0.45, rev: 0.5, echo: 0.2, pan: 0.25 },
        strings: { inst: "strings", vol: 0.85, rev: 0.5 }
      }
    },
    (s) => {
      const progA = "Bm G D A Bm G Em F#", progB = "G A F#m Bm Em A D F#", progA2 = "Bm G Em F#";
      const bed = (bar, prog) => {
        s.arp("harp", bar, prog, "0 1 2 3 4 3 2 1", 59, 2);
        s.pad("pad", bar, prog, 62, { vel: 0.8 });
        s.bass("sub", bar, prog, "R:16", 35);
      };
      s.arp("harp", 0, "Bm Bm", "0 1 2 3 4 5 4 3", 59, 2, { vel: 0.8 });
      s.pad("pad", 0, "Bm:2", 62, { vel: 0.6 });
      s.note("wind", 0, 67, 6, 0.9);
      const theme = "f#5:4 b5:4 c#6:2 d6:6 | d6:4 b5:4 g5:8 | a5:4 d6:4 e6:2 f#6:6 | e6:6 c#6:2 a5:8 | f#5:4 b5:4 c#6:2 d6:6 | e6:4 d6:4 b5:4 g5:4 | g5:4 b5:4 e6:4 d6:4 | c#6:8 a#5:4 f#5:4";
      s.play("box", 2, theme);
      bed(2, progA);
      s.grid("kick", 2, "x.........x.....", 8, { vel: 0.8 });
      s.grid("rim", 2, "........x.......", 8);
      const themeB = "d6:6 c#6:2 b5:8 | c#6:6 b5:2 a5:8 | a5:6 f#5:2 c#6:8 | d6:6 c#6:2 b5:8 | e6:6 d6:2 b5:4 g5:4 | a5:6 b5:2 c#6:4 e6:4 | f#6:8 e6:4 d6:4 | c#6:8 a#5:8";
      s.play("strings", 10, themeB, { transpose: -12 });
      s.play("glock", 10, themeB);
      bed(10, progB);
      s.grid("kick", 10, "x.........x.....", 8);
      s.grid("rim", 10, "....x.......x...", 8);
      s.grid("sleigh", 10, "x.o.x.o.x.o.x.o.", 8);
      s.bass("timp", 10, progB, "R:16", 35);
      s.play(
        "box",
        18,
        "f#5:4 b5:4 c#6:2 d6:6 | d6:4 b5:4 g5:8 | g5:4 b5:4 e6:4 d6:4 | c#6:8 a#5:4 f#5:4"
      );
      s.play("strings", 18, "d5:16 | b4:16 | b4:16 | a#4:16", { vel: 0.6 });
      bed(18, progA2);
      s.grid("kick", 18, "x.........x.....", 4, { vel: 0.8 });
      s.grid("sleigh", 18, "x...x...x...x...", 4);
      for (const bar of [5, 9, 13, 17, 21]) s.note("wind", bar * 4, 62 + bar % 3 * 4, 5, 0.7);
    }
  );

  // src/audio/tracks/depths.ts
  var depths = compose(
    {
      id: "depths",
      title: "Crystal Dark",
      mood: "Deep caves",
      bpm: 80,
      bars: 20,
      parts: {
        heart: { inst: "kick", vol: 0.8 },
        taiko: { inst: "taiko", vol: 0.7, rev: 0.6 },
        swell: { inst: "swell", vol: 0.4, rev: 0.5 },
        drip: { inst: "drip", vol: 0.4, rev: 0.7, echo: 0.4, pan: -0.4 },
        sub: { inst: "sub", vol: 0.9 },
        pad: { inst: "pad", vol: 0.8, rev: 0.6, cutoff: 1200 },
        trem: { inst: "tremolo", vol: 0.55, rev: 0.5, cutoff: 1800 },
        choir: { inst: "choir", vol: 0.9, rev: 0.7 },
        crystal: { inst: "crystal", vol: 1, rev: 0.6, echo: 0.35 },
        glint: { inst: "crystal", vol: 0.45, rev: 0.6, echo: 0.4, pan: 0.4 }
      },
      echoBeats: 1.5,
      echoFeedback: 0.42
    },
    (s) => {
      const progA = "Bbm Gb Ebm F Bbm Gb Db F", progB = "Gb Ab Bbm Bbm Gb Ab F F", progC = "Bbm Gb Ebm F";
      const themeA = "f5:8 db5:4 bb4:4 | bb5:8 gb5:8 | eb5:6 gb5:2 bb5:8 | a5:8 c6:4 f5:4 | db6:8 c6:4 bb5:4 | bb5:6 ab5:2 gb5:8 | f5:6 ab5:2 db6:8 | c6:8 a5:8";
      const beat = (bar, bars) => {
        s.grid("heart", bar, "x..x............", bars);
        s.grid("taiko", bar + 3, "x.......x.......", 1);
      };
      s.play("crystal", 0, themeA);
      s.pad("pad", 0, progA, 58);
      s.bass("sub", 0, progA, "R:16", 34);
      beat(0, 8);
      s.grid("taiko", 7, "x.......x...x.x.");
      s.play(
        "choir",
        8,
        "db5:16 | eb5:16 | f5:8 db5:8 | bb4:16 | gb5:8 f5:8 | ab5:8 eb5:8 | a5:16 | c6:8 a5:8"
      );
      s.pad("trem", 8, progB, 50);
      s.pad("pad", 8, progB, 60);
      s.arp("glint", 8, progB, "4 r 3 r 5 r 2 r", 70, 2);
      s.bass("sub", 8, progB, "R:16", 34);
      beat(8, 8);
      s.note("swell", 28, 60, 4);
      s.note("swell", 60, 60, 4);
      s.play("crystal", 16, "f5:8 db5:4 bb4:4 | bb5:8 gb5:8 | eb5:6 gb5:2 bb5:8 | a5:8 c6:4 f5:4");
      s.pad("choir", 16, progC, 58, { vel: 0.6 });
      s.pad("pad", 16, progC, 58);
      s.bass("sub", 16, progC, "R:16", 34);
      beat(16, 4);
      s.note("swell", 76, 60, 4);
      for (const [bar, note] of [
        [1.5, "f6"],
        [4.25, "bb6"],
        [6.6, "db7"],
        [10.3, "f6"],
        [13.7, "ab6"],
        [17.4, "bb6"]
      ])
        s.at("drip", bar, note);
    }
  );

  // src/audio/tracks/desert.ts
  var desert = compose(
    {
      id: "desert",
      title: "Mirage Caravan",
      mood: "Desert \xB7 badlands",
      bpm: 110,
      bars: 30,
      loopBar: 2,
      parts: {
        doum: { inst: "doum", vol: 0.9, rev: 0.15 },
        tek: { inst: "tek", vol: 0.6, pan: 0.2, rev: 0.15 },
        frame: { inst: "taiko", vol: 0.5, rev: 0.3 },
        tamb: { inst: "tamb", vol: 0.35, pan: -0.3 },
        zill: { inst: "zill", vol: 0.8, rev: 0.4, pan: 0.3 },
        riser: { inst: "riser", vol: 0.35, rev: 0.3 },
        drone: { inst: "pad", vol: 0.7, rev: 0.4, cutoff: 1e3 },
        bass: { inst: "bass", vol: 0.85 },
        oud: { inst: "oud", vol: 0.8, pan: -0.2, rev: 0.25, echo: 0.1 },
        shawm: { inst: "shawm", vol: 0.95, rev: 0.35, echo: 0.15 },
        strings: { inst: "strings", vol: 0.8, rev: 0.4 },
        pad: { inst: "pad", vol: 0.5, rev: 0.45 }
      }
    },
    (s) => {
      const progA = "E E F E Am G F E", progB = "Am Dm E E Am Dm F E";
      const maqsum = (bar, bars, busy) => {
        s.grid("doum", bar, "x.......x.......", bars);
        s.grid("tek", bar, busy ? "..x.o.x.o.o.x.oo" : "..x...x.....x...", bars);
        s.grid("tamb", bar, "....x.......x...", bars);
        s.grid("zill", bar, "x...............", bars);
      };
      s.pad("drone", 0, "E5:2", 52);
      s.arp("oud", 0, "E E", "0 1 0 2 0 1 2 1", 52, 2, { vel: 0.8 });
      maqsum(0, 2, false);
      const themeA = "e5:2 f5:2 g#5:4 a5:2 g#5:2 f5:4 | e5:4 f5:2 e5:2 d5:2 e5:6 | f5:2 a5:2 c6:4 b5:2 a5:2 f5:4 | a5:2 g#5:2 f5:2 e5:10 | e5:2 a5:2 c6:4 b5:2 a5:2 e5:4 | d5:2 g5:2 b5:4 a5:2 g5:2 d5:4 | c5:2 f5:2 a5:4 g#5:2 a5:2 f5:4 | e5:2 f5:2 e5:2 d5:2 e5:8";
      s.play("shawm", 2, themeA);
      s.pad("drone", 2, "E5 E5 F5 E5 A5 G5 F5 E5", 52);
      s.bass("bass", 2, progA, "R:6 R:2 5:4 R:4", 40);
      s.arp("oud", 2, progA, "0 1 0 2 0 1 2 1", 52, 2, { vel: 0.7 });
      maqsum(2, 8, false);
      const themeB = "a5:4 c6:4 e6:4 d6:2 c6:2 | d6:4 f6:4 e6:2 d6:2 c6:4 | b5:2 c6:2 b5:2 a5:2 g#5:4 f5:4 | e5:12 r:4 | e6:4 c6:2 a5:2 e6:4 d6:4 | f6:4 d6:2 a5:2 d6:4 c6:4 | c6:2 d6:2 c6:2 b5:2 a5:4 f5:4 | g#5:4 f5:2 e5:10";
      s.play("strings", 10, themeB, { transpose: -12 });
      s.play("oud", 10, themeB, { vel: 0.9 });
      s.pad("pad", 10, progB, 60);
      s.bass("bass", 10, progB, "R:6 R:2 5:4 R:4", 40);
      maqsum(10, 8, true);
      s.grid("frame", 10, "x.......x.......", 8);
      s.play("shawm", 18, themeA);
      s.play("strings", 18, themeA, { transpose: -12, vel: 0.7 });
      s.pad("drone", 18, "E5 E5 F5 E5 A5 G5 F5 E5", 52);
      s.pad("pad", 18, progA, 60, { vel: 0.8 });
      s.bass("bass", 18, progA, "R:6 R:2 5:4 R:4", 40);
      s.arp("oud", 18, progA, "0 1 0 2 0 1 2 1", 64, 2, { vel: 0.6 });
      maqsum(18, 8, true);
      s.grid("frame", 18, "x.......x.......", 8);
      s.pad("drone", 26, "E5:4", 52);
      const ostinato = "e4:2 e4:1 e4:1 f4:2 e4:2 g#4:2 e4:2 f4:2 e4:2";
      s.play("oud", 26, [ostinato, ostinato, ostinato, ostinato].join(" | "));
      s.grid("doum", 26, "x..x....x..x....|x..x....x..x....|x..x..x.x..x....|x.x.x.x.xxxxxxxx");
      s.grid("tek", 26, "..xoxo.x.oxoxox.|..xoxo.x.oxoxox.|.xoxoxoxoxoxoxox|.x.x.x.x........");
      s.grid("zill", 26, "x.......x.......", 4);
      s.note("riser", 112, 60, 8, 0.8);
    }
  );

  // src/audio/tracks/fallen.ts
  var fallen = compose(
    {
      id: "fallen",
      title: "What the Wild Takes",
      mood: "Fallen",
      bpm: 66,
      bars: 16,
      parts: {
        toll: { inst: "bell", vol: 0.5, rev: 0.7 },
        sub: { inst: "sub", vol: 0.7 },
        harp: { inst: "harp", vol: 0.6, rev: 0.55, pan: 0.2 },
        pad: { inst: "pad", vol: 0.75, rev: 0.6 },
        choir: { inst: "choir", vol: 0.7, rev: 0.7 },
        keys: { inst: "epiano", vol: 0.9, rev: 0.45, echo: 0.15, pan: -0.15 },
        strings: { inst: "strings", vol: 0.8, rev: 0.55 }
      },
      echoBeats: 1
    },
    (s) => {
      const prog = "Am F C G Am F Dm E F G Em Am Dm Am F E";
      const melody = "a4:6 b4:2 c5:4 e5:4 | f5:8 e5:4 c5:4 | e5:6 d5:2 c5:8 | d5:8 b4:8 | c5:6 d5:2 e5:4 a5:4 | a5:6 g5:2 f5:8 | f5:6 e5:2 d5:8 | e5:8 g#4:8 | c5:6 d5:2 f5:4 a5:4 | g5:8 d5:8 | b4:6 e5:2 g5:8 | a5:8 e5:8 | f5:6 e5:2 d5:4 a4:4 | c5:6 b4:2 a4:8 | a4:6 c5:2 f5:8 | g#4:8 b4:4 e5:4";
      s.play("keys", 0, melody);
      s.play("strings", 4, melody.split("|").slice(4).join("|"), { vel: 0.7 });
      s.pad("pad", 0, prog, 57, { vel: 0.8 });
      s.arp("harp", 0, prog, "0 1 2 3", 45, 4);
      s.pad("choir", 8, "F G Em Am Dm Am F E", 64, { vel: 0.6 });
      s.bass("sub", 0, prog, "R:16", 33);
      for (const bar of [0, 4, 8, 12]) s.at("toll", bar, "a3", 4);
    }
  );

  // src/audio/tracks/forest.ts
  var forest = compose(
    {
      id: "forest",
      title: "Under the Canopy",
      mood: "Forest \xB7 day",
      bpm: 76,
      stepsPerBeat: 3,
      bars: 22,
      loopBar: 2,
      parts: {
        kick: { inst: "kick", vol: 0.75 },
        hand: { inst: "tom", vol: 0.45, rev: 0.25, pan: 0.2 },
        shaker: { inst: "shaker", vol: 0.45, pan: -0.3 },
        bass: { inst: "pizz", vol: 0.9 },
        harp: { inst: "harp", vol: 0.75, rev: 0.4, pan: -0.15 },
        pad: { inst: "pad", vol: 0.6, rev: 0.5 },
        flute: { inst: "flute", vol: 1, rev: 0.45, echo: 0.15 },
        strings: { inst: "strings", vol: 0.85, rev: 0.45 },
        bell: { inst: "bell", vol: 0.35, rev: 0.5, echo: 0.35, pan: 0.3 }
      },
      echoBeats: 1 / 3
    },
    (s) => {
      const progA = "Em C G D Em C Am B", progB = "Cmaj7 D G Em Am C D B7", progC = "Em C Am B";
      const grove = (bar, prog, busy) => {
        s.arp("harp", bar, prog, "0 1 2 3 2 1", 52, 1);
        s.bass("bass", bar, prog, "R:3 r:3 5:3 r:3", 40);
        s.pad("pad", bar, prog, 59, { vel: 0.8 });
        const bars = s.progression(bar, prog).length;
        s.grid("kick", bar, "x.....x.....", bars);
        s.grid("shaker", bar, busy ? "x.ox.ox.ox.o" : "x.....x.....", bars);
        if (busy) s.grid("hand", bar, "...x.o...x.x", bars, { midi: 62 });
      };
      s.arp("harp", 0, "Em Em", "0 1 2 3 4 5", 52, 1, { vel: 0.8 });
      s.pad("pad", 0, "Em:2", 59, { vel: 0.7 });
      s.play("bell", 0, "e6:3 b5:3 g6:6 | f#6:3 e6:3 b5:6");
      const themeA = "b4:3 e5:2 f#5:1 g5:3 b5:3 | a5:4 g5:2 e5:6 | d5:3 g5:2 a5:1 b5:3 d6:3 | c6:4 b5:2 a5:6 | b5:3 g5:2 e5:1 f#5:3 g5:3 | e5:3 g5:3 c6:3 g5:3 | a5:4 g5:2 e5:3 c5:3 | d#5:6 f#5:3 b5:3";
      s.play("flute", 2, themeA);
      grove(2, progA, false);
      s.play("bell", 5, "r:6 f#6:6", { vel: 0.7 });
      s.play("bell", 9, "r:6 b6:6", { vel: 0.7 });
      s.play(
        "strings",
        10,
        "e5:6 g5:6 | f#5:6 a5:6 | b5:4 a5:2 g5:6 | g5:4 f#5:2 e5:6 | c6:6 b5:3 a5:3 | g5:6 a5:3 b5:3 | c6:4 b5:2 a5:3 f#5:3 | d#5:4 e5:2 f#5:3 a5:3"
      );
      s.play("flute", 10, "r:12 | r:12 | d6:12 | b5:12 | e6:12 | e6:12 | a5:6 d6:6 | b5:12", {
        vel: 0.55
      });
      grove(10, progB, true);
      s.play(
        "flute",
        18,
        "b4:3 e5:2 f#5:1 g5:3 b5:3 | a5:4 g5:2 e5:6 | a5:4 g5:2 e5:3 c5:3 | d#5:6 f#5:3 b5:3"
      );
      s.play("bell", 18, "b5:12 | e6:12 | c6:12 | b5:12", { vel: 0.5 });
      grove(18, progC, true);
    }
  );

  // src/audio/tracks/marsh.ts
  var marsh = compose(
    {
      id: "marsh",
      title: "Mire Shuffle",
      mood: "Marsh",
      bpm: 96,
      bars: 24,
      swing: { unit: 0.5, amount: 0.3 },
      parts: {
        kick: { inst: "kick", vol: 0.85 },
        rim: { inst: "rim", vol: 0.55, rev: 0.2 },
        bongo: { inst: "tom", vol: 0.4, pan: 0.3, rev: 0.15 },
        conga: { inst: "tom", vol: 0.45, pan: -0.3, rev: 0.15 },
        shaker: { inst: "shaker", vol: 0.5, pan: 0.2 },
        bass: { inst: "bass", vol: 0.9 },
        marimba: { inst: "marimba", vol: 0.75, rev: 0.25, pan: -0.2 },
        pad: { inst: "pad", vol: 0.6, rev: 0.5, cutoff: 1100 },
        reed: { inst: "reed", vol: 1, rev: 0.35, echo: 0.12 },
        lead: { inst: "marimba", vol: 0.9, rev: 0.3, echo: 0.15, pan: 0.15 },
        drip: { inst: "drip", vol: 0.4, rev: 0.6, echo: 0.3, pan: 0.4 }
      }
    },
    (s) => {
      const progA = "Gm Gm Eb D Gm Gm Cm D", progB = "Eb F Dm Gm Eb F D D";
      const themeA = "g4:2 bb4:2 d5:2 c5:2 bb4:4 g4:4 | a4:2 bb4:2 a4:2 f#4:2 g4:8 | g4:2 bb4:2 eb5:2 d5:2 bb4:4 g4:4 | f#4:4 a4:4 c5:4 d5:4 | d5:2 bb4:2 g4:2 bb4:2 d5:4 f5:4 | e5:2 f5:2 e5:2 d5:2 bb4:4 g4:4 | c5:2 eb5:2 g5:2 f5:2 eb5:4 c5:4 | d5:4 c5:2 a4:2 f#4:4 d4:4";
      const groove = (bar, prog, full) => {
        const bars = s.progression(bar, prog).length;
        s.bass("bass", bar, prog, "R:4 3:4 5:4 3:4", 31);
        s.arp("marimba", bar, prog, "0 2 1 2 3 2 1 2", 55, 2, { vel: full ? 0.8 : 0.65 });
        s.pad("pad", bar, prog, 58, { vel: 0.8 });
        s.grid("kick", bar, "x.....x...x.....", bars);
        s.grid("rim", bar, "....x.......x...", bars);
        s.grid("shaker", bar, "x.o.x.o.x.o.x.o.", bars);
        if (full) {
          s.grid("bongo", bar, "..x.o.x...x.o.xo", bars, { midi: 69 });
          s.grid("conga", bar, "x.....o.x...o...", bars, { midi: 57 });
        }
      };
      s.play("reed", 0, themeA);
      groove(0, progA, false);
      s.play("drip", 0, "r:12 d6:4 | r:16 | r:8 g6:8 | r:16 | r:16 | r:4 bb5:12 | r:16 | r:16");
      s.play(
        "lead",
        8,
        "bb4:4 g4:2 bb4:2 eb5:8 | c5:4 a4:2 c5:2 f5:8 | d5:2 f5:2 a5:2 f5:2 d5:4 a4:4 | g5:4 f5:2 d5:2 bb4:8 | eb5:2 g5:2 bb5:2 g5:2 eb5:4 g5:4 | a5:4 g5:2 f5:2 c5:4 f5:4 | f#5:2 a5:2 d6:2 a5:2 f#5:2 d5:2 a4:4 | d5:4 c5:4 a4:4 f#4:4"
      );
      s.play("reed", 8, "g4:16 | a4:16 | f4:16 | d4:16 | g4:16 | a4:16 | a4:16 | f#4:8 r:8", {
        vel: 0.6
      });
      groove(8, progB, true);
      s.play("reed", 16, themeA);
      s.play("lead", 16, themeA, { transpose: 12, vel: 0.6 });
      groove(16, progA, true);
      s.play("drip", 16, "r:16 | r:12 a5:4 | r:16 | r:8 d6:8 | r:16 | r:16 | r:4 g6:12 | r:16");
    }
  );

  // src/audio/tracks/meadow.ts
  var meadow = compose(
    {
      id: "meadow",
      title: "First Light on the Meadow",
      mood: "Surface \xB7 day",
      bpm: 124,
      bars: 32,
      parts: {
        kick: { inst: "kick", vol: 0.9 },
        snare: { inst: "snare", vol: 0.45, rev: 0.2 },
        rim: { inst: "rim", vol: 0.5, rev: 0.15 },
        shaker: { inst: "shaker", vol: 0.55, pan: 0.3 },
        tamb: { inst: "tamb", vol: 0.45, pan: -0.3 },
        crash: { inst: "crash", vol: 0.5, rev: 0.2 },
        tom: { inst: "tom", vol: 0.6, rev: 0.2 },
        bass: { inst: "bass", vol: 0.85 },
        guitar: { inst: "pluck", vol: 0.75, pan: -0.25, rev: 0.2 },
        harp: { inst: "harp", vol: 0.7, pan: 0.25, rev: 0.35 },
        pad: { inst: "pad", vol: 0.55, rev: 0.4 },
        flute: { inst: "flute", vol: 1, rev: 0.35, echo: 0.12 },
        strings: { inst: "strings", vol: 0.9, rev: 0.4 },
        pulse: { inst: "pulse", vol: 0.55, rev: 0.25, echo: 0.2 },
        glock: { inst: "bell", vol: 0.45, rev: 0.35, pan: 0.2 }
      }
    },
    (s) => {
      const progA = "G D/F# Em C G D C D", progB = "Em C G D Em C Am D", progC = "C D Bm Em C D Am7 D";
      const themeA = "d5:4 g5:4 a5:2 b5:6 | a5:4 f#5:4 d5:8 | e5:4 g5:2 a5:2 b5:4 e6:4 | d6:6 c6:2 a5:4 g5:4 | d5:4 g5:4 a5:2 b5:6 | c6:4 b5:2 a5:2 f#5:8 | e5:4 g5:4 c6:4 e6:4 | d6:12 r:4";
      s.play("flute", 0, themeA);
      s.arp("guitar", 0, progA, "0 2 1 2 3 2 1 2", 55, 2);
      s.bass("bass", 0, progA, "R:4 5:4 8:4 5:4", 36);
      s.pad("pad", 0, progA, 60, { vel: 0.8 });
      s.grid("kick", 0, "x.......x.......", 8);
      s.grid("rim", 0, "....x.......x...", 8);
      s.grid("shaker", 0, "x.o.x.o.x.o.x.o.", 8);
      s.play(
        "strings",
        8,
        "b4:6 e5:2 g5:8 | a5:6 g5:2 e5:8 | d5:6 g5:2 b5:8 | a5:6 f#5:2 d5:8 | b5:6 e6:2 d6:4 b5:4 | c6:6 b5:2 a5:4 g5:4 | e5:4 a5:4 c6:4 b5:4 | a5:6 b5:2 c6:4 d6:4"
      );
      s.play(
        "flute",
        8,
        "r:16 | r:16 | r:16 | r:8 a5:4 d6:4 | e6:16 | e6:8 c6:8 | c6:8 e6:8 | f#6:8 r:8",
        { vel: 0.6 }
      );
      s.hits("guitar", 8, progB, "x.x.xx.x.xx.x.x.", 57, { vel: 0.8 });
      s.bass("bass", 8, progB, "R:6 R:2 5:4 8:4", 36);
      s.pad("pad", 8, progB, 62);
      s.grid("kick", 8, "x.....x.x.......", 8);
      s.grid("snare", 8, "....x.......x...", 7);
      s.grid("snare", 15, "....x.......x.xx");
      s.grid("tamb", 8, "..x...x...x...x.", 8);
      s.grid("shaker", 8, "x.o.x.o.x.o.x.o.", 8);
      s.grid("crash", 16, "x...............");
      s.play("pulse", 16, themeA);
      s.play("glock", 16, themeA, { vel: 0.7 });
      s.play("flute", 16, "r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | g5:8 c6:8 | b5:12 r:4", {
        vel: 0.6
      });
      s.arp("guitar", 16, progA, "0 2 1 2 3 2 1 2", 55, 2);
      s.arp("harp", 16, progA, "0 1 2 3 4 5 4 3", 67, 2, { vel: 0.6 });
      s.bass("bass", 16, progA, "R:4 5:4 8:4 5:4", 36);
      s.pad("pad", 16, progA, 62);
      s.grid("kick", 16, "x.......x.x.....", 8);
      s.grid("snare", 16, "....x.......x...", 8);
      s.grid("tamb", 16, "..x...x...x...x.", 8);
      s.grid("shaker", 16, "xoxoxoxoxoxoxoxo", 8);
      s.play(
        "flute",
        24,
        "g5:6 e5:2 c5:8 | a5:6 f#5:2 d5:8 | b5:6 a5:2 f#5:4 d5:4 | g5:8 e5:8 | e6:6 d6:2 c6:8 | f#6:6 e6:2 d6:8 | c6:4 b5:4 a5:4 g5:4 | f#5:8 a5:4 d6:4"
      );
      s.play("strings", 24, "e5:16 | f#5:16 | f#5:16 | e5:16 | g5:16 | a5:16 | e5:16 | d5:16", {
        vel: 0.55
      });
      s.arp("harp", 24, progC, "0 1 2 3 2 1 2 3", 55, 2);
      s.bass("bass", 24, progC, "R:8 5:8", 36);
      s.pad("pad", 24, progC, 60, { vel: 0.9 });
      s.grid("kick", 24, "x.........x.....", 7);
      s.grid("rim", 24, "........x.......", 7);
      s.grid("shaker", 24, "x.o.x.o.x.o.x.o.", 8);
      s.grid("tom", 31, "........x.x.xxxx", 1, { midi: 50 });
    }
  );

  // src/audio/tracks/menu.ts
  var menu = compose(
    {
      id: "menu",
      title: "Wildlands",
      mood: "Title theme",
      bpm: 132,
      bars: 36,
      loopBar: 4,
      sidechain: { part: "kick", depth: 0.62, release: 0.3 },
      parts: {
        kick: { inst: "bigkick", vol: 1 },
        clap: { inst: "clap", vol: 0.55, rev: 0.25 },
        snare: { inst: "snare", vol: 0.6, rev: 0.25 },
        hat: { inst: "hat", vol: 0.5, pan: 0.25 },
        ohat: { inst: "ohat", vol: 0.55, pan: -0.2 },
        crash: { inst: "crash", vol: 0.7, rev: 0.3 },
        taiko: { inst: "taiko", vol: 0.75, rev: 0.35 },
        timp: { inst: "timpani", vol: 0.9, rev: 0.4 },
        riser: { inst: "riser", vol: 0.45, rev: 0.4 },
        swell: { inst: "swell", vol: 0.5, rev: 0.3 },
        impact: { inst: "impact", vol: 0.8, rev: 0.5 },
        howl: { inst: "howl", vol: 0.55, rev: 0.8, echo: 0.35, pan: -0.3 },
        bass: { inst: "synthbass", vol: 0.9, duck: true },
        sub: { inst: "sub", vol: 0.75, duck: true },
        saw: { inst: "supersaw", vol: 0.65, duck: true, rev: 0.3 },
        pad: { inst: "pad", vol: 0.9, duck: true, rev: 0.5 },
        choir: { inst: "choir", vol: 0.75, rev: 0.6 },
        bell: { inst: "bell", vol: 0.55, rev: 0.4, echo: 0.4, pan: 0.2 },
        pizz: { inst: "pizz", vol: 0.55, rev: 0.2, echo: 0.15, pan: -0.25 },
        arp: { inst: "supersaw", vol: 0.4, rev: 0.3, echo: 0.2, cutoff: 600 },
        gallop: { inst: "strings", vol: 0.28, rev: 0.3, pan: 0.2 },
        lstr: { inst: "strings", vol: 0.9, rev: 0.45 },
        brass: { inst: "brass", vol: 1, rev: 0.4 },
        lead: { inst: "pulse", vol: 0.75, rev: 0.25, echo: 0.28 },
        lead2: { inst: "supersaw", vol: 0.8, rev: 0.25, echo: 0.1 },
        hit: { inst: "orchhit", vol: 0.8, rev: 0.45 }
      }
    },
    (s) => {
      const intro = "Dm Bb Gm A", progA = "Dm Bb F C Dm Bb Gm A", progB = "Gm Bb F C Gm Bb C C:.75", drop1 = "Dm Bb F C Dm Bb F C", drop2 = "Bb C Dm F Gm Bb C A";
      s.pad("pad", 0, intro, 62);
      s.automate("pad", "vol", 0, 3, 0.2, 1);
      s.pad("choir", 0, intro, 57, { vel: 0.8 });
      s.arp("bell", 0, intro, "0 2 1 3 2 4 3 5", 74, 2, { vel: 0.8 });
      s.bass("sub", 0, intro, "R:16", 33, { vel: 0.8 });
      s.play("howl", 0, "r:4 a4:28 r:32");
      s.note("riser", 8, 60, 8, 0.8);
      s.grid("timp", 3, "oooooooxxxxxXXXX", 1, { midi: 45 });
      s.note("swell", 12, 60, 4);
      const themeA = "d5:6 e5:2 f5:4 a5:4 | g5:6 f5:2 d5:8 | c5:6 d5:2 f5:4 c6:4 | g5:12 e5:4 | d5:6 e5:2 f5:4 a5:4 | bb5:6 a5:2 g5:4 f5:4 | g5:6 f5:2 e5:4 d5:4 | c#5:8 e5:4 a5:4";
      s.play("brass", 4, themeA);
      s.play("lstr", 4, themeA, { transpose: -12, vel: 0.8 });
      s.note("impact", 16, 60, 1);
      s.play("hit", 4, ">d4:16 | r:16 | r:16 | r:16 | d4:16 | r:16 | r:16 | r:16");
      s.grid("crash", 4, "x...............", 1);
      s.grid("crash", 8, "x...............", 1);
      s.grid("kick", 4, "x.........x.....", 7);
      s.grid("kick", 11, "x.........x.x.x.");
      s.grid("snare", 4, "........x.......", 7);
      s.grid("snare", 11, "........x...x.xx");
      s.grid("clap", 4, "........x.......", 8);
      s.grid("taiko", 4, "....x......x..x.", 8);
      s.grid("hat", 4, "x.x.x.x.x.x.x.x.", 8, { vel: 0.7 });
      s.bass("timp", 4, progA, "R:12 R:2 R:2", 38);
      s.bass("bass", 4, progA, "R:2 8:2", 26);
      s.bass("sub", 4, progA, "R:16", 33);
      s.pad("pad", 4, progA, 60);
      s.pad("choir", 4, progA, 60, { vel: 0.8 });
      s.arp("pizz", 4, progA, "0 2 1 2 3 2 1 2", 50, 2);
      s.play(
        "lstr",
        12,
        "d5:6 c5:2 bb4:8 | f5:6 eb5:2 d5:8 | c5:6 d5:2 f5:4 a5:4 | g5:16 | bb5:6 a5:2 g5:8 | d6:6 c6:2 bb5:8 | c6:4 d6:4 e6:4 g6:4 | g6:12 r:4"
      );
      s.play("brass", 16, "bb4:6 a4:2 g4:8 | d5:6 c5:2 bb4:8 | c5:4 d5:4 e5:4 g5:4 | g5:12 r:4", {
        vel: 0.9
      });
      s.pad("pad", 12, progB, 60);
      s.pad("choir", 12, progB, 62);
      s.arp("arp", 12, progB, "0 1 2 3 1 2 3 4", 55, 1);
      s.automate("arp", "cutoff", 12, 7.75, 500, 9e3);
      s.bass("bass", 12, "Gm Bb F C", "R:2 8:2", 26);
      s.bass("bass", 16, "Gm Bb C", "R:1 R:1 8:1 R:1", 26);
      s.play("bass", 19, "c2:1 c2:1 c3:1 c2:1 c2:1 c2:1 c3:1 c2:1 c2:1 c2:1 c3:1 c2:1 r:4");
      s.bass("sub", 12, progB, "R:16", 33);
      s.grid("kick", 12, "x.......x.......", 4);
      s.grid("kick", 16, "x...x...x...x...", 3);
      s.grid("kick", 19, "x...x...x.......");
      s.grid("taiko", 12, "....x......x....", 4);
      s.grid("hat", 12, "xxxxxxxxxxxxxxxx", 4, { vel: 0.45 });
      s.grid("snare", 16, "x...x...x...x...|x.x.x.x.x.x.x.x.|xxxxxxxxxxxxxxxx|xxxxxxxxxxxx....");
      s.automate("snare", "vol", 16, 3.75, 0.35, 1.3);
      s.play("timp", 18, "r:8 a2:1 a2:1 a2:1 a2:1 a2:1 a2:1 a2:1 a2:1 | c3:12 r:4");
      s.note("riser", 64, 60, 16);
      s.note("swell", 76, 60, 4);
      const hook1 = ">a5:3 a5:3 a5:2 g5:2 a5:2 c6:2 d6:2 | d6:3 c6:3 bb5:2 g5:4 f5:4 | >c6:3 c6:3 c6:2 a5:2 c6:2 f6:2 e6:2 | e6:6 d6:2 c6:4 g5:4 | >a5:3 a5:3 a5:2 g5:2 a5:2 c6:2 d6:2 | d6:3 c6:3 bb5:2 a5:2 bb5:2 c6:2 d6:2 | >f6:6 e6:2 d6:2 c6:2 a5:4 | c6:4 d6:4 e6:8";
      const hook2 = ">bb5:3 d6:3 f6:2 f6:4 d6:4 | >c6:3 e6:3 g6:2 g6:4 e6:4 | >f6:3 e6:3 d6:2 d6:4 a5:4 | c6:3 d6:3 f6:2 >a6:8 | >g6:6 f6:2 d6:4 bb5:4 | f6:6 d6:2 bb5:4 d6:4 | e6:6 d6:2 c6:4 e6:4 | >e6:8 c#6:4 a5:4";
      s.play("lead", 20, hook1 + " | " + hook2);
      s.play("lead2", 20, hook1 + " | " + hook2, { transpose: -12 });
      s.play("brass", 20, "d5:16 | d5:16 | c5:16 | c5:8 e5:8 | f5:16 | f5:16 | a5:16 | g5:16", {
        vel: 0.85
      });
      s.play("brass", 28, hook2, { transpose: -12 });
      s.pad("saw", 20, drop1 + " " + drop2, 64);
      s.pad("pad", 20, drop1 + " " + drop2, 57);
      s.pad("choir", 20, drop1, 64, { vel: 0.7 });
      s.pad("choir", 28, drop2, 67);
      s.arp("pizz", 20, drop1 + " " + drop2, "0 1 2 3 4 3 2 1", 62, 1, { vel: 0.8 });
      s.hits("gallop", 28, drop2, "x-xxx-xxx-xxx-xx", 55);
      s.bass("bass", 20, drop1, "r:2 R:2", 26);
      s.bass("bass", 28, drop2, "R:1 R:1 8:1 R:1", 26);
      s.bass("sub", 20, drop1 + " " + drop2, "R:16", 33);
      s.automate("snare", "vol", 20, 0, 1, 1);
      s.grid("kick", 20, "x...x...x...x...", 15);
      s.grid("kick", 35, "x...x...x...x.x.");
      s.grid("clap", 20, "....x.......x...", 16);
      s.grid("snare", 28, "....x.......x...", 7);
      s.grid("snare", 35, "....x.......x.xx");
      s.grid("ohat", 20, "..x...x...x...x.", 16);
      s.grid("hat", 20, ".o.o.o.o.o.o.o.o", 16);
      s.grid("taiko", 28, "x.........x..x..", 8);
      for (const bar of [20, 24, 28, 32]) s.grid("crash", bar, "x...............");
      s.note("impact", 80, 60, 1);
      s.play("hit", 20, ">d4:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16");
      s.play("hit", 28, ">bb3:16 | r:16 | r:16 | r:16 | g3:16 | r:16 | r:16 | >a3:3 a3:3 a3:10");
      s.bass("timp", 28, drop2, "R:4 r:4 R:4 r:2 R:2", 38);
    }
  );

  // src/audio/tracks/night.ts
  var night = compose(
    {
      id: "night",
      title: "Lanterns Out",
      mood: "Surface \xB7 night",
      bpm: 80,
      bars: 20,
      parts: {
        kick: { inst: "kick", vol: 0.55 },
        rim: { inst: "rim", vol: 0.3, rev: 0.4 },
        shaker: { inst: "shaker", vol: 0.3, pan: 0.3 },
        cricket: { inst: "chirp", vol: 0.6, pan: -0.5, rev: 0.3 },
        cricket2: { inst: "chirp", vol: 0.5, pan: 0.6, rev: 0.3 },
        bass: { inst: "bass", vol: 0.7, cutoff: 700 },
        keys: { inst: "epiano", vol: 0.85, rev: 0.35, echo: 0.15, pan: -0.1 },
        harp: { inst: "harp", vol: 0.55, rev: 0.5, pan: 0.2 },
        pad: { inst: "pad", vol: 0.6, rev: 0.55 },
        flute: { inst: "flute", vol: 0.9, rev: 0.5, echo: 0.2 },
        strings: { inst: "strings", vol: 0.75, rev: 0.5 },
        star: { inst: "bell", vol: 0.3, rev: 0.6, echo: 0.4, pan: 0.4 }
      },
      echoBeats: 1.5,
      echoFeedback: 0.38
    },
    (s) => {
      const progA = "Am9 Fmaj7 C G Am9 Fmaj7 Dm9 E7", progB = "Dm7 G Cmaj7 Fmaj7 Bm7b5 E7 Am E7", progC = "Am9 Fmaj7 Dm9 E7";
      const bed = (bar, prog, harp2) => {
        s.hits("keys", bar, prog, "x.....x...x.....", 60, { vel: 0.8 });
        s.bass("bass", bar, prog, "R:6 R:2 5:8", 33);
        s.pad("pad", bar, prog, 64, { vel: 0.7 });
        if (harp2) s.arp("harp", bar, prog, "0 1 2 3 4 3 2 1", 57, 2, { vel: 0.8 });
        const bars = s.progression(bar, prog).length;
        s.grid("shaker", bar, "o.o.o.o.o.o.o.o.", bars);
        s.grid("rim", bar, "........x.......", bars);
        s.grid("kick", bar, "x.........x.....", bars);
      };
      s.play(
        "flute",
        0,
        "e5:6 a5:2 b5:4 c6:4 | a5:6 g5:2 e5:8 | g5:4 c6:4 d6:2 e6:6 | d6:8 b5:4 g5:4 | e5:6 a5:2 b5:4 c6:4 | c6:6 b5:2 a5:4 e5:4 | f5:4 a5:4 e6:4 d6:4 | g#5:8 b5:4 d6:4"
      );
      bed(0, progA, false);
      s.play(
        "strings",
        8,
        "c6:6 a5:2 f5:8 | d6:6 b5:2 g5:8 | e6:6 d6:2 c6:4 b5:4 | a5:8 c6:4 e6:4 | d6:6 c6:2 a5:4 f5:4 | g#5:8 b5:4 d6:4 | c6:6 b5:2 a5:8 | b5:6 g#5:2 e5:8",
        { transpose: -12 }
      );
      s.play("flute", 8, "r:16 | r:16 | g5:16 | a5:16 | f5:16 | e5:16 | e5:16 | g#5:16", {
        vel: 0.5
      });
      bed(8, progB, true);
      s.play(
        "flute",
        16,
        "e5:6 a5:2 b5:4 c6:4 | a5:6 g5:2 e5:8 | f5:4 a5:4 e6:4 d6:4 | g#5:8 b5:4 d6:4"
      );
      bed(16, progC, true);
      s.play("star", 0, "r:16 | r:8 e7:8 | r:16 | r:16 | r:16 | r:4 c7:12 | r:16 | r:16");
      s.play("star", 12, "r:8 b6:8 | r:16 | r:16 | r:4 e7:12 | r:16 | r:16 | r:16 | r:16");
      const chirps = [1, 2.5, 5, 6.25, 9, 11.5, 13, 14.75, 17, 19.25];
      chirps.forEach((bar, i) => s.note(i % 2 ? "cricket2" : "cricket", bar * 4, 110 + i % 3, 0.5));
    }
  );

  // src/audio/tracks/pandemonium.ts
  var pandemonium = compose(
    {
      id: "pandemonium",
      title: "Throne of Cinders",
      mood: "Lower hell",
      bpm: 100,
      bars: 28,
      loopBar: 4,
      sidechain: { part: "kick", depth: 0.35, release: 0.16 },
      parts: {
        kick: { inst: "bigkick", vol: 0.8 },
        snare: { inst: "snare", vol: 0.7, rev: 0.35 },
        taiko: { inst: "taiko", vol: 0.9, rev: 0.5 },
        timp: { inst: "timpani", vol: 0.9, rev: 0.5 },
        crash: { inst: "crash", vol: 0.55, rev: 0.35 },
        impact: { inst: "impact", vol: 0.8, rev: 0.6 },
        riser: { inst: "riser", vol: 0.4, rev: 0.4 },
        swell: { inst: "swell", vol: 0.45, rev: 0.4 },
        toll: { inst: "toll", vol: 1.7, rev: 0.75 },
        pedal: { inst: "organ", vol: 0.8, rev: 0.4, cutoff: 1400 },
        organ: { inst: "organ", vol: 0.75, rev: 0.55, pan: -0.15 },
        lead: { inst: "organ", vol: 2.3, rev: 0.5, echo: 0.15 },
        chant: { inst: "chant", vol: 1, rev: 0.6 },
        choir: { inst: "choir", vol: 0.75, rev: 0.7 },
        guitar: { inst: "guitar", vol: 0.55, pan: -0.35, duck: true },
        guitar2: { inst: "guitar", vol: 0.4, pan: 0.35, transpose: 12, duck: true },
        bass: { inst: "synthbass", vol: 0.85, duck: true },
        hit: { inst: "orchhit", vol: 0.75, rev: 0.5 }
      }
    },
    (s) => {
      const intro = "Dm Dm Eb A", progA = "Dm Eb Dm Ab Dm Eb Bbm A", progB = "Dm Eb Dm Ab Bbm Gm A A", powerB = "D5 Eb5 D5 Ab5 Bb5 G5 A5 A5", progC = "Dm:2 Ab:2 Dm:2 A:2";
      const tolls = (bar, bars, every = 1) => {
        for (let b = 0; b < bars; b += every) s.at("toll", bar + b, "d3", 4);
      };
      tolls(0, 4);
      s.pad("organ", 0, intro, 57, { vel: 0.8 });
      s.automate("organ", "vol", 0, 3, 0.15, 1);
      s.play("chant", 0, "d3:4 d3:4 d3:4 f3:2 e3:2 | d3:16 | eb3:4 eb3:4 d3:4 c3:4 | c#3:16");
      s.bass("pedal", 0, intro, "R:16", 26);
      s.note("riser", 8, 60, 8);
      s.grid("timp", 3, "oooooooxxxxxXXXX", 1, { midi: 38 });
      s.note("swell", 12, 60, 4);
      s.note("impact", 16, 60, 1);
      s.grid("crash", 4, "x...............");
      s.arp("organ", 4, progA, "2 1 0 1 3 1 0 1", 57, 1, { vel: 0.85 });
      s.bass("pedal", 4, progA, "R:8 R:8", 26);
      s.hits("chant", 4, progA, "x...x...x.x.x...", 50);
      s.grid("taiko", 4, "x.......x.......", 8);
      s.grid("kick", 4, "x..x....x..x....", 7);
      s.grid("kick", 11, "x..x....x.xxxxxx");
      s.grid("snare", 11, "........x.x.xxxx");
      s.play("hit", 4, ">d4:16 | r:16 | r:16 | >ab3:16 | d4:16 | r:16 | r:16 | >a3:3 a3:3 a3:10");
      tolls(4, 8, 2);
      s.note("impact", 48, 60, 1);
      s.grid("crash", 12, "x...............");
      s.grid("crash", 16, "x...............");
      const theme = "d5:3 f5:3 a5:2 ab5:4 f5:4 | g5:3 eb5:3 bb4:2 eb5:8 | d5:3 f5:3 a5:2 d6:4 c#6:4 | c6:3 ab5:3 eb5:2 ab5:8 | bb5:3 db6:3 f6:2 db6:4 bb5:4 | g5:3 bb5:3 d6:2 bb5:4 g5:4 | a5:3 c#6:3 e6:2 g6:4 e6:4 | c#6:8 a5:4 e5:4";
      s.play("lead", 12, theme);
      s.pad("choir", 12, progB, 62);
      s.hits("guitar", 12, powerB, "x-.xx-.xx-.xx.xx", 50);
      s.hits("guitar2", 12, powerB, "x-.xx-.xx-.xx.xx", 50);
      s.bass("bass", 12, progB, "R:2", 26);
      s.bass("pedal", 12, progB, "R:16", 26);
      s.grid("kick", 12, "x.xxx.xxx.xxx.xx", 8);
      s.grid("snare", 12, "....x.......x...", 7);
      s.grid("snare", 19, "....x...x.x.xxxx");
      s.grid("taiko", 12, "x.......x.......", 8);
      s.play("hit", 12, ">d4:16 | r:16 | r:16 | >ab3:16 | r:16 | r:16 | >a3:16 | r:16");
      s.play(
        "chant",
        20,
        "d3:8 f3:8 | e3:8 d3:8 | eb3:8 c3:8 | eb3:16 | d3:8 a3:8 | f3:8 d3:8 | c#3:8 e3:8 | a2:16"
      );
      s.pad("organ", 20, progC, 60, { vel: 0.9 });
      s.bass("pedal", 20, progC, "R:16", 26);
      s.pad("choir", 24, "Dm:2 A:2", 66, { vel: 0.8 });
      tolls(20, 8);
      s.grid("kick", 20, "x..x............", 6, { vel: 0.9 });
      s.grid("timp", 26, "x.......x.......|oooooooxxxxxXXXX", 1, { midi: 38 });
      s.automate("timp", "vol", 26, 2, 0.5, 1.2);
      s.note("riser", 96, 60, 16);
      s.note("swell", 108, 60, 4);
    }
  );

  // src/audio/tracks/storm.ts
  var storm = compose(
    {
      id: "storm",
      title: "Squall Line",
      mood: "Surface \xB7 storm",
      bpm: 128,
      bars: 32,
      parts: {
        kick: { inst: "kick", vol: 1 },
        snare: { inst: "snare", vol: 0.55, rev: 0.3 },
        tom: { inst: "tom", vol: 0.7, rev: 0.3 },
        rain: { inst: "shaker", vol: 0.35, pan: -0.2 },
        hat: { inst: "hat", vol: 0.4, pan: 0.3 },
        crash: { inst: "crash", vol: 0.55, rev: 0.3 },
        timp: { inst: "timpani", vol: 0.9, rev: 0.4 },
        thunder: { inst: "thunder", vol: 0.9, rev: 0.4 },
        wind: { inst: "wind", vol: 0.6, rev: 0.3 },
        riser: { inst: "riser", vol: 0.4, rev: 0.4 },
        bass: { inst: "bass", vol: 0.9 },
        ost: { inst: "strings", vol: 0.55, rev: 0.25, cutoff: 2500 },
        trem: { inst: "tremolo", vol: 0.8, rev: 0.45 },
        pad: { inst: "pad", vol: 0.6, rev: 0.5 },
        brass: { inst: "brass", vol: 1, rev: 0.4 },
        high: { inst: "strings", vol: 0.85, rev: 0.45 },
        choir: { inst: "choir", vol: 0.9, rev: 0.6 }
      }
    },
    (s) => {
      const progA = "Cm:2 Ab:2 Fm:2 G:2", progB = "Cm Ab Eb Bb Cm Ab Fm G", progC = "Ab Bb Cm Cm Ab Bb G G", progD = "Cm Db Cm Db Cm Ab G G";
      const drive = (bar, prog) => {
        s.arp("ost", bar, prog, "0 0 2 0 1 0 2 0", 48, 1);
        s.bass("bass", bar, prog, "R:2 R:2 8:2 R:2", 36);
      };
      s.grid("rain", 0, "oooooooooooooooo", 32);
      drive(0, progA);
      s.play("trem", 0, "g5:16 | f5:8 eb5:8 | eb5:16 | c5:16 | c5:16 | ab4:8 c5:8 | b4:16 | d5:16");
      s.pad("pad", 0, progA, 60, { vel: 0.7 });
      s.grid("tom", 0, "x.....x.....x.x.", 7, { midi: 45 });
      s.grid("tom", 7, "x.x.x.x.xxxxxxxx", 1, { midi: 50 });
      s.grid("kick", 0, "x.......x.......", 8);
      s.note("wind", 0, 60, 7, 0.9);
      s.note("wind", 16, 66, 7, 0.8);
      s.grid("crash", 8, "x...............");
      s.play(
        "brass",
        8,
        "c5:6 d5:2 eb5:4 g5:4 | ab5:6 g5:2 eb5:8 | bb5:6 ab5:2 g5:4 eb5:4 | f5:6 d5:2 bb4:8 | c5:6 d5:2 eb5:4 g5:4 | c6:6 bb5:2 ab5:4 eb5:4 | f5:4 ab5:4 c6:4 f5:4 | b5:8 g5:4 d5:4"
      );
      drive(8, progB);
      s.pad("trem", 8, progB, 60, { vel: 0.6 });
      s.grid("kick", 8, "x.....x...x.....", 8);
      s.grid("snare", 8, "....x.......x...", 7);
      s.grid("snare", 15, "....x.......xxxx");
      s.grid("hat", 8, "x.x.x.x.x.x.x.x.", 8);
      s.bass("timp", 8, progB, "R:12 R:4", 36);
      s.grid("crash", 16, "x...............");
      s.grid("crash", 20, "x...............");
      s.note("thunder", 64, 60, 1);
      const high = "eb6:8 c6:8 | d6:8 bb5:8 | c6:6 d6:2 eb6:4 g6:4 | g6:16 | ab6:6 g6:2 eb6:8 | f6:6 eb6:2 d6:8 | d6:8 b5:8 | g5:16";
      s.play("high", 16, high);
      s.play("brass", 16, high, { transpose: -12, vel: 0.9 });
      s.pad("choir", 16, progC, 64);
      drive(16, progC);
      s.grid("kick", 16, "x.....x.x.x.....", 8);
      s.grid("snare", 16, "....x.......x...", 7);
      s.grid("snare", 23, "x.x.x.x.xxxxxxxx");
      s.grid("hat", 16, "xxxxxxxxxxxxxxxx", 8, { vel: 0.7 });
      s.bass("timp", 16, progC, "R:4 R:4 R:4 R:4", 36);
      s.note("thunder", 96, 60, 1);
      s.note("thunder", 112, 60, 1, 0.8);
      drive(24, progD);
      s.hits("brass", 24, progD, "x.......x.....x.", 55, { vel: 0.8 });
      s.pad("choir", 24, progD, 60, { vel: 0.7 });
      s.play("trem", 24, "c5:16 | db5:16 | c5:16 | db5:16 | eb5:16 | c5:16 | d5:16 | b4:16");
      s.grid("timp", 24, "x.........x.....", 6, { midi: 36 });
      s.grid("timp", 30, "x.x.x.x.xxxxxxxx|xxxxxxxxxxxxxxxx", 1, { midi: 43 });
      s.automate("timp", "vol", 30, 2, 0.4, 1.2);
      s.note("wind", 104, 58, 7, 0.9);
      s.note("riser", 120, 60, 8);
    }
  );

  // src/audio/tracks/index.ts
  var TRACK_LIST = [
    menu,
    meadow,
    coast,
    forest,
    marsh,
    cold,
    desert,
    night,
    storm,
    cave,
    depths,
    brimstone,
    pandemonium,
    boss,
    fallen
  ];
  var TRACKS = Object.fromEntries(TRACK_LIST.map((t) => [t.id, t]));

  // src/audio/Audio.ts
  var saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("wildlands-audio") || "{}");
    } catch {
      return {};
    }
  })();
  var settings = { music: saved.music ?? 0.55, sfx: saved.sfx ?? 0.6 };
  var LOOKAHEAD = 1.2;
  var SCENE_SETTLE = 1.5;
  var URGENT = /* @__PURE__ */ new Set(["menu", "boss", "fallen"]);
  var ac;
  var master;
  var musicGain;
  var muffle;
  var sfxBus;
  var ambience;
  var player;
  var deck;
  var current;
  var desired = "menu";
  var desiredSince = 0;
  var muffled = false;
  var musicLevel = () => settings.music ** 2;
  function init() {
    if (ac) return;
    const C = window.AudioContext;
    if (!C) return;
    ac = new C();
    const limiter = ac.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.ratio.value = 12;
    limiter.attack.value = 3e-3;
    limiter.release.value = 0.15;
    master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(limiter).connect(ac.destination);
    musicGain = ac.createGain();
    musicGain.gain.value = musicLevel();
    musicGain.connect(master);
    const chain = createMusicChain(ac, musicGain);
    muffle = chain.muffle;
    player = new MusicPlayer(ac, chain.input);
    sfxBus = ac.createGain();
    sfxBus.gain.value = settings.sfx * 0.8;
    sfxBus.connect(master);
    ambience = new Ambience(ac, sfxBus);
    setInterval(tick, 100);
  }
  function start() {
    init();
    ac?.resume();
  }
  function switchTo(id, now) {
    if (!player) return;
    const quick = id === "boss" || id === "fallen";
    deck?.stop(now, quick ? 0.8 : 2.5);
    deck = player.play(TRACKS[id] ?? TRACKS.meadow, now + 0.08, current ? quick ? 0.25 : 1.5 : 0);
    current = id;
  }
  function tick() {
    if (!ac || !player || ac.state !== "running") return;
    const now = ac.currentTime;
    if (desired !== current) {
      const urgent = !current || URGENT.has(desired) || URGENT.has(current);
      if (urgent || now - desiredSince > SCENE_SETTLE) switchTo(desired, now);
    }
    player.schedule(now + LOOKAHEAD, now);
  }
  function setScene(v) {
    if (v === desired) return;
    desired = v;
    desiredSince = ac?.currentTime ?? 0;
  }
  function setMuffled(on) {
    if (on === muffled || !ac || !muffle) return;
    muffled = on;
    muffle.frequency.setTargetAtTime(on ? 900 : 2e4, ac.currentTime, 0.12);
  }
  var listener = { x: 0, y: 0 };
  var lastPlayed = /* @__PURE__ */ new Map();
  var MIN_GAP = { pickup: 0.06, click: 0.04, hit: 0.05 };
  function setListener(x, y) {
    listener.x = x;
    listener.y = y;
  }
  function effect(kind, at, strength = 1) {
    start();
    if (!ac || !sfxBus) return;
    const now = ac.currentTime, gap = MIN_GAP[kind] ?? (kind.startsWith("step") ? 0.12 : 0.03);
    if (now - (lastPlayed.get(kind) ?? -1) < gap) return;
    let pan = 0, level = strength;
    if (at) {
      const dx = at.x - listener.x, d = Math.hypot(dx, (at.y - listener.y) * 1.4);
      if (d > 1100) return;
      pan = Math.max(-0.85, Math.min(0.85, dx / 650));
      level *= 1 / (1 + (d / 420) ** 2);
    }
    lastPlayed.set(kind, now);
    const g = ac.createGain(), p = ac.createStereoPanner();
    g.gain.value = level;
    p.pan.value = pan;
    g.connect(p).connect(sfxBus);
    if (!playSfx(ac, g, kind, 1, now + 5e-3)) playSfx(ac, g, "click", 1, now + 5e-3);
    setTimeout(() => g.disconnect(), 4e3);
  }
  function setAmbience(levels) {
    if (!ac || !ambience || ac.state !== "running") return;
    ambience.update(levels);
  }
  function setVolumes(m, s) {
    settings.music = Math.max(0, Math.min(1, m));
    settings.sfx = Math.max(0, Math.min(1, s));
    if (ac && musicGain) musicGain.gain.setTargetAtTime(musicLevel(), ac.currentTime, 0.05);
    if (ac && sfxBus) sfxBus.gain.setTargetAtTime(settings.sfx * 0.8, ac.currentTime, 0.05);
    localStorage.setItem("wildlands-audio", JSON.stringify(settings));
  }
  function nowPlaying() {
    return current ? TRACKS[current]?.title : void 0;
  }
  var Audio = {
    start,
    effect,
    setListener,
    setAmbience,
    setScene,
    setMuffled,
    setVolumes,
    nowPlaying,
    settings
  };

  // src/audio/scenes.ts
  var LAYER_TRACKS = {
    upper_mines: "cave",
    lower_mines: "depths",
    upper_hell: "brimstone",
    lower_hell: "pandemonium"
  };
  function musicScene(c) {
    if (!c.playing) return "menu";
    if (c.dead) return "fallen";
    if (c.boss) return "boss";
    if (LAYER_TRACKS[c.layer]) return LAYER_TRACKS[c.layer];
    if (c.weather === "storm") return "storm";
    if (["tundra", "taiga", "alpine"].includes(c.biome)) return "cold";
    if (["desert", "badlands"].includes(c.biome)) return "desert";
    if (c.biome === "marsh") return "marsh";
    if (c.night) return "night";
    if (c.biome === "forest") return "forest";
    if (c.biome === "coast") return "coast";
    return "meadow";
  }

  // src/ui/Console.ts
  var DevConsole = class {
    root;
    log;
    input;
    history = [];
    cursor = 0;
    game;
    onRun;
    constructor(game2, onRun) {
      this.game = game2;
      this.onRun = onRun;
      this.root = document.getElementById("dev-console");
      this.log = document.getElementById("dev-log");
      this.input = document.getElementById("dev-input");
      this.input.addEventListener("keydown", (e) => this.key(e));
      this.print(["Type help for commands."], "ok");
    }
    get open() {
      return !this.root.classList.contains("hidden");
    }
    toggle(force) {
      const on = force ?? !this.open;
      this.root.classList.toggle("hidden", !on);
      if (on) setTimeout(() => this.input.focus(), 0);
      else this.input.blur();
    }
    print(lines, tone2 = "") {
      for (const text of lines) {
        const row = document.createElement("div");
        row.className = text.startsWith("!") ? "err" : tone2;
        row.textContent = text.startsWith("!") ? text.slice(1).trim() : text;
        this.log.append(row);
      }
      while (this.log.childElementCount > 200) this.log.firstElementChild?.remove();
      this.log.scrollTop = this.log.scrollHeight;
    }
    key(e) {
      e.stopPropagation();
      if (e.key === "`" || e.key === "Escape") {
        e.preventDefault();
        this.toggle(false);
      } else if (e.key === "Enter") {
        const line5 = this.input.value.trim();
        this.input.value = "";
        if (!line5) return;
        this.history.push(line5);
        this.cursor = this.history.length;
        this.print(["\u203A " + line5], "cmd");
        if (line5 === "clear") this.log.replaceChildren();
        else this.print(this.game.command(line5), "ok");
        this.onRun();
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        this.cursor = Math.max(
          0,
          Math.min(this.history.length, this.cursor + (e.key === "ArrowUp" ? -1 : 1))
        );
        this.input.value = this.history[this.cursor] ?? "";
      } else if (e.key === "Tab") {
        e.preventDefault();
        const value = this.input.value, options = this.game.devtools.complete(value);
        if (options.length === 1) {
          const words = value.split(/\s+/);
          words[words.length - 1] = options[0];
          this.input.value = words.join(" ") + " ";
        } else if (options.length > 1) this.print(["  " + options.slice(0, 40).join("  ")]);
      }
    }
  };

  // src/ui/App.ts
  var game = new Game();
  var $ = (id) => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing game element: ${id}`);
    return element;
  };
  var canvas = $("world");
  var ctx = canvas.getContext("2d");
  var keys = /* @__PURE__ */ new Set();
  var state = {
    playing: false,
    intro: 0,
    journal: false,
    tab: "pack",
    selectedRecipe: "stone_axe",
    farm: null,
    chest: null,
    camera: { x: 0, y: 0 },
    lastFrame: performance.now(),
    lastUI: 0,
    lastAuto: 0,
    seenMessage: null,
    lastAmbience: 0,
    nextThunder: 0
  };
  var UI_RULES = {
    seedRange: 1e6,
    maxPixelRatio: 2,
    hudRefreshMs: 170,
    autoSaveSeconds: 40,
    maxFrameSeconds: 0.1,
    menuFocalX: BIOME_CENTERS.meadow[0]
  };
  var pretty = (id) => ITEMS[id]?.[0] || id;
  var clamp7 = (v, a, b) => Math.max(a, Math.min(b, v));
  var fmt = (n) => String(Math.floor(n)).padStart(2, "0");
  var timeText = () => {
    const t = game.timeOfDay();
    return `DAY ${game.s.day} \xB7 ${fmt(t / 60)}:${fmt(t % 60)} \xB7 ${game.s.weather.toUpperCase()}`;
  };
  var itemUseLabel = (id) => ITEMS[id][1] === "structure" ? "PLACE" : WEAPONS[id] ? "EQUIP" : ["direwolf_cloak", "hide_coat", "explorer_boots", "cinder_ward"].includes(id) ? "WEAR" : id === "fishing_rod" ? "FISH" : ["food", "water", "medicine"].includes(ITEMS[id][1]) ? "USE" : "";
  var sound = (kind) => Audio.effect(kind);
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, UI_RULES.maxPixelRatio);
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  addEventListener("resize", resize);
  resize();
  var introPages = [
    {
      eyebrow: "THE LANDING",
      title: "Everything was lost.",
      copy: "The last pack went into the surf. You have your hands, a blank record, and the scraps the meadow gives back.",
      art: `<svg viewBox="0 0 600 310" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="310" fill="#d8d2b7"/><path d="M0 195 Q80 130 160 177 T315 154 T600 177 V310 H0" fill="#8a977c"/><path d="M0 223 Q105 205 230 234 T600 212 V310 H0" fill="#a4a684"/><path d="M0 255 Q150 238 300 269 T600 249 V310 H0" fill="#c1ad82"/><g stroke="#3e5249" fill="none" stroke-width="5"><path d="M80 185V73m0 50-38-37m38 20 40-47M445 169V47m0 74-48-51m48 27 51-48"/><path d="M260 205l20-75 43-11 22 71-85 15z" fill="#766b51"/><path d="M278 137q29 14 46-9"/></g><g fill="#516a55"><ellipse cx="80" cy="68" rx="53" ry="28"/><ellipse cx="445" cy="44" rx="63" ry="27"/></g><path d="M219 246q44-40 89 0" stroke="#5c564a" stroke-width="3" fill="none"/><circle cx="510" cy="70" r="21" fill="#d1bd8f"/></svg>`
    },
    {
      eyebrow: "WATER / CAUTION",
      title: "The stream is no refuge.",
      copy: "Wild water carries illness. A small fire and a little patience can make it safe enough to drink.",
      art: `<svg viewBox="0 0 600 310" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="310" fill="#cfceae"/><path d="M0 115Q100 79 200 114T400 105T600 129v181H0" fill="#7d997d"/><path d="M0 205Q140 144 280 191T600 176v134H0" fill="#b9b38c"/><path d="M0 270Q140 183 296 241T600 218v92H0" fill="#87a9a3"/><path d="M0 287Q165 220 304 265T600 236" fill="none" stroke="#d1d8c6" stroke-width="5"/><g fill="none" stroke="#37524c" stroke-width="3"><path d="M83 119v76m0-53-29-24m29 48 27-36M500 120v105m0-68-33-22m33 52 40-35"/><path d="M274 152c-12-47 45-46 32 0m-44 0h56l-8 38h-40z"/></g><path d="M261 190h59" stroke="#9d624b" stroke-width="5"/><g fill="#526a58"><circle cx="83" cy="105" r="33"/><circle cx="500" cy="105" r="41"/></g><circle cx="438" cy="59" r="28" fill="#d6c494"/></svg>`
    },
    {
      eyebrow: "NIGHT / PROVISIONS",
      title: "Everything changes by morning.",
      copy: "Nights bite. Rain steals warmth. Food decays even in a closed pack. Build shelter, cook what you find, and keep moving.",
      art: `<svg viewBox="0 0 600 310" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="310" fill="#53685f"/><circle cx="450" cy="75" r="37" fill="#e5d9b0"/><path d="M0 201L105 112l79 77 105-115 143 120 78-63 90 80v99H0" fill="#66746b"/><path d="M0 236L101 183l101 55 104-74 117 78 177-44v112H0" fill="#344f46"/><path d="M0 257q150-22 300 0t300-9v62H0" fill="#738569"/><path d="M187 255l91-61 88 61z" fill="#a18b67" stroke="#dac69a" stroke-width="3"/><path d="M277 195v59" stroke="#473c30" stroke-width="3"/><path d="M476 250q-13-22 4-44 2 15 18 22 12-22 2-39 39 42 11 65z" fill="#d89961"/><path d="M481 253q6-26 21-36 13 19 8 36z" fill="#f0c779"/><g fill="#e0d8be"><circle cx="80" cy="58" r="2"/><circle cx="157" cy="80" r="2"/><circle cx="254" cy="47" r="2"/><circle cx="350" cy="91" r="2"/><circle cx="540" cy="34" r="2"/></g></svg>`
    }
  ];
  function showIntro() {
    state.intro = 0;
    $("menu").classList.add("hidden");
    $("intro").classList.remove("hidden");
    renderIntro();
  }
  function renderIntro() {
    const p = introPages[state.intro];
    $("intro-count").textContent = `${fmt(state.intro + 1)} / 03`;
    $("intro-art").innerHTML = p.art;
    $("intro-eyebrow").textContent = p.eyebrow;
    $("intro-title").textContent = p.title;
    $("intro-copy").textContent = p.copy;
    $("intro-next").innerHTML = state.intro === 2 ? "Enter the meadow <span>\u2192</span>" : "Turn the page <span>\u2192</span>";
  }
  function enterGame() {
    $("intro").classList.add("hidden");
    $("menu").classList.add("hidden");
    $("hud").classList.remove("hidden");
    state.playing = true;
    state.journal = false;
    $("journal").classList.add("hidden");
    $("death").classList.add("hidden");
    Audio.start();
    updateUI(true);
  }
  $("new-game").onclick = () => {
    sound("page");
    game.newGame(Date.now() % UI_RULES.seedRange);
    game.save(localStorage, true);
    showIntro();
  };
  $("continue-game").onclick = () => {
    sound("page");
    if (game.load()) enterGame();
  };
  $("continue-game").disabled = !localStorage.getItem("wildlands-save-v1");
  $("guide-button").onclick = () => {
    sound("page");
    $("menu-panel").classList.remove("hidden");
    $("menu-panel").innerHTML = '<h2>The first pages</h2><p>Cross nine regions from the coast to the badlands. Gather, mine, craft, cook, build shelter, and descend through three cave layers. The Effergy of Beasts calls the final hunts.</p><p><strong>A / D</strong> move \xB7 <strong>W / Space</strong> jump or climb a shaft \xB7 <strong>S</strong> descend \xB7 <strong>E</strong> gather or use \xB7 <strong>F</strong> strike \xB7 <strong>R / click</strong> mine \xB7 <strong>G</strong> fish \xB7 <strong>J</strong> journal \xB7 <strong>M</strong> map.</p><button id="panel-close" class="ink-button">Close this page</button>';
    $("panel-close").onclick = () => {
      $("menu-panel").classList.add("hidden");
      sound("page");
    };
  };
  $("settings-button").onclick = () => {
    sound("page");
    const a = Audio.settings;
    $("menu-panel").classList.remove("hidden");
    $("menu-panel").innerHTML = `<h2>Sound & settings</h2><label>Music <input id="music-volume" type="range" min="0" max="100" value="${Math.round(a.music * 100)}"></label><label>Effects <input id="sfx-volume" type="range" min="0" max="100" value="${Math.round(a.sfx * 100)}"></label><p>The score and effects are made live by your browser. Your volume choices are saved here.</p>${Audio.nowPlaying() ? `<p class="muted">Now playing: <em>${Audio.nowPlaying()}</em></p>` : ""}<button id="panel-close" class="ink-button">Close this page</button>`;
    const change = () => Audio.setVolumes(
      +$("music-volume").value / 100,
      +$("sfx-volume").value / 100
    );
    $("music-volume").oninput = change;
    $("sfx-volume").oninput = change;
    $("panel-close").onclick = () => {
      $("menu-panel").classList.add("hidden");
      sound("page");
    };
  };
  $("intro-next").onclick = () => {
    sound("page");
    if (state.intro < 2) {
      state.intro++;
      renderIntro();
    } else enterGame();
  };
  $("journal-button").onclick = () => toggleJournal();
  $("book-close").onclick = () => toggleJournal(false);
  $("recover").onclick = () => {
    game.recover();
    $("death").classList.add("hidden");
    updateUI(true);
  };
  $("reload-save").onclick = () => {
    if (game.load()) {
      $("death").classList.add("hidden");
      updateUI(true);
    } else {
      game.recover();
      $("death").classList.add("hidden");
    }
  };
  document.querySelectorAll(".book-tabs button").forEach(
    (b) => b.onclick = () => {
      const tab = b.dataset.tab;
      if (tab && ["pack", "recipes", "vitals", "notes", "beasts"].includes(tab)) state.tab = tab;
      sound("page");
      renderJournal();
    }
  );
  function toggleJournal(force) {
    if (!state.playing || game.s.dead) return;
    state.journal = force === void 0 ? !state.journal : force;
    $("journal").classList.toggle("hidden", !state.journal);
    if (state.journal) {
      sound("page");
      renderJournal();
    }
  }
  function message(reason) {
    if (reason) {
      game.say(reason, "danger");
      updateUI(true);
    }
  }
  function doInteract() {
    const result = game.interact();
    if (!result.ok) message(result.reason);
    else {
      if (result.action === "beasts" || result.action === "recipes") sound("page");
      if (result.action === "beasts") {
        state.tab = "beasts";
        toggleJournal(true);
      }
      if (result.action === "recipes") {
        state.tab = "recipes";
        toggleJournal(true);
      }
      if (result.action === "farm") {
        state.farm = result.structure ?? null;
        state.tab = "pack";
        toggleJournal(true);
      }
      if (result.action === "chest") {
        state.chest = result.structure ?? null;
        state.tab = "pack";
        toggleJournal(true);
      }
    }
    updateUI(true);
  }
  function doAttack() {
    const r = game.attack();
    if (!r.ok && r.reason && r.reason !== "Recovering from the last strike.") message(r.reason);
    updateUI(true);
  }
  function doMine(x, y) {
    const r = game.mineTileAt(x, y);
    if (!r.ok) message(r.reason);
    updateUI(true);
  }
  var devConsole = new DevConsole(game, () => {
    if (state.journal) renderJournal();
    updateUI(true);
  });
  addEventListener("keydown", (e) => {
    if (e.code === "Backquote" && state.playing) {
      e.preventDefault();
      keys.clear();
      devConsole.toggle();
      return;
    }
    if (devConsole.open) return;
    const key = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "tab"].includes(key))
      e.preventDefault();
    keys.add(key);
    if (e.repeat) return;
    if (key === "escape") {
      if (state.journal) toggleJournal(false);
      else if (game.s.placing) {
        game.s.placing = null;
        game.say("Placement cancelled.");
      } else if (state.playing) {
        state.tab = "notes";
        toggleJournal(true);
      }
      return;
    }
    if (!state.playing || game.s.dead) return;
    if (key === "j" || key === "i" || key === "tab") {
      toggleJournal();
      return;
    }
    if (key === "m") {
      state.tab = "notes";
      toggleJournal(true);
      return;
    }
    if (state.journal) {
      const tabs = ["pack", "recipes", "vitals", "notes", "beasts"];
      if (/^[1-5]$/.test(key)) {
        state.tab = tabs[Number(key) - 1];
        renderJournal();
      }
      return;
    }
    if (key === "e") doInteract();
    if (key === "f") doAttack();
    if (key === "r")
      doMine(game.s.player.x + Math.cos(game.s.player.face) * 54, game.s.player.y - 12);
    if (key === "g") {
      const r = game.fish();
      if (!r.ok) message(r.reason);
      updateUI(true);
    }
    if (key === " " || key === "w" || key === "arrowup") {
      game.jump();
    }
  });
  addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
  addEventListener("blur", () => keys.clear());
  canvas.addEventListener("click", (e) => {
    if (!state.playing || state.journal || game.s.dead) return;
    if (game.s.placing) {
      const rect = canvas.getBoundingClientRect(), x = e.clientX - rect.left + state.camera.x, y = e.clientY - rect.top + state.camera.y;
      const r = game.place(game.s.placing, x, y);
      if (!r.ok) message(r.reason);
      updateUI(true);
    } else {
      const rect = canvas.getBoundingClientRect(), x = e.clientX - rect.left + state.camera.x, y = e.clientY - rect.top + state.camera.y;
      if (game.tileAt(Math.floor(x / TILE), Math.floor(y / TILE))) doMine(x, y);
      else doAttack();
    }
  });
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (state.playing && !state.journal) doAttack();
  });
  function renderJournal() {
    const tab = state.tab, left = $("page-left"), right = $("page-right");
    document.querySelectorAll(".book-tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    const page = {
      pack: "01",
      recipes: "02",
      vitals: "03",
      notes: "04",
      beasts: "05"
    };
    $("page-number").textContent = page[tab];
    $("right-page-heading").textContent = tab === "notes" ? "FIELD NOTES" : tab.toUpperCase();
    $("book").classList.remove("turn");
    void $("book").offsetWidth;
    $("book").classList.add("turn");
    if (tab === "pack") renderPack(left, right);
    if (tab === "recipes") renderRecipes(left, right);
    if (tab === "vitals") renderVitals(left, right);
    if (tab === "notes") renderNotes(left, right);
    if (tab === "beasts") renderBeasts(left, right);
  }
  function sketch(type) {
    if (type === "pack")
      return `<svg class="sketch" viewBox="0 0 440 150" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#57634f" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2" d="M167 129q-16-12-13-28l5-53q7-12 25-15l56 3q21 4 25 18l4 50q-2 21-17 25z"/><path stroke-width="1.5" d="M158 57q49-19 106 2m-96 2q46 24 87 1m-86-18q1-16 15-18l53 3q18 4 18 22M174 78l80 2-3 29q-37 18-78-3zM180 81l-1 22q28 10 65 2l2-23M192 88v19m44-21v20"/><path stroke-width="2.5" d="M183 38V19q30-12 52 0v18m-51-12q27-12 50 0m-44 2q-8 7-5 12m45-10q6 7 4 12M166 69l-11 41m110-41 12 42"/><path stroke-width="1" d="M186 50l57 1m-56 5 55 2m-74 61q42 13 83-1m-91-12 11 8m91-9-10 10M81 121q28-16 52 0m150 4q25-21 68-7M46 132q39-8 75 0m191 2q55-12 95-1"/><path stroke-width="1.3" d="M76 124l-8-18m8 18 7-21m17 23-4-15m14 17 7-22m232 18-10-16m10 16 12-22m15 20-2-17"/></g><g fill="#7d896d"><circle cx="182" cy="67" r="2"/><circle cx="251" cy="67" r="2"/><path d="M79 120q-18-15-20-24 17 0 20 24m272 2q10-18 29-22-7 18-29 22" opacity=".45"/></g><text x="18" y="25" fill="#7c624d" font-family="Caveat" font-size="19">straps repaired twice</text><path d="M115 26q28 4 45 22" fill="none" stroke="#7c624d"/><text x="279" y="58" fill="#7c624d" font-family="Caveat" font-size="18">keep dry</text><path d="M276 65q-13 7-18 22" fill="none" stroke="#7c624d"/></svg>`;
    if (type === "beast")
      return `<svg class="sketch" viewBox="0 0 440 155" xmlns="http://www.w3.org/2000/svg"><circle cx="211" cy="74" r="63" fill="none" stroke="#afa085" stroke-width="1"/><g fill="none" stroke="#5d5147" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="2.6" d="M91 123q21-29 52-34l23-34 18 14 22-43 17 42 26-20 8 30 37-6 43 28-39 14-14 21-40 11-80-15z"/><path stroke-width="1.7" d="M154 94l-22-11 11-26 20 20m66-15 27-20 14 38m-37 57q23-19 56-21m-117 10 39-11 31 10m57-30 22 7-20 5"/><path stroke-width="1" d="M127 112l31-18m-16 26 28-20m-3 26 27-27m-8 30 30-24m-6 28 30-28m-3 28 25-24m-4 22 23-17m-42-63 26 15m-59-35 24 27m-32-39 17 38m-47-12 22 21m-62 9 22 10m93 5 16-15"/><path stroke-width="1.5" d="M311 102q-8 14-25 19m-91-33q10-5 18-3m-19-3 14-10m33 31 6 17m6-15 8 16"/></g><path d="M278 88q8-6 15 1-9 7-15-1" fill="#954d45"/><circle cx="286" cy="88" r="2" fill="#f0dbc1"/><path d="M327 97l14 4-13 5z" fill="#5d5147"/><text x="19" y="31" fill="#7c624d" font-family="Caveat" font-size="22">the old wolf</text><path d="M90 37q23 15 37 35" fill="none" stroke="#7c624d"/><text x="313" y="142" fill="#7c624d" font-family="Caveat" font-size="18">eyes like embers</text></svg>`;
    return `<svg class="sketch" viewBox="0 0 440 145" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#66694f" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="4" d="M167 121 278 17"/><path stroke-width="2" d="M163 119q-8 7-3 13 7 4 14-5l-7-8m103-99q19-15 42-11l27 24q-19 3-32 18l-37-17z"/><path stroke-width="1" d="M274 21q25 8 33 30m-15-40 19 30m-9-29 19 25m-71 25-11-14m8 18-11-14m7 20-12-13m6 18-11-13m-9 20-13-13m10 21-13-13m8 19-13-12m-23 23 12 12m90-80 20-15m-15 28 29-16m-25 26 30-14M62 120q40-17 86 0m197 4q26-11 58-3"/><path stroke-width="1.5" d="M52 125l-7-18m7 18 10-18m16 17-3-14m275 14-9-16m9 16 11-17"/></g><path d="M270 22l29-9 28 19-18 8z" fill="#a8a88a" opacity=".26"/><text x="35" y="37" fill="#7d624b" font-family="Caveat" font-size="22">stone edge</text><path d="M98 42q36-4 65 24" fill="none" stroke="#7d624b"/><text x="315" y="82" fill="#7d624b" font-family="Caveat" font-size="20">fiber binding</text><path d="M315 84q-27-6-49-15" fill="none" stroke="#7d624b"/></svg>`;
  }
  function renderPack(left, right) {
    const items = game.s.inventory;
    left.innerHTML = `<h2>The Pack</h2><p class="lede">What you carry changes with time. What spoils can change you.</p>${sketch("pack")}<div class="divider"></div><h3>Equipment</h3><p>Weapon: <strong>${pretty(game.s.player.weapon)}</strong><br>Cloak: <strong>${game.s.player.cloak ? "Worn" : game.count("direwolf_cloak") ? "Packed" : "None"}</strong><br>Hide coat: <strong>${game.s.player.coat ? "Worn" : "Packed or absent"}</strong><br>Explorer boots: <strong>${game.s.player.boots ? "Worn" : "Packed or absent"}</strong></p><div class="note-block">Food and boiled water age in your pack, even while this record is closed. An icebox supplied with ice slows spoilage nearby.</div>${state.farm ? '<h3>Farm plot \xB7 Choose a seed</h3><div class="farm-choice"><button class="tiny-button" data-plant="herb">HERB</button><button class="tiny-button" data-plant="wheat">WHEAT</button><button class="tiny-button" data-plant="potato">POTATO</button></div>' : ""}${state.chest ? `<h3>Field chest</h3><p>Stowed here: ${Object.entries(state.chest.store).map(([id, n]) => `${n} ${pretty(id)}`).join(" \xB7 ") || "Nothing yet."}</p><div class="chest-actions"><select id="chest-item">${[.../* @__PURE__ */ new Set([...items.map((e) => e.id), ...Object.keys(state.chest.store)])].map((id) => `<option value="${id}">${pretty(id)}</option>`).join("")}</select><button data-store>STOW 1</button><button data-take>TAKE 1</button></div>` : ""}`;
    const order = [
      "weapon",
      "tool",
      "clothing",
      "food",
      "water",
      "medicine",
      "ore",
      "metal",
      "material",
      "trophy",
      "structure"
    ];
    const groups = [...new Set(items.map((e) => ITEMS[e.id][1]))].sort(
      (a, b) => order.indexOf(a) - order.indexOf(b)
    );
    right.innerHTML = `<h2>Contents</h2><p class="lede">${items.reduce((n, e) => n + e.qty, 0)} objects in the field pack.</p>${groups.map(
      (category) => `<h3>${category}</h3><div class="book-list">${items.filter((e) => ITEMS[e.id][1] === category).sort((a, b) => pretty(a.id).localeCompare(pretty(b.id))).map((e) => {
        const use = itemUseLabel(e.id), fresh = e.fresh === void 0 ? "" : `<small class="${game.itemState(e)}">${game.itemState(e).toUpperCase()} \xB7 ${Math.max(0, Math.ceil(e.fresh / 60))} min</small>`;
        return `<div class="book-row"><div><strong>${pretty(e.id)}</strong>${fresh}</div><div><span class="qty">\xD7${e.qty}</span>${use ? `<button data-use="${e.id}">${use}</button>` : ""}</div></div>`;
      }).join("")}</div>`
    ).join("") || "<p>Only the journal remains. Gather what the meadow offers.</p>"}`;
    right.querySelectorAll("[data-use]").forEach(
      (b) => b.onclick = () => {
        const r = game.use(b.dataset.use ?? "");
        if (!r.ok) message(r.reason);
        else {
          sound("page");
          if (game.s.placing) toggleJournal(false);
          else renderJournal();
        }
        updateUI(true);
      }
    );
    left.querySelectorAll("[data-plant]").forEach(
      (b) => b.onclick = () => {
        const farm = state.farm;
        if (!farm) return;
        const r = game.plant(farm, b.dataset.plant ?? "");
        if (!r.ok) message(r.reason);
        else {
          state.farm = null;
          sound("pluck");
          renderJournal();
        }
      }
    );
    const chest = state.chest;
    if (chest) {
      const choose = () => left.querySelector("#chest-item")?.value ?? "";
      left.querySelector("[data-store]").onclick = () => {
        const r = game.storeInChest(chest, choose());
        if (!r.ok) message(r.reason);
        else {
          sound("page");
          renderJournal();
        }
      };
      left.querySelector("[data-take]").onclick = () => {
        const r = game.takeFromChest(chest, choose());
        if (!r.ok) message(r.reason);
        else {
          sound("page");
          renderJournal();
        }
      };
    }
  }
  function renderRecipes(left, right) {
    const selected = RECIPES.find((r) => r.id === state.selectedRecipe) || RECIPES[0];
    const affordable = game.canAfford(selected.cost), atStation = !selected.station || !!game.near(selected.station);
    left.innerHTML = `<h2>Making Things</h2><p class="lede">Tools open harder ground. Stations let simple parts become something more.</p>${sketch("tool")}<h3>${pretty(selected.id)}</h3><p>${selected.station ? "Made at a " + pretty(selected.station).toLowerCase() : "Made by hand"} \xB7 Tier ${selected.tier}</p><div class="book-list">${Object.entries(
      selected.cost
    ).map(
      ([id, n]) => `<div class="book-row"><span>${pretty(id)}</span><span class="qty ${game.count(id) < n ? "red" : ""}">${game.count(id)} / ${n}</span></div>`
    ).join(
      ""
    )}</div><div class="note-block">${!atStation ? "Stand beside a " + pretty(selected.station ?? "").toLowerCase() + "." : !affordable ? "Gather the remaining materials." : "Everything needed is at hand."}</div>`;
    const recipes = [...RECIPES].sort((a, b) => a.tier - b.tier);
    right.innerHTML = `<h2>Recipes</h2><p class="lede">Select a recipe, then make it when its station and materials are within reach.</p>${recipes.map(
      (r, i) => `${i === 0 || recipes[i - 1].tier !== r.tier ? `<h3 class="recipe-group">Tier ${r.tier} \xB7 ${["", "First fire", "Copper age", "Iron age", "Forgework", "Black glass", "Effergy"][r.tier]}</h3>` : ""}<div class="recipe-row"><div class="recipe-head"><strong>${pretty(r.id)}</strong><button data-craft="${r.id}" ${game.canCraft(r.id) ? "" : "disabled"}>${game.dev.unlocked.has(r.id) ? "MAKE \u2726" : "MAKE"}</button></div><small>${Object.entries(
        r.cost
      ).map(([id, n]) => `${n} ${pretty(id).toLowerCase()}`).join(
        " \xB7 "
      )}</small><small>${r.station ? "AT " + pretty(r.station).toUpperCase() : "BY HAND"} \xB7 <a href="#" data-select="${r.id}">DETAILS</a></small></div>`
    ).join("")}`;
    right.querySelectorAll("[data-craft]").forEach(
      (b) => b.onclick = () => {
        const scroll = right.scrollTop;
        const r = game.craft(b.dataset.craft ?? "");
        if (!r.ok) message(r.reason);
        else {
          if (game.s.placing) toggleJournal(false);
          else {
            renderJournal();
            right.scrollTop = scroll;
          }
        }
        updateUI(true);
      }
    );
    right.querySelectorAll("[data-select]").forEach(
      (a) => a.onclick = (e) => {
        e.preventDefault();
        state.selectedRecipe = a.dataset.select ?? state.selectedRecipe;
        const scroll = right.scrollTop;
        renderJournal();
        right.scrollTop = scroll;
      }
    );
  }
  function renderVitals(left, right) {
    const v = game.s.vitals, current2 = game.biome(), symptoms = game.vitalReasons();
    left.innerHTML = `<h2>The Body</h2><p class="lede">Warmth, food, water, and rest pull each other out of balance.</p>${sketch("tool")}<h3>Exposure</h3><p>Air: <strong>${game.temperature().toFixed(0)}\xB0C</strong> in the ${current2.name.toLowerCase()}<br>Body: <strong>${v.bodyTemp.toFixed(1)}\xB0C</strong><br>Weather: <strong>${game.s.weather}</strong> \xB7 ${game.isNight() ? "night" : "day"}</p><div class="note-block">${symptoms.map((s) => `<div>\u2022 ${s}</div>`).join("")}</div><div class="book-actions"><button data-wash ${game.count("wild_water") + game.count("boiled_water") ? "" : "disabled"}>WASH \xB7 1 WATER</button></div><h3>Recovery</h3><p>Good food, safe water, warmth, and rest slowly restore health. A bedroll sharply reduces fatigue. Shelter keeps off rain; a lit fire helps dry and warm you.</p>`;
    const labels = [
      ["health", "Health"],
      ["hydration", "Hydration"],
      ["calories", "Calories"],
      ["protein", "Protein"],
      ["stamina", "Stamina"],
      ["fatigue", "Fatigue"],
      ["wetness", "Wetness"],
      ["illness", "Illness"],
      ["infection", "Infection"],
      ["hygiene", "Hygiene"],
      ["morale", "Morale"]
    ];
    right.innerHTML = `<h2>Vitals</h2><p class="lede">Read the whole body, not only the wound.</p>${labels.map(([id, label]) => {
      const val = Math.round(v[id]);
      const bad = ["fatigue", "wetness", "illness", "infection"].includes(id) ? val > 60 : val < 25;
      return `<div class="vital-row ${bad ? "danger" : ""}"><span>${label}</span><span class="mini-track"><i style="width:${val}%"></i></span><b>${val}</b></div>`;
    }).join(
      ""
    )}<h3>Diagnosis</h3>${game.s.disease ? `<div class="disease-note"><strong>${DISEASES[game.s.disease].name}</strong><p>Likely cause: ${DISEASES[game.s.disease].cause}. Field treatment: ${DISEASES[game.s.disease].treat}.</p></div>` : "<p>No active disease is recorded.</p>"}<small>These are game systems, not real-world medical guidance.</small>`;
    left.querySelector("[data-wash]").onclick = () => {
      const r = game.wash();
      if (!r.ok) message(r.reason);
      else {
        sound("page");
        renderJournal();
      }
      updateUI(true);
    };
  }
  function renderNotes(left, right) {
    const biome = game.biome(), t = game.s.tutorial, current2 = TUTORIAL[t.step];
    left.innerHTML = `<h2>Field Notes</h2><p class="lede">Nine regions across the surface; beneath them the upper and lower mines, and below those, hell.</p><canvas id="atlas-map" class="atlas-map" width="420" height="300" aria-label="Side elevation of the nine regions and the depths below"></canvas><h3>Current ground \xB7 ${biome.name}</h3><p>${biome.note}</p><p>Typical resources: ${[...new Set(biome.resources)].map(pretty).join(", ")}.</p><div class="book-actions"><button data-save>SAVE RECORD</button><button class="quiet" data-menu>MAIN MENU</button></div>`;
    right.innerHTML = `<h2>Lessons &amp; sightings</h2><p class="lede">${current2 ? current2[0] + " \xB7 " + Math.min(current2[2], t.tally[current2[1]] || 0) + "/" + current2[2] : "The first field lessons are complete."}</p><ol class="objective-list">${TUTORIAL.map(([label], i) => `<li class="${i < t.step ? "done" : i === t.step ? "current" : ""}">${label}</li>`).join("")}</ol><h3>Expedition chapters</h3><ol class="objective-list">${CHAPTERS.map(([label], i) => `<li class="${i < game.s.chapter ? "done" : i === game.s.chapter ? "current" : ""}">${label}</li>`).join("")}</ol><h3>Biome ledger</h3>${BIOMES.map((b) => `<div class="biome-entry ${b.id === biome.id ? "current" : ""}"><strong>${b.name}</strong><small>${b.note}</small></div>`).join("")}<h3>Controls</h3><p>A / D move \xB7 W / Space jump and climb \xB7 S descend \xB7 E gather or interact \xB7 F strike \xB7 R / click mine \xB7 G fish \xB7 J / I journal \xB7 M map \xB7 Esc pause \xB7 1\u20135 turn pages.</p>`;
    left.querySelector("[data-save]").onclick = () => {
      game.save();
      sound("page");
      updateUI(true);
    };
    left.querySelector("[data-menu]").onclick = () => {
      game.save(localStorage, true);
      toggleJournal(false);
      state.playing = false;
      $("hud").classList.add("hidden");
      $("menu").classList.remove("hidden");
      $("continue-game").disabled = false;
      state.chest = null;
    };
    drawAtlas();
  }
  function drawAtlas() {
    const map = $("atlas-map"), ink = map.getContext("2d");
    const w = map.width, h = map.height;
    ink.fillStyle = "#ddcfaa";
    ink.fillRect(0, 0, w, h);
    ink.strokeStyle = "#8e795e";
    ink.lineWidth = 1;
    for (let y = 20; y < h; y += 25) {
      ink.beginPath();
      ink.moveTo(0, y);
      ink.lineTo(w, y);
      ink.stroke();
    }
    const X = (x) => x / WORLD_W * w, Y = (y) => y / WORLD_H * (h - 30) + 14;
    const step = WORLD_W / 420;
    const bands = [
      [LAYERS[1].top, LAYERS[2].top, "#8a8667"],
      [LAYERS[2].top, LAYERS[3].top, "#6f7483"],
      [LAYERS[3].top, LAYERS[4].top, "#8d5a4a"],
      [LAYERS[4].top, WORLD_H, "#6e3434"]
    ];
    for (const [top, bottom, color] of bands) {
      ink.fillStyle = color;
      ink.beginPath();
      ink.moveTo(0, Y(bottom));
      for (let x = 0; x <= WORLD_W; x += step) ink.lineTo(X(x), Y(Math.max(top, surfaceAt(x))));
      ink.lineTo(w, Y(bottom));
      ink.fill();
    }
    ink.strokeStyle = "#f1dfb3";
    ink.lineWidth = 1.6;
    for (let level = 1; level <= CAVE_LEVELS; level++) {
      ink.beginPath();
      for (let x = 0; x <= WORLD_W; x += step) {
        const xx = X(x), yy = Y(caveY(x, level));
        if (!x) ink.moveTo(xx, yy);
        else ink.lineTo(xx, yy);
      }
      ink.stroke();
    }
    ink.fillStyle = "#2b1a18";
    ink.beginPath();
    for (let x = 0; x <= WORLD_W; x += step) ink.lineTo(X(x), Y(underworldCeiling(x)));
    for (let x = WORLD_W; x >= 0; x -= step) ink.lineTo(X(x), Y(underworldFloor(x)));
    ink.fill();
    ink.fillStyle = "#e8702a";
    for (let x = 0; x <= WORLD_W; x += step)
      if (underworldFloor(x) > LAVA_Y)
        ink.fillRect(X(x), Y(LAVA_Y), 1.2, Y(underworldFloor(x)) - Y(LAVA_Y));
    ink.strokeStyle = "#3a2a1a";
    ink.lineWidth = 1;
    for (const shaft of SHAFTS) {
      ink.beginPath();
      ink.moveTo(X(shaft.x), Y(shaft.top));
      ink.lineTo(X(shaft.x), Y(shaft.bottom));
      ink.stroke();
    }
    ink.font = 'italic 10px "EB Garamond", Georgia, serif';
    ink.textAlign = "left";
    ink.fillStyle = "#f5ead0";
    for (const layer of LAYERS.slice(2)) ink.fillText(layer.name, 4, Y(layer.top) + 11);
    ink.font = 'bold 10px "EB Garamond", Georgia, serif';
    ink.textAlign = "center";
    ink.fillStyle = "#322c24";
    SIDE_ORDER.forEach((id, i) => {
      const x = BIOME_CENTERS[id][0];
      ink.fillText(
        BIOMES.find((b) => b.id === id).name.slice(0, 4).toUpperCase(),
        X(x),
        Y(surfaceAt(x)) - (i % 2 ? 26 : 13)
      );
    });
    const px = X(game.s.player.x), py = Y(game.s.player.y);
    ink.beginPath();
    ink.arc(px, py, 5, 0, 7);
    ink.fillStyle = "#a34d3f";
    ink.fill();
    ink.font = "18px Caveat, cursive";
    ink.textAlign = "left";
    ink.fillText("you", Math.min(w - 24, px + 8), py - 7);
  }
  function renderBeasts(left, right) {
    const a = game.s.altar, cfg = BOSSES[a.level - 1], owned = game.s.structures.some((st) => st.type === "effergy"), near = !!game.near("effergy", 135);
    left.innerHTML = `<h2>Beasts</h2><p class="lede">The Effergy binds a hunt to the oldest shapes in the dark.</p>${sketch("beast")}<div class="folio-stamp">${owned ? "FOLIO UNSEALED" : "FOLIO SEALED"}</div><h3>Wolf attunement</h3><p>${owned ? "The wolf sigil is ready. Wolf kills fill the counter after attunement. Return to the altar when the Direwolf appears." : "Craft the Effergy at a forge, then place it to unseal this folio."}</p><div class="note-block">A black-glass weapon, obsidian tier or greater, is required to wound any Direwolf variant.</div><p class="muted">Future attunement capacity: ${a.level} sigil${a.level > 1 ? "s" : ""}. Only wolves are recorded in this volume.</p>`;
    right.innerHTML = `<h2>The Hunt</h2><p class="lede">Level ${a.level} \xB7 ${cfg.name}</p><div class="book-list"><div class="book-row"><span>Attuned</span><strong>${a.attuned === "wolf" ? "Wolves" : "None"}</strong></div><div class="book-row"><span>Wolf kills</span><strong>${a.kills} / ${cfg.kills}</strong></div><div class="book-row"><span>Effergy XP</span><strong>${a.xp}</strong></div><div class="book-row"><span>Direwolf health</span><strong>${cfg.hp}</strong></div><div class="book-row"><span>Bite damage</span><strong>${cfg.bite}</strong></div></div><h3>Victory spoils</h3><p>${Object.entries(
      cfg.rewards
    ).map(([id, n]) => `${n} ${pretty(id)}`).join(
      " \xB7 "
    )} \xB7 ${cfg.xp} XP.</p><div class="book-actions"><button data-attune ${!owned || !near || a.activeBoss ? "disabled" : ""}>ATTUNE TO WOLVES</button>${a.level < 3 ? `<button data-upgrade ${!owned || !near || a.activeBoss || a.xp < (a.level === 1 ? 100 : 250) ? "disabled" : ""}>UPGRADE \xB7 ${a.level === 1 ? 100 : 250} XP</button>` : ""}</div>${a.activeBoss ? '<div class="disease-note">The Direwolf has been summoned. Return to the altar and finish the hunt.</div>' : ""}<h3>Later inscriptions</h3><p>Level 2: Ember Direwolf, nine kills. Level 3: Void Direwolf, twelve kills. Each level deepens the altar and expands its future sigil capacity.</p>`;
    const attune = right.querySelector("[data-attune]"), upgrade = right.querySelector("[data-upgrade]");
    if (attune)
      attune.onclick = () => {
        const r = game.attune();
        if (!r.ok) message(r.reason);
        else {
          sound("boss");
          renderJournal();
        }
        updateUI(true);
      };
    if (upgrade)
      upgrade.onclick = () => {
        const r = game.upgradeAltar();
        if (!r.ok) message(r.reason);
        else {
          sound("victory");
          renderJournal();
        }
        updateUI(true);
      };
  }
  function updateUI(force = false) {
    if (!state.playing) return;
    const now = performance.now();
    if (!force && now - state.lastUI < UI_RULES.hudRefreshMs) return;
    state.lastUI = now;
    const v = game.s.vitals;
    ["health", "hydration", "calories", "stamina"].forEach((id) => {
      $(id + "-bar").style.width = clamp7(v[id], 0, 100) + "%";
      $(id + "-value").textContent = String(Math.round(v[id]));
    });
    const layer = game.layer();
    $("biome-name").textContent = layer.id === "surface" ? game.biome().name.toUpperCase() : layer.id === "upper_mines" ? game.biome().name.toUpperCase() + " \xB7 " + layer.name.toUpperCase() : layer.name.toUpperCase();
    $("world-time").textContent = timeText();
    $("condition-line").textContent = game.vitalReasons()[0];
    $("weapon-name").textContent = pretty(game.s.player.weapon);
    const step = TUTORIAL[game.s.tutorial.step] || CHAPTERS[game.s.chapter];
    $("objective-text").textContent = step ? step[0] : "The final folio is complete.";
    $("objective-progress").textContent = step ? `${Math.min(step[2], game.s.tutorial.tally[step[1]] || 0)} / ${step[2]}` : "EXPEDITION COMPLETE";
    const near = game.nearestInteractable();
    let prompt = "";
    if (game.s.placing) prompt = `<b>CLICK</b> Place ${pretty(game.s.placing)} \xB7 Esc cancels`;
    else if (near) {
      const action = near.type === "node" ? near.object.kind === "water" ? "Collect wild water" : nodeForm(near.object.kind) === "tree" ? `Chop tree (${near.object.hp} more)` : nodeForm(near.object.kind) === "mineral" ? `Mine ${pretty(near.object.kind).toLowerCase()} (${near.object.hp} more)` : "Gather " + pretty(near.object.kind) : near.type === "cache" ? "Open field cache" : near.object.type === "effergy" ? "Open Beasts folio" : near.object.type === "farm_plot" ? "Tend farm plot" : near.object.type === "bedroll" ? "Rest" : near.object.type === "icebox" ? "Add ice" : near.object.type === "campfire" ? "Add wood" : "Use " + pretty(near.object.type);
      prompt = `<b>E</b> ${action}`;
    } else prompt = "<b>E</b> Explore and gather";
    $("interaction-prompt").innerHTML = prompt;
    const boss2 = game.s.animals.find((a) => a.id === game.s.altar.activeBoss && !a.deadUntil);
    $("boss-hud").classList.toggle("hidden", !boss2);
    if (boss2) {
      $("boss-name").textContent = BOSSES[game.s.altar.level - 1].name.toUpperCase();
      $("boss-bar").style.width = clamp7(boss2.hp / boss2.maxHp * 100, 0, 100) + "%";
      $("boss-value").textContent = `${Math.ceil(boss2.hp)} / ${boss2.maxHp}`;
    }
    const msg = game.messages[0];
    if (msg && msg !== state.seenMessage) {
      state.seenMessage = msg;
      $("toast").textContent = msg.message;
      $("toast").classList.add("visible");
      setTimeout(() => {
        if (state.seenMessage === msg) $("toast").classList.remove("visible");
      }, 3e3);
      if (msg.tone === "victory") sound("victory");
    }
    if (game.s.dead) {
      $("death").classList.remove("hidden");
      state.journal = false;
      $("journal").classList.add("hidden");
    }
  }
  function camera() {
    const p = game.s.player;
    state.camera.x = clamp7(p.x - innerWidth / 2, 0, Math.max(0, WORLD_W - innerWidth));
    state.camera.y = clamp7(p.y - innerHeight / 2, 0, Math.max(0, WORLD_H - innerHeight));
  }
  function ambienceLevels() {
    const p = game.s.player, layer = game.layer().id, biome = game.biome().id, surface = layer === "surface", weather = game.s.weather, wet = weather === "rain" ? 0.7 : weather === "storm" ? 1 : 0, day = !game.isNight();
    let fire = 0;
    for (const st of game.s.structures)
      if (st.type === "campfire" && st.fuel > 0)
        fire = Math.max(fire, 1 - Math.hypot(st.x - p.x, st.y - p.y) / 420);
    let lava = 0;
    if (layer.endsWith("hell")) {
      let nearest = Infinity;
      for (let dx = -14; dx <= 14; dx += 2)
        for (let dy = -8; dy <= 8; dy += 2) {
          const x = p.x + dx * TILE, y = p.y + dy * TILE;
          if (lavaAt(x, y)) nearest = Math.min(nearest, Math.hypot(x - p.x, y - p.y));
        }
      lava = clamp7(1 - nearest / 520, 0, 1);
    }
    return {
      rain: surface ? wet * (game.sheltered() ? 0.5 : 1) : 0,
      wind: surface ? weather === "storm" ? 1 : ["tundra", "alpine", "taiga"].includes(biome) ? 0.6 : 0.12 : 0,
      fire,
      lava,
      cave: layer.endsWith("mines") ? 1 : layer === "upper_hell" ? 0.3 : 0,
      hell: layer === "upper_hell" ? 0.55 : layer === "lower_hell" ? 1 : 0,
      birds: surface && day && !wet && ["meadow", "forest", "coast", "marsh", "taiga"].includes(biome) ? 0.8 : 0,
      surf: surface && biome === "coast" ? clamp7(1 - p.x / 1600, 0, 1) : 0,
      night: surface && !day && !wet ? 0.8 : 0
    };
  }
  function maybeThunder(now) {
    if (game.s.weather !== "storm" || game.layer().id !== "surface" || now < state.nextThunder)
      return;
    state.nextThunder = now + 7e3 + Math.random() * 14e3;
    const p = game.s.player;
    Audio.effect("thunder", { x: p.x + (Math.random() - 0.5) * 900, y: p.y - 150 }, 1.6);
  }
  function drawWorld(now = performance.now()) {
    camera();
    if (!state.playing) {
      state.camera.x = clamp7(
        3600 + Math.sin(performance.now() / 12e3) * 380 - innerWidth * 0.2,
        0,
        WORLD_W - innerWidth
      );
      state.camera.y = clamp7(
        surfaceAt(UI_RULES.menuFocalX) - innerHeight * 0.62,
        0,
        WORLD_H - innerHeight
      );
    }
    const events = game.takeEvents();
    if (events.length) {
      spawnEffects(game, events);
      for (const e of events)
        if (e.type === "sfx") Audio.effect(e.kind, e, e.v);
        else if (e.type === "fell")
          setTimeout(() => Audio.effect("timber", { x: e.x + (e.dir ?? 1) * 70, y: e.y }), 950);
    }
    if (state.playing) {
      Audio.setListener(game.s.player.x, game.s.player.y - 20);
      if (now - state.lastAmbience > 250) {
        state.lastAmbience = now;
        Audio.setAmbience(ambienceLevels());
        maybeThunder(now);
      }
    } else Audio.setAmbience(SILENCE);
    draw(ctx, game, state.camera, innerWidth, innerHeight, !state.playing);
  }
  function frame(now) {
    const dt = Math.min((now - state.lastFrame) / 1e3, UI_RULES.maxFrameSeconds);
    state.lastFrame = now;
    if (state.playing && !state.journal && !game.s.dead) {
      const dx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0), dy = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") || keys.has(" ") ? 1 : 0);
      game.move(dx, dy, dt);
      game.tick(dt);
      if (!game.s.dead && game.s.elapsed - state.lastAuto > UI_RULES.autoSaveSeconds) {
        game.save(localStorage, true);
        state.lastAuto = game.s.elapsed;
      }
    }
    Audio.setScene(
      musicScene({
        playing: state.playing,
        dead: game.s.dead,
        boss: !!game.s.altar.activeBoss,
        layer: game.layer().id,
        weather: game.s.weather,
        biome: game.biome().id,
        night: game.isNight()
      })
    );
    Audio.setMuffled(state.playing && state.journal);
    drawWorld();
    updateUI();
    requestAnimationFrame(frame);
  }
  for (const type of ["pointerdown", "keydown"])
    addEventListener(type, () => Audio.start(), { once: true, capture: true });
  addEventListener("beforeunload", () => {
    if (state.playing && !game.s.dead) game.save(localStorage, true);
  });
  requestAnimationFrame(frame);
  window.Wildlands = { game, enterGame, renderJournal, state };
})();
