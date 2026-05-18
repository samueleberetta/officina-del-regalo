import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const order = await request.json();

  const cliente = {
    ...(order.cliente || {}),
    numero_ordine: order.numero_ordine,
    spedizione: order.spedizione,
  };

  const id = "ord-" + Date.now();

  const { error } = await supabase.rpc("create_order", {
    p_id: id,
    p_cliente: cliente,
    p_prodotti: order.prodotti,
    p_totale: order.totale,
  });

  if (error) {
    console.error("[orders/POST] Supabase RPC error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id });
}
