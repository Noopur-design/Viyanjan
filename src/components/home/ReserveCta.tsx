import Link from "next/link";
import Reveal from "./Reveal";

export default function ReserveCta() {
  return (
    <section
      id="reserve"
      className="relative overflow-hidden border-y border-gold/15 bg-[radial-gradient(120%_140%_at_50%_0%,#3a2114_0%,#1a0f0a_60%)] py-28 text-center"
    >
      <Reveal>
        <p className="eyebrow text-[11px] text-gold/80">Reserve</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-light leading-tight text-cream md:text-6xl">
          Your table is turning.
          <br />
          <span className="italic text-sand">Come find your dish.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-cream/55">
          Join us for an evening where the world arrives one plate at a time.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/cart"
            className="rounded-sm border border-gold bg-gold px-8 py-3.5 text-[11px] uppercase tracking-[0.25em] text-char transition hover:bg-transparent hover:text-gold"
          >
            Reserve a table
          </Link>
          <Link
            href="/menu"
            className="rounded-sm border border-cream/30 px-8 py-3.5 text-[11px] uppercase tracking-[0.25em] text-cream transition hover:border-gold hover:text-gold"
          >
            Explore the menu
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
