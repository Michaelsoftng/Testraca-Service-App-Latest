import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Video,
  Phone,
  Plus,
  Send,
  Mic,
  MicOff,
  VideoOff,
  Smile,
} from "lucide-react-native";
import { spacing } from "../../../../theme";
import { ChatBubble } from "../../../../components/ChatBubble";
import PrescriptionModal from "../(modals)/prescription";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useConsultationSocket } from "../../../web-socket/useConsultationSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetUserDetails } from "../../../../hook/useGetUserDetails";
import { useWebRTCCall } from "./useWebRTCCall";
import * as WebBrowser from "expo-web-browser";

const { height: screenHeight } = Dimensions.get("window");

const getJitsiRoomId = (consultationId: string) => `phelbo-${consultationId}`;
const getJitsiCallUrl = (consultationId: string, callType: "audio" | "video") => {
  const baseUrl = `https://meet.jit.si/${getJitsiRoomId(consultationId)}`;
  return callType === "audio" ? `${baseUrl}#config.startWithVideoMuted=true` : baseUrl;
};

// Warm up Chrome Custom Tabs on Android so openBrowserAsync doesn't cold-start fail.
const warmUpBrowser = () => { WebBrowser.warmUpAsync().catch(() => {}); };
const coolDownBrowser = () => { WebBrowser.coolDownAsync().catch(() => {}); };

