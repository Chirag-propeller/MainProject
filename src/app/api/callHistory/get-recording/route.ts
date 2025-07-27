import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import { getCallRecordingUrl } from "@/lib/azure";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const user = await getUserFromRequest(req);
    const url = await req.json();
    const uri = url.url.toString();
    const recArray = uri.split("/");
    const container = recArray[3];
    let filename = recArray[4];
    filename = filename + ".ogg";
    if (!filename) {
      return NextResponse.json(
        { error: "Room Name is required" },
        { status: 400 }
      );
    }
    let sasUrl = await getCallRecordingUrl(container,filename);
    // sasUrl = "https://storage4mongodbdatabase.blob.core.windows.net/recordings/my_first_room.mp3.ogg"

    if (!sasUrl) {
    return NextResponse.json({ error: "Recording file not found in storage" }, { status: 404 });
    }

    return NextResponse.json({ url: sasUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
