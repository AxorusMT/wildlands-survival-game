import { compose } from '../score.ts';

// The Feverlands: E Phrygian in the steam. Toms and shakers like a pulse racing, a marimba that
// drips and slides, and a reed wailing over it all as the fever rises.
export const feverlands = compose(
  {
    id: 'feverlands',
    title: 'Fever Canopy',
    mood: 'The Feverlands',
    bpm: 104,
    bars: 24,
    parts: {
      tom: { inst: 'tom', vol: 0.55, rev: 0.4 },
      kick: { inst: 'kick', vol: 0.5 },
      shaker: { inst: 'shaker', vol: 0.4, pan: 0.3 },
      drip: { inst: 'drip', vol: 0.4, rev: 0.7, echo: 0.4, pan: -0.3 },
      marimba: { inst: 'marimba', vol: 0.65, rev: 0.4 },
      reed: { inst: 'reed', vol: 0.6, rev: 0.5, echo: 0.2 },
      bass: { inst: 'bass', vol: 0.7 },
      pad: { inst: 'pad', vol: 0.4, rev: 0.6, cutoff: 1600 },
      howl: { inst: 'howl', vol: 0.25, rev: 0.8 },
    },
  },
  (s) => {
    const progA = 'Em F Em Dm Em F G Em',
      progB = 'Am G F Em Am G F E';
    const theme =
      'e5:4 f5:4 g5:8 | b5:8 a5:4 g5:4 | f5:4 e5:4 d5:8 | e5:16 | ' +
      'g5:4 a5:4 b5:4 c6:4 | b5:8 a5:8 | g5:4 f5:4 e5:4 d5:4 | e5:16';
    const pulse = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.grid('tom', bar, 'x..x..x...x.x..x', n, { vel: 0.8 });
      s.grid('kick', bar, 'x.......x.......', n);
      s.grid('shaker', bar, 'xxx.xxx.xxx.xxx.', n, { vel: 0.6 });
      s.arp('marimba', bar, prog, '0 1 2 1 0 2 1 2', 52, 2, { vel: 0.7 });
      s.bass('bass', bar, prog, 'R:6 R:2 5:4 R:4', 40);
      s.pad('pad', bar, prog, 57, { vel: 0.45 });
      for (let i = 0; i < n; i += 2) s.at('drip', bar + i + 0.5, i % 4 ? 'b6' : 'e7', 0.25, 0.6);
    };
    s.play('reed', 0, theme);
    pulse(0, progA);
    s.play('howl', 8, 'e4:32 | b3:32 | e4:32 | b3:32', { vel: 0.5 });
    s.play('reed', 8, theme, { transpose: -12, vel: 0.7 });
    pulse(8, progB);
    s.play('reed', 16, theme);
    s.play('marimba', 16, theme, { transpose: 12, vel: 0.4 });
    pulse(16, progA);
  },
);
