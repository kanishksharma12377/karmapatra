import { initializeApp, FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error("Firebase initialization failed:", error)
  throw error
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics only in the browser and when supported.
let analytics: Analytics | null = null
if (typeof window !== "undefined") {
  isSupported()
    .then((ok) => {
      if (ok && app) {
        analytics = getAnalytics(app)
      }
    })
    .catch(() => {
      // Analytics not supported (e.g., in Node/SSR); ignore silently.
    })
}
export { analytics }

export const checkFirebaseConnection = () => {
  try {
    return {
      app: !!app,
      auth: !!auth,
      db: !!db,
      storage: !!storage,
      config: {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket,
      },
    }
  } catch (error) {
    console.error("Firebase connection check failed:", error)
    return null
  }
}
