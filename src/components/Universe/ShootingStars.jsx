
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ShootingStars() {
  const groupRef = useRef();
  const nextSpawn = useRef(2);
  const meteors = useRef([]);

  useEffect(() => {
    return () => {
      meteors.current.forEach((meteor) => {
        meteor.geometry.dispose();
        meteor.material.dispose();
      });
    };
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    nextSpawn.current -= delta;

    if (nextSpawn.current <= 0) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 45,
        10 + Math.random() * 15,
        -20 - Math.random() * 25
      );

      const direction = new THREE.Vector3(
        -1 - Math.random(),
        -0.7 - Math.random() * 0.6,
        0
      ).normalize();

      const length = 2 + Math.random() * 3;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        start.clone().addScaledVector(direction, -length),
        start,
      ]);

      const material = new THREE.LineBasicMaterial({
        color: '#b9e8ff',
        transparent: true,
        opacity: 1,
      });

      const meteor = new THREE.Line(geometry, material);
      meteor.userData.velocity = direction.multiplyScalar(
        22 + Math.random() * 15
      );
      meteor.userData.life = 0;
      meteor.userData.maxLife = 0.7 + Math.random() * 0.5;

      group.add(meteor);
      meteors.current.push(meteor);

      nextSpawn.current = 5 + Math.random() * 8;
    }

    meteors.current = meteors.current.filter((meteor) => {
      meteor.userData.life += delta;
      meteor.position.addScaledVector(meteor.userData.velocity, delta);

      const progress =
        meteor.userData.life / meteor.userData.maxLife;

      meteor.material.opacity = Math.max(0, 1 - progress);

      if (progress >= 1) {
        group.remove(meteor);
        meteor.geometry.dispose();
        meteor.material.dispose();
        return false;
      }

      return true;
    });
  });

  return <group ref={groupRef} />;
}
