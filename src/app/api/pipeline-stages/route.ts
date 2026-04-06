import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET — fetch all pipeline stages ordered by posizione
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("pipeline_stages")
    .select("*")
    .order("posizione", { ascending: true });

  if (error) {
    console.error("[pipeline-stages GET] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// PUT — replace all stages (delete old + insert new)
export async function PUT(req: NextRequest) {
  const stages: { id: string; nome: string; colore: string; posizione: number }[] = await req.json();

  // Delete ALL existing stages using a condition that matches everything
  const { error: deleteError, count: deleteCount } = await supabaseAdmin
    .from("pipeline_stages")
    .delete({ count: "exact" })
    .gte("posizione", -1);

  if (deleteError) {
    console.error("[pipeline-stages PUT] Delete error:", deleteError.message);
    return NextResponse.json({ error: "Errore cancellazione: " + deleteError.message }, { status: 500 });
  }

  console.log("[pipeline-stages PUT] Deleted", deleteCount, "stages");

  // Insert new stages
  if (stages.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from("pipeline_stages")
      .insert(stages);

    if (insertError) {
      console.error("[pipeline-stages PUT] Insert error:", insertError.message);
      return NextResponse.json({ error: "Errore inserimento: " + insertError.message }, { status: 500 });
    }

    console.log("[pipeline-stages PUT] Inserted", stages.length, "stages");
  }

  return NextResponse.json({ success: true });
}
