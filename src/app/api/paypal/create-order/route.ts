import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { paypalFetch, PayPalConfigError } from "@/lib/paypal";

interface CartItemPayload {
  id: string;
  quantita: number;
}

/**
 * Crea un ordine PayPal con il totale ricalcolato lato server.
 * Non si fida del prezzo passato dal client: lo rilegge da Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: CartItemPayload[] = body.items || [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    // Carica i prezzi attuali dal DB (mai fidarsi del client)
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

    type Line = { name: string; unit: number; qty: number };
    const lines: Line[] = [];
    for (const item of items) {
      const p = productMap.get(item.id);
      if (!p) {
        return NextResponse.json(
          { error: `Prodotto non trovato: ${item.id}` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(item.quantita || 1));
      lines.push({ name: p.nome, unit: Number(p.prezzo), qty });
    }

    const itemTotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
    const grandTotal = itemTotal;

    const fmt = (n: number) => n.toFixed(2);

    const paypalRes = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: fmt(grandTotal),
              breakdown: {
                item_total: { currency_code: "EUR", value: fmt(itemTotal) },
              },
            },
            items: lines.map((l) => ({
              name: l.name.slice(0, 127),
              quantity: String(l.qty),
              unit_amount: { currency_code: "EUR", value: fmt(l.unit) },
              category: "PHYSICAL_GOODS",
            })),
          },
        ],
      }),
    });

    if (!paypalRes.ok) {
      const errText = await paypalRes.text();
      console.error("[paypal/create-order] PayPal error:", errText);
      return NextResponse.json(
        { error: "Errore creazione ordine PayPal" },
        { status: 500 }
      );
    }

    const paypalData = (await paypalRes.json()) as { id: string };
    return NextResponse.json({
      id: paypalData.id,
      totale: grandTotal,
      itemTotal,
    });
  } catch (e) {
    const msg = e instanceof PayPalConfigError
      ? e.message
      : "Errore creazione ordine PayPal";
    console.error("[paypal/create-order] Exception:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
