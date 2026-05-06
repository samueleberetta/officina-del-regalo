"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

const categories = [
  { name: "PlayStation", slug: "PlayStation" },
  { name: "Nintendo", slug: "Nintendo" },
  { name: "Xbox", slug: "Xbox" },
  { name: "Console", slug: "Console" },
  { name: "Controller", slug: "Controller" },
  { name: "Giochi", slug: "Giochi" },
  { name: "Accessori", slug: "Accessori" },
];

function CategoryIcon({ name }: { name: string }) {
  const baseClass = "w-full h-full";
  switch (name) {
    case "PlayStation":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="15" y="22" width="50" height="36" rx="6" />
          <circle cx="30" cy="40" r="5" />
          <circle cx="50" cy="40" r="5" />
          <line x1="25" y1="40" x2="35" y2="40" />
          <line x1="30" y1="35" x2="30" y2="45" />
          <circle cx="50" cy="37" r="1.5" fill="currentColor" />
          <circle cx="53" cy="40" r="1.5" fill="currentColor" />
          <circle cx="50" cy="43" r="1.5" fill="currentColor" />
          <circle cx="47" cy="40" r="1.5" fill="currentColor" />
        </svg>
      );
    case "Nintendo":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="20" width="60" height="40" rx="8" />
          <rect x="18" y="28" width="18" height="24" rx="3" />
          <rect x="44" y="28" width="18" height="24" rx="3" />
          <line x1="24" y1="37" x2="30" y2="37" />
          <line x1="27" y1="34" x2="27" y2="40" />
          <circle cx="50" cy="35" r="2" fill="currentColor" />
          <circle cx="56" cy="35" r="2" fill="currentColor" />
          <circle cx="53" cy="42" r="1.5" fill="currentColor" />
        </svg>
      );
    case "Xbox":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="40" cy="40" r="22" />
          <line x1="33" y1="33" x2="47" y2="47" />
          <line x1="47" y1="33" x2="33" y2="47" />
          <circle cx="40" cy="40" r="12" />
        </svg>
      );
    case "Console":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="15" y="25" width="50" height="10" rx="3" />
          <rect x="18" y="35" width="44" height="20" rx="2" />
          <circle cx="24" cy="30" r="2" fill="currentColor" />
          <rect x="30" y="28" width="20" height="4" rx="1" />
          <line x1="40" y1="55" x2="40" y2="60" />
          <rect x="30" y="60" width="20" height="3" rx="1" />
        </svg>
      );
    case "Controller":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 35 Q20 25 30 25 L50 25 Q60 25 60 35 L62 50 Q63 58 55 58 L50 50 L30 50 L25 58 Q17 58 18 50Z" />
          <line x1="26" y1="37" x2="34" y2="37" />
          <line x1="30" y1="33" x2="30" y2="41" />
          <circle cx="50" cy="33" r="2" fill="currentColor" />
          <circle cx="54" cy="37" r="2" fill="currentColor" />
          <circle cx="46" cy="37" r="2" fill="currentColor" />
          <circle cx="50" cy="41" r="2" fill="currentColor" />
        </svg>
      );
    case "Giochi":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="22" y="15" width="36" height="50" rx="3" />
          <rect x="26" y="20" width="28" height="18" rx="2" />
          <rect x="30" y="44" width="8" height="4" rx="1" />
          <rect x="42" y="44" width="8" height="4" rx="1" />
          <circle cx="40" cy="55" r="3" />
          <line x1="22" y1="42" x2="58" y2="42" />
        </svg>
      );
    case "Accessori":
      return (
        <svg viewBox="0 0 80 80" className={baseClass} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="20" y="30" width="40" height="25" rx="3" />
          <line x1="30" y1="30" x2="25" y2="22" />
          <line x1="50" y1="30" x2="55" y2="22" />
          <rect x="24" y="35" width="12" height="8" rx="1" />
          <rect x="44" y="35" width="12" height="8" rx="1" />
          <circle cx="40" cy="48" r="3" />
          <line x1="20" y1="55" x2="60" y2="55" />
        </svg>
      );
    default:
      return null;
  }
}

