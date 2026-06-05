import Reveal from "./Reveal";

const STATS = [
  { value: "2019", label: "Established" },
  { value: "7", label: "Cuisines" },
  { value: "40+", label: "Signature dishes" },
  { value: "★ ★ ★", label: "Fine dining" },
];

export default function StorySection() {
  return (
    <section
      id="story"
      className="relative mx-auto max-w-6xl px-6 py-28 md:px-12"
    >
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="eyebrow text-[11px] text-gold/80">Our Story</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight text-cream md:text-5xl">
            A table set where the
            <br />
            <span className="italic text-sand">world</span> comes to dine
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cream/60">
            Viyanjan began with a simple idea — that one table could carry the
            soul of every kitchen on earth. From the trattorias of Rome to the
            izakayas of Tokyo, each plate is a passage. We source by season,
            cook by instinct, and plate as if every guest were our first.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-cream/60">
            Lift a cloche and you don&apos;t just find a dish — you find the
            craft, the country, and the hands that made it.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-2 bg-[#1a0f0a] px-6 py-12 text-center"
              >
                <span className="font-display text-4xl text-gold">
                  {s.value}
                </span>
                <span className="eyebrow text-[10px] text-cream/50">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
