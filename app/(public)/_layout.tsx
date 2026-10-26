import React from "react";
import { Tabs } from "expo-router";
import { Home, Search, User } from "lucide-react-native";

export default function PublicTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#0D2B45", tabBarInactiveTintColor: "#60707F", tabBarStyle: { borderTopColor: "#E6E9EE" } }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
      <Tabs.Screen name="account-settings" options={{ href: null }} />
    </Tabs>
  );
}
