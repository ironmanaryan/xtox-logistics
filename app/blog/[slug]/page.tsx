import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getAllPosts, getPost } from "@/lib/blog";
import { absoluteUrl, socialMetadata } from "@/lib/site";
import { company } from "@/data/company";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    ...socialMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}` }),
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { "@type": "Organization", name: company.brandName },
          publisher: { "@type": "Organization", name: company.brandName },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />
      <Navbar />
      <main className="section-pad max-w-3xl pt-14">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All notes
        </Link>
        <p className="eyebrow mt-6">
          {post.category} · {post.readingTime}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted">{post.description}</p>
        <div className="prose-xtox mt-8 pb-20">
          <MDXRemote source={post.content} />
        </div>
      </main>
      <Footer />
    </>
  );
}
