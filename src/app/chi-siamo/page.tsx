export default function ChiSiamoPage() {
  return (
    <main>
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 to-retro-dark" />
        <div className="relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-4">
            <span className="text-neon-blue">CHI</span>{" "}
            <span className="text-neon-purple">SIAMO</span>
          </h1>
          <p className="text-text-medium text-lg max-w-xl mx-auto">
            La passione per il retrogaming, dal 2000.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6 text-text-medium leading-relaxed">
          <p>
            <strong className="text-neon-blue">RetroStation</strong> nasce dalla
            nostalgia per le console che ci hanno fatto crescere. PS1, PS2,
            Nintendo 64, Game Boy, Wii — ogni pezzo che vendiamo e un pezzo di
            storia dei videogiochi, testato e pronto per essere rivissuto.
          </p>
          <p>
            Non siamo solo un negozio. Organizziamo serate retrogaming nei bar
            di Milano, dove puoi sfidare gli amici a Tekken, Mario Kart o
            GoldenEye davanti a una birra. Crediamo che il gaming migliore sia
            quello condiviso, faccia a faccia, con un controller in mano.
          </p>
          <p>
            Ogni console passa attraverso i nostri test: pulizia, verifica
            hardware, sostituzione componenti usurati. Vendiamo solo roba che
            funziona. Se non funziona, la ripariamo o non la vendiamo.
          </p>
        </div>
      </section>
    </main>
  );
}
