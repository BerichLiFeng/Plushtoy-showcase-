"use client";

import { useEffect, useState } from "react";

export default function AdminContactsPage() {
  const [form, setForm] = useState({ phone: "", email: "", address: "", wechat: "", working_hours: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (data?.id) {
        setForm({ phone: data.phone || "", email: data.email || "", address: data.address || "", wechat: data.wechat || "", working_hours: data.working_hours || "" });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    alert("保存成功！");
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900 mb-6">联系方式管理</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-500 mb-1.5">电话</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1.5">邮箱</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        </div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1.5">地址</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium text-gray-500 mb-1.5">微信</label><input value={form.wechat} onChange={(e) => setForm({ ...form, wechat: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1.5">工作时间</label><input value={form.working_hours} onChange={(e) => setForm({ ...form, working_hours: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{saving ? "保存中..." : "保存"}</button>
      </div>
    </div>
  );
}