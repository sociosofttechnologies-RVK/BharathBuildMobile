import React from "react";
import { FlatList, ActivityIndicator, RefreshControl, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/EmptyState";

// Shared shell for every list screen: loading, error, empty, pull-to-refresh.
export function ListScreen<T extends { id: string }>({ data, isLoading, error, refetch, isRefetching, renderItem, emptyTitle, emptySubtitle, header }: {
  data?: T[]; isLoading: boolean; error?: Error | null; refetch: () => void; isRefetching?: boolean;
  renderItem: (item: T) => React.ReactElement; emptyTitle: string; emptySubtitle?: string; header?: React.ReactElement;
}) {
  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["bottom"]}>
      <FlatList
        data={data ?? []} keyExtractor={(i) => i.id} renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={refetch} />}
        ListHeaderComponent={header}
        ListEmptyComponent={isLoading ? <ActivityIndicator className="mt-8" color="#0D2B45" /> : error ? <Text className="text-destructive text-center mt-8">{error.message}</Text> : <EmptyState title={emptyTitle} subtitle={emptySubtitle} />}
      />
    </SafeAreaView>
  );
}
