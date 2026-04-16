import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { authService } from '../services/authService';
import {
  syncCustomerSession,
  clearBackendUserId,
  getStoredBackendUserId,
} from '../services/backendAuthService';

interface AuthContextValue {
  /** Firebase user — null while loading or unauthenticated */
  user: User | null;
  /** True until both Firebase session and backend sync are resolved */
  loading: boolean;
  /** Backend Postgres UUID — available after a successful sync */
  backendUserId: string | null;
  /** Signs the user out of Firebase and clears local state */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  backendUserId: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendUserId, setBackendUserId] = useState<string | null>(null);

  useEffect(() => {
    // Rehydrate the stored backend UUID instantly so it's available before the
    // onAuthStateChanged fires (avoids a flash of null on fast reopens).
    getStoredBackendUserId().then((id) => {
      if (id) setBackendUserId(id);
    });

    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const session = await syncCustomerSession(firebaseUser);
          setBackendUserId(session.id);
        } catch (err) {
          // Backend sync failed — user is still authenticated via Firebase.
          // Log but don't block the UI; sync will retry on next restart/sign-in.
          console.warn('[AuthContext] Backend sync failed:', err);
          // Try to reuse the last stored id if available
          const stored = await getStoredBackendUserId();
          if (stored) setBackendUserId(stored);
        }
      } else {
        // User signed out
        setBackendUserId(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await authService.signOut();
    await clearBackendUserId();
    setUser(null);
    setBackendUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, backendUserId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
