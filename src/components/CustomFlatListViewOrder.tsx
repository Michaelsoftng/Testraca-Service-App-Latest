import React from "react";
import { Text, View } from "react-native";

type Props = {
  message?: string;
};

export default function CustomFlatListViewOrder({ message = "Order list view unavailable" }: Props) {
  return (
    <View className="p-4">
      <Text className="text-slate-500 text-sm">{message}</Text>
    </View>
  );
}
