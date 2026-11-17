import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean file name
    const ext = file.name.split(".").pop() || "png";
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const fileName = `blog-images/${Date.now()}_${cleanBase}.${ext}`;

    const { data, error } = await supabase.storage
      .from("site-data")
      .upload(fileName, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (error) {
      console.error("Supabase image upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("site-data")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error("POST /api/admin/blog/upload error:", error);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}
