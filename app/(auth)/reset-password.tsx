import React, { useState } from "react";
import { View, Text } from "react-native";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); const [error, setError] = useState<string | null>(null);
  async function handleReset() {
    setError(null); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }
  return (
    <ScreenContainer>
      <View className="pt-6">
        <Text className="text-navy font-bold text-2xl mb-1">Reset password</Text>
        <Text className="text-slate mb-6">We'll email you a link to reset your password.</Text>
        {sent ? <Text className="text-success">Check your inbox for a reset link.</Text> : (
          <>
            <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
            {error && <Text className="text-destructive mb-3">{error}</Text>}
            <Button label="Send Reset Link" onPress={handleReset} loading={loading} fullWidth />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
