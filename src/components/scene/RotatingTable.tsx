"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Plate from "./Plate";
import Candelabra from "./Candelabra";
import type { MenuItem } from "@/types";

const RING_RADIUS = 2.55;

/**
 * The hero: a large glossy round table, a plate per featured dish around the
 * rim, and a gold candelabra at the centre.
 * - Idle (and `playing`): the table turns slowly.
 * - A dish is selected: the table eases that plate to the front and lifts its
 *   cloche; idle spin pauses.
 */
export default function RotatingTable({
  items,
  selectedIndex,
  playing,
  onSelect,
}: {
  items: MenuItem[];
  selectedIndex: number | null;
  playing: boolean;
  onSelect: (index: number) => void;
}) {
  const tableRef = useRef<THREE.Group>(null);
  const targetRot = useRef(0);

  const n = Math.max(items.length, 1);
  const angleFor = (i: number) => (i / n) * Math.PI * 2;

  useFrame((_, delta) => {
    const g = tableRef.current;
    if (!g) return;

    if (selectedIndex === null) {
      if (playing) targetRot.current -= delta * 0.18;
    } else {
      const desired = -angleFor(selectedIndex);
      const current = targetRot.current;
      const twoPi = Math.PI * 2;
      let diff = (desired - current) % twoPi;
      if (diff > Math.PI) diff -= twoPi;
      if (diff < -Math.PI) diff += twoPi;
      targetRot.current = current + diff;
    }

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot.current, 3, delta);
  });

  return (
    <group position={[0, -0.55, 0]}>
      <group ref={tableRef}>
        {/* table top — polished caramel lacquer */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[3.5, 3.5, 0.22, 96]} />
          <meshStandardMaterial
            color="#7a5836"
            roughness={0.28}
            metalness={0.35}
          />
        </mesh>
        {/* faint gold inlay ring */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.0, 3.04, 120]} />
          <meshStandardMaterial
            color="#c9a24b"
            metalness={0.8}
            roughness={0.35}
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* centrepiece */}
        <group position={[0, 0.11, 0]}>
          <Candelabra />
        </group>

        {/* plates around the rim */}
        {items.map((item, i) => {
          const a = angleFor(i);
          return (
            <group
              key={item.id}
              position={[
                Math.sin(a) * RING_RADIUS,
                0.12,
                Math.cos(a) * RING_RADIUS,
              ]}
              rotation={[0, a, 0]}
            >
              <Plate
                item={item}
                active={selectedIndex === i}
                onSelect={() => onSelect(i)}
              />
            </group>
          );
        })}
      </group>

      {/* pedestal */}
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.6, 1.1, 2.2, 48]} />
        <meshStandardMaterial color="#1d120b" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}
