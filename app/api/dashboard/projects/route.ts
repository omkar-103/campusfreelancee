// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB() // ✅ Ensure DB connection

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'Latest'

    let query: any = {}

    if (clientId) query.clientId = clientId
    if (status) query.status = status
    if (category) query.category = category

    const skip = (page - 1) * limit

    const sortQuery: any = {}
    if (sort === 'Latest') sortQuery.createdAt = -1
    else if (sort === 'Oldest') sortQuery.createdAt = 1

    const projects = await Project.find(query)
      .populate('clientId', 'name email company')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({ success: true, data: projects })
  } catch (error: any) {
    console.error('❌ Error fetching projects:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB() // ✅ Ensure DB connection

    const body = await request.json()
    const { clientId, ...projectData } = body

    if (!clientId) {
      return NextResponse.json(
        { success: false, message: 'Client ID is required' },
        { status: 400 }
      )
    }

    const client = await User.findById(clientId)
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      )
    }

    const project = await Project.create({
      ...projectData,
      clientId,
      clientName: client.name,
    })

    await User.findByIdAndUpdate(clientId, {
      $inc: { postedProjects: 1 }
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error: any) {
    console.error('❌ Error creating project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create project', details: error.message },
      { status: 500 }
    )
  }
}
