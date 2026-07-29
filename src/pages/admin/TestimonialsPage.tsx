import { FormEvent, useEffect, useState } from "react";
import {
  deleteTestimonial,
  listTestimonialsAdmin,
  upsertTestimonial,
} from "@/src/services/content";
import type { Testimonial } from "@/src/types/database";

const empty = {
  quote: "",
  author: "",
  role: "",
  sort_order: 0,
  is_active: true,
};

export default function TestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> & typeof empty>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setRows(await listTestimonialsAdmin());
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
      await upsertTestimonial(editing);
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
        <h1 className="text-2xl font-black text-[#0A182D]">آراء العملاء</h1>
        <p className="text-sm text-slate-500 mt-1">تظهر في قسم الشهادات بالموقع</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">الرأي</label>
          <textarea
            required
            rows={3}
            value={editing.quote}
            onChange={(e) => setEditing((s) => ({ ...s, quote: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="الاسم" value={editing.author} onChange={(v) => setEditing((s) => ({ ...s, author: v }))} required />
          <Input label="الصفة / المدينة" value={editing.role} onChange={(v) => setEditing((s) => ({ ...s, role: v }))} />
          <Input
            label="الترتيب"
            type="number"
            value={String(editing.sort_order)}
            onChange={(v) => setEditing((s) => ({ ...s, sort_order: Number(v) || 0 }))}
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
        <div className="flex gap-2 justify-end">
          {editing.id && (
            <button type="button" onClick={() => setEditing(empty)} className="px-4 py-2 rounded-lg border text-sm font-bold">
              إلغاء
            </button>
          )}
          <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-[#16A34A] text-white text-sm font-bold disabled:opacity-60">
            {busy ? "جاري الحفظ..." : editing.id ? "تحديث" : "إضافة"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl bg-white border border-slate-200 p-4">
            <p className="text-sm text-slate-700 leading-relaxed">“{row.quote}”</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold text-[#0A182D]">
                {row.author}
                <span className="text-slate-400 font-medium"> — {row.role}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      id: row.id,
                      quote: row.quote,
                      author: row.author,
                      role: row.role,
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
                    if (!confirm("حذف الرأي؟")) return;
                    await deleteTestimonial(row.id);
                    await load();
                  }}
                  className="px-3 py-2 rounded-lg text-red-600 text-sm font-bold"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({
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
