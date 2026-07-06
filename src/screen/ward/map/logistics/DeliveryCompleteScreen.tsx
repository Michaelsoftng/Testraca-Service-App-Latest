import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ChevronLeft, CheckCircle2, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../../../../lib/utils/functions';

interface DeliveryData {
  location?: any;
  dispatcherData?: any;
  startTime?: string;
}

export default function DeliveryCompleteScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { location, dispatcherData, startTime } = route.params as DeliveryData;
  const { showToast } = useToast();

  const deliveryTime = new Date().toLocaleTimeString();
  const totalDistance = 4.16; // km
  const samplesDelivered = location?.samplesCount || 5;
  const labsCovered = 1;
  const earningPerKm = 50;
  const serviceCharge = 320;
  const totalEarning = Math.round(totalDistance * earningPerKm + serviceCharge);

  const handleBackToHome = () => {
    showToast('success', 'Great!', 'Ready for next delivery');
    navigation.navigate('drop_off_locations_screen');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A]">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 py-6">
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.goBack()}>
          <ChevronLeft color="#94A3B8" size={20} />
          <Text className="text-slate-400 ml-1 text-lg">Logistics · Routes</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold">Delivery complete</Text>
        <Text className="text-slate-400 text-sm">#{location?.id?.substring(0, 8)} · All samples delivered</Text>
      </View>

      {/* Main Content Card */}
      <ScrollView className="flex-1 bg-slate-50 rounded-t-[40px] px-6 pt-8">
        {/* Success Alert */}
        <View className="flex-row items-center bg-emerald-50 p-4 rounded-2xl mb-6 border border-emerald-100">
          <View className="bg-emerald-100 p-2 rounded-full mr-4">
            <CheckCircle2 color="#059669" size={28} />
          </View>
          <View>
            <Text className="text-emerald-900 font-bold text-lg">All samples delivered!</Text>
            <Text className="text-emerald-700 text-xs">
              {labsCovered} facility · {samplesDelivered} samples · {deliveryTime}
            </Text>
          </View>
        </View>

        {/* Delivery Summary Table */}
        <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <Text className="text-slate-400 font-bold text-xs px-4 py-3 tracking-widest uppercase">
            Delivery Summary
          </Text>
          <SummaryRow label="Total distance" value={`${totalDistance} km`} isBold />
          <SummaryRow label="Samples delivered" value={samplesDelivered.toString()} />
          <SummaryRow label="Facilities covered" value={labsCovered.toString()} />
          <SummaryRow label="Pickup time" value={startTime || '--:-- --'} />
          <SummaryRow label="Delivered time" value={deliveryTime} isBold noBorder />
        </View>

        {/* Timeline / Stops */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <TimelineItem
            color="#581C87"
            name={location?.name || 'Primary Lab'}
            detail={`${samplesDelivered} samples · ${deliveryTime}`}
          />
          {labsCovered > 1 && (
            <>
              <TimelineItem
                color="#9D174D"
                name="Secondary Lab"
                detail={`Kidney Function × 2 · ${new Date(new Date().getTime() - 300000).toLocaleTimeString()}`}
              />
              <TimelineItem
                color="#854D0E"
                name="Tertiary Lab"
                detail={`Malaria Parasite · ${new Date(new Date().getTime() - 150000).toLocaleTimeString()}`}
                isLast
              />
            </>
          )}
          {labsCovered === 1 && (
            <TimelineItem
              color="#854D0E"
              name={location?.name || 'Primary Lab'}
              detail={`Complete delivery · ${deliveryTime}`}
              isLast
            />
          )}
        </View>

        {/* Earnings Section */}
        <View className="mb-8">
          <Text className="text-slate-400 font-bold text-xs mb-3 tracking-widest uppercase">
            Earnings for this delivery
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500">Per km rate ({totalDistance} km × ₦{earningPerKm})</Text>
            <Text className="text-slate-900 font-semibold">₦{Math.round(totalDistance * earningPerKm)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-500">Service charge</Text>
            <Text className="text-slate-900 font-semibold">₦{serviceCharge}</Text>
          </View>

          <View className="flex-row justify-between items-center border-t border-slate-100 pt-4">
            <Text className="text-slate-900 text-xl font-bold">Total earned</Text>
            <Text className="text-emerald-700 text-2xl font-black">₦{totalEarning}</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View className="bg-blue-50 rounded-2xl p-4 mb-8 border border-blue-100">
          <Text className="text-blue-900 font-bold text-base mb-3">Performance</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-blue-700 text-sm">Delivery efficiency</Text>
            <Text className="text-blue-900 font-semibold">95%</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-blue-700 text-sm">Time taken</Text>
            <Text className="text-blue-900 font-semibold">~45 minutes</Text>
          </View>
        </View>

        {/* Footer Button */}
        <TouchableOpacity
          onPress={handleBackToHome}
          className="bg-slate-100 py-5 rounded-2xl mb-10 border border-slate-300"
        >
          <Text className="text-center text-slate-900 font-bold text-lg">Back to locations</Text>
        </TouchableOpacity>

        {/* Next Action Suggestion */}
        <View className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 mb-8">
          <Text className="text-emerald-900 font-bold mb-2">Great work! 🎉</Text>
          <Text className="text-emerald-700 text-sm">
            You've completed 1 delivery today. Check out more pickup opportunities to earn more.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
const SummaryRow = ({
  label,
  value,
  isBold,
  noBorder,
}: {
  label: string;
  value: string;
  isBold?: boolean;
  noBorder?: boolean;
}) => (
  <View
    className={`flex-row justify-between px-4 py-4 ${!noBorder ? 'border-b border-slate-100' : ''}`}
  >
    <Text className="text-slate-500 text-md">{label}</Text>
    <Text className={`text-slate-900 text-md ${isBold ? 'font-bold' : 'font-medium'}`}>
      {value}
    </Text>
  </View>
);

const TimelineItem = ({
  color,
  name,
  detail,
  isLast,
}: {
  color: string;
  name: string;
  detail: string;
  isLast?: boolean;
}) => (
  <View className="flex-row">
    <View className="items-center mr-4">
      <View style={{ backgroundColor: color }} className="w-4 h-4 rounded-full" />
      {!isLast && <View className="w-[1px] h-10 bg-slate-200 my-1" />}
    </View>
    <View className="pb-6 flex-1">
      <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
        Delivered to
      </Text>
      <Text className="text-slate-900 font-bold text-md">{name}</Text>
      <Text className="text-slate-500 text-xs">{detail}</Text>
    </View>
  </View>
);
