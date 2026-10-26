import React from "react";
import { View, Text } from "react-native";
export type Tone = "navy" | "orange" | "success" | "muted" | "danger";
const T: Record<Tone, string> = { navy: "bg-navy", orange: "bg-orange", success: "bg-success", muted: "bg-slate", danger: "bg-destructive" };
export function Badge({ label, tone = "navy" }: { label: string; tone?: Tone }) {
  return <View className={`${T[tone]} rounded-full px-2.5 py-1 self-start`}><Text className="text-white text-xs font-medium">{label}</Text></View>;
}
