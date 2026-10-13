import { useEffect, useMemo, useState } from "react";
import {
  getOrderWithItems,
  listOrdersAdmin,
  updateOrderAdminNotes,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/src/services/orders";
import { formatSar } from "@/src/data/storePricing";
import { supabase } from "@/src/lib/supabase";
import type {
  Order,
  OrderStatus,
  OrderWithItems,
  PaymentStatus,
} from "@/src/types/database";

const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "مؤكد" },
  { value: "preparing", label: "قيد التجهيز" },
  { value: "out_for_delivery", label: "خرج للتوصيل" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
];

const paymentStatuses: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "بانتظار" },
  { value: "awaiting_transfer", label: "بانتظار التحويل" },
  { value: "paid", label: "مدفوع" },
  { value: "failed", label: "فشل" },
  { value: "refunded", label: "مسترد" },
];

const statusStyle: Record<OrderStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  preparing: "bg-indigo-100 text-indigo-800",
  out_for_delivery: "bg-violet-100 text-violet-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<OrderWithItems | null>(null);
  const [notes, setNotes] = useState("");
  const [detailBusy, setDetailBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listOrdersAdmin();
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل طلبات الشراء");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          void listOrdersAdmin()
            .then(setRows)
            .catch(() => undefined);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  async function openRow(row: Order) {
    setDetailBusy(true);
    setSelected(null);
    try {
      const full = await getOrderWithItems(row.id);
      setSelected(full);
      setNotes(full?.admin_notes ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر فتح تفاصيل الطلب");
    } finally {
      setDetailBusy(false);
    }
  }

  async function onStatus(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  async function onPayment(id: string, payment_status: PaymentStatus) {
    await updatePaymentStatus(id, payment_status);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, payment_status } : r)),
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, payment_status } : prev,
    );
  }

  async function onSaveNotes() {
    if (!selected) return;
    await updateOrderAdminNotes(selected.id, notes);
    setRows((prev) =>
      prev.map((r) =>
        r.id === selected.id ? { ...r, admin_notes: notes } : r,
      ),
    );
    setSelected((prev) => (prev ? { ...prev, admin_notes: notes } : prev));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A182D]">طلبات الشراء</h1>
          <p className="text-sm text-slate-500 mt-1">
            طلبات المتجر الأونلاين (السلة والدفع المرحلي)
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg bg-[#0E2A47] text-white px-4 py-2 text-sm font-bold"
        >
          تحديث
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          label={`الكل (${rows.length})`}
          onClick={() => setFilter("all")}
        />
        {orderStatuses.map((s) => (
          <FilterChip
            key={s.value}
            active={filter === s.value}
            label={`${s.label} (${rows.filter((r) => r.status === s.value).length})`}
            onClick={() => setFilter(s.value)}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-6">
        <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {loading && <p className="p-6 text-sm text-slate-500">جاري التحميل...</p>}
          {!loading && filtered.length === 0 && (
            <p className="p-6 text-sm text-slate-500">لا توجد طلبات شراء بعد.</p>
          )}
          <div className="divide-y divide-slate-100">
            {filtered.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => void openRow(row)}
                className={`w-full text-right px-5 py-4 hover:bg-slate-50 transition-colors ${
                  selected?.id === row.id ? "bg-[#FFFBEB]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-[#0A182D] truncate">
                      {row.business_name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1" dir="ltr">
                      {row.order_number}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {row.city} · {row.phone}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusStyle[row.status]}`}
                    >
                      {orderStatuses.find((s) => s.value === row.status)?.label}
                    </span>
                    <div className="text-sm font-black text-[#0A182D] mt-2">
                      {formatSar(Number(row.total_sar))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 p-5 min-h-[280px]">
          {detailBusy && <p className="text-sm text-slate-500">جاري التحميل...</p>}
          {!detailBusy && !selected && (
            <p className="text-sm text-slate-500">اختر طلباً لعرض التفاصيل.</p>
          )}
          {selected && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-[#E66A1F]" dir="ltr">
                  {selected.order_number}
                </div>
                <h2 className="text-lg font-black text-[#0A182D] mt-1">
                  {selected.business_name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selected.phone} · {selected.city}
                </p>
                {selected.address && (
                  <p className="text-sm text-slate-500 mt-1">{selected.address}</p>
                )}
                {selected.notes && (
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-xl p-3">
                    {selected.notes}
                  </p>
                )}
                {selected.moyasar_payment_id && (
                  <p className="text-xs text-slate-500 mt-2" dir="ltr">
                    Moyasar: {selected.moyasar_payment_id}
                  </p>
                )}
                {selected.paid_at && (
                  <p className="text-xs text-emerald-700 mt-1">
                    دُفع في{" "}
                    {new Date(selected.paid_at).toLocaleString("ar-SA")}
                  </p>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 mb-2">الأصناف</div>
                <ul className="space-y-2">
                  {selected.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between gap-2 text-sm border-b border-slate-50 pb-2"
                    >
                      <span>
                        {item.title} × {item.quantity} ({item.unit})
                      </span>
                      <span className="font-bold shrink-0">
                        {formatSar(Number(item.line_total_sar))}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-3 font-black">
                  <span>الإجمالي</span>
                  <span>{formatSar(Number(selected.total_sar))}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-500 space-y-1">
                  حالة الطلب
                  <select
                    value={selected.status}
                    onChange={(e) =>
                      void onStatus(selected.id, e.target.value as OrderStatus)
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold text-[#0A182D]"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-bold text-slate-500 space-y-1">
                  حالة الدفع
                  <select
                    value={selected.payment_status}
                    onChange={(e) =>
                      void onPayment(
                        selected.id,
                        e.target.value as PaymentStatus,
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold text-[#0A182D]"
                  >
                    {paymentStatuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">ملاحظات الإدارة</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void onSaveNotes()}
                  className="mt-2 rounded-lg bg-[#0E2A47] text-white px-3 py-2 text-xs font-bold"
                >
                  حفظ الملاحظات
                </button>
              </div>
            </div>
          )}
        </section>
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
