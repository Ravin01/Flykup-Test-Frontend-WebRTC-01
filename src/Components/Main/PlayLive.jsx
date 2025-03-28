// import React, { useEffect, useRef, useState } from 'react';
// import { Device } from 'mediasoup-client';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000'); // Backend URL

// export default function PlayLive() {
//   const videoRef = useRef(null);
//   const [device, setDevice] = useState(null);
//   const [consumerTransport, setConsumerTransport] = useState(null);
//   const [consumer, setConsumer] = useState(null);

//   useEffect(() => {
//     const initialize = async () => {
//       // Get the RTP capabilities from the backend
//       const rtpCapabilities = await new Promise(resolve => socket.emit('getRouterRtpCapabilities', resolve));

//       // Initialize the mediasoup device
//       const device = new Device();
//       await device.load({ routerRtpCapabilities: rtpCapabilities });
//       setDevice(device);
//     };

//     initialize();
//   }, []);

//   const startConsuming = async () => {
//     if (!device) return;

//     // Create transport for consumer (viewer)
//     const { id: transportId, iceParameters, iceCandidates, dtlsParameters } = await new Promise(resolve =>
//       socket.emit('createConsumerTransport', resolve)
//     );

//     const transport = device.createRecvTransport({
//       id: transportId,
//       iceParameters,
//       iceCandidates,
//       dtlsParameters,
//     });

//     transport.on('connect', ({ dtlsParameters }, callback) => {
//       socket.emit('connectConsumerTransport', { dtlsParameters }, callback);
//     });

//     setConsumerTransport(transport);

//     // Assuming you know the producerId (you might fetch this from your backend or another logic)
//     const producerId = 'someProducerId'; // Get the actual producerId from backend or logic

//     // Create the consumer
//     const { id: consumerId, kind, rtpParameters } = await new Promise(resolve =>
//       socket.emit('consume', { producerId, rtpCapabilities: device.rtpCapabilities }, resolve)
//     );

//     const consumer = await transport.consume({ id: consumerId, kind, rtpParameters });

//     // Set up the media stream for the video element
//     const stream = new MediaStream();
//     stream.addTrack(consumer.track);
//     videoRef.current.srcObject = stream;
//     setConsumer(consumer);
//   };

//   return (
//     <div>
//       <h1>Play Live Stream</h1>
//       <video ref={videoRef} autoPlay style={{ width: '100%' }} />
//       <button onClick={startConsuming}>Play Live Stream</button>
//     </div>
//   );
// }
