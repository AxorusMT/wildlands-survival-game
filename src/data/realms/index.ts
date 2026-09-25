// Generated realms: templates, modifiers, and which one fills the pocket strip right now.
import { ORCHARD } from './orchard.ts';
import { STEPPE } from './steppe.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';
import { WARREN } from './warren.ts';

export * from './modifiers.ts';
export * from './shared.ts';
export * from './types.ts';
export { tideLevel, type OrchardGeometry } from './orchard.ts';
export { ashStorm } from './steppe.ts';

/** Every realm a Waystone can open, band by band. */
export const REALMS: RealmTemplate[] = [ORCHARD, STEPPE, WARREN];
export const realmById = (id: string) => REALMS.find((r) => r.id === id);
export const REALM_IDS = new Set(REALMS.map((r) => r.id));

/** One expedition into a realm: which, how hard, its seed, and its modifiers. */
export interface RealmInstance {
  realm: string;
  tier: number;
  seed: number;
  mods: string[];
  /** Game time it opened (for Unstable realms). */
  opened: number;
  /** Where the traveller came from, to return to. */
  home: { x: number; y: number };
  /** Its great foe has fallen. */
  cleared?: boolean;
}

// The realm now in the pocket strip. World geometry reads it; Pocket.ts sets it.
let active: { inst: RealmInstance; tpl: RealmTemplate; geo: RealmGeometry } | null = null;
const built = new Map<string, RealmGeometry>();

/** Makes a realm the one in the pocket strip (or empties it with null). */
export function setActiveRealm(inst: RealmInstance | null) {
  if (!inst) {
    active = null;
    return null;
  }
  const tpl = realmById(inst.realm);
  if (!tpl) {
    active = null;
    return null;
  }
  const key = inst.realm + ':' + inst.seed;
  let geo = built.get(key);
  if (!geo) {
    geo = tpl.build(inst.seed);
    if (built.size > 6) built.clear();
    built.set(key, geo);
  }
  active = { inst, tpl, geo };
  return active;
}
export const activeRealm = () => active;
