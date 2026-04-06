"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

const categories = [
  { name: "Bomboniere", slug: "Bomboniere" },
  { name: "Tavola e Cucina", slug: "Tavola e Cucina" },
  { name: "Argento e Cristallo", slug: "Argento e Cristallo" },
  { name: "Natale", slug: "Natale" },
  { name: "Idee Regalo", slug: "Idee Regalo" },
  { name: "Casa", slug: "Casa" },
  { name: "Moda e Bijoux", slug: "Moda e Bijoux" },
];

function CategoryIllustration({ name }: { name: string }) {
  const style = { stroke: "#4a4a4a", fill: "none", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "Bomboniere":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* Gift box with ribbon */}
          <rect x="25" y="45" width="70" height="45" rx="3" {...style} />
          <rect x="20" y="35" width="80" height="14" rx="3" {...style} />
          <line x1="60" y1="35" x2="60" y2="90" {...style} />
          <path d="M60 35 C60 20 45 15 42 25 C40 30 50 35 60 35" {...style} />
          <path d="M60 35 C60 20 75 15 78 25 C80 30 70 35 60 35" {...style} />
          {/* Small hearts */}
          <path d="M30 25 C30 22 34 22 34 25 C34 28 30 30 30 30 C30 30 26 28 26 25 C26 22 30 22 30 25Z" {...style} strokeWidth={0.8} />
          <path d="M88 20 C88 18 91 18 91 20 C91 22 88 24 88 24 C88 24 85 22 85 20 C85 18 88 18 88 20Z" {...style} strokeWidth={0.8} />
        </svg>
      );
    case "Tavola e Cucina":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* Plate */}
          <ellipse cx="60" cy="58" rx="38" ry="30" {...style} />
          <ellipse cx="60" cy="58" rx="26" ry="20" {...style} strokeWidth={0.8} />
          {/* Fork */}
          <line x1="18" y1="20" x2="18" y2="85" {...style} />
          <line x1="14" y1="20" x2="14" y2="40" {...style} strokeWidth={0.8} />
          <line x1="18" y1="20" x2="18" y2="40" {...style} strokeWidth={0.8} />
          <line x1="22" y1="20" x2="22" y2="40" {...style} strokeWidth={0.8} />
          <path d="M14 40 Q18 45 22 40" {...style} strokeWidth={0.8} />
          {/* Knife */}
          <line x1="102" y1="20" x2="102" y2="85" {...style} />
          <path d="M102 20 Q108 30 108 45 Q108 50 102 50" {...style} strokeWidth={0.8} />
        </svg>
      );
    case "Argento e Cristallo":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* Wine glass / crystal goblet */}
          <ellipse cx="60" cy="25" rx="22" ry="18" {...style} />
          <path d="M44 25 Q48 55 60 55 Q72 55 76 25" {...style} strokeWidth={0.8} />
          <line x1="60" y1="55" x2="60" y2="78" {...style} />
          <ellipse cx="60" cy="82" rx="18" ry="5" {...style} />
          {/* Sparkles */}
          <line x1="88" y1="18" x2="88" y2="28" {...style} strokeWidth={0.7} />
          <line x1="83" y1="23" x2="93" y2="23" {...style} strokeWidth={0.7} />
          <line x1="30" y1="12" x2="30" y2="18" {...style} strokeWidth={0.7} />
          <line x1="27" y1="15" x2="33" y2="15" {...style} strokeWidth={0.7} />
          <circle cx="95" cy="40" r="1" fill="#4a4a4a" stroke="none" />
          <circle cx="22" cy="35" r="1" fill="#4a4a4a" stroke="none" />
        </svg>
      );
    case "Natale":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* Christmas tree */}
          <polygon points="60,10 35,45 45,45 28,70 42,70 22,92 98,92 78,70 92,70 75,45 85,45" {...style} />
          <rect x="55" y="92" width="10" height="8" rx="1" {...style} />
          {/* Star on top */}
          <path d="M60 5 L62 12 L68 12 L63 16 L65 22 L60 18 L55 22 L57 16 L52 12 L58 12Z" {...style} strokeWidth={0.8} />
          {/* Ornaments */}
          <circle cx="50" cy="55" r="3" {...style} strokeWidth={0.8} />
          <circle cx="68" cy="65" r="3" {...style} strokeWidth={0.8} />
          <circle cx="55" cy="78" r="3" {...style} strokeWidth={0.8} />
        </svg>
      );
    case "Idee Regalo":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* Light bulb (idea) */}
          <path d="M60 15 C42 15 30 30 30 45 C30 55 38 62 45 68 L45 78 L75 78 L75 68 C82 62 90 55 90 45 C90 30 78 15 60 15Z" {...style} />
          <line x1="45" y1="82" x2="75" y2="82" {...style} strokeWidth={0.8} />
          <line x1="48" y1="86" x2="72" y2="86" {...style} strokeWidth={0.8} />
          <path d="M52 90 Q60 94 68 90" {...style} strokeWidth={0.8} />
          {/* Filament lines */}
          <path d="M52 68 L52 50 Q55 42 60 50 Q65 58 68 50 L68 68" {...style} strokeWidth={0.7} />
          {/* Rays */}
          <line x1="60" y1="5" x2="60" y2="10" {...style} strokeWidth={0.7} />
          <line x1="25" y1="20" x2="28" y2="23" {...style} strokeWidth={0.7} />
          <line x1="95" y1="20" x2="92" y2="23" {...style} strokeWidth={0.7} />
          <line x1="18" y1="45" x2="24" y2="45" {...style} strokeWidth={0.7} />
          <line x1="96" y1="45" x2="102" y2="45" {...style} strokeWidth={0.7} />
        </svg>
      );
    case "Casa":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* House */}
          <path d="M60 15 L15 50 L25 50 L25 90 L95 90 L95 50 L105 50Z" {...style} />
          <rect x="48" y="60" width="24" height="30" rx="2" {...style} />
          <circle cx="68" cy="76" r="2" fill="#4a4a4a" stroke="none" />
          {/* Window */}
          <rect x="32" y="55" width="12" height="12" rx="1" {...style} strokeWidth={0.8} />
          <line x1="38" y1="55" x2="38" y2="67" {...style} strokeWidth={0.6} />
          <line x1="32" y1="61" x2="44" y2="61" {...style} strokeWidth={0.6} />
          <rect x="76" y="55" width="12" height="12" rx="1" {...style} strokeWidth={0.8} />
          <line x1="82" y1="55" x2="82" y2="67" {...style} strokeWidth={0.6} />
          <line x1="76" y1="61" x2="88" y2="61" {...style} strokeWidth={0.6} />
          {/* Chimney */}
          <rect x="78" y="25" width="10" height="22" rx="1" {...style} />
          {/* Smoke */}
          <path d="M83 22 Q80 16 83 12 Q86 8 83 3" {...style} strokeWidth={0.7} />
        </svg>
      );
    case "Moda e Bijoux":
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full">
          {/* Necklace / pendant */}
          <path d="M30 10 Q30 55 60 65 Q90 55 90 10" {...style} />
          {/* Diamond pendant */}
          <polygon points="60,65 50,78 60,92 70,78" {...style} />
          <line x1="50" y1="78" x2="70" y2="78" {...style} strokeWidth={0.7} />
          <line x1="60" y1="65" x2="55" y2="78" {...style} strokeWidth={0.5} />
          <line x1="60" y1="65" x2="65" y2="78" {...style} strokeWidth={0.5} />
          <line x1="55" y1="78" x2="60" y2="92" {...style} strokeWidth={0.5} />
          <line x1="65" y1="78" x2="60" y2="92" {...style} strokeWidth={0.5} />
          {/* Sparkles */}
          <line x1="38" y1="42" x2="38" y2="50" {...style} strokeWidth={0.6} />
          <line x1="34" y1="46" x2="42" y2="46" {...style} strokeWidth={0.6} />
          <line x1="82" y1="38" x2="82" y2="44" {...style} strokeWidth={0.6} />
          <line x1="79" y1="41" x2="85" y2="41" {...style} strokeWidth={0.6} />
          <circle cx="25" cy="28" r="1" fill="#4a4a4a" stroke="none" />
          <circle cx="98" cy="22" r="1" fill="#4a4a4a" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getActiveProducts().then((all) => {
      setProducts(all.slice(0, 4));
    });
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
          <div className="grid grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${encodeURIComponent(cat.slug)}`}
                className="group relative block bg-[#FAFAF7] rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#B8976A] transition-all duration-300 aspect-square"
              >
                <div className="absolute inset-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <CategoryIllustration name={cat.name} />
                </div>
                <div className="absolute inset-0 flex items-end justify-center pb-3">
                  <h3 className="font-heading text-[11px] md:text-sm text-[#2C2C2C] text-center bg-white/80 backdrop-blur-sm rounded-full py-1 px-2 shadow-sm group-hover:bg-[#B8976A] group-hover:text-white transition-colors duration-300 leading-tight">
                    {cat.name}
                  </h3>
                </div>
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
