import "./styles/Certifications.css";

const certificates = [
  {
    title: "Google Cloud Career Launchpad Generative AI Leader Track",
    issuer: "Google Cloud",
    date: "March 17, 2026",
    meta: "Certificate ID: nNKXrrOk",
    image: "/certifications/google-cloud-generative-ai-leader.png",
  },
  {
    title: "Investment Banking Course",
    issuer: "MyCaptain",
    date: "November 2025",
    meta: "Certificate ID: 109N4G8ML3TJJ",
    image: "/certifications/investment-banking-mycaptain.png",
  },
  {
    title: "Ethical Hacking Course",
    issuer: "MyCaptain",
    date: "July 2025",
    meta: "Certificate ID: 15TLEVK43EB6N",
    image: "/certifications/ethical-hacking-mycaptain.png",
  },
  {
    title: "Software Engineering Job Simulation",
    issuer: "Accenture x Forage",
    date: "July 21, 2025",
    meta: "Certificate of Completion",
    image: "/certifications/accenture-software-engineering-forage.png",
  },
  {
    title: "FC101x: Corporate Finance",
    issuer: "IIM Bangalore x edX",
    date: "July 18, 2025",
    meta: "Verified Certificate",
    image: "/certifications/iimb-corporate-finance-edx.png",
  },
  {
    title: "Building LLM Applications With Prompt Engineering",
    issuer: "NVIDIA",
    date: "July 13, 2025",
    meta: "Certificate of Competency",
    image: "/certifications/nvidia-llm-prompt-engineering.png",
  },
  {
    title: "AI Agents and Agentic AI with Python & Generative AI",
    issuer: "Vanderbilt University x Coursera",
    date: "July 8, 2025",
    meta: "Course Certificate",
    image: "/certifications/vanderbilt-ai-agents-coursera.png",
  },
  {
    title: "Android App Development Course",
    issuer: "MyCaptain",
    date: "June 2025",
    meta: "Certificate ID: 2CLL1DJ5P9AO0",
    image: "/certifications/android-app-development-mycaptain.png",
  },
  {
    title: "Generative AI Course",
    issuer: "MyCaptain",
    date: "May 2025",
    meta: "Certificate ID: 1DXCK4MWD7J5L",
    image: "/certifications/generative-ai-mycaptain.png",
  },
];

const Certifications = () => {
  return (
    <section className="certifications-section section-container" id="certifications">
      <div className="certifications-header">
        <h2>
          Certifications <span>&</span> Credentials
        </h2>
        <p>
          A selection of certifications across AI, machine learning, cloud,
          software engineering, finance, and practical technology learning.
        </p>
      </div>
      <div className="certifications-grid">
        {certificates.map((certificate) => (
          <article className="certificate-card" key={certificate.title}>
            <a
              href={certificate.image}
              target="_blank"
              rel="noreferrer"
              className="certificate-image-link"
              data-cursor="disable"
            >
              <img
                src={certificate.image}
                alt={certificate.title}
                loading="lazy"
                decoding="async"
              />
            </a>
            <div className="certificate-info">
              <p className="certificate-issuer">{certificate.issuer}</p>
              <h3>{certificate.title}</h3>
              <p className="certificate-date">{certificate.date}</p>
              <p className="certificate-meta">{certificate.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
