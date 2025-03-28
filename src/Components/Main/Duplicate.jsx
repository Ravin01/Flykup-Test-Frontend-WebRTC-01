// import React, { useRef, useState } from "react";
// import { useEffect } from "react";

// export default function Dashboard() {
//   const localVideoRef = useRef(null);
//   const [isLiveStarted, setIsLiveStarted] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const handleClickToStartLive = async () => {
//     if (isLiveStarted) {
//       // Stop live stream
//       if (peerConnection) peerConnection.close();
//       if (socket) socket.close();
//       setPeerConnection(null);
//       setSocket(null);

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = null; // Clear video
//       }

//       // Stop all media tracks to fully stop the camera and microphone
//       if (mediaStream) {
//         mediaStream.getTracks().forEach((track) => track.stop());
//         setMediaStream(null); // Clear mediaStream state
//       }

//       setIsLiveStarted(false);
//     } else {
//       try {
//         const newMediaStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = newMediaStream; // Show local stream
//         }

//         setMediaStream(newMediaStream);

//         // Create WebSocket connection
//         // const ws = new WebSocket("ws://localhost:7080");
//         const ws = new WebSocket("wss://env-8100633.cloudjiffy.net/");
//         setSocket(ws);

//         // Create a new WebRTC PeerConnection
//         const pc = new RTCPeerConnection();
//         setPeerConnection(pc);

//         // Add media tracks to the PeerConnection
//         newMediaStream
//           .getTracks()
//           .forEach((track) => pc.addTrack(track, newMediaStream));

//         // Handle ICE candidates
//         pc.onicecandidate = (event) => {
//           if (event.candidate) {
//             ws.send(
//               JSON.stringify({
//                 type: "ice-candidate",
//                 candidate: event.candidate,
//               })
//             );
//           }
//         };

//         // Create and send an offer
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         ws.send(JSON.stringify({ type: "offer", offer }));

//         // Handle messages from the server
//         ws.onmessage = async (event) => {
//           const data = JSON.parse(event.data);

//           if (data.type === "answer") {
//             await pc.setRemoteDescription(
//               new RTCSessionDescription(data.answer)
//             );
//           } else if (data.type === "ice-candidate") {
//             await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//           } else if (data.type === "chat") {
//             setMessages((prevMessages) => [
//               ...prevMessages,
//               `${data.user}: ${data.message}`,
//             ]);
//           }
//         };

//         setIsLiveStarted(true);
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//       }
//     }
//   };

//   const handleSendMessage = () => {
//     if (message && socket) {
//       socket.send(
//         JSON.stringify({
//           type: "chat",
//           user: "Vendor", // You can change this to a dynamic username
//           message: message,
//         })
//       );
//       // setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
//       setMessage("");
//     }
//   };

//   useEffect(() => {
//     // const ws = new WebSocket("ws://localhost:7080");
//     // const ws = new WebSocket("wss://test-flykup-backend.vercel.app/");
//     const ws = new WebSocket("wss://env-8100633.cloudjiffy.net/");
//     setSocket(ws);

//     ws.onopen = () => {
//       ws.send(
//         JSON.stringify({
//           type: "register",
//           username: "Vendor", // Use a fixed or dynamic username for the vendor
//         })
//       );
//     };

//     ws.onmessage = async (event) => {
//       const data = JSON.parse(event.data);
//       console.log('data', data)
//       if (data.type === "chat") {
//         const sender = data.user === "Vendor" ? "You" : data.user; // Show "You" if the sender is the vendor
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           `${sender}: ${data.message}`,
//         ]);
//       } else if (data.type === "system") {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           `System: ${data.message}`,
//         ]);
//       }
//     };

//     return () => ws.close();
//   }, []);

//   return (
//     <div className="bg-gray-300 h-full w-full rounded-md flex flex-col items-center justify-center p-4">
//       <h1 className="text-xl font-bold mb-4">Live Streaming</h1>
//       <video
//         ref={localVideoRef}
//         autoPlay
//         controls
//         className="rounded-md shadow-lg"
//       />
//       <p className="text-gray-600 mt-2">
//         {isLiveStarted
//           ? "Your live camera feed is active."
//           : "Click the button to start your live stream."}
//       </p>
//       <button
//         className={`px-4 py-2 rounded ${
//           isLiveStarted ? "bg-red-500" : "bg-green-500"
//         } text-white`}
//         onClick={handleClickToStartLive}
//       >
//         {isLiveStarted ? "Stop Live" : "Start Live"}
//       </button>

//       {/* Chat Section */}
//       <div className="mt-4 w-full">
//         <div className="bg-white p-4 h-40 overflow-y-auto rounded-md shadow-lg">
//           {messages.map((msg, idx) => (
//             <p
//               key={idx}
//               className={`text-gray-800 ${
//                 msg.startsWith("System:") ? "italic text-gray-500" : ""
//               }`}
//             >
//               {msg}
//             </p>
//           ))}
//         </div>

//         <div className="flex mt-2">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-grow p-2 border rounded-l-md"
//             placeholder="Type your message"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }













// import React, { useRef, useEffect, useState } from "react";

// export default function Live() {
//   const remoteVideoRef = useRef(null);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket("wss://env-8100633.cloudjiffy.net/");
//     setSocket(ws);
//     const pc = new RTCPeerConnection();

//     // Add the remote stream to the video element
//     pc.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     // Handle ICE candidates
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         ws.send(
//           JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
//         );
//       }
//     };

//     // Handle messages from the server
//     ws.onmessage = async (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "offer") {
//         await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         ws.send(JSON.stringify({ type: "answer", answer }));
//       } else if (data.type === "ice-candidate") {
//         await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//       } else if (data.type === "chat") {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           `${data.user}: ${data.message}`,
//         ]);
//       }
//     };

//     return () => {
//       pc.close();
//       ws.close();
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (message && socket) {
//       socket.send(
//         JSON.stringify({
//           type: "chat",
//           user: "User", // You can change this to a dynamic username
//           message: message,
//         })
//       );
//     //   setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
//       setMessage("");
//     }
//   };

//   useEffect(() => {
//     const ws = new WebSocket("wss://env-8100633.cloudjiffy.net/");
//     setSocket(ws);
//     ws.onopen = () => {
//       const username = prompt("Enter your username:");
//       ws.send(
//         JSON.stringify({
//           type: "register",
//           username: username || `User${Math.floor(Math.random() * 1000)}`,
//         })
//       );
//     };

//     ws.onmessage = async (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "chat") {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           `${data.user}: ${data.message}`,
//         ]);
//       } else if (data.type === "system") {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           `System: ${data.message}`,
//         ]);
//       }
//     };

//     return () => ws.close();
//   }, []);

//   return (
//     <div className="bg-gray-300 h-full w-full rounded-md flex flex-col items-center justify-center p-4">
//       <h1 className="text-xl font-bold mb-4">Live Stream Viewer</h1>
//       <video
//         ref={remoteVideoRef}
//         autoPlay
//         controls
//         className="rounded-md shadow-lg"
//       />

//       {/* Chat Section */}
//       <div className="mt-4 w-full">
//         <div className="bg-white p-4 h-40 overflow-y-auto rounded-md shadow-lg">
//           {messages.map((msg, idx) => (
//             <p
//               key={idx}
//               className={`text-gray-800 ${
//                 msg.startsWith("System:") ? "italic text-gray-500" : ""
//               }`}
//             >
//               {msg}
//             </p>
//           ))}
//         </div>
//       </div>
//       <div className="flex mt-2">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-grow p-2 border rounded-l-md"
//           placeholder="Type your message"
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
