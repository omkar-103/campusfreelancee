// pages/api/admin/payments/recent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';

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
    if (!token) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    await dbConnect();

    // Get the 10 most recent payments
    const recentPayments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('studentId', 'name email')
      .populate('clientId', 'name email')
      .select('amount status createdAt studentId clientId projectTitle');

    // Format the response with user names
    const payments = recentPayments.map(payment => ({
      id: payment._id.toString(),
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      studentName: payment.studentId?.name || 'Unknown',
      studentEmail: payment.studentId?.email || 'N/A',
      clientName: payment.clientId?.name || 'Unknown',
      clientEmail: payment.clientId?.email || 'N/A',
      projectTitle: payment.projectTitle || 'N/A'
    }));

    return res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error('Recent payments API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}