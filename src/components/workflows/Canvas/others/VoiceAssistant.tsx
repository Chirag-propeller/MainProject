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
} from '@livekit/components-react';
import { DisconnectButton } from "@livekit/components-react";
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
import SimpleVoiceAssistance from './SimpleVoiceAssistance';
// import SimpleVoiceAssistance from './SimpleVoiceAssistance';

interface VoiceAssistantProps {
  setShowVoiceAssistant: (show: boolean) => void;
  token: string;
}

const VoiceAssistant = ({ setShowVoiceAssistant, token }: VoiceAssistantProps) =>  {
  const livekit_url = process.env.NEXT_PUBLIC_LIVEKIT_URL

  const onDisconnect = async () => {
    setShowVoiceAssistant(false)
    console.log("Workflow test disconnected")
  }

  return (
    <div className='h-[90%] border-1 border-solid border-gray-500 rounded-sm m-1 p-1 bg-white w-full'>
    <LiveKitRoom
      serverUrl={livekit_url}
      token={token}
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
    </LiveKitRoom>
    </div>
  );
}

export default VoiceAssistant 