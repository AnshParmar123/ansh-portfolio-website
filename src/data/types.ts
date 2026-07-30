/**
 * Shared content types.
 *
 * Everything in `src/data` feeds BOTH the 3D detector world and the flat 2D
 * fallback. Neither renderer owns content, so the two can never drift.
 */

/**
 * Stable ids for every detectable region of the site.
 *
 * There is deliberately no separate "stack" section: the old TechStack widget
 * and WhatIDo both listed tools, so the tool lists now live inside `capability`
 * rather than being printed twice.
 */
export type SectionId =
  | "identity"
  | "about"
  | "capability"
  | "work"
  | "education"
  | "experience"
  | "credentials"
  | "contact";

/**
 * A detection target. `label` is what the HUD prints as the class name, and
 * `confidence` is a fixed per-section value — it is styling, not a real score,
 * so it stays deterministic across reloads rather than looking like noise.
 */
export interface SectionMeta {
  id: SectionId;
  /** HUD class label, e.g. "WORK". Kept short — it renders inside the box. */
  label: string;
  /** Human heading used by the flat renderer. */
  heading: string;
  /** One line describing the section, printed under the label on acquire. */
  summary: string;
  confidence: number;
  /** Position along the camera's forward path, in world units. */
  depth: number;
  /** Lateral/vertical offset so targets do not stack in a single column. */
  offset: [x: number, y: number];
}

export interface Project {
  id: string;
  name: string;
  category: string;
  tagline: string;
  tech: string[];
  description: string;
  features: string[];
  image: string;
  github?: string;
  demo?: string;
  /** Which procedural point-cloud form represents this project in 3D. */
  form: "landmarks" | "face" | "graph" | "scatter";
}

export interface TimelineEntry {
  title: string;
  subtitle: string;
  marker: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  meta: string;
  image: string;
}

export interface SkillGroup {
  name: string;
  focus: string;
  items: string[];
}

export interface AcademicYear {
  year: string;
  semesters: { label: string; sgpa: string }[];
}

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}
