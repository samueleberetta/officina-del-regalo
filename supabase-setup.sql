-- =============================================
-- Officina del Regalo — Setup database Supabase
-- Esegui questo SQL nel SQL Editor di Supabase:
-- https://supabase.com/dashboard/project/mnldlktwersyibflbnlj/sql/new
-- =============================================

-- 1. Tabella prodotti
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  prezzo NUMERIC(10,2) NOT NULL DEFAULT 0,
  categoria TEXT NOT NULL,
  descrizione TEXT NOT NULL DEFAULT '',
  immagine TEXT NOT NULL DEFAULT '',
  immagini JSONB DEFAULT '[]'::jsonb,
  slug TEXT UNIQUE NOT NULL,
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabella ordini
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  numero_ordine TEXT NOT NULL,
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  indirizzo TEXT NOT NULL DEFAULT '',
  citta TEXT NOT NULL DEFAULT '',
  cap TEXT NOT NULL DEFAULT '',
  prodotti JSONB NOT NULL DEFAULT '[]'::jsonb,
  totale NUMERIC(10,2) NOT NULL DEFAULT 0,
  spedizione NUMERIC(10,2) NOT NULL DEFAULT 0,
  stato TEXT NOT NULL DEFAULT 'In lavorazione',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabella automazioni
CREATE TABLE IF NOT EXISTS automations (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_value TEXT DEFAULT '',
  audience_type TEXT NOT NULL,
  audience_value TEXT DEFAULT '',
  action_type TEXT NOT NULL,
  oggetto_email TEXT DEFAULT '',
  corpo_email TEXT DEFAULT '',
  attivo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabella admin (credenziali login)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Inserisci admin predefinito
INSERT INTO admin_users (email, password)
VALUES ('admin@officinadelregalo.it', 'admin2024')
ON CONFLICT (email) DO NOTHING;

-- 6. Prodotti iniziali
INSERT INTO products (id, nome, prezzo, categoria, descrizione, immagine, immagini, slug, attivo) VALUES
('mat-1', 'Portafoto in legno inciso', 28.00, 'Matrimonio', 'Un elegante portafoto realizzato a mano in legno di noce, personalizzabile con incisione dei nomi degli sposi e la data del matrimonio. Un ricordo che dura per sempre.', 'https://picsum.photos/seed/portafoto/600/600', '["https://picsum.photos/seed/portafoto/600/600"]', 'portafoto-legno-inciso', true),
('mat-2', 'Set calligrafia sposi', 45.00, 'Matrimonio', 'Un raffinato set di calligrafia artigianale, perfetto per scrivere i voti nuziali o le partecipazioni. Include penna, inchiostro e carta pregiata.', 'https://picsum.photos/seed/calligrafia/600/600', '["https://picsum.photos/seed/calligrafia/600/600"]', 'set-calligrafia-sposi', true),
('mat-3', 'Candele profumate personalizzate', 32.00, 'Matrimonio', 'Candele in cera di soia con fragranze naturali, personalizzabili con i nomi degli sposi. Ideali come bomboniera o regalo per la coppia.', 'https://picsum.photos/seed/candele-mat/600/600', '["https://picsum.photos/seed/candele-mat/600/600"]', 'candele-profumate-personalizzate', true),
('mat-4', 'Album ricordi artigianale', 55.00, 'Matrimonio', 'Album fotografico fatto a mano con copertina in tela e dettagli dorati. Contiene 60 pagine in carta avorio per conservare i momenti più belli.', 'https://picsum.photos/seed/album-ricordi/600/600', '["https://picsum.photos/seed/album-ricordi/600/600"]', 'album-ricordi-artigianale', true),
('reg-1', 'Scatola regalo sorpresa', 22.00, 'Idee Regalo', 'Una scatola regalo curata con una selezione di piccoli oggetti artigianali a sorpresa. Ogni scatola è unica e confezionata con cura.', 'https://picsum.photos/seed/scatola-regalo/600/600', '["https://picsum.photos/seed/scatola-regalo/600/600"]', 'scatola-regalo-sorpresa', true),
('reg-2', 'Tazza personalizzata', 18.00, 'Idee Regalo', 'Tazza in ceramica artigianale decorata a mano. Personalizzabile con nome, iniziali o un breve messaggio. Perfetta per ogni occasione.', 'https://picsum.photos/seed/tazza/600/600', '["https://picsum.photos/seed/tazza/600/600"]', 'tazza-personalizzata', true),
('reg-3', 'Kit profumeria casalinga', 38.00, 'Idee Regalo', 'Un kit completo per profumare la casa: diffusore in ceramica, oli essenziali naturali e sacchetti profumati alla lavanda. Tutto realizzato artigianalmente.', 'https://picsum.photos/seed/profumeria/600/600', '["https://picsum.photos/seed/profumeria/600/600"]', 'kit-profumeria-casalinga', true),
('reg-4', 'Cesto prodotti artigianali', 65.00, 'Idee Regalo', 'Un cesto in vimini intrecciato a mano, riempito con prodotti artigianali locali: miele, marmellata, saponi naturali e cioccolato fondente.', 'https://picsum.photos/seed/cesto/600/600', '["https://picsum.photos/seed/cesto/600/600"]', 'cesto-prodotti-artigianali', true),
('com-1', 'Rosario personalizzato', 24.00, 'Comunione', 'Un rosario realizzato con perle di vetro di Murano e croce in argento. Personalizzabile con incisione del nome e della data della Prima Comunione.', 'https://picsum.photos/seed/rosario/600/600', '["https://picsum.photos/seed/rosario/600/600"]', 'rosario-personalizzato', true),
('com-2', 'Portarosario in velluto', 15.00, 'Comunione', 'Elegante custodia in velluto bordeaux per rosario, con chiusura magnetica e interno foderato in seta. Un accessorio raffinato per un giorno speciale.', 'https://picsum.photos/seed/portarosario/600/600', '["https://picsum.photos/seed/portarosario/600/600"]', 'portarosario-velluto', true),
('com-3', 'Libro dei ricordi Comunione', 42.00, 'Comunione', 'Un libro dei ricordi illustrato con pagine da compilare per conservare foto, pensieri e dediche del giorno della Prima Comunione. Copertina rigida con dettagli oro.', 'https://picsum.photos/seed/libro-comunione/600/600', '["https://picsum.photos/seed/libro-comunione/600/600"]', 'libro-ricordi-comunione', true),
('com-4', 'Candela Comunione con nome', 20.00, 'Comunione', 'Candela decorativa in cera bianca con croce dorata e nome del bambino inciso. Confezionata in scatola regalo trasparente.', 'https://picsum.photos/seed/candela-comunione/600/600', '["https://picsum.photos/seed/candela-comunione/600/600"]', 'candela-comunione-nome', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Ordini mock iniziali
INSERT INTO orders (id, numero_ordine, cliente_nome, cliente_email, indirizzo, citta, cap, prodotti, totale, spedizione, stato, created_at) VALUES
('ord-1', '#ODR-2847', 'Marco Rossi', 'marco.rossi@email.com', 'Via Roma 15', 'Milano', '20121', '[{"nome":"Portafoto in legno inciso","prezzo":28,"quantita":1}]', 28.00, 5.90, 'Consegnato', now() - interval '5 days'),
('ord-2', '#ODR-2848', 'Laura Bianchi', 'laura.bianchi@email.com', 'Corso Italia 22', 'Roma', '00185', '[{"nome":"Set calligrafia sposi","prezzo":45,"quantita":1},{"nome":"Album ricordi artigianale","prezzo":55,"quantita":1}]', 100.00, 0, 'Spedito', now() - interval '2 days'),
('ord-3', '#ODR-2849', 'Giovanni Verdi', 'g.verdi@email.com', 'Via Garibaldi 8', 'Torino', '10122', '[{"nome":"Rosario personalizzato","prezzo":24,"quantita":2}]', 48.00, 5.90, 'In lavorazione', now() - interval '1 day'),
('ord-4', '#ODR-2850', 'Anna Esposito', 'anna.esp@email.com', 'Via Napoli 45', 'Napoli', '80100', '[{"nome":"Cesto prodotti artigianali","prezzo":65,"quantita":1}]', 65.00, 0, 'In lavorazione', now()),
('ord-5', '#ODR-2851', 'Francesca Colombo', 'f.colombo@email.com', 'Via Dante 3', 'Firenze', '50121', '[{"nome":"Tazza personalizzata","prezzo":18,"quantita":3}]', 54.00, 0, 'Spedito', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- 8. Abilita RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 9. Policy: chiunque può leggere i prodotti attivi
CREATE POLICY "Prodotti visibili a tutti" ON products
  FOR SELECT USING (true);

-- 10. Policy: solo service_role può modificare prodotti
CREATE POLICY "Solo admin modifica prodotti" ON products
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 11. Policy: solo service_role per ordini
CREATE POLICY "Ordini leggibili da tutti" ON orders
  FOR SELECT USING (true);
CREATE POLICY "Solo admin modifica ordini" ON orders
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 12. Policy: solo service_role per automazioni
CREATE POLICY "Automazioni leggibili da tutti" ON automations
  FOR SELECT USING (true);
CREATE POLICY "Solo admin modifica automazioni" ON automations
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 13. Policy: solo service_role per admin_users
CREATE POLICY "Solo service_role per admin" ON admin_users
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 14. Crea bucket storage per immagini (esegui separatamente se necessario)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}')
ON CONFLICT (id) DO NOTHING;

-- 15. Policy storage: chiunque può vedere le immagini
CREATE POLICY "Immagini pubbliche" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- 16. Policy storage: solo service_role può caricare
CREATE POLICY "Solo admin carica immagini" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Solo admin elimina immagini" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
