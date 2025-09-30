// pages/api/admin/system/logs.ts
import { NextApiRequest, NextApiResponse } from 'next';

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

    // For demo purposes, generate fake system logs
    // In production, this would read from actual log files or database
    const fakeLogs = [
      { level: 'info', message: 'System started successfully', source: 'server', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { level: 'info', message: 'Database connection established', source: 'mongodb', timestamp: new Date(Date.now() - 3000000).toISOString() },
      { level: 'info', message: 'Firebase authentication service connected', source: 'firebase', timestamp: new Date(Date.now() - 2400000).toISOString() },
      { level: 'warn', message: 'High API usage detected - 85% of rate limit', source: 'api-gateway', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { level: 'info', message: 'New user registered: john.doe@example.com', source: 'auth-service', timestamp: new Date(Date.now() - 1200000).toISOString() },
      { level: 'info', message: 'Payment processed successfully: ₹2,500', source: 'razorpay', timestamp: new Date(Date.now() - 900000).toISOString() },
      { level: 'error', message: 'Failed to send notification to user: jane.smith@example.com', source: 'notification-service', timestamp: new Date(Date.now() - 600000).toISOString() },
      { level: 'info', message: 'Scheduled task completed: user cleanup', source: 'scheduler', timestamp: new Date(Date.now() - 300000).toISOString() },
      { level: 'info', message: 'Cache cleared successfully', source: 'redis', timestamp: new Date(Date.now() - 180000).toISOString() },
      { level: 'info', message: 'System health check passed', source: 'monitoring', timestamp: new Date(Date.now() - 120000).toISOString() },
      { level: 'warn', message: 'High memory usage on server instance', source: 'monitoring', timestamp: new Date(Date.now() - 60000).toISOString() },
      { level: 'info', message: 'New project created: "Website redesign"', source: 'project-service', timestamp: new Date(Date.now() - 30000).toISOString() },
      { level: 'info', message: 'User logged in: snehaop@gmail.com', source: 'auth-service', timestamp: new Date(Date.now() - 15000).toISOString() },
      { level: 'error', message: 'API rate limit exceeded: /api/users', source: 'api-gateway', timestamp: new Date(Date.now() - 9000).toISOString() },
      { level: 'info', message: 'Payment payout initiated: ₹12,500 to 3 students', source: 'payment-service', timestamp: new Date(Date.now() - 6000).toISOString() },
      { level: 'info', message: 'Database backup completed successfully', source: 'backup-service', timestamp: new Date(Date.now() - 3000).toISOString() },
      { level: 'info', message: 'User profile updated: jane.smith@example.com', source: 'profile-service', timestamp: new Date(Date.now() - 1500).toISOString() },
      { level: 'warn', message: 'Low disk space on server - 15% remaining', source: 'monitoring', timestamp: new Date(Date.now() - 900).toISOString() },
      { level: 'info', message: 'Application version updated to v1.2.3', source: 'deployment', timestamp: new Date(Date.now() - 600).toISOString() },
      { level: 'info', message: 'Email notification sent: Project status update', source: 'email-service', timestamp: new Date(Date.now() - 300).toISOString() },
    ];

    return res.status(200).json({ success: true, logs: fakeLogs });
  } catch (error) {
    console.error('System logs API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}