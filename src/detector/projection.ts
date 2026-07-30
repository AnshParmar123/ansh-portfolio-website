/**
 * Perspective projection, by hand.
 *
 * The world only ever contains DOM type and a 2D-canvas atmosphere, so pulling
 * in three.js (824 kB) to do one matrix multiply was not worth it. This is the
 * same pinhole model: a camera at `(x, y, z)` looking down -Z, with a vertical
 * field of view.
 *
 * Keeping the content as DOM rather than WebGL text means it stays crisp at any
 * scale, remains selectable, and is reachable by assistive tech for free.
 */

export interface Camera {
  x: number;
  y: number;
  z: number;
  /** Vertical field of view, in radians. */
  fov: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface Projected {
  x: number;
  y: number;
  /** Distance in front of the camera, in world units. Negative = behind. */
  depth: number;
  /** World-units-to-pixels at this depth. Use directly as a CSS scale. */
  scale: number;
}

/** Pixels per world unit at unit depth. */
export function focalLength(camera: Camera, viewport: Viewport): number {
  return viewport.height / 2 / Math.tan(camera.fov / 2);
}

export function project(
  wx: number,
  wy: number,
  wz: number,
  camera: Camera,
  viewport: Viewport,
  focal: number
): Projected {
  const depth = camera.z - wz;
  if (depth <= 0.001) {
    return { x: 0, y: 0, depth, scale: 0 };
  }
  const scale = focal / depth;
  return {
    x: viewport.width / 2 + (wx - camera.x) * scale,
    y: viewport.height / 2 - (wy - camera.y) * scale,
    depth,
    scale,
  };
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** Frame-rate independent exponential smoothing. */
export function damp(
  current: number,
  target: number,
  lambda: number,
  delta: number
): number {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}
