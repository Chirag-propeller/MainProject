"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { 
    RoomContext, 
    ControlBar, 
    RoomAudioRenderer, 
    useTracks, 
    GridLayout, 
    ParticipantTile,
    useRoomContext,
    useLocalParticipant
} from '@livekit/components-react';
import { Room, ConnectionState, Track, LocalParticipant } from 'livekit-client';
import '@livekit/components-styles';

const Test = () => {
    const [room] = useState(() => new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
    }));
    const [token, setToken] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
    const [isPaused, setIsPaused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const livekit_url = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

    // Fetch token
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.post('/api/livekit/workflow', {
                    agent_type: 'workflow', // This should match your actual agent name
                });
                const data = await response.data;
                setToken(data.token);
                console.log('Token received:', data);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, []);

    // Connect to room when token is available and modal is open
    useEffect(() => {
        if (!token || !isModalOpen) return;

        const connectToRoom = async () => {
            try {
                setIsConnecting(true);
                console.log('Connecting to LiveKit room...');
                await room.connect(livekit_url, token);
                console.log('Successfully connected to LiveKit room');
            } catch (error) {
                console.error('Failed to connect to LiveKit room:', error);
            } finally {
                setIsConnecting(false);
            }
        };

        connectToRoom();

        return () => {
            room.disconnect();
        };
    }, [token, room, livekit_url, isModalOpen]);

    // Listen to connection state changes
    useEffect(() => {
        const handleConnectionStateChange = (state: ConnectionState) => {
            setConnectionState(state);
            console.log('Connection state changed:', state);
        };

        room.on(ConnectionState.Connected, () => handleConnectionStateChange(ConnectionState.Connected));
        room.on(ConnectionState.Disconnected, () => handleConnectionStateChange(ConnectionState.Disconnected));
        room.on(ConnectionState.Reconnecting, () => handleConnectionStateChange(ConnectionState.Reconnecting));

        return () => {
            room.off(ConnectionState.Connected, () => handleConnectionStateChange(ConnectionState.Connected));
            room.off(ConnectionState.Disconnected, () => handleConnectionStateChange(ConnectionState.Disconnected));
            room.off(ConnectionState.Reconnecting, () => handleConnectionStateChange(ConnectionState.Reconnecting));
        };
    }, [room]);

    const handleDisconnect = () => {
        room.disconnect();
        setConnectionState(ConnectionState.Disconnected);
        setIsModalOpen(false);
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
        // You can add additional pause logic here
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        room.disconnect();
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Open LiveKit Test
            </button>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl h-5/6 flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">LiveKit Test Room</h2>
                                    <p className="text-sm text-gray-500">
                                        Connection State: 
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                            connectionState === ConnectionState.Connected 
                                                ? 'bg-green-100 text-green-800' 
                                                : connectionState === ConnectionState.Connecting 
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {connectionState}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handlePause}
                                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                            isPaused 
                                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {isPaused ? 'Resume' : 'Pause'}
                                    </button>
                                    <button
                                        onClick={handleDisconnect}
                                        className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 p-4 overflow-hidden">
                            {!token ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Getting token...</p>
                                    </div>
                                </div>
                            ) : isConnecting ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Connecting to room...</p>
                                    </div>
                                </div>
                            ) : connectionState === ConnectionState.Connected ? (
                                <RoomContext.Provider value={room}>
                                    <div className="h-full flex flex-col">
                                        {/* Video Conference Area */}
                                        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                                            <VideoConference />
                                        </div>
                                        
                                        {/* Control Bar at Bottom */}
                                        <div className="mt-4">
                                            <ControlBar 
                                                variation="minimal"
                                                controls={{
                                                    camera: true,
                                                    microphone: true,
                                                    screenShare: true,
                                                    leave: false, // We handle disconnect manually
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Audio Renderer */}
                                        <RoomAudioRenderer />
                                    </div>
                                </RoomContext.Provider>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">📹</div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {connectionState === ConnectionState.Disconnected 
                                                ? 'Disconnected from room' 
                                                : 'Connecting...'}
                                        </h3>
                                        <p className="text-gray-500">
                                            {connectionState === ConnectionState.Disconnected 
                                                ? 'Click connect to join the room' 
                                                : 'Please wait while we establish the connection'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Video Conference Component
function VideoConference() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <GridLayout 
            tracks={tracks} 
            className="h-full"
        >
            <ParticipantTile />
        </GridLayout>
    );
}

// Custom Control Component
function CustomControls() {
    const roomContext = useRoomContext();
    const { localParticipant } = useLocalParticipant();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    const toggleCamera = async () => {
        if (localParticipant) {
            if (isCameraOn) {
                await localParticipant.setCameraEnabled(false);
            } else {
                await localParticipant.setCameraEnabled(true);
            }
            setIsCameraOn(!isCameraOn);
        }
    };

    const toggleMic = async () => {
        if (localParticipant) {
            if (isMicOn) {
                await localParticipant.setMicrophoneEnabled(false);
            } else {
                await localParticipant.setMicrophoneEnabled(true);
            }
            setIsMicOn(!isMicOn);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-colors ${
                    isCameraOn 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                }`}
            >
                {isCameraOn ? '📹' : '🚫'}
            </button>
            <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-colors ${
                    isMicOn 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                }`}
            >
                {isMicOn ? '🎤' : '🚫'}
            </button>
            <button
                onClick={() => roomContext.disconnect()}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
                ❌
            </button>
        </div>
    );
}

export default Test;

