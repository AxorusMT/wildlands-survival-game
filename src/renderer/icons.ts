// Item icons: 16×16 pixel art built from a few templates and a material colour, shared by the
// drops lying in the world, the item held in hand, and every inventory slot in the journal.
import { WALLS } from '../data/town.ts';

import { GROUND } from './art.ts';
import { Painter, cached, ramp, shade, sprite, type Sprite } from './px.ts';

/** Metal and material colours that tools, weapons, and armour take their look from. */
export const MATERIAL: Record<string, string> = {
  wood: '#8a6440',
  stone: '#8b8f8a',
  flint: '#6a7074',
  bone: '#e6dcc6',
  copper: '#d0844a',
  rift: '#ff6ad5',
  tidecaller: '#5ac8c0',
  ashwalker: '#8a7a6a',
  amberguard: '#e8a030',
  prismweave: '#a8d8f0',
  bonewalker: '#d8ceb4',
  gearwright: '#b8883a',
  saltwarden: '#ece6da',
  choirsilver: '#a8c0e0',
  plaguedoctor: '#3a3a2a',
  astral: '#9ab0ff',
  gilded: '#f0c850',
  leviathan: '#5a9ac0',
  forgeborn: '#8a2a1a',
  druid: '#8ad070',
  ascended: '#e8d8ff',
  warden: '#8a9098',
  bulwark: '#c04a3a',
  aegis: '#f0e0a0',
  stalker: '#4a6a3a',
  farstrider: '#7a9a4a',
  windrider: '#bfe0d8',
  acolyte: '#6a4a8a',
  magus: '#8a4ac8',
  archon: '#e0a0ff',
  drifter: '#9a7a58',
  nomad: '#c8a070',
  voyager: '#5ac8e8',
  silver: '#dfe4ea',
  gold: '#f0c850',
  ruby: '#e8304a',
  sapphire: '#3a7ae8',
  emerald: '#2ac870',
  iron: '#a8a4a0',
  steel: '#dfe3e6',
  obsidian: '#4a3a64',
  hellstone: '#e04a2a',
  hellfire: '#ff6a2a',
  eclipse: '#9fe8f0',
  crypt: '#9ab88a',
  frost: '#aee4f4',
  sun: '#f0c860',
  cinder: '#ff8a3a',
  myconite: '#58e0d0',
  starmetal: '#f8e08a',
  voidsteel: '#b36cff',
  hide: '#a47c55',
  direwolf: '#6a6e7a',
  glass: '#bfe8f0',
  clay: '#b06f55',
  sandstone: '#e0c890',
  tomb: '#c8a060',
  citadel: '#5a2a30',
  glowshroom: '#2f7a72',
};
const matOf = (id: string) => {
  for (const k of Object.keys(MATERIAL)) if (id.startsWith(k + '_')) return MATERIAL[k];
  return '#b8b0a0';
};

type Tpl =
  | 'axe'
  | 'pick'
  | 'sword'
  | 'spear'
  | 'bow'
  | 'staff'
  | 'hammer'
  | 'rod'
  | 'arrow'
  | 'wand'
  | 'gun'
  | 'ingot'
  | 'ore'
  | 'gem'
  | 'lump'
  | 'log'
  | 'block'
  | 'bundle'
  | 'berries'
  | 'meat'
  | 'fish'
  | 'bread'
  | 'bowl'
  | 'bottle'
  | 'potion'
  | 'helmet'
  | 'chest'
  | 'legs'
  | 'boots'
  | 'cloak'
  | 'fang'
  | 'pelt'
  | 'core'
  | 'sigil'
  | 'key'
  | 'torch'
  | 'crate'
  | 'mushroom'
  | 'seed'
  | 'bone'
  | 'feather'
  | 'crystal'
  | 'orb'
  | 'ring'
  | 'heart'
  | 'star'
  | 'scroll'
  | 'bomb'
  | 'wall'
  | 'coin'
  | 'chair'
  | 'table'
  | 'bed'
  | 'door'
  | 'bucket'
  | 'rope'
  | 'hook'
  | 'crossbow'
  | 'tome'
  | 'whip';
