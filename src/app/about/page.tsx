"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang, t } from "@/lib/locales/context";
import { Award, CalendarCheck } from "lucide-react";

interface CompanyData {
  id: number;
  name: string;
  slogan: string;
  description: string;
  about_images: string[];
  values: string;
}

interface Certification {
  id: number;
  title: string;
  image_key: string;
  description: string;
}

interface Exhibition {
  id: number;
  title: string;
  image_key: string;
  description: string;
  date: string;
}

export default function AboutPage() {
  const { lang } = useLang();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companyRes, certRes, exhibRes] = await Promise.all([
          fetch("/api/public/company"),
          fetch("/api/public/certifications"),
          fetch("/api/public/exhibitions"),
        ]);
        const companyData = await companyRes.json();
        const certData = await certRes.json();
        const exhibData = await exhibRes.json();
        if (companyData?.id) setCompany(companyData as CompanyData);
        if (Array.isArray(certData)) setCertifications(certData);
        if (Array.isArray(exhibData)) setExhibitions(exhibData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.about")}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{company?.name || t(lang, "nav.about")}</h1>
          {company?.slogan && (
            <p className="mt-4 text-lg text-primary/70 font-serif italic">{company.slogan}</p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20">
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

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="py-16 md:py-20 bg-primary/[0.02] border-y border-primary/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <Award className="w-8 h-8 text-primary/50 mx-auto mb-3" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light">{t(lang, "nav.certifications")}</h2>
              <p className="mt-3 text-muted-foreground text-sm">{t(lang, "about.certSubtitle")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="group relative bg-white rounded-xl border border-primary/10 overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] relative bg-primary/5">
                    {cert.image_key ? (
                      <Image src={cert.image_key} alt={cert.title} fill className="object-contain p-4" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-primary/20">
                        <Award size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-medium text-foreground">{cert.title}</h3>
                    {cert.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cert.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Exhibitions */}
      {exhibitions.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <CalendarCheck className="w-8 h-8 text-primary/50 mx-auto mb-3" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light">{t(lang, "nav.exhibitions")}</h2>
              <p className="mt-3 text-muted-foreground text-sm">{t(lang, "about.exhibSubtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="group bg-white rounded-xl border border-primary/10 overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[16/10] relative bg-primary/5">
                    {exhibition.image_key ? (
                      <Image src={exhibition.image_key} alt={exhibition.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-primary/20">
                        <CalendarCheck size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {exhibition.date && (
                      <span className="text-xs text-primary/60 font-medium">{exhibition.date}</span>
                    )}
                    <h3 className="font-serif text-lg mt-1 text-foreground">{exhibition.title}</h3>
                    {exhibition.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exhibition.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
