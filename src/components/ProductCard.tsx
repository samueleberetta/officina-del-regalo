"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="retro-card bg-retro-card rounded-xl overflow-hidden border border-retro-border group">
      <Link href={`/prodotto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.immagine}
            alt={product.nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs text-neon-purple uppercase tracking-wider font-heading">
          {product.categoria}
        </span>
        <Link href={`/prodotto/${product.slug}`}>
          <h3 className="font-heading text-sm mt-1 text-text-dark hover:text-neon-blue transition-colors tracking-wide">
            {product.nome}
          </h3>
        </Link>
        <p className="text-neon-blue text-lg font-bold mt-1 font-heading">
          &euro;{product.prezzo.toFixed(2)}
        </p>
        <button
          onClick={() =>
            addToCart({
              id: product.id,
              nome: product.nome,
              prezzo: product.prezzo,
              immagine: product.immagine,
              slug: product.slug,
            })
          }
          className="mt-3 w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-2.5 rounded-lg text-sm font-heading tracking-wider hover:opacity-90 transition-opacity"
        >
          AGGIUNGI AL CARRELLO
        </button>
      </div>
    </div>
  );
}
