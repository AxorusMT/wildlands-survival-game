import {
  D,
  T,
  TAU,
  H,
  clamp,
  lerp,
  smooth,
  vnoise,
  fbm,
  rgb,
  mix,
  rgba,
  shade,
  INK,
  polyPath,
  fillPoly,
  ellipse,
  line,
  curve,
  smoothPath,
  blobPath,
  inked,
  glow,
  limb,
} from './graphics.ts';
import { ART, blendAt, artAt, daylight, duskiness, overcastOf } from './palette.ts';
import { leaf, crystalPrism } from './resources.ts';
import type { Canvas2D, RenderGame } from './types.ts';
import type { Structure } from '../core/types.ts';

export function flame(c: Canvas2D, w: number, h: number, t: number, ph: number, color: string) {
  const wob = Math.sin(t * 9 + ph) * w * 0.35,
    wob2 = Math.sin(t * 13 + ph * 2) * w * 0.25;
  c.beginPath();
  c.moveTo(-w, 0);
  c.bezierCurveTo(-w * 1.1, -h * 0.45, -w * 0.3 + wob2, -h * 0.6, wob, -h);
  c.bezierCurveTo(w * 0.3 + wob2, -h * 0.55, w * 1.1, -h * 0.4, w, 0);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}
export function bricks(c: Canvas2D, x0: number, y0: number, x1: number, y1: number, color: string) {
  c.strokeStyle = color;
  c.lineWidth = 1;
  c.beginPath();
  for (let y = y1, row = 0; y > y0; y -= 7, row++) {
    c.moveTo(x0, y);
    c.lineTo(x1, y);
    for (let x = x0 + (row % 2 ? 6 : 0); x < x1; x += 12) {
      c.moveTo(x, y);
      c.lineTo(x, y - 7);
    }
  }
  c.stroke();
}
export function smoke(c: Canvas2D, x: number, y: number, t: number, seed: number, amount = 1) {
  for (let i = 0; i < 4; i++) {
    const life = (t * 0.28 + i / 4 + seed * 0.13) % 1;
    ellipse(
      c,
      x + Math.sin(life * 5 + i) * 5 + life * 16,
      y - life * 70,
      4 + life * 13,
      3 + life * 10,
      `rgba(200,200,195,${0.22 * (1 - life) * amount})`,
    );
  }
}
export function drawStructure(
  c: Canvas2D,
  g: RenderGame,
  s: Structure,
  x: number,
  y: number,
  t: number,
) {
  const k = s.type;
  c.save();
  c.translate(x, y + 1);
  c.lineJoin = 'round';
  if (k !== 'platform') ellipse(c, 0, 0, k === 'shelter' ? 60 : 30, 4, 'rgba(20,20,15,0.22)');
  if (k === 'campfire') {
    const lit = s.fuel > 0;
    ellipse(c, 0, -1, 26, 5, lit ? '#3b2c22' : '#403630');
    for (let i = 0; i < 5; i++) ellipse(c, -16 + i * 8, -4, 5, 3.5, '#6f6b62', INK, 1);
    for (const [a, len] of [
      [0.38, 38],
      [-0.38, 38],
      [0, 30],
    ]) {
      c.save();
      c.translate(0, -6);
      c.rotate(a);
      c.fillStyle = lit ? '#6b4a31' : '#3a2e26';
      c.beginPath();
      c.roundRect(-len / 2, -3.5, len, 7, 3);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.2;
      c.stroke();
      ellipse(c, len / 2 - 1, 0, 2.5, 3.5, lit ? '#c9a878' : '#5a4f45', INK, 1);
      c.restore();
    }
    if (lit) {
      glow(c, 0, -14, 50, '#ffb45e', 0.32 + Math.sin(t * 11) * 0.04);
      c.save();
      c.translate(0, -8);
      flame(c, 13, 38 + Math.sin(t * 7) * 5, t, 0, '#de6d35');
      c.save();
      c.translate(-7, 1);
      flame(c, 6, 20 + Math.sin(t * 10) * 3, t, 2, '#e98a3e');
      c.restore();
      c.save();
      c.translate(8, 1);
      flame(c, 6, 22 + Math.sin(t * 8) * 3, t, 4, '#e98a3e');
      c.restore();
      flame(c, 9, 26 + Math.sin(t * 9) * 4, t, 1, '#f5ad48');
      flame(c, 5, 14 + Math.sin(t * 12) * 2, t, 3, '#fde6a6');
      c.restore();
      for (let i = 0; i < 7; i++) {
        const life = (t * 0.7 + i * 0.143) % 1;
        ellipse(
          c,
          Math.sin(i * 3 + life * 6) * 9 + life * 6,
          -16 - life * 58,
          1.3,
          1.3,
          `rgba(255,${190 - life * 80},100,${1 - life})`,
        );
      }
      smoke(c, 4, -50, t, s.id, 0.8);
    } else {
      ellipse(c, 0, -5, 12, 3, '#8f8a82');
      smoke(c, 0, -12, t * 0.6, s.id, 0.5);
    }
    for (let i = 0; i < 4; i++) ellipse(c, -13 + i * 9, -1.5, 5.5, 4, '#8d8a80', INK, 1.1);
  } else if (k === 'shelter') {
    fillPoly(
      c,
      [
        [-34, -66],
        [48, 0],
        [-34, 0],
      ],
      'rgba(28,22,18,0.55)',
    );
    ellipse(c, -2, -1, 28, 3, '#6b5a40');
    line(c, -34, 0, -34, -86, INK, 7);
    line(c, -34, 0, -34, -86, '#5e4631', 5);
    line(c, -34, -84, -40, -94, '#5e4631', 3.5);
    line(c, -34, -84, -28, -95, '#5e4631', 3.5);
    line(c, -55, 0, -34, -84, INK, 6);
    line(c, -55, 0, -34, -84, '#6b513a', 4);
    const roof = [
      [-42, -88],
      [64, 3],
      [46, 3],
      [-32, -68],
    ];
    fillPoly(c, roof, '#a98c58', INK, 2);
    c.save();
    polyPath(c, roof);
    c.clip();
    for (let i = -8; i < 20; i++) {
      const o = i * 6;
      line(c, -42 + o * 0.6, -88 + o, 64 + o * 0.6 - 60, 3 + o - 50, 'rgba(110,88,50,0.55)', 1);
    }
    for (let i = 0; i < 14; i++) {
      const u = i / 13;
      line(
        c,
        lerp(-40, 60, u),
        lerp(-86, 1, u),
        lerp(-40, 60, u) - 8,
        lerp(-86, 1, u) + 6,
        '#c2a86f',
        1.2,
      );
    }
    fillPoly(
      c,
      [
        [-8, -60],
        [26, -30],
        [16, -21],
        [-16, -48],
      ],
      '#8a6a4c',
    );
    c.setLineDash([2, 2]);
    polyPath(c, [
      [-6, -57],
      [23, -31],
      [16, -24],
      [-13, -48],
    ]);
    c.strokeStyle = '#d6c29a';
    c.lineWidth = 0.9;
    c.stroke();
    c.setLineDash([]);
    c.restore();
    for (let i = 0; i < 12; i++) {
      const u = i / 11,
        bx = lerp(46, 64, u) + 0,
        by = lerp(3, 3, u);
      line(c, bx, by, bx + 2, by - 5, '#8f7443', 1.2);
    }
    line(c, -38, -86, -30, -80, '#d2bb88', 1.6);
  } else if (k === 'workbench' || k === 'apothecary') {
    const top = k === 'apothecary' ? '#7a5f45' : '#8a6a48';
    for (const [x1, x2] of [
      [-24, -20],
      [24, 20],
    ]) {
      line(c, x1 * 0.8, 0, x2 * 0.85, -28, INK, 6);
      line(c, x1 * 0.8, 0, x2 * 0.85, -28, '#4f3a28', 4);
    }
    for (const [x1, x2] of [
      [-28, -22],
      [28, 22],
    ]) {
      line(c, x1, 0, x2, -28, INK, 7);
      line(c, x1, 0, x2, -28, '#654a32', 5);
    }
    line(c, -24, -11, 24, -11, INK, 5);
    line(c, -24, -11, 24, -11, '#654a32', 3);
    c.fillStyle = top;
    c.beginPath();
    c.roundRect(-35, -37, 70, 9, 2);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.8;
    c.stroke();
    c.fillStyle = shade(top, 0.18);
    c.fillRect(-34, -36, 68, 2.5);
    line(c, -12, -35, -12, -29, shade(top, -0.25), 1);
    line(c, 12, -35, 12, -29, shade(top, -0.25), 1);
    if (k === 'workbench') {
      line(c, -26, -39, -10, -41, '#7a5a3a', 2.5);
      c.fillStyle = '#6f7478';
      c.fillRect(-29, -45, 6, 8);
      c.strokeStyle = INK;
      c.lineWidth = 1;
      c.strokeRect(-29, -45, 6, 8);
      c.fillStyle = '#6d6358';
      c.fillRect(6, -46, 12, 9);
      c.strokeRect(6, -46, 12, 9);
      line(c, 12, -46, 12, -50, '#4a4540', 2);
      line(c, 8, -50, 16, -50, '#4a4540', 1.8);
      fillPoly(
        c,
        [
          [30, -29],
          [42, -29],
          [40, -6],
          [33, -6],
        ],
        '#b8bcbd',
        INK,
        1,
      );
      for (let i = 0; i < 6; i++)
        line(c, 40 - i * 0.3, -26 + i * 3.4, 42 - i * 0.3, -25 + i * 3.4, '#7d8385', 1);
      c.fillStyle = '#6b4a2f';
      c.fillRect(31, -35, 10, 6);
      ellipse(c, -2, -39, 3, 1.2, '#d6b98a');
      ellipse(c, 2, -39.5, 2, 1, '#e3c89c');
    } else {
      const hang = Math.sin(t * 1.2 + s.id) * 1.5;
      line(c, -30, -37, -30, -72, '#5e4631', 3);
      line(c, 30, -37, 30, -72, '#5e4631', 3);
      line(c, -32, -70, 32, -70, '#5e4631', 3);
      for (let i = 0; i < 4; i++) {
        const hx = -20 + i * 13;
        line(c, hx, -70, hx + hang * 0.3, -62, '#b8a47a', 1);
        for (let j = 0; j < 5; j++)
          line(
            c,
            hx + hang * 0.3,
            -62,
            hx + hang + (j - 2) * 2,
            -50 + Math.abs(j - 2),
            i % 2 ? '#7d8f58' : '#9a8a5a',
            1.6,
          );
      }
      ellipse(c, -19, -41, 8, 5, '#9a9387', INK, 1.2);
      ellipse(c, -19, -44, 7, 1.6, '#5f5a50');
      line(c, -17, -44, -10, -54, '#b7ae9c', 2.4);
      for (const [bx, col, hgt] of [
        [2, '#7fb07a', 16],
        [12, '#b3564a', 12],
        [22, '#d0a24c', 14],
      ] as [number, string, number][]) {
        c.beginPath();
        c.moveTo(bx - 4, -37);
        c.lineTo(bx - 4, -37 - hgt * 0.6);
        c.quadraticCurveTo(bx - 4, -37 - hgt * 0.8, bx - 1.5, -37 - hgt * 0.85);
        c.lineTo(bx - 1.5, -37 - hgt);
        c.lineTo(bx + 1.5, -37 - hgt);
        c.lineTo(bx + 1.5, -37 - hgt * 0.85);
        c.quadraticCurveTo(bx + 4, -37 - hgt * 0.8, bx + 4, -37 - hgt * 0.6);
        c.lineTo(bx + 4, -37);
        c.closePath();
        c.fillStyle = 'rgba(220,235,230,0.55)';
        c.fill();
        c.fillStyle = col;
        c.fillRect(bx - 4, -37 - hgt * 0.45, 8, hgt * 0.45);
        c.strokeStyle = INK;
        c.lineWidth = 1;
        c.stroke();
        c.fillStyle = '#9a7a52';
        c.fillRect(bx - 1.8, -39 - hgt, 3.6, 3);
        line(c, bx - 2.5, -37 - hgt * 0.4, bx - 2.5, -39, 'rgba(255,255,255,0.5)', 1);
      }
    }
  } else if (k === 'furnace') {
    const dome = () => {
      c.beginPath();
      c.moveTo(-28, 0);
      c.lineTo(-28, -30);
      c.quadraticCurveTo(-28, -58, 0, -60);
      c.quadraticCurveTo(28, -58, 28, -30);
      c.lineTo(28, 0);
      c.closePath();
    };
    dome();
    c.fillStyle = '#8a7e70';
    c.fill();
    c.save();
    c.clip();
    bricks(c, -30, -62, 30, 0, 'rgba(70,60,52,0.7)');
    const gr = c.createLinearGradient(-28, 0, 28, 0);
    gr.addColorStop(0.5, 'rgba(0,0,0,0)');
    gr.addColorStop(1, 'rgba(0,0,0,0.3)');
    c.fillStyle = gr;
    c.fillRect(-30, -62, 60, 62);
    c.restore();
    dome();
    c.strokeStyle = INK;
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = '#76695d';
    c.fillRect(6, -82, 12, 26);
    c.strokeRect(6, -82, 12, 26);
    c.fillStyle = '#5d534a';
    c.fillRect(4, -85, 16, 4);
    c.strokeRect(4, -85, 16, 4);
    smoke(c, 12, -90, t, s.id, 0.7);
    const f = 0.8 + Math.sin(t * 8 + s.id) * 0.12;
    c.beginPath();
    c.moveTo(-11, 0);
    c.lineTo(-11, -13);
    c.arc(0, -13, 11, Math.PI, 0);
    c.lineTo(11, 0);
    c.closePath();
    const mg = c.createRadialGradient(0, -4, 1, 0, -6, 16);
    mg.addColorStop(0, '#fff2b8');
    mg.addColorStop(0.4, '#f39a3c');
    mg.addColorStop(1, '#7a2a16');
    c.globalAlpha = f;
    c.fillStyle = mg;
    c.fill();
    c.globalAlpha = 1;
    c.strokeStyle = INK;
    c.lineWidth = 2;
    c.stroke();
    glow(c, 0, -8, 34, '#ff9a4a', 0.25 * f);
  } else if (k === 'forge') {
    c.fillStyle = '#7f6f62';
    c.fillRect(-34, -34, 42, 34);
    c.save();
    c.beginPath();
    c.rect(-34, -34, 42, 34);
    c.clip();
    bricks(c, -34, -34, 8, 0, 'rgba(60,50,44,0.7)');
    c.restore();
    c.strokeStyle = INK;
    c.lineWidth = 2;
    c.strokeRect(-34, -34, 42, 34);
    ellipse(c, -13, -35, 17, 4.5, '#3a2a22');
    for (let i = 0; i < 6; i++)
      ellipse(c, -25 + i * 4.6, -36, 2.4, 1.8, i % 2 ? '#f59a3c' : '#2a2320');
    glow(c, -13, -40, 26, '#ff9a4a', 0.35 + Math.sin(t * 9) * 0.06);
    fillPoly(
      c,
      [
        [-37, -64],
        [11, -64],
        [4, -46],
        [-30, -46],
      ],
      '#6d625a',
      INK,
      1.8,
    );
    c.fillStyle = '#62574e';
    c.fillRect(-20, -92, 14, 28);
    c.strokeRect(-20, -92, 14, 28);
    smoke(c, -13, -96, t, s.id, 0.8);
    c.fillStyle = '#6b513a';
    c.fillRect(17, -13, 14, 13);
    c.strokeRect(17, -13, 14, 13);
    fillPoly(
      c,
      [
        [9, -13],
        [36, -13],
        [36, -18],
        [44, -22],
        [36, -26],
        [12, -26],
        [6, -21],
      ],
      '#4d5257',
      INK,
      1.6,
    );
    line(c, 12, -25.5, 36, -25.5, '#9aa3aa', 1.5);
  } else if (k === 'effergy') {
    const spec = D.BOSSES[Math.min(D.BOSSES.length - 1, Math.max(0, g.s.altar.level - 1))],
      pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    glow(c, 0, -60, 80, spec.glow, 0.16 + pulse * 0.1);
    fillPoly(
      c,
      [
        [-32, 0],
        [-32, -9],
        [32, -9],
        [32, 0],
      ],
      '#46414d',
      INK,
      1.6,
    );
    fillPoly(
      c,
      [
        [-24, -9],
        [-24, -17],
        [24, -17],
        [24, -9],
      ],
      '#3e3a45',
      INK,
      1.6,
    );
    const ob = [
      [-14, -17],
      [-10, -88],
      [0, -100],
      [10, -88],
      [14, -17],
    ];
    fillPoly(c, ob, '#34303c', INK, 2);
    fillPoly(
      c,
      [
        [0, -100],
        [10, -88],
        [14, -17],
        [3, -17],
      ],
      'rgba(0,0,0,0.25)',
    );
    c.strokeStyle = rgba(spec.glow, 0.55 + pulse * 0.45);
    c.lineWidth = 1.6;
    // Four carved glyphs: a wolf's fang, the moon, a paw, and an eye.
    const glyphs = [
      [
        [-4, 4],
        [0, -5],
        [4, 4],
        [0, 1],
        [-4, 4],
      ],
      [
        [2, -5],
        [-3, -2],
        [-3, 2],
        [2, 5],
        [-1, 0],
        [2, -5],
      ],
      [
        [-4, 0],
        [-2, -4],
        [2, -4],
        [4, 0],
        [0, 4],
        [-4, 0],
      ],
      [
        [-5, 0],
        [0, -3.5],
        [5, 0],
        [0, 3.5],
        [-5, 0],
      ],
    ];
    glyphs.forEach((pts, i) => {
      const ry = -30 - i * 15;
      c.beginPath();
      pts.forEach(([gx, gy], j) => (j ? c.lineTo(gx, ry + gy) : c.moveTo(gx, ry + gy)));
      c.stroke();
      if (i === 3) ellipse(c, 0, ry, 1.3, 1.3, rgba(spec.glow, 0.9));
    });
    const oy = -118 + Math.sin(t * 1.8) * 4;
    glow(c, 0, oy, 26, spec.glow, 0.5);
    ellipse(c, 0, oy, 7, 7, mix(spec.color, '#ffffff', 0.4), INK, 1.2);
    c.strokeStyle = rgba(spec.glow, 0.7);
    c.lineWidth = 1.2;
    c.beginPath();
    c.ellipse(0, oy, 15, 4, Math.sin(t) * 0.3, 0, TAU);
    c.stroke();
  } else if (k === 'bedroll') {
    c.fillStyle = '#7c6a4c';
    c.beginPath();
    c.roundRect(-35, -9, 64, 9, 4);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.stroke();
    c.fillStyle = '#9a4f3c';
    c.beginPath();
    c.roundRect(-12, -13, 38, 9, 4);
    c.fill();
    c.stroke();
    c.fillStyle = '#b86a52';
    c.fillRect(-10, -12, 34, 2);
    for (const sx of [0, 12]) line(c, sx, -12.5, sx, -4.5, '#e3d3a8', 1.2);
    ellipse(c, 29, -7, 7, 7, '#9a4f3c', INK, 1.4);
    c.strokeStyle = '#6d3527';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(29, -7, 4, 0, Math.PI * 1.6);
    c.stroke();
    c.fillStyle = '#d8c9a0';
    c.beginPath();
    c.roundRect(-33, -16, 18, 9, 4);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.stroke();
    line(c, -30, -13, -18, -13, 'rgba(120,100,70,0.4)', 1);
  } else if (k === 'farm_plot') {
    c.beginPath();
    c.moveTo(-31, -8);
    for (let i = 0; i < 6; i++) c.quadraticCurveTo(-26 + i * 10.3, -18, -21 + i * 10.3, -12);
    c.lineTo(31, -12);
    c.lineTo(31, -8);
    c.closePath();
    c.fillStyle = '#4a3a2a';
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.stroke();
    for (let i = 0; i < 6; i++)
      curve(c, -29 + i * 10.3, -13, -26 + i * 10.3, -16.5, -23 + i * 10.3, -13.5, '#6b5640', 1.2);
    c.fillStyle = '#6b5035';
    c.fillRect(-33, -10, 66, 10);
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.strokeRect(-33, -10, 66, 10);
    c.fillStyle = '#846444';
    c.fillRect(-32, -9, 64, 2);
    line(c, -11, -10, -11, 0, '#4f3a26', 1);
    line(c, 11, -10, 11, 0, '#4f3a26', 1);
    if (s.crop) {
      const grow = clamp((g.s.elapsed - s.plantedAt) / 240),
        ripe = grow >= 1;
      for (const px of [-20, 0, 20]) {
        c.save();
        c.translate(px, -11);
        const hgt = 5 + grow * 22;
        if (s.crop === 'wheat') {
          const col = mix('#7ea05a', '#dcb867', grow);
          for (let i = -1; i <= 1; i++) {
            curve(c, i, 0, i * 2, -hgt * 0.5, i * 3, -hgt, col, 1.3);
            if (grow > 0.5) ellipse(c, i * 3, -hgt - 3, 1.6, 4, col);
          }
        } else if (s.crop === 'potato') {
          for (let i = 0; i < 5; i++)
            leaf(
              c,
              0,
              -1,
              4 + grow * 7,
              -Math.PI + 0.3 + i * 0.63,
              2.4,
              i % 2 ? '#5d8a4c' : '#79a35e',
            );
          if (ripe) ellipse(c, 0, -hgt * 0.4, 1.5, 1.5, '#c9b4df');
        } else {
          curve(c, 0, 0, 1, -hgt * 0.5, 0, -hgt * 0.8, '#4f7a45', 1.3);
          for (let i = 0; i < 3; i++) {
            leaf(c, 0, -hgt * 0.25 * (i + 1), 3 + grow * 4, -0.5, 2, '#79a35e');
            leaf(c, 0, -hgt * 0.25 * (i + 1), 3 + grow * 4, Math.PI + 0.5, 2, '#5d8a4c');
          }
        }
        c.restore();
      }
      if (ripe) {
        const sp = (t * 0.7) % 1;
        line(c, -3, -40 + sp * 4, 3, -40 + sp * 4, rgba('#fff3c4', 1 - sp), 1.2);
        line(c, 0, -43 + sp * 4, 0, -37 + sp * 4, rgba('#fff3c4', 1 - sp), 1.2);
      }
    } else for (const px of [-20, 0, 20]) line(c, px, -10, px + 1, -18, '#8a7a55', 1.5);
  } else if (k === 'rain_catcher') {
    for (const [a, b] of [
      [-26, -18],
      [26, 18],
    ]) {
      line(c, a, -56, b, 0, INK, 5);
      line(c, a, -56, b, 0, '#6b513a', 3);
    }
    fillPoly(
      c,
      [
        [-30, -58],
        [30, -58],
        [9, -38],
        [-9, -38],
      ],
      '#cbbb9a',
      INK,
      1.6,
    );
    line(c, -20, -56, -6, -40, 'rgba(120,100,70,0.5)', 1);
    line(c, 20, -56, 6, -40, 'rgba(120,100,70,0.5)', 1);
    c.fillStyle = '#7a5a3c';
    c.beginPath();
    c.moveTo(-13, 0);
    c.quadraticCurveTo(-16, -16, -13, -32);
    c.lineTo(13, -32);
    c.quadraticCurveTo(16, -16, 13, 0);
    c.closePath();
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.8;
    c.stroke();
    for (const sx of [-6, 0, 6]) line(c, sx, -31, sx, -1, 'rgba(50,35,22,0.5)', 1);
    for (const hy of [-6, -26]) line(c, -14.5, hy, 14.5, hy, '#55585a', 2.2);
    const fillLevel = clamp(s.water / 8);
    ellipse(
      c,
      0,
      -32,
      13,
      3,
      fillLevel > 0.05 ? mix('#4f7f86', '#8fbcbf', fillLevel) : '#3a2c20',
      INK,
      1.2,
    );
    if (['rain', 'storm'].includes(g.s.weather)) {
      const d = (t * 2.2) % 1;
      ellipse(c, 0, -38 + d * 6, 1.3, 2, 'rgba(180,215,225,0.9)');
    }
  } else if (k === 'lantern' || k === 'crystal_lantern') {
    const crystal = k === 'crystal_lantern',
      lit = crystal || s.fuel > 0,
      flick = crystal ? 0.5 + 0.5 * Math.sin(t * 2) : 0.8 + Math.sin(t * 13 + s.id) * 0.1;
    line(c, 0, 0, 0, -72, INK, 6);
    line(c, 0, 0, 0, -72, crystal ? '#5f6f7a' : '#5a4633', 4);
    line(c, -2, -68, 18, -68, INK, 4.5);
    line(c, -2, -68, 18, -68, crystal ? '#6d7f8a' : '#5a4633', 2.6);
    line(c, 15, -68, 15, -61, '#3f3a36', 1.2);
    const glass = lit ? (crystal ? '#aef0ec' : '#ffd88a') : '#6d6a5e';
    if (lit)
      glow(c, 15, -50, crystal ? 46 : 40, crystal ? '#9fe8e4' : '#ffc46a', 0.3 * flick + 0.1);
    fillPoly(
      c,
      [
        [9, -61],
        [21, -61],
        [18, -64],
        [12, -64],
      ],
      '#3f3a36',
      INK,
      1,
    );
    c.fillStyle = glass;
    c.fillRect(9.5, -61, 11, 15);
    if (crystal) {
      c.save();
      c.translate(0, -48);
      crystalPrism(c, 15, 11, 2.5, 0, '#e6fffb', '#62bcc6');
      c.restore();
    } else if (lit) {
      c.save();
      c.translate(15, -48);
      flame(c, 2.4, 8 + Math.sin(t * 12) * 1.5, t, s.id, '#f5ad48');
      c.restore();
    }
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.strokeRect(9.5, -61, 11, 15);
    line(c, 15, -61, 15, -46, 'rgba(60,50,40,0.6)', 1);
    fillPoly(
      c,
      [
        [8, -46],
        [22, -46],
        [20, -43],
        [10, -43],
      ],
      '#3f3a36',
      INK,
      1,
    );
  } else if (k === 'platform') {
    line(c, -26, 4, -14, 16, INK, 5);
    line(c, 26, 4, 14, 16, INK, 5);
    line(c, -26, 4, -14, 16, '#5d4d3c', 3);
    line(c, 26, 4, 14, 16, '#5d4d3c', 3);
    c.fillStyle = '#8a6b4a';
    c.beginPath();
    c.roundRect(-34, -4, 68, 8, 2);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
    c.fillStyle = '#a9855c';
    c.fillRect(-33, -3, 66, 2);
    for (const px of [-17, 0, 17]) line(c, px, -4, px, 4, 'rgba(50,35,22,0.6)', 1);
    for (const px of [-30, -21, -13, -4, 4, 13, 21, 30]) ellipse(c, px, 0.5, 0.8, 0.8, '#3a3230');
  } else if (k === 'spike_trap') {
    const hit = g.s.elapsed - s.triggeredAt < 0.6,
      jolt = hit ? Math.sin(t * 60) * 1.2 : 0;
    c.fillStyle = '#6b5237';
    c.beginPath();
    c.roundRect(-31, -5, 62, 5, 1.5);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.4;
    c.stroke();
    for (let i = 0; i < 6; i++) {
      const sx = -25 + i * 10 + jolt;
      const gr = c.createLinearGradient(sx - 4, 0, sx + 4, 0);
      gr.addColorStop(0, '#d6d8d6');
      gr.addColorStop(1, '#6f7375');
      fillPoly(
        c,
        [
          [sx - 4, -5],
          [sx, -24],
          [sx + 4, -5],
        ],
        gr,
        INK,
        1.1,
      );
      if (hit) ellipse(c, sx, -22, 1.4, 2, '#8e3b30');
    }
  } else if (k === 'chest' || k === 'icebox') {
    const ice = k === 'icebox',
      body = ice ? '#9fb8bd' : '#7a5a3c',
      lid = ice ? '#c6dadf' : '#8b683f';
    c.fillStyle = body;
    c.fillRect(-24, -24, 48, 24);
    c.strokeStyle = INK;
    c.lineWidth = 1.8;
    c.strokeRect(-24, -24, 48, 24);
    for (const py of [-16, -8]) line(c, -23, py, 23, py, shade(body, -0.22), 1);
    c.fillStyle = lid;
    c.beginPath();
    c.moveTo(-26, -24);
    c.lineTo(-26, -29);
    c.quadraticCurveTo(0, -37, 26, -29);
    c.lineTo(26, -24);
    c.closePath();
    c.fill();
    c.stroke();
    const band = ice ? '#6f8a92' : '#4c4f52';
    for (const bx of [-17, 13]) {
      c.fillStyle = band;
      c.fillRect(bx, -33, 4, 33);
      ellipse(c, bx + 2, -4, 0.8, 0.8, '#aeb4b6');
      ellipse(c, bx + 2, -20, 0.8, 0.8, '#aeb4b6');
    }
    c.fillStyle = ice ? '#dfeef0' : '#c9a24e';
    c.fillRect(-4, -28, 8, 9);
    c.strokeStyle = INK;
    c.lineWidth = 1;
    c.strokeRect(-4, -28, 8, 9);
    ellipse(c, 0, -24.5, 1.2, 1.2, '#2e2a24');
    if (ice) {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI;
        line(
          c,
          -12 + Math.cos(a) * 4,
          -12 + Math.sin(a) * 4,
          -12 - Math.cos(a) * 4,
          -12 - Math.sin(a) * 4,
          '#f4fbfb',
          1.1,
        );
      }
      for (let i = 0; i < 3; i++) {
        const life = (t * 0.25 + i / 3) % 1;
        ellipse(
          c,
          -10 + i * 10 + life * 4,
          -2 + life * 2,
          5 + life * 8,
          2 + life * 2,
          `rgba(230,244,246,${0.35 * (1 - life)})`,
        );
      }
    }
  } else if (k === 'drying_rack') {
    for (const bx of [-26, 26]) {
      line(c, bx - 7, 0, bx + 3, -64, INK, 5);
      line(c, bx + 7, 0, bx - 3, -64, INK, 5);
      line(c, bx - 7, 0, bx + 3, -64, '#634b35', 3.2);
      line(c, bx + 7, 0, bx - 3, -64, '#634b35', 3.2);
    }
    line(c, -32, -58, 32, -58, INK, 5.5);
    line(c, -32, -58, 32, -58, '#6f553c', 3.6);
    for (let i = 0; i < 4; i++) {
      const hx = -15 + i * 10,
        sw = Math.sin(t * 1.4 + i) * 1.2,
        len = 20 + H(i, s.id) * 10;
      line(c, hx, -58, hx + sw * 0.3, -54, '#c9b58a', 1);
      c.save();
      c.translate(hx + sw * 0.3, -54);
      c.rotate(sw * 0.03);
      c.beginPath();
      c.moveTo(-3, 0);
      c.lineTo(3, 0);
      c.lineTo(2, len);
      c.lineTo(-2, len - 2);
      c.closePath();
      c.fillStyle = '#9a4f3c';
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1;
      c.stroke();
      line(c, -1, 3, 0, len - 4, '#d9a08a', 1);
      c.restore();
    }
  }
  c.restore();
}
