import React from "react";
import { View, Text, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Badge, Tone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { categoryLabel } from "@/lib/categories";
import { confirmAction } from "@/lib/confirm";
import { getVendorListings, setListingStatus, deleteVendorListing, type VendorListing } from "@/lib/vendor";

const TONE: Record<string, Tone> = { active: "success", paused: "orange", draft: "muted" };

export default function VendorListings() {
  const { user } = useAuth(); const qc = useQueryClient();
  const key = ["vendor", "listings", user?.id];
  const q = useQuery({ queryKey: key, queryFn: () => getVendorListings(user!.id), enabled: !!user });
  const onError = (e: Error) => Alert.alert("Action failed", e.message);
  const status = useMutation({ mutationFn: (v: { id: string; s: "active" | "paused" }) => setListingStatus(v.id, v.s), onSuccess: () => qc.invalidateQueries({ queryKey: key }), onError });
  const remove = useMutation({ mutationFn: deleteVendorListing, onSuccess: () => qc.invalidateQueries({ queryKey: key }), onError });
  return (
    <ListScreen<VendorListing> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching}
      emptyTitle="No listings yet" emptySubtitle="Creating listings isn't in the mobile app yet — add them on the web for now."
      renderItem={(l) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-navy font-semibold flex-1 mr-2" numberOfLines={1}>{l.name}</Text>
            <Badge label={l.status} tone={TONE[l.status] ?? "muted"} />
          </View>
          <Text className="text-slate text-sm mt-1">{categoryLabel(l.category)} · {l.views ?? 0} views</Text>
          {!l.is_approved && <Text className="text-orange text-xs font-medium mt-1">Awaiting admin approval — not public yet</Text>}
          <View className="flex-row mt-3">
            <View className="mr-2"><Button small variant="outline" label={l.status === "active" ? "Pause" : "Activate"} onPress={() => status.mutate({ id: l.id, s: l.status === "active" ? "paused" : "active" })} /></View>
            <Button small variant="destructive" label="Delete" onPress={async () => { if (await confirmAction("Delete listing", `Permanently delete "${l.name}"?`, "Delete")) remove.mutate(l.id); }} />
          </View>
        </Card>
      )} />
  );
}
