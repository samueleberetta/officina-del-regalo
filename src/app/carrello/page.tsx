"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

export default function CarrelloPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  const shipping = subtotal >= 50 ? 0 : 5.9;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-heading tracking-wider text-text-dark mb-4">
            CARRELLO VUOTO
          </h1>
          <p className="text-text-medium mb-8">
            Esplora il catalogo e trova la tua prossima console.
          </p>
          <Link
            href="/catalogo"
            className="inline-block bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-3 rounded-lg font-heading tracking-wider hover:opacity-90 transition-opacity"
          >
            VAI AL CATALOGO
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading tracking-wider text-text-dark mb-8">CARRELLO</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-retro-card rounded-xl border border-retro-border divide-y divide-retro-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 sm:p-6">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-retro-darker">
                    <Image src={item.immagine} alt={item.nome} width={64} height={64} className="object-cover w-full h-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-dark truncate">{item.nome}</h3>
                    <p className="text-neon-blue font-medium">{formatPrice(item.prezzo)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantita - 1)}
                      disabled={item.quantita <= 1}
                      className="w-8 h-8 rounded-lg border border-retro-border flex items-center justify-center text-text-dark hover:border-neon-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-text-dark">{item.quantita}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantita + 1)}
                      className="w-8 h-8 rounded-lg border border-retro-border flex items-center justify-center text-text-dark hover:border-neon-blue transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-text-medium hover:text-red-500 transition-colors ml-2"
                    aria-label="Rimuovi prodotto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <Link href="/catalogo" className="inline-block mt-6 text-neon-blue font-medium hover:underline">
              &larr; Continua lo shopping
            </Link>
          </div>

          <div className="lg:w-80">
            <div className="bg-retro-card rounded-xl border border-retro-border p-6 sticky top-24">
              <h2 className="text-xl font-heading tracking-wider text-text-dark mb-4">RIEPILOGO</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-medium">
                  <span>Subtotale</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-medium">
                  <span>Spedizione</span>
                  <span>{shipping === 0 ? "Gratuita" : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-text-medium">Spedizione gratuita sopra €50</p>
                )}
                <hr className="border-retro-border" />
                <div className="flex justify-between font-bold text-text-dark text-base">
                  <span>Totale</span>
                  <span className="text-neon-blue">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-center py-3 rounded-lg font-heading tracking-wider hover:opacity-90 transition-opacity"
              >
                CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
