"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import Link from "next/link";
import RotatingTable from "@/components/scene/RotatingTable";
import Dust from "@/components/scene/Dust";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/money";
import type { MenuItem } from "@/types";

export default function HomeExperience({ items }: { items: MenuItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const add = useCart((s) => s.add);
  const current = selected !== null ? items[selected] : null;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const select = (i: number) =>
    setSelected((prev) => (prev === i ? null : i));

  return (
    <section className="relative h-[82vh] w-full overflow-hidden md:h-screen">
      {/* ---- 3D canvas ---- */}
      {mounted && (
        <Canvas
          key={isMobile ? "m" : "d"}
          shadows
          dpr={[1, 2]}
          camera={{
            position: isMobile ? [0, 5.2, 11.2] : [0, 4.6, 7.4],
            fov: isMobile ? 40 : 38,
          }}
          className="absolute inset-0"
          gl={{ alpha: true, antialias: true }}
        >
          {/* three lights, all aimed straight down onto the table */}
          <ambientLight intensity={0.22} color="#ffd9a8" />
          <spotLight
            position={[0, 11, 0.5]}
            angle={0.6}
            penumbra={1}
            intensity={150}
            color="#ffe6c0"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <spotLight
            position={[-5, 9, -2]}
            angle={0.75}
            penumbra={1}
            intensity={70}
            color="#b5642a"
          />
          <spotLight
            position={[5, 9, 3]}
            angle={0.75}
            penumbra={1}
            intensity={55}
            color="#e8b06a"
          />

          <Suspense fallback={null}>
            <RotatingTable
              items={items}
              selectedIndex={selected}
              playing={playing}
              onSelect={select}
            />
            <Dust />
            <ContactShadows
              position={[0, -1.7, 0]}
              opacity={0.6}
              scale={16}
              blur={3}
              far={5}
              color="#000000"
            />
            <Environment preset="night" />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={false}
            target={isMobile ? [0, 2, 0] : [0, 0, 0]}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.3}
            minAzimuthAngle={-Math.PI / 5}
            maxAzimuthAngle={Math.PI / 5}
          />
        </Canvas>
      )}

      {/* ---- vignette over the canvas for depth ---- */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_60%,transparent_40%,rgba(8,4,2,0.55)_100%)]" />

      {/* ---- editorial overlay ---- */}
      <div className="pointer-events-none absolute inset-0 px-6 md:px-12">
        {/* play / pause control (top-left, like the reference) */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="pointer-events-auto absolute left-6 top-28 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream/80 backdrop-blur-sm transition hover:border-gold hover:text-gold md:left-12"
          aria-label={playing ? "Pause rotation" : "Play rotation"}
        >
          {playing ? (
            <span className="block h-3 w-3 rounded-full bg-current" />
          ) : (
            <span className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
          )}
        </button>

        {/* left progress rail */}
        <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              className={`pointer-events-auto h-1.5 w-1.5 rounded-full transition-all ${
                selected === i
                  ? "scale-150 bg-gold"
                  : "bg-cream/30 hover:bg-cream/60"
              }`}
              aria-label={`Dish ${i + 1}`}
            />
          ))}
        </div>

        {/* headline block, bottom-left */}
        <div className="absolute left-6 top-44 max-w-xl md:bottom-28 md:left-12 md:top-auto">
          <p className="eyebrow fade-up text-[11px] text-gold/80">
            Sector 29, Gurgaon · Est. 2019
          </p>
          <h1 className="fade-up delay-1 mt-4 font-display text-[2.6rem] font-light leading-[0.95] text-cream sm:text-[3.5rem] md:text-[5.5rem]">
            Where every
            <br />
            <span className="italic text-sand">plate</span> tells
            <br />
            a story
          </h1>
          <p className="fade-up delay-2 mt-5 text-sm tracking-wide text-cream/55">
            Lift a cloche. Discover the craft.
          </p>
        </div>

        {/* bottom-left: rotate-to-explore hint */}
        <div className="absolute bottom-8 left-6 hidden items-center gap-3 md:flex md:left-12">
          <span className="h-px w-12 bg-cream/40" />
          <span className="eyebrow text-[10px] text-cream/50">
            Rotate to explore
          </span>
        </div>

        {/* bottom-right: rotate the table label */}
        <div className="absolute bottom-8 right-6 hidden items-center gap-3 md:flex md:right-12">
          <span className="eyebrow text-[10px] text-cream/50">
            Rotate the table
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream/60">
            ↻
          </span>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="eyebrow text-[9px] text-cream/40">Scroll</span>
          <span className="flex h-8 w-5 items-start justify-center rounded-full border border-cream/30 p-1">
            <span className="h-1.5 w-1 animate-bounce rounded-full bg-cream/60" />
          </span>
        </div>
      </div>

      {/* ---- selected dish card ---- */}
      {current && (
        <div className="fade-up pointer-events-auto absolute inset-x-4 top-20 z-20 rounded-2xl border border-cream/12 bg-[#160d07] p-5 backdrop-blur-md md:inset-x-auto md:top-auto md:right-12 md:bottom-28 md:w-72 md:p-6">
          <div className="eyebrow text-[10px] text-gold">
            {current.category?.name ?? "Featured"}
          </div>
          <h3 className="mt-2 font-display text-3xl font-light text-cream">
            {current.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/55">
            {current.description}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-display text-2xl text-sand">
              {formatPrice(current.price)}
            </span>
            <button
              onClick={() => add(current)}
              className="rounded-full border border-gold/60 bg-gold/10 px-4 py-2 text-xs uppercase tracking-widest text-gold transition hover:bg-gold hover:text-char"
            >
              Add to table
            </button>
          </div>
          <Link
            href="/menu"
            className="mt-4 block text-center text-[11px] uppercase tracking-widest text-cream/45 transition hover:text-gold"
          >
            See full menu →
          </Link>
        </div>
      )}
    </section>
  );
}
