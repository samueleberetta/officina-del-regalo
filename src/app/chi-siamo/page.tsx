export default function ChiSiamoPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#F5EFE6] py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-[#2C2C2C] mb-4">
          Chi siamo
        </h1>
        <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">
          La passione per i regali fatti con il cuore.
        </p>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6 text-[#6B6B6B] leading-relaxed">
          <p>
            <strong className="text-[#2C2C2C]">Officina del Regalo</strong> nasce
            dalla passione per l&apos;artigianato e dalla convinzione che ogni
            regalo debba raccontare una storia. Siamo una bottega artigianale nel
            cuore di Milano, dove ogni oggetto viene scelto con cura per
            trasformare le occasioni speciali in ricordi indimenticabili.
          </p>
          <p>
            La nostra selezione spazia dai regali per matrimoni e comunioni fino
            alle idee regalo per ogni momento della vita. Collaboriamo con
            artigiani locali e piccoli produttori per offrire pezzi unici,
            realizzati con materiali di qualit&agrave; e un&apos;attenzione
            particolare ai dettagli.
          </p>
          <p>
            Crediamo che il valore di un regalo non stia nel prezzo, ma nel
            pensiero e nella cura con cui viene scelto. Per questo il nostro team
            &egrave; sempre disponibile per aiutarvi a trovare il dono perfetto,
            con consigli personalizzati e un servizio di confezionamento
            artigianale.
          </p>
        </div>
      </section>
    </main>
  );
}
