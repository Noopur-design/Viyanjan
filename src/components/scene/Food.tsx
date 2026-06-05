"use client";

import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Renders a dish on a plate.
 *   1. `modelUrl` (.glb)  → real 3D model
 *   2. otherwise          → a *procedurally modelled* plated dish whose shapes
 *                           are chosen from the dish name (pasta coils, a fish
 *                           fillet, tacos, salad, stir-fry…) and coloured to
 *                           look like real food. No flat photos.
 */
export default function Food({
  color,
  name = "",
  modelUrl,
}: {
  color: string;
  spiceLevel?: number;
  modelUrl?: string;
  imageUrl?: string;
  name?: string;
}) {
  if (modelUrl) {
    return (
      <Suspense fallback={<PlatedDish color={color} name={name} />}>
        <GltfFood url={modelUrl} />
      </Suspense>
    );
  }
  return <PlatedDish color={color} name={name} />;
}

function GltfFood({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  cloned.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return <primitive object={cloned} scale={0.5} position={[0, 0.05, 0]} />;
}

/* ----------------------------------------------------------------------- */
/* Procedural plated food                                                  */
/* ----------------------------------------------------------------------- */

type Geo = "sphere" | "box" | "cyl" | "ico" | "torus" | "cone";
type GeoArgs = (number | boolean)[];
type Piece = {
  geo: Geo;
  args: GeoArgs;
  pos: [number, number, number];
  rot?: [number, number, number];
  scale?: [number, number, number];
  color: string;
  rough?: number;
  metal?: number;
};

// deterministic per-dish RNG so each plate looks the same every render
function makeRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Archetype =
  | "pasta"
  | "salad"
  | "rolls"
  | "tacos"
  | "stirfry"
  | "protein"
  | "chunks"
  | "dessert"
  | "bowl"
  | "mound";

function archetypeFor(name: string): Archetype {
  const n = name.toLowerCase();
  if (/pasta|linguine|alfredo|spaghetti|noodle|primavera/.test(n)) return "pasta";
  if (/salad|quinoa/.test(n)) return "salad";
  if (/roll|spring/.test(n)) return "rolls";
  if (/taco/.test(n)) return "tacos";
  if (/stir|broccoli|wok/.test(n)) return "stirfry";
  if (/salmon|fish|prawn|shrimp|saganaki|fillet|steak|beef|karaage|teriyaki/.test(n))
    return "protein";
  if (/bravas|patatas|potato|fries/.test(n)) return "chunks";
  if (/crumble|budino|ricotta|cake|pudding|dessert|jamun|tart/.test(n))
    return "dessert";
  if (/blanco|soup|gazpacho|bisque/.test(n)) return "bowl";
  return "mound";
}

const PALETTE = {
  sauceRed: "#9e3320",
  sauceCream: "#ecdcae",
  sauceBrown: "#4a2a16",
};

// herb / accent colours reused across archetypes
const GREEN = "#5e8a39";
const GREEN_D = "#3f6b27";
const TOMATO = "#c0392b";
const CREAM = "#ece2c4";
const GOLD = "#d8a24a";
const CRUST = "#b5701f";
const CHAR = "#6e3b22";

function buildPieces(archetype: Archetype, name: string, color: string): Piece[] {
  const rng = makeRng(name || archetype);
  const jitter = (a: number) => (rng() - 0.5) * a;
  const base = new THREE.Color(color);
  const lighter = base.clone().offsetHSL(0, -0.05, 0.12).getStyle();
  const darker = base.clone().offsetHSL(0, 0.05, -0.12).getStyle();
  const pieces: Piece[] = [];

  // most plates get a glossy sauce pool in the well
  const sauceDisc = (col: string, r = 0.27): Piece => ({
    geo: "cyl",
    args: [r, r - 0.02, 0.02, 36],
    pos: [0, 0.012, 0],
    color: col,
    rough: 0.35,
    metal: 0.05,
  });

  const herb = (): Piece => ({
    geo: "box",
    args: [0.012, 0.01, 0.07],
    pos: [jitter(0.18), 0.12 + rng() * 0.05, jitter(0.18)],
    rot: [0, rng() * Math.PI, jitter(0.4)],
    color: rng() > 0.5 ? GREEN : GREEN_D,
    rough: 0.7,
  });

  switch (archetype) {
    case "pasta": {
      const creamy = /alfredo|primavera|carbonara/.test(name.toLowerCase());
      pieces.push(sauceDisc(creamy ? PALETTE.sauceCream : PALETTE.sauceRed));
      // coiled noodles: a few stacked tori
      for (let i = 0; i < 3; i++) {
        pieces.push({
          geo: "torus",
          args: [0.12 - i * 0.015, 0.045, 10, 24],
          pos: [jitter(0.05), 0.07 + i * 0.03, jitter(0.05)],
          rot: [Math.PI / 2 + jitter(0.3), jitter(0.5), 0],
          color: creamy ? "#f0e2b8" : "#e8c878",
          rough: 0.55,
        });
      }
      // prawns / sauce bits on top
      const protein = /prawn|chilli/.test(name.toLowerCase());
      for (let i = 0; i < 4; i++) {
        pieces.push({
          geo: protein ? "torus" : "sphere",
          args: protein ? [0.04, 0.018, 8, 12, Math.PI * 1.4] : [0.03, 12, 12],
          pos: [jitter(0.22), 0.16 + rng() * 0.04, jitter(0.22)],
          rot: [jitter(1), rng() * Math.PI, jitter(1)],
          color: protein ? "#e0805a" : TOMATO,
          rough: 0.5,
        });
      }
      pieces.push(herb(), herb());
      break;
    }

    case "protein": {
      const n = name.toLowerCase();
      let pcol = CRUST;
      if (/salmon/.test(n)) pcol = "#e0795a";
      else if (/prawn|shrimp|saganaki/.test(n)) pcol = "#e08a5a";
      else if (/fish|cod/.test(n)) pcol = "#e8d9b0";
      else if (/beef|steak/.test(n)) pcol = CHAR;
      else if (/chicken|karaage|teriyaki/.test(n)) pcol = GOLD;

      pieces.push(sauceDisc(/teriyaki|beef/.test(n) ? "#4a2a16" : PALETTE.sauceCream));

      const prawny = /prawn|shrimp|saganaki/.test(n);
      const nuggety = /karaage|popcorn/.test(n);
      if (prawny) {
        for (let i = 0; i < 5; i++)
          pieces.push({
            geo: "torus",
            args: [0.055, 0.025, 10, 16, Math.PI * 1.5],
            pos: [jitter(0.2), 0.1 + rng() * 0.04, jitter(0.2)],
            rot: [Math.PI / 2 + jitter(0.4), rng() * Math.PI, 0],
            color: pcol,
            rough: 0.45,
          });
      } else if (nuggety) {
        for (let i = 0; i < 6; i++)
          pieces.push({
            geo: "ico",
            args: [0.06, 0],
            pos: [jitter(0.22), 0.09 + rng() * 0.05, jitter(0.22)],
            rot: [rng(), rng(), rng()],
            scale: [1, 0.8, 1],
            color: GOLD,
            rough: 0.85,
          });
      } else {
        // a seared fillet/steak
        pieces.push({
          geo: "box",
          args: [0.26, 0.08, 0.17],
          pos: [0, 0.075, 0],
          rot: [0, jitter(0.5), 0],
          color: pcol,
          rough: 0.6,
        });
        // glaze top
        pieces.push({
          geo: "box",
          args: [0.24, 0.02, 0.15],
          pos: [0, 0.12, 0],
          rot: [0, jitter(0.5), 0],
          color: base.getStyle(),
          rough: 0.3,
          metal: 0.1,
        });
      }
      // lemon wedge for seafood/fish
      if (/fish|prawn|salmon|saganaki|cod/.test(n)) {
        pieces.push({
          geo: "cyl",
          args: [0.07, 0.07, 0.04, 16, 1, false, 0, Math.PI / 2.2],
          pos: [0.18, 0.06, -0.14],
          rot: [Math.PI / 2, 0, 0],
          color: "#e9d24a",
          rough: 0.5,
        });
      }
      pieces.push(herb(), herb());
      break;
    }

    case "salad": {
      const greek = /greek|quinoa/.test(name.toLowerCase());
      // leafy pile
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        pieces.push({
          geo: "ico",
          args: [0.07 + rng() * 0.03, 0],
          pos: [Math.cos(a) * 0.16 + jitter(0.05), 0.07 + rng() * 0.05, Math.sin(a) * 0.16 + jitter(0.05)],
          rot: [rng(), rng(), rng()],
          scale: [1, 0.45, 1],
          color: rng() > 0.4 ? GREEN : GREEN_D,
          rough: 0.8,
        });
      }
      // tomatoes
      for (let i = 0; i < 4; i++)
        pieces.push({
          geo: "sphere",
          args: [0.04, 14, 14],
          pos: [jitter(0.28), 0.1 + rng() * 0.05, jitter(0.28)],
          color: TOMATO,
          rough: 0.35,
        });
      // feta cubes (greek)
      if (greek)
        for (let i = 0; i < 4; i++)
          pieces.push({
            geo: "box",
            args: [0.05, 0.05, 0.05],
            pos: [jitter(0.26), 0.1 + rng() * 0.04, jitter(0.26)],
            rot: [rng(), rng(), rng()],
            color: "#f3efe6",
            rough: 0.7,
          });
      // olives
      for (let i = 0; i < 3; i++)
        pieces.push({
          geo: "sphere",
          args: [0.028, 12, 12],
          pos: [jitter(0.26), 0.1 + rng() * 0.05, jitter(0.26)],
          scale: [1, 1.3, 1],
          color: "#2c2218",
          rough: 0.4,
        });
      break;
    }

    case "rolls": {
      pieces.push(sauceDisc(PALETTE.sauceCream));
      for (let i = 0; i < 3; i++) {
        pieces.push({
          geo: "cyl",
          args: [0.05, 0.05, 0.22, 16],
          pos: [(i - 1) * 0.12, 0.09, jitter(0.04)],
          rot: [0, jitter(0.3), Math.PI / 2],
          color: CRUST,
          rough: 0.8,
        });
        // rounded ends
        for (const e of [-1, 1])
          pieces.push({
            geo: "sphere",
            args: [0.05, 14, 14],
            pos: [(i - 1) * 0.12 + e * 0.11, 0.09, jitter(0.04)],
            color: CRUST,
            rough: 0.8,
          });
      }
      // dip
      pieces.push({
        geo: "cyl",
        args: [0.07, 0.06, 0.03, 18],
        pos: [0.16, 0.04, 0.16],
        color: "#7a1f12",
        rough: 0.3,
        metal: 0.05,
      });
      break;
    }

    case "tacos": {
      for (let k = 0; k < 2; k++) {
        const x = (k - 0.5) * 0.22;
        // folded shell
        pieces.push({
          geo: "cyl",
          args: [0.13, 0.13, 0.18, 18, 1, true, 0, Math.PI],
          pos: [x, 0.11, 0],
          rot: [0, 0, 0],
          color: GOLD,
          rough: 0.8,
        });
        // fillings peeking out
        for (let i = 0; i < 3; i++)
          pieces.push({
            geo: "sphere",
            args: [0.03, 12, 12],
            pos: [x + jitter(0.06), 0.12 + rng() * 0.03, jitter(0.05)],
            color: [GREEN, TOMATO, "#caa15a"][i % 3],
            rough: 0.5,
          });
      }
      break;
    }

    case "stirfry": {
      pieces.push(sauceDisc("#3f2615"));
      // broccoli
      for (let i = 0; i < 4; i++) {
        const p: [number, number, number] = [jitter(0.24), 0.1 + rng() * 0.04, jitter(0.24)];
        pieces.push({
          geo: "ico",
          args: [0.055, 0],
          pos: p,
          color: GREEN_D,
          rough: 0.85,
        });
      }
      // beef strips
      for (let i = 0; i < 4; i++)
        pieces.push({
          geo: "box",
          args: [0.1, 0.04, 0.05],
          pos: [jitter(0.24), 0.09 + rng() * 0.04, jitter(0.24)],
          rot: [jitter(0.4), rng() * Math.PI, jitter(0.4)],
          color: CHAR,
          rough: 0.55,
          metal: 0.05,
        });
      pieces.push(herb());
      break;
    }

    case "chunks": {
      pieces.push(sauceDisc("#b23a1e"));
      for (let i = 0; i < 7; i++)
        pieces.push({
          geo: "box",
          args: [0.08, 0.08, 0.08],
          pos: [jitter(0.26), 0.07 + rng() * 0.07, jitter(0.26)],
          rot: [rng(), rng(), rng()],
          color: GOLD,
          rough: 0.85,
        });
      // aioli dots
      for (let i = 0; i < 4; i++)
        pieces.push({
          geo: "sphere",
          args: [0.025, 10, 10],
          pos: [jitter(0.24), 0.16 + rng() * 0.03, jitter(0.24)],
          color: "#f2ead2",
          rough: 0.4,
        });
      break;
    }

    case "dessert": {
      const crumble = /crumble/.test(name.toLowerCase());
      if (crumble) {
        for (let i = 0; i < 9; i++)
          pieces.push({
            geo: "box",
            args: [0.05, 0.04, 0.05],
            pos: [jitter(0.22), 0.06 + rng() * 0.07, jitter(0.22)],
            rot: [rng(), rng(), rng()],
            color: i % 3 === 0 ? "#7a3b6b" : GOLD,
            rough: 0.85,
          });
      } else {
        // quenelle / pudding dome
        pieces.push({
          geo: "sphere",
          args: [0.16, 24, 20],
          pos: [0, 0.1, 0],
          scale: [1.15, 0.75, 0.9],
          color: CREAM,
          rough: 0.5,
        });
      }
      // berries
      for (let i = 0; i < 3; i++)
        pieces.push({
          geo: "sphere",
          args: [0.032, 12, 12],
          pos: [jitter(0.18), 0.18 + rng() * 0.03, jitter(0.18)],
          color: rng() > 0.5 ? "#7a1f3d" : "#3a1f55",
          rough: 0.4,
        });
      // mint
      pieces.push({
        geo: "ico",
        args: [0.03, 0],
        pos: [0, 0.24, 0],
        scale: [1, 0.4, 1.4],
        color: GREEN,
        rough: 0.7,
      });
      break;
    }

    case "bowl": {
      // shallow bowl
      pieces.push({
        geo: "cyl",
        args: [0.32, 0.24, 0.12, 36],
        pos: [0, 0.06, 0],
        color: "#efe9dd",
        rough: 0.3,
        metal: 0.05,
      });
      // liquid surface
      pieces.push({
        geo: "cyl",
        args: [0.29, 0.29, 0.02, 36],
        pos: [0, 0.115, 0],
        color: lighter,
        rough: 0.2,
        metal: 0.1,
      });
      // garnish (almonds/grapes)
      for (let i = 0; i < 4; i++)
        pieces.push({
          geo: "sphere",
          args: [0.03, 12, 12],
          pos: [jitter(0.2), 0.14, jitter(0.2)],
          scale: [1, 0.7, 1.4],
          color: i % 2 ? "#d8c79a" : "#6b8f4a",
          rough: 0.5,
        });
      break;
    }

    default: {
      // generic glossy mound (curry/stew/mash)
      pieces.push(sauceDisc(darker));
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        pieces.push({
          geo: "ico",
          args: [0.07 + rng() * 0.03, 0],
          pos: [Math.cos(a) * 0.12 * rng(), 0.08 + rng() * 0.06, Math.sin(a) * 0.12 * rng()],
          rot: [rng(), rng(), rng()],
          color: i % 2 ? lighter : base.getStyle(),
          rough: 0.6,
        });
      }
      pieces.push(herb(), herb());
    }
  }

  return pieces;
}

function PlatedDish({ color, name }: { color: string; name: string }) {
  const pieces = useMemo(
    () => buildPieces(archetypeFor(name), name, color),
    [name, color]
  );

  return (
    <group position={[0, 0.03, 0]}>
      {pieces.map((p, i) => (
        <mesh
          key={i}
          position={p.pos}
          rotation={p.rot ?? [0, 0, 0]}
          scale={p.scale ?? [1, 1, 1]}
          castShadow
        >
          <Geometry geo={p.geo} args={p.args} />
          <meshStandardMaterial
            color={p.color}
            roughness={p.rough ?? 0.6}
            metalness={p.metal ?? 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Geometry({ geo, args }: { geo: Geo; args: GeoArgs }) {
  switch (geo) {
    case "sphere":
      return <sphereGeometry args={args as [number, number, number]} />;
    case "box":
      return <boxGeometry args={args as [number, number, number]} />;
    case "cyl":
      return <cylinderGeometry args={args as never} />;
    case "ico":
      return <icosahedronGeometry args={args as [number, number]} />;
    case "torus":
      return <torusGeometry args={args as never} />;
    case "cone":
      return <coneGeometry args={args as [number, number, number]} />;
  }
}
