/**
 * The face detector.
 *
 * Wraps MediaPipe's FaceLandmarker. Everything here runs in the visitor's own
 * browser: frames are read from a <video> element, passed to WASM, and thrown
 * away. No frame is uploaded, stored, or retained past the current tick — that
 * promise is made on screen, so it has to be true in the code.
 *
 * The whole module is dynamically imported only after the visitor consents, so
 * the ~3.2 MB (gzipped) WASM runtime and 3.7 MB model never touch a page load
 * where the camera was declined.
 */

export type { FaceReading } from "./reading";
import type { FaceReading } from "./reading";

/**
 * Outer lip contour indices from MediaPipe's 478-point face mesh. Using the
 * outer ring only: the full mesh is far too dense to read as landmarks at
 * on-screen size, and the outer ring is what actually shows mouth shape.
 */
const OUTER_LIPS = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37,
  39, 40, 185,
];

type Landmarker = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number
  ) => {
    faceLandmarks: { x: number; y: number; z: number }[][];
    faceBlendshapes?: { categories: { categoryName: string; score: number }[] }[];
  };
  close: () => void;
};

let landmarker: Landmarker | null = null;
let loading: Promise<Landmarker> | null = null;

/** Can this browser actually hand out a WebGL context for GPU inference? */
function canUseGpu(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

/** Loads WASM + model. Safe to call repeatedly; the work happens once. */
export function loadDetector(): Promise<Landmarker> {
  if (landmarker) return Promise.resolve(landmarker);
  if (loading) return loading;

  loading = (async () => {
    const vision = await import("@mediapipe/tasks-vision");
    const fileset = await vision.FilesetResolver.forVisionTasks("/vision/wasm");

    const build = (delegate: "GPU" | "CPU") =>
      vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: "/vision/face_landmarker.task",
          delegate,
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: false,
      });

    // GPU is much faster, but it needs a WebGL context that some machines and
    // hardened browser configs will not give us. When that happens MediaPipe
    // does NOT reject — it logs "emscripten_webgl_create_context() returned
    // error 0" and the promise simply never settles. So: probe for WebGL first,
    // and still race a timeout in case the context exists but is unusable.
    // CPU inference is slower, but a slower demo beats one that hangs forever.
    let instance: Awaited<ReturnType<typeof build>>;
    if (canUseGpu()) {
      try {
        instance = await withTimeout(build("GPU"), 8000);
      } catch {
        instance = await build("CPU");
      }
    } else {
      instance = await build("CPU");
    }

    landmarker = instance as unknown as Landmarker;
    return landmarker;
  })();

  return loading;
}

export function disposeDetector(): void {
  landmarker?.close();
  landmarker = null;
  loading = null;
}

/**
 * Runs one frame and writes into `out` in place.
 *
 * Mutating a caller-owned object rather than allocating keeps this allocation-
 * free at 30–60 fps, which matters because it runs inside the render loop.
 */
export function readFrame(
  video: HTMLVideoElement,
  timestamp: number,
  out: FaceReading
): FaceReading {
  if (!landmarker || video.readyState < 2) {
    out.present = false;
    return out;
  }

  const result = landmarker.detectForVideo(video, timestamp);
  const faces = result.faceLandmarks;
  out.frames++;

  if (!faces || faces.length === 0) {
    out.present = false;
    // Decay rather than snapping to zero, so the HUD reads as losing lock
    // instead of flickering off between frames.
    out.confidence *= 0.85;
    return out;
  }

  const mesh = faces[0];
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  for (const point of mesh) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  // Pad to a head-shaped box; the mesh covers the face only, and a box cropped
  // to the mesh sits oddly high and tight around the chin.
  const padX = (maxX - minX) * 0.12;
  const padY = (maxY - minY) * 0.2;
  out.box.x = Math.max(0, minX - padX);
  out.box.y = Math.max(0, minY - padY * 1.35);
  out.box.w = Math.min(1 - out.box.x, maxX - minX + padX * 2);
  out.box.h = Math.min(1 - out.box.y, maxY - minY + padY * 2.1);

  out.lips.length = 0;
  for (const index of OUTER_LIPS) {
    const point = mesh[index];
    if (point) out.lips.push({ x: point.x, y: point.y });
  }

  const blendshapes = result.faceBlendshapes?.[0]?.categories;
  const jawOpen = blendshapes?.find((c) => c.categoryName === "jawOpen");
  out.mouthOpen = jawOpen ? Math.min(1, jawOpen.score * 2.4) : 0;

  out.present = true;
  // Ease confidence upward so acquiring reads as a settle, not a snap.
  out.confidence = Math.min(0.99, out.confidence + (0.99 - out.confidence) * 0.25);
  return out;
}
