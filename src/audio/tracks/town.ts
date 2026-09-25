import { compose } from '../score.ts';

// Home among settlers: a warm hearthside tune. A reedy squeezebox carries the theme over plucked
// guitar and a walking bass, an ocarina answers, and marimba and pizzicato strings bring it home.
export const town = compose(
  {
    id: 'town',
    title: 'Lamplight on the Square',
    mood: 'A settled town',
    bpm: 104,
    bars: 24,
    parts: {
      kick: { inst: 'kick', vol: 0.7 },
      rim: { inst: 'rim', vol: 0.4, rev: 0.2 },
      shaker: { inst: 'shaker', vol: 0.45, pan: 0.3 },
      tamb: { inst: 'tamb', vol: 0.4, pan: -0.3 },
      bass: { inst: 'bass', vol: 0.8 },
      guitar: { inst: 'pluck', vol: 0.7, pan: -0.25, rev: 0.2 },
      harp: { inst: 'harp', vol: 0.55, pan: 0.25, rev: 0.35 },
      pad: { inst: 'pad', vol: 0.45, rev: 0.4 },
      reed: { inst: 'reed', vol: 0.85, rev: 0.3, pan: -0.1 },
      ocarina: { inst: 'ocarina', vol: 0.9, rev: 0.4, echo: 0.12, pan: 0.1 },
      marimba: { inst: 'marimba', vol: 0.7, rev: 0.25, pan: 0.2 },
      pizz: { inst: 'pizz', vol: 0.6, rev: 0.3, pan: -0.2 },
      strings: { inst: 'strings', vol: 0.7, rev: 0.4 },
    },
  },
  (s) => {
    const progA = 'D G D A Bm G A D',
      progB = 'G A F#m Bm G A Bm A';
    const theme =
      'a4:4 d5:4 f#5:4 e5:4 | d5:6 b4:2 g4:8 | a4:4 d5:4 f#5:4 a5:4 | g5:8 e5:8 | ' +
      'f#5:4 d5:4 b4:4 d5:4 | g5:6 f#5:2 e5:4 d5:4 | e5:4 f#5:2 g5:2 a5:4 c#5:4 | d5:12 r:4';
    const bed = (bar: number, prog: string) => {
      s.arp('guitar', bar, prog, '0 2 1 2 0 2 1 2', 55, 2);
      s.bass('bass', bar, prog, 'R:4 5:4 8:4 5:4', 38);
      s.pad('pad', bar, prog, 62, { vel: 0.7 });
      const bars = s.progression(bar, prog).length;
      s.grid('kick', bar, 'x.......x.......', bars);
      s.grid('rim', bar, '....x.......x...', bars);
      s.grid('shaker', bar, 'x.o.x.o.x.o.x.o.', bars);
    };

    // A (0–7): the squeezebox theme
    s.play('reed', 0, theme);
    bed(0, progA);

    // B (8–15): the ocarina answers
    s.play(
      'ocarina',
      8,
      'b5:6 a5:2 g5:8 | a5:6 g5:2 e5:8 | f#5:4 a5:4 c#6:4 a5:4 | d6:8 b5:8 | ' +
        'b5:4 d6:4 b5:4 g5:4 | a5:6 b5:2 c#6:8 | d6:4 c#6:4 b5:4 f#5:4 | e5:8 a5:8',
    );
    s.play('strings', 8, 'd5:16 | e5:16 | c#5:16 | d5:16 | d5:16 | e5:16 | f#5:16 | e5:16', {
      vel: 0.5,
    });
    s.arp('harp', 8, progB, '0 1 2 3 2 1 2 3', 62, 2, { vel: 0.7 });
    bed(8, progB);
    s.grid('tamb', 8, '..x...x...x...x.', 8);

    // A' (16–23): marimba and pizzicato take the theme home
    s.play('marimba', 16, theme);
    s.play('pizz', 16, theme, { transpose: -12, vel: 0.7 });
    s.play('reed', 16, 'r:16 | r:16 | r:16 | r:16 | d5:16 | b4:16 | c#5:16 | d5:12 r:4', {
      vel: 0.6,
    });
    bed(16, progA);
    s.grid('tamb', 16, '..x...x...x...x.', 8);
  },
);
