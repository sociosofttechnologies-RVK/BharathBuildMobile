import React from "react";
import { Stack } from "expo-router";
import { RoleGuard } from "@/components/RoleGuard";

const T = (name: string, title: string) => <Stack.Screen key={name} name={name} options={{ title }} />;
export default function VendorLayout() {
  return (
    <RoleGuard role="vendor">
      <Stack screenOptions={{ headerShown: true, headerStyle: { backgroundColor: "#0D2B45" }, headerTintColor: "#fff" }}>
        {T("index", "Vendor Dashboard")}{T("listings", "My Listings")}{T("leads", "Leads")}{T("messages", "Messages")}{T("thread/[id]", "Conversation")}
        {T("portfolio", "Portfolio")}{T("profile", "Business Profile")}{T("reviews", "Reviews")}{T("analytics", "Analytics")}{T("subscription", "Subscription")}
      </Stack>
    </RoleGuard>
  );
}
