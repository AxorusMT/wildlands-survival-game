import { compose } from '../score.ts';

// The Drowned Orchard: E minor, a slow swaying tune for a drowned country. Harp and flute over a
// soft pulse, strings rising like the tide, and marimba and pizzicato taking the theme home.
export const orchard = compose(
  {
    id: 'orchard',
    title: 'Brine and Blossom',
    mood: 'The Drowned Orchard',
    bpm: 92,
    bars: 24,
    parts: {
      kick: { inst: 'kick', vol: 0.55 },
      rim: { inst: 'rim', vol: 0.3, rev: 0.3 },
      shaker: { inst: 'shaker', vol: 0.35, pan: 0.3 },
      drip: { inst: 'drip', vol: 0.35, rev: 0.7, echo: 0.4, pan: -0.4 },
      bass: { inst: 'bass', vol: 0.75, cutoff: 800 },
      harp: { inst: 'harp', vol: 0.7, rev: 0.45, pan: -0.2 },
      pad: { inst: 'pad', vol: 0.55, rev: 0.55 },
      flute: { inst: 'flute', vol: 0.95, rev: 0.45, echo: 0.18 },
      strings: { inst: 'strings', vol: 0.8, rev: 0.5 },
      marimba: { inst: 'marimba', vol: 0.65, rev: 0.3, pan: 0.2 },
      pizz: { inst: 'pizz', vol: 0.55, rev: 0.3, pan: -0.2 },
    },
    echoBeats: 1.5,
    echoFeedback: 0.36,
  },
  (s) => {
    const progA = 'Em C G D Em C Am B',
      progB = 'Am Em C G Am Em F B';
    const theme =
      'e5:4 g5:4 b5:6 a5:2 | g5:4 e5:4 c5:8 | d5:4 g5:4 b5:4 d6:4 | c6:6 b5:2 a5:8 | ' +
      'b5:4 e5:4 g5:6 f#5:2 | e5:4 c5:4 e5:8 | a5:4 c6:4 b5:4 a5:4 | f#5:8 d#5:8';
    const bed = (bar: number, prog: string) => {
      s.arp('harp', bar, prog, '0 1 2 3 2 1 2 3', 52, 2, { vel: 0.8 });
      s.bass('bass', bar, prog, 'R:6 5:2 8:8', 34);
      s.pad('pad', bar, prog, 62, { vel: 0.6 });
      const n = s.progression(bar, prog).length;
      s.grid('kick', bar, 'x.........x.....', n);
      s.grid('rim', bar, '........x.......', n);
      s.grid('shaker', bar, 'o.o.o.o.o.o.o.o.', n);
      for (let i = 0; i < n; i += 2) s.at('drip', bar + i + 0.62, i % 4 ? 'b6' : 'e7', 0.25, 0.7);
    };
    s.play('flute', 0, theme);
    bed(0, progA);
    s.play(
      'strings',
      8,
      'c6:8 b5:8 | g5:8 e5:8 | e5:6 g5:2 c6:8 | b5:6 a5:2 g5:8 | ' +
        'a5:4 c6:4 e6:8 | e6:4 d6:4 b5:8 | c6:4 a5:4 f5:8 | d#5:8 f#5:8',
    );
    bed(8, progB);
    s.play('marimba', 16, theme);
    s.play('pizz', 16, theme, { transpose: -12, vel: 0.7 });
    s.play('flute', 16, 'r:16 | r:16 | r:16 | r:16 | b5:16 | c6:16 | a5:16 | b5:16', {
      vel: 0.5,
    });
    bed(16, progA);
  },
);
