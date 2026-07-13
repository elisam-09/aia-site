/**
 * Scène 3D du système solaire (React Three Fiber).
 * Chargée uniquement en dynamic import par SolarSystem.tsx — jamais dans le bundle initial.
 */
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Lang } from '../../i18n/ui';
import { SUN, PLANETS, MOON, BELT, type CelestialBody } from './config';

interface SceneProps {
  lang: Lang;
  paused: boolean;
  onReady: () => void;
}

/** Sur écran tactile : premier appui = aperçu (étiquette), second = navigation. */
function useTapNav() {
  const [selected, setSelected] = useState<string | null>(null);
  const go = useCallback(
    (e: { pointerType?: string }, id: string, url: string) => {
      const touch = e.pointerType === 'touch';
      if (touch && selected !== id) {
        setSelected(id);
        return;
      }
      window.location.assign(url);
    },
    [selected],
  );
  return { selected, go, clear: () => setSelected(null) };
}

interface BodyMeshProps {
  body: CelestialBody;
  lang: Lang;
  paused: boolean;
  selected: string | null;
  onGo: (e: { pointerType?: string }, id: string, url: string) => void;
  children?: React.ReactNode;
}

/** Une planète sur son orbite, avec grossissement au survol et étiquette. */
function Body({ body, lang, paused, selected, onGo, children }: BodyMeshProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const active = hover || selected === body.id;

  useFrame(({ clock }) => {
    if (!paused && orbitRef.current && body.period > 0) {
      const t = clock.getElapsedTime();
      orbitRef.current.rotation.y = body.phase + (t / body.period) * Math.PI * 2;
    }
    if (planetRef.current) {
      const cible = active ? 1.55 : 1;
      const s = THREE.MathUtils.lerp(planetRef.current.scale.x, cible, 0.14);
      planetRef.current.scale.setScalar(s);
    }
  });

  const hitRadius = Math.max(body.size * 2.1, 0.9);

  return (
    <group ref={orbitRef} rotation-y={body.phase}>
      <group position={[body.orbit, 0, 0]}>
        <group ref={planetRef}>
          <mesh>
            <sphereGeometry args={[body.size, 40, 40]} />
            <meshStandardMaterial color={body.color} roughness={0.65} metalness={0.05} />
          </mesh>
          {body.ring && (
            <mesh rotation-x={-Math.PI / 2 + 0.32}>
              <ringGeometry args={[body.size * 1.45, body.size * 2.25, 72]} />
              <meshBasicMaterial
                color="#CEC9CE"
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          {/* Zone de contact élargie : l'astre « sent » le curseur qui s'approche */}
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHover(false);
              document.body.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onGo(e, body.id, body.route[lang]);
            }}
          >
            <sphereGeometry args={[hitRadius, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {active && (
            <Html position={[0, body.size + 0.9, 0]} center wrapperClass="solar-label-wrap" zIndexRange={[20, 0]}>
              <span className={`solar-label${body.ivorian ? ' ivorien' : ''}`}>
                {body.label[lang]}
              </span>
            </Html>
          )}
          {children}
        </group>
      </group>
    </group>
  );
}

/** Le Soleil : au centre, halo pulsant, mène à l'accueil/manifeste. */
function Sun({ lang, paused, selected, onGo }: Omit<BodyMeshProps, 'body' | 'children'>) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const active = hover || selected === SUN.id;

  const halo = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,196,107,0.85)');
    g.addColorStop(0.4, 'rgba(255,170,80,0.28)');
    g.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(({ clock }) => {
    if (!paused && ref.current) {
      const t = clock.getElapsedTime();
      const s = (active ? 1.18 : 1) + Math.sin(t * 1.6) * 0.02;
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, s, 0.1));
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[SUN.size, 48, 48]} />
        <meshBasicMaterial color={SUN.color} />
      </mesh>
      <sprite scale={[SUN.size * 5.4, SUN.size * 5.4, 1]}>
        <spriteMaterial map={halo} transparent depthWrite={false} />
      </sprite>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onGo(e, SUN.id, SUN.route[lang]);
        }}
      >
        <sphereGeometry args={[SUN.size * 1.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {active && (
        <Html position={[0, SUN.size + 1.4, 0]} center wrapperClass="solar-label-wrap" zIndexRange={[20, 0]}>
          <span className="solar-label">{SUN.label[lang]}</span>
        </Html>
      )}
    </group>
  );
}

