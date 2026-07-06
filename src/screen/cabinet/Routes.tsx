import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import { URL_LINK } from "../../../config";
import {
  DISPATCH_ACCETED_RESQUEST,
  GET_AVAILABLE_REEQUESTS_FOR_PICK_UP,
} from "../../schema/ApiSchema";
import useAuth from "../../schema/UseAuth";

interface RouteData {
  id: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  estimatedTime: string;
  samplesCount: number;
  status: "planned" | "in-progress" | "completed";
}

type AcceptedRequest = {
  id: string;
  createdAt: string;
  requestStatus: string;
  deliveredToLabAt: string | null;
  deliveryMode: string | null;
  dispatcherAssignedAt: string;
  droppedAtLocation: boolean;
  droppedAtLocationAt: string;
  pickedFromDropoffAt: string | null;
  name: string;
  dispatcherEarning?: string | number | null;
  dropoffLocation?: unknown;
  dropoffAddress?: string;
  facilityAddresses?: string[];
  facilityDistances?: Array<string | number>;
  isTimeSensitive?: boolean;
  labFacilities?: string[];
  numberOfSamples?: number;
  patientName?: string;
  requestType?: string;
  sampleDetails?: any[];
};

const formatTextList = (
  values?: Array<string | null | undefined>,
  separator = ", "
) => {
  if (!Array.isArray(values)) return "N/A";

  const filteredValues = values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  return filteredValues.length > 0 ? filteredValues.join(separator) : "N/A";
};

const formatDetailValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const RequestSummaryCard = ({
  request,
  cardIndex,
  onPress,
  statusStyle,
  statusText,
}: {
  request: AcceptedRequest;
  cardIndex: number;
  onPress: () => void;
  statusStyle: (status: string) => object;
  statusText: (status: string) => string;
}) => {
  const facilityAddressText = formatTextList(request.facilityAddresses, " | ");
  const isEvenCard = cardIndex % 2 === 0;
  const accentColor = isEvenCard ? "#ef4444" : "#2563eb";
  const accentBackground = isEvenCard ? "#fef2f2" : "#eff6ff";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.summaryCard, { borderLeftWidth: 4, borderLeftColor: accentColor }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.summaryHeaderText}>
          <Text style={styles.routeId}>{request.name}</Text>
          <Text style={styles.sampleCount}>{request.deliveryMode || "N/A"}</Text>
        </View>

        <View style={[styles.statusBadge, statusStyle(request.requestStatus)]}>
          <Text style={styles.statusText}>{statusText(request.requestStatus)}</Text>
        </View>
      </View>

      <View style={styles.summaryBody}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryIconBadge, { backgroundColor: accentBackground }]}> 
            <MaterialIcons name="location-on" size={16} color={accentColor} />
          </View>
          <Text style={styles.detailText} numberOfLines={1}>
            Dropoff: {formatDetailValue(request.dropoffAddress)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryIconBadge, { backgroundColor: accentBackground }]}> 
            <MaterialIcons name="assignment" size={16} color={accentColor} />
          </View>
          <Text style={styles.detailText} numberOfLines={1}>
            Request Type: {formatDetailValue(request.requestType)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryIconBadge, { backgroundColor: accentBackground }]}> 
            <MaterialIcons name="home" size={16} color={accentColor} />
          </View>
          <Text style={styles.detailText} numberOfLines={1}>
            Facilities: {facilityAddressText}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryIconBadge, { backgroundColor: accentBackground }]}> 
            <MaterialIcons name="attach-money" size={16} color={accentColor} />
          </View>
          <Text style={styles.detailText} numberOfLines={1}>
            Dispatcher Earning: {formatDetailValue(request.dispatcherEarning)}
          </Text>
        </View>
      </View>

      <View style={styles.summaryFooter}>
        <Text style={[styles.summaryFooterText, { color: accentColor }]}>View details</Text>
        <MaterialIcons name="chevron-right" size={16} color={accentColor} />
      </View>
    </TouchableOpacity>
  );
};

