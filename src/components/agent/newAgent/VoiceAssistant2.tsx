


'use client';
import { Room, RoomEvent } from 'livekit-client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomName,
  useRoomContext,
  RoomContext
} from '@livekit/components-react';
import { DisconnectButton } from "@livekit/components-react";
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
import SimpleVoiceAssistance from './SimpleVoiceAssistance2';
import { Button } from '@/components/ui/button';

interface VoiceAssistantProps {
  setShowVoiceAssistant: (show: boolean) => void;
  // sendData: () => Promise<void>; 
  token: string;
}

const VoiceAssistant = ({ setShowVoiceAssistant, token }: VoiceAssistantProps) =>  {
  const [room] = useState(() => new Room());
  const livekit_url = process.env.NEXT_PUBLIC_LIVEKIT_URL!

  useEffect(() => {
    // Logic to fetch token and connect
    const connectToRoom = async () => {
      // Assuming you have an API route to get a token
      await room.connect(livekit_url, token);
    };

    connectToRoom();

    // Disconnect when the component unmounts
    return () => {
      if(room.state === 'connected') room.disconnect();
    };
  }, [room]);
  
  const onDisconnect = async ()=> {
    setShowVoiceAssistant(false)
    console.log(" here ")
  }

  const handleDisconnect = async () => {
    await room.disconnect();
    setShowVoiceAssistant(false);
  }

  return (
    <div className='h-[90%] border-1 border-solid border-gray-500 rounded-sm m-1 p-1 bg-white w-full'>
    <RoomContext.Provider value={room}>
      <div data-lk-theme="default">
        {/* Your custom components go here */}
        <RoomAudioRenderer />
        <SimpleVoiceAssistance/>
      </div>
      
    </RoomContext.Provider>
    
      <Button className='h-20' onClick={handleDisconnect}>Leave room</Button>

    {/* <LiveKitRoom
      serverUrl={livekit_url}
      token = {token}
      video={false}
      connect={true}
      audio={true}
      onDisconnected={onDisconnect}
      data-lk-theme="default"
      className='flex h-12 justify-center'
      style={{ 
        backgroundColor: 'white',
        '--lk-background-color': 'white'
      } as React.CSSProperties}
    >
      <RoomAudioRenderer />
      <SimpleVoiceAssistance/>
    </LiveKitRoom> */}
    </div>
  );
}



export default VoiceAssistant








// 'use client';
// import { Room, RoomEvent } from 'livekit-client';
// import {
//   ControlBar,
//   GridLayout,
//   LiveKitRoom,
//   ParticipantTile,
//   RoomAudioRenderer,
//   useTracks,
//   RoomName,
//   RoomContext,
// } from '@livekit/components-react';
// import { DisconnectButton } from "@livekit/components-react";
// import '@livekit/components-styles';
// import { useEffect, useState } from 'react';
// import { Track } from 'livekit-client';
// // import SimpleVoiceAssistance from './SimpleVoiceAssistance';
// import SimpleVoiceAssistance from './SimpleVoiceAssistance2';

// interface VoiceAssistantProps {
//   setShowVoiceAssistant: (show: boolean) => void;
//   sendData: () => Promise<void>; 
// }

// const VoiceAssistant = ({ setShowVoiceAssistant, sendData }: VoiceAssistantProps) =>  {
//   // TODO: get user input for room and name

//   const name = 'quickstart-user';
// //   const room = new Room();
//   const [room] = useState(() => new Room({}));
  
//   const [token, setToken] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const url = "http://127.0.0.1:8000"

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         console.log("run");
//         const response = await fetch(`${url}/getToken`);
//         const data = await response.json();
//         setRoomName(data.room_name);  
//         setToken(data.token);
//         if(token) room.connect('wss://newvoiceapp1-s3d1i5qu.livekit.cloud', 'token');

//       } catch (error) {
//         alert("Something went wrong..")
//         console.error("Error fetching token:", error);
//       }
//     };
  
//     fetchToken(); // Call the async function inside useEffect
//     sendData();
//   },[]); 


//   const onDisconnect = async ()=> {
//     setShowVoiceAssistant(false)
//     console.log(" here ")
//   }

//   return (
//     <RoomContext.Provider value={room}>
//             <RoomAudioRenderer />
//             <SimpleVoiceAssistance/>
//     </RoomContext.Provider>
//   );
// }



// export default VoiceAssistant

