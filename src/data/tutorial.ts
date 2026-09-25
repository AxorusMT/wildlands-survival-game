// The Training Grounds: a short course a new expedition can start in. Each station has a
// signpost and a few lessons, shown one at a time in the HUD while you are on the course.
import type { Objective } from '../core/types.ts';

export interface CourseStation {
  /** Local x of the station's signpost in the course. */
  at: number;
  name: string;
  sign: string;
  lessons: Objective[];
}

export const STATIONS: CourseStation[] = [
  {
    at: 520,
    name: 'First steps',
    sign: 'A / D walk, W or Space jumps, S drops down. E reads signs, gathers, and uses things. The portal behind you leaves the course whenever you like.',
    lessons: [['Read the signpost (E)', 'sign:0', 1]],
  },
  {
    at: 610,
    name: 'Ledges and shafts',
    sign: 'Jump the step and the gap. At a ladder, hold W to climb and S to go down. Climb down into the hollow below, then back up the far ladder.',
    lessons: [['Climb down into the hollow', 'course:climb', 1]],
  },
  {
    at: 1340,
    name: 'The grove',
    sign: 'Stand by trees, stones and fibre and press E to gather. Open the journal (J) and choose Recipes to craft. Tools make gathering and mining faster.',
    lessons: [
      ['Gather wood', 'wood', 8],
      ['Gather stone', 'stone', 8],
      ['Collect fibre', 'fiber', 4],
      ['Craft a stone axe (J → Recipes)', 'craft:stone_axe', 1],
      ['Craft a stone pickaxe', 'craft:stone_pick', 1],
      ['Craft a campfire', 'craft:campfire', 1],
      ['Place the campfire (pick it on the hotbar, click the ground)', 'place:campfire', 1],
    ],
  },
  {
    at: 2000,
    name: 'The pond',
    sign: 'Wild water can carry dysentery. Collect it with E, boil it at a campfire in Recipes, then drink it from your Pack. Thirst drains faster in the heat.',
    lessons: [
      ['Collect untreated water', 'wild_water', 1],
      ['Boil water at the campfire', 'craft:boiled_water', 1],
      ['Drink safe water from your Pack', 'drink:boiled_water', 1],
    ],
  },
  {
    at: 2370,
    name: 'The rock face',
    sign: 'Hold R or click to mine the ground itself, and gather ore with E. Harder rock needs a better pickaxe: copper, then iron, and on up the tiers.',
    lessons: [['Mine copper ore', 'copper_ore', 2]],
  },
  {
    at: 2800,
    name: 'The pen',
    sign: 'Press F to strike. Slimes fight back; deer run. Cook raw meat at the campfire. Raw meat can make you ill, and a varied diet keeps you strong.',
    lessons: [
      ['Slay the slime (F)', 'kill:slime', 1],
      ['Hunt a deer', 'kill:deer', 1],
      ['Cook meat at the campfire', 'craft:cooked_meat', 1],
      ['Eat the cooked meat', 'eat:cooked_meat', 1],
    ],
  },
  {
    at: 3350,
    name: 'The icebox',
    sign: 'Food rots: fast in the heat, slowly in the cold. Press E at cold storage to open it, then stow food from your Pack. An icebox needs ice; a cool pit needs nothing.',
    lessons: [['Stow food in the icebox', 'stow', 1]],
  },
  {
    at: 3530,
    name: 'The brambles',
    sign: 'Wounds, illness and exposure show on the HUD as ailments. Hover one to see its cause and cure. Walk through the brambles, then bandage yourself from your Pack.',
    lessons: [
      ['Open the chest past the brambles', 'bandage', 1],
      ['Bandage your bleeding', 'cure:bleeding', 1],
    ],
  },
  {
    at: 3840,
    name: 'The wardrobe',
    sign: 'Clothes keep out cold, heat and rain, and they wear out as they do. Mend worn gear on the Gear page. Put on the coat from the chest.',
    lessons: [['Wear the oilskin coat', 'wear:oilskin_coat', 1]],
  },
  {
    at: 4020,
    name: 'The Waystone',
    sign: 'A Waystone opens generated realms. Turn a realm key in it: three fragments make a key, and the first fragments come from the old dungeons and their sigils.',
    lessons: [['Read the Waystone signpost', 'sign:9', 1]],
  },
  {
    at: 4220,
    name: 'The journal',
    sign: 'In the journal (J): Skills spends Renown, the Codex fills as you discover things, Feats earn titles, and the Atlas tracks realms. The portal ahead leads to the wildlands.',
    lessons: [
      ['Read the journal signpost', 'sign:10', 1],
      ['Step through the portal to the wildlands', 'course:done', 1],
    ],
  },
];

/** Every lesson in the course, in order. */
export const COURSE: Objective[] = STATIONS.flatMap((s) => s.lessons);
/** The station a lesson belongs to. */
export const stationOf = (lesson: number) => {
  let i = lesson;
  for (const [n, s] of STATIONS.entries()) {
    if (i < s.lessons.length) return n;
    i -= s.lessons.length;
  }
  return STATIONS.length - 1;
};
