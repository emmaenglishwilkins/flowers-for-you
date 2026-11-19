import {
  DECORATIVE_BLOOMS,
  PROJECTS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type DecorativeBloom
} from '../data/portfolio';
import { wrapDelta } from './torus';

export interface SpotlightState {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  speed: number;
  /** Smooth 0..1 factor: 0 = soft Spotlight mode, 1 = Work Light full illumination */
  workLightMix: number;
  motionAngle: number;
}

interface DustMote {
  nx: number;
  ny: number;
  r: number;
  phase: number;
  driftX: number;
  driftY: number;
}

const DUST_MOTES: DustMote[] = Array.from({ length: 22 }, (_, i) => {
  const s = (i + 1) * 9301 + 49297;
  const r1 = (Math.sin(s * 0.0013) + 1) * 0.5;
  const r2 = (Math.cos(s * 0.0021) + 1) * 0.5;
  const r3 = (Math.sin(s * 0.0047) + 1) * 0.5;
  return {
    nx: r1,
    ny: r2,
    r: 0.8 + r3 * 1.5,
    phase: r1 * Math.PI * 2,
    driftX: (r2 - 0.5) * 10,
    driftY: -5 - r3 * 9
  };
});

/** Organic botanical vine connections weaving gently between origin and projects */
const STEM_CONNECTIONS: Array<[number, number, number, number, number]> = [
  ...PROJECTS.map((p, idx): [number, number, number, number, number] => [
    0,
    0,
    p.x,
    p.y,
    (idx % 2 === 0 ? 1 : -1) * (88 + (idx % 3) * 32)
  ]),
  ...PROJECTS.map((p, idx): [number, number, number, number, number] => {
    const next = PROJECTS[(idx + 1) % PROJECTS.length];
    return [p.x, p.y, next.x, next.y, (idx % 2 === 0 ? -1 : 1) * 115];
  })
];

let paperGrainPattern: CanvasPattern | null = null;
let duskGrainPattern: CanvasPattern | null = null;

function ensurePaperGrain(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  if (paperGrainPattern) return paperGrainPattern;
  const tile = document.createElement('canvas');
  tile.width = 180;
  tile.height = 180;
  const tctx = tile.getContext('2d');
  if (!tctx) return null;

  tctx.fillStyle = '#f4f0e6';
  tctx.fillRect(0, 0, 180, 180);

  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 1050; i++) {
    const x = rand() * 180;
    const y = rand() * 180;
    const a = 0.014 + rand() * 0.028;
    tctx.fillStyle = rand() > 0.35 ? `rgba(18, 16, 14, ${a})` : `rgba(255, 253, 248, ${a * 1.3})`;
    tctx.fillRect(x, y, rand() > 0.85 ? 2 : 1, 1);
  }
  tctx.strokeStyle = 'rgba(20, 18, 15, 0.032)';
  tctx.lineWidth = 0.7;
  for (let i = 0; i < 24; i++) {
    const x = rand() * 180;
    const y = rand() * 180;
    const len = 4 + rand() * 10;
    const ang = rand() * Math.PI * 2;
    tctx.beginPath();
    tctx.moveTo(x, y);
    tctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    tctx.stroke();
  }

  paperGrainPattern = ctx.createPattern(tile, 'repeat');
  return paperGrainPattern;
}

/** Near-black charcoal field outside the spotlight, with a faint rag-fiber grain. */
function ensureDuskGrain(ctx: CanvasRenderingContext2D): CanvasPattern | null {
  if (duskGrainPattern) return duskGrainPattern;
  const tile = document.createElement('canvas');
  tile.width = 180;
  tile.height = 180;
  const tctx = tile.getContext('2d');
  if (!tctx) return null;

  tctx.fillStyle = '#070706';
  tctx.fillRect(0, 0, 180, 180);

  let seed = 7919;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 900; i++) {
    const x = rand() * 180;
    const y = rand() * 180;
    const a = 0.018 + rand() * 0.032;
    tctx.fillStyle = rand() > 0.45 ? `rgba(0, 0, 0, ${a})` : `rgba(236, 230, 214, ${a * 0.55})`;
    tctx.fillRect(x, y, 1, 1);
  }

  duskGrainPattern = ctx.createPattern(tile, 'repeat');
  return duskGrainPattern;
}

