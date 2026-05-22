import { NextResponse } from "next/server";

/**
 * Endpoint diagnostico — restituisce SOLO presenza e fingerprint (primi 4 + ultimi 4
 * caratteri) delle env critiche. Non espone segreti completi.
 * Da rimuovere dopo il debug se non serve piu'.
 */
function fp(v?: string) {
  if (!v) return null;
  if (v.length <= 8) return "***";
  return `${v.slice(0, 4)}…${v.slice(-4)} (${v.length} char)`;
}

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    supabaseAnonKey: fp(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    paypalEnv: process.env.PAYPAL_ENV || null,
    paypalClientId: fp(process.env.PAYPAL_CLIENT_ID),
    paypalSecret: fp(process.env.PAYPAL_CLIENT_SECRET),
    paypalPublicClientId: fp(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
    resendApiKey: fp(process.env.RESEND_API_KEY),
    resendFromEmail: process.env.RESEND_FROM_EMAIL || null,
    resendReplyTo: process.env.RESEND_REPLY_TO || null,
    authTokenSecret: fp(process.env.AUTH_TOKEN_SECRET),
  });
}
