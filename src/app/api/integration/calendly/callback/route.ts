import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import App from "@/model/integration/app.model";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BASE_URL!;
  
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingCode`);

    console.log("Calendly token exchange starting...");
    console.log("Using CLIENT_ID:", process.env.CALENDLY_CLIENT_ID);
    console.log("Redirect URI:", `${baseUrl}/api/integration/calendly/callback`);

    const tokenRes = await fetch("https://auth.calendly.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.CALENDLY_CLIENT_ID!,
        client_secret: process.env.CALENDLY_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/integration/calendly/callback`,
        grant_type: "authorization_code",
      }),
    });

    const data = await tokenRes.json();
    console.log("Calendly token response:", data);
    
    if (!data.access_token) {
      console.error("Calendly token exchange failed:", data);
      return NextResponse.redirect(`${baseUrl}/dashboard?error=TokenFailed`);
    }

    // Fetch user details from Calendly
    let userEmail = "";
    try {
      const userInfoRes = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const userInfo = await userInfoRes.json();
      userEmail = userInfo.resource?.email || "";
    } catch (error) {
      console.error("Failed to fetch user email:", error);
    }

    await dbConnect();
    const user = await getUserFromRequest(req);

    await App.create({
      userId: user.userId,
      name: "Calendly",
      provider: "calendly",
      integrationType: "calendar",
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in * 1000 + Date.now(),
      scope: "default",
      userEmail: userEmail,
    });

    return NextResponse.redirect(`${baseUrl}/dashboard/integration/calendly`);
  } catch (error) {
    console.error("Calendly callback error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard?error=CallbackFailed`);
  }
} 