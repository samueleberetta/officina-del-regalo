import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET — fetch all pipeline stages ordered by posizione
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("pipeline_stages")
    .select("*")
    .order("posizione", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// PUT — replace all stages using upsert + selective delete
export async function PUT(req: NextRequest) {
  const stages: { id: string; nome: string; colore: string; posizione: number }[] = await req.json();

  const newIds = stages.map((s) => s.id);

  // Step 1: Upsert all new/updated stages
  if (stages.length > 0) {
    const { error: upsertError } = await supabaseAdmin
      .from("pipeline_stages")
      .upsert(stages, { onConflict: "id" });

    if (upsertError) {
      return NextResponse.json({ error: "Errore upsert: " + upsertError.message }, { status: 500 });
    }
  }

  // Step 2: Delete stages that are no longer in the list
  if (newIds.length > 0) {
    const { error: deleteError } = await supabaseAdmin
      .from("pipeline_stages")
      .delete()
      .not("id", "in", `(${newIds.map((id) => `"${id}"`).join(",")})`);

    if (deleteError) {
      return NextResponse.json({ error: "Errore pulizia: " + deleteError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
