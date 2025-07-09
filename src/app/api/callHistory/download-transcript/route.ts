import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import OutBoundCall from "@/model/call/outBoundCall";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const callId = searchParams.get("callId");
    
    if (!callId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user.userId);

    // Find the call by ID and ensure it belongs to the user
    const call = await OutBoundCall.findOne({
      _id: callId,
      $or: [
        { user_id: userId },
        { user_id: user.userId }
      ]
    });

    if (!call) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }

    if (!call.call_transcript) {
      return NextResponse.json(
        { error: "No transcript available for this call" },
        { status: 404 }
      );
    }

    // Format the transcript for download
    let transcriptText = `Call Transcript\n`;
    transcriptText += `Call ID: ${call._id}\n`;
    transcriptText += `Date: ${call.started_at}\n`;
    transcriptText += `Phone Number: ${call.phonenumber}\n`;
    transcriptText += `Status: ${call.call_analysis?.STATUS || 'Unknown'}\n`;
    transcriptText += `Duration: ${call.call_duration_in_sec ? `${Math.floor(call.call_duration_in_sec / 60)}m ${call.call_duration_in_sec % 60}s` : 'Unknown'}\n\n`;
    transcriptText += `Conversation:\n`;
    transcriptText += `==========================================\n\n`;

    if (call.call_transcript.items && Array.isArray(call.call_transcript.items)) {
      call.call_transcript.items.forEach((item: any, index: number) => {
        if (!item.content?.length) return;
        
        const role = item.role === 'user' ? 'User' : 'Agent';
        const content = Array.isArray(item.content) ? item.content.join(' ') : item.content;
        
        transcriptText += `${role}:\n${content}\n\n`;
      });
    } else {
      transcriptText += "No conversation data available.\n";
    }

    // Create response with transcript as text file
    const response = new NextResponse(transcriptText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="call_transcript_${callId}.txt"`,
      },
    });

    return response;

  } catch (error: any) {
    console.error("Error downloading transcript:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
} 