// models/Withdrawal.ts
import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['bank_transfer', 'upi'],
    required: true
  },
  accountDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    accountHolderName: { type: String }
  },
  processedAt: { type: Date },
  razorpayTransferId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);