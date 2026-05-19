import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET — fetch all pipeline stages ordered by posizione
export async function GET() {
  try {
    const { data, error } = await supabase
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

// POST — replace all stages using SECURITY DEFINER RPC (bypassa RLS in modo controllato)
export async function POST(req: NextRequest) {
  try {
    const stages: { id: string; nome: string; colore: string; posizione: number }[] =
      await req.json();

    const { error } = await supabase.rpc("save_pipeline_stages", {
      p_stages: stages,
    });

    if (error) {
      console.error("[pipeline-stages/POST] RPC error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server: " + String(e) }, { status: 500 });
  }
}
