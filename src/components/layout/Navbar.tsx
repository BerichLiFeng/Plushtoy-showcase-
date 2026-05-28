"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";
import { useLang, t, type Lang } from "@/lib/locales/context";

const navLinks = (lang: Lang) => [
  { href: "/", label: t(lang, "nav.home") },
  { href: "/about", label: t(lang, "nav.about") },
  { href: "/business", label: t(lang, "nav.business") },
  { href: "/products/ballet", label: t(lang, "nav.products") },
  { href: "/blog", label: t(lang, "nav.blog") },
  { href: "/clients", label: t(lang, "nav.clients") },
  { href: "/cases", label: t(lang, "nav.cases") },
  { href: "/certifications", label: t(lang, "nav.certifications") },
  { href: "/exhibitions", label: t(lang, "nav.exhibitions") },
  { href: "/contact", label: t(lang, "nav.contact") },
];

const productSubLinks = (lang: Lang) => [
  { href: "/products/ballet", label: t(lang, "nav.sub.ballet") },
  { href: "/products/classic", label: t(lang, "nav.sub.classic") },
  { href: "/products/newborn", label: t(lang, "nav.sub.newborn") },
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const links = navLinks(lang);
  const subLinks = productSubLinks(lang);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "hidden md:flex items-center justify-center py-1.5 text-xs tracking-wider transition-all duration-300",
          scrolled
            ? "h-0 py-0 overflow-hidden opacity-0"
            : "h-7 opacity-100 text-white/80 bg-transparent"
        )}
      >
        <span className="tracking-[0.2em]">{t(lang, "tagline")}</span>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl md:text-2xl font-semibold tracking-wider text-primary">
              Dream Doll
            </span>
            <span className="hidden sm:inline-block w-px h-5 bg-primary/30" />
            <span className="hidden sm:block text-[10px] tracking-[0.25em] text-primary/60 uppercase">
              {t(lang, "brand.sub")}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              if (link.href === "/products/ballet") {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setShowSubMenu(true)}
                    onMouseLeave={() => setShowSubMenu(false)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-2 text-sm tracking-wide transition-colors rounded-md",
                        isActive(link.href)
                          ? "text-primary font-medium"
                          : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {link.label}
                    </Link>
                    {showSubMenu && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-border/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {subLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors",
                              isActive(sub.href)
                                ? "text-primary font-medium bg-primary/5"
                                : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                            )}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm tracking-wide transition-colors rounded-md",
                    isActive(link.href)
                      ? "text-primary font-medium"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Language Switch */}
            <div className="ml-3 pl-3 border-l border-border/30">
              <button
                onClick={() => setLang(lang === "zh" ? "en" : "zh")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors text-foreground/70 hover:text-primary hover:bg-primary/5"
              >
                <Globe size={14} />
                <span className="font-medium">{lang === "zh" ? "EN" : "中文"}</span>
              </button>
            </div>
          </nav>

          {/* Mobile right area */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="p-2 text-foreground/70 hover:text-primary text-xs font-medium"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-foreground/70 hover:text-primary"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-3 py-3 text-sm rounded-md transition-colors",
                    isActive(link.href)
                      ? "text-primary font-medium bg-primary/5"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.label}
                </Link>
                {link.href === "/products/ballet" && (
                  <div className="ml-4 pl-3 border-l border-border/50 space-y-1 mt-1">
                    {subLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          isActive(sub.href)
                            ? "text-primary font-medium bg-primary/5"
                            : "text-foreground/60 hover:text-primary"
                        )}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}