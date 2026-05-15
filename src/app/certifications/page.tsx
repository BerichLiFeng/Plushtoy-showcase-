"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { X } from "lucide-react";

export default function CertificationsPage() {
  const [certs, setCerts] = useState<{ id: number; title: string; image_key: string; description: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch("/api/public/certifications").then((r) => r.json());
        const list = Array.isArray(data) ? data : [];
        setCerts(list);
        const keys = list.map((c: { image_key: string }) => c.image_key).filter(Boolean);
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
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">工厂资质</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">资质认证</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">我们拥有完善的生产资质和品质认证体系</p>
        </div>
      </section>
      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          {certs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">暂无资质展示</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {certs.map((cert) => (
                <div key={cert.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-border/30"
                  onClick={() => cert.image_key && setLightbox(cert.image_key)}>
                  <div className="relative aspect-[3/4]">
                    {cert.image_key && imageUrls[cert.image_key] ? (
                      <Image src={imageUrls[cert.image_key]} alt={cert.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="font-serif text-4xl text-primary/30">{cert.title?.[0] || "证"}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-center text-foreground/80">{cert.title}</p>
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
          <div className="relative w-full max-w-3xl aspect-[3/4]" onClick={(e) => e.stopPropagation()}>
            <Image src={imageUrls[lightbox]} alt="" fill className="object-contain" />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}