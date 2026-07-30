import type { Link } from "./types";

export const profile = {
  firstName: "ANSH",
  lastName: "PARMAR",
  role: "AIML Student",
  /** The two words the identity target alternates between. */
  alternates: ["AI Builder", "Developer"],
  tagline:
    "Building intelligent AI systems that solve real-world problems with precision and impact.",
  availability:
    "Open to internships, AI/ML roles, and collaborative product work.",
  highlights: ["Computer Vision", "AI Product Thinking", "Software Development"],
  email: "anshudayparmar@gmail.com",
  resume: "/documents/Ansh_Parmar_Resume.pdf",
  tagline_sa: "कृष्णं वन्दे जगद्गुरुम् °•👁U👁•° 🌸",
} as const;

export const about = {
  lead:
    "I am Ansh Parmar, an AIML student pursuing an Integrated MBA-Tech degree from RAIT, DY Patil University. I am passionate about building intelligent systems that combine machine learning with real-world applications.",
  body: [
    "My work focuses on computer vision, automation, and AI-driven problem solving, where I aim to create impactful and scalable solutions. I enjoy experimenting with new technologies and continuously improving my technical and analytical skills.",
    "I am currently exploring opportunities in AI, machine learning, and software development.",
  ],
  points: [
    {
      key: "Focus",
      value:
        "Computer vision, intelligent automation, and practical AI systems",
    },
    {
      key: "Strength",
      value: "Translating technical ideas into usable, real-world products",
    },
    {
      key: "Goal",
      value: "Build meaningful software that is intelligent, scalable, and useful",
    },
  ],
} as const;

export const links: Link[] = [
  { label: "GitHub", href: "https://github.com/AnshParmar123", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ansh-parmar/",
    external: true,
  },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "Resume", href: profile.resume, external: true },
];

export const interests = [
  {
    name: "Sports",
    items: [
      "Football (Most)",
      "Cricket",
      "Badminton",
      "Basketball",
      "Table Tennis",
    ],
  },
  { name: "Reading", items: ["Books", "Learning Through Reading"] },
];
