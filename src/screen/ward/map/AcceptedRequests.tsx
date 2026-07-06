import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";
import useAuth from "../../../schema/UseAuth";
import axios from "axios";
import { URL_LINK } from "../../../../config";
import { UPDATE_SAMPLEDROPDATE, UPDATE_SAMPLE_COLLECTED_PH, GET_CURRENT_PHLEBOTOMIST_REQUESTS, REJECT_PUBLIC_HEALTH_REQUEST, REJECT_GENERAL_REQUEST, PHLEBOTOMIST_CONFIRM_DELIVERY_TO_LAB } from "../../../schema/ApiSchema";
import { useToast } from "../../../lib/utils/functions";
import RequestCard, { WorkloadItem } from "../../../components/RequestCard";
import BottomTabs from "../../../components/BottomTabs";

const HIDDEN_ACCEPTED_STATUSES = new Set([
  "TESTING_ONGOING",
  "IN_TRANSIT_TO_LAB",
  "REQUEST_COMPLETED",
  "DROPPED_AT_LOCATION",
  "DISPATCHER_ASSIGNED",
  "SAMPLE_RECEIVED",
  "DROP_OFF_CONFIRMED",
  "DELIVERY_IN_PROGRESS",
  "DELIVERED_TO_LAB",
]);

function shouldHideFromAccepted(item: any) {
  const status = String(item?.requestStatus || "").toUpperCase();
  return HIDDEN_ACCEPTED_STATUSES.has(status);
}

function isPublicHealthRequest(item: any) {
  if (Array.isArray(item?.publicRequestId) && item.publicRequestId.length > 0) {
    return true;
  }

  const type = String(item?.patient?.organisationType || "").toUpperCase();
  return type === "PUBLIC_HEALTH";
}

function toWorkloadItem(item: any): WorkloadItem {
  return {
    id: `#${String(item?.id || "").split("-")?.[4] || item?.id || ""}`,
    name: item?.patientName || item?.patient?.firstName || "Patient",
    type: item?.testRequests?.[0]?.test?.name || "Sample Collection",
    status: item?.isTimeSensitive ? "STAT" : "Routine",
    distance: `${item?.pickupDistance ?? item?.dropOffDistance ?? 0} km`,
    address: item?.samplePickUpAddress || "Address not available",
    iconType: "blood",
  };
}

const FILTERS: { key: "ALL" | "ACCEPTED" | "COLLECTED" | "DROP"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "COLLECTED", label: "Collected" },
  { key: "DROP", label: "Drop" },
];

