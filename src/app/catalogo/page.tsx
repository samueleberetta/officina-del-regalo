"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product, MARCHI, TIPI, Marchio, Tipo, inferMarchio, inferTipo } from "@/data/products";

const marchi: { label: string; value: "" | Marchio }[] = [
  { label: "Tutti", value: "" },
  ...MARCHI.map((m) => ({ label: m.label, value: m.value })),
];

const tipi: { label: string; value: "" | Tipo }[] = [
  { label: "Tutti", value: "" },
  ...TIPI.map((t) => ({ label: t.label, value: t.value })),
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Supporta vecchio param `categoria` per retro-compatibilita
  const legacyCategoria = searchParams.get("categoria") || "";
  const initialMarchio = (searchParams.get("marchio") ||
    (["PlayStation", "Nintendo", "Xbox"].includes(legacyCategoria) ? legacyCategoria : "")) as "" | Marchio;
  const initialTipo = (searchParams.get("tipo") ||
    (["Console", "Controller", "Giochi", "Accessori"].includes(legacyCategoria) ? legacyCategoria : "")) as "" | Tipo;

  const activeMarchio = initialMarchio;
  const activeTipo = initialTipo;

  useEffect(() => {
    getActiveProducts().then((data) => {
      setProducts(data);
      setLoaded(true);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const m = p.marchio || inferMarchio(p);
      const t = p.tipo || inferTipo(p);
      if (activeMarchio && m !== activeMarchio) return false;
      if (activeTipo && t !== activeTipo) return false;
      return true;
    });
  }, [products, activeMarchio, activeTipo]);

  const updateFilter = (next: { marchio?: "" | Marchio; tipo?: "" | Tipo }) => {
    const params = new URLSearchParams();
    const marchio = next.marchio !== undefined ? next.marchio : activeMarchio;
    const tipo = next.tipo !== undefined ? next.tipo : activeTipo;
    if (marchio) params.set("marchio", marchio);
    if (tipo) params.set("tipo", tipo);
    const qs = params.toString();
    router.push(qs ? `/catalogo?${qs}` : "/catalogo");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Breaking-news ticker */}
      <div className="marquee bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-pink/20 border-y border-neon-blue/40 text-neon-blue py-2 mb-8 -mx-4 sm:mx-0 sm:rounded-lg">
        <div className="marquee-track font-heading text-xs sm:text-sm tracking-widest uppercase">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              <span className="text-neon-pink">●</span>
              Spedizioni in tutta Italia
            </span>
          ))}
        </div>
      </div>

      <h1 className="font-heading text-3xl text-text-dark text-center mb-8 tracking-wider">
        <span className="text-neon-blue">CATALOGO</span>
      </h1>

      {/* Filtro marchio */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-text-medium font-heading mb-3 text-center">
          Marchio
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
          {marchi.map((m, idx) => (
            <button
              key={m.value || "all-m"}
              onClick={() => updateFilter({ marchio: m.value })}
              className={`px-5 py-2 rounded-lg text-sm font-heading tracking-wider transition-colors border ${
                idx === 0 ? "col-span-2 sm:col-span-1" : ""
              } ${
                activeMarchio === m.value
                  ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white border-transparent"
                  : "bg-retro-card text-text-medium border-retro-border hover:border-neon-blue/50 hover:text-neon-blue"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro tipo */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-wider text-text-medium font-heading mb-3 text-center">
          Tipologia
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
          {tipi.map((t, idx) => (
            <button
              key={t.value || "all-t"}
              onClick={() => updateFilter({ tipo: t.value })}
              className={`px-4 py-1.5 rounded-md text-xs font-heading tracking-wider transition-colors border ${
                idx === 0 ? "col-span-2 sm:col-span-1" : ""
              } ${
                activeTipo === t.value
                  ? "bg-neon-purple/20 text-neon-purple border-neon-purple"
                  : "bg-retro-card text-text-medium border-retro-border hover:border-neon-purple/50 hover:text-neon-purple"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-retro-border border-t-neon-blue rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-text-medium py-20">
          Nessun prodotto trovato con questi filtri.
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
