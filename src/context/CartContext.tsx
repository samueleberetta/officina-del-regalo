"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export interface CartItem {
  id: string;
  nome: string;
  prezzo: number;
  immagine: string;
  slug: string;
  quantita: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantita">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantita: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("odr-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("odr-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  const addToCart = useCallback((item: Omit<CartItem, "quantita">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantita: i.quantita + 1 } : i
        );
      }
      return [...prev, { ...item, quantita: 1 }];
    });
    toast.success("Prodotto aggiunto al carrello!");
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantita: number) => {
    if (quantita < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantita } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantita, 0);
  const subtotal = items.reduce((sum, i) => sum + i.prezzo * i.quantita, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
