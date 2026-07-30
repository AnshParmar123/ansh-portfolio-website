import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import FlatSite from "./flat/FlatSite";
import {
  detectCapability,
  writePreference,
  type Capability,
  type RenderMode,
} from "./lib/capability";
import "./styles/tokens.css";

/**
 * Chooses between the 3D detector world and the flat 2D site.
 *
 * The flat site is imported eagerly and the detector lazily, deliberately: the
 * fallback must be able to render even if the 3D chunk fails to load, and it is
 * much the smaller of the two.
 */
const DetectorWorld = lazy(() => import("./detector/DetectorWorld"));

export default function App() {
  // `null` until the first effect runs — capability probing touches WebGL and
  // matchMedia, so it must not happen during render.
  const [capability, setCapability] = useState<Capability | null>(null);

  useEffect(() => {
    setCapability(detectCapability());
  }, []);

  const switchMode = useCallback((mode: RenderMode) => {
    writePreference(mode);
    setCapability((current) =>
      current
        ? { ...current, mode, reason: "You chose this view.", explicit: true }
        : current
    );
    // Leaving the detector must not land the flat site nine screens down.
    document.body.style.overflow = "";
    window.scrollTo({ top: 0 });
  }, []);

  if (!capability) {
    // Paint the flat shell rather than a spinner — if anything below fails, the
    // visitor is already looking at real content.
    return <FlatSite detectorAvailable={false} />;
  }

  if (capability.mode === "flat") {
    return (
      <FlatSite
        detectorAvailable
        onSwitchToDetector={() => switchMode("detector")}
      />
    );
  }

  return (
    <Suspense fallback={<p className="hud boot-note">Initialising detector…</p>}>
      <DetectorWorld
        tier={capability.tier}
        onSwitchToFlat={() => switchMode("flat")}
      />
    </Suspense>
  );
}
