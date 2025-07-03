import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import App from '@/model/integration/app.model';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.redirect("/login");
  }
  
  const userId = new mongoose.Types.ObjectId(user.userId);
  const app = await App.findOne({ userId, provider: "outlookCalendar" });
  if (!app) {
    return NextResponse.json({ error: 'Outlook Calendar not connected' }, { status: 404 });
  }
  
  // Check if token needs refresh
  if (Date.now() > app.expiresIn) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.MICROSOFT_CLIENT_ID!);
    params.append('client_secret', process.env.MICROSOFT_CLIENT_SECRET!);
    params.append('refresh_token', app.refreshToken);
    params.append('grant_type', 'refresh_token');
    params.append('scope', 'Calendars.ReadWrite offline_access');
    
    const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
  
    const data = await response.json();
    app.accessToken = data.access_token;
    app.expiresIn = data.expires_in * 1000 + Date.now();
    await app.save();
  }

  const accessToken = app.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/me/events?$top=10&$orderby=start/dateTime',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ events: data.value });
  } catch (error) {
    console.error("Error fetching Outlook Calendar events:", error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 