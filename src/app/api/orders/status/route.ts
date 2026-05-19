import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(request: NextRequest) {
  const { id, stato } = await request.json();

  if (!id || !stato) {
    return NextResponse.json({ error: "ID e stato sono obbligatori" }, { status: 400 });
  }

  const { error } = await supabase.rpc("update_order_status", {
    p_id: id,
    p_stato: stato,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
