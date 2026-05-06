import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-retro-darker border-t border-retro-border text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl mb-4">
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
              <li>info@retrostation.it</li>
              <li>+39 02 1234567</li>
              <li>Milano, Italia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-retro-border mt-8 pt-8 text-center text-sm text-text-medium">
          &copy; {new Date().getFullYear()} RetroStation 00&apos;s. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
