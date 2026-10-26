import React from "react";
import { View, Text, Linking, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star, MapPin, ShieldCheck } from "lucide-react-native";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListingCard } from "@/components/listings/ListingCard";
import { getListing } from "@/lib/listings";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({ queryKey: ["listing", id], queryFn: () => getListing(id!), enabled: !!id });

  if (isLoading || !data) {
    return (
      <SafeAreaView className="flex-1 bg-offwhite items-center justify-center">
        <Stack.Screen options={{ headerShown: true, title: "Listing" }} />
        {error ? <Text className="text-destructive px-6 text-center">{(error as Error).message}</Text> : <ActivityIndicator color="#0D2B45" />}
      </SafeAreaView>
    );
  }
  const { listing, similar } = data;
  const phone = listing.contactPhone ?? listing.phone;
  return (
    <SafeAreaView className="flex-1 bg-offwhite" edges={["bottom"]}>
      <Stack.Screen options={{ headerShown: true, title: listing.name, headerStyle: { backgroundColor: "#0D2B45" }, headerTintColor: "#fff" }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {listing.images[0] ? <Image source={{ uri: listing.images[0] }} style={{ width: "100%", height: 200, borderRadius: 16 }} contentFit="cover" /> : <View className="w-full h-[200px] rounded-2xl bg-lightgrey" />}
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-navy font-bold text-2xl flex-1">{listing.name}</Text>
          {listing.verified && <ShieldCheck size={22} color="#16A34A" />}
        </View>
        <Text className="text-slate mt-1">{listing.categoryLabel}</Text>
        <View className="flex-row items-center mt-2 flex-wrap">
          <Star size={16} color="#F97316" fill="#F97316" />
          <Text className="text-navy font-medium ml-1 mr-2">{listing.rating} ({listing.reviews} reviews)</Text>
          {listing.featured && <Badge label="Featured" tone="orange" />}
        </View>
        <View className="flex-row items-center mt-2"><MapPin size={15} color="#60707F" /><Text className="text-slate ml-1">{listing.location}</Text></View>
        <Text className="text-navy mt-4 leading-6">{listing.description}</Text>
        {listing.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-4">
            {listing.tags.map((t) => <View key={t} className="mr-2 mb-2"><Badge label={t} tone="muted" /></View>)}
          </View>
        )}
        <View className="flex-row mt-6">
          <View className="flex-1 mr-1.5"><Button label="Call Now" onPress={() => Linking.openURL(`tel:${phone}`)} /></View>
          {listing.contactEmail && <View className="flex-1 ml-1.5"><Button label="Email" variant="outline" onPress={() => Linking.openURL(`mailto:${listing.contactEmail}`)} /></View>}
        </View>
        {Object.keys(listing.attributes).length > 0 && (
          <View className="mt-6">
            <Text className="text-navy font-semibold text-lg mb-2">Details</Text>
            {Object.entries(listing.attributes).map(([k, v]) => (
              <View key={k} className="flex-row justify-between py-2 border-b border-lightgrey">
                <Text className="text-slate capitalize">{k.replace(/_/g, " ")}</Text><Text className="text-navy font-medium flex-1 text-right ml-4">{v}</Text>
              </View>
            ))}
          </View>
        )}
        {similar.length > 0 && (
          <View className="mt-6">
            <Text className="text-navy font-semibold text-lg mb-3">Similar Listings</Text>
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
