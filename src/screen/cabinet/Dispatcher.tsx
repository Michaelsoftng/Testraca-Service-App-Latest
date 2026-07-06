import React, { useCallback, useEffect, useState } from "react";
import { ImageBackground, RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import { URL_LINK } from "../../../config";
import { DISPATCH_ACCETED_RESQUEST, GET_AVAILABLE_REEQUESTS_FOR_PICK_UP } from "../../schema/ApiSchema";
import useAuth from "../../schema/UseAuth";
import { useGetUserDetails } from "../../hook/useGetUserDetails";
import formatNaira from "../../components/FormatNaira";

export default function Dispatcher() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const { userData } = useGetUserDetails();
  const unreadNotificationCount = useSelector((state: any) => state.notifications.unreadCount);

  const [isOnline, setIsOnline] = useState(true);
  const [availableForPickUp, setAvailableForPickUp] = useState<any[]>([]);
  const [acceptedAvailable, setAcceptedAvailable] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const openAwaitingPickup = () => {
    navigation.navigate("drop_off_locations_screen");
  };

  const openAcceptedDeliveries = () => {
    const activeAccepted = acceptedAvailable?.find((item: any) => !item?.deliveredToLabAt) || acceptedAvailable?.[0];

    if (!activeAccepted) {
      navigation.navigate("drop_off_locations_screen");
      return;
    }

    navigation.navigate("logistics_in_transit_screen", {
      location: {
        id: activeAccepted?.id,
        name: activeAccepted?.dropoffLocation?.name || "Assigned lab",
        address: activeAccepted?.dropoffLocation?.address || "Address not available",
        samplesCount: activeAccepted?.numberOfSamples || 0,
      },
      dispatcherData: {
        name: userData?.firstName || "Dispatcher",
      },
      startTime: activeAccepted?.pickedFromDropoffAt || new Date().toLocaleTimeString(),
    });
  };

  const fetchDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const [queueRes, acceptedRes] = await Promise.all([
        axios.post(URL_LINK, { query: GET_AVAILABLE_REEQUESTS_FOR_PICK_UP }, { headers: { Authorization: `Bearer ${token}` } }),
        axios.post(URL_LINK, { query: DISPATCH_ACCETED_RESQUEST }, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setAvailableForPickUp(queueRes?.data?.data?.dispatcherReadyRequests ?? []);
      setAcceptedAvailable(acceptedRes?.data?.data?.myAcceptedRequests ?? []);
    } catch {
      // Keep showing the last known dashboard data if the refresh fails.
    }
  }, [token]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDashboard();
    } finally {
      setRefreshing(false);
    }
  }, [fetchDashboard]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const acceptedCount = acceptedAvailable.length;
  const deliveredCount = acceptedAvailable.filter((r: any) => r?.deliveredToLabAt).length;
  const urgentRequests = availableForPickUp.filter((r: any) => r?.isTimeSensitive);
  const riderId = `LAB-${String(userData?.id || "").slice(-5).toUpperCase() || "00000"}`;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F7F9FC]">
      <StatusBar style="light" backgroundColor="#1A1F2C" />

      {/* --- HEADER --- */}
      <View className="bg-[#101828] px-5 pt-3 pb-5 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-white tracking-wide">Dispatch Hub</Text>
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

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00A89C" />}
      >
        {/* --- RIDER STATUS CARD --- */}
        <View className="bg-white rounded-2xl p-4 mb-4 flex-row justify-between items-center shadow-sm border border-gray-100">
          <View>
            <Text className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Rider ID</Text>
            <Text className="text-lg font-bold text-gray-800 mt-0.5">{riderId}</Text>
            <Text className="text-xs text-gray-400 mt-0.5">{userData?.firstName || "Dispatcher"}</Text>
          </View>
          <View className="items-end">
            <Text className={`text-xs font-bold tracking-wider mb-1 ${isOnline ? 'text-[#00A89C]' : 'text-gray-400'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#00A89C' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
              onValueChange={() => setIsOnline((prev) => !prev)}
              value={isOnline}
            />
          </View>
        </View>

        {/* --- METRICS GRID --- */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {/* Available */}
          <View className="w-[48%] bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
            <View className="w-8 h-8 bg-blue-50 rounded-lg justify-center items-center mb-3">
              <MaterialCommunityIcons name="clipboard-text-clock-outline" size={18} color="#3B82F6" />
            </View>
            <Text className="text-sm font-medium text-gray-500">Available</Text>
            <Text className="text-2xl font-bold text-gray-900 mt-1">{availableForPickUp.length}</Text>
          </View>

          {/* Accepted */}
          <TouchableOpacity
            className="w-[48%] bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm"
            onPress={openAcceptedDeliveries}
          >
            <View className="w-8 h-8 bg-teal-50 rounded-lg justify-center items-center mb-3">
              <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="#00A89C" />
            </View>
            <Text className="text-sm font-medium text-gray-500">Accepted</Text>
            <Text className="text-2xl font-bold text-[#00A89C] mt-1">{acceptedCount}</Text>
          </TouchableOpacity>

          {/* Earnings */}
          <View className="w-[48%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <View className="w-8 h-8 bg-green-50 rounded-lg justify-center items-center mb-3">
              <MaterialCommunityIcons name="wallet-outline" size={18} color="#10B981" />
            </View>
            <Text className="text-sm font-medium text-gray-500">Earnings</Text>
            <Text className="text-2xl font-bold text-gray-900 mt-1">
              {formatNaira(userData?.userWallet?.amount || 0)}
            </Text>
          </View>

          {/* Delivered */}
          <View className="w-[48%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <View className="w-8 h-8 bg-purple-50 rounded-lg justify-center items-center mb-3">
              <Ionicons name="checkmark-circle-outline" size={18} color="#8B5CF6" />
            </View>
            <Text className="text-sm font-medium text-gray-500">Delivered</Text>
            <Text className="text-2xl font-bold text-gray-900 mt-1">{deliveredCount}</Text>
          </View>
        </View>

        {/* --- SAMPLES TO PICK UP SECTION --- */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-900">Samples to Pick Up</Text>
          {urgentRequests.length > 0 && (
            <View className="bg-red-100 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-red-600 tracking-wider">{urgentRequests.length} URGENT</Text>
            </View>
          )}
        </View>

        {/* High Priority Banner Callout */}
        <View className="bg-[#101828] rounded-2xl p-5 mb-4 relative overflow-hidden">
          <View className="pr-16">
            <Text className="text-white font-bold text-sm mb-1">
              {availableForPickUp.length > 0 ? 'New requests available' : 'All caught up'}
            </Text>
            <Text className="text-gray-300 text-xs leading-relaxed">
              {availableForPickUp.length > 0
                ? `Lab samples are pending at ${availableForPickUp[0]?.dropoffLocation?.name || 'a nearby facility'}.`
                : 'No pending pickups right now. Check back soon.'}
            </Text>
          </View>

          {/* Decorative background microscope icon */}
          <View className="absolute right-4 bottom-4 pl-2 opacity-10">
            <FontAwesome5 name="microscope" size={54} color="#FFFFFF" />
          </View>

          <TouchableOpacity
            className="bg-[#007A78] mt-4 py-3 rounded-xl flex-row justify-center items-center space-x-2"
            onPress={openAwaitingPickup}
          >
            <Text className="text-white font-bold text-sm">View {availableForPickUp.length} Requests</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Pickup Location List */}
        {availableForPickUp.slice(0, 2).map((item: any) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-3 flex-row justify-between items-center border border-gray-100 shadow-sm"
            onPress={openAwaitingPickup}
          >
            <View className="flex-row items-center space-x-3.5 flex-1">
              <View className="w-10 h-10 bg-indigo-50 rounded-xl justify-center items-center">
                <FontAwesome5 name="microscope" size={16} color="#4F46E5" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-sm">{item.dropoffLocation?.name || "Drop-off location"}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {item.numberOfSamples || 0} sample{item.numberOfSamples === 1 ? '' : 's'} ready for pickup
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {availableForPickUp.length === 0 && (
          <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm items-center">
            <Text className="text-gray-400 text-sm">No samples waiting for pickup</Text>
          </View>
        )}

        {/* --- NETWORK STATUS --- */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Network Status</Text>
        <View className="rounded-2xl overflow-hidden h-48 bg-slate-800">
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }}
            className="flex-1 justify-end p-4"
          >
            {/* Map tint layer */}
            <View className="absolute inset-0 bg-cyan-950/40" />

            <View className="bg-white/95 self-start px-3 py-1.5 rounded-full flex-row items-center space-x-2 shadow-sm">
              <View className="w-2 h-2 bg-emerald-500 rounded-full" />
              <Text className="text-xs font-bold text-gray-800">Live Network View</Text>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
