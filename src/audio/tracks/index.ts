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
import { unmaker, unmaker2, unmaker3, unmaker4, unmakerFinale } from './unmaker.ts';
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
import { orchard } from './orchard.ts';
import { steppe } from './steppe.ts';
import { warren } from './warren.ts';
import { glasswood } from './glasswood.ts';
import { marches } from './marches.ts';
import { barrow } from './barrow.ts';
import { saltflats } from './saltflats.ts';
import { choir } from './choir.ts';
import { feverlands } from './feverlands.ts';
import { observatory } from './observatory.ts';
import { gutter } from './gutter.ts';
import { undertow } from './undertow.ts';
import { emberheart } from './emberheart.ts';
import { garden } from './garden.ts';
import { fractured } from './fractured.ts';
import { town } from './town.ts';
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
  unmaker,
  unmaker2,
  unmaker3,
  unmaker4,
  unmakerFinale,
  town,
  orchard,
  steppe,
  warren,
  glasswood,
  marches,
  barrow,
  saltflats,
  choir,
  feverlands,
  observatory,
  gutter,
  undertow,
  emberheart,
  garden,
  fractured,
];

export const TRACKS: Record<string, Track> = Object.fromEntries(TRACK_LIST.map((t) => [t.id, t]));
