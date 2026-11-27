
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function NebulaBackground() {
  const texture = useTexture('/textures/nebula/nebula-background.jpeg');

  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      position={[-14, 1, -18]}
      scale={[0.42, 0.42, 1]}
      renderOrder={-1}
    >
      <planeGeometry args={[65, 36.6]} />

      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.38}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