/** Explicit icons; anything not listed is guessed from its id. */
export const ICONS: Record<string, [Tpl, string, string?]> = {
  wood: ['log', '#8a6440'],
  stone: ['lump', '#8b8f8a'],
  fiber: ['bundle', '#8fa35a'],
  flint: ['lump', '#4a5054'],
  clay: ['lump', '#b06f55'],
  coal: ['lump', '#2c2c30'],
  ice: ['gem', '#bfe3ee'],
  obsidian: ['gem', '#3a2a54'],
  sulfur: ['ore', '#e0c94a'],
  hide: ['pelt', '#a47c55'],
  bone: ['bone', '#e6dcc6'],
  resin: ['bottle', '#d99a3c'],
  reeds: ['bundle', '#a4a86a'],
  salt: ['lump', '#ece8de'],
  crystal: ['crystal', '#8fe3df'],
  hellstone: ['ore', '#e04a2a', '#5a1c22'],
  chitin: ['pelt', '#5a4032'],
  venom: ['bottle', '#7bc05a'],
  feathers: ['feather', '#eef0ea'],
  dirt: ['block', '#8a6a4c'],
  berry: ['berries', '#c8324a'],
  mushroom: ['mushroom', '#c9a07a'],
  honey: ['bottle', '#dcaa4e'],
  wheat: ['bundle', '#e0c060'],
  potato: ['lump', '#b99468'],
  herb: ['bundle', '#5f9a55'],
  willow: ['bundle', '#8a7a5a'],
  raw_meat: ['meat', '#c65a5a'],
  cooked_meat: ['meat', '#8a4a2a'],
  smoked_meat: ['meat', '#6a3422'],
  bread: ['bread', '#c8904a'],
  cactus_fruit: ['berries', '#d8577a'],
  raw_fish: ['fish', '#8ab0c0'],
  cooked_fish: ['fish', '#b8804a'],
  trail_ration: ['crate', '#8a7a5a'],
  potato_stew: ['bowl', '#b8804a'],
  wild_water: ['bottle', '#7ab0c8'],
  boiled_water: ['bottle', '#bfe8f4'],
  herbal_tea: ['potion', '#8ac070'],
  poultice: ['bowl', '#7a9a5a'],
  fever_remedy: ['potion', '#c89a5a'],
  antibiotic: ['potion', '#e8e0c0'],
  antivenom: ['potion', '#6ad0a0'],
  warming_brew: ['potion', '#e87a3a'],
  fishing_rod: ['rod', '#8a6440'],
  direwolf_cloak: ['cloak', '#6a6e7a'],
  hide_coat: ['chest', '#8a6e4e'],
  explorer_boots: ['boots', '#6b5139'],
  cinder_ward: ['orb', '#ff8a3a'],
  eclipse_fang: ['fang', '#cdeaff'],
  direwolf_pelt: ['pelt', '#5a5e6a'],
  beast_core: ['core', '#e3baf7'],
  eclipse_blade: ['sword', '#9fe8f0', '#221f2a'],
  hellfire_blade: ['sword', '#ff6a2a', '#3a1418'],
  obsidian_blade: ['sword', '#4a3a64', '#a07fd0'],
  // Dungeons and dimensions.
  sigil_crypt: ['sigil', '#9ae8c0'],
  sigil_frost: ['sigil', '#9fd8ec'],
  sigil_sun: ['sigil', '#ffd86a'],
  sigil_cinder: ['sigil', '#ff6a2a'],
  spore_heart: ['heart', '#58e0d0'],
  roc_plume: ['feather', '#8aa0c8'],
  fallen_star: ['star', '#f8e08a'],
  life_crystal: ['heart', '#e8475a'],
  mana_crystal: ['star', '#5a8ae8'],
  life_fruit: ['berries', '#ff6a3a'],
  gel: ['orb', '#5ab84a'],
  silk: ['bundle', '#e8e4f0'],
  grave_dust: ['seed', '#8a9a7a'],
  frost_shard: ['gem', '#bfe8f8'],
  linen: ['bundle', '#d8c8a0'],
  sun_gold: ['ingot', '#f0c860'],
  cinder_core: ['core', '#ff6a2a'],
  spores: ['seed', '#58e0d0'],
  glowcap: ['mushroom', '#58e0d0'],
  sunbloom: ['berries', '#ffd86a'],
  void_lily: ['berries', '#ff6ad5'],
  sky_silk: ['bundle', '#bfe4ff'],
  void_essence: ['orb', '#b36cff'],
  watcher_lens: ['orb', '#ff5a8a'],
  shroom_wood: ['log', '#8a7a9a'],
  sky_wood: ['log', '#e8e0cf'],
  void_wood: ['log', '#4a3a5a'],
  sand: ['block', '#dcc38e'],
  mycelium: ['block', '#5a4a6a'],
  fungal_stone: ['block', '#4a3f5e'],
  cloud: ['block', '#f4f4f8'],
  skystone: ['block', '#cfc4b0'],
  voidstone: ['block', '#2e1c46'],
  void_crystal: ['crystal', '#a06cf0'],
  demon_wings: ['cloak', '#8a2a2a'],
  cloud_jar: ['bottle', '#e8f0ff'],
  miners_lamp: ['torch', '#e8c86a'],
  magma_stone: ['lump', '#e05a2a'],
  watcher_eye: ['orb', '#ff5a8a'],
  band_of_vigor: ['ring', '#e8c84a', '#ff5a7a'],
  scarab_charm: ['ring', '#2a5a6a', '#e8c040'],
  mycelial_charm: ['ring', '#6a4a8a', '#58e0d0'],
  hollow_crown: ['helmet', '#e8c84a'],
  wildlands_crown: ['helmet', '#f8d86a'],
  rift_gate: ['sigil', '#6a5a8a'],
  starforge: ['crate', '#5a4a7a'],
  healing_draught: ['potion', '#e8475a'],
  greater_healing: ['potion', '#ff2a5a'],
  mana_draught: ['potion', '#4a7ae8'],
  spore_lure: ['orb', '#58e0d0'],
  storm_totem: ['staff', '#bfe4ff'],
  void_seal: ['sigil', '#b36cff'],
  rift_blade: ['sword', '#d8a0ff', '#2a1c3a'],
  frostbrand: ['sword', '#bfe8f8', '#4a6a8a'],
  hellrazor: ['sword', '#ff6a2a', '#2a0a0a'],
  sunspear: ['spear', '#f0c860'],
  // Realms.
  waystone: ['sigil', '#6a6a74'],
  orchard_fragment: ['scroll', '#5a9a8a'],
  steppe_fragment: ['scroll', '#b8845a'],
  warren_fragment: ['scroll', '#c8882a'],
  orchard_key: ['key', '#5ac8c0'],
  steppe_key: ['key', '#ff8a3a'],
  warren_key: ['key', '#e8a030'],
  brinewood: ['log', '#6a7a6a'],
  tide_pearl: ['orb', '#e8f4f0'],
  crab_shell: ['pelt', '#c86a4a'],
  bog_apple: ['berries', '#b8583a'],
  brinesoil: ['block', '#5a6a58'],
  tidecaller_spear: ['spear', '#5ac8c0'],
  brine_wand: ['wand', '#5ac8c0'],
  tide_conch: ['core', '#f0d8c8'],
  mother_heart: ['heart', '#5a8a6a'],
  cinderflax: ['bundle', '#a08a70'],
  ashcloth: ['bundle', '#6a5e56'],
  kilnstone_ore: ['ore', '#ff8a3a', '#6a4a3a'],
  kiln_ingot: ['ingot', '#c8704a'],
  ash_hide: ['pelt', '#5a5450'],
  ash_soil: ['block', '#6a5e56'],
  kilnrock: ['block', '#8a5a44'],
  kiln_greataxe: ['axe', '#c8704a', '#3a2018'],
  ember_sling: ['wand', '#ff8a3a'],
  kiln_heart: ['core', '#ff8a3a'],
  kiln_core: ['core', '#ffc070'],
  burrow_amber: ['gem', '#e8a030'],
  beetle_carapace: ['pelt', '#8a5a1a'],
  warren_earth: ['block', '#7a5a36'],
  amberstone: ['block', '#c8882a'],
  amber_repeater: ['bow', '#e8a030'],
  amber_pick: ['pick', '#e8a030'],
  queens_mandible: ['fang', '#e8a030'],
  queen_jelly: ['bottle', '#ffe8a0'],
  topaz: ['gem', '#f0b040'],
  // Band II and III realms.
  mycelial_fragment: ['scroll', '#58e0d0'],
  mycelial_key: ['key', '#58e0d0'],
  glasswood_fragment: ['scroll', '#a8d8f0'],
  marches_fragment: ['scroll', '#d8ceb4'],
  barrow_fragment: ['scroll', '#b8883a'],
  saltflats_fragment: ['scroll', '#ece6da'],
  choir_fragment: ['scroll', '#a8c0e0'],
  glasswood_key: ['key', '#9ad8ff'],
  marches_key: ['key', '#d8ceb4'],
  barrow_key: ['key', '#f0c870'],
  saltflats_key: ['key', '#f0a0b0'],
  choir_key: ['key', '#bfe0ff'],
  steam_vent: ['crate', '#8a6a3a'],
  // Band IV and V realms.
  feverlands_fragment: ['scroll', '#b8c870'],
  feverlands_key: ['key', '#b8c870'],
  observatory_fragment: ['scroll', '#8a9aff'],
  observatory_key: ['key', '#8a9aff'],
  gutter_fragment: ['scroll', '#d8b848'],
  gutter_key: ['key', '#d8b848'],
  undertow_fragment: ['scroll', '#5a9ac0'],
  undertow_key: ['key', '#5a9ac0'],
  emberheart_fragment: ['scroll', '#ff8a3a'],
  emberheart_key: ['key', '#ff8a3a'],
  garden_fragment: ['scroll', '#8ad070'],
  garden_key: ['key', '#8ad070'],
  diving_bell: ['crate', '#5a9ac0'],
  fracture_shard: ['crystal', '#d8a0ff'],
  lore_tablet: ['scroll', '#8b8f8a'],
  cairn: ['lump', '#8b8f8a'],
  merchant_stall: ['crate', '#c85a4a'],
  tinkers_bench: ['crate', '#8a6440'],
  artisan_bench: ['crate', '#6a3a2a'],
  rift_forge: ['crate', '#b36cff'],
  laboratory: ['bottle', '#58e0d0'],
  hearth: ['crate', '#8b8f8a'],
  research_desk: ['scroll', '#e8dcc0'],
  satchel: ['pelt', '#a47c55'],
  pack: ['pelt', '#8a6440'],
  expedition_frame: ['crate', '#6a4a30'],
  repair_kit: ['crate', '#a8a4a0'],
  whetstone: ['gem', '#8fe3df'],
  panacea: ['potion', '#e8f070'],
  linen_underlayer: ['legs', '#e8e0c8'],
  wool_underlayer: ['legs', '#c8b8a0'],
  silk_underlayer: ['legs', '#f0f0f8'],
  hide_vest: ['chest', '#a47c55'],
  fur_jerkin: ['chest', '#8a6a4a'],
  linen_shirt: ['chest', '#e8e0c8'],
  oilskin_coat: ['cloak', '#6a6a3a'],
  fur_cloak: ['cloak', '#8a6a4a'],
  desert_robe: ['cloak', '#e8d8b0'],
  rime_parka: ['cloak', '#bfe3ee'],
  ember_mantle: ['cloak', '#c8704a'],
  waterskin: ['bottle', '#a47c55'],
  insulated_flask: ['bottle', '#d0844a'],
  rime_flask: ['bottle', '#dfeaf6'],
  cold_box: ['crate', '#8fb8d0'],
  purification_tablet: ['gem', '#f0f0e8'],
  fish_oil: ['bottle', '#e8c060'],
  distiller: ['crate', '#c8804a'],
  smoking_rack: ['crate', '#6a4a30'],
  canning_kettle: ['crate', '#5a5e64'],
  ice_harvester: ['crate', '#bfe3ee'],
  smoked_fish: ['fish', '#b86a3a'],
  canned_stew: ['bowl', '#a8a4a0'],
  canned_fruit: ['bowl', '#c85a6a'],
  fractured_key: ['key', '#e0c0ff'],
  ascended_ingot: ['ingot', '#e8d8ff'],
  world_prism: ['gem', '#f0d8ff'],
  respirator: ['ring', '#8a9aa8'],
  plague_ivory: ['ore', '#e6dcc6', '#5a6a3a'],
  fever_bloom: ['bundle', '#e8f070'],
  fever_loam: ['block', '#5a6a34'],
  plague_rock: ['block', '#d8d0b0'],
  venom_blade: ['sword', '#8ad070'],
  plague_censer: ['tome', '#b8c870'],
  rot_mask: ['core', '#6a7a3a'],
  rot_heart: ['heart', '#8a9a3a'],
  fever_tonic: ['bottle', '#e8f070'],
  astral_lens: ['crystal', '#9ab0ff'],
  starglass: ['block', '#3a4a8a'],
  observatory_stone: ['block', '#4a4a6a'],
  astral_tome: ['tome', '#9ab0ff'],
  star_spear: ['spear', '#fff0c0'],
  astrolabe: ['ring', '#d8b848'],
  astronomer_eye: ['orb', '#bfd0ff'],
  crown_gold: ['ore', '#f0c850', '#5a4a2a'],
  sewer_brick: ['block', '#5a5444'],
  crown_rock: ['block', '#8a7030'],
  gilded_greatblade: ['sword', '#f0c850'],
  thiefs_whip: ['whip', '#6a5a4a'],
  pauper_crown: ['star', '#d8b848'],
  kings_ransom: ['coin', '#f0c850'],
  purging_salts: ['bottle', '#ece8de'],
  abyssal_pearl: ['orb', '#bfe8ff'],
  abyss_sand: ['block', '#8a9aa0'],
  pearl_rock: ['block', '#b8b0c8'],
  leviathan_harpoon: ['spear', '#5a9ac0'],
  tidebreaker: ['crossbow', '#5a9ac0'],
  leviathan_scale: ['pelt', '#5a9ac0'],
  leviathan_heart: ['heart', '#5a9ac0'],
  heartstone: ['ore', '#ff8a3a', '#3a1a10'],
  heartstone_block: ['block', '#8a2a1a'],
  slag: ['block', '#3a3438'],
  anvil_maul: ['hammer', '#ff8a3a', '#3a2018'],
  heartfire_staff: ['staff', '#ff8a3a'],
  anvil_spark: ['core', '#ffb060'],
  anvil_heart: ['heart', '#ff6a2a'],
  seasonbloom: ['bundle', '#f0a0c0'],
  bloom_loam: ['block', '#5a7a3a'],
  seasonstone: ['block', '#a8a088'],
  season_bow: ['bow', '#8ad070'],
  thornlash: ['whip', '#6a8a3a'],
  seasons_seed: ['seed', '#d8703a'],
  warden_face: ['core', '#d8703a'],
  prism_glass: ['crystal', '#a8e0ff'],
  lumen_moss: ['bundle', '#e8f0a0'],
  glassloam: ['block', '#9aa8b8'],
  prismrock: ['block', '#a8d8f0'],
  prism_wand: ['wand', '#9ad8ff'],
  shard_glaive: ['spear', '#a8e0ff'],
  lumen_antler: ['fang', '#fff8c0'],
  stag_heart: ['heart', '#fff0a0'],
  lumen_tincture: ['bottle', '#e8f0a0'],
  marrow_iron_ore: ['ore', '#d8ceb4', '#5a5448'],
  marrow_ingot: ['ingot', '#c8bca0'],
  marrow_mud: ['block', '#5e5a4a'],
  bonerock: ['block', '#d8ceb4'],
  bonecleaver: ['axe', '#d8ceb4', '#4a4438'],
  vertebra_whip: ['whip', '#e6dcc6'],
  hydra_tooth: ['fang', '#e6dcc6'],
  hydra_heart: ['heart', '#8a9a5a'],
  marrow_purge: ['bottle', '#8a9a5a'],
  brass_gear: ['ore', '#f0c870', '#5a4a34'],
  brass_ingot: ['ingot', '#d8a048'],
  brass_plate: ['block', '#b8883a'],
  gearstone: ['block', '#6a5a44'],
  brass_repeater: ['crossbow', '#d8a048'],
  piston_hammer: ['hammer', '#d8a048', '#3a2a12'],
  saint_cog: ['ring', '#f0c870'],
  engine_heart: ['core', '#f0c870'],
  saltglass: ['crystal', '#f0c0c8'],
  saltcrust: ['block', '#ece6da'],
  saltglass_rock: ['block', '#e8c0c8'],
  mirage_blade: ['sword', '#f0c0c8'],
  saltglass_bow: ['bow', '#f0c0c8'],
  tyrant_eye: ['orb', '#ffb060'],
  mirage_crown: ['star', '#fff0c0'],
  rime_silver_ore: ['ore', '#e8f4ff', '#5a6a7a'],
  rime_silver: ['ingot', '#dfeaf6'],
  frost_lily: ['berries', '#bfe0ff'],
  bell_bronze: ['lump', '#c8904a'],
  rimesnow: ['block', '#e4eef6'],
  choirstone: ['block', '#a8b8cc'],
  choir_stave: ['staff', '#bfe0ff'],
  bellhammer: ['hammer', '#c8904a', '#3a3028'],
  hymnal_bell: ['ring', '#c8904a'],
  hymnal_core: ['core', '#bfe0ff'],
  // Keeping food.
  cool_pit: ['crate', '#6a6660'],
  relic_shelf: ['crate', '#b8903a'],
  snow_cellar: ['crate', '#dfeaf2'],
  frost_chest: ['crate', '#8fc0d8'],
  rime_vault: ['crate', '#6a7a98'],
  salting_barrel: ['crate', '#8a6440'],
  kitchen: ['crate', '#8a7a6a'],
  water_filter: ['bottle', '#dcc38e'],
  insulated_satchel: ['pelt', '#a47c55'],
  frost_lined_pack: ['pelt', '#8fc0d8'],
  rime_lined_pack: ['pelt', '#f8e08a'],
  salted_meat: ['meat', '#a8584a'],
  salted_fish: ['fish', '#a0a8a8'],
  pickled_mushrooms: ['bottle', '#b89068'],
  berry_preserves: ['bottle', '#c8324a'],
  hearty_stew: ['bowl', '#8a5a3a'],
  fish_chowder: ['bowl', '#e8dcc0'],
  spiced_skewers: ['meat', '#c8583a'],
  honey_cakes: ['bread', '#e0b060'],
  mushroom_broth: ['bowl', '#b89068'],
  orchard_pie: ['bread', '#b8583a'],
  ember_chili: ['bowl', '#e04a2a'],
  explorers_feast: ['bowl', '#f0c860'],
  brackish_water: ['bottle', '#6a8a70'],
  filtered_water: ['bottle', '#cfeef8'],
  rehydration_salts: ['bundle', '#ece8de'],
  vermifuge: ['potion', '#8a9a4a'],
  frost_salve: ['bowl', '#bfe8f8'],
  burn_salve: ['bowl', '#e8b060'],
  bandage: ['bundle', '#f0ece0'],
  splint: ['log', '#b89468'],
  lungwort_tea: ['potion', '#58e0d0'],
  void_salve: ['bowl', '#b36cff'],
  rabies_serum: ['potion', '#e8e0c0'],
  field_vaccine: ['potion', '#9ae8c0'],
  iron_gut_brew: ['potion', '#8a9a6a'],
  onyx: ['gem', '#3a3440'],
  opal: ['gem', '#e8f0f8'],
  fire_infusion: ['potion', '#ff8a3a'],
  frost_infusion: ['potion', '#9fd8ec'],
  venom_infusion: ['potion', '#7bc05a'],
  void_infusion: ['potion', '#b36cff'],
  holy_infusion: ['potion', '#fff0a0'],
  storm_infusion: ['potion', '#bfe4ff'],
  // Homes and trade.
  coin: ['coin', '#dfe4ea'],
  chair: ['chair', '#8a6440'],
  table: ['table', '#8a6440'],
  bed: ['bed', '#8a3a3a'],
  door: ['door', '#7a5a3c'],
  bucket: ['bucket', '#a8a4a0'],
  water_bucket: ['bucket', '#a8a4a0', '#5a9cbc'],
  rope: ['rope', '#c8a878'],
  grappling_hook: ['hook', '#a8a4a0'],
  ruby: ['gem', '#e8304a'],
  sapphire: ['gem', '#3a7ae8'],
  emerald: ['gem', '#2ac870'],
  silver_ore: ['ore', '#dfe4ea', '#6c6e74'],
  gold_ore: ['ore', '#f0c850', '#6e665a'],
};

