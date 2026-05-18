import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const product = await request.json();

  const { error } = await supabaseAdmin.from("products").insert({
    id: product.id,
    nome: product.nome,
    prezzo: product.prezzo,
    marchio: product.marchio,
    tipo: product.tipo,
    categoria: product.categoria || product.tipo,
    descrizione: product.descrizione,
    immagine: product.immagine,
    immagini: product.immagini || [product.immagine],
    slug: product.slug,
    attivo: product.attivo,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const product = await request.json();

  const { error } = await supabaseAdmin
    .from("products")
    .update({
      nome: product.nome,
      prezzo: product.prezzo,
      marchio: product.marchio,
      tipo: product.tipo,
      categoria: product.categoria || product.tipo,
      descrizione: product.descrizione,
      immagine: product.immagine,
      immagini: product.immagini || [product.immagine],
      slug: product.slug,
      attivo: product.attivo,
    })
    .eq("id", product.id);

  if (error) {
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

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
