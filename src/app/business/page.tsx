"use client";

import { useState, useEffect } from "react";
import { useLang, t } from "@/lib/locales/context";

interface BusinessItem { id: number; title: string; description: string; icon: string; image_key: string; }

export default function BusinessPage() {
  const { lang } = useLang();
  const [items, setItems] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/public/business").then(r=>r.json()).then(d=>{setItems(d);setLoading(false)}).catch(()=>setLoading(false));
  }, []);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.business")}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{t(lang, "nav.business")}</h1>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-8 shadow-sm border border-primary/5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-primary text-xl">{item.icon === "Factory" ? "🏭" : item.icon === "Wand2" ? "✨" : "🎁"}</span>
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
