import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_USER_ID_KEY = '@buyer:backendUserId';
const PUSH_TOKEN_KEY = '@buyer:pushToken';

function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return url.replace(/\/$/, '');
}

// Controls how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests permission and returns the Expo push token string.
 * Returns null if permission is denied or the device is a simulator.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    // Simulators can't receive push notifications
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('orders', {
      name: 'Order Updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#006670',
      sound: 'default',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID,
  });

  return tokenData.data;
}

/**
 * Registers for push notifications and saves the token to the backend.
 * Safe to call on every app start — skips if token unchanged.
 */
export async function initPushNotifications(): Promise<void> {
  try {
    const token = await registerForPushNotifications();
    if (!token) return;

    const cached = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (cached === token) return; // already registered this token

    await savePushTokenToBackend(token);
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  } catch {
    // Non-fatal — app works fine without push notifications
  }
}

async function savePushTokenToBackend(token: string): Promise<void> {
  const userId = await AsyncStorage.getItem(BACKEND_USER_ID_KEY);
  if (!userId) return;

  const baseUrl = getApiBaseUrl();
  await fetch(`${baseUrl}/users/${userId}/push-token`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ expoPushToken: token }),
  });
  // Ignore response errors — token registration is best-effort
}

/**
 * Call this once in App.tsx. Returns a cleanup function.
 * Handles notification taps while app is backgrounded/killed.
 */
export function setupNotificationListeners(
  onNotificationTap: (orderId: string | undefined) => void,
): () => void {
  // Fired when user taps a notification (app backgrounded or killed)
  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    const orderId = response.notification.request.content.data?.orderId as string | undefined;
    onNotificationTap(orderId);
  });

  return () => {
    responseSub.remove();
  };
}
