"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { S3Storage } from "coze-coding-dev-sdk";

const storage = new S3Storage();

interface Client {
  id: number;
  name: string;
  logo_key: string;
  description: string;
  website_url: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const client = getSupabaseClient();
      const { data } = await client.from("clients").select("*").eq("is_active", true).order("sort_order");
      if (data) {
        setClients(data as Client[]);
        const urlMap: Record<string, string> = {};
        await Promise.all(
          data.map(async (c) => {
            if (c.logo_key) {
              urlMap[c.logo_key] = await storage.generatePresignedUrl({ key: c.logo_key, expireTime: 86400 });
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
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase font-medium">合作客户</span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 text-foreground font-light">信赖我们的品牌</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            我们与众多知名品牌建立了长期稳定的合作关系，以品质赢得信赖
          </p>
        </div>
      </section>

      <section className="py-16 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client) => (
              <div key={client.id} className="bg-white rounded-2xl p-8 shadow-sm border border-border/30 hover:shadow-md transition-all duration-300">
                <div className="relative h-20 mb-4 flex items-center justify-center">
                  {client.logo_key && imageUrls[client.logo_key] ? (
                    <Image
                      src={imageUrls[client.logo_key]}
                      alt={client.name}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xl font-medium text-foreground/40">{client.name}</span>
                  )}
                </div>
                <h3 className="text-center font-medium text-foreground mb-2">{client.name}</h3>
                {client.description && (
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">{client.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}