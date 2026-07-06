import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AppScreen, PageHeader } from "../../../components/ui/rhythm";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";
import useAuth from "../../../schema/UseAuth";
import axios from "axios";
import { URL_LINK } from "../../../../config";
import { PREFERRED_REQUESTS, ACCEPT_ASSIGNMENT_NEW, REJECT_PREFERRED_REQUEST } from "../../../schema/ApiSchema";
import { useToast } from "../../../lib/utils/functions";

function statusLabel(raw: string) {
  return String(raw || "QUEUE").replaceAll("_", " ");
}

export default function PreferredRequestsScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const { userData } = useGetUserDetails();
  const { showToast } = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  const fetchPreferredRequests = useCallback(async (pageOffset: number = 0) => {
    if (!token) return;
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: PREFERRED_REQUESTS,
          variables: { limit, offset: pageOffset },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data?.data?.preferredRequests;
      if (data?.requests) {
        if (pageOffset === 0) {
          setRequests(data.requests);
        } else {
          setRequests((prev) => [...prev, ...data.requests]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching preferred requests:", error?.message);
      showToast("error", "Failed to load requests", error?.message || "");
    } finally {
      if (pageOffset === 0) setLoading(false);
    }
  }, [token, limit, showToast]);

  useEffect(() => {
    if (token) {
      fetchPreferredRequests(0);
    }
  }, [token, fetchPreferredRequests]);

  const handleAcceptRequest = async (requestId: string) => {
    if (!token || !requestId) return;

    setActiveRequestId(requestId);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: ACCEPT_ASSIGNMENT_NEW,
          variables: { requestId },
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
      await fetchPreferredRequests(0);
      navigation.navigate("accepted_request", { userTypes: "INDIVIDUAL" });
    } catch (error: any) {
      showToast(
        "error",
        "Accept failed",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Could not accept request."
      );
      console.error("acceptRequest failed:", error?.message || error);
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!token || !requestId) return;

    setRejectingRequestId(requestId);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: REJECT_PREFERRED_REQUEST,
          variables: { requestId },
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
        throw new Error(response?.data?.errors?.[0]?.message || "Could not reject request.");
      }

      showToast("success", "Request rejected", "Released back to the general pool.");
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error: any) {
      showToast(
        "error",
        "Reject failed",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Could not reject request."
      );
      console.error("rejectRequest failed:", error?.message || error);
    } finally {
      setRejectingRequestId(null);
    }
  };

  const confirmRejectRequest = (requestId: string) => {
    Alert.alert(
      "Reject request",
      "This request will be released back to the general pool for other phlebotomists. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reject", style: "destructive", onPress: () => handleRejectRequest(requestId) },
      ]
    );
  };

  const handleScroll = (event: any) => {
    if (loading) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const reachedEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;

    if (reachedEnd) {
      setOffset((prev) => prev + limit);
      fetchPreferredRequests(offset + limit);
    }
  };

  if (loading) {
    return (
      <AppScreen tone="gray">
        <PageHeader
          title="Your Preferred Requests"
          subtitle="Curated list for you"
          dark
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-slate-500 mt-3">Loading requests...</Text>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen tone="gray">
      <PageHeader
        title="Your Preferred Requests"
        subtitle={`${requests.length || 0} available in your list`}
        dark
      />

      <ScrollView
        className="px-4 py-6"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {requests.length === 0 ? (
          <View className="bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-slate-500">No preferred requests available right now.</Text>
          </View>
        ) : (
          requests.map((item: any) => {
            const isBusy = activeRequestId === item.id;
            const isRejecting = rejectingRequestId === item.id;

            return (
              <View key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-slate-600 text-[10px]">#{String(item?.id || "").split("-")?.[4] || item?.id}</Text>
                  <View className="bg-emerald-50 px-2 py-1 rounded-full">
                    <Text className="text-emerald-600 text-xs font-bold">{statusLabel(item?.requestStatus)}</Text>
                  </View>
                </View>

                <Text className="text-lg font-bold text-slate-800">
                  {item?.patient?.firstName || "Patient"} {item?.patient?.lastName || ""}
                </Text>
                <Text className="text-slate-500 text-sm mt-1" numberOfLines={2}>
                  {item?.samplePickUpAddress || "Address not available"}
                </Text>

                <View className="flex-row mt-4 mb-4">
                  <View className="bg-slate-100 px-3 py-1.5 rounded-lg mr-2">
                    <Text className="text-slate-600 text-xs font-semibold">Pickup {item?.pickupDistance || 0} km</Text>
                  </View>
                  <View className="bg-slate-100 px-3 py-1.5 rounded-lg mr-2">
                    <Text className="text-slate-600 text-xs font-semibold">Tests {item?.testRequestCount || 0}</Text>
                  </View>
                  <View className="bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <Text className="text-emerald-700 text-xs font-bold">₦{Number(item?.phlebotomistEarning || 0).toLocaleString()}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  className={`py-3 rounded-xl items-center mb-2 ${isBusy ? "bg-emerald-200" : "bg-teal-800"}`}
                  disabled={isBusy || isRejecting}
                  onPress={() => handleAcceptRequest(item.id)}
                >
                  <Text className="text-white font-bold">{isBusy ? "Processing..." : "Accept request"}</Text>
                </TouchableOpacity>

                <View className="flex-row">
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-xl items-center mr-2 ${isRejecting ? "bg-red-100" : "bg-red-50"}`}
                    disabled={isBusy || isRejecting}
                    onPress={() => confirmRejectRequest(item.id)}
                  >
                    <Text className="text-red-600 font-bold">{isRejecting ? "Rejecting..." : "Reject"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 py-3 rounded-xl items-center bg-slate-100"
                    disabled={isBusy || isRejecting}
                    onPress={() => navigation.navigate("veiw_order", { itemData: item })}
                  >
                    <Text className="text-slate-700 font-bold">Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View className="h-20" />
      </ScrollView>
    </AppScreen>
  );
}
