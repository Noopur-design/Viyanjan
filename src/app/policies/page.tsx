import type { Metadata } from "next";
import Reveal from "@/components/home/Reveal";
import SiteFooter from "@/components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Policies — Viyanjan",
  description:
    "Reservations, cancellations, privacy, allergens, and the terms of dining with us.",
};

const SECTIONS = [
  {
    id: "reservations",
    title: "Reservations & cancellations",
    paras: [
      "Reservations are held for 15 minutes past the booked time, after which the table may be released. For parties of six or more, a card is required to secure the booking.",
      "Cancellations made at least 24 hours in advance are free of charge. Cancellations within 24 hours, or no-shows, may incur a fee of $35 per guest. To cancel or amend a booking, contact us by phone or email.",
    ],
  },
  {
    id: "allergens",
    title: "Allergens & dietary needs",
    paras: [
      "Our kitchen handles nuts, dairy, gluten, shellfish, and other common allergens. While we take every precaution, we cannot guarantee a fully allergen-free environment.",
      "Please tell us about any allergies or dietary requirements when you reserve, and again with your server. Vegetarian, vegan, and gluten-free options are available across every cuisine on our menu.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    paras: [
      "We collect only the information needed to manage your reservation and improve your experience — your name, contact details, and any preferences you share. We never sell your data.",
      "Information submitted through our contact and reservation forms is used solely to respond to your request. You may ask us to delete your details at any time by emailing hello@viyanjan.com.",
    ],
  },
  {
    id: "terms",
    title: "Terms of service",
    paras: [
      "Prices are listed in your local currency and include applicable taxes unless stated otherwise. A discretionary service charge may apply to larger parties.",
      "Viyanjan reserves the right to refuse service in line with our commitment to a safe, respectful environment for guests and staff alike. Smart-casual to formal dress is appreciated.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paras: [
      "Our website uses minimal cookies to remember your cart and preferences. We do not use third-party advertising trackers. You can clear cookies at any time through your browser settings.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <main>
      {/* hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-40 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#3a2114_0%,#140b07_60%)]" />
        <Reveal className="relative">
          <p className="eyebrow text-[11px] text-gold/80">Policies</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-cream md:text-7xl">
            The fine print,
            <br />
            <span className="italic text-sand">kept plain</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/60">
            How we handle reservations, allergens, your privacy, and the terms
            of dining with us.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-[200px_1fr] md:px-12">
        {/* sticky index */}
        <aside className="hidden md:block">
          <div className="sticky top-28">
            <div className="eyebrow text-[10px] text-gold/70">Contents</div>
            <ul className="mt-4 space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-cream/55 transition hover:text-gold"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* sections */}
        <div className="space-y-14">
          {SECTIONS.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-28">
                <h2 className="font-display text-3xl font-light text-gold">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.paras.map((p, i) => (
                    <p key={i} className="leading-[1.9] text-cream/65">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
          <p className="border-t border-cream/10 pt-6 text-xs text-cream/35">
            Last updated May 2026. Questions? Email{" "}
            <a href="mailto:hello@viyanjan.com" className="text-gold">
              hello@viyanjan.com
            </a>
            .
          </p>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
