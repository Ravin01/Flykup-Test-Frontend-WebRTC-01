// import { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// export const ViewerStream = ({ viewerName }) => {
//   const [availableVendors, setAvailableVendors] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentVendor, setCurrentVendor] = useState(null);
//   const remoteVideoRef = useRef();
//   const socketRef = useRef();
//   const peerConnectionRef = useRef();
//   const chatContainerRef = useRef(null);

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
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
//       },
//     ],
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     socketRef.current = io("https://test-flykup-backend.onrender.com/");
//     // socketRef.current = io("http://localhost:8000");

//     socketRef.current.emit("get-vendors");

//     socketRef.current.on("vendor-list", (vendors) => {
//       setAvailableVendors(vendors);
//     });

//     socketRef.current.on("chat-message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     socketRef.current.on("stream-ended", ({ vendorId }) => {
//       if (currentVendor?.vendorId === vendorId) {
//         setCurrentVendor(null);
//         setMessages([]);
//         if (peerConnectionRef.current) {
//           peerConnectionRef.current.close();
//         }
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = null;
//         }
//       }
//     });

//     // In ViewerStream.js
//     socketRef.current.on("stream-offer", async ({ offer, vendorId }) => {
//       try {
//         console.log("Received stream offer from vendor");

//         // Create new peer connection
//         const peerConnection = new RTCPeerConnection(configuration);
//         peerConnectionRef.current = peerConnection;

//         // IMPORTANT: Handle incoming tracks
//         peerConnection.ontrack = (event) => {
//           console.log("Received track:", event.track.kind);
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }
//         };

//         // Handle ICE candidates
//         peerConnection.onicecandidate = (event) => {
//           if (event.candidate) {
//             console.log("Sending ICE candidate to vendor");
//             socketRef.current.emit("ice-candidate", {
//               candidate: event.candidate,
//               vendorId,
//               viewerId: socketRef.current.id,
//             });
//           }
//         };

//         // Set the remote description (vendor's offer)
//         await peerConnection.setRemoteDescription(
//           new RTCSessionDescription(offer)
//         );

//         // Create and send answer
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);

//         socketRef.current.emit("stream-answer", {
//           answer,
//           vendorId,
//           viewerId: socketRef.current.id,
//         });
//       } catch (error) {
//         console.error("Error handling offer:", error);
//       }
//     });

//     socketRef.current.on("ice-candidate", async ({ candidate }) => {
//       try {
//         await peerConnectionRef.current?.addIceCandidate(
//           new RTCIceCandidate(candidate)
//         );
//       } catch (error) {
//         console.error("Error adding ICE candidate:", error);
//       }
//     });

//     return () => {
//       if (peerConnectionRef.current) {
//         peerConnectionRef.current.close();
//       }
//       socketRef.current.disconnect();
//     };
//   }, []);

//   const connectToVendor = (vendor) => {
//     setCurrentVendor(vendor);
//     setMessages([]);
//     socketRef.current.emit("viewer-request", {
//       vendorId: vendor.vendorId,
//       viewerName,
//     });
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() && currentVendor) {
//       socketRef.current.emit("chat-message", {
//         vendorId: currentVendor.vendorId,
//         message: newMessage,
//         sender: viewerName,
//         isVendor: false,
//         timestamp: new Date().toISOString(),
//       });
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="p-4 flex flex-col md:flex-row gap-4">
//       <div className="flex-1">
//         <div className="relative">
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full rounded-lg shadow-lg"
//           />
//         </div>

//         <div className="mt-4">
//           <h3 className="font-bold mb-2">Available Streams</h3>
//           <div className="flex flex-wrap gap-2">
//             {availableVendors.map((vendor) => (
//               <button
//                 key={vendor.vendorId}
//                 onClick={() => connectToVendor(vendor)}
//                 className={`px-4 py-2 rounded-lg ${
//                   currentVendor?.vendorId === vendor.vendorId
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {vendor.vendorName}'s Stream ({vendor.viewerCount} viewers)
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {currentVendor && (
//         <div className="w-full md:w-80">
//           <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
//             <div className="p-4 border-b">
//               <h3 className="font-bold">
//                 Live Chat with {currentVendor.vendorName}
//               </h3>
//             </div>

//             <div
//               ref={chatContainerRef}
//               className="flex-1 p-4 space-y-4 overflow-y-auto"
//             >
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`p-2 rounded-lg ${
//                     msg.type === "system"
//                       ? "bg-gray-100 text-center text-sm"
//                       : msg.isVendor
//                       ? "bg-blue-100"
//                       : msg.sender === viewerName
//                       ? "bg-green-100 ml-auto"
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
