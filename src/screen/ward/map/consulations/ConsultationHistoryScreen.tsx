import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, CheckCircle2, Archive, ChevronDown, ClipboardList, Search, Menu } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useConsultationsRedux } from "../../../../hook/useConsultationsRedux";
import { useResultReviewsRedux } from "../../../../hook/useResultReviewsRedux";
import { useGetUserDetails } from "../../../../hook/useGetUserDetails";

// ─── types & utils ───────────────────────────────────────────────────────────

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
};

type StatusFilter = "all" | "pending" | "in-progress" | "completed";

const formatStatus = (status: string) =>
  (status || "REQUEST_PLACED")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const toStatusFilter = (status: string): StatusFilter => {
  const s = status.toUpperCase();
  if (s.includes("COMPLETED")) return "completed";
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

// ─── filter chip ─────────────────────────────────────────────────────────────

function FilterChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${active ? "bg-emerald-600 border-emerald-600" : "bg-white border-gray-200"}`}
    >
      <Text className={`${active ? "text-white" : "text-gray-600"} font-medium`}>
        {label} {typeof count === "number" ? `(${count})` : ""}
      </Text>
    </TouchableOpacity>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function ConsultationHistoryScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { userData } = useGetUserDetails();
  const [activeTopTab, setActiveTopTab] = useState<"consultation" | "review">("consultation");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    consultations,
    totalCount: consultationsTotalCount,
    loadMore: loadMoreConsultations,
    reloadConsultations,
    loadingConsultations,
    loadingMore: loadingMoreConsultations, // FIX: destructure pagination-specific loading state
    errorConsultations,
  } = useConsultationsRedux({ status: "", searchTerm: "", doctorId: userData?.id });

  const {
    reviews,
    totalCount: reviewsTotalCount,
    loadMore: loadMoreReviews,
    reloadReviews,
    loadingReviews,
    loadingMore: loadingMoreReviews, // FIX: destructure pagination-specific loading state
    errorReviews,
  } = useResultReviewsRedux({ status: "", searchTerm: "", patientId: undefined, doctorId: userData?.id });

  const consultationRecords: RecordItem[] = useMemo(
    () =>
      (consultations || []).map((item: any) => ({
        id: String(item.id),
        type: "consultation",
        title: "Doctor Consultation",
        specialty: item.requestedDoctorType || "General",
        date: formatDate(item.createdAt),
        statusLabel: formatStatus(item.requestStatus || "REQUEST_PLACED"),
        amountLabel: formatAmount(item.totalPaymentSum || item.total),
        rawStatus: String(item.requestStatus || "REQUEST_PLACED"),
        patientName:
          `${item?.patient?.firstName || item?.firstName || ""} ${item?.patient?.lastName || item?.lastName || ""}`.trim() ||
          "Patient",
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
        statusLabel: formatStatus(item.requestStatus || "REQUEST_PLACED"),
        amountLabel: formatAmount(item.totalPaymentSum || item.total),
        rawStatus: String(item.requestStatus || "REQUEST_PLACED"),
        patientName:
          `${item?.patient?.firstName || item?.firstName || ""} ${item?.patient?.lastName || item?.lastName || ""}`.trim() ||
          "Patient",
      })),
    [reviews]
  );

  const activeData = activeTopTab === "consultation" ? consultationRecords : reviewRecords;
  const activeTotalCount = activeTopTab === "consultation" ? consultationsTotalCount : reviewsTotalCount;

  const counts = useMemo(() => {
    const pending = activeData.filter((item) => toStatusFilter(item.rawStatus) === "pending").length;
    const inProgress = activeData.filter((item) => toStatusFilter(item.rawStatus) === "in-progress").length;
    const completed = activeData.filter((item) => toStatusFilter(item.rawStatus) === "completed").length;
    return { all: activeData.length, pending, inProgress, completed };
  }, [activeData]);

  const filteredData = useMemo(
    () =>
      activeFilter === "all"
        ? activeData
        : activeData.filter((item) => toStatusFilter(item.rawStatus) === activeFilter),
    [activeData, activeFilter]
  );

  const loading = activeTopTab === "consultation" ? loadingConsultations : loadingReviews;
  const hasError = activeTopTab === "consultation" ? Boolean(errorConsultations) : Boolean(errorReviews);

  // FIX: canLoadMore compares locally accumulated count against the server total.
  // Previous logic used `activeOffset < activeTotalCount` which could diverge from
  // reality; `activeData.length < activeTotalCount` is always accurate.
  const canLoadMore = activeData.length > 0 && activeData.length < activeTotalCount;

  // FIX: use the hook's dedicated `loadingMore` flag (set only during fetchMore calls)
  // instead of the general `loading` flag (set during the initial query and refetches).
  // Previously `loading` was true during initial load too, hiding the footer spinner
  // on pagination and making the indicator logic unreliable.
  const activeLoadingMore =
    activeTopTab === "consultation" ? loadingMoreConsultations : loadingMoreReviews;
  const isLoadingMore = activeLoadingMore && canLoadMore;

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
      navigation.navigate("doctor_request_screen", { id: item.id, requestType: "acceptedOnly" });
    } else {
      navigation.navigate("review_main_result_screen", { id: item.id, requestType: "acceptedOnly" });
    }
  };

  const loadMoreRecords = () => {
    if (loading || refreshing || !canLoadMore) return;
    if (activeTopTab === "consultation") loadMoreConsultations();
    else loadMoreReviews();
  };

  const renderRecordItem = ({ item, index }: { item: RecordItem; index: number }) => {
    const isReview = item.type === "review";
    const statusKind = toStatusFilter(item.rawStatus);
    const dateHeader = index === 0 || (index > 0 && filteredData[index - 1]?.date !== item.date) ? item.date : null;

    const avatarBg = isReview ? "bg-[#e0e0ff]" : "bg-[#006666]";
    const avatarText = isReview ? "text-[#4d4db3]" : "text-white";
    const initials = item.patientName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "PA";

    const tagBg = statusKind === "pending" ? "bg-[#ffe0e0]" : statusKind === "completed" ? "bg-[#d2e7e7]" : "bg-[#008b8b]";
    const tagText = statusKind === "pending" ? "text-[#cc0000]" : statusKind === "completed" ? "text-[#006666]" : "text-white";
    const tagLabel = statusKind === "pending" ? "PENDING" : statusKind === "completed" ? "COMPLETED" : "IN PROGRESS";

    return (
      <View key={`${item.type}-${item.id}`} className="mb-1">
        {/* Conditional Section Date Header */}
        {dateHeader && (
          <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3 mt-2 px-4">
            {dateHeader.toUpperCase()}
          </Text>
        )}

        {/* Row Layout containing Avatar Timeline Axis & Content Card */}
        <View className="flex-row items-stretch min-h-[140px] px-4 mb-4">
          {/* Timeline Vertical Axis Left Column */}
          <View className="items-center w-12 mr-3 relative">
            {/* Initials Circle */}
            <View className={`w-12 h-12 rounded-full ${avatarBg} items-center justify-center z-10 shadow-sm`}>
              <Text className={`font-bold text-base ${avatarText}`}>{initials}</Text>
            </View>

            {/* Vertical Connector Line */}
            {index < filteredData.length - 1 && (
              <View className="absolute top-12 bottom-0 w-[1.5px] bg-gray-300 z-0" />
            )}
          </View>

          {/* Consultation Card Component */}
          <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm justify-between">
            {/* Card Header Layer */}
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text className="text-gray-900 font-bold text-[17px]">{item.patientName}</Text>
                <Text className="text-gray-500 text-xs font-medium mt-0.5">
                  {item.title} • {item.specialty}
                </Text>
              </View>

              {/* Specialized Colored Badge */}
              <View className={`${tagBg} px-2.5 py-1 rounded-md`}>
                <Text className={`${tagText} text-[10px] font-black tracking-wider`}>
                  {tagLabel}
                </Text>
              </View>
            </View>

            {/* Card Action / Status Layer */}
            <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-50">
              <View className="flex-row items-center space-x-1">
                {statusKind === "completed" ? (
                  <CheckCircle2 color="#006666" size={16} />
                ) : (
                  <Archive color="#006666" size={16} />
                )}
                <Text className="text-[#006666] font-semibold text-xs ml-1">
                  {item.statusLabel}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-[#006666] flex-row items-center pl-4 pr-3 py-2 rounded-lg"
                onPress={() => openDetails(item)}
              >
                <Text className="text-white font-bold text-xs mr-0.5">View Summary</Text>
                <ChevronRight color="#ffffff" size={14} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* --- TOP HEADER BAR --- */}
      <View className="bg-[#008b8b] px-4 pt-3 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center space-x-2">
          <ClipboardList color="#ffffff" size={24} />
          <Text className="text-white font-bold text-2xl ml-2">Labtraca</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="mx-2">
            <Search color="#ffffff" size={22} />
          </TouchableOpacity>
          <TouchableOpacity className="mx-1">
            <Menu color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pt-5">
        {/* Screen Title */}
        <Text className="text-[#1e1b4b] text-2xl font-bold mb-4">Consultation History</Text>

        {/* --- METRIC CARDS GRID --- */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100 flex-row justify-between shadow-sm mb-6">
          <View className="flex-1">
            <Text className="text-gray-500 text-xs font-semibold tracking-wide">Total Interactions</Text>
            <Text className="text-[#006666] text-2xl font-black mt-1">{activeTotalCount}</Text>
          </View>
          <View className="w-[1px] bg-gray-200 my-1 mx-4" />
          <View className="flex-1 pl-2">
            <Text className="text-gray-500 text-xs font-semibold tracking-wide">This Month</Text>
            <Text className="text-[#006666] text-2xl font-black mt-1">{counts.all}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#f8fafc]">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <FlatList
        data={filteredData}
        keyExtractor={(item, idx) => `${item.type}-${item.id}-${idx}`}
        renderItem={renderRecordItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <>
            {loading && !refreshing ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="small" color="#008b8b" />
                <Text className="text-gray-400 text-sm mt-2">Loading records...</Text>
              </View>
            ) : null}

            {hasError && !loading ? (
              <View className="py-4 px-4">
                <Text className="text-red-500 text-sm">Unable to fetch records. Pull down to refresh.</Text>
              </View>
            ) : null}

            {isLoadingMore ? (
              <View className="py-4 items-center px-4">
                <ActivityIndicator size="small" color="#008b8b" />
                <Text className="text-slate-400 text-xs mt-2">Loading more records...</Text>
              </View>
            ) : null}

            {!loading && filteredData.length === 0 ? (
              <View className="px-4">
                <View className="bg-white p-4 rounded-2xl mb-4 border border-gray-100">
                  <Text className="text-gray-500">No records found.</Text>
                </View>
              </View>
            ) : null}

            {!isLoadingMore && canLoadMore && (
              <TouchableOpacity
                className="flex-row items-center justify-center py-4 mb-10 px-4"
                onPress={loadMoreRecords}
              >
                <ChevronDown color="#006666" size={18} strokeWidth={2.5} />
                <Text className="text-[#006666] font-bold text-xs ml-1">Show Older Records</Text>
              </TouchableOpacity>
            )}
          </>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMoreRecords}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}
