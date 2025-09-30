// pages/api/admin/dashboard.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import Project from '@/models/Project';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // For demo purposes, we'll just check if token exists
    // In production, verify the JWT signature
    if (!token) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    await dbConnect();

    // Fetch user data
    const users = await User.find({});
    const totalUsers = users.length;
    const students = users.filter(user => user.userType === 'student').length;
    const clients = users.filter(user => user.userType === 'client').length;
    const activeToday = users.filter(user => 
      new Date(user.lastActive || user.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;
    const newThisMonth = users.filter(user => 
      new Date(user.createdAt) > new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).length;
    const totalFirebaseUsers = totalUsers; // In real app, this would be from Firebase

    // Fetch project data
    const projects = await Project.find({});
    const totalProjects = projects.length;
    const activeProjects = projects.filter(project => project.status === 'active').length;
    const completedProjects = projects.filter(project => project.status === 'completed').length;
    const pendingProjects = projects.filter(project => project.status === 'pending').length;

    // Fetch payment data
    const payments = await Payment.find({});
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const platformFees = payments.reduce((sum, payment) => sum + Math.round(payment.amount * 0.1), 0);
    const studentEarnings = totalRevenue - platformFees;
    const pendingPayouts = payments
      .filter(payment => payment.status === 'pending' || payment.status === 'processing')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const thisMonthPayments = payments.filter(payment => 
      new Date(payment.createdAt) > new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    const thisMonthRevenue = thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const razorpayStatus = process.env.RAZORPAY_KEY_ID ? 'active' : 'inactive';

    // System stats (in production, these would come from actual system monitoring)
    const uptime = '99.9%';
    const mongoStatus = 'connected'; // Assuming MongoDB is connected
    const firebaseStatus = 'connected'; // Assuming Firebase is connected
    const dbConnections = Math.floor(Math.random() * 50) + 10; // Random for demo
    const apiCalls = Math.floor(Math.random() * 1000) + 200; // Random for demo
    const errors = Math.floor(Math.random() * 15); // Random for demo

    const dashboardData = {
      users: {
        total: totalUsers,
        students,
        clients,
        activeToday,
        newThisMonth,
        totalFirebaseUsers
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        pending: pendingProjects
      },
      payments: {
        totalRevenue,
        platformFees,
        studentEarnings,
        pendingPayouts,
        thisMonth: thisMonthRevenue,
        razorpayStatus
      },
      system: {
        uptime,
        mongoStatus,
        firebaseStatus,
        dbConnections,
        apiCalls,
        errors
      }
    };

    return res.status(200).json({ success: true, dashboard: dashboardData });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}