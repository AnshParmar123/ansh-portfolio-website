import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const loadingMessages = [
  "Initializing AI engine...",
  "Analyzing patterns...",
  "Generating intelligent recommendations...",
  "Processing data...",
  "Optimizing output...",
];

const loadingStages = [
  "Neural systems online",
  "Visual pipeline calibrated",
  "Experience layer syncing",
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const displayPercent = loaded ? 100 : Math.min(percent, 100);
  const circumference = 2 * Math.PI * 52;
  const progressOffset = circumference - (displayPercent / 100) * circumference;

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 1400);

    return () => window.clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    if (loaded) return;

    const normalCompleteTimer =
      percent >= 100
        ? window.setTimeout(() => {
            setLoaded(true);
          }, 450)
        : undefined;

    const fallbackTimer = window.setTimeout(() => {
      setLoaded(true);
    }, 15000);

    return () => {
      if (normalCompleteTimer) window.clearTimeout(normalCompleteTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [percent, loaded]);

  useEffect(() => {
    if (!loaded || isLoaded) return;

    const readyTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 850);

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
            }, 850);
          }
        }, 120);
      })
      .catch(() => {
        setClicked(true);
        removeDelay = window.setTimeout(() => {
          setIsLoading(false);
        }, 900);
      });

    return () => {
      if (animationDelay) window.clearTimeout(animationDelay);
      if (removeDelay) window.clearTimeout(removeDelay);
    };
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          Ansh Parmar
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className={`loading-screen ${clicked ? "loading-screen-out" : ""}`}>
        <div className="loading-neural-grid" aria-hidden="true">
          {[...Array(10)].map((_, index) => (
            <span key={index}></span>
          ))}
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-card">
            <div className="loading-card-rim" aria-hidden="true"></div>
            <div className="loading-shell">
              <div className="loading-main">
                <div className="loading-copy">
                  <div className="loading-kicker">
                    <span></span>
                    Neural interface loading
                  </div>
                  <h1>Welcome to my portfolio</h1>
                  <p className="loading-message" key={messageIndex}>
                    {loaded ? "Experience ready." : loadingMessages[messageIndex]}
                  </p>
                </div>

                <div className="loading-intel-row" aria-hidden="true">
                  <span>Vision</span>
                  <span>AI/ML</span>
                  <span>Systems</span>
                </div>

                <div className="loading-core-zone">
                  <div className="loading-progress-ring" aria-hidden="true">
                    <svg viewBox="0 0 120 120" className="loading-ring-svg">
                      <circle className="loading-ring-track" cx="60" cy="60" r="52" />
                      <circle
                        className="loading-ring-bar"
                        cx="60"
                        cy="60"
                        r="52"
                        style={{
                          strokeDasharray: circumference,
                          strokeDashoffset: progressOffset,
                        }}
                      />
                    </svg>
                    <div className="loading-orb">
                      <span></span>
                      <span></span>
                      <span></span>
                      <i></i>
                    </div>
                    <div className="loading-ring-value">
                      <strong>{displayPercent}</strong>
                      <small>%</small>
                    </div>
                  </div>

                  <div className="loading-stages" aria-hidden="true">
                    {loadingStages.map((stage, index) => (
                      <div className="loading-stage" key={stage}>
                        <span className="loading-stage-dot"></span>
                        <p>{stage}</p>
                        <b>{index + 1}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="loading-side">
                <div className="loading-panel">
                  <div className="loading-panel-head">
                    <span>Live system preview</span>
                    <b>{loaded ? "Ready" : "Syncing"}</b>
                  </div>
                  <div className="loading-skeleton" aria-hidden="true">
                    <div className="skeleton-header">
                      <span></span>
                      <span></span>
                    </div>
                    <div className="skeleton-grid">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="skeleton-line skeleton-wide"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>

                <div className={`loading-progress ${loaded ? "loading-complete" : ""}`}>
                  <div className="loading-progress-top">
                    <span>{loaded ? "Complete" : "Loading"}</span>
                    <strong>{displayPercent}%</strong>
                  </div>
                  <div className="loading-progress-track">
                    <div
                      className="loading-progress-bar"
                      style={{ width: `${displayPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <p className="loading-signature">Made with ❤️ by Ansh Parmar</p>
          </div>
        </div>
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
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
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
  return { loaded, percent, clear };
};
