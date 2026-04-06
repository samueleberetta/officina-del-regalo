import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
  }

  const uploadedPaths: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);
    const uniqueName = `${safeName}_${Date.now()}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);
      continue;
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(uniqueName);

    uploadedPaths.push(urlData.publicUrl);
  }

  if (uploadedPaths.length === 0) {
    return NextResponse.json({ error: "Errore nel caricamento" }, { status: 500 });
  }

  return NextResponse.json({ paths: uploadedPaths });
}
