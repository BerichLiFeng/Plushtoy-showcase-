"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import { useEffect, useState } from "react";

const fields = [
  { key: "title", label: "Title", type: "text" as const },
  { key: "slug", label: "Slug", type: "text" as const },
  { key: "excerpt", label: "Excerpt", type: "textarea" as const },
  { key: "content", label: "Content (HTML)", type: "textarea" as const },
  { key: "author", label: "Author", type: "text" as const },
  { key: "image_key", label: "Image", type: "image" as const },
  { key: "category", label: "Category", type: "text" as const },
  { key: "published_at", label: "Publish Date", type: "text" as const },
  { key: "is_active", label: "Active", type: "boolean" as const },
  { key: "sort_order", label: "Sort Order", type: "text" as const },
];

export default function AdminBlogPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const r = await fetch("/api/admin/blog"); const d = await r.json(); setData(d); setLoading(false); };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <AdminTable title="Blog Posts Management" fields={fields} data={data} loading={loading}
        onAdd={async (item) => { await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); load(); }}
        onUpdate={async (id, item) => { await fetch("/api/admin/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...item }) }); load(); }}
        onDelete={async (id) => { await fetch("/api/admin/blog", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }} />
    </div>
  );
}