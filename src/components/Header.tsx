"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="font-heading text-xl sm:text-2xl text-text-dark tracking-wide">
            Officina del Regalo
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Home
            </Link>
            <Link href="/catalogo" className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Catalogo
            </Link>
            <Link href="/chi-siamo" className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Chi siamo
            </Link>
            <Link href="/contatti" className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Contatti
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/carrello" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-text-dark">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-beige pt-4 flex flex-col gap-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Home
            </Link>
            <Link href="/catalogo" onClick={() => setMenuOpen(false)} className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Catalogo
            </Link>
            <Link href="/chi-siamo" onClick={() => setMenuOpen(false)} className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Chi siamo
            </Link>
            <Link href="/contatti" onClick={() => setMenuOpen(false)} className="text-text-medium hover:text-gold transition-colors text-sm tracking-wide uppercase">
              Contatti
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
