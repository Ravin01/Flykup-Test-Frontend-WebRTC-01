import React from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { ViewerComponent } from "./ViewerComponent";

export const Viewer = ({ roomId, authToken }) => {
  if (!roomId || !authToken) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Missing configuration
      </div>
    );
  }

  const meetingConfig = {
    meetingId: roomId,
    mode: "VIEWER",
    micEnabled: false,
    webcamEnabled: false,
    name: "Viewer",
  };

  return (
    <MeetingProvider
      config={meetingConfig}
      token={authToken}
      joinWithoutUserInteraction={true}
    >
      <ViewerComponent />
    </MeetingProvider>
  );
};