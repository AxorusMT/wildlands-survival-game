import { compose } from '../score.ts';

// The Bone Marches: D Phrygian, slow and heavy. A funeral bell over the fen, a low chant, the
// timpani of something huge walking, and a reed keening through the fog.
export const marches = compose(
  {
    id: 'marches',
    title: 'Ossuary Fen',
    mood: 'The Bone Marches',
    bpm: 76,
    bars: 18,
    parts: {
      toll: { inst: 'toll', vol: 0.5, rev: 0.8 },
      chant: { inst: 'chant', vol: 0.6, rev: 0.7 },
      reed: { inst: 'reed', vol: 0.6, rev: 0.6, echo: 0.2, pan: 0.2 },
      strings: { inst: 'strings', vol: 0.5, rev: 0.6, cutoff: 1600 },
      timpani: { inst: 'timpani', vol: 0.6, rev: 0.5 },
      tom: { inst: 'tom', vol: 0.4, rev: 0.4, pan: -0.2 },
      bass: { inst: 'bass', vol: 0.7 },
      pad: { inst: 'pad', vol: 0.4, rev: 0.7, cutoff: 1400 },
      wind: { inst: 'wind', vol: 0.3, rev: 0.5 },
    },
  },
  (s) => {
    const progA = 'Dm Eb Dm Cm Dm Eb Bb A',
      progB = 'Bb C Dm Dm Eb F Gm A';
    const march = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.grid('timpani', bar, 'x.......x.......', n);
      s.grid('tom', bar, '......x.......x.', n, { vel: 0.6 });
      s.bass('bass', bar, prog, 'R:12 5:4', 38);
      s.pad('pad', bar, prog, 56, { vel: 0.5 });
      for (let i = 0; i < n; i += 4) s.at('toll', bar + i, 'd4', 8, 0.8);
    };
    s.play(
      'chant',
      0,
      'd4:8 eb4:8 | f4:4 eb4:4 d4:8 | c4:8 d4:8 | a3:16 | d4:4 f4:4 g4:4 a4:4 | bb4:8 a4:8 | g4:4 f4:4 eb4:8 | d4:16',
    );
    s.play('wind', 0, 'd5:32 | a4:32 | d5:32 | a4:32', { vel: 0.5 });
    march(0, progA);
    s.play(
      'reed',
      8,
      'a4:4 bb4:4 c5:8 | d5:12 r:4 | f5:8 eb5:4 d5:4 | c5:16 | bb4:8 c5:8 | d5:4 eb5:4 f5:8 | g5:8 f5:4 eb5:4 | c#5:16',
    );
    s.pad('strings', 8, progB, 58, { vel: 0.6 });
    march(8, progB);
    s.pad('strings', 16, 'Dm:2', 58, { vel: 0.5 });
    s.at('toll', 16, 'd4', 8, 0.9);
    s.bass('bass', 16, 'Dm:2', 'R:16', 38);
  },
);
