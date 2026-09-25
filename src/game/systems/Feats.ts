import { CODEX } from '../../data/codex.ts';
import { FEATS, featById, type FeatCtx } from '../../data/feats.ts';
import { skillById } from '../../data/skills.ts';

import { System } from './System.ts';

/** Feats: deeds remembered for good, each with a title to wear and a small lasting perk. */
export class Feats extends System {
  private checkAt = 0;

  private get meta() {
    return (this.game.s.meta ??= { renown: 0, skills: [], mastery: {} });
  }
  earned(): string[] {
    return (this.meta.feats ??= []);
  }
  has(id: string) {
    return this.earned().includes(id);
  }
  /** The title the player wears, if any. */
  title(): string | null {
    const id = this.meta.title;
    return id && this.has(id) ? (featById(id)?.title ?? null) : null;
  }
  wear(id: string | null) {
    if (id && !this.has(id)) return { ok: false, reason: 'That feat is not yet yours.' };
    this.meta.title = id ?? undefined;
    return { ok: true };
  }
  /** Everything a feat may look at. */
  ctx(): FeatCtx {
    const s = this.game.s,
      sk = this.game.skills;
    const mastery: Record<string, number> = {};
    for (const f of Object.keys(this.meta.mastery)) mastery[f] = sk.mastery(f);
    const realmBest: Record<string, number> = {};
    for (const [id, r] of Object.entries(s.realms ?? {})) realmBest[id] = r.best;
    return {
      tally: s.tutorial.tally,
      day: s.day,
      renown: sk.level(),
      mastery,
      keystones: this.meta.skills.filter((id) => skillById(id)?.keystone).length,
      bosses: s.bosses,
      realmBest,
      codexDone: CODEX.filter((p) => sk.pageDone(p)).length,
      coins: this.game.count('coin'),
      shelved: sk.shelved().length,
    };
  }
  progress(id: string): [number, number] {
    const f = featById(id);
    return f ? f.measure(this.ctx()) : [0, 1];
  }
  /** Awards any feat newly done. */
  check() {
    const c = this.ctx(),
      earned = this.earned();
    for (const f of FEATS) {
      if (earned.includes(f.id)) continue;
      const [have, need] = f.measure(c);
      if (have < need) continue;
      earned.push(f.id);
      this.game.skills.refresh();
      this.game.sound('victory');
      this.game.say(`Feat: ${f.name} · ${f.perkText}. You may be known as ${f.title}.`, 'victory');
    }
  }
  update() {
    if (this.game.s.elapsed < this.checkAt) return;
    this.checkAt = this.game.s.elapsed + 3;
    this.check();
  }
}
