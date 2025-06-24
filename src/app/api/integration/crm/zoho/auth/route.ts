import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID!;
  const baseUrl = process.env.BASE_URL!;
  const redirectUri = encodeURIComponent(
    `${baseUrl}api/integration/crm/zoho/callback`
  );
  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl);
}
