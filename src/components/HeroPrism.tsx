import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normal;
    float ripple = sin(position.y * 3.0 + uTime * 0.85) * 0.075;
    ripple += sin(position.x * 4.2 - uTime * 0.62) * 0.045;
    vec3 transformed = position + normal * ripple;
    vPosition = transformed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    float wave = sin(vPosition.y * 2.5 + uTime * .55 + uPointer.x * 1.2) * .5 + .5;
    vec3 violet = vec3(0.47, 0.40, 1.0);
    vec3 pink = vec3(1.0, 0.36, 0.66);
    vec3 lime = vec3(0.84, 1.0, 0.25);
    vec3 color = mix(violet, pink, wave);
    color = mix(color, lime, fresnel * .72);
    gl_FragColor = vec4(color, 0.9);
  }
`;

const LiquidObject = () => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!material.current || !group.current) return;
    material.current.uniforms.uTime.value += Math.min(delta, 0.05);
    material.current.uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.35, 0.025);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.2, 0.025);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.28} floatIntensity={0.5}>
      <group ref={group}>
        <mesh rotation={[0.25, -0.45, 0]}>
          <icosahedronGeometry args={[1.65, 6]} />
          <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent uniforms={{ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() } }} />
        </mesh>
        <mesh scale={1.22} rotation={[0.2, 0.55, 0]}>
          <icosahedronGeometry args={[1.65, 3]} />
          <meshBasicMaterial color="#d7ff3f" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  );
};

/** Purposeful hero identity object: a responsive, shader-driven signal core. */
const HeroPrism = () => (
  <div className="hero-prism" aria-hidden="true">
    <Canvas dpr={[1, 1.35]} camera={{ position: [0, 0, 5.7], fov: 35 }} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}>
      <ambientLight intensity={0.8} />
      <LiquidObject />
    </Canvas>
  </div>
);

export default HeroPrism;
