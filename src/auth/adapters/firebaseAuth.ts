/**
 * Firebase implementation of the AuthAdapter interface.
 * Uses Firebase Auth with Google sign-in via popup.
 *
 * This is the only file that imports from Firebase directly —
 * swap this adapter to change auth provider without touching the rest of the app.
 */
import { auth, googleProvider } from '../../config/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { AuthAdapter } from '../types';

export const firebaseAuthAdapter: AuthAdapter = {
    onAuthChanged: (cb) => onAuthStateChanged(auth, (u) =>
        cb(u ? { email: u.email!, displayName: u.displayName, token: () => u.getIdToken() } : null)
    ),
    signIn: () => signInWithPopup(auth, googleProvider).then(() => {}),
    signOut: () => signOut(auth),
};
