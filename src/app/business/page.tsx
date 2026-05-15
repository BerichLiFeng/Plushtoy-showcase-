"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Factory, Palette, Sparkles } from "lucide-react";

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
      try {
        const res = await fetch("/api/public/business");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);

        const keys = (Array.isArray(data) ? data : []).map((s: Service) => s.image_key).filter(Boolean);
        if (keys.length > 0) {
          const { urls } = await fetch("/api/public/urls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
          }).then((r) => r.json());
          setImageUrls(urls || {});
        }
      } catch (err) {
        console.error("Failed to load business data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">业务板块</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">核心业务</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            从设计到生产，提供全方位的玩偶制造服务
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-7xl mx-auto space-y-16">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${idx % 2 === 1 ? "md:grid-flow-dense" : ""}`}
            >
              <div className={idx % 2 === 1 ? "md:col-start-2" : ""}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {iconMap[service.icon] || <Factory className="w-6 h-6" />}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light mb-4">{service.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </div>
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${idx % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}>
                {service.image_key && imageUrls[service.image_key] ? (
                  <Image src={imageUrls[service.image_key]} alt={service.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                    <Factory className="w-16 h-16 text-primary/20" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 section-padding bg-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light mb-4">开启合作</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            无论您需要 OEM 加工还是品牌合作，我们都竭诚为您服务
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-all">
            联系我们 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}