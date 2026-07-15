import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
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
  createNotificationChannel,
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

// Both calls must run at module scope — before React mounts — so Firebase can
// wake the JS engine for background/killed-app push delivery.
configureNotificationHandler();
registerBackgroundFCMHandler();

// ─── Deduplication ────────────────────────────────────────────────────────────
// WebSocket and FCM can both fire for the same event (WebSocket is faster;
// FCM follows ~0.5–2 s later). We deduplicate on title+body within a 5-second
// window so the user never sees two banners for the same notification.
const _recent = new Map<string, number>();

function dedupeShow(title: string, body: string, show: () => void): void {
  const key = `${title}\x00${body}`;
  const now = Date.now();
  const last = _recent.get(key);
  if (last && now - last < 5000) return;
  _recent.set(key, now);
  show();
}

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
    if (token) refreshUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Request permission once at startup. Channel was already created at module
  // scope via configureNotificationHandler → createNotificationChannel.
  useEffect(() => {
    void requestNotificationPermissions();
    // Re-ensure the channel exists (no-op if already created; covers the rare
    // case where Android cleared it after an OS upgrade or data wipe).
    void createNotificationChannel();
  }, []);

  // Register FCM token with backend when a JWT is present, and keep it fresh.
  useEffect(() => {
    if (!token) return;
    void registerFCMToken();
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

  // ── FCM foreground handler ──────────────────────────────────────────────────
  // @react-native-firebase/messaging fires onMessage when JS is alive and the
  // app is foregrounded OR minimized-but-JS-running.
  //
  // Gate: use AppState, not wsConnectedRef. The WebSocket stays connected for
  // 30–90 s after minimize, so a wsConnected gate silently drops FCM messages
  // for the entire duration the user cannot see the app. AppState.currentState
  // is 'active' only while the user is looking at the screen — exactly when
  // the WebSocket handler's toast is sufficient.
  useEffect(() => {
    return onFCMForegroundMessage((notification, data) => {
      if (AppState.currentState === 'active') return; // WebSocket covers this
      const title = notification?.title ?? '';
      const body  = notification?.body  ?? '';
      if (!title) return;
      dedupeShow(title, body, () =>
        presentLocalNotification(title, body, data as Record<string, unknown>),
      );
    });
  }, []);

  // ── expo-notifications listener ─────────────────────────────────────────────
  // Belt-and-suspenders: when expo-notifications' native FCM service intercepts
  // the message instead of @react-native-firebase/messaging, none of the RNFB
  // handlers above fire. This listener covers that path.
  // It fires for push notifications the expo-notifications service receives,
  // including both foreground and background delivery events.
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notif) => {
      const trigger = notif.request.trigger as any;
      // Skip local notifications we scheduled ourselves (type is null or 'date'
      // / 'timeInterval' / 'calendar' — only 'push' / undefined means remote).
      const isLocal =
        trigger?.type === 'date' ||
        trigger?.type === 'timeInterval' ||
        trigger?.type === 'calendar';
      if (isLocal) return;

      const title = notif.request.content.title ?? '';
      const body  = notif.request.content.body  ?? '';
      if (!title) return;

      dedupeShow(title, body, () => {
        // Update Redux regardless of app state so the inbox stays current.
        dispatch(
          prependNotification({
            id: `fcm_${Date.now()}`,
            title,
            body,
            read: false,
            createdAt: new Date().toISOString(),
            meta: {},
          }),
        );
        // Show toast only when user is actively looking at the app.
        if (AppState.currentState === 'active') {
          showToast('info', title, body);
        }
      });
    });
    return () => sub.remove();
  }, [dispatch, showToast]);

  // ── WebSocket handler ───────────────────────────────────────────────────────
  const handleNotification = useCallback(
    (data: RequestNotificationMessage) => {
      dispatch(
        prependNotification({
          id: `${data.event}_${Date.now()}`,
          title: data.title,
          body: data.message,
          read: false,
          createdAt: new Date().toISOString(),
          meta: {
            request_id:      data.request_id,
            consultation_id: data.consultation_id,
            result_review_id: data.result_review_id,
          },
        }),
      );
      showToast('info', data.title, data.message);
      dedupeShow(data.title, data.message, () =>
        presentLocalNotification(data.title, data.message, {
          event:            data.event,
          request_id:       data.request_id,
          consultation_id:  data.consultation_id,
          result_review_id: data.result_review_id,
        }),
      );
    },
    [dispatch, showToast],
  );

  useNotificationSocket({
    token,
    enabled: !!token,
    onNotification: handleNotification,
  });

  return null;
}
