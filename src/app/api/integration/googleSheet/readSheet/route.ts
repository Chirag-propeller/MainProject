import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import App from '@/model/integration/app.model';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = new mongoose.Types.ObjectId(user.userId);
    const app = await App.findOne({ userId, provider: "googleSheet" });
    if (!app){
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }
    
    if (Date.now() > app.expiresIn){
      try {
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
      
        if (!response.ok) {
          console.error('Token refresh failed:', response.status, response.statusText);
          return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
        }
        
        const data = await response.json();
        if (!data.access_token) {
          console.error('No access token in refresh response:', data);
          return NextResponse.json({ error: 'Invalid token response' }, { status: 401 });
        }
        
        app.accessToken = data.access_token;
        app.expiresIn = data.expires_in * 1000 + Date.now();
        await app.save();
      } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json({ error: 'Token refresh error' }, { status: 500 });
      }
    }
    
    const accessToken = app.accessToken;
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }
    
    let { spreadsheetId, range } = await req.json();

    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Missing spreadsheetId' }, { status: 400 });
    }

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range || 'Sheet1!A:Z')}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.error('Google Sheets API error:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('Google Sheets API error response:', errorText);
      
      // Handle specific Google API errors
      if (res.status === 401) {
        return NextResponse.json({ error: 'Google API authentication failed' }, { status: 401 });
      } else if (res.status === 403) {
        return NextResponse.json({ error: 'Google API access denied' }, { status: 403 });
      } else if (res.status === 404) {
        return NextResponse.json({ error: 'Spreadsheet not found' }, { status: 404 });
      } else {
        return NextResponse.json({ error: 'Google API request failed' }, { status: 500 });
      }
    }

    const data = await res.json();
    console.log('Google Sheets API response:', data);

    if (!data.values) {
      console.error('No values property in Google API response:', data);
      return NextResponse.json({ error: 'Invalid Google API response' }, { status: 500 });
    }

    return NextResponse.json({ values: data.values });
  } catch (error) {
    console.error('Unexpected error in readSheet API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
