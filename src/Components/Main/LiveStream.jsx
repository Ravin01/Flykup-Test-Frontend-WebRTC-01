import React, { useEffect, useRef, useState } from 'react';
import { Device } from 'mediasoup-client';
import io from 'socket.io-client';

const socket = io(''); // Adjust your backend URL

export default function LiveStream() {
  const videoRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userMedia);
        videoRef.current.srcObject = userMedia;

        const rtpCapabilities = await new Promise(resolve => socket.emit('getRouterRtpCapabilities', resolve));
        const device = new Device();
        await device.load({ routerRtpCapabilities: rtpCapabilities });
        setDevice(device);
      } catch (error) {
        console.error('Error initializing mediasoup client:', error);
      }
    };

    // initialize();
  }, []);

  const startStreaming = async () => {
    // if (!device) return;
  
    // const { id, iceParameters, iceCandidates, dtlsParameters } = await new Promise(resolve =>
    //   socket.emit('createProducerTransport', resolve)
    // );
  
    // const transport = device.createSendTransport({
    //   id,
    //   iceParameters,
    //   iceCandidates,
    //   dtlsParameters,
    // });

    // console.log('transport', transport);
  
    // transport.on('connect', ({ dtlsParameters }, callback) => {
    //   socket.emit('connectProducerTransport', { dtlsParameters }, callback);
    // });
  
    // transport.on('produce', async ({ kind, rtpParameters }, callback) => {
    //   const { id } = await new Promise(resolve =>
    //     socket.emit('produce', { kind, rtpParameters }, resolve)
    //   );
    //   callback({ id });
    // });
  
    // stream.getTracks().forEach(track => transport.produce({ track }));
  };
  

  return (
    <div>
      <h1>Live Stream</h1>
      <video ref={videoRef} autoPlay muted style={{ width: '100%' }} />
      <button onClick={startStreaming}>Start Streaming</button>
    </div>
  );
}
