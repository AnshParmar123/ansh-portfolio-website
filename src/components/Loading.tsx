import { CSSProperties, useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const loadingLog = [
  "compiling render tree",
  "hydrating components",
  "optimizing render pipeline",
  "linking asset pipeline",
  "finalizing experience",
];

const VISITED_KEY = "portfolio_visited";
const isRepeatVisit =
  typeof window !== "undefined" &&
  window.sessionStorage.getItem(VISITED_KEY) === "1";

// Repeat visits within the same session skip the "theater" delays entirely
// so returning recruiters/reviewers aren't stuck watching the loader again.
//
// The reveal runs on its OWN fixed clock (CHARGE_DURATION) — not tied to the
// real asset-load percent. Real load speed varies with network/cache, and
// (as measured) decrypting + parsing the 3D character can block the main
// thread for seconds at a time, which starves any JS-timer-driven animation
// mid-flight. So instead of ticking intermediate frames in JS, we only ever
// set TWO target states — "revealing" and "released" — and let the CSS
// `transition` on each element interpolate between them. That interpolation
// is scheduled by the browser's style/compositor engine, not by our JS
// callbacks, so it stays smooth even while the main thread is busy loading
// the character. The real load can only gate *when* the reveal is allowed to
// resolve (it holds at the near-complete state if assets aren't ready yet),
// never how fast it visually builds.
const CHARGE_DURATION = isRepeatVisit ? 550 : 2600;
const CHARGE_TARGET = 97;
const RELEASE_DURATION = 550;
const COMPLETE_DELAY = isRepeatVisit ? 80 : 200;
const READY_DELAY = isRepeatVisit ? 120 : 500;
const FX_DELAY = isRepeatVisit ? 40 : 120;
const REMOVE_DELAY = isRepeatVisit ? 150 : 450;
const FALLBACK_TIMEOUT = isRepeatVisit ? 3000 : 8000;

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [chargeActive, setChargeActive] = useState(false);
  const [chargeComplete, setChargeComplete] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [numberPercent, setNumberPercent] = useState(0);
  // Two-state target the CSS transitions animate toward: 0 -> CHARGE_TARGET
  // while revealing, then CHARGE_TARGET -> 100 on release. The number shown
  // in text is a separate best-effort wall-clock counter (see below); it can
  // lag slightly under heavy load but the visuals never do.
  const visualPercent = loaded ? 100 : chargeActive ? CHARGE_TARGET : 0;
  const visualDuration = loaded ? RELEASE_DURATION : CHARGE_DURATION;
  const displayPercent = loaded ? 100 : Math.min(numberPercent, CHARGE_TARGET);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.sessionStorage.setItem(VISITED_KEY, "1");
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");
    if (mediaQuery.matches) return;

    function handlePointerMove(e: PointerEvent) {
      const mx = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3);
      const my = ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3);
      stageRef.current?.style.setProperty("--mx", mx);
      stageRef.current?.style.setProperty("--my", my);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingLog.length);
    }, 1400);

    return () => window.clearInterval(messageTimer);
  }, []);

  // Trigger the reveal on the next paint (a double-rAF, not a single one, so
  // the browser has definitely committed the 0% state first — otherwise the
  // very first style write can coalesce with this one and the CSS
  // transition has nothing to animate from).
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setChargeActive(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // The authored reveal is "complete" a fixed CHARGE_DURATION after it
  // started — this setTimeout can still be delayed by main-thread load, but
  // that only ever pushes completion later, never earlier, so it can't
  // undercut the intended minimum reveal time.
  useEffect(() => {
    if (!chargeActive) return;
    const timer = window.setTimeout(() => setChargeComplete(true), CHARGE_DURATION);
    return () => window.clearTimeout(timer);
  }, [chargeActive]);

  // Best-effort numeric readout for the text label, independent of the CSS
  // transitions driving the actual visuals — safe to lag under load since
  // it's just digits, not the spectacle.
  useEffect(() => {
    if (!chargeActive) return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / CHARGE_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setNumberPercent(Math.round(eased * CHARGE_TARGET));
      if (t >= 1) window.clearInterval(id);
    }, 80);
    return () => window.clearInterval(id);
  }, [chargeActive]);

  // Real readiness signal from the actual asset load — only gates *when*
  // the reveal is allowed to resolve, never how fast it visually builds.
  useEffect(() => {
    if (percent >= 100) setAssetsReady(true);
  }, [percent]);

  useEffect(() => {
    if (loaded) return;
    if (!chargeComplete || !assetsReady) return;

    const completeTimer = window.setTimeout(() => {
      setLoaded(true);
    }, COMPLETE_DELAY);

    return () => window.clearTimeout(completeTimer);
  }, [chargeComplete, assetsReady, loaded]);

  useEffect(() => {
    if (loaded) return;

    const fallbackTimer = window.setTimeout(() => {
      setLoaded(true);
    }, FALLBACK_TIMEOUT);

    return () => window.clearTimeout(fallbackTimer);
  }, [loaded]);

  function handleSkip() {
    if (loaded) return;
    setChargeActive(true);
    setLoaded(true);
  }

  useEffect(() => {
    if (!loaded || isLoaded) return;

    const readyTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, READY_DELAY);

    return () => window.clearTimeout(readyTimer);
  }, [loaded, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    let animationDelay: number | undefined;
    let removeDelay: number | undefined;
    import("./utils/initialFX")
      .then((module) => {
        animationDelay = window.setTimeout(() => {
          try {
            module.initialFX?.();
          }
          finally {
            setClicked(true);
            removeDelay = window.setTimeout(() => {
              setIsLoading(false);
            }, REMOVE_DELAY);
          }
        }, FX_DELAY);
      })
      .catch(() => {
        setClicked(true);
        removeDelay = window.setTimeout(() => {
          setIsLoading(false);
        }, REMOVE_DELAY);
      });

    return () => {
      if (animationDelay) window.clearTimeout(animationDelay);
      if (removeDelay) window.clearTimeout(removeDelay);
    };
  }, [isLoaded, setIsLoading]);

  const fillScale = visualPercent / 100;

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-mark" data-cursor="disable">
          Ansh Parmar
        </a>
        <div className="loading-header-right">
          <div className={`loader-status ${clicked ? "loader-status-out" : ""}`} aria-hidden="true">
            <span className="loader-status-dot"></span>
            {loaded ? "Ready" : "Loading"}
          </div>
          {!loaded && (
            <button type="button" className="loader-skip" onClick={handleSkip}>
              Skip
            </button>
          )}
        </div>
      </div>
      <div
        className={`loading-screen ${clicked ? "loading-screen-out" : ""}`}
        onClick={handleSkip}
      >
        <div className="loading-aurora" aria-hidden="true">
          <span className="loading-aurora-blob loading-aurora-1"></span>
          <span className="loading-aurora-blob loading-aurora-2"></span>
          <span className="loading-aurora-blob loading-aurora-3"></span>
        </div>
        <div className="loading-grid" aria-hidden="true"></div>
        <div className="loading-grain" aria-hidden="true"></div>
        <div className="loading-glow" aria-hidden="true"></div>
        <div className={`loading-flash ${loaded ? "loading-flash-active" : ""}`} aria-hidden="true"></div>

        <div
          className={`loading-stage ${clicked ? "loading-stage-out" : ""}`}
          ref={stageRef}
        >
          <p className="loading-eyebrow">
            Portfolio <span>&middot;</span> {String(displayPercent).padStart(2, "0")}%
          </p>

          <h1 className="loading-title" aria-label="Ansh Parmar">
            <span className="loading-title-track">Ansh Parmar</span>
            <span
              className="loading-title-fill"
              style={
                {
                  "--reveal": `${visualPercent}%`,
                  transitionDuration: `${visualDuration}ms`,
                } as CSSProperties
              }
              aria-hidden="true"
            >
              Ansh Parmar
            </span>
          </h1>

          <div
            className="loading-meter"
            role="progressbar"
            aria-valuenow={displayPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="loading-meter-fill"
              style={{ transform: `scaleX(${fillScale})`, transitionDuration: `${visualDuration}ms` }}
            >
              <span className="loading-meter-head" aria-hidden="true"></span>
            </div>
          </div>
        </div>

        <div className="loading-hud" aria-hidden="true">
          <span className="loading-hud-tag">sys</span>
          <span className="loading-hud-line" key={messageIndex}>
            {loaded ? "experience.ready()" : loadingLog[messageIndex]}
          </span>
          <span className="loading-hud-cursor"></span>
        </div>

        <p className="loading-signature">Made with ❤️ by Ansh Parmar</p>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + 1;
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 250);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function stop() {
    clearInterval(interval);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear, stop };
};
