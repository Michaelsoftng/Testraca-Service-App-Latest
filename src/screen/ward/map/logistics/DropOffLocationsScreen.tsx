import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useAuth from '../../../../schema/UseAuth';
import { URL_LINK } from '../../../../../config';
import {
  GET_DROP_OFF_LOCATIONS_BY_STATE,
  ACCEPT_DISPATCHER_PICK_UP,
  DISPATCH_CONFIRM_PICK_UP,
  DISPATCHER_CONFIRM_DELIVERY_TO_LAB,
} from '../../../../schema/ApiSchema';
import { useGetUserDetails } from '../../../../hook/useGetUserDetails';
import { useToast } from '../../../../lib/utils/functions';
import formatNaira from '../../../../components/FormatNaira';

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
  test?: { id?: string; name?: string };
  facilityDetails?: FacilityDetails;
}

interface RequestItem {
  id: string;
  requestStatus?: string;
  requestDate?: string;
  samplePickUpAddress?: string;
  total?: number | string;
  dispatcherEarning?: number | string;
  dispatcherKmCoverage?: number | string;
  testRequests?: TestRequestItem[];
}

interface DropOffLocation {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  requestsCount: number;
  samplesCount: number;
  dropOffArea?: {
    id: string;
    name: string;
    state?: {
      id: string;
      name: string;
    };
  };
  requests?: RequestItem[];
}

type DispatcherStatus = 'AVAILABLE' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED';
type StatusTabKey = 'REQUESTS' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED';

const STATUS_TABS: Array<{
  key: StatusTabKey;
  label: string;
  dispatcherStatus: DispatcherStatus;
}> = [
  { key: 'REQUESTS', label: 'Requests', dispatcherStatus: 'AVAILABLE' },
  { key: 'ACCEPTED', label: 'Accepted', dispatcherStatus: 'ACCEPTED' },
  { key: 'IN_TRANSIT', label: 'Waiting', dispatcherStatus: 'IN_TRANSIT' },
  { key: 'DELIVERED', label: 'Delivered', dispatcherStatus: 'DELIVERED' },
];

const DEMO_LOCATIONS: DropOffLocation[] = [
  {
    id: 'demo-loc-1',
    name: 'Senior Staff Quarters',
    address: 'Abaji, FCT Abuja',
    isActive: true,
    requestsCount: 4,
    samplesCount: 7,
    requests: [{ id: 'demo-req-1', requestStatus: 'URGENT' }, { id: 'demo-req-2', requestStatus: 'URGENT' }, { id: 'demo-req-3', requestStatus: 'URGENT' }],
    dropOffArea: { id: 'area-1', name: 'Abaji', state: { id: 'st-1', name: 'FCT Abuja' } },
  },
  {
    id: 'demo-loc-2',
    name: 'Hmedix 4th Avenue',
    address: 'Gwarinpa, FCT Abuja',
    isActive: true,
    requestsCount: 3,
    samplesCount: 5,
    requests: [{ id: 'demo-req-4', requestStatus: 'URGENT' }],
    dropOffArea: { id: 'area-2', name: 'Gwarinpa', state: { id: 'st-1', name: 'FCT Abuja' } },
  },
  {
    id: 'demo-loc-3',
    name: 'Wuse Zone 4 Hub',
    address: 'Wuse, FCT Abuja',
    isActive: true,
    requestsCount: 2,
    samplesCount: 3,
    requests: [],
    dropOffArea: { id: 'area-3', name: 'Wuse', state: { id: 'st-1', name: 'FCT Abuja' } },
  },
];

const LOCATIONS_PAGE_SIZE = 20;

function groupTestRequestsByName(testRequests: TestRequestItem[] = []): Array<[string, number]> {
  const groups: Record<string, number> = {};
  testRequests.forEach((tr) => {
    const name = tr?.test?.name || 'Sample';
    groups[name] = (groups[name] || 0) + 1;
  });
  return Object.entries(groups);
}

