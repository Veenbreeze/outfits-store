'use client';
import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartSubtotal, deliveryFor, resolveCartLines } from './data';
import type { CartLine } from './types';

type State = {
  items: CartLine[];
  add: (line: CartLine) => void;
  remove: (id: string, size: string, color: string) => void;
  qty: (id: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],

      add: (line) =>
        set((s) => {
          const hit = s.items.find(
            (x) => x.productId === line.productId && x.size === line.size && x.color === line.color,
          );
          return {
            items: hit
              ? s.items.map((x) => (x === hit ? { ...x, quantity: x.quantity + line.quantity } : x))
              : [...s.items, line],
          };
        }),

      remove: (id, size, color) =>
        set((s) => ({
          items: s.items.filter((x) => !(x.productId === id && x.size === size && x.color === color)),
        })),

      qty: (id, size, color, quantity) =>
        set((s) => ({
          items:
            quantity < 1
              ? s.items.filter((x) => !(x.productId === id && x.size === size && x.color === color))
              : s.items.map((x) =>
                  x.productId === id && x.size === size && x.color === color ? { ...x, quantity } : x,
                ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'veenbreeze-cart', storage: createJSONStorage(() => localStorage) },
  ),
);

export function useCartDetails() {
  const items = useCart((s) => s.items);
  const lines = useMemo(() => resolveCartLines(items), [items]);
  const subtotal = useMemo(() => cartSubtotal(lines), [lines]);
  const delivery = deliveryFor(subtotal);

  return { items, lines, subtotal, delivery, total: subtotal + delivery };
}
