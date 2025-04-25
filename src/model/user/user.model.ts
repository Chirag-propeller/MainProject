import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "suspended" | "paid";
export type AuthProvider = "email" | "google" | "github";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean,
  profilePicture?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  authProvider: AuthProvider;
  oauthProviderId?: string;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  language?: string;
  timezone?: string;
  emailUpdates: boolean;
  productNews: boolean;
  usageAlerts: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;

}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    phone: { type: String },
    isVerified: { type: Boolean, default: false},
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: { type: String, enum: ["active", "suspended", "paid"], default: "active" },
    authProvider: { type: String, default: "email" },
    oauthProviderId: { type: String, index: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "IST" },
    emailUpdates: { type: Boolean, default: true },
    productNews: { type: Boolean, default: true },
    usageAlerts: { type: Boolean, default: true },
    forgotPasswordToken: { type: String },
    forgotPasswordTokenExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },

  },
  { timestamps: true }
);

// Prevent model overwrite in dev (Next.js hot-reloading)
const User: Model<UserDocument> = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
