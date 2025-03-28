// src/components/Dashboard.js
import React, { useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

// const socket = io('');

const Dashboard = () => {
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  let mediaStream;

  const startStream = async () => {
    // try {
    //   mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //   videoRef.current.srcObject = mediaStream;
    //   setStreaming(true);

    //   // Send stream to the server
    //   const peer = new SimplePeer({ initiator: true, stream: mediaStream });
    //   peer.on('signal', (data) => {
    //     socket.emit('stream', data);
    //   });

    //   socket.on('stream', (data) => {
    //     peer.signal(data);
    //   });
    // } catch (error) {
    //   console.error('Error accessing media devices:', error);
    // }
  };

  const stopStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setStreaming(false);
    }
  };

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <video ref={videoRef} autoPlay muted />
      <button onClick={startStream} disabled={streaming}>
        Start Stream
      </button>
      <button onClick={stopStream} disabled={!streaming}>
        Stop Stream
      </button>
    </div>
  );
};

export default Dashboard;