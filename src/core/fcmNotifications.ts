// No static import of @react-native-firebase/messaging — Firebase runs a native
// module lookup at import time which throws in Expo Go. Dynamic require is used
// instead so the check only runs after we confirm the native module is present.
import * as Notifications from 'expo-notifications';
import { NativeModules, Platform } from 'react-native';
import client from '../schema/apolloClient';
import { REGISTER_DEVICE_TOKEN, UNREGISTER_DEVICE_TOKEN } from '../schema/ApiSchema';
import { NOTIFICATION_CHANNEL_ID } from './pushNotifications';

// Safe check — NativeModules is always present; accessing a missing key returns undefined.
const isFirebaseAvailable = (): boolean => !!NativeModules.RNFBAppModule;

// Only called when isFirebaseAvailable() is true.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getMessaging = () => require('@react-native-firebase/messaging').default();

// Must be called at module scope (before React mounts) so Firebase can wake
// the JS engine when the app is killed and a push arrives.
//
// When expo-notifications' native FCM service is present alongside
// @react-native-firebase/messaging, one service intercepts the FCM message
// and the other does not. We cannot know which one wins at runtime, so:
//   • expo-notifications handles display via addNotificationReceivedListener
//     (wired in NotificationCenterBridge) when it wins.
//   • @react-native-firebase/messaging fires this handler when it wins; we
//     explicitly schedule a local notification so the user always sees one.
export function registerBackgroundFCMHandler(): void {
  // Runs at module scope, before React mounts. Firebase's native init can throw
  // here in a release build (e.g. a mis-bundled GoogleService-Info.plist) even
  // though the same code is skipped in dev where Firebase isn't linked. An
  // uncaught throw at module scope aborts the whole JS bundle and freezes the
  // native splash forever, so this must never be allowed to propagate.
  try {
    if (!isFirebaseAvailable()) return;
    getMessaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
      const title = (remoteMessage.notification?.title ?? '') as string;
      const body = (remoteMessage.notification?.body ?? '') as string;
      if (!title) return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: (remoteMessage.data ?? {}) as Record<string, unknown>,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: Platform.OS === 'android' ? { channelId: NOTIFICATION_CHANNEL_ID } : null,
      });
    });
  } catch (e) {
    console.warn('[FCM] registerBackgroundFCMHandler failed:', e);
  }
}

export async function getFCMToken(): Promise<string | null> {
  if (!isFirebaseAvailable()) return null;
  try {
    if (Platform.OS === 'ios') {
      await getMessaging().registerDeviceForRemoteMessages();
    }
    return await getMessaging().getToken();
  } catch (e) {
    console.warn('[FCM] getToken failed:', e);
    return null;
  }
}

export function getFCMPlatform(): 'android' | 'ios' | 'web' {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

// Call after JWT is written to AsyncStorage (post-login), so authLink attaches it.
export async function registerFCMToken(): Promise<void> {
  if (!isFirebaseAvailable()) return;
  try {
    const token = await getFCMToken();
    if (!token) return;
    await client.mutate({
      mutation: REGISTER_DEVICE_TOKEN,
      variables: { token, platform: getFCMPlatform() },
    });
    console.log('[FCM] Device token registered.');
  } catch (e) {
    console.warn('[FCM] registerFCMToken failed:', e);
  }
}

// Call at the start of logout, BEFORE clearing the JWT from AsyncStorage.
export async function unregisterFCMToken(): Promise<void> {
  if (!isFirebaseAvailable()) return;
  try {
    const token = await getFCMToken();
    if (!token) return;
    await client.mutate({
      mutation: UNREGISTER_DEVICE_TOKEN,
      variables: { token },
    });
    console.log('[FCM] Device token unregistered.');
  } catch (e) {
    // Must not block logout
    console.warn('[FCM] unregisterFCMToken failed:', e);
  }
}

// Returns an unsubscribe function. Use inside useEffect.
export function onFCMTokenRefresh(callback: (newToken: string) => void): () => void {
  if (!isFirebaseAvailable()) return () => {};
  return getMessaging().onTokenRefresh(callback);
}

// Fires when the app is in the foreground OR minimized-but-JS-running when a
// FCM message arrives. The caller receives both the notification payload (for
// title/body — these are NOT in remoteMessage.data) and the data bag (for
// meta fields like request_id). The caller decides whether to show a banner.
export function onFCMForegroundMessage(
  callback: (
    notification: { title?: string; body?: string } | undefined,
    data: Record<string, string>,
  ) => void,
): () => void {
  if (!isFirebaseAvailable()) return () => {};
  return getMessaging().onMessage(async (remoteMessage: any) => {
    callback(
      remoteMessage.notification as { title?: string; body?: string } | undefined,
      (remoteMessage.data ?? {}) as Record<string, string>,
    );
  });
}
