import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useConsultationsRedux } from '../../../../hook/useConsultationsRedux';
import { useNavigation } from "@react-navigation/native";
import { useResultReviewsRedux } from "../../../../hook/useResultReviewsRedux";
import { useGetUserDetails } from "../../../../hook/useGetUserDetails";
import { ChevronRight, Clock, RefreshCw, CheckCircle2 } from "lucide-react-native";

// ─── helpers ────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "in-progress" | "completed";

const formatStatus = (status: string) =>
  status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const toStatusFilter = (status: string): Exclude<StatusFilter, "all"> => {
  const s = status.toUpperCase();
  if (s.includes("COMPLETED") || s.includes("COMPLETE")) return "completed";
  if (s.includes("ONGOING") || s.includes("IN_PROGRESS") || s.includes("ACCEPTED")) return "in-progress";
  return "pending";
};

const formatDate = (input?: string) => {
  if (!input) return "Unknown date";
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const formatAmount = (value?: number | string) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return String(value);
  return `₦${num.toLocaleString()}`;
};

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "P";
};

const STATUS_STYLES: Record<Exclude<StatusFilter, "all">, { bg: string; text: string; icon: "clock" | "processing" | "completed"; iconColor: string; metaLabel: string }> = {
  pending: { bg: "bg-[#ffebee]", text: "text-[#cc0000]", icon: "clock", iconColor: "#cc0000", metaLabel: "REQUESTED" },
  "in-progress": { bg: "bg-[#e0f7fa]", text: "text-[#00b8d4]", icon: "processing", iconColor: "#00b8d4", metaLabel: "LAST UPDATE" },
  completed: { bg: "bg-[#e8f5e9]", text: "text-[#2e7d32]", icon: "completed", iconColor: "#2e7d32", metaLabel: "COMPLETED AT" },
};

type RecordItem = {
  id: string;
  type: "consultation" | "review";
  title: string;
  specialty: string;
  date: string;
  statusLabel: string;
  amountLabel: string;
  rawStatus: string;
  patientName: string;
  raw: any;
};

// ─── main screen ────────────────────────────────────────────────────────────

