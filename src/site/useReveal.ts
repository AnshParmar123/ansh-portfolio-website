import { useEffect } from "react";

/**
 * Scroll reveals and the active-section indicator.
 *
 * Two IntersectionObservers, no scroll listener and no animation library. Motion
 * here is one gesture — a short rise and fade, once, on first sight. Anything
 * that repeats on re-entry draws attention to itself rather than to the content.
 *
 * Elements start hidden via CSS only when this hook is active (it sets a flag on
 * <html>), so with JavaScript disabled everything is simply visible.
 */
export function useReveal(onActiveChange: (id: string | null) => void): void {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced) {
      root.classList.add("js-reveal");
    }

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          // One-shot: stop watching as soon as it has played.
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    if (!reduced) {
      revealTargets.forEach((target) => revealObserver.observe(target));
    } else {
      revealTargets.forEach((target) => target.classList.add("is-revealed"));
    }

    // Active section: whichever section most occupies the reading zone.
    const sectionEls = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]")
    );
    const visible = new Map<string, number>();

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        onActiveChange(best);
      },
      { threshold: [0.15, 0.4, 0.75], rootMargin: "-10% 0px -55% 0px" }
    );

    sectionEls.forEach((element) => activeObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
      root.classList.remove("js-reveal");
    };
  }, [onActiveChange]);
}
