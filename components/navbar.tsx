// components/navbar.tsx
"use client"
import { useState, useEffect } from "react"
import { Link as ScrollLink } from "react-scroll"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  Home,
  Briefcase,
  Users,
  MessageSquare,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Code,
  Target,
  Star,
  Phone,
  Sun,
  Moon,
  FolderOpen,
  LayoutDashboard,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  onAuthClick: (type: "login" | "signup") => void
  isAuthenticated: boolean
  userType: "student" | "client" | null
}

const navItems = [
  { name: "Home", href: "hero", icon: Home },
  { name: "Features", href: "features", icon: Target },
  { name: "Categories", href: "categories", icon: Code },
  { name: "Success Stories", href: "testimonials", icon: Star },
  { name: "Contact", href: "cta", icon: Phone },
]

export function Navbar({ onAuthClick, isAuthenticated, userType }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user, userData, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Check if we're on a dashboard page
  const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/projects')

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleDashboard = () => {
    if (userType === "student") {
      router.push("/dashboard/student")
    } else if (userType === "client") {
      router.push("/dashboard/client")
    }
  }

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? "bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {isDashboard ? (
              <Link
                href="/"
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent">
                  CampusFreelance
                </div>
              </Link>
            ) : (
              <ScrollLink
                to="hero"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] bg-clip-text text-transparent">
                  CampusFreelance
                </div>
              </ScrollLink>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isDashboard ? (
              // Dashboard navigation items
              isAuthenticated && (
                <>
                  <Link
                    href={userType === 'student' ? '/dashboard/student' : '/dashboard/client'}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      pathname?.includes('/dashboard')
                        ? 'text-[#5F4B8B] dark:text-[#1DE9B6] bg-[#5F4B8B]/10 dark:bg-[#1DE9B6]/10'
                        : 'text-[#1C1C1E] dark:text-[#F5F5F7] hover:text-[#5F4B8B] dark:hover:text-[#1DE9B6]'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/projects"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      pathname === '/projects'
                        ? 'text-[#5F4B8B] dark:text-[#1DE9B6] bg-[#5F4B8B]/10 dark:bg-[#1DE9B6]/10'
                        : 'text-[#1C1C1E] dark:text-[#F5F5F7] hover:text-[#5F4B8B] dark:hover:text-[#1DE9B6]'
                    }`}
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Projects</span>
                  </Link>
                </>
              )
            ) : (
              // Landing page navigation items
              navItems.map((item) => (
                <ScrollLink
                  key={item.name}
                  to={item.href}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  activeClass="text-[#5F4B8B] dark:text-[#1DE9B6]"
                  className="px-4 py-2 rounded-lg text-[#1C1C1E] dark:text-[#F5F5F7] hover:text-[#5F4B8B] dark:hover:text-[#1DE9B6] font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </ScrollLink>
              ))
            )}
          </div>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-[#5F4B8B]/10 dark:hover:bg-[#1DE9B6]/10 rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-[#5F4B8B]/10 dark:hover:bg-[#1DE9B6]/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.avatar || user?.photoURL || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-[#1C1C1E] dark:text-[#F5F5F7]">
                      {userData?.name || user?.displayName || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/projects')} className="cursor-pointer">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    My Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onAuthClick("login")}
                  className="text-[#5F4B8B] dark:text-[#1DE9B6] hover:bg-[#5F4B8B]/10 dark:hover:bg-[#1DE9B6]/10"
                >
                  Login
                </Button>

              

                <Button
                  onClick={() => onAuthClick("signup")}
                  className="bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>

                  {/* Admin Button - Frontend Only */}
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin')}
                  className="border-[#FF6B6B] dark:border-[#FF6B6B] text-[#FF6B6B] dark:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 dark:hover:bg-[#FF6B6B]/10 flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                  <span className="ml-1 text-xs px-1.5 py-0.5 bg-[#FF6B6B]/20 text-[#FF6B6B] rounded-full">Frontend</span>
                </Button>


              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-[#1C1C1E] dark:text-[#F5F5F7]"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1C1C1E] dark:text-[#F5F5F7]"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#1A1A2E] shadow-2xl border-t border-[#5F4B8B]/10 dark:border-[#1DE9B6]/20">
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Navigation Items */}
              {isDashboard ? (
                isAuthenticated && (
                  <>
                    <Link
                      href={userType === 'student' ? '/dashboard/student' : '/dashboard/client'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-[#5F4B8B]/10 dark:hover:bg-[#1DE9B6]/10 transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                      href="/projects"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-[#5F4B8B]/10 dark:hover:bg-[#1DE9B6]/10 transition-colors"
                    >
                      <FolderOpen className="h-5 w-5 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                      <span className="font-medium">Projects</span>
                    </Link>
                  </>
                )
              ) : (
                navItems.map((item) => (
                  <ScrollLink
                    key={item.name}
                    to={item.href}
                    spy={true}
                    smooth={true}
                    offset={-80}
                    duration={500}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-[#5F4B8B]/10 dark:hover:bg-[#1DE9B6]/10 transition-colors cursor-pointer"
                  >
                    <item.icon className="h-5 w-5 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                    <span className="font-medium">{item.name}</span>
                  </ScrollLink>
                ))
              )}

              <div className="border-t border-[#5F4B8B]/10 dark:border-[#1DE9B6]/20 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userData?.avatar || user?.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                          {userData?.name || user?.displayName || "User"}
                        </div>
                        <div className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleDashboard}
                      className="w-full mb-2 justify-start"
                      variant="ghost"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => router.push('/projects')}
                      className="w-full mb-2 justify-start"
                      variant="ghost"
                    >
                      <FolderOpen className="mr-2 h-4 w-4" />
                      My Projects
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                      variant="ghost"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        onAuthClick("login")
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full border-[#5F4B8B] dark:border-[#1DE9B6] text-[#5F4B8B] dark:text-[#1DE9B6]"
                    >
                      Login
                    </Button>


                    <Button
                      onClick={() => {
                        onAuthClick("signup")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white"
                    >
                      Get Started
                    </Button>


                    
                    {/* Admin Button - Mobile */}
                    <Button
                      onClick={() => {
                        router.push('/admin')
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full border-[#FF6B6B] dark:border-[#FF6B6B] text-[#FF6B6B] dark:text-[#FF6B6B] flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                      <span className="ml-1 text-xs px-1.5 py-0.5 bg-[#FF6B6B]/20 text-[#FF6B6B] rounded-full">Frontend</span>
                    </Button>


                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}