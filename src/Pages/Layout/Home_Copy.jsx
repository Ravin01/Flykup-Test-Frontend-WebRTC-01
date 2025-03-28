import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "../../Styles/Home.css";
// import LiveStream from "../../Components/Main/LiveStream";
// import PlayLive from "../../Components/Main/PlayLive";
// import Live from "../../Components/Main/Live";
// import Dashboard from "../../Components/Main/Dashboard";
// import { VendorStream } from "../../Components/Main/DuplicateVendorPlay";
// import { VendorStream } from "../../Components/Main/Vendor";
// import { ViewerStream } from "../../Components/Main/Viewer";
// import VendorStream from "../../Components/Main/Vendor";
// import ViewerStream from "../../Components/Main/Viewer";
// import Vendor from "../../Components/Main/Vendor";
// import Viewer from "../../Components/Main/Viewer";
// import { VendorStream } from "../../Components/Main/VendorStream";
// import { ViewerStream } from "../../Components/Main/ViewerStream";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, []);

  return (
    <div className="h-screen w-screen rounded-2xl">
      {/* Sidebar */}
      {/* <div className={`home-sideNav-container ${
          isSideNavOpen ? "home-sideNav-container-open" : ""
        }`}>
        <SideNav toggleSideNav={toggleSideNav}/>
      </div> */}

      {/* Main Content */}

      <div className="w-full flex justify-evenly">
        <Link to={"/dashboard"}>Vendor</Link>
        <Link to={"/live"}>Viewer</Link>
      </div>
      <div
        className={`home-main-container bg-[#F4F6F7] w-full py-3 px-3 h-[100vh] overflow-y-auto`}
      >
        <Routes>
          <Route path="/dashboard" element={<VendorStream vendorId='123' vendorName={`Vendor${Math.floor(Math.random() * 1000)}`} />} />
          <Route path="/live" element={<ViewerStream viewerName={`User${Math.floor(Math.random() * 1000)}`} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
