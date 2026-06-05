"use client";

import { useEffect } from "react";
import { getNutrition } from "@/lib/nutrition";
import { formatPrice } from "@/lib/money";
import type { MenuItem } from "@/types";

function Ring({
  pct,
  color,
  label,
  value,
}: {
  pct: number;
  color: string;
  label: string;
  value: string;
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = Math.min(pct, 100) / 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#ffffff14" strokeWidth="6" />
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${c * dash} ${c}`}
        />
      </svg>
      <div className="text-center">
        <div className="font-display text-base text-cream">{value}</div>
        <div className="eyebrow text-[9px] text-cream/45">{label}</div>
      </div>
    </div>
  );
}

function MicroBar({
  label,
  value,
  unit,
  pct,
}: {
  label: string;
  value: number;
  unit: string;
  pct: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-cream/60">
        <span>{label}</span>
        <span className="text-cream/80">
          {value}
          {unit}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember to-gold"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function NutritionModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: () => void;
}) {
  const n = getNutrition(item.id, item.name);
  const { protein, carbs, fat } = n.macros;
  const macroCals = { p: protein * 4, c: carbs * 4, f: fat * 9 };

  // lock scroll while open + close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-cream/12 bg-[#160c07] sm:rounded-3xl"
      >
        {/* header image */}
        <div className="relative h-44 w-full overflow-hidden rounded-t-3xl">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-velvet" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#160c07] via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-cream/80 backdrop-blur transition hover:text-gold"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-5">
            <div className="eyebrow text-[10px] text-gold">
              {item.category?.name ?? "Featured"}
            </div>
            <h3 className="font-display text-3xl text-cream">{item.name}</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm leading-relaxed text-cream/55">
            {item.description}
          </p>

          {/* calories banner */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4">
            <div>
              <div className="font-display text-4xl text-gold">
                {n.calories}
              </div>
              <div className="eyebrow text-[10px] text-cream/50">
                kcal · per {n.servingG}g serving
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl text-sand">
                {formatPrice(item.price)}
              </div>
              {item.spiceLevel > 0 && (
                <div className="text-xs text-ember">
                  {"🌶".repeat(item.spiceLevel)} spice
                </div>
              )}
            </div>
          </div>

          {/* macros */}
          <div className="mt-6">
            <div className="eyebrow mb-3 text-[10px] text-cream/45">
              Macronutrients
            </div>
            <div className="flex justify-around">
              <Ring
                label="Protein"
                value={`${protein}g`}
                pct={(macroCals.p / n.calories) * 100}
                color="#e0795a"
              />
              <Ring
                label="Carbs"
                value={`${carbs}g`}
                pct={(macroCals.c / n.calories) * 100}
                color="#d8a24a"
              />
              <Ring
                label="Fat"
                value={`${fat}g`}
                pct={(macroCals.f / n.calories) * 100}
                color="#c98a4b"
              />
            </div>
          </div>

          {/* micros */}
          <div className="mt-6">
            <div className="eyebrow mb-3 text-[10px] text-cream/45">
              Micronutrients &amp; more
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MicroBar label="Fiber" value={n.micros.fiber} unit="g" pct={n.micros.fiber * 4} />
              <MicroBar label="Sugar" value={n.micros.sugar} unit="g" pct={n.micros.sugar * 3} />
              <MicroBar label="Sodium" value={n.micros.sodium} unit="mg" pct={(n.micros.sodium / 2300) * 100} />
              <MicroBar label="Iron" value={n.micros.iron} unit="% DV" pct={n.micros.iron} />
              <MicroBar label="Calcium" value={n.micros.calcium} unit="% DV" pct={n.micros.calcium} />
              <MicroBar label="Vitamin C" value={n.micros.vitaminC} unit="% DV" pct={n.micros.vitaminC} />
            </div>
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-cream/35">
            Values are chef&apos;s estimates and may vary by preparation.
          </p>

          {/* actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-cream/20 py-3 text-xs uppercase tracking-widest text-cream/70 transition hover:border-cream/50"
            >
              Close
            </button>
            <button
              onClick={() => {
                onAdd();
                onClose();
              }}
              className="flex-1 rounded-full border border-gold bg-gold py-3 text-xs uppercase tracking-widest text-char transition hover:bg-transparent hover:text-gold"
            >
              Add to table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
