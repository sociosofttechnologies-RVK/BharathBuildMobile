import React, { useEffect, useState } from "react";
import { Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

// Reads/updates the signed-in user's own profile row (RLS: "Users can update their own profile").
export default function AccountSettingsScreen() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      setFullName(data?.full_name ?? ""); setPhone(data?.phone ?? "");
    });
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName.trim(), phone: phone.trim() }).eq("id", user.id);
    setSaving(false);
    Alert.alert(error ? "Could not save" : "Saved", error?.message ?? "Your profile was updated.");
  }

  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-navy font-bold text-2xl mb-4">Account Settings</Text>
        <Input label="Full Name" value={fullName} onChangeText={setFullName} />
        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Button label="Save Changes" onPress={save} loading={saving} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}
