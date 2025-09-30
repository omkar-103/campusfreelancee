// app/api/admin/users/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const analytics = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          students: { $sum: { $cond: [{ $eq: ['$userType', 'student'] }, 1, 0] } },
          clients: { $sum: { $cond: [{ $eq: ['$userType', 'client'] }, 1, 0] } },
          active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          verified: { $sum: { $cond: [{ $eq: ['$verified', true] }, 1, 0] } },
          avgRating: { $avg: '$rating' },
          totalEarnings: { $sum: '$totalEarnings' },
          avgHourlyRate: { $avg: '$hourlyRate' },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: analytics[0] || {
        total: 0,
        students: 0,
        clients: 0,
        active: 0,
        verified: 0,
        avgRating: 0,
        totalEarnings: 0,
        avgHourlyRate: 0,
      },
    });
  } catch (error: any) {
    console.error('❌ Admin analytics error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}