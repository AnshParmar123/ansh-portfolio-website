import "./styles/Work.css";
import WorkImage from "./WorkImage";

const projects = [
  {
    name: "LipSync AI",
    category: "Computer Vision",
    tagline: "AI-powered system for speech recognition using lip movements",
    tech: "Python, OpenCV, NumPy",
    description:
      "Developed a computer vision system that detects lip landmarks and predicts spoken words without audio input. The system processes real-time video frames, extracts spatial lip features, and converts them into meaningful text output. Integrated sentiment analysis and a frontend UI for better interaction.",
    image: "/images/project-lipsync.svg",
    features: [
      "Real-time lip landmark detection",
      "Speech prediction without audio",
      "Sentiment analysis integration",
      "Interactive UI",
    ],
  },
  {
    name: "Smart Attendance System",
    category: "Face Recognition",
    tagline: "Automated attendance using face recognition",
    tech: "Python, OpenCV, Face Recognition, Flask, SMTP",
    description:
      "Built a full-stack attendance system with role-based access for admin, teachers, and students. Uses facial recognition to eliminate proxy attendance and generates automated reports, CSV logs, and email notifications for attendance tracking.",
    image: "/images/project-attendance.svg",
    features: [
      "Face recognition-based attendance",
      "Automated email alerts",
      "CSV report generation",
      "Parent notification system",
    ],
  },
  {
    name: "CerebroChat",
    category: "AI Chatbot",
    tagline: "AI-powered study assistant and chatbot",
    tech: "Python, LLM API, FAISS, React, Firebase",
    description:
      "Created a personalized AI chatbot that processes academic materials and generates summaries, cheat sheets, and study plans. Tracks academic progress, assignments, and topics, and answers questions based on uploaded content.",
    image: "/images/project-cerebrochat.svg",
    features: [
      "Document-based Q&A",
      "Study planner integration",
      "Progress tracking",
      "Smart summaries",
    ],
  },
  {
    name: "InsightX",
    category: "Analytics",
    tagline: "Data-driven system for customer feedback analysis",
    tech: "Python, Pandas, Data Analysis",
    description:
      "Developed a system that analyzes customer feedback data to identify trends, product gaps, and improvement areas. Uses structured datasets and rating analysis to suggest actionable strategies for business growth.",
    image: "/images/project-insightx.svg",
    features: [
      "Feedback analysis using CSV data",
      "Product recommendation insights",
      "Location-based analysis",
      "Sales improvement suggestions",
    ],
    github: "https://github.com/AnshParmar123/insight-x",
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
                  <a
                    href={project.github ?? "https://github.com/AnshParmar123"}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                  >
                    GitHub
                  </a>
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
