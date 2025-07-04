import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeBaseFileUrl } from "@/lib/azure";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400, headers: corsHeaders });
  }
  try {
    const url = await getKnowledgeBaseFileUrl(filename);
    if (url) {
      return NextResponse.json({ url }, { status: 200, headers: corsHeaders });
    }
    return NextResponse.json({ error: "File not found" }, { status: 404, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // Or specify your frontend domain
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}