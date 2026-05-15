"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_key: string;
  link_url: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image_keys: string[];
  price: string;
  category_name?: string;
  category_slug?: string;
}

interface Client {
  id: number;
  name: string;
  logo_key: string;
}

interface CaseItem {
  id: number;
  title: string;
  description: string;
  client_name?: string;
  image_keys?: string[];
}

interface CompanyInfo {
  id: number;
  title: string;
  content: string;
  image_key?: string;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  // Image URL resolving (simplified - shows placeholder until images uploaded)
  const imageUrls: Record<string, string> = {};
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const bannerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bannersData, productsData, clientsData, casesData, companyData] = await Promise.all([
          fetch("/api/public/banners").then(r => r.json()),
          fetch("/api/public/products").then(r => r.json()),
          fetch("/api/public/clients").then(r => r.json()),
          fetch("/api/public/cases").then(r => r.json()),
          fetch("/api/public/company").then(r => r.json()),
        ]);
        setBanners(Array.isArray(bannersData) ? bannersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setClients(Array.isArray(clientsData) ? clientsData : []);
        setCases(Array.isArray(casesData) ? casesData : []);
        setCompany(companyData?.id ? companyData : null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Banner auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    bannerTimer.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => { if (bannerTimer.current) clearInterval(bannerTimer.current); };
  }, [banners.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ==================== HERO / BANNER ==================== */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {banners.length > 0 ? (
          <>
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={cn(
                  "absolute inset-0 transition-all duration-1000",
                  idx === currentBanner ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                {imageUrls[banner.image_key] && (
                  <Image
                    src={imageUrls[banner.image_key]}
                    alt={banner.title || ""}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-3xl px-4">
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-4 tracking-wide">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl text-white/80 font-light tracking-wide max-w-xl mx-auto">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentBanner(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-500",
                        idx === currentBanner ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-6xl text-primary font-light mb-4">
                Dream Doll
              </h1>
              <p className="text-muted-foreground text-sm tracking-widest uppercase">高奢梦幻玩偶品牌</p>
            </div>
          </div>
        )}
      </section>

      {/* ==================== 品牌理念 ==================== */}
      <section className="py-20 md:py-28 section-padding bg-gradient-to-b from-white to-primary/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className={cn("space-y-6", company?.image_key && imageUrls[company.image_key] ? "order-2 md:order-1" : "order-1")}>
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">品牌理念</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light leading-tight">
                {company?.title || "传递梦幻 · 珍藏美好"}
              </h2>
              <div className="w-12 h-px bg-primary/30" />
              <p className="text-muted-foreground leading-relaxed text-sm">
                {company?.content || "Dream Doll 专注于高奢梦幻玩偶的设计与制造，拥有专业玩偶工厂，致力于为每一个珍视童心的你，打造可珍藏一生的精致玩偶。"}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
              >
                了解更多 <ArrowRight size={14} />
              </Link>
            </div>
            {company?.image_key && imageUrls[company.image_key] && (
              <div className="order-1 md:order-2 relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image src={imageUrls[company.image_key]} alt={company.title || "Dream Doll"} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 产品系列精选 ==================== */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">产品系列</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mt-4">精选系列</h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
                每一件玩偶都是匠心之作，传递梦幻与温暖
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.category_slug || "ballet"}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04] mb-4">
                    {product.image_keys?.[0] && imageUrls[product.image_keys[0]] ? (
                      <Image
                        src={imageUrls[product.image_keys[0]]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-5xl text-primary/20">{product.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-sm text-foreground/90 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.price && (
                    <p className="text-xs text-muted-foreground mt-1">{product.price}</p>
                  )}
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products/ballet"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary/30 text-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
              >
                查看全部产品 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 合作客户 ==================== */}
      {clients.length > 0 && (
        <section className="py-16 md:py-20 section-padding bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">合作客户</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mt-4">信赖我们的伙伴</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center">
              {clients.slice(0, 6).map((client) => (
                <div key={client.id} className="flex items-center justify-center p-4">
                  {client.logo_key && imageUrls[client.logo_key] ? (
                    <div className="relative w-20 h-20 md:w-24 md:h-24">
                      <Image src={imageUrls[client.logo_key]} alt={client.name} fill className="object-contain opacity-60 hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 合作案例 ==================== */}
      {cases.length > 0 && (
        <section className="py-20 md:py-28 section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">合作案例</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mt-4">我们的作品</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {cases.slice(0, 3).map((item) => (
                <Link key={item.id} href="/cases" className="group">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                    {item.image_keys?.[0] && imageUrls[item.image_keys[0]] ? (
                      <Image src={imageUrls[item.image_keys[0]]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04] flex items-center justify-center">
                        <span className="font-serif text-4xl text-primary/20">{item.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-sm text-foreground/90 group-hover:text-primary transition-colors">{item.title}</h3>
                  {item.client_name && <p className="text-xs text-muted-foreground mt-1">{item.client_name}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA ==================== */}
      <section className="py-20 md:py-28 section-padding bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
            开启梦幻合作之旅
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            无论是 OEM 加工还是品牌合作，我们都期待与您共创美好
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-sm tracking-wide rounded-full hover:bg-primary/90 transition-all"
          >
            联系我们 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}