/** Paints an icon template into a 16×16 painter (plus outline border). */
function paint(p: Painter, tpl: Tpl, col: string, col2?: string) {
  const [, d, m, l, ll] = ramp(col);
  const handle = '#7a5a3c',
    handleD = '#5a3f2a';
  const diag = (x0: number, y0: number, n: number, c: string, w = 1) => {
    for (let i = 0; i < n; i++) for (let k = 0; k < w; k++) p.set(x0 + i + k, y0 - i, c);
  };
  switch (tpl) {
    case 'axe':
      diag(3, 14, 11, handle, 2);
      p.poly(
        [
          [8, 2],
          [13, 4],
          [14, 9],
          [10, 7],
        ],
        m,
      );
      p.line(13, 4, 14, 9, l);
      p.line(8, 2, 10, 7, d);
      break;
    case 'pick':
      diag(3, 14, 10, handle, 2);
      for (let i = 0; i < 12; i++)
        p.rect(2 + i, 2 + Math.round(((i - 6) * (i - 6)) / 9), 1, 2, i < 5 ? l : m);
      p.set(2, 5, d);
      p.set(13, 5, d);
      break;
    case 'sword':
      diag(4, 11, 10, m, 2);
      diag(5, 11, 9, l);
      p.set(14, 1, ll);
      p.line(2, 9, 6, 13, col2 ?? '#9a8a60');
      diag(1, 15, 3, col2 ? shade(col2, -0.2) : handleD, 2);
      break;
    case 'spear':
      diag(1, 15, 11, handle, 1);
      diag(2, 15, 10, handleD, 1);
      p.poly(
        [
          [11, 5],
          [15, 1],
          [11, 1],
          [10, 4],
        ],
        m,
      );
      p.set(14, 1, l);
      p.line(10, 6, 9, 5, '#d8c79a');
      break;
    case 'bow':
      for (let i = 0; i < 12; i++) {
        const a = (i / 11) * Math.PI;
        p.rect(Math.round(3 + Math.sin(a) * 7), Math.round(2 + i * 1.1), 2, 1, i % 4 ? m : d);
      }
      p.line(4, 2, 4, 14, '#e8e0d0');
      break;
    case 'staff':
    case 'wand':
      diag(2, 15, tpl === 'staff' ? 11 : 8, handle, tpl === 'staff' ? 2 : 1);
      p.ellipse(tpl === 'staff' ? 13 : 11, tpl === 'staff' ? 3 : 5, 2.5, 2.5, m);
      p.set(tpl === 'staff' ? 12 : 10, tpl === 'staff' ? 2 : 4, ll);
      break;
    case 'hammer':
      diag(3, 14, 9, handle, 2);
      p.poly(
        [
          [7, 3],
          [11, 0],
          [15, 5],
          [11, 8],
        ],
        m,
      );
      p.line(7, 3, 11, 0, l);
      break;
    case 'rod':
      diag(1, 15, 13, handle, 1);
      p.line(14, 2, 14, 12, '#e8e8e0');
      p.rect(13, 12, 2, 2, '#c8324a');
      break;
    case 'arrow':
      diag(2, 14, 10, '#b89468', 1);
      p.poly(
        [
          [11, 5],
          [15, 1],
          [11, 1],
        ],
        m,
      );
      p.rect(1, 13, 3, 1, '#e8e0d0');
      p.rect(2, 14, 1, 2, '#e8e0d0');
      break;
    case 'gun':
      p.rect(2, 6, 12, 3, m);
      p.rect(3, 9, 3, 5, handle);
      p.rect(2, 6, 12, 1, l);
      break;
    case 'ingot':
      p.poly(
        [
          [2, 11],
          [5, 6],
          [15, 6],
          [13, 11],
        ],
        m,
      );
      p.poly(
        [
          [5, 6],
          [15, 6],
          [14, 8],
          [4, 8],
        ],
        l,
      );
      p.rect(2, 11, 12, 2, d);
      p.set(6, 7, ll);
      break;
    case 'ore':
      p.ellipse(8, 9, 6.5, 5, col2 ?? '#6d6a64');
      for (const [x, y] of [
        [5, 7],
        [9, 6],
        [7, 10],
        [11, 10],
        [10, 8],
      ])
        p.rect(x, y, 2, 2, m);
      p.set(6, 7, ll);
      break;
    case 'gem':
    case 'crystal':
      p.poly(
        [
          [8, 1],
          [13, 6],
          [8, 15],
          [3, 6],
        ],
        m,
      );
      p.poly(
        [
          [8, 1],
          [8, 15],
          [3, 6],
        ],
        l,
      );
      p.line(3, 6, 13, 6, ll);
      if (tpl === 'crystal')
        p.poly(
          [
            [12, 7],
            [15, 10],
            [12, 15],
            [10, 10],
          ],
          d,
        );
      break;
    case 'lump':
      p.ellipse(8, 9, 6.5, 5, m);
      p.shadeEdges(0.25, -0.3);
      p.rect(5, 6, 2, 1, l);
      break;
    case 'log':
      for (const [x, y] of [
        [1, 9],
        [5, 5],
        [3, 12],
      ] as const) {
        p.rect(x, y, 10, 4, m);
        p.rect(x, y, 10, 1, l);
        p.rect(x + 9, y, 3, 4, '#d8b888');
        p.set(x + 10, y + 1, '#b89468');
      }
      break;
    case 'block':
      p.rect(2, 2, 12, 12, m);
      p.rect(2, 2, 12, 1, l);
      p.rect(2, 2, 1, 12, l);
      p.rect(2, 13, 12, 1, d);
      p.rect(13, 2, 1, 12, d);
      for (const [x, y] of [
        [5, 5],
        [9, 8],
        [6, 10],
      ])
        p.set(x, y, d);
      break;
    case 'bundle':
      for (let i = 0; i < 6; i++) p.line(3 + i * 2, 15, 5 + i, 1 + (i % 2), i % 2 ? m : l);
      p.rect(3, 9, 11, 2, '#6b4f37');
      break;
    case 'berries':
      for (const [x, y] of [
        [5, 8],
        [10, 8],
        [7, 11],
        [8, 5],
      ]) {
        p.ellipse(x, y, 2.6, 2.6, m);
        p.set(x - 1, y - 1, ll);
      }
      p.line(8, 2, 9, 4, '#5a7a3a');
      break;
    case 'meat':
      p.ellipse(8, 8, 6, 4.5, m);
      p.ellipse(7, 7, 3.5, 2, l);
      p.rect(12, 11, 3, 2, '#e6dcc6');
      p.rect(14, 10, 1, 4, '#e6dcc6');
      break;
    case 'fish':
      p.ellipse(7, 8, 5.5, 3, m);
      p.poly(
        [
          [11, 8],
          [15, 4],
          [15, 12],
        ],
        d,
      );
      p.set(4, 7, '#1a1614');
      p.line(4, 10, 9, 10, l);
      break;
    case 'bread':
      p.ellipse(8, 9, 6.5, 4, m);
      p.ellipse(8, 8, 5.5, 3, l);
      for (const x of [5, 8, 11]) p.line(x, 7, x + 1, 9, d);
      break;
    case 'bowl':
      p.poly(
        [
          [2, 8],
          [14, 8],
          [11, 14],
          [5, 14],
        ],
        '#8a6440',
      );
      p.rect(3, 7, 10, 2, m);
      p.set(6, 7, ll);
      break;
    case 'bottle':
    case 'potion':
      p.rect(6, 1, 4, 2, '#a88458');
      p.rect(6, 3, 4, 2, '#d8e8ec');
      if (tpl === 'potion') p.ellipse(8, 10, 5, 5, '#d8e8ec');
      else p.rect(4, 5, 8, 10, '#d8e8ec');
      for (let y = 7; y < 16; y++)
        for (let x = 3; x < 13; x++) if (p.alpha(x, y)) p.set(x, y, y === 7 ? l : m);
      p.rect(tpl === 'potion' ? 5 : 5, 8, 1, 3, '#ffffff');
      break;
    case 'helmet':
      p.ellipse(8, 8, 6, 6, m);
      for (let y = 9; y < 16; y++) for (let x = 0; x < 16; x++) p.clear(x, y);
      p.rect(2, 8, 12, 2, d);
      p.rect(4, 4, 3, 2, l);
      p.rect(7, 8, 2, 5, d);
      break;
    case 'chest':
      p.poly(
        [
          [3, 2],
          [13, 2],
          [15, 7],
          [13, 7],
          [13, 15],
          [3, 15],
          [3, 7],
          [1, 7],
        ],
        m,
      );
      p.rect(3, 2, 10, 1, l);
      p.line(8, 3, 8, 14, d);
      p.rect(3, 10, 10, 1, d);
      break;
    case 'legs':
      p.rect(3, 2, 10, 4, m);
      p.rect(3, 6, 4, 9, m);
      p.rect(9, 6, 4, 9, m);
      p.rect(3, 2, 10, 1, l);
      p.rect(3, 14, 4, 1, d);
      p.rect(9, 14, 4, 1, d);
      break;
    case 'boots':
      p.rect(3, 3, 4, 9, m);
      p.rect(3, 12, 7, 3, m);
      p.rect(9, 5, 4, 7, d);
      p.rect(9, 12, 6, 3, d);
      p.rect(3, 3, 4, 1, l);
      break;
    case 'cloak':
      p.poly(
        [
          [5, 1],
          [11, 1],
          [15, 15],
          [1, 15],
        ],
        m,
      );
      p.line(5, 1, 1, 15, l);
      p.rect(5, 1, 6, 2, d);
      p.line(8, 4, 8, 14, d);
      break;
    case 'fang':
      p.poly(
        [
          [3, 2],
          [9, 2],
          [7, 15],
        ],
        m,
      );
      p.line(3, 2, 7, 15, ll);
      p.rect(3, 1, 7, 2, '#a88458');
      break;
    case 'pelt':
      p.poly(
        [
          [3, 3],
          [13, 3],
          [15, 7],
          [13, 14],
          [3, 14],
          [1, 7],
        ],
        m,
      );
      for (let i = 0; i < 12; i++) p.set(3 + i, 5 + ((i * 7) % 7), d);
      p.rect(3, 3, 10, 1, l);
      break;
    case 'core':
    case 'orb':
      p.ellipse(8, 8, 6, 6, d);
      p.ellipse(8, 8, 4.5, 4.5, m);
      p.rect(6, 5, 2, 2, ll);
      break;
    case 'sigil':
      p.poly(
        [
          [8, 1],
          [15, 8],
          [8, 15],
          [1, 8],
        ],
        d,
      );
      p.poly(
        [
          [8, 4],
          [12, 8],
          [8, 12],
          [4, 8],
        ],
        m,
      );
      p.rect(7, 7, 2, 2, ll);
      break;
    case 'key':
      p.ellipse(5, 5, 3.5, 3.5, m);
      p.clear(5, 5);
      p.clear(4, 5);
      p.line(7, 7, 14, 14, m);
      p.rect(11, 13, 2, 2, m);
      p.rect(13, 10, 2, 2, m);
      break;
    case 'torch':
      diag(5, 15, 7, handle, 2);
      p.ellipse(12, 5, 2.5, 3.5, '#f8b848');
      p.ellipse(12, 6, 1.5, 2, '#fff0b0');
      break;
    case 'wall':
      p.rect(1, 1, 14, 14, m);
      for (let y = 1; y < 15; y += 4) {
        p.rect(1, y, 14, 1, d);
        for (let x = y % 8 === 1 ? 4 : 8; x < 15; x += 7) p.rect(x, y, 1, 4, d);
      }
      p.rect(1, 2, 14, 1, l);
      break;
    case 'coin':
      p.ellipse(8, 8, 6, 6, d);
      p.ellipse(8, 8, 5, 5, m);
      p.ellipse(7, 7, 3, 3, l);
      p.rect(7, 5, 2, 6, d);
      p.rect(6, 5, 1, 1, ll);
      break;
    case 'chair':
      p.rect(3, 1, 2, 14, d);
      p.rect(3, 8, 10, 2, m);
      p.rect(3, 8, 10, 1, l);
      p.rect(11, 10, 2, 5, d);
      p.rect(3, 3, 2, 2, l);
      break;
    case 'table':
      p.rect(1, 5, 14, 3, m);
      p.rect(1, 5, 14, 1, l);
      p.rect(2, 8, 2, 7, d);
      p.rect(12, 8, 2, 7, d);
      break;
    case 'bed':
      p.rect(1, 4, 2, 11, '#5e4631');
      p.rect(13, 8, 2, 7, '#5e4631');
      p.rect(3, 9, 10, 4, m);
      p.rect(3, 9, 10, 1, l);
      p.rect(3, 7, 4, 2, '#e8dcc8');
      p.rect(3, 13, 10, 1, '#5e4631');
      break;
    case 'door':
      p.rect(4, 1, 8, 14, m);
      p.rect(4, 1, 8, 1, l);
      p.rect(7, 1, 1, 14, d);
      p.rect(4, 4, 8, 1, '#8a8680');
      p.rect(4, 11, 8, 1, '#8a8680');
      p.set(10, 8, '#d8b848');
      break;
    case 'bucket':
      p.poly(
        [
          [3, 5],
          [13, 5],
          [11, 14],
          [5, 14],
        ],
        m,
      );
      p.rect(3, 5, 10, 1, l);
      p.rect(4, 9, 8, 1, d);
      p.line(3, 5, 8, 1, d);
      p.line(13, 5, 8, 1, d);
      if (col2) p.rect(4, 6, 8, 2, col2);
      break;
    case 'rope':
      p.ellipse(8, 9, 6, 5, m);
      p.ellipse(8, 9, 3, 2.5, '#000000');
      for (let y = 7; y < 12; y++)
        for (let x = 5; x < 12; x++)
          if ((x + 0.5 - 8) ** 2 / 9 + (y + 0.5 - 9) ** 2 / 6 < 1) p.clear(x, y);
      p.line(3, 7, 6, 12, d);
      p.line(10, 5, 13, 10, l);
      p.line(12, 12, 14, 15, m);
      break;
    case 'hook':
      p.line(3, 14, 10, 4, '#c8a878');
      p.line(8, 1, 12, 5, m);
      p.line(12, 5, 14, 3, l);
      p.line(8, 1, 6, 3, l);
      p.rect(9, 3, 3, 3, d);
      break;
    case 'crossbow':
      p.line(2, 13, 13, 2, handle);
      p.line(3, 13, 14, 2, handleD);
      p.line(3, 5, 11, 13, m);
      p.line(4, 4, 12, 12, l);
      p.line(3, 5, 7, 9, '#e8e0d0');
      break;
    case 'tome':
      p.rect(3, 2, 10, 12, m);
      p.rect(3, 2, 10, 1, l);
      p.rect(3, 2, 1, 12, d);
      p.rect(12, 3, 1, 10, '#e8dcb8');
      p.rect(6, 6, 4, 4, col2 ?? ll);
      p.set(7, 7, '#ffffff');
      break;
    case 'whip':
      diag(1, 15, 5, handle, 2);
      p.line(6, 10, 10, 4, m);
      p.line(10, 4, 14, 3, m);
      p.line(14, 3, 15, 6, l);
      p.set(15, 7, l);
      break;
    case 'crate':
      p.rect(2, 4, 12, 10, m);
      p.rect(2, 4, 12, 1, l);
      p.line(2, 4, 13, 13, d);
      p.rect(2, 13, 12, 1, d);
      break;
    case 'mushroom':
      p.ellipse(8, 7, 6, 4, m);
      p.rect(2, 7, 13, 2, d);
      p.rect(6, 9, 4, 6, '#e8dcc8');
      p.rect(5, 5, 2, 1, ll);
      break;
    case 'seed':
      for (const [x, y] of [
        [5, 7],
        [10, 6],
        [7, 11],
        [11, 11],
      ])
        p.ellipse(x, y, 1.8, 1.4, m);
      break;
    case 'bone':
      diag(3, 12, 9, m, 2);
      for (const [x, y] of [
        [2, 12],
        [3, 14],
        [12, 2],
        [14, 4],
      ])
        p.ellipse(x, y, 1.6, 1.6, m);
      break;
    case 'feather':
      p.line(3, 14, 13, 2, '#8a8070');
      for (let i = 0; i < 9; i++)
        p.line(4 + i, 12 - i, 6 + i, 14 - i - (i > 5 ? 1 : 0), i % 2 ? m : l);
      break;
    case 'ring':
      p.ellipse(8, 9, 5, 5, m);
      p.ellipse(8, 9, 3, 3, '#000000');
      for (let y = 5; y < 13; y++)
        for (let x = 4; x < 12; x++) if ((x + 0.5 - 8) ** 2 + (y + 0.5 - 9) ** 2 < 9) p.clear(x, y);
      p.rect(7, 2, 3, 3, col2 ?? '#8fe3df');
      break;
    case 'heart':
      p.ellipse(5, 6, 3.5, 3.5, m);
      p.ellipse(11, 6, 3.5, 3.5, m);
      p.poly(
        [
          [1.5, 7],
          [14.5, 7],
          [8, 14],
        ],
        m,
      );
      p.rect(4, 4, 2, 2, ll);
      break;
    case 'star':
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
          [6, 6],
        ],
        m,
      );
      p.rect(7, 5, 2, 2, ll);
      break;
    case 'scroll':
      p.rect(3, 3, 10, 10, '#e8dcb8');
      p.rect(2, 2, 12, 2, '#c8b890');
      p.rect(2, 12, 12, 2, '#c8b890');
      for (let y = 6; y < 11; y += 2) p.line(5, y, 11, y, m);
      break;
    case 'bomb':
      p.ellipse(8, 10, 5, 5, '#3a3a40');
      p.rect(7, 3, 2, 3, '#8a6440');
      p.set(9, 2, '#ffd27a');
      p.rect(6, 8, 2, 2, '#6a6a74');
      break;
  }
}

