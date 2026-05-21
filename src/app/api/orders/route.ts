import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const order = await request.json();

  const cliente = {
    ...(order.cliente || {}),
    numero_ordine: order.numero_ordine,
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

  // Invio email di conferma (best-effort, non blocca la risposta)
  if (cliente.email) {
    sendOrderConfirmationEmail({
      numero_ordine: order.numero_ordine || id,
      cliente_nome:
        cliente.nome_completo ||
        [cliente.nome, cliente.cognome].filter(Boolean).join(" "),
      cliente_email: cliente.email,
      prodotti: order.prodotti || [],
      totale: Number(order.totale ?? 0),
      indirizzo: cliente.indirizzo || "",
      citta: cliente.citta || "",
      cap: cliente.cap || "",
      stato: "In lavorazione",
    }).catch((e) => console.error("[orders/POST] email err:", e));
  }

  return NextResponse.json({ success: true, id });
}
