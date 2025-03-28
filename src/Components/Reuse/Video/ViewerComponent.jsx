import React, { useRef, useEffect } from 'react';
import { useMeeting } from '@videosdk.live/react-sdk';

export const ViewerComponent = () => {
  const { participants, meetingId } = useMeeting();
  const videoRef = useRef(null);
  const vendorParticipant = Array.from(participants.values())[0];

  useEffect(() => {
    if (vendorParticipant && videoRef.current) {
      const stream = new MediaStream();
      if (vendorParticipant.videoStream) {
        stream.addTrack(vendorParticipant.videoStream.track);
      }
      videoRef.current.srcObject = stream;
    }
  }, [vendorParticipant, vendorParticipant?.videoStream]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50">
          <h2 className="text-xl font-bold">Live Stream</h2>
          <p className="text-gray-600">Room ID: {meetingId}</p>
          <p className="text-gray-600">
            Status: {vendorParticipant ? 'Live' : 'Waiting for stream...'}
          </p>
        </div>

        <div className="aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};