export default function AppointmentsScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const requestType: string = route?.params?.requestType ?? "";
  const type: string = route?.params?.type ?? "";

  const { userData } = useGetUserDetails();
  const [activeTopTab, setActiveTopTab] = useState<"consultation" | "review">("consultation");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    consultations,
    totalCount: consultationsTotalCount,
    offset: consultationsOffset,
    loadMore: loadMoreConsultations,
    reloadConsultations,
    loadingConsultations,
  } = useConsultationsRedux({
    status: "",
    searchTerm: "",
    queueOnly: requestType !== "acceptedOnly",
    doctorId: requestType === "acceptedOnly" ? userData?.id : "",
  });

  const {
    reviews,
    totalCount: reviewsTotalCount,
    offset: reviewsOffset,
    loadMore: loadMoreReviews,
    reloadReviews,
    loadingReviews,
  } = useResultReviewsRedux({
    status: "",
    searchTerm: "",
    patientId: undefined,
    queueOnly: requestType !== "acceptedOnly",
    doctorId: requestType === "acceptedOnly" ? userData?.id : "",
  });

  const consultationRecords: RecordItem[] = useMemo(
    () =>
      (consultations || []).map((item: any) => ({
        id: String(item.id),
        type: "consultation",
        title: "Doctor Consultation",
        specialty: item.requestedDoctorType || "General",
        date: formatDate(item.createdAt),
        statusLabel: formatStatus(item.status || "REQUEST_PLACED"),
        amountLabel: formatAmount(item.totalPaymentSum || item.total),
        rawStatus: String(item.status || "REQUEST_PLACED"),
        patientName:
          `${item?.patient?.firstName || item?.firstName || ""} ${item?.patient?.lastName || item?.lastName || ""}`.trim() ||
          "Patient",
        raw: item,
      })),
    [consultations]
  );

  const reviewRecords: RecordItem[] = useMemo(
    () =>
      (reviews || []).map((item: any) => ({
        id: String(item.id),
        type: "review",
        title: "Lab Result Review",
        specialty: item.requestedDoctorType || "General",
        date: formatDate(item.createdAt),
        statusLabel: formatStatus(item.status || "REQUEST_PLACED"),
        amountLabel: formatAmount(item.totalPaymentSum || item.total),
        rawStatus: String(item.status || "REQUEST_PLACED"),
        patientName:
          `${item?.patient?.firstName || item?.firstName || ""} ${item?.patient?.lastName || item?.lastName || ""}`.trim() ||
          "Patient",
        raw: item,
      })),
    [reviews]
  );

  const activeData = activeTopTab === "consultation" ? consultationRecords : reviewRecords;

  const counts = useMemo(() => {
    const pending = activeData.filter((item) => toStatusFilter(item.rawStatus) === "pending").length;
    const inProgress = activeData.filter((item) => toStatusFilter(item.rawStatus) === "in-progress").length;
    const completed = activeData.filter((item) => toStatusFilter(item.rawStatus) === "completed").length;
    return { all: activeData.length, pending, inProgress, completed };
  }, [activeData]);

  const filteredData = useMemo(
    () => (activeFilter === "all" ? activeData : activeData.filter((item) => toStatusFilter(item.rawStatus) === activeFilter)),
    [activeData, activeFilter]
  );

  const filterTabs = useMemo(() => {
    const tabs: { label: string; value: StatusFilter; count: number }[] = [
      { label: "All", value: "all", count: counts.all },
      { label: "Pending", value: "pending", count: counts.pending },
    ];
    if (requestType === "acceptedOnly") {
      tabs.push({ label: "In Progress", value: "in-progress", count: counts.inProgress });
      tabs.push({ label: "Completed", value: "completed", count: counts.completed });
    }
    return tabs;
  }, [counts, requestType]);

  const loading = activeTopTab === "consultation" ? loadingConsultations : loadingReviews;
  const activeOffset = activeTopTab === "consultation" ? consultationsOffset : reviewsOffset;
  const activeTotalCount = activeTopTab === "consultation" ? consultationsTotalCount : reviewsTotalCount;
  const canLoadMore = activeData.length > 0 && activeOffset < activeTotalCount;
  const isLoadingMore = loading && filteredData.length > 0 && canLoadMore;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([reloadConsultations(), reloadReviews()]);
    } finally {
      setRefreshing(false);
    }
  };

  const openDetails = (item: RecordItem) => {
    if (item.type === "consultation") {
      navigation.navigate("doctor_request_screen", { id: item.id, requestType });
    } else {
      navigation.navigate("review_main_result_screen", { id: item.id, requestType });
    }
  };

  const switchTopTab = (tab: "consultation" | "review") => {
    setActiveTopTab(tab);
    setActiveFilter("all");
  };

  const loadMoreRecords = () => {
    if (loading || refreshing || !canLoadMore) return;
    if (activeTopTab === "consultation") loadMoreConsultations();
    else loadMoreReviews();
  };

  const renderRecordItem = ({ item }: { item: RecordItem }) => {
    const statusKind = toStatusFilter(item.rawStatus);
    const statusStyle = STATUS_STYLES[statusKind];
    const initials = getInitials(item.patientName);
    const shortId = item.id.slice(-6).toUpperCase();

    return (
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-4 mx-4 border border-gray-100 shadow-sm"
        onPress={() => openDetails(item)}
        activeOpacity={0.85}
      >
        {/* Patient Block */}
        <View className="flex-row justify-between items-center pb-3 border-b border-gray-50">
          <View className="flex-row items-center flex-1 pr-2">
            <View className="w-12 h-12 rounded-full bg-[#ccf2f2] items-center justify-center">
              <Text className="font-bold text-sm text-[#004d4d]">{initials}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>
                {item.patientName}
              </Text>
              <Text className="text-gray-400 text-xs font-semibold mt-0.5" numberOfLines={1}>
                {item.title} · {item.specialty} · #{shortId}
              </Text>
            </View>
          </View>

          {/* Status Pill Badge */}
          <View className={`${statusStyle.bg} px-2.5 py-1 rounded-full flex-row items-center space-x-1`}>
            {statusStyle.icon === "clock" && <Clock color={statusStyle.iconColor} size={12} />}
            {statusStyle.icon === "processing" && <RefreshCw color={statusStyle.iconColor} size={12} />}
            {statusStyle.icon === "completed" && <CheckCircle2 color={statusStyle.iconColor} size={12} />}
            <Text className={`${statusStyle.text} text-[10px] font-black tracking-wider ml-0.5`}>
              {item.statusLabel.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Meta Row */}
        <View className="flex-row justify-between items-center pt-3">
          <View className="flex-row">
            <View className="mr-6">
              <Text className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">
                {statusStyle.metaLabel}
              </Text>
              <Text className="text-gray-800 text-[14px] font-bold mt-1">{item.date}</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">AMOUNT</Text>
              <Text className="text-gray-800 text-[14px] font-bold mt-1">{item.amountLabel}</Text>
            </View>
          </View>
          <ChevronRight color="#475569" size={18} strokeWidth={2} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View className="px-4 pt-4">
      {/* Segmented Consultations / Result Reviews switch */}
      <View className="bg-[#e2e8f0] p-1 rounded-xl flex-row justify-between mb-4">
        <TouchableOpacity
          onPress={() => switchTopTab("consultation")}
          className={`flex-1 py-2.5 rounded-lg items-center ${activeTopTab === "consultation" ? "bg-white shadow-sm" : ""}`}
        >
          <Text className={`text-sm font-bold ${activeTopTab === "consultation" ? "text-[#006666]" : "text-gray-500"}`}>
            Consultations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchTopTab("review")}
          className={`flex-1 py-2.5 rounded-lg items-center ${activeTopTab === "review" ? "bg-white shadow-sm" : ""}`}
        >
          <Text className={`text-sm font-bold ${activeTopTab === "review" ? "text-[#006666]" : "text-gray-500"}`}>
            Result Reviews
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="small" color="#006666" />
          <Text className="text-gray-400 text-sm mt-2">Loading records...</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#f8fafc]">
      <StatusBar barStyle="light-content" backgroundColor="#006666" />

      {/* --- TOP HEADER BAR --- */}
      {/* <View className="bg-[#006666] px-4 pt-3 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="mr-1" onPress={() => navigation.goBack()}>
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-xl ml-2">Labtraca</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="mx-2">
            <Search color="#ffffff" size={22} />
          </TouchableOpacity>
          <TouchableOpacity className="mx-1">
            <Menu color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </View> */}

      {/* --- TITLE & FILTER TABS --- */}
      <View className="bg-white border-b border-gray-100 px-4 pt-3 pb-1">
        <Text className="text-[#1e1b4b] text-[13px] font-bold mb-4">{type || "Consultation Requests"}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setActiveFilter(tab.value)}
                className={`pb-3 mr-6 ${isActive ? "border-b-2 border-b-[#006666]" : ""}`}
              >
                <Text className={`text-[11.5px] font-bold ${isActive ? "text-[#006666]" : "text-gray-400"}`}>
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={renderRecordItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          isLoadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#006666" />
              <Text className="text-slate-400 text-xs mt-2">Loading more records...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="px-4">
              <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 items-center">
                <Text className="text-gray-500 pt-2 pb-2">No records found.</Text>
              </View>
            </View>
          ) : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#006666" />}
        onEndReached={loadMoreRecords}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
