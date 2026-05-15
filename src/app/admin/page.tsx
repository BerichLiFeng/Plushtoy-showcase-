"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Briefcase, Layers, Package, Users,
  ImageIcon, Shield, Calendar, Mail, Link2, ArrowRight
} from "lucide-react";

const cards = [
  { href: "/admin/company", label: "公司介绍", icon: FileText, color: "bg-blue-50 text-blue-600" },
  { href: "/admin/business", label: "业务板块", icon: Briefcase, color: "bg-purple-50 text-purple-600" },
  { href: "/admin/categories", label: "产品分类", icon: Layers, color: "bg-pink-50 text-pink-600" },
  { href: "/admin/products", label: "产品管理", icon: Package, color: "bg-amber-50 text-amber-600" },
  { href: "/admin/clients", label: "合作客户", icon: Users, color: "bg-green-50 text-green-600" },
  { href: "/admin/cases", label: "合作案例", icon: ImageIcon, color: "bg-indigo-50 text-indigo-600" },
  { href: "/admin/certifications", label: "工厂资质", icon: Shield, color: "bg-red-50 text-red-600" },
  { href: "/admin/exhibitions", label: "展会集锦", icon: Calendar, color: "bg-teal-50 text-teal-600" },
  { href: "/admin/contacts", label: "联系方式", icon: Mail, color: "bg-cyan-50 text-cyan-600" },
  { href: "/admin/social", label: "社媒链接", icon: Link2, color: "bg-rose-50 text-rose-600" },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadCounts() {
      const tables = ["business", "categories", "products", "clients", "cases", "certifications", "exhibitions"];
      const result: Record<string, number> = {};
      await Promise.all(
        tables.map(async (table) => {
          try {
            const res = await fetch(`/api/public/${table}`);
            const data = await res.json();
            result[table] = Array.isArray(data) ? data.length : 0;
          } catch { result[table] = 0; }
        })
      );
      setCounts(result);
    }
    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-900 mb-6">管理总览</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color} mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-sm font-medium text-gray-800">{card.label}</p>
            {counts[card.href.replace("/admin/", "")] !== undefined && (
              <p className="text-xs text-gray-400 mt-1">
                {counts[card.href.replace("/admin/", "")]} 条记录
              </p>
            )}
            <ArrowRight size={14} className="text-gray-300 group-hover:text-primary mt-2 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}