"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "./Header";

function AdminHeader() {
  return (
    <header className="bg-[#2C2C2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/admin/dashboard" className="font-heading text-lg text-white hover:text-[#B8976A] transition">
          Officina del Regalo <span className="text-xs font-body text-gray-400 ml-2">Area Riservata</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin/dashboard" className="text-gray-300 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/admin/prodotti" className="text-gray-300 hover:text-white transition">
            Prodotti
          </Link>
          <Link href="/admin/ordini" className="text-gray-300 hover:text-white transition">
            Ordini
          </Link>
          <Link href="/admin/automazioni" className="text-gray-300 hover:text-white transition">
            Automazioni
          </Link>
          <span className="w-px h-5 bg-gray-600" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#B8976A] hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Torna al sito
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <AdminHeader />;

  return <Header />;
}
