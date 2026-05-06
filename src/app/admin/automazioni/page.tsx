"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { Automation } from "@/data/automations";
import { getAutomations, updateAutomation, deleteAutomation as deleteAuto } from "@/lib/automations";
import toast from "react-hot-toast";

export default function AutomazioniPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [newsletterOggetto, setNewsletterOggetto] = useState("");
  const [newsletterCorpo, setNewsletterCorpo] = useState("");

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  const toggleAutomation = async (id: string) => {
    const automation = automations.find((a) => a.id === id);
    if (!automation) return;
    const updated = { ...automation, attivo: !automation.attivo };
    await updateAutomation(updated);
    setAutomations((prev) => prev.map((a) => (a.id === id ? updated : a)));
    toast.success("Stato aggiornato");
  };

  const handleDeleteAutomation = async (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa regola?")) return;
    await deleteAuto(id);
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    toast.success("Regola eliminata");
  };

  const triggerLabel = (a: Automation) => {
    switch (a.trigger.tipo) {
      case "dopo_acquisto": return "Subito dopo un acquisto";
      case "giorni_dopo_acquisto": return `${a.trigger.giorni} giorni dopo un acquisto`;
      case "giorni_prima_data": return `${a.trigger.giorni} giorni prima di una data`;
      case "data_specifica": return `Data specifica: ${a.trigger.data}`;
      case "manuale": return "Invio manuale";
    }
  };

  const azioneLabel = (azione: string) => {
    switch (azione) {
      case "email": return "Email personalizzata";
      case "newsletter": return "Newsletter";
      case "sconto": return "Codice sconto";
      default: return azione;
    }
  };

  const sendNewsletter = () => {
    if (!newsletterOggetto.trim() || !newsletterCorpo.trim()) {
      toast.error("Compila tutti i campi");
      return;
    }
    const mockCount = Math.floor(Math.random() * 50) + 20;
    toast.success(`Newsletter inviata a ${mockCount} clienti`);
    setNewsletterOggetto("");
    setNewsletterCorpo("");
  };

  return (
    <AdminGuard>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="font-heading text-2xl md:text-3xl">Automazioni</h1>
          <Link
            href="/admin/automazioni/nuova"
            className="bg-neon-purple text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity text-center"
          >
            Crea nuova regola
          </Link>
        </div>

        {automations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-text-medium">Nessuna regola di automazione creata.</p>
            <Link href="/admin/automazioni/nuova" className="text-neon-blue hover:underline mt-2 inline-block">
              Crea la tua prima regola
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-retro-dark">
                  <tr>
                    <th className="text-left p-4 font-bold">Nome regola</th>
                    <th className="text-left p-4 font-bold hidden md:table-cell">Trigger</th>
                    <th className="text-left p-4 font-bold hidden lg:table-cell">Azione</th>
                    <th className="text-left p-4 font-bold">Stato</th>
                    <th className="text-left p-4 font-bold hidden sm:table-cell">Data</th>
                    <th className="text-right p-4 font-bold">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {automations.map((a) => (
                    <tr key={a.id} className="hover:bg-retro-dark/50">
                      <td className="p-4 font-medium">{a.nome}</td>
                      <td className="p-4 text-text-medium hidden md:table-cell">{triggerLabel(a)}</td>
                      <td className="p-4 text-text-medium hidden lg:table-cell">{azioneLabel(a.azione)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleAutomation(a.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            a.attivo
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {a.attivo ? "Attivo" : "Inattivo"}
                        </button>
                      </td>
                      <td className="p-4 text-text-medium hidden sm:table-cell">{a.dataCreazione}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteAutomation(a.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Newsletter rapida */}
        <div className="mt-12 bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="font-heading text-xl md:text-2xl mb-6">Invia newsletter ora</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-bold mb-1">Oggetto</label>
              <input
                type="text"
                value={newsletterOggetto}
                onChange={(e) => setNewsletterOggetto(e.target.value)}
                className="w-full border border-retro-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                placeholder="Oggetto della newsletter..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Messaggio</label>
              <textarea
                value={newsletterCorpo}
                onChange={(e) => setNewsletterCorpo(e.target.value)}
                rows={6}
                className="w-full border border-retro-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 resize-none"
                placeholder="Scrivi il messaggio della newsletter..."
              />
            </div>
            <button
              onClick={sendNewsletter}
              className="bg-neon-purple text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Invia a tutti i clienti
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
