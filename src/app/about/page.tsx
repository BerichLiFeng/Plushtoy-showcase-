"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang, t } from "@/lib/locales/context";

interface CompanyData {
  id: number;
  name: string;
  slogan: string;
  description: string;
  about_images: string[];
  values: string;
}

export default function AboutPage() {
  const { lang } = useLang();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/public/company");
        const data = await res.json();
        if (data?.id) setCompany(data as CompanyData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.about")}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{company?.name || t(lang, "nav.about")}</h1>
          {company?.slogan && (
            <p className="mt-4 text-lg text-primary/70 font-serif italic">{company.slogan}</p>
          )}
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {company?.description || t(lang, "common.loading")}
          </div>
          {company?.values && (
            <div className="mt-12 p-6 bg-primary/5 rounded-xl text-center">
              <p className="text-primary font-serif text-lg">{company.values}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
