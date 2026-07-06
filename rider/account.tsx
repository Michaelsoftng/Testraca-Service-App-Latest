import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogOut } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Modal, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function RiderAccountScreen() {
  const navigation = useNavigation<any>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const doLogout = async () => {
    await AsyncStorage.multiRemove(["hasSeenOnboarding", "userRole"]);
    navigation.reset({ index: 0, routes: [{ name: "onboarding_screen" as never }] });
  };

  const links = [
    { id: 1, name: "Help and Support", icon: <MaterialIcons name="front-hand" size={24} />, screen: "help_support" },
    { id: 2, name: "Change Password",  icon: <MaterialIcons name="password" size={24} />, screen: "change_password" },
    { id: 3, name: "Delivery History", icon: <MaterialIcons name="history" size={24} />, screen: "audit" },
    { id: 4, name: "Payment Records",  icon: <MaterialIcons name="payment" size={24} />, screen: "payment_records" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E293B" }}>My Account</Text>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#006968", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>R</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Profile card ── */}
        <View style={{ backgroundColor: "white", margin: 16, borderRadius: 24, padding: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#006968", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 32 }}>R</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E293B" }}>Rider User</Text>
          <Text style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>rider@labtraca.com</Text>
        </View>

        {/* ── Menu items ── */}
        <View style={{ backgroundColor: "white", marginHorizontal: 16, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={link.id}
              onPress={() => navigation.navigate(link.screen as never)}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F8FAFC" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "#E0F2F1", alignItems: "center", justifyContent: "center" }}>
                  {link.icon}
                </View>
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#1E293B" }}>{link.name}</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          ))}

          {/* Logout row */}
          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" }}>
                <MaterialIcons name="logout" size={24} color="#EF4444" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#EF4444" }}>Logout</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Logout Confirmation Modal ── */}
      <Modal transparent animationType="fade" visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: "white", width: "100%", maxWidth: 360, borderRadius: 32, padding: 24, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#E0F2F1", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <LogOut size={32} color="#006968" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E293B", marginBottom: 8 }}>Sign Out</Text>
            <Text style={{ fontSize: 13, textAlign: "center", color: "#64748B", lineHeight: 20, paddingHorizontal: 8, marginBottom: 24 }}>
              Are you sure you want to log out? Your session data will be cleared.
            </Text>

            <TouchableOpacity
              onPress={() => { setShowLogoutModal(false); doLogout(); }}
              style={{ width: "100%", backgroundColor: "#006968", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 12 }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowLogoutModal(false)}
              style={{ width: "100%", backgroundColor: "white", borderRadius: 16, paddingVertical: 16, alignItems: "center", borderWidth: 1.5, borderColor: "#006968" }}
            >
              <Text style={{ color: "#006968", fontWeight: "700", fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 20, backgroundColor: "#F1F5F9", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#006968", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "white", fontWeight: "700", fontSize: 11 }}>R</Text>
              </View>
              <Text style={{ fontSize: 12, color: "#475569" }}>
                Active Session: <Text style={{ fontWeight: "800", color: "#1E293B" }}>Rider User</Text>
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
