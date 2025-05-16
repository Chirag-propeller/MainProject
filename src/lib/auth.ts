import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function getUserFromRequest(req: NextRequest): Promise<TokenPayload> {
  const token = req.cookies.get('token')?.value;

  if (!token) throw new Error('Authentication token missing');

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Invalid Token', error);
    throw new Error('Invalid token');
  }
}
