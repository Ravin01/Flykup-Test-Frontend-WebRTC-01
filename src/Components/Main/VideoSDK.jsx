import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import {Vendor} from "../Reuse/Video/Vendor";
import { Viewer } from "../Reuse/Video/Viewer";
import { Video_Token } from "../../config";

// Test token - DO NOT USE IN PRODUCTION
const AUTH_TOKEN = Video_Token;

export const VideoSDK = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(null);
  const [error, setError] = useState(null);

  const createMeeting = async () => {
    try {
      const response = await axios.post(
        "https://api.videosdk.live/v2/rooms",
        {},
        {
          headers: {
            authorization: AUTH_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      
      return response.data.roomId;
    } catch (error) {
      console.error("Error creating meeting:", error);
      setError(`Failed to create meeting: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    const initializeRoom = async () => {
      const newRoomId = await createMeeting();
      if (newRoomId) {
        setRoomId(newRoomId);
        navigate("/vendor");
      }
    };

    initializeRoom();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!roomId) {
    return <div className="text-center p-4">Creating meeting room...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/vendor" className="text-blue-500 hover:text-blue-700">
              Start Streaming
            </Link>
          </li>
          <li>
            <Link to="/viewer" className="text-blue-500 hover:text-blue-700">
              Join Stream
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Room ID: {roomId}</p>
        <p className="text-sm text-gray-600">Using test token for development</p>
      </div>

      <Routes>
        <Route path="/vendor" element={<Vendor roomId={roomId} authToken={AUTH_TOKEN} />} />
        <Route path="/viewer" element={<Viewer roomId={roomId} authToken={AUTH_TOKEN} />} />
      </Routes>
    </div>
  );
};