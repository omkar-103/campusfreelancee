import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // If not logged in or not admin, block access
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/users/:path*', '/api/admin/users/analytics'],
};