import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/model/user/user.model";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, otp } = body;
    console.log(body);
    if (!email || !otp) {
      return Response.json({ message: "Missing email or OTP." }, { status: 400 });
    }

    const user = await User.findOne({ email});

    if (!user) {
      return Response.json({ message: "User not found." }, { status: 404 });
    }

    if (user.otp !== otp) {
      return Response.json({ message: "Invalid OTP." }, { status: 400 });
    }

    if (!user.otpExpiry || new Date(user.otpExpiry).getTime() < Date.now()) {
        return Response.json({ message: "OTP expired. Please request a new one." }, { status: 400 });
      }

    user.otpExpiry = undefined;
    user.isVerified = true;
    user.otp = undefined; // or null if you prefer
    await user.save();

    return Response.json({ message: "Email verified successfully!" });
  } catch (error: any) {
    console.error(error);
    return Response.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
