-- =============================================
-- RetroStation — Setup database Supabase
-- Esegui questo SQL nel SQL Editor di Supabase:
-- https://supabase.com/dashboard/project/ilhegurlautjimzxesqp/sql/new
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

-- 3. Tabella pipeline stages (Kanban ordini)
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  colore TEXT NOT NULL DEFAULT 'yellow',
  posizione INTEGER NOT NULL DEFAULT 0
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
VALUES ('admin@retrostation.it', 'admin2024')
ON CONFLICT (email) DO NOTHING;

-- 6. Pipeline stages iniziali
INSERT INTO pipeline_stages (id, nome, colore, posizione) VALUES
('in-lavorazione', 'In lavorazione', 'yellow', 0),
('spedito', 'Spedito', 'blue', 1),
('consegnato', 'Consegnato', 'green', 2)
ON CONFLICT (id) DO NOTHING;

-- 7. Prodotti iniziali
INSERT INTO products (id, nome, prezzo, categoria, descrizione, immagine, immagini, slug, attivo) VALUES
('ps-1', 'PlayStation 1 — Console completa', 89.00, 'PlayStation', 'PlayStation 1 originale in ottime condizioni, testata e funzionante. Include cavi AV, alimentatore e un controller originale.', 'https://picsum.photos/seed/ps1-console/600/600', '["https://picsum.photos/seed/ps1-console/600/600"]', 'playstation-1-console-completa', true),
('ps-2', 'PlayStation 2 Slim — Nera', 75.00, 'PlayStation', 'PS2 Slim in versione nera. Lettore funzionante, include alimentatore e cavi. Pronta per giocare.', 'https://picsum.photos/seed/ps2-slim/600/600', '["https://picsum.photos/seed/ps2-slim/600/600"]', 'playstation-2-slim-nera', true),
('ps-3', 'PlayStation 3 Slim — 250GB', 95.00, 'PlayStation', 'PS3 Slim 250GB. Firmware aggiornato, lettore Blu-ray funzionante. Include controller e cavi.', 'https://picsum.photos/seed/ps3-slim/600/600', '["https://picsum.photos/seed/ps3-slim/600/600"]', 'playstation-3-slim-250gb', true),
('nin-1', 'Nintendo Wii — Bianca + Wiimote', 55.00, 'Nintendo', 'Nintendo Wii bianca con Wiimote e Nunchuk. Perfetta per le serate con gli amici. Sensor bar inclusa.', 'https://picsum.photos/seed/wii-console/600/600', '["https://picsum.photos/seed/wii-console/600/600"]', 'nintendo-wii-bianca-wiimote', true),
('nin-2', 'Game Boy Advance SP', 95.00, 'Nintendo', 'GBA SP con schermo retroilluminato, caricatore incluso. Scocca in buone condizioni.', 'https://picsum.photos/seed/gba-sp/600/600', '["https://picsum.photos/seed/gba-sp/600/600"]', 'game-boy-advance-sp', true),
('con-1', 'Controller DualShock 2 — Originale', 22.00, 'Controller', 'Controller DualShock 2 originale Sony per PS2. Analogici precisi, vibrazione funzionante.', 'https://picsum.photos/seed/dualshock2/600/600', '["https://picsum.photos/seed/dualshock2/600/600"]', 'controller-dualshock-2-originale', true),
('con-2', 'Controller Nintendo GameCube — Viola', 35.00, 'Controller', 'Controller originale GameCube viola. Stick e pulsanti reattivi. Cavo lungo 2 metri.', 'https://picsum.photos/seed/gc-controller/600/600', '["https://picsum.photos/seed/gc-controller/600/600"]', 'controller-gamecube-viola', true),
('gio-1', 'Crash Bandicoot — PS1', 18.00, 'Giochi', 'Crash Bandicoot per PlayStation 1. Disco in ottime condizioni, custodia e manuale inclusi.', 'https://picsum.photos/seed/crash-ps1/600/600', '["https://picsum.photos/seed/crash-ps1/600/600"]', 'crash-bandicoot-ps1', true),
('gio-2', 'Super Mario Bros. — NES', 30.00, 'Giochi', 'La cartuccia originale di Super Mario Bros. per NES. Un pezzo di storia dei videogiochi.', 'https://picsum.photos/seed/mario-nes/600/600', '["https://picsum.photos/seed/mario-nes/600/600"]', 'super-mario-bros-nes', true),
('gio-3', 'Mario Kart Wii + Volante', 28.00, 'Giochi', 'Mario Kart Wii con volante Wii Wheel incluso. Disco perfetto, ore di divertimento assicurate.', 'https://picsum.photos/seed/mariokart-wii/600/600', '["https://picsum.photos/seed/mariokart-wii/600/600"]', 'mario-kart-wii-volante', true),
('acc-1', 'Memory Card PS2 — 8MB', 8.00, 'Accessori', 'Memory Card originale Sony da 8MB per PlayStation 2. Formattata e pronta all uso.', 'https://picsum.photos/seed/memcard-ps2/600/600', '["https://picsum.photos/seed/memcard-ps2/600/600"]', 'memory-card-ps2-8mb', true),
('acc-2', 'Cavo AV Composito — Multi console', 10.00, 'Accessori', 'Cavo AV composito compatibile con PS1, PS2, PS3. Connettori dorati per migliore qualita audio/video.', 'https://picsum.photos/seed/cavo-av/600/600', '["https://picsum.photos/seed/cavo-av/600/600"]', 'cavo-av-composito-multi', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Ordini mock iniziali
INSERT INTO orders (id, numero_ordine, cliente_nome, cliente_email, indirizzo, citta, cap, prodotti, totale, spedizione, stato, created_at) VALUES
('ord-1', '#RS-2847', 'Marco Rossi', 'marco.rossi@email.com', 'Via Roma 15', 'Milano', '20121', '[{"nome":"PlayStation 1 — Console completa","prezzo":89,"quantita":1}]', 89.00, 0, 'Consegnato', now() - interval '5 days'),
('ord-2', '#RS-2848', 'Laura Bianchi', 'laura.bianchi@email.com', 'Corso Italia 22', 'Roma', '00185', '[{"nome":"Controller DualShock 2 — Originale","prezzo":22,"quantita":2},{"nome":"Memory Card PS2 — 8MB","prezzo":8,"quantita":1}]', 52.00, 0, 'Spedito', now() - interval '2 days'),
('ord-3', '#RS-2849', 'Giovanni Verdi', 'g.verdi@email.com', 'Via Garibaldi 8', 'Torino', '10122', '[{"nome":"Crash Bandicoot — PS1","prezzo":18,"quantita":1},{"nome":"Super Mario Bros. — NES","prezzo":30,"quantita":1}]', 48.00, 5.90, 'In lavorazione', now() - interval '1 day'),
('ord-4', '#RS-2850', 'Anna Esposito', 'anna.esp@email.com', 'Via Napoli 45', 'Napoli', '80100', '[{"nome":"PlayStation 3 Slim — 250GB","prezzo":95,"quantita":1}]', 95.00, 0, 'In lavorazione', now()),
('ord-5', '#RS-2851', 'Francesca Colombo', 'f.colombo@email.com', 'Via Dante 3', 'Firenze', '50121', '[{"nome":"Nintendo Wii — Bianca + Wiimote","prezzo":55,"quantita":1}]', 55.00, 0, 'Spedito', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- 9. Abilita RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 10. Policy: chiunque può leggere i prodotti
CREATE POLICY "Prodotti visibili a tutti" ON products
  FOR SELECT USING (true);

-- 11. Policy: solo service_role può modificare prodotti
CREATE POLICY "Solo admin modifica prodotti" ON products
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 12. Policy: ordini leggibili da tutti, modificabili solo da service_role
CREATE POLICY "Ordini leggibili da tutti" ON orders
  FOR SELECT USING (true);
CREATE POLICY "Solo admin modifica ordini" ON orders
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 13. Policy: pipeline stages leggibili da tutti, modificabili solo da service_role
CREATE POLICY "Stages leggibili da tutti" ON pipeline_stages
  FOR SELECT USING (true);
CREATE POLICY "Solo admin modifica stages" ON pipeline_stages
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 14. Policy: solo service_role per admin_users
CREATE POLICY "Solo service_role per admin" ON admin_users
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 15. Crea bucket storage per immagini
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}')
ON CONFLICT (id) DO NOTHING;

-- 16. Policy storage: chiunque può vedere le immagini
CREATE POLICY "Immagini pubbliche" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- 17. Policy storage: solo service_role può caricare/eliminare
CREATE POLICY "Solo admin carica immagini" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Solo admin elimina immagini" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
