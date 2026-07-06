import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useNotifications } from "../../../hook/useNotifications";
import { useNotificationSocket, RequestNotificationMessage } from "../../../screen/web-socket/useNotificationSocket";
import { prependNotification } from "../../../my-store/redux/notificationsSlice";
import { useToast } from "../../../lib/utils/functions";
import {
  configureNotificationHandler,
  presentLocalNotification,
  requestNotificationPermissions,
} from "../../../core/pushNotifications";
import {
  registerBackgroundFCMHandler,
  registerFCMToken,
  onFCMTokenRefresh,
  onFCMForegroundMessage,
  getFCMPlatform,
} from "../../../core/fcmNotifications";
import { REGISTER_DEVICE_TOKEN } from "../../../schema/ApiSchema";
import client from "../../../schema/apolloClient";

configureNotificationHandler();
registerBackgroundFCMHandler();

/**
 * Mounted once near the root of the app. Owns the app-wide notification
 * WebSocket connection and keeps the unread badge fresh, independent of
 * whether the inbox screen has ever been opened.
 *
 * Token is polled directly from AsyncStorage rather than gated on userData,
 * so a slow or failed profile fetch can never silently block notifications.
 */
export default function NotificationCenterBridge() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [token, setToken] = useState<string | null>(null);

  const syncToken = useCallback(() => {
    AsyncStorage.getItem("userToken_").then(setToken);
  }, []);

  useEffect(() => {
    syncToken();
    const interval = setInterval(syncToken, 3000);
    return () => clearInterval(interval);
  }, [syncToken]);

  const { refreshUnreadCount } = useNotifications(token);

  useEffect(() => {
    if (token) {
      refreshUnreadCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Register FCM token with the backend when a JWT is present. Also re-registers
  // automatically whenever Firebase rotates the token (e.g. after app reinstall).
  useEffect(() => {
    if (!token) return;
    registerFCMToken();
    return onFCMTokenRefresh(async (newToken) => {
      try {
        await client.mutate({
          mutation: REGISTER_DEVICE_TOKEN,
          variables: { token: newToken, platform: getFCMPlatform() },
        });
      } catch (e) {
        console.warn('[FCM] Token refresh registration failed:', e);
      }
    });
  }, [token]);

  // Foreground FCM handler: the WebSocket already showed a toast for this event,
  // so we intentionally do NOT show another banner here.
  useEffect(() => {
    return onFCMForegroundMessage(() => {
      // Silent — state is already up-to-date via the WebSocket handler above.
    });
  }, []);

  const handleNotification = async (data: RequestNotificationMessage) => {
    dispatch(
      prependNotification({
        id: `${data.event}_${Date.now()}`,
        title: data.title,
        body: data.message,
        read: false,
        createdAt: new Date().toISOString(),
        meta: {
          request_id: data.request_id,
          consultation_id: data.consultation_id,
          result_review_id: data.result_review_id,
        },
      })
    );

    showToast("info", data.title, data.message);

    await presentLocalNotification(data.title, data.message, {
      event: data.event,
      request_id: data.request_id,
      consultation_id: data.consultation_id,
      result_review_id: data.result_review_id,
    });
  };

  useNotificationSocket({
    token,
    enabled: !!token,
    onNotification: (data) => {
      void handleNotification(data);
    },
  });

  return null;
}
