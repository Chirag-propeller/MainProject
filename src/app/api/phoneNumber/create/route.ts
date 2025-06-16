// app/api/agent/create/route.ts
import { NextResponse,NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Update this if your path is different
import PhoneNumber from '@/model/phoneNumber'; // Make sure this is correct path
import User from '@/model/user/user.model';
import { getUserFromRequest } from '@/lib/auth';
import { SipClient } from 'livekit-server-sdk';



// SIP address is the hostname or IP the SIP INVITE is sent to.
// Address format for Twilio: <trunk-name>.pstn.twilio.com
// Address format for Telnyx: sip.telnyx.com


export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const sipClient = new SipClient(process.env.TELEPHONY_LIVEKIT_URL!,
      process.env.TELEPHONY_LIVEKIT_API_KEY,
      process.env.TELEPHONY_LIVEKIT_API_SECRET);
      let {phoneNumber, terminationUri, sipTrunkUserName, sipTrunkPassword, nickname} = body;
      if (!nickname) {
        nickname = "Outbound Phone Number";
      }
      const address = terminationUri;

      // An array of one or more provider phone numbers associated with the trunk.
      const numbers = [phoneNumber];

      // Trunk options
      const trunkOptions = {
        auth_username: sipTrunkUserName,
        auth_password: sipTrunkPassword,
        transport: 0,
        destination_country: "IN",
      };
      let trunk;
      try{
        console.log(nickname, address, numbers, trunkOptions);
        trunk = await sipClient.createSipOutboundTrunk(
          nickname,
          address,
          numbers,
          trunkOptions          
        );
        // console.log(trunk.sipTrunkId);

      }catch(error){
        console.error('Error creating trunk:', error);
        return NextResponse.json({ success: false, error: 'Failed to create trunk' }, { status: 400 });
      }


    

    const newPhone = await PhoneNumber.create({
      userId :  user.userId,
      sipOutboundTrunkId: trunk.sipTrunkId,
      ...body,
    });
    await User.findByIdAndUpdate(user.userId, { $push: { phoneNumbers: newPhone._id } });

    return NextResponse.json({ success: true, data: newPhone }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 });
  }
}
