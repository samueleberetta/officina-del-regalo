"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminGuard from "@/components/AdminGuard";
import { getProducts, saveProducts, getProductById } from "@/lib/products";
import { Product, getProductImages } from "@/data/products";

export default function ModificaProdottoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notFound, setNotFound] = useState(false);
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [categoria, setCategoria] = useState<Product["categoria"]>("Matrimonio");
  const [attivo, setAttivo] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewFiles, setPreviewFiles] = useState<{ file: File; preview: string }[]>([]);

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
    setAttivo(product.attivo);
    setExistingImages(getProductImages(product));
  }, [id]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPreviews: { file: File; preview: string }[] = [];
    Array.from(files).forEach((file) => {
      newPreviews.push({ file, preview: URL.createObjectURL(file) });
    });
    setPreviewFiles((prev) => [...prev, ...newPreviews]);
  };

  const removeExisting = (index: number) => {
    setExistingImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const removePreview = (index: number) => {
    setPreviewFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingImages.length === 0 && previewFiles.length === 0) {
      alert("Aggiungi almeno una foto del prodotto.");
      return;
    }

    setUploading(true);

    let allPaths = [...existingImages];

    if (previewFiles.length > 0) {
      const formData = new FormData();
      previewFiles.forEach((pf) => formData.append("files", pf.file));

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.paths) {
          allPaths = [...allPaths, ...data.paths];
        }
      } catch {
        alert("Errore durante il caricamento delle immagini.");
        setUploading(false);
        return;
      }
    }

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
            immagine: allPaths[0],
            immagini: allPaths,
            slug,
            attivo,
          }
        : p
    );
    saveProducts(updated);
    setUploading(false);
    router.push("/admin/prodotti");
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

  const totalImages = existingImages.length + previewFiles.length;

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
              Categoria
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

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Foto prodotto
            </label>
            <p className="text-xs text-[#6B6B6B] mb-3">
              Puoi caricare pi&ugrave; immagini. La prima sar&agrave; la foto principale.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-2 border-dashed border-[#C4A882] rounded-xl px-6 py-4 text-[#B8976A] hover:bg-[#F5EFE6] transition w-full justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Aggiungi immagini
            </button>

            {totalImages > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {existingImages.map((imgPath, idx) => (
                  <div key={`existing-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image src={imgPath} alt={`Foto ${idx + 1}`} fill className="object-cover" sizes="150px" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#B8976A] text-white text-[10px] px-2 py-0.5 rounded-full">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExisting(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {previewFiles.map((pf, idx) => (
                  <div key={`preview-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={pf.preview} alt={`Nuova ${idx + 1}`} className="object-cover w-full h-full" />
                    <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                      Nuova
                    </span>
                    <button
                      type="button"
                      onClick={() => removePreview(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
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
              disabled={uploading}
              className="bg-[#B8976A] text-white px-6 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              {uploading ? "Caricamento..." : "Salva prodotto"}
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
