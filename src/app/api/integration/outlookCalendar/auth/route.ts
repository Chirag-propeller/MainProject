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
  const app = await App.findOne({ userId: user.userId, provider: "outlookCalendar" }); 
  if (app) {
    return NextResponse.redirect(`${baseUrl}/dashboard/integration/outlookCalendar`);
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const redirectUri = encodeURIComponent(
    `${baseUrl}/api/integration/outlookCalendar/callback`
  );
  console.log(redirectUri);
  const scope = encodeURIComponent(
    "Calendars.ReadWrite offline_access User.Read"
  );

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query&prompt=consent`;

  return NextResponse.redirect(authUrl);
} 