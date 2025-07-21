import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/model/user/user.model';
import { getUserFromRequest } from '@/lib/auth';

// GET: Return the user's pinnedAgents
export async function GET(req: NextRequest) {
  await dbConnect();
  const userData = await getUserFromRequest(req);
  if (!userData || !userData.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user.pinnedAgents || []);
}

// POST: Update the user's pinnedAgents
export async function POST(req: NextRequest) {
  await dbConnect();
  const userData = await getUserFromRequest(req);
  if (!userData || !userData.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { pinnedAgents } = await req.json();
  const user = await User.findOneAndUpdate(
    { email: userData.email },
    { pinnedAgents },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
} 