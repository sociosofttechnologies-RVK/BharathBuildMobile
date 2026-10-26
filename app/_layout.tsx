import "react-native-reanimated";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, Text, ScrollView } from "react-native";
import { AuthProvider } from "@/context/AuthContext";
import { supabaseConfigError } from "@/lib/supabase";

// expo-router renders this instead of closing the app when a screen throws.
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FB", padding: 24, justifyContent: "center" }}>
      <Text style={{ color: "#0D2B45", fontSize: 20, fontWeight: "700", marginBottom: 8 }}>Something went wrong</Text>
      <ScrollView style={{ maxHeight: 260 }}><Text selectable style={{ color: "#DC2626" }}>{String(error?.message ?? error)}</Text></ScrollView>
      <Text onPress={retry} style={{ color: "#F97316", fontWeight: "600", marginTop: 16 }}>Try again</Text>
    </View>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  if (supabaseConfigError) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8F9FB", padding: 24, justifyContent: "center" }}>
        <Text style={{ color: "#0D2B45", fontSize: 20, fontWeight: "700", marginBottom: 8 }}>App not configured</Text>
        <Text style={{ color: "#60707F" }}>{supabaseConfigError}</Text>
      </View>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(public)" />
          <Stack.Screen name="listings/[id]" />
          <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
          <Stack.Screen name="vendor" />
          <Stack.Screen name="admin" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
