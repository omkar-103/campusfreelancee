// models/Proposal.ts
import mongoose from 'mongoose'

export interface IProposal extends mongoose.Document {
  projectId: mongoose.Types.ObjectId
  freelancerId: mongoose.Types.ObjectId
  freelancerName: string
  coverLetter: string
  proposedBudget: number
  proposedDuration: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

const ProposalSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancerName: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  proposedBudget: {
    type: Number,
    required: true,
  },
  proposedDuration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  attachments: [String],
}, {
  timestamps: true,
})

export default mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', ProposalSchema)