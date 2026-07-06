import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Landmark, Bell, Wallet, BarChart3 } from "lucide-react-native";
import formatNaira from "../../../components/FormatNaira";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";
import { useRequestsRedux } from "../../../hook/useRequestsRedux";

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`flex-row justify-between py-3 ${last ? "" : "border-b border-slate-100"}`}>
      <Text className="text-slate-500 font-medium">{label}</Text>
      <Text className="text-black font-bold">{value}</Text>
    </View>
  );
}

export default function Earning() {
  const navigation = useNavigation<any>();
  const { userData } = useGetUserDetails();

  const { requests } = useRequestsRedux({
    requestStatus: "",
    searchTerm: "",
    queueOnly: false,
    phlebotomistId: userData?.id,
  });

  const completed = (requests || []).filter((item: any) =>
    ["REQUEST_COMPLETED", "SAMPLE_RECEIVED", "COMPLETE", "ONGOING"].includes(item.requestStatus)
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-teal-950">
      <View className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-teal-950 flex-row justify-between items-center px-4 py-3">
          <View className="flex-row items-center">
            <Landmark size={20} color="#fff" />
            <Text className="text-white font-bold text-base ml-2">Labtraca</Text>
          </View>
          <Bell size={20} color="#fff" />
        </View>

        <View className="bg-teal-50/50 rounded-b-[36px] border-b border-teal-100/50 pt-8 pb-8 px-4 items-center">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Wallet Balance</Text>
          <Text className="text-teal-950 text-4xl font-black mt-2">
            {formatNaira(userData?.userWallet?.amount?.toLocaleString() || "0")}
          </Text>
          <View className="bg-teal-100/70 border border-teal-200/50 rounded-full px-4 py-1.5 mt-3">
            <Text className="text-teal-800 text-xs font-bold">Available to withdraw</Text>
          </View>
        </View>

        <View className="flex-row justify-between px-6 mt-6">
          <View className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 w-[48%]">
            <Wallet size={20} color="#0D9488" />
            <Text className="text-slate-900 text-xl font-bold mt-2">{completed.length}</Text>
            <Text className="text-slate-400 text-xs mt-1">Completed Collections</Text>
          </View>
          <View className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 w-[48%]">
            <BarChart3 size={20} color="#0D9488" />
            <Text className="text-slate-900 text-xl font-bold mt-2">{userData?.phlebotomist?.commission || 0}%</Text>
            <Text className="text-slate-400 text-xs mt-1">Conversion Rate</Text>
          </View>
        </View>

        <View className="flex-row justify-between px-6 mt-4">
          <TouchableOpacity className="bg-teal-800 flex-1 mr-2 h-14 rounded-2xl items-center justify-center" onPress={() => navigation.navigate("request_earning")}>
            <Text className="text-white font-bold text-base text-center">Withdraw funds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white flex-1 ml-2 h-14 rounded-2xl items-center justify-center border border-slate-200"
            onPress={() => navigation.navigate("withdraw_earning_history")}
          >
            <Text className="text-teal-900 font-bold text-base text-center">View history</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-slate-500 font-bold uppercase tracking-widest mb-4">Recent Payouts</Text>
          {completed.length === 0 ? (
            <View className="bg-white rounded-2xl p-5 border border-slate-100">
              <Text className="text-slate-500">No completed requests yet.</Text>
            </View>
          ) : (
            completed.slice(0, 3).map((item: any) => (
              <View key={item.id} className="flex-row items-center justify-between bg-white border border-slate-100 rounded-2xl shadow-sm p-3 mb-2.5">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="bg-teal-50 rounded-xl p-2.5 mr-3">
                    <Wallet size={18} color="#0D9488" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-base">{item.requestDate?.split("T")?.[0] || "Recent request"}</Text>
                    <Text className="text-slate-400 text-xs" numberOfLines={1}>{item.samplePickUpAddress || "Pickup"}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-teal-800 font-black text-base">+ {formatNaira(String(item.phlebotomistEarning || 0))}</Text>
                  <View className="bg-teal-50 rounded-md px-2 py-0.5 mt-1">
                    <Text className="text-teal-700 text-[10px] font-bold">SUCCESS</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View className="px-6 mt-8 mb-10">
          <Text className="text-slate-500 font-bold uppercase tracking-widest mb-4">Withdraw Funds</Text>
          {(() => {
            const rawBankInfo =
              userData?.doctor?.bankInformation ||
              userData?.phlebotomist?.bankInformation;
            let banks: any[] = [];
            try {
              banks = rawBankInfo ? JSON.parse(rawBankInfo) : [];
            } catch {
              banks = [];
            }
            if (banks.length === 0) {
              return (
                <View className="bg-white rounded-2xl p-5 border border-slate-100">
                  <Text className="text-slate-400 text-sm">No bank details saved yet.</Text>
                </View>
              );
            }
            return (
              <>
                {banks.map((bank: any, idx: number) => (
                  <View key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 mb-3">
                    <Text className="text-slate-400 font-bold text-xs uppercase mb-4">
                      Bank {banks.length > 1 ? idx + 1 : "Details"}
                    </Text>
                    <DetailRow label="Bank" value={bank.bank_name || "-"} />
                    <DetailRow label="Account number" value={bank.account_number || "-"} />
                    <DetailRow label="Account name" value={bank.account_name || "-"} last />
                  </View>
                ))}
              </>
            );
          })()}
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
