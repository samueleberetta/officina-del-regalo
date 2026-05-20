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
    let added = true;
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        added = false;
        return prev;
      }
      // Ogni prodotto e' un pezzo unico: quantita sempre 1
      return [...prev, { ...item, quantita: 1 }];
    });
    if (added) {
      toast.success("Prodotto aggiunto al carrello!");
    } else {
      toast("Già nel carrello — ogni pezzo è unico", { icon: "ℹ️" });
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Ogni articolo nel carrello e' un pezzo unico
  const totalItems = items.length;
  const subtotal = items.reduce((sum, i) => sum + i.prezzo, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalItems, subtotal }}
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
