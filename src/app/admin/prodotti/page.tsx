"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminGuard from "@/components/AdminGuard";
import { getProducts, saveProducts } from "@/lib/products";
import { Product } from "@/data/products";

export default function ProdottiPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const handleToggle = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, attivo: !p.attivo } : p
    );
    setProducts(updated);
    saveProducts(updated);
  };

  return (
    <AdminGuard>
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Prodotti</h1>
          <Link
            href="/admin/prodotti/nuovo"
            className="bg-[#B8976A] text-white px-6 py-2 rounded-full hover:opacity-90 transition"
          >
            Aggiungi prodotto
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 text-[#6B6B6B] font-medium text-sm">Immagine</th>
                <th className="p-4 text-[#6B6B6B] font-medium text-sm">Nome</th>
                <th className="p-4 text-[#6B6B6B] font-medium text-sm">Prezzo</th>
                <th className="p-4 text-[#6B6B6B] font-medium text-sm">Categoria</th>
                <th className="p-4 text-[#6B6B6B] font-medium text-sm">Stato</th>
                <th className="p-4 text-[#6B6B6B] font-medium text-sm">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <Image
                      src={product.immagine}
                      alt={product.nome}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="p-4 text-[#2C2C2C] font-medium">{product.nome}</td>
                  <td className="p-4 text-[#2C2C2C]">
                    &euro;{product.prezzo.toFixed(2)}
                  </td>
                  <td className="p-4 text-[#6B6B6B]">{product.categoria}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.attivo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.attivo ? "Attivo" : "Inattivo"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/prodotti/${product.id}/modifica`}
                        className="text-[#B8976A] hover:underline text-sm"
                      >
                        Modifica
                      </Link>
                      <button
                        onClick={() => handleToggle(product.id)}
                        className="text-[#6B6B6B] hover:text-[#2C2C2C] text-sm"
                      >
                        {product.attivo ? "Disattiva" : "Attiva"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="p-8 text-center text-[#6B6B6B]">
              Nessun prodotto trovato.
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
