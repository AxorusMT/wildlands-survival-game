import type { NodeSpec, ToolTier, WeaponSpec } from '../core/types.ts';

// Gatherable resources: yield range, required tool and tier, hit points, and regrowth seconds.
export const NODES: Record<string, NodeSpec> = {
  wood: { yield: [2, 4], tool: 'axe', req: 0, hp: 3, regen: 170 },
  stone: { yield: [2, 4], tool: 'pick', req: 0, hp: 3, regen: 160 },
  fiber: { yield: [2, 4], hp: 2, regen: 115 },
  flint: { yield: [1, 2], tool: 'pick', req: 0, hp: 2, regen: 185 },
  clay: { yield: [2, 3], tool: 'pick', req: 0, hp: 3, regen: 180 },
  copper_ore: { yield: [2, 3], tool: 'pick', req: 1, hp: 3, regen: 260 },
  iron_ore: { yield: [2, 3], tool: 'pick', req: 2, hp: 3, regen: 310 },
  coal: { yield: [2, 3], tool: 'pick', req: 1, hp: 3, regen: 250 },
  ice: { yield: [2, 3], tool: 'pick', req: 2, hp: 3, regen: 280 },
  obsidian: { yield: [2, 3], tool: 'pick', req: 4, hp: 4, regen: 400 },
  sulfur: { yield: [2, 3], tool: 'pick', req: 3, hp: 3, regen: 330 },
  berry: { yield: [1, 3], hp: 2, regen: 180 },
  mushroom: { yield: [1, 2], hp: 2, regen: 230 },
  honey: { yield: [1, 2], hp: 1, regen: 380 },
  willow: { yield: [1, 2], hp: 2, regen: 260 },
  herb: { yield: [1, 3], hp: 2, regen: 200 },
  wheat: { yield: [2, 3], hp: 2, regen: 200 },
  potato: { yield: [1, 3], hp: 2, regen: 230 },
  water: { yield: [1, 1], hp: Infinity, regen: 0 },
  resin: { yield: [1, 2], tool: 'axe', req: 1, hp: 2, regen: 250 },
  reeds: { yield: [2, 4], hp: 3, regen: 170 },
  salt: { yield: [1, 3], tool: 'pick', req: 0, hp: 2, regen: 240 },
  crystal: { yield: [1, 2], tool: 'pick', req: 3, hp: 3, regen: 400 },
  hellstone: { yield: [2, 3], tool: 'pick', req: 5, hp: 4, regen: 0 },
  cactus_fruit: { yield: [1, 2], hp: 2, regen: 230 },
};

/** Trees topple and regrow from the stump, minerals crumble away for good, plants are picked. */
export type NodeForm = 'tree' | 'mineral' | 'plant' | 'water';
export function nodeForm(kind: string): NodeForm {
  if (kind === 'water') return 'water';
  if (kind === 'wood' || kind === 'resin' || kind === 'honey') return 'tree';
  return NODES[kind]?.tool === 'pick' ? 'mineral' : 'plant';
}

export const TOOL_TIERS: Record<string, ToolTier> = {
  stone_axe: ['axe', 1],
  stone_pick: ['pick', 1],
  copper_axe: ['axe', 2],
  copper_pick: ['pick', 2],
  iron_axe: ['axe', 3],
  iron_pick: ['pick', 3],
  steel_axe: ['axe', 4],
  steel_pick: ['pick', 4],
  obsidian_axe: ['axe', 5],
  obsidian_pick: ['pick', 5],
};
export const WEAPONS: Record<string, WeaponSpec> = {
  fists: [1, 7, 42],
  flint_spear: [1, 17, 68],
  copper_spear: [2, 26, 68],
  iron_sword: [3, 36, 62],
  steel_sword: [4, 47, 65],
  obsidian_blade: [5, 61, 67],
  eclipse_blade: [6, 85, 73],
  hellfire_blade: [6, 76, 70],
};
