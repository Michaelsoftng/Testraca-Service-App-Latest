import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Clock, RefreshCw, CheckCircle2 } from "lucide-react-native";
import WebView from "react-native-webview";
import PrescriptionModal from "./(modals)/prescription";
import { ACCEPT_RESULT_REVIEW, GET_RESULT_REVIEW_BY_ID } from "../../../schema/ApiSchema";
import { useApolloClient, useMutation } from "@apollo/client";
import formatNaira from "../../../components/FormatNaira";
import { useGetUserDetails } from "../../../hook/useGetUserDetails";

const { height: screenHeight } = Dimensions.get("window");

type StatusKind = "pending" | "in-progress" | "completed";

const STATUS_STYLES: Record<
  StatusKind,
  { bg: string; text: string; icon: "clock" | "processing" | "completed"; iconColor: string }
> = {
  pending: { bg: "bg-[#ffebee]", text: "text-[#cc0000]", icon: "clock", iconColor: "#cc0000" },
  "in-progress": { bg: "bg-[#e0f7fa]", text: "text-[#00b8d4]", icon: "processing", iconColor: "#00b8d4" },
  completed: { bg: "bg-[#e8f5e9]", text: "text-[#2e7d32]", icon: "completed", iconColor: "#2e7d32" },
};

const toStatusKind = (status: string): StatusKind => {
  const s = status.toUpperCase();
  if (s.includes("COMPLETE")) return "completed";
  if (s.includes("ONGOING") || s.includes("IN_PROGRESS") || s.includes("ACCEPTED")) return "in-progress";
  return "pending";
};

