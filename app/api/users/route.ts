// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const searchParams = request.nextUrl.searchParams
    const uid = searchParams.get('uid')
    
    if (!uid) {
      return NextResponse.json(
        { success: false, message: 'Firebase UID required' },
        { status: 400 }
      )
    }
    
    const user = await User.findOne({ firebaseUid: uid })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        userType: user.userType,
        avatar: user.avatar,
        company: user.company,
        rating: user.rating,
        totalReviews: user.totalReviews,
        totalEarnings: user.totalEarnings,
        activeProjects: user.activeProjects,
        completedProjects: user.completedProjects,
        profileViews: user.profileViews,
      }
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { firebaseUid, email, name, userType, avatar } = body
    
    if (!firebaseUid || !email || !name || !userType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUid })
    
    if (user) {
      // User exists, return existing data
      return NextResponse.json({
        success: true,
        data: {
          firebaseUid: user.firebaseUid,
          email: user.email,
          name: user.name,
          userType: user.userType,
          avatar: user.avatar,
          company: user.company,
          rating: user.rating,
          totalReviews: user.totalReviews,
          totalEarnings: user.totalEarnings,
          activeProjects: user.activeProjects,
          completedProjects: user.completedProjects,
          profileViews: user.profileViews,
        }
      })
    }
    
    // Create new user
    user = new User({
      firebaseUid,
      email,
      name,
      userType,
      avatar,
      rating: 0,
      totalReviews: 0,
      totalEarnings: 0,
      activeProjects: 0,
      completedProjects: 0,
      profileViews: 0,
      verified: false,
      isActive: true,
    })
    
    const savedUser = await user.save()
    
    return NextResponse.json({
      success: true,
      data: {
        firebaseUid: savedUser.firebaseUid,
        email: savedUser.email,
        name: savedUser.name,
        userType: savedUser.userType,
        avatar: savedUser.avatar,
        company: savedUser.company,
        rating: savedUser.rating,
        totalReviews: savedUser.totalReviews,
        totalEarnings: savedUser.totalEarnings,
        activeProjects: savedUser.activeProjects,
        completedProjects: savedUser.completedProjects,
        profileViews: savedUser.profileViews,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating/fetching user:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}