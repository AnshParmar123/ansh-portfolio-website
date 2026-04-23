import * as THREE from "three";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

const spheres = [...Array(18)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));
const sphereMaterialIndices = spheres.map(
  () => Math.floor(Math.random() * imageUrls.length)
);

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

function TechStackScene({
  isInteractive,
  materials,
  useAmbientOcclusion,
}: {
  isInteractive: boolean;
  materials: THREE.MeshPhysicalMaterial[];
  useAmbientOcclusion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={isInteractive ? "always" : "demand"}
      shadows
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={(state) => {
        state.gl.toneMappingExposure = 1.35;
        state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      }}
      className="tech-canvas"
    >
      <ambientLight intensity={0.95} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={1.75} />
      <Physics gravity={[0, 0, 0]} paused={!isInteractive}>
        <Pointer isActive={isInteractive} />
        {spheres.map((props, index) => (
          <SphereGeo
            key={index}
            {...props}
            material={materials[sphereMaterialIndices[index]]}
            isActive={isInteractive}
          />
        ))}
      </Physics>
      <Environment
        files="/models/char_enviorment.hdr"
        environmentIntensity={0.42}
        environmentRotation={[0, 4, 2]}
      />
      {useAmbientOcclusion && (
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={1.6} intensity={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

const MemoizedTechStackScene = memo(TechStackScene);

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [useAmbientOcclusion, setUseAmbientOcclusion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 1024px), (pointer: coarse), (prefers-reduced-motion: reduce)"
    );

    const updateVisualMode = () => {
      setUseAmbientOcclusion(!mediaQuery.matches);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInteractive(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.2, rootMargin: "10% 0px" }
    );

    updateVisualMode();
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    mediaQuery.addEventListener("change", updateVisualMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateVisualMode);
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2> My Techstack</h2>
      <MemoizedTechStackScene
        isInteractive={isInteractive}
        materials={materials}
        useAmbientOcclusion={useAmbientOcclusion}
      />
    </div>
  );
};

export default TechStack;
