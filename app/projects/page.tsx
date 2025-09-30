"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Users,
  Briefcase,
  Loader2,
  Share2,
  Plus,
  ChevronUp,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"
import ApplicationModal from "@/components/ApplicationModal"

interface Project {
  _id: string
  title: string
  description: string
  budget: {
    min: number
    max: number
    currency: string
  }
  duration: string
  skills: string[]
  category: string
  status: string
  applicants: string[]
  proposals: number
  views: number
  createdAt: string
  updatedAt: string
  clientId: string
  client?: {
    name?: string
    company?: string
    avatar?: string
    rating?: number
    totalReviews?: number
    verified?: boolean
  }
  experienceLevel: string
  projectType: string
  location: string
  deadline: string
  featured?: boolean
  urgent?: boolean
  maxApplicants?: number
}

interface ProjectStats {
  activeProjects: number
  totalBudget: number
  newToday: number
  topCategory: string
}

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development", 
  "UI/UX Design",
  "Data Science",
  "Content Writing",
  "Digital Marketing",
  "Graphic Design",
  "Video Editing",
  "Photography",
  "SEO",
  "Social Media",
  "E-commerce",
  "API Development",
  "Database Design",
]

const budgetRanges = [
  "All Budgets",
  "₹0 - ₹25,000",
  "₹25,000 - ₹50,000", 
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,50,000",
  "₹2,50,000+",
]

const experienceLevels = ["All Levels", "Entry Level", "Intermediate", "Expert"]
const sortOptions = ["Latest", "Budget: High to Low", "Budget: Low to High", "Most Applicants", "Best Match"]

