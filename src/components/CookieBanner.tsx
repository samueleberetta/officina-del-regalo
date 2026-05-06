"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "rs-cookie-consent";

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
      <div className="max-w-4xl mx-auto bg-retro-card rounded-xl border border-retro-border p-6 neon-box">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-heading text-lg text-text-dark mb-2 tracking-wider">
              Questo sito usa i cookie
            </h3>
            <p className="text-sm text-text-medium leading-relaxed">
              Cookie tecnici per far funzionare il sito. Con il tuo consenso, anche analitici e marketing.{" "}
              <Link href="/cookie-policy" className="text-neon-blue underline hover:opacity-80">
                Cookie Policy
              </Link>{" "}
              e{" "}
              <Link href="/privacy-policy" className="text-neon-blue underline hover:opacity-80">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {showDetails && (
            <div className="border border-retro-border rounded-lg p-4 space-y-3 bg-retro-darker">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-text-dark">Cookie necessari</span>
                  <p className="text-xs text-text-medium">Essenziali. Non disattivabili.</p>
                </div>
                <input type="checkbox" checked disabled className="w-5 h-5 accent-neon-blue" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-text-dark">Cookie analitici</span>
                  <p className="text-xs text-text-medium">Capire come usi il sito.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="w-5 h-5 accent-neon-blue"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-text-dark">Cookie di marketing</span>
                  <p className="text-xs text-text-medium">Contenuti e pubblicita pertinenti.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                  className="w-5 h-5 accent-neon-blue"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-heading tracking-wider hover:opacity-90 transition"
            >
              Accetta tutti
            </button>
            <button
              onClick={rejectAll}
              className="px-6 py-2.5 rounded-lg bg-retro-darker text-text-dark text-sm font-heading tracking-wider border border-retro-border hover:border-neon-blue transition"
            >
              Rifiuta
            </button>
            {showDetails ? (
              <button
                onClick={saveCustom}
                className="px-6 py-2.5 rounded-lg border border-neon-blue text-neon-blue text-sm font-heading tracking-wider hover:bg-neon-blue hover:text-white transition"
              >
                Salva
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="px-6 py-2.5 rounded-lg border border-retro-border text-text-medium text-sm font-heading tracking-wider hover:border-neon-purple hover:text-neon-purple transition"
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
