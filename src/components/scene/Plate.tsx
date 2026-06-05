"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Food from "./Food";
import type { MenuItem } from "@/types";

/**
 * A place-setting: fine china plate + a silver cloche (dome).
 * - Idle: the cloche covers the dish (mystery).
 * - Active: the cloche lifts away and fades, revealing the dish, which stays
 *   seated in the plate and slowly turns — "every plate tells a story".
 */
export default function Plate({
  item,
  active,
  onSelect,
}: {
  item: MenuItem;
  active: boolean;
  onSelect: () => void;
}) {
  const foodRef = useRef<THREE.Group>(null);
  const clocheRef = useRef<THREE.Group>(null);
  const clocheMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    // the dish stays seated in the plate — it never floats. When active it
    // just turns slowly so you can admire it.
    if (foodRef.current) {
      if (active) foodRef.current.rotation.y += delta * 0.5;
    }

    // cloche lifts away + fades when active, and is fully removed once gone so
    // no translucent dome lingers over the food.
    if (clocheRef.current && clocheMat.current) {
      const targetY = active ? 1.3 : 0.0;
      clocheRef.current.position.y = THREE.MathUtils.damp(
        clocheRef.current.position.y,
        targetY,
        6,
        delta
      );
      const targetOpacity = active ? 0 : 1;
      clocheMat.current.opacity = THREE.MathUtils.damp(
        clocheMat.current.opacity,
        targetOpacity,
        7,
        delta
      );
      // hide completely while active (and snap opacity to 0 so it can't ghost)
      if (active && clocheMat.current.opacity < 0.1) {
        clocheMat.current.opacity = 0;
        clocheRef.current.visible = false;
      } else {
        clocheRef.current.visible = true;
      }
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* plate base */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.46, 0.4, 0.045, 48]} />
        <meshStandardMaterial color="#f6f1e7" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* gold rim line */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.31, 0.335, 48]} />
        <meshStandardMaterial
          color="#c9a24b"
          metalness={0.8}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* the dish */}
      <group ref={foodRef} position={[0, 0.04, 0]}>
        <Food
          color={item.foodColor}
          name={item.name}
          spiceLevel={item.spiceLevel}
          modelUrl={item.modelUrl || undefined}
        />
      </group>

      {/* silver cloche (smooth dome, no handle) */}
      <group ref={clocheRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry
            args={[0.38, 40, 28, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            ref={clocheMat}
            color="#d7dadf"
            metalness={0.95}
            roughness={0.18}
            transparent
            opacity={1}
          />
        </mesh>
      </group>
    </group>
  );
}
