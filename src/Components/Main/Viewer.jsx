// import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';
// import { Device } from 'mediasoup-client';

// export const ViewerStream = () => {
//     const [socket, setSocket] = useState(null);
//     const [device, setDevice] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [error, setError] = useState(null);
//     const videoRef = useRef(null);
//     const transportRef = useRef(null);
  
//     useEffect(() => {
//       const newSocket = io('http://localhost:3000');
//       setSocket(newSocket);
  
//       newSocket.on('routerCapabilities', async (routerRtpCapabilities) => {
//         try {
//           console.log('Received router capabilities');
//           const newDevice = new Device();
//           await newDevice.load({ routerRtpCapabilities });
//           setDevice(newDevice);
//         } catch (error) {
//           console.error('Failed to load device:', error);
//           setError('Failed to initialize device');
//         }
//       });
  
//       newSocket.on('newProducer', async ({ producerId }) => {
//         console.log('New producer available:', producerId);
//         if (device && !isConnected) {
//           await connectToStream(producerId, newSocket);
//         }
//       });
  
//       return () => {
//         if (transportRef.current) {
//           transportRef.current.close();
//         }
//         if (newSocket) {
//           newSocket.close();
//         }
//       };
//     }, [device, isConnected]);
  
//     const connectToStream = async (producerId, socketToUse) => {
//       try {
//         setError(null);
//         const socket = socketToUse || window.socket;
  
//         socket.emit('createWebRtcTransport', { role: 'consumer' }, async (response) => {
//           if (response.error) {
//             throw new Error(response.error);
//           }
  
//           const recvTransport = device.createRecvTransport(response);
//           transportRef.current = recvTransport;
  
//           recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
//             socket.emit('connectTransport', {
//               transportId: recvTransport.id,
//               dtlsParameters
//             }, (response) => {
//               if (response.error) {
//                 errback(response.error);
//                 return;
//               }
//               callback();
//             });
//           });
  
//           socket.emit('consume', {
//             transportId: recvTransport.id,
//             producerId,
//             rtpCapabilities: device.rtpCapabilities
//           }, async (response) => {
//             if (response.error) {
//               throw new Error(response.error);
//             }
  
//             const consumer = await recvTransport.consume({
//               id: response.id,
//               producerId: response.producerId,
//               kind: response.kind,
//               rtpParameters: response.rtpParameters
//             });
  
//             const stream = new MediaStream([consumer.track]);
//             videoRef.current.srcObject = stream;
            
//             try {
//               await videoRef.current.play();
//               setIsConnected(true);
//             } catch (error) {
//               console.error('Failed to play video:', error);
//               setError('Failed to play video stream');
//             }
//           });
//         });
//       } catch (error) {
//         console.error('Error connecting to stream:', error);
//         setError('Failed to connect to stream');
//       }
//     };
  
//     return (
//       <div className="p-4">
//         <h1 className="text-2xl font-bold mb-4">Viewer Stream</h1>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="w-full max-w-2xl border border-gray-300 rounded-lg"
//         />
//         <div className="mt-2 text-sm text-gray-600">
//           Status: {isConnected ? 'Connected' : 'Waiting for stream...'}
//         </div>
//       </div>
//     );
//   };