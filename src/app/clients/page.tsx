"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_key: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<{ id: number; name: string; description: string; logo_key: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch("/api/public/clients").then((r) => r.json());
        const items = Array.isArray(data) ? data : [];
        setClients(items);
        const keys = items.map((c: { logo_key: string }) => c.logo_key).filter(Boolean);
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
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">合作客户</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">信赖我们的伙伴</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">与众多知名品牌建立了长期稳定的合作关系</p>
        </div>
      </section>
      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-7xl mx-auto">
          {clients.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">暂无客户数据</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {clients.map((client) => (
                <div key={client.id} className="bg-white rounded-2xl p-6 border border-border/30 text-center hover:shadow-sm transition-all">
                  {client.logo_key && imageUrls[client.logo_key] ? (
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image src={imageUrls[client.logo_key]} alt={client.name} fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/5 rounded-full flex items-center justify-center">
                      <span className="font-serif text-2xl text-primary/30">{client.name[0]}</span>
                    </div>
                  )}
                  <h3 className="text-sm font-medium text-foreground/90">{client.name}</h3>
                  {client.description && <p className="text-xs text-muted-foreground mt-2">{client.description}</p>}
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