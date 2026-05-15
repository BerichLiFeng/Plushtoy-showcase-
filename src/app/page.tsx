"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const storage = new S3Storage();

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
  product_categories: { name: string; slug: string };
}

interface Client {
  id: number;
  name: string;
  logo_key: string;
}

interface CaseItem {
  id: number;
  title: string;
  cover_image_key: string;
  clients: { name: string } | null;
}

interface CompanyInfo {
  company_name: string;
  slogan: string;
  description: string;
  logo_key: string;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const bannerTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      try {
        const [bannersRes, productsRes, clientsRes, casesRes, companyRes] = await Promise.all([
          client.from("banners").select("*").eq("is_active", true).order("sort_order"),
          client.from("products").select("*, product_categories(name, slug)").eq("is_active", true).order("sort_order"),
          client.from("clients").select("*").eq("is_active", true).order("sort_order"),
          client.from("cases").select("*, clients(name)").eq("is_published", true).order("sort_order"),
          client.from("company_info").select("*").maybeSingle(),
        ]);

        if (bannersRes.data) setBanners(bannersRes.data as Banner[]);
        if (productsRes.data) setProducts(productsRes.data as Product[]);
        if (clientsRes.data) setClients(clientsRes.data as Client[]);
        if (casesRes.data) setCases(casesRes.data as CaseItem[]);
        if (companyRes.data) setCompany(companyRes.data as CompanyInfo);

        // Generate presigned URLs for all images
        const allKeys: string[] = [];
        bannersRes.data?.forEach((b: Banner) => b.image_key && allKeys.push(b.image_key));
        productsRes.data?.forEach((p: Product) => p.image_keys?.forEach((k: string) => allKeys.push(k)));
        clientsRes.data?.forEach((c: Client) => c.logo_key && allKeys.push(c.logo_key));
        casesRes.data?.forEach((c: CaseItem) => c.cover_image_key && allKeys.push(c.cover_image_key));
        if (companyRes.data?.logo_key) allKeys.push(companyRes.data.logo_key);

        const uniqueKeys = [...new Set(allKeys)];
        const urlMap: Record<string, string> = {};
        await Promise.all(
          uniqueKeys.map(async (key) => {
            try {
              urlMap[key] = await storage.generatePresignedUrl({ key, expireTime: 86400 });
            } catch {}
          })
        );
        setImageUrls(urlMap);
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
    return () => clearInterval(bannerTimer.current);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
            {/* Banner controls */}
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
              <p className="text-lg text-muted-foreground">高奢梦幻玩偶品牌</p>
            </div>
          </div>
        )}
      </section>

      {/* ==================== BRAND STORY ==================== */}
      {company && (
        <section className="py-20 md:py-28 section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">
                  品牌理念
                </span>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-6 text-foreground font-light leading-tight">
                  {company.slogan || company.company_name}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {company.description}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                >
                  了解更多
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-primary/5">
                {company.logo_key && imageUrls[company.logo_key] ? (
                  <Image
                    src={imageUrls[company.logo_key]}
                    alt={company.company_name}
                    fill
                    className="object-contain p-8"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-6xl text-primary/20">DD</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== PRODUCT SHOWCASE ==================== */}
      {products.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-7xl mx-auto section-padding">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">
                产品系列
              </span>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground font-light">
                精选梦幻玩偶
              </h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto">
                每一只玩偶都经过精心设计，以极致工艺呈现梦幻质感
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product) => {
                const firstImage = product.image_keys?.[0];
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.product_categories?.slug || "ballet"}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-500">
                      <div className="relative w-full h-full p-4">
                        {firstImage && imageUrls[firstImage] ? (
                          <Image
                            src={imageUrls[firstImage]}
                            alt={product.name}
                            fill
                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <span className="font-serif text-3xl text-primary/30">{product.name[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <h3 className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.price && (
                        <p className="text-xs text-muted-foreground mt-1">{product.price}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products/ballet"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/30 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                查看全部产品
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== CLIENTS ==================== */}
      {clients.length > 0 && (
        <section className="py-20 section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">
                合作客户
              </span>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground font-light">
                信赖我们的品牌
              </h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-center">
                  {client.logo_key && imageUrls[client.logo_key] ? (
                    <div className="relative w-24 h-16 grayscale hover:grayscale-0 transition-all duration-300">
                      <Image
                        src={imageUrls[client.logo_key]}
                        alt={client.name}
                        fill
                        className="object-contain"
                      />
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

      {/* ==================== CASES ==================== */}
      {cases.length > 0 && (
        <section className="py-20 bg-primary/5 section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">
                合作案例
              </span>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 text-foreground font-light">
                我们的作品
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href="/cases"
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white"
                >
                  {item.cover_image_key && imageUrls[item.cover_image_key] ? (
                    <Image
                      src={imageUrls[item.cover_image_key]}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {item.clients && (
                        <p className="text-white/60 text-sm mt-1">{item.clients.name}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA ==================== */}
      <section className="py-24 section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
            开启梦幻玩偶之旅
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
            无论是品牌合作、玩偶定制，还是探索我们的产品系列，我们都期待与您携手
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
            >
              联系我们
            </Link>
            <Link
              href="/business"
              className="px-8 py-3 rounded-full border border-primary/30 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
            >
              了解业务
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}