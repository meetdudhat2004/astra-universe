
import { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';

export default function StarField({ count = 6000 }) {
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      values[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);

      values[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

      values[i * 3 + 2] =
        radius * Math.cos(phi);
    }

    return values;
  }, [count]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d7e8ff"
        size={0.075}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}
