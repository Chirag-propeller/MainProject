import dbConnect from "@/lib/mongodb";
import { resend } from "@/lib/resend";
import User from "@/model/user/user.model";
import { NextRequest, NextResponse } from "next/server";
import PasswordResetOTPEmail from "../../../../../emails/forgetPasswordEmail";

function generateOTP(): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let otp = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters.charAt(randomIndex);
    }
  
    return otp;
}

export async function POST(req: NextRequest){
    await dbConnect();

    try {
        const body = await req.json();
        let {email} = body;
        email = email.toLowerCase();
        const user = await User.findOne({email});
        if(!user) {
            return NextResponse.json({error: "User Dont exist", status: 400});
        }
        const userName = user.name;
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        const otp = generateOTP();
        user.forgotPasswordToken = otp;
        user.forgotPasswordTokenExpiry = expiry;
        await user.save();
        // PasswordResetOTPEmail
        
        const { data, error } = await resend.emails.send({
            from: 'Propal AI <noreply@propalai.com>',
            to: [email], // Replace with the recipient's email address dynamically
            subject: "Email Verification - Propal AI",
            react: <PasswordResetOTPEmail name={userName} otp={otp} />
          });
          if (error) {
            return Response.json({ error }, { status: 500 });
          }
      
          return Response.json({ data });
        

    } catch (error:any) {
      return Response.json({ error: error.message || error }, { status: 500 });
    }

}
