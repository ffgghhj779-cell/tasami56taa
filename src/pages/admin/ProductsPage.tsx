import { FormEvent, useEffect, useState } from "react";
import {
  deleteProduct,
  listProductsAdmin,
  upsertProduct,
} from "@/src/services/content";
import type { Product } from "@/src/types/database";

const empty = {
  title: "",
  form_value: "",
  description: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function ProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> & typeof empty>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setRows(await listProductsAdmin());
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر التحميل");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await upsertProduct(editing);
      setEditing(empty);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0A182D]">المنتجات</h1>
        <p className="text-sm text-slate-500 mt-1">تظهر في صفحة الموقع وقائمة نموذج الطلب</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="rounded-2xl bg-white border border-slate-200 p-5 grid md:grid-cols-2 gap-4">
        <Field
          label="اسم المنتج"
          value={editing.title}
          onChange={(v) => setEditing((s) => ({ ...s, title: v }))}
          required
        />
        <Field
          label="قيمة النموذج (form value)"
          value={editing.form_value}
          onChange={(v) => setEditing((s) => ({ ...s, form_value: v }))}
          required
        />
        <Field
          label="رابط الصورة"
          value={editing.image_url}
          onChange={(v) => setEditing((s) => ({ ...s, image_url: v }))}
          required
        />
        <Field
          label="الترتيب"
          type="number"
          value={String(editing.sort_order)}
          onChange={(v) => setEditing((s) => ({ ...s, sort_order: Number(v) || 0 }))}
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-bold mb-2">الوصف</label>
          <textarea
            required
            rows={3}
            value={editing.description}
            onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={editing.is_active}
            onChange={(e) => setEditing((s) => ({ ...s, is_active: e.target.checked }))}
          />
          ظاهر في الموقع
        </label>
        <div className="flex gap-2 justify-end md:col-span-2">
          {editing.id && (
            <button
              type="button"
              onClick={() => setEditing(empty)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold"
            >
              إلغاء التعديل
            </button>
          )}
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 rounded-lg bg-[#16A34A] text-white text-sm font-bold disabled:opacity-60"
          >
            {busy ? "جاري الحفظ..." : editing.id ? "تحديث المنتج" : "إضافة منتج"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-wrap items-center gap-4"
          >
            <img
              src={row.image_url}
              alt=""
              className="h-16 w-16 rounded-lg object-cover bg-slate-100"
            />
            <div className="flex-1 min-w-[180px]">
              <div className="font-black text-[#0A182D]">{row.title}</div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-2">{row.description}</div>
              {!row.is_active && (
                <span className="inline-block mt-2 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  مخفي
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    id: row.id,
                    title: row.title,
                    form_value: row.form_value,
                    description: row.description,
                    image_url: row.image_url,
                    sort_order: row.sort_order,
                    is_active: row.is_active,
                  })
                }
                className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-bold"
              >
                تعديل
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("حذف المنتج؟")) return;
                  await deleteProduct(row.id);
                  await load();
                }}
                className="px-3 py-2 rounded-lg text-red-600 text-sm font-bold"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
      />
    </div>
  );
}
