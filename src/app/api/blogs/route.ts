import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/blogStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(
      { success: true, posts },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
