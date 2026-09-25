import { clamp } from '../../core/math.ts';
import { BOSSES } from '../../data/bosses.ts';
import { WORLD_W } from '../../data/world.ts';
import { uniqueId } from '../ids.ts';

import { System } from './System.ts';

export class Effergy extends System {
  /** Calls the Direwolf beside the altar, or at `at` when summoned from the field console. */
  summonBoss(at?: { x: number; y: number }) {
    const altar = at ?? this.game.s.structures.find((st) => st.type === 'effergy');
    if (!altar) return;
    const cfg = BOSSES[this.game.s.altar.level - 1];
    const x = clamp(altar.x + (at ? 0 : 145), 40, WORLD_W - 40),
      y = at ? this.game.floorNear(x, at.y - 20) : this.game.groundTopAt(x) - 1;
    const boss = {
      id: uniqueId(),
      type: 'boss',
      x,
      y,
      homeX: altar.x,
      homeY: altar.y,
      hp: cfg.hp,
      maxHp: cfg.hp,
      angle: 0,
      wanderAt: 0,
      attackAt: this.game.s.elapsed + 2,
      howlAt: this.game.s.elapsed + 5,
      deadUntil: 0,
      warning: 2,
      phase: 0,
      ...(at ? { walkY: at.y } : {}),
    };
    this.game.s.animals.push(boss);
    this.game.s.altar.activeBoss = boss.id;
    for (let i = 0; i < 2; i++) {
      const cx = x + (i ? 70 : -70);
      this.game.s.animals.push({
        id: uniqueId(),
        type: 'wolf',
        companion: true,
        x: cx,
        y: at ? this.game.floorNear(cx, at.y - 20) : this.game.groundTopAt(cx) - 1,
        ...(at ? { walkY: at.y } : {}),
        homeX: altar.x,
        homeY: altar.y,
        hp: 66,
        maxHp: 66,
        angle: 0,
        wanderAt: 0,
        attackAt: this.game.s.elapsed + 2,
        deadUntil: 0,
        warning: 1,
        phase: i,
      });
    }
    this.game.say('The ' + cfg.name + ' answers the Effergy. Two wolves follow it.', 'danger');
    this.game.sound('boss', x, y - 40, 1.5);
  }
  attune(mob = 'wolf') {
    if (mob !== 'wolf')
      return { ok: false, reason: 'Only wolf attunement is recorded in this folio.' };
    if (!this.game.s.structures.some((st) => st.type === 'effergy'))
      return { ok: false, reason: 'Place the Effergy first.' };
    if (!this.game.near('effergy', 135)) return { ok: false, reason: 'Stand beside the Effergy.' };
    this.game.s.altar.attuned = mob;
    this.game.s.altar.kills = 0;
    this.game.say('The folio is attuned to wolves. Hunt them to call the Direwolf.', 'good');
    return { ok: true };
  }
  upgradeAltar() {
    const a = this.game.s.altar,
      cost = a.level === 1 ? 100 : a.level === 2 ? 250 : Infinity;
    if (!this.game.near('effergy', 135)) return { ok: false, reason: 'Stand beside the Effergy.' };
    if (a.activeBoss) return { ok: false, reason: 'Finish the current hunt first.' };
    if (a.xp < cost) return { ok: false, reason: 'Requires ' + cost + ' Effergy XP.' };
    a.xp -= cost;
    a.level++;
    a.kills = 0;
    this.game.say(
      'Effergy raised to level ' + a.level + '. The next hunt grows darker.',
      'victory',
    );
    return { ok: true };
  }
}
