import ShootingStars from './ShootingStars';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import StarField from './StarField';
import GlowingStars from './GlowingStars';
import ParallaxLayer from './ParallaxLayer';
import Mars from './Mars';
import ProjectConstellation from './ProjectConstellation';
import NebulaBackground from './NebulaBackground';


import { EffectComposer, Bloom } from '@react-three/postprocessing';



export default function SpaceScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#02040b']} />
      {/* Lighting for realistic 3D planets */}
      <ambientLight intensity={1.5} />

      <directionalLight
      position={[5, 5, 5]}
      intensity={3}
      color="#fff1df"
/>

      <pointLight
      position={[-4, 2, 1]}
      intensity={1.5}
      color="#8abfff"
/>
<NebulaBackground />

      <ParallaxLayer factor={0.12}>
      <StarField count={6000} />
      </ParallaxLayer>

      <ParallaxLayer factor={0.3}>
      <ShootingStars />
      <GlowingStars />
      </ParallaxLayer>
      <Mars />
      
{/* Orion — Astronomy AI project */}
      <ProjectConstellation
      type="orion"
      label="ASTRONOMY AI"
      position={[0.8, 0.6, -4]}
      scale={1.3}
      onSelect={() => {
  window.location.href = '/astronomy';
}}
      />

{/* Ursa Major — Unusual Galaxies project */}
      <ProjectConstellation
  type="ursaMajor"
  label="GALAXY DISCOVERY"
  position={[3.7, 0.6, -4]}
  scale={1.3}
  onSelect={() => {
  window.location.href = '/galaxies';
}}
      />


      

      

      <Stars
        radius={100}
        depth={50}
        count={1200}
        factor={3}
        saturation={0.2}
        fade
        speed={0.25}
      />

      
      <OrbitControls
        makeDefault
        target={[0, 0, -1]}
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        rotateSpeed={0.7}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.01}
        maxPolarAngle={Math.PI - 0.01}
      />

    
     
    </Canvas>
  );
}
