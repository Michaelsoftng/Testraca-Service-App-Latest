import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ChevronRight, Star } from "lucide-react-native";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";
import { useRequestsRedux } from "../../../hook/useRequestsRedux";
import formatNaira from "../../../components/FormatNaira";
import getGreeting from "../../../components/greetUser";
import useAuth from "../../../schema/UseAuth";
import axios from "axios";
import { URL_LINK } from "../../../../config";
import { GET_PHLEB_STATS, UPDATE_PHLEBO_USER } from "../../../schema/ApiSchema";
import { useToast } from "../../../lib/utils/functions";
import { useSelector } from "react-redux";

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <View className="w-1/1 p-5 border-slate-100">
      <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{label}</Text>
      <Text className={`text-2xl font-bold ${accent ? "text-[#0f766e]" : "text-black"}`}>{value}</Text>
      <Text className="text-slate-500 text-xs">{sub}</Text>
    </View>
  );
}

type PhlebStats = {
  completed: number;
  pending: number;
  ongoing: number;
  cancelled: number;
  scheduled: number;
  unpaid: number;
  accepted: number;
};

export default function HomePage() {
  const navigation = useNavigation<any>();
  const { userData, reloadUserDetails, loadingUserDetails } = useGetUserDetails();
  const { token } = useAuth(navigation);
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"accepted_request" | "request" | null>(null);
  const [phlebStats, setPhlebStats] = useState<PhlebStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


    const unreadNotificationCount = useSelector((state: any) => state.notifications.unreadCount);

  const { totalCount, loadingRequests: loadingAvailableRequests, reloadRequests: reloadAvailableRequests } = useRequestsRedux({
    requestStatus: "",
    searchTerm: "",
    queueOnly: true,
    phlebotomistId: "",
  });

  const assigneeId = userData?.id || "";

  const { totalCount: acceptedCount, loadingRequests: loadingAcceptedRequests, reloadRequests: reloadAcceptedRequests } = useRequestsRedux({
    requestStatus: "REQUEST_ACCEPTED",
    searchTerm: "",
    queueOnly: false,
    phlebotomistId: assigneeId,
  });

  const { totalCount: completedCount, loadingRequests: loadingCompletedRequests, reloadRequests: reloadCompletedRequests } = useRequestsRedux({
    requestStatus: "REQUEST_COMPLETED",
    searchTerm: "",
    queueOnly: false,
    phlebotomistId: assigneeId,
  });

  const rating = useMemo(() => Number(userData?.phlebotomist?.rating || 4.8).toFixed(2), [userData?.phlebotomist?.rating]);

  const openRequestTypePicker = (target: "accepted_request" | "request") => {
    setPickerTarget(target);
    setPickerVisible(true);
  };

  const closeRequestTypePicker = () => {
    setPickerVisible(false);
    setPickerTarget(null);
  };

  const handleRequestTypeSelect = (userTypes: "INDIVIDUAL" | "PH" | "PREFERRED") => {
    if (userTypes === "PREFERRED") {
      navigation.navigate("preferred_requests_screen");
      closeRequestTypePicker();
      return;
    }
    if (!pickerTarget) return;
    navigation.navigate(pickerTarget, { userTypes });
    closeRequestTypePicker();
  };

  const GoOnline = async () => {
    if (!token || !userData?.id) return;

    setStatusUpdating(true);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: UPDATE_PHLEBO_USER,
          variables: {
            userId: userData.id,
            updateData: {
              online: true,
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

      const nextOnline = response?.data?.data?.UpdateUser?.user?.phlebotomist?.online;
      setIsOnline(Boolean(nextOnline));
      reloadUserDetails();
      showToast("success", "You are online", "You can now receive new requests.");
    } catch (error: any) {
      showToast(
        "error",
        "Could not go online",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Please try again."
      );
      console.error("GoOnline failed:", error?.message || error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const Gooffline = async () => {
    if (!token || !userData?.id) return;

    setStatusUpdating(true);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: UPDATE_PHLEBO_USER,
          variables: {
            userId: userData.id,
            updateData: {
              online: false,
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

      const nextOnline = response?.data?.data?.UpdateUser?.user?.phlebotomist?.online;
      setIsOnline(Boolean(nextOnline));
      reloadUserDetails();
      showToast("success", "You are offline", "You will not receive new requests while offline.");
    } catch (error: any) {
      showToast(
        "error",
        "Could not go offline",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Please try again."
      );
      console.error("Gooffline failed:", error?.message || error);
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    setIsOnline(Boolean(userData?.phlebotomist?.online));
  }, [userData?.phlebotomist?.online]);

  const fetchPhlebStats = useCallback(async () => {
    if (!token || !assigneeId) {
      setStatsLoading(false);
      return;
    }

    try {
      setStatsLoading(true);
      const response = await axios.post(
        URL_LINK,
        {
          query: GET_PHLEB_STATS,
          variables: { phlebId: assigneeId },
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

      const stats = response?.data?.data?.getRequestStatsByUser;
      console.log("Fetched phleb stats::::::  ", stats);
      if (stats) {
        setPhlebStats({
          completed: Number(stats.completed || 0),
          pending: Number(stats.pending || 0),
          ongoing: Number(stats.ongoing || 0),
          cancelled: Number(stats.cancelled || 0),
          scheduled: Number(stats.scheduled || 0),
          unpaid: Number(stats.unpaid || 0),
          accepted: Number(stats.accepted || 0),
        });
      }
    } catch (error: any) {
      console.error("Fetch phleb stats failed:", error?.message || error);
    } finally {
      setStatsLoading(false);
    }
  }, [token, assigneeId]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        reloadUserDetails?.(),
        reloadAvailableRequests?.(),
        reloadAcceptedRequests?.(),
        reloadCompletedRequests?.(),
        fetchPhlebStats(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPhlebStats, reloadAvailableRequests, reloadAcceptedRequests, reloadCompletedRequests, reloadUserDetails]);

  useEffect(() => {
    fetchPhlebStats();
  }, [fetchPhlebStats]);

  const isHomeDataLoading =
    loadingUserDetails ||
    loadingAvailableRequests ||
    loadingAcceptedRequests ||
    loadingCompletedRequests ||
    statsLoading;

  const availableCount = phlebStats?.pending ?? totalCount ?? 0;
  const acceptedCountValue = phlebStats?.accepted ?? acceptedCount ?? 0;
  const completedCountValue = phlebStats?.completed ?? completedCount ?? 0;

  if (isHomeDataLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="text-slate-500 mt-3">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f766e' }}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0D9488" />}
      >
        <View className="bg-[#0f766e] p-6 pt-10 rounded-b-[40px] mb-10">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-slate-200 text-lg">{getGreeting()}</Text>
              <Text className="text-white text-3xl font-bold">{`${userData?.firstName || "Phlebo"} ${userData?.lastName || ""}`.trim()}</Text>
              <Text className="text-slate-200 text-xs mt-1">{userData?.phlebotomist?.uniqueId || "PHLEBOTOMIST"}</Text>
            </View>
            <View className="items-end">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30">
                <Text className="text-white font-bold text-lg">
                  {String(userData?.firstName?.[0] || "P").toUpperCase()}
                </Text>
              </View>
              <View className="mt-4 p-2 bg-white/10 rounded-full">
                <TouchableOpacity
                          className="relative"
                          onPress={() => navigation.navigate('notification_inbox_screen')}
                        >
                          <Ionicons name="notifications-outline" size={24} color="#00D2C4" />
                          {unreadNotificationCount > 0 && (
                            <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (statusUpdating) return;
                if (isOnline) {
                  Gooffline();
                } else {
                  GoOnline();
                }
              }}
              className={`flex-row items-center px-4 py-2 rounded-full border mr-3 ${
                isOnline
                  ? "bg-teal-500/30 border-teal-300"
                  : "bg-slate-500/25 border-slate-300"
              }`}
            >
              {statusUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className={`w-2 h-2 rounded-full mr-2 ${isOnline ? "bg-teal-300" : "bg-slate-300"}`} />
              )}
              <Text className="text-white font-semibold">{statusUpdating ? "Updating..." : isOnline ? "Go offline" : "Go online"}</Text>
            </TouchableOpacity>
            <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-full border border-white/30">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text className="text-white font-semibold ml-1">{rating} rating</Text>
            </View>
          </View>
        </View>

        <View className="px-6 -mt-12">
          <View className="bg-white rounded-3xl border border-slate-100 flex-row flex-wrap">
            <View className="w-1/2 border-b border-r border-slate-100">
              <StatTile label="Available" value={`${totalCount || 0}`} sub="New requests" />
            </View>
            <View className="w-1/2 border-b border-slate-100">
              <StatTile label="Accepted" value={`${acceptedCountValue}`} sub="In progress" />
            </View>
            <View className="w-1/2 border-r border-slate-100">
              <StatTile
                label="Earning Today"
                value={formatNaira(userData?.userWallet?.amount?.toLocaleString() || "0")}
                sub="Pending payout"
                accent
              />
            </View>
            <View className="w-1/2">
              <StatTile label="Completed" value={`${completedCountValue}`} sub="Completed requests" />
            </View>
          </View>
        </View>

        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-700 font-bold text-lg">ACCEPTED REQUESTS</Text>
            <TouchableOpacity onPress={() => openRequestTypePicker("accepted_request")}> 
              <Text className="text-[#0f766e] font-bold">View</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-white border-2 border-[#0f766e]/20 rounded-2xl p-4 flex-row items-center"
            onPress={() => openRequestTypePicker("accepted_request")}
            activeOpacity={0.85}
          >
            <View className="w-12 h-12 bg-teal-50 rounded-xl items-center justify-center mr-4">
              <MaterialCommunityIcons name="map-marker-radius-outline" size={24} color="#0f766e" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg text-slate-800">Current accepted requests</Text>
              <Text className="text-slate-400 text-sm">Manage pickups, drop-offs and progress.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0f766e" />
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-8 mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-700 font-bold text-lg">NEW REQUESTS</Text>
            <TouchableOpacity onPress={() => openRequestTypePicker("request")}> 
              <Text className="text-[#0f766e] font-bold">All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-white rounded-3xl p-5 border border-slate-100" onPress={() => openRequestTypePicker("request")}>
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg text-slate-800">You have {totalCount || 0} available requests</Text>
              <View className="bg-teal-50 px-3 py-1 rounded-full">
                <Text className="text-[#0f766e] text-xs font-bold">Queue </Text>
              </View>
              <View className="w-12 h-8 bg-teal-50 rounded-xl items-center justify-center mr-4">
              <Ionicons name="chevron-forward" size={20} color="#0f766e" />
              </View>
            </View>
            <Text className="text-slate-500 mt-1">Tap to view request details and accept the next job.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={closeRequestTypePicker}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeRequestTypePicker}
          className="flex-1 bg-black/40 items-center justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => null}
            className="w-full bg-white rounded-t-[32px] px-6 pt-5 pb-8"
          >
            <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-4" />
            <Text className="text-slate-800 text-lg font-bold">Choose request type</Text>
            <Text className="text-slate-500 mt-1 mb-5">
              Select what you want to view for {pickerTarget === "accepted_request" ? "Accepted Requests" : "Request Queue"}.
            </Text>


            <TouchableOpacity
              className="bg-teal-800 rounded-2xl py-4 px-4 flex-row justify-between items-center mb-3"
              onPress={() => handleRequestTypeSelect("INDIVIDUAL")}
            >
              <View>
                <Text className="text-white font-bold text-base">Individual / Organization</Text>
                <Text className="text-white/80 text-xs mt-1">Standard lab requests</Text>
              </View>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 flex-row justify-between items-center mb-3"
              onPress={() => handleRequestTypeSelect("PH")}
            >
              <View>
                <Text className="text-teal-950 font-bold text-base">Public Health</Text>
                <Text className="text-slate-500 text-xs mt-1">Public health campaigns</Text>
              </View>
              <ChevronRight size={18} color="#0D9488" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-cyan-50/50 border border-cyan-100 rounded-2xl py-4 px-4 flex-row justify-between items-center"
              onPress={() => handleRequestTypeSelect("PREFERRED")}
            >
              <View>
                <View className="flex-row items-center">
                  <Star size={16} color="#0D9488" fill="#0D9488" />
                  <Text className="text-teal-950 font-bold text-base ml-1.5">Preferred Requests</Text>
                </View>
                <Text className="text-slate-500 text-xs mt-1">Your curated request list</Text>
              </View>
              <ChevronRight size={18} color="#0D9488" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      </View>
    </SafeAreaView>
  );
}
