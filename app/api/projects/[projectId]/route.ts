// app/api/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB()
    
    const project = await Project.findById(params.projectId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: project
    })
    
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { status, ...updateData } = body
    
    if (!params.projectId) {
      return NextResponse.json(
        { success: false, message: 'Project ID required' },
        { status: 400 }
      )
    }

    const project = await Project.findById(params.projectId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      params.projectId,
      { 
        ...updateData,
        ...(status && { status })
      },
      { new: true }
    )
    
    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB()
    
    if (!params.projectId) {
      return NextResponse.json(
        { success: false, message: 'Project ID required' },
        { status: 400 }
      )
    }

    const project = await Project.findById(params.projectId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    await Project.findByIdAndDelete(params.projectId)
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    )
  }
}