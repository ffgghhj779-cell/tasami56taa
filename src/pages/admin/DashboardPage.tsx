import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  HelpCircle,
  MessageCircle,
  MessageSquareQuote,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { listQuoteRequests } from "@/src/services/leads";
import { listFaqsAdmin, listProductsAdmin, listTestimonialsAdmin } from "@/src/services/content";
import { listOrdersAdmin } from "@/src/services/orders";
import { fetchWhatsAppStats } from "@/src/services/whatsapp";
import type { Order, QuoteRequest } from "@/src/types/database";
import { useAuth } from "@/src/hooks/useAuth";
import { formatSar } from "@/src/data/storePricing";

type Stats = {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  quoted: number;
  products: number;
  faqs: number;
  testimonials: number;
  waOrdersToday: number;
  totalOrders: number;
  newOrders: number;
};

const emptyStats: Stats = {
  totalLeads: 0,
  newLeads: 0,
  contacted: 0,
  quoted: 0,
  products: 0,
  faqs: 0,
  testimonials: 0,
  waOrdersToday: 0,
  totalOrders: 0,
  newOrders: 0,
};

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [recent, setRecent] = useState<QuoteRequest[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [leads, products, faqs, testimonials, waStats, orders] = await Promise.all([
          listQuoteRequests(),
          listProductsAdmin(),
          listFaqsAdmin(),
          listTestimonialsAdmin(),
          fetchWhatsAppStats().catch(() => ({ ok: false, ordersToday: 0, ordersWeek: 0, ordersTotal: 0, botPaused: 0 })),
          listOrdersAdmin().catch(() => [] as Order[]),
        ]);
        if (cancelled) return;
        setStats({
          totalLeads: leads.length,
          newLeads: leads.filter((l) => l.status === "new").length,
          contacted: leads.filter((l) => l.status === "contacted").length,
          quoted: leads.filter((l) => l.status === "quoted").length,
          products: products.length,
          faqs: faqs.length,
          testimonials: testimonials.length,
          waOrdersToday: waStats.ordersToday,
          totalOrders: orders.length,
          newOrders: orders.filter((o) => o.status === "new").length,
        });
        setRecent(leads.slice(0, 6));
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "تعذر تحميل لوحة المعلومات");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const name =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "المدير";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E66A1F] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            نظرة عامة
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A182D]">
            مرحباً، {name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ملخص طلبات الشراء والتسعير والمحتوى
          </p>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white px-4 py-2.5 text-sm font-extrabold"
        >
          <Plus className="h-4 w-4" />
          طلبات الشراء
        </Link>
      </div>

      <Link
        to="/admin/whatsapp"
        className="block relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#075E54] via-[#128C7E] to-[#2A7A42] p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15">
              <MessageCircle className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-black text-lg">بوت واتساب تسامي</h2>
              <p className="text-sm text-white/80 mt-0.5">
                طلبات العملاء · إرسال رسائل · متابعة البوت
              </p>
              {stats.waOrdersToday > 0 && (
                <p className="text-xs text-white/70 mt-1">
                  {stats.waOrdersToday} طلب واتساب اليوم
                </p>
              )}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-sm font-extrabold">
            فتح اللوحة
            <ArrowLeft className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="طلبات شراء جديدة"
          value={stats.newOrders}
          hint={`${stats.totalOrders} إجمالي الشراء`}
          tone="amber"
          loading={loading}
        />
        <StatCard
          label="طلبات تسعير جديدة"
          value={stats.newLeads}
          hint={`${stats.totalLeads} إجمالي التسعير`}
          tone="navy"
          loading={loading}
        />
        <StatCard
          label="المنتجات"
          value={stats.products}
          hint="في كتالوج الموقع"
          tone="green"
          loading={loading}
        />
        <StatCard
          label="المحتوى"
          value={stats.faqs + stats.testimonials}
          hint={`${stats.faqs} أسئلة · ${stats.testimonials} آراء`}
          tone="gold"
          loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-black text-[#0A182D]">أحدث طلبات الشراء</h2>
              <Link
                to="/admin/orders"
                className="text-sm font-bold text-[#E66A1F] inline-flex items-center gap-1"
              >
                عرض الكل
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {loading && (
                <p className="p-6 text-sm text-slate-500">جاري التحميل...</p>
              )}
              {!loading && recentOrders.length === 0 && (
                <p className="p-6 text-sm text-slate-500">لا توجد طلبات شراء بعد.</p>
              )}
              {recentOrders.map((row) => (
                <Link
                  key={row.id}
                  to="/admin/orders"
                  className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#0A182D] truncate">
                      {row.business_name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate" dir="ltr">
                      {row.order_number} · {row.city}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="text-sm font-black text-[#0A182D]">
                      {formatSar(Number(row.total_sar))}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1" dir="ltr">
                      {new Date(row.created_at).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-black text-[#0A182D]">أحدث طلبات التسعير</h2>
              <Link
                to="/admin/leads"
                className="text-sm font-bold text-[#E66A1F] inline-flex items-center gap-1"
              >
                عرض الكل
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {!loading && recent.length === 0 && (
                <p className="p-6 text-sm text-slate-500">لا توجد طلبات بعد.</p>
              )}
              {recent.map((row) => (
                <Link
                  key={row.id}
                  to="/admin/leads"
                  className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#0A182D] truncate">{row.business}</div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {row.city} · {row.product}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <StatusPill status={row.status} />
                    <div className="text-[11px] text-slate-400 mt-1" dir="ltr">
                      {new Date(row.created_at).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
          <h2 className="font-black text-[#0A182D] mb-2">اختصارات سريعة</h2>
          <QuickLink
            to="/admin/orders"
            icon={<ShoppingBag className="h-4 w-4" />}
            title="طلبات الشراء"
            desc="متابعة طلبات المتجر الأونلاين"
          />
          <QuickLink
            to="/admin/leads"
            icon={<ClipboardList className="h-4 w-4" />}
            title="طلبات التسعير"
            desc="إدارة ومتابعة طلبات الجملة"
          />
          <QuickLink
            to="/admin/products"
            icon={<Package className="h-4 w-4" />}
            title="المنتجات"
            desc="تحديث الكتالوج والصور"
          />
          <QuickLink
            to="/admin/testimonials"
            icon={<MessageSquareQuote className="h-4 w-4" />}
            title="آراء العملاء"
            desc="إضافة أو تعديل الشهادات"
          />
          <QuickLink
            to="/admin/whatsapp"
            icon={<MessageCircle className="h-4 w-4" />}
            title="واتساب البوت"
            desc="طلبات سارة وإرسال رسائل للعملاء"
          />
          <QuickLink
            to="/admin/faqs"
            icon={<HelpCircle className="h-4 w-4" />}
            title="الأسئلة الشائعة"
            desc="إدارة محتوى FAQ"
          />
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
  loading,
}: {
  label: string;
  value: number;
  hint: string;
  tone: "amber" | "navy" | "green" | "gold";
  loading: boolean;
}) {
  const tones = {
    amber: "from-amber-50 to-white border-amber-100",
    navy: "from-slate-50 to-white border-slate-200",
    green: "from-emerald-50 to-white border-emerald-100",
    gold: "from-yellow-50 to-white border-yellow-100",
  };
  const valueColor = {
    amber: "text-amber-700",
    navy: "text-[#0E2A47]",
    green: "text-emerald-700",
    gold: "text-[#B45309]",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${tones[tone]}`}>
      <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
      <div className={`text-3xl font-black ${valueColor[tone]}`}>
        {loading ? "—" : value}
      </div>
      <div className="text-xs text-slate-500 mt-2">{hint}</div>
    </div>
  );
}

function StatusPill({ status }: { status: QuoteRequest["status"] }) {
  const map: Record<QuoteRequest["status"], { label: string; className: string }> = {
    new: { label: "جديد", className: "bg-amber-100 text-amber-800" },
    contacted: { label: "تم التواصل", className: "bg-sky-100 text-sky-800" },
    quoted: { label: "تم التسعير", className: "bg-emerald-100 text-emerald-800" },
    closed: { label: "مغلق", className: "bg-slate-200 text-slate-700" },
    spam: { label: "مزعج", className: "bg-red-100 text-red-700" },
  };
  const s = map[status];
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
}

function QuickLink({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-xl border border-slate-100 hover:border-[#F4B41A]/50 hover:bg-[#FFFBEB] p-3 transition-colors"
    >
      <span className="mt-0.5 grid place-items-center h-9 w-9 rounded-lg bg-[#0E2A47] text-white">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-black text-[#0A182D]">{title}</span>
        <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
      </span>
    </Link>
  );
}
