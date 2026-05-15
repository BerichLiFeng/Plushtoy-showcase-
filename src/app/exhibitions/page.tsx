"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { X } from "lucide-react";

export default function ExhibitionsPage() {
  const [items, setItems] = useState<{ id: number; title: string; description: string; image_key: string; date: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch("/api/public/exhibitions").then((r) => r.json());
        const list = Array.isArray(data) ? data : [];
        setItems(list);
        const keys = list.map((e: { image_key: string }) => e.image_key).filter(Boolean);
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
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">展会集锦</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">展会精彩瞬间</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">记录我们在各大展会上的风采</p>
        </div>
      </section>
      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">暂无展会记录</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <div key={item.id} className="group cursor-pointer" onClick={() => setLightbox(item.image_key)}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    {item.image_key && imageUrls[item.image_key] ? (
                      <Image src={imageUrls[item.image_key]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="font-serif text-3xl text-primary/20">{item.title?.[0] || "展"}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-foreground/80">{item.title}</p>
                    {item.date && <p className="text-[10px] text-muted-foreground mt-0.5">{item.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white z-10" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <div className="relative w-full max-w-4xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image src={imageUrls[lightbox]} alt="" fill className="object-contain" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}