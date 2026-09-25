import { compose } from '../score.ts';

// The Unmaker: the last fight, E minor with a Phrygian edge. A bell and choir open the void, then
// a supersaw lead drives over guitars, double kick, and orchestra hits; a Phrygian choir-and-organ
// section tilts the world sideways, a trembling breakdown gathers, and the theme returns at full
// height for the end of everything.
export const finalBoss = compose(
  {
    id: 'final_boss',
    title: 'Unmaker',
    mood: 'Final boss',
    bpm: 152,
    bars: 38,
    loopBar: 4,
    sidechain: { part: 'kick', depth: 0.35, release: 0.14 },
    parts: {
      kick: { inst: 'bigkick', vol: 0.8 },
      snare: { inst: 'snare', vol: 0.7, rev: 0.3 },
      hat: { inst: 'hat', vol: 0.35, pan: 0.25 },
      crash: { inst: 'crash', vol: 0.5, rev: 0.35 },
      taiko: { inst: 'taiko', vol: 0.8, rev: 0.5 },
      timp: { inst: 'timpani', vol: 0.8, rev: 0.5 },
      impact: { inst: 'impact', vol: 0.8, rev: 0.6 },
      riser: { inst: 'riser', vol: 0.4, rev: 0.4 },
      toll: { inst: 'toll', vol: 1.2, rev: 0.75 },
      lead: { inst: 'supersaw', vol: 0.75, rev: 0.35, echo: 0.15 },
      brass: { inst: 'brass', vol: 0.65, rev: 0.45 },
      strings: { inst: 'tremolo', vol: 0.55, rev: 0.5 },
      choir: { inst: 'choir', vol: 0.7, rev: 0.7 },
      organ: { inst: 'organ', vol: 0.55, rev: 0.5 },
      guitar: { inst: 'guitar', vol: 0.5, pan: -0.35, duck: true },
      guitar2: { inst: 'guitar', vol: 0.4, pan: 0.35, transpose: 12, duck: true },
      bass: { inst: 'synthbass', vol: 0.85, duck: true },
      hit: { inst: 'orchhit', vol: 0.7, rev: 0.5 },
    },
  },
  (s) => {
    const progA = 'Em C D B Em F G B',
      powerA = 'E5 C5 D5 B5 E5 F5 G5 B5',
      progB = 'Em F Em F G F Em B',
      powerB = 'E5 F5 E5 F5 G5 F5 E5 B5',
      progC = 'Am Em F B Am Em F B';
    const theme =
      'e5:2 g5:2 b5:4 a5:2 g5:2 f#5:4 | g5:2 a5:2 b5:4 e6:8 | d6:2 c6:2 b5:4 a5:2 b5:2 c6:4 | ' +
      'b5:12 d#5:4 | e5:2 g5:2 b5:4 c6:2 b5:2 a5:4 | g5:2 f5:2 e5:4 f5:8 | g5:4 a5:4 b5:4 d6:4 | ' +
      'd#6:8 b5:8';
    const drums = (bar: number, n: number) => {
      s.grid('kick', bar, 'x.x.x.x.x.x.x.x.', n);
      s.grid('snare', bar, '....x.......x...', n);
      s.grid('hat', bar, 'x.x.x.x.x.x.x.x.', n, { vel: 0.8 });
    };

    // Intro (0–3): the void opens.
    for (let b = 0; b < 4; b += 2) s.at('toll', b, 'e2', 6);
    s.pad('choir', 0, 'Em:2 F:1 B:1', 62);
    s.grid('timp', 2, 'oooooooxxxxxXXXX', 2, { midi: 40 });
    s.note('riser', 0, 60, 16);

    // A (4–11): the theme.
    s.note('impact', 16, 60, 1);
    s.grid('crash', 4, 'x...............');
    s.play('lead', 4, theme);
    s.hits('guitar', 4, powerA, 'x-.xx-.xx-.xx.xx', 52);
    s.hits('guitar2', 4, powerA, 'x-.xx-.xx-.xx.xx', 52);
    s.bass('bass', 4, progA, 'R:2', 28);
    s.hits('hit', 4, progA, 'x...............', 60);
    drums(4, 8);

    // B (12–19): Phrygian — the world tilts.
    s.grid('crash', 12, 'x...............');
    s.pad('choir', 12, progB, 64);
    s.pad('organ', 12, progB, 57);
    s.play(
      'brass',
      12,
      'e5:8 f5:8 | e5:4 d5:4 c5:8 | b4:8 c5:8 | d5:16 | g5:8 f5:8 | e5:4 f5:4 a5:8 | g5:8 f5:8 | d#5:16',
    );
    s.hits('guitar', 12, powerB, 'x-.xx-.xx-.xx.xx', 52);
    s.bass('bass', 12, progB, 'R:2', 28);
    s.grid('taiko', 12, 'x.......x.......', 8);
    drums(12, 7);
    s.grid('snare', 19, 'x.x.x.x.xxxxXXXX');

    // C (20–27): the breakdown gathers.
    s.pad('strings', 20, progC, 57);
    s.pad('choir', 20, progC, 64, { vel: 0.8 });
    s.bass('bass', 20, progC, 'R:8 R:8', 28);
    s.grid('kick', 20, 'x.......x.......', 6);
    s.grid('taiko', 20, 'x...x...x...x...', 6);
    s.hits('hit', 20, progC, 'x.......x.......', 60);
    s.grid('timp', 26, 'x.x.x.x.xxxxXXXX', 2, { midi: 40 });
    s.note('riser', 96, 60, 16);

    // D (28–37): the theme at full height, then the end of everything.
    s.note('impact', 112, 60, 1);
    s.grid('crash', 28, 'x...............');
    s.grid('crash', 32, 'x...............');
    s.play('lead', 28, theme, { transpose: 12, vel: 0.9 });
    s.play('brass', 28, theme, { vel: 0.8 });
    s.pad('choir', 28, progA, 64);
    s.hits('guitar', 28, powerA, 'x-.xx-.xx-.xx.xx', 52);
    s.hits('guitar2', 28, powerA, 'x-.xx-.xx-.xx.xx', 52);
    s.bass('bass', 28, progA, 'R:2', 28);
    drums(28, 8);
    s.grid('taiko', 28, 'x.......x.......', 8);
    s.hits('hit', 36, 'Em B', 'x.......x.x.x...', 60);
    s.bass('bass', 36, 'Em B', 'R:2', 28);
    s.grid('kick', 36, 'x.x.x.x.x.x.xxxx', 2);
    s.grid('snare', 36, '....x.......x...|x.x.x.x.xxxxXXXX');
  },
);
