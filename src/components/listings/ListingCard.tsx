import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Star, MapPin, ShieldCheck } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Listing } from "@/lib/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/listings/${listing.id}`)} className="mb-3">
      <Card>
        <View className="flex-row">
          {listing.images[0] ? (
            <Image source={{ uri: listing.images[0] }} style={{ width: 84, height: 84, borderRadius: 12 }} contentFit="cover" />
          ) : (
            <View className="w-[84px] h-[84px] rounded-xl bg-lightgrey items-center justify-center"><Text className="text-slate text-xs">No image</Text></View>
          )}
          <View className="flex-1 ml-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-navy font-semibold text-base flex-1" numberOfLines={1}>{listing.name}</Text>
              {listing.verified && <ShieldCheck size={16} color="#16A34A" />}
            </View>
            <Text className="text-slate text-sm mt-0.5">{listing.categoryLabel}</Text>
            <View className="flex-row items-center mt-1"><MapPin size={13} color="#60707F" /><Text className="text-slate text-xs ml-1" numberOfLines={1}>{listing.location}</Text></View>
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center"><Star size={14} color="#F97316" fill="#F97316" /><Text className="text-navy text-xs font-medium ml-1">{listing.rating} ({listing.reviews})</Text></View>
              {listing.featured && <Badge label="Featured" tone="orange" />}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
