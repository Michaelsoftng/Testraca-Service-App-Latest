import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AppScreen, PageHeader, RhythmCard, SectionTitle } from "../../../../components/ui/rhythm";
import { useGetUserDetails } from "../../../../hook/useGetUserDetails";
import useAuth from "../../../../schema/UseAuth";
import axios from "axios";
import { URL_LINK } from "../../../../../config";
import { PREFERRED_CONSULTATIONS, ACCEPT_CONSULTATION, REJECT_PREFERRED_CONSULTATION } from "../../../../schema/ApiSchema";
import { useToast } from "../../../../lib/utils/functions";

function statusLabel(raw: string) {
  return String(raw || "PENDING").replaceAll("_", " ");
}

function statusBadgeColor(status: string) {
  const s = String(status || "").toUpperCase();
  if (s.includes("COMPLETED")) return "#059669";
  if (s.includes("ACCEPTED")) return "#3B82F6";
  if (s.includes("PENDING")) return "#F59E0B";
  return "#6B7280";
}

export default function PreferredConsultationsScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const { userData } = useGetUserDetails();
  const { showToast } = useToast();

  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [rejectingConsultationId, setRejectingConsultationId] = useState<string | null>(null);

  const fetchPreferredConsultations = useCallback(async () => {
    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: PREFERRED_CONSULTATIONS,
          variables: { limit: 50, offset: 0 },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data?.data?.preferredConsultations;
      if (data?.consultations) {
        setConsultations(data.consultations);
      }
    } catch (error: any) {
      console.error("Error fetching preferred consultations:", error?.message);
      showToast("Failed to load preferred consultations", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    if (token) {
      fetchPreferredConsultations();
    }
  }, [token, fetchPreferredConsultations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPreferredConsultations();
  }, [fetchPreferredConsultations]);

  const handleAcceptConsultation = async (consultationId: string) => {
    if (!userData?.doctor?.id) {
      showToast("Doctor ID not found", "error");
      return;
    }

    setActiveConsultationId(consultationId);
    setLoadingAction(true);

    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: ACCEPT_CONSULTATION,
          variables: {
            consultationId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const success = response?.data?.data?.AcceptConsultation?.consultation?.id;
      if (success) {
        showToast("Consultation accepted successfully!", "success");
        await fetchPreferredConsultations();
        navigation.navigate("AppointmentsScreen");
      }
    } catch (error: any) {
      const message = error?.response?.data?.errors?.[0]?.message || "Failed to accept consultation";
      showToast(message, "error");
    } finally {
      setLoadingAction(false);
      setActiveConsultationId(null);
    }
  };

  const handleRejectConsultation = async (consultationId: string) => {
    setRejectingConsultationId(consultationId);

    try {
      const response = await axios.post(
        URL_LINK,
        {
          query: REJECT_PREFERRED_CONSULTATION,
          variables: { consultationId },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.errors?.length) {
        throw new Error(response?.data?.errors?.[0]?.message || "Could not reject consultation.");
      }

      showToast("success", "Consultation rejected", "Released back to the general pool.");
      setConsultations((prev) => prev.filter((item) => item.id !== consultationId));
    } catch (error: any) {
      const message =
        error?.response?.data?.errors?.[0]?.message || error?.message || "Failed to reject consultation";
      showToast("error", "Reject failed", message);
    } finally {
      setRejectingConsultationId(null);
    }
  };

  const confirmRejectConsultation = (consultationId: string) => {
    Alert.alert(
      "Reject consultation",
      "This consultation will be released back to the general pool for other doctors. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reject", style: "destructive", onPress: () => handleRejectConsultation(consultationId) },
      ]
    );
  };

  if (loading) {
    return (
      <AppScreen>
        <PageHeader title="Preferred Consultations" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <PageHeader title="Preferred Consultations" />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        className="flex-1 bg-gray-50"
      >
        {consultations.length === 0 ? (
          <View className="p-6 items-center justify-center">
            <Text className="text-gray-500 text-center">No preferred consultations available</Text>
          </View>
        ) : (
          <View className="p-4 gap-3">
            <SectionTitle>Your Preferred Consultations ({consultations.length})</SectionTitle>
            {consultations.map((consultation, index) => (
              <RhythmCard key={consultation.id || index} onPress={() => {}}>
                <View className="p-4">
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-900">
                        {consultation?.patientName || "Patient"}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {new Date(consultation?.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: statusBadgeColor(consultation?.status) + "20" }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: statusBadgeColor(consultation?.status) }}
                      >
                        {statusLabel(consultation?.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200 mb-3" />

                  {/* Patient Details */}
                  <View className="gap-2 mb-3">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-600">Age:</Text>
                      <Text className="text-xs font-medium text-gray-900">{consultation?.patientAge || "N/A"} years</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-600">Patient Email:</Text>
                      <Text className="text-xs font-medium text-gray-900">
                        {consultation?.patient?.email || "N/A"}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-600">Patient Phone:</Text>
                      <Text className="text-xs font-medium text-gray-900">
                        {consultation?.patient?.phoneNumber || "N/A"}
                      </Text>
                    </View>
                  </View>

                  {/* Purpose & Amount */}
                  <View className="bg-blue-50 p-3 rounded-lg mb-3 gap-2">
                    <View>
                      <Text className="text-xs text-blue-600 font-semibold mb-1">Purpose of Consultation</Text>
                      <Text className="text-xs text-blue-900">{consultation?.purpose || "Not specified"}</Text>
                    </View>
                  </View>

                  {/* Amount Section */}
                  <View className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-3 rounded-lg mb-3 gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-600">Consultation Fee:</Text>
                      <Text className="text-sm font-bold text-emerald-700">
                        ₦{Number(consultation?.total || 0).toLocaleString()}
                      </Text>
                    </View>
                    {consultation?.totalPaymentSum && (
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-gray-600">Total Payment:</Text>
                        <Text className="text-xs font-semibold text-gray-900">
                          ₦{Number(consultation?.totalPaymentSum || 0).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <TouchableOpacity
                    onPress={() => handleAcceptConsultation(consultation.id)}
                    disabled={
                      (loadingAction && activeConsultationId === consultation.id) ||
                      rejectingConsultationId === consultation.id
                    }
                    className={`py-3 rounded-lg items-center justify-center mb-2 ${
                      loadingAction && activeConsultationId === consultation.id
                        ? "bg-gray-300"
                        : "bg-teal-800"
                    }`}
                  >
                    {loadingAction && activeConsultationId === consultation.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="text-white font-semibold">Accept Consultation</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => confirmRejectConsultation(consultation.id)}
                    disabled={
                      rejectingConsultationId === consultation.id ||
                      (loadingAction && activeConsultationId === consultation.id)
                    }
                    className={`py-3 rounded-lg items-center justify-center ${
                      rejectingConsultationId === consultation.id ? "bg-red-100" : "bg-red-50"
                    }`}
                  >
                    {rejectingConsultationId === consultation.id ? (
                      <ActivityIndicator size="small" color="#DC2626" />
                    ) : (
                      <Text className="text-red-600 font-semibold">Reject Consultation</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </RhythmCard>
            ))}
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}
