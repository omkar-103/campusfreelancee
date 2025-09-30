// /models/User.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  userType: "student" | "client";
  avatar?: string;
  phone?: string;
  company?: string;
  website?: string;
  companySize?: string;
  college?: string;
  course?: string;
  year?: string;
  skills?: string[];
  portfolio?: string;
  github?: string;
  linkedin?: string;
  hourlyRate?: number;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  rating?: number;
  totalReviews?: number;
  completedProjects?: number;
  totalEarnings?: number;
  activeProjects?: number;
  profileViews?: number;
  verified?: boolean;
  isActive?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    userType: { type: String, required: true, enum: ["client", "student"], index: true },
    avatar: String,
    phone: String,
    company: String,
    website: String,
    companySize: { type: String, enum: ["1-10", "11-50", "51-200", "201-1000", "1000+"] },
    college: String,
    course: String,
    year: { type: String, enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"] },
    skills: [String],
    portfolio: String,
    github: String,
    linkedin: String,
    hourlyRate: { type: Number, min: 0 },
    bio: { type: String, maxlength: 500 },
    location: {
      city: String,
      state: String,
      country: { type: String, default: "India" },
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    activeProjects: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ userType: 1, isActive: 1 });
UserSchema.index({ skills: 1, userType: 1 });
UserSchema.index({ rating: -1, totalReviews: -1 });
UserSchema.index({ location: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
