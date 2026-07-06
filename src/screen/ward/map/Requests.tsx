import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AppScreen, PageHeader, RhythmCard, SectionTitle, StepProgress } from "../../../components/ui/rhythm";
import { useRequestsRedux } from "../../../hook/useRequestsRedux";
import useAuth from "../../../schema/UseAuth";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";
import axios from "axios";
import { URL_LINK } from "../../../../config";
import { ACCEPT_ASSIGNMENT_NEW, ACCEPT_PUBLIC_HEALTH_ASSIGNMENT } from "../../../schema/ApiSchema";
import { useToast } from "../../../lib/utils/functions";

function statusLabel(raw: string) {
  return String(raw || "QUEUE").replaceAll("_", " ");
}

function isPublicHealthRequest(item: any) {
  if (Array.isArray(item?.publicRequestId) && item.publicRequestId.length > 0) {
    return true;
  }

  const type = String(item?.patient?.organisationType || "").toUpperCase();
  return type === "PUBLIC_HEALTH";
}

export default function RequestsPage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth(navigation);
  const { userData } = useGetUserDetails();
  const { showToast } = useToast();
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const {
    requests,
    totalCount,
    loadingRequests,
    loadingMore,
    loadMore,
    reloadRequests,
  } = useRequestsRedux({
    requestStatus: "",
    searchTerm: "",
    queueOnly: true,
    phlebotomistId: "",
  });

  const { reloadRequests: reloadAcceptedRequests } = useRequestsRedux({
    requestStatus: "",
    searchTerm: "",
    queueOnly: false,
    phlebotomistId: userData?.phlebotomist?.id || userData?.id || "",
  });

  const phlebotomistId = useMemo(
    () => userData?.phlebotomist?.id || userData?.id || "",
    [userData?.id, userData?.phlebotomist?.id]
  );

  const selectedType: "INDIVIDUAL" | "PH" = route?.params?.userTypes === "PH" ? "PH" : "INDIVIDUAL";
  const filteredRequests = useMemo(
    () =>
      (requests || []).filter((item: any) =>
        selectedType === "PH" ? isPublicHealthRequest(item) : !isPublicHealthRequest(item)
      ),
    [requests, selectedType]
  );

  const acceptRequest = async (requestId: string) => {
    if (!token || !requestId) return;

    setActiveRequestId(requestId);
    try {
      const isPublicHealthFlow = selectedType === "PH";
      const mutation = isPublicHealthFlow ? ACCEPT_PUBLIC_HEALTH_ASSIGNMENT : ACCEPT_ASSIGNMENT_NEW;
      const variables = isPublicHealthFlow
        ? { requestId, phlebotomistId }
        : { requestId };

      const response = await axios.post(
        URL_LINK,
        {
          query: mutation,
          variables,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.errors?.length) {
        throw new Error(response?.data?.errors?.[0]?.message || "Could not accept request.");
      }

      showToast("success", "Request accepted", "Moved to accepted requests.");
      await Promise.all([reloadRequests(), reloadAcceptedRequests()]);
      navigation.navigate("accepted_request", { userTypes: selectedType });
    } catch (error: any) {
      showToast(
        "error",
        "Accept failed",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Could not accept request right now."
      );
      console.error("acceptRequest failed:", error?.message || error);
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleScroll = (event: any) => {
    if (loadingRequests || loadingMore) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const reachedEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;

    if (reachedEnd) {
      loadMore();
    }
  };

  return (
    <AppScreen tone="gray">
      <PageHeader
        title={selectedType === "PH" ? "Public Health Requests" : "Individual/Organization Requests"}
        subtitle={`${filteredRequests.length || 0} ${selectedType === "PH" ? "public health" : "individual"} in queue`}
        dark
      />

      <ScrollView
        className="px-4 py-6"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* <RhythmCard className="mb-5">
          <SectionTitle title="Progress" />
          <StepProgress
            steps={[
              { label: "Queue", state: "active" },
              { label: "Accepted", state: "todo" },
              { label: "Delivered", state: "todo" },
            ]}
          />
        </RhythmCard> */}

        {loadingRequests ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0a1b16" />
          </View>
        ) : filteredRequests.length === 0 ? (
          <View className="bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-slate-500">
              No {selectedType === "PH" ? "public health" : "individual/organization"} request available right now.
            </Text>
          </View>
        ) : (
          filteredRequests.map((item: any) => {
            const isBusy = activeRequestId === item.id;

            return (
            <View key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-slate-600 text-[10px]">#{String(item?.id || "").split("-")?.[4] || item?.id}</Text>
                <View className="bg-emerald-50 px-2 py-1 rounded-full">
                  <Text className="text-emerald-600 text-xs font-bold">{statusLabel(item?.requestStatus)}</Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-slate-800">{item?.patient?.firstName || "Request"}</Text>
              <Text className="text-slate-500 text-sm mt-1" numberOfLines={2}>
                {item?.samplePickUpAddress || "Address not available"}
              </Text>
              <View className="flex-row mt-4">
                <View className="bg-slate-100 px-3 py-1.5 rounded-lg mr-2">
                  <Text className="text-slate-600 text-xs font-semibold">Pickup {item?.pickupDistance || 0} km</Text>
                </View>
                <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
                  <Text className="text-slate-600 text-xs font-semibold">Drop-off {item?.dropOffDistance || 0} km</Text>
                </View>
              </View>

              <View className="flex-row mt-4">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center mr-2 ${isBusy ? "bg-emerald-200" : "bg-teal-800"}`}
                  disabled={isBusy}
                  onPress={() => acceptRequest(item.id)}
                >
                  <Text className="text-white font-bold">{isBusy ? "Processing..." : "Accept request"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl items-center bg-slate-100"
                  onPress={() => navigation.navigate("veiw_order", { itemData: item })}
                >
                  <Text className="text-slate-700 font-bold">Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )})
        )}

        {loadingMore ? (
          <View className="py-4 items-center mb-6">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-slate-400 text-xs mt-2">Loading more records...</Text>
          </View>
        ) : null}
        <View className="h-20"/>
      </ScrollView>
    </AppScreen>
  );
}
