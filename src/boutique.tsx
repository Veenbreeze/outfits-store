'use client';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useTexture } from '@react-three/drei';
import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Link from 'next/link';
import { products, money } from './data';
import { useCart } from './store';
import type { Product } from './types';

// ---------------------------------------------------------------------------
// Error boundary – catches Three.js / WebGL failures silently
// ---------------------------------------------------------------------------
class SceneBoundary extends Component<
  { onError: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Garment shape generation
// ---------------------------------------------------------------------------
type GarmentKind = 'tee' | 'shirt' | 'jacket' | 'trousers' | 'jeans' | 'dress' | 'skirt';

function garmentKind(category: string): GarmentKind {
  const value = category.toLowerCase();
  if (value.includes('t-shirt') || value.includes('tee')) return 'tee';
  if (value.includes('trouser')) return 'trousers';
  if (value.includes('jean')) return 'jeans';
  if (value.includes('dress')) return 'dress';
  if (value.includes('skirt')) return 'skirt';
  if (value.includes('jacket')) return 'jacket';
  return 'shirt';
}

function makeGarmentShape(kind: GarmentKind) {
  const s = new THREE.Shape();

  if (kind === 'trousers' || kind === 'jeans') {
    s.moveTo(-0.29, 0.55);
    s.lineTo(0.29, 0.55);
    s.lineTo(0.31, -0.08);
    s.lineTo(0.14, -0.16);
    s.lineTo(0.31, -0.62);
    s.lineTo(0.045, -0.62);
    s.lineTo(0, -0.22);
    s.lineTo(-0.045, -0.62);
    s.lineTo(-0.31, -0.62);
    s.lineTo(-0.14, -0.16);
    s.lineTo(-0.31, -0.08);
    s.closePath();
  } else if (kind === 'skirt') {
    s.moveTo(-0.25, 0.55);
    s.lineTo(0.25, 0.55);
    s.lineTo(0.49, -0.62);
    s.lineTo(-0.49, -0.62);
    s.closePath();
  } else if (kind === 'dress') {
    s.moveTo(-0.22, 0.55);
    s.lineTo(-0.17, 0.35);
    s.quadraticCurveTo(-0.12, 0.2, -0.25, 0.04);
    s.lineTo(-0.49, -0.62);
    s.lineTo(0.49, -0.62);
    s.lineTo(0.25, 0.04);
    s.quadraticCurveTo(0.12, 0.2, 0.17, 0.35);
    s.lineTo(0.22, 0.55);
    s.lineTo(0.1, 0.53);
    s.quadraticCurveTo(0, 0.36, -0.1, 0.53);
    s.closePath();
  } else {
    // tee | shirt | jacket
    s.moveTo(-0.35, -0.62);
    s.lineTo(-0.37, 0.19);
    s.lineTo(-0.53, 0.14);
    if (kind === 'jacket') {
      s.lineTo(-0.62, 0.08);
      s.lineTo(-0.58, -0.34);
      s.lineTo(-0.48, -0.39);
      s.lineTo(-0.42, -0.03);
    } else {
      s.lineTo(-0.69, 0.34);
      s.lineTo(-0.53, 0.52);
      s.lineTo(-0.39, 0.43);
    }
    s.lineTo(-0.17, 0.53);
    if (kind === 'tee') {
      s.quadraticCurveTo(-0.12, 0.35, 0, 0.36);
      s.quadraticCurveTo(0.12, 0.35, 0.17, 0.53);
    } else {
      s.lineTo(-0.12, 0.52);
      s.lineTo(-0.1, 0.38);
      s.lineTo(0, 0.34);
      s.lineTo(0.1, 0.38);
      s.lineTo(0.12, 0.52);
      s.lineTo(0.17, 0.53);
    }
    if (kind === 'jacket') {
      s.lineTo(0.42, -0.03);
      s.lineTo(0.48, -0.39);
      s.lineTo(0.58, -0.34);
      s.lineTo(0.62, 0.08);
      s.lineTo(0.53, 0.14);
    } else {
      s.lineTo(0.39, 0.43);
      s.lineTo(0.53, 0.52);
      s.lineTo(0.69, 0.34);
      s.lineTo(0.53, 0.14);
    }
    s.lineTo(0.37, 0.19);
    s.lineTo(0.35, -0.62);
    s.closePath();
  }

  return s;
}

// ---------------------------------------------------------------------------
// Fabric mesh – category-specific procedural geometry
// ---------------------------------------------------------------------------
function Fabric({ color, kind = 'shirt' }: { color: string; kind?: GarmentKind }) {
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(makeGarmentShape(kind), {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.018,
        bevelThickness: 0.012,
        curveSegments: 12,
      }),
    [kind],
  );

  const hasCollar = kind === 'tee' || kind === 'shirt' || kind === 'jacket';
  const collar = useMemo(() => {
    const sh = new THREE.Shape();
    if (kind === 'tee') {
      sh.absellipse(0, 0.365, 0.125, 0.075, 0, Math.PI * 2, false, 0);
    } else if (kind === 'shirt' || kind === 'jacket') {
      sh.moveTo(-0.14, 0.51);
      sh.lineTo(-0.035, 0.43);
      sh.lineTo(-0.09, 0.27);
      sh.lineTo(-0.23, 0.45);
      sh.closePath();
      sh.moveTo(0.14, 0.51);
      sh.lineTo(0.035, 0.43);
      sh.lineTo(0.09, 0.27);
      sh.lineTo(0.23, 0.45);
      sh.closePath();
    }
    return new THREE.ShapeGeometry(sh, 12);
  }, [kind]);

  const isButtoned = kind === 'shirt' || kind === 'jacket';
  const waist = kind === 'trousers' || kind === 'jeans' || kind === 'skirt';

  return (
    <group>
      <mesh geometry={geometry} position={[0, 0, -0.06]} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} roughness={0.94} side={THREE.DoubleSide} />
      </mesh>

      {hasCollar && (
        <mesh geometry={collar} position={[0, 0, 0.069]} castShadow>
          <meshStandardMaterial
            color={kind === 'tee' ? color : '#e5dfd4'}
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {isButtoned && (
        <>
          {/* placket strip */}
          <mesh position={[0, -0.045, 0.072]}>
            <boxGeometry args={[0.035, 0.67, 0.018]} />
            <meshStandardMaterial color="#e9e3d8" roughness={0.9} />
          </mesh>
          {/* buttons */}
          {[-0.34, -0.19, -0.04, 0.11, 0.26, 0.4].map((y) => (
            <mesh key={y} position={[0, y, 0.087]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#aa9c83" roughness={0.5} />
            </mesh>
          ))}
          {/* chest pocket */}
          <mesh position={[0.2, 0.02, 0.075]}>
            <boxGeometry args={[0.15, 0.18, 0.012]} />
            <meshStandardMaterial color={color} roughness={0.96} />
          </mesh>
          <mesh position={[0.2, -0.075, 0.084]}>
            <boxGeometry args={[0.16, 0.012, 0.008]} />
            <meshStandardMaterial color="#c6b89f" />
          </mesh>
        </>
      )}

      {waist && (
        <>
          <mesh position={[0, 0.49, 0.07]}>
            <boxGeometry args={[0.48, 0.08, 0.018]} />
            <meshStandardMaterial color={color} roughness={0.92} />
          </mesh>
          {(kind === 'trousers' || kind === 'jeans') && (
            <mesh position={[0, 0.22, 0.073]}>
              <boxGeometry args={[0.018, 0.42, 0.012]} />
              <meshStandardMaterial color="#8b806d" roughness={0.92} />
            </mesh>
          )}
        </>
      )}

      {/* hem */}
      <mesh position={[0, -0.57, 0.07]}>
        <boxGeometry args={[(kind === 'skirt' || kind === 'dress') ? 0.8 : 0.56, 0.018, 0.012]} />
        <meshStandardMaterial color={kind === 'tee' ? color : '#c9c0b2'} roughness={0.92} />
      </mesh>

      {/* cuffs */}
      {hasCollar && kind !== 'tee' && (
        <>
          <mesh position={[-0.58, 0.22, 0.07]} rotation={[0, 0, -0.55]}>
            <boxGeometry args={[0.16, 0.025, 0.012]} />
            <meshStandardMaterial color="#c9c0b2" roughness={0.92} />
          </mesh>
          <mesh position={[0.58, 0.22, 0.07]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[0.16, 0.025, 0.012]} />
            <meshStandardMaterial color="#c9c0b2" roughness={0.92} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Product photo texture plane
// ---------------------------------------------------------------------------
function ProductPhoto({ url }: { url: string }) {
  const texture = useTexture(url, (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace;
  });
  return (
    <mesh position={[0, 0, 0.078]} castShadow>
      <planeGeometry args={[0.76, 1.02]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Store signage
// ---------------------------------------------------------------------------
function StoreSign() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e1cc9e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '46px Georgia, serif';
      ctx.shadowColor = '#e1cc9e';
      ctx.shadowBlur = 12;
      ctx.fillText('VEENBREEZE FASHION', 512, 128);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 3.1, -3.78]}>
      <planeGeometry args={[2.55, 0.64]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Hanger
// ---------------------------------------------------------------------------
function Hanger({ color = '#b9a77e' }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.44, 0.018, 6, 28, Math.PI]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.16, 7]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.43, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.72, 7]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Individual garment on the rack
// ---------------------------------------------------------------------------
function Garment({
  p,
  index,
  select,
  selected,
  yaw,
}: {
  p: Product;
  index: number;
  select: () => void;
  selected: boolean;
  yaw: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!ref.current) return;
    const x = index * 0.47 - 0.7;
    const z = -0.15 - index * 0.07;
    gsap.to(ref.current.position, {
      x: selected ? 0 : x,
      y: selected ? 0.9 : 2.05,
      z: selected ? 1.2 : z,
      duration: 0.8,
      ease: 'power2.inOut',
    });
    gsap.to(ref.current.rotation, { y: selected ? yaw : -0.72, duration: 0.8, ease: 'power2.inOut' });
    gsap.to(ref.current.scale, {
      x: selected ? 1.2 : 0.7,
      y: selected ? 1.2 : 0.7,
      z: selected ? 1.2 : 0.7,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }, [selected, index, yaw]);

  return (
    <group
      ref={ref}
      position={[index * 0.47 - 0.7, 2.05, -0.15 - index * 0.07]}
      rotation={[0, -0.72, 0]}
      scale={0.7}
      onClick={select}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Hanger />
      <group position={[0, -0.02, 0]}>
        <Suspense fallback={<Fabric color={p.colors[0].hex} kind={garmentKind(p.category)} />}>
          <ProductPhoto url={p.image} />
        </Suspense>
      </group>
      {selected && (
        <mesh position={[0, 0, -0.03]}>
          <sphereGeometry args={[0.46, 12, 12]} />
          <meshBasicMaterial color="#d6be8d" wireframe />
        </mesh>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Clothing rack (left or right side of the store)
// ---------------------------------------------------------------------------
function Rack({
  side,
  select,
  selectedId,
  yaw,
}: {
  side: number;
  select: (p: Product) => void;
  selectedId: string | null;
  yaw: number;
}) {
  const half = Math.ceil(products.length / 2);
  const items = side === -1 ? products.slice(0, half) : products.slice(half);

  return (
    <group position={[side * 3.35, 0, 0]}>
      {/* horizontal rail */}
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 4.9, 12]} />
        <meshStandardMaterial color="#b89962" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* uprights */}
      {[-2.1, 2.1].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.83, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.12, 12]} />
            <meshStandardMaterial color="#292a27" />
          </mesh>
          <mesh position={[x, 0.7, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2.8, 12]} />
            <meshStandardMaterial color="#383a36" />
          </mesh>
          <mesh position={[x, -0.45, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.75, 12]} />
            <meshStandardMaterial color="#383a36" />
          </mesh>
        </group>
      ))}
      {/* cross beam */}
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 4.3, 12]} />
        <meshStandardMaterial color="#b89962" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* garments */}
      {items.map((p, i) => (
        <Garment
          key={p.id}
          p={p}
          index={i}
          select={() => select(p)}
          selected={p.id === selectedId}
          yaw={yaw}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Room environment + lighting
// ---------------------------------------------------------------------------
function Room({
  inside,
  selected,
  setSelected,
  yaw,
}: {
  inside: boolean;
  selected: Product | null;
  setSelected: (p: Product) => void;
  yaw: number;
}) {
  const { camera } = useThree();
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);

  useEffect(() => {
    if (left.current) gsap.to(left.current.rotation, { y: inside ? -1.22 : 0, duration: 1.5, ease: 'power2.inOut' });
    if (right.current) gsap.to(right.current.rotation, { y: inside ? 1.22 : 0, duration: 1.5, ease: 'power2.inOut' });
    gsap.to(camera.position, { x: 0, y: inside ? 2.6 : 2.5, z: inside ? 7 : 8, duration: 2.1, ease: 'power2.inOut' });
    gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 1, ease: 'power1.inOut' });
    if (controls.current) controls.current.target.set(0, 2, 0);
  }, [inside, camera]);

  return (
    <>
      <color attach="background" args={['#191b19']} />
      <ambientLight intensity={inside ? 1.15 : 0.6} />
      <hemisphereLight args={['#fff0d4', '#3c3630', inside ? 1.1 : 0.45]} />
      <directionalLight position={[2, 7, 4]} intensity={inside ? 2 : 1.3} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[0, 5, 0]} intensity={inside ? 65 : 20} angle={0.65} penumbra={0.65} castShadow color="#ffe4b3" />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#8d8374" roughness={0.72} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 2.5, -4]}>
        <boxGeometry args={[10, 6, 0.25]} />
        <meshStandardMaterial color="#d6cbb8" roughness={0.9} />
      </mesh>
      {/* decorative frame */}
      <mesh position={[0, 2.75, -3.83]}>
        <boxGeometry args={[2.9, 2.9, 0.04]} />
        <meshStandardMaterial color="#32312c" />
      </mesh>
      <StoreSign />

      {/* door panels */}
      <mesh position={[-2.55, 1.05, -3.7]}>
        <boxGeometry args={[1.7, 2.25, 0.14]} />
        <meshStandardMaterial color="#906d4a" roughness={0.48} />
      </mesh>
      <mesh position={[2.55, 1.05, -3.7]}>
        <boxGeometry args={[1.7, 2.25, 0.14]} />
        <meshStandardMaterial color="#906d4a" roughness={0.48} />
      </mesh>
      <mesh position={[-1.7, 1.05, -3.56]}>
        <boxGeometry args={[0.055, 2.45, 0.15]} />
        <meshStandardMaterial color="#c0a876" metalness={0.4} />
      </mesh>
      <mesh position={[1.7, 1.05, -3.56]}>
        <boxGeometry args={[0.055, 2.45, 0.15]} />
        <meshStandardMaterial color="#c0a876" metalness={0.4} />
      </mesh>

      {inside && (
        <>
          {/* ceiling */}
          <mesh position={[0, 4.15, 0]}>
            <boxGeometry args={[10, 0.18, 8]} />
            <meshStandardMaterial color="#d9d0c3" />
          </mesh>
          <Rack side={-1} select={(p) => setSelected(p)} selectedId={selected?.id ?? null} yaw={yaw} />
          <Rack side={1} select={(p) => setSelected(p)} selectedId={selected?.id ?? null} yaw={yaw} />
          {/* bench */}
          <mesh position={[0, 0.3, 2.8]}>
            <boxGeometry args={[1.3, 0.55, 0.5]} />
            <meshStandardMaterial color="#755c42" />
          </mesh>
          <pointLight position={[-3, 3.8, -1]} intensity={32} color="#ffdaa1" />
          <pointLight position={[3, 3.8, -1]} intensity={32} color="#ffdaa1" />
        </>
      )}

      {/* glass door – left leaf */}
      <group ref={left} position={[-1.7, 1.05, -3.45]}>
        <mesh position={[0.82, 0, 0]}>
          <boxGeometry args={[1.64, 2.1, 0.09]} />
          <meshPhysicalMaterial color="#4c514c" roughness={0.2} metalness={0.05} transparent opacity={0.58} />
        </mesh>
        <mesh position={[0.05, 0, 0.1]}>
          <boxGeometry args={[0.035, 2.2, 0.12]} />
          <meshStandardMaterial color="#bfaa7c" metalness={0.5} />
        </mesh>
        <mesh position={[1.5, 0, 0.15]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#d8bf8b" metalness={0.7} />
        </mesh>
      </group>

      {/* glass door – right leaf */}
      <group ref={right} position={[1.7, 1.05, -3.45]}>
        <mesh position={[-0.82, 0, 0]}>
          <boxGeometry args={[1.64, 2.1, 0.09]} />
          <meshPhysicalMaterial color="#4c514c" roughness={0.2} metalness={0.05} transparent opacity={0.58} />
        </mesh>
        <mesh position={[-0.05, 0, 0.1]}>
          <boxGeometry args={[0.035, 2.2, 0.12]} />
          <meshStandardMaterial color="#bfaa7c" metalness={0.5} />
        </mesh>
        <mesh position={[-1.5, 0, 0.15]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#d8bf8b" metalness={0.7} />
        </mesh>
      </group>

      <ContactShadows position={[0, -0.88, 0]} opacity={0.35} scale={14} blur={2} />
      <OrbitControls
        ref={controls}
        makeDefault
        enabled={inside}
        target={[0, 2, 0]}
        minDistance={4}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2 + 0.12}
        minPolarAngle={0.42}
        enablePan={false}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Boutique export
// ---------------------------------------------------------------------------
export default function Boutique({ onFallback }: { onFallback: () => void }) {
  const [inside, setInside] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [view, setView] = useState(0);
  const add = useCart((s) => s.add);

  const enter = () => {
    if (busy) return;
    setBusy(true);
    setInside(true);
    setTimeout(() => setBusy(false), 2300);
  };

  const selectProduct = (product: Product) => {
    if (busy) return;
    setSelected(product);
    setSize(product.sizes[0]);
    setColor(product.colors[0].name);
    setView(0);
  };

  const yaw = view === 2 ? Math.PI : view === 1 ? Math.PI / 2 : 0;

  return (
    <div className="scene-frame">
      <SceneBoundary onError={onFallback}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 2.5, 8], fov: 48 }}
          gl={{ antialias: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => { gl.setClearColor('#191b19'); }}
        >
          <Suspense fallback={null}>
            <Room
              inside={inside}
              selected={selected}
              setSelected={selectProduct}
              yaw={yaw}
            />
          </Suspense>
        </Canvas>
      </SceneBoundary>

      {/* HUD overlay */}
      <div className="scene-ui">
        <div className="scene-controls">
          <div className="scene-label">
            {inside ? 'VEENBREEZE · THE BOUTIQUE' : 'VEENBREEZE FASHION · WELCOME'}
          </div>
          <div className="scene-actions">
            {!inside ? (
              <button disabled={busy} onClick={enter}>
                {busy ? 'WELCOME…' : 'ENTER STORE'}
              </button>
            ) : (
              <>
                <button onClick={() => { setSelected(null); setInside(false); }}>EXIT TO ENTRANCE</button>
                {selected && <button onClick={() => setSelected(null)}>RETURN TO RACK</button>}
              </>
            )}
          </div>
        </div>

        <div className="scene-bottom">
          <span>{inside ? 'Drag to orbit · scroll to zoom' : 'Step inside our virtual boutique'}</span>
          <button onClick={() => (inside ? selectProduct(products[(view + 1) % products.length]) : enter())}>
            {inside ? 'NEXT GARMENT' : 'ENTER STORE'}
          </button>
        </div>
      </div>

      {/* Garment inspector panel */}
      {selected && inside && (
        <aside className="inspector">
          <span className="eyebrow">{selected.category.toUpperCase()}</span>
          <h2>{selected.name}</h2>
          <b>{money(selected.salePrice ?? selected.price)}</b>

          <div className="option-label">COLOUR</div>
          <div className="option-list">
            {selected.colors.map((c) => (
              <button
                key={c.name}
                className={color === c.name ? 'selected' : ''}
                onClick={() => setColor(c.name)}
                style={{ borderBottom: `3px solid ${c.hex}` }}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="option-label">SIZE</div>
          <div className="option-list">
            {selected.sizes.map((s) => (
              <button key={s} className={size === s ? 'selected' : ''} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="option-list" style={{ marginTop: 13 }}>
            {['Front', 'Side', 'Back', 'Reset'].map((n, i) => (
              <button
                key={n}
                className={view === i ? 'selected' : ''}
                onClick={() => setView(i === 3 ? 0 : i)}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            className="button add-wide"
            onClick={() => add({ productId: selected.id, size, color, quantity: 1 })}
          >
            ADD TO BAG
          </button>
          <Link className="text-link" style={{ marginTop: 12 }} href={`/products/${selected.slug}`}>
            FULL PRODUCT DETAILS ↗
          </Link>
        </aside>
      )}
    </div>
  );
}
