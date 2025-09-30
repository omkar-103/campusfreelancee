//  contexts/auth-context.tsx
 "use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

// ----------------- Types -----------------
interface UserData {
  firebaseUid: string
  email: string
  name: string
  userType: "student" | "client"
  avatar?: string
  rating?: number
  totalReviews?: number
  totalEarnings?: number
  activeProjects?: number
  completedProjects?: number
  profileViews?: number
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  userType: "student" | "client" | null
  signUp: (
    email: string,
    password: string,
    name: string,
    type: "student" | "client"
  ) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: (type: "student" | "client") => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  loading: boolean
}

// ----------------- Context -----------------
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userType, setUserType] = useState<"student" | "client" | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔹 Fetch user data from MongoDB
  const fetchUserData = async (firebaseUid: string) => {
    try {
      const response = await fetch(`/api/users?uid=${firebaseUid}`)
      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        setUserType(result.data.userType)
      } else {
        console.warn("User not found in DB")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  // 🔹 Save user to MongoDB
  const saveUserToMongoDB = async (
    firebaseUid: string,
    email: string,
    name: string,
    type: "student" | "client",
    avatar?: string
  ) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid,
          email,
          name,
          userType: type,
          avatar,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        setUserType(result.data.userType)
      }
    } catch (error) {
      console.error("Error saving user to MongoDB:", error)
    }
  }

  // 🔹 Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid)
      } else {
        setUserData(null)
        setUserType(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // ----------------- Auth methods -----------------
  const signUp = async (
    email: string,
    password: string,
    name: string,
    type: "student" | "client"
  ) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    await saveUserToMongoDB(
      user.uid,
      email,
      name,
      type,
      user.photoURL || undefined
    )
    setUserType(type)
  }

  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    await fetchUserData(user.uid)
  }

  const signInWithGoogle = async (type: "student" | "client") => {
    const { user } = await signInWithPopup(auth, googleProvider)
    await saveUserToMongoDB(
      user.uid,
      user.email!,
      user.displayName || "User",
      type,
      user.photoURL || undefined
    )
    setUserType(type)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setUserData(null)
    setUserType(null)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        userType,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ----------------- Custom hook -----------------
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
