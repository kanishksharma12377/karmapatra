import { auth, db } from "./firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"

export interface UserProfile {
  uid: string
  email: string
  role: "student" | "admin"
  name: string
  rollNumber?: string
  department?: string
  createdAt: Date
}

export const signUp = async (email: string, password: string, userData: Omit<UserProfile, "uid" | "createdAt">) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  const profile: UserProfile = {
    uid: user.uid,
    ...userData,
    email: user.email!,
    createdAt: new Date(),
  }

  try {
    await setDoc(doc(db, "users", user.uid), profile)
    console.log("[v0] User profile created successfully in Firestore")
    return { user, profile }
  } catch (firestoreError: unknown) {
    console.log("[v0] Firestore access failed during signup, returning temporary profile:", (firestoreError as Error).message)
    // Return the profile even if Firestore write fails - user account was created successfully
    return { user, profile }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log("[v0] Attempting to sign in with email:", email)

    if (!auth) {
      throw new Error("Firebase Auth is not initialized")
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("[v0] User signed in successfully:", user.uid)

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        console.log("[v0] User profile not found, creating basic profile")
        const basicProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          role: email.includes("admin") ? "admin" : "student",
          name: email.split("@")[0],
          createdAt: new Date(),
        }
        await setDoc(doc(db, "users", user.uid), basicProfile)
        return { user, profile: basicProfile }
      }

      const profile = userDoc.data() as UserProfile
      console.log("[v0] User profile loaded:", profile)
      return { user, profile }
    } catch (firestoreError: unknown) {
      console.log("[v0] Firestore access failed, creating temporary profile:", (firestoreError as Error).message)
      const tempProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        role: email.includes("admin") ? "admin" : "student",
        name: email.split("@")[0],
        createdAt: new Date(),
      }
      return { user, profile: tempProfile }
    }
  } catch (error: unknown) {
    console.error("[v0] Sign in error:", error)

    if (error instanceof Error && error.message && error.message.includes("Missing or insufficient permissions")) {
      throw new Error(
        "Firestore security rules need to be configured. Please contact your administrator or check the Firebase Console.",
      )
    }

    // Type guard for Firebase auth errors
    const isFirebaseError = (err: unknown): err is { code: string; message: string } => {
      return typeof err === 'object' && err !== null && 'code' in err && 'message' in err
    }

    if (isFirebaseError(error)) {
      if (error.code === "auth/configuration-not-found") {
        throw new Error(
          "Firebase Authentication is not properly configured. Please enable Email/Password authentication in Firebase Console.",
        )
      } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        if (email === "admin@college.edu") {
          throw new Error(
            "Admin user not found. Please create the admin account first using the registration form below.",
          )
        }
        throw new Error("Invalid email or password. Please check your credentials.")
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password.")
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address.")
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed login attempts. Please try again later.")
      }
    }

    throw error
  }
}

export const signOut = () => firebaseSignOut(auth)

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, "users", uid))
  return userDoc.exists() ? (userDoc.data() as UserProfile) : null
}
