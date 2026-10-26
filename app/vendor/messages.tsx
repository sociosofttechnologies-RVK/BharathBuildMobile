import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { format } from "@/lib/format";
import { getVendorMessages, groupThreads, type Thread } from "@/lib/vendor";

export default function VendorMessages() {
  const { user } = useAuth(); const router = useRouter();
  const q = useQuery({ queryKey: ["vendor", "messages", user?.id], queryFn: async () => groupThreads(await getVendorMessages(user!.id)), enabled: !!user, refetchInterval: 10000 });
  return (
    <ListScreen<Thread & { id: string }> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No messages yet" emptySubtitle="Customer enquiries about your listings will appear here."
      renderItem={(t) => (
        <Pressable onPress={() => router.push(`/vendor/thread/${t.id}` as never)} className="mb-3">
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="text-navy font-semibold flex-1 mr-2" numberOfLines={1}>{t.userName}</Text>
              {t.unread > 0 && <View className="bg-orange rounded-full px-2 py-0.5"><Text className="text-white text-xs font-semibold">{t.unread}</Text></View>}
            </View>
            <Text className="text-slate text-sm mt-1" numberOfLines={2}>{t.last.sender_type === "vendor" ? "You: " : ""}{t.last.body}</Text>
            <Text className="text-slate text-xs mt-1">{format(t.last.created_at)}</Text>
          </Card>
        </Pressable>
      )} />
  );
}
