"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "odr-cookie-consent";

type ConsentState = "pending" | "accepted" | "rejected" | "custom";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (state: ConsentState, preferences: CookiePreferences) => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ state, preferences, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent("accepted", { necessary: true, analytics: true, marketing: true });
  };

  const rejectAll = () => {
    saveConsent("rejected", { necessary: true, analytics: false, marketing: false });
  };

  const saveCustom = () => {
    saveConsent("custom", prefs);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-heading text-lg text-[#2C2C2C] mb-2">
              Questo sito utilizza i cookie
            </h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Utilizziamo cookie tecnici necessari al funzionamento del sito e, con il tuo consenso,
              cookie di analisi e marketing per migliorare la tua esperienza. Puoi accettare tutti i cookie,
              rifiutarli o personalizzare le tue preferenze. Per maggiori informazioni consulta la nostra{" "}
              <Link href="/cookie-policy" className="text-[#B8976A] underline hover:opacity-80">
                Cookie Policy
              </Link>{" "}
              e la{" "}
              <Link href="/privacy-policy" className="text-[#B8976A] underline hover:opacity-80">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {showDetails && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#2C2C2C]">Cookie necessari</span>
                  <p className="text-xs text-[#6B6B6B]">Essenziali per il funzionamento del sito. Non possono essere disattivati.</p>
                </div>
                <input type="checkbox" checked disabled className="w-5 h-5 accent-[#B8976A]" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-[#2C2C2C]">Cookie analitici</span>
                  <p className="text-xs text-[#6B6B6B]">Ci aiutano a capire come i visitatori interagiscono con il sito.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="w-5 h-5 accent-[#B8976A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-[#2C2C2C]">Cookie di marketing</span>
                  <p className="text-xs text-[#6B6B6B]">Utilizzati per mostrarti contenuti e pubblicita pertinenti.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                  className="w-5 h-5 accent-[#B8976A]"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 rounded-full bg-[#B8976A] text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Accetta tutti
            </button>
            <button
              onClick={rejectAll}
              className="px-6 py-2.5 rounded-full bg-gray-200 text-[#2C2C2C] text-sm font-semibold hover:bg-gray-300 transition"
            >
              Rifiuta non necessari
            </button>
            {showDetails ? (
              <button
                onClick={saveCustom}
                className="px-6 py-2.5 rounded-full border border-[#B8976A] text-[#B8976A] text-sm font-semibold hover:bg-[#B8976A] hover:text-white transition"
              >
                Salva preferenze
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-[#6B6B6B] text-sm font-semibold hover:border-[#B8976A] hover:text-[#B8976A] transition"
              >
                Personalizza
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
