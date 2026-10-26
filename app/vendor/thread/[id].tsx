import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getVendorMessages, markThreadRead, vendorReply, type MessageRow } from "@/lib/vendor";

const MAX = 500;

export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth(); const qc = useQueryClient();
  const [text, setText] = useState("");
  const list = useRef<FlatList<MessageRow>>(null);
  const q = useQuery({ queryKey: ["vendor", "thread", user?.id, id], queryFn: async () => (await getVendorMessages(user!.id)).filter((m) => m.thread_id === id), enabled: !!user && !!id, refetchInterval: 10000 });
  const hasUnread = (q.data ?? []).some((m) => m.sender_type === "user" && !m.vendor_read);

  useEffect(() => {
    if (user && id && hasUnread) markThreadRead(user.id, id).then(() => qc.invalidateQueries({ queryKey: ["vendor"] }));
  }, [user, id, hasUnread, qc]);

  const send = useMutation({
    mutationFn: () => vendorReply(user!.id, id!, text),
    onSuccess: () => { setText(""); qc.invalidateQueries({ queryKey: ["vendor"] }); },
    onError: (e: Error) => Alert.alert("Could not send", e.message),
  });
  const who = (q.data ?? []).find((m) => m.user_name)?.user_name ?? "Customer";

  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["bottom"]}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <FlatList
          ref={list} data={q.data ?? []} keyExtractor={(m) => m.id} contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={<Text className="text-slate text-xs text-center mb-3">Conversation with {who}</Text>}
          renderItem={({ item }) => {
            const mine = item.sender_type === "vendor";
            return (
              <View className={`mb-2 max-w-[80%] rounded-2xl px-3.5 py-2.5 ${mine ? "self-end bg-navy" : "self-start bg-white border border-lightgrey"}`}>
                <Text className={mine ? "text-white" : "text-navy"}>{item.body}</Text>
              </View>
            );
          }}
        />
        <View className="px-4 pt-2 pb-2 border-t border-lightgrey bg-white">
          <TextInput value={text} onChangeText={(t) => setText(t.slice(0, MAX))} multiline placeholder="Write a reply…" placeholderTextColor="#60707F" className="border border-lightgrey rounded-xl px-4 py-3 text-navy max-h-28" />
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-slate text-xs">{MAX - text.length} characters left</Text>
            <Button small label="Send" onPress={() => send.mutate()} loading={send.isPending} disabled={!text.trim()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
