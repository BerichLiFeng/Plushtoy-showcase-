"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang, t } from "@/lib/locales/context";
import { Calendar, ArrowRight, Clock } from "lucide-react";

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

const categoryLabels: Record<string, string> = {
  news: "News",
  products: "Products",
  industry: "Industry",
};

export default function BlogListPage() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/public/blog");
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch blog posts", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.blog")}</span>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light mt-4">
            {lang === "zh" ? "我们的故事" : "Our Stories"}
          </h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            {lang === "zh" ? "探索玩偶世界的精彩故事与行业洞见" : "Discover stories, insights, and inspiration from the world of Dream Doll"}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{lang === "zh" ? "暂无文章" : "No articles yet"}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5 hover:shadow-md hover:border-primary/10 transition-all duration-300"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/[0.06] to-secondary/[0.06] flex items-center justify-center relative overflow-hidden">
                    {post.image_key ? (
                      <span className="text-4xl opacity-50">📝</span>
                    ) : (
                      <span className="font-serif text-6xl text-primary/15 group-hover:scale-110 transition-transform duration-500">
                        {post.title[0]}
                      </span>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-primary tracking-wide uppercase">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.published_at}
                        </span>
                      )}
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.author}
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-primary text-xs font-medium group-hover:gap-2 transition-all">
                      {lang === "zh" ? "阅读更多" : "Read More"} <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}