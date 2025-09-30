// app/api/users/[userId]/earnings/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Escrow from "@/models/Escrow";
import Withdrawal from "@/models/Withdrawal";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    
    const { userId } = params;

    // Get all payments
    const payments = await Payment.find({
      studentId: userId,
      status: 'completed'
    });

    // Get released escrows
    const releasedEscrows = await Escrow.find({
      studentId: userId,
      status: 'released'
    });

    // Get withdrawals
    const withdrawals = await Withdrawal.find({
      studentId: userId
    });

    // Calculate earnings
    const totalEarnings = releasedEscrows.reduce((sum, escrow) => 
      sum + escrow.studentEarnings, 0
    );

    const pendingEarnings = await Escrow.aggregate([
      { 
        $match: { 
          studentId: userId,
          status: 'held'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$studentEarnings' }
        }
      }
    ]);

    const totalWithdrawals = withdrawals
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);

    const availableBalance = totalEarnings - totalWithdrawals;

    // Get this month and last month earnings
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthEarnings = await Escrow.aggregate([
      {
        $match: {
          studentId: userId,
          status: 'released',
          releaseDate: { $gte: thisMonthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$studentEarnings' }
        }
      }
    ]);

    const lastMonthEarnings = await Escrow.aggregate([
      {
        $match: {
          studentId: userId,
          status: 'released',
          releaseDate: { 
            $gte: lastMonthStart,
            $lte: lastMonthEnd
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$studentEarnings' }
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = [];
    
    // Add recent earnings
    const recentEscrows = await Escrow.find({
      studentId: userId,
      status: 'released'
    })
    .sort({ releaseDate: -1 })
    .limit(5)
    .populate('projectId');

    recentEscrows.forEach(escrow => {
      recentTransactions.push({
        _id: escrow._id,
        type: 'earning',
        amount: escrow.studentEarnings,
        description: `Project: ${escrow.projectId?.title || 'Unknown'}`,
        status: 'completed',
        createdAt: escrow.releaseDate
      });
    });

    // Add recent withdrawals
    const recentWithdrawals = await Withdrawal.find({
      studentId: userId
    })
    .sort({ createdAt: -1 })
    .limit(5);

    recentWithdrawals.forEach(withdrawal => {
      recentTransactions.push({
        _id: withdrawal._id,
        type: 'withdrawal',
        amount: withdrawal.amount,
        description: `Withdrawal via ${withdrawal.method}`,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt
      });
    });

    // Sort by date
    recentTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings,
        availableBalance,
        pendingEarnings: pendingEarnings[0]?.total || 0,
        thisMonthEarnings: thisMonthEarnings[0]?.total || 0,
        lastMonthEarnings: lastMonthEarnings[0]?.total || 0,
        recentTransactions: recentTransactions.slice(0, 10)
      }
    });

  } catch (error: any) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}