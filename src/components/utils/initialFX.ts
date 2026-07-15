import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitTextContent } from "./textSplit";

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0b0f19",
    duration: 0.5,
    delay: 1,
  });

  const landingText = splitTextContent(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingText4 = splitTextContent(".landing-h2-1", TextProps);
  const landingText5 = splitTextContent(".landing-h2-2", TextProps);

  LoopText(landingText4, landingText5);
  ScrollTrigger.refresh();
}

function LoopText(
  current: ReturnType<typeof splitTextContent>,
  next: ReturnType<typeof splitTextContent>
) {
  gsap.set(current.chars, { yPercent: 0 });
  gsap.set(next.chars, { yPercent: 100 });

  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    repeatDelay: 2.6,
    delay: 3.4,
  });

  tl.to(
    current.chars,
    {
      yPercent: -100,
      duration: 0.9,
      ease: "power3.inOut",
      stagger: 0.03,
    },
    0
  ).to(
    next.chars,
    {
      yPercent: 0,
      duration: 0.9,
      ease: "power3.inOut",
      stagger: 0.03,
    },
    0
  );
}
