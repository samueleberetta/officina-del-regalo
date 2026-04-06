import { Product, defaultProducts } from "@/data/products";

const STORAGE_KEY = "odr-products";

export function getProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultProducts;
    }
  }
  return defaultProducts;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getActiveProducts(): Product[] {
  return getProducts().filter((p) => p.attivo);
}

export function getProductsByCategory(categoria: string): Product[] {
  return getActiveProducts().filter((p) => p.categoria === categoria);
}
