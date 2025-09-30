// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// ============ HELPERS ============
async function handleGet(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userType = searchParams.get('userType'); // "student" | "client"
    const isActive = searchParams.get('isActive') === 'true';
    const verified = searchParams.get('verified') === 'true';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = searchParams.get('sortDir') === 'desc' ? -1 : 1;

    // Build query object dynamically
    const query: any = {};
    if (userType) query.userType = userType;
    if (isActive !== undefined) query.isActive = isActive;
    if (verified !== undefined) query.verified = verified;

    // Pagination and sorting
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select('-password') // Ensure password (if any) is never returned
      .lean(); // Use lean() for better performance with large datasets

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('❌ Admin GET /users error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function handlePatch(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json();
    const updates: Partial<IUser> = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('❌ Admin PATCH /users error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function handleDelete(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Admin DELETE /users error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ============ ROUTE HANDLER ============
export async function GET(req: NextRequest) {
  return handleGet(req);
}

export async function PATCH(req: NextRequest) {
  return handlePatch(req);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req);
}