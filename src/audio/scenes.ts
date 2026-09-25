// Chooses which track fits the moment. Kept free of game and DOM types so it can be tested.

export interface MusicContext {
  playing: boolean;
  dead: boolean;
  boss: boolean;
  /** Depth layer id: surface, upper_mines, lower_mines, upper_hell, or lower_hell. */
  layer: string;
  weather: string;
  biome: string;
  night: boolean;
  /** The dungeon the player is inside, if any. */
  dungeon?: string | null;
  /** The kind of boss being fought, if any (the Direwolf is 'boss'). */
  bossType?: string | null;
  /** Settlers housed nearby. */
  town?: number;
}

/** Each underground layer has its own track. */
const LAYER_TRACKS: Record<string, string> = {
  upper_mines: 'cave',
  lower_mines: 'depths',
  upper_hell: 'brimstone',
  lower_hell: 'pandemonium',
  mycelia: 'mycelia',
  skyreach: 'skyreach',
  void: 'void',
  orchard: 'orchard',
  steppe: 'steppe',
  warren: 'warren',
  glasswood: 'glasswood',
  marches: 'marches',
  barrow: 'barrow',
  saltflats: 'saltflats',
  choir: 'choir',
  feverlands: 'feverlands',
  observatory: 'observatory',
  gutter: 'gutter',
  undertow: 'undertow',
  emberheart: 'emberheart',
  garden: 'garden',
  fractured: 'fractured',
  mycelial: 'mycelia',
};
/** Each dungeon's own music; the Citadel keeps the throne-room theme of lower hell. */
const DUNGEON_TRACKS: Record<string, string> = {
  crypt: 'dungeon',
  frost_keep: 'dungeon',
  tomb: 'tomb',
  citadel: 'pandemonium',
};

export function musicScene(c: MusicContext): string {
  if (!c.playing) return 'menu';
  if (c.dead) return 'fallen';
  if (c.boss) return c.bossType === 'unmaker' ? 'final_boss' : 'boss';
  if (c.dungeon && DUNGEON_TRACKS[c.dungeon]) return DUNGEON_TRACKS[c.dungeon];
  if (LAYER_TRACKS[c.layer]) return LAYER_TRACKS[c.layer];
  if (c.weather === 'storm') return 'storm';
  if (c.layer === 'surface' && (c.town ?? 0) >= 2) return 'town';
  if (['tundra', 'taiga', 'alpine'].includes(c.biome)) return 'cold';
  if (['desert', 'badlands'].includes(c.biome)) return 'desert';
  if (c.biome === 'marsh') return 'marsh';
  if (c.night) return 'night';
  if (c.biome === 'forest') return 'forest';
  if (c.biome === 'coast') return 'coast';
  return 'meadow';
}
