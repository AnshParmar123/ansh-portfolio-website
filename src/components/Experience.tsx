import "./styles/Career.css";
import "./styles/Experience.css";

const experienceItems = [
  {
    title: "Freelance AI Automation & Web Developer",
    subtitle: "Self-Employed · Remote",
    marker: "JUL '26 — PRESENT",
    description:
      "Designed and shipped a production marketing website for a creative agency using Astro, TypeScript, and CSS, implementing on-page SEO (dynamic sitemap, robots.txt, schema.org markup), an accessibility-first motion system, and a Playwright test suite covering forms, navigation, and responsive layout across 12 viewport widths. Automated the client's lead-intake and follow-up workflow with n8n, routing website form submissions to email and WhatsApp automatically.",
  },
  {
    title: "Data Analytics Intern",
    subtitle: "DY Patil University",
    marker: "MAY '26 — JUN '26",
    description:
      "Cleaned and engineered features across large, real-world datasets in Python (Pandas), building reusable scripts that turned raw data into concrete insights and summary reports for faculty stakeholders.",
  },
];

const Experience = () => {
  return (
    <div className="experience-section section-container" id="experience">
      <div className="experience-container">
        <h2>Experience</h2>
        <div className="career-info">
          <div className="career-timeline" aria-hidden="true">
            <div className="career-line"></div>
            <div className="career-dot"></div>
          </div>
          {experienceItems.map((item) => (
            <div className="career-info-box" key={item.marker}>
              <div className="career-info-left">
                <h4>{item.title}</h4>
                <h5>{item.subtitle}</h5>
              </div>
              <div className="career-info-center">
                <span>{item.marker}</span>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
