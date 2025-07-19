// app/api/getToken/route.js
import { NextRequest, NextResponse } from 'next/server';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { v4 as uuidv4 } from 'uuid';

// Environment variables
const livekitHost = process.env.LIVEKIT_URL || process.env.LIVEKIT_HOST || 'http://localhost:7880'; // Fallback for local dev
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
    throw error; // Propagate the error to be handled by the main handler
  }

  do {
    name = `room-${uuidv4()}`;
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

    // Extract agent_name from requestBody if provided, otherwise default to a value
    const agentName = requestBody.agent_type || "default-agent";
    console.log(`Creating room ${roomName} with agent: ${agentName}`);

    // Create room metadata as JSON string for agent configuration
    // This allows your Python agents to read and differentiate behavior
    const roomMetadata = JSON.stringify({
      agent_name: agentName,  // e.g., "voice-assistant" or "workflow-tracker"
      dispatched_by: "nextjs-backend",
      additional_info: `Dispatched ${agentName} agent for script differentiation`
    });

    // Create the room with metadata for agent/script differentiation
    await roomService.createRoom({
      name: roomName,
      emptyTimeout: 60 * 30, // Optional: Room expires after 30 minutes if empty
      maxParticipants: 10,   // Optional: Max participants
      metadata: roomMetadata // Store agent config here (JSON string)
    });

    // In the original Python code, identity and participant name are set to the generated room name.
    const participantIdentity = roomName;
    const participantDisplayName = roomName; // This is for participant's display name

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantDisplayName,
    });

    // Set participant metadata from the parsed requestBody (separate from room metadata)
    at.metadata = JSON.stringify(requestBody);

    // Grant permissions based on the Python code (room_join=True, room=roomName)
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,    // Allows publishing audio/video tracks
      canSubscribe: true,  // Allows subscribing to tracks
    });

    // For LiveKit Agents, the agent dispatch is handled by the room metadata
    // The agent will be dispatched based on the room metadata we set earlier
    // The agent_name in room metadata tells LiveKit which agent to dispatch

    const token = await at.toJwt(); // Generate the JWT

    console.log(`Generated token for room: ${roomName}, identity: ${participantIdentity}, agent: ${agentName}`);
    return NextResponse.json(
      { room_name: roomName, token: token, agent_name: agentName },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error in POST /api/getToken (App Router):", error);
    return NextResponse.json(
      { error: "Failed to generate token", details: error.message },
      { status: 500 }
    );
  }
}

// // app/api/getToken/route.js
// import { NextRequest, NextResponse } from 'next/server';
// import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
// import { v4 as uuidv4 } from 'uuid';

// // Environment variables
// const livekitHost = process.env.LIVEKIT_URL || process.env.LIVEKIT_HOST || 'http://localhost:7880'; // Fallback for local dev
// const apiKey = process.env.LIVEKIT_API_KEY;
// const apiSecret = process.env.LIVEKIT_API_SECRET;

// // Helper function to list existing room names
// async function getExistingRoomNames(roomService: RoomServiceClient) {
//   try {
//     const rooms = await roomService.listRooms();
//     return rooms.map(room => room.name);
//   } catch (error: any) {
//     console.error("Error fetching LiveKit rooms:", error);
//     throw new Error(`Failed to list LiveKit rooms: ${error.message}`);
//   }
// }

// // Helper function to generate a unique room name
// async function generateUniqueRoomName(roomService: RoomServiceClient) {
//   let name;
//   let existingNames;
//   try {
//     existingNames = await getExistingRoomNames(roomService);
//   } catch (error: any) {
//     console.error("Cannot generate unique room name because listing rooms failed:", error);
//     throw error; // Propagate the error to be handled by the main handler
//   }

//   do {
//     name = `room-${uuidv4()}`;
//   } while (existingNames.includes(name));
//   return name;
// }

// export async function POST(request: NextRequest) {
//   if (!apiKey || !apiSecret || !livekitHost) {
//     console.error("LiveKit API key, secret, or URL not configured.");
//     return NextResponse.json(
//       { error: "Server configuration error: LiveKit credentials or URL missing." },
//       { status: 500 }
//     );
//   }

//   let requestBody;
//   try {
//     // request.json() parses the request body as JSON.
//     // It will throw an error if the body is not valid JSON or if the Content-Type is not appropriate.
//     // This behavior aligns well with Flask's request.get_json() default behavior,
//     // which expects a JSON payload and errors out if it's malformed or the content type is wrong.
//     requestBody = await request.json();
//   } catch (error: any) {
//     console.warn("Failed to parse JSON body or body not provided as JSON:", error.message);
//     // Return a 400 Bad Request if the JSON body is missing or malformed,
//     // as metadata is expected to be passed this way.
//     return NextResponse.json(
//       { error: "Invalid or missing JSON body. A JSON body (even if empty, e.g., {}) is expected for metadata." },
//       { status: 400 }
//     );
//   }

//   const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

//   try {
//     const roomName = await generateUniqueRoomName(roomService);

//     // In the original Python code, identity and participant name are set to the generated room name.
//     const participantIdentity = roomName;
//     const participantDisplayName = roomName; // This is for participant's display name

//     const at = new AccessToken(apiKey, apiSecret, {
//       identity: participantIdentity,
//       name: participantDisplayName,
//     });

//     // Set metadata from the parsed requestBody.
//     // JSON.stringify will correctly handle an empty object (e.g., {} from an empty JSON body)
//     // into "{}". If requestBody was `null` (from JSON `null`), it becomes `"null"`.
//     at.metadata = JSON.stringify(requestBody);

//     // Grant permissions based on the Python code (room_join=True, room=roomName)
//     // For a functional video call, canPublish and canSubscribe are typically also true.
//     // These are added here for common usability but were not explicitly in the VideoGrants parameters
//     // of the Python snippet other than room and room_join.
//     at.addGrant({
//       roomJoin: true,
//       room: roomName,
//       canPublish: true,    // Allows publishing audio/video tracks
//       canSubscribe: true,  // Allows subscribing to tracks
//     });
//     // at.with_room_config({
//     //     agents: [
//     //       {
//     //         agent_name: "voice-assistant",
//     //         metadata: "Dispatched voice agent"
//     //       }
//     //     ]
//     //   });
//     at.withRoomConfig({
//         agents: [
//           {
//             agent_name: agentName,  // Specify the agent name (e.g., "voice-assistant" or "workflow-tracker")
//             metadata: `Dispatched ${agentName} agent`
//           }
//         ]
//       });

//     const token = await at.toJwt(); // Generate the JWT

//     console.log(`Generated token for room: ${roomName}, identity: ${participantIdentity}`);
//     return NextResponse.json(
//       { room_name: roomName, token: token },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     console.error("Error in POST /api/getToken (App Router):", error);
//     return NextResponse.json(
//       { error: "Failed to generate token", details: error.message },
//       { status: 500 }
//     );
//   }
// }