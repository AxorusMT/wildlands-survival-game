import type { BossSpec } from '../core/types.ts';

// The three Direwolves the Effergy of Beasts can summon, in order.
export const BOSSES: BossSpec[] = [
  {
    name: 'Eclipse Direwolf',
    kills: 6,
    hp: 380,
    bite: 19,
    rewards: { eclipse_fang: 1, direwolf_pelt: 2, beast_core: 1 },
    xp: 50,
    color: '#a8d9e5',
    glow: '#cdeaff',
  },
  {
    name: 'Ember Direwolf',
    kills: 9,
    hp: 620,
    bite: 26,
    rewards: { eclipse_fang: 2, direwolf_pelt: 3, beast_core: 2 },
    xp: 90,
    color: '#e89454',
    glow: '#ffbc70',
  },
  {
    name: 'Void Direwolf',
    kills: 12,
    hp: 920,
    bite: 34,
    rewards: { eclipse_fang: 3, direwolf_pelt: 5, beast_core: 3 },
    xp: 150,
    color: '#af86d3',
    glow: '#e3baf7',
  },
];
