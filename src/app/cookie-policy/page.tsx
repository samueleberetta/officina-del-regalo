import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-heading text-4xl text-[#2C2C2C] mb-8">Cookie Policy</h1>
      <p className="text-sm text-[#6B6B6B] mb-8">Ultimo aggiornamento: Aprile 2026</p>

      <div className="prose prose-sm max-w-none text-[#2C2C2C] space-y-6">
        <h2 className="font-heading text-2xl mt-8 mb-3">1. Cosa sono i Cookie</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando
          visiti un sito web. Vengono utilizzati per far funzionare il sito in modo efficiente,
          migliorare l&apos;esperienza di navigazione e fornire informazioni ai proprietari del sito.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">2. Tipologie di Cookie Utilizzati</h2>

        <h3 className="font-heading text-xl mt-6 mb-2">2.1 Cookie Tecnici Necessari</h3>
        <p className="text-[#6B6B6B] leading-relaxed">
          Sono essenziali per il funzionamento del sito e non possono essere disattivati.
          Vengono impostati in risposta ad azioni da te effettuate, come la gestione del carrello,
          l&apos;autenticazione e le preferenze sulla privacy.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-[#2C2C2C]">Nome</th>
                <th className="text-left p-3 font-semibold text-[#2C2C2C]">Finalita</th>
                <th className="text-left p-3 font-semibold text-[#2C2C2C]">Durata</th>
              </tr>
            </thead>
            <tbody className="text-[#6B6B6B]">
              <tr className="border-t border-gray-200">
                <td className="p-3">odr-cookie-consent</td>
                <td className="p-3">Memorizza le preferenze sui cookie</td>
                <td className="p-3">12 mesi</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-3">odr-admin-token</td>
                <td className="p-3">Sessione area riservata</td>
                <td className="p-3">7 giorni</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-3">odr-cart</td>
                <td className="p-3">Contenuto del carrello</td>
                <td className="p-3">Sessione</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-heading text-xl mt-6 mb-2">2.2 Cookie Analitici</h3>
        <p className="text-[#6B6B6B] leading-relaxed">
          Questi cookie ci permettono di contare le visite e le sorgenti di traffico per misurare
          e migliorare le prestazioni del sito. Ci aiutano a sapere quali pagine sono le piu e le
          meno popolari. Tutte le informazioni raccolte da questi cookie sono aggregate e anonime.
          Vengono installati solo con il tuo consenso.
        </p>

        <h3 className="font-heading text-xl mt-6 mb-2">2.3 Cookie di Marketing</h3>
        <p className="text-[#6B6B6B] leading-relaxed">
          Questi cookie possono essere impostati attraverso il nostro sito dai nostri partner
          pubblicitari per creare un profilo dei tuoi interessi e mostrarti annunci pertinenti
          su altri siti. Vengono installati solo con il tuo consenso.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">3. Base Giuridica</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          In conformita alla Direttiva ePrivacy 2002/58/CE (modificata dalla Direttiva 2009/136/CE),
          al Regolamento UE 2016/679 (GDPR) e alle Linee Guida del Garante Privacy italiano:
        </p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li>I <strong>cookie tecnici necessari</strong> non richiedono il consenso.</li>
          <li>I <strong>cookie analitici e di marketing</strong> richiedono il tuo consenso esplicito, raccolto tramite il banner cookie al primo accesso.</li>
        </ul>

        <h2 className="font-heading text-2xl mt-8 mb-3">4. Gestione dei Cookie</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Puoi modificare le tue preferenze sui cookie in qualsiasi momento:
        </p>
        <ul className="list-disc pl-6 text-[#6B6B6B] space-y-1">
          <li>Tramite le impostazioni del tuo browser (Chrome, Firefox, Safari, Edge)</li>
          <li>Cancellando i dati di navigazione dalle impostazioni del browser</li>
        </ul>
        <p className="text-[#6B6B6B] leading-relaxed">
          Nota: la disattivazione dei cookie tecnici potrebbe compromettere il funzionamento del sito.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">5. Cookie di Terze Parti</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Il sito potrebbe contenere link o servizi di terze parti che hanno proprie politiche
          sulla privacy e sui cookie. Ti invitiamo a consultare le rispettive informative.
          Officina del Regalo non e responsabile dei cookie impostati da terze parti.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">6. Diritti dell&apos;Utente</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Per quanto riguarda i tuoi diritti in materia di protezione dei dati personali,
          ti invitiamo a consultare la nostra{" "}
          <Link href="/privacy-policy" className="text-[#B8976A] underline">Informativa sulla Privacy</Link>.
        </p>

        <h2 className="font-heading text-2xl mt-8 mb-3">7. Contatti</h2>
        <p className="text-[#6B6B6B] leading-relaxed">
          Per domande sulla nostra Cookie Policy, contattaci a:{" "}
          <a href="mailto:info@officinadelregalo.it" className="text-[#B8976A]">info@officinadelregalo.it</a>.
        </p>
      </div>
    </section>
  );
}
