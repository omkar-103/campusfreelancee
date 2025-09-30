// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { email, password, name, userType, college, company } = body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userData: any = {
      email,
      password: hashedPassword,
      name,
      userType,
    }

    if (userType === 'student' && college) {
      userData.college = college
    } else if (userType === 'client' && company) {
      userData.company = company
    }

    const user = await User.create(userData)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}