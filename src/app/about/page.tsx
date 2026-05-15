"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";

const storage = new S3Storage();

interface CompanyInfo {
  company_name: string;
  slogan: string;
  description: string;
  mission: string;
  history: string;
  logo_key: string;
  cover_image_key: string;
}

export default function AboutPage() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const { data } = await client.from("company_info").select("*").maybeSingle();
      if (data) {
        setCompany(data as CompanyInfo);
        const urlMap: Record<string, string> = {};
        if (data.cover_image_key) {
          urlMap[data.cover_image_key] = await storage.generatePresignedUrl({ key: data.cover_image_key, expireTime: 86400 });
        }
        if (data.logo_key) {
          urlMap[data.logo_key] = await storage.generatePresignedUrl({ key: data.logo_key, expireTime: 86400 });
        }
        setImageUrls(urlMap);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">品牌故事</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">
              {company?.company_name || "Dream Doll"}
            </h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {company?.slogan || "以匠心工艺，传递梦幻"}
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 section-padding">
        <div className="max-w-4xl mx-auto">
          {company?.cover_image_key && imageUrls[company.cover_image_key] && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12">
              <Image
                src={imageUrls[company.cover_image_key]}
                alt={company.company_name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-sm md:prose-base max-w-none">
            {company?.description && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl text-foreground font-light mb-4">关于我们</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.description}</p>
              </div>
            )}

            {company?.mission && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl text-foreground font-light mb-4">品牌使命</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.mission}</p>
              </div>
            )}

            {company?.history && (
              <div>
                <h2 className="font-serif text-2xl text-foreground font-light mb-4">发展历程</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.history}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}