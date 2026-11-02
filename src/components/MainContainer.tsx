import { lazy, Suspense, useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Experience from "./Experience";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import SignalField from "./SignalField";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = () => {

  useEffect(() => {
    let resizeFrame = 0;

    const resizeHandler = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        setSplitText();
      });
    };

    const revealTargets = Array.from(
      document.querySelectorAll(
        ".landing-section, .about-section, .whatIDO, .career-section, .experience-section, .certifications-section, .work-section, .techstack, .contact-section"
      )
    );

    revealTargets.forEach((element) => {
      element.classList.add("section-reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", resizeHandler);
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="container-main">
      <SignalField />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="brand-watermark" aria-hidden="true">
        ANSH
        <br />
        PARMAR
      </div>
      <Navbar />
      <SocialIcons />
      <div id="smooth-wrapper">
        <main id="main-content" tabIndex={-1}>
          <div className="container-main">
            <Landing />
            <About />
            <WhatIDo />
            <Career />
            <Experience />
            <Certifications />
            <Work />
            <Suspense fallback={null}>
              <TechStack />
            </Suspense>
            <Contact />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainContainer;
