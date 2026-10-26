import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { categoryLabel } from "@/lib/categories";
import { confirmAction } from "@/lib/confirm";
import { getAdminListings, setListingApproval, deleteListing, type AdminListing } from "@/lib/admin";

export default function AdminListings() {
  const qc = useQueryClient();
  const [pendingOnly, setPendingOnly] = useState(false);
  const q = useQuery({ queryKey: ["admin", "listings"], queryFn: getAdminListings });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin", "listings"] }); qc.invalidateQueries({ queryKey: ["admin", "dashboard"] }); };
  const onError = (e: Error) => Alert.alert("Action failed", e.message);
  const approve = useMutation({ mutationFn: (v: { id: string; approved: boolean }) => setListingApproval(v.id, v.approved), onSuccess: refresh, onError });
  const remove = useMutation({ mutationFn: (id: string) => deleteListing(id), onSuccess: refresh, onError });
  const rows = (q.data ?? []).filter((l) => !pendingOnly || !l.is_approved);

  return (
    <ListScreen<AdminListing>
      data={rows} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching}
      emptyTitle={pendingOnly ? "Nothing awaiting approval" : "No listings"}
      header={
        <View className="flex-row mb-3">
          {[["All", false], ["Pending approval", true]].map(([label, v]) => (
            <Pressable key={String(label)} onPress={() => setPendingOnly(v as boolean)} className={`px-3.5 py-2 rounded-full mr-2 ${pendingOnly === v ? "bg-navy" : "bg-white border border-lightgrey"}`}>
              <Text className={`text-sm font-medium ${pendingOnly === v ? "text-white" : "text-navy"}`}>{label as string}</Text>
            </Pressable>
          ))}
        </View>
      }
      renderItem={(l) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-navy font-semibold flex-1 mr-2" numberOfLines={1}>{l.name}</Text>
            <Badge label={l.is_approved ? "Approved" : "Pending"} tone={l.is_approved ? "success" : "orange"} />
          </View>
          <Text className="text-slate text-sm mt-1">{categoryLabel(l.category)} · {l.city} · {l.status}</Text>
          <View className="flex-row mt-3">
            <View className="mr-2"><Button small label={l.is_approved ? "Unapprove" : "Approve"} variant={l.is_approved ? "outline" : "primary"} onPress={() => approve.mutate({ id: l.id, approved: !l.is_approved })} /></View>
            <Button small label="Delete" variant="destructive" onPress={async () => { if (await confirmAction("Delete listing", `Permanently delete "${l.name}"?`, "Delete")) remove.mutate(l.id); }} />
          </View>
        </Card>
      )}
    />
  );
}
