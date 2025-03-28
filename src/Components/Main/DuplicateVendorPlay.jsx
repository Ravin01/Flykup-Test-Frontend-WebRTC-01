// import { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";



// export const VendorStream = ({ vendorId, vendorName }) => {
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [viewerCount, setViewerCount] = useState(0);
//   const [isCameraOn, setIsCameraOn] = useState(true);
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [viewers, setViewers] = useState([]);

//   const localVideoRef = useRef();
//   const socketRef = useRef();
//   const peerConnectionsRef = useRef({});
//   const streamRef = useRef(null);
//   const chatContainerRef = useRef(null);

//   const configuration = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { 
//         urls: "turn:a.relay.metered.ca:80",
//         username: "83c62d1147d4a95fc50e9838",
//         credential: "LJCfF5u/K/K8qPtE",
//       },
//       {
//         urls: "turn:a.relay.metered.ca:80?transport=tcp",
//         username: "83c62d1147d4a95fc50e9838",
//         credential: "LJCfF5u/K/K8qPtE",
//       },
//       { 
//         urls: "turn:a.relay.metered.ca:443",
//         username: "83c62d1147d4a95fc50e9838",
//         credential: "LJCfF5u/K/K8qPtE",
//       },
//       { 
//         urls: "turn:a.relay.metered.ca:443?transport=tcp",
//         username: "83c62d1147d4a95fc50e9838",
//         credential: "LJCfF5u/K/K8qPtE",
//       }
//     ]
//   };
  

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const updateTrackInPeerConnections = (track, type) => {
//     Object.values(peerConnectionsRef.current).forEach((pc) => {
//       const senders = pc.getSenders();
//       const sender = senders.find((s) => s.track?.kind === type);
//       if (sender) {
//         sender.replaceTrack(track);
//       }
//     });
//   };

//   const toggleCamera = async () => {
//     if (!streamRef.current) return;

//     const videoTrack = streamRef.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !isCameraOn;
//       setIsCameraOn(!isCameraOn);

//       if (!isCameraOn) {
//         try {
//           const newStream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//           });
//           const newVideoTrack = newStream.getVideoTracks()[0];
//           streamRef.current.addTrack(newVideoTrack);
//           streamRef.current.removeTrack(videoTrack);
//           updateTrackInPeerConnections(newVideoTrack, "video");
//         } catch (error) {
//           console.error("Error getting new video track:", error);
//         }
//       }
//     }
//   };

//   const toggleMicrophone = () => {
//     if (!streamRef.current) return;

//     const audioTrack = streamRef.current.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = !isMicOn;
//       setIsMicOn(!isMicOn);
//     }
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       socketRef.current.emit("chat-message", {
//         vendorId,
//         message: newMessage,
//         sender: vendorName,
//         isVendor: true,
//         timestamp: new Date().toISOString(),
//       });
//       setNewMessage("");
//     }
//   };

//   useEffect(() => {
//       // socketRef.current = io('http://localhost:8000');
//     socketRef.current = io("https://test-flykup-backend.onrender.com")

//     // In VendorStream.js
//     socketRef.current.on("viewer-request", async ({ viewerId, viewerName }) => {
//       try {
//         setViewers((prev) => [...prev, { id: viewerId, name: viewerName }]);

//         // Create new peer connection
//         const peerConnection = new RTCPeerConnection(configuration);
//         peerConnectionsRef.current[viewerId] = peerConnection;

//         // IMPORTANT: Add tracks from the stream to the peer connection
//         if (streamRef.current) {
//           streamRef.current.getTracks().forEach((track) => {
//             console.log("Adding track to peer connection:", track.kind);
//             peerConnection.addTrack(track, streamRef.current);
//           });
//         } else {
//           console.error("No stream available to share");
//           return;
//         }

//         // Handle ICE candidates
//         peerConnection.onicecandidate = (event) => {
//           if (event.candidate) {
//             console.log("Sending ICE candidate to viewer");
//             socketRef.current.emit("ice-candidate", {
//               candidate: event.candidate,
//               viewerId,
//               vendorId,
//             });
//           }
//         };

//         // Create and send offer
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);

//         socketRef.current.emit("stream-offer", {
//           offer,
//           viewerId,
//           vendorId,
//         });

//         setViewerCount(Object.keys(peerConnectionsRef.current).length);
//       } catch (error) {
//         console.error("Error handling viewer request:", error);
//       }
//     });

//     socketRef.current.on("chat-message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     socketRef.current.on("stream-answer", async ({ answer, viewerId }) => {
//       try {
//         const peerConnection = peerConnectionsRef.current[viewerId];
//         await peerConnection.setRemoteDescription(
//           new RTCSessionDescription(answer)
//         );
//       } catch (error) {
//         console.error("Error handling answer:", error);
//       }
//     });

//     socketRef.current.on("ice-candidate", async ({ candidate, viewerId }) => {
//       try {
//         const peerConnection = peerConnectionsRef.current[viewerId];
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (error) {
//         console.error("Error adding ICE candidate:", error);
//       }
//     });

//     socketRef.current.on("viewer-disconnect", ({ viewerId, viewerName }) => {
//       if (peerConnectionsRef.current[viewerId]) {
//         peerConnectionsRef.current[viewerId].close();
//         delete peerConnectionsRef.current[viewerId];
//         setViewerCount(Object.keys(peerConnectionsRef.current).length);
//         setViewers((prev) => prev.filter((viewer) => viewer.id !== viewerId));
//         setMessages((prev) => [
//           ...prev,
//           {
//             message: `${viewerName} left the stream`,
//             type: "system",
//             timestamp: new Date().toISOString(),
//           },
//         ]);
//       }
//     });

//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//       Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
//       socketRef.current.disconnect();
//     };
//   }, [vendorId, vendorName]);

//   const startStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           frameRate: { ideal: 30 },
//         },
//         audio: true,
//       });

//       console.log(
//         "Got media stream:",
//         stream.getTracks().map((t) => t.kind)
//       );
//       streamRef.current = stream;
//       localVideoRef.current.srcObject = stream;

//       // Make sure we're ready before announcing
//       socketRef.current.emit("vendor-ready", { vendorId, vendorName });
//       setIsStreaming(true);
//     } catch (error) {
//       console.error("Error accessing media devices:", error);
//     }
//   };

//   const stopStream = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
//     peerConnectionsRef.current = {};

//     socketRef.current.emit("vendor-stop", { vendorId });
//     setIsStreaming(false);
//     setViewerCount(0);
//     setIsCameraOn(true);
//     setIsMicOn(true);
//     setMessages([]);
//     setViewers([]);
//   };

//   return (
//     <div className="p-4 flex flex-col md:flex-row gap-4">
//       <div className="flex-1">
//         <div className="relative">
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-[90%] rounded-lg shadow-lg"
//           />
//           {isStreaming && (
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
//               <button
//                 onClick={toggleCamera}
//                 className={`px-4 py-2 rounded-full ${
//                   isCameraOn ? "bg-blue-500" : "bg-red-500"
//                 } text-white`}
//               >
//                 {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
//               </button>
//               <button
//                 onClick={toggleMicrophone}
//                 className={`px-4 py-2 rounded-full ${
//                   isMicOn ? "bg-blue-500" : "bg-red-500"
//                 } text-white`}
//               >
//                 {isMicOn ? "Mute Mic" : "Unmute Mic"}
//               </button>
//             </div>
//           )}
//         </div>
//         <div className="mt-4 flex justify-center gap-4">
//           {!isStreaming ? (
//             <button
//               onClick={startStream}
//               className="px-6 py-2 bg-green-500 text-white rounded-lg"
//             >
//               Start Stream
//             </button>
//           ) : (
//             <button
//               onClick={stopStream}
//               className="px-6 py-2 bg-red-500 text-white rounded-lg"
//             >
//               Stop Stream
//             </button>
//           )}
//           <div className="px-4 py-2 bg-gray-100 rounded-lg">
//             Active Viewers: {viewerCount}
//           </div>
//         </div>
//       </div>

//       {isStreaming && (
//         <div className="w-full md:w-80 flex flex-col">
//           <div className="bg-gray-100 p-4 rounded-lg mb-4">
//             <h3 className="font-bold mb-2">Viewers</h3>
//             <ul>
//               {viewers.map((viewer) => (
//                 <li key={viewer.id} className="text-sm">
//                   {viewer.name}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col">
//             <div className="p-4 border-b">
//               <h3 className="font-bold">Live Chat</h3>
//             </div>

//             <div
//               ref={chatContainerRef}
//               className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]"
//             >
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`p-2 rounded-lg ${
//                     msg.type === "system"
//                       ? "bg-gray-100 text-center text-sm"
//                       : msg.isVendor
//                       ? "bg-blue-100 ml-auto"
//                       : "bg-gray-100"
//                   } max-w-[80%]`}
//                 >
//                   {msg.type !== "system" && (
//                     <div className="text-xs font-bold mb-1">{msg.sender}</div>
//                   )}
//                   <div className="break-words">{msg.message}</div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {new Date(msg.timestamp).toLocaleTimeString()}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <form onSubmit={sendMessage} className="p-4 border-t">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 px-3 py-2 border rounded-lg"
//                 />
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                 >
//                   Send
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
