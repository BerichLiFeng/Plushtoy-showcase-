"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLang, t } from "@/lib/locales/context";
import { Calendar, User, ArrowLeft } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image_key: string;
  category: string;
  published_at: string;
  is_active: boolean;
  sort_order: number;
}

export default function BlogDetailPage() {
  const { lang } = useLang();
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/public/blog/${params.slug}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setPost(data);
      } catch (e) {
        console.error("Failed to fetch post", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{lang === "zh" ? "文章未找到" : "Article not found"}</p>
        <Link href="/blog" className="text-sm text-primary hover:underline">
          {lang === "zh" ? "返回博客列表" : "Back to Blog"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          {lang === "zh" ? "返回博客列表" : "Back to Blog"}
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {post.category && (
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full uppercase tracking-wider font-medium mb-4">
            {post.category}
          </span>
        )}
        <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border/50">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.published_at}
            </span>
          )}
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
          )}
        </div>
        <div
          className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4 [&_p]:mb-4 [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Bottom CTA */}
      <section className="border-t border-border/50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {lang === "zh" ? "想了解更多关于 Dream Doll 的故事？" : "Want to learn more about Dream Doll?"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/blog"
              className="px-5 py-2 border border-primary/30 text-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
            >
              {lang === "zh" ? "更多文章" : "More Articles"}
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-all"
            >
              {lang === "zh" ? "联系我们" : "Contact Us"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}