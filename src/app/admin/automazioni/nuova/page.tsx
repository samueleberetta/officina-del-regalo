"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { Automation } from "@/data/automations";
import { saveAutomation } from "@/lib/automations";
import toast from "react-hot-toast";

type TriggerTipo = Automation["trigger"]["tipo"];
type PubblicoTipo = Automation["pubblico"]["tipo"];
type AzioneTipo = Automation["azione"];

export default function NuovaAutomazionePage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [triggerTipo, setTriggerTipo] = useState<TriggerTipo>("dopo_acquisto");
  const [triggerGiorni, setTriggerGiorni] = useState(3);
  const [triggerData, setTriggerData] = useState("");
  const [pubblicoTipo, setPubblicoTipo] = useState<PubblicoTipo>("tutti");
  const [pubblicoCategoria, setPubblicoCategoria] = useState<"Matrimonio" | "Idee Regalo" | "Comunione">("Matrimonio");
  const [pubblicoImporto, setPubblicoImporto] = useState(50);
  const [pubblicoGiorni, setPubblicoGiorni] = useState(30);
  const [azione, setAzione] = useState<AzioneTipo>("email");
  const [oggetto, setOggetto] = useState("");
  const [corpo, setCorpo] = useState("");

  const previewCorpo = corpo
    .replace(/\{\{nome_cliente\}\}/g, "Mario Rossi")
    .replace(/\{\{prodotto_acquistato\}\}/g, "Portafoto in legno inciso")
    .replace(/\{\{link_negozio\}\}/g, "https://officinadelregalo.it");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toast.error("Inserisci un nome per la regola");
      return;
    }
    if (!oggetto.trim() || !corpo.trim()) {
      toast.error("Compila oggetto e messaggio");
      return;
    }

    setSaving(true);

    const newAutomation: Automation = {
      id: "auto-" + Date.now(),
      nome,
      trigger: {
        tipo: triggerTipo,
        ...(triggerTipo === "giorni_dopo_acquisto" || triggerTipo === "giorni_prima_data"
          ? { giorni: triggerGiorni }
          : {}),
        ...(triggerTipo === "data_specifica" || triggerTipo === "giorni_prima_data"
          ? { data: triggerData }
          : {}),
      },
      pubblico: {
        tipo: pubblicoTipo,
        ...(pubblicoTipo === "categoria" ? { categoria: pubblicoCategoria } : {}),
        ...(pubblicoTipo === "spesa_minima" ? { importo: pubblicoImporto } : {}),
        ...(pubblicoTipo === "inattivi" ? { giorni: pubblicoGiorni } : {}),
      },
      azione,
      messaggio: { oggetto, corpo },
      attivo: true,
      dataCreazione: new Date().toISOString().split("T")[0],
    };

    await saveAutomation(newAutomation);
    toast.success("Regola creata con successo!");
    router.push("/admin/automazioni");
  };

  const inputClass = "w-full border border-beige rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/50";
  const labelClass = "block text-sm font-bold mb-1.5";
  const radioClass = "flex items-center gap-2 cursor-pointer";

  return (
    <AdminGuard>
      <div className="p-4 md:p-8 max-w-4xl">
        <h1 className="font-heading text-2xl md:text-3xl mb-8">Crea nuova regola</h1>

        <div className="space-y-8">
          {/* Step 1 - Nome */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-heading text-lg mb-4">
              <span className="text-gold mr-2">1.</span>Dai un nome alla regola
            </h2>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
              placeholder="Es. Follow-up 3 giorni dopo acquisto"
            />
          </section>

          {/* Step 2 - Trigger */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-heading text-lg mb-4">
              <span className="text-gold mr-2">2.</span>Scegli il trigger
            </h2>
            <div className="space-y-3">
              <label className={radioClass}>
                <input type="radio" name="trigger" value="dopo_acquisto" checked={triggerTipo === "dopo_acquisto"} onChange={() => setTriggerTipo("dopo_acquisto")} className="accent-gold" />
                <span>Subito dopo un acquisto</span>
              </label>
              <label className={radioClass}>
                <input type="radio" name="trigger" value="giorni_dopo_acquisto" checked={triggerTipo === "giorni_dopo_acquisto"} onChange={() => setTriggerTipo("giorni_dopo_acquisto")} className="accent-gold" />
                <span>X giorni dopo un acquisto</span>
              </label>
              {triggerTipo === "giorni_dopo_acquisto" && (
                <div className="ml-6">
                  <input type="number" min={1} value={triggerGiorni} onChange={(e) => setTriggerGiorni(Number(e.target.value))} className="border border-beige rounded-xl px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-gold/50" /> <span className="text-sm text-text-medium">giorni</span>
                </div>
              )}
              <label className={radioClass}>
                <input type="radio" name="trigger" value="giorni_prima_data" checked={triggerTipo === "giorni_prima_data"} onChange={() => setTriggerTipo("giorni_prima_data")} className="accent-gold" />
                <span>X giorni prima di una data</span>
              </label>
              {triggerTipo === "giorni_prima_data" && (
                <div className="ml-6 flex items-center gap-3">
                  <input type="number" min={1} value={triggerGiorni} onChange={(e) => setTriggerGiorni(Number(e.target.value))} className="border border-beige rounded-xl px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-gold/50" />
                  <span className="text-sm text-text-medium">giorni prima del</span>
                  <input type="date" value={triggerData} onChange={(e) => setTriggerData(e.target.value)} className="border border-beige rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
              )}
              <label className={radioClass}>
                <input type="radio" name="trigger" value="data_specifica" checked={triggerTipo === "data_specifica"} onChange={() => setTriggerTipo("data_specifica")} className="accent-gold" />
                <span>Data e ora specifiche</span>
              </label>
              {triggerTipo === "data_specifica" && (
                <div className="ml-6">
                  <input type="datetime-local" value={triggerData} onChange={(e) => setTriggerData(e.target.value)} className="border border-beige rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
              )}
              <label className={radioClass}>
                <input type="radio" name="trigger" value="manuale" checked={triggerTipo === "manuale"} onChange={() => setTriggerTipo("manuale")} className="accent-gold" />
                <span>Manualmente (invio immediato)</span>
              </label>
            </div>
          </section>

          {/* Step 3 - Pubblico */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-heading text-lg mb-4">
              <span className="text-gold mr-2">3.</span>Scegli il pubblico
            </h2>
            <div className="space-y-3">
              <label className={radioClass}>
                <input type="radio" name="pubblico" value="tutti" checked={pubblicoTipo === "tutti"} onChange={() => setPubblicoTipo("tutti")} className="accent-gold" />
                <span>Tutti i clienti</span>
              </label>
              <label className={radioClass}>
                <input type="radio" name="pubblico" value="categoria" checked={pubblicoTipo === "categoria"} onChange={() => setPubblicoTipo("categoria")} className="accent-gold" />
                <span>Chi ha acquistato nella categoria</span>
              </label>
              {pubblicoTipo === "categoria" && (
                <div className="ml-6">
                  <select value={pubblicoCategoria} onChange={(e) => setPubblicoCategoria(e.target.value as typeof pubblicoCategoria)} className="border border-beige rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50">
                    <option value="Matrimonio">Matrimonio</option>
                    <option value="Idee Regalo">Idee Regalo</option>
                    <option value="Comunione">Comunione</option>
                  </select>
                </div>
              )}
              <label className={radioClass}>
                <input type="radio" name="pubblico" value="spesa_minima" checked={pubblicoTipo === "spesa_minima"} onChange={() => setPubblicoTipo("spesa_minima")} className="accent-gold" />
                <span>Chi ha speso più di €X</span>
              </label>
              {pubblicoTipo === "spesa_minima" && (
                <div className="ml-6 flex items-center gap-2">
                  <span className="text-text-medium">€</span>
                  <input type="number" min={1} value={pubblicoImporto} onChange={(e) => setPubblicoImporto(Number(e.target.value))} className="border border-beige rounded-xl px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>
              )}
              <label className={radioClass}>
                <input type="radio" name="pubblico" value="inattivi" checked={pubblicoTipo === "inattivi"} onChange={() => setPubblicoTipo("inattivi")} className="accent-gold" />
                <span>Chi non acquista da X giorni</span>
              </label>
              {pubblicoTipo === "inattivi" && (
                <div className="ml-6">
                  <input type="number" min={1} value={pubblicoGiorni} onChange={(e) => setPubblicoGiorni(Number(e.target.value))} className="border border-beige rounded-xl px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-gold/50" /> <span className="text-sm text-text-medium">giorni</span>
                </div>
              )}
            </div>
          </section>

          {/* Step 4 - Azione */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-heading text-lg mb-4">
              <span className="text-gold mr-2">4.</span>Scegli l&apos;azione
            </h2>
            <div className="space-y-3">
              <label className={radioClass}>
                <input type="radio" name="azione" value="email" checked={azione === "email"} onChange={() => setAzione("email")} className="accent-gold" />
                <span>Invia email personalizzata</span>
              </label>
              <label className={radioClass}>
                <input type="radio" name="azione" value="newsletter" checked={azione === "newsletter"} onChange={() => setAzione("newsletter")} className="accent-gold" />
                <span>Invia newsletter</span>
              </label>
              <label className={radioClass}>
                <input type="radio" name="azione" value="sconto" checked={azione === "sconto"} onChange={() => setAzione("sconto")} className="accent-gold" />
                <span>Invia codice sconto</span>
              </label>
            </div>
          </section>

          {/* Step 5 - Messaggio */}
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-heading text-lg mb-4">
              <span className="text-gold mr-2">5.</span>Scrivi il messaggio
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Oggetto email</label>
                <input
                  type="text"
                  value={oggetto}
                  onChange={(e) => setOggetto(e.target.value)}
                  className={inputClass}
                  placeholder="Es. Grazie per il tuo acquisto!"
                />
              </div>
              <div>
                <label className={labelClass}>Corpo del messaggio</label>
                <p className="text-xs text-text-medium mb-2">
                  Variabili disponibili: <code className="bg-beige-light px-1.5 py-0.5 rounded">{"{{nome_cliente}}"}</code>{" "}
                  <code className="bg-beige-light px-1.5 py-0.5 rounded">{"{{prodotto_acquistato}}"}</code>{" "}
                  <code className="bg-beige-light px-1.5 py-0.5 rounded">{"{{link_negozio}}"}</code>
                </p>
                <textarea
                  value={corpo}
                  onChange={(e) => setCorpo(e.target.value)}
                  rows={8}
                  className={`${inputClass} resize-none`}
                  placeholder={"Ciao {{nome_cliente}},\n\nGrazie per il tuo acquisto..."}
                />
              </div>

              {corpo && (
                <div>
                  <label className={labelClass}>Anteprima</label>
                  <div className="bg-beige-light rounded-xl p-4 border border-beige">
                    <p className="text-sm font-bold mb-2">Oggetto: {oggetto || "(nessun oggetto)"}</p>
                    <hr className="border-beige mb-3" />
                    <p className="text-sm whitespace-pre-wrap">{previewCorpo}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Azioni */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gold text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Salvataggio..." : "Salva regola"}
            </button>
            <button
              onClick={() => router.push("/admin/automazioni")}
              className="border border-beige-dark text-text-medium px-8 py-3 rounded-full font-bold hover:bg-beige-light transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
