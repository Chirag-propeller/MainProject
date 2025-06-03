import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/auth";
import App from "@/model/integration/app.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest, res: NextResponse) {
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
  
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"&fields=files(id,name)',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    const data = await response.json();
    console.log(data);
  
    if (!response.ok) {
      return NextResponse.json({ error: data.error });
    }
  
    return NextResponse.json({ files: data.files });
  }
  