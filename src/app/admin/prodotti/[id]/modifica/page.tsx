"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminGuard from "@/components/AdminGuard";
import { getProducts, saveProducts, getProductById } from "@/lib/products";
import { Product } from "@/data/products";

export default function ModificaProdottoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [notFound, setNotFound] = useState(false);
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [categoria, setCategoria] = useState<Product["categoria"]>("Matrimonio");
  const [immagine, setImmagine] = useState("");
  const [attivo, setAttivo] = useState(true);

  useEffect(() => {
    const product = getProductById(id);
    if (!product) {
      setNotFound(true);
      return;
    }
    setNome(product.nome);
    setDescrizione(product.descrizione);
    setPrezzo(product.prezzo.toString());
    setCategoria(product.categoria);
    setImmagine(product.immagine);
    setAttivo(product.attivo);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = nome
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const products = getProducts();
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            nome,
            descrizione,
            prezzo: parseFloat(prezzo) || 0,
            categoria,
            immagine,
            slug,
            attivo,
          }
        : p
    );
    saveProducts(updated);
    router.push("/admin/prodotti");
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (notFound) {
    return (
      <AdminGuard>
        <div className="p-6 md:p-10">
          <p className="text-[#2C2C2C] text-lg">Prodotto non trovato.</p>
          <Link
            href="/admin/prodotti"
            className="text-[#B8976A] hover:underline mt-4 inline-block"
          >
            Torna ai prodotti
          </Link>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="p-6 md:p-10 max-w-2xl">
        <h1 className="text-2xl font-bold text-[#2C2C2C] mb-8">
          Modifica prodotto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
              Nome prodotto
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
              Descrizione
            </label>
            <textarea
              required
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
              Prezzo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                &euro;
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={prezzo}
                onChange={(e) => setPrezzo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
              Sezione
            </label>
            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value as Product["categoria"])
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
            >
              <option value="Matrimonio">Matrimonio</option>
              <option value="Idee Regalo">Idee Regalo</option>
              <option value="Comunione">Comunione</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
              Foto prodotto (URL)
            </label>
            <input
              type="text"
              required
              value={immagine}
              onChange={(e) => setImmagine(e.target.value)}
              placeholder="https://esempio.com/foto.jpg"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
            />
            {immagine && isValidUrl(immagine) && (
              <div className="mt-3">
                <Image
                  src={immagine}
                  alt="Anteprima"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={attivo}
                onChange={(e) => setAttivo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#B8976A] rounded-full peer peer-checked:bg-[#B8976A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm text-[#2C2C2C]">Prodotto attivo</span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#B8976A] text-white px-6 py-2 rounded-full hover:opacity-90 transition"
            >
              Salva prodotto
            </button>
            <Link
              href="/admin/prodotti"
              className="text-[#6B6B6B] hover:text-[#2C2C2C] transition"
            >
              Annulla
            </Link>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
