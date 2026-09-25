import { compose } from '../score.ts';

// The Glasswood: E Lydian, bright and brittle. A music box and harp ringing like struck crystal,
// a bell that chimes as the canopy sways, and strings swelling as the light refracts.
export const glasswood = compose(
  {
    id: 'glasswood',
    title: 'Prism Canopy',
    mood: 'The Glasswood',
    bpm: 96,
    bars: 24,
    parts: {
      musicbox: { inst: 'musicbox', vol: 0.6, rev: 0.6, echo: 0.3 },
      crystal: { inst: 'crystal', vol: 0.55, rev: 0.6, echo: 0.25, pan: 0.2 },
      harp: { inst: 'harp', vol: 0.6, rev: 0.5, pan: -0.2 },
      bell: { inst: 'bell', vol: 0.35, rev: 0.7 },
      strings: { inst: 'strings', vol: 0.45, rev: 0.6 },
      pad: { inst: 'pad', vol: 0.45, rev: 0.6, cutoff: 2400 },
      bass: { inst: 'bass', vol: 0.6 },
      shaker: { inst: 'shaker', vol: 0.25, pan: 0.3 },
      drip: { inst: 'drip', vol: 0.35, rev: 0.7, echo: 0.4, pan: -0.4 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.35,
  },
  (s) => {
    const progA = 'E F#/E E F#/E C#m7 F# Bmaj7 F#',
      progB = 'C#m7 B A#m7b5 Emaj7 C#m7 D#m7 F# F#';
    const theme =
      'e5:4 g#5:4 a#5:4 b5:4 | d#6:8 b5:8 | c#6:4 b5:4 a#5:4 g#5:4 | f#5:12 r:4 | ' +
      'e5:4 f#5:4 g#5:4 d#6:4 | c#6:8 a#5:8 | b5:4 a#5:4 f#5:4 d#5:4 | e5:16';
    const shimmer = (bar: number, prog: string) => {
      const n = s.progression(bar, prog).length;
      s.arp('harp', bar, prog, '0 1 2 3 2 1 2 3', 52, 2, { vel: 0.7 });
      s.bass('bass', bar, prog, 'R:8 5:8', 40);
      s.pad('pad', bar, prog, 64, { vel: 0.5 });
      s.grid('shaker', bar, '..x...x...x...x.', n, { vel: 0.6 });
      for (let i = 0; i < n; i += 2) s.at('drip', bar + i + 0.6, i % 4 ? 'b6' : 'e7', 0.25, 0.6);
    };
    s.play('musicbox', 0, theme);
    shimmer(0, progA);
    s.play(
      'crystal',
      8,
      'g#5:8 a#5:8 | b5:12 r:4 | c#6:8 b5:4 a#5:4 | g#5:16 | e5:8 f#5:8 | g#5:4 a#5:4 b5:8 | a#5:16 | f#5:16',
    );
    s.pad('strings', 8, progB, 60, { vel: 0.6 });
    for (let b = 8; b < 16; b += 2) s.at('bell', b, b % 4 ? 'g#6' : 'e6', 4, 0.6);
    shimmer(8, progB);
    s.play('crystal', 16, theme);
    s.play('musicbox', 16, theme, { transpose: 12, vel: 0.45 });
    shimmer(16, progA);
  },
);
