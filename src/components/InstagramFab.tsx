"use client";

import { usePathname } from "next/navigation";

export default function InstagramFab() {
  const pathname = usePathname();

  // Nascondi nell'area admin
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://www.instagram.com/retrostation00s/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Seguici su Instagram"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] shadow-[0_8px_24px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95 transition-transform"
    >
      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-retro-dark text-white group-hover:bg-retro-darker transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </span>
      <span className="sr-only">Seguici su Instagram</span>
      {/* Tooltip che appare sopra */}
      <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-retro-dark border border-retro-border px-3 py-1.5 text-xs font-heading tracking-wider text-text-dark opacity-0 group-hover:opacity-100 transition-opacity">
        Seguici su Instagram
      </span>
    </a>
  );
}
