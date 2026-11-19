/**
 * Pure math utilities for a seamless 360-degree toroidal 2D spatial canvas.
 * Coordinates wrap invisibly across [0, width) x [0, height) with zero seams.
 */

export function wrapCoord(value: number, size: number): number {
  return ((value % size) + size) % size;
}

/**
 * Signed shortest distance from `cam` to `coord` on a repeating ring of length `size`.
 * Result lies in [-size / 2, size / 2).
 */
export function wrapDelta(coord: number, cam: number, size: number): number {
  let d = ((coord - cam) % size + size) % size;
  if (d >= size / 2) d -= size;
  return d;
}

export function torusDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  height: number
): number {
  const dx = wrapDelta(x2, x1, width);
  const dy = wrapDelta(y2, y1, height);
  return Math.hypot(dx, dy);
}

/**
 * Compute compass bearing in degrees [0, 360) where:
 *   0° = North (up, -y), 90° = East (right, +x), 180° = South (+y), 270° = West (-x)
 */
export function bearingDegrees(dx: number, dy: number): number {
  const rad = Math.atan2(dx, -dy);
  const deg = (rad * 180) / Math.PI;
  return ((deg % 360) + 360) % 360;
}

export function compassCardinal(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return dirs[idx];
}

export function formatSignedCoord(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded >= 0 ? '+' : '-';
  return `${sign}${String(Math.abs(rounded)).padStart(4, '0')}`;
}
