import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

export const authService = {

  signInWithEmail: (email: string, password: string): Promise<UserCredential> =>
    signInWithEmailAndPassword(auth, email, password),

  createAccountWithEmail: async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<UserCredential> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName });
    }
    return cred;
  },

  sendPasswordResetEmail: (email: string): Promise<void> =>
    firebaseSendPasswordReset(auth, email),

  signInWithGoogleToken: async (idToken: string): Promise<UserCredential> => {
    const credential = GoogleAuthProvider.credential(idToken);
    return signInWithCredential(auth, credential);
  },

  signOut: (): Promise<void> => firebaseSignOut(auth),

  getCurrentUser: (): User | null => auth.currentUser,

  onAuthStateChanged: (callback: (user: User | null) => void) =>
    firebaseOnAuthStateChanged(auth, callback),
};

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? (error as { code: string }).code
      : null;

  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    default:
      return (error instanceof Error && error.message)
        ? error.message
        : 'Something went wrong. Please try again.';
  }
}
