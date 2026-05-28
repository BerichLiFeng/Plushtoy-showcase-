"use client";

import { useState, useEffect } from "react";
import { useLang, t } from "@/lib/locales/context";

interface Cert { id: number; title: string; description: string; image_key: string; }

export default function CertificationsPage() {
  const { lang } = useLang();
  const [items, setItems] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/public/certifications").then(r=>r.json()).then(d=>{setItems(d);setLoading(false)}).catch(()=>setLoading(false));
  }, []);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.certifications")}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{t(lang, "nav.certifications")}</h1>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-8 shadow-sm border border-primary/5 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                <span className="text-xl text-primary/40">📜</span>
              </div>
              <h3 className="font-serif text-lg mb-2 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
