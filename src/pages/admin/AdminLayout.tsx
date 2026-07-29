import { useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  X,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

const links = [
  { to: "/admin", end: true, label: "لوحة المعلومات", icon: LayoutDashboard },
  { to: "/admin/leads", end: false, label: "الطلبات", icon: ClipboardList },
  { to: "/admin/products", end: false, label: "المنتجات", icon: Package },
  { to: "/admin/testimonials", end: false, label: "آراء العملاء", icon: MessageSquareQuote },
  { to: "/admin/faqs", end: false, label: "الأسئلة الشائعة", icon: HelpCircle },
];

export default function AdminLayout() {
  const { user, profile, loading, signOut, isTeam } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F4F6F8] text-slate-600" dir="rtl">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-2 border-[#F4B41A] border-t-transparent animate-spin mx-auto mb-3" />
          جاري تحميل لوحة التحكم...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isTeam && !loading) {
    return <Navigate to="/account" replace />;
  }

  async function onSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "مستخدم";

  const roleLabel = profile?.role === "admin" ? "مدير" : "موظف";

  return (
    <div className="min-h-screen bg-[#F4F6F8] lg:grid lg:grid-cols-[260px_1fr]" dir="rtl">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0E2A47] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
          <span className="font-black text-sm">لوحة تسامي</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg bg-white/10"
          aria-label="القائمة"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-[260px] bg-[#0E2A47] text-white flex flex-col
          transition-transform duration-200 lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="" className="h-10 w-auto" />
            <div>
              <div className="font-brand font-black leading-tight">
                تسامي <span className="text-[#2A7A42]">الوطنية</span>
              </div>
              <div className="text-[11px] text-[#E66A1F] font-bold mt-0.5">لوحة الإدارة</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#F4B41A] text-[#0A182D]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="rounded-xl bg-white/5 px-3 py-3">
            <div className="text-sm font-bold truncate">{displayName}</div>
            <div className="text-[11px] text-white/50 truncate mt-0.5" dir="ltr">
              {user.email}
            </div>
            <div className="mt-2 inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2A7A42]/30 text-[#86EFAC]">
              {roleLabel}
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="block text-center text-xs font-bold text-[#F4B41A] hover:underline"
          >
            عرض الموقع العام
          </a>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2.5 text-sm font-bold"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="إغلاق"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
