"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const storage = new S3Storage();

interface CaseItem {
  id: number;
  title: string;
  description: string;
  cover_image_key: string;
  content: string;
  clients: { name: string; logo_key: string } | null;
}

export default function CasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const { data } = await client
        .from("cases")
        .select("*, clients(name, logo_key)")
        .eq("is_published", true)
        .order("sort_order");
      
      if (data) {
        setCases(data as CaseItem[]);
        const urlMap: Record<string, string> = {};
        await Promise.all(
          data.map(async (c) => {
            if (c.cover_image_key) {
              urlMap[c.cover_image_key] = await storage.generatePresignedUrl({ key: c.cover_image_key, expireTime: 86400 });
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

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 section-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">合作案例</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">我们的作品</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            每一个案例都是我们匠心工艺的见证
          </p>
        </div>
      </section>

      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          {cases.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">暂无案例展示</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer border border-border/30"
                  onClick={() => setSelectedCase(item)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.cover_image_key && imageUrls[item.cover_image_key] ? (
                      <Image
                        src={imageUrls[item.cover_image_key]}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="font-serif text-4xl text-primary/30">{item.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    {item.clients && (
                      <p className="text-xs text-muted-foreground mt-1">合作品牌：{item.clients.name}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9]">
              {selectedCase.cover_image_key && imageUrls[selectedCase.cover_image_key] && (
                <Image src={imageUrls[selectedCase.cover_image_key]} alt={selectedCase.title} fill className="object-cover rounded-t-2xl" />
              )}
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50" onClick={() => setSelectedCase(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="font-serif text-2xl text-foreground font-light mb-2">{selectedCase.title}</h2>
              {selectedCase.clients && (
                <p className="text-sm text-primary mb-4">合作品牌：{selectedCase.clients.name}</p>
              )}
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedCase.content || selectedCase.description}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}