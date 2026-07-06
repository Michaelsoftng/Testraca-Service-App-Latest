import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { ChevronLeft, Phone } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../../../../lib/utils/functions';
import axios from 'axios';
import useAuth from '../../../../schema/UseAuth';
import { URL_LINK } from '../../../../../config';
import {
  ACCEPT_DISPATCHER_PICK_UP,
  DISPATCH_CONFIRM_PICK_UP,
  DISPATCHER_CONFIRM_DELIVERY_TO_LAB,
} from '../../../../schema/ApiSchema';

interface Location {
  id: string;
  name: string;
  address: string;
  samplesCount: number;
  requestsCount: number;
  requests?: any[];
}

interface RouteParams {
  location?: Location;
  fetchRequests?: () => void;
}

interface PatientDetails {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

interface FacilityDetails {
  id?: string;
  facilityName?: string;
  facilityType?: string;
  facilityEmail?: string;
  facilityPhoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface TestRequestItem {
  id?: string;
  status?: string;
  test?: {
    id?: string;
    name?: string;
  };
  patientDetails?: PatientDetails;
  facilityDetails?: FacilityDetails;
}

interface RequestItem {
  id?: string;
  requestDate?: string;
  requestStatus?: string;
  samplePickUpAddress?: string;
  total?: number | string;
  dispatcherEarning?: number | string;
  dispatcherKmCoverage?: number | string;
  dispatcherKmCost?: number | string;
  testRequests?: TestRequestItem[];
}

export default function SampleDeliveryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { location, fetchRequests } = (route.params || {}) as RouteParams;

  console.info('SampleDeliveryScreen received location::::::: ', location);
  console.info('SampleDeliveryScreen received location 2::::::: ', location?.requests[0]?.testRequests[0]);
  console.info('SampleDeliveryScreen received location 3::::::: ', location?.requests[0]);


  const { showToast } = useToast();
  const { token } = useAuth(navigation);
  const [isClickLoading, setIsClickLoading] = useState(false);
  const [deliveringTestId, setDeliveringTestId] = useState<string | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);

  const safeLocation: Location =
    location ||
    ({
      id: 'demo-location',
      name: 'Labtraca Hub',
      address: 'Address not available',
      samplesCount: 0,
      requestsCount: 0,
      requests: [],
    } as Location);

  // Mock dispatcher data - in a real app, this would come from Redux or API
  const dispatcherData = {
    name: 'Mike Labtraca1',
    initials: 'ML',
    samplesCount: safeLocation.samplesCount,
    mode: 'NORMAL',
    phone: '+234 123 456 7890',
  };

  // Calculate route details from API values with safe fallbacks
  const pickupDistance = 0.9; // km
  const dropOffDistance = 4.16; // km

  const requestItems: RequestItem[] = Array.isArray(safeLocation.requests) ? safeLocation.requests : [];
  const firstRequest = requestItems?.[0] || {};
  const firstTestRequest: TestRequestItem | undefined =
    Array.isArray(firstRequest?.testRequests) && firstRequest.testRequests.length > 0
      ? firstRequest.testRequests[0]
      : undefined;

  const dropOffFacility = firstTestRequest?.facilityDetails;
  const dropOffFacilityName = dropOffFacility?.facilityName || safeLocation.name;
  const dropOffFacilityAddress =
    [dropOffFacility?.address, dropOffFacility?.city, dropOffFacility?.state, dropOffFacility?.country]
      .filter(Boolean)
      .join(', ') || safeLocation.address;

  const rawCoverage = Number(firstRequest?.dispatcherKmCoverage ?? dropOffDistance);
  const kmCoverage = Number.isFinite(rawCoverage) ? rawCoverage : dropOffDistance;

  const rawKmCost = Number(firstRequest?.dispatcherKmCost ?? Math.round(kmCoverage * 50));
  const kmCost = Number.isFinite(rawKmCost) ? rawKmCost : Math.round(kmCoverage * 50);

