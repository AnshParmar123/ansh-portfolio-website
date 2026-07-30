import type { SectionId, SectionMeta } from "./types";

/**
 * The detection registry — the spine of both renderers.
 *
 * `depth` places each target along the camera's forward path (the camera flies
 * toward -Z, so depth grows as you scroll). Spacing is ~30 units, wide enough
 * that only one target is inside the acquisition radius at a time. `offset`
 * alternates left/right so the path reads as a corridor of findings rather than
 * a single column.
 *
 * The flat renderer ignores depth/offset entirely and just uses array order.
 */
export const sections: SectionMeta[] = [
  {
    id: "identity",
    label: "IDENTITY",
    heading: "Ansh Parmar",
    summary: "AIML student building computer-vision systems",
    confidence: 0.99,
    depth: 0,
    offset: [0, 0],
  },
  {
    id: "about",
    label: "ABOUT",
    heading: "About Me",
    summary: "Background, focus, and what I am aiming at",
    confidence: 0.94,
    depth: 30,
    offset: [-4.2, 0.6],
  },
  {
    id: "capability",
    label: "CAPABILITY",
    heading: "What I Do",
    summary: "Two focus areas and the tools behind them",
    confidence: 0.92,
    depth: 60,
    offset: [4.4, -0.4],
  },
  {
    id: "work",
    label: "WORK",
    heading: "Selected Work",
    summary: "Four systems that look at data and report findings",
    confidence: 0.97,
    depth: 92,
    offset: [-3.6, -0.8],
  },
  {
    id: "education",
    label: "EDUCATION",
    heading: "Education & Focus",
    summary: "Integrated MBA-Tech at RAIT, DY Patil University",
    confidence: 0.9,
    depth: 124,
    offset: [4.0, 1.0],
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    heading: "Experience",
    summary: "Intelligent data analytics internship",
    confidence: 0.88,
    depth: 152,
    offset: [-4.4, 0.2],
  },
  {
    id: "credentials",
    label: "CREDENTIALS",
    heading: "Certifications & Credentials",
    summary: "Nine certifications across AI, cloud, and engineering",
    confidence: 0.86,
    depth: 180,
    offset: [3.8, -0.6],
  },
  {
    id: "contact",
    label: "CONTACT",
    heading: "Contact",
    summary: "Open to internships and AI/ML roles",
    confidence: 0.95,
    depth: 210,
    offset: [0, 0],
  },
];

export const sectionById = new Map<SectionId, SectionMeta>(
  sections.map((section) => [section.id, section])
);

/** Total scrollable depth, plus room to fly past the last target. */
export const PATH_LENGTH = sections[sections.length - 1].depth + 24;
