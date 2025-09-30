"use client"
import { useState } from "react"
import { Navbar } from "./navbar"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/contexts/auth-context"

export default function NavbarWrapper() {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null)
  const { user, userType } = useAuth()

  return (
    <>
      <Navbar 
        onAuthClick={setAuthModal} 
        isAuthenticated={!!user} 
        userType={userType || "student"} 
      />
      <AuthModal 
        isOpen={!!authModal} 
        onClose={() => setAuthModal(null)} 
        type={authModal || "login"} 
      />
    </>
  )
}
