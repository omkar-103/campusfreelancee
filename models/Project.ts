import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: "INR" | "USD";
  };
  duration: string;
  skills: string[];
  category: string;
  experienceLevel: string;
  projectType: string;
  location: string;
  deadline?: Date;
  clientId: string;
  status: string;
  applicants: string[];
  proposals: number;
  views: number;
  featured: boolean;
  urgent: boolean;
  attachments: { name: string; url: string; size: number }[];
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    budget: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR", enum: ["INR", "USD"] },
    },
    duration: {
      type: String,
      required: true,
      validate: {
        validator: function(value: string) {
          // Accept values like "11 months", "3 weeks", etc.
          return /^(\d+\s*(week|weeks|month|months))$/.test(value);
        },
        message: props => `${props.value} is not a valid duration format!`
      }
    },
    skills: [String],
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX Design",
        "Data Science",
        "Content Writing",
        "Digital Marketing",
        "Graphic Design",
        "Video Editing",
        "Photography",
        "SEO",
        "Social Media",
        "E-commerce",
        "API Development",
        "Database Design",
      ],
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["Entry Level", "Intermediate", "Expert"],
      default: "Intermediate",
    },
    projectType: {
      type: String,
      enum: ["Fixed Price", "Hourly Rate"],
      default: "Fixed Price",
    },
    location: { type: String, default: "Remote" },
    deadline: Date,
    clientId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["active", "in-review", "in-progress", "completed", "cancelled"],
      default: "active",
    },
    applicants: [String],
    proposals: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    attachments: [{ name: String, url: String, size: Number }],
  },
  { timestamps: true }
);

ProjectSchema.index({ clientId: 1, createdAt: -1 });
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ status: 1, createdAt: -1 });
ProjectSchema.index({ "budget.min": 1, "budget.max": 1 });
ProjectSchema.index({ skills: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
