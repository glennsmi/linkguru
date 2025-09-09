import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase configuration
// Replace these with your actual Firebase config values from the Firebase Console
// Go to: https://console.firebase.google.com/ to get your project configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string
}

// Firebase emulator configuration for local development
export const useEmulator = process.env.NODE_ENV === 'development'

export const emulatorConfig = {
  auth: {
    host: 'localhost',
    port: 9199
  },
  firestore: {
    host: 'localhost',
    port: 8180
  },
  functions: {
    host: 'localhost',
    port: 5101
  }
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app, 'europe-west2')

// Use local emulators for Firestore and Functions in dev, but keep Auth on prod for Google SSO
if (import.meta.env.DEV) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8180)
    connectFunctionsEmulator(functions, 'localhost', 5101)
    // Avoid connectAuthEmulator for Google OAuth; emulator doesn't support full OAuth popups
  } catch (_) {
    // no-op: emulator connections might be established already during HMR
  }
}


