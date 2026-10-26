import React from "react";
import { View, Text, Alert } from "react-native";
import { format } from "@/lib/format";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { confirmAction } from "@/lib/confirm";
import { getAdminLeads, deleteLead, type AdminLead } from "@/lib/admin";

export default function AdminLeads() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "leads"], queryFn: getAdminLeads });
  const m = useMutation({ mutationFn: deleteLead, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }), onError: (e: Error) => Alert.alert("Action failed", e.message) });
  return (
    <ListScreen<AdminLead> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No leads"
      renderItem={(l) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between"><Text className="text-navy font-semibold">{l.name}</Text><Badge label={l.status} tone="muted" /></View>
          <Text className="text-slate text-sm mt-1">{l.phone} · {format(l.created_at)}</Text>
          <Text className="text-navy mt-2">{l.requirement}</Text>
          <View className="flex-row mt-3"><Button small label="Delete" variant="destructive" onPress={async () => { if (await confirmAction("Delete lead", "Delete this lead?", "Delete")) m.mutate(l.id); }} /></View>
        </Card>
      )} />
  );
}
