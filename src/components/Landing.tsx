import { useEffect, useState } from "react";
import HeroPrism from "./HeroPrism";
import MagneticLink from "./MagneticLink";
import "./styles/Landing.css";

const roles = ["AI/ML Student", "AI Builder", "Developer"];

const Landing = () => {
  const [role, setRole] = useState(0);
  useEffect(() => {
    const rotation = window.setInterval(() => setRole((current) => (current + 1) % roles.length), 2600);
    return () => window.clearInterval(rotation);
  }, []);
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <HeroPrism />
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hi, my name is</h2>
            <h1 className="hero-name-stack">
              <span className="hero-name hero-name-first">ANSH</span>
              <span className="hero-name">PARMAR</span>
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
              <MagneticLink
                href="#work"
                className="landing-cta landing-cta-primary"
                data-href="#work"
                aria-label="View Ansh Parmar's featured projects"
              >
                View Projects
              </MagneticLink>
              <MagneticLink
                href="/documents/Ansh_Parmar_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="landing-cta landing-cta-secondary"
                data-cursor="disable"
                aria-label="Open Ansh Parmar resume PDF"
              >
                Resume
              </MagneticLink>
            </div>
            <dl className="landing-proof" aria-label="Portfolio highlights">
              <div>
                <dt>CGPA</dt>
                <dd>8.7</dd>
              </div>
              <div>
                <dt>Projects</dt>
                <dd>04</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>03</dd>
              </div>
            </dl>
          </div>
          <div className="landing-info">
            <p className="landing-role-label">Currently building as</p>
            <h2 className="landing-info-h2">
              <span key={roles[role]}>{roles[role]}</span>
            </h2>
          </div>
        </div>
        <div className="landing-scroll-cue" aria-hidden="true">
          <span></span>
        </div>
      </div>
    </>
  );
};

export default Landing;
