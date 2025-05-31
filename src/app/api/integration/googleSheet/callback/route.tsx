// /app/api/integration/google-sheets/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import App from "@/model/integration/app.model";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BASE_URL!;
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect("/dashboard?error=MissingCode");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_SHEETS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_SHEETS_CLIENT_SECRET!,
      redirect_uri: `${baseUrl}/api/integration/googleSheet/callback`,
      grant_type: "authorization_code",
    }),
  });

  const data = await tokenRes.json();
  if (!data.access_token) {
    return NextResponse.redirect("/dashboard?error=TokenFailed");
  }

  await dbConnect();
  const user = await getUserFromRequest(req);

  await App.create({
    userId: user.userId,
    name: "google",
    integration_type: "sheets",
    token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
  });

  return NextResponse.redirect("/dashboard/integration?googleSheets=connected");
}
