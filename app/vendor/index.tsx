import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { getVendorStats } from "@/lib/vendor";

const MENU: [string, string][] = [["My Listings", "listings"], ["Leads", "leads"], ["Messages", "messages"], ["Portfolio", "portfolio"], ["Business Profile", "profile"], ["Reviews", "reviews"], ["Analytics", "analytics"], ["Subscription", "subscription"]];

export default function VendorHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ["vendor", "stats", user?.id], queryFn: () => getVendorStats(user!.id), enabled: !!user });
  const tiles: [string, number | undefined][] = [["Active listings", data?.activeListings], ["Total views", data?.totalViews], ["Leads", data?.leads], ["Unread messages", data?.unread]];
  return (
    <ScreenContainer>
      <View className="flex-row flex-wrap -mx-1.5 mt-4 mb-4">
        {tiles.map(([label, v]) => (
          <View key={label} className="w-1/2 px-1.5 mb-3"><Card><Text className="text-slate text-xs">{label}</Text><Text className="text-navy font-bold text-2xl mt-1">{v ?? "–"}</Text></Card></View>
        ))}
      </View>
      {MENU.map(([label, route]) => (
        <Pressable key={route} onPress={() => router.push(`/vendor/${route}` as never)} className="bg-white border border-lightgrey rounded-xl px-4 py-4 mb-2.5"><Text className="text-navy font-medium">{label}</Text></Pressable>
      ))}
    </ScreenContainer>
  );
}
