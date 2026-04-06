"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getProductsByCategory } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const slug = params.slug as string;

  useEffect(() => {
    const foundProduct = getProductBySlug(slug);
    setProduct(foundProduct ?? null);

    if (foundProduct) {
      const categoryProducts = getProductsByCategory(foundProduct.categoria);
      setRelatedProducts(categoryProducts.filter((p) => p.slug !== slug).slice(0, 4));
    }

    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-beige-dark border-t-gold rounded-full animate-spin" />
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

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-beige-light">
          <Image
            src={product.immagine}
            alt={product.nome}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="inline-block bg-beige-light text-text-medium text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4 w-fit">
            {product.categoria}
          </span>

          <h1 className="font-heading text-3xl text-text-dark mb-4">
            {product.nome}
          </h1>

          <p className="text-2xl text-gold font-semibold mb-6">
            &euro;{product.prezzo.toFixed(2)}
          </p>

          <p className="text-text-medium leading-relaxed mb-8">
            {product.descrizione}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="px-8 py-3 bg-gold text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Aggiungi al carrello
            </button>
            <button
              onClick={handleBuyNow}
              className="px-8 py-3 border border-gold text-gold rounded-full font-medium hover:bg-gold hover:text-white transition-colors"
            >
              Acquista ora
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl text-text-dark mb-6">
            Potrebbe interessarti
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
