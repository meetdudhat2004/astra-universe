
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Mars() {
  const marsRef = useRef();

  const { scene } = useGLTF('/models/mars/24881_Mars_1_6792.glb');

  const marsModel = useMemo(() => {
    const model = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());

    const largestDimension = Math.max(size.x, size.y, size.z);

    if (largestDimension > 0) {
      const normalizingScale = 2 / largestDimension;
      model.scale.setScalar(normalizingScale);
      model.position.copy(center).multiplyScalar(-normalizingScale);
    }

    return model;
  }, [scene]);

  // Randomize the orbit when the page loads.
  const orbit = useMemo(() => ({
    radius: THREE.MathUtils.randFloat(7, 11),
    angle: Math.random() * Math.PI * 2,
    inclination: THREE.MathUtils.randFloat(-0.35, 0.35),
    speed: THREE.MathUtils.randFloat(0.035, 0.06),
  }), []);

  useFrame((state, delta) => {
    if (!marsRef.current) return;

    const angle = orbit.angle + state.clock.elapsedTime * orbit.speed;

    // A true 3D orbit centred on the user's camera position.
    const x = Math.cos(angle) * orbit.radius;
    const z = Math.sin(angle) * orbit.radius;

    marsRef.current.position.set(
      x,
      Math.sin(angle) * orbit.radius * orbit.inclination,
      z
    );

    // Keep Mars facing naturally while spinning on its own axis.
    marsRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={marsRef}>
      <primitive object={marsModel} />
    </group>
  );
}

useGLTF.preload('/models/mars/24881_Mars_1_6792.glb');
