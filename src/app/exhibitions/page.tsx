"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const storage = new S3Storage();

interface Exhibition {
  id: number;
  title: string;
  image_key: string;
  description: string;
  exhibition_date: string;
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const { data } = await client.from("exhibitions").select("*").eq("is_active", true).order("sort_order");
      if (data) {
        setExhibitions(data as Exhibition[]);
        const urlMap: Record<string, string> = {};
        await Promise.all(
          data.map(async (e) => {
            if (e.image_key) {
              urlMap[e.image_key] = await storage.generatePresignedUrl({ key: e.image_key, expireTime: 86400 });
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
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">展会集锦</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">精彩瞬间</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            记录我们在各大展会的精彩时刻
          </p>
        </div>
      </section>

      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          {exhibitions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">暂无展会照片</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {exhibitions.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer"
                  onClick={() => setLightbox(idx)}
                >
                  {item.image_key && imageUrls[item.image_key] ? (
                    <Image
                      src={imageUrls[item.image_key]}
                      alt={item.title || ""}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {item.title && <p className="text-white text-sm font-medium">{item.title}</p>}
                      {item.exhibition_date && <p className="text-white/60 text-xs mt-1">{item.exhibition_date}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && exhibitions[lightbox] && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white z-10" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          {exhibitions.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + exhibitions.length) % exhibitions.length); }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % exhibitions.length); }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <div className="relative w-full max-w-5xl aspect-[4/3] m-8" onClick={(e) => e.stopPropagation()}>
            {exhibitions[lightbox].image_key && imageUrls[exhibitions[lightbox].image_key] && (
              <Image src={imageUrls[exhibitions[lightbox].image_key]} alt="" fill className="object-contain" />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}