"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLang, t } from "@/lib/locales/context";

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
  image_keys: string;
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
  image_keys: string;
}

interface CompanyInfo {
  id: number;
  title: string;
  content: string;
  image_key?: string;
}

export default function HomePage() {
  const { lang } = useLang();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const bannerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPlaceholder = () => "🧸";

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
              <p className="text-muted-foreground text-sm tracking-widest uppercase">{t(lang, "home.brand_tagline")}</p>
            </div>
          </div>
        )}
      </section>

      {/* ==================== Brand Philosophy ==================== */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-white to-primary/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "home.philosophy")}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light leading-tight">
                {t(lang, "home.philosophy_title")}
              </h2>
              <div className="w-12 h-px bg-primary/30" />
              <p className="text-muted-foreground leading-relaxed text-sm">
                {t(lang, "home.philosophy_desc")}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
              >
                {t(lang, "home.learn_more")} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
              <span className="text-8xl text-primary/20">{getPlaceholder()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Featured Products ==================== */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "products.title")}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mt-4">{t(lang, "home.featured")}</h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
                {t(lang, "home.featured_desc")}
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
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-5xl text-primary/20">{getPlaceholder()}</span>
                    </div>
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
                {t(lang, "home.view_all")} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== Clients ==================== */}
      {clients.length > 0 && (
        <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.clients")}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mt-4">{t(lang, "home.clients_title")}</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center">
              {clients.slice(0, 6).map((client) => (
                <div key={client.id} className="flex items-center justify-center p-4">
                  <span className="text-sm text-muted-foreground">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== Cases ==================== */}
      {cases.length > 0 && (
        <section className="py-20 md:py-28 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "nav.cases")}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mt-4">{t(lang, "home.cases_title")}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {cases.slice(0, 3).map((item) => (
                <Link key={item.id} href="/cases" className="group">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04] flex items-center justify-center">
                      <span className="text-4xl text-primary/20">📋</span>
                    </div>
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
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
            {t(lang, "home.cta_title")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            {t(lang, "home.cta_desc")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-sm tracking-wide rounded-full hover:bg-primary/90 transition-all"
          >
            {t(lang, "contact.title")} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}