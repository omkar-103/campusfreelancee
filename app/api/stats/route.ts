// app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  console.log('📈 [GET /api/stats] Fetching dashboard statistics');
  
  try {
    const client = await clientPromise;
// app/api/stats/route.ts (continued)
    const db = client.db('campusfreelance');
    
    console.log('🔢 Calculating statistics...');
    
    // Fetch all collections
    const projects = await db.collection('projects').find({}).toArray();
    const freelancers = await db.collection('freelancers').find({}).toArray();
    const transactions = await db.collection('transactions').find({}).toArray();
    
    // Calculate stats
    const stats = {
      activeProjects: projects.filter(p => p.status === 'Active').length,
      totalSpent: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      hiredFreelancers: freelancers.filter(f => f.hired).length,
      avgResponseTime: '2.5 hrs'
    };
    
    console.log('✅ Stats calculated successfully:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}