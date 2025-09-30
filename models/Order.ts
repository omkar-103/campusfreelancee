// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: string; // Firebase UID
  projectId?: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'paid' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'pending', 'paid', 'failed'],
    default: 'created'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paidAt: Date,
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;