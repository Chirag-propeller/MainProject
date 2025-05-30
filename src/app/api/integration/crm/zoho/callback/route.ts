import dbConnect from "@/lib/mongodb";
import App from "@/model/integration/app.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    redirect_uri: "https://black-pond-05df21810.6.azurestaticapps.net/api/integration/crm/zoho/callback",
  });

  const res = await fetch("https://accounts.zoho.in/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  // 🔐 TODO: Store access/refresh tokens securely (e.g., MongoDB, Firestore)
  console.log("Zoho Token Response:", data);
  await dbConnect();
  const user = await getUserFromRequest(req);
  const app = await App.create({
    userId: user.userId,
    provider: "zoho",
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  });

  // 🔁 Redirect to dashboard or success page
  return NextResponse.redirect("https://black-pond-05df21810.6.azurestaticapps.net/dashboard/integration?zoho=connected");
}
