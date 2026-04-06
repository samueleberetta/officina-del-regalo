import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl mb-4">Officina del Regalo</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Regali artigianali unici per ogni occasione speciale.
              Qualità, eleganza e cura in ogni dettaglio.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4">Link rapidi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogo" className="text-gray-400 hover:text-gold transition-colors">
                  Catalogo
                </Link>
              </li>
              <li>
                <Link href="/chi-siamo" className="text-gray-400 hover:text-gold transition-colors">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-gray-400 hover:text-gold transition-colors">
                  Contatti
                </Link>
              </li>
              <li>
                <Link href="/carrello" className="text-gray-400 hover:text-gold transition-colors">
                  Carrello
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@officinadelregalo.it</li>
              <li>+39 02 1234567</li>
              <li>Via dell&apos;Artigianato 12, Milano</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Officina del Regalo. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
