"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const shipping = subtotal >= 50 ? 0 : 5.9;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    indirizzo: "",
    citta: "",
    cap: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.nome.trim()) newErrors.nome = "Il nome è obbligatorio";
    if (!form.cognome.trim()) newErrors.cognome = "Il cognome è obbligatorio";
    if (!form.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Inserisci un'email valida";
    }
    if (!form.indirizzo.trim())
      newErrors.indirizzo = "L'indirizzo è obbligatorio";
    if (!form.citta.trim()) newErrors.citta = "La città è obbligatoria";
    if (!form.cap.trim()) {
      newErrors.cap = "Il CAP è obbligatorio";
    } else if (!/^\d{5}$/.test(form.cap)) {
      newErrors.cap = "Inserisci un CAP valido (5 cifre)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    const orderNumber = `#RS-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero_ordine: orderNumber,
          cliente_nome: `${form.nome} ${form.cognome}`,
          cliente_email: form.email,
          indirizzo: form.indirizzo,
          citta: form.citta,
          cap: form.cap,
          prodotti: items.map((i) => ({
            nome: i.nome,
            prezzo: i.prezzo,
            quantita: i.quantita,
          })),
          totale: total,
          spedizione: shipping,
        }),
      });

      if (!res.ok) {
        throw new Error("Salvataggio ordine fallito");
      }
    } catch {
      setSubmitError("Si è verificato un errore. Riprova o contattaci per assistenza.");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/ordine-confermato?numero=${orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-heading tracking-wider text-text-dark mb-4">
            CARRELLO VUOTO
          </h1>
          <p className="text-text-medium mb-8">
            Aggiungi prodotti prima di procedere.
          </p>
        </div>
      </main>
    );
  }

  const fields: {
    name: keyof typeof form;
    label: string;
    type: string;
    placeholder: string;
  }[] = [
    { name: "nome", label: "Nome", type: "text", placeholder: "Mario" },
    { name: "cognome", label: "Cognome", type: "text", placeholder: "Rossi" },
    { name: "email", label: "Email", type: "email", placeholder: "mario@esempio.it" },
    { name: "indirizzo", label: "Indirizzo", type: "text", placeholder: "Via Roma 1" },
    { name: "citta", label: "Città", type: "text", placeholder: "Milano" },
    { name: "cap", label: "CAP", type: "text", placeholder: "20100" },
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading tracking-wider text-text-dark mb-8">CHECKOUT</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="bg-retro-card rounded-xl border border-retro-border p-6 space-y-5"
              noValidate
            >
              <h2 className="text-xl font-heading tracking-wider text-text-dark mb-2">
                SPEDIZIONE
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "indirizzo" || field.name === "email"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label htmlFor={field.name} className="block text-sm font-medium text-text-dark mb-1">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-retro-darker border rounded-lg text-text-dark placeholder:text-text-medium/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-shadow ${
                        errors[field.name] ? "border-red-400" : "border-retro-border"
                      }`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-400 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-medium italic">
                Pagamento sicuro in arrivo.
              </p>

              {submitError && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 rounded-lg font-heading tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "INVIO..." : "CONFERMA ORDINE"}
              </button>
            </form>
          </div>

          <div className="lg:w-80">
            <div className="bg-retro-card rounded-xl border border-retro-border p-6 sticky top-24">
              <h2 className="text-xl font-heading tracking-wider text-text-dark mb-4">RIEPILOGO</h2>

              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-text-medium">
                    <span className="truncate mr-2">{item.nome} &times; {item.quantita}</span>
                    <span className="flex-shrink-0">{formatPrice(item.prezzo * item.quantita)}</span>
                  </li>
                ))}
              </ul>

              <hr className="border-retro-border mb-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-medium">
                  <span>Subtotale</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-medium">
                  <span>Spedizione</span>
                  <span>{shipping === 0 ? "Gratuita" : formatPrice(shipping)}</span>
                </div>
                <hr className="border-retro-border" />
                <div className="flex justify-between font-bold text-text-dark text-base">
                  <span>Totale</span>
                  <span className="text-neon-blue">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
