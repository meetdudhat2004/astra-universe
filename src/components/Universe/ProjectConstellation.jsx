import { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const CONSTELLATIONS = {
  orion: {
    stars: [
      [-0.75, 0.85, 0],
      [0.7, 0.9, 0],
      [-0.85, 0.25, 0],
      [-0.12, 0.18, 0],
      [0.62, 0.28, 0],
      [-0.65, -0.65, 0],
      [0.65, -0.7, 0],
      [-0.2, -0.15, 0],
      [0.05, -0.35, 0],
    ],
    lines: [
      [0, 2],
      [2, 5],
      [1, 4],
      [4, 6],
      [2, 3],
      [3, 4],
      [3, 7],
      [7, 8],
      [8, 5],
    ],
  },

  ursaMajor: {
    stars: [
      [-0.8, 0.45, 0],
      [-0.35, 0.7, 0],
      [0.05, 0.55, 0],
      [0.4, 0.15, 0],
      [0.85, 0.15, 0],
      [0.85, -0.35, 0],
      [0.4, -0.35, 0],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3],
      [3, 6],
    ],
  },
};

// Wide glowing line between two stars.
function makeWideLine(points, color, linewidth, opacity) {
  const geometry = new LineGeometry();
  geometry.setPositions(points.flat());

  const material = new LineMaterial({
    color,
    linewidth,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  material.resolution.set(
    window.innerWidth,
    window.innerHeight
  );

  const line = new Line2(geometry, material);
  line.computeLineDistances();

  // Decorative lines should not capture pointer events.
  line.raycast = () => {};

  return line;
}

// Tight raycasting threshold for constellation stars.
function preciseStarRaycast(raycaster, intersects) {
  const previousThreshold = raycaster.params.Points.threshold;

  raycaster.params.Points.threshold = 0.025;

  try {
    THREE.Points.prototype.raycast.call(
      this,
      raycaster,
      intersects
    );
  } finally {
    raycaster.params.Points.threshold = previousThreshold;
  }
}

export default function ProjectConstellation({
  type = 'orion',
  position = [-3, 1, -4],
  scale = 1,
  label = '',
  onSelect,
}) {
  const [hovered, setHovered] = useState(false);

  const starsMaterialRef = useRef();
  const groupRef = useRef();
  const hoverOffsetRef = useRef(0);
  const progressRef = useRef(0);

  const pattern = CONSTELLATIONS[type] || CONSTELLATIONS.orion;
  const starPoints = pattern.stars;
  const connections = pattern.lines;

  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starPoints.flat(), 3)
    );

    geometry.setAttribute(
      'aSize',
      new THREE.Float32BufferAttribute(
        starPoints.map(() => 2.5 + Math.random() * 1.2),
        1
      )
    );

    geometry.setAttribute(
      'aPhase',
      new THREE.Float32BufferAttribute(
        starPoints.map(() => Math.random() * Math.PI * 2),
        1
      )
    );

    geometry.setAttribute(
      'aSpeed',
      new THREE.Float32BufferAttribute(
        starPoints.map(() => 0.5 + Math.random() * 0.6),
        1
      )
    );

    const colors = [];

    starPoints.forEach((_, index) => {
      const color = new THREE.Color(
        index % 3 === 0 ? '#8bdcff' : '#d7e8ff'
      );

      colors.push(color.r, color.g, color.b);
    });

    geometry.setAttribute(
      'aColor',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    return geometry;
  }, [type]);

  const lineObjects = useMemo(() => {
    return connections.map(([a, b]) => {
      const points = [starPoints[a], starPoints[b]];

      return {
        glow: makeWideLine(points, '#278fff', 5, 0.22),
        core: makeWideLine(points, '#b7e7ff', 2, 0.95),
      };
    });
  }, [type]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    // Subtle forward movement when hovering.
    hoverOffsetRef.current = THREE.MathUtils.damp(
      hoverOffsetRef.current,
      hovered ? 0.15 : 0,
      4,
      delta
    );

    if (groupRef.current) {
  groupRef.current.position.z =
    position[2] + hoverOffsetRef.current;

  const targetScale = scale * (hovered ? 1.06 : 1);

  groupRef.current.scale.setScalar(
    THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetScale,
      4,
      delta
    )
  );
}

    // Animate star pulsing and glow.
    if (starsMaterialRef.current) {
      starsMaterialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime;

      starsMaterialRef.current.uniforms.uHover.value =
        THREE.MathUtils.damp(
          starsMaterialRef.current.uniforms.uHover.value,
          hovered ? 1 : 0,
          5,
          delta
        );
    }

    // Draw complete line segments progressively.
    progressRef.current = THREE.MathUtils.damp(
      progressRef.current,
      hovered ? 1 : 0,
      2.2,
      delta
    );

    const visibleCount = Math.floor(
      progressRef.current * lineObjects.length
    );

    lineObjects.forEach((line, index) => {
      const visible = index < visibleCount;

      line.glow.visible = visible;
      line.core.visible = visible;
    });
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
    >
      {/* Animated glowing lines */}
      {lineObjects.map((line, index) => (
        <group key={`${type}-line-${index}`}>
          <primitive object={line.glow} />
          <primitive object={line.core} />
        </group>
      ))}

