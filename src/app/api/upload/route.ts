import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "images");
  await mkdir(uploadDir, { recursive: true });

  const uploadedPaths: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name) || ".jpg";
    const safeName = file.name
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);
    const uniqueName = `${safeName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);
    uploadedPaths.push(`/images/${uniqueName}`);
  }

  return NextResponse.json({ paths: uploadedPaths });
}
