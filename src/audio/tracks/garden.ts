import { compose } from '../score.ts';

// The Garden of Lost Seasons: C major turning through the year. A flute for spring, a warm
// string swell for summer, pizzicato leaves for autumn, and a music box for the frost.
export const garden = compose(
  {
    id: 'garden',
    title: 'Four Seasons Turning',
    mood: 'The Garden of Lost Seasons',
    bpm: 96,
    bars: 24,
    parts: {
      flute: { inst: 'flute', vol: 0.6, rev: 0.5, echo: 0.2 },
      harp: { inst: 'harp', vol: 0.55, rev: 0.5, pan: -0.2 },
      strings: { inst: 'strings', vol: 0.5, rev: 0.6 },
      pizz: { inst: 'pizz', vol: 0.55, rev: 0.4, pan: 0.2 },
      musicbox: { inst: 'musicbox', vol: 0.5, rev: 0.7, echo: 0.3 },
      bass: { inst: 'bass', vol: 0.6 },
      shaker: { inst: 'shaker', vol: 0.3 },
      pad: { inst: 'pad', vol: 0.4, rev: 0.6 },
    },
  },
  (s) => {
    const prog = 'C G Am F C G F G',
      theme =
        'e5:4 g5:4 c6:8 | b5:4 a5:4 g5:8 | a5:4 c6:4 e6:4 c6:4 | f5:16 | ' +
        'e5:4 g5:4 c6:4 e6:4 | d6:8 b5:8 | a5:4 g5:4 f5:4 a5:4 | g5:16';
    const turn = (bar: number) => {
      const n = s.progression(bar, prog).length;
      s.arp('harp', bar, prog, '0 1 2 3 2 1 2 1', 48, 2, { vel: 0.6 });
      s.bass('bass', bar, prog, 'R:8 5:8', 36);
      s.grid('shaker', bar, '..x...x...x...x.', n, { vel: 0.5 });
    };
    s.play('flute', 0, theme);
    turn(0);
    s.pad('strings', 8, prog, 62, { vel: 0.7 });
    s.play('pizz', 8, theme, { transpose: -12, vel: 0.7 });
    turn(8);
    s.play('musicbox', 16, theme, { transpose: 12, vel: 0.6 });
    s.pad('pad', 16, prog, 60, { vel: 0.5 });
    turn(16);
  },
);
