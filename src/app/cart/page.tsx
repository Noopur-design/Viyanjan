"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/money";
import { apiPost } from "@/lib/fetcher";
import DateTimePicker from "@/components/ui/DateTimePicker";
import SiteFooter from "@/components/home/SiteFooter";
import CartHero from "@/components/cart/CartHero";
import OverheadGlow from "@/components/ui/OverheadGlow";
import type { Order } from "@/types";

type Pay = "COD" | "CARD";

export default function CartPage() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table") ?? "";
  const { lines, setQty, remove, clear, total } = useCart();
  const list = Object.values(lines);
  const itemCount = list.reduce((n, l) => n + l.quantity, 0);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [reservationDate, setReservationDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [pay, setPay] = useState<Pay>("COD");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // light card validation (demo gateway — no real charge)
  const cardValid =
    card.number.replace(/\s/g, "").length >= 15 &&
    /^\d{2}\s*\/\s*\d{2}$/.test(card.expiry) &&
    card.cvc.length >= 3 &&
    card.name.trim().length > 1;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const canPlace =
    !!form.customerName &&
    !!form.phone &&
    emailValid &&
    (pay === "COD" || cardValid) &&
    !placing;

  async function placeOrder() {
    setError(null);
    setPlacing(true);
    try {
      const order = await apiPost<Order>("/api/orders", {
        ...form,
        tableNumber,
        reservationDate: reservationDate || undefined,
        guests,
        paymentMethod: pay,
        items: list.map((l) => ({
          menuItemId: l.item.id,
          quantity: l.quantity,
        })),
      });
      setPlaced(order);
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  /* ----- confirmation ----- */
  if (placed) {
    const paid = placed.paymentStatus === "PAID";
    return (
      <main className="relative">
        <OverheadGlow />
        <section className="mx-auto max-w-xl px-6 pb-24 pt-36 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl text-char">
            ✓
          </span>
          <h1 className="mt-6 font-display text-4xl font-light text-gold">
            Order confirmed
          </h1>
          <p className="mt-3 text-cream/70">
            Thank you, {placed.customerName}. Your order{" "}
            <code className="text-gold">#{placed.id.slice(-6)}</code> is{" "}
            {placed.status.toLowerCase()}.
          </p>
          {placed.email && (
            <p className="mt-2 text-sm text-cream/45">
              A confirmation has been sent to{" "}
              <span className="text-gold">{placed.email}</span>.
            </p>
          )}

          <div className="mx-auto mt-8 max-w-sm space-y-3 rounded-2xl border border-cream/10 bg-[#1a0f0a] p-6 text-left">
            {placed.reservationDate && (
              <Row label="Date & time">
                {new Date(placed.reservationDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Row>
            )}
            <Row label="Items">
              {placed.items.reduce((n, i) => n + i.quantity, 0)}
            </Row>
            <Row label="Table for">
              {placed.guests} {placed.guests === 1 ? "guest" : "guests"}
            </Row>
            <Row label="Table no.">
              {placed.tableNumber || "Walk-in"}
            </Row>
            <Row label="Payment">
              {placed.paymentMethod === "CARD" ? "Card" : "Cash at table"}
            </Row>
            <Row label="Status">
              <span className={paid ? "text-green-400" : "text-gold"}>
                {paid ? "Paid" : "Pay at table"}
              </span>
            </Row>
            <div className="border-t border-cream/10 pt-3">
              <Row label="Total">
                <span className="font-display text-xl text-gold">
                  {formatPrice(placed.totalAmount)}
                </span>
              </Row>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/menu"
              className="rounded-full border border-gold bg-gold px-6 py-3 text-[11px] uppercase tracking-widest text-char transition hover:bg-transparent hover:text-gold"
            >
              Order more
            </Link>
            <Link
              href="/"
              className="rounded-full border border-cream/25 px-6 py-3 text-[11px] uppercase tracking-widest text-cream/70 transition hover:border-gold hover:text-gold"
            >
              Back home
            </Link>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="relative">
      <OverheadGlow />
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-2 text-[10px] text-gold/60">Checkout</div>
            <h1 className="font-display text-4xl font-light text-gold">
              Your Cart
            </h1>
          </div>
          {mounted && list.length > 0 && (
            <span className="text-sm text-cream/45">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/30 via-cream/10 to-transparent" />

        {!mounted ? (
          <p className="mt-8 text-cream/50">Loading your cart…</p>
        ) : list.length === 0 ? (
          <p className="mt-8 text-cream/60">
            Your cart is empty.{" "}
            <Link href="/menu" className="text-gold hover:underline">
              Browse the menu →
            </Link>
          </p>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr]">
            {/* ----- line items ----- */}
            <div className="space-y-3">
              {list.map((l) => (
                <div
                  key={l.item.id}
                  className="group flex items-center gap-4 rounded-2xl border border-cream/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4 transition hover:border-gold/30"
                >
                  {l.item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.item.imageUrl}
                      alt={l.item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-gold/25 transition group-hover:ring-gold/50"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg text-cream">
                      {l.item.name}
                    </div>
                    <div className="text-sm text-cream/50">
                      {formatPrice(l.item.price)} each
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => remove(l.item.id)}
                      className="text-cream/30 transition hover:text-ember"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                    <div className="flex items-center gap-1 rounded-full border border-cream/15 bg-black/30 p-1">
                      <button
                        onClick={() => setQty(l.item.id, l.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-cream/70 transition hover:bg-gold/10 hover:text-gold"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm text-cream">
                        {l.quantity}
                      </span>
                      <button
                        onClick={() => setQty(l.item.id, l.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-cream/70 transition hover:bg-gold/10 hover:text-gold"
                      >
                        +
                      </button>
                    </div>
                    <div className="font-display text-base text-gold">
                      {formatPrice(l.item.price * l.quantity)}
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/menu"
                className="inline-block text-sm text-cream/45 transition hover:text-gold"
              >
                ← Add more dishes
              </Link>

              {/* toast illustration — transparent, no chrome */}
              <div className="mt-6 h-[300px] w-full md:h-[360px]">
                <CartHero />
              </div>

              {/* reassurance perks — fills space + adds trust */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Perk
                  icon="🍃"
                  title="Freshly prepared"
                  desc="Cooked to order in-house"
                />
                <Perk
                  icon="🍽"
                  title="Table service"
                  desc="Brought right to your seat"
                />
                <Perk
                  icon="🔒"
                  title="Secure checkout"
                  desc="Encrypted · no spam"
                />
              </div>
            </div>

            {/* ----- checkout ----- */}
            <div className="rounded-2xl border border-cream/10 bg-[#1a0f0a] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] md:sticky md:top-24 md:self-start">
              {/* totals */}
              <div className="space-y-1.5">
                <Row
                  label={`Subtotal · ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
                >
                  {formatPrice(total())}
                </Row>
                <Row label="Service">Included</Row>
                <div className="border-t border-cream/10 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cream/70">Total</span>
                    <span className="font-display text-2xl text-gold">
                      {formatPrice(total())}
                    </span>
                  </div>
                </div>
              </div>

              {/* contact */}
              <div className="mt-6 space-y-3">
                {(
                  [
                    ["customerName", "Name", true],
                    ["phone", "Phone", true],
                    ["email", "Email (for order confirmation)", true],
                    ["notes", "Notes (optional)", false],
                  ] as const
                ).map(([key, label]) => (
                  <input
                    key={key}
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                          ? "tel"
                          : "text"
                    }
                    placeholder={label}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream/20 bg-black/40 px-3 py-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
                  />
                ))}
              </div>

              {/* reservation date & time */}
              <div className="mt-6">
                <div className="eyebrow mb-2 text-[10px] text-cream/45">
                  Date & time
                </div>
                <DateTimePicker
                  value={reservationDate}
                  onChange={setReservationDate}
                />
                <p className="mt-1 text-[11px] text-cream/40">
                  Leave blank to walk in anytime.
                </p>
              </div>

              {/* party size — table for how many */}
              <div className="mt-6">
                <div className="eyebrow mb-2 text-[10px] text-cream/45">
                  Table for how many?
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuests(g)}
                      className={`h-10 w-10 rounded-full border text-sm transition ${
                        guests === g
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-cream/15 text-cream/60 hover:border-cream/40"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                  {/* 7+ : free entry */}
                  <div
                    className={`flex items-center gap-1 rounded-full border px-3 text-sm transition ${
                      guests > 6
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-cream/15 text-cream/60"
                    }`}
                  >
                    <input
                      type="number"
                      min={7}
                      max={20}
                      placeholder="7+"
                      value={guests > 6 ? guests : ""}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v)) setGuests(Math.min(Math.max(v, 1), 20));
                      }}
                      className="w-12 bg-transparent py-2 text-center focus:outline-none"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-cream/40">
                  {guests} {guests === 1 ? "guest" : "guests"} · we&apos;ll set
                  the table accordingly
                </p>
              </div>

              {/* payment method */}
              <div className="mt-6">
                <div className="eyebrow mb-2 text-[10px] text-cream/45">
                  Payment method
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <PayTab active={pay === "COD"} onClick={() => setPay("COD")}>
                    Cash at table
                  </PayTab>
                  <PayTab active={pay === "CARD"} onClick={() => setPay("CARD")}>
                    Card
                  </PayTab>
                </div>
              </div>

              {/* card form */}
              {pay === "CARD" && (
                <div className="mt-4 space-y-3 rounded-xl border border-cream/10 bg-black/30 p-4">
                  <input
                    inputMode="numeric"
                    placeholder="Card number"
                    value={card.number}
                    onChange={(e) =>
                      setCard((c) => ({
                        ...c,
                        number: formatCardNumber(e.target.value),
                      }))
                    }
                    maxLength={19}
                    className="w-full rounded-xl border border-cream/20 bg-black/40 px-3 py-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
                  />
                  <input
                    placeholder="Name on card"
                    value={card.name}
                    onChange={(e) =>
                      setCard((c) => ({ ...c, name: e.target.value }))
                    }
                    className="w-full rounded-xl border border-cream/20 bg-black/40 px-3 py-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="MM / YY"
                      value={card.expiry}
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          expiry: formatExpiry(e.target.value),
                        }))
                      }
                      maxLength={7}
                      className="w-full rounded-xl border border-cream/20 bg-black/40 px-3 py-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
                    />
                    <input
                      inputMode="numeric"
                      placeholder="CVC"
                      value={card.cvc}
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      className="w-full rounded-xl border border-cream/20 bg-black/40 px-3 py-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-cream/35">
                    🔒 Demo checkout — no real card is charged. Use any test
                    number like 4242 4242 4242 4242.
                  </p>
                </div>
              )}

              {error && <p className="mt-3 text-sm text-ember">{error}</p>}

              <button
                disabled={!canPlace}
                onClick={placeOrder}
                className="mt-5 w-full rounded-full border border-gold bg-gold py-3.5 text-[11px] uppercase tracking-[0.2em] text-char shadow-[0_10px_30px_-10px_rgba(212,175,55,0.55)] transition hover:bg-transparent hover:text-gold hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {placing
                  ? "Processing…"
                  : pay === "CARD"
                    ? `Pay ${formatPrice(total())}`
                    : "Place order"}
              </button>
              <p className="mt-3 text-center text-[11px] text-cream/35">
                {pay === "CARD"
                  ? "You'll be charged once your order is confirmed."
                  : "Pay with cash when your order is served."}
              </p>
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}

/* ---------- helpers & small components ---------- */

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-cream/55">{label}</span>
      <span className="text-cream/85">{children}</span>
    </div>
  );
}

function PayTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-3 text-xs uppercase tracking-widest transition ${
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-cream/15 text-cream/55 hover:border-cream/40"
      }`}
    >
      {children}
    </button>
  );
}

function Perk({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-cream/10 bg-white/[0.02] p-4 transition hover:border-gold/25">
      <div className="text-xl">{icon}</div>
      <div className="mt-2 text-sm text-cream/85">{title}</div>
      <div className="mt-0.5 text-xs leading-snug text-cream/45">{desc}</div>
    </div>
  );
}

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
}
