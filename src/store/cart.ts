"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/types";

export type CartLine = {
  item: MenuItem;
  quantity: number;
};

type CartState = {
  lines: Record<string, CartLine>;
  add: (item: MenuItem, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number; // minor units
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: {},
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines[item.id];
          return {
            lines: {
              ...s.lines,
              [item.id]: {
                item,
                quantity: (existing?.quantity ?? 0) + qty,
              },
            },
          };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...s.lines };
          delete next[id];
          return { lines: next };
        }),
      setQty: (id, qty) =>
        set((s) => {
          if (qty <= 0) {
            const next = { ...s.lines };
            delete next[id];
            return { lines: next };
          }
          const line = s.lines[id];
          if (!line) return s;
          return { lines: { ...s.lines, [id]: { ...line, quantity: qty } } };
        }),
      clear: () => set({ lines: {} }),
      count: () =>
        Object.values(get().lines).reduce((n, l) => n + l.quantity, 0),
      total: () =>
        Object.values(get().lines).reduce(
          (n, l) => n + l.item.price * l.quantity,
          0
        ),
    }),
    { name: "viyanjan-cart" }
  )
);
