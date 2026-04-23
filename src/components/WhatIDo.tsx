import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    const cleanupFns: Array<() => void> = [];

    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          const onClick = () => handleClick(container);
          container.addEventListener("click", onClick);
          cleanupFns.push(() => container.removeEventListener("click", onClick));
        }
      });
    }

    return () => cleanupFns.forEach((cleanup) => cleanup());
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT </span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>Software Development</h3>
              <h4>Focus Area</h4>
              <p>
                I build practical software systems with a strong foundation in
                programming, frontend development, and scalable application
                logic for real-world use cases.
              </p>
              <h5>Core Stack</h5>
              <div className="what-content-flex">
                <div className="what-tags">C</div>
                <div className="what-tags">C++</div>
                <div className="what-tags">Python</div>
                <div className="what-tags">Java</div>
                <div className="what-tags">JavaScript</div>
                <div className="what-tags">HTML</div>
                <div className="what-tags">CSS</div>
                <div className="what-tags">React.js</div>
                <div className="what-tags">Node.js</div>
                <div className="what-tags">Tailwind CSS</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>AI & Machine Learning</h3>
              <h4>Focus Area</h4>
              <p>
                My work focuses on AI-driven problem solving across computer
                vision, intelligent automation, analytics, and applied machine
                learning systems with practical implementation.
              </p>
              <h5>Tools & Platforms</h5>
              <div className="what-content-flex">
                <div className="what-tags">OpenCV</div>
                <div className="what-tags">NumPy</div>
                <div className="what-tags">Pandas</div>
                <div className="what-tags">Scikit-learn</div>
                <div className="what-tags">TensorFlow</div>
                <div className="what-tags">Git</div>
                <div className="what-tags">GitHub</div>
                <div className="what-tags">VS Code</div>
                <div className="what-tags">Jupyter</div>
                <div className="what-tags">Firebase</div>
                <div className="what-tags">Netlify</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
