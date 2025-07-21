// app/api/livekit/workflow/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';

import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { v4 as uuidv4 } from 'uuid';

// Environment variables
const livekitHost = process.env.LIVEKIT_URL || process.env.LIVEKIT_HOST || 'http://localhost:7880';
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

// Helper function to list existing room names
async function getExistingRoomNames(roomService: RoomServiceClient) {
  try {
    const rooms = await roomService.listRooms();
    return rooms.map(room => room.name);
  } catch (error: any) {
    console.error("Error fetching LiveKit rooms:", error);
    throw new Error(`Failed to list LiveKit rooms: ${error.message}`);
  }
}

// Helper function to generate a unique room name
async function generateUniqueRoomName(roomService: RoomServiceClient) {
  let name;
  let existingNames;
  try {
    existingNames = await getExistingRoomNames(roomService);
  } catch (error: any) {
    console.error("Cannot generate unique room name because listing rooms failed:", error);
    throw error;
  }

  do {
    name = `workflow-room-${uuidv4()}`;
  } while (existingNames.includes(name));
  return name;
}

export async function POST(request: NextRequest) {
  if (!apiKey || !apiSecret || !livekitHost) {
    console.error("LiveKit API key, secret, or URL not configured.");
    return NextResponse.json(
      { error: "Server configuration error: LiveKit credentials or URL missing." },
      { status: 500 }
    );
  }

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error: any) {
    console.warn("Failed to parse JSON body or body not provided as JSON:", error.message);
    return NextResponse.json(
      { error: "Invalid or missing JSON body. A JSON body (even if empty, e.g., {}) is expected for metadata." },
      { status: 400 }
    );
  }

  const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

  try {
    const roomName = await generateUniqueRoomName(roomService);
    // await roomService.createRoom({
    //   name: roomName,
    //   // Add agent configuration here
    //   agents: [
    //     {
    //       agentName: 'workflow', // Matches your backend agent_name
    //       metadata: JSON.stringify({ some: 'optional-metadata' }) // Optional, can include data for the agent
    //     }
    //   ],
    //   // Other room options like emptyTimeout, maxParticipants, etc.
    //   emptyTimeout: 300, // Example: 5 minutes
    //   maxParticipants: 10
    // });
    const participantIdentity = roomName;
    const participantDisplayName = roomName;

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantDisplayName,
    });

    // Set metadata from the parsed requestBody
    at.metadata = JSON.stringify(requestBody);
    at.roomConfig = new RoomConfiguration({

      agents: [
        new RoomAgentDispatch({
          agentName: 'workflow', // Matches your backend agent_name
          metadata: JSON.stringify({ some: 'optional-metadata' }) // Optional, can include data for the agent
        })
      ],
    });

    // Grant permissions for workflow testing
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    console.log(`Generated workflow token for room: ${roomName}, identity: ${participantIdentity}`);
    return NextResponse.json(
      { room_name: roomName, token: token },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error in POST /api/livekit/workflow:", error);
    return NextResponse.json(
      { error: "Failed to generate workflow token", details: error.message },
      { status: 500 }
    );
  }
}
