// /app/api/integration/google-sheets/auth/route.ts
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
  const app = await App.findOne({ user: user.userId }); 
  if (app) {
    return NextResponse.json({ error: "Client already exists" }, { status: 307 });
  }

  const redirectUri = encodeURIComponent(
    `${baseUrl}/api/integration/gmail/callback`
  );
  console.log(redirectUri);
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/gmail.send"
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_SHEETS_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
