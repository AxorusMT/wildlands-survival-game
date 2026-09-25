import { compose } from '../score.ts';

// The Sunken Tomb: D Phrygian dominant, the old scale of the desert. A doum and tek groove, an
// oud turning the same few notes like sand through fingers, and a shawm singing the tomb's
// lament; a quiet middle of strings and bells before the procession returns.
export const tomb = compose(
  {
    id: 'tomb',
    title: 'Sand and Silence',
    mood: 'The Sunken Tomb',
    bpm: 100,
    bars: 24,
    parts: {
      doum: { inst: 'doum', vol: 0.9 },
      tek: { inst: 'tek', vol: 0.5, pan: 0.2 },
      zill: { inst: 'zill', vol: 0.35, pan: -0.3, rev: 0.3 },
      shaker: { inst: 'shaker', vol: 0.3, pan: 0.35 },
      oud: { inst: 'oud', vol: 0.75, rev: 0.35, echo: 0.2, pan: -0.15 },
      shawm: { inst: 'shawm', vol: 0.8, rev: 0.5, echo: 0.2 },
      reed: { inst: 'reed', vol: 0.6, rev: 0.5, pan: 0.2 },
      strings: { inst: 'strings', vol: 0.5, rev: 0.6, cutoff: 2400 },
      bell: { inst: 'bell', vol: 0.4, rev: 0.6, echo: 0.3 },
      bass: { inst: 'bass', vol: 0.9 },
      riser: { inst: 'riser', vol: 0.35, rev: 0.4 },
      impact: { inst: 'impact', vol: 0.6, rev: 0.6 },
    },
    echoBeats: 0.75,
    echoFeedback: 0.35,
  },
  (s) => {
    const progA = 'D Eb D Cm Gm D D D',
      progB = 'Gm Eb D D Gm Cm D D',
      progC = 'D:2 Eb:2 D:2 Eb:2';
    const lament =
      'd5:2 eb5:2 f#5:4 g5:4 a5:4 | bb5:4 a5:4 g5:2 f#5:2 eb5:4 | d5:6 eb5:2 d5:8 | c5:4 eb5:4 d5:8 | ' +
      'g5:2 a5:2 bb5:4 c6:4 bb5:4 | a5:4 g5:4 f#5:4 eb5:4 | f#5:4 g5:2 f#5:2 eb5:4 d5:4 | d5:16';
    const groove = (bar: number, n: number) => {
      s.grid('doum', bar, 'x..x..x...x.x...', n);
      s.grid('tek', bar, '..x..x.x.x..x.xx', n, { vel: 0.8 });
      s.grid('shaker', bar, 'x.x.x.x.x.x.x.x.', n, { vel: 0.7 });
    };

    // A (0–7): the procession.
    groove(0, 8);
    s.arp('oud', 0, progA, '0 1 2 1 0 1 3 1', 50, 2);
    s.bass('bass', 0, progA, 'R:6 R:2 5:4 R:4', 26);
    s.play('shawm', 0, lament);
    s.grid('zill', 0, 'x...............', 8);

    // B (8–15): the lament rises an octave, strings and reed beneath.
    groove(8, 8);
    s.play('shawm', 8, lament, { transpose: 12, vel: 0.9 });
    s.play('reed', 8, lament, { vel: 0.6 });
    s.pad('strings', 8, progB, 60);
    s.arp('oud', 8, progB, '0 2 1 2 0 2 3 2', 50, 2, { vel: 0.8 });
    s.bass('bass', 8, progB, 'R:6 R:2 5:4 R:4', 26);
    s.grid('zill', 8, 'x.......x.......', 8);

    // C (16–23): stillness in the burial chamber, then the drums call the procession back.
    s.pad('strings', 16, progC, 60, { vel: 0.8 });
    s.arp('oud', 16, progC, '0 r 1 r 2 r 1 r', 50, 2, { vel: 0.7 });
    s.bass('bass', 16, progC, 'R:16', 26, { vel: 0.8 });
    s.play('bell', 16, 'a5:8 bb5:8 | a5:16 | f#5:8 g5:8 | a5:16');
    s.grid('doum', 18, 'x.......x.......', 2, { vel: 0.7 });
    s.note('riser', 76, 60, 4);
    s.note('impact', 80, 60, 1);
    groove(20, 4);
    s.play(
      'shawm',
      20,
      'g5:2 a5:2 bb5:4 c6:4 bb5:4 | a5:4 g5:4 f#5:4 eb5:4 | f#5:4 g5:2 f#5:2 eb5:4 d5:4 | d5:16',
    );
    s.bass('bass', 20, 'Gm D D D', 'R:6 R:2 5:4 R:4', 26);
  },
);
