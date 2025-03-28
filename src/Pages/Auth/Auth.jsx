// src/Components/Authentication/Login.js
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

// Styles
import { tailPrimaryColor } from "../../Styles/Color";
import Login from "../../Components/Authentication/Login";
import Register from "../../Components/Authentication/Register";
import ForgotPass from "../../Components/Authentication/ForgotPass";
import ResetPass from "../../Components/Authentication/ResetPass";

const Auth = () => {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_number: "",
    profile: "",
  });

  return (
    <div className={`h-screen w-screen relative bg-[#040404]`}>
      <div className="">
        <Routes>
          <Route
            path="/login"
            element={
              <Login inputData={inputData} setInputData={setInputData} />
            }
          />
          {/* <Route
            path="/register"
            element={
              <Register inputData={inputData} setInputData={setInputData} />
            }
          /> */}
          {/* <Route path="/forgotPassword" element={<ForgotPass />} />
      <Route path="/resetPassword" element={<ResetPass />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default Auth;
