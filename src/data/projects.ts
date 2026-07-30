import type { Project } from "./types";

/**
 * `form` picks the procedural point-cloud that stands in for the project in the
 * 3D world. Each one is generated in `detector/forms.ts` — no image assets.
 */
export const projects: Project[] = [
  {
    id: "lipsync",
    name: "LipSync AI",
    category: "Computer Vision",
    tagline: "AI-powered system for speech recognition using lip movements",
    tech: ["Python", "OpenCV", "NumPy"],
    description:
      "Developed a computer vision system that detects lip landmarks and predicts spoken words without audio input. The system processes real-time video frames, extracts spatial lip features, and converts them into meaningful text output. Integrated sentiment analysis and a frontend UI for better interaction.",
    features: [
      "Real-time lip landmark detection",
      "Speech prediction without audio",
      "Sentiment analysis integration",
      "Interactive UI",
    ],
    image: "/images/project-lipsync.svg",
    form: "landmarks",
  },
  {
    id: "attendance",
    name: "Smart Attendance System",
    category: "Face Recognition",
    tagline: "Automated attendance using face recognition",
    tech: ["Python", "OpenCV", "Face Recognition", "Flask", "SMTP"],
    description:
      "Built a full-stack attendance system with role-based access for admin, teachers, and students. Uses facial recognition to eliminate proxy attendance and generates automated reports, CSV logs, and email notifications for attendance tracking.",
    features: [
      "Face recognition-based attendance",
      "Automated email alerts",
      "CSV report generation",
      "Parent notification system",
    ],
    image: "/images/project-attendance.svg",
    form: "face",
  },
  {
    id: "cerebrochat",
    name: "CerebroChat",
    category: "AI Chatbot",
    tagline: "AI-powered study assistant and chatbot",
    tech: ["Python", "LLM API", "FAISS", "React", "Firebase"],
    description:
      "Created a personalized AI chatbot that processes academic materials and generates summaries, cheat sheets, and study plans. Tracks academic progress, assignments, and topics, and answers questions based on uploaded content.",
    features: [
      "Document-based Q&A",
      "Study planner integration",
      "Progress tracking",
      "Smart summaries",
    ],
    image: "/images/project-cerebrochat.svg",
    form: "graph",
  },
  {
    id: "insightx",
    name: "InsightX",
    category: "Analytics",
    tagline: "Data-driven system for customer feedback analysis",
    tech: ["Python", "Pandas", "Data Analysis"],
    description:
      "Developed a system that analyzes customer feedback data to identify trends, product gaps, and improvement areas. Uses structured datasets and rating analysis to suggest actionable strategies for business growth.",
    features: [
      "Feedback analysis using CSV data",
      "Product recommendation insights",
      "Location-based analysis",
      "Sales improvement suggestions",
    ],
    image: "/images/project-insightx.svg",
    github: "https://github.com/AnshParmar123/insight-x",
    form: "scatter",
  },
];
