import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("automations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const a = await request.json();

    if (a._action === "delete") {
      if (!a.id) return NextResponse.json({ error: "ID mancante" }, { status: 400 });
      const { error } = await supabaseAdmin.from("automations").delete().eq("id", a.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    let triggerValue = "";
    if (a.trigger?.giorni) triggerValue = String(a.trigger.giorni);
    if (a.trigger?.data) triggerValue = a.trigger.data;

    let audienceValue = "";
    if (a.pubblico?.categoria) audienceValue = a.pubblico.categoria;
    if (a.pubblico?.importo) audienceValue = String(a.pubblico.importo);
    if (a.pubblico?.giorni) audienceValue = String(a.pubblico.giorni);

    const dbRow = {
      id: a.id,
      nome: a.nome,
      trigger_type: a.trigger?.tipo || a.trigger_type,
      trigger_value: triggerValue || a.trigger_value || "",
      audience_type: a.pubblico?.tipo || a.audience_type,
      audience_value: audienceValue || a.audience_value || "",
      action_type: a.azione || a.action_type,
      oggetto_email: a.messaggio?.oggetto || a.oggetto_email || "",
      corpo_email: a.messaggio?.corpo || a.corpo_email || "",
      attivo: a.attivo ?? true,
    };

    if (a._action === "update") {
      const { id, ...updateFields } = dbRow;
      const { error } = await supabaseAdmin
        .from("automations")
        .update(updateFields)
        .eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabaseAdmin.from("automations").insert(dbRow);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID mancante" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("automations").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
