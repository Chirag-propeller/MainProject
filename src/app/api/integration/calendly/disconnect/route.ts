import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import App from '@/model/integration/app.model';
import mongoose from 'mongoose';

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = new mongoose.Types.ObjectId(user.userId);
    const app = await App.findOne({ userId, provider: "calendly" });
    
    if (!app) {
      return NextResponse.json({ error: 'Calendly integration not found' }, { status: 404 });
    }

    // Delete the integration
    await App.deleteOne({ _id: app._id });
    
    console.log(`Calendly integration disconnected for user: ${user.userId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Calendly disconnected successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error("Error disconnecting Calendly:", error);
    return NextResponse.json({ 
      error: 'Failed to disconnect Calendly' 
    }, { status: 500 });
  }
} 