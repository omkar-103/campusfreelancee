import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  projectId: mongoose.Types.ObjectId;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  coverLetter: string; // keep your naming
  proposedBudget: number; // keep your naming
  estimatedDuration: string;
  portfolio?: string[];
  status: "pending" | "accepted" | "rejected" | "withdrawn" | "hired";
  paid: boolean;
  paymentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentAvatar: {
      type: String,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    proposedBudget: {
      type: Number,
      required: true,
    },
    estimatedDuration: {
      type: String,
      required: true,
    },
    portfolio: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn", "hired"],
      default: "pending",
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ projectId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
