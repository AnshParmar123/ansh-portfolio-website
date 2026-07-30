import { PATH_LENGTH } from "../data/sections";
import { focalLength, project, type Camera, type Viewport } from "./projection";

/**
 * The world behind the type: a receding floor/ceiling rule grid and drifting
 * motes, drawn into a plain 2D canvas with the same projection the slabs use.
 *
 * This replaced a three.js scene. It was only ever drawing points and two
 * gridHelpers, which is a few hundred 2D draw calls — not worth 824 kB of
 * library, and doing it by hand gives exact control over the fog falloff.
 */

/**
 * Floor and ceiling sit close to the camera on purpose. Pushed further out they
 * projected off-screen at every useful distance, which left the world reading as
 * flat black — the exact "feels empty" problem this is here to solve.
 */
const FLOOR_Y = -4.6;
const CEIL_Y = 5.2;
const HALF_WIDTH = 22;
/** Spacing of the receding cross-rules, in world units. */
const RULE_SPACING = 6;
const FOG_NEAR = 8;
const FOG_FAR = 54;

interface Mote {
  x: number;
  y: number;
  z: number;
  seed: number;
}

export class Atmosphere {
  private motes: Mote[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private dpr = 1;

  constructor(private canvas: HTMLCanvasElement, moteCount: number) {
    this.ctx = canvas.getContext("2d", { alpha: false });
    // Deterministic scatter: a mote field that reshuffled each load would read
    // as noise rather than as a place.
    let seed = 20260730;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < moteCount; i++) {
      this.motes.push({
        x: (random() - 0.5) * HALF_WIDTH * 2,
        y: FLOOR_Y + random() * (CEIL_Y - FLOOR_Y),
        z: -random() * (PATH_LENGTH + 60) + 20,
        seed: random() * Math.PI * 2,
      });
    }
  }

  resize(width: number, height: number, dpr: number): void {
    this.dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /** Distance fade, matched to the CSS vignette so the two do not fight. */
  private fog(depth: number): number {
    if (depth <= 0) return 0;
    if (depth >= FOG_FAR) return 0;
    if (depth <= FOG_NEAR) return 1;
    return 1 - (depth - FOG_NEAR) / (FOG_FAR - FOG_NEAR);
  }

  draw(camera: Camera, viewport: Viewport, time: number, drawGrid: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = "#06080b";
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    const focal = focalLength(camera, viewport);

    if (drawGrid) {
      this.drawRules(ctx, camera, viewport, focal);
    }
    this.drawMotes(ctx, camera, viewport, focal, time);
  }

  /**
   * Cross-rules on the floor and ceiling. Only the rules bracketing the camera
   * are drawn, so cost is constant regardless of how long the path is.
   */
  private drawRules(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    viewport: Viewport,
    focal: number
  ): void {
    ctx.lineWidth = 1;

    const firstIndex = Math.floor((camera.z - FOG_FAR) / RULE_SPACING);
    const lastIndex = Math.ceil((camera.z - FOG_NEAR * 0.5) / RULE_SPACING);

    for (const y of [FLOOR_Y, CEIL_Y]) {
      for (let i = firstIndex; i <= lastIndex; i++) {
        const z = i * RULE_SPACING;
        const depth = camera.z - z;
        const alpha = this.fog(depth);
        if (alpha <= 0.01) continue;

        const left = project(-HALF_WIDTH, y, z, camera, viewport, focal);
        const right = project(HALF_WIDTH, y, z, camera, viewport, focal);
        if (left.scale <= 0) continue;

        ctx.strokeStyle = `rgba(112, 172, 190, ${(alpha * 0.62).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }

      // A few long rails running with the path, to give the eye direction.
      for (const x of [-HALF_WIDTH, -HALF_WIDTH / 2, 0, HALF_WIDTH / 2, HALF_WIDTH]) {
        const nearZ = camera.z - FOG_NEAR * 0.5;
        const farZ = camera.z - FOG_FAR;
        const near = project(x, y, nearZ, camera, viewport, focal);
        const far = project(x, y, farZ, camera, viewport, focal);
        if (near.scale <= 0 || far.scale <= 0) continue;

        const gradient = ctx.createLinearGradient(near.x, near.y, far.x, far.y);
        gradient.addColorStop(0, "rgba(112, 172, 190, 0.42)");
        gradient.addColorStop(1, "rgba(112, 172, 190, 0)");
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(near.x, near.y);
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
      }
    }
  }

  private drawMotes(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    viewport: Viewport,
    focal: number,
    time: number
  ): void {
    const span = PATH_LENGTH + 80;

    for (const mote of this.motes) {
      // Wrap motes the camera has passed back around to the far end, so a
      // fixed-size field covers an arbitrarily long path.
      let z = mote.z;
      const relative = camera.z - z;
      if (relative > FOG_NEAR) {
        z -= Math.ceil((relative - FOG_NEAR) / span) * span;
      } else if (relative < -FOG_FAR) {
        z += Math.ceil((-relative - FOG_FAR) / span) * span;
      }

      const drift = Math.sin(time * 0.25 + mote.seed) * 0.25;
      const point = project(
        mote.x + drift,
        mote.y + Math.cos(time * 0.2 + mote.seed) * 0.18,
        z,
        camera,
        viewport,
        focal
      );
      if (point.scale <= 0) continue;

      const alpha = this.fog(point.depth);
      if (alpha <= 0.02) continue;
      if (
        point.x < -20 ||
        point.x > viewport.width + 20 ||
        point.y < -20 ||
        point.y > viewport.height + 20
      ) {
        continue;
      }

      const radius = Math.max(0.6, point.scale * 0.016);
      ctx.fillStyle = `rgba(186, 222, 234, ${(alpha * 0.7).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
