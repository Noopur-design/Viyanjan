"use client";

import Reveal from "./Reveal";

const CLIPS = [
  {
    src: "/videos/kitchen.mp4",
    title: "In the kitchen",
    caption: "Where every service begins",
    big: true,
  },
  {
    src: "/videos/story.mp4",
    title: "The art of plating",
    caption: "Precision, repeated nightly",
    big: false,
  },
  {
    src: "/videos/plating.mp4",
    title: "Fire & flavour",
    caption: "Heat, timed to the second",
    big: false,
  },
];

function VideoTile({ clip }: { clip: (typeof CLIPS)[number] }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-cream/10 ${
        clip.big ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full min-h-[220px] w-full object-cover transition duration-700 group-hover:scale-105"
      >
        <source src={clip.src} type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 p-5 text-left">
        <h3 className="font-display text-2xl text-cream">{clip.title}</h3>
        <p className="text-xs tracking-wide text-cream/60">{clip.caption}</p>
      </div>
    </div>
  );
}

export default function VideoSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20 md:px-12">
      <Reveal>
        <p className="eyebrow text-center text-[11px] text-gold/80">
          Behind the Pass
        </p>
        <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
          Watch the craft unfold
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 grid auto-rows-[220px] gap-4 md:grid-cols-3">
          {CLIPS.map((c) => (
            <VideoTile key={c.src} clip={c} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