  const rawEarning = Number(firstRequest?.dispatcherEarning ?? kmCost ?? 0); // firstRequest?.total ??
  console.info('Raw earning value:', firstRequest?.dispatcherEarning);
  const dispatcherEarning = Number.isFinite(rawEarning) ? rawEarning : kmCost;
  const currentRequestStatus = String(firstRequest?.requestStatus || '');
  const isInTransitToLab = currentRequestStatus === 'IN_TRANSIT_TO_LAB';
  const shouldShowActionButton =
    currentRequestStatus === 'DROPPED_AT_LOCATION' ||
    currentRequestStatus === 'DISPATCHER_ASSIGNED';

  // DROPPED_AT_LOCATION  → AcceptDispatcherPickup (dispatcher accepts the pending request)
  // DISPATCHER_ASSIGNED  → DispatcherConfirmPickup (dispatcher confirms sample pickup)
  // anything else        → DispatcherConfirmDeliveryToLab (mark individual samples as delivered)
  const actionType =
    currentRequestStatus === 'DROPPED_AT_LOCATION'
      ? 'accept'
      : currentRequestStatus === 'DISPATCHER_ASSIGNED'
      ? 'pick_up'
      : 'drop';

  const totalTestCount = requestItems.reduce(
    (sum, r) => sum + (Array.isArray(r?.testRequests) ? r.testRequests.length : 0),
    0
  );

  const handleDialDispatcher = async (phoneNumber: string) => {
    if (!phoneNumber) {
      showToast('error', 'Error', 'No phone number available');
      return;
    }

    const telUrl = `tel:${phoneNumber}`;
    try {
      const canOpen = await Linking.canOpenURL(telUrl);
      if (!canOpen) {
        showToast('error', 'Error', 'Unable to open the phone dialer');
        return;
      }
      await Linking.openURL(telUrl);
    } catch (error: any) {
      console.error('Dialer error:', error);
      showToast('error', 'Error', 'Could not open phone dialer');
    }
  };

