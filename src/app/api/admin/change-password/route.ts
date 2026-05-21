import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "fallback-secret";

function verifyToken(token: string): { valid: boolean; email?: string } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email, timestamp, hash] = decoded.split(":");
    const age = Date.now() - parseInt(timestamp);
    if (age > 7 * 24 * 60 * 60 * 1000) return { valid: false };
    const expected = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(`${email}:${timestamp}`)
      .digest("hex");
    if (hash !== expected) return { valid: false };
    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}

/**
 * POST { currentPassword, newPassword } — cambia la password dell'admin
 * autenticato (identificato dal Bearer token nell'header).
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const session = verifyToken(token);
  if (!session.valid || !session.email) {
    return NextResponse.json({ error: "Sessione non valida" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Password attuale e nuova sono obbligatorie" },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "La nuova password deve avere almeno 8 caratteri" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("change_admin_password", {
    p_email: session.email,
    p_current: currentPassword,
    p_new: newPassword,
  });

  if (error) {
    console.error("[change-password] RPC error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (data !== true) {
    return NextResponse.json(
      { error: "Password attuale non corretta" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true });
}
