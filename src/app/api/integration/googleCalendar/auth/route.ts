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
  const app = await App.findOne({ userId: user.userId, provider: "googleCalendar" }); 
  if (app) {
    return NextResponse.redirect(`${baseUrl}/dashboard/integration/googleCalendar`);
  }

  const redirectUri = encodeURIComponent(
    `${baseUrl}/api/integration/googleCalendar/callback`
  );
  console.log(redirectUri);
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email"
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_SHEETS_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
} 