  const handleAcceptRequest = async () => {
    const requestId = String(requestItems?.[0]?.id || '');
    if (!requestId || !token) {
      showToast('error', 'Error', 'No request found to accept');
      return;
    }
    setIsClickLoading(true);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: ACCEPT_DISPATCHER_PICK_UP,
          variables: { requestId },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response?.data?.data?.AcceptDispatcherPickup;
      if (result?.request?.id) {
        setHasAccepted(true);
        fetchRequests?.();
        showToast('success', 'Accepted', 'Request accepted. Confirm pickup when ready.');
        navigation.navigate("Dispatcher"); 
      } else {
        const errorMsg =
          response?.data?.errors?.[0]?.message || 'Could not accept request. Try again.';
        showToast('error', 'Error', errorMsg);
      }
    } catch (error: any) {
      console.error('Accept request error:', error?.message);
      console.error('Server response:', error?.response?.data);
      showToast('error', 'Error', 'Failed to accept request. Please try again.');
    } finally {
      setIsClickLoading(false);
    }
  };

  const updateConfirmSamplePickUp = async (
    requestID_: string,
    type: 'pick_up' | 'drop' = 'pick_up',
    testRequestId?: string
  ) => {
    if (!requestID_ || !token) return null;

    console.info(
      'Updating request ID:',
      requestID_,
      ' with action type:',
      type,
      ' and test request:',
      testRequestId || 'n/a'
    );
    setIsClickLoading(true);
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query:
            type === 'drop'
              ? DISPATCHER_CONFIRM_DELIVERY_TO_LAB
              : DISPATCH_CONFIRM_PICK_UP,
          variables: {
            requestId: requestID_,
            ...(type === 'drop' && testRequestId ? { testRequestId } : {}),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.info('KON BLESSING FAFG 33333444444444', response.data, "   ",testRequestId);
      console.info('KON BLESSING FAFG 33333444444444', response.data.data);
      fetchRequests?.();
      console.info(
        'KON W ',
        type === 'drop'
          ? response?.data?.data?.DispatcherConfirmDeliveryToLab
          : response?.data?.data?.DispatcherConfirmPickup
      );

      return response;
    } catch (error: any) {
      console.log('AXIOS ERROR:', error?.message);
      console.log('SERVER RESPONSE:', error?.response?.data);
      console.error('Public request error:', error?.message);
      console.error(error);
      console.error(error?.message);
      throw error;
    } finally {
      setIsClickLoading(false);
    }
  };

  const handlePrimaryAction = async () => {
    try {
      const requestIds: string[] = requestItems
        .map((r: RequestItem) => String(r?.id || ''))
        .filter(Boolean);

      if (requestIds.length === 0) {
        showToast('error', 'Error', 'No request found for this delivery');
        return;
      }

      console.info('Primary action request IDs:', requestIds, ' ======== Action type:', actionType);
      // await Promise.all(requestIds.map((requestId) =>
      await updateConfirmSamplePickUp(requestIds[0], actionType as 'pick_up' | 'drop');
    
    // ));

      if (actionType === 'pick_up') {
        showToast('success', 'Pickup confirmed', 'Samples marked as picked up');
        navigation.navigate("Dispatcher");
        return;
      }

      showToast('success', 'Delivered', 'Samples marked as delivered');
      navigation.goBack();
    } catch (error: any) {
      console.error('Primary action error:', error?.message);
      showToast('error', 'Error', 'Action failed. Please try again.');
    }
  };

  const handleMarkTestAsDelivered = async (requestId: string, testRequestId: string) => {
    if (!requestId || !testRequestId) {
      showToast('error', 'Error', 'Missing request or sample identifier');
      return;
    }

    setDeliveringTestId(testRequestId);
    try {
      const response = await updateConfirmSamplePickUp(requestId, 'drop', testRequestId);
      const pendingCount = Number(
        response?.data?.data?.DispatcherConfirmDeliveryToLab?.pendingSamplesCount ?? 0
      );

      fetchRequests?.();

      showToast(
        'success',
        'Sample delivered',
        pendingCount > 0
          ? `${pendingCount} sample(s) still pending in this request`
          : 'All samples delivered for this request'
      );

      if (pendingCount <= 0) {
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Mark sample delivered error:', error?.message);
      showToast('error', 'Error', 'Could not mark sample as delivered. Please try again.');
    } finally {
      setDeliveringTestId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121826]">
      {/* Header Section */}
      <View className="px-6 pt-4 pb-10">
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.goBack()}>
          <ChevronLeft color="white" size={20} />
          <Text className="text-gray-400 ml-2">Logistics · Samples</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-4">Sample delivery</Text>

        <View className="flex-row gap-3">
          <View className="bg-red-100 px-3 py-2 rounded-full">
            <Text className="text-red-600 font-semibold text-xs">Time-sensitive</Text>
          </View>
          <View className="bg-emerald-900/30 px-3 py-2 rounded-full border border-emerald-800">
            <Text className="text-emerald-400 font-semibold text-xs">Dispatcher assigned</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView className="flex-1 bg-[#F1F1F1] rounded-t-[30px] px-4 pt-6">
        {/* Profile Card */}
        <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-6 shadow-sm">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center">
              <Text className="text-emerald-700 font-bold">{dispatcherData.initials}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-bold text-lg text-slate-900">{dispatcherData.name}</Text>
              <Text className="text-gray-500 text-sm">
                {dispatcherData.samplesCount} samples · {dispatcherData.mode} mode
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="p-2 border border-emerald-100 rounded-full"
            onPress={() => handleDialDispatcher(dispatcherData.phone)}
            accessibilityRole="button"
            accessibilityLabel="Call dispatcher"
          >
            <Phone size={20} color="#059669" />
            {/* <Text className="sr-only">{dispatcherData.phone}</Text> */}
          </TouchableOpacity>
        </View>

        {/* Delivery Route */}
        <Text className="text-gray-500 font-bold mb-4 ml-1 tracking-wider uppercase text-xs">
          DELIVERY ROUTE
        </Text>
        <View className="bg-white rounded-2xl p-5 mb-6">
          <RouteItem
            dotColor="bg-emerald-500"
            title="PICKUP FROM PHLEBOTOMIST"
            location={safeLocation.name}
            dist={`${safeLocation.address} · ${kmCoverage.toFixed(2)} km`}
            showLine
          />
          <RouteItem
            dotColor="bg-indigo-700"
            title="DROP AT FACILITY"
            location={dropOffFacilityName}
            dist={`${dropOffFacilityAddress} · ${kmCoverage.toFixed(2)} km`}
          />
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-gray-400 font-bold mb-4 text-xs uppercase">ORDER SUMMARY</Text>
          <DetailRow label="Request ID " value={`#${String(requestItems?.[0]?.id || '').split('-').pop()}`} isBold />
          <DetailRow label="Date " value={String(requestItems?.[0]?.requestDate || 'N/A').split('T')[0]} />
          <DetailRow label="Status " value={String(requestItems?.[0]?.requestStatus || 'N/A')} />
          <DetailRow label="Pickup Address " value={String(requestItems?.[0]?.samplePickUpAddress || 'N/A')} />
          <DetailRow label="Samples " value={String(totalTestCount)} isBold />
          {/* <DetailRow label="Pickup dist. " value={`${pickupDistance.toFixed(2)} km`} valueColor="text-orange-500" /> */}
          <DetailRow label="Drop-off dist. " value={`${kmCoverage.toFixed(2)} km`} valueColor="text-orange-500" />
          {/* <DetailRow label="KM cost " value={`₦${kmCost.toLocaleString()}`} valueColor="text-orange-500" /> */}
          <View className="h-[1px] bg-gray-100 my-2" />
          <DetailRow label="Total " value={`₦${Number(requestItems?.[0]?.total || 0).toLocaleString()}`} isBold />
          <DetailRow label="Est. earning " value={`₦${dispatcherEarning.toLocaleString()}`} valueColor="text-emerald-600" isBold />
        </View>

        {/* Per-sample detail cards */}
        {requestItems.map((request, rIdx) => {
          const tests: TestRequestItem[] = Array.isArray(request?.testRequests) ? request.testRequests : [];
          return tests.map((tr, tIdx) => (
            <View key={tr?.id || `${rIdx}-${tIdx}`} className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
              {/* Test + status header */}
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-slate-900 font-bold text-sm flex-1 mr-2">{tr?.test?.name || 'Unknown test'}</Text>
                <StatusBadge status={tr?.status || ''} />
              </View>

              {/* Patient */}
              <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2">PATIENT</Text>
              <View className="bg-gray-50 rounded-xl p-3 mb-3">
                <DetailRow
                  label="Name "
                  value={`${tr?.patientDetails?.firstName || ''} ${tr?.patientDetails?.lastName || ''}`.trim() || 'N/A'}
                  isBold
                />
                <DetailRow label="Phone " value={tr?.patientDetails?.phoneNumber || 'N/A'} />
                <DetailRow label="Email " value={tr?.patientDetails?.email || 'N/A'} />
                <DetailRow label="Address " value={tr?.patientDetails?.location || 'N/A'} />
              </View>

              {/* Facility */}
              <Text className="text-gray-400 font-bold text-[10px] uppercase mb-2">FACILITY</Text>
              <View className="bg-blue-50 rounded-xl p-3">
                <DetailRow label="Name " value={tr?.facilityDetails?.facilityName || 'N/A'} isBold />
                <DetailRow label="Type " value={tr?.facilityDetails?.facilityType || 'N/A'} />
                <DetailRow label="Phone " value={tr?.facilityDetails?.facilityPhoneNumber || 'N/A'} />
                <DetailRow label="Email " value={tr?.facilityDetails?.facilityEmail || 'N/A'} />
                <DetailRow label="Address " value={tr?.facilityDetails?.address || 'N/A'} />
                <DetailRow
                  label="City / State "
                  value={[tr?.facilityDetails?.city, tr?.facilityDetails?.state, tr?.facilityDetails?.country]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
                />
              </View>

              {shouldShowActionButton && actionType === 'drop' && tr?.id ? (
                <TouchableOpacity
                  onPress={() => handleMarkTestAsDelivered(String(request?.id || ''), String(tr.id || ''))}
                  disabled={isClickLoading || deliveringTestId === tr.id}
                  className="bg-emerald-600 py-3 rounded-xl mt-4"
                >
                  {deliveringTestId === tr.id ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-center font-bold text-white">Mark As Delivered</Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {isInTransitToLab && tr?.id ? (
                <TouchableOpacity
                  onPress={() => handleMarkTestAsDelivered(String(request?.id || ''), String(tr.id || ''))}
                  disabled={isClickLoading || deliveringTestId === tr.id}
                  className="bg-indigo-600 py-3 rounded-xl mt-4"
                >
                  {deliveringTestId === tr.id ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-center font-bold text-white">Drop Sample</Text>
                  )}
                </TouchableOpacity>
              ) : null}
            </View>
          ));
        })}

        {/* Earnings Card */}
        <View className="bg-emerald-50 rounded-2xl p-5 mb-6 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-emerald-800 font-bold text-base">Estimated earning</Text>
            {/* <Text className="text-emerald-600 text-xs mt-1">
              Coverage {kmCoverage.toFixed(2)} km · km cost ₦{kmCost.toLocaleString()}
            </Text> */}
          </View>
          <Text className="text-emerald-800 text-3xl font-bold">₦{dispatcherEarning.toLocaleString()}</Text>
        </View>

        {/* Action Button (status-driven) */}
        {shouldShowActionButton && actionType === 'accept' ? (
          <TouchableOpacity
            onPress={handleAcceptRequest}
            disabled={isClickLoading}
            className="bg-indigo-600 py-4 rounded-xl mb-4 shadow-sm"
          >
            {isClickLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-center font-bold text-lg text-white">Accept Request</Text>
            )}
          </TouchableOpacity>
        ) : null}

        {shouldShowActionButton && actionType === 'pick_up' ? (
          <TouchableOpacity
            onPress={handlePrimaryAction}
            disabled={isClickLoading}
            className="bg-emerald-600 py-4 rounded-xl mb-10 shadow-sm"
          >
            {isClickLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-center font-bold text-lg text-white">Confirm pickup</Text>
            )}
          </TouchableOpacity>
        ) : null}
        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
