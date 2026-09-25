// Generated realms: templates, modifiers, and which one fills the pocket strip right now.
import { BARROW } from './barrow.ts';
import { CHOIR } from './choir.ts';
import { EMBERHEART } from './emberheart.ts';
import { FEVERLANDS } from './feverlands.ts';
import { FRACTURED, fracture, setFracturePool } from './fractured.ts';
import { GARDEN } from './garden.ts';
import { GUTTER } from './gutter.ts';
import { OBSERVATORY } from './observatory.ts';
import { UNDERTOW } from './undertow.ts';
import { GLASSWOOD } from './glasswood.ts';
import { MARCHES } from './marches.ts';
import { ORCHARD } from './orchard.ts';
import { SALTFLATS } from './saltflats.ts';
import { STEPPE } from './steppe.ts';
import type { RealmGeometry, RealmTemplate } from './types.ts';
import { WARREN } from './warren.ts';

export * from './modifiers.ts';
export * from './shared.ts';
export * from './types.ts';
export { tideLevel, type OrchardGeometry } from './orchard.ts';
export { ashStorm } from './steppe.ts';
export { ventActive } from './barrow.ts';
export { hymnAt } from './choir.ts';
export type { MarchesGeometry } from './marches.ts';
export { FEVER_BITES, FEVER_CHANCE } from './feverlands.ts';
export { starPulse } from './observatory.ts';
export { AIR_SECONDS, type UndertowGeometry } from './undertow.ts';
export { magmaLevel, type EmberGeometry } from './emberheart.ts';
export { SEASONS, SEASON_SECONDS, seasonAt } from './garden.ts';

/** Every realm a Waystone can open, band by band. */
export const REALMS: RealmTemplate[] = [
  ORCHARD,
  STEPPE,
  WARREN,
  GLASSWOOD,
  MARCHES,
  BARROW,
  SALTFLATS,
  CHOIR,
  FEVERLANDS,
  OBSERVATORY,
  GUTTER,
  UNDERTOW,
  EMBERHEART,
  GARDEN,
  FRACTURED,
];
/** Every realm a Fractured Realm can be spliced from. */
export const WHOLE_REALMS = REALMS.filter((r) => r.id !== 'fractured');
setFracturePool(() => WHOLE_REALMS);
export { FRACTURED_LOOT, fracture } from './fractured.ts';
/** The template an expedition was built from (a Fractured one is spliced from its seed). */
export const templateOf = (inst: { realm: string; seed: number }) =>
  inst.realm === 'fractured' ? fracture(inst.seed) : realmById(inst.realm);
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
  const tpl = templateOf(inst);
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