function guess(id: string): [Tpl, string, string?] {
  if (ICONS[id]) return ICONS[id];
  if (WALLS[id] !== undefined) return ['wall', GROUND[WALLS[id]]?.wall ?? '#4a4038'];
  const m = matOf(id);
  const tail = id.split('_').pop() ?? '';
  const byTail: Record<string, Tpl> = {
    axe: 'axe',
    pick: 'pick',
    pickaxe: 'pick',
    sword: 'sword',
    blade: 'sword',
    broadsword: 'sword',
    greatsword: 'sword',
    saber: 'sword',
    reaver: 'sword',
    razor: 'sword',
    brand: 'sword',
    knife: 'sword',
    cleaver: 'sword',
    battleaxe: 'axe',
    greataxe: 'axe',
    warhammer: 'hammer',
    maul: 'hammer',
    whip: 'whip',
    crossbow: 'crossbow',
    tome: 'tome',
    infusion: 'bottle',
    spear: 'spear',
    bow: 'bow',
    staff: 'staff',
    wand: 'wand',
    hammer: 'hammer',
    ingot: 'ingot',
    bar: 'ingot',
    ore: 'ore',
    gem: 'gem',
    helmet: 'helmet',
    helm: 'helmet',
    hood: 'helmet',
    crown: 'helmet',
    chestplate: 'chest',
    mail: 'chest',
    robe: 'chest',
    greaves: 'legs',
    leggings: 'legs',
    boots: 'boots',
    cloak: 'cloak',
    fang: 'fang',
    pelt: 'pelt',
    core: 'core',
    sigil: 'sigil',
    key: 'key',
    torch: 'torch',
    arrow: 'arrow',
    arrows: 'arrow',
    potion: 'potion',
    elixir: 'potion',
    tonic: 'potion',
    crystal: 'crystal',
    orb: 'orb',
    heart: 'heart',
    star: 'star',
    scroll: 'scroll',
    bomb: 'bomb',
    seeds: 'seed',
    spores: 'seed',
    ring: 'ring',
    charm: 'ring',
    amulet: 'ring',
    shard: 'gem',
    dust: 'seed',
    blaster: 'gun',
    repeater: 'crossbow',
    brick: 'block',
    bricks: 'block',
    block: 'block',
    planks: 'block',
    glass: 'block',
    feather: 'feather',
    cap: 'mushroom',
    bone: 'bone',
    essence: 'orb',
    silk: 'bundle',
    gel: 'orb',
  };
  if (byTail[tail]) return [byTail[tail], m];
  return ['lump', '#a89878'];
}

