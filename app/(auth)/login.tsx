import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter, Link } from "expo-router";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return setError(error.message);
    router.replace("/(public)/account");
  }
  return (
    <ScreenContainer>
      <View className="pt-6">
        <Text className="text-navy font-bold text-2xl mb-1">Welcome back</Text>
        <Text className="text-slate mb-6">Sign in to manage your account</Text>
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
        {error && <Text className="text-destructive mb-3">{error}</Text>}
        <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth />
        <Link href="/(auth)/reset-password" className="text-navy text-center mt-4 font-medium">Forgot password?</Link>
        <View className="flex-row justify-center mt-6"><Text className="text-slate">Don't have an account? </Text><Link href="/(auth)/signup" className="text-orange font-medium">Create one</Link></View>
      </View>
    </ScreenContainer>
  );
}