export default function DropOffLocationsScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const { userData, patientIdPay, loadingUserDetails } = useGetUserDetails();
  const { showToast } = useToast();
  const unreadNotificationCount = useSelector((state: any) => state.notifications.unreadCount);

  const [selectedStatusTab, setSelectedStatusTab] = useState<StatusTabKey>('REQUESTS');
  const [locations, setLocations] = useState<DropOffLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const activeDispatcherStatus = STATUS_TABS.find(
    (tab) => tab.key === selectedStatusTab
  )?.dispatcherStatus ?? 'AVAILABLE';

  console.log('Selected status tab:', selectedStatusTab, 'Active dispatcher status:', activeDispatcherStatus);

  const fetchLocations = useCallback(async (pageOffset: number = 0) => {
    console.log('Fetching locations with token:11 ', activeDispatcherStatus, 'patientIdPay:', patientIdPay, 'loadingUserDetails:', loadingUserDetails, 'offset:', pageOffset);
    if (!token || !patientIdPay) {
      if (loadingUserDetails) {
        setLoading(true);
        return;
      }

      // Fallback mode so the screen remains usable even if session info is not ready.
      // setLocations(DEMO_LOCATIONS);
      // setUsingDemoData(true);
      setLoading(false);
      return;
    }

    const isInitialPage = pageOffset === 0;

    try {
      if (isInitialPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axios.post(
        URL_LINK,
        {
          query: GET_DROP_OFF_LOCATIONS_BY_STATE,
          variables: {
            activeOnly: true,
            dispatcherStatus: activeDispatcherStatus,
            limit: LOCATIONS_PAGE_SIZE,
            offset: pageOffset,
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

      const gqlError = response?.data?.errors?.[0]?.message;
      console.log('API response:', response.data);
      if (gqlError) {
        console.error('GraphQL error:', gqlError);
        throw new Error(gqlError);
      }

      const payload = response?.data?.data?.getDropOffLocationsByState;
      const rawData: DropOffLocation[] = payload?.dropOffLocations || [];
      const data = rawData.filter(Boolean).map((loc) => ({
        ...loc,
        requests: (loc.requests || []).filter(Boolean),
      }));
      const totalCount: number = payload?.dropOffLocationsCount ?? data.length;
      const newOffset = pageOffset + data.length;

      setLocations((prev) => {
        if (isInitialPage) return data;
        const existingIds = new Set(prev.map((loc) => loc.id));
        return [...prev, ...data.filter((loc) => !existingIds.has(loc.id))];
      });
      setOffset(newOffset);
      setHasMore(data.length > 0 && newOffset < totalCount);
      setUsingDemoData(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      if (isInitialPage) {
        setLocations(DEMO_LOCATIONS);
        setUsingDemoData(true);
        showToast('info', 'Offline mode', 'Showing demo locations while we retry API data.');
      } else {
        showToast('error', 'Load more failed', 'Could not load more locations. Please try again.');
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, patientIdPay, loadingUserDetails, activeDispatcherStatus]);

  const loadFirstPage = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    return fetchLocations(0);
  }, [fetchLocations]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  useEffect(() => {
    setExpandedAreas(new Set());
  }, [selectedStatusTab]);

  const toggleArea = (areaName: string) => {
    setExpandedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(areaName)) next.delete(areaName);
      else next.add(areaName);
      return next;
    });
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadFirstPage();
    } finally {
      setRefreshing(false);
    }
  }, [loadFirstPage]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    fetchLocations(offset);
  }, [loading, loadingMore, refreshing, hasMore, offset, fetchLocations]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const reachedEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;

    if (reachedEnd) {
      handleLoadMore();
    }
  };

  const groupedByArea = locations.reduce<Record<string, DropOffLocation[]>>((acc, loc) => {
    const areaName = loc.dropOffArea?.name || 'Unknown';
    if (!acc[areaName]) acc[areaName] = [];
    acc[areaName].push(loc);
    return acc;
  }, {});
  const groupedAreaEntries = Object.entries(groupedByArea);

  const totalSamples = locations.reduce((sum, loc) => sum + (loc.samplesCount || 0), 0);
  const totalLocations = locations.length;
  const urgentCount = locations.reduce(
    (sum, loc) => sum + (loc.requests?.filter((r) => r.requestStatus === 'URGENT')?.length || 0),
    0
  );
  const sectorCount = groupedAreaEntries.length;

  const flattenedRequests = locations.flatMap((location) =>
    (location.requests || []).map((request) => ({ request, location }))
  );

  const totalSpecimens = flattenedRequests.reduce(
    (sum, { request }) => sum + (request.testRequests?.length || 0),
    0
  );
  const totalEarnings = flattenedRequests.reduce(
    (sum, { request }) => sum + (Number(request.dispatcherEarning) || 0),
    0
  );
  const deliveredLocationCount = new Set(flattenedRequests.map(({ location }) => location.id)).size;

  const navigateToSampleDelivery = (location: DropOffLocation, request: RequestItem) => {
    const requestLocation: DropOffLocation = {
      id: location.id,
      name: location.name,
      address: location.address,
      isActive: location.isActive,
      requestsCount: 1,
      samplesCount: Array.isArray(request.testRequests) ? request.testRequests.length : 0,
      dropOffArea: location.dropOffArea,
      requests: [request],
    };

    navigation.navigate('sample_delivery_screen', {
      location: requestLocation,
      fetchRequests: fetchLocations,
    });
  };

  const handleRequestAction = async (request: RequestItem, type: 'accept' | 'pick_up' | 'drop') => {
    if (!token || !request?.id) return;

    setActionLoadingId(request.id);
    try {
      const query =
        type === 'accept'
          ? ACCEPT_DISPATCHER_PICK_UP
          : type === 'pick_up'
          ? DISPATCH_CONFIRM_PICK_UP
          : DISPATCHER_CONFIRM_DELIVERY_TO_LAB;

      const response = await axios.post(
        URL_LINK,
        { query, variables: { requestId: request.id } },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const gqlError = response?.data?.errors?.[0]?.message;
      if (gqlError) {
        throw new Error(gqlError);
      }

      const messages: Record<typeof type, [string, string]> = {
        accept: ['Accepted', 'Request accepted. Confirm pickup when ready.'],
        pick_up: ['Pickup confirmed', 'Samples marked as picked up.'],
        drop: ['Delivered', 'Samples marked as delivered to lab.'],
      };
      const [title, message] = messages[type];
      showToast('success', title, message);
      await fetchLocations();
    } catch (err: any) {
      showToast('error', 'Error', err?.message || 'Action failed. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F8FAFC]">
      <StatusBar style="light" backgroundColor="#1A1F2C" />

      {/* --- HEADER --- */}
      <View className="bg-[#101828] px-4 pt-3 pb-4 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          <View className="w-8 h-8 bg-teal-900/40 rounded-full justify-center items-center border border-teal-500/30">
            <FontAwesome5 name="microscope" size={12} color="#00D2C4" />
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white tracking-wide">Dispatch Hub</Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            className="relative"
            onPress={() => navigation.navigate('notification_inbox_screen')}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            {unreadNotificationCount > 0 && (
              <View className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </TouchableOpacity>
          <View className="w-8 h-8 bg-[#005A54] rounded-full justify-center items-center">
            <Text className="text-xs font-bold text-white">
              {String(userData?.firstName?.[0] || 'D').toUpperCase()}
              {String(userData?.lastName?.[0] || 'H').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* --- EXTENDED HORIZONTAL NAVIGATION BAR --- */}
      <View className="bg-[#1A1F2C] px-2 pb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {STATUS_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => {
                setSelectedStatusTab(tab.key);
                // setSelectedArea('All areas');
              }}
              className="mr-2 px-4 py-2 rounded-xl"
            >
              <Text
                className={`text-sm font-semibold tracking-wide ${
                  selectedStatusTab === tab.key
                    ? 'text-[#00D2C4] border-b-2 border-[#00D2C4] pb-1'
                    : 'text-gray-500'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00A89C" />}
        onScroll={handleScroll}
        scrollEventThrottle={150}
      >
        {/* {usingDemoData && (
          <View className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">
            <Text className="text-amber-700 text-xs font-semibold">
              Demo mode: showing sample locations while we reconnect to live data.
            </Text>
          </View>
        )} */}

        {loading ? (
          <View className="items-center justify-center py-16">
            <ActivityIndicator size="large" color="#007A78" />
            <Text className="text-gray-500 mt-2 text-sm">Loading drop-off locations...</Text>
          </View>
        ) : selectedStatusTab === 'IN_TRANSIT' ? (
          <>
            {/* --- BRAND SUBHEADER --- */}
            <View className="flex-row items-center space-x-2 mb-2 px-1">
              <FontAwesome5 name="vial" size={14} color="#007A78" />
              <Text className="text-xs font-bold text-[#007A78] tracking-wider uppercase">Labtraca Systems</Text>
            </View>

            <View className="mb-4 px-1">
              <Text className="text-2xl font-bold text-gray-900">Drop-off Locations</Text>
              <Text className="text-xs text-gray-500 mt-0.5">Pending lab delivery confirmation</Text>
            </View>

            {/* --- CURRENT INVENTORY HERO CARD --- */}
            <View className="bg-[#008B8B] rounded-2xl p-5 mb-5 relative overflow-hidden shadow-sm">
              <Text className="text-white/80 text-[10px] font-bold tracking-wider uppercase">Current Inventory</Text>
              <Text className="text-white text-2xl font-extrabold mt-1">
                {totalSpecimens} Specimen{totalSpecimens === 1 ? '' : 's'}
              </Text>
              <View className="flex-row items-center space-x-1.5 mt-3 bg-black/10 self-start px-2.5 py-1 rounded-full">
                <MaterialCommunityIcons name="truck-delivery" size={14} color="#FFFFFF" />
                <Text className="text-white text-[11px] font-medium">Currently In Transit</Text>
              </View>
              <View className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <FontAwesome5 name="hand-holding-medical" size={80} color="#FFFFFF" />
              </View>
            </View>

            {groupedAreaEntries.length === 0 ? (
              <EmptyState message="No samples currently in transit" />
            ) : (
              groupedAreaEntries.map(([areaName, areaLocations]) => {
                const areaRequests = areaLocations.flatMap((loc) =>
                  (loc.requests || []).map((req) => ({ req, loc }))
                );
                const areaSamples = areaLocations.reduce((sum, loc) => sum + (loc.samplesCount || 0), 0);
                const areaEarnings = areaRequests.reduce(
                  (sum, { req }) => sum + (Number(req.dispatcherEarning) || 0),
                  0
                );
                const isExpanded = expandedAreas.has(areaName);

                return (
                  <View key={areaName} className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
                    <TouchableOpacity
                      onPress={() => toggleArea(areaName)}
                      className={`flex-row items-center justify-between p-4 ${isExpanded ? 'bg-slate-50/50' : ''}`}
                    >
                      <View className="flex-row items-center space-x-3 flex-1">
                        <View className="bg-teal-50 p-2 rounded-xl">
                          <Ionicons name="location" size={20} color="#007A78" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-gray-900 text-base">{areaName}</Text>
                          <Text className="text-gray-500 text-sm mt-0.5">
                            {areaSamples} sample{areaSamples === 1 ? '' : 's'}{' '}
                            <Text className="text-gray-300">•</Text>{' '}
                            {formatNaira(areaEarnings)} Est.
                          </Text>
                        </View>
                      </View>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#1A1C29" />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View className="px-3 pb-4 bg-gray-50/50">
                        {areaRequests.length === 0 ? (
                          <Text className="text-xs text-gray-500 text-center py-3">No samples in transit for this area</Text>
                        ) : (
                          areaRequests.map(({ req: request, loc: location }) => {
                            const facilityName = request.testRequests?.[0]?.facilityDetails?.facilityName || location.name;
                            const address = request.samplePickUpAddress || location.address;
                            const groups = groupTestRequestsByName(request.testRequests);
                            const isLoading = actionLoadingId === request.id;
                            const idSuffix = String(request.id || '').split('-').pop();

                            return (
                              <View
                                key={request.id}
                                className="bg-white rounded-2xl p-4 mt-3 border-l-4 border-[#007A78] border-t border-r border-b border-gray-100 shadow-sm"
                              >
                                <View className="flex-row justify-between items-start mb-3">
                                  <View className="flex-1 pr-2">
                                    <View className="bg-teal-50 px-2 py-0.5 rounded self-start">
                                      <Text className="text-[9px] font-bold text-[#007A78]">IN TRANSIT</Text>
                                    </View>
                                    <Text className="text-base font-bold text-gray-900 mt-1">{facilityName}</Text>
                                    <Text className="text-xs text-gray-500">{address}</Text>
                                  </View>

                                  <View className="items-end">
                                    <Text className="text-[10px] text-gray-500 mb-1">ID #{idSuffix}</Text>
                                    <View className="w-9 h-9 bg-teal-50 rounded-xl justify-center items-center">
                                      <Ionicons name="location" size={16} color="#007A78" />
                                    </View>
                                  </View>
                                </View>

                                <View className="border-t border-b border-gray-50 py-3 mb-4">
                                  {groups.map(([name, count]) => (
                                    <View key={name} className="flex-row justify-between items-center py-1">
                                      <Text className="text-xs text-gray-500 font-medium">{name}</Text>
                                      <Text className="text-xs font-bold text-gray-800">{count} sample{count === 1 ? '' : 's'}</Text>
                                    </View>
                                  ))}
                                </View>

                                <TouchableOpacity
                                  disabled={isLoading}
                                  onPress={() => handleRequestAction(request, 'drop')}
                                  className={`bg-[#007A78] w-full py-3 rounded-xl flex-row justify-center items-center space-x-2 ${
                                    isLoading ? 'opacity-60' : ''
                                  }`}
                                >
                                  <Text className="text-white font-bold text-sm">{isLoading ? 'Processing...' : 'Drop Sample'}</Text>
                                  <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                                </TouchableOpacity>
                              </View>
                            );
                          })
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}

            {/* --- VERIFICATION ADVISORY BANNER --- */}
            <View className="bg-[#EBF1FF] border border-[#D0E0FF] rounded-2xl p-4 flex-row items-start space-x-3 mb-6">
              <View className="mt-0.5">
                <Ionicons name="information-circle" size={20} color="#1E40AF" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[#1E293B] text-sm">Verification Process</Text>
                <Text className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Please ensure the lab coordinator signs the digital log upon arrival at the destination hub.
                </Text>
              </View>
            </View>
          </>
        ) : selectedStatusTab === 'DELIVERED' ? (
          <>
            <Text className="text-sm font-semibold text-gray-500 mb-3">Daily Performance</Text>

            {/* <View className="bg-[#008B8B] rounded-2xl p-5 mb-4 relative overflow-hidden shadow-sm">
              <Text className="text-white/80 text-xs font-bold tracking-wider uppercase">Total Earnings</Text>
              <Text className="text-white text-3xl font-extrabold mt-1">{formatNaira(totalEarnings||0)}</Text>
              <View className="absolute right-[-10px] bottom-[-15px] opacity-10">
                <Ionicons name="wallet" size={90} color="#FFFFFF" />
              </View>
            </View> */}

            <View className="flex-row justify-between mb-5">
              <View className="w-[48%] bg-white p-4 rounded-2xl border-l-4 border-[#007A78] border-t border-r border-b border-gray-100 shadow-sm">
                <Text className="text-xs font-medium text-gray-500">Deliveries</Text>
                <Text className="text-xl font-bold text-gray-800 mt-1">{flattenedRequests.length}</Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl border-l-4 border-slate-700 border-t border-r border-b border-gray-100 shadow-sm">
                <Text className="text-xs font-medium text-gray-500">Locations</Text>
                <Text className="text-xl font-bold text-gray-800 mt-1">{deliveredLocationCount}</Text>
              </View>
            </View>

            <Text className="text-xs font-bold text-gray-500 mb-4 tracking-wide">Completion Log</Text>

            {groupedAreaEntries.length === 0 ? (
              <EmptyState message="No deliveries completed yet" />
            ) : (
              groupedAreaEntries.map(([areaName, areaLocations]) => {
                const areaRequests = areaLocations.flatMap((loc) =>
                  (loc.requests || []).map((req) => ({ req, loc }))
                );
                const areaSamples = areaLocations.reduce((sum, loc) => sum + (loc.samplesCount || 0), 0);
                const areaEarnings = areaRequests.reduce(
                  (sum, { req }) => sum + (Number(req.dispatcherEarning) || 0),
                  0
                );
                const isExpanded = expandedAreas.has(areaName);

                return (
                  <View key={areaName} className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
                    <TouchableOpacity
                      onPress={() => toggleArea(areaName)}
                      className={`flex-row items-center justify-between p-4 ${isExpanded ? 'bg-slate-50/50' : ''}`}
                    >
                      <View className="flex-row items-center space-x-3 flex-1">
                        <View className="bg-teal-50 p-2 rounded-xl">
                          <Ionicons name="location" size={20} color="#007A78" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-gray-900 text-base">{areaName}</Text>
                          <Text className="text-gray-500 text-sm mt-0.5">
                            {areaSamples} sample{areaSamples === 1 ? '' : 's'}{' '}
                            <Text className="text-gray-300">•</Text>{' '}
                            {formatNaira(areaEarnings)} Est.
                          </Text>
                        </View>
                      </View>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#1A1C29" />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View className="px-3 pb-4 bg-gray-50/50">
                        {areaRequests.length === 0 ? (
                          <Text className="text-xs text-gray-500 text-center py-3">No deliveries in this area</Text>
                        ) : (
                          areaRequests.map(({ req: request, loc: location }) => {
                            const facilityName = request.testRequests?.[0]?.facilityDetails?.facilityName || location.name;
                            const idSuffix = String(request.id || '').split('-').pop();
                            const dateStr = String(request.requestDate || '').split('T')[0] || 'N/A';

                            return (
                              <View key={request.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-3">
                                <View className="flex-row justify-between items-start mb-3">
                                  <View className="flex-row items-center space-x-3 flex-1 pr-2">
                                    <View className="w-9 h-9 bg-teal-50 rounded-xl justify-center items-center">
                                      <FontAwesome5 name="microscope" size={16} color="#007A78" />
                                    </View>
                                    <View className="flex-1">
                                      <Text className="font-bold text-gray-800 text-sm" numberOfLines={1}>{facilityName}</Text>
                                      <Text className="text-[11px] text-gray-500 mt-0.5">ID: #{idSuffix}</Text>
                                    </View>
                                  </View>
                                  <View className="bg-emerald-50 px-2 py-1 rounded-full flex-row items-center space-x-1 border border-emerald-100">
                                    <Ionicons name="checkmark-done" size={12} color="#059669" />
                                    <Text className="text-[10px] font-bold text-[#059669]">Delivered</Text>
                                  </View>
                                </View>

                                <View className="h-[1px] bg-gray-50 my-1" />

                                <View className="flex-row justify-between items-center py-2 px-1">
                                  <View>
                                    <Text className="text-[10px] text-gray-500 font-medium">Earnings</Text>
                                    <Text className="text-sm font-bold text-gray-800 mt-0.5">
                                      {formatNaira(Number(request.dispatcherEarning) || 0)}
                                    </Text>
                                  </View>
                                  <View className="items-end">
                                    <Text className="text-[10px] text-gray-500 font-medium">Date</Text>
                                    <Text className="text-sm font-bold text-gray-700 mt-0.5">{dateStr}</Text>
                                  </View>
                                </View>

                                <TouchableOpacity
                                  className="border border-[#007A78] rounded-xl py-2.5 mt-2 flex-row justify-center items-center space-x-1.5"
                                  onPress={() => navigateToSampleDelivery(location, request)}
                                >
                                  <MaterialCommunityIcons name="text-box-search-outline" size={14} color="#007A78" />
                                  <Text className="text-[#007A78] font-bold text-xs">View Receipt</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          })
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </>
        ) : (
          <>
            {/* --- SUMMARY METRICS GRID --- */}
            <View className="flex-row justify-between mb-5">
              <View className="w-[48%] bg-white p-4 rounded-2xl border-l-4 border-teal-600 border-t border-r border-b border-gray-100 shadow-sm">
                <Text className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-0.5">Total Samples</Text>
                <Text className="text-2xl font-bold text-gray-900">{totalSamples}</Text>
                <Text className="text-[10px] font-semibold text-gray-500 mt-1">
                  {urgentCount > 0 ? `${urgentCount} urgent` : 'All clear'}
                </Text>
              </View>
              <View className="w-[48%] bg-white p-4 rounded-2xl border-l-4 border-slate-700 border-t border-r border-b border-gray-100 shadow-sm">
                <Text className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-0.5">Locations</Text>
                <Text className="text-2xl font-bold text-gray-900">{totalLocations}</Text>
                <Text className="text-[10px] font-semibold text-gray-500 mt-1">
                  Across {sectorCount} sector{sectorCount === 1 ? '' : 's'}
                </Text>
              </View>
            </View>

            {/* --- SECTION TITLE --- */}
            <View className="mb-4">
              <Text className="text-xl font-bold text-gray-900">Drop-off Locations</Text>
              <Text className="text-xs text-gray-500 mt-0.5">Manage samples across lab hubs in the city</Text>
            </View>

            {groupedAreaEntries.length === 0 ? (
              <EmptyState message="No locations found" />
            ) : (
              groupedAreaEntries.map(([areaName, areaLocations]) => {
                const areaSamples = areaLocations.reduce((sum, loc) => sum + (loc.samplesCount || 0), 0);
                const areaRequests = areaLocations.flatMap((loc) =>
                  (loc.requests || []).map((req) => ({ req, loc }))
                );
                const areaEarnings = areaRequests.reduce(
                  (sum, { req }) => sum + (Number(req.dispatcherEarning) || 0),
                  0
                );
                const isExpanded = expandedAreas.has(areaName);

                return (
                  <View key={areaName} className="bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
                    <TouchableOpacity
                      onPress={() => toggleArea(areaName)}
                      className={`flex-row items-center justify-between p-4 ${isExpanded ? 'bg-slate-50/50' : ''}`}
                    >
                      <View className="flex-row items-center space-x-3 flex-1">
                        <View className="bg-teal-50 p-2 rounded-xl">
                          <Ionicons name="location" size={20} color="#007A78" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-gray-900 text-base">{areaName}</Text>
                          <Text className="text-gray-500 text-sm mt-0.5">
                            {areaSamples} sample{areaSamples === 1 ? '' : 's'}{' '}
                            <Text className="text-gray-300">•</Text>{' '}
                            {formatNaira(areaEarnings)} Est.
                          </Text>
                        </View>
                      </View>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#1A1C29" />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View className="px-3 pb-4 bg-gray-50/50">
                        {areaRequests.length === 0 ? (
                          <Text className="text-xs text-gray-500 text-center py-3">No requests in this area</Text>
                        ) : (
                          areaRequests.map(({ req: request, loc: location }, idx) => {
                            const facilityName =
                              request.testRequests?.[0]?.facilityDetails?.facilityName || location.name;
                            const sampleCount = request.testRequests?.length || 0;
                            const requestEarning = Number(request.dispatcherEarning) || 0;
                            const isLoading = actionLoadingId === request.id;

                            return (
                              <View
                                key={request.id}
                                className={`bg-white rounded-xl p-4 border border-gray-100 shadow-xs mt-3`}
                              >
                                <View className="flex-row justify-between items-start mb-2">
                                  <View className="flex-1 pr-2">
                                    <Text className="font-bold text-gray-900 text-base">{facilityName}</Text>
                                    <View className="flex-row items-center space-x-1 mt-1">
                                      <MaterialCommunityIcons name="flask-outline" size={12} color="#475569" />
                                      <Text className="text-xs text-gray-500">
                                        {sampleCount} sample{sampleCount === 1 ? '' : 's'}
                                      </Text>
                                    </View>
                                  </View>
                                  <View className="bg-teal-50 px-2.5 py-1 rounded-lg">
                                    <Text className="text-xs font-bold text-[#007A78]">{formatNaira(requestEarning)}</Text>
                                  </View>
                                </View>

                                <TouchableOpacity
                                  className="flex-row items-center space-x-1 py-1 mb-3"
                                  onPress={() => navigateToSampleDelivery(location, request)}
                                >
                                  <Text className="text-xs font-bold text-[#007A78]">
                                    View {sampleCount} Request{sampleCount === 1 ? '' : 's'}
                                  </Text>
                                  <Ionicons name="chevron-forward" size={12} color="#007A78" />
                                </TouchableOpacity>

                                {selectedStatusTab === 'REQUESTS' && (
                                  <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => handleRequestAction(request, 'accept')}
                                    className={`bg-teal-50 border border-[#007A78] w-full py-3 rounded-xl items-center ${
                                      isLoading ? 'opacity-60' : ''
                                    }`}
                                  >
                                    <Text className="text-[#007A78] font-bold text-xs">
                                      {isLoading ? 'Processing...' : 'Accept Request'}
                                    </Text>
                                  </TouchableOpacity>
                                )}

                                {selectedStatusTab === 'ACCEPTED' && (
                                  <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => handleRequestAction(request, 'pick_up')}
                                    className={`bg-[#007A78] w-full py-3 rounded-xl flex-row justify-center items-center space-x-2 ${
                                      isLoading ? 'opacity-60' : ''
                                    }`}
                                  >
                                    <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                                    <Text className="text-white font-bold text-xs">
                                      {isLoading ? 'Processing...' : 'Confirm Pickup'}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            );
                          })
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </>
        )}

        {loadingMore && (
          <View className="items-center py-4">
            <ActivityIndicator size="small" color="#007A78" />
            <Text className="text-gray-400 mt-1 text-xs">Loading more...</Text>
          </View>
        )}
      </ScrollView>

      {/* --- FLOATING REFRESH BUTTON --- */}
      <TouchableOpacity
        className="absolute bottom-20 right-4 bg-[#005A54] w-12 h-12 rounded-2xl justify-center items-center shadow-lg"
        onPress={loadFirstPage}
      >
        <MaterialCommunityIcons name="refresh" size={24} color="#FFFFFF" />
      </TouchableOpacity>

     
    </SafeAreaView>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center mb-4">
    <View className="bg-gray-100 p-3 rounded-xl mb-3">
      <Ionicons name="file-tray-outline" size={22} color="#9CA3AF" />
    </View>
    <Text className="text-gray-500 font-bold text-sm">{message}</Text>
  </View>
);
