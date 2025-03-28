// src/Components/Authentication/Login.js
import React, { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

// Styles
import { tailPrimaryBackgroundColor } from "../../Styles/Color";
import "../../Styles/Auth.css";

import { useToast } from "../Resources/Toast";
import axios from "axios";
import { USER_RESET_PASSWORD } from "../../api/ApiDetails";

const ResetPass = () => {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState({
    password1: "",
    password2: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  const verifyToken = searchParams.get("verify");

  const handleAuthLoginButton = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password.password1 !== password.password2) {
      setLoading(false)
      return showToast("Password do not match", "error");
    }
    let data = {
      password: password.password1,
      verifyToken,
    };
    await axios
      .post(USER_RESET_PASSWORD, data)
      .then((res) => {
        if (res.data.status) {
          setLoading(false);
          showToast("Password reset successfully", "success");
          setPassword({
            password1 : '',
            password2 : ''
          });
          navigate("/auth/login");
        } else {
          setLoading(false);
          showToast(res.data.data, "error");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        showToast(err.response.data.data, "error");
      });
  };

  return (
    <div className="flex justify-center items-center absolute right-[10vw] top-[20vh] z-3">
      <div className="lg:h-[55vh] lg:w-[33vw] md:h-[65vh] md:w-[55vw] h-[55vh] w-[85vw] py-12 bg-white rounded-3xl px-10 shadow-lg flex flex-col justify-between items-start border">
        <h2 className="text-black lg:text-4xl md:text-wl text-lg font-medium text-center m-0">
          Reset Password
        </h2>
        <form
          action=""
          onSubmit={handleAuthLoginButton}
          className="flex flex-col justify-between items-start h-[75%] w-full "
        >
          <input
            type="password"
            placeholder="Enter your password"
            className="border-2 lg:w-[100%] w-[95%] shadow-lg px-3 rounded-lg py-3 text-sm lg:text-md font-semibold login-input"
            name="password1"
            id="password1"
            value={password.password1}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Conform password"
            className="border-2 lg:w-[100%] w-[95%] shadow-lg px-3 rounded-lg py-3 text-sm lg:text-md font-semibold login-input"
            name="password2"
            id="password2"
            value={password.password2}
            onChange={handleInputChange}
          />
          {loading ? (
            <button
              type="submit"
              className={`w-[100%] ${tailPrimaryBackgroundColor} py-3 shadow-lg rounded-lg text-lg font-semibold text-white flex justify-center items-center`}
            >
              <div className="login-loader"></div>
            </button>
          ) : (
            <button
              type="submit"
              className={`w-[100%] ${tailPrimaryBackgroundColor} py-3 shadow-lg rounded-lg text-lg font-semibold text-white`}
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
