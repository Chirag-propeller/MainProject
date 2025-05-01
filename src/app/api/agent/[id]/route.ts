import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/model/agent';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request);
  await dbConnect();
  const { id } = await params;
  
  try {
    const agent = await Agent.findOne({ _id: id, userId: user.userId  });
    if (!agent) {
      return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ message: 'Failed to fetch agent' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();
  
  try {
    const user = await getUserFromRequest(request);
    const updatedAgent = await Agent.findOneAndUpdate(
      { _id: id ,  userId: user.userId },
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedAgent) {
      return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ message: 'Failed to update agent' }, { status: 500 });
  }
}

