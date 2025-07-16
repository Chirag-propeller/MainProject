import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VoiceAgentApi from '@/model/api';
import { getUserFromRequest } from '@/lib/auth';


export async function GET(req: NextRequest) {
  // console.log(req);
  await dbConnect();
  const user = await getUserFromRequest(req);

  try {
    const apis = await VoiceAgentApi.find({ userId: user.userId }).sort({ createdAt: -1 });
    return NextResponse.json(apis);
  } catch (err) {
    console.error('Error fetching APIs:', err);
    return NextResponse.json(
      { message: 'Failed to fetch APIs' },
      { status: 500 }
    );
  }
} 