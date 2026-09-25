import { compose } from '../score.ts';

// The Ashen Steppe: D Dorian on a hot wind. A doum-and-taiko march along the kiln road, a shawm
// singing over it, and brass rising through the storm in the middle.
export const steppe = compose(
  {
    id: 'steppe',
    title: 'The Kiln Road',
    mood: 'The Ashen Steppe',
    bpm: 112,
    bars: 24,
    parts: {
      doum: { inst: 'doum', vol: 0.85 },
      tek: { inst: 'tek', vol: 0.45, pan: 0.2 },
      taiko: { inst: 'taiko', vol: 0.6, rev: 0.3 },
      shaker: { inst: 'shaker', vol: 0.35, pan: -0.3 },
      crash: { inst: 'crash', vol: 0.4, rev: 0.3 },
      bass: { inst: 'bass', vol: 0.85 },
      oud: { inst: 'oud', vol: 0.65, rev: 0.3, pan: -0.2 },
      shawm: { inst: 'shawm', vol: 0.85, rev: 0.4, echo: 0.15 },
      brass: { inst: 'brass', vol: 0.7, rev: 0.4 },
      pad: { inst: 'pad', vol: 0.45, rev: 0.5 },
      wind: { inst: 'wind', vol: 0.35, rev: 0.4 },
    },
  },
  (s) => {
    const progA = 'Dm Dm C Dm Dm F C Dm',
      progB = 'Bb C Dm Am Bb C Dm Dm';
    const theme =
      'd5:4 f5:2 g5:2 a5:8 | g5:2 f5:2 e5:4 d5:8 | c5:4 e5:4 g5:4 e5:4 | d5:12 r:4 | ' +
      'a5:4 c6:2 a5:2 g5:8 | f5:4 a5:4 c6:8 | e5:4 g5:4 f5:2 e5:2 c5:4 | d5:16';
    const march = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.grid('doum', bar, 'x..x..x...x.x...', n);
      s.grid('tek', bar, '..x..x.x.x..x.xx', n, { vel: 0.8 });
      s.grid('taiko', bar, 'x.......x.......', n);
      s.grid('shaker', bar, 'x.x.x.x.x.x.x.x.', n, { vel: 0.7 });
      s.arp('oud', bar, prog, '0 2 1 2 0 2 1 2', 50, 2, { vel: 0.8 });
      s.bass('bass', bar, prog, 'R:4 R:2 5:2 8:4 5:4', 38);
      s.pad('pad', bar, prog, 58, { vel: 0.5 });
    };
    s.play('shawm', 0, theme);
    march(0, progA);
    s.grid('crash', 8, 'x...............');
    s.play(
      'brass',
      8,
      'f5:8 g5:8 | a5:12 r:4 | d6:8 c6:8 | a5:16 | bb5:8 c6:8 | d6:8 e6:8 | f6:8 e6:4 d6:4 | d6:16',
      { transpose: -12 },
    );
    s.play('wind', 8, 'd5:32 | a5:32 | d5:32 | a5:32', { vel: 0.6 });
    march(8, progB);
    s.grid('crash', 16, 'x...............');
    s.play('shawm', 16, theme);
    s.play('brass', 16, theme, { transpose: -12, vel: 0.55 });
    march(16, progA);
  },
);
