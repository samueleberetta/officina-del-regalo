"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const PAYPAL_CURRENCY = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "EUR";

function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const total = subtotal;

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
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

  /** Pura validazione del form (no side-effects) — usata anche per abilitare PayPal */
  function computeErrors(f: typeof form): Record<string, string> {
    const newErrors: Record<string, string> = {};

    if (!f.nome.trim()) newErrors.nome = "Il nome è obbligatorio";
    if (!f.cognome.trim()) newErrors.cognome = "Il cognome è obbligatorio";
    if (!f.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      newErrors.email = "Inserisci un'email valida";
    }
    if (!f.telefono.trim()) {
      newErrors.telefono = "Il numero di telefono è obbligatorio";
    } else if (!/^[+\d][\d\s().-]{6,}$/.test(f.telefono.trim())) {
      newErrors.telefono = "Inserisci un numero di telefono valido";
    }
    if (!f.indirizzo.trim()) newErrors.indirizzo = "L'indirizzo è obbligatorio";
    if (!f.citta.trim()) newErrors.citta = "La città è obbligatoria";
    if (!f.cap.trim()) {
      newErrors.cap = "Il CAP è obbligatorio";
    } else if (!/^\d{5}$/.test(f.cap)) {
      newErrors.cap = "Inserisci un CAP valido (5 cifre)";
    }

    return newErrors;
  }

  function validate(): boolean {
    const newErrors = computeErrors(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const formValid = useMemo(
    () => Object.keys(computeErrors(form)).length === 0,
    [form]
  );

  // Hack: forza un re-mount di PayPalButtons dopo che la pagina e' idratata,
  // cosi' il componente si monta DOPO che lo script SDK PayPal e' pronto
  // (altrimenti renderizza un div vuoto a tempo zero).
  const [paypalReady, setPaypalReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPaypalReady(true), 200);
    return () => clearTimeout(t);
  }, []);

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
          cliente: {
            nome: form.nome,
            cognome: form.cognome,
            nome_completo: `${form.nome} ${form.cognome}`,
            email: form.email,
            telefono: form.telefono,
            indirizzo: form.indirizzo,
            citta: form.citta,
            cap: form.cap,
          },
          prodotti: items.map((i) => ({
            nome: i.nome,
            prezzo: i.prezzo,
            quantita: i.quantita,
          })),
          totale: total,
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
    { name: "telefono", label: "Telefono", type: "tel", placeholder: "+39 333 1234567" },
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
              <p className="text-xs text-text-medium -mt-1">
                Tutti i campi sono obbligatori <span className="text-red-400">*</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "indirizzo" || field.name === "email" || field.name === "telefono"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label htmlFor={field.name} className="block text-sm font-medium text-text-dark mb-1">
                      {field.label} <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      aria-required="true"
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

              {submitError && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <div className="pt-2 border-t border-retro-border">
                <p className="text-xs uppercase tracking-widest text-text-medium font-heading mb-3">
                  Paga con
                </p>

                {/* PayPal Smart Buttons */}
                {PAYPAL_CLIENT_ID ? (
                  <div
                    className={`mb-4 transition-opacity ${
                      formValid && !submitting ? "opacity-100" : "opacity-50 pointer-events-none"
                    }`}
                    onClickCapture={() => {
                      // Se il form non e' valido, mostra gli errori invece di lasciare cliccare PayPal
                      if (!formValid) validate();
                    }}
                  >
                    <PayPalScriptProvider
                      options={{
                        clientId: PAYPAL_CLIENT_ID,
                        currency: PAYPAL_CURRENCY,
                        intent: "capture",
                      }}
                    >
                      <PayPalButtons
                        key={paypalReady ? "ready" : "loading"}
                        disabled={submitting}
                        style={{ layout: "vertical", shape: "rect", color: "gold", label: "paypal" }}
                        createOrder={async () => {
                          setSubmitError("");
                          if (!validate()) {
                            throw new Error("Compila tutti i campi della spedizione prima di pagare");
                          }
                          const res = await fetch("/api/paypal/create-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              items: items.map((i) => ({ id: i.id, quantita: i.quantita })),
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok || !data.id) {
                            throw new Error(data.error || "Errore creazione ordine PayPal");
                          }
                          return data.id as string;
                        }}
                        onApprove={async (data) => {
                          setSubmitting(true);
                          try {
                            const res = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                paypalOrderId: data.orderID,
                                cliente: form,
                                items: items.map((i) => ({ id: i.id, quantita: i.quantita })),
                              }),
                            });
                            const result = await res.json();
                            if (!res.ok || !result.numero_ordine) {
                              throw new Error(result.error || "Cattura pagamento fallita");
                            }
                            toast.success("Pagamento ricevuto!");
                            clearCart();
                            router.push(`/ordine-confermato?numero=${result.numero_ordine}`);
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : String(err);
                            setSubmitError(msg);
                            setSubmitting(false);
                          }
                        }}
                        onError={() => {
                          setSubmitError("Errore durante il pagamento PayPal. Riprova.");
                          setSubmitting(false);
                        }}
                        onCancel={() => {
                          setSubmitting(false);
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                ) : (
                  <div className="mb-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-xs">
                    PayPal non configurato. Inserisci <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in <code>.env.local</code> per abilitarlo.
                  </div>
                )}

                {/* Fallback: bonifico / contanti alla consegna */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full border border-neon-blue/60 text-neon-blue py-3 rounded-lg font-heading tracking-wider hover:bg-neon-blue/10 transition-colors disabled:opacity-50 text-sm"
                >
                  {submitting ? "INVIO..." : "BONIFICO / CONTANTI ALLA CONSEGNA"}
                </button>
                <p className="text-[11px] text-text-medium mt-2 text-center">
                  Ti contatteremo per gli estremi bonifico o per concordare il pagamento alla consegna.
                </p>
              </div>
            </form>
          </div>

          <div className="lg:w-80">
            <div className="bg-retro-card rounded-xl border border-retro-border p-6 sticky top-24">
              <h2 className="text-xl font-heading tracking-wider text-text-dark mb-4">RIEPILOGO</h2>

              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-text-medium">
                    <span className="truncate mr-2">{item.nome}</span>
                    <span className="flex-shrink-0">{formatPrice(item.prezzo)}</span>
                  </li>
                ))}
              </ul>

              <hr className="border-retro-border mb-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-medium">
                  <span>Subtotale</span>
                  <span>{formatPrice(subtotal)}</span>
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
