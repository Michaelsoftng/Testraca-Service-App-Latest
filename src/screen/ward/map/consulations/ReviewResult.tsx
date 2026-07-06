import React, { useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ArrowDown, FlaskConical } from "lucide-react-native";
import PrescriptionModal from "../(modals)/prescription";

const results = [
  {
    id: 1,
    title: "Blood Sugar (FBS)",
    lab: "Gilead Diagnostics",
    status: "Abnormal",
    resultValue: "8.4 mmol/L",
    refRange: "Ref: 3.9-5.6",
    flag: "HIGH",
    isAlert: true,
  },
  {
    id: 2,
    title: "Kidney Function (Creatinine)",
    lab: "Gomed Diagnostics",
    status: "Normal",
    resultValue: "88 umol/L",
    refRange: "Ref: 62-115",
    flag: "OK",
    isAlert: false,
  },
  {
    id: 3,
    title: "Malaria Parasite",
    lab: "Blue Peak Lab",
    status: "Normal",
    resultValue: "Negative",
    refRange: "Ref: Negative",
    flag: "Clear",
    isAlert: false,
  },
];

function LabResultCard({ item }: any) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className={`p-3 rounded-xl ${item.isAlert ? "bg-red-50" : "bg-emerald-50"}`}>
            <FlaskConical size={24} color={item.isAlert ? "#ef4444" : "#34D399"} />
          </View>
          <View className="ml-3">
            <Text className="font-bold text-lg text-slate-800 leading-5">{item.title}</Text>
            <Text className="text-slate-400 text-sm">{item.lab}</Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${item.isAlert ? "bg-red-100" : "bg-emerald-100"}`}>
          <Text className={`text-xs font-semibold ${item.isAlert ? "text-red-600" : "text-emerald-600"}`}>{item.status}</Text>
        </View>
      </View>

      <View className="flex-row">
        <View className="flex-1 bg-slate-50 p-3 rounded-2xl mr-3">
          <Text className="text-[10px] uppercase font-bold text-slate-400 mb-1">Result</Text>
          <Text className={`text-lg font-bold ${item.isAlert ? "text-red-700" : "text-emerald-700"}`}>{item.resultValue}</Text>
          <Text className="text-[10px] text-slate-500">{item.refRange}</Text>
        </View>
        <View className="flex-1 bg-slate-50 p-3 rounded-2xl">
          <Text className="text-[10px] uppercase font-bold text-slate-400 mb-1">Flag</Text>
          <Text className={`text-lg font-bold ${item.isAlert ? "text-red-700" : "text-emerald-700"}`}>{item.flag}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ReviewResult() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#1A153F]">
      <View className="px-6 pt-4 pb-8">
        <Text className="text-white text-3xl font-bold mb-4">Result review</Text>

        <View className="flex-row">
          <View className="bg-emerald-500/30 border border-emerald-400 px-4 py-2 rounded-full mr-2">
            <Text className="text-emerald-300 font-semibold text-sm">Result review</Text>
          </View>
          <View className="bg-white/10 px-4 py-2 rounded-full">
            <Text className="text-slate-300 font-semibold text-sm">Patient</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-[#F8F7F4] rounded-t-[40px] px-6 pt-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-3xl p-5 mb-8 flex-row items-center justify-between border border-slate-100">
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-emerald-50 rounded-full items-center justify-center">
                <Text className="text-emerald-600 font-bold text-xl">PT</Text>
              </View>
              <View className="ml-4">
                <Text className="font-bold text-xl text-slate-800">Result bundle</Text>
                <Text className="text-slate-400">Labs and values ready for review</Text>
              </View>
            </View>
            <View className="bg-purple-100 px-3 py-2 rounded-xl">
              <Text className="text-purple-700 font-bold">N1,000</Text>
              <Text className="text-purple-700 text-[10px] text-center">fee</Text>
            </View>
          </View>

          <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4 ml-1">Lab Results</Text>

          {results.map((item) => (
            <LabResultCard key={item.id} item={item} />
          ))}

          <View className="h-20" />
        </ScrollView>

        <View className="absolute bottom-10 self-center">
          <View className="bg-white p-3 rounded-full border border-slate-100">
            <ArrowDown color="#333" size={24} />
          </View>
        </View>
      </View>

      <View className="bg-white border-t border-slate-100 px-8 py-6 flex-row justify-between items-center">
        <Text className="text-[#1A153F] font-bold text-lg">Fee for this review</Text>
        <TouchableOpacity className="bg-[#1A153F] px-4 py-2 rounded-xl" onPress={() => setModalVisible(true)}>
          <Text className="text-white font-bold">Write prescription</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 h-[65%]">
            <Pressable className="self-end p-2" onPress={() => setModalVisible(false)}>
              <Text className="text-2xl text-slate-500">x</Text>
            </Pressable>
            <PrescriptionModal />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
