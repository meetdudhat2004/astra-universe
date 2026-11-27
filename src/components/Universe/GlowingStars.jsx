
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;

  uniform float uTime;

  varying vec3 vColor;
  varying float vPulse;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    float pulse = 0.65 + 0.35 *
        sin(uTime * aSpeed + aPhase);

    gl_PointSize = aSize * 180.0 /
    max(1.0, -viewPosition.z);

    vColor = aColor;
    vPulse = pulse;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vPulse;

  void main() {
    vec2 p = (gl_PointCoord - 0.5) * 2.0;

    float r = length(p);

    // Soft halo surrounding the star
    float halo = exp(-r * 4.0) * 0.65;

    // Small, bright central point
    float core = exp(-r * r * 100.0);

    // Thin horizontal and vertical diffraction spikes
    float horizontal =
      exp(-abs(p.y) * 38.0) *
      exp(-abs(p.x) * 4.0);

    float vertical =
      exp(-abs(p.x) * 38.0) *
      exp(-abs(p.y) * 4.0);

    float spikes = (horizontal + vertical) * 0.65;

    float alpha = halo + core + spikes;

    if (alpha < 0.003) discard;

    vec3 color = vColor * (0.7 + core * 1.8);

    gl_FragColor = vec4(color, min(alpha, 1.0) * vPulse);
  }
`;

export default function GlowingStars({ count = 24 }) {
  const materialRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = [];
    const sizes = [];
    const phases = [];
    const speeds = [];
    const colors = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 65,
        -15 - Math.random() * 75
      );

      sizes.push(4 + Math.random() * 5);
      phases.push(Math.random() * Math.PI * 2);
      speeds.push(0.4 + Math.random() * 0.8);

      const color = new THREE.Color(
        i % 4 === 0 ? '#8bdcff' : '#d7e8ff'
      );

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geo.setAttribute(
      'aSize',
      new THREE.Float32BufferAttribute(sizes, 1)
    );
    geo.setAttribute(
      'aPhase',
      new THREE.Float32BufferAttribute(phases, 1)
    );
    geo.setAttribute(
      'aSpeed',
      new THREE.Float32BufferAttribute(speeds, 1)
    );
    geo.setAttribute(
      'aColor',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    return geo;
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
