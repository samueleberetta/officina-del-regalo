import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl text-neon-blue mb-8 tracking-wider">COOKIE POLICY</h1>
      <p className="text-sm text-text-medium mb-8">Ultimo aggiornamento: Maggio 2026</p>

      <div className="prose prose-sm max-w-none text-text-dark space-y-6">
        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">1. Cosa sono i Cookie</h2>
        <p className="text-text-medium leading-relaxed">
          Piccoli file di testo memorizzati sul tuo dispositivo per far funzionare il sito e migliorare l&apos;esperienza.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">2. Cookie Utilizzati</h2>

        <h3 className="font-heading text-lg mt-6 mb-2 text-text-dark">2.1 Necessari</h3>
        <p className="text-text-medium leading-relaxed">
          Essenziali, non disattivabili. Gestiscono carrello, autenticazione, preferenze privacy.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-retro-border rounded-lg">
            <thead className="bg-retro-darker">
              <tr>
                <th className="text-left p-3 font-semibold text-text-dark">Nome</th>
                <th className="text-left p-3 font-semibold text-text-dark">Finalita</th>
                <th className="text-left p-3 font-semibold text-text-dark">Durata</th>
              </tr>
            </thead>
            <tbody className="text-text-medium">
              <tr className="border-t border-retro-border">
                <td className="p-3">rs-cookie-consent</td>
                <td className="p-3">Preferenze cookie</td>
                <td className="p-3">12 mesi</td>
              </tr>
              <tr className="border-t border-retro-border">
                <td className="p-3">rs-admin-token</td>
                <td className="p-3">Sessione admin</td>
                <td className="p-3">7 giorni</td>
              </tr>
              <tr className="border-t border-retro-border">
                <td className="p-3">rs-cart</td>
                <td className="p-3">Carrello</td>
                <td className="p-3">Sessione</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-heading text-lg mt-6 mb-2 text-text-dark">2.2 Analitici</h3>
        <p className="text-text-medium leading-relaxed">
          Misurano traffico e prestazioni. Solo con consenso. Dati aggregati e anonimi.
        </p>

        <h3 className="font-heading text-lg mt-6 mb-2 text-text-dark">2.3 Marketing</h3>
        <p className="text-text-medium leading-relaxed">
          Per annunci pertinenti. Solo con consenso.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">3. Base Giuridica</h2>
        <p className="text-text-medium leading-relaxed">
          Cookie tecnici: nessun consenso richiesto. Analitici e marketing: consenso esplicito via banner.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">4. Gestione</h2>
        <p className="text-text-medium leading-relaxed">
          Modifica le preferenze dal browser o cancellando i dati di navigazione.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">5. Diritti</h2>
        <p className="text-text-medium leading-relaxed">
          Vedi la nostra <Link href="/privacy-policy" className="text-neon-blue underline">Privacy Policy</Link>.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">6. Contatti</h2>
        <p className="text-text-medium leading-relaxed">
          Scrivici: <a href="mailto:retrostation@gmail.com" className="text-neon-blue">retrostation@gmail.com</a>.
        </p>
      </div>
    </section>
  );
}
