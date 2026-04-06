"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("numero") || "ODR-0000";

  return (
    <main className="min-h-screen bg-beige-light flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Green checkmark */}
        <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-dark mb-3">
          Grazie per il tuo ordine!
        </h1>

        <p className="text-medium mb-2">
          Ti invieremo una conferma via email.
        </p>

        <p className="text-sm text-medium mb-8">
          Numero ordine:{" "}
          <span className="font-semibold text-dark">{orderNumber}</span>
        </p>

        <Link
          href="/"
          className="inline-block bg-gold text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Torna al negozio
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
          <div className="w-8 h-8 border-4 border-beige-dark border-t-gold rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
