import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase con service role key (bypassa RLS).
 *
 * Esposto come Proxy lazy: l'oggetto sottostante viene creato solo alla
 * prima property access. Senza questa pigrizia, il modulo top-level
 * chiamava `createClient(url, undefined)` quando SUPABASE_SERVICE_ROLE_KEY
 * non era settata, facendo crashare il build di Next.js a "collect page
 * data" (esempio: build su Vercel senza service role key).
 *
 * NOTA: oggi la chiave service role non e' configurata in produzione,
 * quindi le route che usano `supabaseAdmin` falliranno a runtime. Vanno
 * migrate a `supabase` (anon) + RPC SECURITY DEFINER. Questo file resta
 * solo per non rompere il build e dare un errore chiaro al primo uso.
 */
let cached: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "supabaseAdmin non configurato: manca NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  cached = createClient(url, key);
  return cached;
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
