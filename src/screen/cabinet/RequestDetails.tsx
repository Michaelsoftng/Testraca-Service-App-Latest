import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

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

const formatDistanceList = (values?: Array<string | number | null | undefined>) => {
  if (!Array.isArray(values)) return "N/A";

  const filteredValues = values
    .map((value) => {
      if (typeof value === "number") return `${value} km`;
      if (typeof value === "string" && value.trim()) {
        return value.toLowerCase().includes("km") ? value : `${value} km`;
      }

      return "";
    })
    .filter(Boolean);

  return filteredValues.length > 0 ? filteredValues.join(", ") : "N/A";
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

const RequestInfoRow = ({
  label,
  value,
  multiline = false,
  accent = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  accent?: boolean;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text
      numberOfLines={multiline ? undefined : 2}
      style={[
        styles.infoValue,
        multiline && styles.infoValueMultiline,
        accent && styles.infoValueAccent,
      ]}
    >
      {value}
    </Text>
  </View>
);

const RequestSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.detailSection}>
    <Text style={styles.detailSectionTitle}>{title}</Text>
    {children}
  </View>
);

export default function RequestDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { request } = (route.params || {}) as { request?: AcceptedRequest };

  const safeRequest: AcceptedRequest =
    request ||
    ({
      id: "demo-request",
      createdAt: null,
      requestStatus: "PENDING",
      deliveredToLabAt: null,
      deliveryMode: null,
      dispatcherAssignedAt: null,
      droppedAtLocation: false,
      droppedAtLocationAt: null,
      pickedFromDropoffAt: null,
      name: "Unknown dropoff point",
      dispatcherEarning: null,
      dropoffAddress: "N/A",
      facilityAddresses: [],
      facilityDistances: [],
      isTimeSensitive: false,
      labFacilities: [],
      numberOfSamples: 0,
      patientName: "N/A",
      requestType: "N/A",
      sampleDetails: [],
    } as unknown as AcceptedRequest);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // pull-to-refresh triggers a UI refresh; add request re-sync logic here when available
    } finally {
      setRefreshing(false);
    }
  }, []);

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

  const sampleCountText = Array.isArray(safeRequest.sampleDetails)
    ? `${safeRequest.sampleDetails.length} item(s)`
    : "N/A";

  return (
    <SafeAreaView style={styles.detailScreenContainer}>
      <StatusBar barStyle="light-content" />

      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={18} color="#94A3B8" />
          <Text style={styles.backButtonText}>Routes</Text>
        </TouchableOpacity>

        <Text style={styles.detailTitle}>Request details</Text>

        <View style={styles.detailHeaderBadgeRow}>
          <View style={[styles.detailStatusPill, statusStyle(safeRequest.requestStatus)]}>
            <Text style={styles.detailStatusText}>{statusText(safeRequest.requestStatus)}</Text>
          </View>
          <View style={styles.detailIdBadge}>
            <Text style={styles.detailIdText}>#{safeRequest.id}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.detailScroll}
        contentContainerStyle={styles.detailScrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#059669" />}
      >
        <RequestSection title="Order Details">
          {/* <RequestInfoRow label="Request date" value={formatDate(safeRequest.createdAt)} />
          <RequestInfoRow label="Assigned date" value={formatDate(safeRequest.dispatcherAssignedAt)} />
          <RequestInfoRow label="Dropped date" value={formatDate(safeRequest.droppedAtLocationAt)} />
          <RequestInfoRow label="Picked time" value={formatTime(safeRequest.pickedFromDropoffAt)} />
          <RequestInfoRow label="Delivered date" value={formatDate(safeRequest.deliveredToLabAt)} /> */}
          <RequestInfoRow label="Delivery mode" value={formatDetailValue(safeRequest.deliveryMode)} />
          <RequestInfoRow label="Request type" value={formatDetailValue(safeRequest.requestType)} />
          <RequestInfoRow
            label="Dropoff address"
            value={formatDetailValue(safeRequest.dropoffAddress)}
            multiline
          />
          <RequestInfoRow label="Patient" value={formatDetailValue(safeRequest.patientName)} />
          <RequestInfoRow label="Samples" value={formatDetailValue(safeRequest.numberOfSamples)} />
          <RequestInfoRow
            label="Time sensitive"
            value={formatDetailValue(safeRequest.isTimeSensitive)}
          />
        </RequestSection>

        <RequestSection title="Payment">
          <RequestInfoRow
            label="Dispatcher earning"
            value={formatDetailValue(safeRequest.dispatcherEarning)}
            accent
          />
        </RequestSection>

        <RequestSection title="Facilities">
          <RequestInfoRow
            label="Lab facilities"
            value={formatTextList(safeRequest.labFacilities)}
            multiline
          />
          <RequestInfoRow
            label="Facility addresses"
            value={formatTextList(safeRequest.facilityAddresses, " | ")}
            multiline
          />
          <RequestInfoRow
            label="Facility distances"
            value={formatDistanceList(safeRequest.facilityDistances)}
            multiline
          />
        </RequestSection>

        <RequestSection title="Samples">
          <RequestInfoRow label="Sample details" value={sampleCountText} />
        </RequestSection>

        <RequestSection title="Dispatcher">
          <RequestInfoRow label="Dropoff point" value={formatDetailValue(safeRequest.name)} />
          <RequestInfoRow label="Current status" value={statusText(safeRequest.requestStatus)} />
          <RequestInfoRow
            label="Dropped at location"
            value={formatDetailValue(safeRequest.droppedAtLocation)}
          />
        </RequestSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  detailScreenContainer: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },

  detailHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backButtonText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 2,
  },

  detailTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },

  detailHeaderBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  detailStatusPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  detailStatusText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  detailIdBadge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  detailIdText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "500",
  },

  detailScroll: {
    flex: 1,
    backgroundColor: "#F1F3F0",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },

  detailScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 32,
  },

  detailSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },

  detailSectionTitle: {
    color: "#3a3c3f",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  infoLabel: {
    color: "#455264",
    fontSize: 13,
    fontWeight: "500",
    marginRight: 12,
  },

  infoValue: {
    flex: 1,
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },

  infoValueAccent: {
    color: "#059669",
  },

  infoValueMultiline: {
    lineHeight: 18,
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
});