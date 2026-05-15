"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import { useEffect, useState } from "react";

const fields = [
  { key: "title", label: "业务名称", type: "text" as const },
  { key: "description", label: "描述", type: "textarea" as const },
  { key: "icon", label: "图标名", type: "text" as const },
  { key: "image_key", label: "图片", type: "image" as const },
  { key: "is_active", label: "启用", type: "boolean" as const },
];

export default function AdminBusinessPage() {
  const [data, setData] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const r = await fetch("/api/admin/business"); const d = await r.json(); setData(d); setLoading(false); };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <AdminTable title="业务板块管理" fields={fields} data={data} loading={loading}
        onAdd={async (item) => { await fetch("/api/admin/business", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); load(); }}
        onUpdate={async (id, item) => { await fetch("/api/admin/business", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...item }) }); load(); }}
        onDelete={async (id) => { await fetch("/api/admin/business", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }} />
    </div>
  );
}
