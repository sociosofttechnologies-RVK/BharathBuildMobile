import React from "react";
import { Pressable, Text, ActivityIndicator, PressableProps } from "react-native";
type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
const V: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: "bg-navy", text: "text-white" },
  secondary: { bg: "bg-orange", text: "text-white" },
  outline: { bg: "bg-transparent border border-navy", text: "text-navy" },
  ghost: { bg: "bg-transparent", text: "text-navy" },
  destructive: { bg: "bg-destructive", text: "text-white" },
};
type Props = PressableProps & { label: string; variant?: Variant; loading?: boolean; fullWidth?: boolean; small?: boolean };
export function Button({ label, variant = "primary", loading, fullWidth, small, disabled, ...rest }: Props) {
  const v = V[variant];
  return (
    <Pressable
      disabled={disabled || loading}
      className={`${v.bg} ${fullWidth ? "w-full" : ""} rounded-xl ${small ? "px-3 py-2" : "px-5 py-3.5"} items-center justify-center flex-row ${disabled || loading ? "opacity-50" : "active:opacity-80"}`}
      {...rest}
    >
      {loading ? <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#0D2B45" : "#fff"} /> : <Text className={`${v.text} font-semibold ${small ? "text-sm" : "text-base"}`}>{label}</Text>}
    </Pressable>
  );
}
