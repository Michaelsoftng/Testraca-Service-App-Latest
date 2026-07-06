// No static import of @react-native-firebase/messaging — Firebase runs a native
// module lookup at import time which throws in Expo Go. Dynamic require is used
// instead so the check only runs after we confirm the native module is present.
import { NativeModules, Platform } from 'react-native';
import client from '../schema/apolloClient';
import { REGISTER_DEVICE_TOKEN, UNREGISTER_DEVICE_TOKEN } from '../schema/ApiSchema';

// Safe check — NativeModules is always present; accessing a missing key returns undefined.
const isFirebaseAvailable = (): boolean => !!NativeModules.RNFBAppModule;

// Only called when isFirebaseAvailable() is true.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getMessaging = () => require('@react-native-firebase/messaging').default();

// Must be called at module scope (before React mounts) so Firebase can wake
// the JS engine when the app is closed and a push arrives.
export function registerBackgroundFCMHandler(): void {
  if (!isFirebaseAvailable()) return;
  getMessaging().setBackgroundMessageHandler(async () => {
    // The `notification` field is rendered as an OS banner automatically.
  });
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

// Fires when the app is foregrounded and a FCM message arrives.
// The WebSocket already delivered this event — update state silently, no banner.
export function onFCMForegroundMessage(
  callback: (data: Record<string, string>) => void
): () => void {
  if (!isFirebaseAvailable()) return () => {};
  return getMessaging().onMessage(async (remoteMessage: any) => {
    if (remoteMessage.data) {
      callback(remoteMessage.data as Record<string, string>);
    }
  });
}
