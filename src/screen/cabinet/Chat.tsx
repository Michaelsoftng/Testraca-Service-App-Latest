import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GetPublicHealtRequstAccepted from "../../schema/GetPublicHealtRequstAccepted";
import GetIndividualOrganizationAccepted from "../../schema/GetIndividualOrganizationAccepted";

// ── Types ──────────────────────────────────────────────────────────────────────

type RequestItem = {
  id: string;
  amount: string;
  noOfPeople: string;
  noOfEmployees: string;
  pickUpAddress?: string;
  requestDate?: string;
  requestStatus: string;
  sampleCollectionDate?: string;
  sampleDropOffDate?: string;
  dropOffDistance?: string;
  distanceCharge?: string;
  pickupDistance?: string;
  sampleStatus?: string;
  phlebotomistEarning?: string;
  testRequest: any[];
  tests: Array<{ name: string }>;
  balance?: any;
  detailsVisible: boolean;
};

// ── Status config ──────────────────────────────────────────────────────────────

const ONGOING_STATUSES = new Set([
  "SAMPLE_COLLECTED",
  "DROPPED_AT_LOCATION",
  "DISPATCHER_ASSIGNED",
  "IN_TRANSIT_TO_LAB",
  "SAMPLE_RECEIVED",
  "TESTING_ONGOING",
  "DIRECT_TO_LAB",
  "DROP_OFF",
]);

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  SAMPLE_COLLECTED:    { label: "Sample Collected",    bg: "#FEF3C7", text: "#D97706" },
  DROPPED_AT_LOCATION: { label: "Dropped at Location", bg: "#E0F2FE", text: "#0369A1" },
  DISPATCHER_ASSIGNED: { label: "Dispatcher Assigned", bg: "#FEF9C3", text: "#CA8A04" },
  IN_TRANSIT_TO_LAB:   { label: "In Transit to Lab",  bg: "#EDE9FE", text: "#7C3AED" },
  SAMPLE_RECEIVED:     { label: "At Lab",             bg: "#DBEAFE", text: "#1D4ED8" },
  TESTING_ONGOING:     { label: "Testing",            bg: "#F3E8FF", text: "#9333EA" },
  DIRECT_TO_LAB:       { label: "Direct to Lab",      bg: "#D1FAE5", text: "#047857" },
  DROP_OFF:            { label: "Drop Off",           bg: "#D1FAE5", text: "#059669" },
  REQUEST_COMPLETED:   { label: "Completed",          bg: "#D1FAE5", text: "#065F46" },
};

const getStatusStyle = (s: string) =>
  STATUS_CONFIG[s] || { label: s.replaceAll("_", " "), bg: "#F3F4F6", text: "#374151" };

const formatDate = (v?: string) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// ── Request card ───────────────────────────────────────────────────────────────

