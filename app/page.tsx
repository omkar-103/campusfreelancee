// app/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { animateScroll as scroll } from "react-scroll"
import { Link as ScrollLink } from "react-scroll"
import CountUp from "react-countup"

import { AnimatePresence } from "framer-motion";

import {
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Code,
  Palette,
  PenTool,
  Camera,
  BarChart3,
  MessageSquare,
  ChevronUp,
  Sparkles,
  Award,
  Target,
  Rocket,
  BrainCircuit,
  Globe,
  CheckCircle,
} from "lucide-react"

// ------------------------- ANIMATED BACKGROUND COMPONENT -------------------------
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F3F0FF] via-white to-[#FAFAFC] dark:from-[#1A1A2E] dark:via-[#16213E] dark:to-[#1A1A2E]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#5F4B8B]/20 to-[#1DE9B6]/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#1DE9B6]/20 to-[#5F4B8B]/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#5F4B8B]/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  )
}

// ------------------------- CONSTANTS -------------------------
const stats = [
  { number: 100000, suffix: "+", label: "Active Students", icon: Users },
  { number: 500, suffix: "+", label: "Live Projects", icon: Rocket },
  { number: 1000, suffix: "+", label: "Happy Clients", icon: Award },
  { number: 99, suffix: "%", label: "Success Rate", icon: Target },
]

const features = [
  {
    title: "Real Projects, Real Money",
    description: "Work on actual business projects and get paid instantly. No fake assignments!",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Build Your Portfolio",
    description: "Every project adds to your professional portfolio, making you job-ready.",
    icon: BrainCircuit,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Direct Client Access",
    description: "Connect directly with business owners. No middlemen, more earnings!",
    icon: Globe,
    gradient: "from-green-500 to-teal-500",
  },
  {
    title: "Instant Payments",
    description: "Get paid immediately after project completion. Secure and hassle-free.",
    icon: Shield,
    gradient: "from-pink-500 to-red-500",
  },
]

const categories = [
  { name: "Web Development", count: "200+", icon: Code, color: "from-purple-500 to-indigo-500", trending: true },
  { name: "UI/UX Design", count: "150+", icon: Palette, color: "from-pink-500 to-red-500" },
  { name: "Content Writing", count: "100+", icon: PenTool, color: "from-green-500 to-teal-500" },
  { name: "Photography", count: "80+", icon: Camera, color: "from-yellow-500 to-orange-500" },
  { name: "Data Analytics", count: "50+", icon: BarChart3, color: "from-blue-500 to-cyan-500", trending: true },
  { name: "Digital Marketing", count: "60+", icon: MessageSquare, color: "from-red-500 to-pink-500" },
]

const testimonials = [
  {
    name: "Omkar Parelkar",
    role: "Full Stack Developer",
    college: "IIT Delhi",
    rating: 5,
    content:
      "Earned ₹50,000 in my first month! This platform changed my college life completely.",
    earnings: "₹2L+",
    avatar: "https://res.cloudinary.com/dor6jwwyl/image/upload/v1758167132/1_fgypd4.png",
  },
  {
    name: "Shweta Kadam",
    role: "UI/UX Designer",
    college: "NID Ahmedabad",
    rating: 5,
    content: "Got hired by a startup I worked with here. Best decision ever!",
    earnings: "₹1.5L+",
    avatar: "https://res.cloudinary.com/dor6jwwyl/image/upload/v1758167133/3_nwqefs.png",
  },
  {
    name: "Siddhi Sakpal",
    role: "Content Strategist",
    college: "DU",
    rating: 5,
    content: "Perfect platform for students. I'm earning while studying!",
    earnings: "₹80K+",
    avatar: "https://res.cloudinary.com/dor6jwwyl/image/upload/v1758167133/5_tve3ii.png",
  },
  {
    name: "Parth Suryavanshi",
    role: "Data Analyst",
    college: "IIM Bangalore",
    rating: 4,
    content: "Landed freelance projects that paid for my semester fees.",
    earnings: "₹1.2L+",
    avatar: "https://res.cloudinary.com/dor6jwwyl/image/upload/v1758167133/2_tlsfuz.png",
  },
  {
    name: "Arpita Uthale",
    role: "Mobile App Developer",
    college: "BITS Pilani",
    rating: 5,
    content: "Built apps for startups while in 3rd year. Huge learning curve!",
    earnings: "₹2.5L+",
    avatar: "https://res.cloudinary.com/dor6jwwyl/image/upload/v1758167133/4_evkwjg.png",
  },
  {
    name: "Harsh Kadam",
    role: "Digital Marketer",
    college: "Symbiosis Pune",
    rating: 4,
    content: "From campus fests to client campaigns – amazing experience!",
    earnings: "₹90K+",
    avatar: "https://res.cloudinary.com/dor6jwwyl/image/upload/v1758167133/6_ocfigj.png",
  },
];



