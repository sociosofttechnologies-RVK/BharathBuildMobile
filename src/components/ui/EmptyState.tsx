import React from "react";
import { View, Text } from "react-native";
export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-navy font-semibold text-lg text-center">{title}</Text>
      {subtitle && <Text className="text-slate text-center mt-1">{subtitle}</Text>}
    </View>
  );
}
