import { Product, defaultProducts } from "@/data/products";
import { supabase } from "./supabase";

// Fetch all products from Supabase
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return defaultProducts;
  }

  return data.map(mapDbToProduct);
}

// Save a new product
export async function saveProduct(product: Product): Promise<boolean> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.ok;
}

// Update a product
export async function updateProduct(product: Product): Promise<boolean> {
  const res = await fetch("/api/products", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.ok;
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`/api/products?id=${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return mapDbToProduct(data);
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapDbToProduct(data);
}

// Get active products
export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("attivo", true)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return defaultProducts.filter((p) => p.attivo);
  }

  return data.map(mapDbToProduct);
}

// Get products by category
export async function getProductsByCategory(categoria: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("attivo", true)
    .eq("categoria", categoria)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map(mapDbToProduct);
}

// Map DB row to Product interface
function mapDbToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    nome: row.nome as string,
    prezzo: Number(row.prezzo),
    categoria: row.categoria as Product["categoria"],
    descrizione: row.descrizione as string,
    immagine: row.immagine as string,
    immagini: (row.immagini as string[]) || [row.immagine as string],
    slug: row.slug as string,
    attivo: row.attivo as boolean,
  };
}
