import { compose } from '../score.ts';

// The Direwolf hunt: 160 bpm in C# minor. A howl and orchestra hits, then overdriven
// power-chord riffing under a pulse lead, a half-time breakdown with choir and brass, the lead
// again an octave up with everything behind it, and a turnaround riff back into the fight.
export const boss = compose(
  {
    id: 'boss',
    title: 'Direwolf',
    mood: 'Boss battle',
    bpm: 160,
    bars: 40,
    loopBar: 4,
    sidechain: { part: 'kick', depth: 0.35, release: 0.14 },
    parts: {
      kick: { inst: 'bigkick', vol: 0.8 },
      snare: { inst: 'snare', vol: 0.75, rev: 0.25 },
      hat: { inst: 'hat', vol: 0.45, pan: 0.3 },
      ride: { inst: 'ride', vol: 0.6, pan: -0.25 },
      crash: { inst: 'crash', vol: 0.65, rev: 0.25 },
      tom: { inst: 'tom', vol: 0.7, rev: 0.25 },
      taiko: { inst: 'taiko', vol: 0.8, rev: 0.4 },
      timp: { inst: 'timpani', vol: 0.9, rev: 0.4 },
      riser: { inst: 'riser', vol: 0.4, rev: 0.3 },
      impact: { inst: 'impact', vol: 0.8, rev: 0.4 },
      howl: { inst: 'howl', vol: 0.6, rev: 0.8, echo: 0.3, pan: 0.3 },
      bass: { inst: 'synthbass', vol: 0.9, duck: true },
      guitar: { inst: 'guitar', vol: 0.9, pan: -0.35 },
      guitar2: { inst: 'guitar', vol: 0.55, pan: 0.35, transpose: 12 },
      pad: { inst: 'pad', vol: 0.6, duck: true, rev: 0.4 },
      choir: { inst: 'choir', vol: 0.85, rev: 0.6 },
      brass: { inst: 'brass', vol: 1, rev: 0.35 },
      lead: { inst: 'pulse', vol: 0.8, rev: 0.25, echo: 0.2 },
      lead2: { inst: 'supersaw', vol: 0.7, rev: 0.25, echo: 0.1 },
      hit: { inst: 'orchhit', vol: 0.9, rev: 0.4 },
    },
  },
  (s) => {
    const riff = 'C#5 C#5 A5 B5 C#5 C#5 A5 G#5',
      harm = 'C#m C#m A B C#m C#m A G#',
      breakdown = 'A B C#m C#m A B G# G#',
      breakPower = 'A5 B5 C#5 C#5 A5 B5 G#5 G#5',
      turn = 'C#m A B G#',
      turnPower = 'C#5 A5 B5 G#5';
    const chug = 'x-.xx-.xx-.xx.xx';
    const rock = (bar: number, bars: number, kick: string) => {
      s.grid('kick', bar, kick, bars);
      s.grid('snare', bar, '....x.......x...', bars);
    };
    const lead =
      'c#5:2 e5:2 g#5:4 f#5:2 e5:2 d#5:2 e5:2 | c#5:8 g#4:8 | a4:2 c#5:2 e5:4 f#5:2 e5:2 c#5:4 | ' +
      'd#5:6 f#5:2 b5:8 | c#6:2 b5:2 g#5:4 a5:2 g#5:2 f#5:2 e5:2 | g#5:8 e5:4 c#5:4 | ' +
      'e5:4 f#5:4 a5:4 c#6:4 | b#5:4 d#6:4 g#6:8';

    // Intro (0–3): the howl, then the hits
    s.play('howl', 0, 'g#4:24 r:8 | r:32');
    s.grid('timp', 0, 'o.o.o.o.o.o.o.o.|oooooooooooooooo|xxxxxxxxxxxxxxxx|XXXXXXXX........', 1, {
      midi: 37,
    });
    s.play('hit', 2, 'r:16 | >c#4:3 c#4:3 c#4:2 >g#3:8');
    s.pad('choir', 0, 'C#m:2 A G#', 60, { vel: 0.8 });
    s.note('riser', 4, 60, 12);

    // A (4–11): the riff
    s.note('impact', 16, 60, 1);
    s.grid('crash', 4, 'x...............');
    s.grid('crash', 8, 'x...............');
    s.hits('guitar', 4, riff, chug, 49);
    s.hits('guitar2', 4, riff, chug, 49);
    s.bass('bass', 4, harm, 'R:2', 32);
    rock(4, 7, 'x.x.x.xxx.x.x.xx');
    rock(11, 1, 'x.x.x.xxxxxxxxxx');
    s.grid('hat', 4, 'x.x.x.x.x.x.x.x.', 8);
    s.play('hit', 4, '>c#4:16 | r:16 | r:16 | r:16 | c#4:16 | r:16 | r:16 | r:8 >g#3:8');
    s.play('brass', 4, 'r:16 | r:8 g#4:8 | a4:16 | b4:16 | r:16 | r:8 g#4:8 | c#5:16 | b#4:16', {
      vel: 0.8,
    });

    // B (12–19): the lead
    s.grid('crash', 12, 'x...............');
    s.play('lead', 12, lead);
    s.play('lead2', 12, lead, { transpose: -12, vel: 0.8 });
    s.hits('guitar', 12, riff, 'x-.x..x-.x..x-x-', 49);
    s.hits('guitar2', 12, riff, 'x-.x..x-.x..x-x-', 49);
    s.pad('pad', 12, harm, 60, { vel: 0.8 });
    s.bass('bass', 12, harm, 'R:2', 32);
    rock(12, 8, 'x..x..x.x..x..x.');
    s.grid('ride', 12, 'x.x.x.x.x.x.x.x.', 8);

    // C (20–27): half-time breakdown
    s.note('impact', 80, 60, 1);
    s.grid('crash', 20, 'x...............');
    s.hits('guitar', 20, breakPower, 'x-------x--.x...', 49);
    s.hits('guitar2', 20, breakPower, 'x-------x--.x...', 49);
    s.play('brass', 20, 'e5:16 | f#5:16 | g#5:16 | g#5:8 b5:8 | c#6:16 | d#6:16 | b#5:16 | g#5:16');
    s.play(
      'lead2',
      20,
      'e5:16 | f#5:16 | g#5:16 | g#5:8 b5:8 | c#6:16 | d#6:16 | b#5:16 | g#5:16',
      {
        transpose: -12,
        vel: 0.5,
      },
    );
    s.pad('choir', 20, breakdown, 62);
    s.bass('bass', 20, breakdown, 'R:8 R:6 R:2', 32);
    s.grid('kick', 20, 'x.........x.....', 8);
    s.grid('snare', 20, '........x.......', 7);
    s.grid('snare', 27, '........x.x.xxxx');
    s.grid('taiko', 20, '....x......x..x.', 8);
    s.bass('timp', 20, breakdown, 'R:8 R:8', 37);
    s.grid('hat', 20, 'x.x.x.x.x.x.x.x.', 8, { vel: 0.6 });

    // D (28–35): the lead an octave up, all hands
    s.grid('crash', 28, 'x...............');
    s.grid('crash', 32, 'x...............');
    s.play('lead', 28, lead, { transpose: 12 });
    s.play('lead2', 28, lead);
    s.play('brass', 28, lead, { vel: 0.8 });
    s.hits('guitar', 28, riff, chug, 49);
    s.hits('guitar2', 28, riff, chug, 49);
    s.pad('choir', 28, harm, 64, { vel: 0.8 });
    s.pad('pad', 28, harm, 60, { vel: 0.8 });
    s.bass('bass', 28, harm, 'R:1 R:1 8:1 R:1', 32);
    rock(28, 8, 'x.x.x.xxx.x.x.xx');
    s.grid('ride', 28, 'x.x.x.x.x.x.x.x.', 8);
    s.play('hit', 28, '>c#4:16 | r:16 | r:16 | r:16 | c#4:16 | r:16 | r:16 | r:16');

    // E (36–39): turnaround riff and fills back into A
    s.hits('guitar', 36, turnPower, 'x.xx.xx.x.xx.x.x', 49);
    s.hits('guitar2', 36, turnPower, 'x.xx.xx.x.xx.x.x', 49);
    s.bass('bass', 36, turn, 'R:2', 32);
    s.play(
      'hit',
      36,
      '>c#4:3 c#4:3 c#4:10 | a3:3 a3:3 a3:10 | b3:3 b3:3 b3:10 | >g#3:3 g#3:3 g#3:2 g#3:8',
    );
    rock(36, 3, 'x.x.x.xxx.x.x.xx');
    s.grid('kick', 39, 'x.x.x.x.x.x.x.x.');
    s.grid('tom', 39, 'x.x.x.x.xxxxxxxx', 1, { midi: 48 });
    s.grid('hat', 36, 'x.x.x.x.x.x.x.x.', 4);
    s.note('riser', 148, 60, 8);
  },
);
