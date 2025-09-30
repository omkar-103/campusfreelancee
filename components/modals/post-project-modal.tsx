// components/modals/post-project-modal.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface PostProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: any) => Promise<void>
}

const categories = [
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

const skillSuggestions = [
  "React", "Node.js", "JavaScript", "Python", "Java", "HTML", "CSS",
  "Flutter", "React Native", "Android", "iOS", "Swift", "Kotlin",
  "Figma", "Photoshop", "Illustrator", "UI Design", "UX Design",
  "Content Writing", "Blog Writing", "Copywriting", "SEO", 
  "Social Media Marketing", "Google Ads", "Facebook Ads",
  "Data Analysis", "Machine Learning", "SQL", "MongoDB"
]

export function PostProjectModal({ isOpen, onClose, onSubmit }: PostProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    experienceLevel: "Intermediate",
    projectType: "Fixed Price",
    budget: { min: 0, max: 0, currency: "INR" },
    duration: "",
    location: "Remote",
    skills: [] as string[],
    urgent: false,
  })
  const [newSkill, setNewSkill] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category || 
        formData.budget.min <= 0 || formData.budget.max <= 0 || !formData.duration) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        experienceLevel: "Intermediate", 
        projectType: "Fixed Price",
        budget: { min: 0, max: 0, currency: "INR" },
        duration: "",
        location: "Remote",
        skills: [],
        urgent: false,
      })
    } catch (error) {
      console.error("Error submitting project:", error)
    } finally {
      setLoading(false)
    }
  }

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1C1C1E]">
            Post a New Project
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Project Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="E.g., Build a React.js e-commerce website"
              className="mt-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Project Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project requirements, goals, and expectations..."
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          {/* Category and Experience Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-base font-medium">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <Label className="text-base font-medium">Budget (INR) *</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="minBudget" className="text-sm text-gray-600">Minimum</Label>
                <Input
                  id="minBudget"
                  type="number"
                  value={formData.budget.min}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, min: parseInt(e.target.value) || 0 }
                  }))}
                  placeholder="5000"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxBudget" className="text-sm text-gray-600">Maximum</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  value={formData.budget.max}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    budget: { ...prev.budget, max: parseInt(e.target.value) || 0 }
                  }))}
                  placeholder="15000"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Duration and Project Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration" className="text-base font-medium">Duration *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 week">1 week</SelectItem>
                  <SelectItem value="2 weeks">2 weeks</SelectItem>
                  <SelectItem value="3 weeks">3 weeks</SelectItem>
                  <SelectItem value="1 month">1 month</SelectItem>
                  <SelectItem value="2 months">2 months</SelectItem>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-base font-medium">Project Type</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                  <SelectItem value="Hourly Rate">Hourly Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label className="text-base font-medium">Required Skills</Label>
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(newSkill))}
                />
                <Button
                  type="button"
                  onClick={() => addSkill(newSkill)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Skill suggestions */}
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.slice(0, 8).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#5F4B8B] hover:text-white transition-colors"
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              
              {/* Selected skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-[#5F4B8B] text-white"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white"
            >
              {loading ? "Posting..." : "Post Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}