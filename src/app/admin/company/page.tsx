"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CompanyData {
  id?: number;
  name: string;
  slogan: string;
  description: string;
  about_images: string;
  values: string;
}

export default function AdminCompanyPage() {
  const [form, setForm] = useState<CompanyData>({ name: "", slogan: "", description: "", about_images: "", values: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/company");
        const data = await res.json();
        if (data?.id) setForm(data);
        else if (Array.isArray(data) && data.length > 0) setForm(data[0]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/company", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      alert("保存成功！");
    } catch (err) {
      console.error(err);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900 mb-6">公司介绍</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-3xl">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">公司名称</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">品牌标语</label>
          <input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">核心理念</label>
          <input value={form.values} onChange={(e) => setForm({ ...form, values: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">公司介绍</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[200px]" />
        </div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{saving ? "保存中..." : "保存"}</button>
      </div>
    </div>
  );
}