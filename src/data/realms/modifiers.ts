// Realm modifiers: rolled onto each expedition, one fewer than its tier. Banes make the realm
// harder; every modifier, boon or bane, adds to the loot.

export interface RealmMod {
  id: string;
  name: string;
  text: string;
  kind: 'boon' | 'bane';
  /** Added to the loot multiplier. */
  loot: number;
}
export const MODS: RealmMod[] = [
  { id: 'bountiful', name: 'Bountiful', text: 'More to gather', kind: 'boon', loot: 0.1 },
  { id: 'rich_veins', name: 'Rich veins', text: 'Ore lies thick', kind: 'boon', loot: 0.15 },
  { id: 'treasure', name: 'Treasure trove', text: 'Extra chests', kind: 'boon', loot: 0.15 },
  { id: 'lucky', name: 'Lucky', text: 'Loot +50%', kind: 'boon', loot: 0.5 },
  {
    id: 'fortified',
    name: 'Fortified',
    text: 'Monsters have +40% health',
    kind: 'bane',
    loot: 0.2,
  },
  { id: 'savage', name: 'Savage', text: 'Monsters hit 30% harder', kind: 'bane', loot: 0.25 },
  {
    id: 'swarming',
    name: 'Swarming',
    text: 'Half again as many monsters',
    kind: 'bane',
    loot: 0.2,
  },
  { id: 'frenzied', name: 'Frenzied', text: 'Monsters move 30% faster', kind: 'bane', loot: 0.2 },
  { id: 'hunted', name: 'Hunted', text: 'An elite stalks you', kind: 'bane', loot: 0.3 },
  {
    id: 'hungering',
    name: 'Hungering',
    text: 'Food and water drain 50% faster',
    kind: 'bane',
    loot: 0.2,
  },
  { id: 'frostbound', name: 'Frostbound', text: '18° colder', kind: 'bane', loot: 0.2 },
  { id: 'scorched', name: 'Scorched', text: '18° hotter', kind: 'bane', loot: 0.2 },
  { id: 'starless', name: 'Starless', text: 'Almost no light', kind: 'bane', loot: 0.25 },
  {
    id: 'low_gravity',
    name: 'Low gravity',
    text: 'You fall slowly and jump high',
    kind: 'boon',
    loot: 0.05,
  },
  {
    id: 'unstable',
    name: 'Unstable',
    text: 'The realm collapses after 10 minutes',
    kind: 'bane',
    loot: 0.35,
  },
  {
    id: 'blighted',
    name: 'Blighted',
    text: 'Wounds and bites sicken twice as often',
    kind: 'bane',
    loot: 0.25,
  },
  { id: 'echoing', name: 'Echoing', text: 'Slain monsters split in two', kind: 'bane', loot: 0.3 },
];
export const modById = (id: string) => MODS.find((m) => m.id === id);

/** Rolls the modifiers for an expedition of a tier: one fewer than the tier, no repeats. */
export function rollMods(tier: number, rng: () => number): string[] {
  const pool = [...MODS],
    out: string[] = [];
  const clash: Record<string, string> = { frostbound: 'scorched', scorched: 'frostbound' };
  while (out.length < Math.max(0, tier - 1) && pool.length) {
    const m = pool.splice(Math.floor(rng() * pool.length), 1)[0];
    if (clash[m.id] && out.includes(clash[m.id])) continue;
    out.push(m.id);
  }
  return out;
}

/** How a realm's tier scales its monsters and loot. */
export const TIER_SCALE = {
  hp: (t: number) => 1 + 0.55 * (t - 1),
  damage: (t: number) => 1 + 0.3 * (t - 1),
  loot: (t: number) => 1 + 0.4 * (t - 1),
};
export const MAX_TIER = 5;
export const TIER_NAMES = ['', 'I', 'II', 'III', 'IV', 'V'];
