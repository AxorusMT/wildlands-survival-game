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
}

/** Each underground layer has its own track. */
const LAYER_TRACKS: Record<string, string> = {
  upper_mines: 'cave',
  lower_mines: 'depths',
  upper_hell: 'brimstone',
  lower_hell: 'pandemonium',
};

export function musicScene(c: MusicContext): string {
  if (!c.playing) return 'menu';
  if (c.dead) return 'fallen';
  if (c.boss) return 'boss';
  if (LAYER_TRACKS[c.layer]) return LAYER_TRACKS[c.layer];
  if (c.weather === 'storm') return 'storm';
  if (['tundra', 'taiga', 'alpine'].includes(c.biome)) return 'cold';
  if (['desert', 'badlands'].includes(c.biome)) return 'desert';
  if (c.biome === 'marsh') return 'marsh';
  if (c.night) return 'night';
  if (c.biome === 'forest') return 'forest';
  if (c.biome === 'coast') return 'coast';
  return 'meadow';
}
