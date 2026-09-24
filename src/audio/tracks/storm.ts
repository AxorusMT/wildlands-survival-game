import { compose } from '../score.ts';

// A storm on the surface: C minor, driving low-string ostinato and tremolo strings, the brass
// fighting the wind, a choir at the height of it, and thunder breaking the bottom out.
export const storm = compose(
  {
    id: 'storm',
    title: 'Squall Line',
    mood: 'Surface · storm',
    bpm: 128,
    bars: 32,
    parts: {
      kick: { inst: 'kick', vol: 1 },
      snare: { inst: 'snare', vol: 0.55, rev: 0.3 },
      tom: { inst: 'tom', vol: 0.7, rev: 0.3 },
      rain: { inst: 'shaker', vol: 0.35, pan: -0.2 },
      hat: { inst: 'hat', vol: 0.4, pan: 0.3 },
      crash: { inst: 'crash', vol: 0.55, rev: 0.3 },
      timp: { inst: 'timpani', vol: 0.9, rev: 0.4 },
      thunder: { inst: 'thunder', vol: 0.9, rev: 0.4 },
      wind: { inst: 'wind', vol: 0.6, rev: 0.3 },
      riser: { inst: 'riser', vol: 0.4, rev: 0.4 },
      bass: { inst: 'bass', vol: 0.9 },
      ost: { inst: 'strings', vol: 0.55, rev: 0.25, cutoff: 2500 },
      trem: { inst: 'tremolo', vol: 0.8, rev: 0.45 },
      pad: { inst: 'pad', vol: 0.6, rev: 0.5 },
      brass: { inst: 'brass', vol: 1, rev: 0.4 },
      high: { inst: 'strings', vol: 0.85, rev: 0.45 },
      choir: { inst: 'choir', vol: 0.9, rev: 0.6 },
    },
  },
  (s) => {
    const progA = 'Cm:2 Ab:2 Fm:2 G:2',
      progB = 'Cm Ab Eb Bb Cm Ab Fm G',
      progC = 'Ab Bb Cm Cm Ab Bb G G',
      progD = 'Cm Db Cm Db Cm Ab G G';
    const drive = (bar: number, prog: string) => {
      s.arp('ost', bar, prog, '0 0 2 0 1 0 2 0', 48, 1);
      s.bass('bass', bar, prog, 'R:2 R:2 8:2 R:2', 36);
    };
    s.grid('rain', 0, 'oooooooooooooooo', 32);

    // A (0–7): the wind picks up
    drive(0, progA);
    s.play('trem', 0, 'g5:16 | f5:8 eb5:8 | eb5:16 | c5:16 | c5:16 | ab4:8 c5:8 | b4:16 | d5:16');
    s.pad('pad', 0, progA, 60, { vel: 0.7 });
    s.grid('tom', 0, 'x.....x.....x.x.', 7, { midi: 45 });
    s.grid('tom', 7, 'x.x.x.x.xxxxxxxx', 1, { midi: 50 });
    s.grid('kick', 0, 'x.......x.......', 8);
    s.note('wind', 0, 60, 7, 0.9);
    s.note('wind', 16, 66, 7, 0.8);

    // B (8–15): the brass theme
    s.grid('crash', 8, 'x...............');
    s.play(
      'brass',
      8,
      'c5:6 d5:2 eb5:4 g5:4 | ab5:6 g5:2 eb5:8 | bb5:6 ab5:2 g5:4 eb5:4 | f5:6 d5:2 bb4:8 | ' +
        'c5:6 d5:2 eb5:4 g5:4 | c6:6 bb5:2 ab5:4 eb5:4 | f5:4 ab5:4 c6:4 f5:4 | b5:8 g5:4 d5:4',
    );
    drive(8, progB);
    s.pad('trem', 8, progB, 60, { vel: 0.6 });
    s.grid('kick', 8, 'x.....x...x.....', 8);
    s.grid('snare', 8, '....x.......x...', 7);
    s.grid('snare', 15, '....x.......xxxx');
    s.grid('hat', 8, 'x.x.x.x.x.x.x.x.', 8);
    s.bass('timp', 8, progB, 'R:12 R:4', 36);

    // C (16–23): the height of it
    s.grid('crash', 16, 'x...............');
    s.grid('crash', 20, 'x...............');
    s.note('thunder', 64, 60, 1);
    const high =
      'eb6:8 c6:8 | d6:8 bb5:8 | c6:6 d6:2 eb6:4 g6:4 | g6:16 | ' +
      'ab6:6 g6:2 eb6:8 | f6:6 eb6:2 d6:8 | d6:8 b5:8 | g5:16';
    s.play('high', 16, high);
    s.play('brass', 16, high, { transpose: -12, vel: 0.9 });
    s.pad('choir', 16, progC, 64);
    drive(16, progC);
    s.grid('kick', 16, 'x.....x.x.x.....', 8);
    s.grid('snare', 16, '....x.......x...', 7);
    s.grid('snare', 23, 'x.x.x.x.xxxxxxxx');
    s.grid('hat', 16, 'xxxxxxxxxxxxxxxx', 8, { vel: 0.7 });
    s.bass('timp', 16, progC, 'R:4 R:4 R:4 R:4', 36);

    // D (24–31): the bottom falls out
    s.note('thunder', 96, 60, 1);
    s.note('thunder', 112, 60, 1, 0.8);
    drive(24, progD);
    s.hits('brass', 24, progD, 'x.......x.....x.', 55, { vel: 0.8 });
    s.pad('choir', 24, progD, 60, { vel: 0.7 });
    s.play('trem', 24, 'c5:16 | db5:16 | c5:16 | db5:16 | eb5:16 | c5:16 | d5:16 | b4:16');
    s.grid('timp', 24, 'x.........x.....', 6, { midi: 36 });
    s.grid('timp', 30, 'x.x.x.x.xxxxxxxx|xxxxxxxxxxxxxxxx', 1, { midi: 43 });
    s.automate('timp', 'vol', 30, 2, 0.4, 1.2);
    s.note('wind', 104, 58, 7, 0.9);
    s.note('riser', 120, 60, 8);
  },
);
