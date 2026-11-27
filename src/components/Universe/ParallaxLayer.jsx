import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParallaxLayer({ children, factor = 1 }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    const targetX = pointerX * factor;
    const targetY = pointerY * factor;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      3,
      delta
    );

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      3,
      delta
    );
  });

  return <group ref={groupRef}>{children}</group>;
}