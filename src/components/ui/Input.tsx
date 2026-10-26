import React from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";
export function Input({ label, error, ...rest }: TextInputProps & { label?: string; error?: string }) {
  return (
    <View className="mb-4">
      {label && <Text className="text-navy font-medium mb-1.5">{label}</Text>}
      <TextInput placeholderTextColor="#60707F" className={`border rounded-xl px-4 py-3 text-base text-navy bg-white ${error ? "border-destructive" : "border-lightgrey"}`} {...rest} />
      {error && <Text className="text-destructive text-xs mt-1">{error}</Text>}
    </View>
  );
}
