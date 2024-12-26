import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

type RoomParams = {
    roomId: string;
};

const RoomPage: React.FC = () => {
    const { roomId } = useParams<RoomParams>();
    const roomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const initializeRoom = async () => {
            if (!roomRef.current || !roomId) return;

            const appID = import.meta.env.VITE_APP_ID;
            const serverSecret = import.meta.env.VITE_SERVER_SECRET;

            if (!appID || !serverSecret) {
                console.error('Environment variables are missing');
                return;
            }

            try {
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    parseInt(appID),
                    serverSecret,
                    roomId,
                    Date.now().toString(),
                    'Mohammed Nifli ap'
                );

                const zc = ZegoUIKitPrebuilt.create(kitToken);

                await zc.joinRoom({
                    container: roomRef.current,
                    sharedLinks: [
                        {
                            name: 'Copy Link',
                            url: `${window.location.origin}/room/${roomId}`,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.OneONoneCall,
                    },
                    showScreenSharingButton: true,
                    showRoomTimer: true,
                    showUserList: true,
                    showLayoutButton: true,
                    maxUsers: 2,
                    showNonVideoUser: true,
                    showAudioVideoSettingsButton: true,
                    onJoinRoom: () => {
                        console.log('Successfully joined the room!');
                    },
                    videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_720P,
                    preJoinViewConfig: {
                        title: 'Join Video Call',
                    },
                });
            } catch (error) {
                console.error('Failed to join room:', error instanceof Error ? error.message : 'Unknown error');
            }
        };

        initializeRoom();
    }, [roomId]);

    return (
        <div className=" mt-20 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-7xl aspect-video rounded-lg shadow-lg overflow-hidden">
                <div 
                    ref={roomRef} 
                    className="w-full h-full"
                    style={{
                        minHeight: '600px',
                        backgroundColor: '#f8fafc'
                    }}
                />
            </div>
        </div>
    );
};

export default RoomPage;