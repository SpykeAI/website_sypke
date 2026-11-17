import { supabase } from "@/lib/supabase";
import { BLOG_POSTS, BlogPost } from "@/data/blogPosts";

const BUCKET_NAME = "site-data";
const BLOG_FILE_NAME = "blogs.json";

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(BLOG_FILE_NAME);
    if (error || !data) {
      // Seed initial posts to Supabase if not present
      await saveBlogPosts(BLOG_POSTS);
      return BLOG_POSTS;
    }
    const text = await data.text();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as BlogPost[];
    }
    return BLOG_POSTS;
  } catch (err) {
    console.error("Error reading blogs from Supabase storage:", err);
    return BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<boolean> {
  try {
    const content = JSON.stringify(posts, null, 2);
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(BLOG_FILE_NAME, content, {
        upsert: true,
        contentType: "application/json",
      });
    if (error) {
      console.error("Error saving blogs to Supabase storage:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to save blogs:", err);
    return false;
  }
}

export async function upsertBlogPost(post: BlogPost): Promise<{ success: boolean; posts: BlogPost[] }> {
  const posts = await getBlogPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  let updated: BlogPost[];
  if (index >= 0) {
    updated = [...posts];
    updated[index] = post;
  } else {
    // Add new post to beginning
    updated = [post, ...posts];
  }
  const ok = await saveBlogPosts(updated);
  return { success: ok, posts: updated };
}

export async function deleteBlogPost(slug: string): Promise<{ success: boolean; posts: BlogPost[] }> {
  const posts = await getBlogPosts();
  const updated = posts.filter((p) => p.slug !== slug);
  const ok = await saveBlogPosts(updated);
  return { success: ok, posts: updated };
}
