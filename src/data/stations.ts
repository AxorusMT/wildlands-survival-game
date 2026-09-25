// Station upgrade lines, the pack's carrying capacity, and what the research desk reveals.
// An upgraded station does everything the ones below it did, adds recipes of its own, and turns
// out weapons of better quality.

/** What each station also counts as (an upgraded station does the work of the ones below). */
export const STATION_LINES: Record<string, string[]> = {
  tinkers_bench: ['workbench'],
  artisan_bench: ['workbench', 'tinkers_bench'],
  forge: ['furnace'],
  starforge: ['forge', 'furnace'],
  rift_forge: ['starforge', 'forge', 'furnace'],
  laboratory: ['apothecary'],
  hearth: ['campfire'],
  kitchen: ['hearth', 'campfire'],
};
/** Quality luck for weapons made at each station. */
export const STATION_QUALITY: Record<string, number> = {
  tinkers_bench: 1.15,
  artisan_bench: 1.35,
  starforge: 1.1,
  rift_forge: 1.4,
};

/** Kilograms each kind of item weighs, and a few heavier or lighter exceptions. */
export const CATEGORY_WEIGHT: Record<string, number> = {
  material: 0.2,
  ore: 0.5,
  food: 0.3,
  water: 0.5,
  medicine: 0.1,
  metal: 0.8,
  tool: 1.5,
  weapon: 3,
  clothing: 1.5,
  trophy: 1,
  structure: 4,
  armor: 4,
  accessory: 0.3,
  block: 0.2,
  potion: 0.3,
  ammo: 0.05,
  key: 0.1,
  wall: 0.2,
  coin: 0.005,
};
export const WEIGHT_OVERRIDE: Record<string, number> = {
  wood: 0.4,
  stone: 0.4,
  ice: 0.6,
  satchel: 0.5,
  pack: 1,
  expedition_frame: 2,
};
/** Carrying capacity: a base, and what each kind of pack adds (the best one carried counts). */
export const BASE_CAPACITY = 120;
export const PACKS: Record<string, number> = {
  satchel: 40,
  pack: 90,
  expedition_frame: 180,
};

/** Items the research desk can study, and what studying them teaches. */
export const RESEARCH_RENOWN = 25;
