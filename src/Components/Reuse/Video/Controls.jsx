import React, { useEffect, useRef, useState } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';

export const Controls = ({onError}) => {
  const { 
    localParticipant,
    join, 
    leave, 
    toggleMic, 
    toggleWebcam,
    participants,
    meetingId,
  } = useMeeting();

  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (localParticipant && videoRef.current) {
      const stream = new MediaStream();
      if (localParticipant.videoStream) {
        stream.addTrack(localParticipant.videoStream.track);
      }
      videoRef.current.srcObject = stream;
    }
  }, [localParticipant, localParticipant?.videoStream]);


  const startStream = async () => {
    try {
      await join();
      setIsStreaming(true);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const endStream = () => {
    leave();
    setIsStreaming(false);
    setIsMicOn(false);
    setIsCameraOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleToggleMic = () => {
    toggleMic();
    setIsMicOn(!isMicOn);
  };

  const handleToggleCamera = () => {
    toggleWebcam();
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h2 className="text-xl font-bold">Live Stream Controls</h2>
          <p className="text-gray-600">Room ID: {meetingId}</p>
          <p className="text-gray-600">
            Status: {isStreaming ? 'Live' : 'Offline'}
          </p>
          <p className="text-gray-600">
            Viewers: {participants.size - 1}
          </p>
        </div>

        <div className="aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex gap-4 justify-center">
          {!isStreaming ? (
            <button
              onClick={startStream}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Start Stream
            </button>
          ) : (
            <>
              <button
                onClick={endStream}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                End Stream
              </button>
              <button
                onClick={handleToggleMic}
                className={`px-4 py-2 rounded ${
                  isMicOn ? 'bg-blue-500' : 'bg-gray-500'
                } text-white hover:opacity-90`}
              >
                {isMicOn ? 'Mic On' : 'Mic Off'}
              </button>
              <button
                onClick={handleToggleCamera}
                className={`px-4 py-2 rounded ${
                  isCameraOn ? 'bg-blue-500' : 'bg-gray-500'
                } text-white hover:opacity-90`}
              >
                {isCameraOn ? 'Camera On' : 'Camera Off'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};