"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

const categories = [
  { label: "Tutti", value: "" },
  { label: "Matrimonio", value: "Matrimonio" },
  { label: "Idee Regalo", value: "Idee Regalo" },
  { label: "Comunione", value: "Comunione" },
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
      router.push(`/catalogo?categoria=${value}`);
    } else {
      router.push("/catalogo");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl text-text-dark text-center mb-8">
        Il nostro catalogo
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? "bg-gold text-white"
                : "bg-beige-light text-text-dark hover:bg-beige"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-beige-dark border-t-gold rounded-full animate-spin" />
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
          <div className="w-8 h-8 border-4 border-beige-dark border-t-gold rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
