import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../../../../lib/utils/functions';
import axios from 'axios';
import useAuth from '../../../../schema/UseAuth';
import { URL_LINK } from '../../../../../config';
import {
  DISPATCH_ACCETED_RESQUEST,
  DISPATCHER_CONFIRM_DELIVERY_TO_LAB,
} from '../../../../schema/ApiSchema';

interface AcceptedRequest {
  id: string;
  requestStatus?: string;
  deliveryMode?: string;
  requestType?: string;
  patientName?: string;
  droppedAtLocationAt?: string;
  deliveredToLabAt?: string | null;
  isTimeSensitive?: boolean;
  numberOfSamples?: number;
  dispatcherEarning?: number;
  dropoffLocation?: {
    id: string;
    name: string;
    address: string;
  };
  sampleDetails?: { testName: string; specimen: string; facilityName: string }[];
}

interface DeliveryData {
  location?: any;
  dispatcherData?: any;
  startTime?: string;
}

export default function LogisticsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { location, dispatcherData, startTime } = (route.params || {}) as DeliveryData;
  const { showToast } = useToast();
  const { token } = useAuth(navigation);

  // List view state
  const [acceptedRequests, setAcceptedRequests] = useState<AcceptedRequest[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AcceptedRequest | null>(null);

  // Detail view state
  const [deliveryProgress, setDeliveryProgress] = useState(35);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAcceptedRequests = async () => {
    if (!token) return;
    setLoadingList(true);
    try {
      const response = await axios.post(
        URL_LINK,
        { query: DISPATCH_ACCETED_RESQUEST },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Accepted requests response:', response.data);
      console.log('Raw accepted requests data:', response?.data?.data?.myAcceptedRequests);
      const data: AcceptedRequest[] = response?.data?.data?.myAcceptedRequests ?? [];
      setAcceptedRequests(data);
    } catch (error: any) {
      console.error('Fetch accepted requests error:', error.message);
      showToast('error', 'Error', 'Failed to load accepted requests');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAcceptedRequests();
  }, [token]);

  // Simulate delivery progress when in detail view
  useEffect(() => {
    if (!selectedRequest) return;
    const interval = setInterval(() => {
      setDeliveryProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [selectedRequest]);

  const handleMarkDelivered = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        URL_LINK,
        {
          query: DISPATCHER_CONFIRM_DELIVERY_TO_LAB,
          variables: { requestId: selectedRequest.id },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast('success', 'Delivery complete', 'Sample successfully delivered');
      navigation.navigate('delivery_complete_screen', {
        location,
        dispatcherData,
        startTime,
      });
    } catch (error: any) {
      console.error('Mark delivered error:', error.message);
      showToast('error', 'Error', 'Failed to mark delivery complete');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── LIST VIEW ──────────────────────────────────────────────────────────
  if (!selectedRequest) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        {/* Header */}
        <View className="bg-[#0A111F] pt-12 pb-6 px-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-gray-400 ml-2 text-base">Logistics · In Transit</Text>
          </View>
          <Text className="text-white text-3xl font-bold mb-4">Accepted deliveries</Text>
          <View className="bg-[#1A3D31] self-start px-3 py-1 rounded-full">
            <Text className="text-[#34D399] font-medium">
              {acceptedRequests.length} active
            </Text>
          </View>
        </View>

        {loadingList ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="text-gray-500 mt-3">Loading deliveries…</Text>
          </View>
        ) : acceptedRequests.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <MaterialCommunityIcons name="truck-delivery-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 font-bold text-lg mt-4">No active deliveries</Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Accept a pickup request to see it here
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
            {acceptedRequests.map((req) => (
              <TouchableOpacity
                key={req.id}
                onPress={() => {
                  setDeliveryProgress(35);
                  setSelectedRequest(req);
                }}
                className="bg-white rounded-3xl p-4 mb-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="bg-[#E6F6F0] px-3 py-1 rounded-full">
                    <Text className="text-[#1A3D31] font-bold text-xs">
                      {req.deliveredToLabAt ? 'Delivered' : 'In transit'}
                    </Text>
                  </View>
                  {req.isTimeSensitive && (
                    <View className="bg-red-100 px-3 py-1 rounded-full">
                      <Text className="text-red-600 font-bold text-xs">Time-sensitive</Text>
                    </View>
                  )}
                </View>
                <Text className="font-bold text-lg text-[#0A111F] mb-1">
                  {req.dropoffLocation?.name || 'Unknown location'}
                </Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                  {req.dropoffLocation?.address || 'Address not available'}
                </Text>
                <View className="flex-row justify-between mt-3">
                  <Text className="text-gray-400 text-xs">#{req.id.substring(0, 8)}</Text>
                  <Text className="text-emerald-600 font-bold text-xs">
                    {req.numberOfSamples ?? 0} sample{(req.numberOfSamples ?? 0) !== 1 ? 's' : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <View className="h-10" />
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }

  // ─── DETAIL VIEW ─────────────────────────────────────────────────────────
  const safeLocation =
    location ||
    ({
      id: selectedRequest.dropoffLocation?.id || 'demo-request',
      name: selectedRequest.dropoffLocation?.name || 'Labtraca Facility',
      address: selectedRequest.dropoffLocation?.address || 'Address not available',
      samplesCount: selectedRequest.numberOfSamples ?? 0,
    } as any);

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      {/* Header Section */}
      <View className="bg-[#0A111F] pt-12 pb-6 px-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => setSelectedRequest(null)}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-gray-400 ml-2 text-base">Logistics · Samples</Text>
        </View>

        <Text className="text-white text-3xl font-bold mb-4">In transit to lab</Text>

        <View className="flex-row gap-2">
          <View className="bg-[#1A3D31] px-3 py-1 rounded-full">
            <Text className="text-[#34D399] font-medium">In transit to lab</Text>
          </View>
          <View className="bg-[#1F2937] px-3 py-1 rounded-full">
            <Text className="text-gray-400">#{safeLocation?.id?.substring(0, 8)}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Status Alert Card */}
        <View className="bg-[#E6F6F0] p-4 rounded-3xl flex-row items-center mb-6">
          <View className="bg-[#6EE7B7] p-2 rounded-full mr-4">
            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#1A3D31" />
          </View>
          <View>
            <Text className="text-[#1A3D31] font-bold text-lg">On the way to lab</Text>
            <Text className="text-[#1A3D31] opacity-70">
              {safeLocation?.name} · ~{Math.round(15 - (deliveryProgress / 100) * 15)} min away
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-6">
          {/* <View className="bg-gray-300 h-2 rounded-full overflow-hidden">
            <View
              style={{ width: `${deliveryProgress}%` }}
              className="bg-teal-800 h-full"
            />
          </View> */}
          {/* <Text className="text-gray-500 text-xs mt-2 text-center">
            {Math.round(deliveryProgress)}% complete
          </Text> */}
        </View>

        {/* Delivery Progress */}
        <Text className="text-gray-500 font-bold mb-4 tracking-widest uppercase">
          Delivery Progress
        </Text>

        <View className="bg-white p-5 rounded-3xl mb-6 shadow-sm">
          {/* Step 1 - Completed */}
          <View className="flex-row">
            <View className="items-center mr-4">
              <Ionicons name="checkmark-circle" size={26} color="#059669" />
              <View className="w-[2px] h-10 bg-teal-800" />
            </View>
            <View>
              <Text className="font-bold text-lg">Sample picked up</Text>
              <Text className="text-gray-600">{safeLocation?.address}</Text>
              <Text className="text-gray-600 text-xs mt-1">
                {startTime || new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>

          {/* Step 2 - Active */}
          <View className="flex-row">
            <View className="items-center mr-4">
              <View className="w-6 h-6 rounded-full border-2 border-[#059669] items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-teal-800" />
              </View>
              <View className="w-[2px] h-10 bg-gray-200" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg">In transit to lab</Text>
              <Text className="text-gray-600">
                {safeLocation?.name} · ~{Math.round(15 - (deliveryProgress / 100) * 15)} min
              </Text>
              <View className="bg-[#FEF3C7] self-start px-3 py-1 rounded-full mt-1">
                <Text className="text-[#B45309] font-bold text-xs">Active now</Text>
              </View>
            </View>
          </View>

          {/* Step 3 - Pending */}
          <View className="flex-row">
            <View className="items-center mr-4">
              <View className="w-6 h-6 rounded-full border-2 border-gray-200" />
            </View>
            <View>
              <Text className="font-bold text-lg text-gray-600">Delivered to lab</Text>
              <Text className="text-gray-600">Awaiting drop</Text>
              <View className="bg-gray-100 self-start px-3 py-1 rounded-full mt-1">
                <Text className="text-gray-600 font-bold text-xs">Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Stop Card */}
        <Text className="text-gray-600 font-bold mb-4 tracking-widest uppercase">
          Next Stop
        </Text>
        <View className="bg-white p-5 rounded-3xl mb-6 shadow-sm">
          <View className="flex-row">
            <View className="w-4 h-4 rounded-full bg-indigo-700 mt-1 mr-4" />
            <View className="flex-1">
              <Text className="text-indigo-600 font-bold text-xs uppercase mb-1">
                Drop Sample At
              </Text>
              <Text className="font-bold text-xl">{safeLocation?.name}</Text>
              <Text className="text-gray-600 mt-1">
                {safeLocation?.address} · ~{Math.round(15 - (deliveryProgress / 100) * 15)} min
              </Text>
            </View>
          </View>
        </View>

        {/* Samples On Board */}
        <View className="bg-[#F3F0EB] p-5 rounded-3xl mb-8">
          <Text className="text-gray-600 font-bold mb-4 tracking-widest uppercase">
            Samples On Board
          </Text>

          {selectedRequest.sampleDetails && selectedRequest.sampleDetails.length > 0 ? (
            selectedRequest.sampleDetails.slice(0, 5).map((s, i) => (
              <SampleRow
                key={i}
                label={s.testName}
                detail={s.facilityName}
                isLast={i === selectedRequest.sampleDetails!.length - 1 || i === 4}
              />
            ))
          ) : safeLocation?.samplesCount && safeLocation.samplesCount > 0 ? (
            Array.from({ length: Math.min(safeLocation.samplesCount, 3) }).map((_, i) => (
              <SampleRow
                key={i}
                label={`Sample Group ${i + 1} (×${Math.ceil(safeLocation.samplesCount / 3)})`}
                detail={safeLocation.name}
                isLast={i === 2}
              />
            ))
          ) : (
            <SampleRow label="Standard Tests" detail={safeLocation?.name} isLast />
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-4 pb-8 pt-4 bg-[#F5F5F5]">
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={handleMarkDelivered}
          className="bg-emerald-600 py-4 rounded-2xl items-center shadow-sm"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-xl">Mark Delivered</Text>
          )}
        </TouchableOpacity>
        <View className="h-4" />
        </View>
    </SafeAreaView>
  );
}

// Helper component for the sample list
const SampleRow = ({
  label,
  detail,
  isLast,
}: {
  label: string;
  detail: string;
  isLast?: boolean;
}) => (
  <View
    className={`flex-row justify-between items-center py-3 ${
      !isLast ? 'border-b border-gray-200' : ''
    }`}
  >
    <Text className="text-lg font-medium text-gray-800 flex-1">{label}</Text>
    <Text className="text-gray-400 text-right flex-1">{detail}</Text>
  </View>
);
