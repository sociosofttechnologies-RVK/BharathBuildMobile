import React, { useState } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search as SearchIcon } from "lucide-react-native";
import { ListingCard } from "@/components/listings/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { searchListings } from "@/lib/listings";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState(params.category ?? "");
  const results = useQuery({ queryKey: ["listings", "search", category, keyword], queryFn: () => searchListings({ category, keyword }) });
  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["top"]}>
      <View className="px-4 pt-4">
        <Text className="text-navy font-bold text-2xl mb-3">Search</Text>
        <View className="flex-row items-center bg-white border border-lightgrey rounded-xl px-3 mb-3">
          <SearchIcon size={18} color="#60707F" />
          <TextInput value={keyword} onChangeText={setKeyword} placeholder="Search materials, vendors, jobs..." placeholderTextColor="#60707F" className="flex-1 px-2 py-3 text-navy" />
        </View>
        <FlatList
          data={[{ key: "", label: "All" }, ...CATEGORIES]} keyExtractor={(c) => c.key || "all"} horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
          renderItem={({ item }) => {
            const active = category === item.key;
            return (
              <Pressable onPress={() => setCategory(item.key)} className={`px-3.5 py-2 rounded-full ${active ? "bg-navy" : "bg-white border border-lightgrey"}`}>
                <Text className={`text-sm font-medium ${active ? "text-white" : "text-navy"}`}>{item.label}</Text>
              </Pressable>
            );
          }}
        />
      </View>
      <FlatList
        data={results.data ?? []} keyExtractor={(l) => l.id} contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        renderItem={({ item }) => <ListingCard listing={item} />}
        ListHeaderComponent={category ? <Text className="text-slate mb-2">{results.data?.length ?? 0} results in {categoryLabel(category)}</Text> : null}
        ListEmptyComponent={results.isLoading ? <ActivityIndicator className="mt-8" color="#0D2B45" /> : <EmptyState title="No listings found" subtitle="Try a different keyword or category" />}
      />
    </SafeAreaView>
  );
}
