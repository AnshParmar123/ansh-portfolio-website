import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ANSH
              <br />
              <span>&nbsp;PARMAR</span>
            </h1>
            <p className="landing-tagline">
              Building intelligent AI systems that solve real-world problems
              with precision and impact.
            </p>
            <div className="landing-highlights">
              <span>Computer Vision</span>
              <span>AI Product Thinking</span>
              <span>Software Development</span>
            </div>
            <p className="landing-availability">
              Open to internships, AI/ML roles, and collaborative product work.
            </p>
            <div className="landing-cta-row">
              <a
                href="#work"
                className="landing-cta landing-cta-primary"
                data-href="#work"
              >
                View Work
              </a>
              <a
                href="/documents/Ansh_Parmar_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="landing-cta landing-cta-secondary"
                data-cursor="disable"
              >
                Resume
              </a>
            </div>
          </div>
          <div className="landing-info">
            <h3>An AIML Student</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">AI Builder</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
          </div>
        </div>
        <div className="landing-scroll-cue" aria-hidden="true">
          <span></span>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
