import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AppRole = "customer" | "vendor" | "admin" | "super_admin";
type Ctx = {
  session: Session | null; user: User | null; roles: AppRole[];
  isAdmin: boolean; isVendor: boolean; loading: boolean;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async (uid?: string) => {
    if (!uid) return setRoles([]);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role as AppRole));
  }, []);

  useEffect(() => {
    supabase.auth.getSession()
      .then(async ({ data }) => {
        setSession(data.session);
        await loadRoles(data.session?.user?.id);
      })
      .catch(() => { /* offline or storage problem: continue signed-out */ })
      .finally(() => setLoading(false));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      // defer to avoid awaiting supabase calls inside the auth callback
      setTimeout(() => loadRoles(s?.user?.id), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadRoles]);

  const value: Ctx = {
    session, user: session?.user ?? null, roles,
    isAdmin: roles.includes("admin") || roles.includes("super_admin"),
    isVendor: roles.includes("vendor"), loading,
    signOut: async () => { await supabase.auth.signOut(); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
