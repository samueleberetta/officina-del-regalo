import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-heading text-4xl text-[#2C2C2C] mb-8">Informativa sulla Privacy</h1>
      <p className="text-sm text-[#6B6B6B] mb-8">Ultimo aggiornamento: Aprile 2026</p>

      <div className="prose prose-sm max-w-none text-[#2C2C2C] space-y-6">
        <h2 className="font-heading text-2xl mt-8 mb-3">1. Titolare del Trattamento</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Il Titolare del trattamento dei dati personali e <strong>Officina del Regalo</strong>,
          con sede in Via dell&apos;Artigianato 12, 20100 Milano (MI), Italia.
          Email: <a href="mailto:info@officinadelregalo.it" className="text-[#B8976A]">info@officinadelregalo.it</a>.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">2. Dati Personali Raccolti</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Raccogliamo i seguenti dati personali quando effettui un ordine o interagisci con il nostro sito:
        </p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li>Nome e cognome</li>
          <li>Indirizzo email</li>
          <li>Indirizzo di spedizione (via, citta, CAP)</li>
          <li>Dati di navigazione (cookie tecnici, indirizzo IP)</li>
        </ul>

        <h2 className="font-heading text-2xl mt-8 mb-3">3. Finalita del Trattamento</h2>
        <p className="text-[#6B6B6B] leading-relaxed">I tuoi dati personali sono trattati per le seguenti finalita:</p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li><strong>Esecuzione del contratto:</strong> gestione degli ordini, spedizione dei prodotti, comunicazioni relative all&apos;ordine.</li>
          <li><strong>Obblighi di legge:</strong> adempimenti fiscali e contabili.</li>
          <li><strong>Legittimo interesse:</strong> prevenzione di frodi, sicurezza del sito, miglioramento dei servizi.</li>
          <li><strong>Consenso:</strong> invio di comunicazioni promozionali e marketing (solo con il tuo esplicito consenso).</li>
        </ul>

        <h2 className="font-heading text-2xl mt-8 mb-3">4. Base Giuridica del Trattamento</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Il trattamento dei dati si basa su: esecuzione di un contratto (Art. 6(1)(b) GDPR),
          adempimento di obblighi legali (Art. 6(1)(c) GDPR), legittimo interesse (Art. 6(1)(f) GDPR),
          e consenso dell&apos;interessato (Art. 6(1)(a) GDPR) ove applicabile.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">5. Conservazione dei Dati</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          I dati personali vengono conservati per il tempo necessario al perseguimento delle finalita indicate:
        </p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li>Dati relativi agli ordini: 10 anni (obblighi fiscali)</li>
          <li>Dati di navigazione: 12 mesi</li>
          <li>Dati per finalita di marketing: fino alla revoca del consenso</li>
        </ul>

        <h2 className="font-heading text-2xl mt-8 mb-3">6. Condivisione dei Dati</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          I tuoi dati possono essere condivisi con:
        </p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li>Corrieri e servizi di spedizione (per la consegna degli ordini)</li>
          <li>Fornitori di servizi tecnologici (hosting, database)</li>
          <li>Autorita competenti (quando richiesto dalla legge)</li>
        </ul>
        <p className="text-[#6B6B6B] leading-relaxed">
          Non vendiamo ne cediamo i tuoi dati personali a terzi per finalita commerciali.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">7. Trasferimento Extra-UE</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Alcuni dei nostri fornitori di servizi (come il provider di hosting) potrebbero essere situati
          al di fuori dell&apos;Unione Europea. In tal caso, il trasferimento avviene in conformita con le
          disposizioni del GDPR, attraverso clausole contrattuali standard approvate dalla Commissione Europea
          o altre garanzie adeguate.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">8. Diritti dell&apos;Interessato</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Ai sensi degli articoli 15-22 del GDPR, hai il diritto di:
        </p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li><strong>Accesso:</strong> ottenere conferma dell&apos;esistenza dei tuoi dati e accederne.</li>
          <li><strong>Rettifica:</strong> aggiornare o correggere dati inesatti.</li>
          <li><strong>Cancellazione:</strong> richiedere la cancellazione dei tuoi dati (&quot;diritto all&apos;oblio&quot;).</li>
          <li><strong>Limitazione:</strong> limitare il trattamento dei tuoi dati.</li>
          <li><strong>Portabilita:</strong> ricevere i tuoi dati in formato strutturato e leggibile.</li>
          <li><strong>Opposizione:</strong> opporti al trattamento dei dati basato su legittimo interesse.</li>
          <li><strong>Revoca del consenso:</strong> revocare il consenso in qualsiasi momento.</li>
        </ul>
        <p className="text-[#6B6B6B] leading-relaxed">
          Per esercitare i tuoi diritti, contattaci a:{" "}
          <a href="mailto:info@officinadelregalo.it" className="text-[#B8976A]">info@officinadelregalo.it</a>.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">9. Reclamo</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Hai il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali
          (Piazza Venezia 11, 00187 Roma, <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-[#B8976A]">www.garanteprivacy.it</a>).
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">10. Cookie</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Per informazioni dettagliate sull&apos;uso dei cookie, consulta la nostra{" "}
          <Link href="/cookie-policy" className="text-[#B8976A] underline">Cookie Policy</Link>.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">11. Modifiche</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Ci riserviamo il diritto di aggiornare questa informativa. Le modifiche saranno
          pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.
        </p>
      </div>
    </section>
  );
}
