"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const [company, setCompany] = useState<{ id: number; title: string; content: string; image_key?: string } | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/public/company");
        const data = await res.json();
        if (data?.id) {
          setCompany(data);
          if (data.image_key) {
            const { urls } = await fetch("/api/public/urls", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keys: [data.image_key] }),
            }).then((r) => r.json());
            if (urls?.[data.image_key]) setImageUrl(urls[data.image_key]);
          }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">品牌故事</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{company?.title || "品牌故事"}</h1>
        </div>
      </section>
      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {imageUrl && (
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src={imageUrl} alt={company?.title || ""} fill className="object-cover" />
              </div>
            )}
            <div className={imageUrl ? "" : "md:col-span-2"}>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: company?.content || "暂无介绍内容" }}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}