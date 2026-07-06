import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import { Settings, User, Bell, ShieldCheck, HelpCircle, FileText, LogOut, ChevronRight } from "lucide-react-native";
import { useGetUserDetails } from "../../hook/useGetUserDetails";
import formatNaira from "../../components/FormatNaira";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
  isLast,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between px-4 py-3.5 ${isLast ? "" : "border-b border-slate-50"}`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center flex-1 mr-3">
        <View className="bg-teal-50/60 rounded-xl p-2.5 mr-3">{icon}</View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-slate-900">{title}</Text>
          <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

export default function Account() {
  const navigation = useNavigation<any>();
  const { userData } = useGetUserDetails();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const confirmLogout = async () => {
    await AsyncStorage.multiSet([
      ["userToken_", ""],
      ["refreshToken_", ""],
      ["userType_", ""],
      ["id_", ""],
    ]);
    navigation.navigate("onboarding_screen");
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 bg-slate-50">
        <View className="bg-white border-b border-slate-100 px-4 py-3 flex-row items-center justify-between">
          <View className="w-5" />
          <Text className="text-base font-bold text-slate-900">Account</Text>
          <Settings size={20} color="#0F172A" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center mt-8 mb-6">
            <View className="relative">
              <View className="w-24 h-24 rounded-full bg-teal-100 border-2 border-teal-600/20 items-center justify-center">
                <Text className="text-teal-900 text-3xl font-bold">
                  {String(userData?.firstName?.[0] ?? "A").toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-teal-800 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                onPress={() => navigation.navigate("edit_profile")}
              >
                <MaterialIcons name="edit" size={14} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-slate-900 text-lg font-bold mt-3">{userData?.firstName || "User"}</Text>
            <Text className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">
              PHLEB-{String(userData?.id || "").slice(-8).toUpperCase()}
            </Text>
          </View>

          <View className="bg-white border border-slate-100 rounded-2xl shadow-sm flex-row justify-between items-center p-4 mx-4 mb-6">
            <View>
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">Wallet Balance</Text>
              <Text className="text-slate-900 text-2xl font-bold mt-1">
                {formatNaira(userData?.userWallet?.amount?.toLocaleString() || "0")}
              </Text>
            </View>
            <TouchableOpacity className="bg-teal-800 px-4 py-3 rounded-xl" onPress={() => navigation.navigate("request_earning")}>
              <Text className="text-white font-bold text-sm">Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View className="px-4 mb-6">
            <Text className="text-teal-800/80 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Account Settings</Text>
            <View className="bg-white border border-slate-100 rounded-2xl shadow-sm">
              <MenuRow
                icon={<User size={20} color="#0D9488" />}
                title="Personal Information"
                subtitle="Edit your profile details"
                onPress={() => navigation.navigate("edit_profile")}
              />
              <MenuRow
                icon={<Bell size={20} color="#0D9488" />}
                title="Notification Settings"
                subtitle="Manage alerts and updates"
                onPress={() => navigation.navigate("notification_inbox_screen")}
              />
              <MenuRow
                icon={<ShieldCheck size={20} color="#0D9488" />}
                title="Security & Password"
                subtitle="Protect your account access"
                onPress={() => navigation.navigate("change_password")}
                isLast
              />
            </View>
          </View>

          <View className="px-4 mb-6">
            <Text className="text-teal-800/80 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Support</Text>
            <View className="bg-white border border-slate-100 rounded-2xl shadow-sm">
              <MenuRow
                icon={<HelpCircle size={20} color="#0D9488" />}
                title="Help & Support"
                subtitle="Get assistance or review support"
                onPress={() => navigation.navigate("help_support")}
              />
              <MenuRow
                icon={<FileText size={20} color="#0D9488" />}
                title="Terms & Privacy"
                subtitle="Review service frameworks"
                isLast
              />
            </View>
          </View>

          <View className="px-4 mb-10">
            <TouchableOpacity className="bg-red-50/80 border border-red-100 rounded-2xl py-4 flex-row justify-center items-center" onPress={() => setLogoutModalVisible(true)}>
              <LogOut size={18} color="#DC2626" />
              <Text className="text-red-600 font-bold ml-2">Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* --- SIGN OUT CONFIRMATION MODAL --- */}
      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View className="absolute inset-0 bg-slate-900/50 flex-1 justify-center items-center px-6 z-50">
          <View className="bg-white w-full rounded-[28px] px-6 pt-10 pb-8 items-center shadow-2xl border border-gray-100">
            <View className="w-24 h-24 rounded-full bg-[#e2f2f2]/80 items-center justify-center mb-6">
              <View className="w-[72px] h-[72px] rounded-full bg-[#ccebeb] items-center justify-center">
                <LogOut color="#005f5f" size={32} strokeWidth={2.2} />
              </View>
            </View>

            <Text className="text-slate-900 text-2xl font-bold tracking-tight text-center mb-3">Sign Out</Text>

            <Text className="text-gray-500 text-[14px] font-medium text-center leading-relaxed max-w-[260px] mb-8">
              Are you sure you want to log out? Any unsaved changes to patient records might be lost.
            </Text>

            <TouchableOpacity
              onPress={confirmLogout}
              className="bg-[#006666] w-full py-3.5 rounded-xl items-center justify-center shadow-sm active:opacity-90 mb-3"
            >
              <Text className="text-white text-sm font-bold tracking-wide">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLogoutModalVisible(false)}
              className="bg-white w-full py-3.5 rounded-xl items-center justify-center border border-slate-400/80 active:bg-gray-50 mb-6"
            >
              <Text className="text-[#005f5f] text-sm font-bold tracking-wide">Cancel</Text>
            </TouchableOpacity>

            <View className="bg-[#f0f2fc] border border-[#e2e8f0] rounded-full py-1.5 pl-1.5 pr-4 flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-teal-800 items-center justify-center mr-2">
                <Text className="text-white text-[10px] font-bold">{String(userData?.firstName?.[0] ?? "D").toUpperCase()}</Text>
              </View>
              <Text className="text-slate-700 text-xs font-semibold tracking-wide">
                Active Session: <Text className="font-bold">Dr. {userData?.lastName || "Doctor"}</Text>
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
