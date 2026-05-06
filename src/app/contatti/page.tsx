"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

export default function ContattiPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Compila tutti i campi.");
      return;
    }
    toast.success("Messaggio inviato! Ti rispondiamo presto.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main>
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/10 to-retro-dark" />
        <div className="relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-4">
            <span className="text-neon-blue">CONTATTI</span>
          </h1>
          <p className="text-text-medium text-lg max-w-xl mx-auto">
            Scrivici per info su prodotti, eventi o collaborazioni.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading text-2xl text-neon-blue tracking-wider mb-6">
              RECAPITI
            </h2>
            <div className="space-y-4 text-text-medium">
              <div>
                <h3 className="font-semibold text-text-dark">Email</h3>
                <a href="mailto:info@retrostation.it" className="hover:text-neon-blue transition-colors">
                  info@retrostation.it
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark">Telefono</h3>
                <a href="tel:+390212345677" className="hover:text-neon-blue transition-colors">
                  +39 02 1234567
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark">Zona</h3>
                <p>Milano, Italia</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-neon-purple tracking-wider mb-6">
              SCRIVICI
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-retro-card border border-retro-border rounded-lg px-4 py-2 text-text-dark focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue"
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-retro-card border border-retro-border rounded-lg px-4 py-2 text-text-dark focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue"
                  placeholder="La tua email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-1">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-retro-card border border-retro-border rounded-lg px-4 py-2 text-text-dark focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue resize-none"
                  placeholder="Il tuo messaggio"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-3 font-heading tracking-wider hover:opacity-90 transition-opacity"
              >
                INVIA
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
