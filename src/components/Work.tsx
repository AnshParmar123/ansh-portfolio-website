import "./styles/Work.css";
import WorkImage from "./WorkImage";

const projects = [
  {
    name: "CascadeSignal",
    category: "Quantitative Research",
    tagline: "Early-warning signal for DeFi liquidation cascades",
    tech: "Python, Hawkes Point Processes, On-Chain Data, Pandas",
    description:
      "Modeled a lending protocol's on-chain liquidation stream (73,000+ events across Aave v2/v3) as a self-exciting Hawkes point process, deriving a USD-marked branching-ratio signal as a real-time early-warning indicator for DeFi liquidation cascades, as part of a 3-person research team. Caught 100% of major cascades (98/98 Aave v2, 45/45 Aave v3 episodes) under pre-registered, walk-forward evaluation, holding false alarms to 0.14–0.18/week out-of-sample and warning ahead of 81% of eventually-liquidated USD on Aave v2 ($3.34B of $4.11B); co-authoring the results for a peer-reviewed journal.",
    image: "/images/project-cascadesignal.svg",
    features: [
      "Self-exciting Hawkes point process model",
      "Real-time branching-ratio early-warning signal",
      "100% major-cascade detection, walk-forward validated",
      "0.14–0.18 false alarms per week out-of-sample",
    ],
  },
  {
    name: "LipSync AI",
    category: "Computer Vision",
    tagline: "Real-time lip-reading pipeline with facial emotion analysis",
    tech: "Python, PyTorch, MediaPipe, Django REST Framework",
    description:
      "Built a real-time lip-reading pipeline that extracts and normalizes MediaPipe FaceMesh landmarks and classifies word and phrase sequences with a bidirectional GRU — stratified splits, augmentation, gradient clipping, and temperature-scaled calibration. Served via a Django REST Framework backend with JWT auth, a session-based prediction API, and per-session feature caching, alongside real-time facial emotion analysis and a Vue/Nuxt frontend.",
    image: "/images/project-lipsync.svg",
    features: [
      "Real-time FaceMesh landmark extraction",
      "Bidirectional GRU word/phrase classification",
      "Real-time facial emotion analysis",
      "JWT-authenticated prediction API",
    ],
  },
  {
    name: "InsightX",
    category: "AI Analytics",
    tagline: "LLM-powered complaint intelligence dashboard",
    tech: "Python, Streamlit, LangChain, Llama 3",
    description:
      "Built an LLM-powered pipeline using LangChain over a local Llama 3 endpoint that ingests customer complaint text and surfaces the most-affected product categories, locations, and sentiment trends through an interactive Streamlit dashboard with one-click report export.",
    image: "/images/project-insightx.svg",
    features: [
      "LangChain pipeline over a local Llama 3 endpoint",
      "Product, location, and sentiment trend surfacing",
      "Interactive Streamlit dashboard",
      "One-click report export",
    ],
    github: "https://github.com/AnshParmar123/insight-x",
  },
  {
    name: "Smart Attendance System",
    category: "Face Recognition",
    tagline: "Real-time, role-based face recognition attendance platform",
    tech: "Python, Tkinter, face_recognition (dlib), OpenCV, Pandas",
    description:
      "Built a real-time, role-based (Admin/Faculty/Parent/Student) desktop attendance platform using live webcam face recognition and time-limited QR-code check-in, with automated weekly and monthly email and PDF/Excel reporting and an audit log.",
    image: "/images/project-attendance.svg",
    features: [
      "Live webcam face recognition",
      "Time-limited QR-code check-in",
      "Automated weekly/monthly PDF and Excel reporting",
      "Full audit log",
    ],
  },
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project) => (
            <div className="work-box" key={project.name}>
              <WorkImage image={project.image} alt={project.name} />
              <div className="work-info">
                <div className="work-title">
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p className="work-tagline">{project.tagline}</p>
                <p className="work-description">{project.description}</p>
                <div className="work-stack">
                  <span>Tech Stack</span>
                  <p>{project.tech}</p>
                </div>
                <div className="work-features">
                  <span>Key Features</span>
                  <ul>
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="work-actions">
                  <a href="#contact" data-href="#contact">
                    View Details
                  </a>
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="disable"
                    >
                      GitHub
                    </a>
                  ) : (
                    <span className="work-action-disabled">Not Deployed Yet</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
