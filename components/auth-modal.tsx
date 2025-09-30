"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, Chrome, ArrowRight, GraduationCap, Briefcase, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  type: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"student" | "client">("student")
  const [currentTab, setCurrentTab] = useState(type)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  
  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  
  const { signUp, signIn, signInWithGoogle, resetPassword } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (currentTab === "signup") {
        if (!agreeToTerms) {
          throw new Error("Please agree to the terms and conditions")
        }
        const fullName = `${firstName} ${lastName}`.trim()
        await signUp(email, password, fullName, userType)
        router.push(userType === "student" ? "/dashboard/student" : "/dashboard/client")
      } else {
        await signIn(email, password)
        router.push("/dashboard")
      }
      onClose()
    } catch (err: any) {
      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.")
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.")
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.")
      } else {
        setError(err.message || "An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)
    
    try {
      await signInWithGoogle(userType)
      router.push(userType === "student" ? "/dashboard/student" : "/dashboard/client")
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address first")
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      await resetPassword(email)
      setResetEmailSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-md p-0 overflow-hidden bg-white dark:bg-[#1A1A2E] border-0 shadow-2xl rounded-xl">
        <div className="bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] p-4 sm:p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
              {currentTab === "login" ? "Welcome Back! 🙏" : "Join CampusFreelance 🇮🇳"}
            </DialogTitle>
            <p className="text-center text-white/90 mt-2 text-sm sm:text-base">
              {currentTab === "login"
                ? "Sign in to continue your journey"
                : "Start building your career in India today"}
            </p>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-[#F3F0FF] dark:bg-[#1A1A2E]/50">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-[#5F4B8B] dark:data-[state=active]:text-[#1DE9B6] text-sm sm:text-base"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-[#5F4B8B] dark:data-[state=active]:text-[#1DE9B6] text-sm sm:text-base"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resetEmailSent && (
              <Alert className="mb-4 border-green-500 text-green-600">
                <AlertDescription>
                  Password reset email sent! Check your inbox.
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-10 sm:h-12 border-2 text-sm sm:text-base"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#1A1A2E] px-2">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-xs sm:text-sm">Remember me</Label>
                  </div>
                  <Button 
                    variant="link" 
                    type="button"
                    className="text-xs sm:text-sm p-0 h-auto justify-start sm:justify-end"
                    onClick={handlePasswordReset}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-12 text-sm sm:text-base"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm sm:text-base">I am a:</Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Card
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      userType === "student" ? "border-[#5F4B8B] dark:border-[#1DE9B6]" : ""
                    }`}
                    onClick={() => setUserType("student")}
                  >
                    <CardContent className="p-3 sm:p-4 text-center">
                      <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2" />
                      <div className="font-medium text-sm sm:text-base">Student</div>
                      <div className="text-xs mt-1 hidden sm:block">Looking for work</div>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      userType === "client" ? "border-[#5F4B8B] dark:border-[#1DE9B6]" : ""
                    }`}
                    onClick={() => setUserType("client")}
                  >
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2" />
                      <div className="font-medium text-sm sm:text-base">Client</div>
                      <div className="text-xs mt-1 hidden sm:block">Hiring talent</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-10 sm:h-12 text-sm sm:text-base"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#1A1A2E] px-2">Or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Rahul"
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sharma"
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-sm sm:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-sm sm:text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="pl-10 pr-10 h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    required 
                  />
                  <Label htmlFor="terms" className="text-xs sm:text-sm leading-relaxed">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  className="w-full h-10 sm:h-12 text-sm sm:text-base"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm">
              {currentTab === "login" ? "Don't have an account? " : "Already have an account? "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm"
                onClick={() => setCurrentTab(currentTab === "login" ? "signup" : "login")}
              >
                {currentTab === "login" ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}