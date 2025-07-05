import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VoiceAgentApi from '@/model/api';
import User from '@/model/user/user.model';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();   // expecting { id: 'apiId' }
    if (!id)
      return NextResponse.json(
        { success: false, error: 'API ID is required' },
        { status: 400 }
      );

    await dbConnect();
    const user = await getUserFromRequest(req);

    const api = await VoiceAgentApi.findById(id);
    if (!api)
      return NextResponse.json(
        { success: false, error: 'API not found' },
        { status: 404 }
      );

    if (api.userId.toString() !== user.userId)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );

    await VoiceAgentApi.findByIdAndDelete(id);
    await User.findByIdAndUpdate(user.userId, {
      $pull: { voiceAgentApis: id },    // change field name if different
    });

    return NextResponse.json(
      { success: true, message: 'API deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting API:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete API' },
      { status: 500 }
    );
  }
}
