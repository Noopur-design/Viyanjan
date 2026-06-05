"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/story", label: "Story" },
  { href: "/blog", label: "Journal" },
];

export default function SiteNav() {
  const count = useCart((s) => s.count());
  // The cart is persisted in localStorage, so the count is only known on the
  // client. Render nothing until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const cartLabel = `Reserve a table${mounted && count > 0 ? ` · ${count}` : ""}`;

  return (
    <header className="fixed top-0 z-50 w-full px-5 py-5 sm:px-6 sm:py-6 md:px-12">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl font-medium tracking-[0.3em] text-cream sm:text-2xl sm:tracking-[0.4em]"
        >
          VIYANJAN
        </Link>

        {/* desktop links */}
        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="eyebrow text-[11px] text-cream/70 transition hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* desktop CTA */}
        <Link
          href="/cart"
          className="hidden rounded-sm border border-gold/50 bg-gold/10 px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-gold transition hover:bg-gold hover:text-char md:inline-block"
        >
          {cartLabel}
        </Link>

        {/* mobile controls: cart pill + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold transition hover:bg-gold hover:text-char"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-char">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-gold hover:text-gold"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* mobile dropdown menu (animated open/close) */}
      <div
        aria-hidden={!open}
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          open ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className={`flex flex-col gap-1 rounded-2xl border border-cream/10 bg-[#1d1109]/95 p-3 backdrop-blur-md transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "-translate-y-3 pointer-events-none"
          }`}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] text-cream/80 transition hover:bg-gold/10 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg border border-gold/50 bg-gold/10 px-4 py-3 text-center text-[11px] uppercase tracking-[0.25em] text-gold transition hover:bg-gold hover:text-char"
          >
            {cartLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
