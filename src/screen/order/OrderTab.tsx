import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { URL_LINK } from "../../../config";
import { GETREQUEST } from "../../schema/ApiSchema";
import useAuth from "../../schema/UseAuth";
import { useGetUserDetails } from "../../hook/useGetUserDetails";
import { useToast } from "../../lib/utils/functions";

type OrderRow = {
  id: string;
  requestStatus?: string;
  requestDate?: string;
  samplePickUpAddress?: string;
  tests?: Array<{ name?: string }>;
  testRequests?: Array<{ test?: { name?: string } }>;
  total?: string | number;
  balance?: string | number;
};

const ACTIVE_STATUSES = new Set([
  "UNPAID",
  "PAID",
  "REQUEST_PLACED",
  "REQUEST_ACCEPTED",
  "SAMPLE_COLLECTED",
  "DROPPED_AT_LOCATION",
  "DISPATCHER_ASSIGNED",
  "IN_TRANSIT_TO_LAB",
  "SAMPLE_RECEIVED",
  "TESTING_ONGOING",
]);

const COMPLETED_STATUSES = new Set(["REQUEST_COMPLETED", "COMPLETED", "COMPLETE"]);
const CANCELLED_STATUSES = new Set(["REQUEST_CANCELLED", "CANCELLED"]);

