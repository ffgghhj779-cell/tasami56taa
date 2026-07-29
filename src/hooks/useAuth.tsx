import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/src/lib/supabase";

export type UserRole = "admin" | "staff" | "customer";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  isTeam: boolean;
  isCustomer: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
  }) => Promise<"session" | "confirm_email">;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[auth] profile fetch:", error.message);
    return null;
  }
  return data as Profile | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    setProfile(await fetchProfile(user.id));
  }, [user]);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        setProfile(await fetchProfile(data.session.user.id));
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        setLoading(true);
        void fetchProfile(next.user.id).then((p) => {
          if (mounted) {
            setProfile(p);
            setLoading(false);
          }
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      fullName: string;
      role?: UserRole;
    }) => {
      const role = input.role === "staff" ? "staff" : "customer";
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            role,
          },
        },
      });
      if (error) throw error;
      return data.session ? "session" : "confirm_email";
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const isTeam = profile?.role === "admin" || profile?.role === "staff";
  const isCustomer = profile?.role === "customer";

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      configured: supabaseConfigured,
      isTeam,
      isCustomer,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      session,
      user,
      profile,
      loading,
      isTeam,
      isCustomer,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "البريد أو كلمة المرور غير صحيحة";
  if (m.includes("user already registered")) return "هذا البريد مسجّل مسبقاً — جرّب تسجيل الدخول";
  if (m.includes("password should be at least")) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  if (m.includes("email not confirmed")) return "يرجى تأكيد البريد الإلكتروني أولاً";
  if (m.includes("rate limit")) return "محاولات كثيرة — انتظر قليلاً ثم أعد المحاولة";
  if (m.includes("signup is disabled")) return "إنشاء الحسابات معطّل حالياً من إعدادات Supabase";
  return message;
}
