import React from "react";
import { Stack } from "expo-router";
import { RoleGuard } from "@/components/RoleGuard";

const T = (name: string, title: string) => <Stack.Screen key={name} name={name} options={{ title }} />;
export default function AdminLayout() {
  return (
    <RoleGuard role="admin">
      <Stack screenOptions={{ headerShown: true, headerStyle: { backgroundColor: "#0D2B45" }, headerTintColor: "#fff" }}>
        {T("index", "Admin Dashboard")}{T("listings", "Listings")}{T("vendors", "Vendors")}{T("users", "Users")}
        {T("leads", "Leads")}{T("reviews", "Reviews")}{T("categories", "Categories")}{T("ads", "Ads")}
        {T("payments", "Payments")}{T("reports", "Reports")}{T("roles", "Roles")}{T("admins", "Admins")}
        {T("settings", "Settings")}{T("system", "System")}{T("activity", "Activity")}{T("admin-activity", "Admin Activity")}{T("accounts", "Accounts")}
      </Stack>
    </RoleGuard>
  );
}
