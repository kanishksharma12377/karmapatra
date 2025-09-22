import admin from "firebase-admin"

// Initialize Firebase Admin SDK once per server runtime
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("[firebase-admin] Missing admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY for server-side features like seeding.")
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    })
    
    // Configure Firestore to ignore undefined properties
    if (admin.firestore) {
      admin.firestore().settings({
        ignoreUndefinedProperties: true
      })
    }
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : undefined
export const adminDb = admin.apps.length ? admin.firestore() : undefined
