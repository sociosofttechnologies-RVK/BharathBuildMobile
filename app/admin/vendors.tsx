import React from "react";
import { View, Text, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { confirmAction } from "@/lib/confirm";
import { getProfiles, patchProfile, type AdminProfile } from "@/lib/admin";

export default function AdminVendors() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "profiles", "vendor"], queryFn: () => getProfiles("vendor") });
  const m = useMutation({
    mutationFn: (v: { id: string; patch: { is_approved?: boolean; is_blocked?: boolean } }) => patchProfile(v.id, v.patch),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin"] }); },
    onError: (e: Error) => Alert.alert("Action failed", e.message),
  });
  return (
    <ListScreen<AdminProfile> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No vendors yet"
      renderItem={(p) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-navy font-semibold flex-1 mr-2" numberOfLines={1}>{p.full_name}</Text>
            <Badge label={p.is_blocked ? "Suspended" : p.is_approved ? "Approved" : "Pending"} tone={p.is_blocked ? "danger" : p.is_approved ? "success" : "orange"} />
          </View>
          {p.phone ? <Text className="text-slate text-sm mt-1">{p.phone}</Text> : null}
          <View className="flex-row mt-3">
            <View className="mr-2"><Button small label={p.is_approved ? "Revoke approval" : "Approve"} variant={p.is_approved ? "outline" : "primary"} onPress={() => m.mutate({ id: p.id, patch: { is_approved: !p.is_approved } })} /></View>
            <Button small label={p.is_blocked ? "Reinstate" : "Suspend"} variant={p.is_blocked ? "outline" : "destructive"}
              onPress={async () => { if (p.is_blocked || (await confirmAction("Suspend vendor", `Suspend ${p.full_name}?`, "Suspend"))) m.mutate({ id: p.id, patch: { is_blocked: !p.is_blocked } }); }} />
          </View>
        </Card>
      )} />
  );
}
