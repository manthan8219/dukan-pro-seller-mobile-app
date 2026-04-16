/**
 * Syncs the Firebase-authenticated user to the Postgres backend and ensures
 * the CUSTOMER role is assigned. Safe to call on every sign-in and app restart.
 *
 * Production:  sends Firebase idToken (server verifies with Firebase Admin).
 * Dev (SYNC_AUTH_DEV=true): sends firebaseUid directly (no service account needed).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from 'firebase/auth';

const BACKEND_USER_ID_KEY = '@buyer:backendUserId';

export type BackendSession = { id: string };

function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) throw new Error('EXPO_PUBLIC_API_URL is not configured.');
  return url.replace(/\/$/, '');
}

async function postCreateCustomer(
  baseUrl: string,
  body: Record<string, string | undefined>,
): Promise<BackendSession> {
  const res = await fetch(`${baseUrl}/auth/create-customer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    let message = `Backend error (${res.status})`;
    try {
      const data = JSON.parse(text) as { message?: string | string[] };
      if (typeof data.message === 'string') message = data.message;
      else if (Array.isArray(data.message)) message = data.message.join('. ');
    } catch {
      /* use default message */
    }
    throw new Error(message);
  }

  try {
    return JSON.parse(text) as BackendSession;
  } catch {
    throw new Error('Invalid JSON response from backend.');
  }
}

/**
 * Call after every successful Firebase sign-in (and on session restore).
 * Upserts the user in Postgres and guarantees the CUSTOMER role exists.
 * Stores the returned backend UUID in AsyncStorage.
 */
export async function syncCustomerSession(user: User): Promise<BackendSession> {
  const baseUrl = getApiBaseUrl();
  const devMode = process.env.EXPO_PUBLIC_SYNC_AUTH_DEV === 'true';

  let session: BackendSession;

  if (devMode) {
    session = await postCreateCustomer(baseUrl, {
      firebaseUid: user.uid,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
    });
  } else {
    const idToken = await user.getIdToken();
    session = await postCreateCustomer(baseUrl, { idToken });
  }

  await AsyncStorage.setItem(BACKEND_USER_ID_KEY, session.id);
  return session;
}

/** Returns the stored backend UUID, or null if not yet synced. */
export async function getStoredBackendUserId(): Promise<string | null> {
  return AsyncStorage.getItem(BACKEND_USER_ID_KEY);
}

/** Clears the stored backend UUID (call on logout). */
export async function clearBackendUserId(): Promise<void> {
  await AsyncStorage.removeItem(BACKEND_USER_ID_KEY);
}
