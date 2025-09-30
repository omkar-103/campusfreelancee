// /api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Application from '@/models/Application'
import Project from '@/models/Project'
import { auth } from '@/lib/firebaseAdmin'

// ✅ Helper to verify Firebase token from header or body
async function verifyFirebaseToken(request: NextRequest, body?: any) {
  let token = null

  // Check header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  // Check body if not in header
  if (!token && body?.idToken) {
    token = body.idToken
  }

  if (!token) return null

  try {
    const decoded = await auth.verifyIdToken(token)
    return decoded
  } catch (err) {
    console.error('Firebase token verification failed:', err)
    return null
  }
}

// -------------------- POST: Create Application --------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify Firebase token
    const decodedUser = await verifyFirebaseToken(request, body)
    if (!decodedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const {
      projectId,
      freelancerId,
      coverLetter,
      proposedBudget,
      estimatedDuration,
      portfolio = []
    } = body

    // Validate required fields
    if (!projectId || !freelancerId || !coverLetter || !proposedBudget || !estimatedDuration) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          received: { projectId, freelancerId, coverLetter, proposedBudget, estimatedDuration }
        },
        { status: 400 }
      )
    }

    // Check if project exists
    const project = await Project.findById(projectId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ projectId, freelancerId })
    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this project' }, { status: 400 })
    }

    // Create application
    const application = await Application.create({
      projectId,
      freelancerId,
      coverLetter,
      proposedBudget: Number(proposedBudget),
      estimatedDuration,
      portfolio: portfolio.filter((link: string) => link.trim() !== ''),
      status: 'pending'
    })

    // ✅ Update Project applicants array with freelancerId
    if (!project.applicants.includes(freelancerId)) {
      project.applicants.push(freelancerId)
      await project.save()
    }

    console.log('Application created:', application._id)
    return NextResponse.json(application, { status: 201 })
  } catch (error: any) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to create application', details: error.message },
      { status: 500 }
    )
  }
}

// -------------------- GET: Fetch Applications --------------------
export async function GET(request: NextRequest) {
  try {
    const decodedUser = await verifyFirebaseToken(request)
    if (!decodedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const freelancerId = searchParams.get('freelancerId')

    const query: any = {}
    if (projectId) query.projectId = projectId
    if (freelancerId) query.freelancerId = freelancerId

    const applications = await Application.find(query)
      .populate('projectId')
      .sort('-createdAt')

    return NextResponse.json(applications)
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Failed to fetch applications', details: error.message }, { status: 500 })
  }
}
