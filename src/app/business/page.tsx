"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";
import { ArrowRight, Factory, Palette, Sparkles } from "lucide-react";

const storage = new S3Storage();

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image_key: string;
}

const iconMap: Record<string, React.ReactNode> = {
  factory: <Factory className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
};

export default function BusinessPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const { data } = await client
        .from("business_services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      
      if (data) {
        setServices(data as Service[]);
        const urlMap: Record<string, string> = {};
        await Promise.all(
          data.map(async (s) => {
            if (s.image_key) {
              urlMap[s.image_key] = await storage.generatePresignedUrl({ key: s.image_key, expireTime: 86400 });
            }
          })
        );
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
            <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">业务板块</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">我们的服务</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              从设计到生产，从 OEM 到自有品牌，我们提供全方位的玩偶制造服务
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-500 border border-border/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  {iconMap[service.icon] || <Sparkles className="w-6 h-6" />}
                </div>
                <h3 className="font-serif text-xl text-foreground font-light mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-foreground font-light mb-4">开启合作</h2>
          <p className="text-muted-foreground text-sm mb-8">无论您有任何玩偶制造需求，我们都竭诚为您服务</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
          >
            联系我们
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}