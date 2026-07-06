import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowRight, Clock, Home, Mic, ShieldCheck, VideoOff, User, Stethoscope, Truck, Check } from 'lucide-react-native';

const { width } = Dimensions.get("window");

// ── Onboarding feature slides ─────────────────────────────────────────────
const featureSlides = [
  {
    id: 0,
    title: "Lab Testing at Your Doorstep",
    subtitle:
      "Book diagnostic tests and have a professional phlebotomist visit your home or office.",
    badge: "HOME COLLECTION",
    overlayName: "Labtraca Health",
    overlayRole: "Certified · ISO 9001:2015",
    showFeatures: true,
    image: require("../../../assets/images/icon.png"),
  },
  {
    id: 1,
    title: "Talk to a Doctor Anytime",
    subtitle:
      "Connect with verified medical professionals for live consultations or result reviews.",
    badge: "LIVE CONSULTATION",
    // overlayName: "Dr. Sarah Mitchell",
    overlayRole: "Live Now  ·",//  General Physician",
    showFeatures: false,
    image: require("../../../assets/images/icon.png"),
  },
];

// ── Role selection ────────────────────────────────────────────────────────
type Role = "A phlebotomist" | "A doctor" | "A dispatcher";

const ROLE_TO_USER_TYPE: Record<Role, string> = {
  "A phlebotomist": "PHLEBOTOMIST",
  "A doctor": "DOCTOR",
  "A dispatcher": "DISPATCHER",
};

const ROLE_CONFIG: { role: Role; icon: React.ComponentType<any>; title: string; description: string }[] = [
  { role: "A phlebotomist", icon: User,        title: "Phlebotomist", description: "Collect samples and manage pickups" },
  { role: "A doctor",       icon: Stethoscope, title: "Doctor",       description: "Manage patients and clinical orders" },
  { role: "A dispatcher",   icon: Truck,       title: "Dispatcher",   description: "Deliver samples to laboratories" },
];

// ── Logo ──────────────────────────────────────────────────────────────────
function BrandLogo() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 30,
          height: 30,
          // backgroundColor: "#006968",
          borderRadius: 7,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
        }}
      >
        <Image 
  source={require('../../assets/images/Labtraca_Logo.png')} 
  style={{
    width: 24,              // Image width
    height: 24,             // Image height
    resizeMode: 'contain'   // Ensure icon fits in bounds
  }} 
