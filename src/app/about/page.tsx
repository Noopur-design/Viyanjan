import type { Metadata } from "next";
import Reveal from "@/components/home/Reveal";
import ReserveCta from "@/components/home/ReserveCta";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: "About — Viyanjan",
  description:
    "Who we are: the people, the room, and the idea behind the turning table.",
};

const VALUES = [
  {
    title: "Hospitality first",
    body: "A great meal begins the moment you walk in. We treat every guest as the reason we opened the doors.",
  },
  {
    title: "Craft over shortcuts",
    body: "Stocks simmered for hours, bread baked in-house, sauces built by hand. We do the slow things properly.",
  },
  {
    title: "A world on one table",
    body: "Seven cuisines, no hierarchy. Every kitchen takes its turn on the same revolving stage.",
  },
];

const TEAM = [
  { name: "Arav Mehta", role: "Founder & Executive Chef", img: "/images/dishes/52796.jpg" },
  { name: "Lena Park", role: "Sous Chef", img: "/images/dishes/52773.jpg" },
  { name: "Marco Ferri", role: "Maître d'", img: "/images/dishes/52961.jpg" },
];

export default function AboutPage() {
  return (
    <main>
      {/* hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-40 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#3a2114_0%,#140b07_60%)]" />
        <Reveal className="relative">
          <p className="eyebrow text-[11px] text-gold/80">About Us</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-cream md:text-7xl">
            One room, the
            <br />
            <span className="italic text-sand">whole world</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/60">
            Viyanjan is a fine-dining restaurant built around a single idea — a
            table that turns, carrying the soul of the world&apos;s kitchens to
            every guest.
          </p>
        </Reveal>
      </section>

      {/* intro */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <Reveal>
          <p className="font-display text-2xl font-light leading-relaxed text-cream/85">
            We opened in 2019 with one table and four cuisines. Today we serve
            seven, plated as theatre and sourced by season — but the heart of
            the place hasn&apos;t changed.
          </p>
          <p className="mt-6 leading-relaxed text-cream/60">
            Our team comes from kitchens across four continents. What unites us
            isn&apos;t a single flavour but a shared standard: cook with respect
            for the origin, plate with restraint, and make every guest feel like
            the most important person in the room.
          </p>
        </Reveal>
      </section>

      {/* values */}
      <section className="border-y border-cream/10 bg-black/20 py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-light text-cream md:text-5xl">
              What we stand for
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="h-full rounded-2xl border border-cream/10 bg-[#1a0f0a] p-8">
                  <span className="font-display text-5xl text-gold/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-cream">
                    {v.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-cream/55">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <Reveal>
          <p className="eyebrow text-center text-[11px] text-gold/80">
            The people
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
            Behind the pass
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <div className="overflow-hidden rounded-2xl border border-cream/10 bg-[#1a0f0a]">
                <div className="aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display text-2xl text-cream">{m.name}</h3>
                  <p className="eyebrow mt-1 text-[10px] text-cream/45">
                    {m.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ReserveCta />
      <SiteFooter />
    </main>
  );
}
