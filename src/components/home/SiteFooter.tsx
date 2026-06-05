import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-cream/10 bg-[#0c0704] px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="font-display text-2xl tracking-[0.4em] text-cream">
            VIYANJAN
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/50">
            Where every plate tells a story. A rotating table of the world&apos;s
            finest cuisines, in the heart of Gurgaon.
          </p>
        </div>

        <div>
          <div className="eyebrow text-[10px] text-gold/70">Visit</div>
          <ul className="mt-4 space-y-2 text-sm text-cream/55">
            <li>Sector 29</li>
            <li>Gurgaon, Haryana 122002</li>
            <li>Tue – Sun · 5pm – 11pm</li>
            <li>+91 124 555 0142</li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-[10px] text-gold/70">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["Menu", "/menu"],
              ["Story", "/story"],
              ["Journal", "/blog"],
              ["Reserve", "/cart"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-cream/55 transition hover:text-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-[10px] text-gold/70">Company</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Policies", "/policies"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-cream/55 transition hover:text-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/35 md:flex-row">
        <span>© {new Date().getFullYear()} Viyanjan. All rights reserved.</span>
        <span className="eyebrow text-[10px]">Crafted with fire & patience</span>
      </div>
    </footer>
  );
}
