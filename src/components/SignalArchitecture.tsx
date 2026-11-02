import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SignalArchitecture = () => {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(
    () => [
      [-1.35, 0.82, 0.3], [-0.62, 1.18, -0.18], [0.18, 0.82, 0.22], [0.95, 1.2, -0.15],
      [-1.12, 0.12, -0.2], [-0.3, 0.28, 0.34], [0.5, 0.08, -0.22], [1.32, 0.32, 0.26],
      [-0.92, -0.72, 0.2], [0, -1.03, -0.24], [0.92, -0.72, 0.18],
    ] as [number, number, number][], []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.24, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.13, 0.035);
  });

  const segments = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [5, 9], [6, 9], [7, 10], [8, 9], [9, 10]];

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.55}>
      <group ref={group}>
        {segments.map(([a, b], index) => <Line key={index} points={[points[a], points[b]]} color={index % 3 === 0 ? "#d7ff3f" : "#7967ff"} lineWidth={1.15} transparent opacity={0.75} />)}
        {points.map((point, index) => (
          <mesh key={index} position={point}>
            <sphereGeometry args={[index === 5 ? 0.11 : 0.065, 24, 24]} />
            <meshStandardMaterial color={index % 3 === 0 ? "#d7ff3f" : "#f2f2ed"} emissive={index === 5 ? "#7967ff" : "#000000"} emissiveIntensity={index === 5 ? 1.5 : 0} metalness={0.55} roughness={0.22} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.32]}>
          <ringGeometry args={[1.25, 1.28, 96]} />
          <meshBasicMaterial color="#ff5ea8" transparent opacity={0.42} />
        </mesh>
      </group>
    </Float>
  );
};

export const SignalArchitectureCanvas = () => (
  <div className="showcase-canvas" aria-label="Interactive three-dimensional signal architecture">
    <Canvas camera={{ position: [0, 0, 4.8], fov: 38 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.85} />
      <pointLight position={[2.5, 2.5, 4]} color="#d7ff3f" intensity={12} distance={8} />
      <pointLight position={[-2, -2, 3]} color="#7967ff" intensity={11} distance={8} />
      <SignalArchitecture />
    </Canvas>
  </div>
);
