import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

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

  return NextResponse.json({ success: true, email: data.email });
}
