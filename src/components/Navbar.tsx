import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("#about");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const links = document.querySelectorAll(".header ul a");
    const cleanup = Array.from(links).map((elem) => {
      const element = elem as HTMLAnchorElement;
      const onClick = (e: Event) => {
        e.preventDefault();
        const currentLink = e.currentTarget as HTMLAnchorElement;
        const section = currentLink.getAttribute("data-href");
        if (!section) return;
        setActiveSection(section);
        document.querySelector(section)?.scrollIntoView({ behavior: "smooth" });
      };

      element.addEventListener("click", onClick);
      return () => element.removeEventListener("click", onClick);
    });

    const onResize = () => ScrollTrigger.refresh();
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.35, rootMargin: "-10% 0px -45% 0px" }
    );

    ["about", "work", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cleanup.forEach((removeListener) => removeListener());
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      sectionObserver.disconnect();
    };
  }, []);
  return (
    <>
      <div className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <a href="/#" className="navbar-title" data-cursor="disable">
          ANSH
        </a>
        <div className="navbar-connect">
          कृष्णं वन्दे जगद्गुरुम् °•👁U👁•° 🌸
        </div>
        <ul>
          <li>
            <a
              data-href="#about"
              href="#about"
              className={activeSection === "#about" ? "nav-link-active" : ""}
            >
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a
              data-href="#work"
              href="#work"
              className={activeSection === "#work" ? "nav-link-active" : ""}
            >
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a
              data-href="#contact"
              href="#contact"
              className={activeSection === "#contact" ? "nav-link-active" : ""}
            >
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
