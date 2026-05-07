import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const order = await request.json();

  const { error } = await supabaseAdmin.from("orders").insert({
    id: "ord-" + Date.now(),
    numero_ordine: order.numero_ordine,
    cliente_nome: order.cliente_nome,
    cliente_email: order.cliente_email,
    indirizzo: order.indirizzo,
    citta: order.citta,
    cap: order.cap,
    prodotti: order.prodotti,
    totale: order.totale,
    spedizione: order.spedizione,
    stato: "In lavorazione",
  });

  if (error) {
    console.error("[orders/POST] Supabase insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
