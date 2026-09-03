import type { AcademicYear, Certification, SkillGroup, TimelineEntry } from "./types";

export const education: TimelineEntry[] = [
  {
    title: "Bachelor of Technology, Computer Science & Engineering",
    subtitle: "RAIT, DY Patil University",
    marker: "NOW",
    description:
      "Pursuing a Computer Science & Engineering degree, focused on applied machine learning and building real-world AI systems.",
  },
  {
    title: "AI/ML Project Builder",
    subtitle: "Computer Vision and Automation",
    marker: "FOCUS",
    description:
      "Building systems around face recognition, lip movement analysis, feedback intelligence, and academic assistants with scalable, real-world use cases.",
  },
  {
    title: "Open to Opportunities",
    subtitle: "AI, ML and Software Development",
    marker: "NEXT",
    description:
      "Exploring internships and collaborative roles where I can keep learning, ship meaningful products, and contribute to intelligent software systems.",
  },
];

export const cgpa = "8.62";

export const academicYears: AcademicYear[] = [
  {
    year: "Year 1",
    semesters: [
      { label: "Sem 1", sgpa: "8.50" },
      { label: "Sem 2", sgpa: "8.31" },
      { label: "Sem 3", sgpa: "8.69" },
    ],
  },
  {
    year: "Year 2",
    semesters: [
      { label: "Sem 4", sgpa: "7.88" },
      { label: "Sem 5", sgpa: "8.36" },
      { label: "Sem 6", sgpa: "8.50" },
    ],
  },
  {
    year: "Year 3",
    semesters: [
      { label: "Sem 7", sgpa: "9.25" },
      { label: "Sem 8", sgpa: "8.73" },
      { label: "Sem 9", sgpa: "9.43" },
    ],
  },
  {
    year: "Year 4",
    semesters: [
      { label: "Sem 10", sgpa: "Upcoming" },
      { label: "Sem 11", sgpa: "Upcoming" },
      { label: "Sem 12", sgpa: "Upcoming" },
    ],
  },
  {
    year: "Year 5",
    semesters: [
      { label: "Sem 13", sgpa: "Upcoming" },
      { label: "Sem 14", sgpa: "Upcoming" },
      { label: "Sem 15", sgpa: "Upcoming" },
    ],
  },
];

export const experience: TimelineEntry[] = [
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

/**
 * The real stack, taken from the old WhatIDo section. The deleted TechStack
 * widget advertised React/Next/Node/Express/Mongo/MySQL instead, which was
 * never accurate.
 */
export const skills: SkillGroup[] = [
  {
    name: "Software Development",
    focus:
      "I build practical software systems with a strong foundation in programming, frontend development, and scalable application logic for real-world use cases.",
    items: [
      "C",
      "C++",
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "SQL",
      "HTML",
      "CSS",
      "React.js",
      "Node.js",
      "Astro",
      "Flask",
      "Tailwind CSS",
    ],
  },
  {
    name: "AI & Machine Learning",
    focus:
      "My work focuses on AI-driven problem solving across computer vision, intelligent automation, analytics, and applied machine learning systems with practical implementation.",
    items: [
      "OpenCV",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "XGBoost",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "Git",
      "GitHub",
      "VS Code",
      "Jupyter",
      "Streamlit",
      "Playwright",
      "pytest",
      "n8n",
      "Firebase",
      "Vercel",
      "Netlify",
    ],
  },
];

export const certifications: Certification[] = [
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
