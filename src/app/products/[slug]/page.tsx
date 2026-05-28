"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLang, t } from "@/lib/locales/context";

interface Category { id: number; name: string; slug: string; description: string; }
interface Product { id: number; category_id: number; name: string; description: string; price: string; image_keys: string; }

export default function ProductCategoryPage() {
  const { lang } = useLang();
  const params = useParams();
  const slug = params?.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/public/categories"),
          fetch("/api/public/products")
        ]);
        const cats: Category[] = await catRes.json();
        const prods: Product[] = await prodRes.json();
        const found = cats.find(c => c.slug === slug) || null;
        setCategory(found);
        setProducts(found ? prods.filter(p => p.category_id === found.id) : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!category) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">{t(lang, "common.loading")}</div>;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">{t(lang, "products.title")}</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">{category.name}</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground">{t(lang, "products.empty")}</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5 group hover:shadow-md transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <span className="text-6xl text-primary/20">🧸</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-lg text-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{product.description}</p>
                    <p className="text-primary font-medium">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
