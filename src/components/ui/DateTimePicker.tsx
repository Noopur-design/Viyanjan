"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface Props {
  value: string;
  onChange: (iso: string) => void;
}

export default function DateTimePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selectDay(day: Date | undefined) {
    setSelected(day);
    onChange(day ? day.toISOString() : "");
    if (day) setOpen(false);
  }

  function clear() {
    setSelected(undefined);
    onChange("");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition focus:outline-none ${
          open ? "border-gold" : "border-cream/20"
        } bg-black/40`}
      >
        <span className={selected ? "text-cream" : "text-cream/35"}>
          {selected ? format(selected, "dd MMM yyyy") : "Select date"}
        </span>
        <span className="text-gold/60 text-sm">📅</span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 rounded-2xl border border-cream/15 bg-[#1a0f0a] shadow-2xl">
          <div className="rdp-viyanjan p-1">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={selectDay}
              disabled={{ before: new Date() }}
              showOutsideDays={false}
            />
          </div>
          <div className="flex justify-start border-t border-cream/10 px-3 py-2">
            <button
              type="button"
              onClick={clear}
              className="text-xs text-cream/40 hover:text-cream"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <style>{`
        .rdp-viyanjan .rdp-root {
          --rdp-accent-color: #dcb65f;
          --rdp-accent-background-color: rgba(220,182,95,0.15);
          --rdp-cell-size: 28px;
          --rdp-day_button-border-radius: 50%;
          --rdp-day_button-width: 26px;
          --rdp-day_button-height: 26px;
          font-size: 11px;
          color: rgba(251,246,236,0.8);
        }
        .rdp-viyanjan .rdp-day_button:hover { background: rgba(220,182,95,0.15); }
        .rdp-viyanjan .rdp-selected .rdp-day_button { background: #dcb65f; color: #1d1109; font-weight:700; }
        .rdp-viyanjan .rdp-disabled { opacity: 0.25; }
        .rdp-viyanjan .rdp-nav button { color: #dcb65f; }
        .rdp-viyanjan .rdp-month_caption { color: #dcb65f; font-family: Georgia, serif; font-size: 12px; }
        .rdp-viyanjan .rdp-weekday { color: rgba(251,246,236,0.35); font-size: 10px; }
      `}</style>
    </div>
  );
}
