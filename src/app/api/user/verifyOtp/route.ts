import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, otp, emailChangeVerification } = body;
    console.log(body);
    
    if (!otp) {
      return Response.json({ message: "Missing OTP." }, { status: 400 });
    }

    let user;
    
    if (emailChangeVerification) {
      // For email change verification, get user from auth context
      try {
        const userData = await getUserFromRequest(req);
        user = await User.findById(userData.userId);
        if (!user) {
          return Response.json({ message: "User not found." }, { status: 404 });
        }
      } catch (authError) {
        return Response.json({ message: "Authentication required." }, { status: 401 });
      }
    } else {
      // For signup verification, find user by email
      if (!email) {
        return Response.json({ message: "Missing email." }, { status: 400 });
      }
      user = await User.findOne({ email});
      if (!user) {
        return Response.json({ message: "User not found." }, { status: 404 });
      }
    }

    if (user.otp !== otp) {
      return Response.json({ message: "Invalid OTP." }, { status: 400 });
    }

    if (!user.otpExpiry || new Date(user.otpExpiry).getTime() < Date.now()) {
        return Response.json({ message: "OTP expired. Please request a new one." }, { status: 400 });
      }

    user.otpExpiry = undefined;
    user.otp = undefined;
    
    if (!emailChangeVerification) {
      // For signup verification, mark user as verified
      user.isVerified = true;
    }
    // For email change verification, we don't update isVerified
    // The email update will happen in the update profile API
    
    await user.save();

    return Response.json({ 
      message: emailChangeVerification ? "Email change verified successfully!" : "Email verified successfully!" 
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