/** Ceinture d'astéroïdes : nuage de particules + 6 fragments brillants (découvertes 2022). */
function Belt({ lang, paused, selected, onGo }: Omit<BodyMeshProps, 'body' | 'children'>) {
  const groupRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const active = hover || selected === BELT.id;

  const positions = useMemo(() => {
    const arr = new Float32Array(BELT.count * 3);
    let seed = 42;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < BELT.count; i++) {
      const a = rnd() * Math.PI * 2;
      const r = BELT.inner + rnd() * (BELT.outer - BELT.inner);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (rnd() - 0.5) * 0.55;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!paused && groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.014;
    }
  });

  const mid = (BELT.inner + BELT.outer) / 2;
  const angles = [0.4, 1.5, 2.7, 3.8, 4.9, 5.8];

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#CEC9CE" transparent opacity={0.75} sizeAttenuation />
      </points>
      {angles.map((a, i) => (
        <group key={i} position={[Math.cos(a) * mid, 0.1, Math.sin(a) * mid]}>
          <mesh>
            <icosahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color="#F77F00"
              emissive="#F77F00"
              emissiveIntensity={active ? 1.6 : 0.7}
            />
          </mesh>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHover(false);
              document.body.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onGo(e, BELT.id, BELT.route[lang]);
            }}
          >
            <sphereGeometry args={[0.55, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {active && i === 1 && (
            <Html position={[0, 0.9, 0]} center wrapperClass="solar-label-wrap" zIndexRange={[20, 0]}>
              <span className="solar-label">{BELT.label[lang]}</span>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

/** Orbites : anneaux fins posés à plat. */
function Orbits() {
  return (
    <>
      {PLANETS.map((pl) => (
        <mesh key={pl.id} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[pl.orbit - 0.025, pl.orbit + 0.025, 160]} />
          <meshBasicMaterial
            color="#F8F7F8"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

/** Cadre le système selon le ratio du conteneur : recule et bascule plus en
 *  plongée sur les écrans étroits pour que les orbites tiennent dans la largeur. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    const aspect = width / Math.max(height, 1);
    const rayon = 22.5; // Neptune (21.4) + marge d'étiquette
    const vfov = (42 * Math.PI) / 180;
    const distH = rayon / (Math.tan(vfov / 2) * aspect);
    const distV = rayon / Math.tan(vfov / 2);
    const dist = Math.min(72, Math.max(30, distH, distV * 0.7));
    // Plus l'écran est étroit, plus on regarde de haut (le système lit mieux à plat)
    const elev = aspect < 1 ? 0.85 : 0.55;
    camera.position.set(0, Math.sin(elev) * dist, Math.cos(elev) * dist);
    camera.lookAt(0, 0, 0);
    if ('fov' in camera) {
      (camera as { fov: number }).fov = 42;
    }
    camera.updateProjectionMatrix();
  }, [camera, width, height]);

  return null;
}

export default function SolarScene({ lang, paused, onReady }: SceneProps) {
  const { selected, go, clear } = useTapNav();

  return (
    <Canvas
      camera={{ position: [0, 16.5, 27.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={onReady}
      onPointerMissed={clear}
      style={{ width: '100%', height: '100%' }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={650} distance={0} decay={2} color="#FFE0B0" />
      <Stars radius={70} depth={26} count={1500} factor={3} saturation={0} fade speed={0.5} />
      <Orbits />
      <Sun lang={lang} paused={paused} selected={selected} onGo={go} />
      <Belt lang={lang} paused={paused} selected={selected} onGo={go} />
      {PLANETS.map((p) => (
        <Body key={p.id} body={p} lang={lang} paused={paused} selected={selected} onGo={go}>
          {p.id === 'terre' && (
            <Body body={MOON} lang={lang} paused={paused} selected={selected} onGo={go} />
          )}
        </Body>
      ))}
    </Canvas>
  );
}
