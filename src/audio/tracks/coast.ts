import { compose } from '../score.ts';

// The coast: an easy 3/4 sway. Ocarina over rolling harp, marimba and glockenspiel for the
// sunlit restatement, strings for the swell, and surf washing in every few bars.
export const coast = compose(
  {
    id: 'coast',
    title: 'Salt Wind Waltz',
    mood: 'Coast · day',
    bpm: 108,
    beatsPerBar: 3,
    bars: 36,
    parts: {
      kick: { inst: 'kick', vol: 0.7 },
      shaker: { inst: 'shaker', vol: 0.5, pan: 0.3 },
      tamb: { inst: 'tamb', vol: 0.35, pan: -0.3 },
      surf: { inst: 'wind', vol: 0.5, rev: 0.4 },
      bass: { inst: 'bass', vol: 0.8 },
      harp: { inst: 'harp', vol: 0.75, rev: 0.4, pan: -0.2 },
      guitar: { inst: 'pluck', vol: 0.55, pan: 0.25, rev: 0.2 },
      pad: { inst: 'pad', vol: 0.55, rev: 0.45 },
      ocarina: { inst: 'ocarina', vol: 0.95, rev: 0.4, echo: 0.15 },
      marimba: { inst: 'marimba', vol: 0.8, rev: 0.3, echo: 0.1 },
      glock: { inst: 'bell', vol: 0.35, rev: 0.4, pan: 0.2 },
      strings: { inst: 'strings', vol: 0.85, rev: 0.45 },
    },
  },
  (s) => {
    const progA = 'F C/E Dm Bb F C Bb C',
      progB = 'Dm Am Bb F Gm Am Bb C',
      tag = 'Bb C Dm C';
    const themeA =
      'c5:4 f5:4 a5:4 | g5:6 e5:2 c5:4 | d5:4 f5:4 a5:4 | bb5:6 a5:2 f5:4 | ' +
      'c6:6 a5:2 f5:4 | e5:4 g5:4 c6:4 | d6:6 c6:2 bb5:4 | c6:4 g5:8';
    const themeB =
      'a5:8 f5:4 | e5:8 c5:4 | f5:4 bb5:4 d6:4 | c6:8 a5:4 | ' +
      'bb5:6 a5:2 g5:4 | a5:6 g5:2 e5:4 | d5:4 f5:4 bb5:4 | g5:4 a5:4 bb5:4';
    const waltz = (bar: number, prog: string) => {
      s.arp('harp', bar, prog, '0 1 2 3 2 1', 53, 2);
      s.bass('bass', bar, prog, 'R:4 r:8', 41);
      s.hits('guitar', bar, prog, '....x...x...', 62, { vel: 0.7 });
      s.pad('pad', bar, prog, 62, { vel: 0.7 });
    };

    // A (0–7), B (8–15), A' (16–23), B' (24–31), tag (32–35)
    s.play('ocarina', 0, themeA);
    waltz(0, progA);
    s.play('strings', 8, themeB, { transpose: -12, vel: 0.8 });
    s.play('ocarina', 8, themeB);
    waltz(8, progB);
    s.play('marimba', 16, themeA);
    s.play('glock', 16, themeA, { transpose: 12, vel: 0.5 });
    waltz(16, progA);
    s.play('ocarina', 24, themeB);
    s.play('strings', 24, themeB, { transpose: -12 });
    s.play('marimba', 24, themeB, { vel: 0.5 });
    waltz(24, progB);
    s.play('ocarina', 32, 'd5:4 f5:4 bb5:4 | c6:8 bb5:4 | a5:8 f5:4 | e5:6 g5:6');
    s.play('strings', 32, 'f4:12 | g4:12 | a4:12 | g4:12', { vel: 0.6 });
    waltz(32, tag);

    s.grid('kick', 0, 'x...........', 36);
    s.grid('shaker', 0, 'x.o.x.o.x.o.', 36);
    s.grid('tamb', 8, '....x...x...', 8);
    s.grid('tamb', 24, '....x...x...', 12);
    for (let bar = 0; bar < 36; bar += 4) s.note('surf', bar * 3, 55, 5, 0.8);
  },
);
