import { compose } from '../score.ts';

// The Gutter of Kings: G minor, a crooked court dance in the sewers. Pizzicato strings and a
// tambourine for the thieves, an organ for the dead kings, and brass that remembers the throne.
export const gutter = compose(
  {
    id: 'gutter',
    title: 'Kings of Nothing',
    mood: 'The Gutter of Kings',
    bpm: 110,
    bars: 24,
    parts: {
      pizz: { inst: 'pizz', vol: 0.65, rev: 0.4 },
      tamb: { inst: 'tamb', vol: 0.35, pan: 0.3 },
      rim: { inst: 'rim', vol: 0.4, rev: 0.4, pan: -0.3 },
      kick: { inst: 'kick', vol: 0.5 },
      bass: { inst: 'bass', vol: 0.7 },
      organ: { inst: 'organ', vol: 0.45, rev: 0.6 },
      brass: { inst: 'brass', vol: 0.55, rev: 0.5 },
      drip: { inst: 'drip', vol: 0.35, rev: 0.7, echo: 0.3 },
      pad: { inst: 'pad', vol: 0.35, rev: 0.6, cutoff: 1800 },
    },
  },
  (s) => {
    const progA = 'Gm Gm Cm D Gm Eb D D',
      progB = 'Eb F Gm Gm Cm D Gm Gm';
    const sneak =
      'g4:2 r:2 bb4:2 r:2 d5:4 c5:4 | bb4:2 a4:2 g4:4 d4:8 | eb5:4 d5:4 c5:4 bb4:4 | a4:8 f#4:8 | ' +
      'g4:2 bb4:2 d5:2 g5:2 f5:4 eb5:4 | d5:4 c5:4 bb4:8 | a4:4 c5:4 f#4:4 a4:4 | g4:16';
    const court = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.grid('kick', bar, 'x.......x.......', n);
      s.grid('rim', bar, '....x.......x...', n, { vel: 0.7 });
      s.grid('tamb', bar, '..x...x...x...x.', n, { vel: 0.6 });
      s.bass('bass', bar, prog, 'R:4 5:4 R:4 5:4', 36);
      s.pad('pad', bar, prog, 58, { vel: 0.4 });
      for (let i = 0; i < n; i += 4) s.at('drip', bar + i + 0.7, 'd7', 0.25, 0.5);
    };
    s.play('pizz', 0, sneak);
    court(0, progA);
    s.play(
      'organ',
      8,
      'bb4:8 c5:8 | d5:12 r:4 | g5:8 f5:4 eb5:4 | d5:16 | eb5:8 f5:8 | g5:4 f5:4 eb5:8 | d5:8 f#5:8 | g5:16',
    );
    s.hits('brass', 8, 'Eb F Gm Gm Cm D Gm Gm', 'x.......x.....x.', 55, { vel: 0.4 });
    court(8, progB);
    s.play('pizz', 16, sneak);
    s.play('brass', 16, sneak, { transpose: -12, vel: 0.5 });
    court(16, progA);
  },
);
