import { compose } from '../score.ts';

// Skyreach: D major, wide open and climbing. A harp ripples under a flute that soars over the
// cloud sea; brass takes the tune as the drums arrive, a choir fills the sky, and the whole
// band lifts for one last flight before the wind carries it off.
export const skyreach = compose(
  {
    id: 'skyreach',
    title: 'Above the Cloud Sea',
    mood: 'Skyreach',
    bpm: 126,
    bars: 32,
    parts: {
      flute: { inst: 'flute', vol: 0.8, rev: 0.5, echo: 0.2 },
      brass: { inst: 'brass', vol: 0.7, rev: 0.5 },
      strings: { inst: 'strings', vol: 0.6, rev: 0.6 },
      harp: { inst: 'harp', vol: 0.55, rev: 0.5, pan: -0.25 },
      pulse: { inst: 'pulse', vol: 0.35, rev: 0.3, echo: 0.3, pan: 0.3, cutoff: 3200 },
      choir: { inst: 'choir', vol: 0.55, rev: 0.75 },
      bell: { inst: 'bell', vol: 0.4, rev: 0.6, echo: 0.3 },
      bass: { inst: 'bass', vol: 0.85 },
      kick: { inst: 'kick', vol: 0.75 },
      snare: { inst: 'snare', vol: 0.55, rev: 0.3 },
      hat: { inst: 'hat', vol: 0.35, pan: 0.2 },
      crash: { inst: 'crash', vol: 0.45, rev: 0.4 },
      taiko: { inst: 'taiko', vol: 0.7, rev: 0.5 },
      timp: { inst: 'timpani', vol: 0.7, rev: 0.5 },
      wind: { inst: 'wind', vol: 0.3, rev: 0.4 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.35,
  },
  (s) => {
    const progA = 'D A Bm G D A G A',
      progB = 'Em G D A Em G A A',
      intro = 'D G D A';
    const theme =
      'a5:4 d6:4 f#6:4 e6:4 | e6:8 c#6:4 a5:4 | b5:4 d6:4 f#6:4 a6:4 | g6:8 f#6:4 e6:4 | ' +
      'f#6:4 a6:4 d7:4 c#7:4 | c#7:8 a6:4 e6:4 | d7:4 b6:4 g6:4 b6:4 | a6:16';
    const beat = (bar: number, n: number, busy = false) => {
      s.grid('kick', bar, busy ? 'x.....x.x.......' : 'x.......x.......', n);
      s.grid('snare', bar, '....x.......x...', n);
      s.grid('hat', bar, 'x.x.x.x.x.x.x.x.', n, { vel: 0.8 });
    };

    // Intro (0–3): wind and harp over the clouds.
    s.note('wind', 0, 72, 16);
    s.arp('harp', 0, intro, '0 1 2 3 4 3 2 1', 55, 2);
    s.pad('strings', 0, intro, 62, { vel: 0.7 });
    s.bass('bass', 0, intro, 'R:16', 38, { vel: 0.8 });

    // A (4–11): the flute takes flight.
    s.play('flute', 4, theme);
    s.arp('pulse', 4, progA, '0 1 2 1 3 1 2 1', 62, 2);
    s.arp('harp', 4, progA, '0 2 1 2 3 2 1 2', 50, 2, { vel: 0.8 });
    s.pad('strings', 4, progA, 62, { vel: 0.7 });
    s.bass('bass', 4, progA, 'R:6 R:2 5:4 8:4', 38);
    beat(4, 8);
    s.grid('crash', 4, 'x...............');

    // B (12–19): brass and choir; the sky opens.
    s.play('brass', 12, theme, { transpose: -12 });
    s.play('flute', 12, 'e6:16 | g6:16 | f#6:16 | e6:16 | b6:16 | d7:16 | c#7:8 e7:8 | e7:16');
    s.pad('choir', 12, progB, 64);
    s.arp('pulse', 12, progB, '0 1 2 3 2 1 2 3', 62, 2);
    s.bass('bass', 12, progB, 'R:6 R:2 5:4 8:4', 38);
    beat(12, 7, true);
    s.grid('taiko', 12, 'x.......x.......', 8);
    s.grid('kick', 19, 'x.x.x.x.xxxxxxxx');
    s.grid('snare', 19, '....x.x.xxxxXXXX');
    s.grid('crash', 12, 'x...............');

    // C (20–27): the climb: everyone on the theme, the timpani underneath.
    s.play('flute', 20, theme, { transpose: 12, vel: 0.8 });
    s.play('strings', 20, theme, { vel: 0.9 });
    s.play('brass', 20, theme, { transpose: -12, vel: 0.9 });
    s.pad('choir', 20, progA, 64);
    s.bass('bass', 20, progA, 'R:4 8:4 R:4 5:4', 38);
    beat(20, 8, true);
    s.grid('timp', 20, 'x.......x.......', 8, { midi: 38 });
    s.grid('crash', 20, 'x...............');
    s.grid('crash', 24, 'x...............');

    // D (28–31): gliding off on the wind.
    s.arp('harp', 28, intro, '4 3 2 1 0 1 2 3', 55, 2);
    s.pad('strings', 28, intro, 62, { vel: 0.6 });
    s.play('bell', 28, 'a6:8 f#6:8 | g6:8 b6:8 | a6:16 | a6:16');
    s.bass('bass', 28, intro, 'R:16', 38, { vel: 0.7 });
    s.note('wind', 112, 72, 16);
  },
);
