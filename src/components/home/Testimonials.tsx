import Reveal from "./Reveal";

const REVIEWS = [
  {
    quote:
      "The rotating table isn't a gimmick — it's theatre. By the time my cloche lifted, I was already in love with the meal.",
    name: "Amara Whitfield",
    role: "Food critic, The Plate",
  },
  {
    quote:
      "Seven cuisines, one evening, not a single misstep. The Honey Teriyaki Salmon alone is worth the reservation.",
    name: "Daniel Okafor",
    role: "Regular guest",
  },
  {
    quote:
      "We came for the anniversary and stayed for the story behind every dish. The most memorable dinner of the year.",
    name: "Sofia & Marco Ferri",
    role: "Celebrating 10 years",
  },
];

function Stars() {
  return (
    <div className="text-gold" aria-label="5 out of 5 stars">
      {"★".repeat(5)}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative border-y border-cream/10 bg-black/20 py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow text-center text-[11px] text-gold/80">
            Guest Tales
          </p>
          <h2 className="mt-4 text-center font-display text-4xl font-light text-cream md:text-5xl">
            What our guests say
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl border border-cream/10 bg-[#1a0f0a] p-8">
                <Stars />
                <blockquote className="mt-5 flex-1 font-display text-xl font-light italic leading-relaxed text-cream/85">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-cream/10 pt-4">
                  <div className="text-cream">{r.name}</div>
                  <div className="eyebrow text-[10px] text-cream/45">
                    {r.role}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
