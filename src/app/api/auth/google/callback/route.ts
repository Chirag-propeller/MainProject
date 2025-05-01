import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "@/model/user/user.model";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect("/login?error=Missing Google code");

  try {
    // 1. Exchange code for tokens
    const { data: tokenData } = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,

        // redirect_uri: "https://black-pond-05df21810.6.azurestaticapps.net/api/auth/google/callback"

        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, id_token } = tokenData;

    // 2. Get user info
    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { email, name, sub: googleId } = googleUser;

    // 3. Check if user exists or create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        isVerified: true,
        authProvider: "google",
        emailVerified: true,
        status: "active",
        role: "user",
        oauthProviderId: googleId,
      });
    }
    const userTokenData = {
      userId : user._id,
      email: user.email
  }
    // 4. Generate your own token and set cookie
    const token = jwt.sign(userTokenData, process.env.TOKEN_SECRET!, {expiresIn: "3d"});

    // const response = NextResponse.redirect(new URL("/dashboard", req.url));
    const response = NextResponse.redirect(`${process.env.GOOGLE_REDIRECT_URI}/dashboard`);

    response.cookies.set("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth Error:", err);
    return NextResponse.redirect(new URL("/login?error=Google Auth Failed", req.url));

    // return NextResponse.redirect("/login?error=Google Auth Failed");
  }
}
