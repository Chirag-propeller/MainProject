import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/auth";
import App from "@/model/integration/app.model";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.BASE_URL!;
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.redirect("/login");
  }
  const app = await App.findOne({ userId: user.userId, provider: "calendly" }); 
  if (app) {
    return NextResponse.redirect(`${baseUrl}/dashboard/integration/calendly`);
  }

  const clientId = process.env.CALENDLY_CLIENT_ID!;
  const redirectUri = encodeURIComponent(
    `${baseUrl}/api/integration/calendly/callback`
  );
  console.log(redirectUri);
  const scope = encodeURIComponent("default");

  const authUrl = `https://auth.calendly.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  return NextResponse.redirect(authUrl);
} 