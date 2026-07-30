import { useEffect, useRef } from "react";
import type { FaceReading } from "./reading";
import type { Vision } from "./useVision";

/**
 * The visitor's camera, as the world.
 *
 * The <video> is mirrored and object-fit: cover, sitting behind everything; the
 * overlay canvas draws the detection on top. The video is never copied through
 * drawImage — that would cost a full-frame blit every tick. It stays a
 * GPU-composited element and only the box and landmarks are drawn.
 */

/** Maps normalised video coords to screen, matching CSS `object-fit: cover`. */
function coverMap(
  videoW: number,
  videoH: number,
  viewW: number,
  viewH: number
): { scale: number; offsetX: number; offsetY: number } {
  const scale = Math.max(viewW / videoW, viewH / videoH);
  return {
    scale,
    offsetX: (viewW - videoW * scale) / 2,
    offsetY: (viewH - videoH * scale) / 2,
  };
}

export default function FeedOverlay({ vision }: { vision: Vision }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef, reading, state } = vision;

  useEffect(() => {
    if (state !== "running") return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);

      const r: FaceReading = reading.current;
      const videoW = video.videoWidth || 640;
      const videoH = video.videoHeight || 480;
      const { scale, offsetX, offsetY } = coverMap(videoW, videoH, viewW, viewH);

      // The video is mirrored in CSS, so x must be flipped to match.
      const toScreenX = (nx: number) => offsetX + (1 - nx) * videoW * scale;
      const toScreenY = (ny: number) => offsetY + ny * videoH * scale;

      if (r.present && r.confidence > 0.2) {
        const x2 = toScreenX(r.box.x + r.box.w);
        const x1 = toScreenX(r.box.x);
        const left = Math.min(x1, x2);
        const top = toScreenY(r.box.y);
        const width = Math.abs(x2 - x1);
        const height = r.box.h * videoH * scale;

        drawBracketBox(ctx, left, top, width, height, r.confidence);
        drawLabel(ctx, left, top, `PERSON ${r.confidence.toFixed(2)}`);
        drawLips(ctx, r, toScreenX, toScreenY);

        // Mouth-open meter, mirroring what LipSync AI keys off.
        drawMeter(ctx, left, top + height + 10, width, r.mouthOpen);
      } else {
        drawSearching(ctx, viewW, viewH);
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [state, reading, videoRef]);

  return (
    <div className={`vfeed${state === "running" ? " vfeed-on" : ""}`} aria-hidden="true">
      <video ref={videoRef} playsInline muted />
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ── drawing helpers ─────────────────────────────────────────────────── */

const ACQUIRE = "#d8ff3e";

function drawBracketBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  confidence: number
): void {
  const arm = Math.max(14, Math.min(w, h) * 0.22);
  ctx.strokeStyle = ACQUIRE;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.35 + confidence * 0.65;

  const corners: [number, number, number, number][] = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + arm * sx, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + arm * sy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string
): void {
  ctx.font = "500 12px 'JetBrains Mono', ui-monospace, monospace";
  const width = ctx.measureText(text).width + 16;
  ctx.fillStyle = "rgba(6, 8, 11, 0.82)";
  ctx.fillRect(x, y - 26, width, 20);
  ctx.strokeStyle = ACQUIRE;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y - 26, width, 20);
  ctx.fillStyle = ACQUIRE;
  ctx.fillText(text, x + 8, y - 12);
}

function drawLips(
  ctx: CanvasRenderingContext2D,
  reading: FaceReading,
  toX: (n: number) => number,
  toY: (n: number) => number
): void {
  if (reading.lips.length < 3) return;

  ctx.strokeStyle = "rgba(216, 255, 62, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  reading.lips.forEach((point, index) => {
    const px = toX(point.x);
    const py = toY(point.y);
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  for (const point of reading.lips) {
    ctx.fillRect(toX(point.x) - 1.5, toY(point.y) - 1.5, 3, 3);
  }
}

function drawMeter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  value: number
): void {
  const height = 4;
  ctx.fillStyle = "rgba(150, 187, 200, 0.25)";
  ctx.fillRect(x, y, w, height);
  ctx.fillStyle = ACQUIRE;
  ctx.fillRect(x, y, w * value, height);

  ctx.font = "500 10px 'JetBrains Mono', ui-monospace, monospace";
  ctx.fillStyle = "rgba(231, 238, 242, 0.6)";
  ctx.fillText(`MOUTH ${value.toFixed(2)}`, x, y + 16);
}

function drawSearching(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number
): void {
  const size = Math.min(viewW, viewH) * 0.34;
  const x = (viewW - size) / 2;
  const y = (viewH - size) / 2;
  const pulse = 0.3 + Math.sin(performance.now() / 420) * 0.16;

  ctx.strokeStyle = `rgba(150, 187, 200, ${pulse.toFixed(2)})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 8]);
  ctx.strokeRect(x, y, size, size);
  ctx.setLineDash([]);

  ctx.font = "500 12px 'JetBrains Mono', ui-monospace, monospace";
  ctx.fillStyle = `rgba(150, 187, 200, ${(pulse + 0.25).toFixed(2)})`;
  ctx.fillText("SEARCHING…", x, y - 10);
}
