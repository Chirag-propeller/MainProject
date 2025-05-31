// /app/api/integration/google-sheets/auth/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.BASE_URL!;
  const redirectUri = encodeURIComponent(
    `${baseUrl}/api/integration/googleSheet/callback`
  );
  console.log(redirectUri);
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly"
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_SHEETS_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
