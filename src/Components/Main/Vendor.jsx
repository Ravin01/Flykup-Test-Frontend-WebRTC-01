// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';
// import { Device } from 'mediasoup-client';

// export const VendorStream = () => {
//   const [socket, setSocket] = useState(null);
//   const [device, setDevice] = useState(null);
//   const [producer, setProducer] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const videoRef = useRef(null);
//   const transportRef = useRef(null);

//   useEffect(() => {
//     const newSocket = io('http://localhost:3000');
//     setSocket(newSocket);

//     newSocket.on('routerCapabilities', async (routerRtpCapabilities) => {
//       try {
//         const newDevice = new Device();
//         await newDevice.load({ routerRtpCapabilities });
//         setDevice(newDevice);
//       } catch (error) {
//         console.error('Failed to load device:', error);
//         setError('Failed to initialize device');
//       }
//     });

//     return () => {
//       if (transportRef.current) {
//         transportRef.current.close();
//       }
//       if (newSocket) {
//         newSocket.close();
//       }
//     };
//   }, []);

//   const startStream = async () => {
//     try {
//       setError(null);

//       // Get user media
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });

//       videoRef.current.srcObject = stream;

//       // Create transport
//       socket.emit('createWebRtcTransport', { role: 'producer' }, async (response) => {
//         if (response.error) {
//           throw new Error(response.error);
//         }

//         const sendTransport = device.createSendTransport(response);
//         transportRef.current = sendTransport;

//         sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
//           socket.emit('connectTransport', {
//             transportId: sendTransport.id,
//             dtlsParameters
//           }, (response) => {
//             if (response.error) {
//               errback(response.error);
//               return;
//             }
//             callback();
//           });
//         });

//         sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
//           socket.emit('produce', {
//             transportId: sendTransport.id,
//             kind,
//             rtpParameters
//           }, (response) => {
//             if (response.error) {
//               errback(response.error);
//               return;
//             }
//             callback({ id: response.id });
//           });
//         });

//         try {
//           const videoTrack = stream.getVideoTracks()[0];
//           const audioTrack = stream.getAudioTracks()[0];

//           const videoProducer = await sendTransport.produce({ track: videoTrack });
//           await sendTransport.produce({ track: audioTrack });

//           setProducer(videoProducer);
//           setIsConnected(true);
//         } catch (error) {
//           console.error('Failed to produce:', error);
//           setError('Failed to start streaming');
//         }
//       });
//     } catch (error) {
//       console.error('Error starting stream:', error);
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Vendor Stream</h1>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         className="w-full max-w-2xl border border-gray-300 rounded-lg"
//       />
//       <button
//         onClick={startStream}
//         disabled={isConnected}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
//       >
//         {isConnected ? 'Streaming' : 'Start Streaming'}
//       </button>
//     </div>
//   );
// };