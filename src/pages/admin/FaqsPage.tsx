import { FormEvent, useEffect, useState } from "react";
import { deleteFaq, listFaqsAdmin, upsertFaq } from "@/src/services/content";
import type { Faq } from "@/src/types/database";

const empty = {
  question: "",
  answer: "",
  sort_order: 0,
  is_active: true,
};

export default function FaqsPage() {
  const [rows, setRows] = useState<Faq[]>([]);
  const [editing, setEditing] = useState<Partial<Faq> & typeof empty>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setRows(await listFaqsAdmin());
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
      await upsertFaq(editing);
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
        <h1 className="text-2xl font-black text-[#0A182D]">الأسئلة الشائعة</h1>
        <p className="text-sm text-slate-500 mt-1">تظهر في قسم FAQ بالموقع</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">السؤال</label>
          <input
            required
            value={editing.question}
            onChange={(e) => setEditing((s) => ({ ...s, question: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">الإجابة</label>
          <textarea
            required
            rows={3}
            value={editing.answer}
            onChange={(e) => setEditing((s) => ({ ...s, answer: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">الترتيب</label>
            <input
              type="number"
              value={editing.sort_order}
              onChange={(e) =>
                setEditing((s) => ({ ...s, sort_order: Number(e.target.value) || 0 }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-bold mt-7">
            <input
              type="checkbox"
              checked={editing.is_active}
              onChange={(e) => setEditing((s) => ({ ...s, is_active: e.target.checked }))}
            />
            ظاهر في الموقع
          </label>
        </div>
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
            <div className="font-black text-[#0A182D]">{row.question}</div>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{row.answer}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    id: row.id,
                    question: row.question,
                    answer: row.answer,
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
                  if (!confirm("حذف السؤال؟")) return;
                  await deleteFaq(row.id);
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