export default function AcceptedRequests() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { userData, loadingUserDetails } = useGetUserDetails();
  const { token } = useAuth(navigation);
  const { showToast } = useToast();
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProgressFilter, setSelectedProgressFilter] = useState<"ALL" | "ACCEPTED" | "COLLECTED" | "DROP">("ALL");
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  const phlebotomistId = userData?.id || "";

  // Determine request status based on filter
  const getRequestStatus = (filter: "ALL" | "ACCEPTED" | "COLLECTED" | "DROP") => {
    if (filter === "ACCEPTED") return "request_accepted";
    if (filter === "COLLECTED" || filter === "DROP") return "sample_collected";
    return null; // null for combined
  };

  // Fetch requests from API
  const fetchRequests = useCallback(
    async (fetchOffset = 0, append = false) => {
      if (!token || !phlebotomistId) return;

      const isLoading = fetchOffset === 0 ? setLoadingRequests : setLoadingMore;
      isLoading(true);

      try {
        const requestStatus = getRequestStatus(selectedProgressFilter);
        const response = await axios.post(
          URL_LINK,
          {
            query: GET_CURRENT_PHLEBOTOMIST_REQUESTS,
            variables: {
              limit,
              offset: fetchOffset,
              requestStatus,
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

        const result = response?.data?.data?.getCurrentPhlebotomistRequests;
        if (result) {
          const newRequests = result.requests || [];
          const count = result.requestsCount || 0;

          if (append && fetchOffset > 0) {
            setRequests((prev) => [...prev, ...newRequests]);
          } else {
            setRequests(newRequests);
            setOffset(0);
          }
          setTotalCount(count);
          setOffset(fetchOffset + limit);
        }
      } catch (error: any) {
        console.error("fetchRequests error:", error?.message);
        showToast("error", "Failed", "Could not load requests.");
      } finally {
        isLoading(false);
      }
    },
    [token, phlebotomistId, selectedProgressFilter, limit]
  );

  // Load more requests
  const loadMore = useCallback(() => {
    if (loadingRequests || loadingMore || offset >= totalCount) return;
    fetchRequests(offset, true);
  }, [loadingRequests, loadingMore, offset, totalCount, fetchRequests]);

  // Reload requests
  const reloadRequests = useCallback(() => {
    setOffset(0);
    fetchRequests(0, false);
  }, [fetchRequests]);

  // Effect to load requests when component mounts or filter changes
  useFocusEffect(
    useCallback(() => {
      if (!phlebotomistId) return;
      reloadRequests();
    }, [phlebotomistId, reloadRequests])
  );

  // Handle refresh
  const onRefresh = async () => {
    if (!phlebotomistId) return;
    setRefreshing(true);
    try {
      await reloadRequests();
    } finally {
      setRefreshing(false);
    }
  };

  // Reload requests when filter changes
  React.useEffect(() => {
    if (!phlebotomistId) return;
    reloadRequests();
  }, [selectedProgressFilter, phlebotomistId, reloadRequests]);

  const hasRequests = (requests || []).length > 0;
  const selectedType: "INDIVIDUAL" | "PH" = route?.params?.userTypes === "PH" ? "PH" : "INDIVIDUAL";

  const displayRequests = useMemo(
    () =>
      (requests || []).filter((item: any) => {
        const normalizedStatus = String(item?.requestStatus || "").toUpperCase();
        const normalizedDeliveryMode = String(item?.deliveryMode || "").toUpperCase();

        if (selectedProgressFilter === "ALL") {
          return (
            normalizedStatus === "REQUEST_ACCEPTED" ||
            normalizedStatus === "SAMPLE_COLLECTED" &&
          normalizedDeliveryMode === "DIRECT_TO_LAB" && item?.deliveredToLabAt === null
          );
        }

        if (selectedProgressFilter === "ACCEPTED") {
          return normalizedStatus === "REQUEST_ACCEPTED";
        }

        if (selectedProgressFilter === "COLLECTED") {
          return normalizedStatus === "SAMPLE_COLLECTED" &&
          normalizedDeliveryMode !== "DIRECT_TO_LAB";
        }

        return (
          normalizedStatus === "SAMPLE_COLLECTED" &&
          normalizedDeliveryMode === "DIRECT_TO_LAB" && item?.deliveredToLabAt === null
        );
      }),
    [requests, selectedProgressFilter]
  );

  const markCollected = async (requestId: string) => {
    if (!token || !requestId) return;

    setActiveRequestId(requestId);
    try {
      const mutation = selectedType === "PH" ? UPDATE_SAMPLE_COLLECTED_PH : UPDATE_SAMPLEDROPDATE;
      const response = await axios.post(
        URL_LINK,
        {
          query: mutation,
          variables: {
            requestId,
            updateData: {
              requestStatus: "sample_collected",
              sampleCollectionDate: new Date().toISOString(),
            },
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

      showToast(
        "success",
        "Updated",
        `Sample marked as collected for ${selectedType === "PH" ? "Public Health" : "Individual"} request.`
      );
      await reloadRequests();
    } catch (error: any) {
      const gqlError = error?.response?.data?.errors?.[0]?.message;
      console.error("markCollected failed:", gqlError || error?.message || error);
      showToast("error", "Update failed", gqlError || "Could not mark sample as collected.");
    } finally {
      setActiveRequestId(null);
    }
  };

  const confirmDropSample = async (requestId: string, testRequestId?: string) => {
    if (!token || !requestId) return;

    setActiveRequestId(requestId);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: PHLEBOTOMIST_CONFIRM_DELIVERY_TO_LAB,
          variables: {
            requestId,
            testRequestId: testRequestId || null,
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

      showToast("success", "Dropped", "Sample drop confirmed for delivery to lab.");
      await reloadRequests();
    } catch (error: any) {
      const gqlError = error?.response?.data?.errors?.[0]?.message;
      showToast("error", "Drop failed", gqlError || "Could not confirm sample drop.");
    } finally {
      setActiveRequestId(null);
    }
  };

  const cancelAssignment = async (requestId: string) => {
    if (!token || !requestId) return;

    setActiveRequestId(requestId);
    try {
      const mutation = selectedType === "PH" ? REJECT_PUBLIC_HEALTH_REQUEST : REJECT_GENERAL_REQUEST;
      const response = await axios.post(
        URL_LINK,
        {
          query: mutation,
          variables: {
            requestId,
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

      showToast("success", "Cancelled", "Request has been cancelled successfully.");
      await reloadRequests();
    } catch (error: any) {
      const gqlError = error?.response?.data?.errors?.[0]?.message;
      showToast("error", "Cancel failed", gqlError || error?.message || "Could not cancel the request.");
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleScroll = (event: any) => {
    if (loadingRequests || loadingMore || refreshing) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const reachedEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;

    if (reachedEnd) {
      loadMore();
    }
  };

  const isCollectedView = selectedProgressFilter === "COLLECTED";

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50/50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity
          className="p-2 rounded-full bg-white shadow-sm border border-slate-100"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-900">Requests</Text>
        <View className="w-10 h-10 rounded-full border border-teal-600 bg-teal-50 items-center justify-center">
          <Text className="text-teal-800 font-bold">
            {String(userData?.firstName?.[0] || "U").toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0D9488"
            colors={["#0D9488"]}
          />
        }
      >
        <View className="flex-row justify-between items-center mt-2 mb-1">
          <Text className="text-2xl font-bold text-slate-900 tracking-tight">
            {isCollectedView ? "Manage Deliveries" : "Accepted Workload"}
          </Text>
          <View className="bg-teal-50 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-semibold text-teal-800">
              {displayRequests.length} {isCollectedView ? "Ready" : "Active"}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-slate-500 mb-5 leading-relaxed">
          {isCollectedView
            ? `${displayRequests.length} sample${displayRequests.length === 1 ? "" : "s"} collected and ready for lab transport.`
            : "Complete these accepted collections in your current route."}
        </Text>

        {/* Filter tabs */}
        <View className="flex-row bg-slate-100 p-1 rounded-xl mb-5">
          {FILTERS.map((filter) => {
            const isActive = selectedProgressFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                onPress={() => {
                  setSelectedProgressFilter(filter.key);
                  setOffset(0);
                  setRequests([]);
                }}
                className={`flex-1 py-2.5 rounded-lg items-center ${isActive ? "bg-teal-800" : ""}`}
              >
                <Text className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loadingUserDetails || !phlebotomistId ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0D9488" />
            <Text className="text-slate-500 mt-3">Loading your accepted requests...</Text>
          </View>
        ) : loadingRequests && !hasRequests ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0D9488" />
          </View>
        ) : displayRequests.length === 0 ? (
          <View className="bg-white rounded-2xl p-5 border border-slate-100">
            <Text className="text-slate-500">
              No {selectedType === "PH" ? "public health" : "individual/organization"} {selectedProgressFilter.toLowerCase()} request at the moment.
            </Text>
          </View>
        ) : (
          displayRequests.map((item: any) => {
            const normalizedStatus = String(item?.requestStatus || "").toUpperCase();
            const normalizedDeliveryMode = String(item?.deliveryMode || "").toUpperCase();
            const isProcessing = activeRequestId === item.id;

            const canMarkCollected = normalizedStatus === "REQUEST_ACCEPTED";
            const canManageDelivery =
              normalizedStatus === "SAMPLE_COLLECTED" ||
              normalizedStatus === "SAMPLE_RECEIVED" ||
              normalizedStatus === "DROP_OFF_CONFIRMED" ||
              normalizedStatus === "DELIVERY_IN_PROGRESS";
            const canManageDrop = normalizedStatus === "SAMPLE_COLLECTED";

            let actionLabel = "View details";
            let onAction: (id: string) => void = () => navigation.navigate("veiw_order", { itemData: item });
            let showCancel = false;
            let onCancel: ((id: string) => void) | undefined;

            if (canMarkCollected) {
              actionLabel = isProcessing ? "Processing..." : "Sample collected";
              onAction = () => markCollected(item.id);
              showCancel = true;
              onCancel = () => cancelAssignment(item.id);
            } else if (canManageDelivery && normalizedDeliveryMode !== "DIRECT_TO_LAB") {
              actionLabel = "Manage Delivery";
              onAction = () => navigation.navigate("delivery_choice_screen", { itemData: item });
            } else if (canManageDrop && normalizedDeliveryMode === "DIRECT_TO_LAB") {
              actionLabel = isProcessing ? "Processing..." : "Drop Sample";
              onAction = () =>
                confirmDropSample(
                  item.id,
                  Array.isArray(item?.testRequests) && item.testRequests.length > 0
                    ? item.testRequests[0]?.id
                    : undefined
                );
            }

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("veiw_order", { itemData: item })}
              >
                <RequestCard
                  item={toWorkloadItem(item)}
                  actionLabel={actionLabel}
                  onAction={onAction}
                  onCancel={onCancel}
                  showCancel={showCancel}
                />
              </TouchableOpacity>
            );
          })
        )}

        {loadingMore ? (
          <View className="py-4 items-center mb-6">
            <ActivityIndicator size="small" color="#0D9488" />
            <Text className="text-slate-400 text-xs mt-2">Loading more records...</Text>
          </View>
        ) : null}
        <View className="h-8" />
      </ScrollView>

      <BottomTabs activeTab="Ward" />
    </SafeAreaView>
  );
}
