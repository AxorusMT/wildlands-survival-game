import { compose } from '../score.ts';

// Night on the surface: hushed and a little lonely. Electric piano and a breathy flute over soft
// harp, crickets in the grass, and the odd bell like a star coming out.
export const night = compose(
  {
    id: 'night',
    title: 'Lanterns Out',
    mood: 'Surface · night',
    bpm: 80,
    bars: 20,
    parts: {
      kick: { inst: 'kick', vol: 0.55 },
      rim: { inst: 'rim', vol: 0.3, rev: 0.4 },
      shaker: { inst: 'shaker', vol: 0.3, pan: 0.3 },
      cricket: { inst: 'chirp', vol: 0.6, pan: -0.5, rev: 0.3 },
      cricket2: { inst: 'chirp', vol: 0.5, pan: 0.6, rev: 0.3 },
      bass: { inst: 'bass', vol: 0.7, cutoff: 700 },
      keys: { inst: 'epiano', vol: 0.85, rev: 0.35, echo: 0.15, pan: -0.1 },
      harp: { inst: 'harp', vol: 0.55, rev: 0.5, pan: 0.2 },
      pad: { inst: 'pad', vol: 0.6, rev: 0.55 },
      flute: { inst: 'flute', vol: 0.9, rev: 0.5, echo: 0.2 },
      strings: { inst: 'strings', vol: 0.75, rev: 0.5 },
      star: { inst: 'bell', vol: 0.3, rev: 0.6, echo: 0.4, pan: 0.4 },
    },
    echoBeats: 1.5,
    echoFeedback: 0.38,
  },
  (s) => {
    const progA = 'Am9 Fmaj7 C G Am9 Fmaj7 Dm9 E7',
      progB = 'Dm7 G Cmaj7 Fmaj7 Bm7b5 E7 Am E7',
      progC = 'Am9 Fmaj7 Dm9 E7';
    const bed = (bar: number, prog: string, harp: boolean) => {
      s.hits('keys', bar, prog, 'x.....x...x.....', 60, { vel: 0.8 });
      s.bass('bass', bar, prog, 'R:6 R:2 5:8', 33);
      s.pad('pad', bar, prog, 64, { vel: 0.7 });
      if (harp) s.arp('harp', bar, prog, '0 1 2 3 4 3 2 1', 57, 2, { vel: 0.8 });
      const bars = s.progression(bar, prog).length;
      s.grid('shaker', bar, 'o.o.o.o.o.o.o.o.', bars);
      s.grid('rim', bar, '........x.......', bars);
      s.grid('kick', bar, 'x.........x.....', bars);
    };

    // A (0–7)
    s.play(
      'flute',
      0,
      'e5:6 a5:2 b5:4 c6:4 | a5:6 g5:2 e5:8 | g5:4 c6:4 d6:2 e6:6 | d6:8 b5:4 g5:4 | ' +
        'e5:6 a5:2 b5:4 c6:4 | c6:6 b5:2 a5:4 e5:4 | f5:4 a5:4 e6:4 d6:4 | g#5:8 b5:4 d6:4',
    );
    bed(0, progA, false);

    // B (8–15)
    s.play(
      'strings',
      8,
      'c6:6 a5:2 f5:8 | d6:6 b5:2 g5:8 | e6:6 d6:2 c6:4 b5:4 | a5:8 c6:4 e6:4 | ' +
        'd6:6 c6:2 a5:4 f5:4 | g#5:8 b5:4 d6:4 | c6:6 b5:2 a5:8 | b5:6 g#5:2 e5:8',
      { transpose: -12 },
    );
    s.play('flute', 8, 'r:16 | r:16 | g5:16 | a5:16 | f5:16 | e5:16 | e5:16 | g#5:16', {
      vel: 0.5,
    });
    bed(8, progB, true);

    // C (16–19)
    s.play(
      'flute',
      16,
      'e5:6 a5:2 b5:4 c6:4 | a5:6 g5:2 e5:8 | f5:4 a5:4 e6:4 d6:4 | g#5:8 b5:4 d6:4',
    );
    bed(16, progC, true);

    s.play('star', 0, 'r:16 | r:8 e7:8 | r:16 | r:16 | r:16 | r:4 c7:12 | r:16 | r:16');
    s.play('star', 12, 'r:8 b6:8 | r:16 | r:16 | r:4 e7:12 | r:16 | r:16 | r:16 | r:16');
    const chirps = [1, 2.5, 5, 6.25, 9, 11.5, 13, 14.75, 17, 19.25];
    chirps.forEach((bar, i) => s.note(i % 2 ? 'cricket2' : 'cricket', bar * 4, 110 + (i % 3), 0.5));
  },
);
