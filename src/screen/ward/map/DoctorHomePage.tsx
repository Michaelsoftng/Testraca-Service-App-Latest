import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MessageSquare, FileSpreadsheet, Star, Clock, Settings } from "lucide-react-native";
import formatNaira from "../../../components/FormatNaira";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";
import { useConsultationsRedux } from "../../../hook/useConsultationsRedux";
import { useAcceptedConsultationsRedux } from "../../../hook/useConsultationsAcceptedRedux";
import { useResultReviewsRedux } from "../../../hook/useResultReviewsRedux";
import { useAcceptedResultReviewsRedux } from "../../../hook/useAcceptedResultReviewsRedux";
import axios from "axios";
import { URL_LINK } from "../../../../config";
import { UPDATE_PHLEBO_USER } from "../../../schema/ApiSchema";
import useAuth from "../../../schema/UseAuth";
import { useToast } from "../../../lib/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function DoctorHomePage() {
  const navigation = useNavigation<any>();
  const { userData, reloadUserDetails } = useGetUserDetails();
  const { token } = useAuth(navigation);
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
const unreadNotificationCount = useSelector((state: any) => state.notifications.unreadCount);

  const { totalCount, reloadConsultations } = useConsultationsRedux({ status: "", searchTerm: "", queueOnly: true, doctorId: "" });
  const { totalCount: reviewTotalCount, reloadReviews } = useResultReviewsRedux({ status: "", searchTerm: "", patientId: "", doctorId: "", queueOnly: true });
  const { totalCount: acceptedConsultationCount, reloadConsultations: reloadAcceptedConsultations } = useAcceptedConsultationsRedux({ status: "", searchTerm: "", queueOnly: "", doctorId: userData?.id });
  const { totalCount: acceptedReviewCount, reloadReviews: reloadAcceptedReviews } = useAcceptedResultReviewsRedux({
    status: "",
    searchTerm: "",
    patientId: "",
    doctorId: userData?.id,
    queueOnly: "",
  });

  const pendingQueue = useMemo(() => (totalCount || 0) + (reviewTotalCount || 0), [totalCount, reviewTotalCount]);
  const activeCount = useMemo(
    () => (acceptedConsultationCount || 0) + (acceptedReviewCount || 0),
    [acceptedConsultationCount, acceptedReviewCount]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        reloadUserDetails?.(),
        reloadConsultations?.(),
        reloadAcceptedConsultations?.(),
        reloadReviews?.(),
        reloadAcceptedReviews?.(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [reloadAcceptedConsultations, reloadAcceptedReviews, reloadConsultations, reloadReviews, reloadUserDetails]);

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

      const nextOnline = response?.data?.data?.UpdateUser?.user?.doctor?.online;
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

      const nextOnline = response?.data?.data?.UpdateUser?.user?.doctor?.online;
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
    setIsOnline(Boolean(userData?.doctor?.online));
  }, [userData?.doctor?.online]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#111827' }}>
      <View className="flex-1 bg-[#f8fafc]">

        {/* --- TOP BRANDED NAVIGATION BAR --- */}
        <View className="bg-[#111827] px-4 pt-3 pb-4 flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2">
            <Text className="text-white font-bold text-2xl tracking-wide">Labtraca</Text>
            <View className="bg-[#007a7a] px-2 py-0.5 rounded-md ml-1.5">
              <Text className="text-white font-black text-[9px] tracking-wider">CLINICAL</Text>
            </View>
          </View>

          {/* Doctor Status Badge Pill - tap to toggle online/offline */}
          <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={statusUpdating}
            onPress={() => (isOnline ? Gooffline() : GoOnline())}
            className="bg-[#1f2937] border border-gray-800 rounded-full pl-1 pr-3 py-1 flex-row items-center space-x-2"
          >
            <View className="w-7 h-7 rounded-full bg-[#00b8d4] items-center justify-center">
              {statusUpdating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-xs">{String(userData?.firstName?.[0] || "D").toUpperCase()}</Text>
              )}
            </View>
            <View className="ml-1">
              <Text className="text-white font-bold text-[11px] leading-tight">Dr. {userData?.lastName || "Doctor"}</Text>
              <View className="flex-row items-center space-x-1 mt-0.5">
                <View className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
                <Text className={`${isOnline ? "text-emerald-500" : "text-red-500"} text-[9px] font-bold tracking-wide uppercase ml-0.5`}>
                  {statusUpdating ? "Updating..." : isOnline ? "ONLINE" : "OFFLINE"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>


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

        {/* --- MAIN DASHBOARD BODY --- */}
        <View className="flex-1 relative">
          <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#007a7a" />}
          >

            {/* --- 2x2 DASHBOARD METRICS GRID --- */}
            <View className="bg-white rounded-2xl border border-teal-50 p-4 shadow-sm flex-row flex-wrap mb-4">
              <View className="w-[50%] pb-4 pr-2 border-b border-r border-gray-100">
                <Text className="text-gray-400 text-xs font-bold tracking-wider uppercase">PENDING</Text>
                <Text className="text-gray-900 text-2xl font-black mt-1">
                  {pendingQueue} <Text className="text-gray-500 text-sm font-medium">Cases</Text>
                </Text>
              </View>

              <View className="w-[50%] pb-4 pl-4 border-b border-gray-100">
                <Text className="text-gray-400 text-xs font-bold tracking-wider uppercase">ACTIVE</Text>
                <Text className="text-[#007a7a] text-2xl font-black mt-1">
                  {activeCount} <Text className="text-gray-500 text-sm font-medium">Live</Text>
                </Text>
              </View>

              <View className="w-[50%] pt-4 pr-2 border-r border-gray-100">
                <Text className="text-gray-400 text-xs font-bold tracking-wider uppercase">WALLET</Text>
                <Text className="text-[#1e1b4b] text-xl font-black mt-1">
                  {formatNaira(userData?.userWallet?.amount?.toLocaleString() || "0")}
                </Text>
              </View>

              <View className="w-[50%] pt-4 pl-4">
                <Text className="text-gray-400 text-xs font-bold tracking-wider uppercase">MONTHLY</Text>
                <Text className="text-gray-900 text-xl font-black mt-1">
                  {userData?.doctor?.completedConsultations || 0} <Text className="text-gray-500 text-sm font-medium">Svc</Text>
                </Text>
              </View>
            </View>

            {/* --- MEDICAL OVERVIEW CONTROL BANNER --- */}
            <View className="bg-[#f3f4ff] border border-indigo-50 rounded-xl p-4 flex-row justify-between items-center mb-5">
              <View className="flex-1 pr-2">
                <Text className="text-gray-700 text-sm font-medium">Medical Overview</Text>
                <View className="flex-row items-center mt-1.5 flex-wrap">
                  <View className="bg-emerald-100 w-4 h-4 rounded-full items-center justify-center mr-1">
                    <Text className="text-emerald-700 font-bold text-[9px]">✓</Text>
                  </View>
                  <Text className="text-gray-500 text-xs font-semibold ml-0.5">
                    Specialist: <Text className="text-[#007a7a] font-bold">{userData?.doctor?.specialization || "General"}</Text>
                    {"  •  ID: "}{userData?.doctor?.uniqueId || "DOC"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity className="bg-[#d5dadf] flex-row items-center px-3 py-1.5 rounded-lg border border-gray-300">
                <Settings color="#4b5563" size={14} />
                <Text className="text-gray-700 text-xs font-bold ml-1.5">Manage</Text>
              </TouchableOpacity>
            </View>

            {/* --- CONSULTATION QUEUE BLOCK --- */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-900 font-bold text-base">Consultation Queue</Text>
              <View className="bg-[#004d4d] px-2 py-0.5 rounded-md">
                <Text className="text-white text-[9px] font-black tracking-wider">PRIORITY</Text>
              </View>
            </View>

            {/* Active Sessions Row Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center justify-between mb-3"
              activeOpacity={0.85}
              onPress={() => navigation.navigate("appointments_screen", { requestType: "acceptedOnly", type: "Accepted Consultations & Reviews" })}
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="bg-[#e2f2f2] p-3 rounded-xl">
                  <MessageSquare color="#007a7a" size={22} />
                </View>
                <View className="ml-3.5 flex-1">
                  <Text className="text-gray-900 font-bold text-sm">Active Sessions</Text>
                  <Text className="text-gray-500 text-xs font-medium mt-0.5">
                    {activeCount} {activeCount === 1 ? "patient" : "patients"} in active care
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center space-x-2">
                <View className="bg-[#cc0000] w-5 h-5 rounded-full items-center justify-center mr-1">
                  <Text className="text-white text-[10px] font-black">{activeCount}</Text>
                </View>
                <ChevronRight color="#9ca3af" size={16} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            {/* Request Queue Row Card */}
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center justify-between mb-5"
              activeOpacity={0.85}
              onPress={() => navigation.navigate("appointments_screen", { requestType: "queueOnly", type: "Consultation Queues" })}
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="bg-[#ebdffc] p-3 rounded-xl">
                  <FileSpreadsheet color="#6366f1" size={22} />
                </View>
                <View className="ml-3.5 flex-1">
                  <Text className="text-gray-900 font-bold text-sm">Request Queue</Text>
                  <Text className="text-gray-500 text-xs font-medium mt-0.5">
                    {totalCount || 0} consultations • {reviewTotalCount || 0} reviews waiting
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center space-x-2">
                <View className="bg-slate-600 w-5 h-5 rounded-full items-center justify-center mr-1">
                  <Text className="text-white text-[10px] font-black">{pendingQueue}</Text>
                </View>
                <ChevronRight color="#9ca3af" size={16} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            {/* --- PREFERRED CONSULTATIONS ROW --- */}
            <TouchableOpacity
              className="bg-[#374151] rounded-xl p-4 flex-row items-center justify-between mb-16"
              activeOpacity={0.85}
              onPress={() => navigation.navigate("preferred_consultations_screen")}
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="bg-gray-600/50 p-2 rounded-xl">
                  <Star color="#22d3ee" size={20} fill="#22d3ee" />
                </View>
                <View className="ml-3.5 flex-1">
                  <Text className="text-white font-bold text-sm">Preferred Consultations</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">Your curated consultation list</Text>
                </View>
              </View>
              <ChevronRight color="#9ca3af" size={16} strokeWidth={2.5} />
            </TouchableOpacity>

          </ScrollView>

          {/* --- FLOATING ACTION BUTTON: CONSULTATION HISTORY --- */}
          <TouchableOpacity
            className="absolute bottom-4 right-6 bg-[#006666] w-14 h-14 rounded-full items-center justify-center shadow-lg elevation-5 z-50"
            activeOpacity={0.85}
            onPress={() => navigation.navigate("consultation_history_screen")}
          >
            <Clock color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
