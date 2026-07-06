import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Bell } from "lucide-react-native";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import BottomTabs from "../../../components/BottomTabs";

type GroupBy = "DAILY" | "WEEKLY" | "MONTHLY";

const GROUP_CONFIG: Record<GroupBy, { limit: number; offset: number }> = {
  DAILY: { limit: 14, offset: 0 },
  WEEKLY: { limit: 12, offset: 0 },
  MONTHLY: { limit: 12, offset: 0 },
};

const MY_EARNINGS_HISTORY = gql`
  query GetMyEarningsHistory(
    $groupBy: String!
    $startDate: Date
    $endDate: Date
    $limit: Int
    $offset: Int
  ) {
    myEarningsHistory(
      groupBy: $groupBy
      startDate: $startDate
      endDate: $endDate
      limit: $limit
      offset: $offset
    ) {
      summary {
        totalEarnings
        paidEarnings
        pendingEarnings
        projectedEarnings
        todayEarnings
        thisWeekEarnings
        thisMonthEarnings
      }
      groupsCount
      entriesCount
      groups {
        label
        periodStart
        periodEnd
        totalAmount
        earningsCount
        entries {
          sourceId
          sourceType
          title
          description
          amount
          earnedAt
          status
          isPaid
          transactionId
          reference
        }
      }
    }
  }
`;

const MY_PAYOUT_DASHBOARD = gql`
  query GetMyPayoutDashboard($period: String!, $recentLimit: Int) {
    myPayoutDashboard(period: $period, recentLimit: $recentLimit) {
      role
      period
      periodStart
      periodEnd
      currentPeriodEarnings
      withdrawableBalance
      pendingPayoutAmount
      pendingPayoutCount
      processingPayoutAmount
      processingPayoutCount
      totalPaidOut
      totalPaidOutCount
      referralCode
      breakdown {
        sourceType
        label
        amount
        count
      }
      stats {
        key
        label
        value
        secondaryValue
      }
      recentPayouts {
        payoutId
        amountRequested
        amountPaid
        status
        createdAt
        reference
        bankName
        accountName
      }
    }
  }
`;

const sourceIconByType: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  DOCTOR_CONSULTATION: "medical-services",
  DOCTOR_RESULT_REVIEW: "description",
  PHLEBOTOMIST: "local-shipping",
  DISPATCHER: "directions-bike",
  FACILITY: "apartment",
  PROFESSIONAL_COMMISSION: "workspace-premium",
  REFERRAL_BONUS: "redeem",
};

const formatCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const tabLabel = (tab: GroupBy) => tab.charAt(0) + tab.slice(1).toLowerCase();

