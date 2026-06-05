"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Gold candelabra centerpiece with flickering candle flames.
 * Sits at the middle of the table.
 */
export default function Candelabra() {
  const flamesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const g = flamesRef.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    g.children.forEach((flame, i) => {
      const f = 0.85 + Math.sin(t * 9 + i * 1.7) * 0.12 + Math.sin(t * 23 + i) * 0.05;
      flame.scale.set(1, f, 1);
    });
  });

  const gold = (
    <meshStandardMaterial color="#c9a24b" roughness={0.3} metalness={0.85} />
  );

  // three candle arms: center + two sides
  const arms: { x: number; h: number }[] = [
    { x: 0, h: 0.95 },
    { x: -0.34, h: 0.7 },
    { x: 0.34, h: 0.7 },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.08, 24]} />
        {gold}
      </mesh>
      {/* central stem */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.8, 16]} />
        {gold}
      </mesh>
      {/* cross arm */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.74, 0.03, 0.03]} />
        {gold}
      </mesh>

      {arms.map((a, i) => (
        <group key={i} position={[a.x, 0, 0]}>
          {/* cup */}
          <mesh position={[0, a.h - 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.04, 0.05, 16]} />
            {gold}
          </mesh>
          {/* candle */}
          <mesh position={[0, a.h + 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.26, 16]} />
            <meshStandardMaterial color="#efe7d0" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* flames + their light */}
      <group ref={flamesRef}>
        {arms.map((a, i) => (
          <mesh key={i} position={[a.x, a.h + 0.32, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial
              color="#ffd27a"
              emissive="#ff9a3c"
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <pointLight
        position={[0, 1.3, 0]}
        intensity={6}
        distance={6}
        color="#ffb35e"
      />
    </group>
  );
}
