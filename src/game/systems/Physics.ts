import { clamp } from '../../core/math.ts';
import { TILE, WORLD_H, WORLD_W, inShaft } from '../../data/world.ts';
import { RULES } from '../rules.ts';

import { System } from './System.ts';

export class Physics extends System {
  collides(x: number, y: number) {
    for (
      let tx = Math.floor((x - RULES.playerHalfWidth) / TILE);
      tx <= Math.floor((x + RULES.playerHalfWidth) / TILE);
      tx++
    )
      for (
        let ty = Math.floor((y - RULES.playerHeight) / TILE);
        ty <= Math.floor((y - RULES.playerFootInset) / TILE);
        ty++
      )
        if (this.game.tileAt(tx, ty)) return true;
    return false;
  }
  jump() {
    const p = this.game.s.player;
    if (!p.grounded || this.game.s.vitals.stamina < RULES.jumpStamina) return false;
    p.vy = -RULES.jumpVelocity;
    p.grounded = false;
    this.game.s.vitals.stamina -= RULES.jumpStamina;
    return true;
  }
  move(dx: number, dy: number, dt: number) {
    if (this.game.s.dead) return;
    const p = this.game.s.player,
      v = this.game.s.vitals;
    p.moving = Math.abs(dx) > 0.1;
    const tired = v.stamina < 12 || v.fatigue > 80;
    const lava = this.game.inLava();
    const speed =
      (lava ? 0.45 : 1) *
      (tired ? RULES.tiredMoveSpeed : RULES.standardMoveSpeed) *
      (v.illness > 60 ? 0.82 : 1) *
      (p.boots ? 1.12 : 1);
    if (dx) p.face = dx > 0 ? 0 : Math.PI;
    p.vx = dx * speed;
    const shaft = inShaft(p.x, p.y);
    // Molten rock is thick: you sink slowly and can wade or struggle upward.
    if (lava) p.vy = dy < 0 ? -150 : Math.min(p.vy + 240 * dt, 60);
    else if (dy < 0 && (p.grounded || shaft) && v.stamina > RULES.jumpStamina) {
      if (p.grounded) this.jump();
      else {
        p.vy = -RULES.climbVelocity;
        v.stamina = clamp(v.stamina - dt * 5, 0, RULES.maxVital);
      }
    } else if (shaft && dy > 0) p.vy = Math.min(p.vy + 160 * dt, 170);
    else p.vy = Math.min(p.vy + RULES.gravity * dt, RULES.terminalVelocity);
    const nx = clamp(p.x + p.vx * dt, 15, WORLD_W - 15);
    if (!this.collides(nx, p.y)) p.x = nx;
    else if (p.grounded && !this.collides(nx, p.y - TILE) && this.collides(nx, p.y + 2)) {
      p.x = nx;
      p.y -= TILE;
    }
    const oldY = p.y,
      steps = Math.max(1, Math.ceil(Math.abs(p.vy * dt) / 7));
    for (let i = 0; i < steps; i++) {
      const ny = p.y + (p.vy * dt) / steps;
      const platform = this.game.s.structures.find(
        (st) =>
          st.type === 'platform' &&
          dy <= 0 &&
          Math.abs(st.x - p.x) < 35 &&
          p.y <= st.y - 1 &&
          ny >= st.y - 1,
      );
      if (platform) {
        p.y = platform.y - 1;
        p.vy = 0;
        p.grounded = true;
        break;
      }
      if (!this.collides(p.x, ny)) {
        p.y = ny;
        p.grounded = false;
      } else {
        if (p.vy > 0) {
          p.grounded = true;
          if (p.vy > RULES.fallDamageVelocity)
            v.health = clamp(
              v.health - (p.vy - RULES.fallDamageVelocity) * 0.07,
              0,
              RULES.maxVital,
            );
        }
        p.vy = 0;
        break;
      }
    }
    if (p.vy >= 0 && !this.collides(p.x, p.y + 3)) p.grounded = false;
    if (p.y > WORLD_H - 15) {
      p.y = WORLD_H - 15;
      p.vy = 0;
      p.grounded = true;
    }
    if (p.moving || Math.abs(p.y - oldY) > 0.5) {
      v.stamina = clamp(v.stamina - dt * (tired ? 0.7 : 2.2), 0, RULES.maxVital);
      v.hydration = clamp(v.hydration - dt * 0.018, 0, RULES.maxVital);
    }
  }
}