function drawCanvasFlower(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  bloom: DecorativeBloom,
  isAmbientShade: boolean
) {
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate((bloom.rotation * Math.PI) / 180);
  ctx.scale(bloom.scale, bloom.scale);

  const ink = isAmbientShade ? 'rgba(232, 226, 210, 0.34)' : '#0f0f0e';
  const subtleInk = isAmbientShade ? 'rgba(232, 226, 210, 0.14)' : 'rgba(16, 16, 15, 0.22)';
  const paper = isAmbientShade ? '#070706' : '#f4f0e6';

  if (bloom.hasHill) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-78, bloom.stemHeight + 18);
    ctx.quadraticCurveTo(-8, bloom.stemHeight - 28, 86, bloom.stemHeight + 12);
    ctx.lineTo(86, bloom.stemHeight + 36);
    ctx.lineTo(-78, bloom.stemHeight + 36);
    ctx.closePath();
    if (!isAmbientShade) {
      ctx.fillStyle = 'rgba(16, 16, 15, 0.06)';
      ctx.fill();
    }
    ctx.strokeStyle = ink;
    ctx.lineWidth = isAmbientShade ? 1.4 : 3;
    ctx.beginPath();
    ctx.moveTo(-76, bloom.stemHeight + 16);
    ctx.quadraticCurveTo(-8, bloom.stemHeight - 26, 84, bloom.stemHeight + 10);
    ctx.stroke();

    ctx.strokeStyle = subtleInk;
    ctx.lineWidth = 1;
    for (let hx = -64; hx <= 68; hx += 9) {
      ctx.beginPath();
      ctx.moveTo(hx, bloom.stemHeight + 24);
      ctx.lineTo(hx + 16, bloom.stemHeight + 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Organic curving dry-brush stem + splayed roots
  ctx.strokeStyle = ink;
  ctx.lineCap = 'round';
  ctx.lineWidth = isAmbientShade ? 2.4 : 5.4;
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.bezierCurveTo(10, bloom.stemHeight * 0.35, -14, bloom.stemHeight * 0.72, 2, bloom.stemHeight);
  ctx.stroke();

  if (!isAmbientShade) {
    ctx.strokeStyle = 'rgba(16, 16, 15, 0.48)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(2.5, 16);
    ctx.bezierCurveTo(12, bloom.stemHeight * 0.36, -10, bloom.stemHeight * 0.7, 4, bloom.stemHeight - 2);
    ctx.stroke();
  }

  ctx.strokeStyle = ink;
  ctx.lineWidth = isAmbientShade ? 1.6 : 3.2;
  ctx.beginPath();
  ctx.moveTo(2, bloom.stemHeight - 6);
  ctx.lineTo(-12, bloom.stemHeight + 8);
  ctx.moveTo(2, bloom.stemHeight - 6);
  ctx.lineTo(15, bloom.stemHeight + 7);
  ctx.stroke();

  if (bloom.variant === 'sketch-outline-4') {
    ctx.strokeStyle = subtleInk;
    ctx.lineWidth = 0.8;
    for (let i = -46; i <= 46; i += 6.5) {
      ctx.beginPath();
      ctx.moveTo(i - 18, -48 + ((i * 3) % 9));
      ctx.lineTo(i + 24, 42 - ((i * 5) % 11));
      ctx.stroke();
    }

    const petals = [
      { cx: -24, cy: -22, rx: 23, ry: 21, rot: -0.42 },
      { cx: 22, cy: -21, rx: 22, ry: 23, rot: 0.36 },
      { cx: 23, cy: 21, rx: 24, ry: 21, rot: -0.28 },
      { cx: -22, cy: 22, rx: 22, ry: 24, rot: 0.44 }
    ];

    if (isAmbientShade) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.6;
      for (const pt of petals) {
        ctx.beginPath();
        ctx.ellipse(pt.cx, pt.cy, pt.rx, pt.ry, pt.rot, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      for (let p = 0; p < 4; p++) {
        ctx.strokeStyle = p < 2 ? '#0e0e0d' : 'rgba(14, 14, 13, 0.42)';
        ctx.lineWidth = 9 - p * 1.8;
        for (let idx = 0; idx < petals.length; idx++) {
          const pt = petals[idx];
          ctx.beginPath();
          const steps = 28;
          for (let s = 0; s <= steps; s++) {
            const t = (s / steps) * Math.PI * 2;
            const wobble =
              Math.sin(t * 5 + idx * 1.7 + p * 2.1) * (1.8 + p * 0.7) +
              Math.cos(t * 9 - p * 1.3) * 1.1;
            const lx = Math.cos(t) * (pt.rx + wobble);
            const ly = Math.sin(t) * (pt.ry + wobble);
            const rx = lx * Math.cos(pt.rot) - ly * Math.sin(pt.rot) + pt.cx;
            const ry = lx * Math.sin(pt.rot) + ly * Math.cos(pt.rot) + pt.cy;
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(14, 14, 13, 0.5)';
      for (let idx = 0; idx < petals.length; idx++) {
        const pt = petals[idx];
        for (let s = 0; s < 30; s++) {
          const t = (s / 30) * Math.PI * 2;
          const jitterR = 4 + ((s * 7 + idx * 11) % 7) - 2;
          const lx = Math.cos(t) * (pt.rx + jitterR);
          const ly = Math.sin(t) * (pt.ry + jitterR);
          const rx = lx * Math.cos(pt.rot) - ly * Math.sin(pt.rot) + pt.cx;
          const ry = lx * Math.sin(pt.rot) + ly * Math.cos(pt.rot) + pt.cy;
          ctx.fillRect(rx, ry, 2, 2);
        }
      }
    }

    ctx.fillStyle = paper;
    ctx.beginPath();
    ctx.ellipse(0, 0, 12.5, 11.5, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = isAmbientShade ? 2 : 6;
    ctx.stroke();
  } else {
    const count = bloom.variant === 'solid-5' ? 5 : 4;
    const petalDist = count === 5 ? 23 : 21;
    const petalR = count === 5 ? 20 : 25;

    for (let i = 0; i < count; i++) {
      const ang = (i * Math.PI * 2) / count + 0.38;
      const px = Math.cos(ang) * petalDist;
      const py = Math.sin(ang) * petalDist;
      const rx = petalR * (0.94 + ((i * 7) % 3) * 0.06);
      const ry = petalR * (1.03 - ((i * 5) % 3) * 0.05);

      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, ang + 0.25, 0, Math.PI * 2);
      if (isAmbientShade) {
        ctx.fillStyle = 'rgba(232, 226, 210, 0.16)';
        ctx.fill();
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#0e0e0d';
        ctx.fill();
        ctx.strokeStyle = 'rgba(14, 14, 13, 0.32)';
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.ellipse(1.2, -0.8, 8.2, 9.1, 0.22, 0, Math.PI * 2);
    ctx.fillStyle = paper;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws a single toroidal field layer (either gentle shadowed dusk-paper outside the spotlight,
 * or bright warm rag-paper black-work inside the spotlight).
 */
export function renderFieldCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  camX: number,
  camY: number,
  isAmbientShade: boolean,
  hoveredProjectId: string | null
) {
  ctx.save();

  const pattern = isAmbientShade ? ensureDuskGrain(ctx) : ensurePaperGrain(ctx);
  if (pattern) {
    const ox = -(((camX % 180) + 180) % 180);
    const oy = -(((camY % 180) + 180) % 180);
    ctx.save();
    ctx.translate(ox, oy);
    ctx.fillStyle = pattern;
    ctx.fillRect(-180, -180, width + 360, height + 360);
    ctx.restore();
  } else {
    ctx.fillStyle = isAmbientShade ? '#070706' : '#f4f0e6';
    ctx.fillRect(0, 0, width, height);
  }

  const halfW = width * 0.5;
  const halfH = height * 0.5;

  // Delicate, barely-there compass orbit arcs around Origin (0, 0)
  const originDx = wrapDelta(0, camX, WORLD_WIDTH);
  const originDy = wrapDelta(0, camY, WORLD_HEIGHT);
  const originSx = halfW + originDx;
  const originSy = halfH + originDy;

  const rings = [440, 840, 1200];
  ctx.save();
  ctx.setLineDash([4, 10]);
  ctx.strokeStyle = isAmbientShade ? 'rgba(232, 226, 210, 0.07)' : 'rgba(15, 15, 14, 0.11)';
  ctx.lineWidth = 1;
  for (const r of rings) {
    ctx.beginPath();
    ctx.arc(originSx, originSy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();

  // Organic connecting botanical ink stems weaving across the 360° torus
  for (const [x1, y1, x2, y2, bend] of STEM_CONNECTIONS) {
    const dx1 = wrapDelta(x1, camX, WORLD_WIDTH);
    const dy1 = wrapDelta(y1, camY, WORLD_HEIGHT);
    const segDx = wrapDelta(x2, x1, WORLD_WIDTH);
    const segDy = wrapDelta(y2, y1, WORLD_HEIGHT);

    const shifts = [
      [0, 0],
      [segDx > 0 ? -WORLD_WIDTH : WORLD_WIDTH, 0],
      [0, segDy > 0 ? -WORLD_HEIGHT : WORLD_HEIGHT]
    ];

    for (const [ox, oy] of shifts) {
      const sx1 = halfW + dx1 + ox;
      const sy1 = halfH + dy1 + oy;
      const sx2 = sx1 + segDx;
      const sy2 = sy1 + segDy;

      const minX = Math.min(sx1, sx2) - 160;
      const maxX = Math.max(sx1, sx2) + 160;
      const minY = Math.min(sy1, sy2) - 160;
      const maxY = Math.max(sy1, sy2) + 160;
      if (maxX < 0 || minX > width || maxY < 0 || minY > height) continue;

      const len = Math.hypot(segDx, segDy) || 1;
      const nx = -segDy / len;
      const ny = segDx / len;
      const cx = (sx1 + sx2) * 0.5 + nx * bend;
      const cy = (sy1 + sy2) * 0.5 + ny * bend;

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(cx, cy, sx2, sy2);
      ctx.strokeStyle = isAmbientShade ? 'rgba(232, 226, 210, 0.16)' : 'rgba(15, 15, 14, 0.22)';
      ctx.lineWidth = isAmbientShade ? 1.15 : 1.85;
      ctx.stroke();
    }
  }

  // Sculptural charcoal flowers distributed organically across the 360° torus
  for (const bloom of DECORATIVE_BLOOMS) {
    const sx = halfW + wrapDelta(bloom.x, camX, WORLD_WIDTH);
    const sy = halfH + wrapDelta(bloom.y, camY, WORLD_HEIGHT);
    if (sx < -220 || sx > width + 220 || sy < -220 || sy > height + 220) continue;
    drawCanvasFlower(ctx, sx, sy, bloom, isAmbientShade);
  }

  // Project flowers live in the lit layer only, so they are not drawn twice at the beam edge.
  void hoveredProjectId;

  ctx.restore();
}

/**
 * Renders a gentle, painterly gallery light shimmer—no harsh geometric cone,
 * no dashed mechanical reticle, no telemetry overlay text. Just soft warm light
 * and subtle drifting dust responding gracefully to 360° scroll motion.
 */
export function renderSpotlightOptics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spot: SpotlightState,
  timeSec: number,
  trailPoints: Array<{ x: number; y: number; alpha: number; r: number }>
) {
  ctx.clearRect(0, 0, width, height);

  const spotlightOpacity = 1 - spot.workLightMix;
  if (spotlightOpacity <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = spotlightOpacity;

  const speedNorm = Math.min(spot.speed / 30, 1);
  const beamRadius = spot.radius;

  // 1. Very soft, low-intensity warm ambient edge veil so edges breathe gently without turning black
  const edgeVeil = ctx.createRadialGradient(
    spot.x,
    spot.y,
    beamRadius * 0.65,
    spot.x,
    spot.y,
    Math.max(width, height) * 0.92
  );
  edgeVeil.addColorStop(0, 'rgba(28, 26, 22, 0)');
  edgeVeil.addColorStop(0.55, 'rgba(28, 26, 22, 0.06)');
  edgeVeil.addColorStop(1, 'rgba(24, 22, 19, 0.18)');
  ctx.fillStyle = edgeVeil;
  ctx.fillRect(0, 0, width, height);

  // 2. Whisper-soft directional light bloom during scroll motion
  if (speedNorm > 0.04) {
    const leadX = spot.x + spot.vx * 3.8;
    const leadY = spot.y + spot.vy * 3.8;
    const glowGrad = ctx.createRadialGradient(leadX, leadY, 0, leadX, leadY, beamRadius * 0.95);
    glowGrad.addColorStop(0, `rgba(255, 252, 244, ${0.06 + speedNorm * 0.09})`);
    glowGrad.addColorStop(0.6, `rgba(255, 252, 244, ${0.02 + speedNorm * 0.03})`);
    glowGrad.addColorStop(1, 'rgba(255, 252, 244, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(leadX, leadY, beamRadius * 0.95, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Faint fading light-echo rings left gently behind brisk pans
  for (const tp of trailPoints) {
    if (tp.alpha <= 0.01) continue;
    const tGrad = ctx.createRadialGradient(tp.x, tp.y, tp.r * 0.2, tp.x, tp.y, tp.r);
    tGrad.addColorStop(0, `rgba(255, 252, 244, ${tp.alpha * 0.055})`);
    tGrad.addColorStop(1, 'rgba(255, 252, 244, 0)');
    ctx.fillStyle = tGrad;
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, tp.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Subtle drifting sunlit dust motes inside the gentle beam
  for (const m of DUST_MOTES) {
    const mx = ((m.nx * width + m.driftX * timeSec) % width + width) % width;
    const my = ((m.ny * height + m.driftY * timeSec) % height + height) % height;
    const d = Math.hypot(mx - spot.x, my - spot.y);
    if (d > beamRadius * 0.88) continue;
    const falloff = 1 - d / (beamRadius * 0.88);
    const twinkle = 0.5 + 0.5 * Math.sin(timeSec * 1.4 + m.phase);
    ctx.fillStyle = `rgba(255, 252, 245, ${falloff * twinkle * 0.22})`;
    ctx.beginPath();
    ctx.arc(mx, my, m.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
