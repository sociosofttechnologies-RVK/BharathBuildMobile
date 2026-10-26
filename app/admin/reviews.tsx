import React from "react";
import { View, Text, Alert } from "react-native";
import { Star } from "lucide-react-native";
import { format } from "@/lib/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { confirmAction } from "@/lib/confirm";
import { getAdminReviews, deleteReview, type AdminReview } from "@/lib/admin";

export default function AdminReviews() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "reviews"], queryFn: getAdminReviews });
  const m = useMutation({ mutationFn: deleteReview, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }), onError: (e: Error) => Alert.alert("Action failed", e.message) });
  return (
    <ListScreen<AdminReview> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No reviews"
      renderItem={(r) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-navy font-semibold">{r.customer_name}</Text>
            <View className="flex-row items-center"><Star size={14} color="#F97316" fill="#F97316" /><Text className="text-navy text-sm ml-1">{r.rating}</Text></View>
          </View>
          <Text className="text-slate text-xs mt-0.5">{format(r.created_at)}</Text>
          <Text className="text-navy mt-2">{r.body}</Text>
          <View className="flex-row mt-3"><Button small label="Delete" variant="destructive" onPress={async () => { if (await confirmAction("Delete review", "Delete this review?", "Delete")) m.mutate(r.id); }} /></View>
        </Card>
      )} />
  );
}
