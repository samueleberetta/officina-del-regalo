# RetroStation 00's

E-commerce per console retro e accessori — Next.js 14 + Supabase + PayPal.

🌐 **Produzione**: <https://www.retrostation00s.it>
📷 **Instagram**: [@retrostation00s](https://www.instagram.com/retrostation00s/)
🧾 **P.IVA**: 04273720138

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (palette neon retro + Orbitron/Rajdhani)
- **Supabase** (Postgres + Storage)
- **PayPal Smart Buttons** (Orders API v2) + opzione bonifico
- Deploy su **Vercel** con auto-deploy da branch `claude/ecommerce-gift-shop-dvoS6`

---

## Setup locale (sviluppo)

### 1. Prerequisiti

- Node.js 20+
- Account Supabase con accesso al progetto `ilhegurlautjimzxesqp` (RetroStation)
- (Opzionale per pagamenti reali) account PayPal Business con app **Live** o **Sandbox**

### 2. Clona e installa

```bash
git clone https://github.com/samueleberetta/retrostation.git
cd retrostation
npm install
```

### 3. Crea `.env.local`

```dotenv
# Supabase (obbligatorie)
NEXT_PUBLIC_SUPABASE_URL=https://ilhegurlautjimzxesqp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chiave anon di Supabase>

# Secret per firmare i token di sessione admin (random ~48+ char)
AUTH_TOKEN_SECRET=<stringa random — generala con `openssl rand -base64 48`>

# PayPal (obbligatorie per il checkout — usa Sandbox per i test)
PAYPAL_ENV=sandbox            # oppure "live"
PAYPAL_CLIENT_ID=<dalla App PayPal sandbox/live>
PAYPAL_CLIENT_SECRET=<dalla App PayPal sandbox/live>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<stesso valore di PAYPAL_CLIENT_ID>
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR

# Email transactional (Resend) — opzionale: se manca, le email vengono saltate
RESEND_API_KEY=<key da https://resend.com/api-keys>
RESEND_FROM_EMAIL=RetroStation <negozio@retrostation00s.it>
RESEND_REPLY_TO=retrostation@gmail.com
```

Le variabili `NEXT_PUBLIC_*` finiscono nel bundle client; le altre restano server-only. **Mai** committare `.env.local` (è in `.gitignore`).

### 4. Avvia il dev server

```bash
npm run dev
```

Apri <http://localhost:3000>.

---

## Aree del sito

| Path | Cosa fa |
|---|---|
| `/` | Home (hero, categorie, ultimi arrivi) |
| `/catalogo` | Lista prodotti con filtri marchio (PlayStation/Nintendo/Xbox/Altre) + tipologia (Console/Controller/Giochi/Accessori) |
| `/prodotto/[slug]` | Dettaglio prodotto + "Potrebbe interessarti" |
| `/carrello` | Carrello "pezzo unico" (no quantità) |
| `/checkout` | Form spedizione + **PayPal Smart Buttons** + fallback "Bonifico/Contanti" |
| `/ordine-confermato?numero=...` | Conferma ordine |
| `/admin/login` | Login admin |
| `/admin/dashboard` | Stats + ordini recenti (filtro periodo) |
| `/admin/prodotti` | CRUD prodotti + upload foto |
| `/admin/ordini` | Tabella + kanban con drag&drop (stati: Pagato/Nuovo/In lavorazione/Spedito) |
| `/admin/impostazioni` | Cambio password admin (bcrypt) |

---

## Modello dati (Supabase)

Tabelle principali:

- **`products`** — id, nome, prezzo, **marchio** (PlayStation/Nintendo/Xbox/Altro), **tipo** (Console/Controller/Giochi/Accessori), categoria (legacy), descrizione, immagine, immagini[], slug, attivo
- **`orders`** — id, cliente (jsonb con nome/email/telefono/indirizzo/numero_ordine/paypal_*), prodotti (jsonb[]), totale, stato, data_ordine
- **`pipeline_stages`** — id, nome, colore, posizione (per la kanban admin)
- **`admin_users`** — email, password (bcrypt)

Storage:

- bucket **`product-images`** (pubblico) — foto caricate dall'admin

### RLS & RPC pattern

Tutte le tabelle hanno RLS che limita INSERT/UPDATE/DELETE a `service_role`. Per non dover esporre la service role key in produzione, ogni operazione "amministrativa" passa da una **RPC SECURITY DEFINER** chiamabile dal client anon:

| RPC | Scopo |
|---|---|
| `verify_admin(email, password)` | Login — confronto bcrypt |
| `change_admin_password(email, current, new)` | Cambio password |
| `get_orders()` | Lista ordini per la dashboard/kanban |
| `create_order(id, cliente, prodotti, totale, stato)` | Crea ordine (da PayPal capture o bonifico) |
| `update_order_status(id, stato)` | Cambio stato kanban |
| `upsert_product(jsonb)` | Crea/aggiorna prodotto |
| `delete_product(id)` | Elimina prodotto |
| `save_pipeline_stages(jsonb)` | Aggiorna le colonne kanban |

---

## Deploy su Vercel

Il progetto è già linkato a Vercel: ogni push su `claude/ecommerce-gift-shop-dvoS6` triggera un deploy in produzione automaticamente.

### Env vars su Vercel

Vanno configurate identiche al `.env.local`, tramite **Settings → Environment Variables** (applica a Production + Preview + Development). Le 8 variabili sopra elencate sono tutte obbligatorie tranne `AUTH_TOKEN_SECRET` che ha un fallback (consigliato comunque settarlo).

### Domini

- `www.retrostation00s.it` (primario)
- `retrostation00s.it` (redirect)
- `retrostation00s.vercel.app` (fallback Vercel)

### Procedura cambio chiavi PayPal Sandbox → Live

1. Su <https://developer.paypal.com> tab **Live** → Create App "RetroStation"
2. Copia Client ID + Secret
3. Su Vercel modifica:
   ```
   PAYPAL_ENV=live
   PAYPAL_CLIENT_ID=<Live>
   PAYPAL_CLIENT_SECRET=<Live>
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<Live>
   ```
4. Redeploy (push qualsiasi commit, anche `git commit --allow-empty -m "redeploy"`)
5. Test acquisto reale da €1-€2 con un secondo account PayPal/carta

---

## Migrazioni Supabase

Le migrazioni applicate sul progetto `ilhegurlautjimzxesqp` non sono in repo (per ora). Quelle principali:

- `add_marchio_tipo_to_products` — colonne marchio/tipo per filtri catalogo
- `add_verify_admin_rpc` — RPC login admin
- `add_create_order_rpc` — RPC creazione ordine
- `add_get_orders_rpc` — RPC lettura ordini per admin (+ update_order_status)
- `add_save_pipeline_stages_rpc` — RPC kanban editor
- `add_paypal_payment_support` — estende create_order con `p_stato`, aggiunge stage "Pagato"
- `add_product_admin_rpcs` — upsert_product + delete_product
- `hash_admin_passwords_bcrypt` — pgcrypto + bcrypt per le password admin
- `rename_pipeline_stages_ordine_to_posizione` — rename colonna

Per applicare nuove migrazioni: usare Supabase Studio (SQL Editor) o il Supabase MCP da Claude Code.

---

## Comandi utili

```bash
npm run dev         # dev server su :3000
npm run build       # build di produzione (verifica errori TS/ESLint)
npm run start       # serve la build (post npm run build)
npm run lint        # ESLint
```

---

## Sicurezza

- ✅ Password admin **bcrypt** (cost 10)
- ✅ Token di sessione HMAC-SHA256 firmati con `AUTH_TOKEN_SECRET`
- ✅ Totale ordine PayPal **ricalcolato server-side** dai prezzi DB (no fiducia nel client)
- ✅ Tutte le RPC sensibili usano `SECURITY DEFINER` + `GRANT EXECUTE` controllato
- ✅ `.env.local` gitignored
- ⚠️ `PAYPAL_CLIENT_SECRET` mai esposta lato client
- ⚠️ La service role key non è configurata — tutto va via anon + RPC
- ⏳ Webhook PayPal per chargeback/refund: ancora da fare

---

## Credenziali demo (sandbox / dev)

- Admin: `admin@retrostation.it` / `admin2024`
  *(cambiare appena possibile da /admin/impostazioni)*

---

## TODO / Roadmap

- [x] Email automatica di conferma ordine al cliente (Resend)
- [ ] Webhook PayPal per refund/chargeback automatici
- [ ] Auto-disattivazione prodotto "pezzo unico" al primo acquisto
- [ ] Apple Pay / Google Pay (richiede verifica dominio PayPal)
- [ ] Sitemap, OG image, structured data per SEO
- [ ] Spedizione dinamica via API corriere (BRT/Poste/SDA)
