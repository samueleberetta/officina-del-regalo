import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl text-neon-blue mb-8 tracking-wider">PRIVACY POLICY</h1>
      <p className="text-sm text-text-medium mb-8">Ultimo aggiornamento: Maggio 2026</p>

      <div className="prose prose-sm max-w-none text-text-dark space-y-6">
        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">1. Titolare del Trattamento</h2>
        <p className="text-text-medium leading-relaxed">
          Il Titolare del trattamento dei dati personali e <strong className="text-neon-blue">RetroStation</strong>,
          Inverigo (CO).
          Email: <a href="mailto:retrostation@gmail.com" className="text-neon-blue">retrostation@gmail.com</a>.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">2. Dati Personali Raccolti</h2>
        <p className="text-text-medium leading-relaxed">
          Raccogliamo i seguenti dati personali quando effettui un ordine o interagisci con il nostro sito:
        </p>
        <ul className="list-disc pl-6 text-text-medium space-y-1">
          <li>Nome e cognome</li>
          <li>Indirizzo email</li>
          <li>Indirizzo di spedizione (via, citta, CAP)</li>
          <li>Dati di navigazione (cookie tecnici, indirizzo IP)</li>
        </ul>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">3. Finalita del Trattamento</h2>
        <p className="text-text-medium leading-relaxed">I tuoi dati personali sono trattati per:</p>
        <ul className="list-disc pl-6 text-text-medium space-y-1">
          <li><strong>Esecuzione del contratto:</strong> gestione ordini, spedizione, comunicazioni.</li>
          <li><strong>Obblighi di legge:</strong> adempimenti fiscali e contabili.</li>
          <li><strong>Legittimo interesse:</strong> sicurezza del sito, miglioramento servizi.</li>
          <li><strong>Consenso:</strong> comunicazioni promozionali (solo con tuo consenso).</li>
        </ul>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">4. Base Giuridica</h2>
        <p className="text-text-medium leading-relaxed">
          Il trattamento si basa su: esecuzione contratto (Art. 6(1)(b) GDPR),
          obblighi legali (Art. 6(1)(c) GDPR), legittimo interesse (Art. 6(1)(f) GDPR),
          consenso (Art. 6(1)(a) GDPR).
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">5. Conservazione dei Dati</h2>
        <ul className="list-disc pl-6 text-text-medium space-y-1">
          <li>Dati ordini: 10 anni (obblighi fiscali)</li>
          <li>Dati navigazione: 12 mesi</li>
          <li>Dati marketing: fino a revoca consenso</li>
        </ul>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">6. Condivisione dei Dati</h2>
        <p className="text-text-medium leading-relaxed">I tuoi dati possono essere condivisi con:</p>
        <ul className="list-disc pl-6 text-text-medium space-y-1">
          <li>Corrieri e servizi di spedizione</li>
          <li>Fornitori di servizi tecnologici (hosting, database)</li>
          <li>Autorita competenti (quando richiesto dalla legge)</li>
        </ul>
        <p className="text-text-medium leading-relaxed">Non vendiamo ne cediamo i tuoi dati a terzi.</p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">7. Trasferimento Extra-UE</h2>
        <p className="text-text-medium leading-relaxed">
          Eventuali trasferimenti extra-UE avvengono in conformita al GDPR, tramite clausole contrattuali standard.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">8. Diritti dell&apos;Interessato</h2>
        <p className="text-text-medium leading-relaxed">Hai diritto a:</p>
        <ul className="list-disc pl-6 text-text-medium space-y-1">
          <li>Accesso, rettifica, cancellazione dei tuoi dati</li>
          <li>Limitazione e portabilita</li>
          <li>Opposizione e revoca del consenso</li>
        </ul>
        <p className="text-text-medium leading-relaxed">
          Contattaci: <a href="mailto:retrostation@gmail.com" className="text-neon-blue">retrostation@gmail.com</a>.
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">9. Reclamo</h2>
        <p className="text-text-medium leading-relaxed">
          Puoi proporre reclamo al Garante Privacy (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-neon-blue">www.garanteprivacy.it</a>).
        </p>

        <h2 className="font-heading text-xl mt-8 mb-3 text-neon-purple tracking-wider">10. Cookie</h2>
        <p className="text-text-medium leading-relaxed">
          Consulta la nostra <Link href="/cookie-policy" className="text-neon-blue underline">Cookie Policy</Link>.
        </p>
      </div>
    </section>
  );
}
