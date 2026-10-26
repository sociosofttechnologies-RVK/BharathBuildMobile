import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter, Link } from "expo-router";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState(""); const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const [done, setDone] = useState(false);

  async function handleSignup() {
    setError(null);
    if (!fullName.trim() || !email.trim() || password.length < 6) return setError("Enter your name, email and a password of at least 6 characters.");
    setLoading(true);
    // Same payload as the web app: new accounts start as "customer".
    const { error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim(), phone: phone.trim(), account_type: "customer" } } });
    setLoading(false);
    if (error) return setError(error.message);
    setDone(true);
  }
  if (done) {
    return (
      <ScreenContainer>
        <View className="pt-16 items-center px-4">
          <Text className="text-navy font-bold text-xl text-center mb-2">Account created!</Text>
          <Text className="text-slate text-center mb-6">Check your email to verify your account, then sign in.</Text>
          <Button label="Go to Sign In" onPress={() => router.replace("/(auth)/login")} fullWidth />
        </View>
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer>
      <View className="pt-6">
        <Text className="text-navy font-bold text-2xl mb-1">Create your account</Text>
        <Text className="text-slate mb-6">Join BharathBuild in seconds</Text>
        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91 ..." />
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
        {error && <Text className="text-destructive mb-3">{error}</Text>}
        <Button label="Create Account" onPress={handleSignup} loading={loading} fullWidth />
        <View className="flex-row justify-center mt-6"><Text className="text-slate">Already have an account? </Text><Link href="/(auth)/login" className="text-orange font-medium">Sign in</Link></View>
      </View>
    </ScreenContainer>
  );
}
