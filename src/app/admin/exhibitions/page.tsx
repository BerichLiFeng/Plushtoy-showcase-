"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import { useEffect, useState } from "react";

const fields = [
  { key: "title", label: "展会名称", type: "text" as const },
  { key: "description", label: "描述", type: "textarea" as const },
  { key: "image_key", label: "图片", type: "image" as const },
  { key: "date", label: "日期", type: "text" as const },
  { key: "is_active", label: "启用", type: "boolean" as const },
];

export default function AdminExhibitionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const r = await fetch("/api/admin/exhibitions"); const d = await r.json(); setData(d); setLoading(false); };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <AdminTable title="展会集锦管理" fields={fields} data={data} loading={loading}
        onAdd={async (item) => { await fetch("/api/admin/exhibitions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); load(); }}
        onUpdate={async (id, item) => { await fetch("/api/admin/exhibitions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...item }) }); load(); }}
        onDelete={async (id) => { await fetch("/api/admin/exhibitions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }} />
    </div>
  );
}
