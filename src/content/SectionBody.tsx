import { about, interests, links, profile } from "../data/profile";
import { projects } from "../data/projects";
import {
  academicYears,
  certifications,
  cgpa,
  education,
  experience,
  skills,
} from "../data/resume";
import type { SectionId, TimelineEntry } from "../data/types";

/**
 * The body of every section.
 *
 * Kept in one file so the page's structure is readable in a single pass, and so
 * content markup lives in exactly one place — the data in `src/data` is the
 * source of truth and this is its only renderer.
 */

function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <li key={entry.marker + entry.title}>
          <span className="mono timeline-when">{entry.marker}</span>
          <div>
            <h3 className="timeline-title">{entry.title}</h3>
            <p className="timeline-org">{entry.subtitle}</p>
            <p className="timeline-copy">{entry.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function SectionBody({ id }: { id: SectionId }) {
  switch (id) {
    /* ── work ──────────────────────────────────────────────────────── */
    case "work":
      return (
        <ol className="work">
          {projects.map((project, index) => (
            <li className="project" key={project.id}>
              <figure className="project-shot">
                <img
                  src={project.image}
                  alt={`${project.name} interface`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  width="960"
                  height="600"
                />
              </figure>

              <div className="project-body">
                <p className="mono project-meta">
                  <span className="project-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {project.category}
                </p>

                <h3 className="project-name">{project.name}</h3>
                <p className="project-tagline">{project.tagline}</p>
                <p className="project-copy">{project.description}</p>

                <ul className="project-features">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <Tags items={project.tech} />

                {project.github ? (
                  <a
                    className="link-arrow"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View source <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <p className="mono project-nolink">Repository private</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      );

    /* ── capability ────────────────────────────────────────────────── */
    case "capability":
      return (
        <div className="cols-2">
          {skills.map((group) => (
            <article className="card" key={group.name}>
              <h3 className="card-title">{group.name}</h3>
              <p className="card-copy">{group.focus}</p>
              <p className="mono card-label">
                {group.items.length} tools &amp; languages
              </p>
              <Tags items={group.items} />
            </article>
          ))}
        </div>
      );

    /* ── experience ────────────────────────────────────────────────── */
    case "experience":
      return <Timeline entries={experience} />;

    /* ── education ─────────────────────────────────────────────────── */
    case "education":
      return (
        <>
          <Timeline entries={education} />

          <div className="grades">
            <div className="grades-head">
              <p className="mono">Academic record</p>
              <p className="grades-cgpa">
                <strong>{cgpa}</strong> <span>/ 10 CGPA</span>
              </p>
              <p className="grades-note">
                Semester-wise SGPA across the integrated MBA-Tech programme,
                calculated from completed semesters.
              </p>
            </div>

            <div className="grades-grid">
              {academicYears.map((year) => (
                <div className="grades-year" key={year.year}>
                  <p className="mono">{year.year}</p>
                  {year.semesters.map((semester) => (
                    <div className="grades-row" key={semester.label}>
                      <span className="mono">{semester.label}</span>
                      <span
                        className={
                          semester.sgpa === "Upcoming"
                            ? "grades-value grades-pending"
                            : "grades-value"
                        }
                      >
                        {semester.sgpa}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="beyond">
            <p className="mono">Beyond academics</p>
            <div className="cols-2">
              {interests.map((interest) => (
                <div key={interest.name}>
                  <h3 className="card-title">{interest.name}</h3>
                  <Tags items={interest.items} />
                </div>
              ))}
            </div>
          </div>
        </>
      );

    /* ── credentials ───────────────────────────────────────────────── */
    case "credentials":
      return (
        <ol className="certs">
          {certifications.map((certificate) => (
            <li className="cert" key={certificate.title}>
              <div className="cert-main">
                <h3 className="cert-title">{certificate.title}</h3>
                <p className="cert-issuer">{certificate.issuer}</p>
              </div>
              <p className="mono cert-date">{certificate.date}</p>
              <a
                className="mono cert-view"
                href={certificate.image}
                target="_blank"
                rel="noreferrer"
              >
                View <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
      );

    /* ── about ─────────────────────────────────────────────────────── */
    case "about":
      return (
        <div className="about">
          <div className="about-copy">
            <p className="about-lead">{about.lead}</p>
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <dl className="facts">
            {about.points.map((point) => (
              <div key={point.key}>
                <dt className="mono">{point.key}</dt>
                <dd>{point.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );

    /* ── contact ───────────────────────────────────────────────────── */
    case "contact":
      return (
        <div className="contact">
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className="contact-note">{profile.availability}</p>
          <ul className="contact-links">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
