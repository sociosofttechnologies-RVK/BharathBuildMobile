import React from "react";
import { View, ViewProps } from "react-native";
export function Card({ children, className, ...rest }: ViewProps & { children: React.ReactNode }) {
  return (
    <View className={`bg-white rounded-2xl border border-lightgrey p-4 ${className ?? ""}`} style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }} {...rest}>
      {children}
    </View>
  );
}
