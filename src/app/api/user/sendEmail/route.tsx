import { Resend } from 'resend';
import * as React from 'react';
import PropalVerifyEmail from '../../../../../emails/verificationEmail';
import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/model/user/user.model';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    console.log("got in API/user/sendEmail");
    const body = await req.json();
    const {name, email, emailChangeVerification} = body;
    
    const otp = Array.from({ length: 6 }, () => randomInt(0, 10)).join('');
    const otpExpiry = new Date(Date.now() + 4* 60 * 60 * 1000);

    let user;
    
    if (emailChangeVerification) {
      // For email change verification, get user from auth context
      const { getUserFromRequest } = await import('@/lib/auth');
      try {
        const userData = await getUserFromRequest(req);
        user = await User.findById(userData.userId);
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
      } catch (authError) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    } else {
      // For signup verification, find user by email
      user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    const { data, error } = await resend.emails.send({
      from: 'Propal AI <noreply@propalai.com>',
      to: [email], // For email change verification, this is the new email
      subject: emailChangeVerification ? "Email Change Verification - Propal AI" : "Email Verification - Propal AI",
      react: <PropalVerifyEmail name={name || user.name} otp={otp} />
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error:any) {
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}
