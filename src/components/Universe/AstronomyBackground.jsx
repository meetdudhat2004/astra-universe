
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import ShootingStars from './ShootingStars';
import StarField from './StarField';
import GlowingStars from './GlowingStars';
import ParallaxLayer from './ParallaxLayer';

export default function AstronomyBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#02040b']} />

      <ambientLight intensity={1.5} />

      <ParallaxLayer factor={0.12}>
        <StarField count={6000} />
      </ParallaxLayer>

      <ParallaxLayer factor={0.3}>
        <ShootingStars />
        <GlowingStars />
      </ParallaxLayer>

      <Stars
        radius={100}
        depth={50}
        count={1200}
        factor={3}
        saturation={0.2}
        fade
        speed={0.25}
      />
    </Canvas>
  );
}