// Stats Bar Component
const StatsBar = () => {
  const [stats, setStats] = useState<ProjectStats>({
    activeProjects: 0,
    totalBudget: 0,
    newToday: 0,
    topCategory: 'Web Development'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectStats()
  }, [])

  const fetchProjectStats = async () => {
    try {
      // Simulated stats - replace with actual API call
      setTimeout(() => {
        setStats({
          activeProjects: 247,
          totalBudget: 12500000,
          newToday: 23,
          topCategory: 'Web Development'
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 bg-[#5F4B8B]/10" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="border-0 bg-gradient-to-r from-[#5F4B8B]/10 to-[#1DE9B6]/10 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">Active Projects</p>
              <p className="text-2xl font-bold text-[#5F4B8B] dark:text-[#1DE9B6]">{stats.activeProjects}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last week
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-[#5F4B8B]/50 dark:text-[#1DE9B6]/50" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 bg-gradient-to-r from-[#1DE9B6]/10 to-[#5F4B8B]/10 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">Total Budget</p>
              <p className="text-2xl font-bold text-[#1DE9B6] dark:text-[#5F4B8B]">₹{(stats.totalBudget / 100000).toFixed(1)}L</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3" />
                Average: ₹50,000
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-[#1DE9B6]/50 dark:text-[#5F4B8B]/50" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 bg-gradient-to-r from-[#5F4B8B]/10 to-[#1DE9B6]/10 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">New Today</p>
              <p className="text-2xl font-bold text-[#5F4B8B] dark:text-[#1DE9B6]">{stats.newToday}</p>
              <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Peak hour: 2 PM
              </p>
            </div>
            <Clock className="h-8 w-8 text-[#5F4B8B]/50 dark:text-[#1DE9B6]/50" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 bg-gradient-to-r from-[#1DE9B6]/10 to-[#5F4B8B]/10 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">Top Category</p>
              <p className="text-lg font-bold text-[#1DE9B6] dark:text-[#5F4B8B]">{stats.topCategory}</p>
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                <Star className="h-3 w-3" />
                45% of all projects
              </p>
            </div>
            <Star className="h-8 w-8 text-[#1DE9B6]/50 dark:text-[#5F4B8B]/50" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Recommended Projects Component
const RecommendedProjects = ({ userSkills, onProjectClick }: { userSkills?: string[], onProjectClick: (projectId: string) => void }) => {
  const [recommended, setRecommended] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (userSkills && userSkills.length > 0) {
      fetchRecommendedProjects()
    } else {
      setLoading(false)
    }
  }, [userSkills])
  
  const fetchRecommendedProjects = async () => {
    try {
      // Simulated recommendations - replace with actual API call
      setTimeout(() => {
        setRecommended([
          {
            _id: '1',
            title: 'Build Modern E-commerce Platform',
            budget: { min: 75000, max: 100000, currency: 'INR' },
            skills: ['React', 'Node.js', 'MongoDB'],
            category: 'Web Development',
            matchScore: 95
          },
          {
            _id: '2',
            title: 'Mobile App for Food Delivery',
            budget: { min: 100000, max: 150000, currency: 'INR' },
            skills: ['React Native', 'Firebase', 'Maps API'],
            category: 'Mobile Development',
            matchScore: 87
          },
          {
            _id: '3',
            title: 'AI-Powered Analytics Dashboard',
            budget: { min: 50000, max: 75000, currency: 'INR' },
            skills: ['Python', 'Machine Learning', 'React'],
            category: 'Data Science',
            matchScore: 82
          }
        ] as any)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setLoading(false)
    }
  }
  
  if (!userSkills || userSkills.length === 0 || (!loading && recommended.length === 0)) return null
  
  return (
    <Card className="mb-8 border-0 bg-gradient-to-r from-[#5F4B8B]/5 to-[#1DE9B6]/5 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#5F4B8B] dark:text-[#1DE9B6] animate-pulse" />
          Recommended for You
          <Badge className="ml-auto bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white border-0">
            AI Powered
          </Badge>
        </h3>
        
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-[#5F4B8B]/10" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {recommended.map(project => (
              <div 
                key={project._id} 
                onClick={() => onProjectClick(project._id)}
                className="bg-white dark:bg-[#1A1A2E]/50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] group-hover:text-[#5F4B8B] dark:group-hover:text-[#1DE9B6] transition-colors">
                    {project.title}
                  </h4>
                  <Badge className="bg-green-500 text-white border-0 text-xs">
                    {project.matchScore}% match
                  </Badge>
                </div>
                <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80 mb-3">
                  ₹{project.budget.min.toLocaleString('en-IN')} - ₹{project.budget.max.toLocaleString('en-IN')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.skills.slice(0, 3).map(skill => (
                    <Badge 
                      key={skill} 
                      className="text-xs bg-[#5F4B8B]/10 text-[#5F4B8B] dark:bg-[#1DE9B6]/10 dark:text-[#1DE9B6] border-0"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Application Progress Component
const ApplicationProgress = ({ applied, total }: { applied: number; total: number }) => {
  const percentage = Math.min((applied / total) * 100, 100)
  const spotsLeft = total - applied
  
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-[#8E8E93] dark:text-[#F5F5F7]/80 mb-1">
        <span>{applied} applicants</span>
        <span className={spotsLeft < 5 ? 'text-red-500 font-semibold' : ''}>
          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'No spots left'}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${
            percentage > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Quick Actions Component
const QuickActions = ({ 
  onFilterClick, 
  onRefresh,
  showFilters 
}: { 
  onFilterClick: () => void, 
  onRefresh: () => void,
  showFilters: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 mb-2">
          <Button
            onClick={() => {
              onFilterClick()
              setIsOpen(false)
            }}
            className="bg-white dark:bg-[#1A1A2E] shadow-lg rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition-transform w-full justify-start"
          >
            <Filter className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
            {showFilters ? 'Hide Filters' : 'Quick Filter'}
          </Button>
          <Button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setIsOpen(false)
            }}
            className="bg-white dark:bg-[#1A1A2E] shadow-lg rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition-transform w-full justify-start"
          >
            <ChevronUp className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
            Back to Top
          </Button>
          <Button
            onClick={() => {
              onRefresh()
              setIsOpen(false)
              toast.success('Projects refreshed!')
            }}
            className="bg-white dark:bg-[#1A1A2E] shadow-lg rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:scale-105 transition-transform w-full justify-start"
          >
            <RefreshCw className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
            Refresh
          </Button>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Plus className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </Button>
    </div>
  )
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedBudget, setSelectedBudget] = useState("All Budgets")
  const [selectedExperience, setSelectedExperience] = useState("All Levels")
  const [selectedSort, setSelectedSort] = useState("Latest")
  const [showFilters, setShowFilters] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [savedProjects, setSavedProjects] = useState<string[]>([])
  const [likedProjects, setLikedProjects] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  
  // Add state for application modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const { user, userData, loading: authLoading } = useAuth()

  // Fetch projects
  useEffect(() => {
    fetchProjects()
  }, [selectedCategory, selectedBudget, selectedExperience, selectedSort, searchQuery])

  // Fetch saved projects for authenticated users
  useEffect(() => {
    if (user) {
      fetchSavedProjects()
      fetchLikedProjects()
    }
  }, [user])

  const fetchProjects = async (pageNum = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(1)
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        status: 'active',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== "All Categories" && { category: selectedCategory }),
        ...(selectedExperience !== "All Levels" && { experienceLevel: selectedExperience }),
        ...(selectedSort && { sort: selectedSort }),
      })

      if (selectedBudget !== "All Budgets") {
        const [min, max] = getBudgetRange(selectedBudget)
        if (min !== undefined) params.append('budgetMin', min.toString())
        if (max !== undefined) params.append('budgetMax', max.toString())
      }

      const response = await fetch(`/api/projects?${params}`)
      const result = await response.json()

      if (result.success) {
        const projectsWithClient = await Promise.all(
          result.data.map(async (project: Project) => {
            try {
              const clientRes = await fetch(`/api/users/${project.clientId}`)
              const clientData = await clientRes.json()
              
              // Add some mock data for demo
              return {
                ...project,
                views: project.views || Math.floor(Math.random() * 500) + 50,
                maxApplicants: project.maxApplicants || Math.floor(Math.random() * 20) + 10,
                client: clientData.success ? {
                  name: clientData.data.name,
                  company: clientData.data.company,
                  avatar: clientData.data.avatar,
                  rating: clientData.data.rating || 4.5,
                  totalReviews: clientData.data.totalReviews || Math.floor(Math.random() * 50) + 5,
                  verified: clientData.data.verified || Math.random() > 0.5,
                } : null
              }
            } catch (error) {
              console.error('Error fetching client data:', error)
              return project
            }
          })
        )

        if (reset) {
          setProjects(projectsWithClient)
        } else {
          setProjects(prev => [...prev, ...projectsWithClient])
        }
        
        setHasMore(result.data.length === 10)
        setPage(pageNum)
      } else {
        toast.error('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const fetchSavedProjects = async () => {
    try {
      const response = await fetch(`/api/saved-projects?userId=${user?.uid}`)
      const result = await response.json()
      if (result.success) {
        setSavedProjects(result.data.map((item: any) => item.projectId))
      }
    } catch (error) {
      console.error('Error fetching saved projects:', error)
    }
  }

  const fetchLikedProjects = async () => {
    // Simulated - replace with actual API call
    setLikedProjects([])
  }

  const getBudgetRange = (budgetRange: string): [number?, number?] => {
    switch (budgetRange) {
      case "₹0 - ₹25,000": return [0, 25000]
      case "₹25,000 - ₹50,000": return [25000, 50000]
      case "₹50,000 - ₹1,00,000": return [50000, 100000]
      case "₹1,00,000 - ₹2,50,000": return [100000, 250000]
      case "₹2,50,000+": return [250000, undefined]
      default: return [undefined, undefined]
    }
  }

  const toggleSaveProject = async (projectId: string) => {
    if (!user) {
      toast.error('Please login to save projects')
      return
    }

    try {
      const isSaved = savedProjects.includes(projectId)
      const method = isSaved ? 'DELETE' : 'POST'
      
      const response = await fetch('/api/saved-projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          projectId,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setSavedProjects(prev => 
          isSaved 
            ? prev.filter(id => id !== projectId)
            : [...prev, projectId]
        )
        toast.success(isSaved ? 'Project removed from saved' : 'Project saved successfully')
      } else {
        toast.error(result.message || 'Failed to update saved projects')
      }
    } catch (error) {
      console.error('Error toggling save project:', error)
      toast.error('Failed to update saved projects')
    }
  }

  const toggleLikeProject = async (projectId: string) => {
    if (!user) {
      toast.error('Please login to like projects')
      return
    }

    const isLiked = likedProjects.includes(projectId)
    setLikedProjects(prev => 
      isLiked 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
    
    // Animate the heart
    const heartEl = document.getElementById(`heart-${projectId}`)
    if (heartEl && !isLiked) {
      heartEl.classList.add('animate-ping')
      setTimeout(() => heartEl.classList.remove('animate-ping'), 600)
    }
  }

  const shareProject = async (project: Project) => {
    const shareData = {
      title: project.title,
      text: `Check out this project: ${project.title} - Budget: ${formatBudget(project.budget)}`,
      url: `${window.location.origin}/projects/${project._id}`
    }

    try {
      if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
        toast.success('Project shared successfully!')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
        toast.success('Project link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share project')
    }
  }

  // Replace applyToProject with handleApplyClick
  const handleApplyClick = (project: Project) => {
    if (!user) {
      toast.error('Please login to apply for projects')
      return
    }
    
    console.log('Opening application modal for project:', project._id)
    setSelectedProject(project)
    setIsApplicationModalOpen(true)
  }

  const formatBudget = (budget: Project['budget']) => {
    return `₹${budget.min.toLocaleString('en-IN')} - ₹${budget.max.toLocaleString('en-IN')}`
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diffInMs = now.getTime() - posted.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateMatchScore = (projectSkills: string[], userSkills: string[] = []) => {
    if (!userSkills.length) return 0
    const matches = projectSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase() === skill.toLowerCase()
      )
    ).length
    return Math.round((matches / projectSkills.length) * 100)
  }

  const loadMoreProjects = () => {
    const nextPage = page + 1
    fetchProjects(nextPage, false)
  }

  const navigateToProject = (projectId: string) => {
    // Navigate to project details page
    window.location.href = `/projects/${projectId}`
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5F4B8B]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F0FF] via-white to-[#FAFAFC] dark:from-[#1A1A2E] dark:via-[#16213E] dark:to-[#1A1A2E]">
      <Navbar onAuthClick={() => {}} isAuthenticated={!!user} userType={userData?.userType} />

      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7] mb-2">
              Browse Projects
            </h1>
            <p className="text-[#8E8E93] dark:text-[#F5F5F7]/80">
                            Find the perfect project that matches your skills and interests
            </p>
          </div>

          {/* Stats Bar */}
          <StatsBar />

          {/* Recommended Projects (if user is logged in) */}
          {user && userData?.skills && (
            <RecommendedProjects 
              userSkills={userData.skills} 
              onProjectClick={navigateToProject}
            />
          )}

          {/* Search and Filters */}
          <Card className="mb-6 border-0 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-[#1A1A2E]/80">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8E8E93]" />
                  <Input
                    placeholder="Search projects by title, description, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-[#5F4B8B]/20 focus:border-[#5F4B8B] dark:border-[#1DE9B6]/20 dark:focus:border-[#1DE9B6]"
                  />
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="p-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="p-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((budget) => (
                          <SelectItem key={budget} value={budget}>
                            {budget}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-48 bg-[#5F4B8B]/10" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-[#1A1A2E]/80">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-[#8E8E93]" />
                  <h3 className="text-xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-2">
                    No projects found
                  </h3>
                  <p className="text-[#8E8E93] dark:text-[#F5F5F7]/80">
                    Try adjusting your filters or search query to find more projects
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {projects.map((project) => {
                const matchScore = userData?.skills ? calculateMatchScore(project.skills, userData.skills) : 0
                const isApplied = project.applicants.includes(user?.uid || '')
                const isSaved = savedProjects.includes(project._id)
                const isLiked = likedProjects.includes(project._id)

                return (
                  <Card 
                    key={project._id} 
                    className="border-0 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-[#1A1A2E]/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                  >
                    {/* Featured/Urgent Badges */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {project.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0">
                          Featured
                        </Badge>
                      )}
                      {project.urgent && (
                        <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-0 animate-pulse">
                          Urgent
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      {/* Client Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-[#5F4B8B]/20">
                            <AvatarImage src={project.client?.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] text-white">
                              {project.client?.name?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                                {project.client?.name || 'Anonymous Client'}
                              </p>
                              {project.client?.verified && (
                                <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            {project.client?.rating && (
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-[#8E8E93] dark:text-[#F5F5F7]/80">
                                  {project.client.rating} ({project.client.totalReviews} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {matchScore > 70 && user && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            {matchScore}% match
                          </Badge>
                        )}
                      </div>

                      {/* Project Title & Description */}
                      <h3 
                        onClick={() => navigateToProject(project._id)}
                        className="text-xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-2 group-hover:text-[#5F4B8B] dark:group-hover:text-[#1DE9B6] transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>
                      <p className="text-[#8E8E93] dark:text-[#F5F5F7]/80 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Project Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                          <div>
                            <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/60">Budget</p>
                            <p className="text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                              {formatBudget(project.budget)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                          <div>
                            <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/60">Duration</p>
                            <p className="text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                              {project.duration}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                          <div>
                            <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/60">Deadline</p>
                            <p className="text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                              {formatDeadline(project.deadline)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                          <div>
                            <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/60">Location</p>
                            <p className="text-sm font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                              {project.location}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            className={`
                              ${userData?.skills?.includes(skill) 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                                : 'bg-[#5F4B8B]/10 text-[#5F4B8B] dark:bg-[#1DE9B6]/10 dark:text-[#1DE9B6] border-0'
                              }
                            `}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Application Progress */}
                      {project.maxApplicants && (
                        <ApplicationProgress 
                          applied={project.applicants.length} 
                          total={project.maxApplicants} 
                        />
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{project.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{project.applicants.length} applicants</span>
                          </div>
                          <span>{getTimeAgo(project.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLikeProject(project._id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Heart 
                              id={`heart-${project._id}`}
                              className={`h-4 w-4 transition-all ${
                                isLiked 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-[#8E8E93] hover:text-red-500'
                              }`} 
                            />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveProject(project._id)}
                            className="p-2"
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
                            ) : (
                              <Bookmark className="h-4 w-4 text-[#8E8E93]" />
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareProject(project)}
                            className="p-2"
                          >
                            <Share2 className="h-4 w-4 text-[#8E8E93]" />
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleApplyClick(project)}  // Changed from applyToProject
                            disabled={isApplied || project.status !== 'active'}
                            className={`
                              ${isApplied 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white'
                              }
                            `}
                          >
                            {isApplied ? 'Applied' : 'Apply Now'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Load More */}
          {!loading && hasMore && projects.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={loadMoreProjects}
                disabled={loadingMore}
                className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Projects'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        onFilterClick={() => setShowFilters(!showFilters)}
        onRefresh={() => fetchProjects(1, true)}
        showFilters={showFilters}
      />

         {/* Application Modal */}
      {selectedProject && user && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false)
            setSelectedProject(null)
          }}
          projectId={selectedProject._id}
          projectTitle={selectedProject.title}
          projectBudget={selectedProject.budget}
          userId={user.uid}
          onApplicationSubmitted={(projectId: string) => {
            // Optimistic update - immediately add user to applicants array
            setProjects(prevProjects =>
              prevProjects.map(project =>
                project._id === projectId
                  ? { 
                      ...project, 
                      applicants: [...(project.applicants || []), user.uid] 
                    }
                  : project
              )
            )
            setIsApplicationModalOpen(false)
            setSelectedProject(null)
            
            // Optional: Also refetch to ensure data consistency
            // fetchProjects(1, true)
          }}
        />
      )}
    </div>
  )
}