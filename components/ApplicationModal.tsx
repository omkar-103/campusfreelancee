// components/ApplicationModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, FileText, Link } from 'lucide-react'
import { toast } from 'sonner'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  projectBudget: { min: number; max: number }
  userId: string
  onApplicationSubmitted?: (projectId: string) => void // NEW - callback when application succeeds
}

export default function ApplicationModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  projectBudget,
  userId,
  onApplicationSubmitted // NEW - accept the callback
}: ApplicationModalProps) {
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedBudget: '',
    estimatedDuration: '',
    portfolio: ['']
  })

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('📱 Auth state changed:', {
        uid: user?.uid,
        email: user?.email,
        isSignedIn: !!user
      })
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('🚀 Starting form submission...')
    console.log('Current user:', currentUser)
    console.log('Auth current user:', auth.currentUser)

    // Validation
    if (!formData.coverLetter.trim()) {
      toast.error('Please write a cover letter')
      return
    }

    if (!formData.proposedBudget || parseFloat(formData.proposedBudget) <= 0) {
      toast.error('Please enter a valid budget')
      return
    }

    if (!formData.estimatedDuration.trim()) {
      toast.error('Please enter estimated duration')
      return
    }

    // Check both currentUser and auth.currentUser
    const user = currentUser || auth.currentUser
    
    if (!user) {
      console.error('❌ No user found in either currentUser or auth.currentUser')
      toast.error('You must be logged in to apply')
      return
    }

    setLoading(true)

    try {
      // 🔑 Get Firebase ID token
      console.log('🔐 Getting token for user:', user.uid)
      
      let idToken
      try {
        idToken = await user.getIdToken(true)
        console.log('✅ Token obtained successfully, length:', idToken?.length)
        console.log('🔑 Token preview:', idToken?.substring(0, 50) + '...')
      } catch (tokenError) {
        console.error('❌ Error getting token:', tokenError)
        throw new Error('Failed to authenticate. Please try logging in again.')
      }

      if (!idToken) {
        throw new Error('Failed to get authentication token')
      }

      const applicationData = {
        projectId,
        freelancerId: userId,
        coverLetter: formData.coverLetter.trim(),
        proposedBudget: parseFloat(formData.proposedBudget),
        estimatedDuration: formData.estimatedDuration.trim(),
        portfolio: formData.portfolio.filter(link => link.trim() !== ''),
        idToken: idToken // Make sure this is the actual token
      }

      console.log('📤 Sending application data:', {
        ...applicationData,
        idToken: applicationData.idToken ? '[REDACTED - ' + applicationData.idToken.length + ' chars]' : 'NO TOKEN'
      })

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      console.log('📥 Response status:', response.status)
      
      const responseData = await response.json()
      console.log('📥 Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit application')
      }

      toast.success('Application submitted successfully!')

      // Reset form
      setFormData({
        coverLetter: '',
        proposedBudget: '',
        estimatedDuration: '',
        portfolio: ['']
      })

      // NEW - Call the callback to notify parent component
      if (onApplicationSubmitted) {
        onApplicationSubmitted(projectId)
      }

      onClose()
    } catch (error: any) {
      console.error('❌ Application submission error:', error)
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const addPortfolioLink = () => {
    setFormData({
      ...formData,
      portfolio: [...formData.portfolio, '']
    })
  }

  const updatePortfolioLink = (index: number, value: string) => {
    const newPortfolio = [...formData.portfolio]
    newPortfolio[index] = value
    setFormData({ ...formData, portfolio: newPortfolio })
  }

  const removePortfolioLink = (index: number) => {
    const newPortfolio = formData.portfolio.filter((_, i) => i !== index)
    setFormData({ ...formData, portfolio: newPortfolio })
  }

  // Debug: Check auth state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 Modal opened - Current auth state:', {
        currentUser: currentUser?.uid,
        authCurrentUser: auth.currentUser?.uid,
        isAuthenticated: !!(currentUser || auth.currentUser)
      })
    }
  }, [isOpen, currentUser])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to Project</DialogTitle>
          <DialogDescription>{projectTitle}</DialogDescription>
        </DialogHeader>

        {!currentUser && !auth.currentUser ? (
          <div className="py-8 text-center text-muted-foreground">
            Please log in to apply to projects
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show current user info for debugging */}
            <div className="text-xs text-muted-foreground">
              Logged in as: {(currentUser || auth.currentUser)?.email}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                placeholder="Explain why you're the best fit for this project..."
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.value })
                }
                required
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Budget & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposedBudget">Proposed Budget ($) *</Label>
                <Input
                  id="proposedBudget"
                  type="number"
                  placeholder={`${projectBudget.min} - ${projectBudget.max}`}
                  value={formData.proposedBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, proposedBudget: e.target.value })
                  }
                  required
                  min={projectBudget.min}
                  max={projectBudget.max}
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration *</Label>
                <Input
                  id="estimatedDuration"
                  placeholder="e.g., 2 weeks, 1 month"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedDuration: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="space-y-2">
              <Label>Portfolio Links (Optional)</Label>
              {formData.portfolio.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com/my-work"
                    value={link}
                    onChange={(e) => updatePortfolioLink(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.portfolio.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePortfolioLink(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPortfolioLink}
                className="mt-2"
              >
                <Link className="h-4 w-4 mr-2" />
                Add Portfolio Link
              </Button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#5F4B8B] to-[#1DE9B6] hover:from-[#1DE9B6] hover:to-[#5F4B8B] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}