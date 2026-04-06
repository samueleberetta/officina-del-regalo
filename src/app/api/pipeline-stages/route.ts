import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET — fetch all pipeline stages ordered by posizione
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("pipeline_stages")
      .select("*")
      .order("posizione", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// PUT — replace all stages
export async function PUT(req: NextRequest) {
  try {
    const stages: { id: string; nome: string; colore: string; posizione: number }[] = await req.json();
    const newIds = stages.map((s) => s.id);

    // Get existing stage IDs
    const { data: existing } = await supabaseAdmin
      .from("pipeline_stages")
      .select("id");

    // Delete stages that were removed
    if (existing && existing.length > 0) {
      const idsToDelete = existing
        .map((s) => s.id)
        .filter((id) => !newIds.includes(id));

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabaseAdmin
          .from("pipeline_stages")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) {
          return NextResponse.json({ error: "Delete: " + deleteError.message }, { status: 500 });
        }
      }
    }

    // Upsert all stages
    if (stages.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from("pipeline_stages")
        .upsert(stages, { onConflict: "id" });

      if (upsertError) {
        return NextResponse.json({ error: "Upsert: " + upsertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server: " + String(e) }, { status: 500 });
  }
}