export default function WithdrawEarns() {
  const navigation = useNavigation<any>();
  const [groupBy, setGroupBy] = useState<GroupBy>("MONTHLY");
  const [refreshing, setRefreshing] = useState(false);

  const [loadHistory, { data: historyData, loading: historyLoading, error: historyError }] = useLazyQuery<any, any>(
    MY_EARNINGS_HISTORY,
    { fetchPolicy: "network-only" }
  );

  console.log("History query loading:", historyLoading);
  console.log("History query error:", historyError);
  console.log("History query data:", historyData);
  const [loadDashboard, { data: dashboardData, loading: dashboardLoading, error: dashboardError }] = useLazyQuery<any, any>(
    MY_PAYOUT_DASHBOARD,
    { fetchPolicy: "network-only" }
  );
  console.log("Dashboard query loading:", dashboardLoading);
  console.log("Dashboard query error:", dashboardError);
  console.log("Dashboard query data:", dashboardData);

  const fetchDashboardAndHistory = useCallback(async () => {
    await loadDashboard({ variables: { period: "MONTHLY", recentLimit: 5 } });
  }, [loadDashboard]);

  useEffect(() => {
    fetchDashboardAndHistory();
  }, [fetchDashboardAndHistory]);

  useEffect(() => {
    if (!dashboardData) return;
    const config = GROUP_CONFIG[groupBy];
    loadHistory({
      variables: {
        groupBy,
        limit: config.limit,
        offset: config.offset,
      },
    });
  }, [dashboardData, groupBy, loadHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardAndHistory();
    } finally {
      setRefreshing(false);
    }
  };

  const payout = dashboardData?.myPayoutDashboard;
  console.log("Payout dashboard data:", payout);
  const history = historyData?.myEarningsHistory;

  console.log("Parsed payout dashboard data:", payout);
  const withdrawableBalance = Number(payout?.withdrawableBalance || 0);
  console.log("Withdrawable balance:", withdrawableBalance);
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-teal-950 px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <MaterialIcons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Earnings</Text>
        </View>
        <Bell size={20} color="#fff" />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 mt-6 mb-4">
          <Text className="text-2xl font-bold text-slate-900">Earnings History</Text>
        </View>

        <View className="flex-row bg-slate-200/70 p-1 rounded-xl mx-6 mb-6">
          {(["DAILY", "WEEKLY", "MONTHLY"] as GroupBy[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setGroupBy(tab)}
              className={`flex-1 h-10 rounded-lg items-center justify-center ${
                groupBy === tab ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text className={`font-bold text-sm ${groupBy === tab ? "text-teal-950" : "text-slate-500"}`}>
                {tabLabel(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(dashboardLoading || historyLoading) && !history ? (
          <View className="py-16 items-center">
            <ActivityIndicator size="large" color="#0D9488" />
            <Text className="text-gray-500 mt-3">Loading earnings...</Text>
          </View>
        ) : null}

        {dashboardError || historyError ? (
          <View className="px-6 mt-8">
            <View className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <Text className="text-red-700 font-semibold">Unable to load earnings data.</Text>
              <TouchableOpacity onPress={fetchDashboardAndHistory} className="mt-2">
                <Text className="text-red-700 font-bold">Tap to retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {history ? (
          <View className="px-6 mt-2 mb-10">
            <View className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5 mb-4">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Earnings</Text>
              <Text className="text-teal-950 text-3xl font-black mb-4">{formatCurrency(history?.summary?.totalEarnings)}</Text>
              <View className="border-t border-slate-100 pt-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Paid</Text>
                  <Text className="text-teal-700 font-bold">{formatCurrency(history?.summary?.paidEarnings)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Pending</Text>
                  <Text className="text-amber-600 font-bold">{formatCurrency(history?.summary?.pendingEarnings)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Projected</Text>
                  <Text className="text-teal-700 font-bold">{formatCurrency(history?.summary?.projectedEarnings)}</Text>
                </View>
              </View>
            </View>

            <View className="bg-teal-50/60 border border-teal-100 rounded-2xl p-4 flex-row items-center justify-between mb-6">
              <View className="flex-1 mr-3">
                <Text className="text-teal-800/70 text-xs font-bold uppercase">Withdrawable balance</Text>
                <Text className="text-teal-950 text-xl font-bold mt-1">{formatCurrency(payout?.withdrawableBalance)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("request_earning")}
                disabled={withdrawableBalance <= 0}
                className={`px-4 py-3 rounded-xl ${withdrawableBalance > 0 ? "bg-teal-800" : "bg-teal-100"}`}
              >
                <Text className={`font-bold text-sm ${withdrawableBalance > 0 ? "text-white" : "text-teal-400"}`}>
                  Request withdrawal
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-slate-500 font-bold uppercase tracking-widest mb-4">Earnings history</Text>

            {(history?.groups || []).map((group: any) => (
              <View key={`${group.label}-${group.periodStart}`} className="mb-4">
                <View className="flex-row justify-between items-center mb-2 px-1">
                  <Text className="text-slate-900 font-bold text-base">{group.label}</Text>
                  <Text className="text-teal-800 font-bold">{formatCurrency(group.totalAmount)}</Text>
                </View>

                {(group.entries || []).map((entry: any) => {
                  const iconName = sourceIconByType[entry.sourceType] || "payments";
                  const status = String(entry.status || "pending").toLowerCase();
                  const statusStyle =
                    status === "paid"
                      ? "text-teal-700 bg-teal-50"
                      : status === "projected"
                      ? "text-blue-700 bg-blue-50"
                      : "text-amber-700 bg-amber-50";

                  return (
                    <View key={`${entry.sourceId}-${entry.earnedAt}-${entry.title}`} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-2">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-row flex-1 pr-3">
                          <View className="bg-teal-50 rounded-xl p-2 mr-3 mt-0.5">
                            <MaterialIcons name={iconName} size={18} color="#0D9488" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-slate-900 font-semibold">{entry.title || entry.sourceType}</Text>
                            <Text className="text-slate-400 text-xs mt-0.5">{entry.description || "No description"}</Text>
                            <Text className="text-slate-400 text-xs mt-0.5">
                              {entry.earnedAt ? new Date(entry.earnedAt).toLocaleString() : ""}
                            </Text>
                            {!!entry.reference && (
                              <Text className="text-slate-400 text-xs mt-0.5">Ref: {entry.reference}</Text>
                            )}
                          </View>
                        </View>

                        <View className="items-end">
                          <Text className="text-slate-900 font-bold">{formatCurrency(entry.amount)}</Text>
                          <View className={`px-2 py-1 rounded-full mt-1 ${statusStyle}`}>
                            <Text className="text-[10px] font-bold uppercase">{status}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}

            {!history?.groups?.length && (
              <View className="bg-white rounded-2xl p-5 mb-6 border border-slate-100 items-center">
                <MaterialIcons name="analytics" size={28} color="#94A3B8" />
                <Text className="text-slate-900 font-semibold mt-3">No earnings entries yet</Text>
                <Text className="text-slate-500 text-center mt-1">
                  Completed earnings will show up here once this account starts receiving payouts.
                </Text>
              </View>
            )}

            {!!payout?.recentPayouts?.length && (
              <>
                <Text className="text-slate-500 font-bold uppercase tracking-widest mb-4 mt-2">Recent payouts</Text>
                {payout.recentPayouts.map((item: any) => (
                  <View key={item.payoutId} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-slate-900">
                        {formatCurrency(item.amountPaid || item.amountRequested)}
                      </Text>
                      <Text className="text-xs text-slate-500 uppercase">{item.status}</Text>
                    </View>
                    <Text className="text-xs text-slate-500 mt-1">
                      {item.bankName || "Bank"} • {item.accountName || "Account"}
                    </Text>
                    {!!item.reference && <Text className="text-xs text-slate-400 mt-1">Ref: {item.reference}</Text>}
                  </View>
                ))}
              </>
            )}

            {!payout?.recentPayouts?.length && (
              <View className="bg-white rounded-2xl p-5 border border-slate-100 items-center">
                <MaterialIcons name="history-toggle-off" size={28} color="#94A3B8" />
                <Text className="text-slate-900 font-semibold mt-3">No payouts yet</Text>
                <Text className="text-slate-500 text-center mt-1">
                  Your withdrawal requests will appear here after you submit the first one.
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
      <BottomTabs activeTab="Earnings" />
    </SafeAreaView>
  );
}
