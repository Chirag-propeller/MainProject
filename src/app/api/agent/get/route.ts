import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/model/agent';
import { getUserFromRequest } from '@/lib/auth';


export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const agents = await Agent.find({ userId: user.userId }).sort({ createdAt: -1 });
    return NextResponse.json(agents, { status: 200 });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ message: 'Failed to fetch agents' }, { status: 500 });
  }
}
