// // app/api/phoneNumber/update/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import PhoneNumber from '@/model/phoneNumber';
// import { getUserFromRequest } from '@/lib/auth';
// import { SipClient } from 'livekit-server-sdk';

// export async function POST(req: NextRequest) {
//   await dbConnect();

//   try {
//     const user = await getUserFromRequest(req);
//     const body = await req.json();

//     const {
//       _id, // Must be passed for update
//       phoneNumber,
//       terminationUri,
//       sipTrunkUserName,
//       sipTrunkPassword,
//       nickname,
//       provider,
//       agentAttached,
//       agentName,
//     } = body;

//     if (!_id) {
//       return NextResponse.json({ success: false, error: "Missing phone number ID" }, { status: 400 });
//     }

//     const existingPhone = await PhoneNumber.findOne({
//       _id,
//       userId: user.userId,
//     });

//     if (!existingPhone) {
//       return NextResponse.json({ success: false, error: "Phone number not found" }, { status: 404 });
//     }

//     // If SIP-related details have changed, update trunk
//     let trunkUpdated = false;
//     if (
//       terminationUri !== existingPhone.terminationUri ||
//       sipTrunkUserName !== existingPhone.sipTrunkUserName ||
//       sipTrunkPassword !== existingPhone.sipTrunkPassword ||
//       nickname !== existingPhone.nickname
//     ) {
//       const sipClient = new SipClient(
//         process.env.TELEPHONY_LIVEKIT_URL!,
//         process.env.TELEPHONY_LIVEKIT_API_KEY!,
//         process.env.TELEPHONY_LIVEKIT_API_SECRET!
//       );

//       try {
//         const sipTrunkUpdatePayload = {
//           authUsername: sipTrunkUserName,
//           authPassword: sipTrunkPassword,
//           name: nickname,
//         };
        
//         await sipClient.updateSipOutboundTrunkFields(
//           existingPhone.sipOutboundTrunkId,
//           sipTrunkUpdatePayload
//         );
//       } catch (err) {
//         console.error("Failed to update SIP trunk:", err);
//         return NextResponse.json({ success: false, error: "Failed to update trunk" }, { status: 400 });
//       }
//     }

//     // Update phone document in MongoDB
//     existingPhone.phoneNumber = phoneNumber;
//     existingPhone.terminationUri = terminationUri;
//     existingPhone.sipTrunkUserName = sipTrunkUserName;
//     existingPhone.sipTrunkPassword = sipTrunkPassword;
//     existingPhone.nickname = nickname;
//     existingPhone.provider = provider;
//     existingPhone.agentAttached = agentAttached;
//     existingPhone.agentName = agentName;

//     await existingPhone.save();

//     return NextResponse.json({
//       success: true,
//       data: existingPhone,
//       trunkUpdated,
//     }, { status: 200 });

//   } catch (err) {
//     console.error("Error updating phone number:", err);
//     return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
//   }
// }
