import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ListingCard } from "@/components/listings/ListingCard";
import { CATEGORIES } from "@/lib/categories";
import { searchListings } from "@/lib/listings";

export default function HomeScreen() {
  const router = useRouter();
  const featured = useQuery({ queryKey: ["listings", "home"], queryFn: () => searchListings({}) });
  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["top"]}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="pt-4 pb-2">
          <Text className="text-slate text-sm">India's B2B Construction Marketplace</Text>
          <Text className="text-navy font-bold text-2xl mt-1">BharathBuild</Text>
        </View>
        <Pressable onPress={() => router.push("/(public)/search")} className="bg-white border border-lightgrey rounded-xl px-4 py-3.5 mb-5">
          <Text className="text-slate">Search materials, vendors, jobs...</Text>
        </Pressable>
        <Text className="text-navy font-semibold text-lg mb-3">Browse Categories</Text>
        <View className="flex-row flex-wrap -mx-1.5 mb-5">
          {CATEGORIES.map((c) => (
            <View key={c.key} className="w-1/2 px-1.5 mb-3">
              <Pressable onPress={() => router.push({ pathname: "/(public)/search", params: { category: c.key } })} className="bg-white border border-lightgrey rounded-xl px-3 py-4">
                <Text className="text-navy font-medium">{c.label}</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Text className="text-navy font-semibold text-lg mb-3">Featured Vendors</Text>
        {featured.isLoading && <ActivityIndicator color="#0D2B45" />}
        {featured.data?.slice(0, 8).map((l) => <ListingCard key={l.id} listing={l} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
