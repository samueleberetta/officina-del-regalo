import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// Secret used to sign session tokens. Falls back to the anon key if no
// dedicated secret is configured (always available).
const TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "fallback-secret";

// Generate a secure session token
function generateToken(email: string): string {
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(`${email}:${timestamp}`)
    .digest("hex");
  // Token = base64(email:timestamp:hash)
  const token = Buffer.from(`${email}:${timestamp}:${hash}`).toString("base64");
  return token;
}

// Verify a session token (valid for 7 days)
function verifyToken(token: string): { valid: boolean; email?: string } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email, timestamp, hash] = decoded.split(":");

    // Check expiry (7 days)
    const age = Date.now() - parseInt(timestamp);
    if (age > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    const expectedHash = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(`${email}:${timestamp}`)
      .digest("hex");

    if (hash !== expectedHash) {
      return { valid: false };
    }

    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}

// POST - Login
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e password sono obbligatorie" },
      { status: 400 }
    );
  }

  // verify_admin e' una function SQL SECURITY DEFINER che bypassa RLS
  // sulla tabella admin_users e ritorna l'email se le credenziali combaciano.
  const { data, error } = await supabase.rpc("verify_admin", {
    p_email: email,
    p_password: password,
  });

  const verifiedEmail: string | undefined = Array.isArray(data) && data[0]?.email;

  if (error || !verifiedEmail) {
    return NextResponse.json(
      { error: "Credenziali non valide" },
      { status: 401 }
    );
  }

  const token = generateToken(verifiedEmail);

  return NextResponse.json({ success: true, token, email: verifiedEmail });
}

// GET - Verify session
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const result = verifyToken(token);

  if (!result.valid) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  return NextResponse.json({ valid: true, email: result.email });
}
