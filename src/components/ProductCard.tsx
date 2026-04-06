"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
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
        <span className="text-xs text-gold uppercase tracking-wider font-bold">
          {product.categoria}
        </span>
        <Link href={`/prodotto/${product.slug}`}>
          <h3 className="font-heading text-lg mt-1 hover:text-gold transition-colors">
            {product.nome}
          </h3>
        </Link>
        <p className="text-text-medium text-lg font-bold mt-1">
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
          className="mt-3 w-full bg-gold text-white py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Aggiungi al carrello
        </button>
      </div>
    </div>
  );
}
