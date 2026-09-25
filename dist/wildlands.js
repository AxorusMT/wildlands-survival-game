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
    run(line) {
      const [name, ...args] = line.trim().split(/\s+/);
      if (!name) return [];
      const cmd = this.commands[name.toLowerCase()];
      if (!cmd) return [`! Unknown command "${name}". Type help.`];
      return cmd.run(args);
    }
    /** Completions for the word being typed: commands first, then that command's arguments. */
    complete(line) {
      const words = line.split(/\s+/), last = (words[words.length - 1] ?? "").toLowerCase();
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
    /** The item in the player's hand. */
    heldItem() {
      return this.s.player.weapon;
    }
    /** Seconds one use of an item takes (the swing animation length). */
    useDuration(_id) {
      return 0.3;
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
    command(line) {
      return this.devtools.run(line);
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

  // src/renderer/px.ts
  var PX = 2;
  var TA = 16;
  var hexCache = /* @__PURE__ */ new Map();
  function rgb(hex2) {
    let v = hexCache.get(hex2);
    if (!v) {
      const n = parseInt(hex2.slice(1, 7), 16);
      v = [n >> 16 & 255, n >> 8 & 255, n & 255];
      if (hexCache.size < 2e4) hexCache.set(hex2, v);
    }
    return v;
  }
  var hex = ([r, g, b]) => "#" + (1 << 24 | clamp8(r) << 16 | clamp8(g) << 8 | clamp8(b)).toString(16).slice(1);
  var clamp8 = (v) => Math.max(0, Math.min(255, Math.round(v)));
  var clamp2 = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  var lerp = (a, b, t) => a + (b - a) * t;
  function mix(a, b, t) {
    const p = rgb(a), q = rgb(b), k = clamp2(t);
    return hex([lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k)]);
  }
  var rgba = (c, a) => {
    const [r, g, b] = rgb(c);
    return `rgba(${r},${g},${b},${a})`;
  };
  function toHsl([r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6;
    return [h, s, l];
  }
  function fromHsl(h, s, l) {
    const f = (n) => {
      const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l);
      return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
    };
    return [f(0), f(8), f(4)];
  }
  var shiftCache = /* @__PURE__ */ new Map();
  function shade(c, amt) {
    const key = c + amt;
    let out = shiftCache.get(key);
    if (!out) {
      const [h, s, l] = toHsl(rgb(c));
      const target = amt < 0 ? 0.68 : 0.14, dh = ((target - h) % 1 + 1.5) % 1 - 0.5;
      out = hex(
        fromHsl(
          ((h + dh * Math.min(0.35, Math.abs(amt) * 0.6)) % 1 + 1) % 1,
          clamp2(s + (amt < 0 ? 0.08 : -0.04) * Math.abs(amt) * 3),
          clamp2(l + amt * (amt < 0 ? l : 1 - l))
        )
      );
      if (shiftCache.size < 2e4) shiftCache.set(key, out);
    }
    return out;
  }
  var ramp = (base) => [
    shade(base, -0.55),
    shade(base, -0.28),
    base,
    shade(base, 0.25),
    shade(base, 0.5)
  ];
  function hash3(x, y, s = 0) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 2147483647);
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  }
  function vnoise(x, y, cell, s = 0) {
    const fx = x / cell, fy = y / cell, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, u = tx * tx * (3 - 2 * tx), v = ty * ty * (3 - 2 * ty);
    const a = hash3(ix, iy, s), b = hash3(ix + 1, iy, s), c = hash3(ix, iy + 1, s), d = hash3(ix + 1, iy + 1, s);
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  }
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  var bayer = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
  function makeCanvas(w, h) {
    const cv = document.createElement("canvas");
    cv.width = Math.max(1, w);
    cv.height = Math.max(1, h);
    return cv;
  }
  var Painter = class {
    w;
    h;
    data;
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
    set(x, y, c, a = 255) {
      x |= 0;
      y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h || !c) return;
      const [r, g, b] = typeof c === "string" ? rgb(c) : c, i = (y * this.w + x) * 4;
      this.data[i] = r;
      this.data[i + 1] = g;
      this.data[i + 2] = b;
      this.data[i + 3] = a;
    }
    alpha(x, y) {
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
      return this.data[(y * this.w + x) * 4 + 3];
    }
    color(x, y) {
      const i = (y * this.w + x) * 4;
      return [this.data[i], this.data[i + 1], this.data[i + 2]];
    }
    clear(x, y) {
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      this.data[(y * this.w + x) * 4 + 3] = 0;
    }
    rect(x, y, w, h, c) {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    }
    line(x0, y0, x1, y1, c) {
      x0 = Math.round(x0);
      y0 = Math.round(y0);
      x1 = Math.round(x1);
      y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (; ; ) {
        this.set(x0, y0, c);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          x0 += sx;
        }
        if (e2 <= dx) {
          err += dx;
          y0 += sy;
        }
      }
    }
    /** Filled ellipse centred on (cx, cy); integer-friendly for crisp pixel discs. */
    ellipse(cx, cy, rx, ry, c) {
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const dx = (x + 0.5 - cx) / (rx + 0.01), dy = (y + 0.5 - cy) / (ry + 0.01);
          if (dx * dx + dy * dy <= 1) this.set(x, y, c);
        }
    }
    /** Filled polygon by scanline. */
    poly(points, c) {
      const ys = points.map((p) => p[1]), y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys));
      for (let y = y0; y <= y1; y++) {
        const xs = [];
        for (let i = 0; i < points.length; i++) {
          const [ax, ay] = points[i], [bx, by] = points[(i + 1) % points.length];
          const sy = y + 0.5;
          if (ay <= sy && by > sy || by <= sy && ay > sy)
            xs.push(ax + (sy - ay) / (by - ay) * (bx - ax));
        }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2)
          for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, c);
      }
    }
    /** Fills opaque pixels inside a rect with `c` where the dither threshold is below `level`. */
    dither(x, y, w, h, c, level) {
      for (let j = 0; j < h; j++)
        for (let i = 0; i < w; i++)
          if (this.alpha(x + i, y + j) && bayer(x + i, y + j) < level) this.set(x + i, y + j, c);
    }
    /** Shades opaque pixels by a light direction: top-left lit, bottom-right in shadow. */
    shadeEdges(light = 0.18, dark = -0.25) {
      const out = new Uint8ClampedArray(this.data);
      for (let y = 0; y < this.h; y++)
        for (let x = 0; x < this.w; x++) {
          if (!this.alpha(x, y)) continue;
          const top = !this.alpha(x, y - 1) || !this.alpha(x - 1, y), bottom = !this.alpha(x, y + 1) || !this.alpha(x + 1, y);
          if (top === bottom) continue;
          const c = hex(this.color(x, y)), [r, g, b] = rgb(shade(c, top ? light : dark)), i = (y * this.w + x) * 4;
          out[i] = r;
          out[i + 1] = g;
          out[i + 2] = b;
        }
      this.data.set(out);
    }
    /**
     * Adds a one-pixel outline around opaque pixels. With no colour, each outline pixel takes a
     * deep, cool shade of the neighbouring colour (a "selective" outline).
     */
    outline(color, strength = -0.72) {
      const add = [];
      for (let y = 0; y < this.h; y++)
        for (let x = 0; x < this.w; x++) {
          if (this.alpha(x, y)) continue;
          let n = null;
          for (const [dx, dy] of [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0]
          ])
            if (this.alpha(x + dx, y + dy) > 128) {
              n = [x + dx, y + dy];
              break;
            }
          if (n) add.push([x, y, color ?? shade(hex(this.color(n[0], n[1])), strength)]);
        }
      for (const [x, y, c] of add) this.set(x, y, c);
    }
    toCanvas() {
      const cv = makeCanvas(this.w, this.h), k = cv.getContext("2d");
      k.putImageData(
        new ImageData(this.data, this.w, this.h),
        0,
        0
      );
      return cv;
    }
  };
  var sprites = /* @__PURE__ */ new Map();
  function cached(key, build) {
    let s = sprites.get(key);
    if (!s) {
      s = build();
      if (sprites.size > 4e3) sprites.clear();
      sprites.set(key, s);
    }
    return s;
  }
  function sprite(w, h, ox, oy, paint2, outline = true) {
    const p = new Painter(w + 2, h + 2);
    paint2(p);
    if (outline) p.outline();
    return { cv: p.toCanvas(), ox: ox + 1, oy: oy + 1 };
  }
  function blit(c, s, x, y, flip = false) {
    x = Math.round(x);
    y = Math.round(y);
    if (!flip) c.drawImage(s.cv, x - s.ox, y - s.oy);
    else {
      c.save();
      c.translate(x, 0);
      c.scale(-1, 1);
      c.drawImage(s.cv, -(s.cv.width - s.ox), y - s.oy);
      c.restore();
    }
  }
  var DIGITS = {
    "0": "111101101101111",
    "1": "010110010010111",
    "2": "111001111100111",
    "3": "111001111001111",
    "4": "101101111001001",
    "5": "111100111001111",
    "6": "111100111101111",
    "7": "111001010010010",
    "8": "111101111101111",
    "9": "111101111001111",
    x: "000101010101000",
    "+": "000010111010000",
    "-": "000000111000000"
  };
  function pixelText(c, text, x, y, color, shadow = "#1a1614") {
    let cx = Math.round(x);
    for (const ch of text) {
      const bits = DIGITS[ch];
      if (bits) {
        for (let i = 0; i < 15; i++)
          if (bits[i] === "1") {
            c.fillStyle = shadow;
            c.fillRect(cx + i % 3 + 1, Math.round(y) + Math.floor(i / 3) + 1, 1, 1);
            c.fillStyle = color;
            c.fillRect(cx + i % 3, Math.round(y) + Math.floor(i / 3), 1, 1);
          }
      }
      cx += 4;
    }
  }
  function pixelView(cssW, cssH, ratio, zoom = 2) {
    const scale = Math.max(1, Math.round(zoom * ratio)), artW = Math.ceil(cssW * ratio / scale), artH = Math.ceil(cssH * ratio / scale);
    return {
      scale,
      artW,
      artH,
      worldW: artW * PX,
      worldH: artH * PX,
      cssPerWorld: scale / ratio / PX
    };
  }

  // src/renderer/art.ts
  var ART = {
    coast: {
      sky: ["#86b4c8", "#f0e7cf"],
      hills: ["#9dbcbf", "#86a9a7", "#6d918a", "#56766c"],
      skyline: "sea",
      tree: "palm",
      leaves: ["#3e6a4d", "#58865b", "#7fa56d"],
      bark: "#8a6a48",
      grass: ["#5e8446", "#7ea35a", "#a3c173"],
      cap: "grass",
      flowers: ["#f2efe2", "#e7c56a"]
    },
    marsh: {
      sky: ["#9fb3a0", "#e7e0c3"],
      hills: ["#a7b39c", "#8d9d82", "#728668", "#5a6e52"],
      skyline: "rolling",
      tree: "willow",
      leaves: ["#4f6a3b", "#6b8549", "#91a862"],
      bark: "#5d4a36",
      grass: ["#566f40", "#728a4f", "#94ab66"],
      cap: "grass",
      flowers: ["#d9d3ea", "#f1e8c8"]
    },
    forest: {
      sky: ["#97bcaa", "#ece3c6"],
      hills: ["#9fb4a0", "#7d987f", "#5d7a62", "#46624d"],
      skyline: "rolling",
      tree: "oak",
      leaves: ["#2f5636", "#46703f", "#6c9453"],
      bark: "#5a4230",
      grass: ["#4b7440", "#65904e", "#88b064"],
      cap: "grass",
      flowers: ["#f0ead6", "#c9a3c9"]
    },
    meadow: {
      sky: ["#9fc8d6", "#f2e6c5"],
      hills: ["#b7c4a3", "#9cb286", "#7e9b6b", "#657f55"],
      skyline: "rolling",
      tree: "birch",
      leaves: ["#4a7043", "#648e4d", "#8cb163"],
      bark: "#e8e1cf",
      grass: ["#65904a", "#86ae5a", "#aacb76"],
      cap: "grass",
      flowers: ["#f4f0e0", "#f0cf5e", "#c58fc0", "#e0816a"]
    },
    taiga: {
      sky: ["#99b3bf", "#e5e3d4"],
      hills: ["#a3b5b3", "#83999a", "#627c79", "#4a625f"],
      skyline: "rolling",
      tree: "pine",
      leaves: ["#26473d", "#365f50", "#52806b"],
      bark: "#57402f",
      grass: ["#4f6b4c", "#66845e", "#84a078"],
      cap: "grass",
      flowers: ["#eae7dc"]
    },
    tundra: {
      sky: ["#aac2d4", "#eeeee6"],
      hills: ["#d0dadd", "#b4c3c9", "#98abb3", "#7f949d"],
      skyline: "peaks",
      tree: "snowpine",
      leaves: ["#35544c", "#476b5e", "#678a7c"],
      bark: "#57402f",
      grass: ["#c9d6d8", "#e4ecec", "#f7faf8"],
      cap: "snow",
      flowers: [],
      snowy: true
    },
    alpine: {
      sky: ["#8fb2cf", "#ebe9e1"],
      hills: ["#c3ced6", "#9eafba", "#7d909c", "#63747f"],
      skyline: "peaks",
      tree: "snowpine",
      leaves: ["#2f5047", "#426a5a", "#5f8871"],
      bark: "#57402f",
      grass: ["#688060", "#829a74", "#a2b68c"],
      cap: "grass",
      flowers: ["#eef0f4", "#9fb3dd"],
      snowy: true
    },
    desert: {
      sky: ["#d9c7a0", "#f6e6c3"],
      hills: ["#e6d3a8", "#d8bb8a", "#c4a171", "#ab8559"],
      skyline: "dunes",
      tree: "cactus",
      leaves: ["#5f7a45", "#7a9453", "#9cb26a"],
      bark: "#7a6149",
      grass: ["#b89a64", "#cdb07b", "#e0c895"],
      cap: "none",
      flowers: ["#e8637a"]
    },
    badlands: {
      sky: ["#d3b49b", "#f2dcc0"],
      hills: ["#d6b39b", "#c09078", "#a4705a", "#855544"],
      skyline: "mesa",
      tree: "dead",
      leaves: ["#6f6a45", "#86804f", "#a19a63"],
      bark: "#6a4f3c",
      grass: ["#a06a4f", "#b98262", "#cf9f7d"],
      cap: "dust",
      flowers: []
    },
    // ── Dimensions ──
    mycelia: {
      sky: ["#1d1630", "#4a3a66"],
      hills: ["#3a2f55", "#322a4c", "#2a2342", "#221c38"],
      skyline: "spires",
      tree: "shroom",
      leaves: ["#4fd1c5", "#7ae8d8", "#b7f5e8"],
      bark: "#b8a8c8",
      grass: ["#3aa39a", "#58c8b8", "#8ce8d6"],
      cap: "mycel",
      flowers: ["#f08cd0", "#9ef0ff"]
    },
    skyreach: {
      sky: ["#6fa8e8", "#fbe7c0"],
      hills: ["#f4f0e8", "#e6e0d6", "#d8d2c8", "#cac4ba"],
      skyline: "islands",
      tree: "skytree",
      leaves: ["#e8b85a", "#f2cf74", "#fbe6a0"],
      bark: "#c8b8a0",
      grass: ["#7cc26a", "#9ad880", "#c0ec9c"],
      cap: "grass",
      flowers: ["#ffffff", "#ffd86a", "#8ad0ff"]
    },
    void: {
      sky: ["#07040f", "#2a1440"],
      hills: ["#22123a", "#1c0f30", "#160c26", "#10081c"],
      skyline: "shards",
      tree: "voidtree",
      leaves: ["#b36cff", "#d49bff", "#f0d0ff"],
      bark: "#3a2a50",
      grass: ["#6a3fa8", "#8a5ad0", "#b88af0"],
      cap: "moss",
      flowers: ["#ff6ad5"]
    }
  };
  var artAt = (x, y) => ART[biomeAt(x, y).id] ?? ART.meadow;
  function blendAt(x) {
    const [a, b, t] = biomeBlend(x);
    return [ART[a] ?? ART.meadow, ART[b] ?? ART.meadow, t];
  }
  var GROUND = {
    1: { base: "#8a6a4c", pattern: "soil", cap: "region", wall: "#3e3024" },
    2: { base: "#7a7f86", pattern: "stone", wall: "#2c3036" },
    3: { base: "#dcc38e", pattern: "sand", wall: "#6a5838" },
    4: { base: "#5f5a44", pattern: "mud", cap: "region", wall: "#2e2c22" },
    5: { base: "#b9d3dc", pattern: "ice", cap: "snow", wall: "#4a6070" },
    6: { base: "#b0674a", pattern: "strata", accent: "#d8936a", wall: "#4a2a22" },
    8: { base: "#4f5b72", pattern: "slate", accent: "#9fb8d8", wall: "#1c2230" },
    9: { base: "#6e4038", pattern: "ash", accent: "#ff8a3a", wall: "#251210" },
    10: { base: "#5c2230", pattern: "hell", accent: "#ff6a2a", wall: "#1a0709" },
    11: { base: "#a67a4a", pattern: "planks", wall: "#4a3420" },
    12: { base: "#8a8e94", pattern: "brick", wall: "#34383e" },
    13: { base: "#a95e46", pattern: "brick", wall: "#4a2a20" },
    14: { base: "#bfe4ee", pattern: "glass" },
    15: { base: "#58705a", pattern: "bigbrick", accent: "#7fa05a", wall: "#1e281e" },
    16: { base: "#8fb8d8", pattern: "bigbrick", accent: "#e8f6ff", wall: "#243448" },
    17: { base: "#c8a060", pattern: "bigbrick", accent: "#f0d080", wall: "#4a3418" },
    18: { base: "#3a2228", pattern: "bigbrick", accent: "#ff6a2a", wall: "#140608" },
    19: { base: "#5a4a6a", pattern: "soil", cap: "mycel", wall: "#221a2e" },
    20: { base: "#4a3f5e", pattern: "fungal", accent: "#6ae0d0", wall: "#1a1426" },
    21: { base: "#f4f4f8", pattern: "cloud", cap: "cloud" },
    22: { base: "#cfc4b0", pattern: "stone", cap: "region", wall: "#6a6050" },
    23: { base: "#2e1c46", pattern: "void", accent: "#b36cff", wall: "#0c0616" },
    24: { base: "#a06cf0", pattern: "crystal", accent: "#f0d8ff", glow: "#b36cff" },
    25: { base: "#262030", pattern: "obsidian", accent: "#7a6aa0", wall: "#0e0a14" },
    26: { base: "#e0c890", pattern: "bigbrick", accent: "#fff0c0", wall: "#6a5a3a" }
  };
  var groundOf = (kind) => GROUND[kind] ?? GROUND[2];
  function daylight(t) {
    if (t < 330 || t > 1170) return 0;
    if (t < 480) return (t - 330) / 150;
    if (t > 1020) return 1 - (t - 1020) / 150;
    return 1;
  }
  var duskiness = (t) => Math.max(0, 1 - Math.abs(t - 405) / 85) + Math.max(0, 1 - Math.abs(t - 1110) / 85);
  var overcastOf = (g) => g.s.weather === "storm" ? 1 : g.s.weather === "rain" ? 0.75 : g.s.weather === "cloudy" ? 0.35 : 0;
  function skyLight(g) {
    const tod = g.timeOfDay(), day = daylight(tod), dusk = clamp2(duskiness(tod)), over = overcastOf(g) * 0.3;
    const r = 0.2 + day * 0.8 + dusk * 0.12, gg = 0.24 + day * 0.76 - dusk * 0.05, b = 0.38 + day * 0.62 - dusk * 0.15;
    return [clamp2(r * (1 - over)), clamp2(gg * (1 - over)), clamp2(b * (1 - over * 0.7))];
  }

  // src/renderer/icons.ts
  var MATERIAL = {
    wood: "#8a6440",
    stone: "#8b8f8a",
    flint: "#6a7074",
    bone: "#e6dcc6",
    copper: "#d0844a",
    iron: "#a8a4a0",
    steel: "#dfe3e6",
    obsidian: "#4a3a64",
    hellstone: "#e04a2a",
    hellfire: "#ff6a2a",
    eclipse: "#9fe8f0",
    crypt: "#9ab88a",
    frost: "#aee4f4",
    sun: "#f0c860",
    cinder: "#ff8a3a",
    myconite: "#58e0d0",
    starmetal: "#f8e08a",
    voidsteel: "#b36cff",
    hide: "#a47c55",
    direwolf: "#6a6e7a",
    glass: "#bfe8f0"
  };
  var matOf = (id) => {
    for (const k of Object.keys(MATERIAL)) if (id.startsWith(k + "_")) return MATERIAL[k];
    return "#b8b0a0";
  };
  var ICONS = {
    wood: ["log", "#8a6440"],
    stone: ["lump", "#8b8f8a"],
    fiber: ["bundle", "#8fa35a"],
    flint: ["lump", "#4a5054"],
    clay: ["lump", "#b06f55"],
    coal: ["lump", "#2c2c30"],
    ice: ["gem", "#bfe3ee"],
    obsidian: ["gem", "#3a2a54"],
    sulfur: ["ore", "#e0c94a"],
    hide: ["pelt", "#a47c55"],
    bone: ["bone", "#e6dcc6"],
    resin: ["bottle", "#d99a3c"],
    reeds: ["bundle", "#a4a86a"],
    salt: ["lump", "#ece8de"],
    crystal: ["crystal", "#8fe3df"],
    hellstone: ["ore", "#e04a2a", "#5a1c22"],
    chitin: ["pelt", "#5a4032"],
    venom: ["bottle", "#7bc05a"],
    feathers: ["feather", "#eef0ea"],
    dirt: ["block", "#8a6a4c"],
    berry: ["berries", "#c8324a"],
    mushroom: ["mushroom", "#c9a07a"],
    honey: ["bottle", "#dcaa4e"],
    wheat: ["bundle", "#e0c060"],
    potato: ["lump", "#b99468"],
    herb: ["bundle", "#5f9a55"],
    willow: ["bundle", "#8a7a5a"],
    raw_meat: ["meat", "#c65a5a"],
    cooked_meat: ["meat", "#8a4a2a"],
    smoked_meat: ["meat", "#6a3422"],
    bread: ["bread", "#c8904a"],
    cactus_fruit: ["berries", "#d8577a"],
    raw_fish: ["fish", "#8ab0c0"],
    cooked_fish: ["fish", "#b8804a"],
    trail_ration: ["crate", "#8a7a5a"],
    potato_stew: ["bowl", "#b8804a"],
    wild_water: ["bottle", "#7ab0c8"],
    boiled_water: ["bottle", "#bfe8f4"],
    herbal_tea: ["potion", "#8ac070"],
    poultice: ["bowl", "#7a9a5a"],
    fever_remedy: ["potion", "#c89a5a"],
    antibiotic: ["potion", "#e8e0c0"],
    antivenom: ["potion", "#6ad0a0"],
    warming_brew: ["potion", "#e87a3a"],
    fishing_rod: ["rod", "#8a6440"],
    direwolf_cloak: ["cloak", "#6a6e7a"],
    hide_coat: ["chest", "#8a6e4e"],
    explorer_boots: ["boots", "#6b5139"],
    cinder_ward: ["orb", "#ff8a3a"],
    eclipse_fang: ["fang", "#cdeaff"],
    direwolf_pelt: ["pelt", "#5a5e6a"],
    beast_core: ["core", "#e3baf7"],
    eclipse_blade: ["sword", "#9fe8f0", "#221f2a"],
    hellfire_blade: ["sword", "#ff6a2a", "#3a1418"],
    obsidian_blade: ["sword", "#4a3a64", "#a07fd0"]
  };
  function paint(p, tpl, col, col2) {
    const [, d, m, l, ll] = ramp(col);
    const handle = "#7a5a3c", handleD = "#5a3f2a";
    const diag = (x0, y0, n, c, w = 1) => {
      for (let i = 0; i < n; i++) for (let k = 0; k < w; k++) p.set(x0 + i + k, y0 - i, c);
    };
    switch (tpl) {
      case "axe":
        diag(3, 14, 11, handle, 2);
        p.poly(
          [
            [8, 2],
            [13, 4],
            [14, 9],
            [10, 7]
          ],
          m
        );
        p.line(13, 4, 14, 9, l);
        p.line(8, 2, 10, 7, d);
        break;
      case "pick":
        diag(3, 14, 10, handle, 2);
        for (let i = 0; i < 12; i++)
          p.rect(2 + i, 2 + Math.round((i - 6) * (i - 6) / 9), 1, 2, i < 5 ? l : m);
        p.set(2, 5, d);
        p.set(13, 5, d);
        break;
      case "sword":
        diag(4, 11, 10, m, 2);
        diag(5, 11, 9, l);
        p.set(14, 1, ll);
        p.line(2, 9, 6, 13, col2 ?? "#9a8a60");
        diag(1, 15, 3, col2 ? shade(col2, -0.2) : handleD, 2);
        break;
      case "spear":
        diag(1, 15, 11, handle, 1);
        diag(2, 15, 10, handleD, 1);
        p.poly(
          [
            [11, 5],
            [15, 1],
            [11, 1],
            [10, 4]
          ],
          m
        );
        p.set(14, 1, l);
        p.line(10, 6, 9, 5, "#d8c79a");
        break;
      case "bow":
        for (let i = 0; i < 12; i++) {
          const a = i / 11 * Math.PI;
          p.rect(Math.round(3 + Math.sin(a) * 7), Math.round(2 + i * 1.1), 2, 1, i % 4 ? m : d);
        }
        p.line(4, 2, 4, 14, "#e8e0d0");
        break;
      case "staff":
      case "wand":
        diag(2, 15, tpl === "staff" ? 11 : 8, handle, tpl === "staff" ? 2 : 1);
        p.ellipse(tpl === "staff" ? 13 : 11, tpl === "staff" ? 3 : 5, 2.5, 2.5, m);
        p.set(tpl === "staff" ? 12 : 10, tpl === "staff" ? 2 : 4, ll);
        break;
      case "hammer":
        diag(3, 14, 9, handle, 2);
        p.poly(
          [
            [7, 3],
            [11, 0],
            [15, 5],
            [11, 8]
          ],
          m
        );
        p.line(7, 3, 11, 0, l);
        break;
      case "rod":
        diag(1, 15, 13, handle, 1);
        p.line(14, 2, 14, 12, "#e8e8e0");
        p.rect(13, 12, 2, 2, "#c8324a");
        break;
      case "arrow":
        diag(2, 14, 10, "#b89468", 1);
        p.poly(
          [
            [11, 5],
            [15, 1],
            [11, 1]
          ],
          m
        );
        p.rect(1, 13, 3, 1, "#e8e0d0");
        p.rect(2, 14, 1, 2, "#e8e0d0");
        break;
      case "gun":
        p.rect(2, 6, 12, 3, m);
        p.rect(3, 9, 3, 5, handle);
        p.rect(2, 6, 12, 1, l);
        break;
      case "ingot":
        p.poly(
          [
            [2, 11],
            [5, 6],
            [15, 6],
            [13, 11]
          ],
          m
        );
        p.poly(
          [
            [5, 6],
            [15, 6],
            [14, 8],
            [4, 8]
          ],
          l
        );
        p.rect(2, 11, 12, 2, d);
        p.set(6, 7, ll);
        break;
      case "ore":
        p.ellipse(8, 9, 6.5, 5, col2 ?? "#6d6a64");
        for (const [x, y] of [
          [5, 7],
          [9, 6],
          [7, 10],
          [11, 10],
          [10, 8]
        ])
          p.rect(x, y, 2, 2, m);
        p.set(6, 7, ll);
        break;
      case "gem":
      case "crystal":
        p.poly(
          [
            [8, 1],
            [13, 6],
            [8, 15],
            [3, 6]
          ],
          m
        );
        p.poly(
          [
            [8, 1],
            [8, 15],
            [3, 6]
          ],
          l
        );
        p.line(3, 6, 13, 6, ll);
        if (tpl === "crystal")
          p.poly(
            [
              [12, 7],
              [15, 10],
              [12, 15],
              [10, 10]
            ],
            d
          );
        break;
      case "lump":
        p.ellipse(8, 9, 6.5, 5, m);
        p.shadeEdges(0.25, -0.3);
        p.rect(5, 6, 2, 1, l);
        break;
      case "log":
        for (const [x, y] of [
          [1, 9],
          [5, 5],
          [3, 12]
        ]) {
          p.rect(x, y, 10, 4, m);
          p.rect(x, y, 10, 1, l);
          p.rect(x + 9, y, 3, 4, "#d8b888");
          p.set(x + 10, y + 1, "#b89468");
        }
        break;
      case "block":
        p.rect(2, 2, 12, 12, m);
        p.rect(2, 2, 12, 1, l);
        p.rect(2, 2, 1, 12, l);
        p.rect(2, 13, 12, 1, d);
        p.rect(13, 2, 1, 12, d);
        for (const [x, y] of [
          [5, 5],
          [9, 8],
          [6, 10]
        ])
          p.set(x, y, d);
        break;
      case "bundle":
        for (let i = 0; i < 6; i++) p.line(3 + i * 2, 15, 5 + i, 1 + i % 2, i % 2 ? m : l);
        p.rect(3, 9, 11, 2, "#6b4f37");
        break;
      case "berries":
        for (const [x, y] of [
          [5, 8],
          [10, 8],
          [7, 11],
          [8, 5]
        ]) {
          p.ellipse(x, y, 2.6, 2.6, m);
          p.set(x - 1, y - 1, ll);
        }
        p.line(8, 2, 9, 4, "#5a7a3a");
        break;
      case "meat":
        p.ellipse(8, 8, 6, 4.5, m);
        p.ellipse(7, 7, 3.5, 2, l);
        p.rect(12, 11, 3, 2, "#e6dcc6");
        p.rect(14, 10, 1, 4, "#e6dcc6");
        break;
      case "fish":
        p.ellipse(7, 8, 5.5, 3, m);
        p.poly(
          [
            [11, 8],
            [15, 4],
            [15, 12]
          ],
          d
        );
        p.set(4, 7, "#1a1614");
        p.line(4, 10, 9, 10, l);
        break;
      case "bread":
        p.ellipse(8, 9, 6.5, 4, m);
        p.ellipse(8, 8, 5.5, 3, l);
        for (const x of [5, 8, 11]) p.line(x, 7, x + 1, 9, d);
        break;
      case "bowl":
        p.poly(
          [
            [2, 8],
            [14, 8],
            [11, 14],
            [5, 14]
          ],
          "#8a6440"
        );
        p.rect(3, 7, 10, 2, m);
        p.set(6, 7, ll);
        break;
      case "bottle":
      case "potion":
        p.rect(6, 1, 4, 2, "#a88458");
        p.rect(6, 3, 4, 2, "#d8e8ec");
        if (tpl === "potion") p.ellipse(8, 10, 5, 5, "#d8e8ec");
        else p.rect(4, 5, 8, 10, "#d8e8ec");
        for (let y = 7; y < 16; y++)
          for (let x = 3; x < 13; x++) if (p.alpha(x, y)) p.set(x, y, y === 7 ? l : m);
        p.rect(tpl === "potion" ? 5 : 5, 8, 1, 3, "#ffffff");
        break;
      case "helmet":
        p.ellipse(8, 8, 6, 6, m);
        for (let y = 9; y < 16; y++) for (let x = 0; x < 16; x++) p.clear(x, y);
        p.rect(2, 8, 12, 2, d);
        p.rect(4, 4, 3, 2, l);
        p.rect(7, 8, 2, 5, d);
        break;
      case "chest":
        p.poly(
          [
            [3, 2],
            [13, 2],
            [15, 7],
            [13, 7],
            [13, 15],
            [3, 15],
            [3, 7],
            [1, 7]
          ],
          m
        );
        p.rect(3, 2, 10, 1, l);
        p.line(8, 3, 8, 14, d);
        p.rect(3, 10, 10, 1, d);
        break;
      case "legs":
        p.rect(3, 2, 10, 4, m);
        p.rect(3, 6, 4, 9, m);
        p.rect(9, 6, 4, 9, m);
        p.rect(3, 2, 10, 1, l);
        p.rect(3, 14, 4, 1, d);
        p.rect(9, 14, 4, 1, d);
        break;
      case "boots":
        p.rect(3, 3, 4, 9, m);
        p.rect(3, 12, 7, 3, m);
        p.rect(9, 5, 4, 7, d);
        p.rect(9, 12, 6, 3, d);
        p.rect(3, 3, 4, 1, l);
        break;
      case "cloak":
        p.poly(
          [
            [5, 1],
            [11, 1],
            [15, 15],
            [1, 15]
          ],
          m
        );
        p.line(5, 1, 1, 15, l);
        p.rect(5, 1, 6, 2, d);
        p.line(8, 4, 8, 14, d);
        break;
      case "fang":
        p.poly(
          [
            [3, 2],
            [9, 2],
            [7, 15]
          ],
          m
        );
        p.line(3, 2, 7, 15, ll);
        p.rect(3, 1, 7, 2, "#a88458");
        break;
      case "pelt":
        p.poly(
          [
            [3, 3],
            [13, 3],
            [15, 7],
            [13, 14],
            [3, 14],
            [1, 7]
          ],
          m
        );
        for (let i = 0; i < 12; i++) p.set(3 + i, 5 + i * 7 % 7, d);
        p.rect(3, 3, 10, 1, l);
        break;
      case "core":
      case "orb":
        p.ellipse(8, 8, 6, 6, d);
        p.ellipse(8, 8, 4.5, 4.5, m);
        p.rect(6, 5, 2, 2, ll);
        break;
      case "sigil":
        p.poly(
          [
            [8, 1],
            [15, 8],
            [8, 15],
            [1, 8]
          ],
          d
        );
        p.poly(
          [
            [8, 4],
            [12, 8],
            [8, 12],
            [4, 8]
          ],
          m
        );
        p.rect(7, 7, 2, 2, ll);
        break;
      case "key":
        p.ellipse(5, 5, 3.5, 3.5, m);
        p.clear(5, 5);
        p.clear(4, 5);
        p.line(7, 7, 14, 14, m);
        p.rect(11, 13, 2, 2, m);
        p.rect(13, 10, 2, 2, m);
        break;
      case "torch":
        diag(5, 15, 7, handle, 2);
        p.ellipse(12, 5, 2.5, 3.5, "#f8b848");
        p.ellipse(12, 6, 1.5, 2, "#fff0b0");
        break;
      case "crate":
        p.rect(2, 4, 12, 10, m);
        p.rect(2, 4, 12, 1, l);
        p.line(2, 4, 13, 13, d);
        p.rect(2, 13, 12, 1, d);
        break;
      case "mushroom":
        p.ellipse(8, 7, 6, 4, m);
        p.rect(2, 7, 13, 2, d);
        p.rect(6, 9, 4, 6, "#e8dcc8");
        p.rect(5, 5, 2, 1, ll);
        break;
      case "seed":
        for (const [x, y] of [
          [5, 7],
          [10, 6],
          [7, 11],
          [11, 11]
        ])
          p.ellipse(x, y, 1.8, 1.4, m);
        break;
      case "bone":
        diag(3, 12, 9, m, 2);
        for (const [x, y] of [
          [2, 12],
          [3, 14],
          [12, 2],
          [14, 4]
        ])
          p.ellipse(x, y, 1.6, 1.6, m);
        break;
      case "feather":
        p.line(3, 14, 13, 2, "#8a8070");
        for (let i = 0; i < 9; i++)
          p.line(4 + i, 12 - i, 6 + i, 14 - i - (i > 5 ? 1 : 0), i % 2 ? m : l);
        break;
      case "ring":
        p.ellipse(8, 9, 5, 5, m);
        p.ellipse(8, 9, 3, 3, "#000000");
        for (let y = 5; y < 13; y++)
          for (let x = 4; x < 12; x++) if ((x + 0.5 - 8) ** 2 + (y + 0.5 - 9) ** 2 < 9) p.clear(x, y);
        p.rect(7, 2, 3, 3, col2 ?? "#8fe3df");
        break;
      case "heart":
        p.ellipse(5, 6, 3.5, 3.5, m);
        p.ellipse(11, 6, 3.5, 3.5, m);
        p.poly(
          [
            [1.5, 7],
            [14.5, 7],
            [8, 14]
          ],
          m
        );
        p.rect(4, 4, 2, 2, ll);
        break;
      case "star":
        p.poly(
          [
            [8, 1],
            [10, 6],
            [15, 6],
            [11, 9],
            [13, 15],
            [8, 11],
            [3, 15],
            [5, 9],
            [1, 6],
            [6, 6]
          ],
          m
        );
        p.rect(7, 5, 2, 2, ll);
        break;
      case "scroll":
        p.rect(3, 3, 10, 10, "#e8dcb8");
        p.rect(2, 2, 12, 2, "#c8b890");
        p.rect(2, 12, 12, 2, "#c8b890");
        for (let y = 6; y < 11; y += 2) p.line(5, y, 11, y, m);
        break;
      case "bomb":
        p.ellipse(8, 10, 5, 5, "#3a3a40");
        p.rect(7, 3, 2, 3, "#8a6440");
        p.set(9, 2, "#ffd27a");
        p.rect(6, 8, 2, 2, "#6a6a74");
        break;
    }
  }
  function guess(id) {
    if (ICONS[id]) return ICONS[id];
    const m = matOf(id);
    const tail = id.split("_").pop() ?? "";
    const byTail = {
      axe: "axe",
      pick: "pick",
      pickaxe: "pick",
      sword: "sword",
      blade: "sword",
      spear: "spear",
      bow: "bow",
      staff: "staff",
      wand: "wand",
      hammer: "hammer",
      ingot: "ingot",
      bar: "ingot",
      ore: "ore",
      gem: "gem",
      helmet: "helmet",
      helm: "helmet",
      hood: "helmet",
      crown: "helmet",
      chestplate: "chest",
      mail: "chest",
      robe: "chest",
      greaves: "legs",
      leggings: "legs",
      boots: "boots",
      cloak: "cloak",
      fang: "fang",
      pelt: "pelt",
      core: "core",
      sigil: "sigil",
      key: "key",
      torch: "torch",
      arrow: "arrow",
      arrows: "arrow",
      potion: "potion",
      elixir: "potion",
      tonic: "potion",
      crystal: "crystal",
      orb: "orb",
      heart: "heart",
      star: "star",
      scroll: "scroll",
      bomb: "bomb",
      seeds: "seed",
      spores: "seed",
      ring: "ring",
      charm: "ring",
      amulet: "ring",
      shard: "gem",
      dust: "seed",
      blaster: "gun",
      repeater: "bow",
      tome: "scroll",
      brick: "block",
      bricks: "block",
      block: "block",
      planks: "block",
      glass: "block",
      feather: "feather",
      cap: "mushroom",
      bone: "bone",
      essence: "orb",
      silk: "bundle",
      gel: "orb"
    };
    if (byTail[tail]) return [byTail[tail], m];
    return ["lump", "#a89878"];
  }
  var blank = () => cached("icon:?", () => sprite(16, 16, 8, 8, (p) => paint(p, "crate", "#8a7a5a")));
  function iconSprite(id) {
    if (!id) return blank();
    return cached("icon:" + id, () => {
      const [tpl, col, col2] = guess(id);
      return sprite(16, 16, 8, 8, (p) => paint(p, tpl, col, col2));
    });
  }
  var glowingItem = (id) => /crystal|hellstone|hellfire|eclipse|core|myconite|starmetal|voidsteel|sigil|star|essence|torch|glow/.test(
    id
  );
  var urls = /* @__PURE__ */ new Map();
  function iconURL(id) {
    let u = urls.get(id);
    if (!u) {
      const s = iconSprite(id);
      u = s.cv.toDataURL();
      urls.set(id, u);
    }
    return u;
  }
  function useStyle(id) {
    if (!id || id === "fists") return "none";
    const [tpl] = guess(id);
    if (tpl === "spear") return "thrust";
    if (tpl === "bow" || tpl === "staff" || tpl === "wand" || tpl === "gun") return "aim";
    if (["axe", "pick", "sword", "hammer"].includes(tpl)) return "swing";
    return "hold";
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
  var ARMOR_COLOR = {
    hide: "#8a6e4e",
    copper: "#c07a45",
    iron: "#9a9894",
    steel: "#cfd4d8",
    obsidian: "#4a3a64",
    hellstone: "#b8402a",
    crypt: "#6a8a5a",
    frost: "#9fd8ec",
    sun: "#d8b050",
    cinder: "#c85a2a",
    myconite: "#3ab0a4",
    starmetal: "#e8d07a",
    voidsteel: "#7a4ac0"
  };
  var setColor = (id) => id ? ARMOR_COLOR[id.split("_")[0]] ?? "#9a9894" : null;
  function lookOf(p) {
    const armor = p.armor ?? {};
    return {
      skin: "#d8a47c",
      hair: "#5a3a26",
      hat: armor.head ? null : "#7d6444",
      helmet: setColor(armor.head),
      shirt: p.coat ? "#8a6e4e" : "#5d7560",
      coat: p.coat,
      pants: "#4a4e4f",
      boots: p.boots ? "#6b5139" : "#3e342c",
      cloak: p.cloak ? "#4b5566" : p.ward ? "#8a3a2a" : null,
      plate: setColor(armor.body),
      greaves: setColor(armor.legs)
    };
  }
  var lookKey = (l) => Object.values(l).join(",");
  var PW = 18;
  var PH = 29;
  var POX = 9;
  var POY = 28;
  var SHOULDER = [0, -17];
  function pose(state2, frame2) {
    if (state2 === "jump")
      return { back: [-3, -1], front: [3, -3], bob: 0, backArm: -2.2, frontArm: 2.2 };
    if (state2 === "fall")
      return { back: [-2, 0], front: [2, -1], bob: 0, backArm: -2.6, frontArm: 2.6 };
    if (state2 === "climb") {
      const s = frame2 % 2 ? 1 : -1;
      return {
        back: [-1, -2 * s - 1],
        front: [1, 2 * s - 1],
        bob: 0,
        backArm: 3 + s * 0.3,
        frontArm: 2.7 - s * 0.3
      };
    }
    if (state2 === "walk") {
      const a = frame2 / 8 * Math.PI * 2, s = Math.sin(a);
      return {
        back: [Math.round(-s * 4), -Math.round(Math.max(0, s) * 2)],
        front: [Math.round(s * 4), -Math.round(Math.max(0, -s) * 2)],
        bob: Math.abs(Math.cos(a)) > 0.7 ? 1 : 0,
        backArm: s * 0.8,
        frontArm: -s * 0.8
      };
    }
    return { back: [-1, 0], front: [1, 0], bob: frame2 % 2, backArm: 0.08, frontArm: -0.08 };
  }
  var handAt = (a, len = 7) => [
    SHOULDER[0] + Math.sin(a) * len,
    SHOULDER[1] + Math.cos(a) * len
  ];
  function paintArm(p, ox, oy, a, sleeve, skin) {
    const [hx, hy] = handAt(a, 6), sx = ox + SHOULDER[0], sy = oy + SHOULDER[1];
    const x1 = ox + hx, y1 = oy + hy;
    for (let i = 0; i <= 6; i++) {
      const x = Math.round(lerp(sx, x1, i / 6)), y = Math.round(lerp(sy, y1, i / 6));
      p.rect(x, y, 2, 2, sleeve);
    }
    p.rect(Math.round(x1), Math.round(y1), 2, 2, skin);
  }
  function playerSprite(l, state2, frame2, armIdx) {
    return cached(
      `pl:${lookKey(l)}:${state2}:${frame2}:${armIdx}`,
      () => sprite(PW, PH, POX, POY, (p) => {
        const ps = pose(state2, frame2), ox = POX, oy = POY - ps.bob;
        const shirt = l.plate ?? l.shirt, [, shirtD, , shirtL] = ramp(shirt), pants = l.greaves ?? l.pants, pantsD = shade(pants, -0.3);
        const leg = (foot, color, bootC) => {
          const hx = ox + (foot[0] > 0 ? 0 : -1), hy2 = oy - 9;
          const fx = ox + foot[0], fy = POY + foot[1];
          for (let i = 0; i <= 6; i++)
            p.rect(Math.round(lerp(hx, fx, i / 6)), Math.round(lerp(hy2, fy - 2, i / 6)), 2, 2, color);
          p.rect(fx - 1, fy - 2, 4, 3, bootC);
          p.rect(fx - 1, fy - 2, 4, 1, shade(bootC, 0.25));
        };
        paintArm(p, ox - 1, oy, ps.backArm, shade(shirt, -0.35), shade(l.skin, -0.2));
        leg(ps.back, pantsD, shade(l.boots, -0.25));
        if (l.cloak) {
          const flow = state2 === "walk" ? frame2 % 4 - 1 : state2 === "jump" || state2 === "fall" ? 3 : 0;
          p.poly(
            [
              [ox - 2, oy - 18],
              [ox + 1, oy - 18],
              [ox - 2, oy - 6],
              [ox - 6 - flow, oy - 4],
              [ox - 4 - flow, oy - 12]
            ],
            l.cloak
          );
          p.line(ox - 3, oy - 17, ox - 6 - flow, oy - 5, shade(l.cloak, 0.2));
        }
        p.rect(ox - 6, oy - 18, 4, 9, "#7a6446");
        p.rect(ox - 6, oy - 18, 4, 2, "#8e7552");
        p.rect(ox - 7, oy - 20, 6, 2, "#8a8f6a");
        const bottom = l.coat || l.plate ? oy - 7 : oy - 9;
        p.rect(ox - 3, oy - 18, 7, bottom - (oy - 18), shirt);
        p.rect(ox - 3, oy - 18, 7, 1, shirtL);
        p.rect(ox + 3, oy - 17, 1, bottom - (oy - 17), shirtD);
        p.rect(ox - 3, oy - 10, 7, 1, l.plate ? shirtD : "#4a3a2a");
        if (!l.plate) p.set(ox + 1, oy - 10, "#c9a24e");
        else p.rect(ox - 1, oy - 16, 3, 2, shirtL);
        leg(ps.front, pants, l.boots);
        const hy = oy - 26;
        p.rect(ox - 3, hy, 7, 7, l.skin);
        p.rect(ox - 3, hy + 6, 7, 1, shade(l.skin, -0.2));
        p.rect(ox - 3, hy, 2, 4, l.hair);
        p.rect(ox - 3, hy, 7, 1, l.hair);
        p.set(ox + 2, hy + 3, "#2a2320");
        p.set(ox + 4, hy + 3, l.skin);
        p.set(ox + 4, hy + 4, shade(l.skin, -0.1));
        p.rect(ox - 2, hy + 7, 6, 2, "#a8553f");
        if (l.helmet) {
          const [, hd, hm, hl] = ramp(l.helmet);
          p.rect(ox - 4, hy - 2, 9, 5, hm);
          p.rect(ox - 4, hy - 2, 9, 1, hl);
          p.rect(ox - 4, hy + 2, 3, 3, hd);
          p.rect(ox + 1, hy + 2, 1, 2, hd);
        } else if (l.hat) {
          p.rect(ox - 5, hy, 11, 1, l.hat);
          p.rect(ox - 3, hy - 3, 7, 3, shade(l.hat, 0.08));
          p.rect(ox - 3, hy - 1, 7, 1, "#4d3b2a");
        }
        const a = armIdx >= 0 ? armIdx / 16 * Math.PI * 2 : ps.frontArm;
        paintArm(p, ox, oy, a, shirt, l.skin);
      })
    );
  }
  function swingAngle(k) {
    const e = 1 - Math.pow(1 - k, 2.2);
    return lerp(Math.PI * 0.95, Math.PI * 0.1 - 0.4, e);
  }
  function drawPlayer(c, g, p, x, y, t) {
    const m = track(-1, p.x, p.y, 0, t), facing = Math.cos(p.face) >= 0 ? 1 : -1, shaft = data_exports.inShaft(p.x, p.y) && p.y > data_exports.surfaceAt(p.x) + 8, climbing = shaft && !p.grounded, state2 = climbing ? "climb" : !p.grounded ? p.vy < 0 ? "jump" : "fall" : m.move > 0.3 ? "walk" : "idle", frame2 = state2 === "walk" ? Math.floor(m.walk / 7) % 8 : state2 === "climb" ? Math.floor(p.y / 14) % 2 : Math.floor(t * 1.6) % 2;
    const held = g.heldItem(), style = climbing ? "none" : useStyle(held), useLen = g.useDuration(held), useStart = p.usedAt ?? p.attackAt - 0.52, k = clamp2((t - useStart) / useLen), using = t >= useStart && t < useStart + useLen;
    let armAngle = -1, reach = 0;
    const aimAngle = p.aim ?? 0;
    if (using && style === "swing") armAngle = swingAngle(k);
    else if (using && style === "thrust") {
      armAngle = Math.PI / 2;
      reach = Math.round(Math.sin(k * Math.PI) * 5);
    } else if (using && style === "aim") armAngle = Math.PI / 2 - aimAngle;
    else if (style === "hold") armAngle = 1.1;
    const armIdx = armAngle < 0 ? -1 : (Math.round(armAngle / (Math.PI * 2) * 16) % 16 + 16) % 16;
    const look = lookOf(p);
    const body = playerSprite(look, state2, frame2, armIdx);
    const sy = Math.round(y + (m.sy - p.y) / PX);
    if (p.invuln > 0 && Math.sin(t * 40) > 0.3) c.globalAlpha = 0.55;
    if (p.grounded) {
      c.fillStyle = "rgba(10,8,6,0.3)";
      c.fillRect(Math.round(x) - 5, Math.round(y), 11, 1);
    }
    const bob = pose(state2, frame2).bob;
    const drawItem = () => {
      if (armIdx < 0 || !held || style === "none") return;
      const icon2 = iconSprite(held), qa = armIdx / 16 * Math.PI * 2, [hx, hy] = handAt(qa, 7);
      c.save();
      c.translate(Math.round(x + facing * (hx + reach)), Math.round(sy - bob + hy));
      c.scale(facing, 1);
      if (style === "hold") c.drawImage(icon2.cv, -5, -12);
      else {
        c.rotate(Math.atan2(Math.cos(qa), Math.sin(qa)) + Math.PI / 4);
        c.drawImage(icon2.cv, -5, -13);
      }
      c.restore();
    };
    blit(c, body, x, sy, facing < 0);
    drawItem();
    if (using && style === "swing" && k < 0.8) {
      c.fillStyle = "rgba(246,238,214,0.5)";
      for (let i = 0; i < 6; i++) {
        const a = swingAngle(Math.max(0, k - i * 0.04));
        const [tx, ty] = handAt(a, 17);
        c.globalAlpha = 0.5 * (1 - i / 6) * (1 - k);
        c.fillRect(Math.round(x + facing * tx), Math.round(sy + ty), 2, 2);
      }
      c.globalAlpha = 1;
    }
    c.globalAlpha = 1;
  }
  var MOBS2 = {
    deer: {
      tpl: "quad",
      body: "#a57a52",
      belly: "#ead8b5",
      eye: "#1b1716",
      w: 26,
      h: 20,
      parts: ["antlers", "tail", "longlegs"],
      top: 34
    },
    wolf: {
      tpl: "quad",
      body: "#7b8284",
      belly: "#c8ccc8",
      eye: "#e8c46a",
      w: 24,
      h: 14,
      parts: ["ears", "tail", "snout", "mane"],
      top: 22
    },
    boar: {
      tpl: "quad",
      body: "#5e4636",
      belly: "#7a6250",
      eye: "#1b1716",
      w: 22,
      h: 13,
      parts: ["tusks", "mane", "snout"],
      top: 20
    },
    bat: {
      tpl: "flyer",
      body: "#4a3e46",
      belly: "#6a5a62",
      eye: "#f0d8a0",
      w: 18,
      h: 8,
      parts: ["ears"],
      top: 14
    },
    scorpion: {
      tpl: "crawler",
      body: "#8a5a32",
      belly: "#b07a42",
      eye: "#1b1716",
      w: 22,
      h: 8,
      parts: ["stinger", "claws"],
      top: 18
    },
    ember_bat: {
      tpl: "flyer",
      body: "#3a1a18",
      belly: "#ff7a2a",
      eye: "#ffd27a",
      w: 20,
      h: 9,
      parts: ["ears", "embers"],
      top: 14,
      light: [0.85, 0.32, 0.12]
    },
    hellhound: {
      tpl: "quad",
      body: "#4e1e22",
      belly: "#ff7a2a",
      eye: "#ff7a2a",
      w: 30,
      h: 18,
      parts: ["ears", "tail", "snout", "mane", "horns", "embers"],
      top: 30,
      light: [0.85, 0.32, 0.12]
    }
  };
  function paintQuad(p, a, frame2, ox, oy) {
    const [dk, d, m, l] = ramp(a.body), belly = a.belly ?? l, parts = new Set(a.parts ?? []), legH = parts.has("longlegs") ? Math.round(a.h * 0.45) : Math.round(a.h * 0.35), bodyH = a.h - legH - (parts.has("antlers") ? 5 : 0), bx = ox - Math.round(a.w * 0.4), bw = Math.round(a.w * 0.72), by = oy - legH - bodyH;
    const s = Math.sin(frame2 / 6 * Math.PI * 2), legs = [
      [bx + 2, -s, d],
      [bx + bw - 4, s, d],
      [bx + 3, s, m],
      [bx + bw - 3, -s, m]
    ];
    for (const [lx, sw, c] of legs.slice(0, 2))
      p.line(lx, oy - legH, lx + Math.round(sw * 2), oy - 1, c);
    for (const [lx, sw] of legs.slice(0, 2)) p.set(lx + Math.round(sw * 2), oy - 1, dk);
    if (parts.has("tail")) p.line(bx, by + 2, bx - 3, by + (parts.has("antlers") ? 0 : 4), m);
    p.ellipse(bx + bw / 2, by + bodyH / 2, bw / 2 + 0.5, bodyH / 2 + 0.5, m);
    for (let x = bx; x < bx + bw; x++) {
      const bottom = by + bodyH - 1;
      if (p.alpha(x, bottom)) p.set(x, bottom, belly);
    }
    p.rect(bx + 2, by, bw - 4, 1, l);
    if (parts.has("mane")) for (let x = bx + bw - 7; x < bx + bw; x++) p.set(x, by - 1 + x % 2, d);
    if (parts.has("embers"))
      for (let i = 0; i < 4; i++) p.set(bx + 3 + i * 4, by + 1 + i % 2, "#ff9a3a");
    for (const [lx, sw, c] of legs.slice(2)) {
      const x0 = lx, x1 = lx + Math.round(sw * 2);
      p.line(x0, oy - legH, x1, oy - 1, c);
      p.line(x0 + 1, oy - legH, x1 + 1, oy - 2, c);
      p.set(x1, oy - 1, dk);
      p.set(x1 + 1, oy - 1, dk);
    }
    const hx = bx + bw + 1, hy = by - (parts.has("antlers") ? 5 : 2), hw = Math.max(5, Math.round(a.w * 0.24)), hh = Math.max(4, Math.round(bodyH * 0.7));
    p.poly(
      [
        [bx + bw - 5, by + 1],
        [hx + 1, hy + 1],
        [hx + 2, hy + hh],
        [bx + bw - 3, by + bodyH - 2]
      ],
      m
    );
    p.rect(hx, hy, hw, hh, m);
    p.rect(hx, hy, hw, 1, l);
    if (parts.has("snout") || parts.has("tusks")) {
      p.rect(hx + hw, hy + Math.round(hh / 2) - 1, 3, Math.ceil(hh / 2) + 1, m);
      p.set(hx + hw + 2, hy + Math.round(hh / 2) - 1, "#1b1716");
    } else p.rect(hx + hw, hy + 1, 2, hh - 1, m);
    p.set(hx + hw - 2, hy + 1 + (hh > 5 ? 1 : 0), a.eye ?? "#1b1716");
    if (parts.has("ears")) {
      p.set(hx + 1, hy - 1, m);
      p.set(hx + 1, hy - 2, d);
      p.set(hx + 3, hy - 1, m);
    }
    if (parts.has("tusks")) {
      p.set(hx + hw + 1, hy + hh, "#ece4d0");
      p.set(hx + hw + 2, hy + hh - 1, "#ece4d0");
    }
    if (parts.has("horns")) {
      p.line(hx + 1, hy - 1, hx - 1, hy - 4, "#2a1a1a");
      p.line(hx + 3, hy - 1, hx + 4, hy - 4, "#2a1a1a");
    }
    if (parts.has("antlers")) {
      const c = "#d8c8a0";
      p.line(hx + 1, hy - 1, hx - 2, hy - 6, c);
      p.line(hx - 1, hy - 4, hx - 4, hy - 5, c);
      p.line(hx + 2, hy - 1, hx + 4, hy - 7, c);
      p.line(hx + 3, hy - 4, hx + 6, hy - 5, c);
    }
  }
  function paintBiped(p, a, frame2, ox, oy) {
    const [dk, d, m, l] = ramp(a.body), sec = a.belly ?? d, parts = new Set(a.parts ?? []), H = a.h, W = a.w, legH = Math.round(H * 0.32), torsoH = Math.round(H * 0.36), headH = H - legH - torsoH, s = Math.sin(frame2 / 6 * Math.PI * 2), float = parts.has("robe") || parts.has("float");
    const hipY = oy - legH, topY = hipY - torsoH, tw = Math.max(4, Math.round(W * 0.5)), tx = ox - Math.floor(tw / 2);
    if (parts.has("wings")) {
      const flap = Math.round(Math.sin(frame2 / 6 * Math.PI * 2) * 3);
      p.poly(
        [
          [tx, topY + 2],
          [tx - W * 0.7, topY - 4 + flap],
          [tx - W * 0.6, topY + torsoH + flap],
          [tx, topY + torsoH - 1]
        ],
        shade(sec, -0.2)
      );
    }
    p.line(tx, topY + 2, tx - Math.round(s * 2) - 1, topY + torsoH, d);
    if (!float) {
      p.line(ox - 1, hipY, ox - 1 - Math.round(s * 3), oy - 1, d);
      p.line(ox, hipY, ox - Math.round(s * 3), oy - 1, d);
    }
    if (float)
      p.poly(
        [
          [tx - 1, hipY - 2],
          [tx + tw + 1, hipY - 2],
          [tx + tw + 2 + frame2 % 2, oy - 2],
          [tx - 2 - frame2 % 2, oy - 2]
        ],
        parts.has("robe") ? sec : m
      );
    p.rect(tx, topY, tw, torsoH, parts.has("robe") ? sec : m);
    p.rect(tx, topY, tw, 1, l);
    if (parts.has("bones")) for (let y = topY + 1; y < hipY - 1; y += 2) p.rect(tx, y, tw, 1, dk);
    if (parts.has("bandage"))
      for (let y = topY; y < oy - 2; y += 3) p.line(tx - 1, y, tx + tw, y + 1, shade(a.body, 0.3));
    if (parts.has("armor")) {
      p.rect(tx, topY, tw, 2, sec);
      p.rect(tx + 1, topY + 3, tw - 2, torsoH - 4, sec);
    }
    if (!float) {
      p.line(ox + 1, hipY, ox + 1 + Math.round(s * 3), oy - 1, m);
      p.line(ox + 2, hipY, ox + 2 + Math.round(s * 3), oy - 1, m);
      p.set(ox + 3 + Math.round(s * 3), oy - 1, dk);
    }
    const hw = Math.max(4, Math.round(headH * 0.95)), hx = ox - Math.floor(hw / 2) + 1, hy = topY - headH;
    if (parts.has("cap")) {
      p.rect(hx, hy + 2, hw, headH - 2, "#e8dcc8");
      p.ellipse(ox + 1, hy + 2, hw * 0.9, 3, a.belly ?? "#c85a44");
      p.set(ox, hy + 1, shade(a.belly ?? "#c85a44", 0.4));
      p.set(ox + 2, hy + 5, a.eye ?? "#1b1716");
    } else {
      p.rect(hx, hy, hw, headH, parts.has("hood") ? sec : parts.has("bones") ? "#e6dcc6" : m);
      p.rect(hx, hy, hw, 1, l);
      if (parts.has("hood")) p.rect(hx + 2, hy + 2, hw - 2, headH - 3, "#120e14");
      p.set(hx + hw - 2, hy + Math.round(headH * 0.45), a.eye ?? "#1b1716");
      if (hw > 5) p.set(hx + hw - 4, hy + Math.round(headH * 0.45), a.eye ?? "#1b1716");
    }
    if (parts.has("horns")) {
      p.line(hx, hy, hx - 2, hy - 3, "#2a1a1a");
      p.line(hx + hw - 1, hy, hx + hw + 1, hy - 3, "#2a1a1a");
    }
    if (parts.has("crown")) {
      p.rect(hx, hy - 2, hw, 2, "#e8c84a");
      for (let x = hx; x < hx + hw; x += 2) p.set(x, hy - 3, "#e8c84a");
    }
    const ax = tx + tw, ay = topY + torsoH - 1 + Math.round(s);
    p.line(tx + tw - 1, topY + 2, ax + Math.round(s * 2), ay, m);
    if (parts.has("sword")) p.line(ax + 1, ay, ax + 6, ay - 6, "#c8ccd0");
    if (parts.has("staff")) {
      p.line(ax + 1, ay + 4, ax + 1, ay - torsoH - headH, "#6a4a30");
      p.rect(ax, ay - torsoH - headH - 2, 3, 3, a.eye ?? "#b36cff");
    }
    if (parts.has("shield")) p.rect(ax - 1, ay - 4, 3, 7, sec);
    if (parts.has("claws")) {
      p.set(ax + 1, ay + 1, "#ece4d0");
      p.set(ax + 2, ay, "#ece4d0");
    }
  }
  function paintFlyer(p, a, frame2, ox, oy) {
    const [, d, m, l] = ramp(a.body), parts = new Set(a.parts ?? []), cy = oy - Math.round(a.h / 2), flap = [-1, 0, 1, 0][frame2 % 4], span = Math.round(a.w / 2);
    const wing = (dir) => {
      const tipY = cy - 3 - flap * 3, x0 = ox, x1 = ox + dir * span;
      p.poly(
        [
          [x0, cy - 1],
          [x1, tipY],
          [x1 - dir * 2, cy + 2 - flap],
          [x0 + dir * 2, cy + 2]
        ],
        dir < 0 ? d : m
      );
      for (let i = 1; i < 3; i++)
        p.line(x0, cy, x0 + dir * Math.round(span * i / 3), tipY + 2, shade(a.body, -0.4));
    };
    wing(-1);
    p.ellipse(ox, cy, Math.max(2.5, a.h * 0.35), a.h * 0.45, a.belly ?? m);
    p.rect(ox - 1, cy - 2, 3, 1, l);
    wing(1);
    p.set(ox + 1, cy - 1, a.eye ?? "#f0d8a0");
    p.set(ox - 1, cy - 1, a.eye ?? "#f0d8a0");
    if (parts.has("ears")) {
      p.set(ox - 2, cy - Math.round(a.h * 0.45) - 1, m);
      p.set(ox + 2, cy - Math.round(a.h * 0.45) - 1, m);
    }
    if (parts.has("beak")) p.rect(ox + 2, cy, 2, 1, "#e8b84a");
    if (parts.has("tail")) p.line(ox - 1, cy + 3, ox - 4, cy + 6, d);
  }
  function paintCrawler(p, a, frame2, ox, oy) {
    const [dk, d, m, l] = ramp(a.body), parts = new Set(a.parts ?? []), by = oy - a.h, bw = Math.round(a.w * 0.55), bx = ox - Math.round(bw / 2);
    for (let i = 0; i < 4; i++) {
      const lx = bx + 2 + i * Math.round(bw / 4), sw = (i + frame2) % 2 ? 1 : -1;
      p.line(lx, oy - 3, lx + sw - 1, oy - 1, d);
    }
    p.ellipse(ox, by + a.h / 2, bw / 2, a.h / 2 - 1, m);
    for (let x = bx; x < bx + bw; x += 3) p.line(x, by + 1, x, by + a.h - 3, d);
    p.rect(bx + 1, by + 1, bw - 2, 1, l);
    if (parts.has("stinger")) {
      const sway = frame2 % 2;
      p.line(bx, by + 3, bx - 4, by - 2, m);
      p.line(bx - 4, by - 2, bx - 3 + sway, by - 7, m);
      p.line(bx - 3 + sway, by - 7, bx + 1 + sway, by - 8, dk);
      p.set(bx + 2 + sway, by - 7, a.belly ?? "#e0d0a0");
    }
    if (parts.has("claws")) {
      p.line(bx + bw, by + 3, bx + bw + 4, by + 2, m);
      p.rect(bx + bw + 3, by, 3, 2, d);
      p.rect(bx + bw + 3, by + 3, 3, 1, d);
    }
    if (parts.has("shell")) p.ellipse(ox, by + a.h / 2 - 1, bw / 2 - 1, a.h / 2 - 2, a.belly ?? l);
    p.set(bx + bw - 1, by + 2, a.eye ?? "#1b1716");
  }
  function paintSlime(p, a, frame2, ox, oy) {
    const [, d, m, l, ll] = ramp(a.body), squash = [0, 1, 2, 1][frame2 % 4], w = a.w / 2 + squash, h = a.h - squash * 2;
    p.ellipse(ox, oy - h / 2, w, h / 2, m);
    for (let x = Math.round(ox - w); x <= ox + w; x++) if (p.alpha(x, oy - 1)) p.set(x, oy - 1, d);
    p.rect(Math.round(ox - w / 2), Math.round(oy - h + 2), 2, 1, ll);
    p.set(Math.round(ox - w / 2), Math.round(oy - h + 3), l);
    p.set(ox + 2, Math.round(oy - h / 2), a.eye ?? "#1b1716");
    p.set(ox - 1, Math.round(oy - h / 2), a.eye ?? "#1b1716");
    if (a.parts?.includes("crown")) {
      p.rect(ox - 3, Math.round(oy - h - 2), 7, 2, "#e8c84a");
      p.set(ox - 3, Math.round(oy - h - 3), "#e8c84a");
      p.set(ox, Math.round(oy - h - 3), "#e8c84a");
      p.set(ox + 3, Math.round(oy - h - 3), "#e8c84a");
    }
    if (a.parts?.includes("core"))
      p.rect(ox - 1, Math.round(oy - h / 2) + 1, 2, 2, a.belly ?? "#ffffff");
  }
  function paintFloater(p, a, frame2, ox, oy) {
    const [dk, d, m, l, ll] = ramp(a.body), parts = new Set(a.parts ?? []), cy = oy - Math.round(a.h * 0.6), r = a.w / 2;
    if (parts.has("eye")) {
      p.ellipse(ox, cy, r, r, "#e8e0e0");
      p.ellipse(ox + 1, cy, r * 0.55, r * 0.55, a.belly ?? "#b36cff");
      p.ellipse(ox + 1, cy, r * 0.25, r * 0.35, "#0a0610");
      p.rect(Math.round(ox - r * 0.5), Math.round(cy - r * 0.6), 2, 1, "#ffffff");
      for (let i = 0; i < 4; i++)
        p.line(
          Math.round(ox - r + 1),
          cy + i - 1,
          Math.round(ox - r - 4 - (i + frame2) % 3),
          cy + i * 2 - 2,
          "#a02a3a"
        );
      return;
    }
    if (parts.has("ghost")) {
      p.ellipse(ox, cy, r, r * 0.9, m);
      p.rect(Math.round(ox - r), cy, Math.round(r * 2) + 1, Math.round(a.h * 0.45), m);
      for (let x = Math.round(ox - r); x <= ox + r; x++) {
        const wave = (x + frame2) % 3 - 1;
        for (let y = oy - 2 + wave; y < oy + 2; y++) p.clear(x, y);
      }
      p.rect(ox - 2, cy - 1, 2, 2, a.eye ?? "#1a1a2a");
      p.rect(ox + 2, cy - 1, 2, 2, a.eye ?? "#1a1a2a");
      p.rect(Math.round(ox - r + 1), cy - Math.round(r * 0.6), 2, 1, l);
      return;
    }
    for (let i = 0; i < 5; i++) {
      const tx = ox - i * 2 - frame2 % 2, ty = cy + Math.round(Math.sin(i + frame2) * 1.5);
      p.ellipse(tx, ty, Math.max(1, r - i * 0.7), Math.max(1, r - i * 0.7), i < 2 ? m : d);
    }
    p.ellipse(ox, cy, r * 0.6, r * 0.6, ll);
    p.set(ox, cy, "#ffffff");
    void dk;
  }
  function paintWorm(p, a, frame2, ox, oy) {
    const [, d, m, l] = ramp(a.body), n = Math.round(a.w / 4);
    for (let i = n - 1; i >= 0; i--) {
      const x = ox - i * 4, y = oy - a.h / 2 + Math.round(Math.sin(i * 0.9 + frame2) * 2);
      p.ellipse(x, y, a.h / 2, a.h / 2, i % 2 ? d : m);
      p.set(x, Math.round(y - a.h / 2 + 1), l);
    }
    p.set(ox + 1, oy - a.h / 2 - 1, a.eye ?? "#ff3a3a");
  }
  var PAINT = {
    quad: paintQuad,
    biped: paintBiped,
    flyer: paintFlyer,
    crawler: paintCrawler,
    slime: paintSlime,
    floater: paintFloater,
    worm: paintWorm
  };
  function mobSprite(key, a, frame2) {
    return cached(`mob:${key}:${frame2}`, () => {
      const W = Math.round(a.w * (a.tpl === "flyer" ? 1.2 : 1.6)) + 8, H = a.h + 14, ox = Math.round(W / 2), oy = H - 1;
      return sprite(W, H, ox, oy, (p) => PAINT[a.tpl](p, a, frame2, ox, oy));
    });
  }
  function bossArt(g) {
    const spec = data_exports.BOSSES[Math.min(data_exports.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))] ?? data_exports.BOSSES[0];
    return {
      tpl: "quad",
      body: mix(spec.color, "#262430", 0.55),
      belly: spec.color,
      eye: spec.glow,
      w: 44,
      h: 28,
      parts: ["ears", "tail", "snout", "mane", "spines"],
      top: 44
    };
  }
  function mobArt(g, a) {
    if (a.type === "boss") return bossArt(g);
    return MOBS2[a.type] ?? MOBS2.wolf;
  }
  function drawAnimal(c, g, a, x, y, t) {
    const m = track(a.id, a.x, a.y, a.hp, t), art2 = mobArt(g, a), facing = Math.cos(a.angle) >= 0 ? 1 : -1, hurt = t - m.hurt < 0.16, walks = art2.tpl === "quad" || art2.tpl === "biped" || art2.tpl === "crawler", frame2 = walks ? m.move > 0.3 ? Math.floor(m.walk / 6) % 6 : 0 : Math.floor(t * (art2.tpl === "flyer" ? 10 : 6) + a.phase) % 4, key = a.type === "boss" ? "boss" + g.s.altar.level : a.type;
    const sy = Math.round(y + (m.sy - a.y) / PX);
    const spr = mobSprite(key, art2, frame2);
    if (walks || art2.tpl === "slime") {
      c.fillStyle = "rgba(10,8,6,0.28)";
      c.fillRect(Math.round(x - art2.w * 0.35), Math.round(y), Math.round(art2.w * 0.7), 1);
    }
    blit(c, spr, x + (hurt ? Math.floor(t * 60) % 2 ? 1 : -1 : 0), sy, facing < 0);
    if (hurt) {
      const flash = cached(`flash:${key}:${frame2}`, () => {
        const cv = document.createElement("canvas");
        cv.width = spr.cv.width;
        cv.height = spr.cv.height;
        const k = cv.getContext("2d");
        k.drawImage(spr.cv, 0, 0);
        k.globalCompositeOperation = "source-in";
        k.fillStyle = "#ffffff";
        k.fillRect(0, 0, cv.width, cv.height);
        return { cv, ox: spr.ox, oy: spr.oy };
      });
      c.globalAlpha = 0.7;
      blit(c, flash, x, sy, facing < 0);
      c.globalAlpha = 1;
    }
    const top = art2.top ?? art2.h + 6;
    if (a.type !== "boss" && a.hp < a.maxHp && a.hp > 0) {
      const by = Math.round(sy - top - 4);
      c.fillStyle = "#1a1614";
      c.fillRect(Math.round(x) - 9, by, 18, 3);
      c.fillStyle = "#c0584a";
      c.fillRect(Math.round(x) - 8, by + 1, Math.round(16 * clamp2(a.hp / a.maxHp)), 1);
    }
    if (a.warning > 0) {
      const by = Math.round(sy - top - 12 + Math.sin(t * 12));
      const bang = cached(
        "warn",
        () => sprite(5, 8, 2, 7, (p) => {
          p.rect(0, 0, 5, 8, "#f1e3c0");
          p.rect(2, 1, 1, 4, "#b2402e");
          p.rect(2, 6, 1, 1, "#b2402e");
        })
      );
      blit(c, bang, x, by);
    }
  }

  // src/renderer/effects.ts
  var particles = [];
  var MAX_PARTICLES = 700;
  var rand = 1;
  var rnd = () => (rand = rand * 16807 % 2147483647) / 2147483647;
  var ITEM_COLOR = {
    wood: "#8a6440",
    resin: "#d99a3c",
    honey: "#dcaa4e",
    stone: "#8b8f8a",
    flint: "#3d4246",
    clay: "#b06f55",
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
    berry: "#b8324a",
    myconite_ore: "#58e0d0",
    starmetal_ore: "#f8e08a",
    voidsteel_ore: "#b36cff"
  };
  var colorOf = (item) => ITEM_COLOR[item] ?? "#a89878";
  function emit(p, now, delay = 0) {
    particles.push({
      vx: 0,
      vy: 0,
      size: 2,
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
  function floatText(x, y, text, color, now = performance.now() / 1e3) {
    emit({ x, y, kind: "text", text, color, vy: -50, gravity: 60, life: 0.9 }, now);
  }
  function spawnEffects(g, events, now = performance.now() / 1e3) {
    for (const e of events) {
      const art2 = artAt(e.x, e.y), leaves = art2.leaves;
      if (e.type === "chip") {
        if (e.kind === "water")
          burst(e, now, 7, () => ({
            kind: "drop",
            vx: (rnd() - 0.5) * 140,
            vy: -120 - rnd() * 120,
            color: "#9fd0e4",
            life: 0.6
          }));
        else if (e.kind === "wood" || e.kind === "resin" || e.kind === "honey") {
          burst(e, now, 6, () => ({
            vx: (rnd() - 0.5) * 220,
            vy: -140 - rnd() * 160,
            size: rnd() < 0.5 ? 2 : 1,
            color: rnd() < 0.5 ? "#c9a878" : "#8a6440"
          }));
          burst({ x: e.x, y: e.y - 40 }, now, 3, () => ({
            kind: "leaf",
            vx: (rnd() - 0.5) * 60,
            vy: -20 - rnd() * 30,
            color: leaves[Math.floor(rnd() * leaves.length)],
            life: 2.2,
            gravity: 60
          }));
        } else if (data_exports.NODES[e.kind]?.tool === "pick")
          burst(e, now, 7, () => ({
            vx: (rnd() - 0.5) * 240,
            vy: -120 - rnd() * 170,
            size: rnd() < 0.5 ? 2 : 1,
            color: rnd() < 0.6 ? colorOf(e.kind) : "#9a9d97",
            life: 0.8
          }));
        else
          burst(e, now, 4, () => ({
            kind: "leaf",
            vx: (rnd() - 0.5) * 80,
            vy: -60 - rnd() * 60,
            color: rnd() < 0.5 ? colorOf(e.kind) : leaves[0],
            life: 1.4,
            gravity: 120
          }));
      } else if (e.type === "fell") {
        const dir = e.dir ?? 1;
        for (let i = 0; i < 26; i++)
          emit(
            {
              x: e.x + dir * (30 + rnd() * 110),
              y: e.y - 10 - rnd() * 40,
              kind: "leaf",
              vx: (rnd() - 0.5) * 120 + dir * 30,
              vy: -60 - rnd() * 90,
              color: leaves[Math.floor(rnd() * leaves.length)],
              life: 2.4,
              gravity: 70
            },
            now,
            0.95
          );
        for (let i = 0; i < 6; i++)
          emit(
            {
              x: e.x + dir * (20 + i * 22),
              y: e.y - 4,
              kind: "dust",
              vx: dir * 20 + (rnd() - 0.5) * 30,
              vy: -18,
              size: 5 + rnd() * 4,
              color: "#b9a88a",
              life: 1.1,
              gravity: 0
            },
            now,
            1
          );
      } else if (e.type === "crumble" || e.type === "dig") {
        const color = e.type === "dig" ? groundOf(+e.kind).base : colorOf(e.kind);
        burst(e, now, e.type === "dig" ? 9 : 16, () => ({
          vx: (rnd() - 0.5) * 300,
          vy: -150 - rnd() * 220,
          size: rnd() < 0.4 ? 2 : 1,
          color: rnd() < 0.7 ? color : shade(color, -0.3),
          life: 1.1
        }));
        burst(e, now, 3, () => ({
          kind: "dust",
          vx: (rnd() - 0.5) * 60,
          vy: -30,
          size: 5 + rnd() * 5,
          color: e.type === "dig" && +e.kind >= 9 ? "#4a2a22" : "#a8a092",
          life: 0.9,
          gravity: 0
        }));
        if (e.kind === "hellstone" || e.kind === "9" || e.kind === "10" || e.kind === "18")
          burst(e, now, 8, () => ({
            kind: "spark",
            vx: (rnd() - 0.5) * 200,
            vy: -120 - rnd() * 160,
            color: "#ffb347",
            life: 0.8,
            gravity: 300
          }));
      } else if (e.type === "pickup") {
        const p = g.s.player;
        emit(
          { x: p.x, y: p.y - 26, kind: "ring", size: 4, color: "#fff1c8", life: 0.3, gravity: 0 },
          now
        );
      } else if (e.type === "sizzle")
        burst(e, now, 10, () => ({
          kind: rnd() < 0.5 ? "spark" : "dust",
          vx: (rnd() - 0.5) * 80,
          vy: -80 - rnd() * 120,
          size: 5,
          color: rnd() < 0.5 ? "#ffc46a" : "#5a4a44",
          life: 0.9,
          gravity: -40
        }));
      else if (e.type === "damage")
        floatText(e.x, e.y, e.kind, e.dir === 1 ? "#ff6a5a" : "#f4ecd8", now);
      else if (e.type === "burst")
        burst(e, now, 14, () => ({
          kind: "spark",
          vx: (rnd() - 0.5) * 260,
          vy: (rnd() - 0.5) * 260,
          color: e.kind || "#ffd27a",
          life: 0.5,
          gravity: 0
        }));
    }
  }
  function drawParticles(c, ax, ay, now = performance.now() / 1e3) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i], age = now - p.born;
      if (age < 0) continue;
      if (age > p.life) {
        particles.splice(i, 1);
        continue;
      }
      const x = Math.round(
        (p.x + p.vx * age + (p.kind === "leaf" ? Math.sin(age * 5 + i) * 10 : 0)) / PX - ax
      ), y = Math.round((p.y + p.vy * age + 0.5 * p.gravity * age * age) / PX - ay), fade = 1 - age / p.life;
      if (p.kind === "dust") {
        const r = Math.round(p.size * (1 + age * 1.4));
        c.fillStyle = rgba(p.color, 0.3 * fade);
        c.fillRect(x - r, y - Math.round(r * 0.6), r * 2, Math.round(r * 1.2));
      } else if (p.kind === "ring") {
        const r = Math.round(p.size + age * 40);
        c.fillStyle = rgba(p.color, 0.8 * fade);
        c.fillRect(x - r, y, 1, 1);
        c.fillRect(x + r, y, 1, 1);
        c.fillRect(x, y - r, 1, 1);
        c.fillRect(x, y + r, 1, 1);
      } else if (p.kind === "spark") {
        c.fillStyle = age < p.life * 0.4 ? "#fff2c0" : p.color;
        c.globalAlpha = fade;
        c.fillRect(x, y, 1, 1);
        c.globalAlpha = 1;
      } else if (p.kind === "text") {
        pixelText(c, p.text ?? "", x - (p.text?.length ?? 0) * 2, y, p.color);
      } else {
        c.fillStyle = p.color;
        c.globalAlpha = Math.min(1, fade * 1.6);
        const s = p.kind === "leaf" ? Math.floor(age * 6 + i) % 2 ? [2, 1] : [1, 2] : [p.size, p.size];
        c.fillRect(x, y, s[0], s[1]);
        c.globalAlpha = 1;
      }
    }
  }
  function drawDrops(c, g, ax, ay, w, h, t) {
    for (const d of g.s.drops) {
      if (t < d.born) continue;
      const x = d.x / PX - ax, y = d.y / PX - ay;
      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
      const bob = d.resting ? Math.round(Math.sin(t * 2.6 + d.id) * 1) : 0;
      if (glowingItem(d.item) || Math.sin(t * 3 + d.id) > 0.97) {
        c.fillStyle = "rgba(255,241,200,0.5)";
        c.fillRect(
          Math.round(x) - 5 + Math.floor(hash3(d.id, Math.floor(t * 4)) * 10),
          Math.round(y) - 12,
          1,
          1
        );
      }
      blit(c, iconSprite(d.item), x, y - 6 + bob);
      if (d.qty > 1)
        pixelText(c, String(d.qty), Math.round(x) + 3, Math.round(y) - 4 + bob, "#f4ecd8");
    }
  }
  function drawWeather(c, g, ax, ay, w, h, fx, menu2) {
    const t = g.s.elapsed, weather = g.s.weather, biome = data_exports.biomeAt(fx, 0).id, cold2 = biome === "tundra" || biome === "alpine", wet = weather === "rain" || weather === "storm", surfaceY = data_exports.surfaceAt(fx) / PX - ay;
    if (!menu2 && g.s.player.y > data_exports.surfaceAt(g.s.player.x) + 150) return;
    if (["mycelia", "void", "skyreach"].includes(biome)) {
      const n = biome === "skyreach" ? 30 : 60;
      for (let i = 0; i < n; i++) {
        const x = ((hash3(i, 1) * w + t * (biome === "skyreach" ? 90 : 6) - ax * 0.2) % w + w) % w | 0, y = ((hash3(i, 2) * h - t * (biome === "mycelia" ? 8 : biome === "void" ? 3 : 0)) % h + h) % h | 0;
        c.fillStyle = biome === "mycelia" ? "rgba(120,240,220,0.6)" : biome === "void" ? "rgba(220,170,255,0.55)" : "rgba(255,255,255,0.35)";
        c.fillRect(x, y, biome === "skyreach" ? 6 : 1, 1);
      }
      return;
    }
    const bottom = Math.min(h, surfaceY + 130);
    const open = (x, y) => (y + ay) * PX < data_exports.surfaceAt((x + ax) * PX);
    if (bottom <= 0) return;
    if (wet && !cold2) {
      const n = weather === "storm" ? 180 : 110, slant = weather === "storm" ? 2 : 1;
      c.fillStyle = "rgba(200,218,232,0.55)";
      for (let i = 0; i < n; i++) {
        const x = ((hash3(i, 4) * (w + 40) + t * 30 * slant - ax * 0.2) % (w + 40) + w + 40) % (w + 40) - 20, y = (hash3(i, 5) * bottom + t * (320 + hash3(i, 7) * 100)) % bottom, len = 3 + Math.floor(hash3(i, 6) * 3);
        if (!open(x, y)) continue;
        for (let k = 0; k < len; k++)
          c.fillRect(Math.round(x - k * slant / 2), Math.round(y + k), 1, 1);
      }
      if (weather === "storm") {
        const beat = Math.floor(t * 1.7), ph = t * 1.7 - beat;
        if (hash3(beat, 77) > 0.9 && ph < 0.25) {
          c.fillStyle = `rgba(235,240,255,${0.35 * (1 - ph / 0.25)})`;
          c.fillRect(0, 0, w, h);
        }
      }
    }
    if (cold2) {
      const n = wet ? 140 : weather === "cloudy" ? 60 : 30;
      c.fillStyle = "rgba(248,250,252,0.9)";
      for (let i = 0; i < n; i++) {
        const x = ((hash3(i, 1) * w + Math.sin(t * 0.8 + i) * 9 + t * (wet ? 20 : 7) - ax * 0.3) % (w + 20) + w + 20) % (w + 20) - 10, y = (hash3(i, 2) * bottom + t * (14 + hash3(i, 5) * 15)) % bottom, s = hash3(i, 3) < 0.3 ? 2 : 1;
        if (!open(x, y)) continue;
        c.fillRect(Math.round(x), Math.round(y), s, s);
      }
    }
    const night2 = 1 - daylight(g.timeOfDay());
    if (["meadow", "marsh", "forest"].includes(biome) && night2 > 0.3 && !wet)
      for (let i = 0; i < 16; i++) {
        const x = Math.round(
          ((hash3(i, 1) * 900 - ax + Math.sin(t * 0.4 + i) * 20) % 900 + 900) % 900
        ), y = Math.round(surfaceY - 10 - hash3(i, 2) * 45 + Math.sin(t * 0.9 + i * 2) * 6), blink = Math.max(0, Math.sin(t * 2 + i * 1.7));
        if (x > w || blink < 0.2) continue;
        c.fillStyle = `rgba(232,240,138,${0.35 * blink * night2})`;
        c.fillRect(x - 1, y - 1, 3, 3);
        c.fillStyle = `rgba(250,255,200,${blink * night2})`;
        c.fillRect(x, y, 1, 1);
      }
    if ((biome === "desert" || biome === "badlands") && !wet) {
      c.fillStyle = "rgba(240,220,180,0.5)";
      for (let i = 0; i < 30; i++) {
        const x = ((hash3(i, 1) * w + t * (10 + hash3(i, 3) * 12)) % (w + 10) + w + 10) % (w + 10) - 5, y = surfaceY - hash3(i, 2) * 100 + Math.sin(t + i) * 3;
        c.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
    }
    if ((biome === "forest" || biome === "taiga") && !wet)
      for (let i = 0; i < 7; i++) {
        const life = (t * 0.07 + hash3(i, 9)) % 1, x = Math.round(((hash3(i, 1) * w + life * 80 + Math.sin(life * 12 + i) * 15) % w + w) % w), y = Math.round(surfaceY - 120 + life * 130);
        c.fillStyle = biome === "taiga" ? "#8a8a4e" : "#b48a3e";
        c.fillRect(x, y, Math.floor(life * 20) % 2 ? 2 : 1, 1);
      }
  }

  // src/renderer/lighting.ts
  var T = data_exports.TILE;
  var AIR_KEEP = 0.9;
  var SOLID_KEEP = 0.55;
  var MARGIN = 12;
  function gatherLights(g, t, menu2 = false) {
    const out = [];
    const p = g.s.player;
    if (!menu2) out.push([p.x, p.y - 24, 0.78, 0.72, 0.62]);
    for (const s of g.s.structures) {
      const f = 0.92 + Math.sin(t * 11 + s.id) * 0.05;
      if (s.type === "campfire" && s.fuel > 0) out.push([s.x, s.y - 20, 1.25 * f, 0.85 * f, 0.5 * f]);
      else if (s.type === "lantern" && s.fuel > 0) out.push([s.x, s.y - 40, 1.1, 0.95, 0.62]);
      else if (s.type === "crystal_lantern") out.push([s.x, s.y - 40, 0.62, 1.05, 1.1]);
      else if (s.type === "torch") out.push([s.x, s.y - 20, 1.15 * f, 0.9 * f, 0.55 * f]);
      else if (s.type === "furnace" || s.type === "forge") out.push([s.x, s.y - 20, 1, 0.6, 0.3]);
      else if (s.type === "effergy") out.push([s.x, s.y - 60, 0.85, 0.72, 1]);
      else if (s.type === "rift_gate" || s.type === "portal")
        out.push([s.x, s.y - 50, 0.8, 0.5, 1.1]);
    }
    for (const n of g.s.nodes) {
      if (n.hp <= 0) continue;
      if (n.kind === "crystal") out.push([n.x, n.y - 14, 0.35, 0.8, 0.85]);
      else if (n.kind === "hellstone") out.push([n.x, n.y - 12, 0.95, 0.38, 0.14]);
      else if (n.kind.includes("myconite") || n.kind === "glowcap")
        out.push([n.x, n.y - 12, 0.25, 0.85, 0.8]);
      else if (n.kind.includes("starmetal")) out.push([n.x, n.y - 12, 0.95, 0.85, 0.45]);
      else if (n.kind.includes("voidsteel")) out.push([n.x, n.y - 12, 0.6, 0.3, 0.95]);
    }
    for (const a of g.s.animals) {
      if (a.deadUntil) continue;
      const light = MOBS2[a.type]?.light;
      if (light) out.push([a.x, a.y - 24, ...light]);
    }
    return out;
  }
  var grid = null;
  var buf = null;
  function drawLighting(c, g, ax, ay, w, h, lights) {
    const tx0 = Math.floor(ax / TA) - MARGIN, ty0 = Math.floor(ay / TA) - MARGIN, gw = Math.ceil(w / TA) + 2 * MARGIN + 1, gh = Math.ceil(h / TA) + 2 * MARGIN + 1, size = gw * gh;
    if (!buf || buf.size < size)
      buf = {
        r: new Float32Array(size),
        g: new Float32Array(size),
        b: new Float32Array(size),
        solid: new Uint8Array(size),
        size
      };
    const R2 = buf.r, G = buf.g, B = buf.b, S = buf.solid;
    const [sr, sg, sb] = skyLight(g);
    const layerAmbient = (y) => y >= data_exports.LAYERS[4].top ? [0.3, 0.1, 0.07] : y >= data_exports.LAYERS[3].top ? [0.22, 0.09, 0.07] : y >= data_exports.LAYERS[2].top ? [0.05, 0.055, 0.08] : [0.06, 0.06, 0.07];
    const dim = data_exports.biomeAt(g.s.player.x, 0).id;
    const skyFactor = dim === "void" ? 0.22 : dim === "mycelia" ? 0.3 : 1;
    for (let j = 0; j < gh; j++)
      for (let i = 0; i < gw; i++) {
        const tx = tx0 + i, ty = ty0 + j, k = j * gw + i, kind = g.tileAt(tx, ty), x = tx * T + T / 2, y = ty * T + T / 2;
        S[k] = kind ? 1 : 0;
        let [r, gg, b] = !kind && y > data_exports.surfaceAt(x) + 64 ? layerAmbient(y) : [0, 0, 0];
        if (!kind) {
          if (y < data_exports.surfaceAt(x) || dim === "skyreach") {
            r = sr * skyFactor;
            gg = sg * skyFactor;
            b = sb * skyFactor;
          } else if (y > 3300 && data_exports.lavaAt(x, y)) {
            r = 1.2;
            gg = 0.55;
            b = 0.18;
          }
        } else {
          const glow = GROUND[kind]?.glow;
          if (glow) {
            r = 0.55;
            gg = 0.3;
            b = 0.9;
          }
        }
        R2[k] = r;
        G[k] = gg;
        B[k] = b;
      }
    for (const [lx, ly, r, gg, b] of lights) {
      const i = Math.floor(lx / T) - tx0, j = Math.floor(ly / T) - ty0;
      if (i < 0 || j < 0 || i >= gw || j >= gh) continue;
      const k = j * gw + i;
      R2[k] = Math.max(R2[k], r);
      G[k] = Math.max(G[k], gg);
      B[k] = Math.max(B[k], b);
    }
    const step = (k, from) => {
      const keep = !S[k] ? AIR_KEEP : S[from] ? SOLID_KEEP : 0.88, r = R2[from] * keep, gg = G[from] * keep, b = B[from] * keep;
      if (r > R2[k]) R2[k] = r;
      if (gg > G[k]) G[k] = gg;
      if (b > B[k]) B[k] = b;
    };
    for (let pass = 0; pass < 2; pass++) {
      for (let j = 0; j < gh; j++) {
        const row = j * gw;
        for (let i = 1; i < gw; i++) step(row + i, row + i - 1);
        for (let i = gw - 2; i >= 0; i--) step(row + i, row + i + 1);
      }
      for (let i = 0; i < gw; i++) {
        for (let j = 1; j < gh; j++) step(j * gw + i, (j - 1) * gw + i);
        for (let j = gh - 2; j >= 0; j--) step(j * gw + i, (j + 1) * gw + i);
      }
    }
    if (!grid || grid.width !== gw || grid.height !== gh) grid = makeCanvas(gw, gh);
    const k2 = grid.getContext("2d"), img = k2.createImageData(gw, gh), d = img.data;
    for (let k = 0; k < size; k++) {
      d[k * 4] = Math.min(255, (R2[k] + 0.035) * 255);
      d[k * 4 + 1] = Math.min(255, (G[k] + 0.03) * 255);
      d[k * 4 + 2] = Math.min(255, (B[k] + 0.045) * 255);
      d[k * 4 + 3] = 255;
    }
    k2.putImageData(img, 0, 0);
    c.save();
    c.globalCompositeOperation = "multiply";
    c.imageSmoothingEnabled = true;
    c.drawImage(grid, tx0 * TA - ax, ty0 * TA - ay, gw * TA, gh * TA);
    c.restore();
    c.imageSmoothingEnabled = false;
  }

  // src/renderer/nature.ts
  var R = (n) => Math.round(n);
  function canopy(p, cx, cy, rx, ry, leaves, seed) {
    const [dark, mid, lit] = [leaves[0], leaves[1], leaves[2]];
    p.ellipse(cx, cy, rx, ry, mid);
    for (let y = R(cy - ry); y <= R(cy + ry); y++)
      for (let x = R(cx - rx); x <= R(cx + rx); x++) {
        if (!p.alpha(x, y)) continue;
        const dx = (x - cx) / rx, dy = (y - cy) / ry, light = -dx * 0.5 - dy * 0.8 + (hash3(x, y, seed) - 0.5) * 0.7;
        p.set(x, y, light > 0.45 ? lit : light < -0.35 ? dark : mid);
      }
  }
  function trunk(p, cx, top, bottom, width, bark, seed) {
    const [, d, m, l] = ramp(bark);
    for (let y = top; y <= bottom; y++) {
      const flare = y > bottom - 3 ? bottom - y === 0 ? 3 : 1 : 0, x0 = R(cx - width / 2) - flare, x1 = R(cx + width / 2) + flare;
      for (let x = x0; x < x1; x++) {
        const edge = x === x0 ? l : x === x1 - 1 ? d : hash3(x, Math.floor(y / 3), seed) < 0.18 ? d : m;
        p.set(x, y, edge);
      }
    }
  }
  function treeSprite(style, art2, variant, kind) {
    const seed = variant * 31 + style.length;
    const tall = (a, b) => R(a + hash3(variant, 1, 3) * (b - a));
    const leaves = art2.leaves, bark = kind === "resin" ? "#6a4a34" : art2.bark;
    switch (style) {
      case "pine":
      case "snowpine": {
        const h = tall(58, 78), w = 30;
        return sprite(w, h, w / 2, h - 1, (p) => {
          trunk(p, w / 2, h - 18, h - 1, 4, bark, seed);
          const tiers = 4;
          for (let i = 0; i < tiers; i++) {
            const top = 2 + i * ((h - 22) / tiers), half = 5 + i * 3 + (i === tiers - 1 ? 2 : 0), bottom = top + (h - 22) / tiers + 6;
            p.poly(
              [
                [w / 2, top],
                [w / 2 + half, bottom],
                [w / 2 - half, bottom]
              ],
              leaves[1]
            );
            for (let y = R(top); y < bottom; y++)
              for (let x = 0; x < w; x++) {
                if (!p.alpha(x, y) || y > h - 18) continue;
                const c = p.color(x, y);
                if (c[0] + c[1] + c[2] === 0) continue;
                if (x < w / 2 - 1 && hash3(x, y, seed) < 0.35) p.set(x, y, leaves[2]);
                else if (x > w / 2 + 1 && hash3(x, y, seed + 1) < 0.45) p.set(x, y, leaves[0]);
              }
            if (style === "snowpine") {
              for (let x = R(w / 2 - half + 2); x < w / 2 + half - 2; x++)
                p.set(x, R(bottom) - 1, hash3(x, i, 9) < 0.7 ? "#f4f8fa" : "#dfeaf2");
              p.set(w / 2, R(top), "#ffffff");
            }
          }
          if (kind === "resin")
            for (const [x, y] of [
              [w / 2 - 1, h - 12],
              [w / 2 + 1, h - 7]
            ])
              p.rect(x, y, 2, 2, "#e0a040");
        });
      }
      case "palm": {
        const h = tall(56, 72), w = 40;
        return sprite(w, h, 18, h - 1, (p) => {
          const [, d, m, l] = ramp(bark);
          for (let y = 10; y < h; y++) {
            const lean = R(Math.sin((h - y) / 26) * 5), x = 18 + lean;
            p.rect(x - 1, y, 3, 1, y % 4 === 0 ? d : m);
            p.set(x - 1, y, l);
          }
          const topX = 18 + R(Math.sin((h - 10) / 26) * 5);
          for (const [dx, dy, len] of [
            [-1, -0.2, 14],
            [1, -0.2, 14],
            [-1, 0.6, 12],
            [1, 0.6, 12],
            [0.3, -1, 8],
            [-0.4, -1, 8]
          ]) {
            for (let i = 0; i < len; i++) {
              const x = topX + dx * i, y = 10 + dy * i + i * i / 18;
              p.rect(R(x), R(y), 2, 2, i < len / 2 ? leaves[1] : leaves[2]);
              if (i % 2) p.set(R(x), R(y) + 2, leaves[0]);
            }
          }
          p.rect(topX - 1, 11, 2, 2, "#6a4a2a");
          p.rect(topX + 1, 12, 2, 2, "#5a3e22");
        });
      }
      case "willow": {
        const h = tall(48, 60), w = 44;
        return sprite(w, h, w / 2, h - 1, (p) => {
          trunk(p, w / 2, h - 26, h - 1, 7, bark, seed);
          canopy(p, w / 2, 14, 20, 12, leaves, seed);
          for (let x = 4; x < w - 4; x += 2) {
            const len = 10 + R(hash3(x, variant, 4) * 16);
            for (let y = 16; y < 16 + len; y++) p.set(x, y, y % 3 ? leaves[1] : leaves[2]);
          }
        });
      }
      case "cactus": {
        const h = tall(26, 40), w = 18;
        return sprite(w, h, w / 2, h - 1, (p) => {
          const g = ["#3f6a3a", "#5a8a48", "#7fae5e"];
          p.rect(7, 2, 5, h - 2, g[1]);
          p.rect(2, R(h * 0.45), 3, 8, g[1]);
          p.rect(2, R(h * 0.45) + 6, 6, 3, g[1]);
          p.rect(14, R(h * 0.3), 3, 9, g[1]);
          p.rect(11, R(h * 0.3) + 7, 5, 3, g[1]);
          for (let y = 2; y < h; y += 2) {
            p.set(8, y, g[2]);
            p.set(10, y, g[0]);
          }
          if (variant % 2) p.rect(8, 0, 3, 2, "#e8637a");
        });
      }
      case "dead": {
        const h = tall(34, 48), w = 30;
        return sprite(w, h, w / 2, h - 1, (p) => {
          trunk(p, w / 2, 10, h - 1, 4, "#7a6250", seed);
          const c = "#6a5444";
          p.line(15, 16, 5, 6, c);
          p.line(5, 6, 3, 2, c);
          p.line(16, 12, 25, 4, c);
          p.line(20, 8, 22, 2, c);
          p.line(15, 24, 23, 18, c);
        });
      }
      case "shroom": {
        const h = tall(40, 60), w = 36;
        return sprite(w, h, w / 2, h - 1, (p) => {
          const stalk = ["#8a7a9a", "#b8a8c8", "#dcd0e8"];
          for (let y = 12; y < h; y++) {
            p.rect(w / 2 - 3, y, 6, 1, stalk[1]);
            p.set(w / 2 - 3, y, stalk[2]);
            p.set(w / 2 + 2, y, stalk[0]);
          }
          p.ellipse(w / 2, 11, 17, 9, leaves[0]);
          p.ellipse(w / 2, 9, 16, 7, leaves[1]);
          p.rect(3, 12, w - 6, 3, shade(leaves[0], -0.3));
          for (let i = 0; i < 7; i++)
            p.rect(
              R(5 + hash3(i, variant, 2) * (w - 12)),
              R(4 + hash3(i, variant, 3) * 5),
              2,
              2,
              leaves[2]
            );
        });
      }
      case "skytree":
      case "voidtree":
      case "crystal":
      case "birch":
      case "oak":
      default: {
        const h = tall(style === "birch" ? 54 : 58, style === "birch" ? 70 : 76), w = 42;
        return sprite(w, h, w / 2, h - 1, (p) => {
          const trunkTop = 20;
          if (style === "birch" || style === "skytree") {
            for (let y = trunkTop; y < h; y++) {
              p.rect(w / 2 - 2, y, 4, 1, style === "birch" ? "#e8e1cf" : "#f0e8d8");
              if (hash3(y, 1, seed) < 0.18)
                p.rect(w / 2 - 2 + R(hash3(y, 2, seed) * 2), y, 2, 1, "#3a3430");
            }
          } else trunk(p, w / 2, trunkTop, h - 1, style === "voidtree" ? 4 : 6, bark, seed);
          p.line(w / 2, trunkTop + 8, w / 2 - 8, trunkTop - 2, shade(bark, -0.2));
          p.line(w / 2, trunkTop + 4, w / 2 + 9, trunkTop - 4, shade(bark, -0.2));
          const blobs = [
            [w / 2, 14, 13, 11],
            [w / 2 - 9, 18, 9, 8],
            [w / 2 + 10, 17, 9, 8],
            [w / 2 - 3, 7, 9, 7],
            [w / 2 + 5, 9, 8, 7]
          ];
          for (const [x, y, rx, ry] of blobs)
            canopy(p, x + R((hash3(x, variant, 5) - 0.5) * 3), y, rx, ry, leaves, seed);
          if (kind === "honey") {
            p.rect(w / 2 + 11, 22, 5, 7, "#dcaa4e");
            p.rect(w / 2 + 11, 24, 5, 1, "#a0742e");
            p.rect(w / 2 + 11, 27, 5, 1, "#a0742e");
            p.set(w / 2 + 13, 28, "#3a2a1c");
          }
          if (style === "voidtree")
            for (let i = 0; i < 6; i++)
              p.set(R(6 + hash3(i, variant) * (w - 12)), R(4 + hash3(i, variant, 1) * 20), "#fff0ff");
        });
      }
    }
  }
  function stumpSprite(bark) {
    return cached(
      "stump" + bark,
      () => sprite(12, 8, 6, 7, (p) => {
        const [, d, m, l] = ramp(bark);
        p.rect(2, 2, 8, 6, m);
        p.rect(2, 2, 1, 6, l);
        p.rect(9, 2, 1, 6, d);
        p.rect(1, 7, 10, 1, d);
        p.rect(2, 1, 8, 2, "#d8b888");
        p.rect(4, 1, 4, 1, "#b89468");
      })
    );
  }
  var FALL = 1.1;
  var FADE = 0.45;
  var hitShake = (n, t) => {
    const since = t - (n.hitAt ?? -9);
    return since >= 0 && since < 0.25 ? Math.floor(since * 40) % 2 ? 1 : -1 : 0;
  };
  var regionOf = (n) => data_exports.biomeAt(n.x, n.y).id;
  var TREE_KINDS = /* @__PURE__ */ new Set(["wood", "resin", "honey"]);
  function drawTree(c, n, x, y, t) {
    const region = regionOf(n), art2 = ART[region] ?? ART.meadow, style = n.kind === "resin" ? "pine" : n.kind === "honey" ? "oak" : art2.tree, variant = Math.floor(hash3(n.id, 7) * 6), tree = cached(
      `tree:${region}:${style}:${variant}:${n.kind}`,
      () => treeSprite(style, art2, variant, n.kind)
    );
    const since = n.felledAt === void 0 ? Infinity : t - n.felledAt;
    if (n.hp > 0) {
      blit(c, tree, x + hitShake(n, t), y, hash3(n.id, 9) > 0.5);
      return;
    }
    blit(c, stumpSprite(art2.bark), x, y);
    if (since < FALL + FADE) {
      const dir = n.fallDir ?? 1, lie = Math.PI / 2 - 0.06, p = Math.min(1, since / FALL), after = Math.max(0, since - FALL), angle = since < FALL ? lie * p ** 2.4 : lie - 0.06 * Math.sin(after * 18) * Math.exp(-after * 7);
      c.save();
      c.translate(Math.round(x), Math.round(y) - 5);
      c.rotate(dir * angle);
      c.globalAlpha = after > 0 ? Math.max(0, 1 - after / FADE) : 1;
      c.drawImage(tree.cv, -tree.ox, -tree.oy + 5);
      c.restore();
      return;
    }
    const window2 = n.depletedUntil - (n.felledAt ?? n.depletedUntil), growth = window2 > 0 && since < Infinity ? since / window2 : 0;
    if (growth > 0.45) {
      const big = growth > 0.75;
      const sap = cached(
        `sapling:${region}:${big}`,
        () => sprite(big ? 14 : 8, big ? 20 : 11, big ? 7 : 4, big ? 19 : 10, (p) => {
          const hgt = big ? 20 : 11, w = big ? 14 : 8;
          p.rect(Math.floor(w / 2), hgt / 2, 1, hgt / 2, art2.bark);
          p.ellipse(w / 2, hgt / 2.6, w / 2, hgt / 3, art2.leaves[1]);
          p.set(Math.floor(w / 2) - 1, Math.floor(hgt / 3), art2.leaves[2]);
        })
      );
      blit(c, sap, x + 6, y);
    }
  }
  var PLANT_KINDS = /* @__PURE__ */ new Set([
    "berry",
    "herb",
    "fiber",
    "wheat",
    "reeds",
    "potato",
    "cactus_fruit",
    "willow",
    "mushroom",
    "glowcap",
    "sunbloom",
    "voidlily"
  ]);
  function plantSprite(kind, stage, art2) {
    const g = art2.leaves;
    return sprite(18, 16, 9, 15, (p) => {
      const full = stage === 2, bare = stage === 0;
      switch (kind) {
        case "berry":
          p.ellipse(9, 10, 8, 5.5, g[1]);
          p.ellipse(7, 8, 5, 4, g[2]);
          p.ellipse(12, 11, 4, 3, g[0]);
          if (!bare)
            for (const [x, y] of [
              [5, 9],
              [9, 7],
              [12, 10],
              [7, 12],
              [14, 8],
              [10, 12]
            ].slice(0, full ? 6 : 3))
              p.rect(x, y, 2, 2, "#c8324a");
          break;
        case "fiber":
          for (let x = 3; x < 15; x += 2) {
            const hgt = bare ? 3 : 8 + R(hash3(x, 1) * 6);
            p.line(x, 15, x + (x < 9 ? -1 : 1), 15 - hgt, x % 4 ? g[1] : g[2]);
          }
          break;
        case "herb":
          for (let i = 0; i < 5; i++)
            p.ellipse(4 + i * 2.5, 10 - i % 2 * 2, 2.5, 3.5, i % 2 ? g[2] : g[1]);
          if (!bare)
            for (const [x, y] of [
              [5, 5],
              [10, 4],
              [13, 6]
            ])
              p.rect(x, y, 2, 2, "#f4f0e6");
          break;
        case "wheat":
          for (let x = 3; x < 16; x += 2) {
            p.line(x, 15, x, bare ? 12 : 5, "#b8984e");
            if (!bare) {
              p.rect(x - 1, 2 + x % 3, 2, 4, "#e8c86a");
              p.set(x, 2 + x % 3, "#f8e2a0");
            }
          }
          break;
        case "potato":
          p.ellipse(9, 11, 7, 4, g[1]);
          p.ellipse(6, 9, 3, 3, g[2]);
          p.ellipse(12, 9, 3, 3, g[2]);
          if (!bare) {
            p.set(6, 6, "#b890d8");
            p.set(12, 6, "#b890d8");
            p.rect(3, 14, 3, 2, "#a88458");
          }
          break;
        case "reeds":
          for (let x = 4; x < 15; x += 3) {
            p.line(x, 15, x + x % 2, bare ? 10 : 2, "#8a9458");
            if (!bare) p.rect(x - 1 + x % 2, 2, 2, 5, "#6a4830");
          }
          break;
        case "cactus_fruit":
          p.ellipse(9, 11, 5, 5, "#5a8a48");
          for (let y = 7; y < 16; y += 2) p.set(9, y, "#7fae5e");
          if (!bare) {
            p.rect(6, 5, 2, 2, "#e8577a");
            p.rect(10, 5, 2, 2, "#e8577a");
          }
          break;
        case "willow":
          p.line(9, 15, 9, 5, "#6a5440");
          for (let x = 3; x < 16; x += 2)
            p.line(x, 6, x, 6 + (bare ? 2 : 6 + x % 3), g[x % 4 ? 1 : 2]);
          break;
        case "mushroom":
        case "glowcap":
          for (const [x, s] of [
            [5, 4],
            [11, 5],
            [8, 3]
          ]) {
            const cap = kind === "glowcap" ? "#58e0d0" : x === 11 ? "#c85a44" : "#b89068";
            p.rect(x, 15 - s, 2, s, "#e8dcc8");
            p.ellipse(x + 1, 15 - s, s * 0.9 + 1, 2, bare ? "#8a7060" : cap);
          }
          break;
        default:
          p.ellipse(9, 11, 6, 4, g[1]);
          p.rect(8, 4, 3, 3, kind === "voidlily" ? "#ff6ad5" : "#ffd86a");
      }
    });
  }
  var MINERALS = {
    stone: { rock: "#8b8f8a" },
    flint: { rock: "#d9d2bf", fleck: "#34393d", shine: "#a4b3ba" },
    clay: { rock: "#b06f55", fleck: "#d49a7e" },
    salt: { rock: "#b8b2a4", crystal: "#f4f2ec" },
    copper_ore: { rock: "#7c7a74", fleck: "#d0844a", shine: "#62b08a" },
    iron_ore: { rock: "#7c7a74", fleck: "#a8745a", shine: "#d8c4b0" },
    coal: { rock: "#5a5a5e", fleck: "#1c1c20", shine: "#8a8a96" },
    ice: { rock: "#8fb8d0", crystal: "#dff4ff" },
    obsidian: { rock: "#3a3448", crystal: "#2a2433", shine: "#9a8ac0" },
    sulfur: { rock: "#8a7a5a", crystal: "#e8d44a" },
    crystal: { rock: "#6a7480", crystal: "#8fe3df", glow: true },
    hellstone: { rock: "#4a1c22", fleck: "#ff6a2a", shine: "#ffd27a", glow: true },
    myconite_ore: { rock: "#4a3f5e", crystal: "#58e0d0", glow: true },
    starmetal_ore: { rock: "#8a8aa0", fleck: "#f8e08a", shine: "#ffffff", glow: true },
    voidsteel_ore: { rock: "#2a1c3a", crystal: "#b36cff", glow: true }
  };
  function mineralSprite(kind, size, variant) {
    const m = MINERALS[kind] ?? MINERALS.stone, w = 10 + size * 4, h = 6 + size * 3;
    return sprite(w, h, w / 2, h - 1, (p) => {
      const [d, , mid, l] = ramp(m.rock);
      const lumps = 2 + size;
      for (let i = 0; i < lumps; i++) {
        const cx = 3 + i / Math.max(1, lumps - 1) * (w - 6) + (hash3(i, variant, 2) - 0.5) * 2, r = 2.5 + hash3(i, variant, 3) * (1.5 + size);
        p.ellipse(cx, h - r * 0.8, r + 0.5, r * 0.85, mid);
      }
      p.shadeEdges(0.3, -0.3);
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          if (!p.alpha(x, y)) continue;
          if (y === h - 1) p.set(x, y, d);
          if (m.fleck && hash3(x, y, variant + 5) < 0.14)
            p.set(x, y, hash3(x, y, 1) < 0.3 && m.shine ? m.shine : m.fleck);
          else if (hash3(x, y, variant + 9) < 0.04) p.set(x, y, l);
        }
      if (m.crystal)
        for (let i = 0; i < 1 + size; i++) {
          const cx = R(3 + hash3(i, variant, 7) * (w - 6)), ht = 3 + R(hash3(i, variant, 8) * (2 + size * 2));
          p.poly(
            [
              [cx - 1.5, h - 2],
              [cx, h - 2 - ht],
              [cx + 1.5, h - 2]
            ],
            m.crystal
          );
          p.set(cx, h - 1 - ht, shade(m.crystal, 0.5));
        }
    });
  }
  function pondSprite(t) {
    const frame2 = Math.floor(t * 3) % 4;
    return cached(
      "pond" + frame2,
      () => sprite(
        40,
        6,
        20,
        1,
        (p) => {
          p.ellipse(20, 1, 20, 4.5, "#3f7ea0");
          p.ellipse(20, 1, 17, 3.2, "#5a9cbc");
          for (let i = 0; i < 4; i++)
            p.rect(6 + (i * 9 + frame2 * 2) % 28, 1 + i % 2, 3, 1, "#b8e0ee");
          for (let x = 0; x < 40; x++) if (p.alpha(x, 0)) p.set(x, 0, "#8ac6dc");
        },
        false
      )
    );
  }
  function drawNode(c, n, x, y, t) {
    const k = n.kind;
    x += hitShake(n, t);
    if (k === "water") {
      if (n.hp > 0) blit(c, pondSprite(t), x, y);
      return;
    }
    const art2 = ART[regionOf(n)] ?? ART.meadow;
    if (PLANT_KINDS.has(k)) {
      const max = data_exports.NODES[k]?.hp ?? 2, stage = n.hp <= 0 ? 0 : n.hp >= max ? 2 : 1;
      blit(
        c,
        cached(`plant:${k}:${stage}:${regionOf(n)}`, () => plantSprite(k, stage, art2)),
        x,
        y,
        hash3(n.id, 4) > 0.5
      );
      return;
    }
    const full = data_exports.NODES[k] ? n.hp / data_exports.NODES[k].hp : 1, size = full > 0.67 ? 2 : full > 0.34 ? 1 : 0, variant = Math.floor(hash3(n.id, 2) * 3);
    blit(
      c,
      cached(`min:${k}:${size}:${variant}`, () => mineralSprite(k, size, variant)),
      x,
      y
    );
    if (MINERALS[k]?.glow) {
      const pulse2 = 0.25 + Math.sin(t * 2.5 + n.phase) * 0.12;
      c.fillStyle = MINERALS[k].crystal ?? MINERALS[k].fleck ?? "#ffffff";
      c.globalAlpha = pulse2;
      c.fillRect(Math.round(x) - 1, Math.round(y) - 8, 2, 2);
      c.globalAlpha = 1;
    }
  }
  function drawCache(c, cache, x, y) {
    const deep = !!cache.layer;
    const s = cached(
      "cache" + deep,
      () => sprite(16, 16, 7, 15, (p) => {
        const [d, , m, l] = ramp(deep ? "#5a5a6a" : "#8a6440");
        p.rect(1, 7, 12, 9, m);
        p.rect(1, 7, 12, 2, l);
        p.rect(1, 11, 12, 1, d);
        p.rect(6, 10, 2, 3, deep ? "#c8a860" : "#d8b870");
        p.line(13, 15, 13, 0, "#5a4430");
        p.rect(14, 0, 3, 3, deep ? "#8a5ad0" : "#c8443a");
      })
    );
    blit(c, s, x, y);
  }

  // src/renderer/sky.ts
  var gradients = /* @__PURE__ */ new Map();
  function skyStrip(top, bottom, height) {
    const key = top + bottom + height;
    let cv = gradients.get(key);
    if (!cv) {
      cv = makeCanvas(4, height);
      const k = cv.getContext("2d"), bands = 9;
      for (let y = 0; y < height; y++) {
        const t = y / height * (bands - 1), band = Math.floor(t), frac = t - band;
        for (let x = 0; x < 4; x++) {
          const b = frac > bayer(x, y) ? band + 1 : band;
          k.fillStyle = mix(top, bottom, b / (bands - 1));
          k.fillRect(x, y, 1, 1);
        }
      }
      if (gradients.size > 64) gradients.clear();
      gradients.set(key, cv);
    }
    return cv;
  }
  function skyline(kind, x, layer) {
    const n = (s, cell) => vnoise(x, layer * 97, cell, s);
    switch (kind) {
      case "sea":
        return layer < 2 ? 4 + Math.sin(x / 23) * 1 : 10 + n(1, 40) * 22;
      case "peaks": {
        const p = Math.abs(x / (46 + layer * 10) % 2 - 1);
        return 18 + (1 - p) * (44 - layer * 6) * (0.6 + n(2, 90) * 0.6) + n(3, 9) * 3;
      }
      case "dunes":
        return 10 + Math.abs(Math.sin(x / (52 + layer * 8))) * 18 + n(4, 40) * 6;
      case "mesa": {
        const v = n(5, 70);
        return v > 0.55 ? 34 - layer * 4 : v > 0.35 ? 18 : 8 + n(6, 12) * 3;
      }
      case "spires": {
        const s = hash3(Math.floor(x / 14), layer, 7);
        return 10 + n(8, 60) * 18 + (s > 0.75 ? (1 - Math.abs((x % 14 - 7) / 7)) * 60 * s : 0);
      }
      case "islands":
        return 4 + n(9, 30) * 8;
      case "shards":
        return 6 + n(10, 20) * 12;
      default:
        return 12 + n(11, 70) * 24 + n(12, 20) * 6;
    }
  }
  function cloudSprite(v, dark) {
    return cached("cloud" + v + dark, () => {
      const w = 34 + Math.floor(hash3(v, 1) * 30), h = 14;
      return sprite(
        w,
        h,
        0,
        0,
        (p) => {
          const lit = dark ? "#aeb4bc" : "#fbf8ef", mid = dark ? "#8d949c" : "#e3e2dc", low = dark ? "#6f767f" : "#c9ccd0";
          for (let i = 0; i < 5; i++) {
            const cx = 6 + i / 4 * (w - 12), r = 4 + hash3(v, i + 2) * 4;
            p.ellipse(cx, h - 4 - r * 0.6, r + 1, r, mid);
          }
          p.rect(3, h - 5, w - 6, 3, mid);
          for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++)
              if (p.alpha(x, y)) {
                if (!p.alpha(x, y - 2)) p.set(x, y, lit);
                else if (y > h - 5) p.set(x, y, low);
              }
        },
        false
      );
    });
  }
  function sunSprite() {
    return cached(
      "sun",
      () => sprite(
        15,
        15,
        7,
        7,
        (p) => {
          p.ellipse(7.5, 7.5, 7, 7, "#f6d77a");
          p.ellipse(7.5, 7.5, 5.5, 5.5, "#fbe7a4");
          p.ellipse(6, 6, 2.5, 2.5, "#fff6d8");
        },
        false
      )
    );
  }
  function moonSprite() {
    return cached(
      "moon",
      () => sprite(
        12,
        12,
        6,
        6,
        (p) => {
          p.ellipse(6, 6, 5.5, 5.5, "#e6e2cf");
          p.ellipse(8, 5, 4.5, 5, "");
          for (let y = 0; y < 12; y++)
            for (let x = 0; x < 12; x++)
              if (Math.hypot(x + 0.5 - 8.4, y + 0.5 - 5) < 4.6) p.clear(x, y);
          p.set(3, 5, "#bdb8a4");
          p.set(4, 8, "#bdb8a4");
        },
        false
      )
    );
  }
  function silhouetteTree(kind, size, color) {
    return cached("bgtree" + kind + size + color, () => {
      const w = size + 2, h = Math.round(size * 1.6);
      return sprite(
        w,
        h,
        Math.floor(w / 2),
        h - 1,
        (p) => {
          const cx = w / 2;
          if (kind === "pine" || kind === "snowpine")
            p.poly(
              [
                [cx, 0],
                [w - 1, h - 3],
                [1, h - 3]
              ],
              color
            );
          else if (kind === "palm") {
            p.rect(Math.floor(cx), 3, 1, h - 3, color);
            p.ellipse(cx, 3, size / 2, 2, color);
          } else if (kind === "cactus") {
            p.rect(Math.floor(cx) - 1, 2, 3, h - 2, color);
            p.rect(Math.floor(cx) - 4, h / 2, 2, 5, color);
          } else if (kind === "shroom") {
            p.rect(Math.floor(cx) - 1, h / 3, 2, h, color);
            p.ellipse(cx, h / 3, size / 2 + 1, size / 4 + 1, color);
          } else {
            p.rect(Math.floor(cx), h / 2, 1, h / 2, color);
            p.ellipse(cx, h / 2.4, size / 2, size / 2.4, color);
          }
          p.rect(Math.floor(cx), h - 3, 1, 3, color);
        },
        false
      );
    });
  }
  function drawSky(c, g, ax, ay, w, h, fx) {
    const tod = g.timeOfDay(), day = daylight(tod), dusk = clamp2(duskiness(tod)), over = overcastOf(g), night2 = 1 - day, [A, B, k] = blendAt(fx), dim = data_exports.biomeAt(fx, 0).id, alien = dim === "mycelia" || dim === "void";
    const q = (v) => Math.round(v * 24) / 24;
    let top = mix(A.sky[0], B.sky[0], q(k)), bottom = mix(A.sky[1], B.sky[1], q(k));
    if (!alien) {
      top = mix(mix(top, "#8b6d8e", q(dusk) * 0.35), "#0c1228", q(night2) * 0.95);
      bottom = mix(mix(bottom, "#f0a070", q(dusk) * 0.55), "#233354", q(night2) * 0.9);
      top = mix(top, "#7c848a", q(over) * 0.55);
      bottom = mix(bottom, "#a8aca8", q(over) * 0.5);
    }
    const surfY = Math.round(data_exports.surfaceAt(fx) / PX) - ay, horizon = Math.max(40, Math.min(h + 40, surfY + 20));
    c.fillStyle = c.createPattern(skyStrip(top, bottom, horizon), "repeat-x");
    c.fillRect(0, 0, w, horizon);
    c.fillStyle = bottom;
    c.fillRect(0, horizon, w, h - horizon);
    const starLevel = alien ? 1 : night2 * (1 - over);
    if (starLevel > 0.05) {
      const now = performance.now() / 1e3;
      for (let i = 0; i < 140; i++) {
        const sx = Math.floor(((hash3(i, 1) * 4e3 - ax * 0.03) % w + w) % w), sy = Math.floor(hash3(i, 2) * horizon * 0.8);
        const tw = Math.sin(now * (1 + hash3(i, 3) * 3) + i) > 0.3 ? 1 : 0.55;
        c.fillStyle = `rgba(250,245,225,${(starLevel * tw * (0.5 + hash3(i, 4) * 0.5)).toFixed(2)})`;
        c.fillRect(sx, sy, 1, 1);
        if (hash3(i, 5) > 0.93) {
          c.fillRect(sx - 1, sy, 3, 1);
          c.fillRect(sx, sy - 1, 1, 3);
        }
      }
    }
    if (!alien) {
      const arc = (phase) => [
        Math.round(w * (0.1 + phase * 0.8)),
        Math.round(horizon * 0.85 - Math.sin(phase * Math.PI) * horizon * 0.62)
      ];
      if (day > 0.02 && tod > 330 && tod < 1170) {
        const [sx, sy] = arc((tod - 330) / 840);
        c.globalAlpha = 1 - over * 0.7;
        blit(c, sunSprite(), sx, sy);
        c.globalAlpha = 1;
      } else {
        const phase = (tod + 1440 - 1170) % 1440 / 600;
        if (phase < 1) {
          const [mx, my] = arc(phase);
          blit(c, moonSprite(), mx, my);
        }
      }
    }
    const clouds = alien ? 0 : 5 + Math.round(over * 9), t = g.s.elapsed;
    for (let i = 0; i < clouds; i++) {
      const span = w + 140, speed = 1.2 + hash3(i, 6) * 2.4, sx = ((hash3(i, 7) * 3e3 - ax * (0.04 + hash3(i, 8) * 0.04) + t * speed) % span + span) % span - 70, sy = 6 + Math.floor(hash3(i, 9) * horizon * 0.35);
      const cs = cloudSprite(i % 8, over > 0.6);
      c.globalAlpha = night2 > 0.5 ? 0.55 : 1;
      blit(c, cs, sx, sy);
      c.globalAlpha = 1;
    }
    const depth = [0.08, 0.16, 0.26, 0.38], rise = [72, 54, 36, 20], haze = [0.6, 0.42, 0.26, 0.12];
    for (let layer = 0; layer < 4; layer++) {
      const base = surfY - rise[layer] + Math.round((ay - (data_exports.surfaceAt(fx) / PX - h * 0.6)) * depth[layer] * 0.35);
      if (base - 90 > h || base < -140) continue;
      let col = mix(mix(A.hills[layer], B.hills[layer], q(k)), bottom, haze[layer]);
      if (!alien) col = mix(col, "#141c30", q(night2) * (0.75 - layer * 0.07));
      const shift = Math.round(ax * depth[layer]) + layer * 1e3;
      c.fillStyle = col;
      const kindA = A.skyline, kindB = B.skyline;
      const floating = kindA === "islands" || kindA === "shards";
      for (let sx = 0; sx < w; sx++) {
        const wx = sx + shift, hgt = skyline(kindA, wx, layer) * (1 - k) + skyline(kindB, wx, layer) * k, y = Math.round(base - hgt);
        if (floating) {
          const band = vnoise(wx, layer, 26, 40);
          if (band > 0.55) {
            const thick = Math.round((band - 0.55) * 60);
            c.fillRect(sx, y - 30, 1, 3 + Math.round(thick * 0.3));
            c.fillRect(
              sx,
              y - 27 + Math.round(thick * 0.3),
              1,
              Math.max(0, thick - (Math.abs(wx % 26 - 13) > 9 ? 4 : 0))
            );
          }
        } else c.fillRect(sx, y, 1, h - y);
      }
      if (layer >= 1 && !floating) {
        const tree = k < 0.5 ? A.tree : B.tree, treeCol = shade(col, -0.12);
        for (let slot = Math.floor((shift - 20) / 14); slot * 14 - shift < w + 20; slot++) {
          if (vnoise(slot * 14, layer, 90, 44) < 0.4 || hash3(slot, layer, 45) < 0.3) continue;
          const wx = slot * 14 + Math.floor(hash3(slot, layer, 46) * 8), y = Math.round(
            base - (skyline(kindA, wx, layer) * (1 - k) + skyline(kindB, wx, layer) * k)
          ), size = 5 + layer * 2 + Math.floor(hash3(slot, layer, 47) * 4);
          blit(c, silhouetteTree(tree, size, treeCol), wx - shift, y + 1);
        }
      }
    }
  }

  // src/renderer/structures.ts
  var WOOD = "#8a6440";
  var DARKWOOD = "#5e4631";
  var STONE = "#8b8f8a";
  var IRON = "#6f7375";
  function planks(p, x, y, w, h, base = WOOD) {
    const [d, , m, l] = ramp(base);
    p.rect(x, y, w, h, m);
    for (let j = 0; j < h; j += 3) {
      p.rect(x, y + j, w, 1, l);
      if (j + 2 < h) p.rect(x, y + j + 2, w, 1, d);
    }
    for (let i = x + 3; i < x + w; i += 7) p.set(i, y + i % 2, "#3a302a");
  }
  function stones(p, x, y, w, h, base = STONE) {
    const [d, , m, l] = ramp(base);
    p.rect(x, y, w, h, m);
    for (let j = 0; j < h; j += 4) {
      const off = j / 4 % 2 ? 3 : 0;
      p.rect(x, y + j, w, 1, d);
      for (let i = x + off; i < x + w; i += 6) {
        p.rect(i, y + j, 1, 4, d);
        p.set(i + 1, y + j + 1, l);
      }
    }
  }
  function flame(frame2, size) {
    return cached(`flame:${frame2}:${size}`, () => {
      const w = 4 + size * 4, h = 6 + size * 6;
      return sprite(
        w,
        h,
        w / 2,
        h - 1,
        (p) => {
          const cols = ["#c8401e", "#ee7a2c", "#f8b848", "#fff0b0"];
          for (let layer = 0; layer < 4; layer++) {
            const lw = w / 2 * (1 - layer * 0.22), lh = h * (1 - layer * 0.2);
            for (let y = 0; y < lh; y++) {
              const k = y / lh, half = lw * Math.sin(Math.PI * (0.25 + k * 0.75)) * (0.55 + 0.45 * k), sway = Math.round(Math.sin(frame2 * 2.1 + y * 0.6) * (1 - k) * 1.2);
              for (let x = Math.round(w / 2 - half); x < Math.round(w / 2 + half); x++)
                p.set(
                  x + sway,
                  h - 1 - Math.round(lh - 1 - y) - Math.round(layer * 0.6),
                  cols[layer]
                );
            }
          }
        },
        false
      );
    });
  }
  var flameAt = (c, x, y, t, size, seed) => blit(c, flame(Math.floor(t * 9 + seed) % 3, size), x, y);
  function smoke(c, x, y, t, seed, amount = 1) {
    for (let i = 0; i < 4; i++) {
      const life = (t * 0.35 + i / 4 + seed * 0.13) % 1, sx = Math.round(x + Math.sin(life * 5 + i) * 3 + life * 8), sy = Math.round(y - life * 36), r = Math.round(2 + life * 5);
      c.globalAlpha = 0.28 * (1 - life) * amount;
      c.fillStyle = "#c8c6c0";
      c.fillRect(sx - r, sy - r + 1, r * 2, r * 2 - 2);
      c.fillRect(sx - r + 1, sy - r, r * 2 - 2, r * 2);
    }
    c.globalAlpha = 1;
  }
  function bossSpec(g) {
    return data_exports.BOSSES[Math.min(data_exports.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))] ?? data_exports.BOSSES[0];
  }
  var STATIC = {
    campfire_base: () => sprite(28, 9, 14, 8, (p) => {
      for (const [x, y, w] of [
        [3, 1, 20],
        [5, 3, 18],
        [2, 4, 22]
      ]) {
        p.rect(x, y + 1, w, 3, DARKWOOD);
        p.rect(x, y + 1, w, 1, "#7a5a3c");
        p.rect(x + w - 2, y + 1, 2, 3, "#c9a878");
      }
      for (let i = 0; i < 6; i++) p.ellipse(2 + i * 4.8, 7, 2.6, 2, i % 2 ? "#8d8a80" : "#77746c");
    }),
    shelter: () => sprite(64, 46, 20, 45, (p) => {
      p.rect(2, 2, 3, 44, DARKWOOD);
      p.rect(2, 2, 1, 44, "#7a5a3c");
      const roof = [
        [2, 2],
        [8, 0],
        [63, 38],
        [58, 42]
      ];
      p.poly(roof, "#8a6e4e");
      for (let i = 0; i < 9; i++) p.line(6 + i * 6, 3 + i * 4, 3 + i * 6, 6 + i * 4, "#6b5539");
      for (let y = 3; y < 42; y += 5) p.line(4, y, 60, y + 34, "#9e8260");
      p.poly(
        [
          [5, 8],
          [55, 42],
          [5, 42]
        ],
        "#2a221c"
      );
      p.rect(6, 40, 34, 4, "#5a6a44");
      p.rect(6, 40, 34, 1, "#7a8a58");
    }),
    workbench: () => sprite(34, 17, 17, 16, (p) => {
      planks(p, 0, 0, 34, 5);
      p.rect(3, 5, 3, 12, DARKWOOD);
      p.rect(28, 5, 3, 12, DARKWOOD);
      p.rect(3, 11, 28, 2, DARKWOOD);
      p.rect(22, 0, 6, 1, IRON);
      p.rect(7, 0, 2, 1, "#c9a878");
    }),
    apothecary: () => sprite(34, 22, 17, 21, (p) => {
      planks(p, 0, 5, 34, 5, "#7a5f45");
      p.rect(3, 10, 3, 12, DARKWOOD);
      p.rect(28, 10, 3, 12, DARKWOOD);
      for (const [x, c, h] of [
        [4, "#7bc05a", 5],
        [10, "#c85a8a", 4],
        [16, "#5aa0d8", 5],
        [24, "#e8c86a", 3]
      ]) {
        p.rect(x, 5 - h, 4, h, c);
        p.rect(x + 1, 4 - h, 2, 1, "#d8d0c0");
        p.set(x, 5 - h, shade(c, 0.4));
      }
      p.line(0, 13, 33, 13, "#6a5040");
    }),
    furnace: () => sprite(28, 30, 14, 29, (p) => {
      stones(p, 1, 4, 26, 26, "#8a8680");
      p.rect(9, 0, 10, 5, "#6d6a64");
      p.rect(8, 15, 12, 10, "#1c1614");
      p.rect(8, 15, 12, 1, "#4a4440");
    }),
    forge: () => sprite(40, 30, 20, 29, (p) => {
      stones(p, 0, 10, 26, 20, "#6a6660");
      p.rect(4, 17, 16, 8, "#1c1614");
      p.rect(3, 0, 8, 10, "#5a5650");
      p.rect(28, 20, 12, 4, "#4a4e52");
      p.rect(30, 18, 9, 2, "#6a7074");
      p.rect(32, 24, 5, 6, "#3a3e42");
      p.set(38, 18, "#b8bec2");
    }),
    bedroll: () => sprite(34, 7, 17, 6, (p) => {
      p.rect(0, 2, 30, 5, "#6a7a5a");
      p.rect(0, 2, 30, 1, "#8a9a70");
      for (let x = 4; x < 30; x += 6) p.rect(x, 3, 1, 4, "#56664a");
      p.ellipse(30, 3.5, 4, 3.5, "#8a7a5a");
      p.rect(2, 1, 8, 3, "#d8ccb0");
    }),
    farm_plot: () => sprite(34, 6, 17, 5, (p) => {
      p.rect(0, 1, 34, 5, "#4a3a2a");
      for (let x = 0; x < 34; x += 5) p.rect(x, 0, 4, 2, "#5e4a36");
      p.rect(0, 5, 34, 1, "#6b5640");
      p.rect(0, 1, 1, 5, DARKWOOD);
      p.rect(33, 1, 1, 5, DARKWOOD);
    }),
    rain_catcher: () => sprite(24, 26, 12, 25, (p) => {
      p.rect(4, 8, 16, 18, "#6a4e36");
      for (let y = 10; y < 26; y += 5) p.rect(4, y, 16, 1, IRON);
      p.rect(4, 8, 1, 18, "#8a6a4a");
      p.poly(
        [
          [0, 0],
          [23, 0],
          [18, 8],
          [5, 8]
        ],
        "#b8a888"
      );
      p.line(0, 0, 23, 0, "#d8ccb0");
    }),
    platform: () => sprite(36, 10, 18, 2, (p) => {
      planks(p, 0, 0, 36, 4, "#8a6b4a");
      p.line(4, 4, 10, 9, DARKWOOD);
      p.line(31, 4, 25, 9, DARKWOOD);
    }),
    chest: () => sprite(22, 16, 11, 15, (p) => {
      planks(p, 0, 5, 22, 11, "#7a5a3c");
      p.rect(0, 0, 22, 6, "#8b683f");
      p.rect(0, 0, 22, 1, "#a88458");
      p.rect(0, 5, 22, 1, "#3a2a1c");
      for (const x of [2, 18]) p.rect(x, 0, 2, 16, "#a88a3a");
      p.rect(9, 4, 4, 4, "#d8b848");
      p.set(10, 6, "#3a2a1c");
    }),
    icebox: () => sprite(24, 16, 12, 15, (p) => {
      p.rect(0, 5, 24, 11, "#9fb8bd");
      p.rect(0, 0, 24, 6, "#c6dadf");
      p.rect(0, 0, 24, 1, "#eaf6f8");
      p.rect(0, 5, 24, 1, "#6a8a90");
      for (let x = 3; x < 24; x += 5) p.rect(x, 7, 1, 8, "#b8d0d4");
      p.rect(10, 3, 4, 3, IRON);
    }),
    drying_rack: () => sprite(34, 26, 17, 25, (p) => {
      p.line(2, 25, 8, 0, DARKWOOD);
      p.line(32, 25, 26, 0, DARKWOOD);
      p.rect(4, 2, 26, 2, WOOD);
    }),
    spike_trap: () => sprite(32, 12, 16, 11, (p) => {
      p.rect(0, 9, 32, 3, "#6b5237");
      for (let i = 0; i < 6; i++) {
        const x = 3 + i * 5;
        p.poly(
          [
            [x - 2, 9],
            [x, 0],
            [x + 2, 9]
          ],
          "#aab0b2"
        );
        p.line(x, 1, x, 8, "#e0e4e4");
      }
    }),
    lantern_post: () => sprite(14, 38, 2, 37, (p) => {
      p.rect(1, 0, 3, 38, DARKWOOD);
      p.rect(1, 0, 1, 38, "#7a5a3c");
      p.rect(1, 2, 12, 2, DARKWOOD);
      p.rect(10, 4, 1, 3, "#3f3a36");
    }),
    torch: () => sprite(4, 12, 2, 11, (p) => {
      p.rect(1, 3, 2, 9, "#7a5a3c");
      p.rect(0, 1, 4, 3, "#5e4631");
      p.set(1, 3, "#a88458");
    }),
    effergy: () => sprite(40, 62, 20, 61, (p) => {
      stones(p, 0, 56, 40, 6, "#46414d");
      stones(p, 5, 50, 30, 6, "#534d5a");
      p.poly(
        [
          [12, 50],
          [16, 6],
          [24, 6],
          [28, 50]
        ],
        "#3e3946"
      );
      for (let y = 8; y < 50; y += 5) p.rect(15, y, 10, 1, "#2e2a34");
      p.rect(14, 4, 12, 3, "#5a5462");
    }),
    rift_gate: () => sprite(56, 70, 28, 69, (p) => {
      stones(p, 0, 62, 56, 8, "#3a3642");
      p.ellipse(28, 34, 26, 32, "#4a4454");
      for (let y = 0; y < 70; y++)
        for (let x = 0; x < 56; x++) {
          const dx = (x + 0.5 - 28) / 19, dy = (y + 0.5 - 34) / 25;
          if (dx * dx + dy * dy < 1) p.clear(x, y);
        }
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2 - Math.PI / 2, x = Math.round(28 + Math.cos(a) * 22.5), y = Math.round(34 + Math.sin(a) * 28.5);
        p.rect(x - 1, y - 1, 3, 3, "#221e28");
      }
      p.shadeEdges(0.25, -0.3);
    })
  };
  var staticSprite = (k) => cached("st:" + k, STATIC[k]);
  function cropSprite(crop, stage) {
    return cached(
      `crop:${crop}:${stage}`,
      () => sprite(30, 16, 15, 15, (p) => {
        const h = 3 + stage * 4;
        for (let i = 0; i < 5; i++) {
          const x = 3 + i * 6;
          if (crop === "wheat") {
            p.line(x, 15, x, 15 - h, mix("#7ea05a", "#dcb867", stage / 3));
            if (stage >= 2) p.rect(x - 1, 15 - h, 2, 3, stage === 3 ? "#e8c86a" : "#b8b060");
          } else if (crop === "potato") {
            p.ellipse(x, 15 - h / 2, 1 + stage, h / 2, "#79a35e");
            if (stage === 3) p.set(x, 14 - h, "#c8a8e8");
          } else {
            p.line(x, 15, x, 15 - h, "#5d8a4c");
            p.set(x - 1, 14 - h / 2, "#79a35e");
            p.set(x + 1, 13 - h / 2, "#79a35e");
            if (stage === 3) p.rect(x - 1, 14 - h, 2, 2, crop === "berry" ? "#c8324a" : "#e8e0a0");
          }
        }
      })
    );
  }
  function portalSwirl(c, x, y, t, rx, ry, colors) {
    const frame2 = Math.floor(t * 8) % 8;
    const s = cached(
      `swirl:${rx}:${ry}:${colors.join()}:${frame2}`,
      () => sprite(
        rx * 2,
        ry * 2,
        rx,
        ry,
        (p) => {
          for (let y2 = 0; y2 < ry * 2; y2++)
            for (let x2 = 0; x2 < rx * 2; x2++) {
              const dx = (x2 + 0.5 - rx) / rx, dy = (y2 + 0.5 - ry) / ry, r = Math.sqrt(dx * dx + dy * dy);
              if (r > 1) continue;
              const a = Math.atan2(dy, dx), v = Math.sin(a * 3 + r * 9 - frame2 / 8 * Math.PI * 2) * 0.5 + 0.5 + (1 - r) * 0.6;
              p.set(x2, y2, colors[Math.min(colors.length - 1, Math.floor(v * colors.length * 0.7))]);
            }
        },
        false
      )
    );
    blit(c, s, x, y);
  }
  var DIM_COLORS = {
    mycelia: ["#1c3a3a", "#2a6a64", "#58e0d0", "#c0fff4"],
    skyreach: ["#3a5a8a", "#6aa0d8", "#bfe4ff", "#ffffff"],
    void: ["#1a0f2a", "#4a2a7a", "#b36cff", "#ffd8ff"],
    home: ["#2a3a1c", "#5a8a3c", "#d8e88a", "#ffffff"]
  };
  function drawStructure(c, g, s, x, y, t) {
    const k = s.type;
    x = Math.round(x);
    y = Math.round(y);
    switch (k) {
      case "campfire": {
        const lit = s.fuel > 0;
        blit(c, staticSprite("campfire_base"), x, y);
        if (lit) {
          flameAt(c, x, y - 4, t, 3, s.id);
          smoke(c, x + 2, y - 26, t, s.id, 0.8);
          for (let i = 0; i < 4; i++) {
            const life = (t * 0.7 + i * 0.25 + s.id * 0.1) % 1;
            c.fillStyle = life < 0.5 ? "#ffd27a" : "#ff8a3a";
            c.globalAlpha = 1 - life;
            c.fillRect(
              Math.round(x + Math.sin(i * 3 + life * 6) * 5 + life * 3),
              Math.round(y - 12 - life * 28),
              1,
              1
            );
          }
          c.globalAlpha = 1;
        } else smoke(c, x, y - 6, t * 0.6, s.id, 0.4);
        return;
      }
      case "furnace":
      case "forge": {
        blit(c, staticSprite(k), x, y);
        const busy = s.fuel > 0 || k === "forge";
        if (busy) {
          const [fx, fy] = k === "furnace" ? [x, y - 5] : [x - 8, y - 5];
          flameAt(c, fx, fy, t, 1, s.id);
          smoke(c, k === "furnace" ? x : x - 13, y - 32, t, s.id, 0.6);
        }
        return;
      }
      case "farm_plot": {
        blit(c, staticSprite(k), x, y);
        if (s.crop) {
          const grow = clamp2((g.s.elapsed - s.plantedAt) / 240), stage = grow >= 1 ? 3 : Math.floor(grow * 3);
          blit(c, cropSprite(s.crop, stage), x, y - 5);
        }
        return;
      }
      case "rain_catcher": {
        blit(c, staticSprite(k), x, y);
        const level = clamp2(s.water / 8);
        if (level > 0) {
          c.fillStyle = "#5a9cbc";
          c.fillRect(x - 7, y - 17 - Math.round(level * 0), 14, 1);
          c.fillStyle = "#8ac6dc";
          c.fillRect(x - 6, y - 18, Math.round(12 * level), 1);
        }
        return;
      }
      case "lantern":
      case "crystal_lantern": {
        const crystal2 = k === "crystal_lantern", lit = crystal2 || s.fuel > 0;
        blit(c, staticSprite("lantern_post"), x, y);
        const lx = x + 9, ly = y - 30;
        c.fillStyle = "#3f3a36";
        c.fillRect(lx - 3, ly, 7, 1);
        c.fillRect(lx - 3, ly + 8, 7, 1);
        c.fillStyle = lit ? crystal2 ? "#aef0ec" : "#ffd88a" : "#6d6a5e";
        c.fillRect(lx - 2, ly + 1, 5, 7);
        c.fillStyle = lit ? crystal2 ? "#e6fffb" : "#fff4c8" : "#8a8678";
        c.fillRect(lx, ly + 2 + Math.floor(t * 8) % 2, 1, 4);
        return;
      }
      case "torch": {
        blit(c, staticSprite("torch"), x, y);
        flameAt(c, x, y - 10, t, 1, s.id);
        return;
      }
      case "drying_rack": {
        blit(c, staticSprite(k), x, y);
        const items = Object.keys(s.store ?? {}).length || 2;
        for (let i = 0; i < Math.min(4, items); i++) {
          const sx = x - 10 + i * 6, len = 8 + Math.round(hash3(i, s.id) * 5);
          c.fillStyle = i % 2 ? "#a0503a" : "#6a8a44";
          c.fillRect(sx, y - 22, 3, len);
          c.fillStyle = "#3a2a1c";
          c.fillRect(sx + 1, y - 23, 1, 1);
        }
        return;
      }
      case "spike_trap": {
        const hit = g.s.elapsed - s.triggeredAt < 0.6;
        blit(c, staticSprite(k), x + (hit ? Math.round(Math.sin(t * 60)) : 0), y);
        if (hit) {
          c.fillStyle = "#8e3b30";
          for (let i = 0; i < 6; i++) c.fillRect(x - 13 + i * 5, y - 10, 1, 2);
        }
        return;
      }
      case "effergy": {
        const spec = bossSpec(g), pulse2 = 0.5 + 0.5 * Math.sin(t * 2.4);
        blit(c, staticSprite(k), x, y);
        const orb = cached(
          `orb:${spec.glow}:${Math.round(pulse2 * 3)}`,
          () => sprite(12, 12, 6, 6, (p) => {
            p.ellipse(6, 6, 5.5, 5.5, shade(spec.glow, -0.3));
            p.ellipse(5, 5, 3.5, 3.5, spec.glow);
            p.rect(4, 3, 2, 2, mix(spec.glow, "#ffffff", 0.6 + pulse2 * 0.2));
          })
        );
        blit(c, orb, x, y - 66 - Math.round(Math.sin(t * 1.6) * 2));
        return;
      }
      case "rift_gate":
      case "portal": {
        const dest = s.store && Object.keys(s.store)[0] || "void";
        const colors = DIM_COLORS[dest] ?? DIM_COLORS.void;
        if (k === "rift_gate") {
          const open = (s.fuel ?? 0) > 0;
          if (open) portalSwirl(c, x, y - 35, t, 18, 24, colors);
          blit(c, staticSprite("rift_gate"), x, y);
          const sigils = Object.keys(s.store ?? {}).filter((n) => n.startsWith("sigil_")).length;
          for (let i = 0; i < 8; i++) {
            const a = i / 8 * Math.PI * 2 - Math.PI / 2, sx = Math.round(x + Math.cos(a) * 22.5), sy = Math.round(y - 35 + Math.sin(a) * 28.5);
            c.fillStyle = i < sigils * 2 || open ? colors[2] : "#221e28";
            c.fillRect(sx, sy, 1, 1);
          }
        } else {
          portalSwirl(c, x, y - 26, t, 13, 22, colors);
          const frame2 = cached(
            "portalframe",
            () => sprite(34, 52, 17, 51, (p) => {
              stones(p, 0, 46, 34, 6, "#2e2a36");
              p.rect(0, 0, 5, 46, "#3e3946");
              p.rect(29, 0, 5, 46, "#3e3946");
              p.rect(0, 0, 34, 4, "#4a4454");
              p.shadeEdges();
            })
          );
          blit(c, frame2, x, y);
        }
        return;
      }
      default: {
        if (k in STATIC) blit(c, staticSprite(k), x, y);
        else {
          c.fillStyle = "#7a5a3c";
          c.fillRect(x - 6, y - 12, 12, 12);
        }
      }
    }
  }

  // src/renderer/tiles.ts
  var T2 = data_exports.TILE;
  var CH = 16;
  var CPX = CH * TA;
  var MAX_CHUNKS = 90;
  var PERIOD = 8;
  var SPAN = PERIOD * TA;
  var wrap = (v, n) => (v % n + n) % n;
  function pnoise(x, y, cell, s = 0) {
    const n = SPAN / cell, fx = x / cell, fy = y / cell, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, u = tx * tx * (3 - 2 * tx), v = ty * ty * (3 - 2 * ty);
    const h = (i, j) => hash3(wrap(i, n), wrap(j, n), s);
    return (h(ix, iy) * (1 - u) + h(ix + 1, iy) * u) * (1 - v) + (h(ix, iy + 1) * (1 - u) + h(ix + 1, iy + 1) * u) * v;
  }
  function voronoi(x, y, cell, s = 0) {
    const n = SPAN / cell, cx = Math.floor(x / cell), cy = Math.floor(y / cell);
    let d1 = 1e9, d2 = 1e9, id = 0;
    for (let j = -1; j <= 1; j++)
      for (let i = -1; i <= 1; i++) {
        const gx = wrap(cx + i, n), gy = wrap(cy + j, n), px = (cx + i + 0.15 + hash3(gx, gy, s) * 0.7) * cell, py = (cy + j + 0.15 + hash3(gx, gy, s + 1) * 0.7) * cell, d = Math.hypot(x + 0.5 - px, (y + 0.5 - py) * 1.25);
        if (d < d1) {
          d2 = d1;
          d1 = d;
          id = hash3(gx, gy, s + 2);
        } else if (d < d2) d2 = d;
      }
    return [d1, d2, id];
  }
  function rocky(x, y, cell, s) {
    const [d1, d2, id] = voronoi(x, y, cell, s);
    if (d2 - d1 < 1.1) return 0;
    const [e1, e2] = voronoi(x - 1, y - 1, cell, s);
    if (e2 - e1 < 1.1) return 3;
    const [f1, f2] = voronoi(x + 1, y + 1, cell, s);
    if (f2 - f1 < 1.1) return 1;
    return id < 0.25 ? 1 : id > 0.85 ? 3 : 2;
  }
  function patternPixel(p, s, x, y) {
    const n = pnoise(x, y, 8, 3), h = hash3(x, y, 11);
    const pebble = () => {
      const cx = Math.floor(x / 8), cy = Math.floor(y / 8), k = hash3(wrap(cx, SPAN / 8), wrap(cy, SPAN / 8), 41);
      if (k > 0.4) return -1;
      const px = cx * 8 + 1 + Math.floor(k * 12) % 5, py = cy * 8 + 1 + Math.floor(k * 37) % 5, dx = x - px, dy = y - py;
      if (dy === 0 && dx >= 0 && dx < 3) return 3;
      if (dy === 1 && dx >= 0 && dx < 3) return dx === 0 ? 3 : 2;
      if (dy === 2 && dx >= 0 && dx < 3) return 1;
      return -1;
    };
    switch (p) {
      case "soil": {
        const pb = pebble();
        if (pb >= 0) return pb;
        if (h > 0.985) return 0;
        if (h < 0.015) return 3;
        return n > 0.66 ? 1 : 2;
      }
      case "mud": {
        const pb = pebble();
        if (pb >= 0 && pb !== 3) return pb;
        if (h < 0.02) return 3;
        return n > 0.62 ? 1 : n < 0.25 ? 3 : 2;
      }
      case "stone":
        if (h < 0.012) return 4;
        return rocky(x, y, 8, 5);
      case "sand": {
        const ripple = Math.floor(y + pnoise(x, 0, 16, 9) * 4);
        if (ripple % 6 === 0 && h < 0.6) return 2;
        if (h < 0.05) return 4;
        if (h > 0.965) return 1;
        return 3;
      }
      case "ice": {
        if (wrap(x + y, 16) === 0 || wrap(x + y + 1, 16) === 0) return 4;
        if (h < 0.03) return 4;
        return n > 0.6 ? 2 : 3;
      }
      case "strata": {
        const band = Math.floor((y + pnoise(x, 0, 16, 4) * 5) / 5) & 3;
        if (h < 0.02) return s.accent ?? 4;
        return [1, 2, 3, 2][band];
      }
      case "slate": {
        const row = Math.floor(y / 4), off = Math.floor(hash3(wrap(row, SPAN / 4), 0, 2) * 16), seam = y % 4 === 3 || wrap(x + off, 16) === 0;
        if (seam) return 0;
        if (y % 4 === 0) return 3;
        if (h < 0.018) return s.accent ?? 4;
        return n > 0.55 ? 1 : 2;
      }
      case "ash": {
        if (h < 0.02) return s.accent ?? 4;
        return rocky(x, y, 16, 17);
      }
      case "hell": {
        const [d1, d2, id] = voronoi(x, y, 16, 21);
        if (d2 - d1 < 1.2) return id < 0.4 ? s.accent ?? 4 : 0;
        if (d2 - d1 < 2.2 && id < 0.4) return shade(s.accent ?? "#ff6a2a", -0.4);
        return rocky(x, y, 8, 23) === 0 ? 1 : n > 0.6 ? 1 : 2;
      }
      case "brick":
      case "bigbrick": {
        const bh = p === "brick" ? 4 : 8, bw = p === "brick" ? 8 : 16, row = Math.floor(y / bh), bx = x + row % 2 * (bw / 2);
        if (y % bh === bh - 1 || bx % bw === bw - 1) return 0;
        if (y % bh === 0 || bx % bw === 0) return 3;
        const brick = hash3(wrap(Math.floor(bx / bw), SPAN / bw), wrap(row, SPAN / bh), 5);
        if (p === "bigbrick" && s.accent && hash3(x, y, 8) < 0.05 * brick) return s.accent;
        if (p === "bigbrick" && brick > 0.8 && h < 0.2) return 1;
        return brick < 0.3 ? 1 : 2;
      }
      case "planks": {
        const row = Math.floor(y / 4), end = wrap(x + Math.floor(hash3(wrap(row, SPAN / 4), 0, 6) * 16), 16) === 0;
        if (y % 4 === 3 || end) return 0;
        if (y % 4 === 0) return 3;
        return hash3(Math.floor(x / 3), y, 4) < 0.2 ? 1 : 2;
      }
      case "glass":
        return wrap(x - y, 9) === 0 ? 4 : 3;
      case "cloud":
        return n > 0.62 ? 3 : n < 0.3 ? 4 : 3;
      case "crystal": {
        const [d1, d2, id] = voronoi(x, y, 8, 12);
        if (d2 - d1 < 1) return 4;
        return [1, 2, 3][Math.floor(id * 3)];
      }
      case "fungal": {
        if (h < 0.03) return s.accent ?? 4;
        return rocky(x, y, 16, 29);
      }
      case "void": {
        if (h < 0.02) return s.accent ?? 4;
        const swirl = Math.abs(pnoise(x, y, 16, 31) - 0.5);
        return swirl < 0.04 ? 3 : n > 0.55 ? 1 : 2;
      }
      case "obsidian": {
        if (wrap(x * 3 + y * 5, 23) === 0) return s.accent ?? 4;
        return rocky(x, y, 16, 37) === 0 ? 0 : n > 0.5 ? 1 : 2;
      }
    }
    return 2;
  }
  var baseCache = /* @__PURE__ */ new Map();
  var texRamp = (base) => [shade(base, -0.42), shade(base, -0.15), base, shade(base, 0.13), shade(base, 0.3)].map(rgb);
  function baseTexture(kind, tx, ty) {
    const px = wrap(tx, PERIOD), py = wrap(ty, PERIOD), key = kind + ":" + px + ":" + py;
    let tex = baseCache.get(key);
    if (!tex) {
      const s = groundOf(kind), r = texRamp(s.base);
      tex = new Uint8ClampedArray(TA * TA * 4);
      for (let y = 0; y < TA; y++)
        for (let x = 0; x < TA; x++) {
          const v = patternPixel(s.pattern, s, x + px * TA, y + py * TA), [cr, cg, cb] = typeof v === "number" ? r[v] : rgb(v), i = (y * TA + x) * 4;
          tex[i] = cr;
          tex[i + 1] = cg;
          tex[i + 2] = cb;
          tex[i + 3] = s.pattern === "glass" ? 140 : 255;
        }
      baseCache.set(key, tex);
    }
    return tex;
  }
  var Canvas = class {
    data;
    w;
    constructor(w, h) {
      this.w = w;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
    set(x, y, c, a = 255) {
      if (x < 0 || y < 0 || x >= this.w) return;
      const i = (y * this.w + x) * 4;
      if (i >= this.data.length) return;
      this.data[i] = c[0];
      this.data[i + 1] = c[1];
      this.data[i + 2] = c[2];
      this.data[i + 3] = a;
    }
    clear(x, y) {
      const i = (y * this.w + x) * 4;
      if (i >= 0 && i < this.data.length) this.data[i + 3] = 0;
    }
    darken(x, y, k) {
      const i = (y * this.w + x) * 4;
      if (i < 0 || i >= this.data.length || !this.data[i + 3]) return;
      this.data[i] *= k;
      this.data[i + 1] *= k;
      this.data[i + 2] *= k;
    }
  };
  function wallKind(tx, ty) {
    const x = tx * T2 + T2 / 2, y = ty * T2 + T2 / 2, depth = y - data_exports.surfaceAt(x), biome = data_exports.biomeAt(x, y).id;
    if (depth < 76)
      return biome === "desert" ? 3 : biome === "marsh" || biome === "coast" ? 4 : biome === "tundra" ? 5 : biome === "badlands" ? 6 : 1;
    if (y >= data_exports.LAYERS[4].top) return 10;
    if (y >= data_exports.LAYERS[3].top) return 9;
    if (y >= data_exports.LAYERS[2].top) return 8;
    return 2;
  }
  var isBack = (g, tx, ty) => !g.tileAt(tx, ty) && (ty + 0.5) * T2 > data_exports.surfaceAt((tx + 0.5) * T2);
  function paintWall(c, g, tx, ty, ox, oy) {
    const kind = wallKind(tx, ty), tex = baseTexture(kind, tx + 3, ty + 5), [wr, wg, wb] = rgb(groundOf(kind).wall ?? "#2c3036");
    for (let y = 0; y < TA; y++) {
      const row = y * TA * 4, dst = ((oy + y) * c.w + ox) * 4;
      for (let x = 0; x < TA; x++) {
        const i = row + x * 4, o = dst + x * 4;
        c.data[o] = tex[i] * 0.2 + wr * 0.3;
        c.data[o + 1] = tex[i + 1] * 0.2 + wg * 0.3;
        c.data[o + 2] = tex[i + 2] * 0.2 + wb * 0.36;
        c.data[o + 3] = 255;
      }
    }
    const solid = (dx, dy) => !!g.tileAt(tx + dx, ty + dy);
    for (let y = 0; y < TA; y++)
      for (let x = 0; x < TA; x++) {
        let d = 9;
        if (solid(0, -1)) d = Math.min(d, y);
        if (solid(0, 1)) d = Math.min(d, TA - 1 - y);
        if (solid(-1, 0)) d = Math.min(d, x);
        if (solid(1, 0)) d = Math.min(d, TA - 1 - x);
        if (d < 4) c.darken(ox + x, oy + y, 0.55 + d * 0.11);
      }
  }
  function capOf(g, s, tx, ty) {
    if (!s.cap) return null;
    const x = tx * T2 + T2 / 2;
    if (ty * T2 > data_exports.surfaceAt(x) + 40 && s.cap !== "mycel" && s.cap !== "cloud") return null;
    if (s.cap === "region") {
      const art2 = ART[data_exports.biomeAt(x, ty * T2).id] ?? ART.meadow;
      return art2.cap === "none" ? null : art2.cap;
    }
    return s.cap;
  }
  function capColors(g, cap, tx, ty) {
    const art2 = ART[data_exports.biomeAt(tx * T2, ty * T2).id] ?? ART.meadow;
    if (cap === "snow") return ["#8aa6bf", "#dfeaf2", "#f8fbfd", "#ffffff"].map(rgb);
    if (cap === "dust") return ["#7a4a36", "#a06a4f", "#c08868", "#d8a888"].map(rgb);
    if (cap === "mycel") return ["#1f5e5a", "#3aa39a", "#58c8b8", "#9ef0e0"].map(rgb);
    if (cap === "cloud") return ["#b8c4d8", "#e8eef8", "#ffffff", "#ffffff"].map(rgb);
    if (cap === "moss") return ["#3a2060", "#6a3fa8", "#8a5ad0", "#b88af0"].map(rgb);
    return [shade(art2.grass[0], -0.45), art2.grass[0], art2.grass[1], art2.grass[2]].map(rgb);
  }
  function paintSolid(c, g, tx, ty, kind, ox, oy) {
    const s = groundOf(kind), tex = baseTexture(kind, tx, ty);
    for (let y = 0; y < TA; y++) {
      const src = y * TA * 4, dst = ((oy + y) * c.w + ox) * 4;
      c.data.set(tex.subarray(src, src + TA * 4), dst);
    }
    const open = (dx, dy) => !g.tileAt(tx + dx, ty + dy), up = open(0, -1), dn = open(0, 1), lf = open(-1, 0), rt = open(1, 0);
    const r = ramp(s.base).map(rgb), edge = rgb(shade(s.base, -0.78));
    for (let i = 0; i < TA; i++) {
      if (up) {
        c.set(ox + i, oy, edge);
        c.set(ox + i, oy + 1, r[4]);
      }
      if (dn) {
        c.set(ox + i, oy + TA - 1, edge);
        c.set(ox + i, oy + TA - 2, r[0]);
      }
      if (lf) {
        c.set(ox, oy + i, edge);
        if (i > 1) c.set(ox + 1, oy + i, r[3]);
      }
      if (rt) {
        c.set(ox + TA - 1, oy + i, edge);
        if (i > 1) c.set(ox + TA - 2, oy + i, r[1]);
      }
    }
    const corner = (cx, cy, sx, sy) => {
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [0, 1]
      ])
        c.clear(ox + cx + dx * sx, oy + cy + dy * sy);
      for (const [dx, dy] of [
        [2, 0],
        [1, 1],
        [0, 2]
      ])
        c.set(ox + cx + dx * sx, oy + cy + dy * sy, edge);
    };
    if (up && lf) corner(0, 0, 1, 1);
    if (up && rt) corner(TA - 1, 0, -1, 1);
    if (dn && lf) corner(0, TA - 1, 1, -1);
    if (dn && rt) corner(TA - 1, TA - 1, -1, -1);
    const cap = up ? capOf(g, s, tx, ty) : null;
    if (cap) {
      const col = capColors(g, cap, tx, ty);
      for (let x = 0; x < TA; x++) {
        if (lf && x < 2 || rt && x > TA - 3) continue;
        const ax = tx * TA + x, depth = 4 + (hash3(ax, 0, 7) > 0.5 ? 1 : 0) + (hash3(ax, 0, 8) > 0.8 ? 1 : 0);
        c.set(ox + x, oy, col[0]);
        c.set(ox + x, oy + 1, col[3]);
        for (let y = 2; y < depth; y++) c.set(ox + x, oy + y, y === 2 ? col[2] : col[1]);
        if (bayer(ax, depth) < 0.5) c.set(ox + x, oy + depth, col[1]);
      }
      for (let y = 0; y < 4; y++) {
        if (lf) c.set(ox, oy + y, col[0]);
        if (rt) c.set(ox + TA - 1, oy + y, col[0]);
      }
    }
  }
  function paintTufts(c, g, tx, ty, ox, oy) {
    const below = g.tileAt(tx, ty + 1);
    if (!below) return;
    const s = GROUND[below];
    if (!s) return;
    const cap = capOf(g, s, tx, ty + 1);
    if (!cap || cap === "dust") return;
    const col = capColors(g, cap, tx, ty + 1), art2 = ART[data_exports.biomeAt(tx * T2, ty * T2).id] ?? ART.meadow;
    for (let x = 0; x < TA; x++) {
      const ax = tx * TA + x, h = hash3(ax, 3, 13);
      if (cap === "snow" || cap === "cloud") {
        if (h < 0.3) c.set(ox + x, oy + TA - 1, col[2]);
        continue;
      }
      if (h > 0.55) continue;
      const height = 1 + Math.floor(hash3(ax, 5, 17) * (cap === "mycel" ? 4 : 3));
      for (let y = 0; y < height; y++)
        c.set(ox + x, oy + TA - 1 - y, y === height - 1 ? col[3] : col[2]);
      if (art2.flowers.length && hash3(ax, 9, 19) < 0.05) {
        const f = rgb(art2.flowers[Math.floor(hash3(ax, 2, 23) * art2.flowers.length)]);
        c.set(ox + x, oy + TA - 1 - height, f);
        c.set(ox + x - 1, oy + TA - 1 - height, f);
        c.set(ox + x + 1, oy + TA - 1 - height, f);
        c.set(ox + x, oy + TA - 2 - height, f);
      }
    }
  }
  var chunks = /* @__PURE__ */ new Map();
  var chunkTiles = null;
  function chunkSig(g, cx, cy) {
    let s = 17;
    for (let ty = cy * CH - 1; ty <= cy * CH + CH; ty++)
      for (let tx = cx * CH - 1; tx <= cx * CH + CH; tx++)
        s = Math.imul(s, 31) + g.tileAt(tx, ty) + 1 | 0;
    return s;
  }
  function renderChunk(g, cx, cy) {
    const back = new Canvas(CPX, CPX), front = new Canvas(CPX, CPX);
    let anyBack = false, anyFront = false;
    for (let j = 0; j < CH; j++)
      for (let i = 0; i < CH; i++) {
        const tx = cx * CH + i, ty = cy * CH + j, kind = g.tileAt(tx, ty);
        if (kind) {
          paintSolid(front, g, tx, ty, kind, i * TA, j * TA);
          anyFront = true;
        } else {
          if (isBack(g, tx, ty)) {
            paintWall(back, g, tx, ty, i * TA, j * TA);
            anyBack = true;
          }
          const before = anyFront;
          paintTufts(front, g, tx, ty, i * TA, j * TA);
          anyFront = before || !!g.tileAt(tx, ty + 1);
        }
      }
    const toCanvas = (c) => {
      const cv = makeCanvas(CPX, CPX);
      cv.getContext("2d").putImageData(
        new ImageData(c.data, CPX, CPX),
        0,
        0
      );
      return cv;
    };
    return {
      back: anyBack ? toCanvas(back) : null,
      front: anyFront ? toCanvas(front) : null,
      sig: chunkSig(g, cx, cy)
    };
  }
  function drawWalls(c, g, ax, ay, w, h) {
    if (chunkTiles !== g.s.tiles) {
      chunks.clear();
      chunkTiles = g.s.tiles;
    }
    const visible = [];
    const cx0 = Math.floor(ax / CPX), cx1 = Math.floor((ax + w) / CPX), cy0 = Math.max(0, Math.floor(ay / CPX)), cy1 = Math.floor((ay + h) / CPX);
    let built = 0;
    for (let cy = cy0; cy <= cy1; cy++)
      for (let cx = cx0; cx <= cx1; cx++) {
        if (cx < 0 || cx * CH >= data_exports.TILE_COLS || cy * CH >= data_exports.TILE_ROWS) continue;
        const key = cx + ":" + cy;
        let ch = chunks.get(key);
        if (!ch || ch.sig !== chunkSig(g, cx, cy) && built < 3) {
          ch = renderChunk(g, cx, cy);
          built++;
        }
        chunks.delete(key);
        chunks.set(key, ch);
        visible.push([ch, cx, cy]);
      }
    while (chunks.size > MAX_CHUNKS) chunks.delete(chunks.keys().next().value);
    for (const [ch, cx, cy] of visible)
      if (ch.back) c.drawImage(ch.back, cx * CPX - ax, cy * CPX - ay);
    return visible;
  }
  function drawGround(c, visible, ax, ay) {
    for (const [ch, cx, cy] of visible)
      if (ch.front) c.drawImage(ch.front, cx * CPX - ax, cy * CPX - ay);
  }
  function drawLava(c, g, ax, ay, w, h, now) {
    if ((ay + h) * 2 < 3300) return;
    const tx0 = Math.floor(ax / TA), tx1 = Math.ceil((ax + w) / TA), ty0 = Math.max(0, Math.floor(ay / TA)), ty1 = Math.min(data_exports.TILE_ROWS - 1, Math.ceil((ay + h) / TA));
    const lava = (tx, ty) => !g.tileAt(tx, ty) && data_exports.lavaAt(tx * T2 + T2 / 2, ty * T2 + T2 / 2);
    for (let tx = tx0; tx <= tx1; tx++)
      for (let ty = ty0; ty <= ty1; ty++) {
        if (!lava(tx, ty)) continue;
        const x = tx * TA - ax, y = ty * TA - ay, top = !lava(tx, ty - 1);
        c.fillStyle = top ? "#f07a22" : "#d4521a";
        c.fillRect(x, y, TA, TA);
        c.fillStyle = "#b8380f";
        c.fillRect(x, y + (top ? 10 : 8), TA, TA - (top ? 10 : 8));
        for (let k = 0; k < 3; k++) {
          const bx = (Math.floor(hash3(tx, ty, k) * 16) + Math.floor(now * (3 + k))) % TA, by = 4 + Math.floor(hash3(ty, tx, k + 3) * 10);
          c.fillStyle = k ? "#ffb347" : "#ffe08a";
          c.fillRect(x + bx, y + by, 2, 1);
        }
        if (top) {
          for (let i = 0; i < TA; i++) {
            const wave = Math.round(Math.sin(now * 2.6 + (tx * TA + i) * 0.45) * 1.2);
            c.fillStyle = "#ffe08a";
            c.fillRect(x + i, y + 1 + wave, 1, 2);
            c.fillStyle = "#ffb347";
            c.fillRect(x + i, y + 3 + wave, 1, 1);
          }
        }
      }
  }

  // src/renderer/Renderer.ts
  var art = null;
  function drawLadders(c, ax, ay, w, h) {
    for (const shaft of data_exports.SHAFTS) {
      const sx = Math.round(shaft.x / PX - ax);
      if (sx < -30 || sx > w + 30) continue;
      const surface = shaft.top < data_exports.surfaceAt(shaft.x) + 20, y1 = Math.round((surface ? data_exports.surfaceAt(shaft.x) - 24 : shaft.top) / PX - ay), y2 = Math.round((shaft.bottom + 40) / PX - ay);
      if (y2 < -20 || y1 > h + 20) continue;
      const deep = shaft.top > data_exports.LAYERS[3].top, [dk, d, m, l] = ramp(deep ? "#5a4444" : "#7a5d42");
      const top = Math.max(y1, -4), bottom = Math.min(y2, h + 4);
      for (const rx of [-11, 10]) {
        c.fillStyle = dk;
        c.fillRect(sx + rx - 1, top, 4, bottom - top);
        c.fillStyle = m;
        c.fillRect(sx + rx, top, 2, bottom - top);
        c.fillStyle = l;
        c.fillRect(sx + rx, top, 1, bottom - top);
      }
      for (let y = y1 + 7 + Math.max(0, Math.floor((top - y1 - 7) / 10)) * 10; y < bottom; y += 10) {
        c.fillStyle = dk;
        c.fillRect(sx - 10, y - 1, 21, 3);
        c.fillStyle = d;
        c.fillRect(sx - 10, y, 21, 1);
      }
      if (!surface) continue;
      const frame2 = cached(
        "shaftframe",
        () => sprite(38, 34, 19, 20, (p) => {
          p.line(3, 33, 5, 3, "#6b4f37");
          p.line(4, 33, 6, 3, "#6b4f37");
          p.line(34, 33, 32, 3, "#6b4f37");
          p.line(35, 33, 33, 3, "#6b4f37");
          p.rect(0, 2, 38, 3, "#7a5d42");
          p.rect(0, 2, 38, 1, "#9a7a58");
          for (const x of [5, 32]) {
            p.line(x - 2, 1, x + 2, 5, "#d2bb88");
            p.line(x - 2, 5, x + 2, 1, "#d2bb88");
          }
          p.line(23, 5, 23, 13, "#cdb383");
          p.rect(22, 13, 3, 3, "#cdb383");
        })
      );
      c.drawImage(frame2.cv, sx - frame2.ox, y1 + 13 - frame2.oy);
    }
  }
  function draw(c, g, cam, view2, menu2 = false) {
    const w = view2.artW, h = view2.artH;
    if (!art || art.width !== w || art.height !== h) art = makeCanvas(w, h);
    const a = art.getContext("2d");
    a.imageSmoothingEnabled = false;
    const t = g.s.elapsed, now = performance.now() / 1e3, ax = Math.round(cam.x / PX), ay = Math.round(cam.y / PX), fx = menu2 ? cam.x + view2.worldW / 2 : g.s.player.x;
    drawSky(a, g, ax, ay, w, h, fx);
    const visibleChunks = drawWalls(a, g, ax, ay, w, h);
    drawLava(a, g, ax, ay, w, h, now);
    drawLadders(a, ax, ay, w, h);
    drawGround(a, visibleChunks, ax, ay);
    const on = (o, pad2 = 80) => {
      const x = o.x / PX - ax, y = o.y / PX - ay;
      return x > -pad2 && x < w + pad2 && y > -20 && y < h + 110;
    };
    const sx = (o) => o.x / PX - ax, sy = (o) => o.y / PX - ay;
    for (const s of g.s.structures)
      if (s.type === "rift_gate" || s.type === "portal") {
        if (on(s)) drawStructure(a, g, s, sx(s), sy(s), t);
      }
    for (const n of g.s.nodes) if (TREE_KINDS.has(n.kind) && on(n)) drawTree(a, n, sx(n), sy(n), t);
    for (const n of g.s.nodes)
      if (!TREE_KINDS.has(n.kind) && on(n) && (n.hp > 0 || n.kind !== "water"))
        drawNode(a, n, sx(n), sy(n), t);
    for (const cache of g.s.caches)
      if (!cache.opened && on(cache)) drawCache(a, cache, sx(cache), sy(cache));
    for (const s of g.s.structures)
      if (s.type !== "rift_gate" && s.type !== "portal" && on(s))
        drawStructure(a, g, s, sx(s), sy(s), t);
    for (const m of g.s.animals) if (!m.deadUntil && on(m)) drawAnimal(a, g, m, sx(m), sy(m), t);
    drawDrops(a, g, ax, ay, w, h, t);
    if (!menu2) drawPlayer(a, g, g.s.player, sx(g.s.player), sy(g.s.player), t);
    drawParticles(a, ax, ay, now);
    drawLighting(a, g, ax, ay, w, h, gatherLights(g, t, menu2));
    drawWeather(a, g, ax, ay, w, h, fx, menu2);
    c.imageSmoothingEnabled = false;
    c.drawImage(art, 0, 0, w * view2.scale, h * view2.scale);
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
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) {
      const x = i / (curve.length - 1) * 2 - 1;
      curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
    }
    return curve;
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
      let smooth = 0;
      for (let i = 0; i < len; i++) {
        seed = seed * 16807 % 2147483647;
        const x = i / len, white = seed / 2147483647 * 2 - 1, k = 0.85 - 0.75 * x;
        smooth = smooth + k * (white - smooth);
        data[i] = smooth * Math.exp(-x * 5.5) * (i < rate * 0.012 ? i / (rate * 0.012) : 1);
      }
    }
    return ir;
  }
  function softClip() {
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) {
      const x = i / (curve.length - 1) * 2 - 1, a = Math.abs(x), y = a < 0.75 ? a : 0.75 + 0.24 * Math.tanh((a - 0.75) / 0.24);
      curve[i] = Math.sign(x) * y;
    }
    return curve;
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
        const hp = biquad(k, "bandpass", 3800, 0.4), body = biquad(k, "lowpass", 900, 0.5), mix2 = ctx2.createGain();
        n.connect(hp).connect(mix2);
        const g2 = ctx2.createGain();
        g2.gain.value = 0.6;
        n.connect(body).connect(g2).connect(mix2);
        return mix2;
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
        const line = this.input.value.trim();
        this.input.value = "";
        if (!line) return;
        this.history.push(line);
        this.cursor = this.history.length;
        this.print(["\u203A " + line], "cmd");
        if (line === "clear") this.log.replaceChildren();
        else this.print(this.game.command(line), "ok");
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
    hudRefreshMs: 170,
    autoSaveSeconds: 40,
    maxFrameSeconds: 0.1,
    menuFocalX: BIOME_CENTERS.meadow[0]
  };
  var pretty = (id) => ITEMS[id]?.[0] || id;
  var pixelArt = /* @__PURE__ */ new Map();
  function pixelate(root) {
    for (const svg of root.querySelectorAll("svg")) {
      const source = svg.outerHTML, done = pixelArt.get(source), img = document.createElement("img");
      img.className = (svg.getAttribute("class") ?? "") + " pixelated";
      img.alt = "";
      svg.replaceWith(img);
      if (done) {
        img.src = done;
        continue;
      }
      const vb = (svg.getAttribute("viewBox") ?? "0 0 600 310").split(" ").map(Number), w = Math.round(vb[2] / 2), h = Math.round(vb[3] / 2), raw = new Image();
      raw.onload = () => {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const k = cv.getContext("2d");
        k.drawImage(raw, 0, 0, w, h);
        const data = k.getImageData(0, 0, w, h), d = data.data;
        for (let i = 0; i < d.length; i += 4) {
          for (let c = 0; c < 3; c++) d[i + c] = Math.round(d[i + c] / 24) * 24;
          d[i + 3] = d[i + 3] > 60 ? 255 : 0;
        }
        k.putImageData(data, 0, 0);
        const url = cv.toDataURL();
        pixelArt.set(source, url);
        img.src = url;
      };
      raw.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    }
  }
  var icon = (id) => `<span class="icon-slot"><img src="${iconURL(id)}" alt=""></span>`;
  var clamp3 = (v, a, b) => Math.max(a, Math.min(b, v));
  var fmt = (n) => String(Math.floor(n)).padStart(2, "0");
  var timeText = () => {
    const t = game.timeOfDay();
    return `DAY ${game.s.day} \xB7 ${fmt(t / 60)}:${fmt(t % 60)} \xB7 ${game.s.weather.toUpperCase()}`;
  };
  var itemUseLabel = (id) => ITEMS[id][1] === "structure" ? "PLACE" : WEAPONS[id] ? "EQUIP" : ["direwolf_cloak", "hide_coat", "explorer_boots", "cinder_ward"].includes(id) ? "WEAR" : id === "fishing_rod" ? "FISH" : ["food", "water", "medicine"].includes(ITEMS[id][1]) ? "USE" : "";
  var sound = (kind) => Audio.effect(kind);
  var view = pixelView(innerWidth, innerHeight, 1);
  function resize() {
    const ratio = devicePixelRatio || 1;
    view = pixelView(innerWidth, innerHeight, ratio);
    canvas.width = view.artW * view.scale;
    canvas.height = view.artH * view.scale;
    canvas.style.width = canvas.width / ratio + "px";
    canvas.style.height = canvas.height / ratio + "px";
    ctx.imageSmoothingEnabled = false;
  }
  function worldAt(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: state.camera.x + (e.clientX - rect.left) / view.cssPerWorld,
      y: state.camera.y + (e.clientY - rect.top) / view.cssPerWorld
    };
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
    pixelate($("intro-art"));
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
      const { x, y } = worldAt(e);
      const r = game.place(game.s.placing, x, y);
      if (!r.ok) message(r.reason);
      updateUI(true);
    } else {
      const { x, y } = worldAt(e);
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
    pixelate(left);
    pixelate(right);
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
        return `<div class="book-row"><div class="with-icon">${icon(e.id)}<div><strong>${pretty(e.id)}</strong>${fresh}</div></div><div><span class="qty">\xD7${e.qty}</span>${use ? `<button data-use="${e.id}">${use}</button>` : ""}</div></div>`;
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
      ([id, n]) => `<div class="book-row"><span class="with-icon">${icon(id)}${pretty(id)}</span><span class="qty ${game.count(id) < n ? "red" : ""}">${game.count(id)} / ${n}</span></div>`
    ).join(
      ""
    )}</div><div class="note-block">${!atStation ? "Stand beside a " + pretty(selected.station ?? "").toLowerCase() + "." : !affordable ? "Gather the remaining materials." : "Everything needed is at hand."}</div>`;
    const recipes = [...RECIPES].sort((a, b) => a.tier - b.tier);
    right.innerHTML = `<h2>Recipes</h2><p class="lede">Select a recipe, then make it when its station and materials are within reach.</p>${recipes.map(
      (r, i) => `${i === 0 || recipes[i - 1].tier !== r.tier ? `<h3 class="recipe-group">Tier ${r.tier} \xB7 ${["", "First fire", "Copper age", "Iron age", "Forgework", "Black glass", "Effergy"][r.tier]}</h3>` : ""}<div class="recipe-row"><div class="recipe-head"><strong class="with-icon">${icon(r.id)}${pretty(r.id)}</strong><button data-craft="${r.id}" ${game.canCraft(r.id) ? "" : "disabled"}>${game.dev.unlocked.has(r.id) ? "MAKE \u2726" : "MAKE"}</button></div><small>${Object.entries(
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
      $(id + "-bar").style.width = clamp3(v[id], 0, 100) + "%";
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
      $("boss-bar").style.width = clamp3(boss2.hp / boss2.maxHp * 100, 0, 100) + "%";
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
    state.camera.x = clamp3(p.x - view.worldW / 2, 0, Math.max(0, WORLD_W - view.worldW));
    state.camera.y = clamp3(p.y - 24 - view.worldH / 2, 0, Math.max(0, WORLD_H - view.worldH));
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
      lava = clamp3(1 - nearest / 520, 0, 1);
    }
    return {
      rain: surface ? wet * (game.sheltered() ? 0.5 : 1) : 0,
      wind: surface ? weather === "storm" ? 1 : ["tundra", "alpine", "taiga"].includes(biome) ? 0.6 : 0.12 : 0,
      fire,
      lava,
      cave: layer.endsWith("mines") ? 1 : layer === "upper_hell" ? 0.3 : 0,
      hell: layer === "upper_hell" ? 0.55 : layer === "lower_hell" ? 1 : 0,
      birds: surface && day && !wet && ["meadow", "forest", "coast", "marsh", "taiga"].includes(biome) ? 0.8 : 0,
      surf: surface && biome === "coast" ? clamp3(1 - p.x / 1600, 0, 1) : 0,
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
      state.camera.x = clamp3(
        3600 + Math.sin(performance.now() / 12e3) * 380 - view.worldW * 0.2,
        0,
        WORLD_W - view.worldW
      );
      state.camera.y = clamp3(
        surfaceAt(UI_RULES.menuFocalX) - view.worldH * 0.62,
        0,
        WORLD_H - view.worldH
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
    draw(ctx, game, state.camera, view, !state.playing);
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
