import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ClipboardList, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { listMyQuoteRequests } from "@/src/services/leads";
import type { QuoteRequest } from "@/src/types/database";

const statusMap: Record<
  QuoteRequest["status"],
  { label: string; className: string }
> = {
  new: { label: "جديد", className: "bg-amber-100 text-amber-800" },
  contacted: { label: "تم التواصل", className: "bg-sky-100 text-sky-800" },
  quoted: { label: "تم التسعير", className: "bg-emerald-100 text-emerald-800" },
  closed: { label: "مغلق", className: "bg-slate-200 text-slate-700" },
  spam: { label: "مزعج", className: "bg-red-100 text-red-700" },
};

export default function AccountPage() {
  const { user, profile, loading, signOut, isTeam } = useAuth();
  const [rows, setRows] = useState<QuoteRequest[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void listMyQuoteRequests(user.id)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "تعذر تحميل الطلبات");
        }
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F4F6F8]" dir="rtl">
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isTeam) {
    return <Navigate to="/admin" replace />;
  }

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "عميلنا";

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <header className="bg-[#0E2A47] text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="" className="h-10 w-auto" />
            <div>
              <div className="font-brand font-black">
                تسامي <span className="text-[#2A7A42]">الوطنية</span>
              </div>
              <div className="text-[11px] text-[#E66A1F] font-bold">حساب العميل</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/#contact"
              className="rounded-xl bg-[#16A34A] hover:bg-[#15803D] px-4 py-2 text-sm font-extrabold inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              طلب توريد جديد
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2 text-sm font-bold inline-flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A182D]">
            مرحباً، {name}
          </h1>
          <p className="text-sm text-slate-500 mt-1" dir="ltr">
            {user.email}
          </p>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-[#E66A1F]" />
            <h2 className="font-black text-[#0A182D]">طلبات التسعير الخاصة بك</h2>
          </div>

          {busy && <p className="p-6 text-sm text-slate-500">جاري التحميل...</p>}
          {error && (
            <div className="m-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {!busy && !error && rows.length === 0 && (
            <div className="p-8 text-center space-y-3">
              <p className="text-slate-500 text-sm">لا توجد طلبات بعد.</p>
              <Link
                to="/#contact"
                className="inline-flex rounded-xl bg-[#0E2A47] text-white px-4 py-2.5 text-sm font-bold"
              >
                أرسل أول طلب توريد
              </Link>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const s = statusMap[row.status];
              return (
                <div key={row.id} className="px-5 py-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-[#0A182D]">{row.business}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {row.product} · {row.city}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">{row.quantity}</div>
                  </div>
                  <div className="text-left shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.className}`}>
                      {s.label}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-2" dir="ltr">
                      {new Date(row.created_at).toLocaleString("ar-SA")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
