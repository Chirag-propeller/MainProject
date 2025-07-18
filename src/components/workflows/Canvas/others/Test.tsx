"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { RoomContext } from '@livekit/components-react';
import { Room } from 'livekit-client';

const Test = () => {
    const [room, setRoom] = useState(() => new Room({}));
    const [token, setToken] = useState('');
    const livekit_url = process.env.NEXT_PUBLIC_LIVEKIT_URL!
  useEffect(() => {
    const fetchToken = async () => {
        const response = await axios.post('/api/livekit/getToken', {
            agentName: 'workflow',
        })
        const data = await response.data
        setToken(data.token)
        console.log(data)
    }
    fetchToken()
  }, [])

  useEffect(() => {
    room.connect(livekit_url, token);
    return () => {
      room.disconnect();
    };
  }, [token]);

  return (
    <RoomContext.Provider value={room}>
      {/* Your components go here */}
    </RoomContext.Provider>
  );
    
  return (
    <div>
        <div>
            <h1>Test</h1>
        </div>
    </div>
  )
}

export default Test

