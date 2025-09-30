// components/ProfileBoostCard.tsx
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentButton } from "@/components/payment/PaymentButton"
import { motion, AnimatePresence } from "framer-motion"
import { toast, Toaster } from "react-hot-toast"
import { 
  Rocket, Star, Eye, TrendingUp, Sparkles, 
  CheckCircle, Zap, Crown, Shield, Award
} from "lucide-react"
import confetti from "canvas-confetti"

interface ProfileBoostCardProps {
  userId: string;
  userEmail: string;
  userName: string;
  isCurrentlyBoosted?: boolean;
  boostExpiresAt?: Date;
}

export function ProfileBoostCard({ 
  userId, 
  userEmail, 
  userName,
  isCurrentlyBoosted = false,
  boostExpiresAt
}: ProfileBoostCardProps) {
  const router = useRouter()
  const [isBoosted, setIsBoosted] = useState(isCurrentlyBoosted)
  const [showSuccess, setShowSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")

  // Calculate time remaining for active boost
  useEffect(() => {
    if (boostExpiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const expiry = new Date(boostExpiresAt).getTime()
        const difference = expiry - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          setTimeRemaining(`${days}d ${hours}h remaining`)
        } else {
          setTimeRemaining("Expired")
          setIsBoosted(false)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [boostExpiresAt])

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5F4B8B', '#1DE9B6', '#FFD700', '#FF69B4']
    })
  }

  const handlePaymentSuccess = async () => {
    setShowSuccess(true)
    setIsBoosted(true)
    triggerConfetti()
    
    // Custom success toast
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white p-4 rounded-xl shadow-2xl max-w-md"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">🎉 Profile Boosted Successfully!</p>
            <p className="text-sm opacity-90">You're now 5x more visible to clients</p>
          </div>
        </div>
      </motion.div>
    ), { duration: 5000 })

    // Refresh after animation
    setTimeout(() => {
      router.refresh()
    }, 3000)
  }

  if (isBoosted && !showSuccess) {
    return (
      <Card className="relative overflow-hidden border-2 border-[#5F4B8B]/30 dark:border-[#1DE9B6]/30 bg-gradient-to-br from-[#5F4B8B]/10 to-[#1DE9B6]/10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5F4B8B]/5 to-[#1DE9B6]/5 animate-pulse" />
        
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-6 w-6 text-yellow-500" />
              </motion.div>
              <span className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent">
                Profile Boosted!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-semibold">{timeRemaining}</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Eye, label: "Profile Views", value: "+523%", color: "text-blue-500" },
              { icon: Star, label: "Client Interest", value: "+89%", color: "text-yellow-500" },
              { icon: TrendingUp, label: "Search Ranking", value: "#1", color: "text-green-500" },
              { icon: Award, label: "Success Rate", value: "+245%", color: "text-purple-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3"
              >
                <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#5F4B8B]/10 to-[#1DE9B6]/10 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Your Boost Benefits:</p>
            <div className="space-y-1">
              {[
                "Priority placement in all searches",
                "Direct message access from premium clients",
                "Featured badge on your profile",
                "Weekly performance analytics",
                "24/7 priority support"
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <Card className="border-2 border-[#5F4B8B]/30 dark:border-[#1DE9B6]/30 bg-gradient-to-br from-[#5F4B8B]/10 to-[#1DE9B6]/10">
          <CardContent className="py-12 text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360, 720],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] p-6 rounded-full">
                <Rocket className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent mb-2">
              You're Now Boosted!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get ready for 5x more opportunities
            </p>
            
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <Card className="border-2 border-[#5F4B8B]/20 dark:border-[#1DE9B6]/20 bg-gradient-to-br from-[#5F4B8B]/5 to-[#1DE9B6]/5 hover:border-[#5F4B8B]/30 dark:hover:border-[#1DE9B6]/30 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="h-5 w-5 text-[#5F4B8B] dark:text-[#1DE9B6]" />
            </motion.div>
            Boost Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
            Get 5x more visibility and stand out to clients!
          </p>
          
          <div className="space-y-2">
            {[
              { icon: Star, text: "Priority in search results", color: "text-yellow-500 fill-yellow-500" },
              { icon: Eye, text: "5x more profile views", color: "text-blue-500" },
              { icon: TrendingUp, text: "Featured badge on profile", color: "text-green-500" },
              { icon: Zap, text: "Direct client access", color: "text-purple-500" }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <feature.icon className={`h-4 w-4 ${feature.color}`} />
                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-[#5F4B8B]/10 to-[#1DE9B6]/10 rounded-lg p-4 border border-[#5F4B8B]/20"
          >
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent">
                ₹499
              </p>
              <span className="text-sm text-[#8E8E93]">/month</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Save ₹200 vs. competitors!</p>
          </motion.div>

          <PaymentButton
            amount={499}
            type="profile_boost"
            clientId={userId}
            studentId={userId}
            metadata={{
              name: userName,
              email: userEmail,
              boostType: 'standard',
              duration: 30
            }}
            onSuccess={handlePaymentSuccess}
            buttonText="Boost Profile Now"
            buttonClassName="w-full bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          />
        </CardContent>
      </Card>
    </>
  )
}