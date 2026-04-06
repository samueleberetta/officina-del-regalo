import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PUT(request: NextRequest) {
  const { id, stato } = await request.json();

  if (!id || !stato) {
    return NextResponse.json({ error: "ID e stato sono obbligatori" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ stato })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
