// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb' // ✅ Named import
import User from '@/models/User'
import Project from '@/models/Project'
import Proposal from '@/models/Proposal'

export async function GET(request: Request) {
  try {
    await connectDB() // ✅ Correct usage
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')
    
    if (!userId || !userType) {
      return NextResponse.json(
        { success: false, message: 'Missing parameters' },
        { status: 400 }
      )
    }
    
    // ✅ Query by firebaseUid instead of _id
    const user = await User.findOne({ firebaseUid: userId })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    let stats = {}
    
    if (userType === 'client') {
      // Get client stats
      const activeProjects = await Project.countDocuments({ 
        clientId: userId, 
        status: 'active' 
      })
      
      const totalProjects = await Project.countDocuments({ 
        clientId: userId 
      })
      
      const completedProjects = await Project.countDocuments({ 
        clientId: userId, 
        status: 'completed' 
      })
      
      stats = {
        activeProjects,
        totalProjects,
        completedProjects,
        totalSpent: user.totalSpent || 0,
        hiredFreelancers: user.hiredFreelancers || 0,
        avgResponseTime: '2.5h', // Calculate if needed
      }
    } else {
      // Get student stats
      const activeProjects = await Project.countDocuments({ 
        selectedFreelancer: userId, 
        status: { $in: ['in-progress', 'in-review'] } 
      })
      
      const completedProjects = await Project.countDocuments({ 
        selectedFreelancer: userId, 
        status: 'completed' 
      })
      
      const pendingProposals = await Proposal.countDocuments({ 
        freelancerId: userId, 
        status: 'pending' 
      })
      
      stats = {
        activeProjects,
        completedProjects,
        pendingProposals,
        totalEarnings: user.totalEarnings || 0,
        rating: user.rating || 0,
        totalReviews: user.totalReviews || 0,
        profileViews: user.profileViews || 0,
      }
    }
    
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
