/**
 * Helper PayPal lato server (Orders API v2).
 *
 * Env vars richieste in `.env.local`:
 *   PAYPAL_ENV=sandbox | live
 *   PAYPAL_CLIENT_ID=...
 *   PAYPAL_CLIENT_SECRET=...
 */

const PAYPAL_LIVE_BASE = "https://api-m.paypal.com";
const PAYPAL_SANDBOX_BASE = "https://api-m.sandbox.paypal.com";

export const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live" ? PAYPAL_LIVE_BASE : PAYPAL_SANDBOX_BASE;

export class PayPalConfigError extends Error {}

function requireEnv(): { clientId: string; secret: string } {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new PayPalConfigError(
      "PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET non configurati in .env.local"
    );
  }
  return { clientId, secret };
}

/**
 * Ottiene un access token OAuth2 (client-credentials) da PayPal.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const { clientId, secret } = requireEnv();
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal OAuth failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Wrapper minimal per chiamate alle API PayPal con access token.
 */
export async function paypalFetch(
  path: string,
  init: RequestInit & { accessToken?: string } = {}
) {
  const token = init.accessToken ?? (await getPayPalAccessToken());
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${PAYPAL_BASE}${path}`, { ...init, headers });
}
