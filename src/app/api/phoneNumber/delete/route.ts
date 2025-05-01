// app/api/phoneNumber/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PhoneNumber from '@/model/phoneNumber';
import User from '@/model/user/user.model';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json(); // expecting: { phoneNumber: '1234567890' }

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    await dbConnect();
    const user = await getUserFromRequest(req);

    // Find phone number
    const phone = await PhoneNumber.findOne({ phoneNumber });

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number not found' }, { status: 404 });
    }

    // Ensure user owns this phone number
    if (phone.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Delete phone number
    await PhoneNumber.findByIdAndDelete(phone._id);

    // Remove reference from User
    await User.findByIdAndUpdate(user.userId, {
      $pull: { phoneNumbers: phone._id }
    });

    return NextResponse.json({ success: true, message: 'Phone number deleted' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting phone number:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete phone number' }, { status: 500 });
  }
}
