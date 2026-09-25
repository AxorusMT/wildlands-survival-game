import type { Objective } from '../core/types.ts';

// The first field lessons, shown one at a time in the HUD.
export const TUTORIAL: Objective[] = [
  ['Gather fallen wood', 'wood', 3],
  ['Pick up loose stone', 'stone', 3],
  ['Collect meadow fiber', 'fiber', 2],
  ['Craft a stone axe in Recipes', 'craft:stone_axe', 1],
  ['Find and gather flint', 'flint', 2],
  ['Craft a campfire', 'craft:campfire', 1],
  ['Place the campfire nearby', 'place:campfire', 1],
  ['Collect untreated water', 'wild_water', 1],
  ['Boil water at the campfire', 'craft:boiled_water', 1],
  ['Drink safe water from Pack', 'drink:boiled_water', 1],
];
// The long expedition that follows the tutorial.
export const CHAPTERS: Objective[] = [
  ['Cross into the forest', 'visit:forest', 1],
  ['Gather copper from the forest caves', 'copper_ore', 3],
  ['Make a workbench', 'craft:workbench', 1],
  ['Build a furnace', 'place:furnace', 1],
  ['Smelt a copper ingot', 'craft:copper_ingot', 1],
  ['Explore the taiga', 'visit:taiga', 1],
  ['Bring home iron ore', 'iron_ore', 3],
  ['Forge a steel ingot', 'craft:steel_ingot', 1],
  ['Enter the desert', 'visit:desert', 1],
  ['Mine black obsidian', 'obsidian', 5],
  ['Place the Effergy of Beasts', 'place:effergy', 1],
  ['Defeat an Eclipse Direwolf', 'kill:boss', 1],
  ['Defeat an Ember Direwolf', 'kill:boss', 2],
  ['Defeat the Void Direwolf', 'kill:boss', 3],
  // Beyond the Effergy: the dungeons, the Rift, and the worlds behind it.
  ['Find the Mossy Crypt beneath the forest', 'visit:crypt', 1],
  ['Slay the Hollow King', 'boss:hollow_king', 1],
  ['Build the Rift Gate and set the Sigil of Bone', 'place:rift_gate', 1],
  ['Step into the Mycelial Deep', 'visit:mycelia', 1],
  ['Slay the Rime Colossus in the Frost Keep', 'boss:rime_colossus', 1],
  ['Slay Pharaoh Ankhet in the Sunken Tomb', 'boss:pharaoh', 1],
  ['Walk the islands of Skyreach', 'visit:skyreach', 1],
  ['Slay Archdemon Vahl in the Cinder Citadel', 'boss:archdemon', 1],
  ['Slay the Sporemother', 'boss:sporemother', 1],
  ['Slay the Tempest Roc', 'boss:tempest_roc', 1],
  ['Cross into the Hollow Void', 'visit:void', 1],
  ['Unmake the Unmaker', 'boss:unmaker', 1],
];
