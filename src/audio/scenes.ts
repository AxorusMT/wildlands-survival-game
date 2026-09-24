// Chooses which track fits the moment. Kept free of game and DOM types so it can be tested.

export interface MusicContext {
  playing: boolean;
  dead: boolean;
  boss: boolean;
  /** Pixels below the surface at the player's column. */
  depth: number;
  weather: string;
  biome: string;
  night: boolean;
}

/** Depth below the surface where the caves begin, and where the second cave layer starts. */
export const CAVE_DEPTH = 70;
export const DEEP_CAVE_DEPTH = 330;

export function musicScene(c: MusicContext): string {
  if (!c.playing) return 'menu';
  if (c.dead) return 'fallen';
  if (c.boss) return 'boss';
  if (c.depth > DEEP_CAVE_DEPTH) return 'depths';
  if (c.depth > CAVE_DEPTH) return 'cave';
  if (c.weather === 'storm') return 'storm';
  if (['tundra', 'taiga', 'alpine'].includes(c.biome)) return 'cold';
  if (['desert', 'badlands'].includes(c.biome)) return 'desert';
  if (c.biome === 'marsh') return 'marsh';
  if (c.night) return 'night';
  if (c.biome === 'forest') return 'forest';
  if (c.biome === 'coast') return 'coast';
  return 'meadow';
}
