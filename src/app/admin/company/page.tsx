"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { useRouter } from "next/navigation";

export default function AdminCompanyPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const client = getSupabaseClient();
      const { data } = await client.from("company_info").select("*").limit(1);
      if (data && data.length > 0) {
        setTitle(data[0].title || "");
        setContent(data[0].content || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const client = getSupabaseClient();
      const { data: existing } = await client.from("company_info").select("id").limit(1);
      if (existing && existing.length > 0) {
        await client.from("company_info").update({ title, content }).eq("id", existing[0].id);
      } else {
        await client.from("company_info").insert({ title, content });
      }
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
          <label className="block text-xs font-medium text-gray-500 mb-1.5">标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="输入公司标题"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">详细介绍（支持 HTML）</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary min-h-[300px] font-mono"
            placeholder="输入公司介绍内容，支持 HTML 标签"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}