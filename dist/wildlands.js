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
    BIOME_WIDTH: () => BIOME_WIDTH,
    BOSSES: () => BOSSES,
    CAVE_LEVELS: () => CAVE_LEVELS,
    CHAPTERS: () => CHAPTERS,
    DISEASES: () => DISEASES,
    ENTRANCES: () => ENTRANCES,
    FIRST_BIOME_CENTER: () => FIRST_BIOME_CENTER,
    Ground: () => Ground,
    ITEMS: () => ITEMS,
    NODES: () => NODES,
    RECIPES: () => RECIPES,
    SIDE_ORDER: () => SIDE_ORDER,
    TILE: () => TILE,
    TILE_COLS: () => TILE_COLS,
    TILE_ROWS: () => TILE_ROWS,
    TOOL_TIERS: () => TOOL_TIERS,
    TUTORIAL: () => TUTORIAL,
    WEAPONS: () => WEAPONS,
    WORLD_H: () => WORLD_H,
    WORLD_W: () => WORLD_W,
    baseTileAt: () => baseTileAt,
    biomeAt: () => biomeAt,
    caveAt: () => caveAt,
    caveY: () => caveY,
    itemName: () => itemName,
    surfaceAt: () => surfaceAt
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
    direwolf_cloak: ["Direwolf Cloak", "clothing"],
    hide_coat: ["Hide coat", "clothing"],
    explorer_boots: ["Explorer boots", "clothing"],
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
    cactus_fruit: { yield: [1, 2], hp: 2, regen: 230 }
  };
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
    eclipse_blade: [6, 85, 73]
  };

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
  var BIOME_WIDTH = 1200;
  var FIRST_BIOME_CENTER = BIOME_WIDTH / 2;
  var MAP_LABEL_Y = 610;
  var CAVE_ENTRANCE_OFFSET = 420;
  var CAVE_DEPTHS = [0, 210, 465, 760];
  var CAVE_LEVELS = CAVE_DEPTHS.length - 1;
  var BIOME_CENTERS = Object.fromEntries(
    SIDE_ORDER.map((id, i) => [id, [FIRST_BIOME_CENTER + i * BIOME_WIDTH, MAP_LABEL_Y]])
  );
  var TILE = 32;
  var WORLD_W = SIDE_ORDER.length * BIOME_WIDTH;
  var WORLD_H = 1920;
  var TILE_COLS = Math.ceil(WORLD_W / TILE);
  var TILE_ROWS = Math.ceil(WORLD_H / TILE);
  var Ground = {
    air: 0,
    soil: 1,
    stone: 2,
    sand: 3,
    mud: 4,
    frost: 5,
    redrock: 6
  };
  var ELEVATION = {
    coast: 690,
    marsh: 665,
    forest: 625,
    meadow: 635,
    taiga: 600,
    tundra: 575,
    alpine: 490,
    desert: 635,
    badlands: 585
  };
  function surfaceAt(x) {
    x = Math.max(0, Math.min(WORLD_W, x));
    const i = Math.max(
      0,
      Math.min(SIDE_ORDER.length - 2, Math.floor((x - FIRST_BIOME_CENTER) / BIOME_WIDTH))
    );
    const x0 = FIRST_BIOME_CENTER + i * BIOME_WIDTH, t = Math.max(0, Math.min(1, (x - x0) / BIOME_WIDTH));
    const smooth6 = t * t * (3 - 2 * t);
    const base = ELEVATION[SIDE_ORDER[i]] * (1 - smooth6) + ELEVATION[SIDE_ORDER[i + 1]] * smooth6;
    return base + Math.sin(x / 145) * 20 + Math.sin(x / 53) * 8 + Math.sin(x / 370) * 14;
  }
  var ENTRANCES = SIDE_ORDER.map(
    (_, i) => FIRST_BIOME_CENTER + CAVE_ENTRANCE_OFFSET + i * BIOME_WIDTH
  );
  function caveY(x, level) {
    return surfaceAt(x) + CAVE_DEPTHS[level] + Math.sin(x / (125 + level * 45)) * (22 + level * 11);
  }
  function caveAt(x, y) {
    const surface = surfaceAt(x);
    if (ENTRANCES.some((entrance) => Math.abs(x - entrance) < 47) && y >= surface && y < caveY(x, CAVE_LEVELS) + 50)
      return true;
    if (y < surface + 70) return false;
    for (let level = 1; level <= CAVE_LEVELS; level++) {
      const width = 42 + level * 8 + Math.sin(x / 79 + level) * 10;
      if (Math.abs(y - caveY(x, level)) < width) return true;
    }
    return false;
  }
  function biomeAt(x, y) {
    const warped = x + 72 * Math.sin(y / 235) + 38 * Math.sin((x + y) / 115);
    const index = Math.max(
      0,
      Math.min(SIDE_ORDER.length - 1, Math.round((warped - FIRST_BIOME_CENTER) / BIOME_WIDTH))
    );
    return BIOMES.find((b) => b.id === SIDE_ORDER[index]);
  }
  function baseTileAt(tx, ty) {
    const x = tx * TILE + TILE / 2, y = ty * TILE + TILE / 2, surface = surfaceAt(x);
    if (y < surface || caveAt(x, y)) return Ground.air;
    const biome = biomeAt(x, y).id;
    if (y < surface + 76)
      return biome === "desert" ? Ground.sand : biome === "marsh" || biome === "coast" ? Ground.mud : biome === "tundra" ? Ground.frost : biome === "badlands" ? Ground.redrock : Ground.soil;
    if (biome === "tundra" && y < surface + 270) return Ground.frost;
    if (biome === "badlands" && y > surface + 350) return Ground.redrock;
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
    resourceSpread: 1120,
    animalSpread: 870,
    resourceWorldPadding: 65,
    animalWorldPadding: 70,
    entranceResourceClearance: 80,
    maxTickSeconds: 0.1,
    maxOfflineSeconds: 24 * 60 * 60,
    cooledSpoilageRate: 0.18,
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
        this.game.say(itemName(id) + " equipped.");
        return { ok: true };
      }
      if (id === "direwolf_cloak" || id === "hide_coat" || id === "explorer_boots") {
        const key = { direwolf_cloak: "cloak", hide_coat: "coat", explorer_boots: "boots" }[id];
        this.game.s.player[key] = !this.game.s.player[key];
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
    craft(id) {
      const r = RECIPES.find((r2) => r2.id === id);
      if (!r) return { ok: false, reason: "No such recipe." };
      if (id === "effergy" && (this.game.s.structures.some((x) => x.type === "effergy") || this.game.count("effergy")))
        return { ok: false, reason: "Only one Effergy may be owned." };
      if (r.station && !this.game.near(r.station))
        return { ok: false, reason: "Stand near a " + itemName(r.station) + "." };
      if (r.station === "campfire" && !this.game.nearLitFire())
        return { ok: false, reason: "The campfire needs fuel." };
      if (!this.game.canAfford(r.cost)) return { ok: false, reason: "More materials are needed." };
      for (const [item, qty] of Object.entries(r.cost)) this.game.remove(item, qty);
      this.game.add(id);
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
      this.game.s.placing = null;
      this.game.progress.record("place:" + id);
      this.game.say(itemName(id) + " placed.", "good");
      return { ok: true, structure: st };
    }
  };

  // src/game/systems/Effergy.ts
  var Effergy = class extends System {
    summonBoss() {
      const altar = this.game.s.structures.find((st) => st.type === "effergy");
      if (!altar) return;
      const cfg = BOSSES[this.game.s.altar.level - 1];
      const x = clamp(altar.x + 145, 40, WORLD_W - 40), y = this.game.groundTopAt(x) - 1;
      const boss = {
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
        phase: 0
      };
      this.game.s.animals.push(boss);
      this.game.s.altar.activeBoss = boss.id;
      for (let i = 0; i < 2; i++) {
        const cx = x + (i ? 70 : -70);
        this.game.s.animals.push({
          id: uniqueId(),
          type: "wolf",
          companion: true,
          x: cx,
          y: this.game.groundTopAt(cx) - 1,
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
      const b = this.game.biome();
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
        const loot = {
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
        this.game.say("Rested beneath the open sky. Fatigue eases.", "good");
      } else if (st.type === "campfire") {
        if (this.game.count("wood")) {
          this.game.remove("wood");
          st.fuel += RULES.campfireRefuel;
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
      } else if (st.type === "chest") return { ok: true, action: "chest", structure: st };
      else if (st.type === "farm_plot") {
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
      if (this.game.rng() < RULES.fishSuccessChance) {
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
      if (dist(node, this.game.s.player) > RULES.gatherReach || node.hp <= 0)
        return { ok: false, reason: "Move closer to the resource." };
      const spec = NODES[node.kind], v = this.game.s.vitals;
      const tier = spec.tool ? this.game.toolTier(spec.tool) : 0;
      if (tier < (spec.req || 0))
        return {
          ok: false,
          reason: itemName(node.kind) + " requires a tier " + spec.req + " pickaxe."
        };
      if (v.stamina < 7) return { ok: false, reason: "Too exhausted to gather. Rest or wait." };
      v.stamina -= 7;
      v.hydration = clamp(v.hydration - 0.4, 0, RULES.maxVital);
      v.hygiene = clamp(v.hygiene - 0.3, 0, RULES.maxVital);
      const qty = Math.floor(spec.yield[0] + this.game.rng() * (spec.yield[1] - spec.yield[0] + 1)) + (tier >= 3 ? 1 : 0);
      const id = node.kind === "water" ? "wild_water" : node.kind;
      this.game.add(id, qty);
      if (node.kind !== "water") {
        node.hp--;
        if (node.hp <= 0) node.depletedUntil = this.game.s.elapsed + spec.regen;
      }
      this.game.say("Gathered " + qty + " " + itemName(id).toLowerCase() + ".", "good");
      return { ok: true, id, qty };
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
  var Physics = class extends System {
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
      return true;
    }
    move(dx, dy, dt) {
      if (this.game.s.dead) return;
      const p = this.game.s.player, v = this.game.s.vitals;
      p.moving = Math.abs(dx) > 0.1;
      const tired = v.stamina < 12 || v.fatigue > 80;
      const speed = (tired ? RULES.tiredMoveSpeed : RULES.standardMoveSpeed) * (v.illness > 60 ? 0.82 : 1) * (p.boots ? 1.12 : 1);
      if (dx) p.face = dx > 0 ? 0 : Math.PI;
      p.vx = dx * speed;
      const shaft = ENTRANCES.some((x) => Math.abs(x - p.x) < 43) && p.y > surfaceAt(p.x) - 12;
      if (dy < 0 && (p.grounded || shaft) && v.stamina > RULES.jumpStamina) {
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
            p.grounded = true;
            if (p.vy > RULES.fallDamageVelocity)
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
        if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) n.hp = NODES[n.kind].hp;
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
    // Exposure, hunger, illness, morale, and health drift for one tick.
    update(dt) {
      const v = this.game.s.vitals, p = this.game.s.player;
      const cold = this.game.temperature();
      const shelter = this.game.sheltered(), fire = !!this.game.nearLitFire();
      const rain = this.game.s.weather === "rain" || this.game.s.weather === "storm";
      const underground = p.y > surfaceAt(p.x) + 80;
      const marshWet = this.game.biome().id === "marsh" && !shelter && !underground ? 0.065 : 0;
      v.wetness = clamp(
        v.wetness + dt * (rain && !shelter && !underground ? 0.28 : fire ? -0.35 : shelter ? -0.17 : -0.07) + dt * marshWet,
        0,
        100
      );
      let target = 37 + (cold - (underground ? 6 : 15)) * 0.19 - v.wetness * 0.022 + (fire ? 4.5 : 0) + (shelter ? 1.8 : 0) + (p.cloak && cold < 15 ? 2.7 : 0) + (p.coat && cold < 15 ? 1.4 : 0);
      target = clamp(target, 30, 41);
      v.bodyTemp += (target - v.bodyTemp) * dt * 0.012;
      v.hydration = clamp(
        v.hydration - dt * (0.045 + (cold > 26 ? 0.045 : 0) + (this.game.s.disease === "dysentery" ? 0.055 : 0)),
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
        (a) => !a.deadUntil && ["wolf", "boar", "scorpion", "bat", "boss"].includes(a.type) && dist(a, p) < 150
      );
      v.morale = clamp(
        v.morale + dt * (threats || v.illness > 45 ? -0.045 : fire && v.calories > 40 ? 0.025 : 4e-3),
        0,
        100
      );
      const harm = (v.hydration <= 0 ? 0.15 : 0) + (v.calories <= 0 ? 0.11 : 0) + (v.protein <= 0 ? 0.04 : 0) + (v.bodyTemp < 35 || v.bodyTemp > 39 ? 0.09 : 0) + (v.illness > 70 ? 0.08 : 0) + (v.infection > 65 ? 0.1 : 0);
      if (harm) v.health = clamp(v.health - harm * dt, 0, RULES.maxVital);
      else if (v.hydration > 50 && v.calories > 50 && v.protein > 25 && v.bodyTemp > 36 && v.bodyTemp < 38 && v.illness < 20 && v.infection < 20 && !threats)
        v.health = clamp(v.health + dt * 0.018, 0, RULES.maxVital);
      if (v.health <= 0) {
        this.game.s.dead = true;
        this.game.say("You collapsed. Your field record survives.", "danger");
      }
    }
  };

  // src/game/systems/Terrain.ts
  var Terrain = class extends System {
    tileAt(tx, ty) {
      return tx < 0 || ty < 0 || tx >= TILE_COLS || ty >= TILE_ROWS ? 0 : this.game.s.tiles[ty * TILE_COLS + tx] || 0;
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
      const need = kind === 6 ? 4 : kind === 5 ? 2 : kind === 2 ? 1 : 0;
      if (this.game.toolTier("pick") < need)
        return { ok: false, reason: "This ground needs a tier " + need + " pickaxe." };
      if (this.game.s.vitals.stamina < RULES.mineStamina)
        return { ok: false, reason: "Too exhausted to mine." };
      this.game.s.vitals.stamina -= RULES.mineStamina;
      this.game.s.tiles[ty * TILE_COLS + tx] = 0;
      const yieldItem = { 1: "dirt", 2: "stone", 3: "dirt", 4: "clay", 5: "ice", 6: "stone" }[kind];
      this.game.add(yieldItem, 1);
      if (kind === 6 && this.game.rng() < 0.22) this.game.add("obsidian", 1);
      this.game.say("Mined " + itemName(yieldItem).toLowerCase() + ".", "good");
      return { ok: true, item: yieldItem };
    }
  };

  // src/game/systems/Wildlife.ts
  var Wildlife = class extends System {
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
        itemName(p.weapon) + " struck " + (target.type === "boss" ? BOSSES[this.game.s.altar.level - 1].name : "a " + target.type) + " for " + Math.round(damage) + ".",
        "combat"
      );
      if (target.hp <= 0) this.kill(target);
      return { ok: true, hit: true, target };
    }
    kill(animal) {
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
        if (animal.type === "bat") {
          this.game.add("chitin", 2);
          this.game.add("feathers", 1);
        } else if (animal.type === "scorpion") {
          this.game.add("chitin", 3);
          this.game.add("venom", 1);
        } else {
          this.game.add("raw_meat", animal.type === "boar" ? 5 : 3);
          this.game.add("hide", 2);
          this.game.add("bone", animal.type === "wolf" ? 2 : 1);
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
          a.y = a.type === "bat" ? caveY(a.x, 1) : this.game.groundTopAt(a.x) - 1;
        }
        return;
      }
      const p = this.game.s.player, d = dist(a, p), boss = a.type === "boss";
      const aggressive = ["wolf", "boar", "scorpion", "bat", "boss"].includes(a.type);
      let vx = 0;
      if (a.type === "deer" && d < 175) vx = Math.sign(a.x - p.x);
      else if (aggressive && d < (boss ? 350 : a.type === "bat" ? 145 : 210) && !this.game.s.dead) {
        vx = Math.sign(p.x - a.x);
        if (Math.abs(a.x - p.x) < (boss ? 75 : 30)) vx = 0;
        if (d < (boss ? 94 : 45) && this.game.s.elapsed >= a.attackAt) {
          a.warning = boss ? 1.15 : 0.55;
          a.attackAt = this.game.s.elapsed + (boss ? 2.3 : 1.7);
          a.hitAt = this.game.s.elapsed + (boss ? 0.65 : 0.35);
        }
        if (boss && this.game.s.elapsed >= (a.howlAt ?? 0)) {
          a.howlAt = this.game.s.elapsed + 8;
          a.howlCue = this.game.s.elapsed + 0.8;
          a.warning = 1.2;
          this.game.say("The Direwolf draws breath for a howl!", "danger");
        }
      } else {
        if (this.game.s.elapsed >= a.wanderAt) {
          a.angle = this.game.rng() > 0.5 ? 0 : Math.PI;
          a.wanderAt = this.game.s.elapsed + 2 + this.game.rng() * 4;
        }
        vx = Math.cos(a.angle) * 0.4;
      }
      if (a.hitAt && this.game.s.elapsed >= a.hitAt) {
        a.hitAt = 0;
        if (dist(a, p) < (boss ? 108 : 55) && p.invuln <= 0 && !this.game.s.dead) {
          const damage = boss ? BOSSES[this.game.s.altar.level - 1].bite : a.type === "boar" ? 14 : a.type === "scorpion" ? 8 : 9;
          this.game.s.vitals.health -= damage * (p.cloak ? 0.68 : p.coat ? 0.82 : 1);
          this.game.s.vitals.morale = clamp(
            this.game.s.vitals.morale - (boss ? 9 : 4),
            0,
            RULES.maxVital
          );
          p.invuln = 0.75;
          if (a.type === "scorpion" && this.game.rng() < 0.42) this.game.contract("poisoning");
          else if (this.game.rng() < (boss ? 0.4 : 0.16) + (this.game.s.vitals.hygiene < 30 ? 0.13 : 0))
            this.game.contract("wound");
          this.game.say(
            (boss ? "Direwolf" : a.type[0].toUpperCase() + a.type.slice(1)) + " attack! " + Math.round(damage * (p.cloak ? 0.68 : p.coat ? 0.82 : 1)) + " damage.",
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
      const speed = a.type === "deer" ? d < 175 ? 160 : 32 : boss ? 85 : a.type === "scorpion" ? 67 : d < 210 ? 105 : 30;
      if (Math.abs(vx) > 0.5) a.angle = vx > 0 ? 0 : Math.PI;
      a.x = clamp(a.x + vx * speed * dt, 20, WORLD_W - 20);
      a.y = a.type === "bat" ? caveY(a.x, 1) + Math.sin(this.game.s.elapsed * 4 + a.phase) * 13 : this.game.groundTopAt(a.x) - 1;
      for (const st of this.game.s.structures)
        if (st.type === "spike_trap" && Math.abs(st.x - a.x) < 23 && Math.abs(st.y - a.y) < 38 && this.game.s.elapsed - st.triggeredAt > 2) {
          a.hp -= 22;
          st.triggeredAt = this.game.s.elapsed;
          if (a.hp <= 0) this.kill(a);
        }
    }
  };

  // src/game/SaveSystem.ts
  var SaveSystem = class extends System {
    save(storage = globalThis.localStorage, silent = false) {
      this.game.s.lastSave = Date.now();
      storage.setItem(RULES.saveKey, JSON.stringify(this.game.s));
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
          return clamp(
            BIOME_CENTERS[oldGrid[row][col]][0] + (ox % 1600 - 800) * 0.6,
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
        this.game.s = parsed;
        this.game.rng = seededRandom(parsed.seed);
        this.game.messages = [];
        this.game.world.generate();
      } else {
        this.game.s = parsed;
        this.game.rng = seededRandom(parsed.seed + Math.floor(parsed.elapsed));
        this.game.messages = [];
      }
      if (!this.game.s.layout) {
        if (!legacy) {
          this.game.s.nodes = [];
          this.game.world.generateNodes();
        }
        this.game.s.layout = 2;
      }
      this.game.s.chapter ??= 0;
      this.game.s.discoveries ??= ["meadow"];
      this.game.progress.advanceChapter();
      const away = clamp((Date.now() - parsed.lastSave) / 1e3, 0, RULES.maxOfflineSeconds);
      this.game.survival.advanceDecay(away);
      this.game.s.elapsed += away;
      for (const n of this.game.s.nodes) {
        if (n.hp <= 0 && this.game.s.elapsed >= n.depletedUntil) n.hp = NODES[n.kind].hp;
        if (n.underground) n.y = this.game.floorNear(n.x, n.y);
      }
      this.game.say("Field record reopened. " + Math.round(away) + " seconds passed.", "good");
      return true;
    }
  };

  // src/game/WorldGenerator.ts
  var WorldGenerator = class extends System {
    generate() {
      this.game.s.tiles = Array.from(
        { length: TILE_COLS * TILE_ROWS },
        (_, index) => baseTileAt(index % TILE_COLS, Math.floor(index / TILE_COLS))
      );
      for (const b of BIOMES) {
        const cx = BIOME_CENTERS[b.id][0];
        for (let i = 0; i < 3; i++) {
          const x = clamp(cx - 430 + i * 410 + this.game.rng() * 110, 70, WORLD_W - 70);
          if (Math.abs(x - RULES.spawnX) > 250 && !ENTRANCES.some((e) => Math.abs(e - x) < 85) && this.nodeFits("cache", x, this.game.groundTopAt(x) - 1))
            this.game.s.caches.push({
              id: uniqueId(),
              x,
              y: this.game.groundTopAt(x) - 1,
              opened: false,
              biome: b.id
            });
        }
      }
      this.generateNodes();
      for (const b of BIOMES) {
        const cx = BIOME_CENTERS[b.id][0];
        const populations = {
          coast: ["deer", "deer"],
          marsh: ["deer", "boar", "bat"],
          forest: ["deer", "deer", "wolf", "boar", "bat"],
          meadow: ["deer", "deer"],
          taiga: ["deer", "wolf", "wolf", "bat"],
          tundra: ["wolf", "wolf"],
          alpine: ["wolf", "bat"],
          desert: ["scorpion", "scorpion"],
          badlands: ["wolf", "wolf", "scorpion", "bat"]
        };
        for (const type of populations[b.id]) {
          let x = -1;
          for (let attempt = 0; attempt < 12 && x < 0; attempt++) {
            const tryX = clamp(
              cx + (this.game.rng() - 0.5) * RULES.animalSpread,
              RULES.animalWorldPadding,
              WORLD_W - RULES.animalWorldPadding
            );
            if (!(b.id === "meadow" && Math.abs(tryX - RULES.spawnX) < 260) && !ENTRANCES.some((e) => Math.abs(e - tryX) < 70) && !this.game.s.animals.some(
              (a) => a.type === "bat" === (type === "bat") && Math.abs(a.x - tryX) < 80
            ))
              x = tryX;
          }
          if (x < 0) continue;
          const flying = type === "bat", y = flying ? caveY(x, 1) : this.game.groundTopAt(x) - 1;
          const hp = { deer: 42, wolf: 66, boar: 88, bat: 33, scorpion: 54 }[type];
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
            phase: this.game.rng() * Math.PI * 2
          });
        }
      }
    }
    // Resource layout; also rebuilt once for records saved before resources kept their spacing.
    generateNodes() {
      RULES.starterNodeOffsets.forEach(([kind, offset]) => {
        const x = RULES.spawnX + offset;
        this.game.s.nodes.push({
          id: uniqueId(),
          kind,
          x,
          y: this.game.groundTopAt(x) - 1,
          hp: NODES[kind].hp,
          depletedUntil: 0,
          phase: 0
        });
      });
      for (const b of BIOMES) {
        const cx = BIOME_CENTERS[b.id][0];
        const kinds = [...new Set(b.resources)], queue = [];
        for (let round = 0; round < 12; round++)
          for (const kind of kinds) {
            const quantity = kind === "wood" || kind === "stone" ? 12 : kind === "water" ? 5 : 8;
            if (round < quantity) queue.push(kind);
          }
        for (const kind of queue)
          for (let attempts = 0; attempts < RULES.worldGenerationAttemptsPerNode; attempts++) {
            const x = clamp(
              cx + (this.game.rng() - 0.5) * RULES.resourceSpread,
              RULES.resourceWorldPadding,
              WORLD_W - RULES.resourceWorldPadding
            );
            if (ENTRANCES.some((e) => Math.abs(e - x) < RULES.entranceResourceClearance)) continue;
            const ore = [
              "copper_ore",
              "iron_ore",
              "coal",
              "ice",
              "obsidian",
              "sulfur",
              "crystal"
            ].includes(kind);
            const underground = ore && this.game.rng() < (kind === "obsidian" ? 0.9 : 0.7);
            const level = ["obsidian", "crystal"].includes(kind) ? 3 : ["iron_ore", "ice", "sulfur"].includes(kind) ? 2 : 1;
            const y = underground ? this.game.floorNear(x, caveY(x, level)) : this.game.groundTopAt(x) - 1;
            if (biomeAt(x, y).id !== b.id || b.id === "meadow" && Math.abs(x - RULES.spawnX) < 110 || !this.nodeFits(kind, x, y))
              continue;
            this.game.s.nodes.push({
              id: uniqueId(),
              kind,
              x,
              y,
              hp: NODES[kind].hp,
              depletedUntil: 0,
              phase: this.game.rng() * Math.PI * 2,
              underground
            });
            break;
          }
      }
    }
    // Resources keep a readable footprint: trees space from trees, small finds from each other.
    nodeFits(kind, x, y) {
      const tree = (k) => k === "wood" || k === "resin" || k === "honey";
      const width = (k) => tree(k) ? 92 : k === "water" ? 74 : k === "cache" ? 44 : NODES[k]?.tool ? 38 : 30;
      const others = [
        ...this.game.s.nodes,
        ...this.game.s.caches.map((c) => ({ kind: "cache", x: c.x, y: c.y }))
      ];
      return others.every((n) => {
        if (Math.abs(n.y - y) > 60) return true;
        const gap = Math.abs(n.x - x);
        if (tree(kind) !== tree(n.kind))
          return gap > (kind === "water" || n.kind === "water" ? 64 : 26);
        return gap > (width(kind) + width(n.kind)) / 2;
      });
    }
  };

  // src/game/Game.ts
  var Game = class {
    s;
    rng;
    messages;
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
        layout: 2,
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
      this.survival.update(dt);
    }
    say(message2, tone2 = "ink") {
      this.messages.unshift({ message: message2, tone: tone2, at: this.s.elapsed });
      this.messages.length = Math.min(this.messages.length, 8);
    }
    // ─── Place and surroundings ───────────────────────────────────────────────
    biome(x = this.s.player.x, y = this.s.player.y) {
      return biomeAt(x, y);
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
  var BIOME_STEP = data_exports.BIOME_CENTERS[data_exports.SIDE_ORDER[1]][0] - data_exports.BIOME_CENTERS[data_exports.SIDE_ORDER[0]][0];
  var FIRST_CENTER = data_exports.BIOME_CENTERS[data_exports.SIDE_ORDER[0]][0];
  function blendAt(x) {
    const f = clamp2((x - FIRST_CENTER) / BIOME_STEP, 0, data_exports.SIDE_ORDER.length - 1), i = Math.min(Math.floor(f), data_exports.SIDE_ORDER.length - 2);
    return [ART[data_exports.SIDE_ORDER[i]], ART[data_exports.SIDE_ORDER[i + 1]], smooth(0.3, 0.7, f - i)];
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
    const night = 1 - day;
    if (night > 0.02)
      for (let i = 0; i < 110; i++) {
        const sx = H(i, 1) * w, sy = H(i, 9) * h * 0.62, tw = 0.55 + 0.45 * Math.sin(time * (1 + H(i, 2) * 2) + i);
        const r = 0.5 + H(i, 4) * 1.3;
        c.fillStyle = rgba("#f4eed8", night * tw * (0.35 + H(i, 5) * 0.65));
        c.fillRect(sx - r / 2, sy - r / 2, r, r);
      }
    const solar = (tod - 360) / 780;
    if (solar > -0.08 && solar < 1.08) {
      const sx = w * (0.1 + solar * 0.8), sy = h * (0.62 - Math.sin(clamp2(solar) * Math.PI) * 0.46);
      glow(c, sx, sy, 190, dusk > 0.2 ? "#f5b877" : "#fbf0cf", 0.35 + dusk * 0.25);
      ellipse(c, sx, sy, 30, 30, dusk > 0.2 ? mix("#f7e3b0", "#f19a64", dusk) : "#f8ecc8");
    }
    const lunar = (tod + 1440 - 1110) % 1440 / 690;
    if (lunar > -0.05 && lunar < 1.05 && night > 0.05) {
      const mx = w * (0.12 + lunar * 0.76), my = h * (0.5 - Math.sin(clamp2(lunar) * Math.PI) * 0.36);
      glow(c, mx, my, 110, "#dfe6e8", 0.16 * night);
      c.save();
      c.globalAlpha = clamp2(night * 1.3);
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
      col = mix(col, "#172431", night * (0.72 - layer * 0.06));
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(-10, h + 5);
      const trees = [];
      for (let sx = -16; sx <= w + 16; sx += 8) {
        const wx = sx + cam.x * d + layer * 1e3;
        const ya = skylineHeight(A.skyline, wx, layer), yb = skylineHeight(B.skyline, wx, layer);
        const yy = base - lerp(ya, yb, k);
        c.lineTo(sx, yy);
        if (layer >= 1 && sx % 24 === 0) trees.push([sx, yy]);
      }
      c.lineTo(w + 10, h + 5);
      c.closePath();
      c.fill();
      if (base < h)
        for (const [sx, yy] of trees) {
          const wx = sx + cam.x * d + layer * 1e3, kind = H(Math.floor(wx / 24), layer, 8) < k ? B.trees : A.trees;
          if (!kind || vnoise(wx / 150, layer + 20) < 0.42) continue;
          const size = (14 + H(Math.floor(wx / 24), layer, 9) * 16) * (0.7 + layer * 0.25);
          skylineTree(c, kind, sx + (H(Math.floor(wx / 24), 3) - 0.5) * 10, yy + 2, size);
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
    7: "#2f2a35"
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
        const col = mix(earth, rock, smooth(30, 170, depth));
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
    if (look === 2 || look === 6 || look === 5 || look === 7) {
      const gap = look === 6 ? 11 : look === 5 ? 15 : 23;
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
  function drawLadders(c, cam, w) {
    for (const ex of data_exports.ENTRANCES) {
      const sx = ex - cam.x;
      if (sx < -90 || sx > w + 90) continue;
      const y1 = data_exports.surfaceAt(ex) - cam.y - 24, y2 = data_exports.caveY(ex, 3) + 40 - cam.y;
      for (const rx of [-22, 22]) {
        line(c, sx + rx, y1, sx + rx, y2, INK, 7);
        line(c, sx + rx, y1, sx + rx, y2, "#7a5d42", 4.5);
        line(c, sx + rx - 1, y1, sx + rx - 1, y2, "#9a7a56", 1.3);
      }
      for (let y = y1 + 14; y < y2; y += 20) {
        line(c, sx - 22, y + 2, sx + 22, y + 2, "rgba(0,0,0,0.3)", 3);
        line(c, sx - 22, y, sx + 22, y, INK, 5);
        line(c, sx - 22, y, sx + 22, y, "#a58560", 3);
      }
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
  function drawTree(c, n, x, y, t) {
    const art0 = artAt(n.x, n.y), art = art0.trees ? art0 : ART.meadow, s = 0.9 + H(n.id, 3) * 0.24, sway = Math.sin(t * 0.9 + n.phase + n.x * 0.01) * 2.2, seed = n.id * 13;
    c.save();
    c.translate(x, y);
    ellipse(c, 0, 1, 30 * s, 5, "rgba(20,24,18,0.22)");
    if (n.hp <= 0) {
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
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + n.phase);
      glow(c, 0, -16, 42, "#8fe3df", 0.18 + pulse * 0.12);
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
    } else {
      drawRock(c, 0, 30, 20, seed, "#9a8d78");
    }
    c.restore();
  }
  function drawNode(c, n, x, y, t) {
    const k = n.kind;
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
      const spec = data_exports.BOSSES[Math.min(data_exports.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))], pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      glow(c, 0, -60, 80, spec.glow, 0.16 + pulse * 0.1);
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
      c.strokeStyle = rgba(spec.glow, 0.55 + pulse * 0.45);
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
      const crystal = k === "crystal_lantern", lit = crystal || s.fuel > 0, flick = crystal ? 0.5 + 0.5 * Math.sin(t * 2) : 0.8 + Math.sin(t * 13 + s.id) * 0.1;
      line(c, 0, 0, 0, -72, INK, 6);
      line(c, 0, 0, 0, -72, crystal ? "#5f6f7a" : "#5a4633", 4);
      line(c, -2, -68, 18, -68, INK, 4.5);
      line(c, -2, -68, 18, -68, crystal ? "#6d7f8a" : "#5a4633", 2.6);
      line(c, 15, -68, 15, -61, "#3f3a36", 1.2);
      const glass = lit ? crystal ? "#aef0ec" : "#ffd88a" : "#6d6a5e";
      if (lit)
        glow(c, 15, -50, crystal ? 46 : 40, crystal ? "#9fe8e4" : "#ffc46a", 0.3 * flick + 0.1);
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
      if (crystal) {
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
      m = { x, y, walk: 0, move: 0, hp, hurt: -9 };
      motion.set(id, m);
    }
    const dx = Math.abs(x - m.x);
    if (dx > 60) m.x = x;
    m.walk += Math.min(dx, 12);
    m.move = lerp(m.move, dx > 0.12 ? 1 : 0, 0.22);
    if (hp < m.hp) m.hurt = t;
    m.hp = hp;
    m.x = x;
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
    const m = track(a.id, a.x, a.y, a.hp, t), facing = Math.cos(a.angle) >= 0 ? 1 : -1, boss = a.type === "boss", hurt = t - m.hurt < 0.16;
    c.save();
    c.translate(x + (hurt ? Math.sin(t * 90) * 2 : 0), y + 1);
    if (a.type !== "bat") ellipse(c, 0, 0, boss ? 44 : 24, boss ? 6 : 4, "rgba(15,15,12,0.25)");
    c.scale(facing, 1);
    if (hurt) c.filter = "brightness(1.9) saturate(0.4)";
    if (boss) {
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
    else if (a.type === "scorpion") drawScorpion(c, m, t, a);
    c.filter = "none";
    c.restore();
    const top = { deer: 100, wolf: 56, boar: 50, bat: 50, scorpion: 60 };
    if (!boss && a.hp < a.maxHp && a.hp > 0) {
      const by = y - (top[a.type] || 60) - 6;
      c.fillStyle = "rgba(30,25,20,0.65)";
      c.fillRect(x - 17, by, 34, 4);
      c.fillStyle = "#c0584a";
      c.fillRect(x - 16, by + 1, 32 * clamp2(a.hp / a.maxHp), 2);
    }
    if (a.warning > 0) {
      const by = y - (boss ? 118 : (top[a.type] || 60) + 16) + Math.sin(t * 12) * 1.5;
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
    const m = track(-1, p.x, p.y, 0, t), facing = Math.cos(p.face) >= 0 ? 1 : -1, shaft = data_exports.ENTRANCES.some((e) => Math.abs(p.x - e) < 47) && p.y > data_exports.surfaceAt(p.x) + 8, climbing = shaft && !p.grounded, air = !p.grounded && !climbing, walking = p.grounded ? m.move : 0, ph = m.walk * 0.12, sw = Math.sin(ph) * walking, bob = Math.abs(Math.cos(ph)) * walking * 1.6, breath = Math.sin(t * 2.2) * 0.5 * (1 - walking);
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
  function collectLights(g, menu, t) {
    const lights = [];
    const p = g.s.player;
    if (!menu) lights.push({ x: p.x, y: p.y - 30, r: 260, color: "#e8d4a0", warm: 0.1 });
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
    return lights;
  }
  function drawLighting(c, g, cam, w, h, menu, tod) {
    const night = Math.min(0.7, (1 - daylight(tod)) * 0.66 + overcastOf(g) * 0.14), t = g.s.elapsed;
    let caveVisible = false;
    for (let sx = 0; sx <= w; sx += 64)
      if (data_exports.surfaceAt(sx + cam.x) - cam.y + 90 < h) caveVisible = true;
    if (night < 0.02 && !caveVisible) return;
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
    if (night > 0) {
      m.fillStyle = `rgba(8,14,26,${night})`;
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
      gr.addColorStop(1, `rgba(5,7,11,${0.7 - night * 0.25})`);
      m.fillStyle = gr;
      m.fill();
    }
    const lights = collectLights(g, menu, t).filter(
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
    const dark = Math.max(night, caveVisible ? 0.5 : 0);
    c.save();
    c.globalCompositeOperation = "lighter";
    for (const l of lights)
      glow(c, l.x - cam.x, l.y - cam.y, l.r * 0.7, l.color, l.warm * (0.35 + dark));
    c.restore();
  }
  function drawWeather(c, g, cam, w, h, menu, fx, tod) {
    const t = g.s.elapsed, weather = g.s.weather, biome = data_exports.biomeAt(fx, 0).id, cold = biome === "tundra" || biome === "alpine", wet = weather === "rain" || weather === "storm", surfaceY = data_exports.surfaceAt(fx) - cam.y, under = !menu && g.s.player.y > data_exports.surfaceAt(g.s.player.x) + 150;
    if (under) return;
    const bottom = Math.min(h, surfaceY + 260);
    if (wet && !cold) {
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
    if (cold) {
      const n = wet ? 170 : weather === "cloudy" ? 70 : 34;
      c.fillStyle = "rgba(248,250,252,0.85)";
      for (let i = 0; i < n; i++) {
        const r = 1 + H(i, 3) * 1.8, x = ((H(i, 1) * w + Math.sin(t * 0.8 + i) * 18 + t * (wet ? 40 : 14) - cam.x * 0.3) % (w + 40) + w + 40) % (w + 40) - 20, y = (H(i, 2) * bottom + t * (28 + H(i, 5) * 30)) % bottom;
        c.fillRect(x, y, r, r);
      }
    }
    const night = 1 - daylight(tod);
    if (["meadow", "marsh", "forest"].includes(biome) && night > 0.3 && !wet)
      for (let i = 0; i < 16; i++) {
        const x = ((H(i, 1) * 1800 - cam.x + Math.sin(t * 0.4 + i) * 40) % 1800 + 1800) % 1800, y = surfaceY - 20 - H(i, 2) * 90 + Math.sin(t * 0.9 + i * 2) * 12, blink = Math.max(0, Math.sin(t * 2 + i * 1.7));
        if (x > w) continue;
        glow(c, x, y, 9, "#e8f08a", 0.55 * blink * night);
        ellipse(c, x, y, 1.2, 1.2, `rgba(245,250,190,${blink * night})`);
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

  // src/renderer/Renderer.ts
  function draw(c, g, cam, w, h, menu = false) {
    const t = g.s.elapsed, tod = g.timeOfDay(), fx = menu ? cam.x + w / 2 : g.s.player.x;
    c.clearRect(0, 0, w, h);
    drawSky(c, g, cam, w, h, fx, tod);
    drawTerrain(c, g, cam, w, h);
    drawLadders(c, cam, w);
    const visible = (o, pad = 140) => o.x > cam.x - pad && o.x < cam.x + w + pad && o.y > cam.y - 40 && o.y < cam.y + h + 220;
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
    if (!menu) drawPlayer(c, g.s.player, g.s.player.x - cam.x, g.s.player.y - cam.y, t);
    drawLighting(c, g, cam, w, h, menu, tod);
    drawWeather(c, g, cam, w, h, menu, fx, tod);
    const vignette = c.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.75);
    vignette.addColorStop(0, "rgba(40,32,22,0)");
    vignette.addColorStop(1, "rgba(30,22,18,0.32)");
    c.fillStyle = vignette;
    c.fillRect(0, 0, w, h);
  }

  // src/audio/Audio.ts
  var saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("wildlands-audio") || "{}");
    } catch {
      return {};
    }
  })();
  var settings = { music: saved.music ?? 0.44, sfx: saved.sfx ?? 0.6 };
  var ac;
  var master;
  var musicBus;
  var sfxBus;
  var nextBar = 0;
  var bar = 0;
  var scene = "menu";
  var chords = {
    menu: [
      [196, 246.94, 293.66],
      [174.61, 220, 261.63],
      [164.81, 196, 246.94],
      [174.61, 220, 293.66]
    ],
    meadow: [
      [196, 246.94, 293.66],
      [220, 261.63, 329.63],
      [174.61, 220, 261.63],
      [196, 246.94, 293.66]
    ],
    forest: [
      [174.61, 220, 261.63],
      [164.81, 196, 246.94],
      [146.83, 185, 220],
      [164.81, 220, 261.63]
    ],
    cold: [
      [146.83, 185, 220],
      [130.81, 164.81, 196],
      [123.47, 155.56, 185],
      [130.81, 164.81, 220]
    ],
    desert: [
      [196, 233.08, 293.66],
      [174.61, 220, 261.63],
      [155.56, 196, 233.08],
      [174.61, 220, 293.66]
    ],
    cave: [
      [130.81, 155.56, 196],
      [116.54, 146.83, 174.61],
      [110, 130.81, 164.81],
      [123.47, 155.56, 185]
    ],
    boss: [
      [110, 130.81, 164.81],
      [98, 123.47, 146.83],
      [92.5, 116.54, 138.59],
      [103.83, 130.81, 155.56]
    ]
  };
  function init() {
    if (ac) return;
    const C = window.AudioContext;
    if (!C) return;
    ac = new C();
    master = ac.createGain();
    master.gain.value = 0.8;
    master.connect(ac.destination);
    musicBus = ac.createGain();
    musicBus.gain.value = settings.music * 0.28;
    musicBus.connect(master);
    sfxBus = ac.createGain();
    sfxBus.gain.value = settings.sfx * 0.42;
    sfxBus.connect(master);
    nextBar = ac.currentTime + 0.1;
    setInterval(schedule, 180);
  }
  function start() {
    init();
    ac?.resume();
  }
  function tone(freq, when, duration, type = "sine", vol = 0.1, bus = musicBus) {
    if (!ac || !bus) return;
    const osc = ac.createOscillator(), gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freq), when);
    gain.gain.setValueAtTime(1e-4, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(2e-4, vol), when + 0.035);
    gain.gain.exponentialRampToValueAtTime(1e-4, when + duration);
    osc.connect(gain).connect(bus);
    osc.start(when);
    osc.stop(when + duration + 0.02);
  }
  function schedule() {
    if (!ac || ac.state !== "running") return;
    const now = ac.currentTime;
    while (nextBar < now + 1.4) {
      const tempo = scene === "boss" ? 1.42 : scene === "cave" ? 2.45 : 2.75, notes = chords[scene] || chords.meadow, chord = notes[bar % notes.length], s = nextBar;
      tone(chord[0] / 2, s, tempo * 1.7, "triangle", 0.14);
      tone(chord[0], s, tempo * 1.3, "sine", 0.08);
      tone(chord[1], s, tempo * 1.25, "sine", 0.065);
      tone(chord[2], s, tempo * 1.25, "sine", 0.06);
      const motif = [0, 2, 1, 2, 0, 1, 2, 1];
      for (let i = 0; i < 4; i++) {
        const idx = motif[(bar * 4 + i) % motif.length], pitch = chord[idx] * (i === 3 && bar % 3 === 0 ? 2 : 1);
        tone(
          pitch,
          s + i * tempo / 4,
          tempo * 0.46,
          scene === "boss" ? "sawtooth" : "triangle",
          scene === "cave" ? 0.042 : 0.065
        );
      }
      if (scene === "boss") {
        for (let i = 0; i < 4; i++) tone(55, s + i * tempo / 4, 0.16, "triangle", 0.08);
      }
      bar++;
      nextBar += tempo;
    }
  }
  function setScene(v) {
    scene = v;
  }
  function effect(kind) {
    start();
    const audio = ac;
    if (!audio) return;
    const pitches = {
      gather: [280, 420],
      craft: [330, 495, 660],
      hit: [155, 105],
      hurt: [105, 72],
      page: [380, 290],
      boss: [110, 82, 61],
      victory: [330, 440, 550, 770],
      mine: [170, 120],
      jump: [260, 370],
      fish: [315, 420]
    };
    const seq = pitches[kind] || pitches.page;
    seq.forEach(
      (f, i) => tone(
        f,
        audio.currentTime + i * 0.075,
        0.16,
        kind === "hurt" || kind === "boss" ? "sawtooth" : "triangle",
        0.17,
        sfxBus
      )
    );
  }
  function setVolumes(m, s) {
    settings.music = Math.max(0, Math.min(1, m));
    settings.sfx = Math.max(0, Math.min(1, s));
    if (musicBus) musicBus.gain.value = settings.music * 0.28;
    if (sfxBus) sfxBus.gain.value = settings.sfx * 0.42;
    localStorage.setItem("wildlands-audio", JSON.stringify(settings));
  }
  var Audio = { start, effect, setScene, setVolumes, settings };

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
    seenMessage: null
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
  var clamp6 = (v, a, b) => Math.max(a, Math.min(b, v));
  var fmt = (n) => String(Math.floor(n)).padStart(2, "0");
  var timeText = () => {
    const t = game.timeOfDay();
    return `DAY ${game.s.day} \xB7 ${fmt(t / 60)}:${fmt(t % 60)} \xB7 ${game.s.weather.toUpperCase()}`;
  };
  var itemUseLabel = (id) => ITEMS[id][1] === "structure" ? "PLACE" : WEAPONS[id] ? "EQUIP" : ["direwolf_cloak", "hide_coat", "explorer_boots"].includes(id) ? "WEAR" : id === "fishing_rod" ? "FISH" : ["food", "water", "medicine"].includes(ITEMS[id][1]) ? "USE" : "";
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
    $("menu-panel").innerHTML = `<h2>Sound & settings</h2><label>Music <input id="music-volume" type="range" min="0" max="100" value="${Math.round(a.music * 100)}"></label><label>Effects <input id="sfx-volume" type="range" min="0" max="100" value="${Math.round(a.sfx * 100)}"></label><p>The score and effects are made live by your browser. Your volume choices are saved here.</p><button id="panel-close" class="ink-button">Close this page</button>`;
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
      sound(result.action === "beasts" ? "boss" : result.action === "recipes" ? "page" : "gather");
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
    if (r.ok) sound(r.hit ? "hit" : "page");
    else if (r.reason && r.reason !== "Recovering from the last strike.") message(r.reason);
    updateUI(true);
  }
  function doMine(x, y) {
    const r = game.mineTileAt(x, y);
    if (r.ok) sound("mine");
    else message(r.reason);
    updateUI(true);
  }
  addEventListener("keydown", (e) => {
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
      else sound("fish");
      updateUI(true);
    }
    if (key === " " || key === "w" || key === "arrowup") {
      if (game.jump()) sound("jump");
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
      else sound("craft");
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
          sound("craft");
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
      (r, i) => `${i === 0 || recipes[i - 1].tier !== r.tier ? `<h3 class="recipe-group">Tier ${r.tier} \xB7 ${["", "First fire", "Copper age", "Iron age", "Forgework", "Black glass", "Effergy"][r.tier]}</h3>` : ""}<div class="recipe-row"><div class="recipe-head"><strong>${pretty(r.id)}</strong><button data-craft="${r.id}" ${!game.canAfford(r.cost) || r.station && !game.near(r.station) || r.id === "effergy" && (game.count("effergy") || game.s.structures.some((st) => st.type === "effergy")) ? "disabled" : ""}>MAKE</button></div><small>${Object.entries(
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
          sound("craft");
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
    const v = game.s.vitals, current = game.biome(), symptoms = game.vitalReasons();
    left.innerHTML = `<h2>The Body</h2><p class="lede">Warmth, food, water, and rest pull each other out of balance.</p>${sketch("tool")}<h3>Exposure</h3><p>Air: <strong>${game.temperature().toFixed(0)}\xB0C</strong> in the ${current.name.toLowerCase()}<br>Body: <strong>${v.bodyTemp.toFixed(1)}\xB0C</strong><br>Weather: <strong>${game.s.weather}</strong> \xB7 ${game.isNight() ? "night" : "day"}</p><div class="note-block">${symptoms.map((s) => `<div>\u2022 ${s}</div>`).join("")}</div><div class="book-actions"><button data-wash ${game.count("wild_water") + game.count("boiled_water") ? "" : "disabled"}>WASH \xB7 1 WATER</button></div><h3>Recovery</h3><p>Good food, safe water, warmth, and rest slowly restore health. A bedroll sharply reduces fatigue. Shelter keeps off rain; a lit fire helps dry and warm you.</p>`;
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
    const biome = game.biome(), t = game.s.tutorial, current = TUTORIAL[t.step];
    left.innerHTML = `<h2>Field Notes</h2><p class="lede">Nine regions across the surface; three winding cave roads beneath them.</p><canvas id="atlas-map" class="atlas-map" width="420" height="240" aria-label="Side elevation of the nine regions and cave passages"></canvas><h3>Current ground \xB7 ${biome.name}</h3><p>${biome.note}</p><p>Typical resources: ${[...new Set(biome.resources)].map(pretty).join(", ")}.</p><div class="book-actions"><button data-save>SAVE RECORD</button><button class="quiet" data-menu>MAIN MENU</button></div>`;
    right.innerHTML = `<h2>Lessons &amp; sightings</h2><p class="lede">${current ? current[0] + " \xB7 " + Math.min(current[2], t.tally[current[1]] || 0) + "/" + current[2] : "The first field lessons are complete."}</p><ol class="objective-list">${TUTORIAL.map(([label], i) => `<li class="${i < t.step ? "done" : i === t.step ? "current" : ""}">${label}</li>`).join("")}</ol><h3>Expedition chapters</h3><ol class="objective-list">${CHAPTERS.map(([label], i) => `<li class="${i < game.s.chapter ? "done" : i === game.s.chapter ? "current" : ""}">${label}</li>`).join("")}</ol><h3>Biome ledger</h3>${BIOMES.map((b) => `<div class="biome-entry ${b.id === biome.id ? "current" : ""}"><strong>${b.name}</strong><small>${b.note}</small></div>`).join("")}<h3>Controls</h3><p>A / D move \xB7 W / Space jump and climb \xB7 S descend \xB7 E gather or interact \xB7 F strike \xB7 R / click mine \xB7 G fish \xB7 J / I journal \xB7 M map \xB7 Esc pause \xB7 1\u20135 turn pages.</p>`;
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
    ink.fillStyle = "#8a8667";
    ink.beginPath();
    ink.moveTo(0, h);
    for (let x = 0; x <= WORLD_W; x += 25) ink.lineTo(X(x), Y(surfaceAt(x)));
    ink.lineTo(w, h);
    ink.fill();
    ink.strokeStyle = "#f1dfb3";
    ink.lineWidth = 3;
    for (let level = 1; level <= 3; level++) {
      ink.beginPath();
      for (let x = 0; x <= WORLD_W; x += 35) {
        const xx = X(x), yy = Y(caveY(x, level));
        if (!x) ink.moveTo(xx, yy);
        else ink.lineTo(xx, yy);
      }
      ink.stroke();
    }
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
      $(id + "-bar").style.width = clamp6(v[id], 0, 100) + "%";
      $(id + "-value").textContent = String(Math.round(v[id]));
    });
    $("biome-name").textContent = game.biome().name.toUpperCase();
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
      const action = near.type === "node" ? near.object.kind === "water" ? "Collect wild water" : "Gather " + pretty(near.object.kind) : near.type === "cache" ? "Open field cache" : near.object.type === "effergy" ? "Open Beasts folio" : near.object.type === "farm_plot" ? "Tend farm plot" : near.object.type === "bedroll" ? "Rest" : near.object.type === "icebox" ? "Add ice" : near.object.type === "campfire" ? "Add wood" : "Use " + pretty(near.object.type);
      prompt = `<b>E</b> ${action}`;
    } else prompt = "<b>E</b> Explore and gather";
    $("interaction-prompt").innerHTML = prompt;
    const boss = game.s.animals.find((a) => a.id === game.s.altar.activeBoss && !a.deadUntil);
    $("boss-hud").classList.toggle("hidden", !boss);
    if (boss) {
      $("boss-name").textContent = BOSSES[game.s.altar.level - 1].name.toUpperCase();
      $("boss-bar").style.width = clamp6(boss.hp / boss.maxHp * 100, 0, 100) + "%";
      $("boss-value").textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
    }
    const msg = game.messages[0];
    if (msg && msg !== state.seenMessage) {
      state.seenMessage = msg;
      $("toast").textContent = msg.message;
      $("toast").classList.add("visible");
      setTimeout(() => {
        if (state.seenMessage === msg) $("toast").classList.remove("visible");
      }, 3e3);
      if (msg.tone === "danger") sound("hurt");
      if (msg.tone === "victory") sound("victory");
    }
    if (game.s.dead) {
      $("death").classList.remove("hidden");
      state.journal = false;
      $("journal").classList.add("hidden");
      sound("hurt");
    }
  }
  function camera() {
    const p = game.s.player;
    state.camera.x = clamp6(p.x - innerWidth / 2, 0, Math.max(0, WORLD_W - innerWidth));
    state.camera.y = clamp6(p.y - innerHeight / 2, 0, Math.max(0, WORLD_H - innerHeight));
  }
  function drawWorld() {
    camera();
    if (!state.playing) {
      state.camera.x = clamp6(
        3600 + Math.sin(performance.now() / 12e3) * 380 - innerWidth * 0.2,
        0,
        WORLD_W - innerWidth
      );
      state.camera.y = clamp6(
        surfaceAt(UI_RULES.menuFocalX) - innerHeight * 0.62,
        0,
        WORLD_H - innerHeight
      );
    }
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
      !state.playing ? "menu" : game.s.altar.activeBoss ? "boss" : game.s.player.y > surfaceAt(game.s.player.x) + 70 ? "cave" : ["alpine", "taiga", "tundra"].includes(game.biome().id) ? "cold" : ["desert", "badlands"].includes(game.biome().id) ? "desert" : game.biome().id === "forest" ? "forest" : "meadow"
    );
    drawWorld();
    updateUI();
    requestAnimationFrame(frame);
  }
  addEventListener("beforeunload", () => {
    if (state.playing && !game.s.dead) game.save(localStorage, true);
  });
  requestAnimationFrame(frame);
  window.Wildlands = { game, enterGame, renderJournal, state };
})();
