import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { PATH_LENGTH, sections } from "../data/sections";
import type { SectionId } from "../data/types";
import { tierSettings, type Tier } from "../lib/capability";
import SectionOverlay from "./SectionOverlay";
import { Atmosphere } from "./atmosphere";
import { clamp, damp, focalLength, project, type Camera } from "./projection";
import { slabs } from "./slabs";
import "./detector.css";

/** How many screen-heights of scroll cover the whole path. */
const SCROLL_HEIGHTS = 9;
const CAM_START_Z = 10;
const FOV = (58 * Math.PI) / 180;

/**
 * Authoring width of a slab, in pixels, for the world width given in slabs.ts.
 * Chosen so a slab sits at roughly scale 1 when acquired, which means the type
 * inside can be authored at its natural size instead of being pre-compensated.
 */
const SLAB_BASE_PX = 900;

/**
 * World-unit distance at which a target starts appearing / becomes acquired.
 *
 * TRACK_RANGE is deliberately tight. With it set wide, the *next* slab sat at
 * low opacity directly behind the acquired one and its headline showed through
 * the live text, which read as a rendering fault rather than as depth.
 */
const TRACK_RANGE = 30;
const ACQUIRE_RANGE = 12;

/**
 * The 3D detector world.
 *
 * The world is made of type: every section is a DOM slab carrying real facts,
 * placed in space by a hand-rolled perspective projection. The canvas behind it
 * draws only atmosphere. Scroll is native (a tall spacer drives progress), so
 * trackpad, touch, keyboard and the scrollbar all work with no special handling.
 */
