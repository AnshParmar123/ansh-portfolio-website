import { useEffect, useRef } from "react";

/**
 * Text that resolves out of noise into meaning.
 *
 * Each character gets a deterministic resolve threshold derived from its index,
 * so the same string always settles in the same order — a re-randomised order
 * on every run reads as a glitch effect, whereas a fixed one reads as a process
 * completing. Unresolved characters scramble; resolved ones lock and stay.
 *
 * Writes through a ref inside its own rAF rather than re-rendering: a 700 ms
 * settle at display rate would otherwise be ~45 React renders per string.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>[]{}=+*#%&$@";

/** Cheap deterministic hash → [0, 1). */
function thresholdFor(index: number, salt: number): number {
  let h = (index + 1) * 2654435761 + salt * 40503;
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

export interface ConvergeProps {
  text: string;
  /** When true, run the settle. When false, the text sits fully resolved. */
  active: boolean;
  /** Settle duration in ms. */
  duration?: number;
  className?: string;
  /** Render as this element. Defaults to a span. */
  as?: "span" | "h2" | "h3" | "p";
}

export default function Converge({
  text,
  active,
  duration = 760,
  className,
  as: Tag = "span",
}: ConvergeProps) {
  const ref = useRef<HTMLElement>(null);
  const salt = useRef(Math.floor(Math.random() * 1000));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Not settling: show the real text and do no work.
    if (!active) {
      element.textContent = text;
      return;
    }

    // Respect reduced motion — a scramble is exactly the kind of motion people
    // turn this setting on to avoid.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = text;
      return;
    }

    const thresholds = Array.from(text, (_, index) =>
      thresholdFor(index, salt.current)
    );
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out, so most characters land early and the tail settles gently.
      const eased = 1 - (1 - progress) ** 2;

      let out = "";
      for (let i = 0; i < text.length; i++) {
        const character = text[i];
        // Whitespace never scrambles: it holds the word shape steady so the
        // line does not visibly change width as it settles.
        if (character === " " || character === "\n") {
          out += character;
          continue;
        }
        out += eased > thresholds[i]
          ? character
          : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      element.textContent = out;

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        element.textContent = text;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, active, duration]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      // The settled text is in the DOM for anyone not watching it animate:
      // crawlers, screen readers, and copy/paste all get the real string.
      aria-label={text}
    >
      {text}
    </Tag>
  );
}
