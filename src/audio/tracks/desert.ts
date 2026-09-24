import { compose } from '../score.ts';

// Desert and badlands: E hijaz (Phrygian dominant). A nasal reed and oud over a darbuka maqsum
// groove and a drone, strings join the climb, and a percussion break rolls back to the top.
export const desert = compose(
  {
    id: 'desert',
    title: 'Mirage Caravan',
    mood: 'Desert · badlands',
    bpm: 110,
    bars: 30,
    loopBar: 2,
    parts: {
      doum: { inst: 'doum', vol: 0.9, rev: 0.15 },
      tek: { inst: 'tek', vol: 0.6, pan: 0.2, rev: 0.15 },
      frame: { inst: 'taiko', vol: 0.5, rev: 0.3 },
      tamb: { inst: 'tamb', vol: 0.35, pan: -0.3 },
      zill: { inst: 'zill', vol: 0.8, rev: 0.4, pan: 0.3 },
      riser: { inst: 'riser', vol: 0.35, rev: 0.3 },
      drone: { inst: 'pad', vol: 0.7, rev: 0.4, cutoff: 1000 },
      bass: { inst: 'bass', vol: 0.85 },
      oud: { inst: 'oud', vol: 0.8, pan: -0.2, rev: 0.25, echo: 0.1 },
      shawm: { inst: 'shawm', vol: 0.95, rev: 0.35, echo: 0.15 },
      strings: { inst: 'strings', vol: 0.8, rev: 0.4 },
      pad: { inst: 'pad', vol: 0.5, rev: 0.45 },
    },
  },
  (s) => {
    const progA = 'E E F E Am G F E',
      progB = 'Am Dm E E Am Dm F E';
    const maqsum = (bar: number, bars: number, busy: boolean) => {
      s.grid('doum', bar, 'x.......x.......', bars);
      s.grid('tek', bar, busy ? '..x.o.x.o.o.x.oo' : '..x...x.....x...', bars);
      s.grid('tamb', bar, '....x.......x...', bars);
      s.grid('zill', bar, 'x...............', bars);
    };

    // Intro (0–1)
    s.pad('drone', 0, 'E5:2', 52);
    s.arp('oud', 0, 'E E', '0 1 0 2 0 1 2 1', 52, 2, { vel: 0.8 });
    maqsum(0, 2, false);

    // A (2–9)
    const themeA =
      'e5:2 f5:2 g#5:4 a5:2 g#5:2 f5:4 | e5:4 f5:2 e5:2 d5:2 e5:6 | ' +
      'f5:2 a5:2 c6:4 b5:2 a5:2 f5:4 | a5:2 g#5:2 f5:2 e5:10 | ' +
      'e5:2 a5:2 c6:4 b5:2 a5:2 e5:4 | d5:2 g5:2 b5:4 a5:2 g5:2 d5:4 | ' +
      'c5:2 f5:2 a5:4 g#5:2 a5:2 f5:4 | e5:2 f5:2 e5:2 d5:2 e5:8';
    s.play('shawm', 2, themeA);
    s.pad('drone', 2, 'E5 E5 F5 E5 A5 G5 F5 E5', 52);
    s.bass('bass', 2, progA, 'R:6 R:2 5:4 R:4', 40);
    s.arp('oud', 2, progA, '0 1 0 2 0 1 2 1', 52, 2, { vel: 0.7 });
    maqsum(2, 8, false);

    // B (10–17)
    const themeB =
      'a5:4 c6:4 e6:4 d6:2 c6:2 | d6:4 f6:4 e6:2 d6:2 c6:4 | ' +
      'b5:2 c6:2 b5:2 a5:2 g#5:4 f5:4 | e5:12 r:4 | ' +
      'e6:4 c6:2 a5:2 e6:4 d6:4 | f6:4 d6:2 a5:2 d6:4 c6:4 | ' +
      'c6:2 d6:2 c6:2 b5:2 a5:4 f5:4 | g#5:4 f5:2 e5:10';
    s.play('strings', 10, themeB, { transpose: -12 });
    s.play('oud', 10, themeB, { vel: 0.9 });
    s.pad('pad', 10, progB, 60);
    s.bass('bass', 10, progB, 'R:6 R:2 5:4 R:4', 40);
    maqsum(10, 8, true);
    s.grid('frame', 10, 'x.......x.......', 8);

    // A' (18–25): everyone on the theme
    s.play('shawm', 18, themeA);
    s.play('strings', 18, themeA, { transpose: -12, vel: 0.7 });
    s.pad('drone', 18, 'E5 E5 F5 E5 A5 G5 F5 E5', 52);
    s.pad('pad', 18, progA, 60, { vel: 0.8 });
    s.bass('bass', 18, progA, 'R:6 R:2 5:4 R:4', 40);
    s.arp('oud', 18, progA, '0 1 0 2 0 1 2 1', 64, 2, { vel: 0.6 });
    maqsum(18, 8, true);
    s.grid('frame', 18, 'x.......x.......', 8);

    // Break (26–29): darbuka solo over the drone and an oud ostinato
    s.pad('drone', 26, 'E5:4', 52);
    const ostinato = 'e4:2 e4:1 e4:1 f4:2 e4:2 g#4:2 e4:2 f4:2 e4:2';
    s.play('oud', 26, [ostinato, ostinato, ostinato, ostinato].join(' | '));
    s.grid('doum', 26, 'x..x....x..x....|x..x....x..x....|x..x..x.x..x....|x.x.x.x.xxxxxxxx');
    s.grid('tek', 26, '..xoxo.x.oxoxox.|..xoxo.x.oxoxox.|.xoxoxoxoxoxoxox|.x.x.x.x........');
    s.grid('zill', 26, 'x.......x.......', 4);
    s.note('riser', 112, 60, 8, 0.8);
  },
);
