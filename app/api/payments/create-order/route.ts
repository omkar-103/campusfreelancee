// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { razorpay, calculatePlatformFee } from "@/lib/razorpay";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Project from "@/models/Project";
import Application from "@/models/Application";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      amount, 
      projectId, 
      applicationId,
      type = 'project_payment',
      clientId,
      studentId,
      metadata = {}
    } = body;

    // Validate the request
    if (!amount || !clientId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // For project payments, verify the application
    if (type === 'project_payment' && applicationId) {
      const application = await Application.findById(applicationId);
      if (!application || application.status !== 'accepted') {
        return NextResponse.json(
          { success: false, message: "Invalid or non-accepted application" },
          { status: 400 }
        );
      }
    }

    // Calculate platform fee
    const { platformFee, studentEarnings } = calculatePlatformFee(amount);

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        type,
        projectId: projectId || '',
        clientId,
        studentId: studentId || '',
        platformFee: platformFee.toString(),
        studentEarnings: studentEarnings.toString(),
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      razorpayOrderId: order.id,
      amount,
      type,
      projectId,
      clientId,
      studentId,
      platformFee,
      studentEarnings,
      metadata,
      status: 'created'
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      }
    });

  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}