import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAaEu3aq9cFkGd3h7wyIzLtXvYhXBmDvPM",
  authDomain: "karmapath-be936.firebaseapp.com",
  projectId: "karmapath-be936",
  storageBucket: "karmapath-be936.firebasestorage.app",
  messagingSenderId: "367680510828",
  appId: "1:367680510828:web:84d83c4dc422d45ead7149",
  measurementId: "G-DY5S5JMCYF",
}

let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error("Firebase initialization failed:", error)
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export const checkFirebaseConnection = () => {
  try {
    return {
      app: !!app,
      auth: !!auth,
      db: !!db,
      storage: !!storage,
      config: firebaseConfig,
    }
  } catch (error) {
    console.error("Firebase connection check failed:", error)
    return null
  }
}
