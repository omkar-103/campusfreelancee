// app/api/payments/release-escrow/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Escrow from "@/models/Escrow";
import User from "@/models/User";
import Project from "@/models/Project";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { escrowId, clientId, reason } = body;

    // Find and validate escrow
    const escrow = await Escrow.findById(escrowId);
    
    if (!escrow) {
      return NextResponse.json(
        { success: false, message: "Escrow not found" },
        { status: 404 }
      );
    }

    if (escrow.clientId !== clientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    if (escrow.status !== 'held') {
      return NextResponse.json(
        { success: false, message: "Escrow already processed" },
        { status: 400 }
      );
    }

    // Release funds to student
    await Escrow.findByIdAndUpdate(escrowId, {
      status: 'released',
      releaseDate: new Date(),
      updatedAt: new Date()
    });

    // Update student earnings
    const user = await User.findById(escrow.studentId);
    await User.findByIdAndUpdate(escrow.studentId, {
      totalEarnings: (user.totalEarnings || 0) + escrow.studentEarnings,
      availableBalance: (user.availableBalance || 0) + escrow.studentEarnings,
      completedProjects: (user.completedProjects || 0) + 1
    });

    // Update project status
    await Project.findByIdAndUpdate(escrow.projectId, {
      status: 'completed',
      completedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Funds released successfully"
    });

  } catch (error: any) {
    console.error('Error releasing escrow:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}