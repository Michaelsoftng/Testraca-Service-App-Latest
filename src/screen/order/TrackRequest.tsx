import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type TrackRequestProps = {
  route: any;
};

// Custom inline text icons to avoid pulling in extra icon fonts on this screen
const ArrowLeftIcon = () => (
  <Text className="text-teal-800 text-lg font-bold">←</Text>
);

const RefreshIcon = () => (
  <Text className="text-teal-800 text-base">🔄</Text>
);

const MapPinIcon = ({ colorClass = "text-teal-800" }: { colorClass?: string }) => (
  <Text className={`${colorClass} text-base`}>📍</Text>
);

const CheckCircleIcon = () => (
  <Text className="text-emerald-600 text-sm">✓</Text>
);

const TrackRequest = ({ route }: TrackRequestProps) => {
  const navigation = useNavigation<any>();

  const parsedFromString = useMemo(() => {
    try {
      if (!route?.params?.requestData) return null;
      const data = JSON.parse(route.params.requestData);
      return Array.isArray(data) ? data[0] : data;
    } catch {
      return null;
    }
  }, [route?.params?.requestData]);

  const request =
    route?.params?.itemData ||
    route?.params?.itemTestData ||
    parsedFromString ||
    null;


    console.log("Parsed request data:", parsedFromString);
 console.log("Parsed request data::::: ", parsedFromString.testRequests.test); 



  const progress = [
    { id: 1, title: "Payment pending", sub: "Waiting for payment" },
    { id: 2, title: "Payment confirmed", sub: "Payment received successfully" },
    { id: 3, title: "Request placed", sub: "Your request was placed successfully" },
    { id: 4, title: "Request accepted", sub: "Medical facility accepted your request" },
    { id: 5, title: "Sample collected", sub: "Your sample has been collected" },
    { id: 6, title: "Dropped at location", sub: "Sample dropped at collection point" },
    { id: 7, title: "Dispatcher assigned", sub: "Dispatcher assigned for pickup" },
    { id: 8, title: "In transit to lab", sub: "Sample in transit to laboratory" },
    { id: 9, title: "Sample received", sub: "Medical facility received the sample" },
    { id: 10, title: "Testing ongoing", sub: "Tests are being performed" },
    { id: 11, title: "Request completed", sub: "Results are ready and sent" },
  ];

  const statusToStepMap: Record<string, number> = {
    UNPAID: 1,
    PAID: 2,
    REQUEST_PLACED: 3,
    REQUEST_ACCEPTED: 4,
    SAMPLE_COLLECTED: 5,
    DROPPED_AT_LOCATION: 6,
    DISPATCHER_ASSIGNED: 7,
    IN_TRANSIT_TO_LAB: 8,
    SAMPLE_RECEIVED: 9,
    TESTING_ONGOING: 10,
    REQUEST_COMPLETED: 11,
  };

  const normalizedStatus =
    request?.requestStatus === "REQUEST_PLACED" &&
    String(request?.isPaid || "").toLowerCase() === "paid"
      ? "PAID"
      : request?.requestStatus;

  const currentStep = normalizedStatus
    ? statusToStepMap[normalizedStatus] ?? 1
    : 1;

  const getIndicatorStatus = (stepId: number) => {
    if (normalizedStatus === "REQUEST_COMPLETED") return "done";
    if (stepId < currentStep) return "done";
    if (stepId === currentStep) return "ongoing";
    return "pending";
  };

  const uniqueTests = useMemo(() => {
    if (!Array.isArray(request?.tests)) return [];
    return Array.from(
      new Set(
        (request.tests as Array<any>)
          .map((t: any) => t?.name)
          .filter(
            (name): name is string =>
              typeof name === "string" && name.length > 0
          )
      )
    );
  }, [request?.tests]);

  const testCount: number = request?.testRequestCount ?? uniqueTests.length;

  if (!request) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500 text-base">No request data available</Text>
      </SafeAreaView>
    );
  }

  const orderId = `#${String(request?.id || "").split("-")?.[4] || "N/A"}`;
  const requestedOn = request?.requestDate
    ? new Date(request.requestDate).toLocaleDateString()
    : "N/A";
  const specimenLabel =
    uniqueTests.length > 0
      ? uniqueTests.join(", ")
      : `${testCount} test${testCount === 1 ? "" : "s"}`;
  const currentMilestone =
    progress.find((step) => getIndicatorStatus(step.id) === "ongoing") ??
    progress[progress.length - 1];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Upper Navigation Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <View>
            <Text className="text-xs font-mono text-gray-400 font-semibold">{orderId}</Text>
            <Text className="text-base font-bold text-slate-900">Track Sample Route</Text>
          </View>
        </View>
        <TouchableOpacity className="p-2 bg-slate-50 rounded-full border border-gray-100">
          <RefreshIcon />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Schematic map visualization with live status banner */}
        <View className="h-34 bg-slate-200 relative justify-end p-4">
          <View className="absolute inset-0 bg-teal-950 items-center justify-center">
            <Text className="text-teal-600/40 font-mono text-xs tracking-widest uppercase">
              {/* Live_Network_Map_Stream_Active */}
            </Text>
          </View>

          {/* Floating live status tag */}
          <View className="bg-white/95 rounded-2xl p-3 border border-gray-100 shadow-md flex-row items-center justify-between w-full">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 bg-teal-50 rounded-xl items-center justify-center mr-3">
                <MapPinIcon />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Current Status</Text>
                <Text className="font-bold text-slate-900 text-sm" numberOfLines={1}>{currentMilestone.title}</Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-teal-800 px-3 py-1.5 rounded-lg"
              onPress={() => navigation.navigate("help_support")}
            >
              <Text className="text-white font-bold text-xs">Get Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info split summary panel cards */}
        <View className="p-4 flex-row justify-between">
          <View className="w-[48%] bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Requested On</Text>
            <Text className="text-xl font-black text-slate-900 mt-1">{requestedOn}</Text>
          </View>
          <View className="w-[48%] bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specimen Details</Text>
            <Text className="text-sm font-bold text-teal-700 mt-1.5" numberOfLines={1}>🩸 {specimenLabel}</Text>
          </View>
        </View>

        {/* Route milestones pipeline */}
        <View className="mx-4 mb-8 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <Text className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">Route Milestones</Text>

          {progress.map((step, idx) => {
            const indicatorStatus = getIndicatorStatus(step.id);
            const isCompleted = indicatorStatus === "done";
            const isCurrent = indicatorStatus === "ongoing";
            const isLastItem = idx === progress.length - 1;

            return (
              <View key={step.id} className="flex-row relative">
                <View className="items-center mr-4 w-5">
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center border-2 z-10 bg-white
                      ${isCompleted ? "border-emerald-600" : isCurrent ? "border-teal-700 bg-teal-50" : "border-gray-300"}`}
                  >
                    {isCompleted ? <CheckCircleIcon /> : isCurrent ? <View className="w-2 h-2 rounded-full bg-teal-700" /> : null}
                  </View>
                  {!isLastItem && (
                    <View
                      className={`w-[2px] absolute top-5 bottom-0 -z-10
                        ${isCompleted ? "bg-emerald-600" : "bg-gray-200"}`}
                    />
                  )}
                </View>

                <View className="flex-1 pb-6">
                  <Text className={`font-bold text-sm ${isCurrent ? "text-teal-900 text-base" : isCompleted ? "text-slate-800" : "text-gray-400"}`}>
                    {step.title}
                  </Text>
                  <Text className={`text-xs mt-1 leading-relaxed ${isCurrent ? "text-slate-700 font-medium" : "text-gray-400"}`}>
                    {step.sub}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackRequest;
