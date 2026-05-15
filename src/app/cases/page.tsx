"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CasesPage() {
  const [cases, setCases] = useState<{ id: number; title: string; description: string; client_name?: string; image_keys?: string[] }[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch("/api/public/cases").then((r) => r.json());
        const items = Array.isArray(data) ? data : [];
        setCases(items);
        const keys: string[] = [];
        items.forEach((c: { image_keys?: string[] }) => c.image_keys?.forEach((k: string) => keys.push(k)));
        if (keys.length > 0) {
          const { urls } = await fetch("/api/public/urls", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
          }).then((r) => r.json());
          setImageUrls(urls || {});
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">合作案例</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">我们的作品</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">每一件产品都是匠心与品质的见证</p>
        </div>
      </section>
      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-7xl mx-auto">
          {cases.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">暂无案例数据</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-border/30 hover:shadow-sm transition-all">
                  <div className="relative aspect-[4/3]">
                    {item.image_keys?.[0] && imageUrls[item.image_keys[0]] ? (
                      <Image src={imageUrls[item.image_keys[0]]} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                        <span className="font-serif text-4xl text-primary/20">{item.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-sm text-foreground/90">{item.title}</h3>
                    {item.client_name && <p className="text-xs text-primary/60 mt-1">{item.client_name}</p>}
                    {item.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}