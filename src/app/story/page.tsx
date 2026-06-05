import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/home/Reveal";
import ReserveCta from "@/components/home/ReserveCta";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Our Story — Viyanjan",
  description:
    "How one rotating table came to carry the soul of the world's kitchens.",
};

const PILLARS = [
  {
    title: "Seasonal sourcing",
    body: "We buy what the season gives — at its peak, never against it. The menu turns with the markets.",
  },
  {
    title: "Cooked by instinct",
    body: "Recipes are a starting point. Our chefs taste, adjust, and trust the hand that has done it a thousand times.",
  },
  {
    title: "Plated as theatre",
    body: "The table turns, the cloche lifts, the dish arrives. Dinner here is something you watch as much as you taste.",
  },
];

const TIMELINE = [
  {
    year: "2019",
    title: "One table, one idea",
    body: "Viyanjan opens in Sector 29, Gurgaon with a single rotating table and a menu spanning four cuisines.",
  },
  {
    year: "2021",
    title: "The world arrives",
    body: "We add Japanese, Greek, and Spanish kitchens — seven cuisines now share one revolving stage.",
  },
  {
    year: "2023",
    title: "A name for craft",
    body: "Recognised by The Plate for 'theatre you can taste,' our tasting evenings book weeks ahead.",
  },
  {
    year: "Today",
    title: "Still turning",
    body: "Forty signature dishes, one unforgettable table, and a story that grows with every guest.",
  },
];

const JOURNEY = [
  { cuisine: "Italian", img: "/images/dishes/52796.jpg", note: "Roman trattorias" },
  { cuisine: "Japanese", img: "/images/dishes/52773.jpg", note: "Tokyo izakayas" },
  { cuisine: "Mexican", img: "/images/dishes/52819.jpg", note: "Oaxacan markets" },
  { cuisine: "Greek", img: "/images/dishes/52764.jpg", note: "Aegean tavernas" },
  { cuisine: "Chinese", img: "/images/dishes/53366.jpg", note: "Sichuan kitchens" },
  { cuisine: "Spanish", img: "/images/dishes/53158.jpg", note: "Sevillan bars" },
];

export default function StoryPage() {
  return (
    <main>
      {/* ---- hero ---- */}
      <section className="relative overflow-hidden px-6 pb-20 pt-40 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#3a2114_0%,#140b07_60%)]" />
        <Reveal className="relative">
          <p className="eyebrow text-[11px] text-gold/80">Our Story</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-cream md:text-7xl">
            The soul of every kitchen,
            <br />
            <span className="italic text-sand">on one turning table</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl leading-relaxed text-cream/60">
            Viyanjan — Sanskrit for a fine spread of dishes — began with a
            question: what if a single table could carry the whole world?
          </p>
        </Reveal>
      </section>

      {/* ---- founding narrative ---- */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-cream/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/dishes/52961.jpg"
                alt="A signature Viyanjan plate"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-display text-4xl font-light leading-tight text-cream">
              It started with a
              <br />
              <span className="italic text-sand">homesick</span> dinner
            </h2>
            <p className="mt-6 leading-relaxed text-cream/60">
              Our founders had eaten their way across four continents — and kept
              missing the meals of the last place the moment they left. Viyanjan
              was their answer: a room where you needn&apos;t choose between Rome
              and Tokyo, between Seville and Sichuan.
            </p>
            <p className="mt-4 leading-relaxed text-cream/60">
              The rotating table was never a gimmick. It was the only honest way
              to serve a world that refuses to sit still — a stage where each
              cuisine takes its turn, and every guest becomes a traveller.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- philosophy pillars ---- */}
      <section className="border-y border-cream/10 bg-black/20 py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <p className="eyebrow text-center text-[11px] text-gold/80">
              What we believe
            </p>
            <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
              Three things, always
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="h-full rounded-2xl border border-cream/10 bg-[#1a0f0a] p-8">
                  <span className="font-display text-5xl text-gold/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-cream">
                    {p.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-cream/55">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- timeline ---- */}
      <section className="mx-auto max-w-3xl px-6 py-28 md:px-12">
        <Reveal>
          <p className="eyebrow text-center text-[11px] text-gold/80">
            The journey
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
            How we got here
          </h2>
        </Reveal>
        <div className="mt-14 space-y-2">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 100}>
              <div className="flex gap-6 border-l border-cream/15 pb-10 pl-6 last:pb-0">
                <div>
                  <div className="font-display text-3xl text-gold">{t.year}</div>
                  <h3 className="mt-2 font-display text-xl text-cream">
                    {t.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-cream/55">{t.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- cuisines journey ---- */}
      <section className="border-t border-cream/10 bg-black/20 py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <Reveal>
            <p className="eyebrow text-center text-[11px] text-gold/80">
              Seven passports
            </p>
            <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
              Where the dishes come from
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.cuisine} delay={i * 90}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-cream/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={j.img}
                    alt={j.cuisine}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-display text-2xl text-cream">
                      {j.cuisine}
                    </h3>
                    <p className="eyebrow text-[10px] text-cream/60">{j.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- chef quote ---- */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center md:px-12">
        <Reveal>
          <p className="font-display text-3xl font-light italic leading-relaxed text-cream/90 md:text-4xl">
            “We don&apos;t cook to impress. We cook so that for one evening, the
            world feels small enough to share at a single table.”
          </p>
          <div className="mt-8">
            <div className="font-display text-xl text-gold">Chef Arav Mehta</div>
            <div className="eyebrow mt-1 text-[10px] text-cream/45">
              Founder &amp; Executive Chef
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- shared CTA + footer ---- */}
      <ReserveCta />
      <SiteFooter />
    </main>
  );
}
