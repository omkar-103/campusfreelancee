// models/SavedProject.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISavedProject extends Document {
  userId: string
  projectId: mongoose.Types.ObjectId
  savedAt: Date
  createdAt: Date
  updatedAt: Date
}

const SavedProjectSchema = new Schema<ISavedProject>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
)

// Compound index to prevent duplicate saves by same user
SavedProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true })

const SavedProject: Model<ISavedProject> =
  mongoose.models.SavedProject ||
  mongoose.model<ISavedProject>('SavedProject', SavedProjectSchema)

export default SavedProject
