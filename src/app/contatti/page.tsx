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
      toast.error("Per favore compila tutti i campi.");
      return;
    }
    toast.success("Messaggio inviato con successo! Ti risponderemo al pi\u00F9 presto.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#F5EFE6] py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-[#2C2C2C] mb-4">
          Contatti
        </h1>
        <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">
          Siamo qui per aiutarti. Contattaci per qualsiasi informazione.
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Shop Info */}
          <div>
            <h2 className="font-heading text-2xl text-[#2C2C2C] mb-6">
              I nostri recapiti
            </h2>
            <div className="space-y-4 text-[#6B6B6B]">
              <div>
                <h3 className="font-semibold text-[#2C2C2C]">Email</h3>
                <a href="mailto:info@officinadelregalo.it" className="hover:text-[#B8976A] transition-colors">
                  info@officinadelregalo.it
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-[#2C2C2C]">Telefono</h3>
                <a href="tel:+390212345677" className="hover:text-[#B8976A] transition-colors">
                  +39 02 1234567
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-[#2C2C2C]">Indirizzo</h3>
                <p>Via dell&apos;Artigianato 12, Milano</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-2xl text-[#2C2C2C] mb-6">
              Scrivici un messaggio
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#2C2C2C] mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E8D9C5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E8D9C5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A]"
                  placeholder="La tua email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#2C2C2C] mb-1">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-[#E8D9C5] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B8976A] resize-none"
                  placeholder="Il tuo messaggio"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#B8976A] text-white px-8 py-3 font-medium hover:opacity-90 transition-opacity"
              >
                Invia messaggio
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