const formatNaira = (value: string | number | undefined) => {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `₦${safe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusLabel = (status?: string) =>
  String(status || "UNKNOWN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const badgeStyle = (status?: string) => {
  const normalized = String(status || "").toUpperCase();
  if (COMPLETED_STATUSES.has(normalized)) {
    return { bg: "#D1FAE5", text: "#065F46" };
  }
  if (CANCELLED_STATUSES.has(normalized)) {
    return { bg: "#FEE2E2", text: "#991B1B" };
  }
  return { bg: "#E0F2FE", text: "#075985" };
};

const getTestsLabel = (row: OrderRow) => {
  const fromTests = Array.isArray(row?.tests) ? row.tests.map((t) => t?.name).filter(Boolean) : [];
  const fromTestRequests = Array.isArray(row?.testRequests)
    ? row.testRequests.map((t) => t?.test?.name).filter(Boolean)
    : [];

  const names = [...new Set([...(fromTests as string[]), ...(fromTestRequests as string[])])];
  if (!names.length) return "No tests attached";
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
};

export default function OrderTab() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const { userData } = useGetUserDetails();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedTab, setSelectedTab] = useState<"active" | "completed" | "cancelled">("active");

  const patientId = userData?.id || "";

  const fetchOrders = useCallback(async (silent = false) => {
    if (!token || !patientId) return;

    if (silent) setRefreshing(true); else setLoading(true);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: GETREQUEST,
          variables: {
            limit: 100,
            offset: 0,
            requestStatus: "",
            searchTerm: "",
            patientId,
            phlebotomistId: null,
            queueOnly: false,
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

      const rows = response?.data?.data?.getAllRequests?.requests || [];
      setOrders(rows);
    } catch (error: any) {
      showToast(
        "error",
        "Could not load orders",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Please try again."
      );
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, patientId]);

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  const grouped = useMemo(() => {
    const active: OrderRow[] = [];
    const completed: OrderRow[] = [];
    const cancelled: OrderRow[] = [];

    orders.forEach((item) => {
      const normalized = String(item?.requestStatus || "").toUpperCase();
      if (COMPLETED_STATUSES.has(normalized)) {
        completed.push(item);
      } else if (CANCELLED_STATUSES.has(normalized)) {
        cancelled.push(item);
      } else if (ACTIVE_STATUSES.has(normalized) || normalized) {
        active.push(item);
      }
    });

    return { active, completed, cancelled };
  }, [orders]);

  const selectedOrders = grouped[selectedTab];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>My Orders</Text>
            <Text style={styles.headerSub}>Track and manage your lab requests</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshIconBtn}
            onPress={() => fetchOrders(true)}
            disabled={refreshing}
          >
            <MaterialIcons name="refresh" size={22} color={refreshing ? "#475569" : "#94A3B8"} />
          </TouchableOpacity>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statChip}>
            <Text style={styles.statChipNum}>{grouped.active.length}</Text>
            <Text style={styles.statChipLabel}>Active</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statChipNum}>{grouped.completed.length}</Text>
            <Text style={styles.statChipLabel}>Done</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statChipNum}>{orders.length}</Text>
            <Text style={styles.statChipLabel}>Total</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentSurface}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === "active" && styles.tabBtnActive]}
            onPress={() => setSelectedTab("active")}
          >
            <Text style={[styles.tabText, selectedTab === "active" && styles.tabTextActive]}>Active ({grouped.active.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === "completed" && styles.tabBtnActive]}
            onPress={() => setSelectedTab("completed")}
          >
            <Text style={[styles.tabText, selectedTab === "completed" && styles.tabTextActive]}>Completed ({grouped.completed.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === "cancelled" && styles.tabBtnActive]}
            onPress={() => setSelectedTab("cancelled")}
          >
            <Text style={[styles.tabText, selectedTab === "cancelled" && styles.tabTextActive]}>Cancelled ({grouped.cancelled.length})</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#006968" />
          </View>
        ) : selectedOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons name="receipt-long" size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No {selectedTab} orders</Text>
            <Text style={styles.emptyText}>Orders will appear here once placed.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchOrders(true)}
                tintColor="#006968"
                colors={["#006968"]}
              />
            }
          >
            {selectedOrders.map((item) => {
              const badge = badgeStyle(item?.requestStatus);
              const testCount = Array.isArray(item?.testRequests) ? item.testRequests.length : 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.88}
                  style={styles.orderCard}
                  onPress={() => navigation.navigate("veiw_order", { itemData: item })}
                >
                  {/* Left status strip */}
                  <View style={[styles.cardStrip, { backgroundColor: badge.text }]} />

                  <View style={styles.cardInner}>
                    <View style={styles.cardTop}>
                      <Text style={styles.orderId}>#{String(item?.id || "").split("-")?.[4] || item?.id}</Text>
                      <View style={styles.cardTopRight}>
                        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: badge.text }]}>{statusLabel(item?.requestStatus)}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={18} color="#CBD5E1" style={{ marginLeft: 4 }} />
                      </View>
                    </View>

                    <Text style={styles.testsText} numberOfLines={2}>{getTestsLabel(item)}</Text>

                    <View style={styles.cardMeta}>
                      <MaterialIcons name="location-on" size={13} color="#94A3B8" />
                      <Text style={styles.addressText} numberOfLines={1}>
                        {item?.samplePickUpAddress || "Address not available"}
                      </Text>
                    </View>

                    <View style={styles.cardBottom}>
                      <View style={styles.cardDateRow}>
                        <MaterialIcons name="calendar-today" size={12} color="#94A3B8" />
                        <Text style={styles.requestDateText}>
                          {item?.requestDate ? new Date(item.requestDate).toLocaleDateString() : "N/A"}
                        </Text>
                      </View>
                      <View style={styles.cardBottomRight}>
                        {testCount > 0 && (
                          <View style={styles.testCountChip}>
                            <Text style={styles.testCountText}>{testCount} test{testCount !== 1 ? "s" : ""}</Text>
                          </View>
                        )}
                        <Text style={styles.amountText}>{formatNaira(item?.total)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1F2E",
  },
  headerBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  headerSub: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 13,
  },
  refreshIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2A2B3D",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  statRow: { flexDirection: "row", marginTop: 16, gap: 8 },
  statChip: {
    flex: 1,
    backgroundColor: "#2A2B3D",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
    paddingVertical: 12,
    alignItems: "center",
  },
  statChipNum: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  statChipLabel: { color: "#64748B", fontSize: 10, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 },
  contentSurface: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#EEF2F6",
    borderRadius: 16,
    padding: 6,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 12,
  },
  tabTextActive: {
    color: "#006968",
  },
  centeredState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 18,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardStrip: {
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardInner: { flex: 1, padding: 14 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTopRight: { flexDirection: "row", alignItems: "center" },
  orderId: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  testsText: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
  },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 2 },
  addressText: {
    color: "#64748B",
    fontSize: 12,
    flex: 1,
  },
  cardBottom: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardBottomRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  requestDateText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  testCountChip: {
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  testCountText: { color: "#475569", fontSize: 11, fontWeight: "700" },
  amountText: {
    color: "#006968",
    fontWeight: "800",
    fontSize: 14,
  },
});


























