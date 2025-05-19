// pages/api/twilio/connect-callback.ts

import { getUserFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Twilio from '@/model/user/twilio.model';

export default async function handler(req: NextRequest) {
    await dbConnect();
    const { AccountSid } = await req.json();
    const user = await getUserFromRequest(req);
    const twilio = await Twilio.create({
        accountSid: AccountSid,
        userId: user.userId,
    });
    // Store AccountSid with user session
    // await prisma.user.update({
    //   where: { id: session.user.id },
    //   data: { twilioAccountSid: AccountSid }
    // });
  
    return NextResponse.redirect('/dashboard');
  }
  