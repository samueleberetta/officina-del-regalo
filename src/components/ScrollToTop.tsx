"use client";

import { useEffect, useState } from "react";

interface ScrollToTopProps {
  /** Soglia in pixel di scrollY oltre la quale il bottone diventa visibile */
  threshold?: number;
}

export default function ScrollToTop({ threshold = 400 }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Torna in cima"
      className={`group fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full flex items-center justify-center bg-retro-card border border-neon-blue/50 text-neon-blue shadow-[0_8px_24px_rgba(0,212,255,0.25)] hover:bg-neon-blue/10 hover:border-neon-blue transition-all ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-retro-dark border border-retro-border px-3 py-1.5 text-xs font-heading tracking-wider text-text-dark opacity-0 group-hover:opacity-100 transition-opacity">
        Torna in cima
      </span>
    </button>
  );
}
