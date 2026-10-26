import React from "react";
import { Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { format } from "@/lib/format";
import { getSubscription } from "@/lib/vendor";

// Read-only. Upgrading goes through the web checkout/payment flow, which isn't ported.
export default function VendorSubscription() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({ queryKey: ["vendor", "subscription", user?.id], queryFn: () => getSubscription(user!.id), enabled: !!user });
  return (
    <ScreenContainer>
      <Card className="mt-4">
        {isLoading ? <Text className="text-slate">Loading…</Text> : error ? <Text className="text-destructive">{(error as Error).message}</Text> : (
          <>
            <Text className="text-slate text-xs">Current plan</Text>
            <Text className="text-navy font-bold text-2xl mt-1 capitalize">{data?.plan ?? "free"}</Text>
            <Text className="mt-2"><Badge label={data?.status ?? "active"} tone={(data?.status ?? "active") === "active" ? "success" : "muted"} /></Text>
            {data?.started_at && <Text className="text-slate text-sm mt-3">Started {format(data.started_at)}</Text>}
            {data?.expires_at && <Text className="text-slate text-sm">Expires {format(data.expires_at)}</Text>}
          </>
        )}
      </Card>
      <Text className="text-slate text-sm mt-4">To upgrade or change your plan, use the BharathBuild website.</Text>
    </ScreenContainer>
  );
}
