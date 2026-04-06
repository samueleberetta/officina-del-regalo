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

  return NextResponse.json(data);
}

// PUT — replace all stages (delete old + insert new)
export async function PUT(req: NextRequest) {
  const stages: { id: string; nome: string; colore: string; posizione: number }[] = await req.json();

  // Delete all existing stages
  const { error: deleteError } = await supabaseAdmin
    .from("pipeline_stages")
    .delete()
    .neq("id", "");

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Insert new stages
  if (stages.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from("pipeline_stages")
      .insert(stages);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
