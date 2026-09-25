import { compose } from '../score.ts';

// The Sunken Observatory: D minor under a sky of slow stars. A music box and harp turning like an
// orrery, bells ringing the hours of a dead calendar, and a choir as wide as the night.
export const observatory = compose(
  {
    id: 'observatory',
    title: 'The Drowned Orrery',
    mood: 'The Sunken Observatory',
    bpm: 72,
    bars: 16,
    parts: {
      musicbox: { inst: 'musicbox', vol: 0.55, rev: 0.7, echo: 0.35 },
      harp: { inst: 'harp', vol: 0.55, rev: 0.6, pan: -0.2 },
      bell: { inst: 'bell', vol: 0.4, rev: 0.8, echo: 0.3, pan: 0.2 },
      choir: { inst: 'choir', vol: 0.5, rev: 0.8 },
      sub: { inst: 'sub', vol: 0.5 },
      crystal: { inst: 'crystal', vol: 0.45, rev: 0.7, echo: 0.3 },
      swell: { inst: 'swell', vol: 0.3, rev: 0.6 },
    },
    echoBeats: 1,
    echoFeedback: 0.45,
  },
  (s) => {
    const progA = 'Dm Bb F C Dm Gm A A',
      progB = 'Bb C Dm Dm Gm A Dm Dm';
    const orbit = (bar: number, prog: string) => {
      s.arp('harp', bar, prog, '0 2 4 2 1 3 5 3', 50, 2, { vel: 0.6 });
      s.pad('choir', bar, prog, 62, { vel: 0.6 });
      s.bass('sub', bar, prog, 'R:16', 33);
      for (let i = 0; i < 8; i += 2) s.at('bell', bar + i, i % 4 ? 'a5' : 'd6', 4, 0.5);
    };
    s.play(
      'musicbox',
      0,
      'd6:4 f6:4 a6:8 | bb5:8 d6:8 | a5:4 c6:4 f6:8 | e6:16 | d6:4 f6:4 a6:4 g6:4 | f6:8 e6:8 | d6:4 e6:4 c#6:8 | a5:16',
    );
    orbit(0, progA);
    s.play(
      'crystal',
      8,
      'f5:8 g5:8 | a5:12 r:4 | d6:8 c6:4 a5:4 | f5:16 | g5:8 a5:8 | bb5:4 a5:4 g5:8 | f5:16 | d5:16',
    );
    s.play('swell', 8, 'd4:32 | a3:32', { vel: 0.5 });
    orbit(8, progB);
  },
);
