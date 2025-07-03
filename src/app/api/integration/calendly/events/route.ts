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
  const app = await App.findOne({ userId, provider: "calendly" });
  if (!app) {
    return NextResponse.json({ error: 'Calendly not connected' }, { status: 404 });
  }
  
  // Check if token needs refresh
  if (Date.now() > app.expiresIn && app.refreshToken) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.CALENDLY_CLIENT_ID!);
    params.append('client_secret', process.env.CALENDLY_CLIENT_SECRET!);
    params.append('refresh_token', app.refreshToken);
    params.append('grant_type', 'refresh_token');
    
    const response = await fetch('https://auth.calendly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
  
    const data = await response.json();
    if (data.access_token) {
      app.accessToken = data.access_token;
      app.expiresIn = data.expires_in * 1000 + Date.now();
      await app.save();
    }
  }

  const accessToken = app.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    // First get user info to get the organization URI
    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const userData = await userResponse.json();
      console.error("Failed to get user info:", userData);
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 500 });
    }

    const user = await userResponse.json();
    const userUri = user.resource.uri;

    // Now fetch scheduled events for this user
    const response = await fetch(
      `https://api.calendly.com/scheduled_events?user=${userUri}&count=10&sort=start_time:asc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("Calendly API Response:", data);

    if (!response.ok) {
      console.error("Calendly API Error:", data);
      return NextResponse.json({ error: data.message || 'Failed to fetch events' }, { status: response.status });
    }

    return NextResponse.json({ events: data.collection || [] });
  } catch (error) {
    console.error("Error fetching Calendly events:", error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 