export default function DetectorWorld({
  tier,
  onSwitchToFlat,
}: {
  tier: Tier;
  onSwitchToFlat: () => void;
}) {
  const [acquired, setAcquired] = useState<SectionId | null>(null);
  const [open, setOpen] = useState<SectionId | null>(null);
  const settings = tierSettings[tier];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const slabRefs = useRef(new Map<SectionId, HTMLElement | null>());
  const rangeRef = useRef<HTMLSpanElement | null>(null);

  // Mutable per-frame state, deliberately outside React: the loop runs at
  // display rate and must not re-render the tree.
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const camera = useRef<Camera>({ x: 0, y: 0, z: CAM_START_Z, fov: FOV });
  const acquiredRef = useRef<SectionId | null>(null);

  // ── native scroll → progress ────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      progress.current =
        scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // ── pointer parallax ────────────────────────────────────────────────
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  // ── the render loop ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const atmosphere = new Atmosphere(canvas, settings.points);
    let frame = 0;
    let last = performance.now();
    let viewport = { width: window.innerWidth, height: window.innerHeight };

    const resize = () => {
      viewport = { width: window.innerWidth, height: window.innerHeight };
      atmosphere.resize(
        viewport.width,
        viewport.height,
        Math.min(window.devicePixelRatio || 1, settings.dpr[1])
      );
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      const cam = camera.current;

      cam.z = CAM_START_Z - progress.current * PATH_LENGTH;

      // Which target is nearest along the path?
      let nearest = sections[0];
      let nearestDistance = Infinity;
      for (const section of sections) {
        const distance = Math.abs(cam.z + section.depth);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = section;
        }
      }

      // Drift toward it so it frames up, with pointer parallax on top. The
      // slab stays slightly off-centre (0.72) so the composition isn't static.
      const aimX = nearest.offset[0] * 0.72 + pointer.current.x * 0.55;
      const aimY = nearest.offset[1] * 0.6 + pointer.current.y * 0.35;
      cam.x = damp(cam.x, aimX, 3.4, delta);
      cam.y = damp(cam.y, aimY, 3.4, delta);

      const time = now / 1000;
      atmosphere.draw(cam, viewport, time, settings.grid);

      // ── acquisition ─────────────────────────────────────────────────
      const nowAcquired =
        nearestDistance < ACQUIRE_RANGE ? nearest.id : null;
      if (nowAcquired !== acquiredRef.current) {
        acquiredRef.current = nowAcquired;
        setAcquired(nowAcquired);
      }
      if (rangeRef.current) {
        rangeRef.current.textContent = `${nearestDistance.toFixed(1)}m`;
      }

      // ── place the slabs ─────────────────────────────────────────────
      const focal = focalLength(cam, viewport);
      for (const section of sections) {
        const element = slabRefs.current.get(section.id);
        if (!element) continue;

        const point = project(
          section.offset[0],
          section.offset[1],
          -section.depth,
          cam,
          viewport,
          focal
        );

        // Hiding must also clear the acquired flag, or a slab that was locked
        // when it went out of range stays flagged while invisible.
        if (point.depth <= 1.2 || point.depth > TRACK_RANGE) {
          if (element.style.visibility !== "hidden") {
            element.style.visibility = "hidden";
            element.dataset.acquired = "false";
          }
          continue;
        }

        const slab = slabs[section.id];
        const scale = (point.scale * slab.width) / SLAB_BASE_PX;

        // Fade in from the far plane, and out again as it passes the camera.
        // The cube makes distant slabs drop away fast instead of lingering as
        // legible ghosts behind the acquired one.
        const linear = clamp(
          1 - (point.depth - ACQUIRE_RANGE) / (TRACK_RANGE - ACQUIRE_RANGE),
          0,
          1
        );
        const farFade = linear * linear * linear;
        const nearFade = clamp((point.depth - 1.2) / 3.5, 0, 1);
        const opacity = Math.min(farFade, nearFade);

        if (opacity < 0.01) {
          element.style.visibility = "hidden";
          element.dataset.acquired = "false";
          continue;
        }

        element.style.visibility = "visible";
        element.style.opacity = opacity.toFixed(3);
        element.style.transform = `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(4)})`;
        element.style.zIndex = String(1000 - Math.round(point.depth));
        // Defocus what the detector has not locked onto yet: turns the
        // remaining bleed-through into a focus pull instead of dirt.
        element.style.filter =
          settings.blur && linear < 0.92
            ? `blur(${((0.92 - linear) * 9).toFixed(2)}px)`
            : "none";
        element.dataset.acquired = section.id === nowAcquired ? "true" : "false";
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [settings.points, settings.grid, settings.dpr, settings.blur]);

  // ── lock scroll while a target is open ──────────────────────────────
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // ── Enter opens the acquired target ─────────────────────────────────
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || open || !acquired) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select")) return;
      event.preventDefault();
      setOpen(acquired);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [acquired, open]);

  const jumpTo = useCallback((id: SectionId) => {
    const section = sections.find((entry) => entry.id === id);
    if (!section) return;
    const scrollable = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: (section.depth / PATH_LENGTH) * scrollable,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <a className="skip-link" href="#detector-index">
        Skip to section list
      </a>

      <div className="feed" aria-hidden="true">
        <canvas ref={canvasRef} />
        {/* Feed grade in CSS: vignette, scanlines, grain. No extra GPU pass. */}
        <div className="feed-grade" />
        <div className="feed-scan" />
      </div>

      {/* ── the world: content slabs in perspective ──────────────────── */}
      <div className="stage">
        {sections.map((section) => {
          const slab = slabs[section.id];
          const isIdentity = section.id === "identity";
          return (
            <article
              key={section.id}
              className={`slab${isIdentity ? " slab-identity" : ""}`}
              ref={(element) => {
                slabRefs.current.set(section.id, element);
              }}
              data-acquired="false"
              onClick={() => setOpen(section.id)}
            >
              <div className="slab-frame" aria-hidden="true">
                <i className="sbr sbr-tl" />
                <i className="sbr sbr-tr" />
                <i className="sbr sbr-bl" />
                <i className="sbr sbr-br" />
              </div>

              <span className="slab-label">
                <b>{section.label}</b>
                <em>{section.confidence.toFixed(2)}</em>
              </span>

              <h2 className="slab-display">
                {slab.display}
                {slab.displaySub && <span>{slab.displaySub}</span>}
              </h2>

              {slab.lead && <p className="slab-lead">{slab.lead}</p>}

              <dl className="slab-rows">
                {slab.rows.map((row) => (
                  <div key={row.key + row.value}>
                    <dt>{row.key}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>

              <span className="slab-open">Open ↵</span>
            </article>
          );
        })}
      </div>

      {/* ── chrome ──────────────────────────────────────────────────── */}
      <header className="feed-head">
        <span className="hud feed-name">
          {profile.firstName} {profile.lastName}
        </span>
        <span className="hud feed-status">
          <span className="feed-dot" /> detector active
        </span>
        <span className="hud feed-range">
          range <span ref={rangeRef}>—</span>
        </span>
        <button type="button" className="hud mode-toggle" onClick={onSwitchToFlat}>
          Read as page
        </button>
      </header>

      {/* The keyboard/AT path into every section — never dependent on where the
          camera happens to be. */}
      <nav className="feed-index" id="detector-index" aria-label="Sections">
        <span className="hud feed-index-label">Detections</span>
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className="hud"
                data-acquired={section.id === acquired ? "true" : "false"}
                onClick={() => {
                  jumpTo(section.id);
                  setOpen(section.id);
                }}
              >
                <span className="feed-index-class">{section.label}</span>
                <span className="feed-index-conf">
                  {section.confidence.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {progress.current < 0.02 && (
        <p className="feed-hint hud" aria-hidden="true">
          scroll to advance
        </p>
      )}

      {/* Native scroll driver. */}
      <div
        className="scroll-spacer"
        style={{ height: `${SCROLL_HEIGHTS * 100}vh` }}
        aria-hidden="true"
      />

      {open && <SectionOverlay id={open} onClose={() => setOpen(null)} />}
    </>
  );
}
