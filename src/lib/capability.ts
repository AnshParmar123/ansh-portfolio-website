/**
 * Decides whether a visitor gets the 3D detector world or the flat 2D site, and
 * how hard the 3D path is allowed to push.
 *
 * The flat site is a first-class fallback, not a consolation prize: a recruiter
 * on a locked-down laptop must still get every word of the content. So the gate
 * errs toward flat whenever there is doubt.
 */

export type RenderMode = "detector" | "flat";
export type Tier = "high" | "medium" | "low";

const PREF_KEY = "ap:render-mode";

export interface Capability {
  mode: RenderMode;
  tier: Tier;
  /** Why we landed on this mode — surfaced in the mode toggle's tooltip. */
  reason: string;
  /** True when the visitor chose the mode themselves. */
  explicit: boolean;
}

/** A stored choice always wins over detection. */
export function readPreference(): RenderMode | null {
  try {
    const stored = localStorage.getItem(PREF_KEY);
    return stored === "detector" || stored === "flat" ? stored : null;
  } catch {
    return null;
  }
}

export function writePreference(mode: RenderMode): void {
  try {
    localStorage.setItem(PREF_KEY, mode);
  } catch {
    /* private browsing — the choice just won't persist */
  }
}

/**
 * Probes for a real WebGL2 context. `failIfMajorPerformanceCaveat` is the
 * The detector uses a 2D canvas, not WebGL, so this is all the capability that
 * actually needs probing. (An earlier version gated on WebGL2 — wrong test for
 * this renderer, and it would have sent capable machines to the flat site.)
 */
function hasCanvas2D(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return !!document.createElement("canvas").getContext("2d");
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isHandheld(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900
  );
}

function estimateTier(): Tier {
  if (typeof navigator === "undefined") return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory is non-standard and absent on Safari/Firefox; absence is not
  // evidence of a weak device, so it only ever downgrades when present.
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;

  if (coarse || narrow) return "low";
  if (cores <= 4 || (memory !== undefined && memory <= 4)) return "medium";
  if (cores >= 8) return "high";
  return "medium";
}

export function detectCapability(): Capability {
  const preference = readPreference();
  const tier = estimateTier();

  if (!hasCanvas2D()) {
    return {
      mode: "flat",
      tier: "low",
      reason: "This browser cannot draw to a canvas.",
      explicit: false,
    };
  }

  if (preference) {
    return {
      mode: preference,
      tier,
      reason: "You chose this view.",
      explicit: true,
    };
  }

  if (prefersReducedMotion()) {
    return {
      mode: "flat",
      tier,
      reason: "Your system asks for reduced motion.",
      explicit: false,
    };
  }

  // Phones and tablets default to the flat site. The slabs are sized for a
  // landscape viewport, and a recruiter reading on a phone wants the content,
  // not a flythrough. They can still opt in from the toggle.
  if (isHandheld()) {
    return {
      mode: "flat",
      tier: "low",
      reason: "The 3D view is built for a larger screen.",
      explicit: false,
    };
  }

  return {
    mode: "detector",
    tier,
    reason: "Your device can handle the 3D view.",
    explicit: false,
  };
}

/**
 * Render settings per tier. `points` is the atmosphere mote count — the main
 * per-frame cost, since each one is an arc() fill.
 */
export const tierSettings: Record<
  Tier,
  { dpr: [number, number]; points: number; grid: boolean; blur: boolean }
> = {
  // `blur` is the depth-of-field on unacquired slabs. It is a filter on a large
  // DOM subtree, so it is the first thing dropped on weaker hardware.
  high: { dpr: [1, 2], points: 900, grid: true, blur: true },
  medium: { dpr: [1, 1.5], points: 480, grid: true, blur: false },
  low: { dpr: [1, 1], points: 220, grid: false, blur: false },
};
