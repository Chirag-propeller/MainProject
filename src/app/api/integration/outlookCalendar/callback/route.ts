import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import App from "@/model/integration/app.model";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BASE_URL!;
  
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingCode`);

    console.log("Outlook Calendar token exchange starting...");
    console.log("Using CLIENT_ID:", process.env.MICROSOFT_CLIENT_ID);
    console.log("Redirect URI:", `${baseUrl}/api/integration/outlookCalendar/callback`);

    const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/integration/outlookCalendar/callback`,
        grant_type: "authorization_code",
      }),
    });

    const data = await tokenRes.json();
    console.log("Outlook Calendar token response:", data);
    
    if (!data.access_token) {
      console.error("Outlook Calendar token exchange failed:", data);
      return NextResponse.redirect(`${baseUrl}/dashboard?error=TokenFailed`);
    }

    // Fetch user email from Microsoft Graph
    let userEmail = "";
    try {
      const userInfoRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const userInfo = await userInfoRes.json();
      userEmail = userInfo.mail || userInfo.userPrincipalName || "";
    } catch (error) {
      console.error("Failed to fetch user email:", error);
    }

    await dbConnect();
    const user = await getUserFromRequest(req);

    await App.create({
      userId: user.userId,
      name: "Outlook Calendar",
      provider: "outlookCalendar",
      integrationType: "calendar",
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in * 1000 + Date.now(),
      scope: "Calendars.ReadWrite",
      userEmail: userEmail,
    });

    return NextResponse.redirect(`${baseUrl}/dashboard/integration/outlookCalendar`);
  } catch (error) {
    console.error("Outlook Calendar callback error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard?error=CallbackFailed`);
  }
} 