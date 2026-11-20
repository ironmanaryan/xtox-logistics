import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import { socialMetadata } from "@/lib/site";
import { ArrowRight } from "lucide-react";

const title = "Logistics Notes";
const description =
  "Practical guides on moving, freight, export documentation and agri cold chain — written for Indian SMEs and families, not for search engines.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/blog" }),
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main>
        <section className="section-pad pt-14">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Logistics notes.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
        </section>

        <section className="section-pad grid gap-4 pb-20 sm:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="card flex flex-col p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                {post.category} · {post.readingTime}
              </p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold"
              >
                Read <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
