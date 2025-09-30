// app/api/dashboard/student/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Escrow from "@/models/Escrow";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    // Get user data
    const user = await User.findById(studentId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get applications
    const applications = await Application.find({ studentId }).populate('projectId');
    
    // Calculate stats
    const totalApplications = applications.length;
    const acceptedApplications = applications.filter(app => 
      app.status === 'accepted' || app.status === 'hired'
    ).length;
    const acceptanceRate = totalApplications > 0 
      ? acceptedApplications / totalApplications 
      : 0;

    // Get active projects (hired and paid)
    const activeProjects = applications.filter(app => 
      app.status === 'hired' && app.paid
    ).length;

    // Get earnings data from escrow
    const releasedEscrows = await Escrow.find({
      studentId,
      status: 'released'
    });

    const totalEarnings = releasedEscrows.reduce((sum, escrow) => 
      sum + escrow.studentEarnings, 0
    );

    // Get pending earnings
    const pendingEscrows = await Escrow.find({
      studentId,
      status: 'held'
    });

    const pendingEarnings = pendingEscrows.reduce((sum, escrow) => 
      sum + escrow.studentEarnings, 0
    );

    // Get this month and last month earnings
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthEscrows = releasedEscrows.filter(escrow => 
      new Date(escrow.releaseDate) >= thisMonthStart
    );
    const thisMonthEarnings = thisMonthEscrows.reduce((sum, escrow) => 
      sum + escrow.studentEarnings, 0
    );

    const lastMonthEscrows = releasedEscrows.filter(escrow => {
      const releaseDate = new Date(escrow.releaseDate);
      return releaseDate >= lastMonthStart && releaseDate <= lastMonthEnd;
    });
    const lastMonthEarnings = lastMonthEscrows.reduce((sum, escrow) => 
      sum + escrow.studentEarnings, 0
    );

    // Calculate average response time
    let totalResponseTime = 0;
    let responseCount = 0;

    applications.forEach(app => {
      const project = app.projectId as any;
      if (project && project.createdAt && app.createdAt) {
        const projectDate = new Date(project.createdAt);
        const applicationDate = new Date(app.createdAt);
        const diffInHours = (applicationDate.getTime() - projectDate.getTime()) / (1000 * 60 * 60);
        totalResponseTime += diffInHours;
        responseCount++;
      }
    });

    const avgResponseTime = responseCount > 0 
      ? `${Math.round(totalResponseTime / responseCount)}h`
      : '0h';

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings,
        availableBalance: user.availableBalance || 0,
        pendingEarnings,
        activeProjects,
        completedProjects: user.completedProjects || 0,
        profileViews: user.profileViews || 0,
        totalApplications,
        acceptanceRate,
        avgResponseTime,
        rating: user.rating || 0,
        totalReviews: user.totalReviews || 0,
        thisMonthEarnings,
        lastMonthEarnings
      }
    });

  } catch (error: any) {
    console.error('Error fetching student stats:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}