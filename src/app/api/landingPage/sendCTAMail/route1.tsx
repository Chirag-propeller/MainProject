import { Resend } from 'resend';
import * as React from 'react';
// import PropalVerifyEmail from '../../../../../emails/verificationEmail';
import PropalVerifyEmail from '../../../../../emails/CTAEmail';
import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/model/user/user.model';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    // Dummy data for name and OTP, you can fetch from request body or generate dynamically
    console.log("got in API/user/sendEmail");
    const body = await req.json();
    const {email} = body;
    
    const otp = Array.from({ length: 6 }, () => randomInt(0, 10)).join('');
    const otpExpiry = new Date(Date.now() + 4* 60 * 60 * 1000);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    const { data, error } = await resend.emails.send({
      from: 'Propal AI <noreply@propalai.com>',
      to: [email], // Replace with the recipient's email address dynamically
      subject: "Email Verification - Propal AI",
      react: <PropalVerifyEmail  />
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error:any) {
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}
