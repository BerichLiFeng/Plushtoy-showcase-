"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  image_keys: string[];
  price: string;
  category_name?: string;
  category_slug?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_key: string;
}

const categoryNames: Record<string, string> = {
  ballet: "梦幻芭蕾风",
  classic: "经典毛绒布艺",
  newborn: "新生儿玩偶",
};

const categoryDescriptions: Record<string, string> = {
  ballet: "优雅梦幻的芭蕾主题玩偶，精致细腻的设计",
  classic: "经典永恒的毛绒布艺玩偶，温暖柔软的陪伴",
  newborn: "专为新生儿设计的柔软安全玩偶，传递温暖祝福",
};

export default function ProductCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetch(`/api/public/products?category_slug=${slug}`).then((r) => r.json()),
          fetch("/api/public/categories").then((r) => r.json()),
        ]);

        const items = Array.isArray(productsData) ? productsData : [];
        setProducts(items);

        const cats = Array.isArray(categoriesData) ? categoriesData : [];
        const foundCat = cats.find((c: Category) => c.slug === slug);
        setCategory(foundCat || null);

        const keys: string[] = [];
        items.forEach((p: Product) => p.image_keys?.forEach((k: string) => keys.push(k)));
        if (keys.length > 0) {
          const { urls } = await fetch("/api/public/urls", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
          }).then((r) => r.json());
          setImageUrls(urls || {});
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  const catName = category?.name || categoryNames[slug] || slug;
  const catDesc = category?.description || categoryDescriptions[slug] || "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <Link href="/products/ballet" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={14} /> 返回产品系列
          </Link>
          <div className="text-center">
            <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">产品系列</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{catName}</h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">{catDesc}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 section-padding">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">该系列暂无产品展示</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04] mb-3">
                    {product.image_keys?.[0] && imageUrls[product.image_keys[0]] ? (
                      <Image
                        src={imageUrls[product.image_keys[0]]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-5xl text-primary/20">{product.name?.[0] || "?"}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-sm text-foreground/90 group-hover:text-primary transition-colors">{product.name}</h3>
                  {product.price && <p className="text-xs text-muted-foreground mt-1">{product.price}</p>}
                  {product.description && <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-2">{product.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}