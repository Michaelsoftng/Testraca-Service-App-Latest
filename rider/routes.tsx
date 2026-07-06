import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface RouteData {
  id: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  estimatedTime: string;
  samplesCount: number;
  status: "planned" | "in-progress" | "completed";
}

export default function RoutesScreen() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const routes: RouteData[] = [
    {
      id: "RT-001",
      startLocation: "Central Medical Lab, Abuja",
      endLocation: "National Hospital, Lagos",
      distance: "450 km",
      estimatedTime: "6 hours",
      samplesCount: 3,
      status: "planned",
    },
    {
      id: "RT-002",
      startLocation: "University Teaching Hospital, Ibadan",
      endLocation: "Federal Medical Centre, Kano",
      distance: "320 km",
      estimatedTime: "4.5 hours",
      samplesCount: 2,
      status: "in-progress",
    },
    {
      id: "RT-003",
      startLocation: "Lagos State University Teaching Hospital",
      endLocation: "Ahmadu Bello University Teaching Hospital, Zaria",
      distance: "580 km",
      estimatedTime: "7 hours",
      samplesCount: 4,
      status: "completed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "planned":
        return "Planned";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <View className="flex-1 flex-col py-8">
      {/* Header */}
      <View className="w-full bg-primary px-6 pb-6 pt-3 rounded-b-[40px] flex flex-col gap-5">
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row gap-2 items-center">
            <View className="h-11 w-11 rounded-full bg-secondary"></View>
            <View className="flex flex-col items-center">
              <Text className="text-xs text-[10px] font-medium text-white">
                Active Routes
              </Text>
              <Text className="text-xs font-semibold text-white">
                {routes.filter(r => r.status === "in-progress").length}
              </Text>
            </View>
          </View>
          <View className="flex flex-row gap-5 items-center">
            <MaterialIcons name="notifications" size={29} color="#fff" />
            <MaterialIcons name="account-circle" size={29} color="#fff" />
          </View>
        </View>

        <View className="flex flex-col gap-3">
          <Text className="text-2xl font-bold text-white">
            Route Management
          </Text>
          <Text className="text-sm font-semibold text-white">
            Plan and track sample delivery routes
          </Text>
        </View>
      </View>

      {/* Routes List */}
      <View className="flex-1 flex flex-col gap-7 px-6 py-7">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-secondary">
            Delivery Routes
          </Text>
          <TouchableOpacity className="bg-primary py-2 px-4 rounded-md">
            <Text className="text-white text-sm font-semibold">
              New Route
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {routes.map((route, index) => (
            <View
              key={index}
              className="p-4 rounded-xl bg-white border border-gray-300 w-full flex flex-col gap-3 mb-4 shadow-sm"
            >
              {/* Route Header */}
              <View className="flex flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-semibold text-secondary">
                    Route {route.id}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {route.samplesCount} samples
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(route.status)}`}
                >
                  <Text className="text-white text-xs font-semibold">
                    {getStatusText(route.status)}
                  </Text>
                </View>
              </View>

              {/* Route Details */}
              <View className="flex flex-col gap-2">
                <View className="flex flex-row items-center gap-2">
                  <MaterialIcons name="my-location" size={16} color="#08AC85" />
                  <Text className="text-sm font-medium text-gray-600">
                    From: {route.startLocation}
                  </Text>
                </View>
                
                <View className="flex flex-row items-center gap-2">
                  <MaterialIcons name="place" size={16} color="#08AC85" />
                  <Text className="text-sm font-medium text-gray-600">
                    To: {route.endLocation}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2">
                  <MaterialIcons name="straighten" size={16} color="#08AC85" />
                  <Text className="text-sm font-medium text-gray-600">
                    Distance: {route.distance}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2">
                  <MaterialIcons name="schedule" size={16} color="#08AC85" />
                  <Text className="text-sm font-medium text-gray-600">
                    ETA: {route.estimatedTime}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex flex-row gap-2 mt-2">
                {route.status === "planned" && (
                  <TouchableOpacity
                    className="flex-1 bg-primary py-2 px-4 rounded-md"
                  >
                    <Text className="text-white text-sm font-semibold text-center">
                      Start Route
                    </Text>
                  </TouchableOpacity>
                )}
                {route.status === "in-progress" && (
                  <TouchableOpacity
                    className="flex-1 bg-green-500 py-2 px-4 rounded-md"
                  >
                    <Text className="text-white text-sm font-semibold text-center">
                      Complete Route
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  className="flex-1 border border-primary py-2 px-4 rounded-md"
                >
                  <Text className="text-primary text-sm font-semibold text-center">
                    View Map
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

