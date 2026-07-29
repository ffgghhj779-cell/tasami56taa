import { FormEvent, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { translateAuthError, useAuth } from "@/src/hooks/useAuth";

type Mode = "login" | "register";

export default function AuthPage({ mode }: { mode: Mode }) {
  const { user, loading, signIn, signUp, configured } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    try {
      if (!isLogin) {
        if (password !== confirm) {
          throw new Error("كلمتا المرور غير متطابقتين");
        }
        if (password.length < 6) {
          throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        }
        const result = await signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
        });
        if (result === "confirm_email") {
          setInfo(
            "تم إنشاء الحساب. إذا كان تأكيد البريد مفعّلاً، راجع بريدك ثم سجّل الدخول.",
          );
          return;
        }
        navigate("/admin", { replace: true });
        return;
      }

      await signIn(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      const raw = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(translateAuthError(raw));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" dir="rtl">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0A182D] text-white p-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(244,180,26,0.25), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(42,122,66,0.35), transparent 45%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="" className="h-12 w-auto" />
            <div>
              <div className="font-brand text-xl font-black">
                تسامي <span className="text-[#2A7A42]">الوطنية</span>
              </div>
              <div className="text-xs font-bold text-[#E66A1F]">لوحة الإدارة</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-4xl font-black leading-tight">
            إدارة الطلبات والمحتوى من مكان واحد
          </h1>
          <p className="text-white/70 leading-relaxed">
            تابع طلبات التسعير، حدّث المنتجات، وأدر محتوى الموقع بسهولة وأمان عبر
            Supabase.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4B41A]" />
              لوحة مؤشرات لحظية للطلبات
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4B41A]" />
              إدارة المنتجات والآراء والأسئلة
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4B41A]" />
              حسابات فريق محمية بـ Auth
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} تسامي الوطنية
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-[#F7F8FA] px-4 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <img src="/logo-mark.png" alt="تسامي" className="h-14 mx-auto mb-3" />
            <div className="font-brand text-xl font-black text-[#0A182D]">
              تسامي <span className="text-[#2A7A42]">الوطنية</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-[0_20px_50px_-28px_rgba(14,42,71,0.45)] p-7 sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-black text-[#0A182D]">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {isLogin
                  ? "ادخل إلى لوحة تحكم تسامي الوطنية"
                  : "أنشئ حساب فريق للوصول إلى لوحة الإدارة"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 mb-6">
              <Link
                to="/admin/login"
                className={`text-center text-sm font-bold py-2.5 rounded-lg transition-colors ${
                  isLogin ? "bg-white text-[#0A182D] shadow-sm" : "text-slate-500"
                }`}
              >
                دخول
              </Link>
              <Link
                to="/admin/register"
                className={`text-center text-sm font-bold py-2.5 rounded-lg transition-colors ${
                  !isLogin ? "bg-white text-[#0A182D] shadow-sm" : "text-slate-500"
                }`}
              >
                إنشاء حساب
              </Link>
            </div>

            {!configured && (
              <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
                مفاتيح Supabase غير مضبوطة. راجع `.env.local`.
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {!isLogin && (
                <Field label="الاسم الكامل" htmlFor="fullName">
                  <div className="relative">
                    <UserRound className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="fullName"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="field-input pr-10"
                      placeholder="مثال: أسامة خليل"
                    />
                  </div>
                </Field>
              )}

              <Field label="البريد الإلكتروني" htmlFor="email">
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field-input pr-10 text-left"
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>
              </Field>

              <Field label="كلمة المرور" htmlFor="password">
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    required
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field-input pr-10 pl-10 text-left"
                    placeholder="••••••••"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPass ? "إخفاء" : "إظهار"}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              {!isLogin && (
                <Field label="تأكيد كلمة المرور" htmlFor="confirm">
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="confirm"
                      type={showPass ? "text" : "password"}
                      required
                      dir="ltr"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="field-input pr-10 text-left"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </Field>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-medium">
                  {error}
                </div>
              )}
              {info && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm font-medium">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !configured}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 text-white py-3.5 rounded-xl font-extrabold transition-colors"
              >
                {busy
                  ? isLogin
                    ? "جاري الدخول..."
                    : "جاري إنشاء الحساب..."
                  : isLogin
                    ? "دخول إلى اللوحة"
                    : "إنشاء الحساب"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/" className="font-bold text-[#0E2A47] hover:text-[#E66A1F]">
                العودة للموقع
              </Link>
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0.8rem 1rem;
          color: #0a182d;
          outline: none;
        }
        .field-input:focus {
          border-color: #f4b41a;
          box-shadow: 0 0 0 3px rgba(244, 180, 26, 0.2);
          background: #fff;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-bold text-[#0A182D] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
