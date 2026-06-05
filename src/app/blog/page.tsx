import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/home/Reveal";
import SiteFooter from "@/components/home/SiteFooter";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "The Journal — Viyanjan",
  description:
    "Food stories, craft notes, and the thinking behind the turning table.",
};

export default function BlogPage() {
  const [feature, ...rest] = POSTS;

  return (
    <main>
      {/* hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-40 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#3a2114_0%,#140b07_60%)]" />
        <Reveal className="relative">
          <p className="eyebrow text-[11px] text-gold/80">The Journal</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-cream md:text-7xl">
            Stories from
            <br />
            <span className="italic text-sand">the kitchen</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/60">
            Notes on craft, sourcing, spice, and the thinking behind every
            turn of the table.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-28 md:px-12">
        {/* featured post */}
        <Reveal>
          <Link
            href={`/blog/${feature.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-cream/10 md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={feature.image}
                alt={feature.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 bg-[#1a0f0a] p-8 md:p-12">
              <div className="flex items-center gap-3 text-cream/45">
                <span className="eyebrow text-[10px] text-gold">
                  {feature.category}
                </span>
                <span className="text-xs">· {feature.readMins} min read</span>
              </div>
              <h2 className="font-display text-3xl font-light leading-tight text-cream transition group-hover:text-gold md:text-4xl">
                {feature.title}
              </h2>
              <p className="leading-relaxed text-cream/55">
                {feature.excerpt}
              </p>
              <div className="mt-2 text-sm text-cream/45">
                {feature.author} · {feature.date}
              </div>
              <span className="eyebrow mt-2 text-[10px] text-gold">
                Read story →
              </span>
            </div>
          </Link>
        </Reveal>

        {/* grid of the rest */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-[#1a0f0a] transition hover:border-gold/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-light leading-tight text-cream transition group-hover:text-gold">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/50">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 text-xs text-cream/40">
                    {p.author} · {p.readMins} min read
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
