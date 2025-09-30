// app/api/freelancers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    // Build query
    const query: any = { userType: 'student', isActive: true }
    
    // Category mapping
    const categorySkillsMap: { [key: string]: string[] } = {
      'web-dev': ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS', 'Web Development'],
      'mobile-dev': ['React Native', 'Flutter', 'Android', 'iOS', 'Mobile Development'],
      'design': ['UI/UX Design', 'Graphic Design', 'Figma', 'Photoshop', 'Design'],
      'content': ['Content Writing', 'Copywriting', 'Blog Writing', 'Content Creation'],
      'marketing': ['Digital Marketing', 'SEO', 'Social Media', 'Marketing']
    }
    
    if (category && category !== 'all' && categorySkillsMap[category]) {
      query.skills = { $in: categorySkillsMap[category] }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
        { bio: { $regex: search, $options: 'i' } }
      ]
    }
    
    const freelancers = await User.find(query)
      .select('firebaseUid name avatar rating hourlyRate completedProjects skills location bio')
      .sort({ rating: -1, completedProjects: -1 })
      .limit(20)
    
    // Transform data for frontend
    const transformedFreelancers = freelancers.map(f => ({
      _id: f.firebaseUid,
      name: f.name,
      role: f.skills?.[0] || 'Freelancer',
      avatar: f.avatar || '',
      rating: f.rating || 4.5,
      hourlyRate: f.hourlyRate || 500,
      completedProjects: f.completedProjects || 0,
      responseTime: '2h', // Default response time
      skills: f.skills || [],
      location: f.location?.city ? `${f.location.city}, ${f.location.state || 'India'}` : 'India',
      availability: 'available' as const,
      bio: f.bio || 'Experienced freelancer ready to help with your projects.'
    }))
    
    return NextResponse.json({ success: true, data: transformedFreelancers })
  } catch (error) {
    console.error('Error fetching freelancers:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch freelancers' }, { status: 500 })
  }
}