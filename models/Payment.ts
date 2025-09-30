// models/Payment.ts
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'pending', 'completed', 'failed', 'refunded'],
    default: 'created'
  },
  type: {
    type: String,
    enum: ['project_payment', 'milestone_payment', 'profile_boost', 'featured_listing', 'membership'],
    required: true
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
  clientId: { type: String, required: true },
  studentId: { type: String },
  platformFee: { type: Number, default: 0 },
  studentEarnings: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);