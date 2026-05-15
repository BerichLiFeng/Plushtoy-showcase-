"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { Instagram, Globe, PinIcon } from "lucide-react";

interface SocialLink {
  id: number;
  platform_name: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  pinterest: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  ),
  globe: <Globe className="w-4 h-4" />,
};

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    async function fetchSocial() {
      const client = getSupabaseClient();
      const { data } = await client
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data) setSocialLinks(data as SocialLink[]);
    }
    fetchSocial();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-background to-primary/5 border-t border-border/50">
      {/* Decorative top */}
      <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="font-serif text-xl font-semibold text-primary">
                Dream Doll
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              以匠心工艺打造每一只玩偶，传递高奢梦幻的玩偶理念。让每一个玩偶都成为值得珍藏的艺术品。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">
              快速导航
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "品牌故事" },
                { href: "/business", label: "业务板块" },
                { href: "/products/ballet", label: "产品系列" },
                { href: "/cases", label: "合作案例" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">
              产品系列
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/products/ballet", label: "梦幻芭蕾风" },
                { href: "/products/classic", label: "经典毛绒布艺" },
                { href: "/products/newborn", label: "新生儿玩偶" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">
              关注我们
            </h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((link) => {
                const iconKey = link.platform_name.toLowerCase();
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    title={link.platform_name}
                  >
                    {iconMap[iconKey] || <Globe className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              探索更多梦幻玩偶世界
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Dream Doll. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            高奢梦幻玩偶品牌 · 匠心工艺
          </p>
        </div>
      </div>
    </footer>
  );
}