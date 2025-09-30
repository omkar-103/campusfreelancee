// pages/api/admin/users/recent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
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

    // Get the 10 most recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email userType createdAt firebaseUid role');

    // Format the response
    const users = recentUsers.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      role: user.role,
      firebaseUid: user.firebaseUid,
      createdAt: user.createdAt
    }));

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Recent users API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}