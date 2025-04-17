import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import createCampaign from '@/model/createCampaign';

export async function GET() {
  await dbConnect();

  try {
    const Campaign = await createCampaign.find().sort({ createdAt: -1 });
    return NextResponse.json(Campaign, { status: 200 });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ message: 'Failed to fetch agents' }, { status: 500 });
  }
}
