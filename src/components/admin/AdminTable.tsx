"use client";

import { useState } from "react";
import Image from "next/image";
import { S3Storage } from "coze-coding-dev-sdk";
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react";

const storage = new S3Storage();

export interface TableField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "richtext" | "boolean" | "number";
}

interface AdminTableProps<T extends Record<string, unknown>> {
  title: string;
  fields: TableField[];
  data: T[];
  loading?: boolean;
  onAdd: (item: Partial<T>) => Promise<void>;
  onUpdate: (id: number, item: Partial<T>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReorder?: (id: number, sortOrder: number) => Promise<void>;
}

export function AdminTable<T extends Record<string, unknown>>({
  title, fields, data, loading, onAdd, onUpdate, onDelete, onReorder
}: AdminTableProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm({});
    setModalOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    const fieldName = uploadingFile!;
    setSaving(true);
    try {
      const key = `admin/${Date.now()}-${file.name}`;
      await storage.upload({ key, body: file });
      setForm((prev) => ({ ...prev, [fieldName]: key }));
    } catch (err) {
      console.error("上传失败", err);
    } finally {
      setSaving(false);
      setUploadingFile(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await onUpdate((editing as unknown as { id: number }).id, form as Partial<T>);
      } else {
        await onAdd(form as Partial<T>);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("保存失败", err);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: TableField) => {
    const value = form[field.key] as string | number | boolean | undefined;

    if (field.type === "boolean") {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.checked }))}
            className="rounded border-gray-300 text-primary focus:ring-primary/30"
          />
          <span className="text-xs text-gray-500">{value ? "启用" : "禁用"}</span>
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary min-h-[80px]"
        />
      );
    }

    if (field.type === "image") {
      return (
        <div className="space-y-2">
          {value && typeof value === "string" && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100">
              <Image
                src={value.startsWith("admin/") ? "" : value}
                alt="preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadingFile(field.key);
                  handleImageUpload(file);
                }
              }}
            />
            {saving && uploadingFile === field.key ? "上传中..." : "上传图片"}
          </label>
        </div>
      );
    }

    // default: text / number
    return (
      <input
        type={field.type === "number" ? "number" : "text"}
        value={(value as string) || ""}
        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          添加
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-sm text-gray-400">暂无数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {fields.slice(0, 5).map((f) => (
                    <th key={f.key} className="text-left px-4 py-3 text-xs font-medium text-gray-500 tracking-wider">{f.label}</th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => {
                  const id = (item as unknown as { id: number }).id;
                  return (
                    <tr key={id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      {fields.slice(0, 5).map((f) => (
                        <td key={f.key} className="px-4 py-3 text-gray-700 max-w-[200px] truncate">
                          {f.type === "boolean" ? (
                            <span className={item[f.key] ? "text-green-600" : "text-gray-400"}>
                              {item[f.key] ? "是" : "否"}
                            </span>
                          ) : f.type === "image" ? (
                            item[f.key] ? (
                              <span className="text-primary text-xs">已上传</span>
                            ) : (
                              <span className="text-gray-400 text-xs">无</span>
                            )
                          ) : (
                            String(item[f.key] ?? "-")
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onReorder && (
                            <input
                              type="number"
                              defaultValue={(item as unknown as { sort_order?: number }).sort_order ?? idx}
                              className="w-12 px-1 py-1 text-xs border border-gray-200 rounded text-center"
                              onChange={(e) => onReorder(id, parseInt(e.target.value) || 0)}
                            />
                          )}
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/20 flex items-start justify-center pt-[10vh] px-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-lg max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">{editing ? "编辑" : "添加"}</h3>
            </div>
            <div className="p-5 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{f.label}</label>
                  {renderField(f)}
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}