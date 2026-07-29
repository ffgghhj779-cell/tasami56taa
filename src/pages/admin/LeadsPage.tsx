import { useEffect, useMemo, useState } from "react";
import {
  deleteQuoteRequest,
  listQuoteRequests,
  updateQuoteNotes,
  updateQuoteStatus,
} from "@/src/services/leads";
import type { QuoteRequest, QuoteStatus } from "@/src/types/database";

const statuses: { value: QuoteStatus; label: string }[] = [
  { value: "new", label: "جديد" },
  { value: "contacted", label: "تم التواصل" },
  { value: "quoted", label: "تم التسعير" },
  { value: "closed", label: "مغلق" },
  { value: "spam", label: "مزعج" },
];

const statusStyle: Record<QuoteStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  quoted: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-700",
  spam: "bg-red-100 text-red-700",
};

export default function LeadsPage() {
  const [rows, setRows] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | QuoteStatus>("all");
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listQuoteRequests();
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const counts = useMemo(() => {
    const base = { all: rows.length } as Record<"all" | QuoteStatus, number>;
    for (const s of statuses) base[s.value] = rows.filter((r) => r.status === s.value).length;
    return base;
  }, [rows]);

  async function onStatus(id: string, status: QuoteStatus) {
    await updateQuoteStatus(id, status);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  async function onSaveNotes() {
    if (!selected) return;
    await updateQuoteNotes(selected.id, notes);
    setRows((prev) =>
      prev.map((r) => (r.id === selected.id ? { ...r, notes } : r)),
    );
    setSelected((prev) => (prev ? { ...prev, notes } : prev));
  }

  async function onDelete(id: string) {
    if (!confirm("حذف هذا الطلب نهائياً؟")) return;
    await deleteQuoteRequest(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function openRow(row: QuoteRequest) {
    setSelected(row);
    setNotes(row.notes ?? "");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A182D]">طلبات التسعير</h1>
          <p className="text-sm text-slate-500 mt-1">كل الطلبات الواردة من نموذج الموقع</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg bg-[#0E2A47] text-white px-4 py-2 text-sm font-bold"
        >
          تحديث
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          label={`الكل (${counts.all})`}
          onClick={() => setFilter("all")}
        />
        {statuses.map((s) => (
          <FilterChip
            key={s.value}
            active={filter === s.value}
            label={`${s.label} (${counts[s.value] || 0})`}
            onClick={() => setFilter(s.value)}
          />
        ))}
      </div>

      {loading && <p className="text-slate-500">جاري التحميل...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-500">
          لا توجد طلبات في هذا التصنيف بعد.
        </div>
      )}

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-3">
          {filtered.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => openRow(row)}
              className={`w-full text-right rounded-2xl bg-white border p-4 transition-all ${
                selected?.id === row.id
                  ? "border-[#F4B41A] ring-2 ring-[#F4B41A]/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-[#0A182D]">{row.business}</div>
                  <div className="text-sm text-slate-500 mt-1">
                    {row.city} · {row.product}
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[row.status]}`}>
                  {statuses.find((s) => s.value === row.status)?.label}
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-400" dir="ltr">
                {new Date(row.created_at).toLocaleString("ar-SA")}
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 h-fit sticky top-4">
          {!selected ? (
            <p className="text-slate-500 text-sm">اختر طلباً لعرض التفاصيل.</p>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#0A182D]">{selected.business}</h2>
              <Detail label="الجوال" value={selected.phone} ltr />
              <Detail label="المدينة" value={selected.city} />
              <Detail label="المنتج" value={selected.product} />
              <Detail label="الكمية" value={selected.quantity} />
              <Detail
                label="التاريخ"
                value={new Date(selected.created_at).toLocaleString("ar-SA")}
              />

              <div>
                <label className="block text-sm font-bold mb-2">الحالة</label>
                <select
                  value={selected.status}
                  onChange={(e) => void onStatus(selected.id, e.target.value as QuoteStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">ملاحظات داخلية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                />
                <button
                  type="button"
                  onClick={() => void onSaveNotes()}
                  className="mt-2 rounded-lg bg-[#16A34A] text-white px-4 py-2 text-sm font-bold"
                >
                  حفظ الملاحظات
                </button>
              </div>

              <a
                href={`https://wa.me/966${selected.phone.replace(/\D/g, "").replace(/^966/, "").replace(/^0/, "")}?text=${encodeURIComponent(`السلام عليكم، بخصوص طلب التسعير من ${selected.business}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-lg bg-[#25D366] text-white px-4 py-2 text-sm font-bold"
              >
                واتساب للعميل
              </a>

              <button
                type="button"
                onClick={() => void onDelete(selected.id)}
                className="block text-sm font-bold text-red-600"
              >
                حذف الطلب
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-bold border ${
        active
          ? "bg-[#0E2A47] text-white border-[#0E2A47]"
          : "bg-white text-slate-600 border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function Detail({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-400 mb-1">{label}</div>
      <div className="text-sm font-medium text-[#0A182D]" dir={ltr ? "ltr" : undefined}>
        {value}
      </div>
    </div>
  );
}
