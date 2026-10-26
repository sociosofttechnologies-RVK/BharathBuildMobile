import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

// Client-side convenience only. Real enforcement is Supabase RLS (has_role policies);
// a non-admin who bypasses this guard still gets empty/denied results from the database.
export function RoleGuard({ role, children }: { role: "admin" | "vendor"; children: React.ReactNode }) {
  const { session, loading, isAdmin, isVendor } = useAuth();
  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator color="#0D2B45" /></View>;
  if (!session) return <Redirect href="/(auth)/login" />;
  const ok = role === "admin" ? isAdmin : isVendor;
  if (!ok) return <Redirect href="/(public)/account" />;
  return <>{children}</>;
}
