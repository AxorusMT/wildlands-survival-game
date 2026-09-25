import type { Game } from '../game/Game.ts';

export type Canvas2D = CanvasRenderingContext2D;
export type RenderGame = Game;
export type Pair = [number, number];

export interface Motion {
  x: number;
  y: number;
  /** Smoothed drawing height. */
  sy: number;
  /** Game time of the last update. */
  t: number;
  walk: number;
  move: number;
  hp: number;
  hurt: number;
}