const formatDuration = (minutes: number) => {
  if (!minutes) return "0 min";
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} min`;
};

export default function ReviewRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const client = useApolloClient();

  const { id, requestType } = route.params ?? {};
  const [requestData, setRequestData] = useState<any>(null);
  const [prescriptionVisible, setPrescriptionVisible] = useState(false);
  const [loading_, setLoading] = useState(false);

  const { userData } = useGetUserDetails();
  const [AcceptResultReviewRequest] = useMutation(ACCEPT_RESULT_REVIEW);

  useEffect(() => {
    const fetchRequestById = async (requestId: string) => {
      const { data } = await client.query({
        query: GET_RESULT_REVIEW_BY_ID,
        variables: { id: requestId },
      });
      setRequestData(data.getResultReviewById);
    };
    if (id) fetchRequestById(id);
  }, [client, id]);

  const statusKind = useMemo(() => toStatusKind(String(requestData?.status || "")), [requestData?.status]);

  const statusLabel = useMemo(
    () => String(requestData?.status || "Request").replaceAll("_", " "),
    [requestData?.status]
  );

  const consultationIdSuffix = useMemo(() => {
    const value = String(requestData?.id || "");
    if (!value) return "N/A";
    const split = value.split("-");
    return split[split.length - 1] || value;
  }, [requestData?.id]);

  const attachments = useMemo(() => {
    try {
      const raw = requestData?.results;
      if (!raw) return [];
      if (Array.isArray(raw)) return raw.filter(Boolean);
      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
          if (typeof parsed === "string") return [parsed];
        } catch {
          if (raw.includes(",")) return raw.split(",").map((s) => s.trim()).filter(Boolean);
          return [raw.trim()].filter(Boolean);
        }
      }
      return [];
    } catch {
      return [];
    }
  }, [requestData?.results]);

  if (!requestData) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#f8fafc] items-center justify-center">
        <ActivityIndicator size="small" color="#006666" />
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_STYLES[statusKind];
  const isCompletedReview = String(requestData.status).toUpperCase() === "RESULT_REVIEW_COMPLETE";

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#f8fafc]">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="bg-white border-b border-gray-100 px-4 py-3.5 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <ArrowLeft color="#005f5f" size={24} />
        </TouchableOpacity>
        <Text className="text-[#005f5f] text-lg font-bold">Result Review Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Status / ID pills */}
        <View className="flex-row items-center mb-4">
          <View className={`${statusStyle.bg} px-3 py-1.5 rounded-full flex-row items-center mr-2`}>
            {statusStyle.icon === "clock" && <Clock color={statusStyle.iconColor} size={13} />}
            {statusStyle.icon === "processing" && <RefreshCw color={statusStyle.iconColor} size={13} />}
            {statusStyle.icon === "completed" && <CheckCircle2 color={statusStyle.iconColor} size={13} />}
            <Text className={`${statusStyle.text} text-[11px] font-black tracking-wider ml-1.5`}>
              {statusLabel.toUpperCase()}
            </Text>
          </View>
          <View className="bg-gray-100 px-3 py-1.5 rounded-full">
            <Text className="text-gray-500 text-[11px] font-bold">#{consultationIdSuffix}</Text>
          </View>
        </View>

        <Section title="Requested doctor type">
          <Row label="Doctor type" value={requestData.requestedDoctorType || "N/A"} />
          <Row label="Requested duration" value={`${requestData.requestedDuration || 0} min`} />
          <Row label="Consultation ID" value={consultationIdSuffix} />
          <Row label="Created at" value={String(requestData.createdAt || "").split("T")[0] || "N/A"} isLast />
        </Section>

        <Section title="Medical history">
          <Row label="Previous illnesses" value={requestData.medicalhistory || "N/A"} isLast />
        </Section>

        <Section title="Purpose">
          <Row label="Primary purpose" value={requestData.purpose || "N/A"} bold isLast />
        </Section>

        <Section title="Additional information">
          <Row label="Other details" value={requestData.otherdetails || "N/A"} />
          <Row label="Preferred language for communication" value="English" isLast />
        </Section>

        <Section title="Medical documents">
          {attachments.length > 0 ? (
            attachments.map((url: string, index: number) => (
              <Row
                key={`${url}-${index}`}
                label={`Document ${index + 1}`}
                value="View"
                link
                url={url}
                isLast={index === attachments.length - 1}
              />
            ))
          ) : (
            <Text className="text-gray-400 text-sm">No documents available</Text>
          )}
        </Section>

        <Section title="Payment">
          <Row label="Consultation fee" value={formatNaira(requestData.total || 0)} bold isLast />
        </Section>

        <Section title="Consultation duration">
          <Row label="Session length" value={formatDuration(requestData.requestedDuration)} isLast />
        </Section>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading_ || (requestType === "acceptedOnly" && isCompletedReview)}
          onPress={
            requestType === "acceptedOnly"
              ? () => (isCompletedReview ? null : setPrescriptionVisible(true))
              : async () => {
                  setLoading(true);
                  if (id && userData?.id) {
                    try {
                      const response = await AcceptResultReviewRequest({
                        variables: { doctorId: userData.id, resultReviewId: id },
                      });
                      setLoading(false);
                      Alert.alert("Success", response.data.AcceptResultReview.resultReview.message, [
                        { text: "Cancel", style: "cancel" },
                        { text: "Okay", style: "destructive", onPress: () => navigation.navigate("Ward", {}) },
                      ]);
                    } catch (error) {
                      setLoading(false);
                      Alert.alert("Server Error", "Unable to accept request right now. Please try again.");
                    }
                  } else {
                    Alert.alert("Server Error", "Required details are missing.");
                    setLoading(false);
                  }
                }
          }
          className={`mt-2 mb-2 py-4 rounded-xl items-center justify-center ${
            requestType === "acceptedOnly" && isCompletedReview ? "bg-gray-300" : "bg-[#006666]"
          } ${loading_ ? "opacity-60" : ""}`}
        >
          <Text className="text-white text-sm font-bold tracking-wide">
            {loading_
              ? "Processing..."
              : requestType === "acceptedOnly"
              ? isCompletedReview
                ? "Completed"
                : "Submit Note"
              : "Accept request"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Prescription / Note modal */}
      <Modal
        animationType="slide"
        transparent
        visible={prescriptionVisible}
        onRequestClose={() => setPrescriptionVisible(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setPrescriptionVisible(false)}>
          <Pressable style={{ width: "100%", height: screenHeight * 0.8 }} onPress={() => null}>
            <PrescriptionModal
              mode="note"
              name={
                [requestData?.patient?.firstName, requestData?.patient?.lastName].filter(Boolean).join(" ") ||
                requestData?.patientName ||
                ""
              }
              resultReviewId={id}
              submissionType="resultReview"
              onSubmitted={() => setPrescriptionVisible(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* Helper Components */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
    <Text className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-3">{title}</Text>
    {children}
  </View>
);

const Row = ({
  label,
  value,
  bold = false,
  link = false,
  url = "",
  isLast = false,
}: {
  label?: string;
  value?: any;
  bold?: boolean;
  link?: boolean;
  url?: string;
  isLast?: boolean;
}) => {
  const [modalVisible_, setModalVisible_] = useState(false);
  const [imgUri, setImgUri] = useState("");

  const openDoc = () => {
    if (!link) return;
    if (url && url.startsWith("http")) {
      setImgUri(url);
      setModalVisible_(true);
      return;
    }
    Alert.alert("Invalid URL", "Cannot open this document link.");
  };

  return (
    <View className={`flex-row justify-between items-center py-2.5 ${isLast ? "" : "border-b border-gray-50"}`}>
      <Text className="text-gray-500 text-[13px] flex-1 pr-3">{label}</Text>
      <TouchableOpacity activeOpacity={link ? 0.7 : 1} className="flex-1 items-end" onPress={openDoc} disabled={!link}>
        <Text
          numberOfLines={10}
          className={`text-[13px] text-right ${
            link ? "text-[#006666] font-bold" : bold ? "text-gray-900 font-bold" : "text-gray-900 font-semibold"
          }`}
        >
          {value}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible_} animationType="slide">
        <WebView source={{ uri: encodeURI(imgUri || "") }} />
        <View className="items-center justify-center bg-black/70 py-3">
          <TouchableOpacity onPress={() => setModalVisible_(false)}>
            <Text className="text-white text-base font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
