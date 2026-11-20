import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function metaFrom(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? "Logistics"),
    readingTime: String(data.readingTime ?? "4 min read"),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      return metaFrom(slug, matter(raw).data);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { ...metaFrom(slug, data), content };
}
