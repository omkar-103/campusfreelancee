// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const experienceLevel = searchParams.get('experienceLevel')
    const budgetMin = searchParams.get('budgetMin')
    const budgetMax = searchParams.get('budgetMax')
    const sort = searchParams.get('sort')
    const clientId = searchParams.get('clientId')
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')

    let query: any = {}

    // Filter by client or student
    if (clientId) query.clientId = clientId
    if (studentId) query.applicants = { $in: [studentId] }
    if (status) query.status = status
    else if (!clientId && !studentId) query.status = 'active'

    // Search by title, description, or skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    if (category) query.category = category
    if (experienceLevel) query.experienceLevel = experienceLevel

    // Budget range filter
    if (budgetMin || budgetMax) {
      query['budget.min'] = {}
      if (budgetMin) query['budget.min'].$gte = parseInt(budgetMin)
      if (budgetMax) query['budget.max'] = { $lte: parseInt(budgetMax) }
    }

    // Sorting
    let sortQuery: any = { createdAt: -1 }
    if (sort) {
      switch (sort) {
        case 'Latest':
          sortQuery = { createdAt: -1 }
          break
        case 'Budget: High to Low':
          sortQuery = { 'budget.max': -1 }
          break
        case 'Budget: Low to High':
          sortQuery = { 'budget.min': 1 }
          break
        case 'Most Applicants':
          sortQuery = { applicants: -1 }
          break
      }
    }

    const skip = (page - 1) * limit
    const projects = await Project.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean()

    // Increment views (optional)
    await Project.updateMany(
      { _id: { $in: projects.map(p => p._id) } },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total: await Project.countDocuments(query)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      title,
      description,
      budget,
      duration,
      skills,
      category,
      clientId,
      experienceLevel,
      projectType,
      location,
      deadline,
      featured,
      urgent,
      attachments
    } = body

    // Validate required fields
    if (!title || !description || !budget || !duration || !skills || !category || !clientId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new project
    const project = new Project({
      title,
      description,
      budget: {
        min: budget.min,
        max: budget.max,
        currency: budget.currency || 'INR'
      },
      duration,
      skills,
      category,
      clientId,
      experienceLevel: experienceLevel || 'Intermediate',
      projectType: projectType || 'Fixed Price',
      location: location || 'Remote',
      deadline: deadline ? new Date(deadline) : undefined,
      featured: featured || false,
      urgent: urgent || false,
      attachments: attachments || [],
      status: 'active',
      applicants: [],
      proposals: 0,
      views: 0
    })

    await project.save()

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    )
  }
}
