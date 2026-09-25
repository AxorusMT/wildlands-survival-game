import { compose } from '../score.ts';

// The Salt Flats of Oru: A Hijaz under a white sun. An oud and a reed trading phrases over a
// doum-and-zill rhythm, a drone that never lifts, and strings shimmering like a mirage.
export const saltflats = compose(
  {
    id: 'saltflats',
    title: 'White Sun of Oru',
    mood: 'The Salt Flats of Oru',
    bpm: 100,
    bars: 24,
    parts: {
      doum: { inst: 'doum', vol: 0.75 },
      tek: { inst: 'tek', vol: 0.4, pan: 0.25 },
      zill: { inst: 'zill', vol: 0.3, pan: -0.3, rev: 0.4 },
      oud: { inst: 'oud', vol: 0.6, rev: 0.3, pan: -0.2 },
      reed: { inst: 'reed', vol: 0.65, rev: 0.5, echo: 0.2 },
      strings: { inst: 'strings', vol: 0.45, rev: 0.6 },
      sub: { inst: 'sub', vol: 0.55 },
      pad: { inst: 'pad', vol: 0.35, rev: 0.6, cutoff: 2200 },
      wind: { inst: 'wind', vol: 0.3, rev: 0.5 },
    },
  },
  (s) => {
    const progA = 'A A Bb A Gm A Bb A',
      progB = 'Dm Dm Gm A Bb A Gm A';
    const theme =
      'a4:4 bb4:4 c#5:4 d5:4 | e5:12 r:4 | f5:4 e5:4 d5:4 c#5:4 | d5:8 bb4:8 | ' +
      'a4:4 c#5:4 e5:4 g5:4 | f5:8 e5:8 | d5:4 c#5:4 bb4:4 c#5:4 | a4:16';
    const pulse = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.grid('doum', bar, 'x..x..x.x...x...', n);
      s.grid('tek', bar, '..x.x..x..x.x.xx', n, { vel: 0.7 });
      s.grid('zill', bar, 'x.......x.......', n, { vel: 0.6 });
      s.arp('oud', bar, prog, '0 1 2 1 0 1 2 3', 50, 2, { vel: 0.7 });
      s.bass('sub', bar, prog, 'R:16', 33);
      s.pad('pad', bar, prog, 57, { vel: 0.45 });
    };
    s.play('reed', 0, theme);
    s.play('wind', 0, 'a4:32 | e5:32 | a4:32 | e5:32', { vel: 0.5 });
    pulse(0, progA);
    s.play(
      'strings',
      8,
      'd5:8 f5:8 | a5:12 r:4 | g5:8 f5:4 e5:4 | c#5:16 | d5:8 e5:8 | f5:4 e5:4 d5:8 | bb4:8 c#5:8 | a4:16',
    );
    pulse(8, progB);
    s.play('reed', 16, theme);
    s.play('oud', 16, theme, { transpose: -12, vel: 0.5 });
    pulse(16, progA);
  },
);
