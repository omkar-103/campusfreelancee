// app/api/projects/[projectId]/view/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB()
    
    const { viewerId } = await request.json()
    
    if (!params.projectId) {
      return NextResponse.json(
        { success: false, message: 'Project ID required' },
        { status: 400 }
      )
    }

    // Find the project and increment view count
    const project = await Project.findById(params.projectId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Increment view count
    project.views = (project.views || 0) + 1
    
    // Add viewer to applicants if not already there (optional)
    if (viewerId && !project.applicants.includes(viewerId)) {
      // Only track unique views, don't add to applicants unless they actually apply
    }
    
    await project.save()
    
    return NextResponse.json({ 
      success: true, 
      message: 'View tracked successfully',
      views: project.views 
    })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to track view' },
      { status: 500 }
    )
  }
}