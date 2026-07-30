import { useCallback, useState } from "react";
import SectionBody from "../content/SectionBody";
import { links, profile } from "../data/profile";
import { projects } from "../data/projects";
import { academicYears, cgpa } from "../data/resume";
import { sections } from "../data/sections";
import { useReveal } from "./useReveal";
import "./site.css";

/**
 * The site.
 *
 * One page, semantic HTML, no framework beyond React and no animation library.
 * Everything is judged on typography, rhythm and hierarchy, so the structure is
 * deliberately plain: a masthead, then numbered sections in the order a
 * recruiter actually reads them.
 */

/**
 * The four numbers worth leading with. Every one is derived from real data —
 * an earlier version hard-coded a graduation year that did not match the
 * semester record, which is exactly the kind of thing a recruiter checks.
 */
const bestSgpa = academicYears
  .flatMap((year) => year.semesters)
  .map((semester) => Number.parseFloat(semester.sgpa))
  .filter((value) => Number.isFinite(value))
  .reduce((best, value) => Math.max(best, value), 0)
  .toFixed(2);

const semestersDone = academicYears
  .flatMap((year) => year.semesters)
  .filter((semester) => Number.isFinite(Number.parseFloat(semester.sgpa))).length;

const semestersTotal = academicYears.flatMap((year) => year.semesters).length;

const facts = [
  { value: String(projects.length), label: "Systems built" },
  { value: cgpa, label: "CGPA / 10" },
  { value: bestSgpa, label: "Best semester" },
  { value: `${semestersDone}/${semestersTotal}`, label: "Semesters done" },
];

export default function Site() {
  const [active, setActive] = useState<string | null>(null);
  const handleActive = useCallback((id: string | null) => setActive(id), []);
  useReveal(handleActive);

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>

      <header className="topbar">
        <a className="topbar-name" href="#top">
          {profile.firstName} {profile.lastName}
        </a>
        <nav className="topbar-nav" aria-label="Sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="mono"
              aria-current={active === section.id ? "true" : undefined}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <a
          className="topbar-cta mono"
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
        >
          Résumé
        </a>
      </header>

      <main id="top">
        {/* ── masthead ─────────────────────────────────────────────── */}
        <section className="hero" aria-label="Introduction">
          <p className="hero-eyebrow mono">
            {profile.role} · Mumbai, India
          </p>

          <h1 className="hero-name">
            <span className="hero-line">{profile.firstName}</span>
            <span className="hero-line hero-line-2">{profile.lastName}</span>
          </h1>

          <div className="hero-foot">
            <p className="hero-lead">{profile.tagline}</p>

            <ul className="hero-facts">
              {facts.map((fact) => (
                <li key={fact.label}>
                  <span className="hero-fact-value">{fact.value}</span>
                  <span className="mono">{fact.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              See the work
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
            <p className="hero-availability mono">{profile.availability}</p>
          </div>
        </section>

        {/* ── sections ─────────────────────────────────────────────── */}
        {sections.map((section, index) => (
          <section className="section" id={section.id} key={section.id}>
            <div className="section-head" data-reveal>
              <span className="section-index mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="section-title">{section.heading}</h2>
                <p className="section-summary">{section.summary}</p>
              </div>
            </div>
            <div className="section-body" data-reveal>
              <SectionBody id={section.id} />
            </div>
          </section>
        ))}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-name">
            {profile.firstName} {profile.lastName}
          </p>
          <ul className="footer-links">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="mono"
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mono footer-meta">© 2026 · Built by Ansh Parmar</p>
          <p className="mono footer-tagline" lang="sa">
            {profile.tagline_sa}
          </p>
        </div>
      </footer>
    </>
  );
}
