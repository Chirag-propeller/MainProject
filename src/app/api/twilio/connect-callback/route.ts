// pages/api/twilio/connect-callback.ts

import { getUserFromRequest } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Twilio from '@/model/user/twilio.model';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const AccountSid = searchParams.get('AccountSid');
    const user = await getUserFromRequest(request);
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
  