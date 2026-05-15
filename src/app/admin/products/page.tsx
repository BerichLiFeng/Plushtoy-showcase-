"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import { useEffect, useState } from "react";

const fields = [
  { key: "name", label: "产品名称", type: "text" as const },
  { key: "category_id", label: "分类ID", type: "number" as const },
  { key: "description", label: "描述", type: "textarea" as const },
  { key: "price", label: "价格", type: "text" as const },
  { key: "is_active", label: "启用", type: "boolean" as const },
];

export default function AdminProductsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const r = await fetch("/api/admin/products"); const d = await r.json(); setData(d); setLoading(false); };
  useEffect(() => { load(); }, []);
  return (
    <div>
      <AdminTable title="产品管理" fields={fields} data={data} loading={loading}
        onAdd={async (item) => { await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); load(); }}
        onUpdate={async (id, item) => { await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...item }) }); load(); }}
        onDelete={async (id) => { await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }} />
    </div>
  );
}
