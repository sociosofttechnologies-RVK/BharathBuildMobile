import React from "react";
import { View, Text } from "react-native";
import { Star } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { format } from "@/lib/format";
import { getVendorReviews, type VendorReview } from "@/lib/vendor";

export default function VendorReviews() {
  const { user } = useAuth();
  const q = useQuery({ queryKey: ["vendor", "reviews", user?.id], queryFn: () => getVendorReviews(user!.id), enabled: !!user });
  return (
    <ListScreen<VendorReview> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No reviews yet"
      renderItem={(r) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between"><Text className="text-navy font-semibold">{r.customer_name}</Text><View className="flex-row items-center"><Star size={14} color="#F97316" fill="#F97316" /><Text className="text-navy text-sm ml-1">{r.rating}</Text></View></View>
          <Text className="text-slate text-xs mt-0.5">{format(r.created_at)}</Text>
          <Text className="text-navy mt-2">{r.body}</Text>
        </Card>
      )} />
  );
}
