import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import createCampaign from '@/model/createCampaign';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();
  
  try {
    const user = await getUserFromRequest(req);
    const Campaign = await createCampaign.find({userId : user.userId}).sort({ createdAt: -1 });
    return NextResponse.json(Campaign, { status: 200 });
  } catch (error) {
    console.error('Error fetching Campaigns:', error);
    return NextResponse.json({ message: 'Failed to fetch Campaigns' }, { status: 500 });
  }
}
