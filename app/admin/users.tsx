import React from "react";
import { View, Text, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { confirmAction } from "@/lib/confirm";
import { getProfiles, patchProfile, type AdminProfile } from "@/lib/admin";

// Shows name/phone only: email addresses live in auth.users and need the service-role key.
export default function AdminUsers() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "profiles", "all"], queryFn: () => getProfiles() });
  const m = useMutation({
    mutationFn: (v: { id: string; blocked: boolean }) => patchProfile(v.id, { is_blocked: v.blocked }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
    onError: (e: Error) => Alert.alert("Action failed", e.message),
  });
  return (
    <ListScreen<AdminProfile> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No users"
      renderItem={(p) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-navy font-semibold flex-1 mr-2" numberOfLines={1}>{p.full_name}</Text>
            <View className="flex-row">
              <Badge label={p.account_type} tone="navy" />
              {p.is_blocked && <View className="ml-1.5"><Badge label="Blocked" tone="danger" /></View>}
            </View>
          </View>
          {p.phone ? <Text className="text-slate text-sm mt-1">{p.phone}</Text> : null}
          <View className="flex-row mt-3">
            <Button small label={p.is_blocked ? "Unblock" : "Block"} variant={p.is_blocked ? "outline" : "destructive"}
              onPress={async () => { if (p.is_blocked || (await confirmAction("Block user", `Block ${p.full_name}?`, "Block"))) m.mutate({ id: p.id, blocked: !p.is_blocked }); }} />
          </View>
        </Card>
      )} />
  );
}
