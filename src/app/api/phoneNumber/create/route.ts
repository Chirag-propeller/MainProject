// app/api/agent/create/route.ts
import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Update this if your path is different
import PhoneNumber from '@/model/phoneNumber'; // Make sure this is correct path
import User from '@/model/user/user.model';
import { getUserFromRequest } from '@/lib/auth';


export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    

    const newPhone = await PhoneNumber.create({
      userId :  user.userId,
      ...body,
    });
    await User.findByIdAndUpdate(user.userId, { $push: { phoneNumbers: newPhone._id } });

    return NextResponse.json({ success: true, data: newPhone }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 });
  }
}
