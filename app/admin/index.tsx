import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { getAdminDashboard } from "@/lib/admin";

const MENU: [string, string][] = [
  ["Listings", "listings"], ["Vendors", "vendors"], ["Users", "users"], ["Leads", "leads"], ["Reviews", "reviews"],
  ["Categories", "categories"], ["Ads", "ads"], ["Payments", "payments"], ["Reports", "reports"], ["Roles", "roles"],
  ["Admins", "admins"], ["Settings", "settings"], ["System", "system"], ["Activity", "activity"], ["Admin Activity", "admin-activity"], ["Accounts", "accounts"],
];

export default function AdminHome() {
  const router = useRouter();
  const { data, error } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getAdminDashboard });
  const tiles: [string, number | undefined, boolean?][] = [
    ["Users", data?.users], ["Vendors", data?.vendors], ["Vendors pending", data?.pendingVendors, true],
    ["Listings", data?.listings], ["Live listings", data?.activeListings], ["Listings pending", data?.pendingListings, true],
    ["Leads", data?.leads], ["Reviews", data?.reviews],
  ];
  return (
    <ScreenContainer>
      {error && <Text className="text-destructive mt-4">{(error as Error).message}</Text>}
      <View className="flex-row flex-wrap -mx-1.5 mt-4 mb-4">
        {tiles.map(([label, v, warn]) => (
          <View key={label} className="w-1/2 px-1.5 mb-3">
            <Card>
              <Text className="text-slate text-xs">{label}</Text>
              <Text className={`font-bold text-2xl mt-1 ${warn && v ? "text-orange" : "text-navy"}`}>{v ?? "–"}</Text>
            </Card>
          </View>
        ))}
      </View>
      {MENU.map(([label, route]) => (
        <Pressable key={route} onPress={() => router.push(`/admin/${route}` as never)} className="bg-white border border-lightgrey rounded-xl px-4 py-4 mb-2.5">
          <Text className="text-navy font-medium">{label}</Text>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
