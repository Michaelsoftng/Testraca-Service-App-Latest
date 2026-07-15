import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const NOTIFICATION_CHANNEL_ID = "labtraca-default";

let handlerConfigured = false;
let channelCreated = false;

export function configureNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowAlert: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Create channel immediately at module scope so it exists before any FCM
  // message can arrive. We intentionally do not wait for this promise — it
  // completes in milliseconds and long before any user interaction.
  void createNotificationChannel();
}

export async function createNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android" || channelCreated) return;
  channelCreated = true;
  try {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: "Labtraca Notifications",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      enableLights: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
  } catch (e) {
    console.warn("[notifications] channel create failed:", e);
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (e) {
    console.warn("[notifications] permission request failed:", e);
    return false;
  }
}

/**
 * Fire-and-forget OS notification. Does NOT await — the native bridge call is
 * enqueued synchronously so Android cannot suspend the JS thread before the
 * call is handed off to the native side. Awaiting in background contexts is
 * unreliable: Android may pause the thread between await continuations.
 */
export function presentLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): void {
  Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {},
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.MAX,
      autoDismiss: true,
    },
    trigger: Platform.OS === "android"
      ? { channelId: NOTIFICATION_CHANNEL_ID }
      : null,
  }).catch((e) => console.warn("[notifications] schedule failed:", e));
}
