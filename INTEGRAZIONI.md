# Integrazioni Future — Officina del Regalo

Questa guida descrive come collegare i servizi esterni quando sarà il momento.

---

## 1. Supabase (Database e Autenticazione)

### Setup
1. Crea un progetto su [supabase.com](https://supabase.com)
2. Copia l'URL del progetto e la chiave `anon` dalle impostazioni API
3. Aggiungi le variabili nel file `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Installa il client:
   ```bash
   npm install @supabase/supabase-js
   ```

### Tabelle da creare
- `prodotti` — id, nome, prezzo, categoria, descrizione, immagine, slug, attivo
- `ordini` — id, numero, cliente_nome, cliente_email, indirizzo, citta, cap, totale, stato, data
- `ordini_prodotti` — id, ordine_id, prodotto_id, quantita, prezzo
- `automazioni` — id, nome, trigger, pubblico, azione, messaggio, attivo, data_creazione

### Migrazione dati
Sostituire le chiamate a `localStorage` in `src/lib/products.ts` e `src/lib/automations.ts` con query Supabase.

---

## 2. Stripe (Pagamenti)

### Setup
1. Crea un account su [stripe.com](https://stripe.com)
2. Ottieni le chiavi API dal dashboard
3. Aggiungi le variabili nel file `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Installa le dipendenze:
   ```bash
   npm install stripe @stripe/stripe-js @stripe/react-stripe-js
   ```

### Implementazione
1. Crea un endpoint API `/api/checkout` che genera una Stripe Checkout Session
2. Sostituisci il form di checkout mock con il redirect a Stripe Checkout
3. Configura il webhook Stripe per aggiornare lo stato degli ordini
4. Endpoint webhook: `/api/webhooks/stripe`

---

## 3. Resend (Email)

### Setup
1. Crea un account su [resend.com](https://resend.com)
2. Verifica il dominio `officinadelregalo.it`
3. Ottieni la chiave API
4. Aggiungi la variabile nel file `.env.local`:
   ```
   RESEND_API_KEY=re_...
   ```
5. Installa il client:
   ```bash
   npm install resend
   ```

### Implementazione
1. Crea un endpoint API `/api/email/send` per l'invio email
2. Collega il sistema automazioni a Resend per l'invio effettivo
3. Template email consigliati:
   - Conferma ordine
   - Follow-up post-acquisto
   - Newsletter
   - Codice sconto

---

## Note

- Tutte le variabili d'ambiente sono elencate in `.env.example`
- Le variabili con prefisso `NEXT_PUBLIC_` sono accessibili lato client
- Le variabili senza prefisso sono disponibili solo lato server (API routes)
- Per lo sviluppo locale, crea un file `.env.local` copiando `.env.example`
