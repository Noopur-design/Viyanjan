"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/money";
import { getNutrition } from "@/lib/nutrition";
import NutritionModal from "@/components/menu/NutritionModal";
import type { Category, MenuItem } from "@/types";

export default function MenuClient({ categories }: { categories: Category[] }) {
  const add = useCart((s) => s.add);
  const [active, setActive] = useState<string | null>(null);
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // auto-dismiss the "added" toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = (item: MenuItem) => {
    add(item);
    setToast(`${item.name} added to your table`);
  };

  if (categories.length === 0) {
    return (
      <p className="mt-10 text-cream/60">
        No menu items yet — seed the database with{" "}
        <code className="text-gold">npm run db:seed</code>.
      </p>
    );
  }

  const shown = active
    ? categories.filter((c) => c.slug === active)
    : categories;

  return (
    <div className="mt-8">
      {/* category filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
            active === null
              ? "border-gold bg-gold text-char"
              : "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.slug)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
              active === c.slug
                ? "border-gold bg-gold text-char"
                : "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {shown.map((cat) => (
        <section key={cat.id} className="mb-14">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-display text-3xl font-light text-cream">
              {cat.name}
            </h2>
            <span className="h-px flex-1 bg-cream/10" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {(cat.items ?? []).map((item) => {
              const n = getNutrition(item.id, item.name);
              return (
                <div
                  key={item.id}
                  className="group flex gap-5 rounded-2xl border border-cream/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4 transition hover:border-gold/40"
                >
                  {item.imageUrl && (
                    <button
                      onClick={() => setDetail(item)}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-gold/25"
                      aria-label={`View ${item.name} details`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-gold backdrop-blur">
                        {n.calories} kcal
                      </span>
                    </button>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <button
                      onClick={() => setDetail(item)}
                      className="text-left"
                    >
                      <h3 className="font-display text-xl text-cream transition group-hover:text-gold">
                        {item.name}
                        {item.spiceLevel > 0 && (
                          <span className="ml-2 text-xs text-ember">
                            {"🌶".repeat(item.spiceLevel)}
                          </span>
                        )}
                      </h3>
                    </button>
                    <p className="mt-1 line-clamp-2 text-sm text-cream/50">
                      {item.description}
                    </p>

                    {/* quick macro chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Chip>P {n.macros.protein}g</Chip>
                      <Chip>C {n.macros.carbs}g</Chip>
                      <Chip>F {n.macros.fat}g</Chip>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="font-display text-xl text-sand">
                        {formatPrice(item.price)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetail(item)}
                          className="rounded-full border border-cream/20 px-3.5 py-1.5 text-[11px] uppercase tracking-widest text-cream/70 transition hover:border-gold hover:text-gold"
                        >
                          Summary
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          className="rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-gold transition hover:bg-gold hover:text-char active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* nutrition modal */}
      {detail && (
        <NutritionModal
          item={detail}
          onClose={() => setDetail(null)}
          onAdd={() => addToCart(detail)}
        />
      )}

      {/* added-to-cart toast */}
      <div
        className={`fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 transition-all duration-300 ${
          toast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full border border-gold/40 bg-[#160c07] px-5 py-3 shadow-xl">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs text-char">
            ✓
          </span>
          <span className="text-sm text-cream">{toast}</span>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-cream/10 px-2 py-0.5 text-[10px] tracking-wide text-cream/55">
      {children}
    </span>
  );
}