/** Opens a URL in-app browser first; falls back to system Linking on failure. */
const openUrl = async (url: string): Promise<void> => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (browserErr) {
    console.warn("[Call] openBrowserAsync failed, trying Linking:", browserErr);
    try {
      await Linking.openURL(url);
    } catch (linkErr) {
      console.warn("[Call] Linking.openURL also failed:", linkErr);
      throw linkErr;
    }
  }
};

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute<any>();
  const { userId, consultaionId, patientName } = route.params;

  const { userData } = useGetUserDetails();

  const patientInitials = useMemo(() => {
    const initials = String(patientName || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase();
    return initials || "P";
  }, [patientName]);

  const patientIdSuffix = useMemo(() => {
    return String(userId || "").slice(-6).toUpperCase() || "N/A";
  }, [userId]);

  const scrollRef = useRef<ScrollView>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [socketError, setSocketError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("userToken_").then(setToken);
    warmUpBrowser();
    return () => { coolDownBrowser(); };
  }, []);

  // Load persisted message history from AsyncStorage to prevent duplicates across app restarts
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const key = `consultation_${consultaionId}_messages`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Failed to load messages from storage", e);
      } finally {
        setMessagesLoaded(true);
      }
    };

    const loadSeenMessages = async () => {
      try {
        const key = `consultation_${consultaionId}_seen_messages`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          seenMessagesRef.current = new Map(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Failed to load seen messages from storage", e);
      }
      seenMessagesLoadedRef.current = true;
    };

    loadMessages();
    loadSeenMessages();
  }, [consultaionId]);

  const saveMessagesToStorage = useCallback(async (msgs: any[]) => {
    if (!messagesLoaded) return;
    try {
      await AsyncStorage.setItem(`consultation_${consultaionId}_messages`, JSON.stringify(msgs));
    } catch (e) {
      console.warn("Failed to save messages to storage", e);
    }
  }, [consultaionId, messagesLoaded]);

  useEffect(() => {
    if (messagesLoaded && messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages, messagesLoaded, saveMessagesToStorage]);

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendSessionSignalRef = useRef<(payload: any) => void>(() => {});
  const handleSessionSignalRef = useRef<(payload: any, currentUserId: string) => Promise<void> | void>(() => {});
  // Prevent flooding the socket with repeated typing events
  const outgoingTypingRef = useRef(false);
  const recentSystemEventsRef = useRef<Map<string, number>>(new Map());
  // Persisted across reconnects via AsyncStorage
  const seenMessagesRef = useRef<Map<string, number>>(new Map());
  const seenMessagesLoadedRef = useRef(false);
  const latestUnreadMessageRef = useRef<string | null>(null);
  const unreadDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readSentSetRef = useRef<Set<string>>(new Set());

  const saveSeenMessages = useCallback(async () => {
    if (!seenMessagesLoadedRef.current) return;
    try {
      const entries = Array.from(seenMessagesRef.current.entries());
      await AsyncStorage.setItem(`consultation_${consultaionId}_seen_messages`, JSON.stringify(entries));
    } catch (e) {
      console.warn("Failed to save seen messages to storage", e);
    }
  }, [consultaionId]);

  const handleRefresh = useCallback(async () => {
    if (!consultaionId) return;
    setRefreshing(true);
    try {
      const key = `consultation_${consultaionId}_messages`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
      setSocketError("");
    } catch (error) {
      console.warn("Chat refresh failed", error);
    } finally {
      setRefreshing(false);
    }
  }, [consultaionId]);

  const handleTyping = (text: string) => {
    setMessage(text);
    try {
      if (!outgoingTypingRef.current && text.trim()) {
        outgoingTypingRef.current = true;
        sendMessage({ origin: "user", action: "typing" }, "update_message");
      }
    } catch (e) {
      console.warn("Could not send typing event", e);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      try {
        if (outgoingTypingRef.current) {
          sendMessage({ origin: "user", action: "stop_typing" }, "update_message");
          outgoingTypingRef.current = false;
        }
      } catch (e) {
        outgoingTypingRef.current = false;
      }
    }, 1200);
  };

  const {
    webrtcAvailable,
    callType,
    callState,
    localStreamURL,
    remoteStreamURL,
    isMuted,
    isCameraEnabled,
    RTCView,
    startCall: startWebRTCCall,
    endCall,
    toggleMute,
    toggleCamera,
    handleSessionSignal,
  } = useWebRTCCall({
    consultationId: String(consultaionId),
    senderId: String(userId),
    senderName: `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim(),
    sendSession: (payload) => sendSessionSignalRef.current(payload),
  });

  useEffect(() => {
    handleSessionSignalRef.current = handleSessionSignal;
  }, [handleSessionSignal]);

  const handleSocketMessage = useCallback((data: any) => {
    const { action_type, payload } = data;

    if (action_type === "update_message" && payload?.message) {
      if (!seenMessagesLoadedRef.current) return;

      // Suppress all system-origin display messages (join/leave notifications)
      if (payload.origin === "system") {
        const key = `${payload.message}::${payload.sender_id || ""}`;
        const prev = recentSystemEventsRef.current.get(key) || 0;
        if (Date.now() - prev < 30_000) return;
        recentSystemEventsRef.current.set(key, Date.now());
        setTimeout(() => recentSystemEventsRef.current.delete(key), 60000);
        return;
      }

      const fingerprint = payload.message_id
        ? `id:${payload.message_id}`
        : `f:${payload.sender_id || "unknown"}:${payload.timestamp || new Date().toISOString()}:${(payload.message || "").slice(0, 100).trim()}`;

      if (seenMessagesRef.current.has(fingerprint)) {
        seenMessagesRef.current.set(fingerprint, Date.now());
        saveSeenMessages();
        return;
      }

      const messageId = payload.message_id || (payload as any).id || null;
      const timestamp = (payload as any).timestamp || new Date().toISOString();
      const uid = messageId ? `${messageId}` : `${timestamp}_${Math.random().toString(36).slice(2, 8)}`;
      const isFromMe = payload.sender_id === userId || payload.sender_id === route.params.userId;

      setMessages((prev) => {
        // Update existing message (e.g. optimistic match by uid or message_id)
        if (prev.some((m) => m.uid === uid || (messageId && m.message_id === messageId))) {
          return prev.map((m) =>
            m.uid === uid || (messageId && m.message_id === messageId)
              ? { ...m, text: payload.message || m.text, timestamp, sent: true, message_id: messageId || m.message_id, me: m.me || isFromMe }
              : m
          );
        }

        // Match optimistic message by message_id
        let optimisticIdx = messageId
          ? prev.findIndex((m) => m.me && !m.sent && m.message_id === messageId)
          : -1;

        // Match by text + sender
        if (optimisticIdx === -1) {
          optimisticIdx = prev.findIndex(
            (m) => m.me && !m.sent && m.text === (payload.message || "") && m.uid?.includes(payload.sender_id || "")
          );
        }

        // Match by text + time window (±10s)
        if (optimisticIdx === -1) {
          optimisticIdx = prev.findIndex(
            (m) =>
              m.me && !m.sent && m.text === (payload.message || "") &&
              Math.abs(new Date(m.timestamp).valueOf() - new Date(timestamp).valueOf()) < 10000
          );
        }

        if (optimisticIdx !== -1) {
          const updated = [...prev];
          updated[optimisticIdx] = { ...updated[optimisticIdx], text: payload.message || updated[optimisticIdx].text, timestamp, sent: true, message_id: messageId || updated[optimisticIdx].message_id };
          try {
            seenMessagesRef.current.set(fingerprint, Date.now());
            saveSeenMessages();
          } catch (e) {}
          return updated;
        }

        // Fallback: unsent message from us with same text (offline send)
        if (payload.sender_id === userId) {
          const unsentIdx = prev.findIndex((m) => m.me && !m.sent && m.text === (payload.message || ""));
          if (unsentIdx !== -1) {
            const updated = [...prev];
            updated[unsentIdx] = { ...updated[unsentIdx], timestamp, sent: true, message_id: messageId || updated[unsentIdx].message_id };
            try { seenMessagesRef.current.set(fingerprint, Date.now()); saveSeenMessages(); } catch (e) {}
            return updated;
          }
        }

        const next = [
          ...prev,
          { uid, message_id: messageId, id: messageId, text: payload.message, me: isFromMe, read: false, sent: true, timestamp },
        ];
        try { seenMessagesRef.current.set(fingerprint, Date.now()); saveSeenMessages(); } catch (e) {}
        next.sort((a, b) => new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf());
        return next;
      });

      // Debounced read receipt for messages from the other party
      if (payload.origin === "user" && payload.message_id && payload.sender_id !== userId) {
        if (!readSentSetRef.current.has(payload.message_id)) {
          latestUnreadMessageRef.current = payload.message_id;
          if (unreadDebounceRef.current) clearTimeout(unreadDebounceRef.current);
          unreadDebounceRef.current = setTimeout(() => {
            const mid = latestUnreadMessageRef.current;
            if (mid && !readSentSetRef.current.has(mid)) {
              sendMessage({ origin: "system", action: "read", message_id: mid }, "update_message");
              readSentSetRef.current.add(mid);
              latestUnreadMessageRef.current = null;
            }
          }, 1500);
        }
      }

      setIsTyping(false);
    }

    if (payload?.action === "typing") setIsTyping(true);
    if (payload?.action === "stop_typing") setIsTyping(false);

    if (payload?.action === "read") {
      setMessages((prev) =>
        prev.map((m) => (m.message_id === payload.message_id ? { ...m, read: true } : m))
      );
    }

    if (action_type === "update_session" && payload?.action === "end_consultation") {
      setSessionEnded(true);
    }

    if (action_type === "update_session" && payload?.action === "error") {
      setSocketError(String(payload?.message || "Session error"));
    }

    if (action_type === "update_session" && payload?.action) {
      handleSessionSignalRef.current(payload, String(userId));
    }
  }, [consultaionId, userId, saveSeenMessages]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (unreadDebounceRef.current) clearTimeout(unreadDebounceRef.current);
    };
  }, []);

  // Prune seenMessagesRef periodically to prevent unbounded memory growth
  useEffect(() => {
    const prune = () => {
      const now = Date.now();
      const maxAge = 1000 * 60 * 60 * 24; // 24 hours
      const map = seenMessagesRef.current;
      for (const [k, ts] of map.entries()) {
        if (now - ts > maxAge) map.delete(k);
      }
      if (map.size > 2000) {
        const entries = Array.from(map.entries()).sort((a, b) => a[1] - b[1]);
        entries.slice(0, map.size - 2000).forEach(([k]) => map.delete(k));
      }
    };
    const id = setInterval(prune, 1000 * 60 * 5);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => { recentSystemEventsRef.current.clear(); };
  }, []);

  const { sendMessage, connected } = useConsultationSocket({
    consultationId: consultaionId,
    token: token ?? "",
    onMessage: handleSocketMessage,
    authOnOpen: true,
  });

  useEffect(() => {
    sendSessionSignalRef.current = (payload: any) => {
      sendMessage(payload, "update_session");
    };
  }, [sendMessage]);

  if (!token) {
    return <Text>Connecting...</Text>;
  }

  const handleSend = () => {
    if (!message.trim() || sessionEnded) return;
    const messageId = Date.now().toString();
    const timestamp = new Date().toISOString();
    const uid = `${messageId}_${Math.random().toString(36).slice(2, 8)}`;

    const sentImmediately = sendMessage(
      { origin: "user", type: "text", message, sender_id: userId, message_id: messageId, timestamp },
      "update_message"
    );

    setMessages((prev) => {
      const next = [
        ...prev,
        { uid, id: messageId, message_id: messageId, text: message, me: true, read: false, sent: !!sentImmediately, timestamp },
      ];
      next.sort((a, b) => new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf());
      return next;
    });

    try {
      if (outgoingTypingRef.current) {
        sendMessage({ origin: "user", action: "stop_typing" }, "update_message");
        outgoingTypingRef.current = false;
      }
    } catch (e) {
      outgoingTypingRef.current = false;
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }

    setMessage("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const handleEndSession = () => {
    if (sessionEnded) return;
    sendMessage(
      {
        action: "end_consultation",
        origin: "user",
        sender_id: userId,
        sender_name: `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim(),
        reason: "Consultation completed",
      },
      "update_session"
    );
    setSessionEnded(true);
  };

  const startCall = (type: "audio" | "video") => {
    if (!webrtcAvailable) {
      const callUrl = getJitsiCallUrl(String(consultaionId), type);
      openUrl(callUrl).catch(() => Alert.alert("Error", "Unable to open the call link."));
      return;
    }
    startWebRTCCall(type).catch((error: any) => {
      Alert.alert("Call error", error?.message || "Unable to start call.");
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-[#0b1329]">
        <StatusBar barStyle="light-content" backgroundColor="#0b1329" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 bg-gray-50"
        >
          {/* Header */}
          <View className="bg-[#0A1629] px-4 pt-3 pb-4 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3 flex-1">
              <TouchableOpacity className="mr-2 active:opacity-70" onPress={() => navigation.goBack()}>
                <ArrowLeft color="#ffffff" size={24} />
              </TouchableOpacity>

              <View className="w-12 h-12 bg-[#008b8b] rounded-full items-center justify-center">
                <Text className="text-white text-lg font-bold">{patientInitials}</Text>
              </View>

              <View className="ml-2 flex-1">
                <Text className="text-white font-semibold text-base" numberOfLines={1}>
                  {patientName || "Patient"}
                </Text>
                <Text className="text-gray-400 text-xs tracking-wider font-medium">
                  {connected ? "ACTIVE NOW" : "OFFLINE"} • PATIENT ID: #{patientIdSuffix}
                </Text>
                {!!socketError && (
                  <Text className="text-[11px] text-[#FECACA] mt-1">{socketError}</Text>
                )}
              </View>
            </View>

            <View className="flex-row items-center space-x-5">
              <TouchableOpacity className="mx-2 active:opacity-70" onPress={() => startCall("video")}>
                <Video color="#ffffff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity className="mx-2 active:opacity-70" onPress={() => startCall("audio")}>
                <Phone color="#ffffff" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub-header action bar */}
          <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-1.5">
              <View className={`w-2 h-2 rounded-full ${sessionEnded ? "bg-gray-400" : "bg-emerald-500"}`} />
              <Text className="text-[#008b8b] font-semibold text-sm ml-1">
                {sessionEnded ? "Consultation\nEnded" : "Consultation\nActive"}
              </Text>
            </View>

            <View className="flex-row space-x-2">
              <TouchableOpacity
                className="bg-[#008b8b] flex-row items-center px-4 py-2 rounded-lg mr-2 active:opacity-90"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white font-medium text-sm">Write prescription</Text>
              </TouchableOpacity>

              {!sessionEnded && (
                <TouchableOpacity
                  className="bg-[#cc0000] flex-row items-center px-3 py-2 rounded-lg active:opacity-90"
                  onPress={handleEndSession}
                >
                  <View className="w-4 h-4 rounded-full border-2 border-white items-center justify-center mr-1">
                    <View className="w-1.5 h-1.5 bg-white rounded-sm" />
                  </View>
                  <Text className="text-white font-medium text-sm">End Consultation</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Chat body */}
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-4 py-2"
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#008b8b" />
            }
          >
            {messages.map((m) => (
              <ChatBubble
                key={m.uid || m.id}
                me={m.me}
                text={m.text}
                status={m.me ? (m.sent ? (m.read ? "read" : "sent") : "sending") : undefined}
                time={m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : undefined}
              />
            ))}

            {isTyping && (
              <Text className="text-xs text-gray-500 italic mt-2 mb-2">Patient is typing...</Text>
            )}
          </ScrollView>

          {/* Input footer */}
          {sessionEnded ? (
            <View className="bg-white border-t border-gray-100 px-4 py-3">
              <Text className="text-sm font-semibold text-gray-700 text-center">This session has ended.</Text>
            </View>
          ) : (
            <View className="bg-white px-4 py-3 flex-row items-center border-t border-gray-100">
              <TouchableOpacity className="p-2">
                <Plus color="#64748b" size={24} />
              </TouchableOpacity>

              <View className="flex-1 flex-row items-center bg-[#f1f5f9] rounded-2xl px-3 mx-2 border border-gray-200">
                <TextInput
                  className="flex-1 py-2.5 text-gray-700 text-sm max-h-20"
                  placeholder="Type a message..."
                  placeholderTextColor="#94a3b8"
                  value={message}
                  onChangeText={handleTyping}
                  multiline
                  returnKeyType="send"
                  onSubmitEditing={handleSend}
                />
                <TouchableOpacity className="p-1">
                  <Smile color="#64748b" size={22} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="bg-[#008b8b] p-3 rounded-full shadow-sm active:opacity-90"
                onPress={handleSend}
                disabled={!message.trim()}
              >
                <Send color="#ffffff" size={18} />
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.modalContent} onPress={() => null}>
              <PrescriptionModal
                consultationId={String(consultaionId || "")}
                name={patientName}
                mode="prescription"
                onSubmitted={() => setModalVisible(false)}
              />
            </Pressable>
          </Pressable>
        </Modal>

        {callState !== "idle" && (
          <View style={styles.callOverlay}>
            <View style={styles.callCard}>
              <Text style={styles.callTitle}>
                {callType === "video" ? "Video Call" : "Audio Call"}
              </Text>
              <Text style={styles.callStateText}>{callState.replace("_", " ")}</Text>

              {callType === "video" && RTCView && localStreamURL && (
                <View style={styles.localVideoWrapper}>
                  <RTCView streamURL={localStreamURL} style={styles.localVideo} objectFit="cover" />
                </View>
              )}

              {callType === "video" && RTCView && remoteStreamURL && (
                <View style={styles.remoteVideoWrapper}>
                  <RTCView streamURL={remoteStreamURL} style={styles.remoteVideo} objectFit="cover" />
                </View>
              )}

              <View style={styles.callControls}>
                <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                  {isMuted ? <MicOff size={22} color="#111" /> : <Mic size={22} color="#111" />}
                </TouchableOpacity>
                {callType === "video" && (
                  <TouchableOpacity onPress={toggleCamera} style={styles.controlButton}>
                    {isCameraEnabled ? <Video size={22} color="#111" /> : <VideoOff size={22} color="#111" />}
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => endCall(true)} style={styles.hangupButton}>
                  <Phone size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: screenHeight * 0.82,
    width: "100%",
  },
  callOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  callCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  callTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  callStateText: {
    fontSize: 13,
    textTransform: "capitalize",
    color: "#6B7280",
  },
  localVideoWrapper: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111827",
  },
  localVideo: {
    width: "100%",
    height: "100%",
  },
  remoteVideoWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0B1220",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
  },
  callControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  hangupButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
});
