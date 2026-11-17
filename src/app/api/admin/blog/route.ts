import { NextResponse } from "next/server";
import { getBlogPosts, upsertBlogPost, deleteBlogPost, saveBlogPosts } from "@/lib/blogStorage";
import { BlogPost } from "@/data/blogPosts";

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error("GET /api/admin/blog error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if bulk save or single post
    if (body.posts && Array.isArray(body.posts)) {
      const ok = await saveBlogPosts(body.posts);
      return NextResponse.json({ success: ok, posts: body.posts });
    }

    const post: BlogPost = body.post || body;
    if (!post.title || !post.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Default fallbacks if empty
    if (!post.author) {
      post.author = {
        name: "Srikanishka Vadakattu",
        role: "Founder & AI Systems Architect, Spyke AI",
        avatar: "/images/authors/srikanishka.png",
      };
    }
    if (!post.category) {
      post.category = "Cost & Economics";
    }
    if (!post.publishDate) {
      post.publishDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    if (!post.readTime) {
      post.readTime = "5 min read";
    }
    if (!post.content) {
      post.content = {
        tableOfContents: [],
        introduction: post.excerpt || "",
        sections: [],
        conclusion: "",
      };
    }

    const { success, posts } = await upsertBlogPost(post);
    return NextResponse.json({ success, post, posts });
  } catch (error: any) {
    console.error("POST /api/admin/blog error:", error);
    return NextResponse.json({ error: error?.message || "Failed to save blog post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug query parameter is required" }, { status: 400 });
    }

    const { success, posts } = await deleteBlogPost(slug);
    return NextResponse.json({ success, posts });
  } catch (error: any) {
    console.error("DELETE /api/admin/blog error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete blog post" }, { status: 500 });
  }
}
