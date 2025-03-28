// src/Components/Authentication/Login.js
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

// Styles
import {
  tailPrimaryBackgroundColor,
  tailPrimaryBorderColor,
  tailPrimaryColor,
} from "../../Styles/Color";
import "../../Styles/Auth.css";

import { useToast } from "../Resources/Toast";
import axios from "axios";
import { USER_REGISTER } from "../../api/ApiDetails";
import GoogleAuth from "./GoogleAuth";
import { useTheme } from "../Store/ThemeContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Register = ({ inputData, setInputData }) => {
  const showToast = useToast();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isPasswordView, setIsPasswordView] = useState(false);
  const handleAuthLoginInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const handlePhoneChange = (value) => {
    setInputData((prevState) => ({
      ...prevState,
      mobile_number: value,
    }));
  };
  const handleCLickViewPassword = () => {
    setIsPasswordView(!isPasswordView);
  };
  const handleAuthLoginButton = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data = {
      userName: inputData.name,
      mobile_number: inputData.mobile_number,
      userEmail: inputData.email,
      password: inputData.password,
    };
    await axios
      .post(USER_REGISTER, data)
      .then((res) => {
        if (res.data.status) {
          setLoading(false);
          localStorage.setItem("user", JSON.stringify(res.data.data));
          setTheme(res.data.data.configuration.theme);
          showToast("Login Successful", "success");
          setInputData({
            email: "",
            password: "",
            name: "",
            mobile_number: "",
          });
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
  if (
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user"))
  ) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="flex justify-center items-center absolute right-[10vw] top-[8vh] z-3">
      <div className="lg:h-[85vh] lg:w-[33vw] md:h-[65vh] md:w-[55vw] h-[55vh] w-[85vw] bg-white rounded-3xl px-10 py-6 shadow-lg flex flex-col justify-between items-start border">
        <h2 className="text-black lg:text-4xl md:text-wl text-lg font-medium text-center m-0">
          Sign Up
        </h2>
        <p className="text-xs m-0">
          Already Have An Account ?{" "}
          <Link to="/auth/login" className={`${tailPrimaryColor}`}>
            login
          </Link>
        </p>
        <div className="flex w-[100%] items-center justify-evenly">
          <hr className={`border w-[30%] ${tailPrimaryBorderColor}`} />
          <p className="text-xs">Or Sign Up with Email</p>
          <hr className={`border w-[30%] ${tailPrimaryBorderColor}`} />
        </div>

        <form
          action=""
          onSubmit={handleAuthLoginButton}
          className="flex flex-col justify-between items-center h-[65%] w-full"
        >
          <input
            type="text"
            placeholder="Enter your Name"
            className="border-2 lg:w-[100%] shadow-lg w-[95%] px-3 rounded-lg py-3 text-sm lg:text-md font-medium login-input"
            name="name"
            id="name"
            value={inputData.name}
            onChange={handleAuthLoginInputChange}
          />
          <input
            type="email"
            placeholder="Enter your Email"
            className="border-2 lg:w-[100%] w-[95%] shadow-lg px-3 rounded-lg py-3 text-sm lg:text-md font-semibold login-input"
            name="email"
            id="email"
            value={inputData.email}
            onChange={handleAuthLoginInputChange}
          />
          <div className="relative lg:w-[100%] w-[95%]">
            <input
              type={`${isPasswordView ? "text" : "password"}`}
              placeholder="Enter your password"
              className="border-2 w-full px-3 shadow-lg rounded-lg py-3 text-sm lg:text-md font-semibold login-input"
              name="password"
              id="password"
              value={inputData.password}
              onChange={handleAuthLoginInputChange}
            />
            <i
              className={`fa-solid ${
                isPasswordView ? "fa-eye" : "fa-eye-slash"
              } absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer ${tailPrimaryColor}`}
              onClick={handleCLickViewPassword}
            ></i>
          </div>
          <PhoneInput
            country={"in"}
            placeholder="Enter your number"
            name="mobile_number"
            id="mobile_number"
            value={inputData.mobile_number}
            onChange={handlePhoneChange}
            inputProps={{
              name: "mobile_number",
              required: true,
              className:
                "px-12 border-2 lg:w-[100%] w-[95%] rounded-lg shadow-lg py-3 text-sm lg:text-md font-semibold login-input",
            }}
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
              Sign Up
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
