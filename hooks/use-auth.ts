"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserProfile, type UserProfile } from "@/lib/firebase-auth"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, profile, loading }
}
