"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function AdminSocialPage() {
  const [data, setData] = useState<{ id: number; platform_name: string; url: string; icon: string; sort_order: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<{ id?: number; platform_name: string; url: string; icon: string }>({ platform_name: "", url: "", icon: "" });

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/social");
    const d = await r.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing.id) {
      await fetch("/api/admin/social", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    } else {
      await fetch("/api/admin/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    }
    setModal(false);
    load();
  };

  const remove = async (id: number) => {
    if (confirm("确认删除？")) {
      await fetch("/api/admin/social", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium text-gray-900">社媒链接管理</h1>
        <button onClick={() => { setEditing({ platform_name: "", url: "", icon: "" }); setModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium"><Plus size={14} />添加</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-gray-400" /></div>
        : data.length === 0 ? <div className="text-center py-16 text-sm text-gray-400">暂无数据</div>
        : <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">平台名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">链接</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">操作</th>
            </tr></thead>
            <tbody>{data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-gray-700">{item.platform_name}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[300px] truncate">{item.url}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(item); setModal(true); }} className="p-1.5 text-gray-400 hover:text-primary"><Pencil size={14} /></button>
                  <button onClick={() => remove(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>}
      </div>

      {modal && <div className="fixed inset-0 z-[999] bg-black/20 flex items-start justify-center pt-[10vh] px-4" onClick={() => setModal(false)}>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="px-5 py-4 border-b border-gray-100"><h3 className="text-sm font-medium text-gray-900">{editing.id ? "编辑" : "添加"}社媒链接</h3></div>
          <div className="p-5 space-y-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1.5">平台名称</label><input value={editing.platform_name} onChange={(e) => setEditing({ ...editing, platform_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Instagram" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1.5">链接</label><input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://instagram.com/..." /></div>
          </div>
          <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={() => setModal(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button onClick={save} className="px-4 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90">保存</button>
          </div>
        </div>
      </div>}
    </div>
  );
}