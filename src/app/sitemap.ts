import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blogPosts";
import { getBlogPosts } from "@/lib/blogStorage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://spykeai.com";
  const now = new Date();

  let posts = BLOG_POSTS;
  try {
    const livePosts = await getBlogPosts();
    if (livePosts && livePosts.length > 0) {
      posts = livePosts;
    }
  } catch (e) {
    console.error("Sitemap dynamic posts fallback to static", e);
  }

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogUrls,
    {
      url: `${baseUrl}/aboutus`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-and-cancellation`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
