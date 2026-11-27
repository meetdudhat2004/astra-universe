
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function createGalaxy() {
  const count = 18000;
  const arms = 4;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const colorCore = new THREE.Color('#ffd9a0');
  const colorBlue = new THREE.Color('#719bff');
  const colorViolet = new THREE.Color('#b58aff');

  for (let i = 0; i < count; i++) {
    const radius = Math.pow(Math.random(), 0.65) * 2.3;
    const arm = i % arms;

    const angle =
      (arm / arms) * Math.PI * 2 +
      radius * 2.8 +
      (Math.random() - 0.5) * 0.55;

    const spread = (Math.random() - 0.5) * 0.18;
    const x = Math.cos(angle) * radius + spread;
    const y = Math.sin(angle) * radius + spread;
    const z = (Math.random() - 0.5) * 0.22 * (1 - radius / 2.3);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const color = new THREE.Color();

    if (radius < 0.65) {
      color.copy(colorCore);
    } else if (arm % 2 === 0) {
      color.copy(colorBlue);
    } else {
      color.copy(colorViolet);
    }

    const brightness = 0.55 + Math.random() * 0.65;

    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
  );

  return geometry;
}
function SolarGlow() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );

    gradient.addColorStop(0, 'rgba(255,255,245,1)');
    gradient.addColorStop(0.08, 'rgba(255,235,180,0.95)');
    gradient.addColorStop(0.22, 'rgba(255,190,105,0.65)');
    gradient.addColorStop(0.45, 'rgba(255,145,65,0.22)');
    gradient.addColorStop(1, 'rgba(255,130,50,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const generatedTexture = new THREE.CanvasTexture(canvas);
    generatedTexture.colorSpace = THREE.SRGBColorSpace;

    return generatedTexture;
  }, []);

  return (
    <sprite scale={[1.5, 1.5, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}
function GalaxyParticles() {
  const groupRef = useRef();

  const geometry = useMemo(() => createGalaxy(), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.025;
      groupRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.65, 0, 0.25]}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

<SolarGlow />

      <pointLight
        color="#ffcc99"
        intensity={4}
        distance={4}
      />
    </group>
  );
}

export default function GalaxyHeroVisual() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <GalaxyParticles />
        <OrbitControls
  enablePan={false}
  enableZoom={false}
  enableDamping
  dampingFactor={0.06}
  rotateSpeed={0.5}
  autoRotate
  autoRotateSpeed={0.15}
/>
      </Canvas>
    </div>
  );
}
