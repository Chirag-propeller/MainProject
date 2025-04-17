// app/api/agent/create/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Update this if your path is different
import PhoneNumber from '@/model/phoneNumber'; // Make sure this is correct path

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const newAgent = await PhoneNumber.create({
      ...body,
    });

    return NextResponse.json({ success: true, data: newAgent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 });
  }
}