const RouteItem = ({
  dotColor,
  title,
  location,
  dist,
  showLine,
}: {
  dotColor: string;
  title: string;
  location: string;
  dist: string;
  showLine?: boolean;
}) => (
  <View className="flex-row">
    <View className="items-center mr-4">
      <View className={`w-3 h-3 rounded-full ${dotColor}`} />
      {showLine && <View className="w-[1px] h-12 bg-gray-200" />}
    </View>
    <View className="pb-6 flex-1">
      <Text className="text-gray-400 font-bold text-[10px] mb-1">{title}</Text>
      <Text className="text-slate-900 font-bold text-sm">{location}</Text>
      <Text className="text-gray-500 text-xs">{dist}</Text>
    </View>
  </View>
);

const DetailRow = ({
  label,
  value,
  valueColor = 'text-slate-900',
  isBold = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isBold?: boolean;
}) => (
  <View className="flex-row justify-between py-2 gap-x-3">
    <Text className="text-gray-500 text-sm shrink-0">{label}</Text>
    <Text
      className={`${valueColor} ${isBold ? 'font-bold' : 'font-medium'} text-sm flex-1 text-right`}
      numberOfLines={3}
    >
      {value}
    </Text>
  </View>
);

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  SAMPLE_COLLECTED: { bg: 'bg-blue-100', text: 'text-blue-700' },
  REQUEST_COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  SAMPLE_RECEIVED: { bg: 'bg-purple-100', text: 'text-purple-700' },
  DROPPED_AT_LOCATION: { bg: 'bg-orange-100', text: 'text-orange-700' },
  DISPATCHER_ASSIGNED: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  ACCEPTED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  PICKED_UP: { bg: 'bg-sky-100', text: 'text-sky-700' },
  IN_TRANSIT_TO_LAB: { bg: 'bg-violet-100', text: 'text-violet-700' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = STATUS_COLOR[status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <View className={`${colors.bg} px-2 py-1 rounded-full`}>
      <Text className={`${colors.text} text-[10px] font-bold`}>
        {status.replace(/_/g, ' ')}
      </Text>
    </View>
  );
};
