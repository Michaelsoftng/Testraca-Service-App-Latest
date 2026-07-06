import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function RiderLogisticsSummaryScreen() {
  const summary = {
    today: 12,
    tomorrow: 7,
    emergency: 3,
  };

  const Card = ({
    title,
    count,
    color,
    onPress,
  }: {
    title: string;
    count: number;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 p-4 rounded-xl border border-gray-300 bg-white items-start justify-between`}
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 }}
    >
      <Text className="text-sm font-medium text-[#8C93A3]">{title}</Text>
      <Text className={`text-3xl font-bold ${color}`}>{count}</Text>
      <View className="flex-row items-center gap-2 mt-2">
        <Text className="text-sm font-semibold text-primary">View</Text>
        <MaterialIcons name="arrow-forward-ios" size={16} color="#08AC85" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 flex-col py-8">
      <View className="w-full bg-primary px-6 pb-6 pt-3 rounded-b-[40px] flex flex-col gap-5">
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row gap-2 items-center">
            <View className="h-11 w-11 rounded-full bg-secondary"></View>
            <View className="flex flex-col items-center">
              <Text className="text-xs text-[10px] font-medium text-white">Rider ID</Text>
              <Text className="text-xs font-semibold text-white">RDR-001</Text>
            </View>
          </View>
          <View className="flex flex-row gap-5 items-center">
            <MaterialIcons name="notifications" size={29} color="#fff" />
            <MaterialIcons name="account-circle" size={29} color="#fff" />
          </View>
        </View>

        <View className="flex flex-col gap-1">
          <Text className="text-2xl font-bold text-white">Logistics</Text>
          <Text className="text-sm font-semibold text-white">Summary of dispatches</Text>
        </View>
      </View>

      <View className="flex-1 px-6 py-7 gap-5">
        <View className="flex-row gap-3">
          <Card
            title="Dispatch Now (Today)"
            count={summary.today}
            color="text-secondary"
            onPress={() => router.push("/(logistics)/list?filter=today")}
          />
          <Card
            title="Tomorrow"
            count={summary.tomorrow}
            color="text-secondary"
            onPress={() => router.push("/(logistics)/list?filter=tomorrow")}
          />
        </View>

        <View>
          <TouchableOpacity
            onPress={() => router.push("/(logistics)/list?filter=emergency")}
            className="p-4 rounded-xl border border-gray-300 bg-white"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="warning" size={20} color="#C2410C" />
                <Text className="text-base font-semibold text-[#C2410C]">
                  Emergency (≤ 30 minutes)
                </Text>
              </View>
              <Text className="text-2xl font-bold text-[#C2410C]">{summary.emergency}</Text>
            </View>
            <Text className="text-xs font-medium text-[#8C93A3] mt-2">
              Samples that must be delivered within 30 minutes
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 gap-3">
          <Text className="text-sm font-semibold text-[#8C93A3]">Tips</Text>
          <View className="p-3 rounded-lg bg-[#EEEFF2]">
            <Text className="text-xs text-[#525C76]">
              Prioritize emergency first, then cluster drop-offs for efficiency.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