{/* Invisible clickable area behind the constellation */}
<mesh
  position={[0, 0, -0.08]}
  onPointerOver={(event) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }}
  onPointerOut={() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }}
  onClick={(event) => {
    event.stopPropagation();
    if (event.delta > 5) return;
    onSelect();
  }}
>
  <planeGeometry args={[2.15, 2.0]} />
  <meshBasicMaterial
    transparent
    opacity={0}
    depthWrite={false}
    side={THREE.DoubleSide}
  />
</mesh>

      {/* Interactive stars */}
      <points
        geometry={starGeometry}
        frustumCulled={false}
        raycast={preciseStarRaycast}
      
      >
        <shaderMaterial
          ref={starsMaterialRef}
          vertexShader={`
            attribute float aSize;
            attribute float aPhase;
            attribute float aSpeed;
            attribute vec3 aColor;

            uniform float uTime;
            uniform float uHover;

            varying vec3 vColor;
            varying float vPulse;

            void main() {
              vec4 viewPosition =
                modelViewMatrix * vec4(position, 1.0);

              gl_Position = projectionMatrix * viewPosition;

              float pulse =
                0.72 + 0.28 *
                sin(uTime * aSpeed + aPhase);

              gl_PointSize =
                aSize * (1.0 + uHover * 0.08)
                * 90.0 / max(1.0, -viewPosition.z);

              vColor = aColor;
              vPulse = pulse;
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vPulse;
            uniform float uHover;

            void main() {
              vec2 p = (gl_PointCoord - 0.5) * 2.0;
              float r = length(p);

              float halo = exp(-r * 4.0) * 0.65;
              float core = exp(-r * r * 100.0);

              float horizontal =
                exp(-abs(p.y) * 38.0) *
                exp(-abs(p.x) * 4.0);

              float vertical =
                exp(-abs(p.x) * 38.0) *
                exp(-abs(p.y) * 4.0);

              float alpha =
                halo + core + (horizontal + vertical) * 0.65;

              if (alpha < 0.003) discard;

              vec3 color = vColor * (0.7 + core * 1.8);
              color *= 1.0 + uHover * 0.65;

              gl_FragColor =
                vec4(color, min(alpha, 1.0) * vPulse);
            }
          `}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Project label */}
      
<Html
  position={[0, -1.15, 0]}
  center
  zIndexRange={[100, 0]}
  style={{
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    opacity: hovered ? 1 : 0.75,
transition: 'opacity 0.3s ease',
    color: '#d7e8ff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    letterSpacing: '2px',
    textShadow: '0 0 12px rgba(75, 160, 255, 0.8)',
  }}
>
  <div>
    <div>{label}</div>

    <div
      style={{
        marginTop: '7px',
        fontSize: '9px',
        letterSpacing: '1.5px',
        color: '#8bdcff',
        opacity: 0.85,
        textShadow: '0 0 8px rgba(75, 160, 255, 0.6)',
      }}
    >
      CLICK TO EXPLORE
    </div>
  </div>
</Html>

    </group>
  );
}

