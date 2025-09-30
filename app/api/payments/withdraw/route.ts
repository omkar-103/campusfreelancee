// app/api/payments/withdraw/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { studentId, amount, method, accountDetails } = body;

    // Validate user balance
    const user = await User.findById(studentId);
    if (!user || user.availableBalance < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      studentId,
      amount,
      method,
      accountDetails,
      status: 'pending'
    });

    // Update user balance
    await User.findByIdAndUpdate(studentId, {
      $inc: { availableBalance: -amount }
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted",
      data: withdrawal
    });

  } catch (error: any) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}