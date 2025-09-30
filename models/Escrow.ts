// models/Escrow.ts
import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: String, required: true },
  studentId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  studentEarnings: { type: Number, required: true },
  status: {
    type: String,
    enum: ['held', 'released', 'disputed', 'refunded'],
    default: 'held'
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  releaseDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Escrow || mongoose.model('Escrow', escrowSchema);