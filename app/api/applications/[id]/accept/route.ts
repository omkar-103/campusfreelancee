// app/api/applications/[id]/accept/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Project from "@/models/Project";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { clientId } = body;
    const applicationId = params.id;

    // Find and validate application
    const application = await Application.findById(applicationId).populate('projectId');
    
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Verify the client owns this project
    const project = application.projectId as any;
    if (project.clientId !== clientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update application status
    application.status = 'accepted';
    application.updatedAt = new Date();
    await application.save();

    // Reject all other pending applications for this project
    await Application.updateMany(
      { 
        projectId: project._id,
        _id: { $ne: applicationId },
        status: 'pending'
      },
      { 
        status: 'rejected',
        updatedAt: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      message: "Application accepted successfully",
      data: application
    });

  } catch (error: any) {
    console.error('Error accepting application:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}