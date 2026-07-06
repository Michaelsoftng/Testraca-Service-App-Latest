import React, { useMemo, useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AlertTriangle, CheckCircle2, ChevronLeft, Microscope, Navigation } from "lucide-react-native";
import axios from "axios";
import useAuth from "../../../schema/UseAuth";
import { URL_LINK } from "../../../../config";
import { SET_REQUEST_DELIVERY_MODE } from "../../../schema/ApiSchema";
import { useToast } from "../../../lib/utils/functions";
import BottomTabs from "../../../components/BottomTabs";

const toFiniteNumber = (value: any) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const firstPositiveNumber = (...values: any[]) => {
  for (const value of values) {
    const parsed = toFiniteNumber(value);
    if (parsed > 0) return parsed;
  }
  return 0;
};

const formatMoney = (value: number) =>
  `₦${toFiniteNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function StatBlock({
  label,
  value,
  valueColor = "text-black",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-1">
      <Text className="text-gray-400 text-xs font-bold mb-1 tracking-tighter uppercase">{label}</Text>
      <Text className={`${valueColor} text-lg font-bold`}>{value}</Text>
    </View>
  );
}

export default function DeliveryChoiceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth(navigation);
  const { showToast } = useToast();

  const itemData = route?.params?.itemData || {};

  const requestId = itemData?.id;

  const [selectedOption, setSelectedOption] = useState<"drop-off" | "lab">("drop-off");
  const [submitting, setSubmitting] = useState(false);

  const dropDistance = useMemo(
    () =>
      toFiniteNumber(itemData?.phlebotomistDetails?.dropOffDistanceKm) ||
      toFiniteNumber(itemData?.dropOffDistance),
    [itemData?.phlebotomistDetails?.dropOffDistanceKm, itemData?.dropOffDistance]
  );

  const serviceFee = useMemo(
    () =>
      firstPositiveNumber(
        itemData?.phlebotomistDetails?.serviceCharge,
        itemData?.serviceCharge
      ),
    [itemData?.phlebotomistDetails?.serviceCharge, itemData?.serviceCharge]
  );

  const logisticsDropOff = useMemo(() => {
    const fromApi = firstPositiveNumber(
      itemData?.distanceCharge,
      itemData?.phlebotomistDetails?.logisticsEstimate,
      itemData?.logisticsEstimate
    );
    if (fromApi > 0) return fromApi;
    return Number((dropDistance * 50).toFixed(2));
  }, [itemData?.distanceCharge, itemData?.phlebotomistDetails?.logisticsEstimate, itemData?.logisticsEstimate, dropDistance]);

  const logisticsDirect = useMemo(() => {
    // Direct-to-lab uses the same backend logistics estimate when mode-specific amount is not provided.
    const fromApi = firstPositiveNumber(
      itemData?.distanceCharge,
      itemData?.phlebotomistDetails?.logisticsEstimate,
      itemData?.logisticsEstimate
    );
    if (fromApi > 0) return fromApi;
    return Number((dropDistance * 50).toFixed(2));
  }, [itemData?.distanceCharge, itemData?.phlebotomistDetails?.logisticsEstimate, itemData?.logisticsEstimate, dropDistance]);

  const estimatedTotalEarning = useMemo(
    () =>
      firstPositiveNumber(
        itemData?.phlebotomistDetails?.potentialEarning,
        itemData?.phlebotomistEarning,
        serviceFee + (selectedOption === "drop-off" ? logisticsDropOff : logisticsDirect)
      ),
    [itemData?.phlebotomistDetails?.potentialEarning, itemData?.phlebotomistEarning, serviceFee, selectedOption, logisticsDropOff, logisticsDirect]
  );

  const onConfirm = async () => {
    if (!token || !requestId) {
      showToast("error", "Missing session", "Please login again and retry.");
      return;
    }

    if (selectedOption === "drop-off") {
      navigation.navigate("dropoff_location_screen", { itemData });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: SET_REQUEST_DELIVERY_MODE,
          variables: {
            requestId,
            deliveryMode: "DIRECT_TO_LAB",
            isTimeSensitive: true,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const gqlError = response?.data?.errors?.[0]?.message;
      if (gqlError) {
        throw new Error(gqlError);
      }

      showToast("success", "Delivery updated", "Request set to direct-to-lab.");
      navigation.navigate("accepted_request");
    } catch (error: any) {
      showToast(
        "error",
        "Update failed",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Could not update delivery mode."
      );
      console.error("Failed to set direct-to-lab mode:", error?.message || error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLogistics = selectedOption === "drop-off" ? logisticsDropOff : logisticsDirect;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-slate-50/60">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      <View className="bg-[#121212] pt-6 pb-10 px-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-gray-400 ml-4 text-lg">
            Accepted request · <Text className="text-gray-500">#{String(requestId || "").split("-")?.[4] || "N/A"}</Text>
          </Text>
        </View>

        <Text className="text-white text-3xl font-bold">How will you deliver?</Text>
        <Text className="text-gray-400 text-lg mt-1">Sample collected from {itemData?.patient?.firstName || itemData?.patientName || "patient"}</Text>
      </View>

      <View className="flex-1 px-4 -mt-6">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedOption("drop-off")}
          className={`bg-white rounded-3xl p-5 mb-4 border-2 ${selectedOption === "drop-off" ? "border-teal-600" : "border-transparent"}`}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center flex-1">
              <View className="bg-slate-100 p-4 rounded-2xl mr-4">
                <Navigation color="#0F172A" size={30} />
              </View>
              <View className="flex-1">
                <Text className="text-[#1A1A1A] text-xl font-bold leading-6">Drop off to dispatcher</Text>
                <Text className="text-gray-500 text-base">Hand sample to a dispatch rider</Text>
              </View>
            </View>
            {selectedOption === "drop-off" ? <CheckCircle2 color="#0D9488" size={28} fill="#0D9488" fillOpacity={0.1} /> : null}
          </View>

          <View className="flex-row border-t border-gray-100 pt-4 justify-between">
            <StatBlock label="DROP-OFF DIST." value={`${dropDistance.toFixed(2)} km`} />
            <StatBlock label="LOGISTICS PAY" value={formatMoney(logisticsDropOff)} valueColor="text-[#0D9488]" />
            <StatBlock label="SERVICE FEE" value={formatMoney(serviceFee)} valueColor="text-[#0D9488]" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedOption("lab")}
          className={`bg-white rounded-3xl p-5 mb-4 border-2 ${selectedOption === "lab" ? "border-teal-600" : "border-transparent"}`}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center flex-1">
              <View className="bg-gray-100 p-4 rounded-2xl mr-4">
                <Microscope color="#666" size={30} />
              </View>
              <View className="flex-1">
                <Text className="text-[#1A1A1A] text-xl font-bold leading-6">Take directly to lab</Text>
                <Text className="text-gray-500 text-base">Deliver sample to the lab yourself</Text>
              </View>
            </View>
            {selectedOption === "lab" ? <CheckCircle2 color="#0D9488" size={28} fill="#0D9488" fillOpacity={0.1} /> : <View className="w-7 h-7 rounded-full border-2 border-gray-200" />}
          </View>

          <View className="flex-row border-t border-gray-100 pt-4 justify-between">
            <StatBlock label="LAB DISTANCE" value={`${dropDistance.toFixed(2)} km`} />
            <StatBlock label="LOGISTICS PAY" value={formatMoney(logisticsDirect)} valueColor="text-[#0D9488]" />
            <StatBlock label="SERVICE FEE" value={formatMoney(serviceFee)} valueColor="text-[#0D9488]" />
          </View>
        </TouchableOpacity>

        <View className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-teal-900 text-lg font-bold">Total earning</Text>
            <Text className="text-teal-900 opacity-80">Service {formatMoney(serviceFee)} + logistics {formatMoney(selectedLogistics)}</Text>
          </View>
          <Text className="text-teal-900 text-2xl font-bold">{formatMoney(estimatedTotalEarning)}</Text>
        </View>

        <View className="bg-red-50/60 border border-red-100 rounded-2xl p-4 flex-row items-start mb-4">
          <AlertTriangle color="#DC2626" size={20} />
          <Text className="text-red-800 ml-3 flex-1">Note: We will deduct the logistics fee from total earning for samples dropped at drop-off location.</Text>
        </View>

      </View>
      <View className="p-4 bg-white border-t border-gray-100 mt-2 ">
        <TouchableOpacity
          onPress={onConfirm}
          disabled={submitting}
          className="bg-teal-800 py-5 rounded-2xl"
        >
          <Text className="text-center text-xl font-bold text-white">
            {submitting ? "Processing..." : `Confirm ${selectedOption === "drop-off" ? "drop-off" : "delivery"} →`}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      <BottomTabs activeTab="Activities" />
    </SafeAreaView>
  );
}
