"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
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
            sizes={
              compact
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            }
          />
        </div>
      </Link>
      <div className={compact ? "p-2.5" : "p-4"}>
        <span
          className={`block text-neon-purple uppercase tracking-wider font-heading ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          {product.marchio} · {product.tipo}
        </span>
        <Link href={`/prodotto/${product.slug}`}>
          <h3
            className={`font-heading text-text-dark hover:text-neon-blue transition-colors tracking-wide line-clamp-2 ${
              compact ? "text-xs mt-0.5 min-h-[2rem]" : "text-sm mt-1"
            }`}
          >
            {product.nome}
          </h3>
        </Link>
        <p
          className={`text-neon-blue font-bold font-heading ${
            compact ? "text-sm mt-0.5" : "text-lg mt-1"
          }`}
        >
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
          className={`w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-heading tracking-wider hover:opacity-90 transition-opacity ${
            compact ? "mt-2 py-1.5 text-[10px]" : "mt-3 py-2.5 text-sm"
          }`}
        >
          {compact ? "+ CARRELLO" : "AGGIUNGI AL CARRELLO"}
        </button>
      </div>
    </div>
  );
}
