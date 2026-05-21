import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { paypalFetch, PayPalConfigError } from "@/lib/paypal";
import { sendOrderConfirmationEmail } from "@/lib/email";

interface ClientePayload {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
}

interface CartItemPayload {
  id: string;
  quantita: number;
}

function generateOrderNumber(): string {
  return `#RS-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Cattura un pagamento PayPal precedentemente approvato e crea l'ordine
 * in Supabase con stato "Pagato". Il totale viene riletto dal DB,
 * non dal client.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paypalOrderId: string = body.paypalOrderId;
    const cliente: ClientePayload = body.cliente || {};
    const items: CartItemPayload[] = body.items || [];

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: "paypalOrderId mancante" },
        { status: 400 }
      );
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    // Ricalcola totali lato server dai prezzi DB
    const ids = items.map((i) => i.id);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, nome, prezzo")
      .in("id", ids);

    if (error || !products) {
      return NextResponse.json(
        { error: "Errore lettura prodotti" },
        { status: 500 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const prodottiPersisted: Array<{
      nome: string;
      prezzo: number;
      quantita: number;
    }> = [];
    let itemTotal = 0;
    for (const item of items) {
      const p = productMap.get(item.id);
      if (!p) continue;
      const qty = Math.max(1, Math.floor(item.quantita || 1));
      const prezzo = Number(p.prezzo);
      itemTotal += prezzo * qty;
      prodottiPersisted.push({ nome: p.nome, prezzo, quantita: qty });
    }
    const shipping = itemTotal >= 50 ? 0 : 5.9;
    const totale = itemTotal + shipping;

    // Cattura PayPal
    const captureRes = await paypalFetch(
      `/v2/checkout/orders/${paypalOrderId}/capture`,
      { method: "POST", body: JSON.stringify({}) }
    );

    if (!captureRes.ok) {
      const errText = await captureRes.text();
      console.error("[paypal/capture-order] Capture error:", errText);
      return NextResponse.json(
        { error: "Cattura pagamento fallita" },
        { status: 500 }
      );
    }

    const captureData = (await captureRes.json()) as {
      status?: string;
      id?: string;
    };

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Pagamento non completato: ${captureData.status}` },
        { status: 402 }
      );
    }

    // Salva l'ordine in Supabase con stato "Pagato"
    const numero_ordine = generateOrderNumber();
    const id = "ord-" + Date.now();

    const clientePersisted = {
      ...cliente,
      nome_completo: [cliente.nome, cliente.cognome].filter(Boolean).join(" "),
      numero_ordine,
      spedizione: shipping,
      paypal_order_id: paypalOrderId,
      paypal_capture_id: captureData.id,
    };

    const { error: rpcError } = await supabase.rpc("create_order", {
      p_id: id,
      p_cliente: clientePersisted,
      p_prodotti: prodottiPersisted,
      p_totale: totale,
      p_stato: "Pagato",
    });

    if (rpcError) {
      console.error("[paypal/capture-order] Supabase RPC error:", rpcError.message);
      // Pagamento riuscito ma DB fallito: ritorniamo successo PayPal con warning
      return NextResponse.json({
        success: true,
        numero_ordine,
        warning: "Pagamento ricevuto ma ordine non salvato. Contattaci.",
      });
    }

    // Invio email di conferma (best-effort, non blocca la risposta)
    if (cliente.email) {
      sendOrderConfirmationEmail({
        numero_ordine,
        cliente_nome:
          clientePersisted.nome_completo as string ||
          [cliente.nome, cliente.cognome].filter(Boolean).join(" "),
        cliente_email: cliente.email,
        prodotti: prodottiPersisted,
        totale,
        spedizione: shipping,
        indirizzo: cliente.indirizzo || "",
        citta: cliente.citta || "",
        cap: cliente.cap || "",
        stato: "Pagato",
      }).catch((e) => console.error("[paypal/capture-order] email err:", e));
    }

    return NextResponse.json({ success: true, numero_ordine, id });
  } catch (e) {
    const msg = e instanceof PayPalConfigError
      ? e.message
      : "Errore cattura pagamento";
    console.error("[paypal/capture-order] Exception:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
