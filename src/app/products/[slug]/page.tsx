"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const storage = new S3Storage();

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover_image_key: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image_keys: string[];
  price: string;
  category_id: number;
}

const categoryNames: Record<string, string> = {
  ballet: "梦幻芭蕾风",
  classic: "经典毛绒布艺",
  newborn: "新生儿玩偶",
};

export default function ProductCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const [catRes, prodRes] = await Promise.all([
        client.from("product_categories").select("*").eq("slug", slug).eq("is_active", true).maybeSingle(),
        client.from("products").select("*").eq("is_active", true).order("sort_order"),
      ]);

      if (catRes.data) {
        setCategory(catRes.data as Category);
        const filtered = (prodRes.data as Product[] || []).filter(p => p.category_id === catRes.data.id);
        setProducts(filtered);

        const urlMap: Record<string, string> = {};
        const allKeys: string[] = [];
        if (catRes.data.cover_image_key) allKeys.push(catRes.data.cover_image_key);
        filtered.forEach(p => p.image_keys?.forEach(k => allKeys.push(k)));
        const uniqueKeys = [...new Set(allKeys)];
        await Promise.all(
          uniqueKeys.map(async (key) => {
            urlMap[key] = await storage.generatePresignedUrl({ key, expireTime: 86400 });
          })
        );
        setImageUrls(urlMap);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

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
          <Link href="/products/ballet" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={14} /> 返回产品系列
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">产品系列</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">
              {category?.name || categoryNames[slug] || slug}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground mt-4 leading-relaxed">{category.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">暂无产品展示</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const images = product.image_keys || [];
                return (
                  <div key={product.id} className="group">
                    <div
                      className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
                      onClick={() => images.length > 0 && setLightbox({ images, index: 0 })}
                    >
                      <div className="relative w-full h-full p-4">
                        {images[0] && imageUrls[images[0]] ? (
                          <Image
                            src={imageUrls[images[0]]}
                            alt={product.name}
                            fill
                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <span className="font-serif text-4xl text-primary/30">{product.name[0]}</span>
                          </div>
                        )}
                        {images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.slice(0, 5).map((_, idx) => (
                              <span key={idx} className={cn("w-1.5 h-1.5 rounded-full", idx === 0 ? "bg-primary" : "bg-primary/20")} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <h3 className="text-sm font-medium text-foreground/80">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.description}</p>
                      )}
                      {product.price && (
                        <p className="text-xs text-primary mt-1">{product.price}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white z-10" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          {lightbox.images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
                }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
                }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <div className="relative w-full max-w-4xl aspect-square m-8" onClick={(e) => e.stopPropagation()}>
            {imageUrls[lightbox.images[lightbox.index]] && (
              <Image
                src={imageUrls[lightbox.images[lightbox.index]]}
                alt=""
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}