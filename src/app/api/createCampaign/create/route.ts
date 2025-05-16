// app/api/agent/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Update this if your path is different
import createCampaign from '@/model/createCampaign';
import { randomUUID } from 'crypto';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/model/user/user.model';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();
    const user = await getUserFromRequest(req);
    const newCampaign = await createCampaign.create({
      userId:  user.userId,
      campaignCallId: body.campaignCallId || randomUUID(),
      ...body,
    });
    await User.findByIdAndUpdate(user.userId, { $push: { campigns: newCampaign._id } });

    return NextResponse.json({ success: true, data: newCampaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating Campaign:', error);
    return NextResponse.json({ success: false, error: 'Failed to create Campaign' }, { status: 500 });
  }
}
