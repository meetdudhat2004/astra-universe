import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function StarMapScene() {
  const starsRef = useRef();
  const scanRef = useRef();
  const groupRef = useRef();

  const starData = useMemo(() => {
    const points = [];

    for (let i = 0; i < 420; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 3.2;

      points.push(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius
      );
    }

    return new Float32Array(points);
  }, []);

  const highlightedStars = [
    [-1.7, 0.5, 0.3],
    [-0.8, -0.4, -0.7],
    [0.3, 0.8, 0.2],
    [1.4, -0.2, -0.5],
    [2.1, 0.6, 0.7],
    [0.8, -0.8, 1.2],
    [-1.2, 0.9, 1.4],
  ];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.025;
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
    }

    if (scanRef.current) {
      scanRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.45) * 2.5;
    }
  });

  const linePositions = [
    highlightedStars[0], highlightedStars[1],
    highlightedStars[1], highlightedStars[2],
    highlightedStars[2], highlightedStars[3],
    highlightedStars[3], highlightedStars[4],
    highlightedStars[2], highlightedStars[5],
    highlightedStars[0], highlightedStars[6],
  ].flat();

  return (
    <group ref={groupRef}>
      {/* Background star distribution */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starData.length / 3}
            array={starData}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#8fcfff"
          size={0.025}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Connections between selected objects */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={new Float32Array(linePositions)}
            itemSize={3}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#4b9fce"
          transparent
          opacity={0.35}
        />
      </lineSegments>

      {/* Highlighted celestial objects */}
      {highlightedStars.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index === 3 ? 0.075 : 0.045, 16, 16]} />
          <meshBasicMaterial
            color={index === 3 ? '#d4aaff' : '#8de5ff'}
          />
        </mesh>
      ))}

      {/* Anomaly highlight */}
      <mesh position={highlightedStars[3]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshBasicMaterial
          color="#b78cff"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Moving scan indicator */}
      <mesh ref={scanRef} position={[0, 0, 0]}>
        <planeGeometry args={[0.015, 4]} />
        <meshBasicMaterial
          color="#65d9ff"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={1.5} color="#4ebdff" />
    </group>
  );
}

export default function DeepSpaceMap() {
  return (
    <div className="deep-space-map">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <StarMapScene />
      </Canvas>
    </div>
  );
}



