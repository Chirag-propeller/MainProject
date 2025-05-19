
// components/ConnectTwilioButton.tsx

import { Button } from "../ui/button";


export default function ConnectButton() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
    return (
      <form action="https://connect.twilio.com/authorize/CN3d053cba90ddbc545b42318e42853fb5" method="POST">
        <input type="hidden" name="AccountSid" value={sid} />
        <input 
        type="hidden" 
        name="RedirectUrl" 
        value={`${process.env.NEXTAUTH_URL}/api/twilio/connect-callback`}
      />
        <input type="hidden" name="FriendlyName" value="ProPal AI" />
        <Button  type="submit">Connect Twilio Number</Button>
      </form>
    );
  }
  