import SectionBody from "../content/SectionBody";
import { profile } from "../data/profile";
import { sectionById, sections } from "../data/sections";
import type { SectionId } from "../data/types";
import "./flat.css";

/**
 * The flat 2D site. Every word of content is real, crawlable,
 * screen-reader-navigable HTML — this is what a recruiter gets on a weak
 * laptop, a phone, or with reduced-motion on, so it has to stand on its own.
 *
 * It borrows the detector's visual language (corner brackets, mono class
 * labels, confidence readouts) so the two views read as one product, but it
 * runs no WebGL and no scroll-driven animation. All content comes from
 * `SectionBody`, shared with the 3D overlay.
 */

/** A framed section with the detector's bracket + class-label treatment. */
function Panel({ id }: { id: SectionId }) {
  const meta = sectionById.get(id)!;
  return (
    <section className="panel" id={id} aria-labelledby={`${id}-heading`}>
      <div className="panel-frame" aria-hidden="true">
        <i className="br br-tl" />
        <i className="br br-tr" />
        <i className="br br-bl" />
        <i className="br br-br" />
      </div>
      <header className="panel-head">
        <span className="hud hud-acquire">{meta.label}</span>
        <span className="hud panel-conf">{meta.confidence.toFixed(2)}</span>
      </header>
      <h2 className="panel-title" id={`${id}-heading`}>
        {meta.heading}
      </h2>
      <p className="panel-summary">{meta.summary}</p>
      <div className="panel-body">
        <SectionBody id={id} />
      </div>
    </section>
  );
}

export default function FlatSite({
  onSwitchToDetector,
  detectorAvailable,
}: {
  onSwitchToDetector?: () => void;
  detectorAvailable: boolean;
}) {
  const identity = sectionById.get("identity")!;

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>

      <header className="running-head">
        <span className="hud">
          {profile.firstName} {profile.lastName}
        </span>
        <nav aria-label="Sections">
          {sections.slice(1).map((section) => (
            <a key={section.id} className="hud" href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
        {detectorAvailable && onSwitchToDetector && (
          <button
            type="button"
            className="hud mode-toggle"
            onClick={onSwitchToDetector}
          >
            3D view
          </button>
        )}
      </header>

      <main>
        <section className="masthead" id="identity" aria-label="Introduction">
          <span className="hud hud-acquire">
            {identity.label} · {profile.role}
          </span>
          <SectionBody id="identity" />
        </section>

        {sections.slice(1).map((section) => (
          <Panel key={section.id} id={section.id} />
        ))}
      </main>

      <footer className="site-foot">
        <span className="hud">
          © 2026 {profile.firstName} {profile.lastName}
        </span>
        <span className="hud" lang="sa">
          {profile.tagline_sa}
        </span>
      </footer>
    </>
  );
}
