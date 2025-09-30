// app/api/saved-projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SavedProject from '@/models/SavedProject'

export async function GET(request: NextRequest) {
  try {
    await connectDB() // Ensure Mongoose is connected

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fully wait for connection before querying
    const savedProjects = await SavedProject.find({ userId }).lean()

    return NextResponse.json({
      success: true,
      data: savedProjects
    })
  } catch (error: any) {
    console.error('Error fetching saved projects:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch saved projects', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, projectId } = await request.json()

    if (!userId || !projectId) {
      return NextResponse.json(
        { success: false, message: 'User ID and Project ID are required' },
        { status: 400 }
      )
    }

    const existingSave = await SavedProject.findOne({ userId, projectId })
    
    if (existingSave) {
      return NextResponse.json(
        { success: false, message: 'Project already saved' },
        { status: 400 }
      )
    }

    const savedProject = new SavedProject({ userId, projectId, savedAt: new Date() })
    await savedProject.save()

    return NextResponse.json({
      success: true,
      data: savedProject,
      message: 'Project saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save project', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, projectId } = await request.json()

    if (!userId || !projectId) {
      return NextResponse.json(
        { success: false, message: 'User ID and Project ID are required' },
        { status: 400 }
      )
    }

    await SavedProject.findOneAndDelete({ userId, projectId })

    return NextResponse.json({
      success: true,
      message: 'Project removed from saved'
    })
  } catch (error: any) {
    console.error('Error removing saved project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to remove saved project', details: error.message },
      { status: 500 }
    )
  }
}
