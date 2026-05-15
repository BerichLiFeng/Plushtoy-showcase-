"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Briefcase, Layers, Package,
  Users, ImageIcon, Shield, Calendar, Mail, Link2,
  LogOut, Menu, X, PanelRightOpen
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", label: "总览", icon: LayoutDashboard },
  { href: "/admin/company", label: "公司介绍", icon: FileText },
  { href: "/admin/business", label: "业务板块", icon: Briefcase },
  { href: "/admin/categories", label: "产品分类", icon: Layers },
  { href: "/admin/products", label: "产品管理", icon: Package },
  { href: "/admin/clients", label: "合作客户", icon: Users },
  { href: "/admin/cases", label: "合作案例", icon: ImageIcon },
  { href: "/admin/certifications", label: "工厂资质", icon: Shield },
  { href: "/admin/exhibitions", label: "展会集锦", icon: Calendar },
  { href: "/admin/contacts", label: "联系方式", icon: Mail },
  { href: "/admin/social", label: "社媒链接", icon: Link2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin/login").then(async (res) => {
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      setAuthed(true);
    });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  if (authed === null) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-56" : "w-0 -translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-lg font-semibold text-primary tracking-wide">Dream Doll</Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div className={cn(
        "fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity",
        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setSidebarOpen(false)} />

      {/* Top bar */}
      <div className={cn(
        "sticky top-0 bg-white border-b border-gray-200 z-30 px-4 h-14 flex items-center gap-3 transition-all",
        sidebarOpen ? "ml-56" : "ml-0"
      )}>
        <button onClick={() => setSidebarOpen(true)} className={cn("p-1.5 text-gray-500 hover:text-gray-800", sidebarOpen && "hidden")}>
          <PanelRightOpen size={18} />
        </button>
        <span className="text-sm text-gray-500">管理后台</span>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/" target="_blank" className="text-xs text-primary hover:underline">
            查看网站
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 p-6",
        sidebarOpen ? "ml-56" : "ml-0"
      )}>
        {children}
      </main>
    </div>
  );
}