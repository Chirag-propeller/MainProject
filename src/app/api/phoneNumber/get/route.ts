import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PhoneNumber from '@/model/phoneNumber';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req)
    const phoneNumber = await PhoneNumber.find({userId : user.userId}).sort({ createdAt: -1 });
    return NextResponse.json(phoneNumber, { status: 200 });
  } catch (error) {
    console.error('Error fetching phoneNumber:', error);
    return NextResponse.json({ message: 'Failed to fetch phoneNumber' }, { status: 500 });
  }
}