function RequestCard({ item, onPress }: { item: RequestItem; onPress: () => void }) {
  const st = getStatusStyle(item.requestStatus);
  const testNames =
    item.tests?.map((t) => t.name).filter(Boolean).join(", ") || "No tests listed";
  const date = formatDate(item.sampleCollectionDate || item.requestDate);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.86} onPress={onPress}>
      {/* Left status colour strip */}
      <View style={[styles.cardStrip, { backgroundColor: st.text }]} />

      <View style={styles.cardInner}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTests} numberOfLines={2}>
            {testNames}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[styles.statusBadgeText, { color: st.text }]}>{st.label}</Text>
          </View>
        </View>

        {item.pickUpAddress ? (
          <View style={styles.cardMeta}>
            <MaterialIcons name="location-on" size={13} color="#94A3B8" />
            <Text style={styles.cardMetaText} numberOfLines={1}>
              {item.pickUpAddress}
            </Text>
          </View>
        ) : null}

        <View style={styles.cardBottom}>
          {date ? (
            <View style={styles.cardDateRow}>
              <MaterialIcons name="calendar-today" size={12} color="#94A3B8" />
              <Text style={styles.cardDateText}>{date}</Text>
            </View>
          ) : (
            <View />
          )}
          <Text style={styles.cardAmount}>{item.amount || "—"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

const Chat = () => {
  const navigation = useNavigation<any>();

  const { publicHealthAccepted, fetchPHAccepted } =
    GetPublicHealtRequstAccepted(navigation);
  const { individualOrganizationAccepted, fetchIndividualOrganizationAccepted } =
    GetIndividualOrganizationAccepted(navigation);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [tab, setTab] = useState<"ongoing" | "completed">("ongoing");

  const toArray = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.requests)) return value.requests;
    if (Array.isArray(value?.results)) return value.results;
    return [];
  };

  const buildItems = useCallback(() => {
    const indOrg: any[] = toArray(publicHealthAccepted as any);
    const individual: any[] = toArray(individualOrganizationAccepted as any);

    const mapped: RequestItem[] = [...indOrg, ...individual]
      .filter((i) => {
        const s = i.requestStatus;
        return (
          ONGOING_STATUSES.has(s) ||
          s === "REQUEST_COMPLETED" ||
          s === "SAMPLE_COLLECTED"
        );
      })
      .map((item) => ({
        id: item.id,
        amount: item.total ? `₦${item.total}` : "",
        noOfPeople: item.noOfPeople || "",
        noOfEmployees: item.noOfEmployees || "",
        pickUpAddress: item.samplePickUpAddress,
        requestDate: item.requestDate,
        requestStatus: item.requestStatus,
        detailsVisible: false,
        sampleCollectionDate: item.sampleCollectionDate,
        sampleDropOffDate: item.sampleDropOffDate || item.samepleDropOffDate,
        dropOffDistance: item.dropOffDistance,
        distanceCharge: item.distanceCharge,
        pickupDistance: item.pickupDistance,
        sampleStatus: item.sampleStatus,
        phlebotomistEarning: item.phlebotomistEarning,
        balance: item.balance,
        testRequest: Array.isArray(item.publicRequestId)
          ? item.publicRequestId.map((tr: any) => ({
              patientAge: tr.patientAge,
              patientName: tr.patientName,
              status: tr.status,
            }))
          : [],
        tests: Array.isArray(item.publicRequestId)
          ? item.publicRequestId.map((t: any) => ({ name: t.test?.name || "" }))
          : Array.isArray(item.testRequests)
          ? item.testRequests.map((t: any) => ({ name: t.test?.name || "" }))
          : [],
      }));

    setItems(mapped);
  }, [publicHealthAccepted, individualOrganizationAccepted]);

  useEffect(() => {
    setLoading(true);
    buildItems();
    setLoading(false);
  }, [buildItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPHAccepted?.(),
      fetchIndividualOrganizationAccepted?.(),
    ]);
    setRefreshing(false);
  }, [fetchPHAccepted, fetchIndividualOrganizationAccepted]);

  const grouped = useMemo(() => {
    const ongoing = items.filter((i) => ONGOING_STATUSES.has(i.requestStatus));
    const completed = items.filter((i) => i.requestStatus === "REQUEST_COMPLETED");
    return { ongoing, completed };
  }, [items]);

  const current = tab === "ongoing" ? grouped.ongoing : grouped.completed;

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── Dark header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request Activity</Text>
        <Text style={styles.headerSub}>Track ongoing and completed lab tests</Text>

        <View style={styles.statRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{grouped.ongoing.length}</Text>
            <Text style={styles.statLabel}>Ongoing</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{grouped.completed.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{items.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* ── Light surface ─────────────────────────────────────── */}
      <View style={styles.surface}>
        {/* Segmented tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "ongoing" && styles.tabBtnActive]}
            onPress={() => setTab("ongoing")}
          >
            <Text style={[styles.tabText, tab === "ongoing" && styles.tabTextActive]}>
              Ongoing ({grouped.ongoing.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "completed" && styles.tabBtnActive]}
            onPress={() => setTab("completed")}
          >
            <Text style={[styles.tabText, tab === "completed" && styles.tabTextActive]}>
              Completed ({grouped.completed.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : current.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name={tab === "ongoing" ? "science" : "check-circle"}
              size={44}
              color="#CBD5E1"
            />
            <Text style={styles.emptyTitle}>No {tab} tests</Text>
            <Text style={styles.emptySub}>
              {tab === "ongoing"
                ? "Accepted requests appear here once processing starts."
                : "Completed tests will show here."}
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#059669"
                colors={["#059669"]}
              />
            }
          >
            {current.map((item) => (
              <RequestCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate("veiw_order", { itemData: item })}
              />
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0F172A" },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  headerTitle: { color: "#FFFFFF", fontSize: 30, fontWeight: "800" },
  headerSub: { color: "#94A3B8", fontSize: 13, marginTop: 4, marginBottom: 16 },
  statRow: { flexDirection: "row", gap: 8 },
  statChip: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  statNum: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  statLabel: { color: "#64748B", fontSize: 11, marginTop: 2 },

  // Surface
  surface: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 18,
    paddingHorizontal: 16,
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabBtnActive: { backgroundColor: "#FFFFFF" },
  tabText: { color: "#64748B", fontWeight: "700", fontSize: 12 },
  tabTextActive: { color: "#0F172A" },

  // States
  centeredState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { color: "#374151", fontSize: 16, fontWeight: "700" },
  emptySub: { color: "#9CA3AF", fontSize: 13, textAlign: "center", paddingHorizontal: 24 },

  // List
  list: { paddingBottom: 18 },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  cardStrip: { width: 5 },
  cardInner: { flex: 1, padding: 14 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  cardTests: {
    flex: 1,
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 15,
  },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 11, fontWeight: "800" },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 4 },
  cardMetaText: { flex: 1, color: "#64748B", fontSize: 12 },
  cardBottom: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardDateText: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  cardAmount: { color: "#059669", fontWeight: "800", fontSize: 14 },
});

export default Chat;
