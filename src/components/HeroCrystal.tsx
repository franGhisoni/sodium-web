import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { Color, type Group } from 'three';

/**
 * Hero crystal — a refractive salt cube (three.js via react-three-fiber).
 * Lives behind the hero glass cards, tilts toward the cursor and drifts
 * slowly. Loaded lazily from Hero so three.js stays off the critical path.
 */

const SHARDS: Array<{ p: [number, number, number]; s: number; sp: number; ph: number }> = [
  { p: [-0.9, 0.5, 0.8], s: 0.2, sp: 0.5, ph: 0.4 },
  { p: [1.6, -0.5, 0.6], s: 0.16, sp: 0.35, ph: 2.1 },
  { p: [-1.2, -1.2, 0.2], s: 0.12, sp: 0.6, ph: 3.3 },
  { p: [0.4, 1.7, 0.9], s: 0.1, sp: 0.45, ph: 5.0 },
];

const mouse = { x: 0, y: 0 };

function Crystal() {
  const root = useRef<Group>(null);
  const shards = useRef<Array<Group | null>>([]);
  const tilt = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 3);
    tilt.current.x += (mouse.x - tilt.current.x) * k;
    tilt.current.y += (mouse.y - tilt.current.y) * k;
    if (root.current) {
      root.current.rotation.y = t * 0.18 + tilt.current.x * 0.7;
      root.current.rotation.x = 0.62 + tilt.current.y * 0.45;
      root.current.rotation.z = 0.615;
      root.current.position.y = Math.sin(t * 0.6) * 0.1;
    }
    shards.current.forEach((g, i) => {
      if (!g) return;
      const d = SHARDS[i];
      g.rotation.x = t * d.sp + d.ph;
      g.rotation.y = t * d.sp * 0.7;
      g.position.y = d.p[1] + Math.sin(t * 0.5 + d.ph) * 0.15;
    });
  });

  const glass = {
    transmission: 1,
    thickness: 1.1,
    roughness: 0.04,
    ior: 1.45,
    chromaticAberration: 0.09,
    anisotropicBlur: 0.1,
    distortion: 0.15,
    distortionScale: 0.4,
    temporalDistortion: 0.05,
    backside: true,
    samples: 6,
    resolution: 512,
    color: '#dff0ff',
    background: new Color('#2a4a68'),
  };

  return (
    <>
      <group position={[2.1, 2.05, 0]}>
      <Backlight />
      <group ref={root}>
        <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.06} smoothness={4}>
          <MeshTransmissionMaterial {...glass} />
        </RoundedBox>
      </group>
      {SHARDS.map((d, i) => (
        <group
          key={i}
          position={d.p}
          ref={(el) => {
            shards.current[i] = el;
          }}
        >
          <RoundedBox args={[d.s * 2, d.s * 2, d.s * 2]} radius={0.03} smoothness={3}>
            <MeshTransmissionMaterial {...glass} samples={4} resolution={256} thickness={0.6} />
          </RoundedBox>
        </group>
      ))}
      </group>
    </>
  );
}

/* Bright bars behind the cube: what the glass refracts (and bends
   chromatically) as it rotates. */
function Backlight() {
  const g = useRef<Group>(null);
  useFrame((state) => {
    if (g.current) g.current.rotation.z = state.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={g} position={[0, 0, -0.9]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[(i - 2) * 0.3, 0, 0]}>
          <planeGeometry args={[0.07 + (i % 2) * 0.08, 1.5]} />
          <meshBasicMaterial color={i % 2 ? '#ffffff' : '#7cc4ff'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Studio() {
  /* Procedural lightformers: no HDR download, and they give the glass
     something bright to refract. */
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[14, 4, 1]} color="#dff1ff" />
      <Lightformer form="rect" intensity={3} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 6, 1]} color="#8ec5ee" />
      <Lightformer form="rect" intensity={2.4} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 6, 1]} color="#ffffff" />
      <Lightformer form="ring" intensity={3} position={[0, 0, 6]} scale={5} color="#b7dcf5" />
    </Environment>
  );
}

export default function HeroCrystal() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / innerWidth) * 2 - 1;
      mouse.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={wrap} className="hero-crystal" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <Studio />
        <Crystal />
      </Canvas>
    </div>
  );
}