const events = [
  {
    id: "1",
    titolo: "RetroStation Night — Ogni Giovedì",
    data: "ricorrente",
    ricorrenza: "Ogni giovedì",
    orario: "21:00",
    luogo: "Bar Coccodè Cream",
    indirizzo: "Inverigo (CO)",
    mapsUrl: "https://www.google.com/maps?ftid=0x4786a2369e014b75:0x157decb11557d24c",
    descrizione: "Serata retrogaming fissa! Ogni giovedì sera vieni a giocare alle console con noi. PS1, PS2, Nintendo e tanto altro.",
  },
  {
    id: "2",
    titolo: "RetroStation alla Biblioteca di Sirtori",
    data: "2026-05-09",
    orario: "15:00",
    luogo: "Biblioteca Sirtori",
    indirizzo: "Piazza Don Brioschi 14, Sirtori (LC)",
    descrizione: "Sabato pomeriggio di retrogaming in biblioteca. Aperto a tutti, portate amici e voglia di giocare!",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getActiveProducts().then((all) => {
      setProducts(all.slice(0, 4));
    });
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 text-center retro-scanlines">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 via-retro-dark to-retro-dark" />
        <div className="absolute inset-0 pixel-grid" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl tracking-wider mb-2">
            <span className="text-neon-blue neon-glow">RETRO</span>
            <span className="text-neon-purple">STATION</span>
          </h1>
          <p className="font-heading text-lg md:text-xl text-neon-blue/60 tracking-widest mb-6">
            00&apos;s
          </p>
          <p className="text-text-medium text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Rivivi la tua infanzia, ovunque. Console, controller e giochi retro: PS1, PS2, PS3, Wii, Nintendo.
          </p>
          <Link
            href="/catalogo"
            className="inline-block rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-3 text-lg font-heading tracking-wider hover:opacity-90 transition-opacity"
          >
            ESPLORA IL CATALOGO
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-center mb-10 tracking-wider">
            <span className="text-neon-blue">CATEGORIE</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${encodeURIComponent(cat.slug)}`}
                className="retro-card group relative block bg-retro-card rounded-xl overflow-hidden border border-retro-border aspect-square"
              >
                <div className="absolute inset-0 p-5 text-neon-blue/30 group-hover:text-neon-blue/50 transition-colors duration-300">
                  <CategoryIcon name={cat.name} />
                </div>
                <div className="absolute inset-0 flex items-end justify-center pb-3">
                  <h3 className="font-heading text-[10px] md:text-xs text-text-medium text-center bg-retro-dark/80 backdrop-blur-sm rounded-lg py-1 px-2 group-hover:text-neon-blue transition-colors duration-300 tracking-wider">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 px-4 bg-retro-darker">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-center mb-10 tracking-wider">
            <span className="text-neon-purple">ULTIMI ARRIVI</span>
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-medium">
              Nessun prodotto disponibile.
            </p>
          )}
          <div className="text-center mt-10">
            <Link
              href="/catalogo"
              className="inline-block rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white px-8 py-3 font-heading tracking-wider hover:opacity-90 transition-opacity"
            >
              VEDI TUTTI
            </Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl text-center mb-3 tracking-wider">
            <span className="text-neon-blue">PROSSIMI</span>{" "}
            <span className="text-neon-purple">EVENTI</span>
          </h2>
          <p className="text-text-medium text-center mb-10 max-w-xl mx-auto">
            Organizziamo serate retrogaming nei bar. Vieni a giocare con noi!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="retro-card bg-retro-card rounded-xl border border-retro-border p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-neon-purple/20 text-neon-purple text-xs font-heading tracking-wider px-3 py-1 rounded-full">
                    {"ricorrenza" in event ? "FISSO" : "EVENTO"}
                  </span>
                </div>
                <h3 className="font-heading text-lg text-text-dark mb-3 tracking-wide">
                  {event.titolo}
                </h3>
                <p className="text-text-medium text-sm mb-4 flex-1">
                  {event.descrizione}
                </p>
                <div className="space-y-2 text-sm border-t border-retro-border pt-4">
                  <div className="flex items-center gap-2 text-text-medium">
                    <svg className="w-4 h-4 text-neon-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {"ricorrenza" in event
                        ? `${event.ricorrenza} — ore ${event.orario}`
                        : `${new Date(event.data).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })} — ore ${event.orario}`
                      }
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-text-medium">
                    <svg className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="text-text-dark">{event.luogo}</span>
                      <span className="block text-xs">{event.indirizzo}</span>
                      {"mapsUrl" in event && (
                        <a
                          href={event.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs text-neon-blue hover:underline mt-1"
                        >
                          Apri in Google Maps &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
