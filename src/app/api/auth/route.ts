import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import crypto from "crypto";

// Generate a secure session token
function generateToken(email: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret";
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHmac("sha256", secret)
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

    // Verify hash
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback-secret";
    const expectedHash = crypto
      .createHmac("sha256", secret)
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

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Credenziali non valide" },
      { status: 401 }
    );
  }

  const token = generateToken(data.email);

  return NextResponse.json({ success: true, token, email: data.email });
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
