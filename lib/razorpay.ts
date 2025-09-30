// lib/razorpay.ts
import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials not found in environment variables');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');
  
  return generated_signature === signature;
};

export const calculatePlatformFee = (amount: number): {
  platformFee: number;
  studentEarnings: number;
} => {
  const platformFeePercentage = 0.10; // 10% platform fee
  const platformFee = Math.round(amount * platformFeePercentage);
  const studentEarnings = amount - platformFee;
  
  return { platformFee, studentEarnings };
};