import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { URL_LINK } from "../../config";
import { DISPATCH_ACCETED_RESQUEST } from "../schema/ApiSchema";
import useAuth from "../schema/UseAuth";

type RouteCard = {
  id: string;
  title: string;
  facility: string;
  samples: number;
  distanceKm: number;
  earning: number;
  status: string;
  startedAt?: string | null;
};

const DEMO_ROUTES: RouteCard[] = [
  {
    id: "64009c47",
    title: "Route A",
    facility: "Gilead Diagnostics",
    samples: 5,
    distanceKm: 8.76,
    earning: 758,
    status: "In transit",
    startedAt: "09:45 AM",
  },
  {
    id: "6a101b58",
    title: "Route B",
    facility: "Gomed Diagnostics",
    samples: 3,
    distanceKm: 4.2,
    earning: 530,
    status: "Awaiting drop",
    startedAt: "10:05 AM",
  },
  {
    id: "81ac2171",
    title: "Route C",
    facility: "Blue Peak Lab",
    samples: 2,
    distanceKm: 3.1,
    earning: 475,
    status: "Accepted",
    startedAt: "10:24 AM",
  },
];

export default function RiderLogisticsListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth(navigation);

  const filter = route?.params?.filter === "queue" ? "queue" : "accepted";
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteCard[]>([]);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const fetchRoutes = async () => {
    if (!token) {
      setRoutes(DEMO_ROUTES);
      setUsingDemoData(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const acceptedRes = await axios.post(
        URL_LINK,
        { query: DISPATCH_ACCETED_RESQUEST },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const acceptedData = acceptedRes?.data?.data?.myAcceptedRequests ?? [];
      const mapped: RouteCard[] = acceptedData.map((item: any, idx: number) => {
        const sampleCount = Number(item?.numberOfSamples || 0);
        const distanceKm = Number(item?.facilityDistances?.[0] || 0) || Number((sampleCount * 1.2).toFixed(2));
        const earning = Number(item?.dispatcherEarning || 0) || Math.round(distanceKm * 50 + 320);

        return {
          id: item?.id || `route-${idx + 1}`,
          title: `Route ${idx + 1}`,
          facility: item?.dropoffLocation?.name || "Assigned facility",
          samples: sampleCount,
          distanceKm,
          earning,
          status: String(item?.requestStatus || "Accepted").replaceAll("_", " "),
          startedAt: item?.droppedAtLocationAt,
        };
      });

      setRoutes(mapped.length ? mapped : DEMO_ROUTES);
      setUsingDemoData(mapped.length === 0);
    } catch (error) {
      console.error("Failed to fetch route cards", error);
      setRoutes(DEMO_ROUTES);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [token]);

  const routeCards = useMemo(() => {
    if (filter === "queue") {
      return routes.slice(0, Math.max(1, Math.ceil(routes.length / 2)));
    }
    return routes;
  }, [routes, filter]);

  return (
    <View className="flex-1 bg-[#F5F7F9]">
      <View className="bg-[#0F172A] pt-12 pb-6 px-5 rounded-b-[28px]">
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={16} color="#94A3B8" />
          <Text className="text-slate-400 ml-1 text-sm">Logistics</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Route Management</Text>
        <Text className="text-slate-400 text-sm mt-1">
          Tap any route card to open full delivery details.
        </Text>
      </View>

      {usingDemoData ? (
        <View className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <Text className="text-amber-700 text-xs font-semibold">
            Demo mode: showing sample routes until live data is available.
          </Text>
        </View>
      ) : null}

      <ScrollView className="px-5 py-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[#101828] font-bold uppercase tracking-wider text-xs">
            {filter === "queue" ? "Awaiting pickup routes" : "Accepted deliveries"}
          </Text>
          <TouchableOpacity onPress={fetchRoutes}>
            <Text className="text-emerald-600 font-bold text-xs">Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="items-center py-14">
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : routeCards.length === 0 ? (
          <View className="bg-white rounded-2xl border border-slate-100 p-5">
            <Text className="text-slate-500">No routes available yet.</Text>
          </View>
        ) : (
          routeCards.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 mb-4"
              onPress={() =>
                navigation.navigate("delivery_complete_screen", {
                  location: {
                    id: item.id,
                    name: item.facility,
                    address: "Route-managed facility",
                    samplesCount: item.samples,
                  },
                  startTime: item.startedAt || "09:45 AM",
                })
              }
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-slate-900 font-bold text-base">{item.title}</Text>
                <View className="bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Text className="text-emerald-700 text-[10px] font-bold">{item.status}</Text>
                </View>
              </View>

              <Text className="text-slate-700 text-sm mb-3">{item.facility}</Text>

              <View className="bg-slate-50 rounded-xl p-3">
                <DetailRow label="Sample details" value={`${item.samples} sample(s)`} />
                <DetailRow label="Lab facilities" value={item.facility} />
                <DetailRow label="Number of samples" value={String(item.samples)} />
                <DetailRow label="Dispatcher earnings" value={`₦${item.earning.toLocaleString()}`} isLast />
              </View>

              <View className="flex-row justify-between items-center mt-3">
                <Text className="text-xs text-slate-500">Distance: {item.distanceKm.toFixed(2)} km</Text>
                <Text className="text-emerald-600 font-bold text-xs">Open details →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

function DetailRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View className={`flex-row justify-between py-2 ${!isLast ? "border-b border-slate-200" : ""}`}>
      <Text className="text-slate-500 text-xs">{label}</Text>
      <Text className="text-slate-900 text-xs font-semibold">{value}</Text>
    </View>
  );
}
