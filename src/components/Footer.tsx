import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-retro-darker border-t border-retro-border text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-lg sm:text-xl mb-4">
              <span className="text-neon-blue">RETRO</span>
              <span className="text-neon-purple">STATION</span>
            </h3>
            <p className="text-text-medium text-sm leading-relaxed">
              Rivivi la tua infanzia, ovunque. Console, controller e giochi retro per veri nostalgici.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-neon-blue mb-4">Link rapidi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogo" className="text-text-medium hover:text-neon-blue transition-colors">
                  Catalogo
                </Link>
              </li>
              <li>
                <Link href="/chi-siamo" className="text-text-medium hover:text-neon-blue transition-colors">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-text-medium hover:text-neon-blue transition-colors">
                  Contatti
                </Link>
              </li>
              <li>
                <Link href="/carrello" className="text-text-medium hover:text-neon-blue transition-colors">
                  Carrello
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-neon-blue mb-4">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-text-medium hover:text-neon-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termini-e-condizioni" className="text-text-medium hover:text-neon-blue transition-colors">
                  Termini e Condizioni
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-text-medium hover:text-neon-blue transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-neon-blue mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-text-medium">
              <li>
                <a
                  href="https://www.instagram.com/retrostation00s/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-neon-purple transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @retrostation00s
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-retro-border mt-8 pt-8 text-center text-sm text-text-medium space-y-1">
          <p>&copy; {new Date().getFullYear()} RetroStation 00&apos;s. Tutti i diritti riservati.</p>
          <p>P.IVA 04273720138</p>
        </div>
      </div>
    </footer>
  );
}
