// app/api/payments/verify/route.ts
import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(request: Request) {
  await connectDB();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing required payment verification data' },
        { status: 400 }
      );
    }

    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Find payment by razorpayOrderId
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: payment._id,
      payment,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during payment verification' },
      { status: 500 }
    );
  }
}
