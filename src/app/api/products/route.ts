import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Gestione admin dei prodotti via client anon + RPC SECURITY DEFINER
 * (bypassano la RLS che limita INSERT/UPDATE/DELETE al service_role).
 */

export async function POST(request: NextRequest) {
  const product = await request.json();

  const { error } = await supabase.rpc("upsert_product", { p_data: product });

  if (error) {
    console.error("[products/POST] RPC error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const product = await request.json();

  const { error } = await supabase.rpc("upsert_product", { p_data: product });

  if (error) {
    console.error("[products/PUT] RPC error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID mancante" }, { status: 400 });
  }

  const { error } = await supabase.rpc("delete_product", { p_id: id });

  if (error) {
    console.error("[products/DELETE] RPC error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
