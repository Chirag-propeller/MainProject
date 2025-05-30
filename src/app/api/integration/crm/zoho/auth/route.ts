import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID!;
  const redirectUri = encodeURIComponent(
    "https://black-pond-05df21810.6.azurestaticapps.net/api/integration/crm/zoho/callback"
  );

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl);
}
