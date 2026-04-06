"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

const categories = [
  { name: "Matrimonio", slug: "matrimonio", icon: "\uD83D\uDC8D" },
  { name: "Idee Regalo", slug: "idee-regalo", icon: "\uD83C\uDF81" },
  { name: "Comunione", slug: "comunione", icon: "\u2728" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const all = getActiveProducts();
    setProducts(all.slice(0, 4));
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#F5EFE6] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl text-[#2C2C2C] mb-6">
            Regali che raccontano una storia
          </h1>
          <p className="text-[#6B6B6B] text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Scopri la nostra selezione di regali artigianali, pensati per
            rendere ogni occasione un momento indimenticabile.
          </p>
          <Link
            href="/catalogo"
            className="inline-block rounded-full bg-[#B8976A] text-white px-8 py-3 text-lg font-medium hover:opacity-90 transition-opacity"
          >
            Esplora il catalogo
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl text-[#2C2C2C] text-center mb-10">
            Le nostre categorie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${cat.slug}`}
                className="block bg-[#F5EFE6] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-5xl mb-4 block">{cat.icon}</span>
                <h3 className="font-heading text-xl text-[#2C2C2C]">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16 px-4 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl text-[#2C2C2C] text-center mb-10">
            I nostri ultimi prodotti
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-[#6B6B6B]">
              Nessun prodotto disponibile al momento.
            </p>
          )}
          <div className="text-center mt-10">
            <Link
              href="/catalogo"
              className="inline-block rounded-full bg-[#B8976A] text-white px-8 py-3 text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Vedi tutti i prodotti
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
