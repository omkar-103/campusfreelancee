// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import NavbarWrapper from "@/components/navbar-wrapper"   // ✅ default import
import { AuthProviderWrapper } from "@/contexts/AuthProviderWrapper" // ✅ wrapper

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CampusFreelance - Micro-Internship & Campus Freelance Platform",
  description:
    "Connect college students with startups and businesses. Find freelance work, build your portfolio, and launch your career while still in college.",
  keywords:
    "freelance, internship, college students, campus jobs, remote work, startups",
  generator: "omkar p",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* ✅ Wrap auth context in a client component */}
          <AuthProviderWrapper>
            <NavbarWrapper />
            <main className="pt-16">{children}</main>
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
