"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "How does the rotating table experience work?",
    a: "Your table presents a curated selection of dishes under cloches. Choose a dish and the table turns to bring it forward, lifting the cloche to reveal it — then you order what you love.",
  },
  {
    q: "Do you cater to dietary restrictions and allergies?",
    a: "Absolutely. Every cuisine on our menu offers vegetarian options, and our kitchen accommodates gluten-free, nut-free, and vegan requests. Just note them when you reserve.",
  },
  {
    q: "Is there a dress code?",
    a: "Smart casual to formal. We want you comfortable, but the room leans elegant — think of it as a night worth dressing for.",
  },
  {
    q: "How far in advance should I reserve?",
    a: "Weekends book one to two weeks out. For special occasions or larger parties, we recommend reserving as early as you can — and tell us, we love to celebrate.",
  },
  {
    q: "Can I host a private event or large group?",
    a: "Yes. We offer private dining for groups of 8 to 40, with bespoke multi-cuisine tasting menus. Reach out through the reservation form and we'll design the evening with you.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-display text-xl text-cream">{q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/25 text-gold transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <p className="overflow-hidden leading-relaxed text-cream/60">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28 md:px-12">
      <Reveal>
        <p className="eyebrow text-center text-[11px] text-gold/80">
          Good to Know
        </p>
        <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
          Frequently asked
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-12">
          {FAQS.map((f) => (
            <Item key={f.q} {...f} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
