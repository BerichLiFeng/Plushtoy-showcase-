"use client";

import { useState, useEffect } from "react";
import { useLang, t } from "@/lib/locales/context";

interface Contact { id: number; phone: string; email: string; address: string; wechat: string; working_hours: string; }

export default function ContactPage() {
  const { lang } = useLang();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/public/contacts").then(r=>r.json()).then(d=>{setContact(d);setLoading(false)}).catch(()=>setLoading(false));
  }, []);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  const items = [
    { label: t(lang, "contact.phone"), value: contact?.phone, icon: "📞" },
    { label: t(lang, "contact.email"), value: contact?.email, icon: "✉️" },
    { label: t(lang, "contact.address"), value: contact?.address, icon: "📍" },
    { label: t(lang, "contact.wechat"), value: contact?.wechat, icon: "💬" },
    { label: t(lang, "contact.hours"), value: contact?.working_hours, icon: "🕐" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.contact")}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{t(lang, "nav.contact")}</h1>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
            {items.map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 ${i < items.length - 1 ? "border-b border-primary/5" : ""}`}>
                <span className="text-xl w-8 text-center">{item.icon}</span>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-foreground">{item.value || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
