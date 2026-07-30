/**
 * Shared content types.
 *
 * Everything in `src/data` feeds BOTH the 3D detector world and the flat 2D
 * fallback. Neither renderer owns content, so the two can never drift.
 */

/**
 * Stable section ids.
 *
 * There is deliberately no separate "stack" section: the old TechStack widget
 * and WhatIDo both listed tools, so the tool lists live inside `capability`
 * rather than being printed twice.
 */
export type SectionId =
  | "about"
  | "capability"
  | "work"
  | "education"
  | "experience"
  | "credentials"
  | "contact";

export interface SectionMeta {
  id: SectionId;
  /** Short name used in the nav and the running index. */
  label: string;
  /** Full heading shown at the top of the section. */
  heading: string;
  /** One line of standfirst under the heading. */
  summary: string;
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
