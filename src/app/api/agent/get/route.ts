import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/model/agent';

export async function GET() {
  await dbConnect();

  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    return NextResponse.json(agents, { status: 200 });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ message: 'Failed to fetch agents' }, { status: 500 });
  }
}
