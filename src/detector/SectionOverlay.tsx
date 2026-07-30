import { useEffect, useRef } from "react";
import SectionBody from "../content/SectionBody";
import { sectionById } from "../data/sections";
import type { SectionId } from "../data/types";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The opened target: section content over the frozen scene.
 *
 * Content comes from the shared `SectionBody`, so this is the same markup the
 * flat site renders. Escape closes, focus is trapped while open, and focus
 * returns to wherever it came from on close.
 */
export default function SectionOverlay({
  id,
  onClose,
}: {
  id: SectionId;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const meta = sectionById.get(id)!;

  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreTo.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="overlay" role="presentation" onClick={onClose}>
      <div
        className="overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label={meta.heading}
        tabIndex={-1}
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="overlay-head">
          <span className="hud hud-acquire">{meta.label}</span>
          <span className="hud">{meta.confidence.toFixed(2)}</span>
          <button type="button" className="hud overlay-close" onClick={onClose}>
            Close esc
          </button>
        </header>
        <h2 className="overlay-title">{meta.heading}</h2>
        <p className="overlay-summary">{meta.summary}</p>
        <div className="overlay-body panel-body">
          <SectionBody id={id} />
        </div>
      </div>
    </div>
  );
}