/>
        {/* <View style={{ position: "absolute", width: 16, height: 5, backgroundColor: "white", borderRadius: 1 }} />
        <View style={{ position: "absolute", width: 5, height: 16, backgroundColor: "white", borderRadius: 1 }} /> */}
      </View>
      <Text style={{ color: "#006968", fontWeight: "800", fontSize: 20, letterSpacing: 0.5 }}>
        Labtraca
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const navigation = useNavigation<any>();

  // phase: 0 or 1 = feature slides; 2 = role selection
  const [phase, setPhase] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<Role>("A phlebotomist");

  const loginType = useMemo(() => ROLE_TO_USER_TYPE[selectedRole], [selectedRole]);

  const handleContinue = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    await AsyncStorage.setItem("userRole", selectedRole);
    navigation.navigate("login", { userTypes: loginType });
  };

  const goToRoles = () => setPhase(featureSlides.length); // skip to role selection
  const isSlidePhase = phase < featureSlides.length;

  // ── Feature slide view ──────────────────────────────────────────────────
  if (isSlidePhase) {
    const slide = featureSlides[phase];
    const isLast = phase === featureSlides.length - 1;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FC" }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 24 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" />

        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 18, paddingBottom: 4 }}>
          <BrandLogo />
          <TouchableOpacity activeOpacity={0.7} onPress={goToRoles}>
            <Text style={{ color: "#6C757D", fontWeight: "500", fontSize: 15 }}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
          {/* Image card */}
          <View
            style={{
              width: width - 48,
              aspectRatio: 1,
              borderRadius: 40,
              overflow: "hidden",
              backgroundColor: "#D2EDF7",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Image source={slide.image} style={{ width: "100%", height: "90%" }} resizeMode="cover" />

            {/* Floating overlay */}
            <View
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 20,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              {...(Platform.OS === "android" ? { elevation: 4 } : {})}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#E6F0F0", alignItems: "center", justifyContent: "center", marginRight: 10, borderWidth: 1, borderColor: "rgba(0,105,104,0.12)" }}>
                  <ShieldCheck size={20} color="#006968" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#1A1C1E", fontWeight: "700", fontSize: 14 }} numberOfLines={1}>
                    {slide.overlayName}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#006968", marginRight: 5 }} />
                    <Text style={{ color: "#6C757D", fontSize: 11, fontWeight: "500" }} numberOfLines={1}>
                      {slide.overlayRole}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#E6F0F0", alignItems: "center", justifyContent: "center" }}>
                  <Mic size={16} color="#006968" />
                </View>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" }}>
                  <VideoOff size={16} color="#EF4444" />
                </View>
              </View>
            </View>
          </View>

          {/* Text */}
          <View style={{ alignItems: "center", marginTop: 32, paddingHorizontal: 8 }}>
            <Text style={{ color: "#1A1C1E", fontSize: 28, fontWeight: "800", textAlign: "center", lineHeight: 36 }}>
              {slide.title}
            </Text>
            <Text style={{ color: "#6C757D", textAlign: "center", fontSize: 15, marginTop: 12, lineHeight: 22 }}>
              {slide.subtitle}
            </Text>
          </View>

          {/* Pagination */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24 }}>
            {featureSlides.map((_, i) => (
              <View
                key={i}
                style={{
                  height: 8, borderRadius: 4,
                  backgroundColor: i === phase ? "#006968" : "#D1D5DB",
                  width: i === phase ? 24 : 8,
                  marginHorizontal: 3,
                }}
              />
            ))}
          </View>
        </View>

        {/* Feature footer */}
        {slide.showFeatures && (
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: 8, gap: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={14} color="#4a656e" />
              <Text style={{ color: "#4a656e", fontSize: 12, fontWeight: "600", marginLeft: 5 }}>Results in 24h</Text>
            </View>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#9CA3AF" }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Home size={14} color="#4a656e" />
              <Text style={{ color: "#4a656e", fontSize: 12, fontWeight: "600", marginLeft: 5 }}>Home Visit</Text>
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPhase(phase + 1)}
            style={{
              backgroundColor: "#006968",
              paddingVertical: 16,
              borderRadius: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#006968",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 17, marginRight: 8 }}>
              {isLast ? "Get Started" : "Next"}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Role selection view ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FC" }}>
       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 24 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FC" />

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <BrandLogo />
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#1A1C1E", marginBottom: 8 }}>
          Sign in as
        </Text>
        <Text style={{ fontSize: 15, color: "#6C757D", lineHeight: 22, marginBottom: 28 }}>
          Select your role to continue to your personalized dashboard.
        </Text>

        <View style={{ gap: 12 }}>
          {ROLE_CONFIG.map(({ role, icon: Icon, title, description }) => {
            const isSelected = selectedRole === role;
            return (
              <TouchableOpacity
                key={role}
                activeOpacity={0.8}
                onPress={() => setSelectedRole(role)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  backgroundColor: "white",
                  borderRadius: 18,
                  borderWidth: 1.5,
                  borderColor: isSelected ? "#006968" : "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 12 }}>
                  <View style={{ padding: 12, borderRadius: 14, marginRight: 14, backgroundColor: isSelected ? "#006968" : "#E6F0F0" }}>
                    <Icon size={22} color={isSelected ? "#FFFFFF" : "#006968"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#1A1C1E" }}>{title}</Text>
                    <Text style={{ fontSize: 13, color: "#6C757D", marginTop: 2 }}>{description}</Text>
                  </View>
                </View>
                <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                  {isSelected && (
                    <View style={{ backgroundColor: "#006968", borderRadius: 12, padding: 3 }}>
                      <Check size={13} color="#FFF" strokeWidth={3} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: "#F8F9FC" }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleContinue}
          style={{
            backgroundColor: "#006968",
            width: "100%",
            paddingVertical: 16,
            borderRadius: 14,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#006968",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "700", marginRight: 8 }}>Continue</Text>
          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={{ color: "#ADB5BD", textAlign: "center", fontSize: 12, marginTop: 12 }}>
          Secure sign-in powered by Labtraca
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
