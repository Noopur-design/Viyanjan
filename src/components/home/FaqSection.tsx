"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Do I need a reservation?",
    a: "Reservations are recommended, especially on weekends. Walk-ins are welcome whenever a table is free — book online to be sure of your spot.",
  },
  {
    q: "Where are you located?",
    a: "We're in Sector 29, Gurgaon — in the heart of the dining district, with easy access and parking nearby.",
  },
  {
    q: "Do you have vegetarian and allergen-friendly options?",
    a: "Yes. A good part of our rotating menu is vegetarian, and most dishes can be adapted for common allergies — just let us know when you book or order.",
  },
  {
    q: "What are your hours?",
    a: "We serve Tuesday through Sunday, 5:00 pm to 11:00 pm. We're closed on Mondays.",
  },
  {
    q: "Can I host a private event or large party?",
    a: "Absolutely. For groups, celebrations, and private dining, reach us at events@viyanjan.com and we'll tailor the table to your evening.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:px-12">
      <p className="eyebrow text-center text-[11px] text-gold/80">Questions</p>
      <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
        Good to know
      </h2>

      <div className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-gold"
              >
                <span className="font-display text-lg text-cream md:text-xl">
                  {f.q}
                </span>
                <span
                  className={`shrink-0 text-2xl font-light leading-none text-gold transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 leading-relaxed text-cream/60">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
