// // src/components/Live.js
// import React, { useRef, useEffect } from 'react';
// import Hls from 'hls.js';

// const Live = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     const hls = new Hls();

//     // hls.loadSource('http://localhost:5000/hls/stream.m3u8');
//     hls.attachMedia(video);

//     return () => {
//       hls.destroy();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Live Stream</h1>
//       <video ref={videoRef} controls autoPlay />
//     </div>
//   );
// };

// export default Live;