export default function RoutesScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(navigation);
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return styles.statusPlanned;
      case "IN_TRANSIT_TO_LAB":
        return styles.statusInProgress;
      case "DELIVERED_TO_LAB":
        return styles.statusCompleted;
      case "PICKED_UP":
        return styles.statusInProgress;
      default:
        return styles.statusDefault;
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "IN_TRANSIT_TO_LAB":
        return "In Transit";
      case "DELIVERED_TO_LAB":
        return "Delivered";
      case "PICKED_UP":
        return "Picked Up";
      default:
        return status?.replace(/_/g, " ") || "Unknown";
    }
  };

  const [acceptedAvailable, setAcceptedAvailable] = useState<{
    requests: AcceptedRequest[];
    requestsCount: number;
  }>({
    requests: [],
    requestsCount: 0,
  });

  const fetchRequests = async () => {
    if (!token) return;

    setLoading(true);

    try {
      await axios.post(
        URL_LINK,
        { query: GET_AVAILABLE_REEQUESTS_FOR_PICK_UP },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const acceptedRes = await axios.post(
        URL_LINK,
        {
          query: DISPATCH_ACCETED_RESQUEST,
          variables: { limit: 10, offset: 0 },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const acceptedData = acceptedRes?.data?.data?.myAcceptedRequests;
      const mappedAccepted: AcceptedRequest[] =
        acceptedData?.map((item: any) => ({
          id: item.id,
          createdAt: item.createdAt,
          requestStatus: item.requestStatus,
          deliveredToLabAt: item.deliveredToLabAt,
          deliveryMode: item.deliveryMode,
          dispatcherAssignedAt: item.dispatcherAssignedAt,
          droppedAtLocation: item.droppedAtLocation,
          droppedAtLocationAt: item.droppedAtLocationAt,
          pickedFromDropoffAt: item.pickedFromDropoffAt,
          name: item.dropoffLocation?.name ?? "N/A",
          dispatcherEarning: item.dispatcherEarning,
          dropoffLocation: item.dropoffLocation,
          dropoffAddress: item.dropoffLocation?.address ?? "N/A",
          facilityAddresses: item.facilityAddresses,
          facilityDistances: item.facilityDistances,
          isTimeSensitive: item.isTimeSensitive,
          labFacilities: item.labFacilities,
          numberOfSamples: item.numberOfSamples,
          patientName: item.patientName,
          requestType: item.requestType,
          sampleDetails: item.sampleDetails,
        })) ?? [];

      setAcceptedAvailable({
        requests: mappedAccepted,
        requestsCount: acceptedData?.requestsCount ?? 0,
      });
      setVisibleCount(PAGE_SIZE);
    } catch (error) {
      const err = error as any;
      console.error("Fetch requests error:", err?.message || error);
      setAcceptedAvailable({ requests: [], requestsCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const visibleRequests = acceptedAvailable.requests.slice(0, visibleCount);

  const handleScroll = (event: any) => {
    if (loading) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const reachedEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;

    if (reachedEnd && visibleCount < acceptedAvailable.requests.length) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, acceptedAvailable.requests.length));
    }
  };

  return (
    <View style={styles.container} className="flex-1 mt-4">
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.routeInfo}>
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Dispatch rider</Text>
              <Text style={styles.routeValue}>
                {routes.filter((route) => route.status === "in-progress").length}
              </Text>
              <Text style={styles.routeSubLabel}>Active routes</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
            <TouchableOpacity style={styles.iconCircle}>
              <MaterialIcons name="notifications" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerTitle}>
          <Text style={styles.headerMain}>Route Management</Text>
          <Text style={styles.headerSub}>Plan and track sample delivery routes</Text>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
          <View style={styles.riderBadge}>
            <Text style={styles.riderBadgeText}>RDR-001</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Delivery Routes</Text>
          {loading ? <Text style={styles.loadingText}>Loading...</Text> : null}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {visibleRequests.length > 0 ? (
            visibleRequests.map((request, index) => (
              <RequestSummaryCard
                key={request.id || String(index)}
                request={request}
                cardIndex={index}
                onPress={() => navigation.navigate("request_details_screen", { request })}
                statusStyle={statusStyle}
                statusText={statusText}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {loading ? "Loading requests..." : "No accepted requests yet"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F0",
  },

  header: {
    backgroundColor: "#0D1B2A",
    paddingHorizontal: 20,
    paddingBottom: 84,
    paddingTop: 32,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    gap: 18,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routeInfo: {
    justifyContent: "center",
  },

  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  routeText: {
    gap: 3,
  },

  routeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },

  routeValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 32,
  },

  routeSubLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },

  headerIcons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  iconCircle: {
    backgroundColor: "#1E293B",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    gap: 8,
  },

  headerMain: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerSub: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
  },

  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  onlineBadge: {
    backgroundColor: "#059669",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginRight: 6,
  },

  onlineText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  riderBadge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },

  riderBadgeText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "500",
  },

  content: {
    flex: 1,
    marginTop: -56,
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingBottom: 28,
  },

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  toolbarTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D1B2A",
    letterSpacing: 0.8,
  },

  loadingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  summaryHeaderText: {
    flex: 1,
  },

  routeId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  sampleCount: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },

  statusPlanned: {
    backgroundColor: "#F59E0B",
  },

  statusInProgress: {
    backgroundColor: "#3B82F6",
  },

  statusCompleted: {
    backgroundColor: "#059669",
  },

  statusDefault: {
    backgroundColor: "#64748B",
  },

  summaryBody: {
    marginTop: 8,
    gap: 6,
  },

  summaryIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  detailText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
  },

  summaryFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  summaryFooterText: {
    fontSize: 11,
    fontWeight: "700",
    marginRight: 4,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
});
