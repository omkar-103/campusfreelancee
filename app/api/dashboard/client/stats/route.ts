// app/api/dashboard/client/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Payment from "@/models/Payment";
import Application from "@/models/Application";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { success: false, message: "Client ID required" },
        { status: 400 }
      );
    }

    // Get all projects by this client
    const projects = await Project.find({ clientId });

    // Project stats
    const activeProjects = projects.filter((p) =>
      ["active", "in-progress", "in-review"].includes(p.status)
    ).length;

    const completedProjects = projects.filter(
      (p) => p.status === "completed"
    ).length;

    const totalProjects = projects.length;

    // Payment stats
    const completedPayments = await Payment.find({
      clientId,
      status: "completed",
      type: "project_payment",
    });

    const totalPaid = completedPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const pendingPayments = await Payment.countDocuments({
      clientId,
      status: { $in: ["created", "pending"] },
    });

    // Hired freelancers (accepted + paid applications)
    const hiredFreelancers = await Application.countDocuments({
      projectId: { $in: projects.map((p) => p._id) },
      status: "hired",
      paid: true,
    });

    // Average response time (project.createdAt -> application.createdAt)
    const applications = await Application.find({
      projectId: { $in: projects.map((p) => p._id) },
    }).populate("projectId");

    let totalResponseTime = 0;
    let responseCount = 0;

    applications.forEach((app) => {
      const project = app.projectId as any;
      if (project?.createdAt && app.createdAt) {
        const projectDate = new Date(project.createdAt);
        const applicationDate = new Date(app.createdAt);
        const diffInHours =
          (applicationDate.getTime() - projectDate.getTime()) /
          (1000 * 60 * 60);

        if (diffInHours >= 0) {
          totalResponseTime += diffInHours;
          responseCount++;
        }
      }
    });

    const avgResponseTime =
      responseCount > 0
        ? `${Math.round(totalResponseTime / responseCount)}h`
        : "0h";

    return NextResponse.json({
      success: true,
      data: {
        activeProjects,
        totalProjects,
        completedProjects,
        totalPaid,
        pendingPayments,
        hiredFreelancers,
        avgResponseTime,
      },
    });
  } catch (error: any) {
    console.error("Error fetching client stats:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
