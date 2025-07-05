import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeBaseFileUrl } from "@/lib/azure";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400});
  }
  try {
    const url = await getKnowledgeBaseFileUrl(filename);
    if (url) {
      return NextResponse.json({ url }, { status: 200});
    }
    return NextResponse.json({ error: "File not found" }, { status: 404});
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500});
  }
}