/**
 * The detection result shape, split out from `faceDetector.ts` on purpose.
 *
 * `useVision` needs the type and an empty value up front, but must NOT pull the
 * detector module into the eager bundle — importing it statically anywhere
 * defeats the dynamic import and drags the MediaPipe wrapper into a chunk that
 * loads for visitors who never touch the camera.
 */

export interface FaceReading {
  /** True when a face was found in the most recent frame. */
  present: boolean;
  /** Detection confidence, 0..1. */
  confidence: number;
  /** Bounding box in normalised video space (0..1, origin top-left). */
  box: { x: number; y: number; w: number; h: number };
  /** Outer-lip landmarks in normalised video space — the LipSync AI device. */
  lips: { x: number; y: number }[];
  /** How open the mouth is, 0..1, from the jawOpen blendshape. */
  mouthOpen: number;
  /** Frames processed since start — drives the HUD's counter. */
  frames: number;
}

export function emptyReading(): FaceReading {
  return {
    present: false,
    confidence: 0,
    box: { x: 0, y: 0, w: 0, h: 0 },
    lips: [],
    mouthOpen: 0,
    frames: 0,
  };
}
