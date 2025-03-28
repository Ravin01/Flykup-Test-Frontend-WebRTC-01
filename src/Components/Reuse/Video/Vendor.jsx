// Vendor.jsx
import React from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { Controls } from "./Controls";

export const Vendor = ({ roomId, authToken }) => {
  if (!roomId || !authToken) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Missing configuration
      </div>
    );
  }

  const meetingConfig = {
    meetingId: roomId,
    mode: "CONFERENCE",
    micEnabled: false,
    webcamEnabled: false,
    name: "Vendor",
  };

  return (
    <MeetingProvider
      config={meetingConfig}
      token={authToken}
      joinWithoutUserInteraction={false}
    >
      <Controls />
    </MeetingProvider>
  );
};