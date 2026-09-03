import type { Project } from "./types";

/**
 * `form` picks the procedural point-cloud that stands in for the project in the
 * 3D world. Each one is generated in `detector/forms.ts` — no image assets.
 */
export const projects: Project[] = [
  {
    id: "cascadesignal",
    name: "CascadeSignal",
    category: "Quantitative Research",
    tagline: "Early-warning signal for DeFi liquidation cascades",
    tech: ["Python", "Hawkes Point Processes", "On-Chain Data", "Pandas"],
    description:
      "Modeled a lending protocol's on-chain liquidation stream (73,000+ events across Aave v2/v3) as a self-exciting Hawkes point process, deriving a USD-marked branching-ratio signal as a real-time early-warning indicator for DeFi liquidation cascades, as part of a 3-person research team. Caught 100% of major cascades (98/98 Aave v2, 45/45 Aave v3 episodes) under pre-registered, walk-forward evaluation, holding false alarms to 0.14–0.18/week out-of-sample and warning ahead of 81% of eventually-liquidated USD on Aave v2 ($3.34B of $4.11B); co-authoring the results for a peer-reviewed journal.",
    features: [
      "Self-exciting Hawkes point process model",
      "Real-time branching-ratio early-warning signal",
      "100% major-cascade detection, walk-forward validated",
      "0.14–0.18 false alarms per week out-of-sample",
    ],
    image: "/images/project-cascadesignal.svg",
    form: "scatter",
  },
  {
    id: "lipsync",
    name: "LipSync AI",
    category: "Computer Vision",
    tagline: "Real-time lip-reading pipeline with facial emotion analysis",
    tech: ["Python", "PyTorch", "MediaPipe", "Django REST Framework"],
    description:
      "Built a real-time lip-reading pipeline that extracts and normalizes MediaPipe FaceMesh landmarks and classifies word and phrase sequences with a bidirectional GRU — stratified splits, augmentation, gradient clipping, and temperature-scaled calibration. Served via a Django REST Framework backend with JWT auth, a session-based prediction API, and per-session feature caching, alongside real-time facial emotion analysis and a Vue/Nuxt frontend.",
    features: [
      "Real-time FaceMesh landmark extraction",
      "Bidirectional GRU word/phrase classification",
      "Real-time facial emotion analysis",
      "JWT-authenticated prediction API",
    ],
    image: "/images/project-lipsync.svg",
    form: "landmarks",
  },
  {
    id: "insightx",
    name: "InsightX",
    category: "AI Analytics",
    tagline: "LLM-powered complaint intelligence dashboard",
    tech: ["Python", "Streamlit", "LangChain", "Llama 3"],
    description:
      "Built an LLM-powered pipeline using LangChain over a local Llama 3 endpoint that ingests customer complaint text and surfaces the most-affected product categories, locations, and sentiment trends through an interactive Streamlit dashboard with one-click report export.",
    features: [
      "LangChain pipeline over a local Llama 3 endpoint",
      "Product, location, and sentiment trend surfacing",
      "Interactive Streamlit dashboard",
      "One-click report export",
    ],
    image: "/images/project-insightx.svg",
    github: "https://github.com/AnshParmar123/insight-x",
    form: "scatter",
  },
  {
    id: "attendance",
    name: "Smart Attendance System",
    category: "Face Recognition",
    tagline: "Real-time, role-based face recognition attendance platform",
    tech: ["Python", "Tkinter", "face_recognition (dlib)", "OpenCV", "Pandas"],
    description:
      "Built a real-time, role-based (Admin/Faculty/Parent/Student) desktop attendance platform using live webcam face recognition and time-limited QR-code check-in, with automated weekly and monthly email and PDF/Excel reporting and an audit log.",
    features: [
      "Live webcam face recognition",
      "Time-limited QR-code check-in",
      "Automated weekly/monthly PDF and Excel reporting",
      "Full audit log",
    ],
    image: "/images/project-attendance.svg",
    form: "face",
  },
];