const blank = () =>
  cached('icon:?', () => sprite(16, 16, 8, 8, (p) => paint(p, 'crate', '#8a7a5a')));
/** The icon sprite for an item, anchored at its centre. */
export function iconSprite(id: string): Sprite {
  if (!id) return blank();
  return cached('icon:' + id, () => {
    const [tpl, col, col2] = guess(id);
    return sprite(16, 16, 8, 8, (p) => paint(p, tpl, col, col2));
  });
}
/** A half-size icon for blocks carried in hand, sampled pixel for pixel. */
export function miniIcon(id: string): Sprite {
  return cached('mini:' + id, () => {
    const full = iconSprite(id),
      src = full.cv.getContext('2d')!.getImageData(0, 0, full.cv.width, full.cv.height),
      w = Math.ceil(full.cv.width / 2),
      h = Math.ceil(full.cv.height / 2),
      p = new Painter(w, h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = (y * 2 * src.width + x * 2) * 4;
        if (src.data[i + 3] > 0) p.set(x, y, [src.data[i], src.data[i + 1], src.data[i + 2]]);
      }
    return { cv: p.toCanvas(), ox: Math.floor(w / 2), oy: Math.floor(h / 2) };
  });
}
/** A glowing item keeps a soft pulse in the world and a light in the dark. */
export const glowingItem = (id: string) =>
  /crystal|hellstone|hellfire|eclipse|core|myconite|starmetal|voidsteel|sigil|star|essence|torch|glow/.test(
    id,
  );

const urls = new Map<string, string>();
/** A data URL of the icon at 3× for the journal's HTML (drawn crisp with image-rendering). */
export function iconURL(id: string): string {
  let u = urls.get(id);
  if (!u) {
    const s = iconSprite(id);
    u = s.cv.toDataURL();
    urls.set(id, u);
  }
  return u;
}

/** The item kind a held item is used as: swung, thrust, aimed, or just carried. */
export function useStyle(id: string): 'swing' | 'thrust' | 'aim' | 'hold' | 'none' {
  if (!id || id === 'fists') return 'none';
  const [tpl] = guess(id);
  if (tpl === 'spear') return 'thrust';
  if (['bow', 'staff', 'wand', 'gun', 'crossbow', 'tome'].includes(tpl)) return 'aim';
  if (['axe', 'pick', 'sword', 'hammer', 'whip'].includes(tpl)) return 'swing';
  return 'hold';
}
