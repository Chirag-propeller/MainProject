import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import App from '@/model/integration/app.model';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.redirect("/login");
  }
  const userId = new mongoose.Types.ObjectId(user.userId);
  const app = await App.findOne({ userId, provider: "googleSheet" });
  if (!app){
    return NextResponse.json({ error: 'App not found' }, { status: 404 });
  }
  if (Date.now() > app.expiresIn){
    const params = new URLSearchParams();
    params.append('client_id', process.env.GOOGLE_SHEETS_CLIENT_ID!);
    params.append('client_secret', process.env.GOOGLE_SHEETS_CLIENT_SECRET!);
    params.append('refresh_token', app.refreshToken);
    params.append('grant_type', 'refresh_token');
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
  
    const data = await response.json();
    app.accessToken = data.access_token;
    app.expiresIn = data.expires_in * 1000 + Date.now();
    await app.save();
  }
    // const { accessToken } = req.body;
    const accessToken = app.accessToken;
  
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' });
    }
    const { spreadsheetId, range } = await req.json();

  if (!accessToken || !spreadsheetId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range || 'Sheet1!A:Z')}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: data.error }), { status: 500 });
  }

  return new Response(JSON.stringify({ values: data.values }), { status: 200 });
}
