import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

function Row({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between py-3.5 border-b border-lightgrey">
      <Text className="text-navy font-medium">{label}</Text><ChevronRight size={18} color="#60707F" />
    </Pressable>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { session, user, isAdmin, isVendor, signOut, loading } = useAuth();
  if (loading) return null;
  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["top"]}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        {!session ? (
          <View className="pt-16 items-center px-6">
            <Text className="text-navy font-bold text-2xl mb-2 text-center">Sign in to BharathBuild</Text>
            <Text className="text-slate text-center mb-8">Manage your listings, leads, and messages from one place.</Text>
            <Button label="Sign In" onPress={() => router.push("/(auth)/login")} fullWidth />
            <View className="h-3" />
            <Button label="Create Account" variant="outline" onPress={() => router.push("/(auth)/signup")} fullWidth />
          </View>
        ) : (
          <>
            <Text className="text-navy font-bold text-2xl mt-4 mb-1">Account</Text>
            <Text className="text-slate mb-6">{user?.email}</Text>
            <Card className="mb-4">
              {isVendor && <Row label="Vendor Dashboard" onPress={() => router.push("/vendor")} />}
              {isAdmin && <Row label="Admin Dashboard" onPress={() => router.push("/admin")} />}
              <Row label="Account Settings" onPress={() => router.push("/(public)/account-settings")} />
            </Card>
            <Button label="Sign Out" variant="outline" onPress={() => signOut()} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
