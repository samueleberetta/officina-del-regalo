export default function TerminiCondizioniPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl text-neon-blue mb-8 tracking-wider">TERMINI E CONDIZIONI</h1>
      <p className="text-sm text-text-medium mb-8">Ultimo aggiornamento: Maggio 2026</p>

      <div className="prose prose-sm max-w-none text-text-dark space-y-6">
        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">1. Informazioni Generali</h2>
        <p className="text-text-medium leading-relaxed">
          Il sito <strong className="text-neon-blue">retrostation.it</strong> e gestito da <strong className="text-neon-blue">RetroStation</strong>,
          Milano, Italia. Email: <a href="mailto:info@retrostation.it" className="text-neon-blue">info@retrostation.it</a>.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">2. Prodotti</h2>
        <p className="text-text-medium leading-relaxed">
          Vendiamo console, controller e giochi retro usati e ricondizionati. Ogni prodotto e testato prima della vendita.
          Trattandosi di prodotti usati, possono presentare segni di usura cosmetica che non ne compromettono il funzionamento.
          I prezzi sono comprensivi di IVA.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">3. Procedura d&apos;Ordine</h2>
        <p className="text-text-medium leading-relaxed">
          L&apos;ordine si effettua tramite checkout online. L&apos;invio dell&apos;ordine e una proposta d&apos;acquisto.
          Il contratto si conclude alla conferma da parte di RetroStation.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">4. Prezzi e Pagamento</h2>
        <p className="text-text-medium leading-relaxed">
          Prezzi in Euro, IVA inclusa. Spedizione gratuita in tutta Italia.
          Ci riserviamo di modificare i prezzi; il prezzo applicato e quello al momento dell&apos;ordine.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">5. Spedizione e Consegna</h2>
        <p className="text-text-medium leading-relaxed">
          Spediamo gratuitamente in tutta Italia. Tempi di consegna stimati, non vincolanti.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">6. Diritto di Recesso</h2>
        <p className="text-text-medium leading-relaxed">
          Hai <strong>14 giorni</strong> dal ricevimento per recedere senza motivazione (Art. 52-59 Codice del Consumo).
        </p>
        <ul className="list-disc pl-6 text-text-medium space-y-1">
          <li>Comunica il recesso a <a href="mailto:info@retrostation.it" className="text-neon-blue">info@retrostation.it</a> entro 14 giorni.</li>
          <li>Restituisci il prodotto integro entro 14 giorni.</li>
          <li>Spese di restituzione a carico tuo.</li>
          <li>Rimborso entro 14 giorni dal ricevimento del reso.</li>
        </ul>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">7. Garanzia</h2>
        <p className="text-text-medium leading-relaxed">
          Garanzia legale di conformita (Art. 128-135 Codice del Consumo). Difetti di conformita denunciabili entro 2 mesi
          dalla scoperta, entro 2 anni dalla consegna.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">8. Legge Applicabile</h2>
        <p className="text-text-medium leading-relaxed">
          Legge italiana. Foro del consumatore se residente in Italia.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">9. ODR</h2>
        <p className="text-text-medium leading-relaxed">
          Piattaforma ODR: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-neon-blue">https://ec.europa.eu/consumers/odr</a>.
        </p>
      </div>
    </section>
  );
}
