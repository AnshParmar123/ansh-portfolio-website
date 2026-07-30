import { useCallback, useEffect, useRef, useState } from "react";
import { emptyReading, type FaceReading } from "./reading";

/**
 * Owns the camera lifecycle and the detector loop.
 *
 * Consent rules, deliberately strict:
 *  - nothing is requested until the visitor asks for it explicitly;
 *  - the heavy detector module is only imported after that;
 *  - stopping tears down the media tracks AND frees the model, so the camera
 *    indicator in the OS goes out — a paused <video> would leave it lit and
 *    make a liar of the privacy note on screen;
 *  - the choice is remembered, but "on" is never restored automatically on a
 *    later visit: a site that silently opens your camera because you once
 *    allowed it is exactly the thing people are afraid of.
 */

export type VisionState =
  | "off"
  | "loading"
  | "running"
  | "denied"
  | "unsupported"
  | "error";

const SEEN_KEY = "ap:vision-seen";

export interface Vision {
  state: VisionState;
  /** Latest detection, mutated in place. Read inside animation frames. */
  reading: React.MutableRefObject<FaceReading>;
  videoRef: React.RefObject<HTMLVideoElement>;
  start: () => void;
  stop: () => void;
  /** True once the visitor has been offered the camera at least once. */
  seen: boolean;
  error: string | null;
}

export function useVision(): Vision {
  const [state, setState] = useState<VisionState>("off");
  const [error, setError] = useState<string | null>(null);
  const [seen, setSeen] = useState(() => {
    try {
      return localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return false;
    }
  });

  const reading = useRef<FaceReading>(emptyReading());
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  /** Incremented by stop(); a start() whose id is stale must write nothing. */
  const startId = useRef(0);

  const stop = useCallback(() => {
    // Invalidate any start() still in flight. Without this, cancelling during
    // the model download lets the aborted attempt write its own failure state
    // after teardown, and the panel ends up stuck on "error".
    startId.current++;
    runningRef.current = false;
    cancelAnimationFrame(frameRef.current);

    // Kill the tracks first so the OS camera light goes out immediately.
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }

    reading.current = emptyReading();

    // Free the model too. Keeping it resident would hold ~15 MB for a feature
    // the visitor just switched off.
    void import("./faceDetector").then((module) => module.disposeDetector());

    setState("off");
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }

    const id = ++startId.current;
    const stale = () => startId.current !== id;

    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode — fine */
    }
    setSeen(true);
    setState("loading");
    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
    } catch (cause) {
      if (stale()) return;
      const name = (cause as DOMException)?.name;
      setState(name === "NotAllowedError" ? "denied" : "error");
      if (name !== "NotAllowedError") {
        setError(name === "NotFoundError" ? "No camera found." : "Could not open the camera.");
      }
      return;
    }

    // Cancelled while the permission prompt was open: release and say nothing.
    if (stale()) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((track) => track.stop());
      setState("error");
      return;
    }

    video.srcObject = stream;

    // play() must be raced, not awaited. If the stream opens but never delivers
    // a frame — a camera held by another app, a virtual device with nothing
    // behind it — the promise never settles, and awaiting it strands the
    // visitor on "Loading detector" with no way forward.
    await Promise.race([
      video.play().catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);

    // Wait for dimensions. Without this the first frames report videoWidth 0,
    // and the overlay maps every detection against a 640x480 guess instead of
    // the real stream size, so boxes land in the wrong place on the way in.
    if (!video.videoWidth) {
      await new Promise<void>((resolve) => {
        const done = () => {
          video.removeEventListener("loadedmetadata", done);
          resolve();
        };
        video.addEventListener("loadedmetadata", done);
        setTimeout(done, 3000);
      });
    }

    let detector: typeof import("./faceDetector");
    try {
      detector = await import("./faceDetector");
      await detector.loadDetector();
    } catch {
      stream.getTracks().forEach((track) => track.stop());
      if (stale()) return;
      streamRef.current = null;
      setState("error");
      setError("The detector failed to load.");
      return;
    }

    // The visitor may have hit stop while the model was downloading.
    if (stale() || !streamRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    runningRef.current = true;
    setState("running");

    const tick = () => {
      if (!runningRef.current) return;
      const element = videoRef.current;
      if (element) {
        try {
          detector.readFrame(element, performance.now(), reading.current);
        } catch {
          /* a dropped frame must not kill the loop */
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  // Release the camera if the component unmounts or the tab goes away.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden" && runningRef.current) {
        stop();
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      stop();
    };
  }, [stop]);

  return { state, reading, videoRef, start, stop, seen, error };
}
