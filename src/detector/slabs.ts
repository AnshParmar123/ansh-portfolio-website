import { about, profile } from "../data/profile";
import { projects } from "../data/projects";
import { certifications, cgpa, education, experience, skills } from "../data/resume";
import type { SectionId } from "../data/types";

/**
 * What each section shows *in the world*, before anything is opened.
 *
 * This is the fix for the previous version's core mistake: the world used to be
 * abstract point-clouds that said nothing, so a visitor who never clicked learned
 * nothing. Now every slab carries real facts — names, counts, grades — so the
 * flythrough alone communicates the portfolio, and opening a target is for depth
 * rather than for basic information.
 */

export interface SlabRow {
  key: string;
  value: string;
}

export interface Slab {
  /** Large type. The identity slab uses the name; others use the heading. */
  display: string;
  /** Optional second display line, set in the dimmer weight. */
  displaySub?: string;
  lead?: string;
  rows: SlabRow[];
  /** Width of the slab in world units — drives how big it frames up. */
  width: number;
}

const workRows: SlabRow[] = projects.map((project) => ({
  key: project.category,
  value: project.name,
}));

const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));

export const slabs: Record<SectionId, Slab> = {
  identity: {
    display: profile.firstName,
    displaySub: profile.lastName,
    lead: profile.tagline,
    rows: [
      { key: "Focus", value: "Computer vision" },
      { key: "Systems built", value: String(projects.length) },
      { key: "CGPA", value: `${cgpa} / 10` },
      { key: "Status", value: "Open to internships" },
    ],
    width: 9.5,
  },

  about: {
    display: "About",
    // Deliberately NOT points[0] — that value is already the first row below,
    // and printing it twice made the slab look like a rendering bug.
    lead: "AIML student at RAIT, DY Patil University, building systems that pair machine learning with real use cases.",
    rows: about.points.map((point) => ({ key: point.key, value: point.value })),
    width: 8.5,
  },

  capability: {
    display: "What I do",
    lead: "Two focus areas, and the tools behind each.",
    rows: skills.map((group) => ({
      key: group.name,
      value: `${group.items.length} tools`,
    })),
    width: 8,
  },

  work: {
    display: "Selected work",
    lead: "Four systems that look at data and report what they find.",
    rows: workRows,
    width: 9,
  },

  education: {
    display: "Education",
    displaySub: `CGPA ${cgpa}`,
    lead: education[0].subtitle,
    rows: [
      { key: "Degree", value: "Integrated MBA-Tech (AIML)" },
      { key: "Institution", value: "RAIT, DY Patil University" },
      { key: "Semesters done", value: "9 of 15" },
      { key: "Best semester", value: "9.43 SGPA" },
    ],
    width: 8.5,
  },

  experience: {
    display: "Experience",
    lead: experience[0].title,
    rows: [
      { key: "Role", value: experience[0].title },
      { key: "Organisation", value: experience[0].subtitle },
      { key: "When", value: experience[0].marker },
    ],
    width: 8,
  },

  credentials: {
    display: "Credentials",
    displaySub: String(certifications.length),
    lead: "Across AI, cloud, engineering, and finance.",
    rows: issuers.slice(0, 4).map((issuer) => ({
      key: issuer,
      value: String(certifications.filter((c) => c.issuer === issuer).length),
    })),
    width: 8,
  },

  contact: {
    display: "Contact",
    lead: profile.availability,
    rows: [
      { key: "Email", value: profile.email },
      { key: "GitHub", value: "AnshParmar123" },
      { key: "LinkedIn", value: "ansh-parmar" },
    ],
    width: 8.5,
  },
};
