// app/api/agent/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/model/agent';
import User from '@/model/user/user.model';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json(); // expecting { id: 'agentId' }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Agent ID is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await getUserFromRequest(req);

    const agent = await Agent.findById(id);

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    if (agent.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await Agent.findByIdAndDelete(id);
    await User.findByIdAndUpdate(user.userId, { $pull: { agents: id } });

    return NextResponse.json({ success: true, message: 'Agent deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete agent' }, { status: 500 });
  }
}
