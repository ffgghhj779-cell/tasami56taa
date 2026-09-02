import { Fragment, useCallback, useEffect, useState } from "react";
import {
  CalendarCheck,
  ChartLine,
  MessageCircle,
  Package,
  PauseCircle,
  Phone,
  RefreshCw,
  Send,
  User,
} from "lucide-react";
import {
  fetchWhatsAppOrders,
  fetchWhatsAppStats,
  formatSaPhone,
  ORDER_STATUSES,
  sendWhatsAppMessage,
  updateWhatsAppOrderStatus,
  type BotPause,
  type WhatsAppOrder,
  type WhatsAppStats,
} from "@/src/services/whatsapp";

const emptyStats: WhatsAppStats = {
  ok: false,
  ordersToday: 0,
  ordersWeek: 0,
  ordersTotal: 0,
  botPaused: 0,
};

export default function WhatsAppPage() {
  const [stats, setStats] = useState<WhatsAppStats>(emptyStats);
  const [orders, setOrders] = useState<WhatsAppOrder[]>([]);
  const [pauses, setPauses] = useState<BotPause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [sendPhone, setSendPhone] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendOk, setSendOk] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, ordersData] = await Promise.all([
        fetchWhatsAppStats(),
        fetchWhatsAppOrders(),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders);
      setPauses(ordersData.pauses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل بيانات الواتساب");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onStatusChange(id: number, status: string) {
    await updateWhatsAppOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const phone = sendPhone.replace(/\D/g, "").trim();
    const message = sendMessage.trim();
    if (!phone || !message) return;

    setSending(true);
    setSendError(null);
    setSendOk(false);
    try {
      await sendWhatsAppMessage(phone, message);
      setSendOk(true);
      setSendMessage("");
      setTimeout(() => setSendOk(false), 3000);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "تعذر الإرسال");
    } finally {
      setSending(false);
    }
  }

  const statCards = [
    { label: "طلبات اليوم", value: stats.ordersToday, icon: Package, tone: "green" as const },
    { label: "طلبات الأسبوع", value: stats.ordersWeek, icon: CalendarCheck, tone: "gold" as const },
    { label: "إجمالي الطلبات", value: stats.ordersTotal, icon: ChartLine, tone: "navy" as const },
    { label: "بوت متوقف", value: stats.botPaused, icon: PauseCircle, tone: "amber" as const },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#075E54] via-[#128C7E] to-[#2A7A42] p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -end-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
              <MessageCircle className="h-7 w-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">بوت واتساب تسامي</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#86EFAC]" />
                  متصل
                </span>
              </div>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                طلبات العملاء عبر سارة، إرسال رسائل مباشرة، ومتابعة حالة البوت
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold hover:bg-white/25 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
          {!stats.ok && (
            <p className="mt-1 text-xs opacity-80">
              تأكد من إضافة DATABASE_URL في إعدادات Vercel
            </p>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <StatCard key={label} label={label} value={value} icon={Icon} tone={tone} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Orders */}
        <section className="xl:col-span-2 rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-[#0A182D]">طلبات واتساب</h2>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {orders.length} طلب
            </span>
          </div>

          {loading ? (
            <p className="p-8 text-sm text-slate-500 text-center">جاري التحميل...</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-sm text-slate-500 text-center">لا توجد طلبات واتساب بعد.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 text-right font-bold sm:px-5">العميل</th>
                    <th className="px-4 py-3 text-right font-bold">الجوال</th>
                    <th className="px-4 py-3 text-right font-bold">الحالة</th>
                    <th className="px-4 py-3 text-right font-bold">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <Fragment key={order.id}>
                      <tr className="hover:bg-slate-50/80">
                        <td className="px-4 py-3.5 sm:px-5">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="font-bold text-[#0A182D]">
                              {order.customer_name || "عميل"}
                            </span>
                          </div>
                          {order.customer_message && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                              {order.customer_message}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-slate-600" dir="ltr">
                          {formatSaPhone(order.phone)}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => void onStatusChange(order.id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-[#0E2A47] outline-none focus:border-[#F4B41A]"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {new Date(order.created_at).toLocaleString("ar-SA", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(expandedId === order.id ? null : order.id)
                              }
                              className="rounded-lg px-2 py-1 text-xs font-bold text-[#E66A1F] hover:bg-orange-50"
                            >
                              {expandedId === order.id ? "إخفاء" : "تفاصيل"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSendPhone(formatSaPhone(order.phone))}
                              className="rounded-lg px-2 py-1 text-xs font-bold text-[#2A7A42] hover:bg-emerald-50"
                            >
                              رد
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === order.id && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={5} className="px-4 py-4 sm:px-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs font-bold text-[#0E2A47] mb-2">رسالة العميل</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {order.customer_message || "—"}
                                </p>
                              </div>
                              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                                <p className="text-xs font-bold text-[#2A7A42] mb-2">رد سارة</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {order.sara_reply || "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <div className="space-y-6">
          <form
            onSubmit={(e) => void onSend(e)}
            className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-3"
          >
            <h2 className="flex items-center gap-2 font-black text-[#0A182D]">
              <Send className="h-4 w-4 text-[#E66A1F]" />
              إرسال رسالة واتساب
            </h2>
            <p className="text-xs text-slate-500">
              تُرسل عبر Romanh — البوت يتوقف 4 ساعات تلقائياً
            </p>

            <label className="block text-xs font-bold text-slate-600">رقم الجوال</label>
            <div className="relative">
              <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={sendPhone}
                onChange={(e) => setSendPhone(e.target.value)}
                placeholder="9665xxxxxxxx"
                dir="ltr"
                className="w-full rounded-xl border border-slate-200 py-2.5 ps-9 pe-3 text-sm outline-none focus:border-[#F4B41A]"
              />
            </div>

            <label className="block text-xs font-bold text-slate-600">نص الرسالة</label>
            <textarea
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              rows={4}
              placeholder="اكتب رسالتك للعميل…"
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#F4B41A]"
            />

            {sendError && <p className="text-xs text-red-600">{sendError}</p>}
            {sendOk && <p className="text-xs text-[#2A7A42] font-bold">تم الإرسال بنجاح ✓</p>}

            <button
              type="submit"
              disabled={sending || !sendPhone.trim() || !sendMessage.trim()}
              className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-[#128C7E] to-[#2A7A42] text-white text-sm font-extrabold disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {sending ? "جارٍ الإرسال…" : "إرسال عبر واتساب"}
            </button>
          </form>

          <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="flex items-center gap-2 font-black text-[#0A182D]">
                <PauseCircle className="h-4 w-4 text-amber-600" />
                عملاء البوت متوقف
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">بعد تدخل موظف أو رد يدوي</p>
            </div>
            {pauses.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-slate-500">
                لا يوجد عملاء متوقفين حالياً
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pauses.map((p) => (
                  <li key={p.phone} className="px-5 py-3.5">
                    <p className="font-mono text-xs font-bold text-[#0E2A47]" dir="ltr">
                      {formatSaPhone(p.phone)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      حتى{" "}
                      {new Date(p.pause_until).toLocaleString("ar-SA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    {p.reason && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.reason}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  icon: typeof Package;
  tone: "green" | "gold" | "navy" | "amber";
  loading: boolean;
}) {
  const tones = {
    green: "from-emerald-50 to-white border-emerald-100 text-emerald-700",
    gold: "from-yellow-50 to-white border-yellow-100 text-[#B45309]",
    navy: "from-slate-50 to-white border-slate-200 text-[#0E2A47]",
    amber: "from-amber-50 to-white border-amber-100 text-amber-700",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${tones[tone].split(" ").slice(0, 3).join(" ")}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <p className={`mt-1 text-3xl font-black tabular-nums ${tones[tone].split(" ").pop()}`}>
            {loading ? "—" : value}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm text-[#0E2A47]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
