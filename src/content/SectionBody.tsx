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
import "../flat/flat.css";

/**
 * The body markup for every section, in one place.
 *
 * Both renderers mount this exact component — the flat site inside its panels,
 * the detector inside its opened-target overlay. That is the whole point: there
 * is no second copy of the content markup to fall out of sync.
 */

export function DataRows({ rows }: { rows: readonly { key: string; value: string }[] }) {
  return (
    <dl className="rows">
      {rows.map((row) => (
        <div className="row" key={row.key}>
          <dt className="hud">{row.key}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TagList({ items }: { items: readonly string[] }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <li key={entry.marker + entry.title}>
          <span className="hud timeline-marker">{entry.marker}</span>
          <div className="timeline-body">
            <h3>{entry.title}</h3>
            <p className="timeline-sub hud">{entry.subtitle}</p>
            <p>{entry.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The identity/masthead body. Split out because the hero owns its own layout. */
export function IdentityBody() {
  return (
    <>
      <h1 className="masthead-name">
        {profile.firstName}
        <br />
        <span>{profile.lastName}</span>
      </h1>
      <p className="masthead-lead">{profile.tagline}</p>
      <ul className="masthead-highlights">
        {profile.highlights.map((item) => (
          <li className="hud" key={item}>
            {item}
          </li>
        ))}
      </ul>
      <p className="masthead-availability">{profile.availability}</p>
      <div className="actions">
        <a className="btn btn-primary" href="#work">
          View work
        </a>
        <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">
          Resume
        </a>
      </div>
    </>
  );
}

export default function SectionBody({ id }: { id: SectionId }) {
  switch (id) {
    case "identity":
      return <IdentityBody />;

    case "about":
      return (
        <>
          <p className="lead">{about.lead}</p>
          {about.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <DataRows rows={about.points} />
        </>
      );

    case "capability":
      return (
        <div className="grid-2">
          {skills.map((group) => (
            <article className="card" key={group.name}>
              <h3>{group.name}</h3>
              <p>{group.focus}</p>
              <span className="hud">Tools</span>
              <TagList items={group.items} />
            </article>
          ))}
        </div>
      );

    case "work":
      return (
        <div className="work-list">
          {projects.map((project) => (
            <article className="work-item" key={project.id}>
              <div className="work-media">
                <img
                  src={project.image}
                  alt={`${project.name} interface mockup`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="work-copy">
                <span className="hud hud-acquire">{project.category}</span>
                <h3>{project.name}</h3>
                <p className="work-tagline">{project.tagline}</p>
                <p>{project.description}</p>
                <ul className="features">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <TagList items={project.tech} />
                {project.github ? (
                  <a
                    className="btn btn-small"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source
                  </a>
                ) : (
                  <span className="hud work-nolink">
                    Repository not public yet
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      );

    case "education":
      return (
        <>
          <Timeline entries={education} />
          <div className="academics">
            <div className="academics-head">
              <span className="hud">Academic performance</span>
              <h3>Current CGPA {cgpa} / 10</h3>
              <p>
                Semester-wise SGPA across the integrated MBA-Tech journey so
                far, with current performance calculated from completed
                semesters.
              </p>
            </div>
            <div className="academics-grid">
              {academicYears.map((year) => (
                <div className="academics-card" key={year.year}>
                  <h4 className="hud">{year.year}</h4>
                  {year.semesters.map((semester) => (
                    <div className="sem" key={semester.label}>
                      <span className="hud">{semester.label}</span>
                      <strong>{semester.sgpa}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="interests">
            <span className="hud">Beyond academics</span>
            <div className="grid-2">
              {interests.map((interest) => (
                <div className="card" key={interest.name}>
                  <h4>{interest.name}</h4>
                  <TagList items={interest.items} />
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "experience":
      return <Timeline entries={experience} />;

    case "credentials":
      return (
        <ul className="cert-grid">
          {certifications.map((certificate) => (
            <li className="cert" key={certificate.title}>
              <a href={certificate.image} target="_blank" rel="noreferrer">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <span className="hud">{certificate.issuer}</span>
              <h3>{certificate.title}</h3>
              <p className="hud cert-meta">
                {certificate.date} · {certificate.meta}
              </p>
            </li>
          ))}
        </ul>
      );

    case "contact":
      return (
        <div className="contact-grid">
          <div>
            <span className="hud">Email</span>
            <p className="contact-email">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>{profile.availability}</p>
          </div>
          <div>
            <span className="hud">Elsewhere</span>
            <ul className="contact-links">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
}
