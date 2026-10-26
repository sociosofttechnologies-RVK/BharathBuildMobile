import React from "react";
import { View, Text, Alert, Linking } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ListScreen } from "@/components/ui/ListScreen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { format } from "@/lib/format";
import { getVendorLeads, setLeadStatus, type VendorLead } from "@/lib/vendor";

// The web app only displays lead status; "contacted"/"closed" are free-text values this screen introduces
// (leads.status is a plain text column, default 'new').
export default function VendorLeads() {
  const { user } = useAuth(); const qc = useQueryClient();
  const key = ["vendor", "leads", user?.id];
  const q = useQuery({ queryKey: key, queryFn: () => getVendorLeads(user!.id), enabled: !!user });
  const m = useMutation({ mutationFn: (v: { id: string; s: string }) => setLeadStatus(v.id, v.s), onSuccess: () => qc.invalidateQueries({ queryKey: key }), onError: (e: Error) => Alert.alert("Action failed", e.message) });
  return (
    <ListScreen<VendorLead> data={q.data} isLoading={q.isLoading} error={q.error as Error | null} refetch={q.refetch} isRefetching={q.isRefetching} emptyTitle="No leads yet"
      renderItem={(l) => (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between"><Text className="text-navy font-semibold">{l.name}</Text><Badge label={l.status} tone={l.status === "new" ? "orange" : "muted"} /></View>
          <Text className="text-slate text-sm mt-1">{l.phone} · {format(l.created_at)}</Text>
          <Text className="text-navy mt-2">{l.requirement}</Text>
          <View className="flex-row mt-3">
            <View className="mr-2"><Button small label="Call" onPress={() => Linking.openURL(`tel:${l.phone}`)} /></View>
            {l.status !== "contacted" && l.status !== "closed" && <View className="mr-2"><Button small variant="outline" label="Mark contacted" onPress={() => m.mutate({ id: l.id, s: "contacted" })} /></View>}
            {l.status !== "closed" && <Button small variant="outline" label="Close" onPress={() => m.mutate({ id: l.id, s: "closed" })} />}
          </View>
        </Card>
      )} />
  );
}
