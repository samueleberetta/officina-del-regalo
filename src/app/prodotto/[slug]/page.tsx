"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProductsByCategory } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product, getProductImages } from "@/data/products";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slug = params.slug as string;

  useEffect(() => {
    async function loadProduct() {
      const foundProduct = await getProductBySlug(slug);
      setProduct(foundProduct ?? null);
      setCurrentImageIndex(0);

      if (foundProduct) {
        const categoryProducts = await getProductsByCategory(foundProduct.categoria);
        setRelatedProducts(categoryProducts.filter((p) => p.slug !== slug).slice(0, 6));
      }

      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-retro-border border-t-neon-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-medium text-lg">Prodotto non trovato.</p>
      </div>
    );
  }

  const images = getProductImages(product);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      nome: product.nome,
      prezzo: product.prezzo,
      immagine: product.immagine,
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/carrello");
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-retro-card border border-retro-border">
            <Image
              src={images[currentImageIndex]}
              alt={product.nome}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-retro-dark/80 hover:bg-retro-dark text-text-dark w-10 h-10 rounded-full flex items-center justify-center shadow-md transition border border-retro-border"
                  aria-label="Immagine precedente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-retro-dark/80 hover:bg-retro-dark text-text-dark w-10 h-10 rounded-full flex items-center justify-center shadow-md transition border border-retro-border"
                  aria-label="Immagine successiva"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-3 right-3 bg-retro-dark/70 text-text-dark text-xs px-3 py-1 rounded-full border border-retro-border">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    idx === currentImageIndex
                      ? "border-neon-blue"
                      : "border-retro-border hover:border-neon-purple"
                  }`}
                >
                  <Image src={img} alt={`${product.nome} ${idx + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="inline-block bg-retro-card text-neon-purple text-xs uppercase tracking-wider px-3 py-1 rounded-lg mb-4 w-fit font-heading border border-retro-border">
            {product.marchio} · {product.tipo}
          </span>

          <h1 className="font-heading text-2xl md:text-3xl text-text-dark mb-4 tracking-wide">
            {product.nome}
          </h1>

          <p className="text-2xl text-neon-blue font-bold mb-6 font-heading">
            &euro;{product.prezzo.toFixed(2)}
          </p>

          <p className="text-text-medium leading-relaxed mb-8">
            {product.descrizione}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-heading tracking-wider hover:opacity-90 transition-opacity"
            >
              AGGIUNGI AL CARRELLO
            </button>
            <button
              onClick={handleBuyNow}
              className="px-8 py-3 border border-neon-blue text-neon-blue rounded-lg font-heading tracking-wider hover:bg-neon-blue hover:text-white transition-colors"
            >
              ACQUISTA ORA
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-heading text-xl text-text-dark mb-6 tracking-wider">
            <span className="text-neon-purple">POTREBBE INTERESSARTI</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} compact />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-neon-blue/60 text-neon-blue font-heading tracking-wider hover:bg-neon-blue/10 transition-colors"
            >
              CERCA ALTRO
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