// ------------------------- HOME PAGE -------------------------
export default function HomePage() {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { user, userType } = useAuth()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => scroll.scrollToTop()

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <Navbar onAuthClick={setAuthModal} isAuthenticated={!!user} userType={userType} />

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-16 px-4 overflow-hidden min-h-screen flex items-center">
        <div className="relative max-w-7xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm border border-[#5F4B8B]/20 dark:border-[#1DE9B6]/30 rounded-full px-4 py-2 mb-8 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#1DE9B6]" />
            <span className="text-sm font-medium bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent">
              India's #1 Student Freelance Platform
            </span>
            <div className="w-2 h-2 bg-[#1DE9B6] rounded-full animate-pulse" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6 leading-tight"
          >
            <span className="inline-block">
              🚀 Freelance.
            </span>{" "}
            <span className="inline-block">
              💰 Earn.
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-[#5F4B8B] via-[#1DE9B6] to-[#5F4B8B] bg-clip-text text-transparent bg-[length:200%_auto]"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              💼 Get Hired.
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#8E8E93] dark:text-[#F5F5F7]/80 mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Turn your college skills into real income. Work with 1000+ verified businesses,
            build your portfolio, and launch your career - all while studying! 🎓
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white px-8 py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={() => setAuthModal("signup")}
              >
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#5F4B8B]/50 dark:border-[#1DE9B6]/50 text-[#5F4B8B] dark:text-[#1DE9B6] hover:bg-gradient-to-r hover:from-[#5F4B8B]/10 hover:to-[#1DE9B6]/10 px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
                onClick={() => setAuthModal("signup")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Success Stories
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto px-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group relative bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5F4B8B]/10 to-[#1DE9B6]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <stat.icon className="w-8 h-8 text-[#5F4B8B] dark:text-[#1DE9B6] mb-3 mx-auto" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5F4B8B] dark:text-[#1DE9B6] mb-2">
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="text-sm sm:text-base text-[#8E8E93] dark:text-[#F5F5F7]/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6">
              Why Students Love Us
            </h2>
            <p className="text-lg sm:text-xl text-[#8E8E93] dark:text-[#F5F5F7]/80 max-w-3xl mx-auto px-4">
              More than just a platform - we're your career launchpad 🚀
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full border-0 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-[#8E8E93] dark:text-[#F5F5F7]/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4 bg-gradient-to-br from-[#F3F0FF]/50 to-white/50 dark:from-[#1A1A2E]/50 dark:to-[#16213E]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6">
              Hot Categories 🔥
            </h2>
            <p className="text-lg sm:text-xl text-[#8E8E93] dark:text-[#F5F5F7]/80 max-w-3xl mx-auto px-4">
              Find projects that match your skills perfectly
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full border-0 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <category.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-[#1C1C1E] dark:text-[#F5F5F7] text-lg">
                            {category.name}
                          </h3>
                          <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                            {category.count} Projects
                          </p>
                        </div>
                      </div>
                      {category.trending && (
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                        >
                          Trending
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>High demand</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6">
              Success Stories 🌟
            </h2>
            <p className="text-lg sm:text-xl text-[#8E8E93] dark:text-[#F5F5F7]/80 max-w-3xl mx-auto px-4">
              From campus to career - hear from students who made it big!
            </p>
          </motion.div>
          
          <motion.div
            className="flex gap-8"
            animate={{ x: [0, -1920, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="min-w-[350px]"
              >
                <Card className="border-0 bg-white/90 dark:bg-[#1A1A2E]/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-[#1DE9B6] text-[#1DE9B6]" />
                        ))}
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white text-sm px-3 py-1 rounded-full font-semibold"
                      >
                        {testimonial.earnings}
                      </motion.div>
                    </div>
                    
                    <p className="text-[#1C1C1E] dark:text-[#F5F5F7] mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-[#1DE9B6]">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white">
                          {testimonial.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-[#5F4B8B] dark:text-[#1DE9B6]">
                          {testimonial.college}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="cta" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6]" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "url('/pattern.svg')",
            backgroundSize: "cover",
            opacity: 0.1,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Rocket className="w-16 h-16 text-white/90" />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Your Career Journey Starts Here
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto px-4">
            Join thousands of students earning ₹50,000+ per month while building their dream careers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                               size="lg"
                className="bg-white text-[#5F4B8B] hover:bg-white/90 px-8 py-6 rounded-full text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                onClick={() => setAuthModal("signup")}
              >
                <Sparkles className="mr-2 h-5 w-5 text-[#1DE9B6] group-hover:animate-spin" />
                Start Earning in 5 Minutes
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#5F4B8B] px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 bg-transparent backdrop-blur-sm"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                100% Free to Join
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-white/80"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Verified Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Instant Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Skill Certificates</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-[#1C1C1E] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5F4B8B]/10 to-[#1DE9B6]/10" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent">
                  CampusFreelance
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering Indian students to earn while they learn 🚀
              </p>
              <div className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className="w-10 h-10 bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Globe className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className="w-10 h-10 bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] rounded-full flex items-center justify-center cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-lg">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Browse Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Skill Resources
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-lg">For Businesses</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Post Project
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Find Talent
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Enterprise
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DE9B6] transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-gray-400 text-center sm:text-left">
  © 2025 CampusFreelance. Made with ❤️ by{" "}
  <a
    href="https://www.linkedin.com/in/sneha-jadhavv/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:underline"
  >
    Sneha Jadhav
  </a>
  , for India's future 🇮🇳
</p>

              <div className="flex gap-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-[#1DE9B6] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#1DE9B6] transition-colors">Terms of Service</a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Enhanced Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              size="icon"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronUp className="h-6 w-6" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={!!authModal} onClose={() => setAuthModal(null)} type={authModal || "login"} />
    </div>
  )
}