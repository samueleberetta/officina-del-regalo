"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

const categories = [
  { label: "Tutti", value: "" },
  { label: "PlayStation", value: "PlayStation" },
  { label: "Nintendo", value: "Nintendo" },
  { label: "Xbox", value: "Xbox" },
  { label: "Console", value: "Console" },
  { label: "Controller", value: "Controller" },
  { label: "Giochi", value: "Giochi" },
  { label: "Accessori", value: "Accessori" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  const activeCategory = searchParams.get("categoria") || "";

  useEffect(() => {
    getActiveProducts().then((data) => {
      setProducts(data);
      setLoaded(true);
    });
  }, []);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoria === activeCategory)
    : products;

  const handleCategoryChange = (value: string) => {
    if (value) {
      router.push(`/catalogo?categoria=${encodeURIComponent(value)}`);
    } else {
      router.push("/catalogo");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl text-text-dark text-center mb-8 tracking-wider">
        <span className="text-neon-blue">CATALOGO</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-5 py-2 rounded-lg text-sm font-heading tracking-wider transition-colors ${
              activeCategory === cat.value
                ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                : "bg-retro-card text-text-medium border border-retro-border hover:border-neon-blue/50 hover:text-neon-blue"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-retro-border border-t-neon-blue rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-text-medium py-20">
          Nessun prodotto trovato in questa categoria.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-retro-border border-t-neon-blue rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
