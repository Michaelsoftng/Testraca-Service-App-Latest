import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "default";
let handlerConfigured = false;
let channelConfigured = false;

/**
 * Must run before any notification can show a banner/sound while the app is
 * foregrounded — expo-notifications defaults to suppressing both otherwise.
 */
export function configureNotificationHandler() {
  if (handlerConfigured) return;
  handlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  void ensureNotificationChannel();
}

async function ensureNotificationChannel() {
  if (Platform.OS !== "android" || channelConfigured) return;

  channelConfigured = true;

  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      enableLights: true,
    });
  } catch (e) {
    console.warn("Failed to set notification channel", e);
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      await ensureNotificationChannel();
      return true;
    }

    const requested = await Notifications.requestPermissionsAsync();
    if (requested.granted) {
      await ensureNotificationChannel();
    }
    return requested.granted;
  } catch (e) {
    console.warn("Failed to request notification permissions", e);
    return false;
  }
}

/**
 * Shows an OS-level notification with sound right away. Used to surface
 * real-time WebSocket events as proper push-style alerts instead of a
 * silent in-app toast.
 */
export async function presentLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const permissionGranted = await requestNotificationPermissions();
  if (!permissionGranted) {
    console.warn("Skipping local notification because permissions were not granted");
    return;
  }

  try {
    // presentNotificationAsync is deprecated and bypasses the NotificationHandler; channelId belongs on the trigger, not content.
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        autoDismiss: true,
      },
      trigger: Platform.OS === "android" ? { channelId: CHANNEL_ID } : null,
    });
  } catch (e) {
    console.warn("Failed to present local notification", e);
  }
}
