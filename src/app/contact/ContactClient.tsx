"use client";

import { useState } from "react";
import Reveal from "@/components/home/Reveal";
import SiteFooter from "@/components/home/SiteFooter";

const DETAILS = [
  { label: "Address", lines: ["Sector 29", "Gurgaon, Haryana 122002"] },
  { label: "Hours", lines: ["Tuesday – Sunday", "5:00 pm – 11:00 pm"] },
  { label: "Phone", lines: ["+91 124 555 0142"] },
  { label: "Email", lines: ["hello@viyanjan.com", "events@viyanjan.com"] },
];

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Reservation",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend mail service wired up — acknowledge locally.
    setSent(true);
  };

  return (
    <main>
      {/* hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-40 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#3a2114_0%,#140b07_60%)]" />
        <Reveal className="relative">
          <p className="eyebrow text-[11px] text-gold/80">Contact</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-cream md:text-7xl">
            Come say
            <span className="italic text-sand"> hello</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/60">
            Reservations, private events, or simply a question — we&apos;d love
            to hear from you.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:px-12">
        {/* details */}
        <Reveal>
          <div className="grid grid-cols-2 gap-6">
            {DETAILS.map((d) => (
              <div key={d.label}>
                <div className="eyebrow text-[10px] text-gold/70">
                  {d.label}
                </div>
                <div className="mt-2 space-y-1 text-sm text-cream/60">
                  {d.lines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-cream/10">
            <iframe
              title="Viyanjan location"
              className="h-64 w-full grayscale-[0.4]"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.0650%2C28.4560%2C77.0950%2C28.4760&layer=mapnik&marker=28.4660%2C77.0800"
            />
          </div>
        </Reveal>

        {/* form */}
        <Reveal delay={120}>
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-gold/30 bg-gold/5 p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl text-char">
                ✓
              </span>
              <h2 className="mt-5 font-display text-3xl text-cream">
                Message received
              </h2>
              <p className="mt-2 text-cream/60">
                Thank you, {form.name || "friend"}. Our team will be in touch
                within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", subject: "Reservation", message: "" });
                }}
                className="mt-6 rounded-full border border-cream/25 px-5 py-2.5 text-[11px] uppercase tracking-widest text-cream/70 transition hover:border-gold hover:text-gold"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="space-y-4 rounded-2xl border border-cream/10 bg-[#1a0f0a] p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  required
                />
              </div>
              <div>
                <label className="eyebrow text-[10px] text-cream/45">
                  Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-cream/20 bg-black/40 px-3 py-2.5 text-cream focus:border-gold focus:outline-none"
                >
                  {["Reservation", "Private event", "Feedback", "Other"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="eyebrow text-[10px] text-cream/45">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="mt-1.5 w-full resize-none rounded-lg border border-cream/20 bg-black/40 px-3 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
                  placeholder="Tell us how we can help…"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full border border-gold bg-gold py-3 text-[11px] uppercase tracking-[0.25em] text-char transition hover:bg-transparent hover:text-gold"
              >
                Send message
              </button>
            </form>
          )}
        </Reveal>
      </div>

      <SiteFooter />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="eyebrow text-[10px] text-cream/45">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-cream/20 bg-black/40 px-3 py-2.5 text-cream focus:border-gold focus:outline-none"
      />
    </div>
  );
}
