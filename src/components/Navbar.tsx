import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
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
        document.querySelector(section)?.scrollIntoView({ behavior: "smooth" });
      };

      element.addEventListener("click", onClick);
      return () => element.removeEventListener("click", onClick);
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cleanup.forEach((removeListener) => removeListener());
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          ANSH
        </a>
        <a
          href="mailto:anshudayparmar@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          anshudayparmar@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
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
