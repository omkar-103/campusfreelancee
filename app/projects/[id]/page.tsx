// app/projects/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import ApplicationModal from '@/components/ApplicationModal'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ProjectDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!user) {
      toast.error('Please login to apply')
      return
    }
    setShowApplicationModal(true)
  }

  if (loading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="container mx-auto py-8">
      {/* Project details UI */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="text-lg font-semibold">
            Budget: ${project.budget.min} - ${project.budget.max}
          </span>
          <span className="text-gray-500">
            Timeline: {project.timeline}
          </span>
        </div>

        {user && user.userType === 'student' && (
          <Button 
            onClick={handleApply}
            className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6]"
          >
            Apply Now
          </Button>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && user && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          projectId={project._id}
          projectTitle={project.title}
          projectBudget={project.budget}
          userId={user.uid}
        />
      )}
    </div>
  )
}