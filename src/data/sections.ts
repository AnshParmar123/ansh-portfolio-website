import type { SectionId, SectionMeta } from "./types";

/**
 * Section order and labelling.
 *
 * Work comes first, immediately after the masthead. A portfolio is read by
 * someone deciding whether to keep reading, and the projects are the strongest
 * evidence — biography before evidence wastes the only attention on offer.
 * About sits late as context rather than as an opener.
 */
export const sections: SectionMeta[] = [
  {
    id: "work",
    label: "Work",
    heading: "Selected work",
    summary:
      "Four systems built around quantitative research, computer vision, and analysis.",
  },
  {
    id: "capability",
    label: "Capabilities",
    heading: "What I do",
    summary: "Two focus areas, and the tools behind each.",
  },
  {
    id: "experience",
    label: "Experience",
    heading: "Experience",
    summary: "Applied data analytics work.",
  },
  {
    id: "education",
    label: "Education",
    heading: "Education",
    summary:
      "Integrated MBA-Tech (AIML) at RAIT, DY Patil University.",
  },
  {
    id: "credentials",
    label: "Certifications",
    heading: "Certifications",
    summary:
      "Nine credentials across AI, cloud, engineering, and finance.",
  },
  {
    id: "about",
    label: "About",
    heading: "About",
    summary: "Background, focus, and what I am working toward.",
  },
  {
    id: "contact",
    label: "Contact",
    heading: "Get in touch",
    summary: "Open to internships and AI/ML roles.",
  },
];

export const sectionById = new Map<SectionId, SectionMeta>(
  sections.map((section) => [section.id, section])
);
