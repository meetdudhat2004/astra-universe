import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function OrbitalSystem() {
  const coreRef = useRef();
  const ringOneRef = useRef();
  const ringTwoRef = useRef();
  const particleRef = useRef();

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.18;
      coreRef.current.rotation.x += delta * 0.08;
    }

    if (ringOneRef.current) {
      ringOneRef.current.rotation.z += delta * 0.12;
    }

    if (ringTwoRef.current) {
      ringTwoRef.current.rotation.x += delta * 0.16;
      ringTwoRef.current.rotation.y += delta * 0.08;
    }

    if (particleRef.current) {
      particleRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group>
      {/* Central celestial core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.85, 3]} />
        <meshStandardMaterial
          color="#397eae"
          emissive="#123d70"
          emissiveIntensity={1.8}
          roughness={0.3}
          metalness={0.55}
          wireframe
        />
      </mesh>

      {/* Inner glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial
          color="#6acfff"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Orbital ring one */}
      <mesh ref={ringOneRef} rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[1.35, 0.008, 8, 160]} />
        <meshBasicMaterial
          color="#63d7ff"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbital ring two */}
      <mesh ref={ringTwoRef} rotation={[0.5, 1.1, 0.4]}>
        <torusGeometry args={[1.7, 0.006, 8, 160]} />
        <meshBasicMaterial
          color="#9b8aff"
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Orbiting particle */}
      <group ref={particleRef}>
        <mesh position={[1.35, 0, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color="#b6edff" />
        </mesh>

        <mesh position={[-1.7, 0, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#a99aff" />
        </mesh>
      </group>

      <pointLight position={[0, 0, 0]} intensity={3} color="#4ebdff" />
      <pointLight position={[2, 1, 2]} intensity={1.5} color="#8974ff" />
    </group>
  );
}

export default function AstronomyHeroVisual() {
  return (
    <div className="astronomy-hero-visual">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />

        <Stars
          radius={30}
          depth={20}
          count={700}
          factor={2}
          fade
          speed={0.4}
        />

        <OrbitalSystem />
      </Canvas>
    </div>
  );
}