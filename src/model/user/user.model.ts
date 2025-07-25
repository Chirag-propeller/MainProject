import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "suspended" | "paid";
export type AuthProvider = "email" | "google" | "github";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
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
  agents: mongoose.Types.ObjectId[];
  phoneNumbers: mongoose.Types.ObjectId[];
  knowledgeBases: mongoose.Types.ObjectId[];
  campaigns: mongoose.Types.ObjectId[];
  otp?: string;
  otpExpiry?: Date;
  credits: mongoose.Types.Decimal128;
  creditsUsed: mongoose.Types.Decimal128;
  callHistoryFields: string[];
  premium: boolean;
  currency:string;
  pinnedAgents?: string[];
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true},
    password: { type: String},
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
    otp: { type: String },
    otpExpiry: { type: Date },
    forgotPasswordTokenExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
    agents: [{ type: Schema.Types.ObjectId, ref: 'Agent' , default: []}],
    campaigns: [{ type: Schema.Types.ObjectId, ref: 'CampaignCall' , default: []}],
    phoneNumbers:  [{ type: Schema.Types.ObjectId, ref: 'PhoneNumber' , default: []}],
    knowledgeBases:  [{ type: Schema.Types.ObjectId, ref: 'PhoneNumber' , default: []}],
    credits: { type: mongoose.Schema.Types.Decimal128, default: 0 },    
    creditsUsed: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    callHistoryFields: { type: [String], default: [] },
    premium: { type: Boolean, default: false },
    currency: {type:String,default:'INR',required:false},
    pinnedAgents: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.isModified('credits')) {
    this.credits = mongoose.Types.Decimal128.fromString(
      parseFloat(this.credits.toString()).toFixed(3)
    );
  }
  if (this.isModified('creditsUsed')) {
    this.creditsUsed = mongoose.Types.Decimal128.fromString(
      parseFloat(this.creditsUsed.toString()).toFixed(3)
    );
  }
  next();
});

// Prevent model overwrite in dev (Next.js hot-reloading)
const User: Model<UserDocument> = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
