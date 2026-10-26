import React from "react";
import { View, ScrollView, ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export function ScreenContainer({ children, scroll = true, ...rest }: { children: React.ReactNode; scroll?: boolean } & ScrollViewProps) {
  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["bottom"]}>
      {scroll ? <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }} {...rest}>{children}</ScrollView> : <View className="flex-1 px-4">{children}</View>}
    </SafeAreaView>
  );
}
