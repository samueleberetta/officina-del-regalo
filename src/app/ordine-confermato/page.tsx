"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("numero") || "RS-0000";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center border border-neon-blue/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-neon-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-heading tracking-wider text-text-dark mb-3">
          ORDINE CONFERMATO
        </h1>

        <p className="text-text-medium mb-2">
          Ti invieremo una conferma via email.
        </p>

        <p className="text-sm text-text-medium mb-8">
          Numero ordine:{" "}
          <span className="font-semibold text-neon-blue">{orderNumber}</span>
        </p>

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-neon-blue to-neon-purple text-white px-5 py-2 text-sm sm:px-8 sm:py-3 sm:text-base rounded-lg font-heading tracking-wider hover:opacity-90 transition-opacity"
        >
          TORNA AL NEGOZIO
        </Link>
      </div>
    </main>
  );
}

export default function OrdineConfermatoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-retro-border border-t-neon-blue rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
