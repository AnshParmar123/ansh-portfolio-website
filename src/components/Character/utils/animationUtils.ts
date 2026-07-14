import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames } from "../../../data/boneData";

const setAnimations = (gltf: GLTF) => {
  let character = gltf.scene;
  let mixer = new THREE.AnimationMixer(character);
  // Only one clip ever drives the full body at a time (introAnimation).
  // Previously "typing" was also played simultaneously, and Three.js blends
  // overlapping clips rather than letting one win, which left the arms
  // stuck in a half-extended pose. Keeping a single full-body clip removes
  // that entire class of bug.
  const introClip = gltf.animations.find(
    (clip) => clip.name === "introAnimation"
  );
  if (introClip) {
    const introAction = mixer.clipAction(introClip);
    introAction.setLoop(THREE.LoopOnce, 1);
    introAction.clampWhenFinished = true;
    introAction.play();
    // Snap straight to the settled final pose instead of relying on real-time
    // playback to reach it. requestAnimationFrame (and therefore mixer.update)
    // is throttled or fully paused by the browser whenever the tab isn't
    // visible/focused, which can freeze this clip mid-gesture indefinitely
    // (e.g. someone switches tabs while the page is loading). Forcing the
    // pose deterministically here means it is always correct on first paint,
    // independent of how many animation frames actually ran.
    introAction.time = introClip.duration;
    mixer.update(0);
    const clipNames = ["key1", "key2", "key5", "key6"];
    clipNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(gltf.animations, name);
      if (clip) {
        const action = mixer?.clipAction(clip);
        action!.play();
        action!.timeScale = 1.2;
      } else {
        console.error(`Animation "${name}" not found`);
      }
    });
  }
  function startIntro() {
    const introAction = mixer.clipAction(introClip!);
    introAction.clampWhenFinished = true;
    introAction.reset().play();
    // Guarantee the settled pose even if requestAnimationFrame gets
    // throttled/paused mid-clip (backgrounded tab, low-power mode, etc.) and
    // never accumulates enough real time on its own to finish naturally.
    setTimeout(() => {
      introAction.time = introClip!.duration;
      mixer.update(0);
    }, introClip!.duration * 1000 + 300);
    setTimeout(() => {
      const blink = gltf.animations.find((clip) => clip.name === "Blink");
      mixer.clipAction(blink!).play().fadeIn(0.5);
    }, 2500);
  }
  function hover(gltf: GLTF, hoverDiv: HTMLDivElement) {
    let eyeBrowUpAction = createBoneAction(
      gltf,
      mixer,
      "browup",
      eyebrowBoneNames
    );
    let isHovering = false;
    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(4);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.6);
      }
    };
    if (!hoverDiv) return;
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }
  return { mixer, startIntro, hover };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  const AnimationClip = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!AnimationClip) {
    console.error(`Animation "${clip}" not found in GLTF file.`);
    return null;
  }

  const filteredClip = filterAnimationTracks(AnimationClip, boneNames);

  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );

  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;
