// contexts/AuthProviderWrapper.tsx
"use client"

import React from "react"
import { AuthProvider } from "./auth-context"

// This wrapper is only needed because Next.js server components
// (like layout.tsx) can't directly use "use client" components.
// So we create a small client-side wrapper.
export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
