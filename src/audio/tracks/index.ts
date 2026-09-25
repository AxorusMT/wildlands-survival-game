import type { Track } from '../score.ts';
import { boss } from './boss.ts';
import { brimstone } from './brimstone.ts';
import { cave } from './cave.ts';
import { coast } from './coast.ts';
import { cold } from './cold.ts';
import { depths } from './depths.ts';
import { dungeon } from './dungeon.ts';
import { desert } from './desert.ts';
import { fallen } from './fallen.ts';
import { finalBoss } from './final.ts';
import { forest } from './forest.ts';
import { marsh } from './marsh.ts';
import { meadow } from './meadow.ts';
import { menu } from './menu.ts';
import { mycelia } from './mycelia.ts';
import { night } from './night.ts';
import { pandemonium } from './pandemonium.ts';
import { skyreach } from './skyreach.ts';
import { storm } from './storm.ts';
import { tomb } from './tomb.ts';
import { voidsong } from './voidsong.ts';

/** Every track in the score, in playlist order. Each track's id is the scene that plays it. */
export const TRACK_LIST: Track[] = [
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
  fallen,
  dungeon,
  tomb,
  mycelia,
  skyreach,
  voidsong,
  finalBoss,
];

export const TRACKS: Record<string, Track> = Object.fromEntries(TRACK_LIST.map((t) => [t.id, t]));
